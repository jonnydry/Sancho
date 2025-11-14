import React from 'react';
import { ThemeSwitcher } from './ThemeSwitcher';

export const Header: React.FC = () => {
  return (
    <header className="w-full">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg md:text-xl font-bold text-default">
          Sancho.ref
        </h1>
        <ThemeSwitcher />
      </div>
    </header>
  );
};
