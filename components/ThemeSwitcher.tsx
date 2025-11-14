import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';
import { ThemeColor } from '../types';

const themeColors: { name: ThemeColor, class: string }[] = [
  { name: 'dark', class: 'bg-black' },
  { name: 'paper', class: 'bg-[#A98D69]' },
  { name: 'slate', class: 'bg-slate-600' },
];

export const ThemeSwitcher: React.FC = () => {
  const { mode, toggleMode, color, setColor } = useTheme();

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2 p-1 bg-white/50 dark:bg-black/20 rounded-full">
        {themeColors.map((theme) => (
          <button
            key={theme.name}
            onClick={() => setColor(theme.name)}
            className={`w-5 h-5 rounded-full transition-transform duration-200 ${theme.class} ${color === theme.name ? 'ring-2 ring-offset-2 ring-accent dark:ring-offset-bg-alt' : 'scale-90 hover:scale-100'}`}
            aria-label={`Switch to ${theme.name.charAt(0).toUpperCase() + theme.name.slice(1)} theme`}
          />
        ))}
      </div>
      <button
        onClick={toggleMode}
        className="p-2 rounded-full text-muted hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        aria-label="Toggle dark mode"
      >
        {mode === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
      </button>
    </div>
  );
};