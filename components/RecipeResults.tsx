

import React from 'react';
import type { Recipe } from '../types';
import { RecipeCard } from './RecipeCard';
import { LoaderIcon } from './icons/Icons';

interface RecipeResultsProps {
  recipes: Recipe[];
  isLoading: boolean;
  error: string | null;
  onCookNow: (recipe: Recipe, imageUrl: string) => void;
}

export const RecipeResults: React.FC<RecipeResultsProps> = ({ recipes, isLoading, error, onCookNow }) => {
  if (isLoading) {
    return (
      <div className="text-center py-20 flex flex-col items-center">
        <LoaderIcon className="w-12 h-12 animate-spin text-brand-green-dark dark:text-brand-green-light" />
        <p className="mt-4 text-xl font-semibold">AI sedang memasak ide untukmu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 bg-red-100 dark:bg-red-900/50 p-6 rounded-lg">
        <p className="text-xl text-red-600 dark:text-red-300 font-bold">Oops! Terjadi Kesalahan</p>
        <p className="mt-2 text-red-500 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="text-center py-20 flex flex-col items-center text-gray-500 dark:text-gray-400">
        <span className="text-6xl mb-4" role="img" aria-label="Plate with fork and knife">🍽️</span>
        <h3 className="text-2xl font-bold">Belum Ada Resep</h3>
        <p className="mt-2 max-w-md">Masukkan bahan-bahan yang kamu punya di atas untuk menemukan resep masakan yang lezat!</p>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recipes.map((recipe, index) => (
          <RecipeCard key={index} recipe={recipe} onCookNow={onCookNow} index={index} />
        ))}
      </div>
    </div>
  );
};