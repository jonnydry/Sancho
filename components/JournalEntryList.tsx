import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
  memo,
} from "react";
import { List } from "react-window";
import { JournalEntry } from "../services/journalStorage";
import { SearchSparkleIcon } from "./icons/SearchSparkleIcon";
import { XIcon } from "./icons/XIcon";
import { ChevronDownIcon } from "./icons/ChevronDownIcon";
import {
  getAllTagsFromEntries,
  getTagCounts,
  filterEntriesByTag,
  getUntaggedEntries,
} from "../utils/tagUtils";

type ViewMode = "all" | "tags";

// Row types for virtualized list
type VirtualRow =
  | { type: "header"; label: string; icon?: "star" | "clock"; count?: number }
  | { type: "entry"; entry: JournalEntry };

interface JournalEntryListProps {
  entries: JournalEntry[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
  onToggleStar?: (id: string) => void;
  width?: number | string;
}

// Entry item component with swipe support - memoized to prevent unnecessary re-renders
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
}> = memo(({
  entry,
  isSelected,
  onSelect,
  onDelete,
  onToggleStar,
  pendingDelete,
  onConfirmDelete,
  onCancelDelete: _onCancelDelete,
  compact = false,
}) => {
  // Note: _onCancelDelete is unused but kept for API consistency
  void _onCancelDelete;
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const swipeThreshold = 60;

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
    setIsSwiping(false);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;

    const deltaX = e.touches[0].clientX - touchStartRef.current.x;
    const deltaY = e.touches[0].clientY - touchStartRef.current.y;

    // Only swipe horizontally if more horizontal than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      setIsSwiping(true);
      // Limit swipe range
      const limitedOffset = Math.max(-100, Math.min(100, deltaX));
      setSwipeOffset(limitedOffset);
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (Math.abs(swipeOffset) >= swipeThreshold) {
      if (swipeOffset < 0) {
        // Swipe left - delete
        onDelete();
      } else if (swipeOffset > 0 && onToggleStar) {
        // Swipe right - star
        onToggleStar();
      }
    }
    setSwipeOffset(0);
    setIsSwiping(false);
    touchStartRef.current = null;
  }, [swipeOffset, onDelete, onToggleStar]);

  return (
    <div className="relative overflow-hidden">
      {/* Swipe action backgrounds */}
      <div className="absolute inset-y-0 left-0 w-24 bg-yellow-500/20 flex items-center justify-start pl-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={entry.isStarred ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          className="text-yellow-500"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </div>
      <div className="absolute inset-y-0 right-0 w-24 bg-red-500/20 flex items-center justify-end pr-3">
        <XIcon className="w-4 h-4 text-red-500" />
      </div>

      {/* Main content */}
      <div
        className={`relative group cursor-pointer border-l-2 transition-all bg-bg ${
          isSwiping ? "" : "duration-200"
        } hover:bg-bg-alt/50 ${
          isSelected ? "border-accent bg-bg-alt" : "border-transparent"
        } ${compact ? "px-2 py-1" : "px-2 py-1.5"}`}
        style={{ transform: `translateX(${swipeOffset}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={onSelect}
      >
        <div className="flex-1 w-full overflow-hidden">
          <div className="flex items-center gap-1.5">
            {/* Star indicator */}
            {entry.isStarred && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="9"
                height="9"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-yellow-500 shrink-0"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            )}
            {/* Title */}
            <div className="journal-font font-medium text-default truncate flex-1">
              {entry.title || "Untitled"}
            </div>
            {/* Inline date */}
            <span className="hidden sm:block text-[11px] text-muted/60 shrink-0">
              {new Date(entry.updatedAt).toLocaleDateString(undefined, {
                month: "numeric",
                day: "numeric",
              })}
            </span>
          </div>

          {/* Mobile Date (fallback) */}
          {!compact && (
            <div className="sm:hidden text-[11px] text-muted text-center mt-0.5">
              {new Date(entry.updatedAt).getDate()}
            </div>
          )}
        </div>

        {/* Footer: Star & Delete buttons - visible on hover (desktop) and always on mobile */}
        <div
          className={`flex items-center justify-end gap-0.5 ${compact ? "mt-0" : "mt-0.5"}`}
        >
          <div className="flex items-center gap-0.5">
            {/* Star button */}
            {onToggleStar && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleStar();
                }}
                className={`p-1.5 sm:p-1 rounded transition-all duration-200 ${
                  entry.isStarred
                    ? "text-yellow-500 opacity-100"
                    : "opacity-100 sm:opacity-0 sm:group-hover:opacity-100 text-muted/50 hover:text-yellow-500"
                }`}
                title={entry.isStarred ? "Unstar" : "Star"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill={entry.isStarred ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
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
                className="px-2 py-1 sm:px-1.5 sm:py-0.5 rounded text-xs font-medium bg-red-500 text-white hover:bg-red-600 transition-colors animate-pulse"
              >
                Confirm
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="p-1.5 sm:p-1 rounded transition-all duration-200 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 text-muted/50 hover:text-red-500 hover:bg-red-500/15"
                title="Delete entry"
              >
                <XIcon className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for memo optimization
  return (
    prevProps.entry.id === nextProps.entry.id &&
    prevProps.entry.title === nextProps.entry.title &&
    prevProps.entry.updatedAt === nextProps.entry.updatedAt &&
    prevProps.entry.isStarred === nextProps.entry.isStarred &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.pendingDelete === nextProps.pendingDelete &&
    prevProps.compact === nextProps.compact
  );
});

// Folder component for tag grouping - memoized for performance
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
}> = memo(({
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
          className={`w-3 h-3 text-muted transition-transform ${isExpanded ? "" : "-rotate-90"}`}
        />
        <span className="text-xs font-medium text-accent">#{tag}</span>
        <span className="text-xs text-muted ml-auto">{count}</span>
      </button>

      {isExpanded && (
        <div className="pl-2">
          {entries.map((entry) => (
            <EntryItem
              key={entry.id}
              entry={entry}
              isSelected={selectedId === entry.id}
              onSelect={() => onSelect(entry.id)}
              onDelete={() => setPendingDeleteId(entry.id)}
              onToggleStar={
                onToggleStar ? () => onToggleStar(entry.id) : undefined
              }
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
}, (prevProps, nextProps) => {
  // Only re-render if relevant props changed
  return (
    prevProps.tag === nextProps.tag &&
    prevProps.count === nextProps.count &&
    prevProps.entries.length === nextProps.entries.length &&
    prevProps.selectedId === nextProps.selectedId &&
    prevProps.pendingDeleteId === nextProps.pendingDeleteId &&
    prevProps.defaultExpanded === nextProps.defaultExpanded
  );
});

// Virtual row renderer for the "All" view - memoized for virtualization performance
interface VirtualRowData {
  rows: VirtualRow[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleStar?: (id: string) => void;
  pendingDeleteId: string | null;
  setPendingDeleteId: (id: string | null) => void;
}

interface VirtualRowProps {
  index: number;
  style: React.CSSProperties;
  data: VirtualRowData;
}

const VirtualRowRenderer: React.FC<VirtualRowProps> = memo(({
  index,
  style,
  data,
}) => {
  const {
    rows,
    selectedId,
    onSelect,
    onDelete,
    onToggleStar,
    pendingDeleteId,
    setPendingDeleteId,
  } = data;
  const row = rows[index];

  if (row.type === "header") {
    return (
      <div
        style={style}
        className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1 border-b border-default/30 bg-bg-alt/30"
      >
        {row.icon === "star" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-yellow-500/80"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        )}
        {row.icon === "clock" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-muted"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        )}
        <span
          className={row.icon === "star" ? "text-yellow-500/80" : "text-muted"}
        >
          {row.label}
        </span>
        {row.count !== undefined && (
          <span className="text-muted ml-auto">({row.count})</span>
        )}
      </div>
    );
  }

  const entry = row.entry;
  return (
    <div style={style}>
      <EntryItem
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
    </div>
  );
});

export const JournalEntryList: React.FC<JournalEntryListProps> = ({
  entries,
  selectedId,
  onSelect,
  onCreate,
  onDelete,
  onToggleStar,
  width,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const confirmTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounce search query (150ms delay - faster for better UX)
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 150);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // Auto-cancel confirmation after 5 seconds (increased for better UX)
  useEffect(() => {
    if (pendingDeleteId) {
      confirmTimeoutRef.current = setTimeout(() => {
        setPendingDeleteId(null);
      }, 5000);
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
    return entries.filter(
      (entry) =>
        (entry.title?.toLowerCase() || "").includes(query) ||
        (entry.content?.toLowerCase() || "").includes(query) ||
        entry.tags?.some((tag) => tag.toLowerCase().includes(query)),
    );
  }, [entries, debouncedSearchQuery]);

  // Get starred entries
  const starredEntries = useMemo(() => {
    return filteredEntries.filter((e) => e.isStarred);
  }, [filteredEntries]);

  // Get recent entries (first 5 non-starred, in original order)
  const recentEntries = useMemo(() => {
    return filteredEntries.filter((e) => !e.isStarred).slice(0, 5);
  }, [filteredEntries]);

  // Get all unique tags
  const allTags = useMemo(
    () => getAllTagsFromEntries(filteredEntries),
    [filteredEntries],
  );

  // Get tag counts
  const tagCounts = useMemo(
    () => getTagCounts(filteredEntries),
    [filteredEntries],
  );

  // Get untagged entries
  const untaggedEntries = useMemo(
    () => getUntaggedEntries(filteredEntries),
    [filteredEntries],
  );

  // Build virtualized rows for "All" view
  const virtualRows = useMemo((): VirtualRow[] => {
    const rows: VirtualRow[] = [];

    // Starred section
    if (starredEntries.length > 0) {
      rows.push({ type: "header", label: "Starred", icon: "star" });
      starredEntries.forEach((entry) => rows.push({ type: "entry", entry }));
    }

    // Recent section (first 5 non-starred)
    if (recentEntries.length > 0) {
      rows.push({ type: "header", label: "Recent", icon: "clock" });
      recentEntries.forEach((entry) => rows.push({ type: "entry", entry }));
    }

    // Older notes (beyond first 5 non-starred)
    const olderEntries = filteredEntries.filter((e) => !e.isStarred).slice(5);
    if (olderEntries.length > 0) {
      rows.push({
        type: "header",
        label: "Older Notes",
        count: olderEntries.length,
      });
      olderEntries.forEach((entry) => rows.push({ type: "entry", entry }));
    }

    return rows;
  }, [filteredEntries, starredEntries, recentEntries]);

  // Container ref for getting height
  const listContainerRef = useRef<HTMLDivElement>(null);
  const [listHeight, setListHeight] = useState(400);

  // Update list height on resize
  useEffect(() => {
    const updateHeight = () => {
      if (listContainerRef.current) {
        setListHeight(listContainerRef.current.clientHeight);
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  // Item data for virtualized list
  const itemData = useMemo(
    (): VirtualRowData => ({
      rows: virtualRows,
      selectedId,
      onSelect,
      onDelete,
      onToggleStar,
      pendingDeleteId,
      setPendingDeleteId,
    }),
    [
      virtualRows,
      selectedId,
      onSelect,
      onDelete,
      onToggleStar,
      pendingDeleteId,
    ],
  );

  // Constants for row heights
  const ENTRY_HEIGHT = 40;

  // Use virtualization only when there are many entries (threshold: 30 for better performance)
  const useVirtualization = filteredEntries.length > 30;

  return (
    <div
      className={`border-r border-default flex flex-col h-full bg-bg-alt/30 transition-all duration-300 ${width ? "" : "w-16 sm:w-64"}`}
      style={width ? { width } : undefined}
    >
      {/* Header & Search */}
      <div className="p-2 sm:p-3 border-b border-default flex flex-col gap-2">
        <div className="flex justify-center sm:justify-between items-center">
          <span className="hidden sm:block text-xs font-bold text-muted uppercase tracking-wider">
            Notes
          </span>
          <button
            onClick={onCreate}
            className="p-1.5 rounded-full text-muted hover:bg-accent/10 hover:text-default transition-colors"
            title="New Entry"
            aria-label="Create new journal entry"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>

        {/* Search Input - visible on all sizes */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-bg border border-default rounded-sm py-1.5 sm:py-1 pl-7 pr-6 text-xs text-default focus:border-accent focus:outline-none transition-colors placeholder:text-muted/50"
          />
          <SearchSparkleIcon className="w-3 h-3 text-muted absolute left-2 top-2 sm:top-1.5" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-2 sm:top-1.5 text-muted hover:text-default"
            >
              <XIcon className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* View Toggle - visible on all sizes */}
        <div className="flex gap-1 p-0.5 bg-bg rounded-md">
          <button
            onClick={() => setViewMode("all")}
            className={`flex-1 px-2 py-1 text-xs font-medium rounded transition-colors ${
              viewMode === "all"
                ? "bg-accent/15 text-accent"
                : "text-muted hover:text-default"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setViewMode("tags")}
            className={`flex-1 px-2 py-1 text-xs font-medium rounded transition-colors ${
              viewMode === "tags"
                ? "bg-accent/15 text-accent"
                : "text-muted hover:text-default"
            }`}
          >
            By Tag
          </button>
        </div>
      </div>

      {/* Entry List */}
      <div ref={listContainerRef} className="overflow-y-auto flex-1">
        {filteredEntries.length === 0 ? (
          <div className="p-4 text-center">
            <p className="hidden sm:block text-xs text-muted">
              {searchQuery ? "No matches" : "No entries"}
            </p>
            <p className="sm:hidden text-xs text-muted">-</p>
          </div>
        ) : viewMode === "all" ? (
          /* All Notes View - Virtualized when many entries */
          useVirtualization ? (
            <List
              height={listHeight}
              itemCount={virtualRows.length}
              itemSize={ENTRY_HEIGHT}
              width="100%"
              itemData={itemData}
              overscanCount={5}
            >
              {VirtualRowRenderer}
            </List>
          ) : (
            /* Non-virtualized for small lists */
            <>
              {/* Starred Section */}
              {starredEntries.length > 0 && (
                <div className="border-b border-default/30">
                  <div className="px-3 py-1.5 text-xs font-bold text-yellow-500/80 uppercase tracking-wider flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    Starred
                  </div>
                  {starredEntries.map((entry) => (
                    <EntryItem
                      key={entry.id}
                      entry={entry}
                      isSelected={selectedId === entry.id}
                      onSelect={() => onSelect(entry.id)}
                      onDelete={() => setPendingDeleteId(entry.id)}
                      onToggleStar={
                        onToggleStar ? () => onToggleStar(entry.id) : undefined
                      }
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
                  <div className="px-3 py-1.5 text-xs font-bold text-muted uppercase tracking-wider flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    Recent
                  </div>
                  {recentEntries.map((entry) => (
                    <EntryItem
                      key={entry.id}
                      entry={entry}
                      isSelected={selectedId === entry.id}
                      onSelect={() => onSelect(entry.id)}
                      onDelete={() => setPendingDeleteId(entry.id)}
                      onToggleStar={
                        onToggleStar ? () => onToggleStar(entry.id) : undefined
                      }
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

              {/* Older Entries - only show if there are more than 5 non-starred entries */}
              {filteredEntries.filter((e) => !e.isStarred).length > 5 && (
                <div>
                  <div className="px-3 py-1.5 text-xs font-bold text-muted uppercase tracking-wider">
                    Older Notes (
                    {filteredEntries.filter((e) => !e.isStarred).length - 5})
                  </div>
                  {filteredEntries
                    .filter((e) => !e.isStarred)
                    .slice(5)
                    .map((entry) => (
                      <EntryItem
                        key={entry.id}
                        entry={entry}
                        isSelected={selectedId === entry.id}
                        onSelect={() => onSelect(entry.id)}
                        onDelete={() => setPendingDeleteId(entry.id)}
                        onToggleStar={
                          onToggleStar
                            ? () => onToggleStar(entry.id)
                            : undefined
                        }
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
          )
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
            {allTags.map((tag) => (
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
            {allTags.length === 0 &&
              untaggedEntries.length === 0 &&
              starredEntries.length === 0 && (
                <div className="p-4 text-center">
                  <p className="text-xs text-muted">No tags yet</p>
                  <p className="text-xs text-muted/60 mt-1">
                    Add #tags to your notes
                  </p>
                </div>
              )}
          </>
        )}
      </div>
    </div>
  );
};
