export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  templateRef?: string;
  tags?: string[];
  isStarred?: boolean;
}

const LOCAL_STORAGE_KEY = 'sancho_journal_entries';
const MIGRATION_FLAG_KEY = 'sancho_journal_migrated';

// Extract CSRF token from cookie
function getCsrfToken(): string | null {
  const match = document.cookie.match(/(?:^|;\s*)csrf-token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Journal] API request: ${options.method || 'GET'} ${url}`);
  }

  // Include CSRF token for mutation requests
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>,
  };

  const method = options.method?.toUpperCase() || 'GET';
  if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      headers['x-csrf-token'] = csrfToken;
    }
  }

  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    const errorMsg = error.error || `Request failed with status ${response.status}`;
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[Journal] API error (${response.status}): ${errorMsg}`);
    }
    throw new Error(errorMsg);
  }

  if (process.env.NODE_ENV === 'development') {
    console.log(`[Journal] API success: ${options.method || 'GET'} ${url}`);
  }
  return response.json();
}

const isDev = process.env.NODE_ENV === 'development';

// In-memory cache for faster subsequent access
let entriesCache: JournalEntry[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 30000; // 30 seconds

export const JournalStorage = {
  // Get entries with cache-first strategy for instant loading
  getAll: async (): Promise<JournalEntry[]> => {
    try {
      const data = await fetchWithAuth('/api/journal');
      const entries = data.entries || [];
      if (isDev) console.log(`[Journal] Loaded ${entries.length} entries from server`);
      // Update cache
      entriesCache = entries;
      cacheTimestamp = Date.now();
      // Also update local storage as backup
      if (entries.length > 0) {
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(entries));
        } catch (e) {
          // Ignore localStorage errors
        }
      }
      return entries;
    } catch (error) {
      if (isDev) console.warn('[Journal] Failed to fetch from server, using local storage:', error);
      const localEntries = JournalStorage.getLocalEntries();
      if (isDev) console.log(`[Journal] Loaded ${localEntries.length} entries from local storage`);
      return localEntries;
    }
  },

  // Get cached entries instantly (for initial render)
  getCached: (): JournalEntry[] | null => {
    // Return memory cache if fresh
    if (entriesCache && (Date.now() - cacheTimestamp) < CACHE_TTL) {
      return entriesCache;
    }
    // Fall back to localStorage
    const localEntries = JournalStorage.getLocalEntries();
    if (localEntries.length > 0) {
      return localEntries;
    }
    return null;
  },

  // Invalidate cache (call after mutations)
  invalidateCache: (): void => {
    entriesCache = null;
    cacheTimestamp = 0;
  },

  getLocalEntries: (): JournalEntry[] => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading local journal entries:', error);
      return [];
    }
  },

  save: async (entry: JournalEntry): Promise<void> => {
    if (isDev) console.log(`[Journal] Saving entry "${entry.title || 'Untitled'}" (${entry.id})`);
    try {
      await fetchWithAuth(`/api/journal/${entry.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          title: entry.title,
          content: entry.content,
          templateRef: entry.templateRef,
          tags: entry.tags || [],
          isStarred: entry.isStarred || false,
        }),
      });
      if (isDev) console.log(`[Journal] Entry saved to server successfully`);
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message.toLowerCase() : '';
      const isNotFound = errorMsg.includes('404') || errorMsg.includes('not found');

      if (isNotFound) {
        if (isDev) console.log(`[Journal] Entry not found, creating new entry on server`);
        try {
          await fetchWithAuth('/api/journal', {
            method: 'POST',
            body: JSON.stringify({
              id: entry.id,
              title: entry.title,
              content: entry.content,
              templateRef: entry.templateRef,
              tags: entry.tags || [],
              isStarred: entry.isStarred || false,
            }),
          });
          if (isDev) console.log(`[Journal] Entry created on server successfully`);
          return;
        } catch (createError) {
          if (isDev) console.warn('[Journal] Failed to create on server, saving locally:', createError);
          JournalStorage.saveLocal(entry);
          return;
        }
      }
      if (isDev) console.warn('[Journal] Failed to save to server, saving locally:', error);
      JournalStorage.saveLocal(entry);
    }
  },

  saveLocal: (entry: JournalEntry): void => {
    if (isDev) console.log(`[Journal] Saving entry locally: "${entry.title || 'Untitled'}" (${entry.id})`);
    try {
      const entries = JournalStorage.getLocalEntries();
      const index = entries.findIndex(e => e.id === entry.id);

      if (index >= 0) {
        entries[index] = { ...entry, updatedAt: Date.now() };
        if (isDev) console.log(`[Journal] Updated existing local entry`);
      } else {
        entries.push({ ...entry, createdAt: Date.now(), updatedAt: Date.now() });
        if (isDev) console.log(`[Journal] Created new local entry`);
      }

      entries.sort((a, b) => b.createdAt - a.createdAt);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(entries));
      if (isDev) console.log(`[Journal] Local storage now has ${entries.length} entries`);
    } catch (error) {
      if (isDev) console.error('[Journal] Failed to save locally:', error);
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await fetchWithAuth(`/api/journal/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      if (isDev) console.error('Error deleting journal entry from server:', error);
      JournalStorage.deleteLocal(id);
    }
  },

  deleteLocal: (id: string): void => {
    try {
      const entries = JournalStorage.getLocalEntries();
      const filtered = entries.filter(e => e.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      if (isDev) console.error('Error deleting local journal entry:', error);
    }
  },

  getById: async (id: string): Promise<JournalEntry | undefined> => {
    const entries = await JournalStorage.getAll();
    return entries.find(e => e.id === id);
  },

  needsMigration: (): boolean => {
    const migrated = localStorage.getItem(MIGRATION_FLAG_KEY);
    const localEntries = JournalStorage.getLocalEntries();
    return !migrated && localEntries.length > 0;
  },

  migrateToServer: async (): Promise<{ success: boolean; migrated: number }> => {
    try {
      const localEntries = JournalStorage.getLocalEntries();
      
      if (localEntries.length === 0) {
        localStorage.setItem(MIGRATION_FLAG_KEY, 'true');
        return { success: true, migrated: 0 };
      }

      const data = await fetchWithAuth('/api/journal/migrate', {
        method: 'POST',
        body: JSON.stringify({ entries: localEntries }),
      });

      localStorage.setItem(MIGRATION_FLAG_KEY, 'true');
      localStorage.removeItem(LOCAL_STORAGE_KEY);

      return { success: true, migrated: data.migrated || 0 };
    } catch (error) {
      if (isDev) console.error('Error migrating journal entries to server:', error);
      return { success: false, migrated: 0 };
    }
  },

  clearMigrationFlag: (): void => {
    localStorage.removeItem(MIGRATION_FLAG_KEY);
  },
};
