import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getRandomSanchoQuote, SanchoQuote as SanchoQuoteType, sanchoQuotes } from '../data/sanchoQuotes';
import { fetchSanchoQuote } from '../services/apiService';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { RefreshIcon } from './icons/RefreshIcon';

// Client-side cache for quotes - persists for 3 minutes
const CACHE_DURATION = 3 * 60 * 1000; // 3 minutes
const FALLBACK_CACHE_DURATION = 10 * 1000; // 10 seconds for fallback quotes
interface CachedQuote {
  quote: SanchoQuoteType;
  timestamp: number;
  isAI: boolean;
}

export const SanchoQuote: React.FC = () => {
  const [quote, setQuote] = useState<SanchoQuoteType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [usedFallback, setUsedFallback] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sessionFallbackIndex, setSessionFallbackIndex] = useState(0);
  const cacheRef = useRef<CachedQuote | null>(null);

  // Get a rotating fallback quote instead of random
  const getRotatingFallbackQuote = useCallback((): SanchoQuoteType => {
    const index = sessionFallbackIndex % sanchoQuotes.length;
    setSessionFallbackIndex(prev => prev + 1);
    return sanchoQuotes[index];
  }, [sessionFallbackIndex]);

  // Load quote with caching
  const loadQuote = useCallback(async (forceRefresh = false): Promise<void> => {
    // Check cache first (unless forcing refresh)
    if (!forceRefresh && cacheRef.current) {
      const { quote: cachedQuote, timestamp, isAI } = cacheRef.current;
      const cacheDuration = isAI ? CACHE_DURATION : FALLBACK_CACHE_DURATION;
      if (Date.now() - timestamp < cacheDuration) {
        setQuote(cachedQuote);
        setUsedFallback(!isAI);
        return;
      }
      // Cache expired, clear it
      cacheRef.current = null;
    }

    setIsLoading(true);
    try {
      const remoteQuote = await fetchSanchoQuote();

      // Validate the quote response
      if (!remoteQuote?.quote || typeof remoteQuote.quote !== 'string') {
        throw new Error('Invalid quote response from AI service');
      }

      const newQuote: SanchoQuoteType = {
        quote: remoteQuote.quote.trim(),
        context: remoteQuote.context?.trim() || undefined,
      };

      setQuote(newQuote);
      setUsedFallback(false);

      // Cache the AI quote
      cacheRef.current = {
        quote: newQuote,
        timestamp: Date.now(),
        isAI: true,
      };

    } catch (error) {
      console.error('Failed to fetch Sancho quote:', error);
      // Always get a new fallback quote (don't cache fallbacks to ensure rotation)
      const fallbackQuote = getRotatingFallbackQuote();
      setQuote(fallbackQuote);
      setUsedFallback(true);

      // Don't cache fallback quotes when manually refreshing to ensure variety
      if (!forceRefresh) {
        cacheRef.current = {
          quote: fallbackQuote,
          timestamp: Date.now(),
          isAI: false,
        };
      } else {
        // Clear cache on manual refresh to ensure new quote
        cacheRef.current = null;
      }
    } finally {
      setIsLoading(false);
    }
  }, [getRotatingFallbackQuote]);

  // Refresh quote function
  const handleRefresh = useCallback(async () => {
    if (isRefreshing || isLoading) return;

    setIsRefreshing(true);
    try {
      await loadQuote(true);
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing, isLoading, loadQuote]);

  useEffect(() => {
    let isMounted = true;

    const initializeQuote = async () => {
      if (!isMounted) return;
      await loadQuote();
    };

    // Add a subtle delay for better UX aesthetics
    const timer = setTimeout(initializeQuote, 200);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [loadQuote]);

  if (isLoading) {
    return (
      <div className="w-full py-6 text-center animate-fade-in">
        <span className="text-xs font-mono text-muted uppercase tracking-widest animate-pulse">
          {isRefreshing ? 'CONSULTING SANCHO...' : 'AWAITING WISDOM...'}
        </span>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="w-full py-6 text-center animate-fade-in">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-mono text-muted uppercase tracking-widest">SILENCE...</span>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="text-xs text-accent hover:underline disabled:opacity-50"
          >
            TRY AGAIN
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full py-6 px-4 sm:px-8 border-y border-default/10 animate-fade-in group">
      <div className="text-center relative">
        <span className="absolute -top-4 left-0 text-4xl text-default/10 font-serif leading-none select-none">“</span>
        <p className="text-lg md:text-xl text-default font-serif italic leading-relaxed px-6">
          {quote.quote}
        </p>
        <span className="absolute -bottom-8 right-0 text-4xl text-default/10 font-serif leading-none select-none transform rotate-180">“</span>
        
        {quote.context && (
          <p className="text-xs font-mono text-muted mt-4 uppercase tracking-wider">
            — Sancho Panza <span className="text-default/30">|</span> {quote.context}
          </p>
        )}
      </div>

      <div className="absolute right-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={handleRefresh}
          disabled={isRefreshing || isLoading}
          className="p-1.5 text-muted hover:text-[rgb(var(--app-accent))] transition-colors disabled:opacity-50"
          title="New Wisdom"
          aria-label="Get a new quote"
        >
          <RefreshIcon className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </div>
  );
};
