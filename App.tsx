import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { RecipeResults } from './components/RecipeResults';
import { Footer } from './components/Footer';
import { CookingModal } from './components/CookingModal';
import { AskChef } from './components/StorageTips';
import { FavoriteRecipes } from './components/FavoriteRecipes';
import { generateRecipes, askChefAI } from './services/geminiService';
import type { Recipe } from './types';
import { Page } from './types';
import { useTheme } from './hooks/useTheme';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

const App: React.FC = () => {
  const [theme, toggleTheme] = useTheme();
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecipeData, setSelectedRecipeData] = useState<{recipe: Recipe, imageUrl: string} | null>(null);
  const [activePage, setActivePage] = useState<Page>(Page.HOME);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatIsLoading, setChatIsLoading] = useState<boolean>(false);

  const handleGenerate = useCallback(async () => {
    if (ingredients.length === 0) {
      setError('Please add at least one ingredient.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setRecipes([]);
    setActivePage(Page.HOME);

    try {
      const result = await generateRecipes(ingredients);
      setRecipes(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [ingredients]);
  
  const handleAskChef = async (message: string) => {
    setChatHistory(prev => [...prev, { role: 'user', text: message }]);
    setChatIsLoading(true);
    setError(null);
    try {
      const response = await askChefAI(message);
      setChatHistory(prev => [...prev, { role: 'model', text: response }]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      setChatHistory(prev => [...prev, { role: 'model', text: `Maaf, terjadi kesalahan: ${errorMessage}` }]);
    } finally {
      setChatIsLoading(false);
    }
  };
  
  const handlePageChange = (page: Page) => {
    setActivePage(page);
  };

  const handleCookNow = (recipe: Recipe, imageUrl: string) => {
    setSelectedRecipeData({ recipe, imageUrl });
  };

  const renderPageContent = () => {
    switch (activePage) {
      case Page.ASK_CHEF:
        return <AskChef chatHistory={chatHistory} onSendMessage={handleAskChef} isLoading={chatIsLoading} />;
      case Page.FAVORITES:
        return <FavoriteRecipes onCookNow={handleCookNow} />;
      case Page.HOME:
      default:
        return (
          <>
            <Hero 
              ingredients={ingredients} 
              setIngredients={setIngredients} 
              onGenerate={handleGenerate}
              isLoading={isLoading}
            />
            <RecipeResults recipes={recipes} isLoading={isLoading} error={error} onCookNow={handleCookNow} />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-brand-text-light dark:text-brand-text-dark">
      <Header 
        theme={theme} 
        toggleTheme={toggleTheme} 
        setActivePage={handlePageChange}
      />
      <main className="flex-grow container mx-auto px-4 pt-24 pb-8 max-w-6xl">
        {renderPageContent()}
      </main>
      <Footer />
      {selectedRecipeData && (
        <CookingModal 
          recipe={selectedRecipeData.recipe}
          imageUrl={selectedRecipeData.imageUrl} 
          onClose={() => setSelectedRecipeData(null)} 
        />
      )}
    </div>
  );
};

export default App;