export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  templateRef?: string; // Name of the pinned item (form/meter) being referenced
}

const STORAGE_KEY = 'sancho_journal_entries';

export const JournalStorage = {
  getAll: (): JournalEntry[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading journal entries from storage:', error);
      return [];
    }
  },

  save: (entry: JournalEntry): void => {
    try {
      const entries = JournalStorage.getAll();
      const index = entries.findIndex(e => e.id === entry.id);
      
      if (index >= 0) {
        entries[index] = { ...entry, updatedAt: Date.now() };
      } else {
        entries.push({ ...entry, createdAt: Date.now(), updatedAt: Date.now() });
      }
      
      // Sort by updated date desc
      entries.sort((a, b) => b.updatedAt - a.updatedAt);
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (error) {
      console.error('Error saving journal entry:', error);
    }
  },

  delete: (id: string): void => {
    try {
      const entries = JournalStorage.getAll();
      const filtered = entries.filter(e => e.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting journal entry:', error);
    }
  },

  getById: (id: string): JournalEntry | undefined => {
    const entries = JournalStorage.getAll();
    return entries.find(e => e.id === id);
  }
};

