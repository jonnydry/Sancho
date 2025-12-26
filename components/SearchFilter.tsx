import React, { memo, useId } from 'react';
import { PoetryItem } from '../types';
import { XIcon } from './icons/XIcon';

import { GridIcon } from './icons/GridIcon';
import { PoeticFormsIcon } from './icons/PoeticFormsIcon';
import { PoeticMetersIcon } from './icons/PoeticMetersIcon';
import { LiteraryDevicesIcon } from './icons/LiteraryDevicesIcon';

type FilterType = 'all' | PoetryItem['type'];

interface SearchFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFilter: FilterType;
  setActiveFilter: (filter: FilterType) => void;
}

const filters: { label: string; value: FilterType; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
  { label: 'All (Random)', value: 'all', icon: GridIcon },
  { label: 'Forms', value: 'Form', icon: PoeticFormsIcon },
  { label: 'Meters', value: 'Meter', icon: PoeticMetersIcon },
  { label: 'Devices', value: 'Device', icon: LiteraryDevicesIcon },
];

export const SearchFilter: React.FC<SearchFilterProps> = memo(({
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
}) => {
  const searchInputId = useId();
  const filterGroupLabelId = useId();

  return (
    <div className="space-y-6 mb-8">
      {/* Minimal Input */}
      <div className="relative w-full group">
        <label htmlFor={searchInputId} className="sr-only">Search poetry database</label>
        <input
          id={searchInputId}
          type="text"
          placeholder="Search database..."
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          className="w-full py-2 bg-transparent text-default text-base border-b border-default focus:border-accent focus:outline-none transition-colors placeholder-muted/50"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            type="button"
            className="absolute inset-y-0 right-0 flex items-center text-muted hover:text-default transition-colors"
            aria-label="Clear search"
          >
            <XIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Text-only Tabs */}
      <span id={filterGroupLabelId} className="sr-only">Filter results by category</span>
      <div
        className="flex items-center gap-3 sm:gap-6 border-b border-default/30 pb-px"
        role="radiogroup"
        aria-labelledby={filterGroupLabelId}
      >
        {filters.map(({ label, value, icon: Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => setActiveFilter(value)}
            role="radio"
            aria-checked={activeFilter === value}
            tabIndex={activeFilter === value ? 0 : -1}
            className={`pb-2 text-xs sm:text-sm whitespace-nowrap transition-all duration-200 focus:outline-none flex items-center gap-2 ${activeFilter === value
                ? 'text-default font-bold border-b-2 border-accent'
                : 'text-muted hover:text-default font-normal border-b-2 border-transparent hover:border-default/30'
              }`}
          >
            <Icon className="w-4 h-4" />
            {label.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
});
