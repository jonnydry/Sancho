import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { XIcon } from './icons/XIcon';
import { isValidTag, normalizeTag } from '../utils/tagUtils';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  allTags?: string[]; // For autocomplete suggestions
  placeholder?: string;
  disabled?: boolean;
  maxTags?: number;
}

export const TagInput: React.FC<TagInputProps> = ({
  tags,
  onChange,
  allTags = [],
  placeholder = 'Add tag...',
  disabled = false,
  maxTags = 20,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter suggestions based on input
  const suggestions = useMemo(() => {
    if (!inputValue.trim()) return [];
    
    const query = normalizeTag(inputValue);
    return allTags
      .filter((tag) => 
        tag.toLowerCase().includes(query) && 
        !tags.includes(tag)
      )
      .slice(0, 5);
  }, [inputValue, allTags, tags]);

  // Reset selected index when suggestions change
  useEffect(() => {
    setSelectedSuggestionIndex(0);
  }, [suggestions]);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addTag = useCallback((tag: string) => {
    const normalized = normalizeTag(tag);
    
    if (!normalized || !isValidTag(normalized)) return;
    if (tags.includes(normalized)) return;
    if (tags.length >= maxTags) return;

    onChange([...tags, normalized]);
    setInputValue('');
    setShowSuggestions(false);
  }, [tags, onChange, maxTags]);

  const removeTag = useCallback((tagToRemove: string) => {
    onChange(tags.filter((t) => t !== tagToRemove));
  }, [tags, onChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Remove # prefix if user types it
    const cleanValue = value.startsWith('#') ? value.slice(1) : value;
    setInputValue(cleanValue);
    setShowSuggestions(cleanValue.length > 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (showSuggestions && suggestions.length > 0) {
        addTag(suggestions[selectedSuggestionIndex]);
      } else if (inputValue.trim()) {
        addTag(inputValue);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    } else if (e.key === 'ArrowDown' && showSuggestions) {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) => 
        (prev + 1) % Math.max(1, suggestions.length)
      );
    } else if (e.key === 'ArrowUp' && showSuggestions) {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) => 
        (prev - 1 + suggestions.length) % Math.max(1, suggestions.length)
      );
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      // Remove last tag on backspace when input is empty
      removeTag(tags[tags.length - 1]);
    } else if (e.key === ',' || e.key === ' ') {
      // Add tag on comma or space
      if (inputValue.trim()) {
        e.preventDefault();
        addTag(inputValue);
      }
    }
  };

  const handleSuggestionClick = (tag: string) => {
    addTag(tag);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative">
      <div 
        className={`flex flex-wrap items-center gap-1.5 px-3 py-1.5 bg-bg border border-default rounded-sm transition-colors focus-within:border-accent ${disabled ? 'opacity-50' : ''}`}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Tag Pills */}
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2 py-0.5 bg-accent/15 text-accent text-xs font-medium rounded-full group"
          >
            <span className="text-accent/70">#</span>
            {tag}
            {!disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(tag);
                }}
                className="ml-0.5 p-0.5 rounded-full hover:bg-accent/20 transition-colors"
                aria-label={`Remove tag ${tag}`}
              >
                <XIcon className="w-2.5 h-2.5" />
              </button>
            )}
          </span>
        ))}

        {/* Input */}
        {tags.length < maxTags && !disabled && (
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => inputValue && setShowSuggestions(true)}
            placeholder={tags.length === 0 ? placeholder : ''}
            className="flex-1 min-w-[80px] bg-transparent border-none outline-none text-xs text-default placeholder:text-muted/50"
            disabled={disabled}
          />
        )}
      </div>

      {/* Autocomplete Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-bg border border-default rounded-sm shadow-lg z-20 overflow-hidden">
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className={`w-full px-3 py-1.5 text-left text-xs transition-colors ${
                index === selectedSuggestionIndex
                  ? 'bg-accent/15 text-accent'
                  : 'text-default hover:bg-bg-alt'
              }`}
            >
              <span className="text-accent/70">#</span>
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Helper text */}
      {inputValue && !isValidTag(normalizeTag(inputValue)) && (
        <p className="mt-1 text-[10px] text-red-500/80">
          Tags must start with a letter and contain only letters, numbers, hyphens, or underscores
        </p>
      )}
    </div>
  );
};
