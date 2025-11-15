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

  useEffect(() => {
    if (!isBrowser) return;
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(mode);
    window.localStorage.setItem('theme-mode', mode);
  }, [mode]);

  useEffect(() => {
    if (!isBrowser) return;
    const root = window.document.documentElement;
    // Clean up old and new theme classes before applying the current one
    root.classList.remove('theme-parchment', 'theme-veridian', 'theme-paper', 'theme-slate');
    if (color !== 'dark') { // 'dark' is the default and requires no class
      root.classList.add(`theme-${color}`);
    }
    window.localStorage.setItem('theme-color', color);
  }, [color]);

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
  }, []);

  const setColor = useCallback((newColor: ThemeColor) => {
    setColorState(newColor);
  }, []);

  // Enforce theme restrictions: reset premium themes if stored but user logs out
  useEffect(() => {
    if (!isBrowser) return;
    if (!PREMIUM_THEMES.includes(color)) {
      return;
    }

    let isActive = true;

    const checkAuthAndResetTheme = async () => {
      try {
        const response = await fetch('/api/auth/user', { credentials: 'include' });
        if (!isActive) {
          return;
        }
        if (response.ok) {
          const data = await response.json();
          const isAuthenticated = data.authenticated;
          
          // If not authenticated and using a premium theme, reset to dark
          if (!isAuthenticated && PREMIUM_THEMES.includes(color)) {
            setColorState('dark');
            window.localStorage.setItem('theme-color', 'dark');
          }
        }
      } catch (error) {
        console.error('Failed to check auth status for theme enforcement:', error);
      }
    };
    
    // Run once on mount / when premium theme is selected
    checkAuthAndResetTheme();
    
    // Set up interval to check auth status every 10 seconds only when premium theme is active
    const intervalId = window.setInterval(checkAuthAndResetTheme, 10000);
    
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
  }), [mode, color, setMode, setColor]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};