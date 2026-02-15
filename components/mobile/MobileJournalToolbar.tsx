import React, { memo } from 'react';

interface MobileJournalToolbarProps {
  onTogglePreview?: () => void;
  onOpenReference?: () => void;
  onToggleStar?: () => void;
  onSave?: () => void;
  onToggleZen?: () => void;
  isPreviewMode?: boolean;
  isStarred?: boolean;
  isZenMode?: boolean;
  isSaving?: boolean;
}

export const MobileJournalToolbar: React.FC<MobileJournalToolbarProps> = memo(({
  onTogglePreview,
  onOpenReference,
  onToggleStar,
  onSave,
  onToggleZen,
  isPreviewMode = false,
  isStarred = false,
  isZenMode = false,
  isSaving = false,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-3 pt-2 bg-bg/95 backdrop-blur-sm border-t border-default/10 safe-area-bottom">
      <div className="flex items-center justify-center gap-1 bg-bg-alt rounded-full px-2 py-1.5 shadow-sm">
        {/* Zen Mode */}
        {onToggleZen && (
          <button
            onClick={onToggleZen}
            className={`p-2.5 rounded-full transition-all duration-200 interactive-base ${
              isZenMode
                ? 'text-accent bg-accent/20'
                : 'text-muted interactive-muted hover:bg-bg hover:shadow-sm'
            }`}
            aria-label={isZenMode ? 'Exit Zen Mode' : 'Zen Mode'}
          >
            {isZenMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="4 14 10 14 10 20" />
                <polyline points="20 10 14 10 14 4" />
                <line x1="14" x2="21" y1="10" y2="3" />
                <line x1="3" x2="10" y1="21" y2="14" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 3 21 3 21 9" />
                <polyline points="9 21 3 21 3 15" />
                <line x1="21" x2="14" y1="3" y2="10" />
                <line x1="3" x2="10" y1="21" y2="14" />
              </svg>
            )}
          </button>
        )}

        <div className="w-px h-5 bg-default/20 mx-1" />

        {/* Preview Toggle */}
        {onTogglePreview && (
          <button
            onClick={onTogglePreview}
            className={`p-2.5 rounded-full transition-all duration-200 interactive-base ${
              isPreviewMode
                ? 'text-accent bg-accent/20'
                : 'text-muted interactive-muted hover:bg-bg hover:shadow-sm'
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

        {/* Reference */}
        {onOpenReference && (
          <button
            onClick={onOpenReference}
            className="p-2.5 rounded-full text-muted interactive-muted hover:bg-bg hover:shadow-sm transition-all duration-200 interactive-base"
            aria-label="Open reference"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </button>
        )}

        <div className="w-px h-5 bg-default/20 mx-1" />

        {/* Star */}
        {onToggleStar && (
          <button
            onClick={onToggleStar}
            className={`p-2.5 rounded-full transition-all duration-200 interactive-base ${
              isStarred
                ? 'text-yellow-500 bg-yellow-500/20'
                : 'text-muted interactive-muted hover:bg-bg hover:shadow-sm'
            }`}
            aria-label={isStarred ? 'Unstar' : 'Star'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill={isStarred ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </button>
        )}

        {/* Save */}
        {onSave && (
          <button
            onClick={onSave}
            disabled={isSaving}
            className={`p-2.5 rounded-full transition-all duration-200 interactive-base disabled:opacity-50 ${
              isSaving
                ? 'text-accent bg-accent/20'
                : 'text-muted interactive-muted hover:text-green-500 hover:bg-green-500/10'
            }`}
            aria-label="Save"
          >
            {isSaving ? (
              <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
});
