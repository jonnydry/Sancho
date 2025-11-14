import React, { useState, useMemo, useEffect } from 'react';
import { poetryData } from './data/poetryData';
import { poeticDevicesData } from './data/poeticDevicesData';
import { Header } from './components/Header';
import { PoetryCard } from './components/PoetryCard';
import { ThemeProvider } from './contexts/ThemeContext';
import { SearchFilter } from './components/SearchFilter';
import { PoetryItem, SanchoQuoteResponse } from './types';
import { PoetryDetailModal } from './components/PoetryDetailModal';
import { fetchSanchoQuote } from './services/geminiService';


const App: React.FC = () => {
  const [modalItem, setModalItem] = useState<PoetryItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'Form' | 'Meter' | 'Device'>('all');
  const [sanchoQuote, setSanchoQuote] = useState<SanchoQuoteResponse | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(true);

  const allData = useMemo(() => [...poetryData, ...poeticDevicesData], []);

  useEffect(() => {
    const loadQuote = async () => {
      try {
        const quote = await fetchSanchoQuote();
        setSanchoQuote(quote);
      } catch (error) {
        console.error('Failed to load Sancho quote:', error);
        setSanchoQuote({
          quote: "Your faithful guide to poetic forms, meters, and devices.",
          context: "Explore structures, see classic snippets, and find new examples with the power of AI."
        });
      } finally {
        setQuoteLoading(false);
      }
    };
    loadQuote();
  }, []);

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
             <div className="w-64 h-64 mx-auto mb-6">
              <img 
                src="/sancho-logo.png" 
                alt="Sancho Logo - A faithful guide reading poetry" 
                className="w-full h-full object-contain" 
              />
            </div>
            {quoteLoading ? (
              <p className="text-muted max-w-2xl mx-auto italic">
                Loading wisdom from Don Quixote...
              </p>
            ) : sanchoQuote ? (
              <div className="max-w-2xl mx-auto">
                <p className="text-default italic text-lg">"{sanchoQuote.quote}"</p>
                <p className="text-muted text-sm mt-2">{sanchoQuote.context}</p>
              </div>
            ) : null}
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