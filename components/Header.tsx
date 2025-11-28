import React, { useState, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { ThemeSwitcher } from './ThemeSwitcher';
import { useAuth } from '../hooks/useAuth.js';
import { BookPenIcon } from './icons/BookPenIcon';
const Notebook = lazy(() => import('./Notebook').then(module => ({ default: module.Notebook })));

const NotebookFallback = () => (
  <div className="fixed inset-0 z-40 flex items-end justify-end pointer-events-none">
    <div className="w-full max-w-md h-24 bg-bg/80 border-l border-default/30" aria-hidden="true" />
    <span className="sr-only">Loading notebook</span>
  </div>
);

export const Header: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [isNotebookOpen, setIsNotebookOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 w-full bg-bg/80 backdrop-blur-md border-b border-default z-50 px-4 sm:px-6 md:px-8">
        <div className="max-w-5xl mx-auto py-4 flex items-center justify-between">
          <div className="flex items-baseline gap-4 sm:gap-8">
            <Link to="/" className="text-lg font-bold text-default hover:text-accent transition-colors tracking-tight leading-none">
              Sancho.ref
            </Link>
            <nav className="flex gap-4 sm:gap-6">
              <Link to="/about" className="text-sm text-muted hover:text-default hover:underline underline-offset-4 transition-all leading-none">
                About
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            {isAuthenticated && (
              <button
                onClick={() => setIsNotebookOpen(true)}
                className="flex items-center justify-center p-2 rounded-full text-muted hover:bg-accent/10 hover:text-default transition-colors"
                aria-label="Open Notebook"
                title="Notebook"
              >
                <BookPenIcon className="w-5 h-5" />
              </button>
            )}
            <ThemeSwitcher />
            <div className="flex items-center gap-2 sm:gap-4 pl-2 sm:pl-4 border-l border-default">
              {isLoading ? (
                <span className="text-xs text-muted">...</span>
              ) : isAuthenticated && user ? (
                <>
                  {user.profileImageUrl ? (
                    <img 
                      src={user.profileImageUrl} 
                      alt={user.email || 'User profile'}
                      className="w-6 h-6 rounded-full object-cover"
                      title={user.email || 'User'}
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-xs text-default">
                      {user.firstName?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </div>
                  )}
                  <a
                    href="/api/logout"
                    className="text-xs text-default hover:text-accent hover:underline underline-offset-4 transition-all"
                  >
                    Logout
                  </a>
                </>
              ) : (
                <a
                  href="/api/login"
                  className="text-xs font-medium text-default hover:text-accent hover:underline underline-offset-4 transition-all"
                >
                  Login
                </a>
              )}
            </div>
          </div>
        </div>
      </header>
      {isAuthenticated && isNotebookOpen && (
        <Suspense fallback={<NotebookFallback />}>
          <Notebook isOpen={isNotebookOpen} onClose={() => setIsNotebookOpen(false)} />
        </Suspense>
      )}
    </>
  );
};
