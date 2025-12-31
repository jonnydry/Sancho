import React, { useState, Suspense, lazy, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ThemeSwitcher } from './ThemeSwitcher';
import { FontControls } from './FontControls';
import { useAuth } from '../hooks/useAuth.js';
import { BookPenIcon } from './icons/BookPenIcon';
import { useTheme } from '../hooks/useTheme';

const notebookImport = () => import('./Notebook').then(module => ({ default: module.Notebook }));
const Notebook = lazy(notebookImport);

const NotebookFallback = () => (
  <div className="fixed inset-0 z-40 flex items-end justify-end pointer-events-none">
    <div className="w-full max-w-md h-24 bg-bg/80 border-l border-default/30" aria-hidden="true" />
    <span className="sr-only">Loading notebook</span>
  </div>
);

export const Header: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { mode } = useTheme();
  const [isNotebookOpen, setIsNotebookOpen] = useState(false);
  const [isNotebookHovered, setIsNotebookHovered] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      notebookImport();
    }
  }, [isAuthenticated]);

  return (
    <>
      <header className="sticky top-0 w-full bg-bg/80 backdrop-blur-md border-b border-default z-50 px-4 sm:px-6 md:px-8">
        <div className="max-w-5xl mx-auto h-16 flex items-center justify-between">
          <Link to="/" className="text-lg font-bold text-default hover:text-accent transition-colors tracking-tight leading-none interactive-base">
            SanchoPoetry.ref
          </Link>
          <div className="flex items-center gap-1.5 sm:gap-3">
            {isAuthenticated && (
              <button
                onClick={() => setIsNotebookOpen(true)}
                onMouseEnter={() => setIsNotebookHovered(true)}
                onMouseLeave={() => setIsNotebookHovered(false)}
                className={`flex items-center justify-center p-1.5 sm:p-2 rounded-full text-muted transition-all duration-200 interactive-base interactive-scale ${mode === 'dark' ? 'hover:bg-accent/10 hover:text-white' : 'hover:bg-accent/10 interactive-muted'
                  }`}
                aria-label="Open Notebook"
                title="Notebook"
              >
                <BookPenIcon className="w-4 h-4 sm:w-5 sm:h-5" heartFilled={isNotebookHovered} />
              </button>
            )}
            <FontControls />
            <span className="h-4 w-px bg-default/20"></span>
            <ThemeSwitcher />
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
                <a
                  href="/api/login"
                  className="text-xs font-medium text-default interactive-muted hover:underline underline-offset-4 transition-all interactive-base"
                >
                  Login
                </a>
              )}
            </div>
          </div>
        </div>
      </header>
      {isAuthenticated && (
        <Suspense fallback={<NotebookFallback />}>
          <Notebook isOpen={isNotebookOpen} onClose={() => setIsNotebookOpen(false)} />
        </Suspense>
      )}
    </>
  );
};
