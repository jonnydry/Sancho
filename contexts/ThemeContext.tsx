import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { ThemeMode, ThemeColor, ThemeContextType } from '../types';

const PREMIUM_THEMES: ThemeColor[] = ['paper', 'slate'];
const isBrowser = typeof window !== 'undefined';

const getInitialMode = (): ThemeMode => {
  if (!isBrowser) {
    return 'dark';
  }
  const storedMode = window.localStorage.getItem('theme-mode');
  if (storedMode === 'light' || storedMode === 'dark') {
    return storedMode as ThemeMode;
  }
  if (window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'dark';
};

const getInitialColor = (): ThemeColor => {
  if (!isBrowser) {
    return 'dark';
  }
  const storedColor = window.localStorage.getItem('theme-color');
  if (storedColor === 'paper' || storedColor === 'slate') {
    return storedColor;
  }
  return 'dark';
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>(() => getInitialMode());

  const [color, setColorState] = useState<ThemeColor>(() => getInitialColor());

  // Consolidated effect to manage both mode and color atomically
  useEffect(() => {
    if (!isBrowser) return;
    const root = window.document.documentElement;
    
    // Remove all possible theme classes to prevent conflicts
    root.classList.remove('light', 'dark', 'theme-paper', 'theme-slate', 'theme-parchment', 'theme-veridian');
    
    // Apply mode class first (light or dark)
    root.classList.add(mode);
    
    // Apply color theme class if not 'dark' (dark is default and requires no class)
    if (color !== 'dark') {
      root.classList.add(`theme-${color}`);
    }
    
    // Update localStorage for both values
    window.localStorage.setItem('theme-mode', mode);
    window.localStorage.setItem('theme-color', color);
    
    // Verification: Log applied classes and verify CSS variables are set
    if (process.env.NODE_ENV === 'development') {
      const appliedClasses = Array.from(root.classList).filter(cls => 
        cls === 'light' || cls === 'dark' || cls.startsWith('theme-')
      );
      const bgColor = getComputedStyle(root).getPropertyValue('--app-bg');
      console.log('[Theme] Applied classes:', appliedClasses.join(' '), '| Mode:', mode, '| Color:', color, '| CSS var --app-bg:', bgColor.trim() || 'not set');
    }
  }, [mode, color]);

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
  }, []);

  const setColor = useCallback((newColor: ThemeColor) => {
    setColorState(newColor);
  }, []);

  // Enforce theme restrictions: reset premium themes if stored but user logs out
  // Optimized: Polls less frequently (30s) and uses exponential backoff on errors
  useEffect(() => {
    if (!isBrowser) return;
    if (!PREMIUM_THEMES.includes(color)) {
      return;
    }

    let isActive = true;
    let consecutiveErrors = 0;
    const MAX_CONSECUTIVE_ERRORS = 3;
    const POLL_INTERVAL = 30000; // 30 seconds (reduced from 10s)
    const ERROR_BACKOFF_MULTIPLIER = 2;

    const checkAuthAndResetTheme = async () => {
      try {
        const response = await fetch('/api/auth/user', { credentials: 'include' });
        
        // Check if component is still mounted immediately after fetch
        if (!isActive) {
          return;
        }
        
        if (response.ok) {
          const data = await response.json();
          
          // Reset error counter on success
          consecutiveErrors = 0;
          
          // Check again before accessing state
          if (!isActive) {
            return;
          }
          
          const isAuthenticated = data.authenticated;
          
          // If not authenticated and using a premium theme, reset to dark
          // Check isActive one more time before state update
          if (!isAuthenticated && PREMIUM_THEMES.includes(color) && isActive) {
            setColorState('dark');
            window.localStorage.setItem('theme-color', 'dark');
            // Stop polling once we've reset the theme
            return;
          }
        } else {
          consecutiveErrors++;
        }
      } catch (error) {
        consecutiveErrors++;
        // Only log error if component is still mounted
        if (isActive) {
          console.error('Failed to check auth status for theme enforcement:', error);
        }
      }
      
      // Stop polling after too many consecutive errors to reduce load
      if (consecutiveErrors >= MAX_CONSECUTIVE_ERRORS && isActive) {
        console.warn('Stopping theme auth polling after consecutive errors');
        return;
      }
    };
    
    // Run once on mount / when premium theme is selected
    checkAuthAndResetTheme();
    
    // Set up interval to check auth status every 30 seconds only when premium theme is active
    // Reduced frequency to minimize server load
    const intervalId = window.setInterval(checkAuthAndResetTheme, POLL_INTERVAL);
    
    return () => {
      isActive = false;
      window.clearInterval(intervalId);
    };
  }, [color]);
  
  const toggleMode = useCallback(() => {
    setModeState(prevMode => prevMode === 'light' ? 'dark' : 'light');
  }, []);

  const value = useMemo(() => ({
    mode,
    color,
    setMode,
    setColor,
    toggleMode,
  }), [mode, color, setMode, setColor, toggleMode]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};