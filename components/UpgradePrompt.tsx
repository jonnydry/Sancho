import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { XIcon } from './icons/XIcon';
import { BookPenIcon } from './icons/BookPenIcon';
import { InfinityIcon } from './icons/InfinityIcon';
import { RefreshIcon } from './icons/RefreshIcon';
import { CloudIcon } from './icons/CloudIcon';
import { PenIcon } from './icons/PenIcon';

interface UpgradePromptProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UpgradePrompt: React.FC<UpgradePromptProps> = ({ isOpen, onClose }) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    
    previousActiveElement.current = document.activeElement as HTMLElement;
    closeButtonRef.current?.focus();
    
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
      previousActiveElement.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const benefits = [
    { Icon: InfinityIcon, title: 'Unlimited Saves', desc: 'Save as many poetry items as you like' },
    { Icon: PenIcon, title: 'Journal Access', desc: 'Write and organize your poetry notes' },
    { Icon: RefreshIcon, title: 'Sync Everywhere', desc: 'Access your notebook on any device' },
    { Icon: CloudIcon, title: 'Google Drive Export', desc: 'Back up notes to your Drive' },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-bg/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div 
        className="relative bg-bg border border-default rounded-xl p-6 max-w-md w-full shadow-2xl animate-modal-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="upgrade-title"
      >
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-4 right-4 text-muted hover:text-default hover:bg-bg-alt/50 rounded-md p-1 transition-all duration-200 interactive-base"
          aria-label="Close"
        >
          <XIcon className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 mb-3">
            <BookPenIcon className="w-6 h-6 text-accent" heartFilled={true} />
          </div>
          <h2 id="upgrade-title" className="text-xl font-bold text-default mb-1">
            Unlock More with Sancho
          </h2>
          <p className="text-sm text-muted">
            Create a free account to access all features
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="flex items-start gap-3 p-2.5 rounded-lg bg-bg-alt/30 border border-default/30">
              <div className="flex-shrink-0 w-5 h-5 text-accent">
                <benefit.Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-default">{benefit.title}</p>
                <p className="text-xs text-muted">{benefit.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <a
          href="/api/login"
          className="block w-full text-center py-2.5 px-4 bg-accent text-accent-text font-medium rounded-lg hover:bg-accent-hover hover:shadow-md transition-all duration-200 interactive-base interactive-scale"
        >
          Log In for Free
        </a>

        <div className="mt-6 pt-4 border-t border-default/30">
          <p className="text-xs text-muted text-center leading-relaxed">
            Love Sancho? Consider supporting this solo developer project with a{' '}
            <Link to="/support" onClick={onClose} className="text-accent hover:underline underline-offset-2">
              $1/month subscription
            </Link>{' '}
            or a{' '}
            <Link to="/support" onClick={onClose} className="text-accent hover:underline underline-offset-2">
              one-time contribution
            </Link>{' '}
            to keep Sancho a user-first platform.
          </p>
        </div>
      </div>
    </div>
  );
};
