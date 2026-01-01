import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CookieIcon } from './icons/CookieIcon';
import { XIcon } from './icons/XIcon';

const CONSENT_KEY = 'sancho_cookie_consent';

export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasConsent = localStorage.getItem(CONSENT_KEY);
    if (!hasConsent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setIsVisible(false);
  };

  const handleDismiss = () => {
    localStorage.setItem(CONSENT_KEY, 'dismissed');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-16 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-[60] animate-fade-in">
      <div className="bg-bg/95 backdrop-blur-md border border-default/30 rounded-lg shadow-xl p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
            <CookieIcon className="w-4 h-4 text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-default mb-1">Cookie Notice</h3>
            <p className="text-xs text-muted leading-relaxed mb-3">
              We use essential cookies for authentication and session management. No tracking or advertising cookies are used. See our{' '}
              <Link to="/privacy" className="text-accent hover:underline underline-offset-2">
                Privacy Policy
              </Link>{' '}
              for details.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handleAccept}
                className="px-3 py-1.5 text-xs font-medium bg-accent text-accent-text rounded hover:bg-accent/90 transition-colors"
              >
                Accept
              </button>
              <button
                onClick={handleDismiss}
                className="px-3 py-1.5 text-xs font-medium text-muted hover:text-default transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1 text-muted hover:text-default transition-colors"
            aria-label="Close cookie notice"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
