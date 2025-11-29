import { Request, Response } from "express";
import Recipe from "../models/Recipe";

// Create Recipe
export const createRecipe = async (req: Request, res: Response) => {
  try {
    const recipe = await Recipe.create(req.body);
    res.status(201).json(recipe);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Get All Recipes
export const getAllRecipes = async (_req: Request, res: Response) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    res.json(recipes);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Get Single Recipe
export const getRecipeById = async (req: Request, res: Response) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });
    res.json(recipe);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Update Recipe
export const updateRecipe = async (req: Request, res: Response) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });

    res.json(recipe);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Recipe
export const deleteRecipe = async (req: Request, res: Response) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
