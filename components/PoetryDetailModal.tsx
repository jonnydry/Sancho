
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { PoetryItem, LearnMoreResponse } from '../types';
import { ExampleFinder } from './ExampleFinder';
import { XIcon } from './icons/XIcon';
import { fetchLearnMoreContext } from '../services/apiService';
import { SparklesIcon } from './icons/SparklesIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { PinButton } from './PinButton';
import { useAuth } from '../hooks/useAuth.js';
import { ItemTag } from './ItemTag';

import { HistoryIcon } from './icons/HistoryIcon';

interface PoetryDetailModalProps {
  item: PoetryItem;
  onClose: () => void;
  onSelectItem?: (itemName: string) => void;
}

export const PoetryDetailModal: React.FC<PoetryDetailModalProps> = ({ item, onClose, onSelectItem }) => {
  const [learnMoreContext, setLearnMoreContext] = useState<string | null>(null);
  const [isLoadingLearnMore, setIsLoadingLearnMore] = useState(false);
  const [learnMoreError, setLearnMoreError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const dialogRef = useRef<HTMLDivElement | null>(null);

  const handleLearnMore = useCallback(async () => {
    setIsLoadingLearnMore(true);
    setLearnMoreError(null);
    setLearnMoreContext(null);
    try {
      const result = await fetchLearnMoreContext(item.name);
      setLearnMoreContext(result.context);
    } catch (err) {
      setLearnMoreError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoadingLearnMore(false);
    }
  }, [item.name]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const handleTab = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length === 0) {
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    window.addEventListener('keydown', handleEsc);
    window.addEventListener('keydown', handleTab);

    const modalEl = dialogRef.current;
    if (modalEl) {
      const firstFocusable = modalEl.querySelector<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (firstFocusable) {
        firstFocusable.focus();
      } else {
        modalEl.focus();
      }
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
      window.removeEventListener('keydown', handleTab);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in-fast"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      ref={dialogRef}
      tabIndex={-1}
    >
      <div
        className="relative bg-bg rounded-sm w-full max-w-2xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto m-4 animate-modal-in border border-default shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 sm:p-6 md:p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-muted hover:text-default transition-colors"
            aria-label="Close"
          >
            <XIcon className="w-5 h-5" />
          </button>

          <div className="flex flex-col gap-2 mb-6 pr-8">
            <div className="flex items-center gap-3">
              <h2 id="modal-title" className="text-2xl sm:text-3xl font-bold text-default m-0 tracking-tight">{item.name}</h2>
              {isAuthenticated && <PinButton item={item} size="md" />}
            </div>
            <ItemTag type={item.type} className="text-xs" />
          </div>

          <p className="text-default text-base leading-relaxed mb-6 border-l-2 border-default/20 pl-4">{item.description}</p>

          {item.origin && (
            <div className="mb-6">
              <h4 className="font-bold text-sm text-default uppercase tracking-wider mb-2">Origin</h4>
              <p className="text-muted">{item.origin}</p>
            </div>
          )}

          <div className="mb-6">
            <h4 className="font-bold text-sm text-default uppercase tracking-wider mb-2">Conventions</h4>
            <ul className="list-disc list-inside space-y-1 text-muted ml-2">
              {item.structure.map((rule, index) => <li key={index}>{rule}</li>)}
            </ul>
          </div>

          {item.tags && item.tags.length > 0 && (
            <div className="mb-6">
              <h4 className="font-bold text-sm text-default uppercase tracking-wider mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-bg-alt/50 border border-default/30 rounded-sm text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {item.notes && item.notes.length > 0 && (
            <div className="mb-6">
              <h4 className="font-bold text-sm text-default uppercase tracking-wider mb-2">Notes</h4>
              <ul className="list-disc list-inside space-y-1 text-muted ml-2">
                {item.notes.map((note, index) => <li key={index}>{note}</li>)}
              </ul>
            </div>
          )}

          {item.seeAlso && item.seeAlso.length > 0 && (
            <div className="mb-6">
              <h4 className="font-bold text-sm text-default uppercase tracking-wider mb-2">See Also</h4>
              <div className="flex flex-wrap gap-2">
                {item.seeAlso.map((related, index) => (
                  <button
                    key={index}
                    className="px-2 py-1 text-xs bg-accent/10 border border-accent/30 rounded-sm text-accent-text hover:bg-accent/20 transition-colors cursor-pointer"
                    onClick={() => {
                      if (onSelectItem) {
                        onSelectItem(related);
                      }
                    }}
                    aria-label={`View ${related}`}
                  >
                    {related}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mb-8">
            <h4 className="font-bold text-sm text-default uppercase tracking-wider mb-2">Classic Snippet</h4>
            <div className="bg-bg-alt/30 p-4 border border-default/20 rounded-sm">
              <p className="text-default font-mono text-sm italic">"{item.exampleSnippet}"</p>
            </div>
          </div>

          <div className="pt-6 border-t border-default">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <HistoryIcon className="w-5 h-5 text-default" />
                <h4 className="font-bold text-default text-lg">Historical Context</h4>
              </div>
              <button
                onClick={handleLearnMore}
                disabled={isLoadingLearnMore}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-accent-text border border-accent bg-accent/10 backdrop-blur-sm rounded-lg hover:bg-accent/20 hover:border-accent/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoadingLearnMore ? (
                  <SpinnerIcon className="w-4 h-4 animate-spin" />
                ) : (
                  <SparklesIcon className="w-4 h-4" />
                )}
                <span>{isLoadingLearnMore ? 'ANALYZING...' : learnMoreContext !== null ? 'REGENERATE' : 'LEARN MORE'}</span>
              </button>
            </div>

            {learnMoreError && (
              <div className="p-4 text-sm text-red-600 border border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-900 dark:text-red-400 rounded-sm">
                {learnMoreError}
              </div>
            )}

            {learnMoreContext && (
              <div className="p-5 border border-accent/30 bg-accent/5 rounded-sm animate-fade-in">
                <p className="text-default leading-relaxed whitespace-pre-wrap">{learnMoreContext}</p>
              </div>
            )}
          </div>
        </div>

        <ExampleFinder topic={item.name} />
      </div>
    </div>
  );
};
