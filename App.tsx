import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { FloatingFooter } from './components/FloatingFooter';
import { CookieConsent } from './components/CookieConsent';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ThemeProvider } from './contexts/ThemeContext';
import { FontProvider } from './contexts/FontContext';
import { AuthProvider } from './contexts/AuthContext';
import { PinnedItemsProvider } from './contexts/PinnedItemsContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { useMobileDetection } from './hooks/useMobileDetection';
import { HomePage } from './pages/HomePage';

// Lazy load routes for code splitting
const AboutPage = lazy(() => import('./pages/AboutPage').then(module => ({ default: module.AboutPage })));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage').then(module => ({ default: module.PrivacyPage })));
const TermsPage = lazy(() => import('./pages/TermsPage').then(module => ({ default: module.TermsPage })));
const SupportPage = lazy(() => import('./pages/SupportPage').then(module => ({ default: module.SupportPage })));
const SupportSuccessPage = lazy(() => import('./pages/SupportSuccessPage').then(module => ({ default: module.SupportSuccessPage })));
const SupportCancelPage = lazy(() => import('./pages/SupportCancelPage').then(module => ({ default: module.SupportCancelPage })));
const JournalPage = lazy(() => import('./pages/JournalPage').then(module => ({ default: module.JournalPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then(module => ({ default: module.NotFoundPage })));

// Loading fallback component
const RouteLoadingFallback: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center">
    <p className="text-muted font-mono text-sm animate-pulse">Loading...</p>
  </div>
);

const AppLayout: React.FC = () => {
  const { pathname } = useLocation();
  const { isMobile, isTablet } = useMobileDetection();

  const isJournalRoute = pathname === '/journal' || pathname.startsWith('/journal/');
  const hideChrome = isJournalRoute && (isMobile || isTablet);

  return (
    <div className="min-h-screen flex flex-col bg-bg text-default">
      {!hideChrome && <Header />}
      <div className={`flex-grow ${hideChrome ? '' : 'pb-16'}`}>
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
              <Route path="/journal" element={<JournalPage />} />
              <Route path="/journal/:entryId" element={<JournalPage />} />
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
      {!hideChrome && <FloatingFooter />}
      <CookieConsent />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <FontProvider>
          <AuthProvider>
            <NotificationProvider>
              <PinnedItemsProvider>
                <BrowserRouter>
                  <AppLayout />
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
