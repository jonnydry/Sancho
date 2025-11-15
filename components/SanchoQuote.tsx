import React, { useState, useEffect } from 'react';
import { getRandomSanchoQuote, SanchoQuote as SanchoQuoteType } from '../data/sanchoQuotes';
import { fetchSanchoQuote } from '../services/apiService';
import { SpinnerIcon } from './icons/SpinnerIcon';

export const SanchoQuote: React.FC = () => {
  const [quote, setQuote] = useState<SanchoQuoteType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [usedFallback, setUsedFallback] = useState(false);

  useEffect(() => {
    let isMounted = true;
    // Simulate loading delay for better UX (even though it's instant)
    const loadQuote = async () => {
      setIsLoading(true);
      setUsedFallback(false);
      // Small delay to show loading state briefly
      await new Promise(resolve => setTimeout(resolve, 300));
      try {
        const remoteQuote = await fetchSanchoQuote();
        if (!isMounted) return;
        setQuote({
          quote: remoteQuote.quote,
          context: remoteQuote.context,
        });
      } catch (error) {
        console.error('Failed to fetch Sancho quote:', error);
        if (!isMounted) return;
        setQuote(getRandomSanchoQuote());
        setUsedFallback(true);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadQuote();

    return () => {
      isMounted = false;
    };
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
      {usedFallback && (
        <p className="mb-3 text-xs text-muted" role="status">
          Showing a stored quote while the live quote service is unavailable.
        </p>
      )}
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
