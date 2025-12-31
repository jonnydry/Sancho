import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { PoetryItem } from '../types';
import { useAuth } from '../hooks/useAuth.js';

const GUEST_PINNED_ITEMS_KEY = 'sancho_guest_pinned_items';
const GUEST_ITEM_LIMIT = 5;

interface PinnedItemsContextType {
  pinnedItems: PoetryItem[];
  isLoading: boolean;
  pinItem: (item: PoetryItem) => Promise<void>;
  unpinItem: (itemName: string) => Promise<void>;
  isPinned: (itemName: string) => boolean;
  refreshPinnedItems: () => Promise<void>;
  isGuest: boolean;
  guestLimitReached: boolean;
  guestItemLimit: number;
}

const PinnedItemsContext = createContext<PinnedItemsContextType | undefined>(undefined);

const CACHE_TTL = 30000;

function getCsrfToken(): string | null {
  const match = document.cookie.match(/(?:^|;\s*)csrf-token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

function getGuestPinnedItems(): PoetryItem[] {
  try {
    const stored = localStorage.getItem(GUEST_PINNED_ITEMS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Error reading guest pinned items from localStorage:', error);
  }
  return [];
}

function saveGuestPinnedItems(items: PoetryItem[]): void {
  try {
    localStorage.setItem(GUEST_PINNED_ITEMS_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving guest pinned items to localStorage:', error);
  }
}

export const PinnedItemsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pinnedItems, setPinnedItems] = useState<PoetryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const cacheTimestampRef = useRef<number>(0);

  const isGuest = !isAuthenticated && !isAuthLoading;
  const guestLimitReached = isGuest && pinnedItems.length >= GUEST_ITEM_LIMIT;

  const fetchPinnedItems = useCallback(async (forceRefresh = false) => {
    if (isAuthLoading) {
      return;
    }

    if (!isAuthenticated) {
      const guestItems = getGuestPinnedItems();
      setPinnedItems(guestItems);
      return;
    }

    const now = Date.now();
    const cacheAge = now - cacheTimestampRef.current;

    if (!forceRefresh && cacheAge < CACHE_TTL && pinnedItems.length > 0) {
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
        cacheTimestampRef.current = now;
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
  }, [isAuthenticated, isAuthLoading, pinnedItems.length]);

  useEffect(() => {
    fetchPinnedItems();
  }, [fetchPinnedItems]);

  useEffect(() => {
    cacheTimestampRef.current = 0;
  }, [isAuthenticated]);

  const pinItem = useCallback(async (item: PoetryItem) => {
    if (isAuthLoading) {
      throw new Error('Please wait while we check your login status');
    }

    if (!item || typeof item !== 'object') {
      throw new Error('Invalid item: item must be an object');
    }
    if (!item.name || typeof item.name !== 'string' || item.name.trim().length === 0) {
      throw new Error('Invalid item: name is required and must be a non-empty string');
    }
    if (!item.type || !['Form', 'Meter', 'Device'].includes(item.type)) {
      throw new Error('Invalid item: type must be Form, Meter, or Device');
    }

    if (!isAuthenticated) {
      const currentItems = getGuestPinnedItems();
      
      if (currentItems.some(pinned => pinned.name === item.name)) {
        return;
      }

      if (currentItems.length >= GUEST_ITEM_LIMIT) {
        const limitError: any = new Error(`You've reached the limit of ${GUEST_ITEM_LIMIT} saved items. Log in for unlimited saves!`);
        limitError.code = 'GUEST_LIMIT_REACHED';
        limitError.requiresLogin = true;
        throw limitError;
      }

      const newItems = [...currentItems, item];
      saveGuestPinnedItems(newItems);
      setPinnedItems(newItems);
      return;
    }

    let wasAlreadyPinned = false;
    setPinnedItems(prev => {
      const isAlreadyPinned = prev.some(pinned => pinned.name === item.name);
      wasAlreadyPinned = isAlreadyPinned;
      if (isAlreadyPinned) {
        return prev;
      }
      return [...prev, item];
    });

    try {
      if (import.meta.env.DEV) {
        console.log('Attempting to pin item:', { name: item.name, type: item.type });
      }
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      const csrfToken = getCsrfToken();
      if (csrfToken) {
        headers['x-csrf-token'] = csrfToken;
      }
      
      const response = await fetch('/api/pinned-items', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({ itemData: item }),
      });

      if (response.ok) {
        if (import.meta.env.DEV) {
          console.log('Successfully pinned item:', item.name);
        }
        cacheTimestampRef.current = Date.now();
      } else {
        if (!wasAlreadyPinned) {
          setPinnedItems(prev => prev.filter(pinned => pinned.name !== item.name));
        }
        throw new Error('Server error pinning item');
      }
    } catch (error) {
      if (!wasAlreadyPinned) {
        setPinnedItems(prev => prev.filter(pinned => pinned.name !== item.name));
      }
      console.error('Error pinning item:', error);
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(`Failed to pin item: ${String(error)}`);
      }
    }
  }, [isAuthenticated, isAuthLoading]);

  const unpinItem = useCallback(async (itemName: string) => {
    if (isAuthLoading) {
      throw new Error('Please wait while we check your login status');
    }

    if (!itemName || typeof itemName !== 'string' || itemName.trim().length === 0) {
      throw new Error('Invalid item name: name is required and must be a non-empty string');
    }

    if (!isAuthenticated) {
      const currentItems = getGuestPinnedItems();
      const newItems = currentItems.filter(item => item.name !== itemName);
      saveGuestPinnedItems(newItems);
      setPinnedItems(newItems);
      return;
    }

    let wasPinned = false;
    setPinnedItems(prev => {
      wasPinned = prev.some(item => item.name === itemName);
      if (!wasPinned) {
        return prev;
      }
      return prev.filter(item => item.name !== itemName);
    });

    try {
      if (import.meta.env.DEV) {
        console.log('Attempting to unpin item:', itemName);
      }
      
      const headers: Record<string, string> = {};
      const csrfToken = getCsrfToken();
      if (csrfToken) {
        headers['x-csrf-token'] = csrfToken;
      }
      
      const response = await fetch(`/api/pinned-items/${encodeURIComponent(itemName)}`, {
        method: 'DELETE',
        headers,
        credentials: 'include',
      });

      if (response.ok) {
        if (import.meta.env.DEV) {
          console.log('Successfully unpinned item:', itemName);
        }
        cacheTimestampRef.current = Date.now();
      } else {
        if (wasPinned) {
          await fetchPinnedItems(true);
        }
        throw new Error('Server error unpinning item');
      }
    } catch (error) {
      await fetchPinnedItems(true);
      console.error('Error unpinning item:', error);
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(`Failed to unpin item: ${String(error)}`);
      }
    }
  }, [isAuthenticated, isAuthLoading, fetchPinnedItems]);

  const isPinned = useCallback((itemName: string) => {
    return pinnedItems.some(item => item.name === itemName);
  }, [pinnedItems]);

  const contextValue = useMemo(() => ({
    pinnedItems,
    isLoading,
    pinItem,
    unpinItem,
    isPinned,
    refreshPinnedItems: fetchPinnedItems,
    isGuest,
    guestLimitReached,
    guestItemLimit: GUEST_ITEM_LIMIT,
  }), [pinnedItems, isLoading, pinItem, unpinItem, isPinned, fetchPinnedItems, isGuest, guestLimitReached]);

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
