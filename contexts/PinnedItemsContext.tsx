import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
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
      const authError: any = new Error('Please log in to save items to your notebook');
      authError.requiresLogin = true;
      authError.code = 'NOT_AUTHENTICATED';
      throw authError;
    }

    // Validate PoetryItem structure before sending
    if (!item || typeof item !== 'object') {
      throw new Error('Invalid item: item must be an object');
    }
    if (!item.name || typeof item.name !== 'string' || item.name.trim().length === 0) {
      throw new Error('Invalid item: name is required and must be a non-empty string');
    }
    if (!item.type || !['Form', 'Meter', 'Device'].includes(item.type)) {
      throw new Error('Invalid item: type must be Form, Meter, or Device');
    }

    // Optimistic update: add item to local state if not already pinned
    const isAlreadyPinned = pinnedItems.some(pinned => pinned.name === item.name);
    if (!isAlreadyPinned) {
      setPinnedItems(prev => [...prev, item]);
    }

    try {
      if (import.meta.env.DEV) {
        console.log('Attempting to pin item:', { name: item.name, type: item.type });
      }
      const response = await fetch('/api/pinned-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ itemData: item }),
      });

      if (response.ok) {
        if (import.meta.env.DEV) {
          console.log('Successfully pinned item:', item.name);
        }
        // Refresh to ensure server state matches (handles race conditions)
        await fetchPinnedItems();
      } else {
        // Revert optimistic update on failure
        if (!isAlreadyPinned) {
          setPinnedItems(prev => prev.filter(pinned => pinned.name !== item.name));
        }
        throw new Error('Server error pinning item');
      }
    } catch (error) {
      // Revert optimistic update on any error
      if (!isAlreadyPinned) {
        setPinnedItems(prev => prev.filter(pinned => pinned.name !== item.name));
      }
      console.error('Error pinning item:', error);
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(`Failed to pin item: ${String(error)}`);
      }
    }
  }, [isAuthenticated, isAuthLoading, fetchPinnedItems, pinnedItems]);

  const unpinItem = useCallback(async (itemName: string) => {
    // Wait for auth to finish loading and ensure user is authenticated
    if (isAuthLoading || !isAuthenticated) {
      const authError: any = new Error('Please log in to remove items from your notebook');
      authError.requiresLogin = true;
      authError.code = 'NOT_AUTHENTICATED';
      throw authError;
    }

    if (!itemName || typeof itemName !== 'string' || itemName.trim().length === 0) {
      throw new Error('Invalid item name: name is required and must be a non-empty string');
    }

    // Optimistic update: remove item from local state
    const wasPinned = pinnedItems.some(item => item.name === itemName);
    if (wasPinned) {
      setPinnedItems(prev => prev.filter(item => item.name !== itemName));
    }

    try {
      if (import.meta.env.DEV) {
        console.log('Attempting to unpin item:', itemName);
      }
      const response = await fetch(`/api/pinned-items/${encodeURIComponent(itemName)}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        if (import.meta.env.DEV) {
          console.log('Successfully unpinned item:', itemName);
        }
        // Refresh to ensure server state matches
        await fetchPinnedItems();
      } else {
        // Revert optimistic update on failure
        if (wasPinned) {
          // Note: To revert, we'd need the full item data, which we don't have here
          // So instead, just refresh to restore from server
          await fetchPinnedItems();
        }
        throw new Error('Server error unpinning item');
      }
    } catch (error) {
      // Revert by refreshing from server on error
      await fetchPinnedItems();
      console.error('Error unpinning item:', error);
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(`Failed to unpin item: ${String(error)}`);
      }
    }
  }, [isAuthenticated, isAuthLoading, fetchPinnedItems, pinnedItems]);

  const isPinned = useCallback((itemName: string) => {
    return pinnedItems.some(item => item.name === itemName);
  }, [pinnedItems]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    pinnedItems,
    isLoading,
    pinItem,
    unpinItem,
    isPinned,
    refreshPinnedItems: fetchPinnedItems,
  }), [pinnedItems, isLoading, pinItem, unpinItem, isPinned, fetchPinnedItems]);

  return (
    <PinnedItemsContext.Provider value={contextValue}>
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

