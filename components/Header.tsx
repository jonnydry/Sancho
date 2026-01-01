import React, { useState, Suspense, lazy, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ThemeSwitcher } from './ThemeSwitcher';
import { FontControls } from './FontControls';
import { useAuth } from '../hooks/useAuth.js';
import { BookPenIcon } from './icons/BookPenIcon';
import { UpgradePrompt } from './UpgradePrompt';

const notebookImport = () => import('./Notebook').then(module => ({ default: module.Notebook }));
const Notebook = lazy(notebookImport);

const NotebookFallback = () => (
  <div className="fixed inset-0 z-40 flex items-end justify-end pointer-events-none">
    <div className="w-full max-w-md h-24 bg-bg/80 border-l border-default/30" aria-hidden="true" />
    <span className="sr-only">Loading notebook</span>
  </div>
);

const OverflowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </svg>
);

const OVERFLOW_THRESHOLD = 480;

export const Header: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [isNotebookOpen, setIsNotebookOpen] = useState(false);
  const [isNotebookHovered, setIsNotebookHovered] = useState(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [isOverflowOpen, setIsOverflowOpen] = useState(false);
  const [showOverflow, setShowOverflow] = useState(false);
  
  const headerRef = useRef<HTMLDivElement>(null);
  const overflowMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAuthenticated) {
      notebookImport();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const checkOverflow = () => {
      const availableWidth = header.offsetWidth;
      setShowOverflow(availableWidth < OVERFLOW_THRESHOLD);
    };

    const resizeObserver = new ResizeObserver(checkOverflow);
    resizeObserver.observe(header);
    checkOverflow();

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!isOverflowOpen) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      if (overflowMenuRef.current && !overflowMenuRef.current.contains(e.target as Node)) {
        setIsOverflowOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOverflowOpen]);

  const notebookButton = (
    <button
      onClick={() => setIsNotebookOpen(true)}
      onMouseEnter={() => setIsNotebookHovered(true)}
      onMouseLeave={() => setIsNotebookHovered(false)}
      className="flex items-center justify-center p-1.5 sm:p-2 rounded-full text-muted hover:text-accent hover:bg-accent/10 transition-all duration-200 interactive-base interactive-scale"
      aria-label="Open Notebook"
      title="Notebook"
    >
      <BookPenIcon className="w-4 h-4 sm:w-5 sm:h-5" heartFilled={isNotebookHovered} />
    </button>
  );

  const authSection = (
    <div className="flex items-center gap-1.5 sm:gap-3 pl-1.5 sm:pl-3 border-l border-default">
      {isLoading ? (
        <span className="text-xs text-muted">...</span>
      ) : isAuthenticated && user ? (
        <a
          href="/api/logout"
          className="flex items-center gap-1.5 sm:gap-2 group interactive-base"
          title="Click to logout"
        >
          {user.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt={user.email || 'User profile'}
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover ring-1 ring-transparent group-hover:ring-accent/50 transition-all shadow-sm group-hover:shadow-md"
            />
          ) : (
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-accent/20 flex items-center justify-center text-[10px] sm:text-xs text-default ring-1 ring-transparent group-hover:ring-accent/50 transition-all shadow-sm group-hover:shadow-md">
              {user.firstName?.charAt(0) || user.email?.charAt(0) || 'U'}
            </div>
          )}
          <span className="hidden sm:inline text-xs text-muted interactive-muted group-hover:transition-colors font-medium">
            Logout
          </span>
        </a>
      ) : (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsUpgradeOpen(true)}
            className="text-[10px] sm:text-xs font-medium text-accent bg-accent/10 hover:bg-accent/20 px-2 py-0.5 rounded-full transition-all interactive-base interactive-scale"
          >
            Upgrade
          </button>
          <a
            href="/api/login"
            className="text-xs font-medium text-default interactive-muted hover:underline underline-offset-4 transition-all interactive-base"
          >
            Login
          </a>
        </div>
      )}
    </div>
  );

  return (
    <>
      <header className="sticky top-0 w-full bg-bg/80 backdrop-blur-md border-b border-default z-50 px-4 sm:px-6 md:px-8">
        <div className="max-w-5xl mx-auto h-16 flex items-center justify-between">
          <Link to="/" className="text-lg font-bold text-default hover:text-accent transition-colors tracking-tight leading-none interactive-base flex-shrink-0">
            SanchoPoetry.ref
          </Link>
          
          <div ref={headerRef} className="flex items-center gap-1.5 sm:gap-3 min-w-0 justify-end flex-1 ml-4">
            {!showOverflow && (
              <div className="flex items-center gap-1.5 sm:gap-3">
                {notebookButton}
                <FontControls />
                <span className="h-4 w-px bg-default/20"></span>
                <ThemeSwitcher />
                {authSection}
              </div>
            )}

            {showOverflow && (
              <>
                {notebookButton}
                
                <div className="relative" ref={overflowMenuRef}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsOverflowOpen(!isOverflowOpen);
                    }}
                    className="flex items-center justify-center p-1.5 sm:p-2 rounded-full text-muted hover:bg-accent/10 transition-all duration-200 interactive-base"
                    aria-label="More options"
                    title="More options"
                  >
                    <OverflowIcon />
                  </button>

                  {isOverflowOpen && (
                    <div className="absolute top-full right-0 mt-2 bg-bg-alt border border-default rounded-lg shadow-lg z-50 py-2 min-w-[180px] animate-fade-in-fast">
                      <div className="px-3 py-2 border-b border-default/50">
                        <div className="text-[10px] uppercase tracking-wider text-muted mb-2">Font</div>
                        <FontControls />
                      </div>
                      <div className="px-3 py-2">
                        <div className="text-[10px] uppercase tracking-wider text-muted mb-2">Theme</div>
                        <ThemeSwitcher />
                      </div>
                    </div>
                  )}
                </div>

                {authSection}
              </>
            )}
          </div>
        </div>
      </header>
      <Suspense fallback={<NotebookFallback />}>
        <Notebook isOpen={isNotebookOpen} onClose={() => setIsNotebookOpen(false)} />
      </Suspense>
      <UpgradePrompt isOpen={isUpgradeOpen} onClose={() => setIsUpgradeOpen(false)} />
    </>
  );
};
