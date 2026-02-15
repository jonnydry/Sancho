import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useJournalState } from '../../hooks/useJournalState';
import { useAuth } from '../../hooks/useAuth';
import { useFont } from '../../hooks/useFont';
import { MobileJournalHeader } from './MobileJournalHeader';
import { MobileJournalList } from './MobileJournalList';
import { MobileJournalEditor } from './MobileJournalEditor';
import { MobileJournalToolbar } from './MobileJournalToolbar';
import { MobileJournalMoreSheet } from './MobileJournalMoreSheet';
import { MobileReferenceSheet } from './MobileReferenceSheet';

type MobileView = 'list' | 'editor';

export const MobileJournal: React.FC = () => {
  const navigate = useNavigate();
  const { entryId } = useParams<{ entryId?: string }>();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { fontFace, fontSize, setFontFace, increaseFontSize, decreaseFontSize } = useFont();

  const {
    entries,
    isLoadingEntries,
    selectedId,
    title,
    content,
    tags,
    isStarred,
    activeTemplate,
    setTitle,
    setContent,
    setTags,
    setActiveTemplate,
    selectEntryById,
    createNewEntry,
    deleteEntry,
    handleSave,
    toggleStar,
    syncStatus,
    autosaveError,
    handleRetrySave,
    wordCount,
    allAvailableTags,
  } = useJournalState();

  // View state
  const [currentView, setCurrentView] = useState<MobileView>(() => {
    return entryId ? 'editor' : 'list';
  });
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false);
  const [showReference, setShowReference] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showMoreSheet, setShowMoreSheet] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);

  // Sync URL with entry selection
  useEffect(() => {
    if (entryId && entryId !== selectedId) {
      selectEntryById(entryId);
      setCurrentView('editor');
    }
  }, [entryId, selectedId, selectEntryById]);

  // Handle Escape key to exit zen mode
  useEffect(() => {
    if (!isZenMode) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Don't exit if modals/sheets are open
        if (!showMoreSheet && !showReference && !showDeleteConfirm) {
          setIsZenMode(false);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZenMode, showMoreSheet, showReference, showDeleteConfirm]);

  // Handle entry selection
  const handleSelectEntry = useCallback((id: string) => {
    setSlideDirection('left');
    selectEntryById(id);
    setCurrentView('editor');
    navigate(`/journal/${id}`, { replace: true });

    // Clear slide direction after animation
    setTimeout(() => setSlideDirection(null), 300);
  }, [selectEntryById, navigate]);

  // Handle back navigation
  const handleBack = useCallback(() => {
    setSlideDirection('right');
    setCurrentView('list');
    navigate('/journal', { replace: true });

    // Clear slide direction after animation
    setTimeout(() => setSlideDirection(null), 300);
  }, [navigate]);

  // Handle new entry
  const handleCreateEntry = useCallback(async () => {
    await createNewEntry();
    // Get the newly created entry (first in the list after creation)
    setSlideDirection('left');
    setCurrentView('editor');

    // Small delay to let state update
    setTimeout(() => {
      const newId = entries[0]?.id;
      if (newId) {
        navigate(`/journal/${newId}`, { replace: true });
      }
      setSlideDirection(null);
    }, 100);
  }, [createNewEntry, navigate, entries]);

  // Handle delete
  const handleDeleteEntry = useCallback(async () => {
    if (!selectedId) return;
    setShowDeleteConfirm(false);
    await deleteEntry(selectedId);
    handleBack();
  }, [selectedId, deleteEntry, handleBack]);

  // Handle manual save
  const handleManualSave = useCallback(async () => {
    setIsSaving(true);
    try {
      await handleSave(true);
      // Haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate([5, 50, 5]);
      }
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  }, [handleSave]);

  // Handle toggle star for current entry
  const handleToggleCurrentStar = useCallback(() => {
    if (selectedId) {
      toggleStar(selectedId);
    }
  }, [selectedId, toggleStar]);

  // Handle reference insert
  const handleReferenceInsert = useCallback((text: string) => {
    setContent(content + '\n\n' + text);
  }, [content, setContent]);

  // Handle zen mode toggle
  const handleToggleZenMode = useCallback(() => {
    setIsZenMode(prev => !prev);
    if ('vibrate' in navigator) {
      navigator.vibrate(5);
    }
  }, []);

  // Handle download
  const handleDownload = useCallback(() => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'untitled'}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, [content, title]);

  // Handle import from Google Drive - creates new entry with imported content
  const handleImport = useCallback(async (importContent: string, importTitle: string) => {
    await createNewEntry();
    // Wait for state to update
    setTimeout(() => {
      setTitle(importTitle || 'Imported');
      setContent(importContent);
      setCurrentView('editor');
    }, 100);
  }, [createNewEntry, setTitle, setContent]);

  // Get animation class based on view and direction
  const getAnimationClass = () => {
    if (!slideDirection) return '';
    if (currentView === 'editor') {
      return slideDirection === 'left' ? 'mobile-slide-in-left' : 'mobile-slide-out-right';
    }
    return slideDirection === 'right' ? 'mobile-slide-in-right' : 'mobile-slide-out-left';
  };

  return (
    <div className="h-[100dvh] flex flex-col bg-bg overflow-hidden">
      {/* Auth warning banner */}
      {!isAuthLoading && !isAuthenticated && (
        <div className="bg-yellow-500/10 border-b border-yellow-500/30 px-4 py-2 flex items-center gap-2 shrink-0 safe-area-top">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-yellow-500 shrink-0">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <span className="text-xs text-yellow-600 dark:text-yellow-400 flex-1">
            <strong>Local only</strong> — <a href="/api/login" className="underline">Log in</a> to sync
          </span>
        </div>
      )}

      {/* Autosave error banner */}
      {autosaveError && (
        <div className="bg-red-500/10 border-b border-red-500/30 px-4 py-2 flex items-center justify-between shrink-0">
          <span className="text-xs text-red-600 dark:text-red-400">{autosaveError}</span>
          <button
            onClick={handleRetrySave}
            className="text-xs text-red-600 dark:text-red-400 font-medium underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Main content */}
      <div className={`flex-1 overflow-hidden flex flex-col ${getAnimationClass()}`}>
        {currentView === 'list' ? (
          <>
            <MobileJournalHeader title="Journal" />
            <div className="flex-1 overflow-hidden">
              <MobileJournalList
                entries={entries}
                selectedId={selectedId}
                onSelect={handleSelectEntry}
                onCreate={handleCreateEntry}
                onDelete={deleteEntry}
                onToggleStar={toggleStar}
                isLoading={isLoadingEntries}
              />
            </div>
          </>
        ) : (
          <>
            {!isZenMode && (
              <MobileJournalHeader
                showBackButton
                onBack={handleBack}
                title={title || 'Untitled'}
                onSave={handleManualSave}
                onDelete={() => setShowDeleteConfirm(true)}
                onToggleStar={handleToggleCurrentStar}
                onTogglePreview={() => setIsPreviewMode(!isPreviewMode)}
                onOpenReference={() => setShowReference(true)}
                onMoreOpen={() => setShowMoreSheet(true)}
                isStarred={isStarred}
                isPreviewMode={isPreviewMode}
                isSaving={isSaving}
                syncStatus={syncStatus}
                wordCount={wordCount}
              />
            )}
            <div className={`flex-1 overflow-hidden ${isZenMode ? 'pt-safe' : ''}`}>
              <MobileJournalEditor
                title={title}
                content={content}
                tags={tags}
                allTags={allAvailableTags}
                isPreviewMode={isPreviewMode}
                onTitleChange={setTitle}
                onContentChange={setContent}
                onTagsChange={setTags}
                onSwipeStar={handleToggleCurrentStar}
                onSwipeDelete={() => setShowDeleteConfirm(true)}
                fontFace={fontFace}
                fontSize={fontSize}
              />
              {/* Floating controls in zen mode */}
              {isZenMode && (
                <div className="fixed top-4 right-4 z-50 flex items-center gap-2 p-1.5 rounded-full bg-bg-alt/80 backdrop-blur-sm shadow-md">
                  {/* Preview toggle in zen mode */}
                  <button
                    onClick={() => setIsPreviewMode(!isPreviewMode)}
                    className={`p-1.5 rounded-full transition-all ${
                      isPreviewMode ? 'text-accent bg-accent/20' : 'text-muted hover:text-default hover:bg-bg/50'
                    }`}
                    aria-label={isPreviewMode ? 'Edit mode' : 'Preview mode'}
                  >
                    {isPreviewMode ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" x2="23" y1="1" y2="23" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                  {/* Exit zen mode */}
                  <button
                    onClick={handleToggleZenMode}
                    className="p-1.5 rounded-full text-muted hover:text-default hover:bg-bg/50 transition-all"
                    aria-label="Exit Zen Mode"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="4 14 10 14 10 20" />
                      <polyline points="20 10 14 10 14 4" />
                      <line x1="14" x2="21" y1="10" y2="3" />
                      <line x1="3" x2="10" y1="21" y2="14" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
            {/* Bottom toolbar - hidden in zen mode */}
            {!isZenMode && (
              <MobileJournalToolbar
                onTogglePreview={() => setIsPreviewMode(!isPreviewMode)}
                onOpenReference={() => setShowReference(true)}
                onToggleStar={handleToggleCurrentStar}
                onSave={handleManualSave}
                onToggleZen={handleToggleZenMode}
                isPreviewMode={isPreviewMode}
                isStarred={isStarred}
                isZenMode={isZenMode}
                isSaving={isSaving}
              />
            )}
          </>
        )}
      </div>

      {/* More action sheet */}
      <MobileJournalMoreSheet
        isOpen={showMoreSheet}
        onClose={() => setShowMoreSheet(false)}
        onToggleStar={handleToggleCurrentStar}
        onTogglePreview={() => setIsPreviewMode(!isPreviewMode)}
        onOpenReference={() => setShowReference(true)}
        onToggleZen={handleToggleZenMode}
        onSave={handleManualSave}
        onDelete={() => setShowDeleteConfirm(true)}
        onDownload={handleDownload}
        onImport={handleImport}
        onFontChange={setFontFace}
        onFontSizeChange={(action) => action === 'increase' ? increaseFontSize() : decreaseFontSize()}
        isStarred={isStarred}
        isPreviewMode={isPreviewMode}
        isZenMode={isZenMode}
        isSaving={isSaving}
        syncStatus={syncStatus}
        wordCount={wordCount}
        currentFontFace={fontFace}
        currentFontSize={fontSize}
        entryId={selectedId}
        entryTitle={title}
      />

      {/* Reference bottom sheet */}
      <MobileReferenceSheet
        isOpen={showReference}
        onClose={() => setShowReference(false)}
        onInsert={handleReferenceInsert}
        onSelectTemplate={setActiveTemplate}
        selectedTemplate={activeTemplate}
      />

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 safe-area-bottom">
          <div className="bg-bg rounded-t-2xl w-full max-w-lg p-6 animate-slide-up">
            <h3 className="text-lg font-bold text-default mb-2">Delete Entry?</h3>
            <p className="text-sm text-muted mb-6">
              Are you sure you want to delete "{title || 'Untitled'}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 rounded-xl text-default font-medium bg-bg-alt border border-default"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteEntry}
                className="flex-1 py-3 rounded-xl text-white font-medium bg-red-500 active:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
