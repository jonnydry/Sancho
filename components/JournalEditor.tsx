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
      className={`w-1 hover:w-1.5 cursor-col-resize hover:bg-accent/50 transition-all z-10 flex flex-col justify-center items-center group relative ${isDragging ? 'bg-accent w-1.5' : 'bg-transparent'} ${className || ''}`}
      onMouseDown={() => setIsDragging(true)}
    >
        <div className={`w-0.5 h-8 rounded-full bg-border group-hover:bg-accent ${isDragging ? 'bg-accent' : ''}`} />
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
    const loadedEntries = JournalStorage.getAll();
    setEntries(loadedEntries);
    if (loadedEntries.length > 0) {
      selectEntry(loadedEntries[0]);
    } else {
      createNewEntry();
    }
  }, []);

  const selectEntry = useCallback((entry: JournalEntry) => {
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
        JournalStorage.save(entryToSave);
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

    setSelectedId(newEntry.id);
    setTitle(newEntry.title);
    setContent(newEntry.content);
    setActiveTemplate(newEntry.templateRef);
    previousSelectedIdRef.current = newEntry.id;
  }, []);

  const deleteEntry = useCallback((id: string) => {
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
    setEntries(updatedEntries);
  }, [selectedId, entries, title, content, activeTemplate]);

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
          <ResizeHandle onResize={handleResizeEntryList} className="border-r border-default/50" />
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
          <ResizeHandle onResize={handleResizeReferencePane} className="border-l border-default/50" />
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
    </div>
  );
};
