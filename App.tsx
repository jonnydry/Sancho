import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Header } from './components/Header';
import { ThemeProvider } from './contexts/ThemeContext';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { NotFoundPage } from './pages/NotFoundPage';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Header />
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
          <footer className="text-center py-8 px-4 border-t border-default">
            <p className="text-muted text-sm mb-2">
              Powered by <a href="https://x.ai" className="underline hover:text-default transition-colors" target="_blank" rel="noopener noreferrer">XAI's Grok API</a>
            </p>
            <p className="text-muted text-xs">
              <Link to="/about" className="hover:text-default transition-colors">About</Link> •
              <Link to="/privacy" className="hover:text-default transition-colors ml-2">Privacy</Link> •
              <Link to="/terms" className="hover:text-default transition-colors ml-2">Terms</Link>
            </p>
          </footer>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
