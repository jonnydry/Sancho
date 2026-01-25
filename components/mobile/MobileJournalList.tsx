import React, { useState, useCallback, useRef, memo, useEffect } from 'react';
import { JournalEntry } from '../../services/journalStorage';
import { SearchSparkleIcon } from '../icons/SearchSparkleIcon';
import { XIcon } from '../icons/XIcon';

interface MobileJournalListProps {
  entries: JournalEntry[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
  onToggleStar?: (id: string) => void;
  isLoading?: boolean;
}

// Entry item with swipe gestures
const MobileEntryItem: React.FC<{
  entry: JournalEntry;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onToggleStar?: () => void;
}> = memo(({ entry, isSelected, onSelect, onDelete, onToggleStar }) => {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const swipeThreshold = 80;

  // Reset delete confirm after timeout
  useEffect(() => {
    if (!showDeleteConfirm) return;
    const timeout = setTimeout(() => setShowDeleteConfirm(false), 3000);
    return () => clearTimeout(timeout);
  }, [showDeleteConfirm]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now(),
    };
    setIsSwiping(false);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;

    const deltaX = e.touches[0].clientX - touchStartRef.current.x;
    const deltaY = e.touches[0].clientY - touchStartRef.current.y;

    // Only swipe horizontally if more horizontal than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      e.preventDefault();
      setIsSwiping(true);
      // Limit swipe range with resistance
      const maxSwipe = 120;
      const resistance = 0.5;
      let limitedOffset = deltaX;

      if (Math.abs(deltaX) > maxSwipe) {
        const overflow = Math.abs(deltaX) - maxSwipe;
        limitedOffset = (deltaX > 0 ? 1 : -1) * (maxSwipe + overflow * resistance);
      }

      setSwipeOffset(Math.max(-140, Math.min(140, limitedOffset)));
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (Math.abs(swipeOffset) >= swipeThreshold) {
      if (swipeOffset < 0) {
        // Swipe left - show delete confirm
        setShowDeleteConfirm(true);
        // Haptic feedback
        if ('vibrate' in navigator) {
          navigator.vibrate(10);
        }
      } else if (swipeOffset > 0 && onToggleStar) {
        // Swipe right - toggle star
        onToggleStar();
        // Haptic feedback
        if ('vibrate' in navigator) {
          navigator.vibrate(10);
        }
      }
    }
    setSwipeOffset(0);
    setIsSwiping(false);
    touchStartRef.current = null;
  }, [swipeOffset, onToggleStar]);

  const handleDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    onDelete();
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate([10, 50, 10]);
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Swipe action backgrounds */}
      <div className="absolute inset-y-0 left-0 w-32 bg-yellow-500/20 flex items-center justify-start pl-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill={entry.isStarred ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="2"
          className="text-yellow-500"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
        <span className="ml-2 text-xs font-medium text-yellow-600 dark:text-yellow-400">
          {entry.isStarred ? 'Unstar' : 'Star'}
        </span>
      </div>
      <div className="absolute inset-y-0 right-0 w-32 bg-red-500/20 flex items-center justify-end pr-4">
        <span className="mr-2 text-xs font-medium text-red-600 dark:text-red-400">Delete</span>
        <XIcon className="w-5 h-5 text-red-500" />
      </div>

      {/* Main content */}
      <div
        className={`relative bg-bg border-l-2 transition-transform ${
          isSwiping ? '' : 'duration-200'
        } ${isSelected ? 'border-accent bg-bg-alt/50' : 'border-transparent'}`}
        style={{ transform: `translateX(${swipeOffset}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => !showDeleteConfirm && onSelect()}
      >
        <div className="px-4 py-3 active:bg-bg-alt/30">
          <div className="flex items-center gap-2">
            {entry.isStarred && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-yellow-500 shrink-0"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            )}
            <span className="font-medium text-default truncate flex-1">
              {entry.title || 'Untitled'}
            </span>
            <span className="text-xs text-muted shrink-0">
              {new Date(entry.updatedAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>

          {/* Preview of content */}
          {entry.content && (
            <p className="text-sm text-muted mt-1 line-clamp-2">
              {entry.content.substring(0, 120)}
            </p>
          )}

          {/* Tags */}
          {entry.tags && entry.tags.length > 0 && (
            <div className="flex items-center gap-1 mt-2 flex-wrap">
              {entry.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-1.5 py-0.5 rounded bg-accent/10 text-accent"
                >
                  #{tag}
                </span>
              ))}
              {entry.tags.length > 3 && (
                <span className="text-xs text-muted">+{entry.tags.length - 3}</span>
              )}
            </div>
          )}
        </div>

        {/* Delete confirmation overlay */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-red-500/95 flex items-center justify-between px-4 animate-fade-in-fast">
            <span className="text-white font-medium">Delete this entry?</span>
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteConfirm(false);
                }}
                className="px-3 py-1.5 rounded-lg bg-white/20 text-white text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteConfirm();
                }}
                className="px-3 py-1.5 rounded-lg bg-white text-red-500 text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export const MobileJournalList: React.FC<MobileJournalListProps> = ({
  entries,
  selectedId,
  onSelect,
  onCreate,
  onDelete,
  onToggleStar,
  isLoading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const pullStartY = useRef<number | null>(null);
  const [pullDistance, setPullDistance] = useState(0);

  // Filter entries by search
  const filteredEntries = searchQuery.trim()
    ? entries.filter(
        (entry) =>
          (entry.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
          (entry.content?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
          entry.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : entries;

  // Separate starred and unstarred
  const starredEntries = filteredEntries.filter((e) => e.isStarred);
  const recentEntries = filteredEntries.filter((e) => !e.isStarred);

  // Pull to refresh handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (listRef.current?.scrollTop === 0) {
      pullStartY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (pullStartY.current === null) return;

    const pullDelta = e.touches[0].clientY - pullStartY.current;
    if (pullDelta > 0 && listRef.current?.scrollTop === 0) {
      e.preventDefault();
      setPullDistance(Math.min(pullDelta * 0.5, 80));
    }
  };

  const handleTouchEnd = () => {
    if (pullDistance > 60) {
      setIsRefreshing(true);
      // Simulate refresh
      setTimeout(() => {
        setIsRefreshing(false);
        setPullDistance(0);
      }, 1000);
    } else {
      setPullDistance(0);
    }
    pullStartY.current = null;
  };

  return (
    <div className="flex flex-col h-full bg-bg">
      {/* Search bar */}
      <div className="px-4 pt-3 pb-2 sticky top-0 bg-bg z-10 safe-area-top">
        <div className="relative">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-bg-alt border border-default rounded-xl py-2.5 pl-10 pr-10 text-sm text-default focus:border-accent focus:outline-none transition-colors placeholder:text-muted/50"
          />
          <SearchSparkleIcon className="w-4 h-4 text-muted absolute left-3 top-3" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-muted interactive-muted rounded-full p-0.5 hover:bg-bg transition-colors"
            >
              <XIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Pull to refresh indicator */}
      {pullDistance > 0 && (
        <div
          className="flex items-center justify-center transition-all"
          style={{ height: pullDistance }}
        >
          <svg
            className={`w-5 h-5 text-accent ${isRefreshing ? 'animate-spin' : ''}`}
            style={{ transform: `rotate(${pullDistance * 3}deg)` }}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        </div>
      )}

      {/* Entry list */}
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm text-muted mt-2">Loading...</p>
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-bg-alt flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-muted"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <line x1="9" y1="15" x2="15" y2="15" />
              </svg>
            </div>
            <p className="text-muted font-medium">
              {searchQuery ? 'No matches found' : 'No entries yet'}
            </p>
            <p className="text-sm text-muted/70 mt-1">
              {searchQuery ? 'Try a different search' : 'Tap + to create your first note'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-default/30">
            {/* Starred section */}
            {starredEntries.length > 0 && (
              <div>
                <div className="px-4 py-2 bg-bg-alt/30 sticky top-0">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-yellow-500/80 uppercase tracking-wider">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    Starred
                  </div>
                </div>
                {starredEntries.map((entry) => (
                  <MobileEntryItem
                    key={entry.id}
                    entry={entry}
                    isSelected={selectedId === entry.id}
                    onSelect={() => onSelect(entry.id)}
                    onDelete={() => onDelete(entry.id)}
                    onToggleStar={onToggleStar ? () => onToggleStar(entry.id) : undefined}
                  />
                ))}
              </div>
            )}

            {/* Recent entries */}
            {recentEntries.length > 0 && (
              <div>
                {starredEntries.length > 0 && (
                  <div className="px-4 py-2 bg-bg-alt/30 sticky top-0">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-muted uppercase tracking-wider">
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      Recent
                    </div>
                  </div>
                )}
                {recentEntries.map((entry) => (
                  <MobileEntryItem
                    key={entry.id}
                    entry={entry}
                    isSelected={selectedId === entry.id}
                    onSelect={() => onSelect(entry.id)}
                    onDelete={() => onDelete(entry.id)}
                    onToggleStar={onToggleStar ? () => onToggleStar(entry.id) : undefined}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bottom padding for FAB */}
        <div className="h-24"></div>
      </div>

      {/* Floating action button */}
      <button
        onClick={onCreate}
        className="fixed right-4 bottom-20 w-14 h-14 rounded-full bg-accent text-accent-text shadow-lg flex items-center justify-center active:scale-95 transition-transform safe-area-bottom z-20"
        style={{ marginBottom: 'env(safe-area-inset-bottom, 0px)' }}
        aria-label="Create new entry"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>
    </div>
  );
};
