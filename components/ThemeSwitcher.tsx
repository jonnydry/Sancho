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
    if (themeColors.find(theme => theme.name === themeName)?.premium && !isAuthenticated) {
      // Could trigger login modal or just log
      return;
    }
    setColor(themeName);
  };

  return (
    <div className="flex items-center gap-1.5 sm:gap-3">
      {isAuthenticated && (
        <div className="flex items-center gap-1 sm:gap-1.5 p-0.5 sm:p-1 bg-[rgb(var(--app-bg-alt)/0.5)] rounded-full">
          {themeColors.map((theme) => {
            const isSelected = color === theme.name;
            const isPremium = theme.premium;
            const isDisabled = isPremium && !isAuthenticated;
            const tooltip = isDisabled 
              ? 'Log in to unlock premium themes' 
              : `${isSelected ? 'Current theme:' : 'Switch to'} ${theme.name.charAt(0).toUpperCase() + theme.name.slice(1)} theme`;
            
            return (
              <button
                key={theme.name}
                onClick={() => handleThemeClick(theme.name)}
                disabled={isDisabled}
                className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full transition-all duration-200 cursor-pointer ${theme.class} ${
                  isSelected
                    ? 'ring-2 ring-offset-1 sm:ring-offset-2 ring-accent dark:ring-offset-bg-alt scale-110 shadow-sm'
                    : isDisabled
                    ? 'opacity-50 cursor-not-allowed'
                    : 'scale-90 hover:scale-110 hover:ring-2 hover:ring-offset-1 hover:ring-default/30 shadow-sm hover:shadow-md'
                } ${isDisabled ? 'cursor-not-allowed' : 'interactive-base'}`}
                title={tooltip}
                aria-label={tooltip}
                aria-pressed={isSelected}
              />
            );
          })}
        </div>
      )}
      <button
        onClick={toggleMode}
        className="p-1.5 sm:p-2 rounded-full text-muted interactive-muted hover:bg-accent/10 transition-all duration-200 interactive-base interactive-scale"
        aria-label="Toggle dark mode"
      >
        {mode === 'light' ? <MoonIcon className="w-4 h-4 sm:w-5 sm:h-5" /> : <SunIcon className="w-4 h-4 sm:w-5 sm:h-5" />}
      </button>
    </div>
  );
};
