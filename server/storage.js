import { users, pinnedItems } from "../shared/schema.js";
import { db } from "./db.js";
import { eq, and, desc } from "drizzle-orm";

export class DatabaseStorage {
  // User operations - required for Replit Auth
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData) {
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
  }

  // Pinned items operations
  async getPinnedItems(userId) {
    const items = await db
      .select()
      .from(pinnedItems)
      .where(eq(pinnedItems.userId, userId))
      .orderBy(desc(pinnedItems.createdAt));
    return items.map(item => ({
      ...item,
      itemData: typeof item.itemData === 'string' ? JSON.parse(item.itemData) : item.itemData,
    }));
  }

  async pinItem(userId, itemData) {
    // First check if already pinned, if so just return existing
    const existing = await this.isItemPinned(userId, itemData.name);
    if (existing) {
      const items = await this.getPinnedItems(userId);
      return items.find(item => item.itemName === itemData.name);
    }

    const [pinned] = await db
      .insert(pinnedItems)
      .values({
        userId,
        itemName: itemData.name,
        itemData: itemData,
      })
      .returning();
    return {
      ...pinned,
      itemData: typeof pinned.itemData === 'string' ? JSON.parse(pinned.itemData) : pinned.itemData,
    };
  }

  async unpinItem(userId, itemName) {
    const [unpinned] = await db
      .delete(pinnedItems)
      .where(and(
        eq(pinnedItems.userId, userId),
        eq(pinnedItems.itemName, itemName)
      ))
      .returning();
    return unpinned;
  }

  async isItemPinned(userId, itemName) {
    const [item] = await db
      .select()
      .from(pinnedItems)
      .where(and(
        eq(pinnedItems.userId, userId),
        eq(pinnedItems.itemName, itemName)
      ))
      .limit(1);
    return !!item;
  }
}

export const storage = new DatabaseStorage();
