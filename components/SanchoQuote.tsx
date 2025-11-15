import React, { useState, useEffect } from 'react';
import { getRandomSanchoQuote, SanchoQuote as SanchoQuoteType } from '../data/sanchoQuotes';

export const SanchoQuote: React.FC = () => {
  const [quote, setQuote] = useState<SanchoQuoteType | null>(null);

  useEffect(() => {
    // Get a random quote on component mount (page reload)
    setQuote(getRandomSanchoQuote());
  }, []);

  if (!quote) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto my-8 p-6 border border-default rounded-lg bg-alt/50 animate-fade-in">
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
