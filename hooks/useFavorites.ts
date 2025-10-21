import { useState, useEffect, useCallback } from 'react';
import type { Recipe } from '../types';

const FAVORITES_KEY = 'favoriteRecipes';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Recipe[]>([]);

  useEffect(() => {
    try {
      const storedFavorites = window.localStorage.getItem(FAVORITES_KEY);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error("Failed to parse favorites from localStorage", error);
    }
  }, []);

  const saveFavorites = (newFavorites: Recipe[]) => {
    try {
      setFavorites(newFavorites);
      window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    } catch (error) {
      console.error("Failed to save favorites to localStorage", error);
    }
  };

  const isFavorite = useCallback((recipeName: string) => {
    return favorites.some(fav => fav.recipeName === recipeName);
  }, [favorites]);

  const toggleFavorite = (recipe: Recipe) => {
    if (isFavorite(recipe.recipeName)) {
      saveFavorites(favorites.filter(fav => fav.recipeName !== recipe.recipeName));
    } else {
      saveFavorites([...favorites, recipe]);
    }
  };

  return { favorites, toggleFavorite, isFavorite };
};