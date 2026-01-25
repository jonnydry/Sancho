import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { JournalEntry, JournalStorage } from '../services/journalStorage';
import { extractTagsFromContent, mergeTags, getAllTagsFromEntries } from '../utils/tagUtils';

const generateUUID = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export type SyncStatus = 'synced' | 'syncing' | 'local' | 'error';

export interface UseJournalStateReturn {
  // Entries
  entries: JournalEntry[];
  isLoadingEntries: boolean;

  // Current entry state
  selectedId: string | null;
  title: string;
  content: string;
  tags: string[];
  isStarred: boolean;
  activeTemplate: string | undefined;

  // Setters
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setTags: (tags: string[]) => void;
  setIsStarred: (starred: boolean) => void;
  setActiveTemplate: (template: string | undefined) => void;

  // Actions
  selectEntry: (entry: JournalEntry) => void;
  selectEntryById: (id: string) => void;
  createNewEntry: () => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  handleSave: (isManual?: boolean) => Promise<void>;
  toggleStar: (id: string) => Promise<void>;

  // Sync status
  syncStatus: SyncStatus;
  autosaveError: string | null;
  handleRetrySave: () => Promise<void>;

  // Computed
  wordCount: number;
  readingTime: number;
  allAvailableTags: string[];

  // Daily goal
  dailyGoal: number;
  dailyProgress: number;
  goalProgress: number;
  setDailyGoal: (goal: number) => void;
  resetDailyProgress: () => void;

  // Refs for advanced usage
  contentRef: React.MutableRefObject<string>;
}

export function useJournalState(): UseJournalStateReturn {
  // Initialize with cached entries synchronously for instant render
  const cachedEntries = useMemo(() => JournalStorage.getCached() || [], []);
  const [entries, setEntries] = useState<JournalEntry[]>(cachedEntries);
  const [isLoadingEntries, setIsLoadingEntries] = useState(cachedEntries.length === 0);

  // Initialize selection with first cached entry if available
  const initialEntry = cachedEntries.length > 0 ? cachedEntries[0] : null;
  const [selectedId, setSelectedId] = useState<string | null>(initialEntry?.id || null);
  const [content, setContent] = useState(initialEntry?.content || '');
  const [title, setTitle] = useState(initialEntry?.title || '');
  const [activeTemplate, setActiveTemplate] = useState<string | undefined>(initialEntry?.templateRef);
  const [tags, setTags] = useState<string[]>(initialEntry?.tags || []);
  const [isStarred, setIsStarred] = useState(initialEntry?.isStarred || false);

  // Sync status
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('synced');
  const [autosaveError, setAutosaveError] = useState<string | null>(null);

  // Refs
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef<number>(0);
  const previousSelectedIdRef = useRef<string | null>(initialEntry?.id || null);
  const autosaveErrorTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tagExtractionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isDeletingRef = useRef(false);
  const contentRef = useRef<string>(initialEntry?.content || '');
  const autosaveErrorRef = useRef<string | null>(null);

  const currentStateRef = useRef<{
    title: string;
    content: string;
    activeTemplate?: string;
    tags: string[];
    isStarred: boolean;
    entries: JournalEntry[];
  }>({
    title: initialEntry?.title || '',
    content: initialEntry?.content || '',
    activeTemplate: initialEntry?.templateRef,
    tags: initialEntry?.tags || [],
    isStarred: initialEntry?.isStarred || false,
    entries: cachedEntries,
  });

  // Daily goal state
  const [dailyGoal, setDailyGoal] = useState(() => {
    const saved = localStorage.getItem('sancho_daily_goal');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [dailyProgress, setDailyProgress] = useState(() => {
    const saved = localStorage.getItem('sancho_daily_progress');
    if (saved) {
      const parsed = JSON.parse(saved);
      const today = new Date().toDateString();
      if (parsed.date === today) {
        return parsed.count;
      }
    }
    return 0;
  });
  const previousWordCountRef = useRef<number>(0);
  const currentEntryIdRef = useRef<string | null>(null);

  // Cleanup
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
      if (autosaveErrorTimeoutRef.current) clearTimeout(autosaveErrorTimeoutRef.current);
      if (tagExtractionTimeoutRef.current) clearTimeout(tagExtractionTimeoutRef.current);
    };
  }, []);

  // Keep currentStateRef in sync
  useEffect(() => {
    currentStateRef.current = { title, content, activeTemplate, tags, isStarred, entries };
  }, [title, content, activeTemplate, tags, isStarred, entries]);

  useEffect(() => {
    autosaveErrorRef.current = autosaveError;
  }, [autosaveError]);

  // Persist daily goal
  useEffect(() => {
    localStorage.setItem('sancho_daily_goal', dailyGoal.toString());
  }, [dailyGoal]);

  // Persist daily progress
  useEffect(() => {
    localStorage.setItem('sancho_daily_progress', JSON.stringify({
      date: new Date().toDateString(),
      count: dailyProgress,
    }));
  }, [dailyProgress]);

  // Track word count changes for daily goal
  useEffect(() => {
    const wordCount = content.trim().split(/\s+/).filter((w) => w.length > 0).length;

    if (currentEntryIdRef.current !== selectedId) {
      currentEntryIdRef.current = selectedId;
      previousWordCountRef.current = wordCount;
      return;
    }

    const diff = wordCount - previousWordCountRef.current;
    if (diff > 0 && previousWordCountRef.current > 0) {
      setDailyProgress((prev: number) => prev + diff);
    }
    previousWordCountRef.current = wordCount;
  }, [content, selectedId]);

  // Computed stats
  const wordCount = useMemo(() => {
    if (!content) return 0;
    const trimmed = content.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).filter((w) => w.length > 0).length;
  }, [content]);

  const readingTime = useMemo(() => {
    return Math.max(1, Math.ceil(wordCount / 200));
  }, [wordCount]);

  const goalProgress = useMemo(() => {
    if (dailyGoal <= 0) return 0;
    return Math.min(100, Math.round((dailyProgress / dailyGoal) * 100));
  }, [dailyGoal, dailyProgress]);

  const allAvailableTags = useMemo(() => getAllTagsFromEntries(entries), [entries]);

  // Select entry directly (without unsaved changes check)
  const selectEntryDirect = useCallback((entry: JournalEntry) => {
    setSelectedId(entry.id);
    setTitle(entry.title);
    setContent(entry.content);
    contentRef.current = entry.content;
    setActiveTemplate(entry.templateRef);
    setTags(entry.tags || []);
    setIsStarred(entry.isStarred || false);
    previousSelectedIdRef.current = entry.id;
  }, []);

  // Create new entry
  const createNewEntry = useCallback(async () => {
    const newEntry: JournalEntry = {
      id: generateUUID(),
      title: '',
      content: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      tags: [],
      isStarred: false,
    };

    // Optimistic UI update
    setEntries((prev) => [newEntry, ...prev]);
    setSelectedId(newEntry.id);
    setTitle(newEntry.title);
    setContent(newEntry.content);
    contentRef.current = newEntry.content;
    setActiveTemplate(newEntry.templateRef);
    setTags([]);
    setIsStarred(false);
    previousSelectedIdRef.current = newEntry.id;

    // Save to server in background
    try {
      await JournalStorage.save(newEntry);
      setSyncStatus('synced');
    } catch (error) {
      console.error('Failed to save new entry:', error);
      setSyncStatus('error');
      const errorMessage = error instanceof Error ? error.message : 'Failed to create new entry';
      setAutosaveError(errorMessage);

      if (autosaveErrorTimeoutRef.current) clearTimeout(autosaveErrorTimeoutRef.current);
      autosaveErrorTimeoutRef.current = setTimeout(() => setAutosaveError(null), 5000);
    }
  }, []);

  // Load entries on mount
  useEffect(() => {
    const loadEntries = async () => {
      try {
        if (JournalStorage.needsMigration()) {
          await JournalStorage.migrateToServer();
        }
        const loadedEntries = await JournalStorage.getAll();

        if (loadedEntries.length > 0) {
          setEntries(loadedEntries);
          if (cachedEntries.length > 0) {
            const currentSelectedId = previousSelectedIdRef.current;
            if (currentSelectedId) {
              const freshEntry = loadedEntries.find(e => e.id === currentSelectedId);
              const cachedEntry = cachedEntries.find(e => e.id === currentSelectedId);
              if (!freshEntry) {
                selectEntryDirect(loadedEntries[0]);
              } else if (cachedEntry && (
                freshEntry.content !== cachedEntry.content ||
                freshEntry.title !== cachedEntry.title ||
                freshEntry.templateRef !== cachedEntry.templateRef ||
                freshEntry.isStarred !== cachedEntry.isStarred ||
                JSON.stringify(freshEntry.tags || []) !== JSON.stringify(cachedEntry.tags || [])
              )) {
                selectEntryDirect(freshEntry);
              }
            }
          } else {
            selectEntryDirect(loadedEntries[0]);
          }
        } else if (cachedEntries.length === 0) {
          setEntries([]);
          await createNewEntry();
        }
      } finally {
        setIsLoadingEntries(false);
      }
    };
    loadEntries();
  }, [selectEntryDirect, createNewEntry, cachedEntries]);

  // Save handler
  const handleSaveRef = useRef<((isManual?: boolean, retryAttempt?: number) => Promise<void>) | undefined>(undefined);

  const handleSave = useCallback(async (isManual = false, retryAttempt = 0) => {
    const state = currentStateRef.current;
    const currentSelectedId = previousSelectedIdRef.current;

    if (!currentSelectedId) return;

    const currentEntry = state.entries.find((e) => e.id === currentSelectedId);
    if (!currentEntry) return;

    let entryTitle = state.title;
    if (!entryTitle.trim()) {
      const firstLine = state.content.split('\n')[0].trim();
      entryTitle = firstLine.substring(0, 30) || 'Untitled';
      if (firstLine.length > 30) entryTitle += '...';
      setTitle(entryTitle);
    }

    const updatedEntry: JournalEntry = {
      id: currentSelectedId,
      title: entryTitle,
      content: state.content,
      createdAt: currentEntry.createdAt || Date.now(),
      updatedAt: Date.now(),
      templateRef: state.activeTemplate,
      tags: state.tags,
      isStarred: state.isStarred,
    };

    // Update local state optimistically
    setEntries((prev) => prev.map((e) => (e.id === currentSelectedId ? updatedEntry : e)));

    if (isManual) setSyncStatus('syncing');

    try {
      await JournalStorage.save(updatedEntry);
      setSyncStatus('synced');
      retryCountRef.current = 0;
      if (autosaveErrorRef.current) {
        setAutosaveError(null);
        if (autosaveErrorTimeoutRef.current) clearTimeout(autosaveErrorTimeoutRef.current);
      }
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
    } catch (error) {
      console.error('Failed to save entry:', error);
      setSyncStatus('error');
      const errorMessage = error instanceof Error ? error.message : 'Failed to save';
      setAutosaveError(errorMessage);

      const maxRetries = 3;
      if (!isManual && retryAttempt < maxRetries) {
        const retryDelay = Math.min(1000 * Math.pow(2, retryAttempt), 8000);
        retryCountRef.current = retryAttempt + 1;

        if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);

        retryTimeoutRef.current = setTimeout(() => {
          handleSaveRef.current?.(false, retryAttempt + 1);
        }, retryDelay);
      } else {
        if (autosaveErrorTimeoutRef.current) clearTimeout(autosaveErrorTimeoutRef.current);
        autosaveErrorTimeoutRef.current = setTimeout(() => setAutosaveError(null), 5000);
      }

      if (isManual) throw error;
    }
  }, []);

  useEffect(() => {
    handleSaveRef.current = handleSave;
  }, [handleSave]);

  const handleRetrySave = useCallback(async () => {
    setAutosaveError(null);
    await handleSave(false);
  }, [handleSave]);

  // Delete entry
  const deleteEntry = useCallback(async (id: string) => {
    if (isDeletingRef.current) return;
    isDeletingRef.current = true;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }

    const currentEntries = currentStateRef.current.entries;
    const remaining = currentEntries.filter((e) => e.id !== id);
    const wasSelected = previousSelectedIdRef.current === id;

    if (remaining.length > 0) {
      setEntries(remaining);

      if (wasSelected) {
        const nextEntry = remaining[0];
        setSelectedId(nextEntry.id);
        setTitle(nextEntry.title);
        setContent(nextEntry.content);
        contentRef.current = nextEntry.content;
        setActiveTemplate(nextEntry.templateRef);
        setTags(nextEntry.tags || []);
        setIsStarred(nextEntry.isStarred || false);
        previousSelectedIdRef.current = nextEntry.id;
      }
    } else {
      const newEntry: JournalEntry = {
        id: generateUUID(),
        title: '',
        content: '',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        tags: [],
        isStarred: false,
      };

      setEntries([newEntry]);
      setSelectedId(newEntry.id);
      setTitle('');
      setContent('');
      contentRef.current = '';
      setActiveTemplate(undefined);
      setTags([]);
      setIsStarred(false);
      previousSelectedIdRef.current = newEntry.id;

      JournalStorage.save(newEntry).catch((error) => {
        console.error('Failed to save new entry:', error);
      });
    }

    try {
      await JournalStorage.delete(id);
    } catch (error) {
      console.error('Failed to delete entry from server:', error);
    } finally {
      isDeletingRef.current = false;
    }
  }, []);

  // Toggle star
  const toggleStar = useCallback(async (id: string) => {
    const entry = entries.find((e) => e.id === id);
    if (!entry) return;

    const newStarred = !entry.isStarred;

    // Optimistic update
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, isStarred: newStarred } : e)));

    if (id === selectedId) {
      setIsStarred(newStarred);
    }

    try {
      await JournalStorage.save({ ...entry, isStarred: newStarred, updatedAt: Date.now() });
    } catch (error) {
      console.error('Failed to toggle star:', error);
      // Revert on error
      setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, isStarred: !newStarred } : e)));
      if (id === selectedId) {
        setIsStarred(!newStarred);
      }
    }
  }, [entries, selectedId]);

  // Select entry (public method)
  const selectEntry = useCallback((entry: JournalEntry) => {
    // Clear any pending save
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }

    // Save current entry if needed
    if (previousSelectedIdRef.current && previousSelectedIdRef.current !== entry.id) {
      handleSave(false);
    }

    selectEntryDirect(entry);
  }, [selectEntryDirect, handleSave]);

  const selectEntryById = useCallback((id: string) => {
    const entry = entries.find((e) => e.id === id);
    if (entry) selectEntry(entry);
  }, [entries, selectEntry]);

  // Auto-extract tags from content
  useEffect(() => {
    if (tagExtractionTimeoutRef.current) clearTimeout(tagExtractionTimeoutRef.current);

    tagExtractionTimeoutRef.current = setTimeout(() => {
      const extractedTags = extractTagsFromContent(content);
      setTags((currentTags) => {
        const merged = mergeTags(currentTags, extractedTags);
        if (merged.length !== currentTags.length || !merged.every((t) => currentTags.includes(t))) {
          return merged;
        }
        return currentTags;
      });
    }, 1500);

    return () => {
      if (tagExtractionTimeoutRef.current) clearTimeout(tagExtractionTimeoutRef.current);
    };
  }, [content]);

  // Autosave effect
  useEffect(() => {
    if (!selectedId) return;

    setSyncStatus((prev) => (prev === 'synced' ? 'local' : prev));

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(() => {
      handleSave(false);
    }, 2500);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [content, title, activeTemplate, tags, isStarred, selectedId, handleSave]);

  const resetDailyProgress = useCallback(() => {
    setDailyProgress(0);
  }, []);

  return {
    // Entries
    entries,
    isLoadingEntries,

    // Current entry state
    selectedId,
    title,
    content,
    tags,
    isStarred,
    activeTemplate,

    // Setters
    setTitle,
    setContent: (newContent: string) => {
      setContent(newContent);
      contentRef.current = newContent;
    },
    setTags,
    setIsStarred,
    setActiveTemplate,

    // Actions
    selectEntry,
    selectEntryById,
    createNewEntry,
    deleteEntry,
    handleSave,
    toggleStar,

    // Sync status
    syncStatus,
    autosaveError,
    handleRetrySave,

    // Computed
    wordCount,
    readingTime,
    allAvailableTags,

    // Daily goal
    dailyGoal,
    dailyProgress,
    goalProgress,
    setDailyGoal,
    resetDailyProgress,

    // Refs
    contentRef,
  };
}
