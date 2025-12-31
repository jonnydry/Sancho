import React from 'react';
import { Link } from 'react-router-dom';

export const FloatingFooter: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 w-full bg-bg/80 backdrop-blur-md border-t border-default z-50 px-4 sm:px-6 md:px-8">
      <div className="max-w-5xl mx-auto h-12 flex items-center justify-between">
        <nav className="flex items-center gap-3 sm:gap-5">
          <Link 
            to="/about" 
            className="text-xs sm:text-sm text-muted interactive-muted hover:underline underline-offset-4 transition-all leading-none interactive-base"
          >
            About
          </Link>
          <Link 
            to="/support" 
            className="text-xs sm:text-sm text-muted interactive-muted hover:underline underline-offset-4 transition-all leading-none interactive-base"
          >
            Support
          </Link>
          <Link 
            to="/privacy" 
            className="text-xs sm:text-sm text-muted interactive-muted hover:underline underline-offset-4 transition-all leading-none interactive-base"
          >
            Privacy
          </Link>
          <Link 
            to="/terms" 
            className="text-xs sm:text-sm text-muted interactive-muted hover:underline underline-offset-4 transition-all leading-none interactive-base"
          >
            Terms
          </Link>
        </nav>
        <div className="flex items-center gap-2 sm:gap-4">
          <a 
            href="https://x.ai" 
            className="text-xs text-muted/60 hover:text-muted transition-colors hidden sm:inline"
            target="_blank" 
            rel="noopener noreferrer"
          >
            Powered by Replit and xAI Grok models
          </a>
          <span className="text-xs text-muted/60">
            © {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </footer>
  );
};
