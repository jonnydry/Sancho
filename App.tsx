import React, { useState, useMemo } from 'react';
import { poetryData } from './data/poetryData';
import { poeticDevicesData } from './data/poeticDevicesData';
import { Header } from './components/Header';
import { PoetryCard } from './components/PoetryCard';
import { ThemeProvider } from './contexts/ThemeContext';
import { SearchFilter } from './components/SearchFilter';
import { PoetryItem } from './types';
import { PoetryDetailModal } from './components/PoetryDetailModal';

const LOGO_DATA_URL = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0yMC4yNCAxMi4yNGE2IDYgMCAwIDAtOC40OS04LjQ5TDUgMTAuNVYxOWg4LjV6Ij48L3BhdGg+PGxpbmUgeDE9IjE2IiB5MT0iOCIgeDI9IjIiIHkyPSIyMiI+PC9saW5lPjxsaW5lIHgxPSIxNy41IiB5MT0iMTUiIHgyPSI5IiB5Mj0iMTUiPjwvbGluZT48L3N2Zz4=';

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
          <div className="text-center animate-fade-in">
             <div className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center border-2 border-dashed border-muted/30">
              <img 
                src={LOGO_DATA_URL} 
                alt="Sancho Logo" 
                className="w-12 h-12 text-muted" 
              />
            </div>
            <div className="w-16 h-px bg-border mx-auto mb-6"></div>
            <h2 className="text-3xl font-bold text-default">Sancho</h2>
            <p className="mt-2 text-muted max-w-2xl mx-auto">
              Your faithful guide to poetic forms, meters, and devices. Explore structures, see classic snippets, and find new examples with the power of AI.
            </p>
          </div>

          <div className="border-b border-default my-8"></div>
        
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
            Built with React, Tailwind, and the Gemini API.
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