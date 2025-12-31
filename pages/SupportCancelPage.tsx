import React from 'react';
import { Link } from 'react-router-dom';

export const SupportCancelPage: React.FC = () => {
  return (
    <div className="min-h-screen py-16 sm:py-24 px-4 sm:px-6 animate-fade-in">
      <div className="max-w-xl mx-auto text-center">
        <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-yellow-500/10 flex items-center justify-center">
          <svg className="w-12 h-12 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 9v4M12 17h.01" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="12" r="10"/>
          </svg>
        </div>
        
        <h1 className="text-2xl sm:text-3xl font-bold text-default mb-4 tracking-tight">
          Payment Cancelled
        </h1>
        
        <p className="text-default/90 leading-relaxed mb-8">
          No worries! Your payment was not processed. If you changed your mind or encountered 
          an issue, you can always come back and support Sancho when you're ready.
        </p>

        <div className="bg-bg-alt/30 border border-default/20 p-5 sm:p-6 rounded-sm mb-8">
          <h3 className="text-sm font-bold text-default uppercase tracking-wider mb-3">Having Trouble?</h3>
          <p className="text-sm text-muted">
            If you experienced any issues during checkout, please try again or use a different 
            payment method. Stripe supports most major credit cards and digital wallets.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/support"
            className="inline-block px-6 sm:px-8 py-3 bg-accent text-accent-text text-sm font-semibold uppercase tracking-wider rounded-lg hover:bg-accent-hover transition-colors"
          >
            Try Again
          </Link>
          <Link
            to="/"
            className="inline-block px-6 sm:px-8 py-3 border border-default text-default text-sm font-semibold bg-[rgb(var(--app-bg-alt)/0.4)] hover:bg-[rgb(var(--app-bg-alt)/0.6)] hover:border-accent transition-all duration-300 uppercase tracking-wider rounded-lg"
          >
            Back to Poetry
          </Link>
        </div>
      </div>
    </div>
  );
};
