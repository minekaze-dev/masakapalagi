import { useState, useEffect, useCallback } from 'react';
import type { Recipe } from '../types';
import { supabase } from '../services/supabase';
import { v4 as uuidv4 } from 'uuid';

const USER_ID_KEY = 'masakapalagi_user_id';

// Helper to get or create an anonymous user ID
const getUserId = (): string => {
  let userId = localStorage.getItem(USER_ID_KEY);
  if (!userId) {
    userId = uuidv4();
    localStorage.setItem(USER_ID_KEY, userId);
  }
  return userId;
};

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [userId] = useState<string>(getUserId());

  // Fetch favorites from Supabase on initial load
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!userId) return;

      const { data, error } = await supabase
        .from('favorite_recipes')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.error("Error fetching favorites:", error);
      } else if (data) {
        // Map snake_case from DB to camelCase for the app
        const mappedData: Recipe[] = data.map(item => ({
          recipeName: item.recipe_name,
          description: item.description,
          cookTime: item.cook_time,
          difficulty: item.difficulty,
          ingredients: item.ingredients,
          instructions: item.instructions,
          imageKeywords: item.image_keywords,
          imageUrl: item.image_url,
        }));
        setFavorites(mappedData);
      }
    };

    fetchFavorites();
  }, [userId]);

  const isFavorite = useCallback((recipeName: string) => {
    return favorites.some(fav => fav.recipeName === recipeName);
  }, [favorites]);

  const toggleFavorite = async (recipe: Recipe) => {
    const isCurrentlyFavorite = isFavorite(recipe.recipeName);

    if (isCurrentlyFavorite) {
      // DELETE from Supabase
      const { error } = await supabase
        .from('favorite_recipes')
        .delete()
        .match({ user_id: userId, recipe_name: recipe.recipeName });

      if (error) {
        console.error('Error removing favorite:', error);
      } else {
        // Update local state on success
        setFavorites(prev => prev.filter(fav => fav.recipeName !== recipe.recipeName));
      }
    } else {
      // INSERT into Supabase
      const { error } = await supabase
        .from('favorite_recipes')
        .insert([{
          user_id: userId,
          recipe_name: recipe.recipeName,
          description: recipe.description,
          cook_time: recipe.cookTime,
          difficulty: recipe.difficulty,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
          image_keywords: recipe.imageKeywords,
          image_url: recipe.imageUrl,
        }]);

      if (error) {
        console.error('Error adding favorite:', error);
      } else {
         // Update local state on success
        setFavorites(prev => [...prev, recipe]);
      }
    }
  };

  return { favorites, toggleFavorite, isFavorite };
};