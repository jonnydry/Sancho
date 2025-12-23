import React, { useState, useEffect, useRef, useCallback } from 'react';
import { JournalEntry, JournalStorage } from '../services/journalStorage';
import { usePinnedItems } from '../contexts/PinnedItemsContext';
import { JournalEntryList } from './JournalEntryList';
import { ReferencePane } from './ReferencePane';
import { GridIcon } from './icons/GridIcon';

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
  const [showSidebar, setShowSidebar] = useState(true);

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousSelectedIdRef = useRef<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
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

  const handleInsert = useCallback((textToInsert: string) => {
    if (textareaRef.current) {
        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        
        const before = content.substring(0, start);
        const after = content.substring(end, content.length);
        const newContent = before + textToInsert + after;
        
        setContent(newContent);
        
        // Wait for render to update cursor
        requestAnimationFrame(() => {
            if (textareaRef.current) {
                textareaRef.current.focus();
                const newCursorPos = start + textToInsert.length;
                textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
            }
        });
    } else {
        setContent(prev => prev + '\n\n' + textToInsert);
    }
  }, [content]);

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
      {showSidebar && (
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
      )}

      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-default bg-bg/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowSidebar(!showSidebar)}
              className={`p-1.5 rounded-md transition-colors ${!showSidebar ? 'bg-accent/10 text-accent' : 'text-muted hover:text-default hover:bg-bg-alt'}`}
              title={showSidebar ? "Hide Sidebar (Focus Mode)" : "Show Sidebar"}
            >
              <GridIcon className="w-4 h-4" />
            </button>
            <span className="h-4 w-px bg-default/20 mx-1"></span>
            <span className="text-xs text-muted font-mono">
              {content.length} chars
            </span>
          </div>

          <button
            onClick={() => setShowTemplate(!showTemplate)}
            className={`px-2 py-1 rounded-md text-xs font-medium transition-colors border ${showTemplate
              ? 'bg-accent text-accent-text border-accent hover:bg-accent-hover'
              : 'bg-bg text-muted border-default/30 hover:text-default hover:border-default'
            }`}
            title="Toggle Reference Pane"
          >
            {showTemplate ? 'Hide Reference' : 'Reference'}
          </button>
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col relative overflow-hidden">
          <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Untitled Note"
              className="bg-transparent border-none text-lg sm:text-xl font-bold text-default focus:ring-0 w-full outline-none placeholder:text-muted/30"
            />
          </div>

          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing..."
            className="flex-1 w-full px-4 sm:px-6 py-2 bg-transparent border-none resize-none focus:ring-0 outline-none font-mono text-sm leading-relaxed text-default"
            spellCheck={false}
          />
        </div>
      </div>

      <ReferencePane
        isOpen={showTemplate}
        onClose={() => setShowTemplate(false)}
        selectedTemplate={activeTemplate}
        onSelectTemplate={setActiveTemplate}
        onInsert={handleInsert}
      />
    </div>
  );
};
