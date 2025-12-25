import React, { useState, useEffect, useRef, useCallback } from 'react';
import { JournalEntry, JournalStorage } from '../services/journalStorage';
import { usePinnedItems } from '../contexts/PinnedItemsContext';
import { JournalEntryList } from './JournalEntryList';
import { ReferencePane } from './ReferencePane';
import { GridIcon } from './icons/GridIcon';

const generateUUID = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

interface ResizeHandleProps {
  onResize: (delta: number) => void;
  className?: string;
}

const ResizeHandle: React.FC<ResizeHandleProps> = ({ onResize, className }) => {
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      onResize(e.movementX);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, onResize]);

  return (
    <div
      className={`w-[3px] cursor-col-resize z-10 flex flex-col justify-center items-center group relative ${isDragging ? 'bg-accent/40' : 'bg-transparent hover:bg-accent/30'} ${className || ''}`}
      onMouseDown={() => setIsDragging(true)}
    >
        <div className={`w-px h-5 rounded-full ${isDragging ? 'bg-accent' : 'bg-border/40 group-hover:bg-accent/60'}`} />
    </div>
  );
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
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showSaveError, setShowSaveError] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const saveConfirmTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const [entryListWidth, setEntryListWidth] = useState(240);
  const [referencePaneWidth, setReferencePaneWidth] = useState(320);

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousSelectedIdRef = useRef<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const savedSelectionRef = useRef<{ start: number; end: number } | null>(null);
  const currentStateRef = useRef<{ title: string; content: string; activeTemplate?: string; entries: JournalEntry[] }>({
    title: '',
    content: '',
    entries: []
  });

  useEffect(() => {
    const savedEntryWidth = localStorage.getItem('journal_entry_width');
    const savedRefWidth = localStorage.getItem('journal_ref_width');
    if (savedEntryWidth) setEntryListWidth(parseInt(savedEntryWidth));
    if (savedRefWidth) setReferencePaneWidth(parseInt(savedRefWidth));
  }, []);

  useEffect(() => {
    localStorage.setItem('journal_entry_width', entryListWidth.toString());
    localStorage.setItem('journal_ref_width', referencePaneWidth.toString());
  }, [entryListWidth, referencePaneWidth]);

  useEffect(() => {
    return () => {
      if (saveConfirmTimeoutRef.current) {
        clearTimeout(saveConfirmTimeoutRef.current);
      }
    };
  }, []);

  const handleResizeEntryList = useCallback((delta: number) => {
    setEntryListWidth(prev => {
      const newWidth = prev + delta;
      if (newWidth < 160) return 160;
      if (newWidth > 400) return 400;
      return newWidth;
    });
  }, []);

  const handleResizeReferencePane = useCallback((delta: number) => {
    setReferencePaneWidth(prev => {
      const newWidth = prev - delta;
      if (newWidth < 240) return 240;
      if (newWidth > 600) return 600;
      return newWidth;
    });
  }, []);

  useEffect(() => {
    currentStateRef.current = { title, content, activeTemplate, entries };
  }, [title, content, activeTemplate, entries]);

  useEffect(() => {
    const loadEntries = async () => {
      if (JournalStorage.needsMigration()) {
        await JournalStorage.migrateToServer();
      }
      const loadedEntries = await JournalStorage.getAll();
      setEntries(loadedEntries);
      if (loadedEntries.length > 0) {
        selectEntryDirect(loadedEntries[0]);
      } else {
        createNewEntryDirect();
      }
    };
    loadEntries();
  }, []);

  const selectEntryDirect = (entry: JournalEntry) => {
    setSelectedId(entry.id);
    setTitle(entry.title);
    setContent(entry.content);
    setActiveTemplate(entry.templateRef);
    if (entry.templateRef) {
      setShowTemplate(true);
    }
    previousSelectedIdRef.current = entry.id;
  };

  const selectEntry = useCallback(async (entry: JournalEntry) => {
    if (previousSelectedIdRef.current && previousSelectedIdRef.current !== entry.id) {
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
        await JournalStorage.save(entryToSave);
        const updatedEntries = await JournalStorage.getAll();
        setEntries(updatedEntries);
      }
    }

    selectEntryDirect(entry);
  }, []);

  const createNewEntryDirect = () => {
    const newEntry: JournalEntry = {
      id: generateUUID(),
      title: '',
      content: '',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    setEntries(prev => [newEntry, ...prev]);
    setSelectedId(newEntry.id);
    setTitle(newEntry.title);
    setContent(newEntry.content);
    setActiveTemplate(newEntry.templateRef);
    previousSelectedIdRef.current = newEntry.id;
    JournalStorage.save(newEntry);
  };

  const createNewEntry = useCallback(async () => {
    const newEntry: JournalEntry = {
      id: generateUUID(),
      title: '',
      content: '',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    await JournalStorage.save(newEntry);
    const updatedEntries = await JournalStorage.getAll();
    setEntries(updatedEntries);

    setSelectedId(newEntry.id);
    setTitle(newEntry.title);
    setContent(newEntry.content);
    setActiveTemplate(newEntry.templateRef);
    previousSelectedIdRef.current = newEntry.id;
  }, []);

  const deleteEntry = useCallback(async (id: string) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }

    await JournalStorage.delete(id);
    const updatedEntries = await JournalStorage.getAll();
    setEntries(updatedEntries);
    if (updatedEntries.length > 0) {
      const nextEntry = updatedEntries[0];
      setSelectedId(nextEntry.id);
      setTitle(nextEntry.title);
      setContent(nextEntry.content);
      setActiveTemplate(nextEntry.templateRef);
      previousSelectedIdRef.current = nextEntry.id;
    } else {
      await createNewEntry();
    }
  }, [createNewEntry]);

  const handleSave = useCallback(async () => {
    if (!selectedId) return;

    const currentEntry = entries.find(e => e.id === selectedId);
    if (!currentEntry) return;

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

    await JournalStorage.save(entry);
    const updatedEntries = await JournalStorage.getAll();
    setEntries(updatedEntries);
  }, [selectedId, entries, title, content, activeTemplate]);

  const handleManualSave = useCallback(async () => {
    setIsSaving(true);
    setShowSaveError(false);
    try {
      await handleSave();
      setShowSaveConfirm(true);
      if (saveConfirmTimeoutRef.current) {
        clearTimeout(saveConfirmTimeoutRef.current);
      }
      saveConfirmTimeoutRef.current = setTimeout(() => setShowSaveConfirm(false), 2000);
    } catch (error) {
      console.error('Failed to save entry:', error);
      setShowSaveConfirm(false);
      setShowSaveError(true);
      if (saveConfirmTimeoutRef.current) {
        clearTimeout(saveConfirmTimeoutRef.current);
      }
      saveConfirmTimeoutRef.current = setTimeout(() => setShowSaveError(false), 3000);
    } finally {
      setIsSaving(false);
    }
  }, [handleSave]);

  const handleDeleteCurrent = useCallback(async () => {
    if (!selectedId) return;
    setShowDeleteConfirm(false);
    await deleteEntry(selectedId);
  }, [selectedId, deleteEntry]);

  const handleTextareaBlur = useCallback(() => {
    if (textareaRef.current) {
      savedSelectionRef.current = {
        start: textareaRef.current.selectionStart,
        end: textareaRef.current.selectionEnd
      };
    }
  }, []);

  const handleInsert = useCallback((textToInsert: string) => {
    const textarea = textareaRef.current;
    
    if (!textarea) {
      setContent(prev => prev + '\n\n' + textToInsert);
      return;
    }
    
    textarea.focus();
    
    const start = savedSelectionRef.current?.start ?? textarea.selectionStart;
    const end = savedSelectionRef.current?.end ?? textarea.selectionEnd;
    
    const before = content.substring(0, start);
    const after = content.substring(end);
    const insertion = '\n\n' + textToInsert;
    const newContent = before + insertion + after;
    
    setContent(newContent);
    
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        const newCursorPos = start + insertion.length;
        textareaRef.current.selectionStart = newCursorPos;
        textareaRef.current.selectionEnd = newCursorPos;
        textareaRef.current.focus();
      }
    });
    
    savedSelectionRef.current = null;
  }, [content]);

  useEffect(() => {
    if (!selectedId) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      handleSave();
    }, 500);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [content, title, activeTemplate, selectedId, handleSave]);

  return (
    <div className="flex h-full overflow-hidden bg-bg relative">
      {showSidebar && (
        <>
          <JournalEntryList
            entries={entries}
            selectedId={selectedId}
            onSelect={(id) => {
              const entry = entries.find(e => e.id === id);
              if (entry) selectEntry(entry);
            }}
            onCreate={createNewEntry}
            onDelete={deleteEntry}
            width={entryListWidth}
          />
          <ResizeHandle onResize={handleResizeEntryList} />
        </>
      )}

      <div className="flex-1 flex flex-col min-w-[300px] transition-all duration-300">
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
            {showSaveConfirm && (
              <span className="text-xs text-green-500 font-medium animate-pulse">Saved</span>
            )}
            {showSaveError && (
              <span className="text-xs text-red-500 font-medium">Save failed</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleManualSave}
              disabled={isSaving}
              className="px-2 py-1 rounded-md text-xs font-medium transition-colors border bg-bg text-muted border-default/30 hover:text-default hover:border-default hover:bg-accent/10 disabled:opacity-50"
              title="Save Entry"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-2 py-1 rounded-md text-xs font-medium transition-colors border bg-bg text-red-400 border-red-400/30 hover:bg-red-500/10 hover:border-red-400"
              title="Delete Entry"
            >
              Delete
            </button>
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
        </div>

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

          <div className="flex-1 relative overflow-auto px-4 sm:px-6 py-2">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onBlur={handleTextareaBlur}
              placeholder="Start writing..."
              className="w-full h-full min-h-[300px] bg-transparent border-none outline-none resize-none text-sm leading-relaxed text-default placeholder:text-muted/30"
            />
          </div>
        </div>
      </div>

      {showTemplate && (
        <>
          <ResizeHandle onResize={handleResizeReferencePane} />
          <ReferencePane
            isOpen={showTemplate}
            onClose={() => setShowTemplate(false)}
            selectedTemplate={activeTemplate}
            onSelectTemplate={setActiveTemplate}
            onInsert={handleInsert}
            width={referencePaneWidth}
          />
        </>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-bg border border-default rounded-lg p-6 max-w-sm mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-default mb-2">Delete Entry?</h3>
            <p className="text-sm text-muted mb-4">
              Are you sure you want to delete "{title || 'Untitled'}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1.5 rounded-md text-sm font-medium bg-bg-alt text-default border border-default hover:bg-bg-alt/80 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCurrent}
                className="px-3 py-1.5 rounded-md text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
