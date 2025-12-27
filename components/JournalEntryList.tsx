import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { JournalEntry } from '../services/journalStorage';
import { SearchSparkleIcon } from './icons/SearchSparkleIcon';
import { XIcon } from './icons/XIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { 
  getAllTagsFromEntries, 
  getTagCounts, 
  filterEntriesByTag, 
  getUntaggedEntries 
} from '../utils/tagUtils';

type ViewMode = 'all' | 'tags';

interface JournalEntryListProps {
  entries: JournalEntry[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
  onToggleStar?: (id: string) => void;
  width?: number | string;
}

// Entry item component
const EntryItem: React.FC<{
  entry: JournalEntry;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onToggleStar?: () => void;
  pendingDelete: boolean;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
  compact?: boolean;
}> = ({ 
  entry, 
  isSelected, 
  onSelect, 
  onDelete, 
  onToggleStar,
  pendingDelete,
  onConfirmDelete,
  onCancelDelete,
  compact = false,
}) => {
  return (
    <div 
      className={`group cursor-pointer border-l-2 transition-all duration-200 hover:bg-bg-alt/50 ${
        isSelected ? 'border-accent bg-bg-alt' : 'border-transparent'
      } ${compact ? 'px-2 py-1.5' : 'p-3'}`}
    >
      <div 
        onClick={onSelect}
        className="flex-1 w-full overflow-hidden"
      >
        <div className="flex items-center gap-1.5">
          {/* Star indicator */}
          {entry.isStarred && (
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-500 shrink-0">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          )}
          {/* Title */}
          <div className={`font-medium text-default truncate ${compact ? 'text-xs' : 'text-sm'}`}>
            {entry.title || 'Untitled'}
          </div>
        </div>
        
        {/* Content Preview (Desktop, non-compact) */}
        {!compact && (
          <div className="hidden sm:block text-xs text-muted/70 truncate mb-2 mt-1">
            {entry.content?.slice(0, 60) || <span className="italic opacity-50">Empty note...</span>}
          </div>
        )}

        {/* Tags preview */}
        {!compact && entry.tags && entry.tags.length > 0 && (
          <div className="hidden sm:flex flex-wrap gap-1 mb-1">
            {entry.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-[9px] px-1.5 py-0.5 bg-accent/10 text-accent/80 rounded">
                #{tag}
              </span>
            ))}
            {entry.tags.length > 3 && (
              <span className="text-[9px] text-muted">+{entry.tags.length - 3}</span>
            )}
          </div>
        )}

        {/* Mobile Date (fallback) */}
        {!compact && (
          <div className="sm:hidden text-[10px] text-muted text-center mt-1">
            {new Date(entry.updatedAt).getDate()}
          </div>
        )}
      </div>

      {/* Footer: Date, Star & Delete */}
      <div className={`hidden sm:flex items-center justify-between ${compact ? 'mt-0.5' : 'mt-1'}`}>
        <span className="text-[10px] text-muted">
          {new Date(entry.updatedAt).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' })}
        </span>
        <div className="flex items-center gap-0.5">
          {/* Star button */}
          {onToggleStar && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStar();
              }}
              className={`p-1 rounded transition-all duration-200 ${
                entry.isStarred 
                  ? 'text-yellow-500 opacity-100' 
                  : 'opacity-0 group-hover:opacity-100 text-muted/50 hover:text-yellow-500'
              }`}
              title={entry.isStarred ? 'Unstar' : 'Star'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill={entry.isStarred ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </button>
          )}
          {/* Delete button */}
          {pendingDelete ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onConfirmDelete();
              }}
              className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-500 text-white hover:bg-red-600 transition-colors animate-pulse"
            >
              Confirm
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1 rounded transition-all duration-200 opacity-0 group-hover:opacity-100 text-muted/50 hover:text-red-500 hover:bg-red-500/15"
              title="Delete entry"
            >
              <XIcon className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Folder component for tag grouping
const TagFolder: React.FC<{
  tag: string;
  count: number;
  entries: JournalEntry[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleStar?: (id: string) => void;
  pendingDeleteId: string | null;
  setPendingDeleteId: (id: string | null) => void;
  defaultExpanded?: boolean;
}> = ({ 
  tag, 
  count, 
  entries, 
  selectedId, 
  onSelect, 
  onDelete, 
  onToggleStar,
  pendingDeleteId,
  setPendingDeleteId,
  defaultExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="border-b border-default/20 last:border-b-0">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-bg-alt/30 transition-colors"
      >
        <ChevronDownIcon 
          className={`w-3 h-3 text-muted transition-transform ${isExpanded ? '' : '-rotate-90'}`} 
        />
        <span className="text-xs font-medium text-accent">#{tag}</span>
        <span className="text-[10px] text-muted ml-auto">{count}</span>
      </button>
      
      {isExpanded && (
        <div className="pl-2">
          {entries.map(entry => (
            <EntryItem
              key={entry.id}
              entry={entry}
              isSelected={selectedId === entry.id}
              onSelect={() => onSelect(entry.id)}
              onDelete={() => setPendingDeleteId(entry.id)}
              onToggleStar={onToggleStar ? () => onToggleStar(entry.id) : undefined}
              pendingDelete={pendingDeleteId === entry.id}
              onConfirmDelete={() => {
                setPendingDeleteId(null);
                onDelete(entry.id);
              }}
              onCancelDelete={() => setPendingDeleteId(null)}
              compact
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const JournalEntryList: React.FC<JournalEntryListProps> = ({
  entries,
  selectedId,
  onSelect,
  onCreate,
  onDelete,
  onToggleStar,
  width,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const confirmTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounce search query (300ms delay)
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

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

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (confirmTimeoutRef.current) {
        clearTimeout(confirmTimeoutRef.current);
      }
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Filter entries by search
  const filteredEntries = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return entries;
    const query = debouncedSearchQuery.toLowerCase();
    return entries.filter(entry => 
      (entry.title?.toLowerCase() || '').includes(query) || 
      (entry.content?.toLowerCase() || '').includes(query) ||
      (entry.tags?.some(tag => tag.toLowerCase().includes(query)))
    );
  }, [entries, debouncedSearchQuery]);

  // Get starred entries
  const starredEntries = useMemo(() => {
    return filteredEntries.filter(e => e.isStarred);
  }, [filteredEntries]);

  // Get recent entries (last 5 accessed, excluding starred)
  const recentEntries = useMemo(() => {
    return filteredEntries
      .filter(e => !e.isStarred)
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, 5);
  }, [filteredEntries]);

  // Get all unique tags
  const allTags = useMemo(() => getAllTagsFromEntries(filteredEntries), [filteredEntries]);
  
  // Get tag counts
  const tagCounts = useMemo(() => getTagCounts(filteredEntries), [filteredEntries]);
  
  // Get untagged entries
  const untaggedEntries = useMemo(() => getUntaggedEntries(filteredEntries), [filteredEntries]);

  return (
    <div 
      className={`border-r border-default flex flex-col h-full bg-bg-alt/30 transition-all duration-300 ${width ? '' : 'w-16 sm:w-64'}`}
      style={width ? { width } : undefined}
    >
      {/* Header & Search */}
      <div className="p-2 sm:p-3 border-b border-default flex flex-col gap-2">
        <div className="flex justify-center sm:justify-between items-center">
          <span className="hidden sm:block text-xs font-bold text-muted uppercase tracking-wider">Notes</span>
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
            placeholder="Search notes..."
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

        {/* View Toggle */}
        <div className="hidden sm:flex gap-1 p-0.5 bg-bg rounded-md">
          <button
            onClick={() => setViewMode('all')}
            className={`flex-1 px-2 py-1 text-[10px] font-medium rounded transition-colors ${
              viewMode === 'all' 
                ? 'bg-accent/15 text-accent' 
                : 'text-muted hover:text-default'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setViewMode('tags')}
            className={`flex-1 px-2 py-1 text-[10px] font-medium rounded transition-colors ${
              viewMode === 'tags' 
                ? 'bg-accent/15 text-accent' 
                : 'text-muted hover:text-default'
            }`}
          >
            By Tag
          </button>
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
        ) : viewMode === 'all' ? (
          /* All Notes View */
          <>
            {/* Starred Section */}
            {starredEntries.length > 0 && (
              <div className="border-b border-default/30">
                <div className="px-3 py-1.5 text-[10px] font-bold text-yellow-500/80 uppercase tracking-wider flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                  Starred
                </div>
                {starredEntries.map(entry => (
                  <EntryItem
                    key={entry.id}
                    entry={entry}
                    isSelected={selectedId === entry.id}
                    onSelect={() => onSelect(entry.id)}
                    onDelete={() => setPendingDeleteId(entry.id)}
                    onToggleStar={onToggleStar ? () => onToggleStar(entry.id) : undefined}
                    pendingDelete={pendingDeleteId === entry.id}
                    onConfirmDelete={() => {
                      setPendingDeleteId(null);
                      onDelete(entry.id);
                    }}
                    onCancelDelete={() => setPendingDeleteId(null)}
                  />
                ))}
              </div>
            )}

            {/* Recent Section */}
            {recentEntries.length > 0 && (
              <div className="border-b border-default/30">
                <div className="px-3 py-1.5 text-[10px] font-bold text-muted uppercase tracking-wider flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  Recent
                </div>
                {recentEntries.map(entry => (
                  <EntryItem
                    key={entry.id}
                    entry={entry}
                    isSelected={selectedId === entry.id}
                    onSelect={() => onSelect(entry.id)}
                    onDelete={() => setPendingDeleteId(entry.id)}
                    onToggleStar={onToggleStar ? () => onToggleStar(entry.id) : undefined}
                    pendingDelete={pendingDeleteId === entry.id}
                    onConfirmDelete={() => {
                      setPendingDeleteId(null);
                      onDelete(entry.id);
                    }}
                    onCancelDelete={() => setPendingDeleteId(null)}
                  />
                ))}
              </div>
            )}

            {/* All Entries */}
            {filteredEntries.length > starredEntries.length && (
              <div>
                <div className="px-3 py-1.5 text-[10px] font-bold text-muted uppercase tracking-wider">
                  All Notes ({filteredEntries.length})
                </div>
                {filteredEntries
                  .filter(e => !e.isStarred)
                  .slice(recentEntries.length > 0 ? 5 : 0) // Skip recent if shown
                  .map(entry => (
                    <EntryItem
                      key={entry.id}
                      entry={entry}
                      isSelected={selectedId === entry.id}
                      onSelect={() => onSelect(entry.id)}
                      onDelete={() => setPendingDeleteId(entry.id)}
                      onToggleStar={onToggleStar ? () => onToggleStar(entry.id) : undefined}
                      pendingDelete={pendingDeleteId === entry.id}
                      onConfirmDelete={() => {
                        setPendingDeleteId(null);
                        onDelete(entry.id);
                      }}
                      onCancelDelete={() => setPendingDeleteId(null)}
                    />
                  ))}
              </div>
            )}
          </>
        ) : (
          /* Tags View */
          <>
            {/* Starred Folder */}
            {starredEntries.length > 0 && (
              <TagFolder
                tag="starred"
                count={starredEntries.length}
                entries={starredEntries}
                selectedId={selectedId}
                onSelect={onSelect}
                onDelete={onDelete}
                onToggleStar={onToggleStar}
                pendingDeleteId={pendingDeleteId}
                setPendingDeleteId={setPendingDeleteId}
                defaultExpanded
              />
            )}

            {/* Tag Folders */}
            {allTags.map(tag => (
              <TagFolder
                key={tag}
                tag={tag}
                count={tagCounts.get(tag) || 0}
                entries={filterEntriesByTag(filteredEntries, tag)}
                selectedId={selectedId}
                onSelect={onSelect}
                onDelete={onDelete}
                onToggleStar={onToggleStar}
                pendingDeleteId={pendingDeleteId}
                setPendingDeleteId={setPendingDeleteId}
              />
            ))}

            {/* Untagged Folder */}
            {untaggedEntries.length > 0 && (
              <TagFolder
                tag="untagged"
                count={untaggedEntries.length}
                entries={untaggedEntries}
                selectedId={selectedId}
                onSelect={onSelect}
                onDelete={onDelete}
                onToggleStar={onToggleStar}
                pendingDeleteId={pendingDeleteId}
                setPendingDeleteId={setPendingDeleteId}
              />
            )}

            {/* No tags message */}
            {allTags.length === 0 && untaggedEntries.length === 0 && starredEntries.length === 0 && (
              <div className="p-4 text-center">
                <p className="text-xs text-muted">No tags yet</p>
                <p className="text-[10px] text-muted/60 mt-1">Add #tags to your notes</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
