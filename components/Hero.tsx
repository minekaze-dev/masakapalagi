import React, { useState, KeyboardEvent } from 'react';
import { XIcon, LoaderIcon } from './icons/Icons';

interface HeroProps {
  ingredients: string[];
  setIngredients: React.Dispatch<React.SetStateAction<string[]>>;
  onGenerate: () => void;
  isLoading: boolean;
}

export const Hero: React.FC<HeroProps> = ({ ingredients, setIngredients, onGenerate, isLoading }) => {
  const [inputValue, setInputValue] = useState('');

  const suggestions = [
    'telur', 'kecap manis', 'nasi', 'bawang merah', 
    'ayam', 'wortel', 'tahu', 'tempe', 'santan', 'cabe rawit'
  ];

  const handleAddIngredient = (ingredient: string) => {
    const trimmedInput = ingredient.trim();
    if (trimmedInput && !ingredients.some(ing => ing.toLowerCase() === trimmedInput.toLowerCase())) {
      setIngredients(prevIngredients => [...prevIngredients, trimmedInput]);
    }
  };
  
  const handleInputSubmit = () => {
    handleAddIngredient(inputValue);
    setInputValue('');
  };

  const handleRemoveIngredient = (ingredientToRemove: string) => {
    setIngredients(ingredients.filter(ing => ing !== ingredientToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleInputSubmit();
    }
  };

  return (
    <section className="text-center py-12 md:py-20">
      <h2 className="text-4xl md:text-5xl font-bold font-display text-brand-green-dark dark:text-brand-green-light mb-4">
        Ubah Sisa Jadi Cita Rasa
      </h2>
      <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-gray-600 dark:text-gray-300">
        Masukkan bahan sisa yang kamu punya, dan biarkan AI kami memberikan ide resep masakan yang lezat dan praktis!
      </p>

      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
        <div className="flex items-center gap-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg p-2 focus-within:ring-2 focus-within:ring-brand-green-dark">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Contoh: nasi, telur, wortel..."
            className="w-full bg-transparent focus:outline-none text-lg px-2"
          />
          <button
            onClick={handleInputSubmit}
            className="bg-brand-green-dark text-white font-semibold px-4 py-2 rounded-md hover:bg-brand-green-dark/90 transition-colors shrink-0"
          >
            Tambah
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mt-4 px-2">
          {ingredients.map((ing, index) => (
            <div key={index} className="flex items-center gap-2 bg-brand-green-light dark:bg-brand-green-dark text-brand-green-dark dark:text-white px-3 py-1 rounded-full text-sm font-semibold animate-fade-in">
              <span>{ing}</span>
              <button onClick={() => handleRemoveIngredient(ing)} className="hover:text-red-500">
                <XIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 text-left px-2">
            <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">Saran cepat bahan sisa:</h4>
            <div className="flex flex-wrap gap-2">
                {suggestions.map(suggestion => (
                    <button 
                        key={suggestion}
                        onClick={() => handleAddIngredient(suggestion)}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm rounded-full hover:bg-brand-green-light dark:hover:bg-brand-green-dark hover:text-brand-green-dark dark:hover:text-white transition-colors capitalize"
                    >
                        {suggestion}
                    </button>
                ))}
            </div>
        </div>
      </div>

      <button
        onClick={onGenerate}
        disabled={isLoading || ingredients.length === 0}
        className="mt-8 mx-auto flex items-center justify-center gap-2 bg-brand-green-dark text-white font-bold text-xl px-8 py-4 rounded-xl shadow-lg hover:scale-105 transition-transform transform disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100"
      >
        {isLoading ? (
          <>
            <LoaderIcon className="w-6 h-6 animate-spin" />
            Membuat resep dari bahan sisa yang Anda punya...
          </>
        ) : (
          "Cari Resep Sekarang!"
        )}
      </button>
    </section>
  );
};