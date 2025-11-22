import React from 'react';
import { PoetryItem } from '../types';
import { ArrowUpRightIcon } from './icons/ArrowUpRightIcon';
import { PinButton } from './PinButton';
import { useAuth } from '../hooks/useAuth.js';

interface PoetryCardProps {
  item: PoetryItem;
  onSelect: (item: PoetryItem) => void;
  animationIndex: number;
}

const Tag: React.FC<{ type: PoetryItem['type'] }> = ({ type }) => {
  let colorClass = '';
  // Using muted text colors for academic look
  switch (type) {
    case 'Form':
      colorClass = 'text-tag-form-text';
      break;
    case 'Meter':
      colorClass = 'text-tag-meter-text';
      break;
    case 'Device':
      colorClass = 'text-tag-device-text';
      break;
  }
  return (
    <span className={`text-[10px] uppercase tracking-widest font-bold ${colorClass}`}>
      {type}
    </span>
  );
};


export const PoetryCard: React.FC<PoetryCardProps> = ({ item, onSelect, animationIndex }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative h-full group">
      <div
        onClick={() => onSelect(item)}
        className="w-full h-full text-left bg-transparent border border-[rgb(var(--app-border)/0.8)] hover:border-accent rounded-sm transition-all duration-300 ease-out animate-fade-in cursor-pointer p-5 flex flex-col"
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
                <h3 className="text-lg font-bold text-default tracking-tight group-hover:text-accent transition-colors">{item.name}</h3>
                {isAuthenticated && <PinButton item={item} size="sm" />}
             </div>
             <Tag type={item.type} />
          </div>
          <ArrowUpRightIcon
            className="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 transition-opacity"
            aria-hidden="true"
          />
        </div>

        <p className="text-muted text-sm font-light leading-relaxed mb-6 line-clamp-3">
          {item.description}
        </p>
        
        <div className="mt-auto pt-4 border-t border-[rgb(var(--app-border)/0.4)]">
          <p className="text-xs text-muted font-mono italic truncate opacity-70 group-hover:opacity-100 transition-opacity">
            "{item.exampleSnippet}"
          </p>
        </div>
      </div>
    </div>
  );
};
