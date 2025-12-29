import React, { useState, useEffect } from 'react';
import { useFont } from '../hooks/useFont';
import { FontFace } from '../contexts/FontContext';

export const FontControls: React.FC = () => {
  const { fontFace, fontSize, setFontFace, increaseFontSize, decreaseFontSize } = useFont();
  const [showFontMenu, setShowFontMenu] = useState(false);

  // Close font menu when clicking outside
  useEffect(() => {
    if (!showFontMenu) return;
    const handleClickOutside = () => setShowFontMenu(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showFontMenu]);

  return (
    <div className="flex items-center gap-1">
      {/* Font Face Selector */}
      <div className="relative">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowFontMenu(!showFontMenu);
          }}
          className="p-1.5 rounded-md transition-all duration-200 text-muted hover:text-default hover:bg-bg-alt"
          title="Font Face"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 7V4h16v3"/>
            <path d="M9 20h6"/>
            <path d="M12 4v16"/>
          </svg>
        </button>

        {showFontMenu && (
          <div className="absolute top-full right-0 mt-1 bg-bg-alt border border-default rounded-md shadow-lg z-50 py-1 min-w-[140px] animate-fade-in-fast">
            {(['monospace', 'serif', 'sans-serif'] as FontFace[]).map((face) => (
              <button
                key={face}
                onClick={() => {
                  setFontFace(face);
                  setShowFontMenu(false);
                }}
                className={`w-full text-left px-3 py-1.5 hover:bg-bg transition-colors ${
                  fontFace === face ? 'text-accent' : 'text-default'
                }`}
              >
                {face === 'monospace' ? 'Monospace' : face === 'serif' ? 'Serif' : 'Sans-serif'}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Font Size Controls */}
      <button
        onClick={decreaseFontSize}
        disabled={fontSize <= 14}
        className="p-1.5 rounded-md transition-all duration-200 text-muted hover:text-default hover:bg-bg-alt disabled:opacity-30 disabled:cursor-not-allowed"
        title="Decrease Font Size"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" x2="19" y1="12" y2="12"/>
        </svg>
      </button>

      <span className="text-xs text-muted px-1 min-w-[32px] text-center">{fontSize}px</span>

      <button
        onClick={increaseFontSize}
        disabled={fontSize >= 24}
        className="p-1.5 rounded-md transition-all duration-200 text-muted hover:text-default hover:bg-bg-alt disabled:opacity-30 disabled:cursor-not-allowed"
        title="Increase Font Size"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" x2="12" y1="5" y2="19"/>
          <line x1="5" x2="19" y1="12" y2="12"/>
        </svg>
      </button>
    </div>
  );
};
