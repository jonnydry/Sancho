import React, { useState, useRef, useEffect } from 'react';
import { TagInput } from '../TagInput';
import { XIcon } from '../icons/XIcon';

interface MobileTagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  allTags: string[];
  placeholder?: string;
  disabled?: boolean;
}

export const MobileTagInput: React.FC<MobileTagInputProps> = ({
  tags,
  onChange,
  allTags,
  placeholder = 'Add tags...',
  disabled = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Collapse on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const removeTag = (tag: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(tags.filter((t) => t !== tag));
  };

  if (isExpanded) {
    return (
      <div ref={containerRef}>
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-xs text-muted">Tags</span>
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            className="text-xs text-muted interactive-muted"
          >
            Collapse
          </button>
        </div>
        <TagInput
          tags={tags}
          onChange={onChange}
          allTags={allTags}
          placeholder={placeholder}
          disabled={disabled}
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide -mx-4 px-4 py-1 min-h-[32px]"
    >
      {tags.map((tag) => (
        <button
          key={tag}
          type="button"
          onClick={() => setIsExpanded(true)}
          className="inline-flex items-center gap-1 px-2 py-0.5 bg-accent/15 text-accent text-xs font-medium rounded-full shrink-0 hover:bg-accent/20 transition-colors"
        >
          <span className="text-accent/70">#</span>
          {tag}
          {!disabled && (
            <span
              role="button"
              onClick={(e) => { e.stopPropagation(); removeTag(tag, e); }}
              className="p-0.5 rounded-full hover:bg-accent/20 transition-colors"
              aria-label={`Remove tag ${tag}`}
            >
              <XIcon className="w-2.5 h-2.5" />
            </span>
          )}
        </button>
      ))}
      {!disabled && tags.length < 20 && (
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 text-xs text-muted border border-dashed border-default/50 rounded-full hover:border-accent/50 hover:text-accent transition-colors"
        >
          <span>+</span>
          <span>Add tag</span>
        </button>
      )}
    </div>
  );
};
