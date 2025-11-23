import React, { useState, useEffect } from 'react';
import { usePinnedItems } from '../contexts/PinnedItemsContext';
import { PoetryItem } from '../types';
import { XIcon } from './icons/XIcon';
import { BookPenIcon } from './icons/BookPenIcon';
import { PoetryCard } from './PoetryCard';
import { PoetryDetailModal } from './PoetryDetailModal';

interface NotebookProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Notebook: React.FC<NotebookProps> = ({ isOpen, onClose }) => {
  const { pinnedItems, isLoading, unpinItem } = usePinnedItems();
  const [selectedItem, setSelectedItem] = useState<PoetryItem | null>(null);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      // Prevent body scroll when sidebar is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleCardClick = (item: PoetryItem) => {
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in-fast"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <div
        className="fixed top-0 right-0 h-full w-full max-w-md bg-bg/50 dark:bg-[rgb(var(--app-bg-alt)/0.2)] backdrop-blur-xl border-l border-default/30 dark:border-[rgb(var(--app-border)/0.2)] z-50 shadow-2xl flex flex-col animate-slide-in-right"
        role="dialog"
        aria-modal="true"
        aria-labelledby="notebook-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-default/20 dark:border-[rgb(var(--app-border)/0.2)]">
          <div className="flex items-center gap-2">
            <BookPenIcon className="w-5 h-5 text-default" />
            <h2 id="notebook-title" className="text-lg sm:text-xl font-bold text-default">
              Notebook
            </h2>
            {pinnedItems.length > 0 && (
              <span className="text-xs font-semibold text-accent-text bg-accent px-2 py-0.5 rounded-full">
                {pinnedItems.length}
              </span>
            )}
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
      </div>

      {/* Modal for selected item */}
      {selectedItem && (
        <PoetryDetailModal item={selectedItem} onClose={handleCloseModal} />
      )}
    </>
  );
};

