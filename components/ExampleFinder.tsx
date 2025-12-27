import React, { useState, useCallback, useEffect, memo } from 'react';
import { findPoetryExample } from '../services/apiService';
import { PoetryExampleResponse } from '../types';
import { SearchSparkleIcon } from './icons/SearchSparkleIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { AiExamplesIcon } from './icons/AiExamplesIcon';
import { ActionButton } from './PoetryDetailModal';

interface ExampleFinderProps {
  topic: string;
  embedded?: boolean;
}

export const ExampleFinder: React.FC<ExampleFinderProps> = memo(({ topic, embedded = false }) => {
  const [example, setExample] = useState<PoetryExampleResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exampleHistory, setExampleHistory] = useState<string[]>([]);

  // Reset state when topic changes
  useEffect(() => {
    setExample(null);
    setError(null);
    setExampleHistory([]);
  }, [topic]);

  const handleFindExample = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Pass the full history of examples to ensure we get a different result
      const result = await findPoetryExample(topic, exampleHistory);
      setExample(result);
      // Add the new example to history (keep last 5 to avoid huge payloads)
      if (result.example) {
        setExampleHistory(prev => [...prev.slice(-4), result.example]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [topic, exampleHistory]);

  const containerClass = embedded
    ? "p-5 border-t border-accent/20"
    : "pt-6 px-5 sm:px-6 md:px-8 pb-5 sm:pb-6 md:pb-8 border-t border-default";

  return (
    <div className={containerClass}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AiExamplesIcon className={`w-4 h-4 ${embedded ? 'text-accent' : 'text-default'}`} />
          <h4 className="font-semibold text-sm text-default">AI-Powered Example</h4>
        </div>
        <ActionButton
          onClick={handleFindExample}
          disabled={isLoading}
          loading={isLoading}
          loadingText="Generating..."
          icon={<SearchSparkleIcon className="w-3.5 h-3.5" />}
          loadingIcon={<SpinnerIcon className="w-3.5 h-3.5 animate-spin" />}
        >
          {example !== null ? "Regenerate" : "Find Example"}
        </ActionButton>
      </div>

      {error && (
        <div className="p-3 text-sm text-red-600 border border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-900 dark:text-red-400 rounded-md">
          {error}
        </div>
      )}

      {example && (
        <div className="mt-4 space-y-4 animate-fade-in">
          <blockquote className="p-4 bg-bg border border-default/20 rounded-md">
            <p className="whitespace-pre-wrap italic text-default text-sm leading-relaxed">
              {example.example}
            </p>
            <cite className="block text-right mt-3 not-italic text-xs text-muted">
              — {example.author}, <span className="italic">{example.title}</span>
            </cite>
          </blockquote>
          <div className="p-4 bg-bg border border-default/20 rounded-md">
            <h5 className="font-semibold text-xs text-default uppercase tracking-wide mb-2">Explanation</h5>
            <p className="text-sm text-muted leading-relaxed">{example.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
});
