
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
      colorClass = 'text-tag-form-text';
      break;
    case 'Meter':
      colorClass = 'text-tag-meter-text';
      break;
    case 'Device':
      colorClass = 'text-tag-device-text';
      break;
  }
  return (
    <span className={`text-xs uppercase tracking-widest font-bold ${colorClass}`}>
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
        const modal = document.querySelector('[role="dialog"]') as HTMLElement;
        if (!modal) return;

        const focusableElements = modal.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleEsc);
    window.addEventListener('keydown', handleTab);

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
        className="relative bg-bg rounded-sm w-full max-w-2xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto m-4 animate-modal-in border border-default shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 sm:p-8">
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
             <Tag type={item.type} />
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

          <div className="mb-8">
            <h4 className="font-bold text-sm text-default uppercase tracking-wider mb-2">Classic Snippet</h4>
            <div className="bg-bg-alt/30 p-4 border border-default/20 rounded-sm">
              <p className="text-default font-mono text-sm italic">"{item.exampleSnippet}"</p>
            </div>
          </div>

          <div className="pt-6 border-t border-default">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-bold text-default text-lg">Historical Context</h4>
              <button
                onClick={handleLearnMore}
                disabled={isLoadingLearnMore || learnMoreContext !== null}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-accent-text bg-accent rounded-sm hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoadingLearnMore ? (
                  <SpinnerIcon className="w-4 h-4 animate-spin" />
                ) : (
                  <SparklesIcon className="w-4 h-4" />
                )}
                <span>{isLoadingLearnMore ? 'ANALYZING...' : 'LEARN MORE'}</span>
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
