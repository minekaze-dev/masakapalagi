import React from 'react';
import { useFavorites } from '../hooks/useFavorites';
import type { Recipe } from '../types';
import { RecipeCard } from './RecipeCard';
import { StarIcon } from './icons/Icons';

interface FavoriteRecipesProps {
  onCookNow: (recipe: Recipe, imageUrl: string) => void;
}

export const FavoriteRecipes: React.FC<FavoriteRecipesProps> = ({ onCookNow }) => {
  const { favorites } = useFavorites();

  if (favorites.length === 0) {
    return (
      <div className="text-center py-20 flex flex-col items-center text-gray-500 dark:text-gray-400">
        <StarIcon className="w-16 h-16 mb-4 text-yellow-400/50" />
        <h3 className="text-2xl font-bold">Belum Ada Resep Favorit</h3>
        <p className="mt-2 max-w-md">Klik ikon bintang pada resep untuk menyimpannya di sini!</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold font-display text-center mb-8 text-brand-green-dark dark:text-brand-green-light">Resep Favorit Anda</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {favorites.map((recipe, index) => (
          <RecipeCard key={recipe.recipeName} recipe={recipe} onCookNow={onCookNow} index={index} />
        ))}
      </div>
    </div>
  );
};