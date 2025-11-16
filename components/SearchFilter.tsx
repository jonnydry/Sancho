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
    <div className="space-y-3 sm:space-y-4">
      <div className="relative flex items-center w-full bg-bg-alt border border-default rounded-xl sm:rounded-2xl focus-within:ring-2 focus-within:ring-accent transition-all">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          className="w-full pl-3 sm:pl-4 pr-10 py-2 sm:py-2.5 bg-transparent text-default text-sm sm:text-base focus:outline-none"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted/50 hover:text-muted transition-colors"
            aria-label="Clear search"
          >
            <XIcon className="w-4 sm:w-5 h-4 sm:h-5" />
          </button>
        )}
      </div>
      <div className="flex items-center justify-center gap-1 sm:gap-2 p-1 bg-bg-alt rounded-xl sm:rounded-2xl overflow-x-auto">
        {filters.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setActiveFilter(value)}
            className={`flex-1 sm:w-full px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 dark:focus-visible:ring-offset-bg-alt whitespace-nowrap ${
              activeFilter === value
                ? 'bg-white dark:bg-white/10 text-accent shadow'
                : 'text-muted hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};
