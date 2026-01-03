import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  lazy,
  Suspense,
  memo,
} from "react";
import remarkGfm from "remark-gfm";
import { JournalEntry, JournalStorage } from "../services/journalStorage";
import { usePinnedItems } from "../contexts/PinnedItemsContext";
import { useAuth } from "../hooks/useAuth";
import { useFont } from "../hooks/useFont";
import { JournalEntryList } from "./JournalEntryList";
import { ReferencePane } from "./ReferencePane";
import {
  SLASH_COMMANDS,
  SlashCommand,
  replaceSlashCommand,
} from "./SlashMenu";

// Lazy load non-critical components that are conditionally rendered
const BottomPanel = lazy(() => import("./BottomPanel").then(m => ({ default: m.BottomPanel })));
const SlashMenu = lazy(() => import("./SlashMenu").then(m => ({ default: m.SlashMenu })));
import { TagInput } from "./TagInput";
import { GridIcon } from "./icons/GridIcon";
import { getCaretCoordinates } from "../utils/cursor";
import {
  extractTagsFromContent,
  mergeTags,
  getAllTagsFromEntries,
} from "../utils/tagUtils";
import { useLocalStorageSync } from "../hooks/useLocalStorageSync";

// Lazy load ReactMarkdown - only loads when preview mode is activated
const ReactMarkdown = lazy(() => import("react-markdown"));

// Loading fallback for preview mode
const PreviewLoadingFallback: React.FC = () => (
  <div className="markdown-preview prose prose-sm max-w-none text-default">
    <div className="space-y-2 animate-pulse">
      <div className="h-4 bg-default/10 rounded w-3/4"></div>
      <div className="h-4 bg-default/10 rounded w-5/6"></div>
      <div className="h-4 bg-default/10 rounded w-2/3"></div>
    </div>
  </div>
);

const generateUUID = (): string => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

interface ResizeHandleProps {
  onResize: (delta: number) => void;
  className?: string;
}

const ResizeHandle: React.FC<ResizeHandleProps> = memo(
  ({ onResize, className }) => {
    const [isDragging, setIsDragging] = useState(false);
    const startPosRef = useRef<{ x: number; y: number } | null>(null);
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
      if (!isDragging) return;

      const handleMouseMove = (e: MouseEvent) => {
        // Throttle with requestAnimationFrame
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
          onResize(e.movementX);
        });
      };

      const handleTouchMove = (e: TouchEvent) => {
        e.preventDefault();
        if (!startPosRef.current) return;
        const touch = e.touches[0];
        const delta = touch.clientX - startPosRef.current.x;
        // Throttle with requestAnimationFrame
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
          onResize(delta);
        });
        startPosRef.current.x = touch.clientX;
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        startPosRef.current = null;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };

      const handleTouchEnd = () => {
        setIsDragging(false);
        startPosRef.current = null;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };

      const handleKeyDown = (e: KeyboardEvent) => {
        if (!isDragging) return;
        if (e.key === "Escape") {
          setIsDragging(false);
          startPosRef.current = null;
          document.body.style.cursor = "";
          document.body.style.userSelect = "";
          return;
        }
        const step = e.shiftKey ? 10 : 1;
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          onResize(-step);
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          onResize(step);
        }
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleTouchEnd);
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
        document.removeEventListener("keydown", handleKeyDown);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }, [isDragging, onResize]);

    // Cleanup effect to ensure styles are reset on unmount even if dragging
    useEffect(() => {
      return () => {
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };
    }, []);

    const handleStart = (clientX: number) => {
      setIsDragging(true);
      startPosRef.current = { x: clientX, y: 0 };
    };

    return (
      <div
        className={`w-[12px] cursor-col-resize z-10 flex flex-col justify-center items-center group relative ${className || ""}`}
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
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsDragging(true);
          }
        }}
      >
        {/* Visible indicator - stays thin while hit area is larger */}
        <div
          className={`w-[3px] h-full flex flex-col justify-center items-center ${isDragging ? "bg-accent/40" : "bg-transparent group-hover:bg-accent/30"}`}
        >
          <div
            className={`w-px h-5 rounded-full ${isDragging ? "bg-accent" : "bg-border/40 group-hover:bg-accent/60"}`}
          />
        </div>
      </div>
    );
  },
);

export const JournalEditor: React.FC = () => {
  const { pinnedItems } = usePinnedItems();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const {
    fontFace,
    fontSize,
    setFontFace,
    setFontSize,
    increaseFontSize,
    decreaseFontSize,
  } = useFont();
  
  // Initialize with cached entries synchronously for instant render
  const cachedEntries = useMemo(() => JournalStorage.getCached() || [], []);
  const [entries, setEntries] = useState<JournalEntry[]>(cachedEntries);
  const [isLoadingEntries, setIsLoadingEntries] = useState(cachedEntries.length === 0);
  // Initialize selection with first cached entry if available
  const initialEntry = cachedEntries.length > 0 ? cachedEntries[0] : null;
  const [selectedId, setSelectedId] = useState<string | null>(initialEntry?.id || null);
  const [content, setContent] = useState(initialEntry?.content || "");
  const [title, setTitle] = useState(initialEntry?.title || "");
  const [showTemplate, setShowTemplate] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<string | undefined>(
    initialEntry?.templateRef,
  );
  const [showSidebar, setShowSidebar] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showSaveError, setShowSaveError] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<{ success: boolean; message: string; link?: string } | null>(null);
  const [pendingEntrySwitch, setPendingEntrySwitch] =
    useState<JournalEntry | null>(null);
  const [autosaveError, setAutosaveError] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<
    "synced" | "syncing" | "local" | "error"
  >("synced");
  const saveConfirmTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autosaveErrorTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [entryListWidth, setEntryListWidth] = useState(240);
  const [referencePaneWidth, setReferencePaneWidth] = useState(320);
  const [bottomPanelOpen, setBottomPanelOpen] = useState(false);
  const [bottomPanelHeight, setBottomPanelHeight] = useState(250);
  const [referenceSearchQuery, setReferenceSearchQuery] = useState<
    string | null
  >(null);

  // New feature states
  const [isZenMode, setIsZenMode] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showFontMenu, setShowFontMenu] = useState(false);

  // Lazy loaded reference data
  const [referenceData, setReferenceData] = useState<any[] | null>(null);
  const [isLoadingReferenceData, setIsLoadingReferenceData] = useState(false);

  // Slash command state
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashMenuPosition, setSlashMenuPosition] = useState({
    top: 0,
    left: 0,
  });
  const [slashQuery, setSlashQuery] = useState("");
  const [slashSelectedIndex, setSlashSelectedIndex] = useState(0);

  // Daily goal state
  const [dailyGoal, setDailyGoal] = useState(() => {
    const saved = localStorage.getItem("sancho_daily_goal");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [dailyProgress, setDailyProgress] = useState(() => {
    const saved = localStorage.getItem("sancho_daily_progress");
    if (saved) {
      const parsed = JSON.parse(saved);
      const today = new Date().toDateString();
      if (parsed.date === today) {
        return parsed.count;
      }
    }
    return 0;
  });
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState(dailyGoal.toString());
  const previousWordCountRef = useRef<number>(0);

  // Tag state - initialize from cached entry
  const [tags, setTags] = useState<string[]>(initialEntry?.tags || []);
  const [isStarred, setIsStarred] = useState(initialEntry?.isStarred || false);
  const tagExtractionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef<number>(0);
  const previousSelectedIdRef = useRef<string | null>(initialEntry?.id || null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const savedSelectionRef = useRef<{ start: number; end: number } | null>(null);
  // Ref to avoid recreating callbacks on every keystroke
  const contentRef = useRef<string>(initialEntry?.content || "");
  const currentStateRef = useRef<{
    title: string;
    content: string;
    activeTemplate?: string;
    tags: string[];
    isStarred: boolean;
    entries: JournalEntry[];
  }>({
    title: initialEntry?.title || "",
    content: initialEntry?.content || "",
    activeTemplate: initialEntry?.templateRef,
    tags: initialEntry?.tags || [],
    isStarred: initialEntry?.isStarred || false,
    entries: cachedEntries,
  });
  const autosaveErrorRef = useRef<string | null>(null);

  useEffect(() => {
    const savedEntryWidth = localStorage.getItem("journal_entry_width");
    const savedRefWidth = localStorage.getItem("journal_ref_width");
    if (savedEntryWidth) setEntryListWidth(parseInt(savedEntryWidth));
    if (savedRefWidth) setReferencePaneWidth(parseInt(savedRefWidth));
  }, []);

  // Lazy load reference data when reference pane is opened
  useEffect(() => {
    if (showTemplate && !referenceData && !isLoadingReferenceData) {
      setIsLoadingReferenceData(true);
      Promise.all([
        import("../data/poetryData").then(m => m.poetryData),
        import("../data/poeticDevicesData").then(m => m.poeticDevicesData)
      ]).then(([poetry, devices]) => {
        setReferenceData([...poetry, ...devices]);
        setIsLoadingReferenceData(false);
      }).catch(err => {
        console.error("Failed to load reference data:", err);
        setIsLoadingReferenceData(false);
      });
    }
  }, [showTemplate, referenceData, isLoadingReferenceData]);

  // Debounced localStorage sync for panel widths (prevents excessive writes during resize)
  useLocalStorageSync("journal_entry_width", entryListWidth.toString(), 500);
  useLocalStorageSync("journal_ref_width", referencePaneWidth.toString(), 500);

  // Close font menu when clicking outside
  useEffect(() => {
    if (!showFontMenu) return;
    const handleClickOutside = () => setShowFontMenu(false);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showFontMenu]);

  // Persist daily goal
  useEffect(() => {
    localStorage.setItem("sancho_daily_goal", dailyGoal.toString());
  }, [dailyGoal]);

  // Persist daily progress
  useEffect(() => {
    localStorage.setItem(
      "sancho_daily_progress",
      JSON.stringify({
        date: new Date().toDateString(),
        count: dailyProgress,
      }),
    );
  }, [dailyProgress]);

  // Reset word count ref when switching entries to prevent incorrect tracking
  const currentEntryIdRef = useRef<string | null>(null);

  // Track word count changes for daily goal
  useEffect(() => {
    const wordCount = content
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0).length;

    // If we switched entries, reset the baseline without counting the diff
    if (currentEntryIdRef.current !== selectedId) {
      currentEntryIdRef.current = selectedId;
      previousWordCountRef.current = wordCount;
      return;
    }

    const diff = wordCount - previousWordCountRef.current;
    if (diff > 0 && previousWordCountRef.current > 0) {
      setDailyProgress((prev: number) => prev + diff);
    }
    previousWordCountRef.current = wordCount;
  }, [content, selectedId]);

  // Computed stats - optimized with early returns
  const wordCount = useMemo(() => {
    if (!content) return 0;
    const trimmed = content.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).filter((w) => w.length > 0).length;
  }, [content]);

  const readingTime = useMemo(() => {
    return Math.max(1, Math.ceil(wordCount / 200));
  }, [wordCount]);

  const goalProgress = useMemo(() => {
    if (dailyGoal <= 0) return 0;
    return Math.min(100, Math.round((dailyProgress / dailyGoal) * 100));
  }, [dailyGoal, dailyProgress]);

  useEffect(() => {
    return () => {
      if (saveConfirmTimeoutRef.current) {
        clearTimeout(saveConfirmTimeoutRef.current);
      }
      if (autosaveErrorTimeoutRef.current) {
        clearTimeout(autosaveErrorTimeoutRef.current);
      }
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      if (tagExtractionTimeoutRef.current) {
        clearTimeout(tagExtractionTimeoutRef.current);
      }
    };
  }, []);

  const handleResizeEntryList = useCallback((delta: number) => {
    setEntryListWidth((prev) => {
      const newWidth = prev + delta;
      if (newWidth < 160) return 160;
      if (newWidth > 600) return 600;
      return newWidth;
    });
  }, []);

  const handleResizeReferencePane = useCallback((delta: number) => {
    setReferencePaneWidth((prev) => {
      const newWidth = prev - delta;
      if (newWidth < 240) return 240;
      if (newWidth > 600) return 600;
      return newWidth;
    });
  }, []);

  const handleResizeBottomPanel = useCallback((delta: number) => {
    setBottomPanelHeight((prev) => {
      const newHeight = prev + delta;
      if (newHeight < 150) return 150;
      if (newHeight > 500) return 500;
      return newHeight;
    });
  }, []);

  const allItems = useMemo(() => referenceData || [], [referenceData]);

  const activeItem = useMemo(() => {
    if (!activeTemplate || !referenceData) return null;
    return allItems.find((item) => item.name === activeTemplate) || null;
  }, [activeTemplate, allItems, referenceData]);

  const handleBottomPanelTagClick = useCallback((tag: string) => {
    setShowTemplate(true);
    setReferenceSearchQuery(tag);
  }, []);

  const handleBottomPanelSeeAlsoClick = useCallback((name: string) => {
    setActiveTemplate(name);
  }, []);

  useEffect(() => {
    currentStateRef.current = {
      title,
      content,
      activeTemplate,
      tags,
      isStarred,
      entries,
    };
  }, [title, content, activeTemplate, tags, isStarred, entries]);

  useEffect(() => {
    autosaveErrorRef.current = autosaveError;
  }, [autosaveError]);

  const selectEntryDirect = useCallback((entry: JournalEntry) => {
    setSelectedId(entry.id);
    setTitle(entry.title);
    setContent(entry.content);
    contentRef.current = entry.content; // Keep ref in sync
    setActiveTemplate(entry.templateRef);
    setTags(entry.tags || []);
    setIsStarred(entry.isStarred || false);
    if (entry.templateRef) {
      setShowTemplate(true);
    }
    previousSelectedIdRef.current = entry.id;
  }, []);

  const createNewEntry = useCallback(async () => {
    const newEntry: JournalEntry = {
      id: generateUUID(),
      title: "",
      content: "",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      tags: [],
      isStarred: false,
    };

    // Optimistic UI update - show new entry immediately
    setEntries((prev) => [newEntry, ...prev]);
    setSelectedId(newEntry.id);
    setTitle(newEntry.title);
    setContent(newEntry.content);
    contentRef.current = newEntry.content; // Keep ref in sync
    setActiveTemplate(newEntry.templateRef);
    setTags([]);
    setIsStarred(false);
    previousSelectedIdRef.current = newEntry.id;

    // Save to server in background
    try {
      await JournalStorage.save(newEntry);
      setSyncStatus("synced");
    } catch (error) {
      console.error("Failed to save new entry:", error);
      setSyncStatus("error");
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create new entry";
      setAutosaveError(errorMessage);

      // Clear error message after 5 seconds
      if (autosaveErrorTimeoutRef.current) {
        clearTimeout(autosaveErrorTimeoutRef.current);
      }
      autosaveErrorTimeoutRef.current = setTimeout(() => {
        setAutosaveError(null);
      }, 5000);
    }
  }, []);

  useEffect(() => {
    const loadEntries = async () => {
      // Fetch fresh data from server in background (cache already loaded synchronously)
      try {
        if (JournalStorage.needsMigration()) {
          await JournalStorage.migrateToServer();
        }
        const loadedEntries = await JournalStorage.getAll();
        
        // Only update if we have entries or didn't have cached ones
        if (loadedEntries.length > 0) {
          setEntries(loadedEntries);
          // Refresh editor state if server data differs from cache
          if (cachedEntries.length > 0) {
            const currentSelectedId = previousSelectedIdRef.current;
            if (currentSelectedId) {
              const freshEntry = loadedEntries.find(e => e.id === currentSelectedId);
              const cachedEntry = cachedEntries.find(e => e.id === currentSelectedId);
              // Resync if entry disappeared or any field changed
              if (!freshEntry) {
                // Entry no longer exists on server, select first available
                selectEntryDirect(loadedEntries[0]);
              } else if (cachedEntry && (
                freshEntry.content !== cachedEntry.content ||
                freshEntry.title !== cachedEntry.title ||
                freshEntry.templateRef !== cachedEntry.templateRef ||
                freshEntry.isStarred !== cachedEntry.isStarred ||
                JSON.stringify(freshEntry.tags || []) !== JSON.stringify(cachedEntry.tags || [])
              )) {
                // Any field differs, update editor with fresh server data
                selectEntryDirect(freshEntry);
              }
            }
          } else {
            // Select first entry if we didn't have cached data
            selectEntryDirect(loadedEntries[0]);
          }
        } else if (cachedEntries.length === 0) {
          // Server returned empty list and no cache - create new entry
          setEntries([]);
          await createNewEntry();
        }
      } finally {
        setIsLoadingEntries(false);
      }
    };
    loadEntries();
  }, [selectEntryDirect, createNewEntry, cachedEntries]);

  const selectEntry = useCallback(
    async (entry: JournalEntry) => {
      if (
        previousSelectedIdRef.current &&
        previousSelectedIdRef.current !== entry.id
      ) {
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
          saveTimeoutRef.current = null;
        }

        const state = currentStateRef.current;
        const currentEntry = state.entries.find(
          (e) => e.id === previousSelectedIdRef.current,
        );
        const hasUnsavedChanges =
          currentEntry &&
          (currentEntry.title !== state.title ||
            currentEntry.content !== state.content ||
            currentEntry.templateRef !== state.activeTemplate ||
            currentEntry.isStarred !== state.isStarred ||
            JSON.stringify(currentEntry.tags || []) !==
              JSON.stringify(state.tags));

        if (hasUnsavedChanges) {
          // Check if user wants to save before switching
          setPendingEntrySwitch(entry);
          setShowUnsavedWarning(true);
          return;
        }
      }

      selectEntryDirect(entry);
    },
    [selectEntryDirect],
  );

  const handleUnsavedWarningConfirm = useCallback(async () => {
    setShowUnsavedWarning(false);
    if (!pendingEntrySwitch) return;

    // Save current entry before switching
    const state = currentStateRef.current;
    const currentEntry = state.entries.find(
      (e) => e.id === previousSelectedIdRef.current,
    );
    if (currentEntry) {
      const entryToSave: JournalEntry = {
        ...currentEntry,
        title: state.title || currentEntry.title,
        content: state.content || currentEntry.content,
        updatedAt: Date.now(),
        templateRef: state.activeTemplate,
        tags: state.tags,
        isStarred: state.isStarred,
      };
      try {
        await JournalStorage.save(entryToSave);
        const updatedEntries = await JournalStorage.getAll();
        setEntries(updatedEntries);
      } catch (error) {
        console.error("Failed to save entry before switching:", error);
        // Notify user about the save failure
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to save before switching";
        setAutosaveError(errorMessage);
        setSyncStatus("error");

        // Clear error message after 5 seconds
        if (autosaveErrorTimeoutRef.current) {
          clearTimeout(autosaveErrorTimeoutRef.current);
        }
        autosaveErrorTimeoutRef.current = setTimeout(() => {
          setAutosaveError(null);
        }, 5000);
      }
    }

    selectEntryDirect(pendingEntrySwitch);
    setPendingEntrySwitch(null);
  }, [pendingEntrySwitch, selectEntryDirect]);

  const handleUnsavedWarningCancel = useCallback(() => {
    setShowUnsavedWarning(false);
    setPendingEntrySwitch(null);
  }, []);

  const isDeletingRef = useRef(false);

  const deleteEntry = useCallback(async (id: string) => {
    // Prevent concurrent deletions
    if (isDeletingRef.current) return;
    isDeletingRef.current = true;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }

    // Get current entries to determine next state
    const currentEntries = currentStateRef.current.entries;
    const remaining = currentEntries.filter((e) => e.id !== id);
    const wasSelected = previousSelectedIdRef.current === id;

    if (remaining.length > 0) {
      // Update entries list
      setEntries(remaining);

      // Select next entry if we deleted the currently selected one
      if (wasSelected) {
        const nextEntry = remaining[0];
        setSelectedId(nextEntry.id);
        setTitle(nextEntry.title);
        setContent(nextEntry.content);
        contentRef.current = nextEntry.content; // Keep ref in sync
        setActiveTemplate(nextEntry.templateRef);
        setTags(nextEntry.tags || []);
        setIsStarred(nextEntry.isStarred || false);
        previousSelectedIdRef.current = nextEntry.id;
      }
    } else {
      // No entries left - create a new blank one
      const newEntry: JournalEntry = {
        id: generateUUID(),
        title: "",
        content: "",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        tags: [],
        isStarred: false,
      };

      setEntries([newEntry]);
      setSelectedId(newEntry.id);
      setTitle("");
      setContent("");
      contentRef.current = ""; // Keep ref in sync
      setActiveTemplate(undefined);
      setTags([]);
      setIsStarred(false);
      previousSelectedIdRef.current = newEntry.id;

      // Save new entry to server
      JournalStorage.save(newEntry).catch((error) => {
        console.error("Failed to save new entry:", error);
      });
    }

    // Delete from server in background
    try {
      await JournalStorage.delete(id);
    } catch (error) {
      console.error("Failed to delete entry from server:", error);
    } finally {
      isDeletingRef.current = false;
    }
  }, []);

  // Use a ref to hold the latest handleSave to avoid stale closures in retry
  const handleSaveRef =
    useRef<(isManual?: boolean, retryAttempt?: number) => Promise<void>>();

  const handleSave = useCallback(
    async (isManual = false, retryAttempt = 0) => {
      const state = currentStateRef.current;
      // Use the ref directly - it's always kept up to date
      const currentSelectedId = previousSelectedIdRef.current;

      if (!currentSelectedId) return;

      const currentEntry = state.entries.find(
        (e) => e.id === currentSelectedId,
      );
      if (!currentEntry) return;

      let entryTitle = state.title;
      if (!entryTitle.trim()) {
        const firstLine = state.content.split("\n")[0].trim();
        entryTitle = firstLine.substring(0, 30) || "Untitled";
        if (firstLine.length > 30) entryTitle += "...";
        setTitle(entryTitle);
      }

      const updatedEntry: JournalEntry = {
        id: currentSelectedId,
        title: entryTitle,
        content: state.content,
        createdAt: currentEntry.createdAt || Date.now(),
        updatedAt: Date.now(),
        templateRef: state.activeTemplate,
        tags: state.tags,
        isStarred: state.isStarred,
      };

      // Update local state optimistically (preserve order)
      setEntries((prev) =>
        prev.map((e) => (e.id === currentSelectedId ? updatedEntry : e)),
      );

      // Only show "syncing" status for manual saves (less distracting)
      if (isManual) {
        setSyncStatus("syncing");
      }

      // Save to server in background
      try {
        await JournalStorage.save(updatedEntry);
        setSyncStatus("synced");
        retryCountRef.current = 0; // Reset retry count on success
        if (autosaveErrorRef.current) {
          setAutosaveError(null);
          if (autosaveErrorTimeoutRef.current) {
            clearTimeout(autosaveErrorTimeoutRef.current);
          }
        }
        if (retryTimeoutRef.current) {
          clearTimeout(retryTimeoutRef.current);
        }
      } catch (error) {
        console.error("Failed to save entry:", error);
        setSyncStatus("error");
        const errorMessage =
          error instanceof Error ? error.message : "Failed to save";
        setAutosaveError(errorMessage);

        // Implement exponential backoff retry (max 3 attempts)
        const maxRetries = 3;
        if (!isManual && retryAttempt < maxRetries) {
          const retryDelay = Math.min(1000 * Math.pow(2, retryAttempt), 8000); // Cap at 8 seconds
          retryCountRef.current = retryAttempt + 1;

          if (retryTimeoutRef.current) {
            clearTimeout(retryTimeoutRef.current);
          }

          retryTimeoutRef.current = setTimeout(() => {
            if (process.env.NODE_ENV === "development") {
              console.log(
                `Retrying save (attempt ${retryAttempt + 1}/${maxRetries})...`,
              );
            }
            // Use ref to avoid stale closure
            handleSaveRef.current?.(false, retryAttempt + 1);
          }, retryDelay);
        } else {
          // Clear error message after 5 seconds on final failure
          if (autosaveErrorTimeoutRef.current) {
            clearTimeout(autosaveErrorTimeoutRef.current);
          }
          autosaveErrorTimeoutRef.current = setTimeout(() => {
            setAutosaveError(null);
          }, 5000);
        }

        // If manual save, also show error in UI
        if (isManual) {
          throw error;
        }
      }
    },
    [], // No dependencies - all values accessed via refs
  );

  // Keep ref updated with latest handleSave
  useEffect(() => {
    handleSaveRef.current = handleSave;
  }, [handleSave]);

  const handleManualSave = useCallback(async () => {
    setIsSaving(true);
    setShowSaveError(false);
    try {
      await handleSave(true);
      setShowSaveConfirm(true);
      if (saveConfirmTimeoutRef.current) {
        clearTimeout(saveConfirmTimeoutRef.current);
      }
      saveConfirmTimeoutRef.current = setTimeout(
        () => setShowSaveConfirm(false),
        2000,
      );
    } catch (error) {
      console.error("Failed to save entry:", error);
      setShowSaveConfirm(false);
      setShowSaveError(true);
      if (saveConfirmTimeoutRef.current) {
        clearTimeout(saveConfirmTimeoutRef.current);
      }
      saveConfirmTimeoutRef.current = setTimeout(
        () => setShowSaveError(false),
        3000,
      );
    } finally {
      setIsSaving(false);
    }
  }, [handleSave]);

  const handleRetrySave = useCallback(async () => {
    setAutosaveError(null);
    await handleSave(false);
  }, [handleSave]);

  const handleDeleteCurrent = useCallback(async () => {
    if (!selectedId) return;
    setShowDeleteConfirm(false);
    await deleteEntry(selectedId);
  }, [selectedId, deleteEntry]);

  const handleExportToGoogleDrive = useCallback(async () => {
    if (!selectedId || isExporting) return;
    
    setIsExporting(true);
    setExportStatus(null);
    
    try {
      const result = await JournalStorage.exportToGoogleDrive(selectedId);
      
      if (result.success) {
        setExportStatus({
          success: true,
          message: `Exported "${result.fileName}" to Google Drive`,
          link: result.webViewLink,
        });
      } else {
        setExportStatus({
          success: false,
          message: result.error || 'Failed to export to Google Drive',
        });
      }
      
      setTimeout(() => setExportStatus(null), 5000);
    } catch (error) {
      setExportStatus({
        success: false,
        message: 'Failed to export to Google Drive',
      });
      setTimeout(() => setExportStatus(null), 5000);
    } finally {
      setIsExporting(false);
    }
  }, [selectedId, isExporting]);

  const handleTextareaBlur = useCallback(() => {
    if (textareaRef.current) {
      savedSelectionRef.current = {
        start: textareaRef.current.selectionStart,
        end: textareaRef.current.selectionEnd,
      };
    }
  }, []);

  // Slash command detection on input
  const handleTextareaInput = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      const cursorPos = e.target.selectionStart;

      setContent(value);
      contentRef.current = value; // Keep ref in sync for stable callbacks

      // Slash command detection
      const textBefore = value.substring(0, cursorPos);
      const match = textBefore.match(/\/([a-zA-Z0-9]*)$/);

      if (match) {
        setShowSlashMenu(true);
        setSlashQuery(match[1]);
        setSlashSelectedIndex(0);

        // Calculate position for menu
        const coords = getCaretCoordinates(e.target, cursorPos);
        const rect = e.target.getBoundingClientRect();
        const scrollTop = e.target.scrollTop;

        setSlashMenuPosition({
          top: coords.top - scrollTop + 24,
          left: Math.min(coords.left + 10, rect.width - 240),
        });
      } else {
        setShowSlashMenu(false);
      }
    },
    [],
  );

  // Handle slash command keyboard navigation and list auto-continuation
  const handleTextareaKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (showSlashMenu) {
        const filteredCommands = SLASH_COMMANDS.filter(
          (cmd) =>
            cmd.label.toLowerCase().includes(slashQuery.toLowerCase()) ||
            cmd.id.includes(slashQuery.toLowerCase()),
        );

        if (e.key === "ArrowDown") {
          e.preventDefault();
          setSlashSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setSlashSelectedIndex(
            (prev) =>
              (prev - 1 + filteredCommands.length) % filteredCommands.length,
          );
        } else if (e.key === "Enter") {
          e.preventDefault();
          const command = filteredCommands[slashSelectedIndex];
          if (command) {
            executeSlashCommand(command);
          }
        } else if (e.key === "Escape") {
          setShowSlashMenu(false);
        }
      } else if (e.key === "Enter" && !e.shiftKey) {
        // List auto-continuation - use contentRef to avoid callback recreation on every keystroke
        const currentContent = contentRef.current;
        const textarea = e.currentTarget;
        const cursorPos = textarea.selectionStart;
        const textBefore = currentContent.substring(0, cursorPos);

        // Find the current line
        const lastNewline = textBefore.lastIndexOf("\n");
        const currentLine = textBefore.substring(lastNewline + 1);

        // Check for list patterns (order matters: checklist before bullet since checklist starts with -)
        const checklistMatch = currentLine.match(/^(\s*)-\s\[[x\s]\]\s(.*)$/i);
        const bulletMatch = currentLine.match(/^(\s*)-\s(.*)$/);
        const numberedMatch = currentLine.match(/^(\s*)(\d+)\.\s(.*)$/);

        let listPrefix: string | null = null;
        let isEmptyItem = false;
        let lineStartPos = lastNewline + 1;

        if (checklistMatch) {
          const [, indent, itemContent] = checklistMatch;
          isEmptyItem = itemContent.trim() === "";
          listPrefix = `\n${indent}- [ ] `;
        } else if (bulletMatch) {
          const [, indent, itemContent] = bulletMatch;
          isEmptyItem = itemContent.trim() === "";
          listPrefix = `\n${indent}- `;
        } else if (numberedMatch) {
          const [, indent, num, itemContent] = numberedMatch;
          isEmptyItem = itemContent.trim() === "";
          listPrefix = `\n${indent}${parseInt(num, 10) + 1}. `;
        }

        if (listPrefix !== null) {
          e.preventDefault();

          if (isEmptyItem) {
            // Remove the empty list item prefix (exit the list)
            const beforeLine = currentContent.substring(0, lineStartPos);
            const afterCursor = currentContent.substring(cursorPos);
            const newContent = beforeLine + afterCursor;

            setContent(newContent);
            contentRef.current = newContent;

            // Set cursor at the start of what was the list line
            requestAnimationFrame(() => {
              if (textareaRef.current) {
                textareaRef.current.focus();
                textareaRef.current.setSelectionRange(
                  lineStartPos,
                  lineStartPos,
                );
              }
            });
          } else {
            // Insert the list continuation prefix
            const beforeCursor = currentContent.substring(0, cursorPos);
            const afterCursor = currentContent.substring(cursorPos);
            const newContent = beforeCursor + listPrefix + afterCursor;
            const newCursorPos = cursorPos + listPrefix.length;

            setContent(newContent);
            contentRef.current = newContent;

            requestAnimationFrame(() => {
              if (textareaRef.current) {
                textareaRef.current.focus();
                textareaRef.current.setSelectionRange(
                  newCursorPos,
                  newCursorPos,
                );
              }
            });
          }
        }
      }
    },
    [showSlashMenu, slashQuery, slashSelectedIndex],
  );

  // Execute a slash command
  const executeSlashCommand = useCallback(
    (command: SlashCommand) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const cursorPos = textarea.selectionStart;
      const { text, newCursor } = replaceSlashCommand(
        contentRef.current,
        cursorPos,
        command.action,
      );

      setContent(text);
      contentRef.current = text;
      setShowSlashMenu(false);

      // Set cursor position after state update
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(newCursor, newCursor);
        }
      });
    },
    [],
  );

  // Download entry as markdown
  const handleDownload = useCallback(() => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title || "untitled"}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, [content, title]);

  // Handle goal submit
  const handleGoalSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const val = parseInt(tempGoal, 10);
      if (!isNaN(val) && val > 0) {
        setDailyGoal(val);
      } else {
        setDailyGoal(0);
      }
      setIsEditingGoal(false);
    },
    [tempGoal],
  );

  // Toggle star for an entry
  const handleToggleStar = useCallback(
    async (id: string) => {
      const entry = entries.find((e) => e.id === id);
      if (!entry) return;

      const newStarred = !entry.isStarred;

      // Optimistic update
      setEntries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, isStarred: newStarred } : e)),
      );

      // Update current entry state if it's the selected one
      if (id === selectedId) {
        setIsStarred(newStarred);
      }

      // Save to server
      try {
        await JournalStorage.save({
          ...entry,
          isStarred: newStarred,
          updatedAt: Date.now(),
        });
      } catch (error) {
        console.error("Failed to toggle star:", error);
        // Revert on error
        setEntries((prev) =>
          prev.map((e) => (e.id === id ? { ...e, isStarred: !newStarred } : e)),
        );
        if (id === selectedId) {
          setIsStarred(!newStarred);
        }
      }
    },
    [entries, selectedId],
  );

  // Get all tags from entries for autocomplete
  const allAvailableTags = useMemo(
    () => getAllTagsFromEntries(entries),
    [entries],
  );

  // Auto-extract tags from content (debounced)
  useEffect(() => {
    if (tagExtractionTimeoutRef.current) {
      clearTimeout(tagExtractionTimeoutRef.current);
    }

    tagExtractionTimeoutRef.current = setTimeout(() => {
      const extractedTags = extractTagsFromContent(content);
      // Merge with existing manual tags, keeping all unique tags
      setTags((currentTags) => {
        const merged = mergeTags(currentTags, extractedTags);
        // Only update if there are new tags from content
        if (
          merged.length !== currentTags.length ||
          !merged.every((t) => currentTags.includes(t))
        ) {
          return merged;
        }
        return currentTags;
      });
    }, 1500); // 1.5 second debounce (balanced performance)

    return () => {
      if (tagExtractionTimeoutRef.current) {
        clearTimeout(tagExtractionTimeoutRef.current);
      }
    };
  }, [content]);

  // Toggle zen mode
  const toggleZenMode = useCallback(() => {
    setIsZenMode((prev) => !prev);
  }, []);

  // Toggle preview mode
  const togglePreviewMode = useCallback(() => {
    setIsPreviewMode((prev) => !prev);
  }, []);

  const handleInsert = useCallback(
    (textToInsert: string) => {
      const textarea = textareaRef.current;

      if (!textarea) {
        setContent((prev) => prev + "\n\n" + textToInsert);
        return;
      }

      textarea.focus();

      const start = savedSelectionRef.current?.start ?? textarea.selectionStart;
      const end = savedSelectionRef.current?.end ?? textarea.selectionEnd;

      const before = content.substring(0, start);
      const after = content.substring(end);
      const insertion = "\n\n" + textToInsert;
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
    },
    [content],
  );

  const handleEntrySelect = useCallback(
    (id: string) => {
      const entry = entries.find((e) => e.id === id);
      if (entry) selectEntry(entry);
    },
    [entries, selectEntry],
  );

  useEffect(() => {
    if (!selectedId) return;

    // Set sync status to 'local' when content changes (only check, don't depend on syncStatus)
    setSyncStatus((prev) => (prev === "synced" ? "local" : prev));

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      handleSave(false);
    }, 2500); // Optimized debounce timing

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [content, title, activeTemplate, tags, isStarred, selectedId]); // handleSave is now stable, removed from deps

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Cmd (Mac) or Ctrl (Windows/Linux)
      const isMod = e.metaKey || e.ctrlKey;

      // Cmd/Ctrl + S: Save
      if (isMod && e.key === "s") {
        e.preventDefault();
        handleManualSave();
      }
      // Cmd/Ctrl + N: New entry
      else if (isMod && e.key === "n") {
        e.preventDefault();
        createNewEntry();
      }
      // Cmd/Ctrl + K: Toggle sidebar
      else if (isMod && e.key === "k") {
        e.preventDefault();
        setShowSidebar((prev) => !prev);
      }
      // Cmd/Ctrl + /: Toggle reference pane
      else if (isMod && e.key === "/") {
        e.preventDefault();
        setShowTemplate((prev) => !prev);
      }
      // Escape: Exit zen mode (only if no modals/menus are open)
      else if (e.key === "Escape" && isZenMode) {
        // Check if any modal or menu is open
        const hasOpenModal = showSlashMenu || showDeleteConfirm || showUnsavedWarning || isEditingGoal || showFontMenu;
        
        if (!hasOpenModal) {
          e.preventDefault();
          setIsZenMode(false);
        }
      }
      // Cmd/Ctrl + Shift + Z: Toggle zen mode
      else if (isMod && e.shiftKey && e.key.toLowerCase() === "z") {
        e.preventDefault();
        toggleZenMode();
      }
      // Cmd/Ctrl + Shift + P: Toggle preview mode
      else if (isMod && e.shiftKey && e.key.toLowerCase() === "p") {
        e.preventDefault();
        togglePreviewMode();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    handleManualSave,
    createNewEntry,
    isZenMode,
    toggleZenMode,
    togglePreviewMode,
    showSlashMenu,
    showDeleteConfirm,
    showUnsavedWarning,
    isEditingGoal,
    showFontMenu,
  ]);

  // No more blocking skeleton - render UI immediately with cached data or empty state

  // Zen mode wrapper
  const editorContent = (
    <div
      className={`flex flex-col h-full overflow-hidden bg-bg relative ${isZenMode ? "fixed inset-0 z-[100]" : ""}`}
    >
      {!isAuthLoading && !isAuthenticated && !isZenMode && (
        <div className="bg-yellow-500/10 border-b border-yellow-500/30 px-4 py-2 flex items-center gap-2 shrink-0">
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
            className="text-yellow-500 shrink-0"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <span className="text-sm text-yellow-600 dark:text-yellow-400">
            <strong>Not logged in</strong> — Your notes are saved locally and
            may be lost if you clear browser data.{" "}
            <a
              href="/api/login"
              className="underline hover:text-yellow-700 dark:hover:text-yellow-300"
            >
              Log in
            </a>{" "}
            to sync across devices.
          </span>
        </div>
      )}
      <div className="flex flex-1 overflow-hidden">
        {showSidebar && !isZenMode && (
          <>
            <JournalEntryList
              entries={entries}
              selectedId={selectedId}
              onSelect={handleEntrySelect}
              onCreate={createNewEntry}
              onDelete={deleteEntry}
              onToggleStar={handleToggleStar}
              width={entryListWidth}
              isLoading={isLoadingEntries}
            />
            <ResizeHandle onResize={handleResizeEntryList} />
          </>
        )}

        <div
          className={`flex-1 flex flex-col min-w-[300px] transition-all duration-300 ${isZenMode ? "max-w-3xl mx-auto w-full" : ""}`}
        >
          <div className="flex items-center justify-between px-3 py-2 border-b border-default bg-bg/50 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center gap-3">
              {!isZenMode && (
                <>
                  <button
                    onClick={() => setShowSidebar(!showSidebar)}
                    className={`p-1.5 rounded-md transition-all duration-200 interactive-base interactive-scale ${!showSidebar ? "bg-accent/10 text-accent shadow-sm" : "text-muted interactive-muted hover:bg-bg-alt hover:shadow-sm"}`}
                    title={
                      showSidebar ? "Hide Sidebar (Focus Mode)" : "Show Sidebar"
                    }
                  >
                    <GridIcon className="w-4 h-4" />
                  </button>
                  <span className="h-4 w-px bg-default/20 mx-1"></span>
                </>
              )}

              {/* Stats display */}
              <div className="flex items-center gap-2 text-xs text-muted font-medium uppercase tracking-wide">
                <span>{wordCount} words</span>
                <span className="opacity-50">•</span>
                <span>{readingTime} min</span>
                <span className="opacity-50">•</span>
                <span className="font-mono text-xs normal-case">
                  {content.length} chars
                </span>
              </div>

              {/* Daily goal widget */}
              <span className="h-4 w-px bg-default/20 mx-1"></span>
              {dailyGoal > 0 ? (
                <div
                  className="flex items-center gap-2 cursor-pointer group hover:bg-accent/10 rounded-md px-2 py-1 -mx-2 -my-1 transition-all duration-200 interactive-base"
                  onClick={() => setIsEditingGoal(true)}
                  title="Click to edit daily goal"
                >
                  <div className="w-16 h-1.5 bg-default/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${goalProgress >= 100 ? "bg-green-500" : "bg-accent"}`}
                      style={{ width: `${goalProgress}%` }}
                    />
                  </div>
                  <span
                    className={`text-xs font-medium ${goalProgress >= 100 ? "text-green-500" : "text-muted"}`}
                  >
                    {dailyProgress}/{dailyGoal}
                  </span>
                  {goalProgress >= 100 && (
                    <span className="text-xs" title="Goal reached!">
                      🎉
                    </span>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsEditingGoal(true)}
                  className="text-xs text-muted interactive-muted hover:bg-accent/10 px-2 py-1 rounded-md transition-all duration-200 flex items-center gap-1 interactive-base interactive-scale"
                  title="Set a daily writing goal"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                  Set goal
                </button>
              )}

              {/* Compact Sync Status Indicator */}
              {isAuthenticated && (
                <div className="flex items-center">
                  {showSaveConfirm ? (
                    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-medium">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      Saved
                    </span>
                  ) : showSaveError || autosaveError ? (
                    <button
                      onClick={handleRetrySave}
                      className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-medium hover:bg-red-500/20 transition-colors interactive-base"
                      title="Click to retry save"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                      </svg>
                      Save failed · Retry
                    </button>
                  ) : syncStatus === "syncing" ? (
                    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-medium">
                      <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                      </svg>
                      Syncing
                    </span>
                  ) : syncStatus === "local" ? (
                    <span 
                      className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 text-xs font-medium"
                      title="Local changes pending sync"
                    >
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                      </span>
                      Unsaved
                    </span>
                  ) : syncStatus === "synced" && !showSaveConfirm ? (
                    <span 
                      className="flex items-center gap-1 text-green-500/70 text-xs"
                      title="All changes synced"
                    >
                      <span className="relative flex h-2 w-2">
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                    </span>
                  ) : null}
                </div>
              )}
              {!isAuthLoading && !isAuthenticated && !isZenMode && (
                <span
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 text-xs font-medium"
                  title="Not logged in - saved locally only"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  Local Only
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              {/* Focus mode toggles */}
              <button
                onClick={toggleZenMode}
                className={`p-1.5 rounded-md transition-all duration-200 interactive-base interactive-scale ${
                  isZenMode
                    ? "text-accent bg-accent/10 shadow-sm"
                    : "text-muted interactive-muted hover:bg-bg-alt hover:shadow-sm"
                }`}
                title={isZenMode ? "Exit Zen Mode (Esc)" : "Zen Mode (⌘⇧Z)"}
              >
                {isZenMode ? (
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
                    <polyline points="4 14 10 14 10 20" />
                    <polyline points="20 10 14 10 14 4" />
                    <line x1="14" x2="21" y1="10" y2="3" />
                    <line x1="3" x2="10" y1="21" y2="14" />
                  </svg>
                ) : (
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
                    <polyline points="15 3 21 3 21 9" />
                    <polyline points="9 21 3 21 3 15" />
                    <line x1="21" x2="14" y1="3" y2="10" />
                    <line x1="3" x2="10" y1="21" y2="14" />
                  </svg>
                )}
              </button>

              <span className="h-4 w-px bg-default/20 mx-1"></span>

              {/* Preview toggle */}
              <button
                onClick={togglePreviewMode}
                className={`p-1.5 rounded-md transition-all duration-200 interactive-base interactive-scale ${
                  isPreviewMode
                    ? "text-accent bg-accent/10 shadow-sm"
                    : "text-muted interactive-muted hover:bg-bg-alt hover:shadow-sm"
                }`}
                title={isPreviewMode ? "Edit Mode (⌘⇧P)" : "Preview Mode (⌘⇧P)"}
              >
                {isPreviewMode ? (
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
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" x2="23" y1="1" y2="23" />
                  </svg>
                ) : (
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
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>

              {/* Download */}
              <button
                onClick={handleDownload}
                className="p-1.5 rounded-md transition-all duration-200 text-muted interactive-muted hover:bg-bg-alt hover:shadow-sm interactive-base interactive-scale"
                title="Download as Markdown"
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
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" x2="12" y1="15" y2="3" />
                </svg>
              </button>

              <span className="h-4 w-px bg-default/20 mx-1"></span>

              {/* Font controls */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowFontMenu(!showFontMenu);
                  }}
                  className="p-1.5 rounded-md transition-all duration-200 text-muted interactive-muted hover:bg-bg-alt hover:shadow-sm interactive-base interactive-scale"
                  title="Font Face"
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
                    <path d="M4 7V4h16v3" />
                    <path d="M9 20h6" />
                    <path d="M12 4v16" />
                  </svg>
                </button>

                {showFontMenu && (
                  <div className="absolute top-full left-0 mt-1 bg-bg-alt border border-default rounded-md shadow-lg z-50 py-1 min-w-[140px] animate-fade-in-fast">
                    {(["monospace", "serif", "sans-serif"] as const).map(
                      (face) => (
                        <button
                          key={face}
                          onClick={() => {
                            setFontFace(face);
                            setShowFontMenu(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 hover:bg-bg transition-all duration-200 interactive-base ${
                            fontFace === face ? "text-accent font-medium" : "text-default"
                          }`}
                        >
                          {face === "monospace"
                            ? "Monospace"
                            : face === "serif"
                              ? "Serif"
                              : "Sans-serif"}
                        </button>
                      ),
                    )}
                  </div>
                )}
              </div>

              {/* Font size controls */}
              <button
                onClick={decreaseFontSize}
                disabled={fontSize <= 14}
                className="p-1.5 rounded-md transition-all duration-200 text-muted interactive-muted hover:bg-bg-alt hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed interactive-base interactive-scale interactive-disabled"
                title="Decrease Font Size"
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
                  <line x1="5" x2="19" y1="12" y2="12" />
                </svg>
              </button>

              <span className="text-xs text-muted px-1 min-w-[32px] text-center">
                {fontSize}px
              </span>

              <button
                onClick={increaseFontSize}
                disabled={fontSize >= 24}
                className="p-1.5 rounded-md transition-all duration-200 text-muted interactive-muted hover:bg-bg-alt hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed interactive-base interactive-scale interactive-disabled"
                title="Increase Font Size"
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
                  <line x1="12" x2="12" y1="5" y2="19" />
                  <line x1="5" x2="19" y1="12" y2="12" />
                </svg>
              </button>

              <span className="h-4 w-px bg-default/20 mx-1"></span>

              <button
                onClick={handleManualSave}
                disabled={isSaving}
                className="p-1.5 rounded-md transition-all duration-200 text-muted hover:text-green-500 hover:bg-green-500/15 hover:shadow-[0_0_10px_rgba(34,197,94,0.3)] disabled:opacity-50 disabled:hover:text-muted disabled:hover:bg-transparent disabled:hover:shadow-none interactive-base interactive-scale"
                title="Save Entry (⌘S)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </button>
              {isAuthenticated && (
                <button
                  onClick={handleExportToGoogleDrive}
                  disabled={isExporting}
                  className="p-1.5 rounded-md transition-all duration-200 text-muted hover:text-blue-500 hover:bg-blue-500/15 hover:shadow-[0_0_10px_rgba(59,130,246,0.3)] disabled:opacity-50 disabled:hover:text-muted disabled:hover:bg-transparent disabled:hover:shadow-none interactive-base interactive-scale"
                  title="Export to Google Drive"
                >
                  {isExporting ? (
                    <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                  )}
                </button>
              )}
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-1.5 rounded-md transition-all duration-200 text-muted hover:text-red-500 hover:bg-red-500/15 hover:shadow-[0_0_10px_rgba(239,68,68,0.3)] interactive-base interactive-scale"
                title="Delete Entry"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              {!isZenMode && (
                <>
                  <span className="h-4 w-px bg-default/20"></span>
                  <button
                    onClick={() => setShowTemplate(!showTemplate)}
                    className={`px-2 py-1 rounded-md text-xs font-medium transition-all duration-200 border interactive-base interactive-scale ${
                      showTemplate
                        ? "bg-accent text-accent-text border-accent hover:bg-accent-hover shadow-sm"
                        : "bg-bg text-muted interactive-muted border-default/30 hover:border-default hover:bg-bg-alt hover:shadow-sm"
                    }`}
                    title="Toggle Reference Pane (⌘/)"
                  >
                    {showTemplate ? "Hide Reference" : "Reference"}
                  </button>
                </>
              )}
            </div>
          </div>

          {exportStatus && (
            <div className={`px-4 py-2 flex items-center justify-between text-sm border-b ${
              exportStatus.success
                ? "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900/30 text-green-700 dark:text-green-400"
                : "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400"
            }`}>
              <div className="flex items-center gap-2">
                {exportStatus.success ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="15" y1="9" x2="9" y2="15"/>
                    <line x1="9" y1="9" x2="15" y2="15"/>
                  </svg>
                )}
                <span className="font-medium">{exportStatus.message}</span>
              </div>
              <div className="flex items-center gap-2">
                {exportStatus.link && (
                  <a
                    href={exportStatus.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 text-xs font-medium rounded-md bg-green-100 dark:bg-green-900/20 hover:bg-green-200 dark:hover:bg-green-900/30 hover:shadow-sm transition-all duration-200 interactive-base interactive-scale"
                  >
                    Open in Drive
                  </a>
                )}
                <button
                  onClick={() => setExportStatus(null)}
                  className="p-1 rounded-md hover:bg-default/10 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>
          )}

          <div className="flex-1 flex flex-col relative overflow-hidden">
            <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-2 space-y-2">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Untitled Note"
                className="bg-transparent border-none text-lg sm:text-xl font-bold text-default focus:ring-0 w-full outline-none placeholder:text-muted/30"
                disabled={isPreviewMode}
              />
              {/* Tag Input */}
              <TagInput
                tags={tags}
                onChange={setTags}
                allTags={allAvailableTags}
                placeholder="Add tags... (type #tag in content or add here)"
                disabled={isPreviewMode}
              />
            </div>

            <div className="flex-1 relative overflow-auto px-4 sm:px-6 py-2">
              {isPreviewMode ? (
                <Suspense fallback={<PreviewLoadingFallback />}>
                  <div className="markdown-preview prose prose-sm max-w-none text-default">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {content || "*Start writing to see preview...*"}
                    </ReactMarkdown>
                  </div>
                </Suspense>
              ) : (
                <div className="relative h-full">
                  <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={handleTextareaInput}
                    onKeyDown={handleTextareaKeyDown}
                    onBlur={handleTextareaBlur}
                    placeholder="Start writing... Type '/' for commands"
                    className="journal-font w-full h-full min-h-[300px] bg-transparent border-none outline-none resize-none leading-relaxed text-default placeholder:text-muted/30"
                  />

                  {/* Slash command menu */}
                  {showSlashMenu && (
                    <Suspense fallback={null}>
                      <SlashMenu
                        position={slashMenuPosition}
                        query={slashQuery}
                        selectedIndex={slashSelectedIndex}
                        onSelect={executeSlashCommand}
                        onClose={() => setShowSlashMenu(false)}
                        onNavigate={(dir) => {
                          if (typeof dir === "number") {
                            setSlashSelectedIndex(dir);
                          }
                        }}
                      />
                    </Suspense>
                  )}
                </div>
              )}
            </div>

            {activeItem && !isZenMode && (
              <Suspense fallback={<div className="h-8 bg-bg-alt/20 animate-pulse" />}>
                <BottomPanel
                  item={activeItem}
                  isOpen={bottomPanelOpen}
                  onToggle={() => setBottomPanelOpen(!bottomPanelOpen)}
                  height={bottomPanelHeight}
                  onResize={handleResizeBottomPanel}
                  onTagClick={handleBottomPanelTagClick}
                  onSeeAlsoClick={handleBottomPanelSeeAlsoClick}
                />
              </Suspense>
            )}
          </div>
        </div>

        {showTemplate && !isZenMode && (
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
            <h3 className="text-lg font-semibold text-default mb-2">
              Delete Entry?
            </h3>
            <p className="text-sm text-muted mb-4">
              Are you sure you want to delete "{title || "Untitled"}"? This
              action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1.5 rounded-md text-sm font-medium bg-bg-alt text-default border border-default hover:bg-bg-alt/80 hover:shadow-sm transition-all duration-200 interactive-base interactive-scale"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCurrent}
                className="px-3 py-1.5 rounded-md text-sm font-medium bg-red-500 text-white hover:bg-red-600 hover:shadow-md transition-all duration-200 interactive-base interactive-scale"
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
            <h3 className="text-lg font-semibold text-default mb-2">
              Unsaved Changes
            </h3>
            <p className="text-sm text-muted mb-4">
              You have unsaved changes. Do you want to save before switching
              entries?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleUnsavedWarningCancel}
                className="px-3 py-1.5 rounded-md text-sm font-medium bg-bg-alt text-default border border-default hover:bg-bg-alt/80 hover:shadow-sm transition-all duration-200 interactive-base interactive-scale"
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
                className="px-3 py-1.5 rounded-md text-sm font-medium bg-bg text-default border border-default hover:bg-bg-alt hover:shadow-sm transition-all duration-200 interactive-base interactive-scale"
              >
                Discard
              </button>
              <button
                onClick={handleUnsavedWarningConfirm}
                className="px-3 py-1.5 rounded-md text-sm font-medium bg-accent text-accent-text hover:bg-accent-hover hover:shadow-md transition-all duration-200 interactive-base interactive-scale"
              >
                Save & Switch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Daily goal editing modal */}
      {isEditingGoal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-bg border border-default rounded-lg p-6 max-w-sm mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-default mb-2">
              Daily Writing Goal
            </h3>
            <p className="text-sm text-muted mb-4">
              Set a word count goal to track your daily writing progress.
            </p>
            <form onSubmit={handleGoalSubmit}>
              <input
                type="number"
                value={tempGoal}
                onChange={(e) => setTempGoal(e.target.value)}
                placeholder="Word count (e.g., 500)"
                className="w-full px-3 py-2 rounded-md border border-default bg-bg-alt text-default mb-4 focus:border-accent focus:outline-none"
                min="0"
                autoFocus
              />
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => {
                    setDailyGoal(0);
                    setDailyProgress(0);
                    setIsEditingGoal(false);
                  }}
                  className="text-xs text-muted hover:text-red-500 hover:bg-red-500/10 px-2 py-1 rounded transition-all duration-200 interactive-base"
                >
                  Reset Progress
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setTempGoal(dailyGoal.toString());
                      setIsEditingGoal(false);
                    }}
                    className="px-3 py-1.5 rounded-md text-sm font-medium bg-bg-alt text-default border border-default hover:bg-bg-alt/80 hover:shadow-sm transition-all duration-200 interactive-base interactive-scale"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-md text-sm font-medium bg-accent text-accent-text hover:bg-accent-hover hover:shadow-md transition-all duration-200 interactive-base interactive-scale"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  return editorContent;
};
