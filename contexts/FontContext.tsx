import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';

export type FontFace = 'monospace' | 'serif' | 'sans-serif';

export interface FontContextType {
  fontFace: FontFace;
  fontSize: number;
  setFontFace: (face: FontFace) => void;
  setFontSize: (size: number) => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
}

const isBrowser = typeof window !== 'undefined';

const MIN_FONT_SIZE = 14;
const MAX_FONT_SIZE = 24;
const DEFAULT_FONT_SIZE = 16;

// Helper function to map font face to CSS font-family string
const getFontFamily = (face: FontFace): string => {
  switch (face) {
    case 'monospace':
      return "'Source Code Pro', 'Menlo', 'Monaco', 'Courier New', monospace";
    case 'serif':
      return "'Source Serif Pro', 'Georgia', 'Times New Roman', serif";
    case 'sans-serif':
      return "'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif";
  }
};

const getInitialFontFace = (): FontFace => {
  if (!isBrowser) {
    return 'monospace';
  }
  const saved = window.localStorage.getItem('app_font_face');
  if (saved === 'monospace' || saved === 'serif' || saved === 'sans-serif') {
    return saved as FontFace;
  }
  return 'monospace';
};

const getInitialFontSize = (): number => {
  if (!isBrowser) {
    return DEFAULT_FONT_SIZE;
  }
  const saved = window.localStorage.getItem('app_font_size');
  if (saved) {
    const size = parseInt(saved, 10);
    if (!isNaN(size) && size >= MIN_FONT_SIZE && size <= MAX_FONT_SIZE) {
      return size;
    }
  }
  return DEFAULT_FONT_SIZE;
};

export const FontContext = createContext<FontContextType | undefined>(undefined);

export const FontProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fontFace, setFontFaceState] = useState<FontFace>(() => getInitialFontFace());
  const [fontSize, setFontSizeState] = useState<number>(() => getInitialFontSize());

  // Apply font changes to body element
  useEffect(() => {
    if (!isBrowser) return;
    document.body.style.fontFamily = getFontFamily(fontFace);
    document.body.style.fontSize = `${fontSize}px`;

    // Save to localStorage
    window.localStorage.setItem('app_font_face', fontFace);
    window.localStorage.setItem('app_font_size', fontSize.toString());
  }, [fontFace, fontSize]);

  const setFontFace = useCallback((face: FontFace) => {
    setFontFaceState(face);
  }, []);

  const setFontSize = useCallback((size: number) => {
    const clampedSize = Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, size));
    setFontSizeState(clampedSize);
  }, []);

  const increaseFontSize = useCallback(() => {
    setFontSizeState(prev => Math.min(MAX_FONT_SIZE, prev + 1));
  }, []);

  const decreaseFontSize = useCallback(() => {
    setFontSizeState(prev => Math.max(MIN_FONT_SIZE, prev - 1));
  }, []);

  const value = useMemo(() => ({
    fontFace,
    fontSize,
    setFontFace,
    setFontSize,
    increaseFontSize,
    decreaseFontSize,
  }), [fontFace, fontSize, setFontFace, setFontSize, increaseFontSize, decreaseFontSize]);

  return (
    <FontContext.Provider value={value}>
      {children}
    </FontContext.Provider>
  );
};
