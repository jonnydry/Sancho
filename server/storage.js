import { users, pinnedItems } from "../shared/schema.js";
import { db } from "./db.js";
import { eq, and, desc } from "drizzle-orm";

// Helper function to handle database errors
function handleDatabaseError(error, operation) {
  console.error(`Database error in ${operation}:`, error);
  
  // Connection errors
  if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
    const dbError = new Error('Database connection failed');
    dbError.code = 'DB_CONNECTION_ERROR';
    dbError.originalError = error;
    throw dbError;
  }
  
  // Query timeout
  if (error.code === 'ETIMEDOUT' || error.message?.includes('timeout')) {
    const dbError = new Error('Database query timeout');
    dbError.code = 'DB_TIMEOUT';
    dbError.originalError = error;
    throw dbError;
  }
  
  // Re-throw with original error for other cases
  throw error;
}

export class DatabaseStorage {
  // User operations - required for Replit Auth
  async getUser(id) {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user;
    } catch (error) {
      handleDatabaseError(error, 'getUser');
    }
  }

  async upsertUser(userData) {
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
      return user;
    } catch (error) {
      handleDatabaseError(error, 'upsertUser');
    }
  }

  // Pinned items operations
  async getPinnedItems(userId) {
    try {
      const items = await db
        .select()
        .from(pinnedItems)
        .where(eq(pinnedItems.userId, userId))
        .orderBy(desc(pinnedItems.createdAt));
      return items.map(item => ({
        ...item,
        itemData: typeof item.itemData === 'string' ? JSON.parse(item.itemData) : item.itemData,
      }));
    } catch (error) {
      handleDatabaseError(error, 'getPinnedItems');
    }
  }

  async pinItem(userId, itemData) {
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
      
      return {
        ...pinned,
        itemData: typeof pinned.itemData === 'string' ? JSON.parse(pinned.itemData) : pinned.itemData,
      };
    } catch (error) {
      // Handle unique constraint violations (item already exists)
      if (error?.code === '23505') {
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

  async getPinnedItem(userId, itemName) {
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

  async unpinItem(userId, itemName) {
    try {
      const [unpinned] = await db
        .delete(pinnedItems)
        .where(and(
          eq(pinnedItems.userId, userId),
          eq(pinnedItems.itemName, itemName)
        ))
        .returning();
      return unpinned;
    } catch (error) {
      handleDatabaseError(error, 'unpinItem');
    }
  }

  async isItemPinned(userId, itemName) {
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
}

export const storage = new DatabaseStorage();
