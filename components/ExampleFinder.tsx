import React, { useState, useCallback } from 'react';
import { findPoetryExample } from '../services/apiService';
import { PoetryExampleResponse } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface ExampleFinderProps {
  topic: string;
}

export const ExampleFinder: React.FC<ExampleFinderProps> = ({ topic }) => {
  const [example, setExample] = useState<PoetryExampleResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFindExample = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setExample(null);
    try {
      const result = await findPoetryExample(topic);
      setExample(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [topic]);

  return (
    <div className="mt-4 p-6 border-t border-default">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-default">AI-Powered Example</h4>
        <button
          onClick={handleFindExample}
          disabled={isLoading}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-accent-text border border-accent bg-accent/10 backdrop-blur-sm rounded-lg hover:bg-accent/20 hover:border-accent/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent/50"
        >
          {isLoading ? (
            <SpinnerIcon className="w-5 h-5 animate-spin" />
          ) : (
            <SparklesIcon className="w-5 h-5" />
          )}
          <span>{isLoading ? 'Generating...' : 'Find Example'}</span>
        </button>
      </div>
      
      {error && <div className="mt-4 p-3 text-sm text-red-700 bg-red-100 dark:bg-red-900/50 dark:text-red-300 rounded-lg">{error}</div>}

      {example && (
        <div className="mt-4 space-y-4 animate-fade-in">
          <blockquote className="p-4 border-l-4 border-accent bg-bg-alt/50 rounded-r-lg">
            <p className="whitespace-pre-wrap italic text-default">
              {example.example}
            </p>
            <cite className="block text-right mt-2 not-italic text-sm text-muted">
              — {example.author}, <span className="italic">{example.title}</span>
            </cite>
          </blockquote>
          <div>
            <h5 className="font-semibold mb-2 text-default">Explanation</h5>
            <p className="text-sm text-muted">{example.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
};
