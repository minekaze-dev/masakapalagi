export interface Recipe {
  recipeName: string;
  description: string;
  cookTime: string;
  difficulty: 'Mudah' | 'Sedang' | 'Sulit';
  ingredients: string[];
  instructions: string[];
  imageKeywords: string;
}

export enum Page {
  HOME = 'HOME',
  FAVORITES = 'FAVORITES',
  ASK_CHEF = 'ASK_CHEF',
}