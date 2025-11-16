
import React, { useEffect, useState, useCallback } from 'react';
import { PoetryItem, LearnMoreResponse } from '../types';
import { ExampleFinder } from './ExampleFinder';
import { XIcon } from './icons/XIcon';
import { fetchLearnMoreContext } from '../services/apiService';
import { SparklesIcon } from './icons/SparklesIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { PinButton } from './PinButton';
import { useAuth } from '../hooks/useAuth.js';

interface PoetryDetailModalProps {
  item: PoetryItem;
  onClose: () => void;
}

const Tag: React.FC<{ type: PoetryItem['type'] }> = ({ type }) => {
  let colorClass = '';
  switch (type) {
    case 'Form':
      colorClass = 'bg-tag-form/10 text-tag-form-text dark:bg-tag-form/20';
      break;
    case 'Meter':
      colorClass = 'bg-tag-meter/10 text-tag-meter-text dark:bg-tag-meter/20';
      break;
    case 'Device':
      colorClass = 'bg-tag-device/10 text-tag-device-text dark:bg-tag-device/20';
      break;
  }
  return (
    <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold rounded-full ${colorClass}`}>
      {type}
    </span>
  );
};

export const PoetryDetailModal: React.FC<PoetryDetailModalProps> = ({ item, onClose }) => {
  const [learnMoreContext, setLearnMoreContext] = useState<string | null>(null);
  const [isLoadingLearnMore, setIsLoadingLearnMore] = useState(false);
  const [learnMoreError, setLearnMoreError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

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
      if (event.key === 'Tab') {
        // Get all focusable elements within the modal
        const modal = document.querySelector('[role="dialog"]') as HTMLElement;
        if (!modal) return;

        const focusableElements = modal.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (event.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleEsc);
    window.addEventListener('keydown', handleTab);

    // Focus trap: focus the first focusable element when modal opens
    const modal = document.querySelector('[role="dialog"]') as HTMLElement;
    if (modal) {
      const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') as HTMLElement;
      if (firstFocusable) {
        firstFocusable.focus();
      } else {
        modal.focus();
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
    >
      <div
        className="relative bg-bg rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto m-3 sm:m-4 animate-modal-in border border-default"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-6">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 text-muted/50 hover:text-muted transition-colors"
            aria-label="Close"
          >
            <XIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <div className="flex justify-between items-start mb-3 sm:mb-4 pr-8 sm:pr-10">
            <h2 id="modal-title" className="text-lg sm:text-xl md:text-2xl font-bold text-default flex-1 pr-2 sm:pr-4">{item.name}</h2>
            <div className="flex items-center gap-2">
              {isAuthenticated && <PinButton item={item} size="md" />}
              <Tag type={item.type} />
            </div>
          </div>
          <p className="text-default text-sm sm:text-base mb-3 sm:mb-4">{item.description}</p>

          {item.origin && (
            <div className="mb-4">
              <h4 className="font-semibold text-default mb-2">Origin:</h4>
              <p className="text-default">{item.origin}</p>
            </div>
          )}
          
          <div className="mb-4">
              <h4 className="font-semibold text-default mb-2">Conventions:</h4>
              <ul className="list-disc list-inside space-y-1 text-default">
                  {item.structure.map((rule, index) => <li key={index}>{rule}</li>)}
              </ul>
          </div>

          <div className="mb-4">
            <h4 className="font-semibold text-default mb-2">Classic Snippet:</h4>
            <p className="text-default italic">"{item.exampleSnippet}"</p>
          </div>

          <div className="mt-4 mb-4 p-4 border-t border-default">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-default">Historical & Cultural Context</h4>
              <button
                onClick={handleLearnMore}
                disabled={isLoadingLearnMore || learnMoreContext !== null}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-accent-text bg-accent rounded-lg hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent dark:focus:ring-offset-bg-alt"
              >
                {isLoadingLearnMore ? (
                  <SpinnerIcon className="w-5 h-5 animate-spin" />
                ) : (
                  <SparklesIcon className="w-5 h-5" />
                )}
                <span>{isLoadingLearnMore ? 'Generating...' : 'Learn More'}</span>
              </button>
            </div>
            
            {learnMoreError && (
              <div className="mt-4 p-3 text-sm text-red-700 bg-red-100 dark:bg-red-900/50 dark:text-red-300 rounded-lg">
                {learnMoreError}
              </div>
            )}

            {learnMoreContext && (
              <div className="mt-4 p-4 border-l-4 border-accent bg-bg-alt/50 rounded-r-lg animate-fade-in">
                <p className="text-default whitespace-pre-wrap">{learnMoreContext}</p>
              </div>
            )}
          </div>
        </div>
        
        <ExampleFinder topic={item.name} />
      </div>
    </div>
  );
};
