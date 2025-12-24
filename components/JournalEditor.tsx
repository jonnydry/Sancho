import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { JournalEntry, JournalStorage } from '../services/journalStorage';
import { usePinnedItems } from '../contexts/PinnedItemsContext';
import { JournalEntryList } from './JournalEntryList';
import { ReferencePane } from './ReferencePane';
import { GridIcon } from './icons/GridIcon';
import Editor from 'react-simple-wysiwyg';

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

interface ResizeHandleProps {
  onResize: (delta: number) => void;
  className?: string;
}

const FloatingToolbar: React.FC = memo(() => {
  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  return (
    <div className="absolute bottom-4 right-4 flex items-center gap-1 px-2 py-1.5 bg-bg/80 backdrop-blur-md border border-default/30 rounded-lg shadow-lg z-20">
      <button
        onClick={() => execCommand('bold')}
        className="p-1.5 rounded hover:bg-accent/20 text-muted hover:text-default transition-colors"
        title="Bold (Ctrl+B)"
        type="button"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" />
        </svg>
      </button>
      <button
        onClick={() => execCommand('italic')}
        className="p-1.5 rounded hover:bg-accent/20 text-muted hover:text-default transition-colors"
        title="Italic (Ctrl+I)"
        type="button"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 4h4m-2 0l-4 16m0 0h4" />
        </svg>
      </button>
      <span className="w-px h-4 bg-default/20 mx-0.5" />
      <button
        onClick={() => execCommand('formatBlock', 'h2')}
        className="p-1.5 rounded hover:bg-accent/20 text-muted hover:text-default transition-colors"
        title="Heading"
        type="button"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10" />
        </svg>
      </button>
      <button
        onClick={() => execCommand('insertUnorderedList')}
        className="p-1.5 rounded hover:bg-accent/20 text-muted hover:text-default transition-colors"
        title="Bullet List"
        type="button"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h.01M8 6h12M4 12h.01M8 12h12M4 18h.01M8 18h12" />
        </svg>
      </button>
      <button
        onClick={() => {
          const url = prompt('Enter URL:');
          if (url) execCommand('createLink', url);
        }}
        className="p-1.5 rounded hover:bg-accent/20 text-muted hover:text-default transition-colors"
        title="Insert Link"
        type="button"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      </button>
    </div>
  );
});

FloatingToolbar.displayName = 'FloatingToolbar';

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
        {/* Visual indicator line */}
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
  
  // Resizable Pane State
  const [entryListWidth, setEntryListWidth] = useState(240);
  const [referencePaneWidth, setReferencePaneWidth] = useState(320);

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousSelectedIdRef = useRef<string | null>(null);
  const savedSelectionRef = useRef<Range | null>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const currentStateRef = useRef<{ title: string; content: string; activeTemplate?: string; entries: JournalEntry[] }>({
    title: '',
    content: '',
    entries: []
  });
  
  // Continuously save selection while editor has focus (captures before blur)
  const handleSelectionChange = useCallback(() => {
    const selection = window.getSelection();
    const editorElement = editorContainerRef.current?.querySelector('[contenteditable="true"]');
    
    // Only save if selection is within our editor
    if (selection && selection.rangeCount > 0 && editorElement && editorElement.contains(selection.anchorNode)) {
      savedSelectionRef.current = selection.getRangeAt(0).cloneRange();
    }
  }, []);
  
  // Set up selectionchange listener for the document
  useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [handleSelectionChange]);

  // Load widths from localStorage
  useEffect(() => {
    const savedEntryWidth = localStorage.getItem('journal_entry_width');
    const savedRefWidth = localStorage.getItem('journal_ref_width');
    if (savedEntryWidth) setEntryListWidth(parseInt(savedEntryWidth));
    if (savedRefWidth) setReferencePaneWidth(parseInt(savedRefWidth));
  }, []);

  // Save widths to localStorage
  useEffect(() => {
    localStorage.setItem('journal_entry_width', entryListWidth.toString());
    localStorage.setItem('journal_ref_width', referencePaneWidth.toString());
  }, [entryListWidth, referencePaneWidth]);

  // Handle Resizing
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
      const newWidth = prev - delta; // Dragging left increases width
      if (newWidth < 240) return 240;
      if (newWidth > 600) return 600;
      return newWidth;
    });
  }, []);

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

    // Auto-generate title from first line if empty (strip HTML tags)
    let entryTitle = title;
    if (!entryTitle.trim()) {
      const textContent = content.replace(/<[^>]*>/g, '').trim();
      const firstLine = textContent.split('\n')[0].trim();
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
    // Get editor element within our container
    const editorElement = editorContainerRef.current?.querySelector('[contenteditable="true"]') as HTMLElement;
    
    if (!editorElement) {
      // Fallback: append to content
      setContent(prev => prev + '<br><br>' + textToInsert);
      return;
    }
    
    // Focus the editor first
    editorElement.focus();
    
    // Restore saved selection if available
    const selection = window.getSelection();
    if (selection && savedSelectionRef.current) {
      try {
        selection.removeAllRanges();
        selection.addRange(savedSelectionRef.current);
      } catch (e) {
        // Selection restoration failed, will fall back to end of content
      }
    }
    
    // Check if we have a valid selection inside the editor
    if (selection && selection.rangeCount > 0 && editorElement.contains(selection.anchorNode)) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      
      // Create a temporary container to parse the HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = '<br><br>' + textToInsert;
      
      // Insert nodes
      const fragment = document.createDocumentFragment();
      while (tempDiv.firstChild) {
        fragment.appendChild(tempDiv.firstChild);
      }
      range.insertNode(fragment);
      
      // Move cursor to end of inserted content
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
      
      // Update React state with the new HTML content
      setContent(editorElement.innerHTML);
      
      // Clear saved selection
      savedSelectionRef.current = null;
    } else {
      // Fallback: append to content
      setContent(prev => prev + '<br><br>' + textToInsert);
    }
  }, []);

  // Debounced auto-save
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
      {/* Left Pane: Entry List */}
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

      {/* Middle Pane: Editor */}
      <div className="flex-1 flex flex-col min-w-[300px] transition-all duration-300">
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
              {content.replace(/<[^>]*>/g, '').length} chars
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

          <div 
            ref={editorContainerRef}
            className="flex-1 relative overflow-auto px-4 sm:px-6 py-2"
          >
            <Editor
              value={content}
              onChange={(e) => setContent(e.target.value)}
              containerProps={{
                style: {
                  minHeight: '100%',
                  border: 'none',
                  background: 'transparent',
                }
              }}
              style={{
                minHeight: '100%',
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '0.875rem',
                lineHeight: '1.625',
                color: 'inherit',
              }}
            />
            <FloatingToolbar />
          </div>
        </div>
      </div>

      {/* Right Pane: Reference */}
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
