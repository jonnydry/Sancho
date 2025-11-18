import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { PoetryItem } from '../types';
import { useAuth } from '../hooks/useAuth.js';

interface PinnedItemsContextType {
  pinnedItems: PoetryItem[];
  isLoading: boolean;
  pinItem: (item: PoetryItem) => Promise<void>;
  unpinItem: (itemName: string) => Promise<void>;
  isPinned: (itemName: string) => boolean;
  refreshPinnedItems: () => Promise<void>;
}

const PinnedItemsContext = createContext<PinnedItemsContextType | undefined>(undefined);

export const PinnedItemsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pinnedItems, setPinnedItems] = useState<PoetryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const fetchPinnedItems = useCallback(async () => {
    // Wait for auth to finish loading before fetching pinned items
    if (isAuthLoading) {
      return;
    }
    
    if (!isAuthenticated) {
      setPinnedItems([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/pinned-items', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setPinnedItems(data.items || []);
      } else {
        console.error('Failed to fetch pinned items');
        setPinnedItems([]);
      }
    } catch (error) {
      console.error('Error fetching pinned items:', error);
      setPinnedItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, isAuthLoading]);

  useEffect(() => {
    fetchPinnedItems();
  }, [fetchPinnedItems]);

  const pinItem = useCallback(async (item: PoetryItem) => {
    // Wait for auth to finish loading and ensure user is authenticated
    if (isAuthLoading || !isAuthenticated) {
      throw new Error('Authentication required to pin items');
    }

    try {
      const response = await fetch('/api/pinned-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ itemData: item }),
      });

      if (response.ok) {
        await fetchPinnedItems();
      } else {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || 'Failed to pin item');
      }
    } catch (error) {
      console.error('Error pinning item:', error);
      throw error;
    }
  }, [isAuthenticated, isAuthLoading, fetchPinnedItems]);

  const unpinItem = useCallback(async (itemName: string) => {
    // Wait for auth to finish loading and ensure user is authenticated
    if (isAuthLoading || !isAuthenticated) {
      throw new Error('Authentication required to unpin items');
    }

    try {
      const response = await fetch(`/api/pinned-items/${encodeURIComponent(itemName)}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        await fetchPinnedItems();
      } else {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || 'Failed to unpin item');
      }
    } catch (error) {
      console.error('Error unpinning item:', error);
      throw error;
    }
  }, [isAuthenticated, isAuthLoading, fetchPinnedItems]);

  const isPinned = useCallback((itemName: string) => {
    return pinnedItems.some(item => item.name === itemName);
  }, [pinnedItems]);

  return (
    <PinnedItemsContext.Provider
      value={{
        pinnedItems,
        isLoading,
        pinItem,
        unpinItem,
        isPinned,
        refreshPinnedItems: fetchPinnedItems,
      }}
    >
      {children}
    </PinnedItemsContext.Provider>
  );
};

export const usePinnedItems = (): PinnedItemsContextType => {
  const context = useContext(PinnedItemsContext);
  if (context === undefined) {
    throw new Error('usePinnedItems must be used within a PinnedItemsProvider');
  }
  return context;
};

