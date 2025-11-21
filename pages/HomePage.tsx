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
    <main className="py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
           <div className="w-40 h-40 sm:w-56 sm:h-56 md:w-72 md:h-72 mx-auto mb-3 sm:mb-4 animate-fade-in">
            <img 
              src="/sancho-logo.png" 
              alt="Sancho Logo - A faithful guide reading poetry" 
              className="w-full h-full object-contain" 
            />
          </div>
          <p className="text-muted text-xs sm:text-sm uppercase tracking-wider mb-4 sm:mb-6 animate-fade-in" style={{animationDelay: '0.2s'}}>
            A Poetic Reference Squire
          </p>
        </div>

        <SanchoQuote />

        <SearchFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />

        {isLoadingData ? (
          <div className="text-center mt-16">
            <p className="text-muted">Loading poetry database...</p>
          </div>
        ) : displayedData.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 items-stretch">
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
              <div className="text-center mt-8">
                <button
                  onClick={handleShowMore}
                  className="px-6 py-3 bg-accent dark:bg-accent/80 text-white font-semibold rounded-lg hover:bg-accent/90 dark:hover:bg-accent/70 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 dark:focus-visible:ring-offset-bg-alt"
                  aria-label="Show more poetry items"
                >
                  Show More
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center mt-16">
            <h3 className="text-xl font-semibold text-default">No Results Found</h3>
            <p className="text-muted mt-2">Try adjusting your search or filter settings.</p>
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
