
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { PoetryItem, LearnMoreResponse } from '../types';
import { XIcon } from './icons/XIcon';
import { fetchLearnMoreContext } from '../services/apiService';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { PinButton } from './PinButton';
import { useAuth } from '../hooks/useAuth';
import { ItemTag } from './ItemTag';
import { HistoryIcon } from './icons/HistoryIcon';
import { ArrowUpRightIcon } from './icons/ArrowUpRightIcon';
import { ScrollIcon } from './icons/ScrollIcon';
import { PenIcon } from './icons/PenIcon';
import { InfoIcon } from './icons/InfoIcon';
import { ClassicSnippetsIcon } from './icons/ClassicSnippetsIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { getGrokipediaUrl } from '../utils/grokipediaAvailability';

interface PoetryDetailModalProps {
  item: PoetryItem;
  onClose: () => void;
  onSelectItem?: (itemName: string) => void;
  onTagClick?: (tag: string) => void;
}

const SectionHeader: React.FC<{ icon: React.ReactNode; title: string }> = ({ icon, title }) => (
  <div className="flex items-center gap-2 mb-3">
    <span className="text-muted">{icon}</span>
    <h4 className="font-semibold text-sm text-default uppercase tracking-wide">{title}</h4>
  </div>
);

export const ActionButton: React.FC<{
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  icon: React.ReactNode;
  loadingIcon?: React.ReactNode;
  children: React.ReactNode;
  as?: 'button' | 'a';
  href?: string;
}> = ({ onClick, disabled, loading, loadingText, icon, loadingIcon, children, as = 'button', href }) => {
  const className = "flex items-center justify-center gap-1.5 px-3 py-1.5 h-8 text-xs font-semibold text-accent dark:text-accent-text border border-accent/50 bg-accent/5 rounded-md hover:bg-accent/15 hover:border-accent/70 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-accent/40 whitespace-nowrap leading-none box-border shrink-0";
  
  if (as === 'a') {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {icon}
        <span>{children}</span>
      </a>
    );
  }
  
  return (
    <button onClick={onClick} disabled={disabled || loading} className={className}>
      {loading ? (loadingIcon || icon) : icon}
      <span>{loading ? loadingText : children}</span>
    </button>
  );
};

const TagButton: React.FC<{ onClick?: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="flex items-center justify-center px-2.5 py-1 h-8 text-xs bg-bg-alt/50 border border-default/30 rounded-md text-muted hover:bg-accent/10 hover:text-default hover:border-accent/40 active:scale-[0.98] transition-all duration-150 cursor-pointer"
  >
    {children}
  </button>
);

export const PoetryDetailModal: React.FC<PoetryDetailModalProps> = ({ item, onClose, onSelectItem, onTagClick }) => {
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 backdrop-blur-sm animate-fade-in-fast"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      ref={dialogRef}
      tabIndex={-1}
    >
      <div
        className="relative bg-bg w-full max-w-2xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto m-4 animate-modal-in border border-default/50 shadow-xl rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1 text-muted hover:text-default hover:bg-bg-alt/50 rounded-md active:scale-[0.98] transition-all duration-150"
          aria-label="Close"
        >
          <XIcon className="w-5 h-5" />
        </button>

        {/* ===== ZONE 1: HEADER ===== */}
        <div className="p-6 pb-0">
          <div className="flex flex-col gap-2 pr-8">
            <div className="flex items-center gap-3">
              <h2 id="modal-title" className="text-2xl sm:text-3xl font-bold text-default tracking-tight">{item.name}</h2>
              {isAuthenticated && <PinButton item={item} size="md" />}
            </div>
            <ItemTag type={item.type} className="text-xs" />
          </div>
          <p className="mt-4 text-default/90 leading-relaxed border-l-2 border-accent/30 pl-4 italic">{item.description}</p>
        </div>

        {/* ===== ZONE 2: REFERENCE INFO ===== */}
        <div className="p-6 space-y-5">
          {/* Reference Card */}
          <div className="bg-bg-alt/30 border border-default/20 rounded-lg p-5 space-y-5">
            {item.origin && (
              <div>
                <SectionHeader icon={<ScrollIcon className="w-4 h-4" />} title="Origin" />
                <p className="text-muted text-sm leading-relaxed">{item.origin}</p>
              </div>
            )}

            <div>
              <SectionHeader icon={<PenIcon className="w-4 h-4" />} title="Conventions" />
              <ul className="list-disc list-inside space-y-1.5 text-muted text-sm ml-1">
                {item.structure.map((rule, index) => <li key={index}>{rule}</li>)}
              </ul>
            </div>

            {item.notes && item.notes.length > 0 && (
              <div>
                <SectionHeader icon={<InfoIcon className="w-4 h-4" />} title="Notes" />
                <ul className="list-disc list-inside space-y-1.5 text-muted text-sm ml-1">
                  {item.notes.map((note, index) => <li key={index}>{note}</li>)}
                </ul>
              </div>
            )}
          </div>

          {/* Discovery Card: Tags & See Also */}
          {((item.tags && item.tags.length > 0) || (item.seeAlso && item.seeAlso.length > 0)) && (
            <div className="bg-bg-alt/30 border border-default/20 rounded-lg p-5 space-y-5">
              {item.tags && item.tags.length > 0 && (
                <div>
                  <SectionHeader icon={<SparklesIcon className="w-4 h-4" />} title="Tags" />
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, index) => (
                      <TagButton key={index} onClick={() => onTagClick?.(tag)}>{tag}</TagButton>
                    ))}
                  </div>
                </div>
              )}

              {item.seeAlso && item.seeAlso.length > 0 && (
                <div>
                  <SectionHeader icon={<ArrowUpRightIcon className="w-4 h-4" />} title="See Also" />
                  <div className="flex flex-wrap gap-2">
                    {item.seeAlso.map((related, index) => (
                      <TagButton key={index} onClick={() => onSelectItem?.(related)}>{related}</TagButton>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Classic Snippet */}
          <div>
            <SectionHeader icon={<ClassicSnippetsIcon className="w-4 h-4" />} title="Classic Snippet" />
            <blockquote className="bg-bg-alt/40 border-l-4 border-accent/40 p-4 rounded-r-lg">
              <p className="text-default/90 font-serif text-sm italic leading-relaxed">"{item.exampleSnippet}"</p>
            </blockquote>
          </div>
        </div>

        {/* ===== ZONE 3: AI FEATURES ===== */}
        <div className="mx-6 mb-6 border border-accent/20 bg-accent/[0.02] rounded-lg overflow-hidden">
          {/* Historical Context */}
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <HistoryIcon className="w-4 h-4 text-accent" />
                <h4 className="font-semibold text-sm text-default">Historical Context</h4>
              </div>
              <ActionButton
                onClick={handleLearnMore}
                disabled={isLoadingLearnMore}
                loading={isLoadingLearnMore}
                loadingText="Analyzing..."
                icon={<LightbulbIcon className="w-3.5 h-3.5" />}
                loadingIcon={<SpinnerIcon className="w-3.5 h-3.5 animate-spin" />}
              >
                {learnMoreContext !== null ? 'Regenerate' : 'Learn More'}
              </ActionButton>
            </div>

            {learnMoreError && (
              <div className="p-3 text-sm text-red-600 border border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-900 dark:text-red-400 rounded-md">
                {learnMoreError}
              </div>
            )}

            {learnMoreContext && (
              <div className="p-4 bg-bg border border-default/20 rounded-md animate-fade-in">
                <p className="text-default/90 text-sm leading-relaxed whitespace-pre-wrap">{learnMoreContext}</p>
              </div>
            )}
          </div>
        </div>

        {/* ===== ZONE 4: FURTHER READING ===== */}
        <div className="px-6 pb-6">
          <div className="flex items-center justify-between p-5 bg-bg-alt/30 border border-default/20 rounded-lg">
            <div>
              <h4 className="font-semibold text-sm text-default">Further Reading</h4>
              <p className="text-muted text-xs mt-0.5">Explore more on Grokipedia</p>
            </div>
            <ActionButton
              as="a"
              href={getGrokipediaUrl(item.name)}
              icon={<ArrowUpRightIcon className="w-3.5 h-3.5" />}
            >
              Grokipedia
            </ActionButton>
          </div>
        </div>
      </div>
    </div>
  );
};
