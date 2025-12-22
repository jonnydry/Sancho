import React, { useState, useEffect, lazy, Suspense, useRef, useCallback } from 'react';
import { usePinnedItems } from '../contexts/PinnedItemsContext';
import { useNotification } from '../contexts/NotificationContext';
import { PoetryItem } from '../types';
import { XIcon } from './icons/XIcon';
import { BookPenIcon } from './icons/BookPenIcon';
import { PoetryCard } from './PoetryCard';
import { JournalEditor } from './JournalEditor';

const PoetryDetailModal = lazy(() => import('./PoetryDetailModal').then(module => ({ default: module.PoetryDetailModal })));

const ModalFallback = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/70">
    <p className="text-muted font-mono text-sm animate-pulse">Loading context...</p>
  </div>
);

interface NotebookProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'saved' | 'journal';

export const Notebook: React.FC<NotebookProps> = ({ isOpen, onClose }) => {
  const { pinnedItems, isLoading, unpinItem } = usePinnedItems();
  const { showNotification } = useNotification();
  const [selectedItem, setSelectedItem] = useState<PoetryItem | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('saved');
  const previousOverflow = useRef<string | null>(null);

  const restoreOverflow = useCallback(() => {
    if (typeof document === 'undefined') return;
    if (previousOverflow.current === null) return;
    document.body.style.overflow = previousOverflow.current;
    previousOverflow.current = null;
  }, []);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      if (typeof document !== 'undefined') {
        if (previousOverflow.current === null) {
          previousOverflow.current = document.body.style.overflow || '';
        }
        document.body.style.overflow = 'hidden';
      }
    } else {
      restoreOverflow();
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
      restoreOverflow();
    };
  }, [isOpen, onClose, restoreOverflow]);

  const handleCardClick = (item: PoetryItem) => {
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch('/api/auth/delete-account', {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (response.ok) {
        showNotification('Account deleted successfully. Goodbye!', 'success');
        // Redirect to home after a short delay
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      } else {
        const data = await response.json();
        showNotification(data.error || 'Failed to delete account', 'error');
      }
    } catch (error) {
      showNotification('Failed to delete account. Please try again.', 'error');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-bg/50 backdrop-blur-sm z-40 animate-fade-in-fast"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full bg-bg/80 backdrop-blur-md backdrop-brightness-150 dark:backdrop-brightness-100 border-l border-default z-50 shadow-2xl flex flex-col animate-slide-in-right transition-all duration-300 ease-in-out ${
          activeTab === 'journal' ? 'max-w-4xl' : 'max-w-md'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="notebook-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-default">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <BookPenIcon className="w-6 h-6 text-default" />
              <h2 id="notebook-title" className="text-lg sm:text-xl font-bold text-default">
                Notebook
              </h2>
            </div>
            
            {/* Tabs */}
            <div className="flex bg-bg-alt/50 rounded-lg p-1 ml-4">
              <button
                onClick={() => setActiveTab('saved')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  activeTab === 'saved' 
                    ? 'bg-bg shadow-sm text-default' 
                    : 'text-muted hover:text-default'
                }`}
              >
                Saved Items
                {pinnedItems.length > 0 && activeTab !== 'saved' && (
                  <span className="ml-1.5 text-[10px] bg-accent/20 text-accent px-1.5 py-0.5 rounded-full">
                    {pinnedItems.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('journal')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  activeTab === 'journal' 
                    ? 'bg-bg shadow-sm text-default' 
                    : 'text-muted hover:text-default'
                }`}
              >
                Journal
              </button>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="text-muted hover:text-default transition-colors"
            aria-label="Close Notebook"
          >
            <XIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Content */}
        {activeTab === 'saved' ? (
          <>
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="text-muted">Loading...</div>
                </div>
              ) : pinnedItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <BookPenIcon className="w-12 h-12 text-muted/30 mb-4" />
                  <h3 className="text-lg font-semibold text-default mb-2">Your notebook is empty</h3>
                  <p className="text-sm text-muted max-w-xs">
                    Pin poetry entries you want to save for later by clicking the pin icon on any card.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pinnedItems.map((item, index) => (
                    <div key={item.name} className="relative">
                      <PoetryCard
                        item={item}
                        onSelect={handleCardClick}
                        animationIndex={index}
                        variant="matte"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Account Section */}
            <div className="border-t border-default p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted">Account</span>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-xs text-muted hover:text-red-500 transition-colors"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 overflow-hidden">
            <JournalEditor />
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-bg/70 backdrop-blur-sm"
            onClick={() => !isDeleting && setShowDeleteConfirm(false)}
          />
          <div className="relative bg-bg-alt border border-default rounded-lg p-6 max-w-sm w-full shadow-2xl animate-modal-in">
            <h3 className="text-lg font-bold text-default mb-2">Delete Account?</h3>
            <p className="text-sm text-muted mb-6">
              This will permanently delete your account and all saved notebook items. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 text-sm font-medium text-default bg-bg border border-default rounded hover:bg-bg-alt transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for selected item */}
      {selectedItem && (
        <Suspense fallback={<ModalFallback />}>
          <PoetryDetailModal item={selectedItem} onClose={handleCloseModal} />
        </Suspense>
      )}
    </>
  );
};
