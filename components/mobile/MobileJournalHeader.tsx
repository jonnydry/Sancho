import React, { memo } from 'react';
import { SyncStatus } from '../../hooks/useJournalState';

interface MobileJournalHeaderProps {
  // Navigation
  showBackButton?: boolean;
  onBack?: () => void;
  title?: string;

  // Actions
  onSave?: () => void;
  onDelete?: () => void;
  onToggleStar?: () => void;
  onTogglePreview?: () => void;
  onOpenReference?: () => void;

  // State
  isStarred?: boolean;
  isPreviewMode?: boolean;
  isSaving?: boolean;
  syncStatus?: SyncStatus;

  // Stats (for editor)
  wordCount?: number;
}

export const MobileJournalHeader: React.FC<MobileJournalHeaderProps> = memo(({
  showBackButton = false,
  onBack,
  title,
  onSave,
  onDelete,
  onToggleStar,
  onTogglePreview,
  onOpenReference,
  isStarred = false,
  isPreviewMode = false,
  isSaving = false,
  syncStatus = 'synced',
  wordCount,
}) => {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-default bg-bg safe-area-top sticky top-0 z-20">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {showBackButton && onBack && (
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-lg text-muted interactive-muted hover:bg-bg-alt transition-colors interactive-base"
            aria-label="Go back"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
        )}

        {title ? (
          <h1 className="text-base font-semibold text-default truncate">{title}</h1>
        ) : (
          <span className="text-sm font-bold text-muted uppercase tracking-wider">Journal</span>
        )}

        {/* Sync status indicator */}
        {syncStatus && (
          <div className="flex items-center shrink-0">
            {syncStatus === 'syncing' ? (
              <span className="flex items-center gap-1 text-accent">
                <svg className="animate-spin w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
              </span>
            ) : syncStatus === 'local' ? (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
              </span>
            ) : syncStatus === 'error' ? (
              <span className="flex h-2 w-2 rounded-full bg-red-500"></span>
            ) : syncStatus === 'synced' ? (
              <span className="flex h-2 w-2 rounded-full bg-green-500/70"></span>
            ) : null}
          </div>
        )}

        {wordCount !== undefined && (
          <span className="text-xs text-muted shrink-0">{wordCount}w</span>
        )}
      </div>

      <div className="flex items-center gap-1">
        {/* Star button */}
        {onToggleStar && (
          <button
            onClick={onToggleStar}
            className={`p-2 rounded-lg transition-colors interactive-base ${
              isStarred
                ? 'text-yellow-500'
                : 'text-muted interactive-muted hover:bg-bg-alt'
            }`}
            aria-label={isStarred ? 'Unstar' : 'Star'}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill={isStarred ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="2"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </button>
        )}

        {/* Preview toggle */}
        {onTogglePreview && (
          <button
            onClick={onTogglePreview}
            className={`p-2 rounded-lg transition-colors interactive-base ${
              isPreviewMode
                ? 'text-accent bg-accent/10'
                : 'text-muted interactive-muted hover:bg-bg-alt'
            }`}
            aria-label={isPreviewMode ? 'Edit mode' : 'Preview mode'}
          >
            {isPreviewMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" x2="23" y1="1" y2="23" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        )}

        {/* Reference button */}
        {onOpenReference && (
          <button
            onClick={onOpenReference}
            className="p-2 rounded-lg text-muted interactive-muted hover:bg-bg-alt transition-colors interactive-base"
            aria-label="Open reference"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </button>
        )}

        {/* Save button */}
        {onSave && (
          <button
            onClick={onSave}
            disabled={isSaving}
            className="p-2 rounded-lg text-muted hover:text-green-500 hover:bg-green-500/15 transition-colors interactive-base disabled:opacity-50"
            aria-label="Save"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </button>
        )}

        {/* Delete button */}
        {onDelete && (
          <button
            onClick={onDelete}
            className="p-2 rounded-lg text-muted hover:text-red-500 hover:bg-red-500/15 transition-colors interactive-base"
            aria-label="Delete"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        )}
      </div>
    </header>
  );
});
