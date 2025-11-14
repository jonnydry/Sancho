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
    const CACHE_KEY = 'sancho_quotes_cache';
    const MAX_CACHE_SIZE = 15;

    const loadQuote = async () => {
      try {
        const quote = await fetchSanchoQuote();
        setSanchoQuote(quote);
        
        try {
          const cached = localStorage.getItem(CACHE_KEY);
          const cachedQuotes: SanchoQuoteResponse[] = cached ? JSON.parse(cached) : [];
          
          const isDuplicate = cachedQuotes.some(
            q => q.quote === quote.quote
          );
          
          if (!isDuplicate) {
            const updatedCache = [quote, ...cachedQuotes].slice(0, MAX_CACHE_SIZE);
            localStorage.setItem(CACHE_KEY, JSON.stringify(updatedCache));
          }
        } catch (storageError) {
          console.warn('Failed to cache quote:', storageError);
        }
      } catch (error) {
        console.error('Failed to load Sancho quote from API:', error);
        
        try {
          const cached = localStorage.getItem(CACHE_KEY);
          if (cached) {
            const cachedQuotes: SanchoQuoteResponse[] = JSON.parse(cached);
            if (cachedQuotes.length > 0) {
              const randomIndex = Math.floor(Math.random() * cachedQuotes.length);
              setSanchoQuote(cachedQuotes[randomIndex]);
              console.log('Using cached quote (offline mode)');
            } else {
              throw new Error('No cached quotes available');
            }
          } else {
            throw new Error('No cache available');
          }
        } catch (cacheError) {
          console.error('Failed to load cached quote:', cacheError);
          setSanchoQuote({
            quote: "Your faithful guide to poetic forms, meters, and devices.",
            context: "Explore structures, see classic snippets, and find new examples with the power of AI."
          });
        }
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
            {quoteLoading ? (
              <p className="text-muted max-w-2xl mx-auto italic animate-fade-in" style={{animationDelay: '0.3s'}}>
                Loading wisdom from Don Quixote...
              </p>
            ) : sanchoQuote ? (
              <div className="max-w-2xl mx-auto animate-fade-in" style={{animationDelay: '0.3s'}}>
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