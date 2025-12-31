import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Header } from './components/Header';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ThemeProvider } from './contexts/ThemeContext';
import { FontProvider } from './contexts/FontContext';
import { AuthProvider } from './contexts/AuthContext';
import { PinnedItemsProvider } from './contexts/PinnedItemsContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { HomePage } from './pages/HomePage';

// Lazy load routes for code splitting
const AboutPage = lazy(() => import('./pages/AboutPage').then(module => ({ default: module.AboutPage })));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage').then(module => ({ default: module.PrivacyPage })));
const TermsPage = lazy(() => import('./pages/TermsPage').then(module => ({ default: module.TermsPage })));
const SupportPage = lazy(() => import('./pages/SupportPage').then(module => ({ default: module.SupportPage })));
const SupportSuccessPage = lazy(() => import('./pages/SupportSuccessPage').then(module => ({ default: module.SupportSuccessPage })));
const SupportCancelPage = lazy(() => import('./pages/SupportCancelPage').then(module => ({ default: module.SupportCancelPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then(module => ({ default: module.NotFoundPage })));

// Loading fallback component
const RouteLoadingFallback: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center">
    <p className="text-muted font-mono text-sm animate-pulse">Loading...</p>
  </div>
);

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <FontProvider>
          <AuthProvider>
            <NotificationProvider>
              <PinnedItemsProvider>
                <BrowserRouter>
                  <div className="min-h-screen flex flex-col bg-bg text-default">
                    <Header />
                    <div className="flex-grow">
                      <ErrorBoundary fallback={
                        <div className="flex items-center justify-center min-h-[50vh] p-8">
                          <div className="text-center">
                            <h2 className="text-xl font-bold text-default mb-4">Page Error</h2>
                            <p className="text-muted mb-4">Something went wrong loading this page.</p>
                            <button
                              onClick={() => window.location.reload()}
                              className="px-4 py-2 bg-accent text-accent-text rounded-md hover:bg-accent-hover transition-colors"
                            >
                              Reload Page
                            </button>
                          </div>
                        </div>
                      }>
                        <Suspense fallback={<RouteLoadingFallback />}>
                          <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/about" element={<AboutPage />} />
                            <Route path="/privacy" element={<PrivacyPage />} />
                            <Route path="/terms" element={<TermsPage />} />
                            <Route path="/support" element={<SupportPage />} />
                            <Route path="/support/success" element={<SupportSuccessPage />} />
                            <Route path="/support/cancel" element={<SupportCancelPage />} />
                            <Route path="*" element={<NotFoundPage />} />
                          </Routes>
                        </Suspense>
                      </ErrorBoundary>
                    </div>
                    <footer className="text-center py-8 px-4 border-t border-default">
                      <p className="text-muted text-sm mb-2">
                        Powered by <a href="https://x.ai" className="underline hover:text-default transition-colors" target="_blank" rel="noopener noreferrer">XAI's Grok API</a>
                      </p>
                      <p className="text-muted text-xs">
                        <Link to="/about" className="hover:text-default transition-colors">About</Link> •
                        <Link to="/support" className="hover:text-default transition-colors ml-2">Support</Link> •
                        <Link to="/privacy" className="hover:text-default transition-colors ml-2">Privacy</Link> •
                        <Link to="/terms" className="hover:text-default transition-colors ml-2">Terms</Link>
                      </p>
                    </footer>
                  </div>
                </BrowserRouter>
              </PinnedItemsProvider>
            </NotificationProvider>
          </AuthProvider>
        </FontProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
