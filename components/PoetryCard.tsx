import React, { memo } from 'react';
import { PoetryItem } from '../types';
import { ArrowUpRightIcon } from './icons/ArrowUpRightIcon';
import { PinButton } from './PinButton';
import { useAuth } from '../hooks/useAuth.js';
import { ItemTag } from './ItemTag';

interface PoetryCardProps {
  item: PoetryItem;
  onSelect: (item: PoetryItem) => void;
  onTagClick?: (tag: string) => void;
  animationIndex: number;
  variant?: 'default' | 'matte';
}

export const PoetryCard: React.FC<PoetryCardProps> = memo(({ item, onSelect, onTagClick, animationIndex, variant = 'default' }) => {
  const { isAuthenticated } = useAuth();

  // Default variant uses darker transparent background for dark mode aesthetic
  // Matte variant explicitly uses bg-alt for notebook cards
  const bgClass = variant === 'default' ? 'bg-bg/30 dark:bg-black/40' : 'bg-[rgb(var(--app-bg-alt))]';

  return (
    <div className="relative h-full group">
      <div
        onClick={() => onSelect(item)}
        className={`w-full h-full text-left ${bgClass} border border-default hover:border-accent rounded-sm transition-all duration-300 ease-out animate-fade-in cursor-pointer p-5 flex flex-col shadow-sm`}
        style={{ animationDelay: `${animationIndex * 50}ms` }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect(item);
          }
        }}
        aria-label={`View details for ${item.name}`}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-col gap-1">
             <div className="flex items-center gap-2">
                <h3 className="text-2xl font-bold text-default tracking-tight group-hover:text-accent transition-colors">{item.name}</h3>
                {isAuthenticated && <PinButton item={item} size="lg" />}
             </div>
             <ItemTag type={item.type} />
          </div>
          <ArrowUpRightIcon
            className="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 transition-opacity"
            aria-hidden="true"
          />
        </div>

        <p className="text-muted text-base font-light leading-relaxed mb-4 line-clamp-3">
          {item.description}
        </p>

        <div className="mt-auto w-full">
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {item.tags.slice(0, 3).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTagClick?.(tag);
                  }}
                  aria-label={`Filter by ${tag}`}
                  className="px-2 py-1 text-xs bg-bg-alt/30 border border-default/20 rounded text-muted/70 hover:bg-accent/20 hover:border-accent/40 hover:text-default transition-colors cursor-pointer"
                >
                  {tag}
                </button>
              ))}
              {item.tags.length > 3 && (
                <span className="px-2 py-1 text-xs text-muted/50">
                  +{item.tags.length - 3}
                </span>
              )}
            </div>
          )}
          
          <div className="pt-4 border-t border-[rgb(var(--app-border)/0.4)]">
            <p className="text-sm text-muted font-mono italic truncate opacity-70 group-hover:opacity-100 transition-opacity">
              "{item.exampleSnippet}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});
