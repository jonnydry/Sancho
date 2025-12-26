import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { JournalEntry, JournalStorage } from '../services/journalStorage';
import { usePinnedItems } from '../contexts/PinnedItemsContext';
import { useAuth } from '../hooks/useAuth';
import { JournalEntryList } from './JournalEntryList';
import { ReferencePane } from './ReferencePane';
import { BottomPanel } from './BottomPanel';
import { GridIcon } from './icons/GridIcon';
import { poetryData } from '../data/poetryData';
import { poeticDevicesData } from '../data/poeticDevicesData';

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
  const startPosRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      onResize(e.movementX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (!startPosRef.current) return;
      const touch = e.touches[0];
      const delta = touch.clientX - startPosRef.current.x;
      onResize(delta);
      startPosRef.current.x = touch.clientX;
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      startPosRef.current = null;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      startPosRef.current = null;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isDragging) return;
      if (e.key === 'Escape') {
        setIsDragging(false);
        startPosRef.current = null;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        return;
      }
      const step = e.shiftKey ? 10 : 1;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onResize(-step);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        onResize(step);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, onResize]);

  const handleStart = (clientX: number) => {
    setIsDragging(true);
    startPosRef.current = { x: clientX, y: 0 };
  };

  return (
    <div
      className={`w-[3px] cursor-col-resize z-10 flex flex-col justify-center items-center group relative ${isDragging ? 'bg-accent/40' : 'bg-transparent hover:bg-accent/30'} ${className || ''}`}
      onMouseDown={(e) => handleStart(e.clientX)}
      onTouchStart={(e) => {
        const touch = e.touches[0];
        handleStart(touch.clientX);
      }}
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize panel"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsDragging(true);
        }
      }}
    >
      <div className={`w-px h-5 rounded-full ${isDragging ? 'bg-accent' : 'bg-border/40 group-hover:bg-accent/60'}`} />
    </div>
  );
};

export const JournalEditor: React.FC = () => {
  const { pinnedItems } = usePinnedItems();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
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
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);
  const [pendingEntrySwitch, setPendingEntrySwitch] = useState<JournalEntry | null>(null);
  const [autosaveError, setAutosaveError] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'local' | 'error'>('synced');
  const saveConfirmTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autosaveErrorTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const [entryListWidth, setEntryListWidth] = useState(240);
  const [referencePaneWidth, setReferencePaneWidth] = useState(320);
  const [bottomPanelOpen, setBottomPanelOpen] = useState(false);
  const [bottomPanelHeight, setBottomPanelHeight] = useState(250);
  const [referenceSearchQuery, setReferenceSearchQuery] = useState<string | null>(null);

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
      if (autosaveErrorTimeoutRef.current) {
        clearTimeout(autosaveErrorTimeoutRef.current);
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

  const handleResizeBottomPanel = useCallback((delta: number) => {
    setBottomPanelHeight(prev => {
      const newHeight = prev + delta;
      if (newHeight < 150) return 150;
      if (newHeight > 500) return 500;
      return newHeight;
    });
  }, []);

  const allItems = useMemo(() => [...poetryData, ...poeticDevicesData], []);

  const activeItem = useMemo(() => {
    if (!activeTemplate) return null;
    return allItems.find(item => item.name === activeTemplate) || null;
  }, [activeTemplate, allItems]);

  const handleBottomPanelTagClick = useCallback((tag: string) => {
    setShowTemplate(true);
    setReferenceSearchQuery(tag);
  }, []);

  const handleBottomPanelSeeAlsoClick = useCallback((name: string) => {
    setActiveTemplate(name);
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
        await createNewEntryDirect();
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
      const hasUnsavedChanges = currentEntry && (
        currentEntry.title !== state.title || 
        currentEntry.content !== state.content || 
        currentEntry.templateRef !== state.activeTemplate
      );

      if (hasUnsavedChanges) {
        // Check if user wants to save before switching
        setPendingEntrySwitch(entry);
        setShowUnsavedWarning(true);
        return;
      }
    }

    selectEntryDirect(entry);
  }, []);

  const handleUnsavedWarningConfirm = useCallback(async () => {
    setShowUnsavedWarning(false);
    if (!pendingEntrySwitch) return;

    // Save current entry before switching
    const state = currentStateRef.current;
    const currentEntry = state.entries.find(e => e.id === previousSelectedIdRef.current);
    if (currentEntry) {
      const entryToSave: JournalEntry = {
        ...currentEntry,
        title: state.title || currentEntry.title,
        content: state.content || currentEntry.content,
        updatedAt: Date.now(),
        templateRef: state.activeTemplate
      };
      try {
        await JournalStorage.save(entryToSave);
        const updatedEntries = await JournalStorage.getAll();
        setEntries(updatedEntries);
      } catch (error) {
        console.error('Failed to save entry before switching:', error);
      }
    }

    selectEntryDirect(pendingEntrySwitch);
    setPendingEntrySwitch(null);
  }, [pendingEntrySwitch]);

  const handleUnsavedWarningCancel = useCallback(() => {
    setShowUnsavedWarning(false);
    setPendingEntrySwitch(null);
  }, []);

  const createNewEntryDirect = async () => {
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
    try {
      await JournalStorage.save(newEntry);
    } catch (error) {
      console.error('Failed to save new entry:', error);
    }
  };

  const createNewEntry = useCallback(async () => {
    const newEntry: JournalEntry = {
      id: generateUUID(),
      title: '',
      content: '',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    // Optimistic UI update - show new entry immediately
    setEntries(prev => [newEntry, ...prev]);
    setSelectedId(newEntry.id);
    setTitle(newEntry.title);
    setContent(newEntry.content);
    setActiveTemplate(newEntry.templateRef);
    previousSelectedIdRef.current = newEntry.id;
    
    // Save to server in background
    try {
      await JournalStorage.save(newEntry);
    } catch (error) {
      console.error('Failed to save new entry:', error);
      // Entry is already in UI, will be saved on next content change
    }
  }, []);

  const deleteEntry = useCallback(async (id: string) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }

    // Use functional update to ensure we have the latest entries state
    let nextEntryToSelect: JournalEntry | null = null;
    let shouldCreateNew = false;
    let newEntryToCreate: JournalEntry | null = null;

    setEntries(prevEntries => {
      const remaining = prevEntries.filter(e => e.id !== id);
      
      if (remaining.length > 0) {
        // Select next entry if we deleted the currently selected one
        if (selectedId === id) {
          nextEntryToSelect = remaining[0];
        }
        return remaining;
      } else {
        // No entries left - create a new blank one
        shouldCreateNew = true;
        newEntryToCreate = {
          id: generateUUID(),
          title: '',
          content: '',
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        return [newEntryToCreate];
      }
    });

    // Handle selection outside of setEntries callback
    if (nextEntryToSelect) {
      setSelectedId(nextEntryToSelect.id);
      setTitle(nextEntryToSelect.title);
      setContent(nextEntryToSelect.content);
      setActiveTemplate(nextEntryToSelect.templateRef);
      previousSelectedIdRef.current = nextEntryToSelect.id;
    } else if (shouldCreateNew && newEntryToCreate) {
      setSelectedId(newEntryToCreate.id);
      setTitle('');
      setContent('');
      setActiveTemplate(undefined);
      previousSelectedIdRef.current = newEntryToCreate.id;
      
      // Save new entry to server
      JournalStorage.save(newEntryToCreate).catch(error => {
        console.error('Failed to save new entry:', error);
      });
    }

    // Delete from server in background
    try {
      await JournalStorage.delete(id);
    } catch (error) {
      console.error('Failed to delete entry from server:', error);
    }
  }, [selectedId]);

  const handleSave = useCallback(async (isManual = false) => {
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

    const updatedEntry: JournalEntry = {
      id: selectedId,
      title: entryTitle,
      content,
      createdAt: currentEntry.createdAt || Date.now(),
      updatedAt: Date.now(),
      templateRef: activeTemplate
    };

    // Update local state optimistically (preserve order)
    setEntries(prev => prev.map(e => e.id === selectedId ? updatedEntry : e));

    // Only show "syncing" status for manual saves (less distracting)
    if (isManual) {
      setSyncStatus('syncing');
    }

    // Save to server in background
    try {
      await JournalStorage.save(updatedEntry);
      setSyncStatus('synced');
      if (autosaveError) {
        setAutosaveError(null);
        if (autosaveErrorTimeoutRef.current) {
          clearTimeout(autosaveErrorTimeoutRef.current);
        }
      }
    } catch (error) {
      console.error('Failed to save entry:', error);
      setSyncStatus('error');
      const errorMessage = error instanceof Error ? error.message : 'Failed to save';
      setAutosaveError(errorMessage);
      
      // Clear error message after 5 seconds
      if (autosaveErrorTimeoutRef.current) {
        clearTimeout(autosaveErrorTimeoutRef.current);
      }
      autosaveErrorTimeoutRef.current = setTimeout(() => {
        setAutosaveError(null);
      }, 5000);

      // If manual save, also show error in UI
      if (isManual) {
        throw error;
      }
    }
  }, [selectedId, entries, title, content, activeTemplate, autosaveError]);

  const handleManualSave = useCallback(async () => {
    setIsSaving(true);
    setShowSaveError(false);
    try {
      await handleSave(true);
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

  const handleRetrySave = useCallback(async () => {
    setAutosaveError(null);
    await handleSave();
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

    // Set sync status to 'local' when content changes
    if (syncStatus === 'synced') {
      setSyncStatus('local');
    }

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      handleSave(false);
    }, 2000);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [content, title, activeTemplate, selectedId, handleSave, syncStatus]);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-bg relative">
      {!isAuthLoading && !isAuthenticated && (
        <div className="bg-yellow-500/10 border-b border-yellow-500/30 px-4 py-2 flex items-center gap-2 shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500 shrink-0">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <span className="text-sm text-yellow-600 dark:text-yellow-400">
            <strong>Not logged in</strong> — Your notes are saved locally and may be lost if you clear browser data.{' '}
            <a href="/api/login" className="underline hover:text-yellow-700 dark:hover:text-yellow-300">Log in</a> to sync across devices.
          </span>
        </div>
      )}
      <div className="flex flex-1 overflow-hidden">
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
            {autosaveError && !showSaveError && (
              <div className="flex items-center gap-1">
                <span className="text-xs text-red-500 font-medium">Auto-save failed</span>
                <button
                  onClick={handleRetrySave}
                  className="text-xs text-red-500 hover:text-red-600 underline"
                  title="Retry save"
                >
                  Retry
                </button>
              </div>
            )}
            {!isAuthLoading && !isAuthenticated && (
              <span className="text-xs text-yellow-500 font-medium" title="Not logged in - saved locally only">Local Only</span>
            )}
            {isAuthenticated && !autosaveError && !showSaveError && syncStatus === 'synced' && (
              <span className="text-xs text-green-500/70 font-medium" title="Synced to server">●</span>
            )}
            {isAuthenticated && syncStatus === 'syncing' && (
              <span className="text-xs text-muted font-medium animate-pulse" title="Syncing...">Syncing...</span>
            )}
            {isAuthenticated && syncStatus === 'local' && (
              <span className="text-xs text-yellow-500/70 font-medium" title="Local changes pending sync">○</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleManualSave}
              disabled={isSaving}
              className="p-1.5 rounded-md transition-all duration-200 text-muted hover:text-green-500 hover:bg-green-500/15 hover:shadow-[0_0_8px_rgba(34,197,94,0.3)] disabled:opacity-50 disabled:hover:text-muted disabled:hover:bg-transparent disabled:hover:shadow-none"
              title="Save Entry"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-1.5 rounded-md transition-all duration-200 text-muted hover:text-red-500 hover:bg-red-500/15 hover:shadow-[0_0_8px_rgba(239,68,68,0.3)]"
              title="Delete Entry"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <span className="h-4 w-px bg-default/20"></span>
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

          {activeItem && (
            <BottomPanel
              item={activeItem}
              isOpen={bottomPanelOpen}
              onToggle={() => setBottomPanelOpen(!bottomPanelOpen)}
              height={bottomPanelHeight}
              onResize={handleResizeBottomPanel}
              onTagClick={handleBottomPanelTagClick}
              onSeeAlsoClick={handleBottomPanelSeeAlsoClick}
            />
          )}
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
            initialSearchQuery={referenceSearchQuery}
            onSearchQueryConsumed={() => setReferenceSearchQuery(null)}
          />
        </>
      )}
      </div>

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

      {showUnsavedWarning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-bg border border-default rounded-lg p-6 max-w-sm mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-default mb-2">Unsaved Changes</h3>
            <p className="text-sm text-muted mb-4">
              You have unsaved changes. Do you want to save before switching entries?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleUnsavedWarningCancel}
                className="px-3 py-1.5 rounded-md text-sm font-medium bg-bg-alt text-default border border-default hover:bg-bg-alt/80 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowUnsavedWarning(false);
                  if (pendingEntrySwitch) {
                    selectEntryDirect(pendingEntrySwitch);
                    setPendingEntrySwitch(null);
                  }
                }}
                className="px-3 py-1.5 rounded-md text-sm font-medium bg-bg text-default border border-default hover:bg-bg-alt transition-colors"
              >
                Discard
              </button>
              <button
                onClick={handleUnsavedWarningConfirm}
                className="px-3 py-1.5 rounded-md text-sm font-medium bg-accent text-accent-text hover:bg-accent-hover transition-colors"
              >
                Save & Switch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
