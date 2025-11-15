import React, { useState, useMemo } from 'react';
import { poetryData } from './data/poetryData';
import { poeticDevicesData } from './data/poeticDevicesData';
import { Header } from './components/Header';
import { PoetryCard } from './components/PoetryCard';
import { ThemeProvider } from './contexts/ThemeContext';
import { SearchFilter } from './components/SearchFilter';
import { PoetryItem } from './types';
import { PoetryDetailModal } from './components/PoetryDetailModal';
import { SanchoQuote } from './components/SanchoQuote';


const App: React.FC = () => {
  const [modalItem, setModalItem] = useState<PoetryItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'Form' | 'Meter' | 'Device'>('all');

  const allData = useMemo(() => [...poetryData, ...poeticDevicesData], []);

  const handleCardClick = (item: PoetryItem) => {
    setModalItem(item);
  };
  
  const handleCloseModal = () => {
    setModalItem(null);
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

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-8 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
             <div className="w-72 h-72 mx-auto mb-4 animate-fade-in">
              <img 
                src="/sancho-logo.png" 
                alt="Sancho Logo - A faithful guide reading poetry" 
                className="w-full h-full object-contain" 
              />
            </div>
            <p className="text-muted text-sm uppercase tracking-wider mb-6 animate-fade-in" style={{animationDelay: '0.2s'}}>
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

          {filteredData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {filteredData.map((item, index) => (
                <PoetryCard
                  key={item.name}
                  item={item}
                  onSelect={handleCardClick}
                  animationIndex={index}
                />
              ))}
            </div>
          ) : (
            <div className="text-center mt-16">
              <h3 className="text-xl font-semibold text-default">No Results Found</h3>
              <p className="text-muted mt-2">Try adjusting your search or filter settings.</p>
            </div>
          )}
        </div>
      </main>
       <footer className="text-center py-8 px-4">
        <p className="text-sm text-muted">
            Built with React, Tailwind, and XAI's Grok API.
        </p>
      </footer>

      {modalItem && (
        <PoetryDetailModal item={modalItem} onClose={handleCloseModal} />
      )}
    </div>
  );
};


const AppWrapper: React.FC = () => (
    <ThemeProvider>
        <App />
    </ThemeProvider>
)

export default AppWrapper;