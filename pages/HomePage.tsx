import React, { useState, useMemo, useEffect, Suspense, lazy } from 'react';
import { PoetryCard } from '../components/PoetryCard';
import { SearchFilter } from '../components/SearchFilter';
import { PoetryItem } from '../types';
import { SanchoQuote } from '../components/SanchoQuote';
import { DataLoadingSkeleton } from '../components/DataLoadingSkeleton';

import { ArrowDownIcon } from '../components/icons/ArrowDownIcon';
import { XIcon } from '../components/icons/XIcon';

// Lazy load modal component (only loads when needed)
const PoetryDetailModal = lazy(() => import('../components/PoetryDetailModal').then(module => ({ default: module.PoetryDetailModal })));

export const HomePage: React.FC = () => {
  const [modalItem, setModalItem] = useState<PoetryItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'Form' | 'Meter' | 'Device'>('all');
  const [activeTagFilter, setActiveTagFilter] = useState<string | null>(null);
  const [allData, setAllData] = useState<PoetryItem[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [itemsToShow, setItemsToShow] = useState(10);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [{ poetryData }, { poeticDevicesData }] = await Promise.all([
          import('../data/poetryData'),
          import('../data/poeticDevicesData')
        ]);
        setAllData([...poetryData, ...poeticDevicesData]);
      } catch (error) {
        console.error('Failed to load poetry data:', error);
        setAllData([]);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    setItemsToShow(10);
  }, [searchQuery, activeFilter, activeTagFilter]);

  const handleCardClick = (item: PoetryItem) => {
    setModalItem(item);
  };

  const handleCloseModal = () => {
    setModalItem(null);
  };

  const handleSelectRelatedItem = (itemName: string) => {
    const relatedItem = allData.find(item => item.name === itemName);
    if (relatedItem) {
      setModalItem(relatedItem);
    }
  };

  const handleShowMore = () => {
    setItemsToShow(prev => prev + 10);
  };

  const handleTagClick = (tag: string) => {
    setActiveTagFilter(tag);
  };

  const handleClearTagFilter = () => {
    setActiveTagFilter(null);
  };

  const filteredData = useMemo(() => {
    // Combine filters into single pass for better performance
    const query = searchQuery.toLowerCase();
    const hasQuery = query.length > 0;
    const filterType = activeFilter;

    return allData.filter(item => {
      // Type filter
      if (filterType !== 'all' && item.type !== filterType) {
        return false;
      }

      // Tag filter
      if (activeTagFilter && (!item.tags || !item.tags.includes(activeTagFilter))) {
        return false;
      }

      // Search query filter
      if (hasQuery) {
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDescription = item.description.toLowerCase().includes(query);
        const matchesTags = item.tags && item.tags.some(tag => tag.toLowerCase().includes(query));

        if (!matchesName && !matchesDescription && !matchesTags) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, activeFilter, activeTagFilter, allData]);

  const displayedData = useMemo(() => {
    return filteredData.slice(0, itemsToShow);
  }, [filteredData, itemsToShow]);

  return (
    <main className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col items-center mb-16">
          <div className="w-56 h-56 sm:w-72 sm:h-72 mb-6 animate-fade-in">
            <img
              src="/sancho-logo.png"
              alt="Sancho Logo"
              className="w-full h-full object-contain"
              width="288"
              height="288"
              fetchPriority="high"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-default mb-2 tracking-tight">Sancho.ref</h1>
          <p className="text-muted text-xs uppercase tracking-[0.2em] mb-8">
            Poetic Reference Squire
          </p>

          <div className="w-full max-w-2xl">
            <SanchoQuote />
          </div>
        </div>

        <div className="mb-12">
          <SearchFilter
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />
          {activeTagFilter && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-xs text-muted uppercase tracking-wider">Filtered by:</span>
              <button
                onClick={handleClearTagFilter}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-accent/20 border border-accent/40 rounded text-default hover:bg-accent/30 transition-colors"
              >
                {activeTagFilter}
                <XIcon className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {isLoadingData ? (
          <DataLoadingSkeleton />
        ) : displayedData.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
              {displayedData.map((item, index) => (
                <PoetryCard
                  key={item.name}
                  item={item}
                  onSelect={handleCardClick}
                  onTagClick={handleTagClick}
                  animationIndex={index}
                />
              ))}
            </div>
            {itemsToShow < filteredData.length && (
              <div className="text-center mt-16">
                <button
                  onClick={handleShowMore}
                  className="px-8 py-3 border border-default text-default text-sm font-semibold bg-[rgb(var(--app-bg-alt)/0.4)] backdrop-blur-sm rounded-lg hover:bg-[rgb(var(--app-bg-alt)/0.6)] hover:border-accent transition-all duration-300 flex items-center gap-2 mx-auto"
                  aria-label="Show more poetry items"
                >
                  <span>LOAD MORE</span>
                  <ArrowDownIcon className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center mt-20 border border-dashed border-default/30 rounded-sm p-12">
            <h3 className="text-lg font-bold text-default mb-2">No Entries Found</h3>
            <p className="text-muted text-sm">Refine your query to locate specific forms or devices.</p>
          </div>
        )}
      </div>
      {modalItem && (
        <Suspense fallback={<div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80"><p className="text-muted font-mono text-sm animate-pulse">Loading...</p></div>}>
          <PoetryDetailModal
            item={modalItem}
            onClose={handleCloseModal}
            onSelectItem={handleSelectRelatedItem}
            onTagClick={(tag) => {
              handleTagClick(tag);
              handleCloseModal();
            }}
          />
        </Suspense>
      )}
    </main>
  );
};
