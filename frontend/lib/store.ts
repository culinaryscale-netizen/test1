
import { useState } from 'react';
import { Recipe, IngredientType } from '../types';

// Seed data
const SEED_RECIPES: Recipe[] = [
  {
    id: '1',
    title: 'Classic Spaghetti Carbonara',
    description: 'A traditional Roman pasta dish with egg, hard cheese, cured pork, and black pepper.',
    baseServings: 2,
    imageUrl: 'https://picsum.photos/800/600?random=1',
    createdAt: Date.now(),
    ingredients: [
      { id: '1a', name: 'Spaghetti', quantity: 200, unit: 'g', type: IngredientType.NORMAL, imageUrl: 'https://images.unsplash.com/photo-1598155523122-38423bb4d6c1?auto=format&fit=crop&w=100&q=80' },
      { id: '1b', name: 'Guanciale (or Pancetta)', quantity: 100, unit: 'g', type: IngredientType.NORMAL },
      { id: '1c', name: 'Large Eggs', quantity: 2, unit: 'whole', type: IngredientType.NORMAL, imageUrl: 'https://images.unsplash.com/photo-1587486913049-53fc88980b12?auto=format&fit=crop&w=100&q=80' },
      { 
        id: '1d', 
        name: 'Pecorino Romano', 
        quantity: 50, 
        unit: 'g', 
        type: IngredientType.NORMAL, 
        isTasteAdjustable: true,
        tasteAdjustmentConfig: { mildReductionPercentage: 20, spicyIncreasePercentage: 30, indianBoostIncreasePercentage: 50 }
      },
      { id: '1e', name: 'Bay Leaf (Garnish)', quantity: 1, unit: 'leaf', type: IngredientType.CONSTANT, constantLimit: 4 },
      { 
        id: '1f', 
        name: 'Black Pepper', 
        quantity: 1, 
        unit: 'tsp', 
        type: IngredientType.CONSTANT, 
        constantLimit: 10, 
        isTasteAdjustable: true,
        tasteAdjustmentConfig: { mildReductionPercentage: 50, spicyIncreasePercentage: 50, indianBoostIncreasePercentage: 100 }
      },
    ]
  },
  {
    id: '2',
    title: 'Homestyle Chicken Soup',
    description: 'Warm, comforting chicken soup perfect for cold days.',
    baseServings: 4,
    imageUrl: 'https://picsum.photos/800/600?random=2',
    createdAt: Date.now() - 10000,
    ingredients: [
      { id: '2a', name: 'Chicken Thighs', quantity: 4, unit: 'pcs', type: IngredientType.NORMAL },
      { id: '2b', name: 'Carrots', quantity: 2, unit: 'whole', type: IngredientType.NORMAL, imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=100&q=80' },
      { id: '2c', name: 'Celery Stalks', quantity: 2, unit: 'stalks', type: IngredientType.NORMAL },
      { 
        id: '2d', 
        name: 'Chicken Stock', 
        quantity: 1.5, 
        unit: 'L', 
        type: IngredientType.NORMAL, 
        isTasteAdjustable: true,
        tasteAdjustmentConfig: { mildReductionPercentage: 10, spicyIncreasePercentage: 20, indianBoostIncreasePercentage: 30 }
      },
      { id: '2e', name: 'Soup Pot', quantity: 1, unit: 'pot', type: IngredientType.CONSTANT, constantLimit: 12 },
      { id: '2f', name: 'Fresh Parsley', quantity: 1, unit: 'bunch', type: IngredientType.CONSTANT, constantLimit: 8 },
    ]
  }
];

export const useRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    try {
      const stored = localStorage.getItem('culinaryScale_recipes');
      if (stored) {
        return JSON.parse(stored);
      }
      // Initialize with seed data if storage is empty
      localStorage.setItem('culinaryScale_recipes', JSON.stringify(SEED_RECIPES));
      return SEED_RECIPES;
    } catch (e) {
      console.error("Failed to parse recipes", e);
      return SEED_RECIPES;
    }
  });

  const addRecipe = (recipe: Recipe) => {
    const updated = [recipe, ...recipes];
    setRecipes(updated);
    localStorage.setItem('culinaryScale_recipes', JSON.stringify(updated));
  };

  const updateRecipe = (updatedRecipe: Recipe) => {
    const updated = recipes.map(r => r.id === updatedRecipe.id ? updatedRecipe : r);
    setRecipes(updated);
    localStorage.setItem('culinaryScale_recipes', JSON.stringify(updated));
  };

  const deleteRecipe = (id: string) => {
    const updated = recipes.filter(r => r.id !== id);
    setRecipes(updated);
    localStorage.setItem('culinaryScale_recipes', JSON.stringify(updated));
  };

  const getRecipe = (id: string) => recipes.find(r => r.id === id);

  return { recipes, addRecipe, updateRecipe, deleteRecipe, getRecipe };
};
