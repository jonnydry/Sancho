import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { JournalEntry, JournalStorage } from "../services/journalStorage";
import { usePinnedItems } from "../contexts/PinnedItemsContext";
import { useAuth } from "../hooks/useAuth";
import { JournalEntryList } from "./JournalEntryList";
import { ReferencePane } from "./ReferencePane";
import { BottomPanel } from "./BottomPanel";
import { SlashMenu, SLASH_COMMANDS, SlashCommand } from "./SlashMenu";
import { GridIcon } from "./icons/GridIcon";
import { poetryData } from "../data/poetryData";
import { poeticDevicesData } from "../data/poeticDevicesData";
import { getCaretCoordinates } from "../utils/cursor";

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
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
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
      className={`w-[3px] cursor-col-resize z-10 flex flex-col justify-center items-center group relative ${isDragging ? "bg-accent/40" : "bg-transparent hover:bg-accent/30"} ${className || ""}`}
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
      <div
        className={`w-px h-5 rounded-full ${isDragging ? "bg-accent" : "bg-border/40 group-hover:bg-accent/60"}`}
      />
    </div>
  );
};

export const JournalEditor: React.FC = () => {
  const { pinnedItems } = usePinnedItems();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [showTemplate, setShowTemplate] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<string | undefined>(
    undefined,
  );
  const [showSidebar, setShowSidebar] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showSaveError, setShowSaveError] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);
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

  // Markdown preview mode
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Slash command menu state
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashMenuPosition, setSlashMenuPosition] = useState({ top: 0, left: 0 });
  const [slashQuery, setSlashQuery] = useState("");
  const [slashIndex, setSlashIndex] = useState(0);

  // Zen Mode - fullscreen distraction-free writing
  const [isZenMode, setIsZenMode] = useState(false);

  // Typewriter Mode - keeps active line centered
  const [isTypewriterMode, setIsTypewriterMode] = useState(false);

  // Font selection
  const [editorFont, setEditorFont] = useState<"sans" | "serif" | "mono">(() => {
    const saved = localStorage.getItem("journal_editor_font");
    return (saved as "sans" | "serif" | "mono") || "sans";
  });

  // Writing goal state
  const [dailyGoal, setDailyGoal] = useState<number>(() => {
    const saved = localStorage.getItem("journal_daily_goal");
    return saved ? parseInt(saved) : 0;
  });
  const [dailyProgress, setDailyProgress] = useState<number>(() => {
    const saved = localStorage.getItem("journal_daily_progress");
    const savedDate = localStorage.getItem("journal_daily_progress_date");
    const today = new Date().toDateString();
    // Reset if it's a new day
    if (savedDate !== today) {
      return 0;
    }
    return saved ? parseInt(saved) : 0;
  });
  const [showGoalInput, setShowGoalInput] = useState(false);
  const [goalInputValue, setGoalInputValue] = useState("");
  const previousWordCountRef = useRef<number>(0);

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef<number>(0);
  const previousSelectedIdRef = useRef<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const savedSelectionRef = useRef<{ start: number; end: number } | null>(null);
  const currentStateRef = useRef<{
    title: string;
    content: string;
    activeTemplate?: string;
    entries: JournalEntry[];
  }>({
    title: "",
    content: "",
    entries: [],
  });

  useEffect(() => {
    const savedEntryWidth = localStorage.getItem("journal_entry_width");
    const savedRefWidth = localStorage.getItem("journal_ref_width");
    if (savedEntryWidth) setEntryListWidth(parseInt(savedEntryWidth));
    if (savedRefWidth) setReferencePaneWidth(parseInt(savedRefWidth));
  }, []);

  useEffect(() => {
    localStorage.setItem("journal_entry_width", entryListWidth.toString());
    localStorage.setItem("journal_ref_width", referencePaneWidth.toString());
  }, [entryListWidth, referencePaneWidth]);

  // Persist font selection
  useEffect(() => {
    localStorage.setItem("journal_editor_font", editorFont);
  }, [editorFont]);

  // Persist daily goal
  useEffect(() => {
    localStorage.setItem("journal_daily_goal", dailyGoal.toString());
  }, [dailyGoal]);

  // Persist daily progress with date
  useEffect(() => {
    localStorage.setItem("journal_daily_progress", dailyProgress.toString());
    localStorage.setItem("journal_daily_progress_date", new Date().toDateString());
  }, [dailyProgress]);

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

  const allItems = useMemo(() => [...poetryData, ...poeticDevicesData], []);

  const activeItem = useMemo(() => {
    if (!activeTemplate) return null;
    return allItems.find((item) => item.name === activeTemplate) || null;
  }, [activeTemplate, allItems]);

  // Word count and reading time calculations
  const wordCount = useMemo(() => {
    if (!content) return 0;
    return content.trim().split(/\s+/).filter((w) => w.length > 0).length;
  }, [content]);

  const readingTime = useMemo(() => {
    return Math.max(1, Math.ceil(wordCount / 200));
  }, [wordCount]);

  // Track word count changes for daily progress
  useEffect(() => {
    if (previousWordCountRef.current > 0 && wordCount > previousWordCountRef.current) {
      const wordsAdded = wordCount - previousWordCountRef.current;
      setDailyProgress((prev) => prev + wordsAdded);
    }
    previousWordCountRef.current = wordCount;
  }, [wordCount]);

  // Filtered slash commands based on query
  const filteredSlashCommands = useMemo(() => {
    if (!slashQuery) return SLASH_COMMANDS;
    const query = slashQuery.toLowerCase();
    return SLASH_COMMANDS.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(query) ||
        cmd.id.toLowerCase().includes(query)
    );
  }, [slashQuery]);

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

  const selectEntryDirect = useCallback((entry: JournalEntry) => {
    setSelectedId(entry.id);
    setTitle(entry.title);
    setContent(entry.content);
    setActiveTemplate(entry.templateRef);
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
    };

    // Optimistic UI update - show new entry immediately
    setEntries((prev) => [newEntry, ...prev]);
    setSelectedId(newEntry.id);
    setTitle(newEntry.title);
    setContent(newEntry.content);
    setActiveTemplate(newEntry.templateRef);
    previousSelectedIdRef.current = newEntry.id;

    // Save to server in background
    try {
      await JournalStorage.save(newEntry);
    } catch (error) {
      console.error("Failed to save new entry:", error);
    }
  }, []);

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
        await createNewEntry();
      }
    };
    loadEntries();
  }, [selectEntryDirect, createNewEntry]);

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
            currentEntry.templateRef !== state.activeTemplate);

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
      };
      try {
        await JournalStorage.save(entryToSave);
        const updatedEntries = await JournalStorage.getAll();
        setEntries(updatedEntries);
      } catch (error) {
        console.error("Failed to save entry before switching:", error);
      }
    }

    selectEntryDirect(pendingEntrySwitch);
    setPendingEntrySwitch(null);
  }, [pendingEntrySwitch, selectEntryDirect]);

  const handleUnsavedWarningCancel = useCallback(() => {
    setShowUnsavedWarning(false);
    setPendingEntrySwitch(null);
  }, []);

  const deleteEntry = useCallback(
    async (id: string) => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
      }

      // Calculate what to do based on current state
      setEntries((prevEntries) => {
        const remaining = prevEntries.filter((e) => e.id !== id);

        // Use flushSync pattern - update all state synchronously
        if (remaining.length > 0) {
          // Select next entry if we deleted the currently selected one
          if (selectedId === id) {
            const nextEntry = remaining[0];
            // Schedule state updates to happen after this render
            Promise.resolve().then(() => {
              setSelectedId(nextEntry.id);
              setTitle(nextEntry.title);
              setContent(nextEntry.content);
              setActiveTemplate(nextEntry.templateRef);
              previousSelectedIdRef.current = nextEntry.id;
            });
          }
          return remaining;
        } else {
          // No entries left - create a new blank one
          const newEntry: JournalEntry = {
            id: generateUUID(),
            title: "",
            content: "",
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };

          // Schedule state updates and save
          Promise.resolve().then(() => {
            setSelectedId(newEntry.id);
            setTitle("");
            setContent("");
            setActiveTemplate(undefined);
            previousSelectedIdRef.current = newEntry.id;

            // Save new entry to server
            JournalStorage.save(newEntry).catch((error) => {
              console.error("Failed to save new entry:", error);
            });
          });

          return [newEntry];
        }
      });

      // Delete from server in background
      try {
        await JournalStorage.delete(id);
      } catch (error) {
        console.error("Failed to delete entry from server:", error);
      }
    },
    [selectedId],
  );

  const handleSave = useCallback(
    async (isManual = false, retryAttempt = 0) => {
      if (!selectedId) return;

      const currentEntry = entries.find((e) => e.id === selectedId);
      if (!currentEntry) return;

      let entryTitle = title;
      if (!entryTitle.trim()) {
        const firstLine = content.split("\n")[0].trim();
        entryTitle = firstLine.substring(0, 30) || "Untitled";
        if (firstLine.length > 30) entryTitle += "...";
        setTitle(entryTitle);
      }

      const updatedEntry: JournalEntry = {
        id: selectedId,
        title: entryTitle,
        content,
        createdAt: currentEntry.createdAt || Date.now(),
        updatedAt: Date.now(),
        templateRef: activeTemplate,
      };

      // Update local state optimistically (preserve order)
      setEntries((prev) =>
        prev.map((e) => (e.id === selectedId ? updatedEntry : e)),
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
        if (autosaveError) {
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
            console.log(
              `Retrying save (attempt ${retryAttempt + 1}/${maxRetries})...`,
            );
            handleSave(false, retryAttempt + 1);
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
    [selectedId, entries, title, content, activeTemplate, autosaveError],
  );

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
    await handleSave();
  }, [handleSave]);

  // Download as Markdown
  const handleDownload = useCallback(() => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title || "untitled"}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, [content, title]);

  // Typewriter mode: center active line
  const centerActiveLine = useCallback(() => {
    if (!isTypewriterMode || !textareaRef.current) return;
    const textarea = textareaRef.current;
    const { selectionStart } = textarea;
    const coords = getCaretCoordinates(textarea, selectionStart);
    const viewportHeight = textarea.clientHeight;
    const targetScrollTop = coords.top - viewportHeight / 2;
    textarea.scrollTo({
      top: Math.max(0, targetScrollTop),
      behavior: "auto",
    });
  }, [isTypewriterMode]);

  // Handle goal submission
  const handleGoalSubmit = useCallback(() => {
    const val = parseInt(goalInputValue, 10);
    if (!isNaN(val) && val > 0) {
      setDailyGoal(val);
    }
    setShowGoalInput(false);
    setGoalInputValue("");
  }, [goalInputValue]);

  const handleDeleteCurrent = useCallback(async () => {
    if (!selectedId) return;
    setShowDeleteConfirm(false);
    await deleteEntry(selectedId);
  }, [selectedId, deleteEntry]);

  const handleTextareaBlur = useCallback(() => {
    if (textareaRef.current) {
      savedSelectionRef.current = {
        start: textareaRef.current.selectionStart,
        end: textareaRef.current.selectionEnd,
      };
    }
  }, []);

  // Slash command: replace "/" + query with the markdown prefix
  const executeSlashCommand = useCallback(
    (command: SlashCommand) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const cursorPos = textarea.selectionStart;
      const textBefore = content.substring(0, cursorPos);
      const slashIdx = textBefore.lastIndexOf("/");

      if (slashIdx === -1) return;

      const beforeSlash = content.substring(0, slashIdx);
      const afterCursor = content.substring(cursorPos);
      const newContent = beforeSlash + command.prefix + afterCursor;
      const newCursor = beforeSlash.length + command.prefix.length;

      setContent(newContent);
      setShowSlashMenu(false);
      setSlashQuery("");
      setSlashIndex(0);

      // Restore cursor position after state update
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(newCursor, newCursor);
        }
      }, 0);
    },
    [content]
  );

  // Handle textarea input for slash command detection
  const handleTextareaInput = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const val = e.target.value;
      const cursorPos = e.target.selectionStart;
      setContent(val);

      // Detect slash command
      const textBefore = val.substring(0, cursorPos);
      const match = textBefore.match(/\/([a-zA-Z0-9]*)$/);

      if (match) {
        setShowSlashMenu(true);
        setSlashQuery(match[1]);
        setSlashIndex(0);

        // Calculate position for the slash menu
        const coords = getCaretCoordinates(e.target, cursorPos);
        const rect = e.target.getBoundingClientRect();
        const parentRect = e.target.parentElement?.getBoundingClientRect();
        const scrollTop = e.target.scrollTop;

        setSlashMenuPosition({
          top: coords.top - scrollTop + 24, // Add line height offset
          left: coords.left + (parentRect ? rect.left - parentRect.left : 0) + 10,
        });
      } else {
        setShowSlashMenu(false);
      }

      // Typewriter mode: center active line after input
      if (isTypewriterMode) {
        requestAnimationFrame(() => {
          centerActiveLine();
        });
      }
    },
    [isTypewriterMode, centerActiveLine]
  );

  // Handle keyboard navigation for slash menu
  const handleTextareaKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (!showSlashMenu) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSlashIndex((prev) => (prev + 1) % filteredSlashCommands.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSlashIndex(
          (prev) =>
            (prev - 1 + filteredSlashCommands.length) %
            filteredSlashCommands.length
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        const command = filteredSlashCommands[slashIndex];
        if (command) executeSlashCommand(command);
      } else if (e.key === "Escape") {
        setShowSlashMenu(false);
        setSlashQuery("");
        setSlashIndex(0);
      }
    },
    [showSlashMenu, filteredSlashCommands, slashIndex, executeSlashCommand]
  );

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
    }, 2000);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [content, title, activeTemplate, selectedId, handleSave]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Cmd (Mac) or Ctrl (Windows/Linux)
      const isMod = e.metaKey || e.ctrlKey;
      const isShift = e.shiftKey;

      // Cmd/Ctrl + S: Save
      if (isMod && !isShift && e.key === "s") {
        e.preventDefault();
        handleManualSave();
      }
      // Cmd/Ctrl + N: New entry
      else if (isMod && !isShift && e.key === "n") {
        e.preventDefault();
        createNewEntry();
      }
      // Cmd/Ctrl + K: Toggle sidebar
      else if (isMod && !isShift && e.key === "k") {
        e.preventDefault();
        setShowSidebar((prev) => !prev);
      }
      // Cmd/Ctrl + /: Toggle reference pane
      else if (isMod && !isShift && e.key === "/") {
        e.preventDefault();
        setShowTemplate((prev) => !prev);
      }
      // Cmd/Ctrl + Shift + F: Toggle Zen Mode
      else if (isMod && isShift && e.key.toLowerCase() === "f") {
        e.preventDefault();
        setIsZenMode((prev) => !prev);
      }
      // Cmd/Ctrl + Shift + T: Toggle Typewriter Mode
      else if (isMod && isShift && e.key.toLowerCase() === "t") {
        e.preventDefault();
        setIsTypewriterMode((prev) => !prev);
      }
      // Cmd/Ctrl + Shift + D: Download as Markdown
      else if (isMod && isShift && e.key.toLowerCase() === "d") {
        e.preventDefault();
        handleDownload();
      }
      // Escape: Exit Zen Mode
      else if (e.key === "Escape" && isZenMode) {
        setIsZenMode(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleManualSave, createNewEntry, handleDownload, isZenMode]);

  // Zen Mode Editor (fullscreen overlay)
  const ZenModeEditor = (
    <div className="fixed inset-0 z-[100] bg-bg flex flex-col">
      {/* Minimal Zen Mode Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-default/30">
        <div className="flex items-center gap-4">
          <span className="text-xs text-muted font-mono">
            {wordCount} {wordCount === 1 ? "word" : "words"} • {readingTime} min
          </span>
          {dailyGoal > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-12 h-1 bg-default/20 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    dailyProgress >= dailyGoal ? "bg-green-500" : "bg-accent"
                  }`}
                  style={{
                    width: `${Math.min(100, (dailyProgress / dailyGoal) * 100)}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
        <button
          onClick={() => setIsZenMode(false)}
          className="p-1.5 rounded-md text-muted hover:text-default hover:bg-bg-alt transition-colors"
          title="Exit Zen Mode (Esc)"
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
            <polyline points="4 14 10 14 10 20" />
            <polyline points="20 10 14 10 14 4" />
            <line x1="14" y1="10" x2="21" y2="3" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
        </button>
      </div>
      {/* Zen Mode Content */}
      <div className="flex-1 overflow-auto flex justify-center">
        <div className="w-full max-w-2xl px-6 py-8">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled"
            className={`bg-transparent border-none text-2xl font-bold text-default focus:ring-0 w-full outline-none placeholder:text-muted/30 mb-6 ${
              editorFont === "serif"
                ? "font-serif"
                : editorFont === "mono"
                ? "font-mono"
                : ""
            }`}
            style={{
              fontFamily:
                editorFont === "serif"
                  ? "Georgia, Cambria, serif"
                  : editorFont === "mono"
                  ? "ui-monospace, SFMono-Regular, monospace"
                  : undefined,
            }}
          />
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleTextareaInput}
            onKeyDown={handleTextareaKeyDown}
            placeholder="Start writing..."
            className={`w-full min-h-[60vh] bg-transparent border-none outline-none resize-none text-base leading-relaxed text-default placeholder:text-muted/30 ${
              isTypewriterMode ? "pb-[50vh]" : ""
            } ${
              editorFont === "serif"
                ? "font-serif"
                : editorFont === "mono"
                ? "font-mono"
                : ""
            }`}
            style={{
              fontFamily:
                editorFont === "serif"
                  ? "Georgia, Cambria, serif"
                  : editorFont === "mono"
                  ? "ui-monospace, SFMono-Regular, monospace"
                  : undefined,
            }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full overflow-hidden bg-bg relative">
      {/* Zen Mode Overlay */}
      {isZenMode && ZenModeEditor}

      {!isAuthLoading && !isAuthenticated && (
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
        {showSidebar && (
          <>
            <JournalEntryList
              entries={entries}
              selectedId={selectedId}
              onSelect={handleEntrySelect}
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
                className={`p-1.5 rounded-md transition-colors ${!showSidebar ? "bg-accent/10 text-accent" : "text-muted hover:text-default hover:bg-bg-alt"}`}
                title={
                  showSidebar ? "Hide Sidebar (Focus Mode)" : "Show Sidebar"
                }
              >
                <GridIcon className="w-4 h-4" />
              </button>
              <span className="h-4 w-px bg-default/20 mx-1"></span>
              <span className="text-xs text-muted font-mono">
                {wordCount} {wordCount === 1 ? "word" : "words"}
              </span>
              <span className="text-xs text-muted/50">•</span>
              <span className="text-xs text-muted font-mono">
                {readingTime} min read
              </span>
              {/* Daily Goal Widget */}
              {dailyGoal > 0 ? (
                <div className="flex items-center gap-2 ml-2">
                  <div
                    className="relative w-16 h-1.5 bg-default/20 rounded-full overflow-hidden cursor-pointer"
                    onClick={() => setShowGoalInput(true)}
                    title={`${dailyProgress}/${dailyGoal} words today`}
                  >
                    <div
                      className={`absolute left-0 top-0 h-full rounded-full transition-all duration-300 ${
                        dailyProgress >= dailyGoal ? "bg-green-500" : "bg-accent"
                      }`}
                      style={{
                        width: `${Math.min(100, (dailyProgress / dailyGoal) * 100)}%`,
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-muted font-mono">
                    {dailyProgress}/{dailyGoal}
                  </span>
                  {dailyProgress >= dailyGoal && (
                    <span className="text-[10px] text-green-500" title="Goal reached!">
                      ✓
                    </span>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowGoalInput(true)}
                  className="text-[10px] text-muted hover:text-default transition-colors ml-2"
                  title="Set daily writing goal"
                >
                  + Goal
                </button>
              )}
              {showSaveConfirm && (
                <span className="text-xs text-green-500 font-medium animate-pulse">
                  Saved
                </span>
              )}
              {showSaveError && (
                <span className="text-xs text-red-500 font-medium">
                  Save failed
                </span>
              )}
              {autosaveError && !showSaveError && (
                <div className="flex items-center gap-1">
                  <span className="text-xs text-red-500 font-medium">
                    Auto-save failed
                  </span>
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
                <span
                  className="text-xs text-yellow-500 font-medium"
                  title="Not logged in - saved locally only"
                >
                  Local Only
                </span>
              )}
              {isAuthenticated &&
                !autosaveError &&
                !showSaveError &&
                syncStatus === "synced" && (
                  <span
                    className="text-xs text-green-500/70 font-medium"
                    title="Synced to server"
                  >
                    ●
                  </span>
                )}
              {isAuthenticated && syncStatus === "syncing" && (
                <span
                  className="text-xs text-muted font-medium animate-pulse"
                  title="Syncing..."
                >
                  Syncing...
                </span>
              )}
              {isAuthenticated && syncStatus === "local" && (
                <span
                  className="text-xs text-yellow-500/70 font-medium"
                  title="Local changes pending sync"
                >
                  ○
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Font Selector */}
              <select
                value={editorFont}
                onChange={(e) => setEditorFont(e.target.value as "sans" | "serif" | "mono")}
                className="text-[10px] bg-transparent border border-default/30 rounded px-1 py-0.5 text-muted hover:text-default hover:border-default cursor-pointer outline-none"
                title="Editor Font"
              >
                <option value="sans">Sans</option>
                <option value="serif">Serif</option>
                <option value="mono">Mono</option>
              </select>
              {/* Typewriter Mode */}
              <button
                onClick={() => setIsTypewriterMode(!isTypewriterMode)}
                className={`p-1.5 rounded-md transition-all duration-200 ${
                  isTypewriterMode
                    ? "bg-accent/15 text-accent"
                    : "text-muted hover:text-default hover:bg-bg-alt"
                }`}
                title={isTypewriterMode ? "Exit Typewriter Mode" : "Typewriter Mode (center cursor)"}
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
                  <line x1="18" y1="10" x2="6" y2="10" />
                  <line x1="21" y1="6" x2="3" y2="6" />
                  <line x1="21" y1="14" x2="3" y2="14" />
                  <line x1="18" y1="18" x2="6" y2="18" />
                </svg>
              </button>
              {/* Zen Mode */}
              <button
                onClick={() => setIsZenMode(!isZenMode)}
                className={`p-1.5 rounded-md transition-all duration-200 ${
                  isZenMode
                    ? "bg-accent/15 text-accent"
                    : "text-muted hover:text-default hover:bg-bg-alt"
                }`}
                title={isZenMode ? "Exit Zen Mode (Esc)" : "Zen Mode (fullscreen)"}
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
                    <line x1="14" y1="10" x2="21" y2="3" />
                    <line x1="3" y1="21" x2="10" y2="14" />
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
                    <line x1="21" y1="3" x2="14" y2="10" />
                    <line x1="3" y1="21" x2="10" y2="14" />
                  </svg>
                )}
              </button>
              {/* Preview Mode */}
              <button
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className={`p-1.5 rounded-md transition-all duration-200 ${
                  isPreviewMode
                    ? "bg-accent/15 text-accent"
                    : "text-muted hover:text-default hover:bg-bg-alt"
                }`}
                title={isPreviewMode ? "Edit Mode" : "Preview Mode"}
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
                    <line x1="1" y1="1" x2="23" y2="23" />
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
              <button
                onClick={handleManualSave}
                disabled={isSaving || isPreviewMode}
                className="p-1.5 rounded-md transition-all duration-200 text-muted hover:text-green-500 hover:bg-green-500/15 hover:shadow-[0_0_8px_rgba(34,197,94,0.3)] disabled:opacity-50 disabled:hover:text-muted disabled:hover:bg-transparent disabled:hover:shadow-none"
                title="Save Entry"
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
              {/* Download as Markdown */}
              <button
                onClick={handleDownload}
                className="p-1.5 rounded-md transition-all duration-200 text-muted hover:text-blue-500 hover:bg-blue-500/15 hover:shadow-[0_0_8px_rgba(59,130,246,0.3)]"
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
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-1.5 rounded-md transition-all duration-200 text-muted hover:text-red-500 hover:bg-red-500/15 hover:shadow-[0_0_8px_rgba(239,68,68,0.3)]"
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
              <span className="h-4 w-px bg-default/20"></span>
              <button
                onClick={() => setShowTemplate(!showTemplate)}
                className={`px-2 py-1 rounded-md text-xs font-medium transition-colors border ${
                  showTemplate
                    ? "bg-accent text-accent-text border-accent hover:bg-accent-hover"
                    : "bg-bg text-muted border-default/30 hover:text-default hover:border-default"
                }`}
                title="Toggle Reference Pane"
              >
                {showTemplate ? "Hide Reference" : "Reference"}
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
              {isPreviewMode ? (
                <div className="prose prose-sm dark:prose-invert max-w-none min-h-[300px] text-default">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ children }) => (
                        <h1 className="text-2xl font-bold text-default mt-6 mb-3 first:mt-0">
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-xl font-semibold text-default mt-5 mb-2">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-lg font-medium text-default mt-4 mb-2">
                          {children}
                        </h3>
                      ),
                      p: ({ children }) => (
                        <p className="text-sm leading-relaxed text-default mb-3">
                          {children}
                        </p>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc list-inside text-sm text-default mb-3 space-y-1">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal list-inside text-sm text-default mb-3 space-y-1">
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li className="text-sm text-default">{children}</li>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-accent/50 pl-4 italic text-muted my-3">
                          {children}
                        </blockquote>
                      ),
                      code: ({ children, className }) => {
                        const isBlock = className?.includes("language-");
                        return isBlock ? (
                          <pre className="bg-bg-alt rounded-md p-3 overflow-x-auto my-3">
                            <code className="text-xs font-mono text-default">
                              {children}
                            </code>
                          </pre>
                        ) : (
                          <code className="bg-bg-alt px-1.5 py-0.5 rounded text-xs font-mono text-accent">
                            {children}
                          </code>
                        );
                      },
                      a: ({ href, children }) => (
                        <a
                          href={href}
                          className="text-accent hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {children}
                        </a>
                      ),
                      input: ({ checked, type }) =>
                        type === "checkbox" ? (
                          <input
                            type="checkbox"
                            checked={checked}
                            readOnly
                            className="mr-2 accent-accent"
                          />
                        ) : null,
                    }}
                  >
                    {content || "*No content yet...*"}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="relative h-full">
                  <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={handleTextareaInput}
                    onKeyDown={handleTextareaKeyDown}
                    onBlur={handleTextareaBlur}
                    placeholder="Start writing... Type '/' for formatting commands"
                    className={`w-full h-full min-h-[300px] bg-transparent border-none outline-none resize-none text-sm leading-relaxed text-default placeholder:text-muted/30 ${
                      isTypewriterMode ? "pb-[50vh]" : ""
                    } ${
                      editorFont === "serif"
                        ? "font-serif"
                        : editorFont === "mono"
                        ? "font-mono"
                        : ""
                    }`}
                    style={{
                      fontFamily:
                        editorFont === "serif"
                          ? "Georgia, Cambria, serif"
                          : editorFont === "mono"
                          ? "ui-monospace, SFMono-Regular, monospace"
                          : undefined,
                    }}
                  />
                  {showSlashMenu && filteredSlashCommands.length > 0 && (
                    <SlashMenu
                      position={slashMenuPosition}
                      commands={filteredSlashCommands}
                      selectedIndex={slashIndex}
                      onSelect={executeSlashCommand}
                      onMouseEnter={setSlashIndex}
                    />
                  )}
                </div>
              )}
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

      {/* Goal Input Modal */}
      {showGoalInput && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-bg border border-default rounded-lg p-6 max-w-xs mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-default mb-2">
              Daily Writing Goal
            </h3>
            <p className="text-sm text-muted mb-4">
              Set a daily word count target to track your writing progress.
            </p>
            <input
              type="number"
              value={goalInputValue}
              onChange={(e) => setGoalInputValue(e.target.value)}
              placeholder={dailyGoal > 0 ? dailyGoal.toString() : "e.g. 500"}
              className="w-full px-3 py-2 mb-4 bg-bg-alt border border-default rounded-md text-sm text-default placeholder:text-muted/50 outline-none focus:border-accent"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleGoalSubmit();
                if (e.key === "Escape") {
                  setShowGoalInput(false);
                  setGoalInputValue("");
                }
              }}
            />
            <div className="flex justify-between">
              {dailyGoal > 0 && (
                <button
                  onClick={() => {
                    setDailyGoal(0);
                    setDailyProgress(0);
                    setShowGoalInput(false);
                    setGoalInputValue("");
                  }}
                  className="px-3 py-1.5 rounded-md text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  Remove Goal
                </button>
              )}
              <div className="flex gap-2 ml-auto">
                <button
                  onClick={() => {
                    setShowGoalInput(false);
                    setGoalInputValue("");
                  }}
                  className="px-3 py-1.5 rounded-md text-sm font-medium bg-bg-alt text-default border border-default hover:bg-bg-alt/80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGoalSubmit}
                  className="px-3 py-1.5 rounded-md text-sm font-medium bg-accent text-accent-text hover:bg-accent-hover transition-colors"
                >
                  Set Goal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
