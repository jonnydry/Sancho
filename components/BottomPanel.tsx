import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import { PoetryItem } from "../types";
import { fetchLearnMoreContext } from "../services/apiService";
import { HistoryIcon } from "./icons/HistoryIcon";
import { SparklesIcon } from "./icons/SparklesIcon";
import { ArrowUpRightIcon } from "./icons/ArrowUpRightIcon";
import { SpinnerIcon } from "./icons/SpinnerIcon";
import { LightbulbIcon } from "./icons/LightbulbIcon";
import { ActionButton } from "./PoetryDetailModal";
import { getGrokipediaUrl } from "../utils/grokipediaAvailability";

interface BottomPanelProps {
  item: PoetryItem | null;
  isOpen: boolean;
  onToggle: () => void;
  height: number;
  onResize: (delta: number) => void;
  onTagClick?: (tag: string) => void;
  onSeeAlsoClick?: (name: string) => void;
}

const VerticalResizeHandle: React.FC<{ onResize: (delta: number) => void }> =
  memo(({ onResize }) => {
    const [isDragging, setIsDragging] = useState(false);
    const startPosRef = useRef<number | null>(null);

    useEffect(() => {
      if (!isDragging) return;

      const handleMouseMove = (e: MouseEvent) => {
        onResize(-e.movementY);
      };

      const handleTouchMove = (e: TouchEvent) => {
        e.preventDefault();
        if (startPosRef.current === null) return;
        const touch = e.touches[0];
        const delta = startPosRef.current - touch.clientY;
        onResize(delta);
        startPosRef.current = touch.clientY;
      };

      const handleEnd = () => {
        setIsDragging(false);
        startPosRef.current = null;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleEnd);
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleEnd);
      document.body.style.cursor = "row-resize";
      document.body.style.userSelect = "none";

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleEnd);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleEnd);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };
    }, [isDragging, onResize]);

    return (
      <div
        className={`h-px cursor-row-resize flex items-center justify-center group ${
          isDragging ? "bg-accent/40" : "bg-transparent hover:bg-accent/30"
        }`}
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={(e) => {
          setIsDragging(true);
          startPosRef.current = e.touches[0].clientY;
        }}
        role="separator"
        aria-orientation="horizontal"
        aria-label="Resize panel"
        tabIndex={0}
        style={{ marginTop: -1 }}
      >
        <div
          className={`w-8 h-0.5 rounded-full ${
            isDragging ? "bg-accent" : "bg-transparent group-hover:bg-accent/60"
          }`}
        />
      </div>
    );
  });

const TagButton: React.FC<{
  onClick?: () => void;
  children: React.ReactNode;
}> = memo(({ onClick, children }) => (
  <button
    onClick={onClick}
    className="px-2.5 py-1 text-xs font-medium rounded-full bg-accent/10 text-accent hover:bg-accent/20 transition-all duration-200 interactive-base interactive-scale"
  >
    {children}
  </button>
));

type PanelTab = "context" | "links";

export const BottomPanel: React.FC<BottomPanelProps> = ({
  item,
  isOpen,
  onToggle,
  height,
  onResize,
  onTagClick,
  onSeeAlsoClick,
}) => {
  const [activeTab, setActiveTab] = useState<PanelTab>("context");
  const [learnMoreContext, setLearnMoreContext] = useState<string | null>(null);
  const [isLoadingLearnMore, setIsLoadingLearnMore] = useState(false);
  const [learnMoreError, setLearnMoreError] = useState<string | null>(null);
  const previousItemRef = useRef<string | null>(null);

  useEffect(() => {
    if (item && item.name !== previousItemRef.current) {
      setLearnMoreContext(null);
      setLearnMoreError(null);
      previousItemRef.current = item.name;
    }
  }, [item]);

  const handleLearnMore = useCallback(async () => {
    if (!item) return;
    setIsLoadingLearnMore(true);
    setLearnMoreError(null);
    try {
      const result = await fetchLearnMoreContext(item.name);
      setLearnMoreContext(result.context);
    } catch (err) {
      setLearnMoreError(
        err instanceof Error ? err.message : "An unknown error occurred.",
      );
    } finally {
      setIsLoadingLearnMore(false);
    }
  }, [item]);

  if (!item) return null;

  const tabs: { id: PanelTab; label: string; icon: React.ReactNode }[] = [
    {
      id: "context",
      label: "Context",
      icon: <HistoryIcon className="w-3.5 h-3.5" />,
    },
    {
      id: "links",
      label: "Links",
      icon: <ArrowUpRightIcon className="w-3.5 h-3.5" />,
    },
  ];

  const headerHeight = 36;

  return (
    <div
      className="flex flex-col border-t border-default bg-bg"
      style={{ height: isOpen ? height : headerHeight }}
    >
      {isOpen && <VerticalResizeHandle onResize={onResize} />}

      <div
        className="flex items-center justify-between px-3 py-1.5 bg-bg"
        style={{ minHeight: headerHeight - 3 }}
      >
        <div className="flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                if (!isOpen) onToggle();
                setActiveTab(tab.id);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all duration-200 interactive-base ${
                isOpen && activeTab === tab.id
                  ? "bg-accent/15 text-accent shadow-sm"
                  : "text-muted hover:text-default hover:bg-bg-alt/80"
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span
            className="text-xs text-muted truncate max-w-[120px] sm:max-w-[200px]"
            title={item.name}
          >
            {item.name}
          </span>
          <button
            onClick={onToggle}
            className="p-1 rounded text-muted hover:text-default hover:bg-bg-alt transition-all duration-200 interactive-base interactive-scale"
            title={isOpen ? "Collapse panel" : "Expand panel"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
            >
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="flex-1 overflow-auto p-4 pb-16">
          {activeTab === "context" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HistoryIcon className="w-4 h-4 text-accent" />
                  <h4 className="font-semibold text-sm text-default">
                    Historical Context
                  </h4>
                </div>
                <ActionButton
                  onClick={handleLearnMore}
                  disabled={isLoadingLearnMore}
                  loading={isLoadingLearnMore}
                  loadingText="Analyzing..."
                  icon={<LightbulbIcon className="w-3.5 h-3.5" />}
                  loadingIcon={
                    <SpinnerIcon className="w-3.5 h-3.5 animate-spin" />
                  }
                >
                  {learnMoreContext !== null ? "Regenerate" : "Learn More"}
                </ActionButton>
              </div>

              {learnMoreError && (
                <div className="p-3 text-sm text-red-600 border border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-900 dark:text-red-400 rounded-md">
                  {learnMoreError}
                </div>
              )}

              {learnMoreContext && (
                <div className="p-4 bg-bg-alt/30 border border-default/20 rounded-md animate-fade-in">
                  <p className="journal-font text-default/90 leading-relaxed whitespace-pre-wrap">
                    {learnMoreContext}
                  </p>
                </div>
              )}

              {!learnMoreContext && !learnMoreError && !isLoadingLearnMore && (
                <p className="journal-font text-muted">
                  Click "Learn More" to generate historical context about{" "}
                  {item.name}.
                </p>
              )}
            </div>
          )}

          {activeTab === "links" && (
            <div className="space-y-5">
              {item.tags && item.tags.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <SparklesIcon className="w-4 h-4 text-accent" />
                    <h4 className="font-semibold text-sm text-default">Tags</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, index) => (
                      <TagButton key={index} onClick={() => onTagClick?.(tag)}>
                        {tag}
                      </TagButton>
                    ))}
                  </div>
                </div>
              )}

              {item.seeAlso && item.seeAlso.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <ArrowUpRightIcon className="w-4 h-4 text-accent" />
                    <h4 className="font-semibold text-sm text-default">
                      See Also
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.seeAlso.map((related, index) => (
                      <TagButton
                        key={index}
                        onClick={() => onSeeAlsoClick?.(related)}
                      >
                        {related}
                      </TagButton>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <ArrowUpRightIcon className="w-4 h-4 text-accent" />
                  <h4 className="font-semibold text-sm text-default">
                    Further Reading
                  </h4>
                </div>
                <a
                  href={getGrokipediaUrl(item.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md bg-accent/10 text-accent hover:bg-accent/20 transition-all duration-200 interactive-base interactive-scale"
                >
                  <span>Grokipedia</span>
                  <ArrowUpRightIcon className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
