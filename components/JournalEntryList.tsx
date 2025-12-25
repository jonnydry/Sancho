import React, { useState, useMemo, useEffect, useRef } from 'react';
import { JournalEntry } from '../services/journalStorage';
import { SearchSparkleIcon } from './icons/SearchSparkleIcon';
import { XIcon } from './icons/XIcon';

interface JournalEntryListProps {
  entries: JournalEntry[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
  width?: number | string;
}

export const JournalEntryList: React.FC<JournalEntryListProps> = ({
  entries,
  selectedId,
  onSelect,
  onCreate,
  onDelete,
  width,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const confirmTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-cancel confirmation after 2 seconds
  useEffect(() => {
    if (pendingDeleteId) {
      confirmTimeoutRef.current = setTimeout(() => {
        setPendingDeleteId(null);
      }, 2000);
    }
    return () => {
      if (confirmTimeoutRef.current) {
        clearTimeout(confirmTimeoutRef.current);
      }
    };
  }, [pendingDeleteId]);

  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return entries;
    const query = searchQuery.toLowerCase();
    return entries.filter(entry => 
      (entry.title?.toLowerCase() || '').includes(query) || 
      (entry.content?.toLowerCase() || '').includes(query)
    );
  }, [entries, searchQuery]);

  return (
    <div 
      className={`border-r border-default flex flex-col h-full bg-bg-alt/30 transition-all duration-300 ${width ? '' : 'w-16 sm:w-64'}`}
      style={width ? { width } : undefined}
    >
      {/* Header & Search */}
      <div className="p-2 sm:p-3 border-b border-default flex flex-col gap-2">
        <div className="flex justify-center sm:justify-between items-center">
          <span className="hidden sm:block text-xs font-bold text-muted uppercase tracking-wider">Entries</span>
          <button 
            onClick={onCreate}
            className="p-1.5 rounded-full text-muted hover:bg-accent/10 hover:text-default transition-colors"
            title="New Entry"
            aria-label="Create new journal entry"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
        
        {/* Search Input (Desktop only) */}
        <div className="hidden sm:block relative">
          <input
            type="text"
            placeholder="Search entries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-bg border border-default rounded-sm py-1 pl-7 pr-6 text-xs text-default focus:border-accent focus:outline-none transition-colors placeholder:text-muted/50"
          />
          <SearchSparkleIcon className="w-3 h-3 text-muted absolute left-2 top-1.5" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1.5 text-muted hover:text-default"
            >
              <XIcon className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Entry List */}
      <div className="overflow-y-auto flex-1">
        {filteredEntries.length === 0 ? (
          <div className="p-4 text-center">
            <p className="hidden sm:block text-xs text-muted">
              {searchQuery ? 'No matches' : 'No entries'}
            </p>
            <p className="sm:hidden text-xs text-muted">-</p>
          </div>
        ) : (
          filteredEntries.map(entry => (
            <div 
              key={entry.id}
              className={`group p-3 cursor-pointer border-l-2 transition-all duration-200 hover:bg-bg-alt/50 ${
                selectedId === entry.id ? 'border-accent bg-bg-alt' : 'border-transparent'
              }`}
            >
              <div 
                onClick={() => onSelect(entry.id)}
                className="flex-1 w-full overflow-hidden"
              >
                {/* Title */}
                <div className="font-medium text-sm text-default truncate mb-1">
                  {entry.title || 'Untitled'}
                </div>
                
                {/* Content Preview (Desktop) */}
                <div className="hidden sm:block text-xs text-muted/70 truncate mb-2">
                  {entry.content?.slice(0, 60) || <span className="italic opacity-50">Empty note...</span>}
                </div>

                {/* Mobile Date (fallback) */}
                <div className="sm:hidden text-[10px] text-muted text-center mt-1">
                  {new Date(entry.updatedAt).getDate()}
                </div>
              </div>

              {/* Footer: Date & Delete */}
              <div className="hidden sm:flex items-center justify-between mt-1">
                <span className="text-[10px] text-muted">
                  {new Date(entry.updatedAt).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' })}
                </span>
                {pendingDeleteId === entry.id ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPendingDeleteId(null);
                      onDelete(entry.id);
                    }}
                    className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-500 text-white hover:bg-red-600 transition-colors animate-pulse"
                  >
                    Confirm
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPendingDeleteId(entry.id);
                    }}
                    className="p-1 rounded transition-all duration-200 opacity-0 group-hover:opacity-100 text-muted/50 hover:text-red-500 hover:bg-red-500/15 hover:shadow-[0_0_6px_rgba(239,68,68,0.25)]"
                    title="Delete entry"
                    aria-label={`Delete entry: ${entry.title || 'Untitled'}`}
                  >
                    <XIcon className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
