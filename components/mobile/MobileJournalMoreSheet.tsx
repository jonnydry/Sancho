import React, { useCallback, useState, lazy, Suspense } from 'react';
import { SyncStatus } from '../../hooks/useJournalState';

const GoogleDriveModal = lazy(() => import('../GoogleDriveModal').then(m => ({ default: m.GoogleDriveModal })));

type FontFace = 'monospace' | 'serif' | 'sans-serif';

interface MobileJournalMoreSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleStar?: () => void;
  onTogglePreview?: () => void;
  onOpenReference?: () => void;
  onToggleZen?: () => void;
  onSave?: () => void;
  onDelete?: () => void;
  onDownload?: () => void;
  onImport?: (content: string, title: string) => void;
  onFontChange?: (face: FontFace) => void;
  onFontSizeChange?: (size: 'increase' | 'decrease') => void;
  isStarred?: boolean;
  isPreviewMode?: boolean;
  isZenMode?: boolean;
  isSaving?: boolean;
  syncStatus?: SyncStatus;
  wordCount?: number;
  currentFontFace?: FontFace;
  currentFontSize?: number;
  entryId?: string | null;
  entryTitle?: string;
}

const FontFaceOptions: { value: FontFace; label: string }[] = [
  { value: 'sans-serif', label: 'Sans' },
  { value: 'serif', label: 'Serif' },
  { value: 'monospace', label: 'Mono' },
];

export const MobileJournalMoreSheet: React.FC<MobileJournalMoreSheetProps> = ({
  isOpen,
  onClose,
  onToggleStar,
  onTogglePreview,
  onOpenReference,
  onToggleZen,
  onSave,
  onDelete,
  onDownload,
  onImport,
  onFontChange,
  onFontSizeChange,
  isStarred = false,
  isPreviewMode = false,
  isZenMode = false,
  isSaving = false,
  syncStatus = 'synced',
  wordCount,
  currentFontFace = 'sans-serif',
  currentFontSize = 18,
  entryId,
  entryTitle,
}) => {
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [showDriveModal, setShowDriveModal] = useState(false);

  const handleStar = useCallback(() => {
    onToggleStar?.();
  }, [onToggleStar]);

  const handlePreview = useCallback(() => {
    onTogglePreview?.();
  }, [onTogglePreview]);

  const handleZen = useCallback(() => {
    onToggleZen?.();
  }, [onToggleZen]);

  const handleReference = useCallback(() => {
    onClose();
    onOpenReference?.();
  }, [onClose, onOpenReference]);

  const handleSave = useCallback(async () => {
    await onSave?.();
    onClose();
  }, [onSave, onClose]);

  const handleDelete = useCallback(() => {
    onClose();
    onDelete?.();
  }, [onClose, onDelete]);

  const handleDownload = useCallback(() => {
    onDownload?.();
    onClose();
  }, [onDownload, onClose]);

  const handleFontSelect = useCallback((face: FontFace) => {
    onFontChange?.(face);
    setShowFontMenu(false);
  }, [onFontChange]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      <div
        className="fixed inset-x-0 bottom-0 z-50 bg-bg rounded-t-2xl shadow-xl animate-slide-up safe-area-bottom max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2 sticky top-0 bg-bg">
          <div className="w-10 h-1 bg-muted/30 rounded-full" />
        </div>

        <div className="px-4 pb-6">
          {/* Sync status & word count row */}
          {(syncStatus || wordCount !== undefined) && (
            <div className="flex items-center gap-3 px-3 py-2 mb-2 rounded-lg bg-bg-alt/50">
              {syncStatus && (
                <div className="flex items-center gap-2">
                  {syncStatus === 'syncing' ? (
                    <svg className="animate-spin w-3.5 h-3.5 text-accent" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                  ) : syncStatus === 'local' ? (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500" />
                    </span>
                  ) : syncStatus === 'error' ? (
                    <span className="flex h-2 w-2 rounded-full bg-red-500" />
                  ) : (
                    <span className="flex h-2 w-2 rounded-full bg-green-500/70" />
                  )}
                  <span className="text-xs text-muted">
                    {syncStatus === 'syncing' && 'Syncing...'}
                    {syncStatus === 'local' && 'Local only'}
                    {syncStatus === 'error' && 'Error'}
                    {syncStatus === 'synced' && 'Synced'}
                  </span>
                </div>
              )}
              {wordCount !== undefined && (
                <span className="text-xs text-muted">{wordCount} words</span>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="space-y-1">
            {/* Zen Mode */}
            {onToggleZen && (
              <button
                onClick={handleZen}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left hover:bg-bg-alt active:bg-bg-alt transition-colors"
              >
                {isZenMode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                    <polyline points="4 14 10 14 10 20" />
                    <polyline points="20 10 14 10 14 4" />
                    <line x1="14" x2="21" y1="10" y2="3" />
                    <line x1="3" x2="10" y1="21" y2="14" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted">
                    <polyline points="15 3 21 3 21 9" />
                    <polyline points="9 21 3 21 3 15" />
                    <line x1="21" x2="14" y1="3" y2="10" />
                    <line x1="3" x2="10" y1="21" y2="14" />
                  </svg>
                )}
                <span className="font-medium text-default">{isZenMode ? 'Exit Zen Mode' : 'Zen Mode'}</span>
              </button>
            )}

            {onToggleStar && (
              <button
                onClick={handleStar}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left hover:bg-bg-alt active:bg-bg-alt transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill={isStarred ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth="2"
                  className={isStarred ? 'text-yellow-500' : 'text-muted'}
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <span className="font-medium text-default">{isStarred ? 'Unstar' : 'Star'}</span>
              </button>
            )}

            {onTogglePreview && (
              <button
                onClick={handlePreview}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left hover:bg-bg-alt active:bg-bg-alt transition-colors"
              >
                {isPreviewMode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" x2="23" y1="1" y2="23" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
                <span className="font-medium text-default">{isPreviewMode ? 'Edit mode' : 'Preview mode'}</span>
              </button>
            )}

            {onOpenReference && (
              <button
                onClick={handleReference}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left hover:bg-bg-alt active:bg-bg-alt transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
                <span className="font-medium text-default">Reference</span>
              </button>
            )}

            {/* Font controls */}
            {onFontChange && (
              <div className="relative">
                <button
                  onClick={() => setShowFontMenu(!showFontMenu)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left hover:bg-bg-alt active:bg-bg-alt transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted">
                    <polyline points="4 7 4 4 20 4 20 7" />
                    <line x1="9" y1="20" x2="15" y2="20" />
                    <line x1="12" y1="4" x2="12" y2="20" />
                  </svg>
                  <span className="font-medium text-default">Font: {FontFaceOptions.find(f => f.value === currentFontFace)?.label}</span>
                  <span className="text-xs text-muted ml-auto">{currentFontSize}px</span>
                </button>
                
                {showFontMenu && (
                  <div className="ml-4 mt-1 space-y-1 bg-bg-alt rounded-lg p-2">
                    <div className="flex gap-1 mb-2">
                      {FontFaceOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleFontSelect(option.value)}
                          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                            currentFontFace === option.value
                              ? 'bg-accent text-white'
                              : 'bg-bg text-default hover:bg-bg-alt'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onFontSizeChange?.('decrease')}
                        className="flex-1 py-2 px-3 rounded-lg bg-bg text-default hover:bg-bg-alt transition-colors text-sm"
                      >
                        A-
                      </button>
                      <span className="text-sm text-muted">{currentFontSize}px</span>
                      <button
                        onClick={() => onFontSizeChange?.('increase')}
                        className="flex-1 py-2 px-3 rounded-lg bg-bg text-default hover:bg-bg-alt transition-colors text-sm"
                      >
                        A+
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Google Drive */}
            <button
              onClick={() => {
                onClose();
                setShowDriveModal(true);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left hover:bg-bg-alt active:bg-bg-alt transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
              <span className="font-medium text-default">Google Drive</span>
            </button>

            {/* Download */}
            {onDownload && (
              <button
                onClick={handleDownload}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left hover:bg-bg-alt active:bg-bg-alt transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" x2="12" y1="15" y2="3" />
                </svg>
                <span className="font-medium text-default">Download as Markdown</span>
              </button>
            )}

            {onSave && (
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left hover:bg-bg-alt active:bg-bg-alt transition-colors disabled:opacity-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-muted">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="font-medium text-default">
                  {isSaving ? 'Saving...' : 'Save'}
                </span>
              </button>
            )}

            {onDelete && (
              <button
                onClick={handleDelete}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left hover:bg-red-500/10 active:bg-red-500/15 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                <span className="font-medium text-red-500">Delete</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Google Drive Modal */}
      <Suspense fallback={null}>
        {showDriveModal && (
          <GoogleDriveModal
            isOpen={showDriveModal}
            onClose={() => setShowDriveModal(false)}
            entryTitle={entryTitle || ''}
            entryId={entryId || null}
            onExportComplete={(result) => {
              console.log('Export result:', result);
            }}
            onImportComplete={(content, title) => {
              onImport?.(content, title);
              setShowDriveModal(false);
            }}
          />
        )}
      </Suspense>
    </>
  );
};
