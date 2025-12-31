import { users, pinnedItems, journalEntries } from "../shared/schema.js";
import { db } from "./db.js";
import { eq, and, desc } from "drizzle-orm";
import { InferSelectModel } from "drizzle-orm";

type User = InferSelectModel<typeof users>;
type PinnedItem = InferSelectModel<typeof pinnedItems>;

// Simple in-memory cache with TTL for frequently accessed data
interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

class SimpleCache<T = any> {
  private cache: Map<string, CacheEntry<T>>;
  private maxSize: number;

  constructor() {
    this.cache = new Map();
    this.maxSize = 1000; // Prevent unbounded memory growth
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  set(key: string, value: T, ttlMs: number): void {
    // Prevent cache from growing too large
    if (this.cache.size >= this.maxSize) {
      // Remove oldest entry (simple FIFO)
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }
    
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
    });
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Invalidate all entries matching a pattern (for user-specific caches)
  invalidatePattern(pattern: RegExp): void {
    for (const key of this.cache.keys()) {
      if (pattern.test(key)) {
        this.cache.delete(key);
      }
    }
  }
}

// Cache instances with different TTLs
const userCache = new SimpleCache<User | null>();
const pinnedItemsCache = new SimpleCache<PinnedItem[]>();

// Cache TTLs
const USER_CACHE_TTL = 10 * 1000; // 10 seconds
const PINNED_ITEMS_CACHE_TTL = 5 * 1000; // 5 seconds

// Custom database error interface
interface DatabaseError extends Error {
  code?: string;
  cause?: unknown;
}

// Helper function to handle database errors - always throws
function handleDatabaseError(error: unknown, operation: string): never {
  console.error(`Database error in ${operation}:`, error);

  const err = error as { code?: string; message?: string; stack?: string };

  // Connection errors
  if (err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT') {
    const dbError: DatabaseError = new Error('Database connection failed');
    dbError.code = 'DB_CONNECTION_ERROR';
    dbError.cause = error;
    if (err.stack) dbError.stack = err.stack;
    throw dbError;
  }

  // Query timeout
  if (err.code === 'ETIMEDOUT' || err.message?.includes('timeout')) {
    const dbError: DatabaseError = new Error('Database query timeout');
    dbError.code = 'DB_TIMEOUT';
    dbError.cause = error;
    if (err.stack) dbError.stack = err.stack;
    throw dbError;
  }

  // Re-throw with original error for other cases
  throw error;
}

export class DatabaseStorage {
  // User operations - required for Replit Auth
  async getUser(id: string): Promise<User | undefined> {
    // Check cache first
    const cacheKey = `user:${id}`;
    const cached = userCache.get(cacheKey);
    if (cached !== null) {
      return cached;
    }

    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      // Cache the result (including null for non-existent users to avoid repeated queries)
      userCache.set(cacheKey, user, USER_CACHE_TTL);
      return user;
    } catch (error) {
      handleDatabaseError(error, 'getUser');
    }
  }

  async upsertUser(userData: UserInsert): Promise<User> {
    try {
      const [user] = await db
        .insert(users)
        .values(userData)
        .onConflictDoUpdate({
          target: users.id,
          set: {
            ...userData,
            updatedAt: new Date(),
          },
        })
        .returning();
      
      // Invalidate user cache after update
      if (userData.id) {
        userCache.delete(`user:${userData.id}`);
      }
      
      return user;
    } catch (error) {
      handleDatabaseError(error, 'upsertUser');
    }
  }

  // Pinned items operations
  async getPinnedItems(userId: string, options: { limit?: number; offset?: number } = {}): Promise<PinnedItem[]> {
    const { limit = 100, offset = 0 } = options;

    // Check cache first (only for non-paginated requests)
    const cacheKey = `pinned:${userId}`;
    if (!options.limit && !options.offset) {
      const cached = pinnedItemsCache.get(cacheKey);
      if (cached !== null) {
        return cached;
      }
    }

    try {
      // Build query with pagination applied directly to avoid TypeScript chaining issues
      const items = await db
        .select()
        .from(pinnedItems)
        .where(eq(pinnedItems.userId, userId))
        .orderBy(desc(pinnedItems.createdAt))
        .limit(limit)
        .offset(offset);
      const processedItems = items.map(item => ({
        ...item,
        itemData: typeof item.itemData === 'string' ? JSON.parse(item.itemData) : item.itemData,
      }));

      // Cache the result (only for non-paginated requests)
      if (!options.limit && !options.offset) {
        pinnedItemsCache.set(cacheKey, processedItems, PINNED_ITEMS_CACHE_TTL);
      }
      return processedItems;
    } catch (error) {
      handleDatabaseError(error, 'getPinnedItems');
    }
  }

  async pinItem(userId: string, itemData: any): Promise<PinnedItem> {
    // First check if already pinned, if so just return existing item directly
    const existingItem = await this.getPinnedItem(userId, itemData.name);
    if (existingItem) {
      return existingItem;
    }

    try {
      const [pinned] = await db
        .insert(pinnedItems)
        .values({
          userId,
          itemName: itemData.name,
          itemData: itemData,
        })
        .returning();
      
      if (!pinned) {
        throw new Error('Failed to insert pinned item: no item returned from database');
      }
      
      // Invalidate pinned items cache for this user
      pinnedItemsCache.delete(`pinned:${userId}`);
      
      return {
        ...pinned,
        itemData: typeof pinned.itemData === 'string' ? JSON.parse(pinned.itemData) : pinned.itemData,
      };
    } catch (error) {
      // Handle unique constraint violations (item already exists)
      const dbErr = error as { code?: string };
      if (dbErr?.code === '23505') {
        // Race condition: item was pinned between check and insert
        const existingItem = await this.getPinnedItem(userId, itemData.name);
        if (existingItem) {
          return existingItem;
        }
        throw new Error('Item is already pinned');
      }
      // Re-throw other errors with more context
      console.error('Database error in pinItem:', error);
      throw error;
    }
  }

  async getPinnedItem(userId: string, itemName: string): Promise<PinnedItem | null> {
    try {
      const [item] = await db
        .select()
        .from(pinnedItems)
        .where(and(
          eq(pinnedItems.userId, userId),
          eq(pinnedItems.itemName, itemName)
        ))
        .limit(1);
      
      if (!item) {
        return null;
      }
      
      return {
        ...item,
        itemData: typeof item.itemData === 'string' ? JSON.parse(item.itemData) : item.itemData,
      };
    } catch (error) {
      handleDatabaseError(error, 'getPinnedItem');
    }
  }

  async unpinItem(userId: string, itemName: string): Promise<PinnedItem | undefined> {
    try {
      const [unpinned] = await db
        .delete(pinnedItems)
        .where(and(
          eq(pinnedItems.userId, userId),
          eq(pinnedItems.itemName, itemName)
        ))
        .returning();
      
      // Invalidate pinned items cache for this user
      pinnedItemsCache.delete(`pinned:${userId}`);
      
      return unpinned;
    } catch (error) {
      handleDatabaseError(error, 'unpinItem');
    }
  }

  async isItemPinned(userId: string, itemName: string): Promise<boolean> {
    try {
      const [item] = await db
        .select()
        .from(pinnedItems)
        .where(and(
          eq(pinnedItems.userId, userId),
          eq(pinnedItems.itemName, itemName)
        ))
        .limit(1);
      return !!item;
    } catch (error) {
      handleDatabaseError(error, 'isItemPinned');
    }
  }

  // Delete user account and all associated data
  async deleteUser(userId: string): Promise<User | undefined> {
    try {
      // First delete all pinned items for this user
      await db
        .delete(pinnedItems)
        .where(eq(pinnedItems.userId, userId));

      // Delete all journal entries for this user
      await db
        .delete(journalEntries)
        .where(eq(journalEntries.userId, userId));

      // Then delete the user record
      const [deletedUser] = await db
        .delete(users)
        .where(eq(users.id, userId))
        .returning();

      // Clear all caches for this user
      userCache.delete(`user:${userId}`);
      pinnedItemsCache.delete(`pinned:${userId}`);

      return deletedUser;
    } catch (error) {
      handleDatabaseError(error, 'deleteUser');
    }
  }

  // Journal entries operations
  async getJournalEntries(userId: string, options: { limit?: number; offset?: number; orderBy?: string; order?: string } = {}) {
    const { limit = 100, offset = 0, orderBy = 'createdAt', order = 'desc' } = options;

    try {
      // Build query with all options applied directly to avoid TypeScript chaining issues
      const orderColumn = orderBy === 'updatedAt' ? journalEntries.updatedAt : journalEntries.createdAt;
      const entries = await db
        .select()
        .from(journalEntries)
        .where(eq(journalEntries.userId, userId))
        .orderBy(order === 'asc' ? orderColumn : desc(orderColumn))
        .limit(limit)
        .offset(offset);
      return entries.map(entry => ({
        id: entry.id,
        title: entry.title || '',
        content: entry.content || '',
        templateRef: entry.templateRef,
        tags: entry.tags || [],
        isStarred: entry.isStarred === 'true',
        createdAt: entry.createdAt ? new Date(entry.createdAt).getTime() : Date.now(),
        updatedAt: entry.updatedAt ? new Date(entry.updatedAt).getTime() : Date.now(),
      }));
    } catch (error) {
      handleDatabaseError(error, 'getJournalEntries');
    }
  }

  async getJournalEntry(userId: string, entryId: string) {
    try {
      const [entry] = await db
        .select()
        .from(journalEntries)
        .where(and(
          eq(journalEntries.userId, userId),
          eq(journalEntries.id, entryId)
        ))
        .limit(1);
      
      if (!entry) return null;
      
      return {
        id: entry.id,
        title: entry.title || '',
        content: entry.content || '',
        templateRef: entry.templateRef,
        tags: entry.tags || [],
        isStarred: entry.isStarred === 'true',
        createdAt: entry.createdAt ? new Date(entry.createdAt).getTime() : Date.now(),
        updatedAt: entry.updatedAt ? new Date(entry.updatedAt).getTime() : Date.now(),
      };
    } catch (error) {
      handleDatabaseError(error, 'getJournalEntry');
    }
  }

  async createJournalEntry(userId: string, entryData: { id: string; title?: string; content?: string; templateRef?: string; tags?: string[]; isStarred?: boolean }) {
    try {
      const [entry] = await db
        .insert(journalEntries)
        .values({
          id: entryData.id,
          userId,
          title: entryData.title || '',
          content: entryData.content || '',
          templateRef: entryData.templateRef,
          tags: entryData.tags || [],
          isStarred: entryData.isStarred ? 'true' : 'false',
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();
      
      return {
        id: entry.id,
        title: entry.title || '',
        content: entry.content || '',
        templateRef: entry.templateRef,
        tags: entry.tags || [],
        isStarred: entry.isStarred === 'true',
        createdAt: entry.createdAt ? new Date(entry.createdAt).getTime() : Date.now(),
        updatedAt: entry.updatedAt ? new Date(entry.updatedAt).getTime() : Date.now(),
      };
    } catch (error) {
      handleDatabaseError(error, 'createJournalEntry');
    }
  }

  async updateJournalEntry(userId: string, entryId: string, updates: { title?: string; content?: string; templateRef?: string; tags?: string[]; isStarred?: boolean }) {
    try {
      const [entry] = await db
        .update(journalEntries)
        .set({
          ...(updates.title !== undefined && { title: updates.title }),
          ...(updates.content !== undefined && { content: updates.content }),
          ...(updates.templateRef !== undefined && { templateRef: updates.templateRef }),
          ...(updates.tags !== undefined && { tags: updates.tags }),
          ...(updates.isStarred !== undefined && { isStarred: updates.isStarred ? 'true' : 'false' }),
          updatedAt: new Date(),
        })
        .where(and(
          eq(journalEntries.userId, userId),
          eq(journalEntries.id, entryId)
        ))
        .returning();
      
      if (!entry) return null;
      
      return {
        id: entry.id,
        title: entry.title || '',
        content: entry.content || '',
        templateRef: entry.templateRef,
        tags: entry.tags || [],
        isStarred: entry.isStarred === 'true',
        createdAt: entry.createdAt ? new Date(entry.createdAt).getTime() : Date.now(),
        updatedAt: entry.updatedAt ? new Date(entry.updatedAt).getTime() : Date.now(),
      };
    } catch (error) {
      handleDatabaseError(error, 'updateJournalEntry');
    }
  }

  async deleteJournalEntry(userId: string, entryId: string) {
    try {
      const [deleted] = await db
        .delete(journalEntries)
        .where(and(
          eq(journalEntries.userId, userId),
          eq(journalEntries.id, entryId)
        ))
        .returning();
      
      return deleted;
    } catch (error) {
      handleDatabaseError(error, 'deleteJournalEntry');
    }
  }

  async bulkCreateJournalEntries(userId: string, entries: Array<{ id: string; title?: string; content?: string; templateRef?: string; tags?: string[]; isStarred?: boolean; createdAt?: number; updatedAt?: number }>) {
    try {
      if (!entries || entries.length === 0) return [];
      
      const values = entries.map((e) => ({
        id: e.id,
        userId,
        title: e.title || '',
        content: e.content || '',
        templateRef: e.templateRef,
        tags: e.tags || [],
        isStarred: e.isStarred ? 'true' : 'false',
        createdAt: e.createdAt ? new Date(e.createdAt) : new Date(),
        updatedAt: e.updatedAt ? new Date(e.updatedAt) : new Date(),
      }));
      
      const created = await db
        .insert(journalEntries)
        .values(values)
        .onConflictDoNothing()
        .returning();
      
      return created.map(entry => ({
        id: entry.id,
        title: entry.title || '',
        content: entry.content || '',
        templateRef: entry.templateRef,
        tags: entry.tags || [],
        isStarred: entry.isStarred === 'true',
        createdAt: entry.createdAt ? new Date(entry.createdAt).getTime() : Date.now(),
        updatedAt: entry.updatedAt ? new Date(entry.updatedAt).getTime() : Date.now(),
      }));
    } catch (error) {
      handleDatabaseError(error, 'bulkCreateJournalEntries');
    }
  }
}

export const storage = new DatabaseStorage();
