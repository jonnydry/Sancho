  import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth.js';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';
import { ThemeColor } from '../types';

const themeColors: { name: ThemeColor, class: string, premium: boolean }[] = [
  { name: 'dark', class: 'bg-black', premium: false },
  { name: 'paper', class: 'bg-[#A98D69]', premium: true },
  { name: 'slate', class: 'bg-slate-600', premium: true },
];

export const ThemeSwitcher: React.FC = () => {
  const { mode, toggleMode, color, setColor } = useTheme();
  const { isAuthenticated } = useAuth();

  const handleThemeClick = (themeName: ThemeColor) => {
    setColor(themeName);
  };

  const visibleThemes = themeColors.filter(theme => !theme.premium || isAuthenticated);

  return (
    <div className="flex items-center space-x-4">
      {isAuthenticated && (
        <div className="flex items-center space-x-2 p-1 bg-[rgb(var(--app-bg-alt)/0.5)] rounded-full">
          {visibleThemes.map((theme) => {
            const isSelected = color === theme.name;
            return (
              <button
                key={theme.name}
                onClick={() => handleThemeClick(theme.name)}
                className={`w-5 h-5 rounded-full transition-transform duration-200 ${theme.class} ${
                  isSelected
                    ? 'ring-2 ring-offset-2 ring-accent dark:ring-offset-bg-alt'
                    : 'scale-90 hover:scale-100'
                }`}
                aria-label={`${isSelected ? 'Current theme:' : 'Switch to'} ${theme.name.charAt(0).toUpperCase() + theme.name.slice(1)} theme`}
                aria-pressed={isSelected}
              />
            );
          })}
        </div>
      )}
      <button
        onClick={toggleMode}
        className="p-2 rounded-full text-muted hover:bg-accent/10 transition-colors"
        aria-label="Toggle dark mode"
      >
        {mode === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
      </button>
    </div>
  );
};
