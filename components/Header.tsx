import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ThemeSwitcher } from './ThemeSwitcher';
import { useAuth } from '../hooks/useAuth.js';
import { BookPenIcon } from './icons/BookPenIcon';
import { Notebook } from './Notebook';

export const Header: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [isNotebookOpen, setIsNotebookOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 w-full bg-bg border-b border-default z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-lg font-bold text-default hover:text-accent transition-colors tracking-tight">
              Sancho.ref
            </Link>
            <nav className="flex gap-6">
              <Link to="/about" className="text-sm text-muted hover:text-default hover:underline underline-offset-4 transition-all">
                About
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated && (
              <button
                onClick={() => setIsNotebookOpen(true)}
                className="flex items-center justify-center p-1.5 text-muted hover:text-default transition-colors"
                aria-label="Open Notebook"
                title="Notebook"
              >
                <BookPenIcon className="w-4 h-4" />
              </button>
            )}
            <ThemeSwitcher />
            <div className="flex items-center gap-4 pl-4 border-l border-default">
              {isLoading ? (
                <span className="text-xs text-muted">...</span>
              ) : isAuthenticated && user ? (
                <>
                  <span className="hidden sm:inline text-xs text-muted truncate max-w-[100px]">
                    {user.email || 'User'}
                  </span>
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
      {isAuthenticated && <Notebook isOpen={isNotebookOpen} onClose={() => setIsNotebookOpen(false)} />}
    </>
  );
};
