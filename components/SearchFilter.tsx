import React from 'react';
import { PoetryItem } from '../types';
import { XIcon } from './icons/XIcon';

type FilterType = 'all' | PoetryItem['type'];

interface SearchFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFilter: FilterType;
  setActiveFilter: (filter: FilterType) => void;
}

const filters: { label: string; value: FilterType }[] = [
  { label: 'All', value: 'all' },
  { label: 'Forms', value: 'Form' },
  { label: 'Meters', value: 'Meter' },
  { label: 'Devices', value: 'Device' },
];

export const SearchFilter: React.FC<SearchFilterProps> = ({
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
}) => {
  return (
    <div className="space-y-6 mb-8">
      {/* Minimal Input */}
      <div className="relative w-full group">
        <input
          type="text"
          placeholder="Search database..."
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          className="w-full py-2 bg-transparent text-default text-base border-b border-default focus:border-accent focus:outline-none transition-colors placeholder-muted/50"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 flex items-center text-muted hover:text-default transition-colors"
            aria-label="Clear search"
          >
            <XIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Text-only Tabs */}
      <div className="flex items-center gap-3 sm:gap-6 border-b border-default/30 pb-px">
        {filters.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setActiveFilter(value)}
            className={`pb-2 text-xs sm:text-sm whitespace-nowrap transition-all duration-200 focus:outline-none ${
              activeFilter === value
                ? 'text-default font-bold border-b-2 border-accent'
                : 'text-muted hover:text-default font-normal border-b-2 border-transparent hover:border-default/30'
            }`}
          >
            {label.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
};
