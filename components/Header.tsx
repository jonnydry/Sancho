import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ThemeSwitcher } from './ThemeSwitcher';
import { useAuth } from '../hooks/useAuth.js';
import { PenIcon } from './icons/PenIcon';
import { Notebook } from './Notebook';

export const Header: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [isNotebookOpen, setIsNotebookOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 w-full bg-[rgb(var(--app-bg-alt)/0.8)] backdrop-blur-md border-b border-[rgb(var(--app-border)/0.5)] z-50">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-6">
            <Link to="/" className="text-base sm:text-lg md:text-xl font-bold text-default hover:text-accent transition-colors">
              Sancho.ref
            </Link>
            <nav className="flex gap-2 sm:gap-4">
              <Link to="/about" className="text-xs sm:text-sm text-muted hover:text-default transition-colors">
                About
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            {isAuthenticated && (
              <button
                onClick={() => setIsNotebookOpen(true)}
                className="flex items-center justify-center p-1.5 sm:p-2 text-muted hover:text-default transition-colors rounded-md hover:bg-hover"
                aria-label="Open Notebook"
                title="Notebook"
              >
                <PenIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}
            <ThemeSwitcher />
            <div className="flex items-center gap-2 sm:gap-3">
              {isLoading ? (
                <span className="text-xs sm:text-sm text-muted">Loading...</span>
              ) : isAuthenticated && user ? (
                <>
                  <span className="hidden sm:inline text-xs sm:text-sm text-muted truncate max-w-[100px]">
                    {user.email || 'User'}
                  </span>
                  <a
                    href="/api/logout"
                    className="text-xs sm:text-sm text-default hover:text-accent transition-colors"
                  >
                    Log out
                  </a>
                </>
              ) : (
                <a
                  href="/api/login"
                  className="text-xs sm:text-sm px-2 sm:px-3 py-1 rounded bg-accent text-accent-text hover:bg-accent-hover transition-colors whitespace-nowrap"
                >
                  Log in
                </a>
              )}
            </div>
          </div>
        </div>
      </header>
      {isAuthenticated && <Notebook isOpen={isNotebookOpen} onClose={() => setIsNotebookOpen(false)} />}
    </>
  );
};
