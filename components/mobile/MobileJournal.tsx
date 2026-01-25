import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useJournalState } from '../../hooks/useJournalState';
import { useAuth } from '../../hooks/useAuth';
import { MobileJournalHeader } from './MobileJournalHeader';
import { MobileJournalList } from './MobileJournalList';
import { MobileJournalEditor } from './MobileJournalEditor';
import { MobileReferenceSheet } from './MobileReferenceSheet';

type MobileView = 'list' | 'editor';

export const MobileJournal: React.FC = () => {
  const navigate = useNavigate();
  const { entryId } = useParams<{ entryId?: string }>();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

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
  const [showReference, setShowReference] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);

  // Sync URL with entry selection
  useEffect(() => {
    if (entryId && entryId !== selectedId) {
      selectEntryById(entryId);
      setCurrentView('editor');
    }
  }, [entryId, selectedId, selectEntryById]);

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
      <div className={`flex-1 overflow-hidden ${getAnimationClass()}`}>
        {currentView === 'list' ? (
          <>
            <MobileJournalHeader title="Journal" />
            <div className="flex-1 h-[calc(100%-56px)]">
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
            <MobileJournalHeader
              showBackButton
              onBack={handleBack}
              title={title || 'Untitled'}
              onSave={handleManualSave}
              onDelete={() => setShowDeleteConfirm(true)}
              onToggleStar={handleToggleCurrentStar}
              onTogglePreview={() => setIsPreviewMode(!isPreviewMode)}
              onOpenReference={() => setShowReference(true)}
              isStarred={isStarred}
              isPreviewMode={isPreviewMode}
              isSaving={isSaving}
              syncStatus={syncStatus}
              wordCount={wordCount}
            />
            <div className="flex-1 h-[calc(100%-56px)] overflow-hidden">
              <MobileJournalEditor
                title={title}
                content={content}
                tags={tags}
                allTags={allAvailableTags}
                isPreviewMode={isPreviewMode}
                onTitleChange={setTitle}
                onContentChange={setContent}
                onTagsChange={setTags}
              />
            </div>
          </>
        )}
      </div>

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
