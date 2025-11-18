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
      throw new Error('Please log in to save items to your notebook');
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

    try {
      console.log('Attempting to pin item:', { name: item.name, type: item.type });
      const response = await fetch('/api/pinned-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ itemData: item }),
      });

      if (response.ok) {
        console.log('Successfully pinned item:', item.name);
        await fetchPinnedItems();
      } else if (response.status === 401) {
        let errorData: any = {};
        try {
          errorData = await response.json();
        } catch (parseError) {
          console.error('Failed to parse 401 error response:', parseError);
        }
        
        const message = errorData.message || errorData.error || 'Your session has expired. Please log in again';
        console.error('Authentication error:', message);
        
        const authError: any = new Error(message);
        authError.requiresLogin = true;
        authError.code = errorData.code || 'SESSION_EXPIRED';
        throw authError;
      } else {
        let errorData: any = {};
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          try {
            errorData = await response.json();
          } catch (parseError) {
            console.error('Failed to parse error response as JSON:', parseError);
          }
        } else {
          const text = await response.text().catch(() => '');
          console.error('Non-JSON error response:', text);
          errorData = { error: text || `Server error: ${response.status} ${response.statusText}` };
        }
        
        console.error('Failed to pin item. Status:', response.status, 'Error:', errorData);
        const errorMessage = errorData.error || errorData.message || `Failed to pin item (${response.status})`;
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error pinning item:', error);
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(`Failed to pin item: ${String(error)}`);
      }
    }
  }, [isAuthenticated, isAuthLoading, fetchPinnedItems]);

  const unpinItem = useCallback(async (itemName: string) => {
    // Wait for auth to finish loading and ensure user is authenticated
    if (isAuthLoading || !isAuthenticated) {
      throw new Error('Please log in to remove items from your notebook');
    }

    if (!itemName || typeof itemName !== 'string' || itemName.trim().length === 0) {
      throw new Error('Invalid item name: name is required and must be a non-empty string');
    }

    try {
      console.log('Attempting to unpin item:', itemName);
      const response = await fetch(`/api/pinned-items/${encodeURIComponent(itemName)}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        console.log('Successfully unpinned item:', itemName);
        await fetchPinnedItems();
      } else if (response.status === 401) {
        let errorData: any = {};
        try {
          errorData = await response.json();
        } catch (parseError) {
          console.error('Failed to parse 401 error response:', parseError);
        }
        
        const message = errorData.message || errorData.error || 'Your session has expired. Please log in again';
        console.error('Authentication error:', message);
        
        const authError: any = new Error(message);
        authError.requiresLogin = true;
        authError.code = errorData.code || 'SESSION_EXPIRED';
        throw authError;
      } else {
        let errorData: any = {};
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          try {
            errorData = await response.json();
          } catch (parseError) {
            console.error('Failed to parse error response as JSON:', parseError);
          }
        } else {
          const text = await response.text().catch(() => '');
          console.error('Non-JSON error response:', text);
          errorData = { error: text || `Server error: ${response.status} ${response.statusText}` };
        }
        
        console.error('Failed to unpin item. Status:', response.status, 'Error:', errorData);
        const errorMessage = errorData.error || errorData.message || `Failed to unpin item (${response.status})`;
        throw new Error(errorMessage);
      }
    } catch (error) {
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

