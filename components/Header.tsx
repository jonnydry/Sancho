import React from 'react';
import { ThemeSwitcher } from './ThemeSwitcher';
import { useAuth } from '../hooks/useAuth.js';

export const Header: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  return (
    <header className="sticky top-0 w-full bg-default/80 backdrop-blur-md border-b border-default/50 z-50">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg md:text-xl font-bold text-default">
          Sancho.ref
        </h1>
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          <div className="flex items-center gap-3">
            {isLoading ? (
              <span className="text-sm text-muted">Loading...</span>
            ) : isAuthenticated && user ? (
              <>
                <span className="text-sm text-muted">
                  {user.email || 'User'}
                </span>
                <a
                  href="/api/logout"
                  className="text-sm text-default hover:text-accent transition-colors"
                >
                  Log out
                </a>
              </>
            ) : (
              <a
                href="/api/login"
                className="text-sm px-3 py-1 rounded bg-accent text-accent-text hover:bg-accent-hover transition-colors"
              >
                Log in
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
