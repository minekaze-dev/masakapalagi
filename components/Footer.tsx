import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-12 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
      <div className="max-w-6xl mx-auto px-4 py-6 text-center text-gray-600 dark:text-gray-400">
          <div className="flex justify-center items-center gap-2 mb-2">
              <p className="text-lg sm:text-xl font-bold font-display text-brand-green-dark dark:text-brand-green-light">Zero Waste, Full Taste.</p>
          </div>
          <p className="text-xs sm:text-sm px-2">&copy; {new Date().getFullYear()} MasakApaLagi | Dibuat dengan ❤️ untuk Anda yang punya bahan sisa.</p>
      </div>
    </footer>
  );
};
