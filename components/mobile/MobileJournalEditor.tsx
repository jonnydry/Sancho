import React, { useState, useRef, useCallback, useEffect, lazy, Suspense } from 'react';
import remarkGfm from 'remark-gfm';
import { MobileTagInput } from './MobileTagInput';
import { SLASH_COMMANDS, SlashCommand, replaceSlashCommand } from '../SlashMenu';
import { getCaretCoordinates } from '../../utils/cursor';

// Lazy load components
const ReactMarkdown = lazy(() => import('react-markdown'));
const SlashMenu = lazy(() => import('../SlashMenu').then(m => ({ default: m.SlashMenu })));

interface MobileJournalEditorProps {
  title: string;
  content: string;
  tags: string[];
  allTags: string[];
  isPreviewMode?: boolean;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onTagsChange: (tags: string[]) => void;
  onSwipeStar?: () => void;
  onSwipeDelete?: () => void;
  fontFace?: 'monospace' | 'serif' | 'sans-serif';
  fontSize?: number;
}

const PreviewLoadingFallback: React.FC = () => (
  <div className="p-4 space-y-2 animate-pulse">
    <div className="h-4 bg-default/10 rounded w-3/4"></div>
    <div className="h-4 bg-default/10 rounded w-5/6"></div>
    <div className="h-4 bg-default/10 rounded w-2/3"></div>
  </div>
);

export const MobileJournalEditor: React.FC<MobileJournalEditorProps> = ({
  title,
  content,
  tags,
  allTags,
  isPreviewMode = false,
  onTitleChange,
  onContentChange,
  onTagsChange,
  onSwipeStar,
  onSwipeDelete,
  fontFace = 'sans-serif',
  fontSize = 18,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const contentRef = useRef<string>(content);
  const containerRef = useRef<HTMLDivElement>(null);

  // Swipe gesture state
  const [swipeX, setSwipeX] = useState(0);
  const swipeStartX = useRef<number | null>(null);
  const SWIPE_THRESHOLD = 80;

  // Slash command state
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashMenuPosition, setSlashMenuPosition] = useState({ top: 0, left: 0 });
  const [slashQuery, setSlashQuery] = useState('');
  const [slashSelectedIndex, setSlashSelectedIndex] = useState(0);

  // Keyboard state
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Keep content ref in sync
  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  // Handle keyboard on iOS/Android
  useEffect(() => {
    const handleResize = () => {
      if (window.visualViewport) {
        const viewportHeight = window.visualViewport.height;
        const windowHeight = window.innerHeight;
        const keyboardVisible = windowHeight - viewportHeight > 100;
        setKeyboardHeight(keyboardVisible ? windowHeight - viewportHeight : 0);
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
      window.visualViewport.addEventListener('scroll', handleResize);
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
        window.visualViewport.removeEventListener('scroll', handleResize);
      }
    };
  }, []);

  // Slash command detection
  const handleTextareaInput = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      const cursorPos = e.target.selectionStart;

      onContentChange(value);
      contentRef.current = value;

      // Slash command detection
      const textBefore = value.substring(0, cursorPos);
      const match = textBefore.match(/\/([a-zA-Z0-9]*)$/);

      if (match) {
        setShowSlashMenu(true);
        setSlashQuery(match[1]);
        setSlashSelectedIndex(0);

        // Calculate position for menu, constrained to viewport on small screens
        const coords = getCaretCoordinates(e.target, cursorPos);
        const rect = e.target.getBoundingClientRect();
        const scrollTop = e.target.scrollTop;
        const menuWidth = 220;
        const menuHeight = 280;
        const padding = 8;
        const viewportWidth = window.innerWidth;

        // Horizontal: clamp to stay within viewport
        let left = coords.left + 10;
        left = Math.max(padding, Math.min(left, viewportWidth - menuWidth - padding));
        // Also keep within textarea bounds
        left = Math.max(0, Math.min(left, rect.width - menuWidth));

        // Vertical: prefer below caret, but show above if near bottom
        let top = coords.top - scrollTop + 24;
        const spaceBelow = rect.height - (coords.top - scrollTop) - 30;
        if (spaceBelow < menuHeight && coords.top > menuHeight) {
          // Render above caret
          top = coords.top - scrollTop - menuHeight - 8;
        } else {
          top = Math.min(top, rect.height - menuHeight - padding);
        }
        top = Math.max(padding, top);

        setSlashMenuPosition({ top, left });
      } else {
        setShowSlashMenu(false);
      }
    },
    [onContentChange]
  );

  // Execute slash command
  const executeSlashCommand = useCallback(
    (command: SlashCommand) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const cursorPos = textarea.selectionStart;
      const { text, newCursor } = replaceSlashCommand(contentRef.current, cursorPos, command.action);

      onContentChange(text);
      contentRef.current = text;
      setShowSlashMenu(false);

      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(newCursor, newCursor);
        }
      });

      // Haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(5);
      }
    },
    [onContentChange]
  );

  // Handle keyboard navigation for slash menu and list continuation
  const handleTextareaKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (showSlashMenu) {
        const filteredCommands = SLASH_COMMANDS.filter(
          (cmd) =>
            cmd.label.toLowerCase().includes(slashQuery.toLowerCase()) ||
            cmd.id.includes(slashQuery.toLowerCase())
        );

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSlashSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSlashSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          const command = filteredCommands[slashSelectedIndex];
          if (command) {
            executeSlashCommand(command);
          }
        } else if (e.key === 'Escape') {
          setShowSlashMenu(false);
        }
      } else if (e.key === 'Enter' && !e.shiftKey) {
        // List auto-continuation
        const currentContent = contentRef.current;
        const textarea = e.currentTarget;
        const cursorPos = textarea.selectionStart;
        const textBefore = currentContent.substring(0, cursorPos);

        const lastNewline = textBefore.lastIndexOf('\n');
        const currentLine = textBefore.substring(lastNewline + 1);

        const checklistMatch = currentLine.match(/^(\s*)-\s\[[x\s]\]\s(.*)$/i);
        const bulletMatch = currentLine.match(/^(\s*)-\s(.*)$/);
        const numberedMatch = currentLine.match(/^(\s*)(\d+)\.\s(.*)$/);

        let listPrefix: string | null = null;
        let isEmptyItem = false;
        let lineStartPos = lastNewline + 1;

        if (checklistMatch) {
          const [, indent, itemContent] = checklistMatch;
          isEmptyItem = itemContent.trim() === '';
          listPrefix = `\n${indent}- [ ] `;
        } else if (bulletMatch) {
          const [, indent, itemContent] = bulletMatch;
          isEmptyItem = itemContent.trim() === '';
          listPrefix = `\n${indent}- `;
        } else if (numberedMatch) {
          const [, indent, num, itemContent] = numberedMatch;
          isEmptyItem = itemContent.trim() === '';
          listPrefix = `\n${indent}${parseInt(num, 10) + 1}. `;
        }

        if (listPrefix !== null) {
          e.preventDefault();

          if (isEmptyItem) {
            const beforeLine = currentContent.substring(0, lineStartPos);
            const afterCursor = currentContent.substring(cursorPos);
            const newContent = beforeLine + afterCursor;

            onContentChange(newContent);
            contentRef.current = newContent;

            requestAnimationFrame(() => {
              if (textareaRef.current) {
                textareaRef.current.focus();
                textareaRef.current.setSelectionRange(lineStartPos, lineStartPos);
              }
            });
          } else {
            const beforeCursor = currentContent.substring(0, cursorPos);
            const afterCursor = currentContent.substring(cursorPos);
            const newContent = beforeCursor + listPrefix + afterCursor;
            const newCursorPos = cursorPos + listPrefix.length;

            onContentChange(newContent);
            contentRef.current = newContent;

            requestAnimationFrame(() => {
              if (textareaRef.current) {
                textareaRef.current.focus();
                textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
              }
            });
          }
        }
      }
    },
    [showSlashMenu, slashQuery, slashSelectedIndex, executeSlashCommand, onContentChange]
  );

  // Swipe gesture handlers
  // Only trigger swipes when touch starts on left/right edge of screen (not on text content)
  const SWIPE_EDGE_WIDTH = 40; // pixels from edge to detect swipe zone

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (isPreviewMode) return;
    const touch = e.touches[0];
    const screenWidth = window.innerWidth;
    const isOnEdge = touch.clientX < SWIPE_EDGE_WIDTH || touch.clientX > screenWidth - SWIPE_EDGE_WIDTH;
    
    if (isOnEdge) {
      swipeStartX.current = touch.clientX;
    } else {
      swipeStartX.current = null;
    }
  }, [isPreviewMode]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (swipeStartX.current === null || isPreviewMode) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - swipeStartX.current;
    
    // Only track horizontal swipes
    if (Math.abs(deltaX) > 10) {
      e.preventDefault();
      setSwipeX(deltaX);
    }
  }, [isPreviewMode]);

  const handleTouchEnd = useCallback(() => {
    if (swipeStartX.current === null) return;
    
    const deltaX = swipeX;
    
    if (deltaX > SWIPE_THRESHOLD) {
      // Swipe right - star
      onSwipeStar?.();
      if ('vibrate' in navigator) {
        navigator.vibrate([10, 50, 10]);
      }
    } else if (deltaX < -SWIPE_THRESHOLD) {
      // Swipe left - delete
      onSwipeDelete?.();
      if ('vibrate' in navigator) {
        navigator.vibrate([10, 50, 10]);
      }
    }
    
    setSwipeX(0);
    swipeStartX.current = null;
  }, [swipeX, onSwipeStar, onSwipeDelete]);

  const handleTouchCancel = useCallback(() => {
    setSwipeX(0);
    swipeStartX.current = null;
  }, []);

  // Get swipe action background color
  const getSwipeBackground = () => {
    if (swipeX > SWIPE_THRESHOLD) return 'bg-yellow-500/20';
    if (swipeX < -SWIPE_THRESHOLD) return 'bg-red-500/20';
    return '';
  };

  // Get swipe action icon
  const getSwipeIcon = () => {
    if (swipeX > SWIPE_THRESHOLD) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="text-yellow-500">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );
    }
    if (swipeX < -SWIPE_THRESHOLD) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
      );
    }
    return null;
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col h-full overflow-hidden relative"
      style={{ paddingBottom: keyboardHeight > 0 ? keyboardHeight : undefined }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
    >
      {/* Swipe background indicators - only show when actively swiping */}
      {Math.abs(swipeX) > 10 && (
        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${getSwipeBackground()}`}>
          <div className="opacity-80">
            {getSwipeIcon()}
          </div>
        </div>
      )}
      
      {/* Title input */}
      <div className="px-4 pt-4 pb-2">
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Untitled Note"
          className="w-full bg-transparent border-none text-xl font-bold text-default focus:ring-0 outline-none placeholder:text-muted/30"
          disabled={isPreviewMode}
        />
      </div>

      {/* Tag input (collapsible) */}
      <div className="px-4 pb-2">
        <MobileTagInput
          tags={tags}
          onChange={onTagsChange}
          allTags={allTags}
          placeholder="Add tags..."
          disabled={isPreviewMode}
        />
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-auto px-4 pb-4">
        {isPreviewMode ? (
          <Suspense fallback={<PreviewLoadingFallback />}>
            <div className="markdown-preview prose prose-sm max-w-none text-default">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content || '*Start writing to see preview...*'}
              </ReactMarkdown>
            </div>
          </Suspense>
        ) : (
          <div className="relative h-full min-h-[300px]">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={handleTextareaInput}
              onKeyDown={handleTextareaKeyDown}
              placeholder="Start writing... Type '/' for commands"
              className="journal-font w-full h-full bg-transparent border-none outline-none resize-none leading-relaxed text-default placeholder:text-muted/30"
              style={{ 
                minHeight: '300px',
                fontFamily: fontFace === 'monospace' ? "'Source Code Pro', 'Menlo', 'Monaco', monospace" : 
                             fontFace === 'serif' ? "'Source Serif Pro', 'Georgia', 'Times New Roman', serif" : 
                             "'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
                fontSize: fontSize,
              }}
            />

            {/* Slash command menu */}
            {showSlashMenu && (
              <Suspense fallback={null}>
                <div
                  className="absolute z-50"
                  style={{
                    top: slashMenuPosition.top,
                    left: slashMenuPosition.left,
                  }}
                >
                  <SlashMenu
                    position={{ top: 0, left: 0 }}
                    query={slashQuery}
                    selectedIndex={slashSelectedIndex}
                    onSelect={executeSlashCommand}
                    onClose={() => setShowSlashMenu(false)}
                    onNavigate={(dir) => {
                      if (typeof dir === 'number') {
                        setSlashSelectedIndex(dir);
                      }
                    }}
                  />
                </div>
              </Suspense>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
