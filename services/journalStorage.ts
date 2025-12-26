export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  templateRef?: string;
}

const LOCAL_STORAGE_KEY = 'sancho_journal_entries';
const MIGRATION_FLAG_KEY = 'sancho_journal_migrated';

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  console.log(`[Journal] API request: ${options.method || 'GET'} ${url}`);
  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    const errorMsg = error.error || `Request failed with status ${response.status}`;
    console.warn(`[Journal] API error (${response.status}): ${errorMsg}`);
    throw new Error(errorMsg);
  }
  
  console.log(`[Journal] API success: ${options.method || 'GET'} ${url}`);
  return response.json();
}

export const JournalStorage = {
  getAll: async (): Promise<JournalEntry[]> => {
    try {
      const data = await fetchWithAuth('/api/journal');
      console.log(`[Journal] Loaded ${data.entries?.length || 0} entries from server`);
      return data.entries || [];
    } catch (error) {
      console.warn('[Journal] Failed to fetch from server, using local storage:', error);
      const localEntries = JournalStorage.getLocalEntries();
      console.log(`[Journal] Loaded ${localEntries.length} entries from local storage`);
      return localEntries;
    }
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
    console.log(`[Journal] Saving entry "${entry.title || 'Untitled'}" (${entry.id})`);
    try {
      await fetchWithAuth(`/api/journal/${entry.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          title: entry.title,
          content: entry.content,
          templateRef: entry.templateRef,
        }),
      });
      console.log(`[Journal] Entry saved to server successfully`);
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message.toLowerCase() : '';
      const isNotFound = errorMsg.includes('404') || errorMsg.includes('not found');
      
      if (isNotFound) {
        console.log(`[Journal] Entry not found, creating new entry on server`);
        try {
          await fetchWithAuth('/api/journal', {
            method: 'POST',
            body: JSON.stringify({
              id: entry.id,
              title: entry.title,
              content: entry.content,
              templateRef: entry.templateRef,
            }),
          });
          console.log(`[Journal] Entry created on server successfully`);
          return;
        } catch (createError) {
          console.warn('[Journal] Failed to create on server, saving locally:', createError);
          JournalStorage.saveLocal(entry);
          return;
        }
      }
      console.warn('[Journal] Failed to save to server, saving locally:', error);
      JournalStorage.saveLocal(entry);
    }
  },

  saveLocal: (entry: JournalEntry): void => {
    console.log(`[Journal] Saving entry locally: "${entry.title || 'Untitled'}" (${entry.id})`);
    try {
      const entries = JournalStorage.getLocalEntries();
      const index = entries.findIndex(e => e.id === entry.id);
      
      if (index >= 0) {
        entries[index] = { ...entry, updatedAt: Date.now() };
        console.log(`[Journal] Updated existing local entry`);
      } else {
        entries.push({ ...entry, createdAt: Date.now(), updatedAt: Date.now() });
        console.log(`[Journal] Created new local entry`);
      }
      
      entries.sort((a, b) => b.updatedAt - a.updatedAt);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(entries));
      console.log(`[Journal] Local storage now has ${entries.length} entries`);
    } catch (error) {
      console.error('[Journal] Failed to save locally:', error);
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await fetchWithAuth(`/api/journal/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error deleting journal entry from server:', error);
      JournalStorage.deleteLocal(id);
    }
  },

  deleteLocal: (id: string): void => {
    try {
      const entries = JournalStorage.getLocalEntries();
      const filtered = entries.filter(e => e.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting local journal entry:', error);
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
      console.error('Error migrating journal entries to server:', error);
      return { success: false, migrated: 0 };
    }
  },

  clearMigrationFlag: (): void => {
    localStorage.removeItem(MIGRATION_FLAG_KEY);
  },
};
