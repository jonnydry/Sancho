import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { PoetryItem } from '../types';
import { XIcon } from './icons/XIcon';
import { ArrowDownIcon } from './icons/ArrowDownIcon';
import { CheckIcon } from './icons/CheckIcon';
import { usePinnedItems } from '../contexts/PinnedItemsContext';
import { poetryData } from '../data/poetryData';
import { poeticDevicesData } from '../data/poeticDevicesData';
import { PoeticFormsIcon } from './icons/PoeticFormsIcon';
import { PoeticMetersIcon } from './icons/PoeticMetersIcon';
import { LiteraryDevicesIcon } from './icons/LiteraryDevicesIcon';

interface VerticalResizeHandleProps {
  onResize: (delta: number) => void;
}

const VerticalResizeHandle: React.FC<VerticalResizeHandleProps> = ({ onResize }) => {
  const [isDragging, setIsDragging] = useState(false);
  const startPosRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      onResize(e.movementY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (!startPosRef.current) return;
      const touch = e.touches[0];
      const delta = touch.clientY - startPosRef.current.y;
      onResize(delta);
      startPosRef.current.y = touch.clientY;
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
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        onResize(-step);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        onResize(step);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.cursor = 'row-resize';
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

  const handleStart = (clientY: number) => {
    setIsDragging(true);
    startPosRef.current = { x: 0, y: clientY };
  };

  return (
    <div
      className={`h-[3px] cursor-row-resize z-10 flex justify-center items-center group relative ${isDragging ? 'bg-accent/40' : 'bg-transparent hover:bg-accent/30'}`}
      onMouseDown={(e) => handleStart(e.clientY)}
      onTouchStart={(e) => {
        const touch = e.touches[0];
        handleStart(touch.clientY);
      }}
      role="separator"
      aria-orientation="horizontal"
      aria-label="Resize panel"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsDragging(true);
        }
      }}
    >
      <div className={`h-px w-5 rounded-full ${isDragging ? 'bg-accent' : 'bg-border/40 group-hover:bg-accent/60'}`} />
    </div>
  );
};

interface ReferencePaneProps {
    isOpen: boolean;
    onClose: () => void;
    selectedTemplate: string | undefined;
    onSelectTemplate: (name: string) => void;
    onInsert?: (text: string) => void;
    width?: number | string;
    initialSearchQuery?: string | null;
    onSearchQueryConsumed?: () => void;
}

type Tab = 'saved' | 'search';

export const ReferencePane: React.FC<ReferencePaneProps> = ({
    isOpen,
    onClose,
    selectedTemplate,
    onSelectTemplate,
    onInsert,
    width,
    initialSearchQuery,
    onSearchQueryConsumed,
}) => {
    const { pinnedItems, pinItem, unpinItem, isPinned } = usePinnedItems();
    const [activeTab, setActiveTab] = useState<Tab>(pinnedItems.length > 0 ? 'saved' : 'search');
    const [searchQuery, setSearchQuery] = useState('');
    const [inserting, setInserting] = useState<string | null>(null);
    const [expandedCategories, setExpandedCategories] = useState<{ forms: boolean; meters: boolean; devices: boolean }>({
        forms: false,
        meters: false,
        devices: false,
    });
    const [savedListHeight, setSavedListHeight] = useState(() => {
        const saved = localStorage.getItem('journal_saved_list_height');
        return saved ? parseInt(saved) : 100;
    });

    useEffect(() => {
        localStorage.setItem('journal_saved_list_height', savedListHeight.toString());
    }, [savedListHeight]);

    useEffect(() => {
        if (initialSearchQuery) {
            setSearchQuery(initialSearchQuery);
            setActiveTab('search');
            onSearchQueryConsumed?.();
        }
    }, [initialSearchQuery, onSearchQueryConsumed]);

    const handleResizeSavedList = useCallback((delta: number) => {
        setSavedListHeight(prev => {
            const newHeight = prev + delta;
            if (newHeight < 80) return 80;
            if (newHeight > 300) return 300;
            return newHeight;
        });
    }, []);

    // Combine data sources for search
    const allItems = useMemo(() => {
        return [...poetryData, ...poeticDevicesData];
    }, []);

    // Categorize items for browse sections
    const categorizedItems = useMemo(() => {
        const forms: PoetryItem[] = [];
        const meters: PoetryItem[] = [];
        const devices: PoetryItem[] = [];

        allItems.forEach((item) => {
            if (item.type === 'Form') forms.push(item);
            else if (item.type === 'Meter') meters.push(item);
            else if (item.type === 'Device') devices.push(item);
        });

        forms.sort((a, b) => a.name.localeCompare(b.name));
        meters.sort((a, b) => a.name.localeCompare(b.name));
        devices.sort((a, b) => a.name.localeCompare(b.name));

        return { forms, meters, devices };
    }, [allItems]);

    const toggleCategory = (category: 'forms' | 'meters' | 'devices') => {
        setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }));
    };

    // Filter items based on search query
    const searchResults = useMemo(() => {
        if (!searchQuery.trim()) return [];

        const query = searchQuery.toLowerCase();
        return allItems.filter(item =>
            item.name.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query) ||
            item.tags?.some(tag => tag.toLowerCase().includes(query))
        );
    }, [allItems, searchQuery]);

    // Handle setting active tab based on pinned items availability
    React.useEffect(() => {
        if (pinnedItems.length === 0 && activeTab === 'saved') {
            setActiveTab('search');
        }
    }, [pinnedItems.length, activeTab]);

    if (!isOpen) return null;

    const activeItemName = selectedTemplate;
    const activeItem = allItems.find(item => item.name === activeItemName);

    const handlePinToggle = async (e: React.MouseEvent, item: PoetryItem) => {
        e.stopPropagation();
        if (isPinned(item.name)) {
            await unpinItem(item.name);
        } else {
            await pinItem(item);
        }
    };

    const handleInsert = (text: string, id: string) => {
        if (onInsert) {
            onInsert(text);
            setInserting(id);
            setTimeout(() => setInserting(null), 1000);
        }
    };

    return (
        <div 
            className={`border-l border-default bg-bg-alt/20 flex flex-col h-full animate-slide-in-right absolute sm:relative z-10 sm:z-0 right-0 top-0 bottom-0 shadow-xl sm:shadow-none ${width ? '' : 'w-full sm:w-80'}`}
            style={width ? { width } : undefined}
        >
            {/* Header */}
            <div className="p-3 sm:p-4 border-b border-default flex items-center justify-between bg-bg shrink-0">
                <h3 className="text-sm font-bold text-default">Reference</h3>
                <button
                    onClick={onClose}
                    className="text-muted hover:text-default transition-colors p-1"
                    aria-label="Close reference pane"
                >
                    <XIcon className="w-4 h-4" />
                </button>
            </div>

            {/* Tabs */}
            <div className="flex bg-bg border-b border-default shrink-0">
                <button
                    onClick={() => setActiveTab('saved')}
                    className={`flex-1 py-2 text-xs font-medium transition-colors relative ${activeTab === 'saved'
                            ? 'text-default font-bold'
                            : 'text-muted hover:text-default'
                        }`}
                >
                    Saved
                    {activeTab === 'saved' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('search')}
                    className={`flex-1 py-2 text-xs font-medium transition-colors relative ${activeTab === 'search'
                            ? 'text-default font-bold'
                            : 'text-muted hover:text-default'
                        }`}
                >
                    Search
                    {activeTab === 'search' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
                    )}
                </button>
            </div>

            <div className="flex-1 flex flex-col min-h-0">
                {activeTab === 'saved' ? (
                    /* Saved Items View - fixed height, scrollable */
                    <div 
                        className="shrink-0 p-4 overflow-y-auto"
                        style={{ height: savedListHeight }}
                    >
                        {pinnedItems.length > 0 ? (
                            <div className="space-y-2">
                                <p className="text-xs text-muted mb-3 uppercase tracking-wider font-bold">Your Saved Items</p>
                                {pinnedItems.map(item => (
                                    <button
                                        key={item.name}
                                        onClick={() => onSelectTemplate(item.name)}
                                        className={`w-full text-left p-2 rounded-md border text-xs transition-all ${selectedTemplate === item.name
                                                ? 'bg-accent/10 border-accent text-default'
                                                : 'bg-bg border-default/50 text-muted hover:border-default hover:text-default'
                                            }`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium">{item.name}</span>
                                            <span className="text-[10px] opacity-60 bg-bg-alt px-1.5 py-0.5 rounded-full">{item.type}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted text-xs px-6">
                                <p className="mb-2">No saved items yet.</p>
                                <button
                                    onClick={() => setActiveTab('search')}
                                    className="text-accent hover:underline"
                                >
                                    Search to add items
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Search View */
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <div className="p-3 border-b border-default/30 bg-bg/50">
                            <input
                                type="text"
                                placeholder="Search forms, devices..."
                                className="w-full bg-bg border border-default rounded-sm px-3 py-1.5 text-xs text-default focus:border-accent focus:outline-none transition-colors placeholder:text-muted/50"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                            />
                        </div>

                        <div className="flex-1 overflow-y-auto p-2">
                            {searchResults.length > 0 ? (
                                <div className="space-y-1">
                                    {searchResults.map(item => (
                                        <div
                                            key={item.name}
                                            onClick={() => onSelectTemplate(item.name)}
                                            className={`group w-full text-left p-2 rounded-md border text-xs transition-all cursor-pointer relative ${selectedTemplate === item.name
                                                    ? 'bg-accent/10 border-accent text-default'
                                                    : 'bg-bg border-default/30 text-muted hover:border-default hover:text-default'
                                                }`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <span className="font-medium block">{item.name}</span>
                                                    <span className="text-[10px] opacity-70">{item.type}</span>
                                                </div>
                                                <button
                                                    onClick={(e) => handlePinToggle(e, item)}
                                                    className={`p-1 rounded-full transition-colors ${isPinned(item.name)
                                                            ? 'text-accent hover:text-accent-hover'
                                                            : 'text-muted/30 hover:text-default opacity-0 group-hover:opacity-100'
                                                        }`}
                                                    title={isPinned(item.name) ? "Unpin item" : "Pin item"}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill={isPinned(item.name) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <line x1="12" y1="17" x2="12" y2="22"></line>
                                                        <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : searchQuery ? (
                                <div className="text-center py-8 text-muted text-xs">
                                    <p>No results found for "{searchQuery}"</p>
                                </div>
                            ) : (
                                <div className="p-2 space-y-2">
                                    <p className="text-[10px] text-muted uppercase tracking-wider font-bold mb-3">Browse by Category</p>
                                    
                                    {/* Forms Section */}
                                    <div className="border border-default/30 rounded-md overflow-hidden">
                                        <button
                                            onClick={() => toggleCategory('forms')}
                                            className="w-full flex items-center justify-between px-3 py-2 bg-bg/50 hover:bg-bg transition-colors"
                                            aria-expanded={expandedCategories.forms}
                                        >
                                            <div className="flex items-center gap-2">
                                                <PoeticFormsIcon className="w-3.5 h-3.5 text-accent" />
                                                <span className="text-xs font-medium text-default">Forms</span>
                                                <span className="text-[10px] text-muted">({categorizedItems.forms.length})</span>
                                            </div>
                                            <svg
                                                className={`w-3 h-3 text-muted transition-transform duration-200 ${expandedCategories.forms ? 'rotate-180' : ''}`}
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        {expandedCategories.forms && (
                                            <div className="max-h-32 overflow-y-auto border-t border-default/20">
                                                {categorizedItems.forms.map((item) => (
                                                    <button
                                                        key={item.name}
                                                        onClick={() => onSelectTemplate(item.name)}
                                                        className="w-full text-left px-3 py-1.5 text-xs text-muted hover:text-default hover:bg-accent/10 transition-colors truncate"
                                                    >
                                                        {item.name}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Meters Section */}
                                    <div className="border border-default/30 rounded-md overflow-hidden">
                                        <button
                                            onClick={() => toggleCategory('meters')}
                                            className="w-full flex items-center justify-between px-3 py-2 bg-bg/50 hover:bg-bg transition-colors"
                                            aria-expanded={expandedCategories.meters}
                                        >
                                            <div className="flex items-center gap-2">
                                                <PoeticMetersIcon className="w-3.5 h-3.5 text-accent" />
                                                <span className="text-xs font-medium text-default">Meters</span>
                                                <span className="text-[10px] text-muted">({categorizedItems.meters.length})</span>
                                            </div>
                                            <svg
                                                className={`w-3 h-3 text-muted transition-transform duration-200 ${expandedCategories.meters ? 'rotate-180' : ''}`}
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        {expandedCategories.meters && (
                                            <div className="max-h-32 overflow-y-auto border-t border-default/20">
                                                {categorizedItems.meters.map((item) => (
                                                    <button
                                                        key={item.name}
                                                        onClick={() => onSelectTemplate(item.name)}
                                                        className="w-full text-left px-3 py-1.5 text-xs text-muted hover:text-default hover:bg-accent/10 transition-colors truncate"
                                                    >
                                                        {item.name}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Devices Section */}
                                    <div className="border border-default/30 rounded-md overflow-hidden">
                                        <button
                                            onClick={() => toggleCategory('devices')}
                                            className="w-full flex items-center justify-between px-3 py-2 bg-bg/50 hover:bg-bg transition-colors"
                                            aria-expanded={expandedCategories.devices}
                                        >
                                            <div className="flex items-center gap-2">
                                                <LiteraryDevicesIcon className="w-3.5 h-3.5 text-accent" />
                                                <span className="text-xs font-medium text-default">Devices</span>
                                                <span className="text-[10px] text-muted">({categorizedItems.devices.length})</span>
                                            </div>
                                            <svg
                                                className={`w-3 h-3 text-muted transition-transform duration-200 ${expandedCategories.devices ? 'rotate-180' : ''}`}
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        {expandedCategories.devices && (
                                            <div className="max-h-32 overflow-y-auto border-t border-default/20">
                                                {categorizedItems.devices.map((item) => (
                                                    <button
                                                        key={item.name}
                                                        onClick={() => onSelectTemplate(item.name)}
                                                        className="w-full text-left px-3 py-1.5 text-xs text-muted hover:text-default hover:bg-accent/10 transition-colors truncate"
                                                    >
                                                        {item.name}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Selected Item Details (Bottom Panel) - fits content, scrolls if needed */}
                {activeItem && (
                    <>
                    <VerticalResizeHandle onResize={handleResizeSavedList} />
                    <div className="flex-1 min-h-0 border-t border-default bg-bg overflow-y-auto">
                        <div className="p-4">
                        <div className="flex justify-between items-start mb-3">
                            <h4 className="font-bold text-sm text-default">{activeItem.name}</h4>
                            <button
                                onClick={(e) => handlePinToggle(e, activeItem)}
                                className={`text-xs flex items-center gap-1 transition-colors px-2 py-1 rounded-md ${isPinned(activeItem.name)
                                        ? 'bg-accent/10 text-accent hover:bg-accent/20'
                                        : 'bg-bg-alt text-muted hover:text-default'
                                    }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill={isPinned(activeItem.name) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="17" x2="12" y2="22"></line>
                                    <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path>
                                </svg>
                                {isPinned(activeItem.name) ? 'Saved' : 'Save'}
                            </button>
                        </div>

                        <div className="space-y-4 text-xs">
                            <p className="text-muted leading-relaxed">{activeItem.description}</p>

                            {activeItem.structure && activeItem.structure.length > 0 && (
                                <div>
                                    <div className="flex justify-between items-center mb-1.5">
                                        <h5 className="font-semibold uppercase tracking-wider text-muted text-[10px]">Structure</h5>
                                        {onInsert && (
                                            <button 
                                                onClick={() => handleInsert(activeItem.structure!.join('\n'), 'structure')}
                                                className="flex items-center gap-1 text-[10px] bg-accent/10 hover:bg-accent hover:text-accent-text text-accent px-1.5 py-0.5 rounded transition-colors"
                                                title="Insert structure into journal"
                                            >
                                                {inserting === 'structure' ? <CheckIcon className="w-3 h-3" /> : <ArrowDownIcon className="w-3 h-3" />}
                                                {inserting === 'structure' ? 'Inserted' : 'Insert'}
                                            </button>
                                        )}
                                    </div>
                                    <ul className="space-y-1 list-disc pl-4 text-default/80">
                                        {activeItem.structure.map((line, i) => (
                                            <li key={i}>{line}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {activeItem.exampleSnippet && (
                                <div>
                                    <div className="flex justify-between items-center mb-1.5">
                                        <h5 className="font-semibold uppercase tracking-wider text-muted text-[10px]">Example</h5>
                                        {onInsert && (
                                            <button 
                                                onClick={() => handleInsert(activeItem.exampleSnippet!, 'example')}
                                                className="flex items-center gap-1 text-[10px] bg-accent/10 hover:bg-accent hover:text-accent-text text-accent px-1.5 py-0.5 rounded transition-colors"
                                                title="Insert example into journal"
                                            >
                                                {inserting === 'example' ? <CheckIcon className="w-3 h-3" /> : <ArrowDownIcon className="w-3 h-3" />}
                                                {inserting === 'example' ? 'Inserted' : 'Insert'}
                                            </button>
                                        )}
                                    </div>
                                    <div className="p-2 bg-bg-alt/30 rounded border border-default/20 italic text-muted leading-relaxed">
                                        "{activeItem.exampleSnippet}"
                                    </div>
                                </div>
                            )}
                        </div>
                        </div>
                    </div>
                    </>
                )}
            </div>
        </div>
    );
};
