import React, { useState, useEffect } from 'react';
import type { Recipe } from '../types';
import { ClockIcon, DifficultyBarsIcon, UtensilsIcon, XIcon, StarIcon } from './icons/Icons';
import { generateImage } from '../services/geminiService';
import { useFavorites } from '../hooks/useFavorites';

interface RecipeCardProps {
  recipe: Recipe;
  onCookNow: (recipe: Recipe, imageUrl: string) => void;
  index: number;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onCookNow, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(recipe.recipeName);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  useEffect(() => {
    let isMounted = true;
    const fetchImage = async () => {
      setIsImageLoading(true);
      const url = await generateImage(recipe.imageKeywords);
      if (isMounted) {
        setImageUrl(url);
        setIsImageLoading(false);
      }
    };

    fetchImage();

    return () => {
      isMounted = false;
    };
  }, [recipe.imageKeywords]);

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isImageLoading && imageUrl) {
      setIsImageModalOpen(true);
    }
  };
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(recipe);
  };

  return (
    <>
      <div 
        className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden flex flex-col transition-all duration-500 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
      >
        <button 
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 z-10 p-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-full shadow-lg hover:scale-110 transition-transform"
          aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
          title={favorited ? 'Hapus dari Favorit' : 'Tambah ke Favorit'}
        >
          <StarIcon className={`w-6 h-6 transition-colors ${favorited ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400 dark:text-gray-500 stroke-gray-600 dark:stroke-gray-300 fill-transparent'}`} />
        </button>
        
        <div className="relative w-full h-48 bg-gray-200 dark:bg-gray-700 cursor-pointer group" onClick={handleImageClick}>
          {isImageLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-300 dark:bg-gray-600 animate-pulse">
              <UtensilsIcon className="w-12 h-12 text-gray-400 dark:text-gray-500" />
            </div>
          ) : (
            <>
              <img 
                src={imageUrl}
                alt={recipe.recipeName}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <p className="text-white font-bold text-lg">Lihat Gambar</p>
              </div>
            </>
          )}
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <h4 className="text-2xl font-bold font-display text-brand-green-dark dark:text-brand-green-light mb-2">{recipe.recipeName}</h4>
          <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">{recipe.description}</p>
          
          <div className="flex justify-between items-center mb-6 text-sm px-4">
            <div className="flex items-center gap-2">
              <ClockIcon className="w-5 h-5 text-brand-green-dark dark:text-brand-green-light flex-shrink-0" />
              <span>{recipe.cookTime}</span>
            </div>
            <div className="flex items-center gap-2" title={`Tingkat Kesulitan: ${recipe.difficulty}`}>
              <DifficultyBarsIcon difficulty={recipe.difficulty} className="w-6 h-6" />
              <span>{recipe.difficulty}</span>
            </div>
          </div>

          <button 
            onClick={() => onCookNow(recipe, imageUrl)}
            className="w-full bg-brand-green-dark text-white font-bold py-3 rounded-lg hover:bg-brand-green-dark/90 transition-colors"
          >
            Masak Sekarang
          </button>
        </div>
      </div>

      {isImageModalOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4 animate-fade-in" 
          onClick={() => setIsImageModalOpen(false)}
        >
          <img 
            src={imageUrl} 
            alt={recipe.recipeName} 
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
          />
          <button 
            onClick={() => setIsImageModalOpen(false)}
            className="absolute top-4 right-4 p-2 text-white bg-black/50 rounded-full hover:bg-black/80 transition-colors"
            aria-label="Close image viewer"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>
      )}
    </>
  );
};