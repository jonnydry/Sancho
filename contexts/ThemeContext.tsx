import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { ThemeMode, ThemeColor, ThemeContextType } from '../types';

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    const storedMode = localStorage.getItem('theme-mode');
    if (storedMode) return storedMode as ThemeMode;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [color, setColorState] = useState<ThemeColor>(() => {
    const storedColor = localStorage.getItem('theme-color') as ThemeColor;
    // Default to 'dark' theme for all users (authenticated or not)
    return storedColor || 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(mode);
    localStorage.setItem('theme-mode', mode);
  }, [mode]);

  useEffect(() => {
    const root = window.document.documentElement;
    // Clean up old and new theme classes before applying the current one
    root.classList.remove('theme-parchment', 'theme-veridian', 'theme-paper', 'theme-slate');
    if (color !== 'dark') { // 'dark' is the default and requires no class
      root.classList.add(`theme-${color}`);
    }
    localStorage.setItem('theme-color', color);
  }, [color]);

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
  }, []);

  const setColor = useCallback((newColor: ThemeColor) => {
    setColorState(newColor);
  }, []);

  // Enforce theme restrictions: reset premium themes if stored but user logs out
  useEffect(() => {
    // Check authentication status and reset theme if needed
    const checkAuthAndResetTheme = async () => {
      try {
        const response = await fetch('/api/auth/user', { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          const isAuthenticated = data.authenticated;
          
          // Get current color from state
          const currentColor = localStorage.getItem('theme-color') || 'dark';
          
          // If not authenticated and using a premium theme, reset to dark
          if (!isAuthenticated && (currentColor === 'paper' || currentColor === 'slate')) {
            setColorState('dark');
            localStorage.setItem('theme-color', 'dark');
          }
        }
      } catch (error) {
        console.error('Failed to check auth status for theme enforcement:', error);
      }
    };
    
    // Run once on mount
    checkAuthAndResetTheme();
    
    // Set up interval to check auth status every 10 seconds
    // This helps catch logout events even if user doesn't reload the page
    const intervalId = setInterval(checkAuthAndResetTheme, 10000);
    
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array - only set up once on mount
  
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