import React, { useState, useEffect } from 'react';
import { getRandomSanchoQuote, SanchoQuote as SanchoQuoteType } from '../data/sanchoQuotes';
import { SpinnerIcon } from './icons/SpinnerIcon';

export const SanchoQuote: React.FC = () => {
  const [quote, setQuote] = useState<SanchoQuoteType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay for better UX (even though it's instant)
    const loadQuote = async () => {
      setIsLoading(true);
      // Small delay to show loading state briefly
      await new Promise(resolve => setTimeout(resolve, 300));
      setQuote(getRandomSanchoQuote());
      setIsLoading(false);
    };

    loadQuote();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto my-8 p-6 border border-default rounded-lg bg-alt/50 animate-fade-in flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <SpinnerIcon className="w-5 h-5 animate-spin text-muted" />
          <span className="text-muted">Loading wisdom...</span>
        </div>
      </div>
    );
  }

  if (!quote) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto my-8 p-6 border border-default rounded-2xl bg-alt/50 animate-fade-in">
      <div className="flex items-start gap-3">
        <div className="text-3xl text-muted leading-none">"</div>
        <div className="flex-1">
          <p className="text-default italic leading-relaxed">
            {quote.quote}
          </p>
          {quote.context && (
            <p className="text-sm text-muted mt-3">
              — Sancho Panza, <span className="italic">Don Quixote</span> ({quote.context})
            </p>
          )}
        </div>
        <div className="text-3xl text-muted leading-none self-end">"</div>
      </div>
    </div>
  );
};
