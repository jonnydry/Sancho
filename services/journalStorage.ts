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
    throw new Error(error.error || `Request failed with status ${response.status}`);
  }
  
  return response.json();
}

export const JournalStorage = {
  getAll: async (): Promise<JournalEntry[]> => {
    try {
      const data = await fetchWithAuth('/api/journal');
      return data.entries || [];
    } catch (error) {
      console.error('Error fetching journal entries from server:', error);
      return JournalStorage.getLocalEntries();
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
    try {
      await fetchWithAuth(`/api/journal/${entry.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          title: entry.title,
          content: entry.content,
          templateRef: entry.templateRef,
        }),
      });
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('404')) {
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
          return;
        } catch (createError) {
          console.error('Error creating journal entry on server:', createError);
          JournalStorage.saveLocal(entry);
          return;
        }
      }
      console.error('Error saving journal entry to server:', error);
      JournalStorage.saveLocal(entry);
    }
  },

  saveLocal: (entry: JournalEntry): void => {
    try {
      const entries = JournalStorage.getLocalEntries();
      const index = entries.findIndex(e => e.id === entry.id);
      
      if (index >= 0) {
        entries[index] = { ...entry, updatedAt: Date.now() };
      } else {
        entries.push({ ...entry, createdAt: Date.now(), updatedAt: Date.now() });
      }
      
      entries.sort((a, b) => b.updatedAt - a.updatedAt);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(entries));
    } catch (error) {
      console.error('Error saving journal entry locally:', error);
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
