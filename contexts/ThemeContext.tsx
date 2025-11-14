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
    return (localStorage.getItem('theme-color') as ThemeColor) || 'dark';
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