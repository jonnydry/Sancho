import React, { useState, useMemo, useEffect } from 'react';
import { PoetryCard } from '../components/PoetryCard';
import { SearchFilter } from '../components/SearchFilter';
import { PoetryItem } from '../types';
import { PoetryDetailModal } from '../components/PoetryDetailModal';
import { SanchoQuote } from '../components/SanchoQuote';

export const HomePage: React.FC = () => {
  const [modalItem, setModalItem] = useState<PoetryItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'Form' | 'Meter' | 'Device'>('all');
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
  }, [searchQuery, activeFilter]);

  const handleCardClick = (item: PoetryItem) => {
    setModalItem(item);
  };
  
  const handleCloseModal = () => {
    setModalItem(null);
  };

  const handleShowMore = () => {
    setItemsToShow(prev => prev + 10);
  };

  const filteredData = useMemo(() => {
    return allData
      .filter(item => {
        if (activeFilter === 'all') return true;
        return item.type === activeFilter;
      })
      .filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [searchQuery, activeFilter, allData]);

  const displayedData = useMemo(() => {
    return filteredData.slice(0, itemsToShow);
  }, [filteredData, itemsToShow]);

  return (
    <main className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col items-center mb-16">
           <div className="w-56 h-56 sm:w-72 sm:h-72 mb-6 animate-fade-in opacity-90 grayscale hover:grayscale-0 transition-all duration-500">
            <img 
              src="/sancho-logo.png" 
              alt="Sancho Logo" 
              className="w-full h-full object-contain" 
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
        </div>

        {isLoadingData ? (
          <div className="text-center mt-20">
            <p className="text-muted font-mono text-sm animate-pulse">Initializing database...</p>
          </div>
        ) : displayedData.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
              {displayedData.map((item, index) => (
                <PoetryCard
                  key={item.name}
                  item={item}
                  onSelect={handleCardClick}
                  animationIndex={index}
                />
              ))}
            </div>
            {itemsToShow < filteredData.length && (
              <div className="text-center mt-16">
                <button
                  onClick={handleShowMore}
                  className="px-8 py-3 border border-default text-default text-sm font-semibold hover:bg-accent hover:text-accent-text hover:border-accent transition-all duration-300"
                  aria-label="Show more poetry items"
                >
                  LOAD MORE
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
        <PoetryDetailModal
          item={modalItem}
          onClose={handleCloseModal}
        />
      )}
    </main>
  );
};
