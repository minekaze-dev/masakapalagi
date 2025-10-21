import React, { useState } from 'react';
import type { Recipe } from '../types';
import { XIcon, CheckIcon, CopyIcon } from './icons/Icons';

interface CookingModalProps {
  recipe: Recipe;
  imageUrl: string;
  onClose: () => void;
}

export const CookingModal: React.FC<CookingModalProps> = ({ recipe, imageUrl, onClose }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyRecipe = () => {
    const recipeText = `
Resep: ${recipe.recipeName}

Bahan-bahan:
${recipe.ingredients.map(ing => `- ${ing}`).join('\n')}

Cara Memasak:
${recipe.instructions.map((step, index) => `${index + 1}. ${step}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(recipeText).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy recipe: ', err);
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 transition-opacity duration-300 animate-fade-in" onClick={onClose}>
      <div 
        className="bg-brand-beige-light dark:bg-gray-800 rounded-2xl w-full max-w-6xl max-h-[90vh] flex flex-col shadow-2xl transform transition-transform duration-300 animate-zoom-in"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 sm:p-6 border-b dark:border-gray-700 flex justify-between items-center shrink-0">
          <h2 className="text-2xl md:text-3xl font-bold font-display text-brand-green-dark dark:text-brand-green-light">{recipe.recipeName}</h2>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleCopyRecipe} 
              className="py-2 rounded-full flex items-center gap-2 text-sm font-semibold transition-all duration-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-3"
              title={isCopied ? "Resep disalin!" : "Salin resep"}
            >
              {isCopied ? (
                <>
                  <CheckIcon className="w-5 h-5 text-green-500" />
                  <span className="text-green-500">Disalin!</span>
                </>
              ) : (
                <>
                  <CopyIcon className="w-5 h-5" />
                  <span>Salin Resep</span>
                </>
              )}
            </button>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
              <XIcon className="w-6 h-6" />
            </button>
          </div>
        </header>

        <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
          {/* Left Side: Image and Ingredients */}
          <aside className="w-full md:w-2/5 p-6 border-b md:border-b-0 md:border-r dark:border-gray-700 overflow-y-auto custom-scrollbar">
            <img 
              src={imageUrl} 
              alt={recipe.recipeName}
              className="w-full h-64 object-cover rounded-lg mb-6 shadow-md" 
            />
            <h3 className="text-xl font-bold mb-4 text-brand-green-dark dark:text-brand-green-light">Bahan-bahan</h3>
            <ul className="space-y-3">
              {recipe.ingredients.map((ing, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 mt-1 text-brand-green-dark dark:text-brand-green-light shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300 text-base">{ing}</span>
                </li>
              ))}
            </ul>
          </aside>

          {/* Right Side: Instructions */}
          <main className="w-full md:w-3/5 p-6 flex flex-col overflow-y-auto custom-scrollbar">
            <h3 className="text-xl font-bold mb-4 text-brand-green-dark dark:text-brand-green-light">Cara Memasak</h3>
            <ol className="space-y-6 text-gray-800 dark:text-gray-200">
                {recipe.instructions.map((step, index) => (
                    <li key={index} className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-brand-green-dark text-white rounded-full flex items-center justify-center font-bold text-lg">
                            {index + 1}
                        </div>
                        <p className="text-lg leading-relaxed pt-1">
                            {step}
                        </p>
                    </li>
                ))}
            </ol>
          </main>
        </div>
      </div>
      <style>{`
        .animate-zoom-in {
            animation: zoomIn 0.3s ease-out forwards;
        }
        @keyframes zoomIn {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #A7D7C5; /* brand-green */
          border-radius: 20px;
          border: 3px solid #F7F3E9; /* brand-beige-light */
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #5C946E; /* brand-green-dark */
          border-color: #1f2937; /* gray-800 */
        }
      `}</style>
    </div>
  );
};