import React, { useState, useEffect, useRef, useCallback } from 'react';
import { JournalEntry, JournalStorage } from '../services/journalStorage';
import { usePinnedItems } from '../contexts/PinnedItemsContext';
import { JournalEntryList } from './JournalEntryList';
import { ReferencePane } from './ReferencePane';

// UUID fallback for older browsers
const generateUUID = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const JournalEditor: React.FC = () => {
  const { pinnedItems } = usePinnedItems();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [showTemplate, setShowTemplate] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<string | undefined>(undefined);

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousSelectedIdRef = useRef<string | null>(null);
  const currentStateRef = useRef<{ title: string; content: string; activeTemplate?: string; entries: JournalEntry[] }>({
    title: '',
    content: '',
    entries: []
  });

  // Keep ref in sync with state
  useEffect(() => {
    currentStateRef.current = { title, content, activeTemplate, entries };
  }, [title, content, activeTemplate, entries]);

  useEffect(() => {
    // Load entries on mount
    const loadedEntries = JournalStorage.getAll();
    setEntries(loadedEntries);
    if (loadedEntries.length > 0) {
      selectEntry(loadedEntries[0]);
    } else {
      createNewEntry();
    }
  }, []);

  const selectEntry = useCallback((entry: JournalEntry) => {
    // Save current entry before switching if it exists and has changes
    if (previousSelectedIdRef.current && previousSelectedIdRef.current !== entry.id) {
      // Clear any pending save timeout and save immediately
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
      }

      const state = currentStateRef.current;
      const currentEntry = state.entries.find(e => e.id === previousSelectedIdRef.current);
      if (currentEntry && (currentEntry.title !== state.title || currentEntry.content !== state.content || currentEntry.templateRef !== state.activeTemplate)) {
        const entryToSave: JournalEntry = {
          ...currentEntry,
          title: state.title || currentEntry.title,
          content: state.content || currentEntry.content,
          updatedAt: Date.now(),
          templateRef: state.activeTemplate
        };
        JournalStorage.save(entryToSave);
        // Refresh entries list
        setEntries(JournalStorage.getAll());
      }
    }

    setSelectedId(entry.id);
    setTitle(entry.title);
    setContent(entry.content);
    setActiveTemplate(entry.templateRef);
    if (entry.templateRef) {
      setShowTemplate(true);
    }
    previousSelectedIdRef.current = entry.id;
  }, []);

  const createNewEntry = useCallback(() => {
    const newEntry: JournalEntry = {
      id: generateUUID(),
      title: '',
      content: '',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    JournalStorage.save(newEntry);
    const updatedEntries = JournalStorage.getAll();
    setEntries(updatedEntries);

    // Directly set state instead of calling selectEntry to avoid circular dependency
    setSelectedId(newEntry.id);
    setTitle(newEntry.title);
    setContent(newEntry.content);
    setActiveTemplate(newEntry.templateRef);
    previousSelectedIdRef.current = newEntry.id;
  }, []);

  const deleteEntry = useCallback((id: string) => {
    // Clear save timeout before deleting
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }

    JournalStorage.delete(id);
    const updatedEntries = JournalStorage.getAll();
    setEntries(updatedEntries);
    if (updatedEntries.length > 0) {
      const nextEntry = updatedEntries[0];
      setSelectedId(nextEntry.id);
      setTitle(nextEntry.title);
      setContent(nextEntry.content);
      setActiveTemplate(nextEntry.templateRef);
      previousSelectedIdRef.current = nextEntry.id;
    } else {
      createNewEntry();
    }
  }, [createNewEntry]);

  const handleSave = useCallback(() => {
    if (!selectedId) return;

    const currentEntry = entries.find(e => e.id === selectedId);
    if (!currentEntry) return;

    // Auto-generate title from first line if empty
    let entryTitle = title;
    if (!entryTitle.trim()) {
      const firstLine = content.split('\n')[0].trim();
      entryTitle = firstLine.substring(0, 30) || 'Untitled';
      if (firstLine.length > 30) entryTitle += '...';
      setTitle(entryTitle);
    }

    const entry: JournalEntry = {
      id: selectedId,
      title: entryTitle,
      content,
      createdAt: currentEntry.createdAt || Date.now(),
      updatedAt: Date.now(),
      templateRef: activeTemplate
    };

    JournalStorage.save(entry);
    const updatedEntries = JournalStorage.getAll();
    setEntries(updatedEntries); // Refresh list to show updated titles/dates
  }, [selectedId, entries, title, content, activeTemplate]);

  // Debounced auto-save
  useEffect(() => {
    if (!selectedId) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      handleSave();
    }, 1000);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [content, title, activeTemplate, selectedId, handleSave]);

  return (
    <div className="flex h-full overflow-hidden bg-bg relative">
      <JournalEntryList
        entries={entries}
        selectedId={selectedId}
        onSelect={(id) => {
          const entry = entries.find(e => e.id === id);
          if (entry) selectEntry(entry);
        }}
        onCreate={createNewEntry}
        onDelete={deleteEntry}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-default bg-bg/50">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled Note"
            className="bg-transparent border-none text-sm font-bold text-default focus:ring-0 w-full outline-none placeholder:text-muted/50"
          />
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTemplate(!showTemplate)}
              className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${showTemplate
                ? 'bg-accent text-accent-text hover:bg-accent-hover'
                : 'text-muted hover:bg-accent/10 hover:text-default'
                }`}
              title="Toggle Template Reference"
              aria-label={showTemplate ? 'Hide template reference' : 'Show template reference'}
            >
              {showTemplate ? 'Hide Reference' : 'Show Reference'}
            </button>
          </div>
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing..."
          className="flex-1 w-full p-4 sm:p-6 bg-transparent border-none resize-none focus:ring-0 outline-none font-mono text-sm leading-relaxed text-default"
          spellCheck={false}
        />

        <div className="px-4 py-2 text-xs text-muted border-t border-default/30 flex justify-between">
          <span>{content.length} chars</span>
          <span>{content.split(/\s+/).filter(w => w.length > 0).length} words</span>
        </div>
      </div>

      <ReferencePane
        isOpen={showTemplate}
        onClose={() => setShowTemplate(false)}
        selectedTemplate={activeTemplate}
        onSelectTemplate={setActiveTemplate}
      />
    </div>
  );
};

