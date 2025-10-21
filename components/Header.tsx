import React from 'react';
import { Page } from '../types';

interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setActivePage: (page: Page) => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme, setActivePage }) => {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        <div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setActivePage(Page.HOME)}
        >
          <span className="text-3xl" role="img" aria-label="Pot of food emoji">🍲</span>
          <h1 className="text-2xl font-bold font-display text-brand-green-dark dark:text-brand-green-light">
            MasakApaLagi
          </h1>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-lg font-semibold">
          <button onClick={() => setActivePage(Page.FAVORITES)} className="hover:text-brand-green-dark dark:hover:text-brand-green-light transition-colors">Favorit Resep</button>
          <button onClick={() => setActivePage(Page.ASK_CHEF)} className="hover:text-brand-green-dark dark:hover:text-brand-green-light transition-colors">Tanya Chef AI</button>
        </nav>
        <div className="flex items-center">
          <button
            onClick={toggleTheme}
            className="px-4 py-2 text-sm font-semibold rounded-lg transition-colors bg-brand-green-light text-brand-green-dark hover:bg-brand-green hover:text-white dark:bg-gray-700 dark:text-brand-beige-light dark:hover:bg-gray-600"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </div>
    </header>
  );
};