import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getRandomSanchoQuote, SanchoQuote as SanchoQuoteType } from '../data/sanchoQuotes';
import { fetchSanchoQuote } from '../services/apiService';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { SparklesIcon } from './icons/SparklesIcon';

// Client-side cache for quotes - persists for 5 minutes
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
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
    // Import the array to get total count
    const { sanchoQuotes } = require('../data/sanchoQuotes');
    const index = sessionFallbackIndex % sanchoQuotes.length;
    setSessionFallbackIndex(prev => prev + 1);
    return sanchoQuotes[index];
  }, [sessionFallbackIndex]);

  // Load quote with caching
  const loadQuote = useCallback(async (forceRefresh = false): Promise<void> => {
    // Check cache first (unless forcing refresh)
    if (!forceRefresh && cacheRef.current) {
      const { quote: cachedQuote, timestamp, isAI } = cacheRef.current;
      if (Date.now() - timestamp < CACHE_DURATION) {
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
      const fallbackQuote = getRotatingFallbackQuote();
      setQuote(fallbackQuote);
      setUsedFallback(true);

      // Cache the fallback quote (shorter duration)
      cacheRef.current = {
        quote: fallbackQuote,
        timestamp: Date.now(),
        isAI: false,
      };
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
      <div className="max-w-2xl mx-auto my-8 p-6 border border-default rounded-lg bg-alt/50 animate-fade-in flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <SpinnerIcon className="w-5 h-5 animate-spin text-muted" />
          <span className="text-muted">
            {isRefreshing ? 'Generating new wisdom...' : 'Loading wisdom...'}
          </span>
        </div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="max-w-2xl mx-auto my-8 p-6 border border-default rounded-lg bg-alt/50 animate-fade-in flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="text-muted">No wisdom available at the moment</div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-2 px-3 py-1 text-sm text-muted hover:text-default transition-colors disabled:opacity-50"
          >
            <SparklesIcon className="w-4 h-4" />
            <span>Retry</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto my-8 p-6 border border-default rounded-2xl bg-alt/50 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {usedFallback ? (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full" />
              <span className="text-xs text-muted">Stored quote</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1">
              <SparklesIcon className="w-3 h-3 text-blue-500" />
              <span className="text-xs text-muted">AI generated</span>
            </div>
          )}
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing || isLoading}
          className="flex items-center space-x-1 px-2 py-1 text-sm text-muted hover:text-default hover:bg-hover rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Get a new quote"
        >
          {isRefreshing ? (
            <SpinnerIcon className="w-4 h-4 animate-spin" />
          ) : (
            <SparklesIcon className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">
            {isRefreshing ? 'Refreshing...' : 'New Quote'}
          </span>
        </button>
      </div>

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
