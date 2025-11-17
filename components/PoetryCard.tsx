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
  switch (type) {
    case 'Form':
      colorClass = 'bg-tag-form/10 text-tag-form-text dark:bg-tag-form/20';
      break;
    case 'Meter':
      colorClass = 'bg-tag-meter/10 text-tag-meter-text dark:bg-tag-meter/20';
      break;
    case 'Device':
      colorClass = 'bg-tag-device/10 text-tag-device-text dark:bg-tag-device/20';
      break;
  }
  return (
    <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold rounded-full ${colorClass}`}>
      {type}
    </span>
  );
};


export const PoetryCard: React.FC<PoetryCardProps> = ({ item, onSelect, animationIndex }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative h-full">
      <div
        onClick={() => onSelect(item)}
        className="w-full h-full text-left bg-bg-alt rounded-lg sm:rounded-xl md:rounded-2xl shadow-md overflow-hidden transition-all duration-300 ease-in-out animate-fade-in hover:shadow-xl hover:-translate-y-1 focus-within:outline-none focus-within:ring-2 focus-within:ring-accent border border-default cursor-pointer"
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
        <div className="p-4 sm:p-5 md:p-6 flex flex-col h-full">
          <div className="flex justify-between items-start mb-2 sm:mb-3 relative">
            <div className="flex items-center gap-1 sm:gap-2 flex-1 pr-2 sm:pr-4">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-default m-0">{item.name}</h3>
              {isAuthenticated && (
                <div onClick={(e) => e.stopPropagation()}>
                  <PinButton item={item} size="sm" />
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <Tag type={item.type} />
              <ArrowUpRightIcon
                className="w-3.5 sm:w-4 md:w-5 h-3.5 sm:h-4 md:h-5 text-muted/50"
                aria-hidden="true"
              />
            </div>
          </div>
          <p className="text-muted text-sm sm:text-base mb-3 sm:mb-4 mt-0 min-h-[2rem] sm:min-h-[3rem]">{item.description}</p>
          
          <div className="mb-3 sm:mb-4">
              <h4 className="font-semibold text-xs sm:text-sm text-default mb-1.5 sm:mb-2 mt-0">Conventions:</h4>
              <ul className="list-disc list-inside space-y-0.5 sm:space-y-1 text-xs sm:text-sm text-muted">
                  {item.structure.map((rule, index) => <li key={index}>{rule}</li>)}
              </ul>
          </div>
          
          <div className="mt-auto">
            <h4 className="font-semibold text-xs sm:text-sm text-default mb-1.5 sm:mb-2 mt-0">Classic Snippet:</h4>
            <p className="text-xs sm:text-sm text-muted italic mt-0">"{item.exampleSnippet}"</p>
          </div>
        </div>
      </div>
    </div>
  );
};