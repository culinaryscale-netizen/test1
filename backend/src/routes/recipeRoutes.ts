import express from "express";
import {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
} from "../controllers/recipeController";

export const recipeRouter = express.Router();

recipeRouter.post("/create", createRecipe);
recipeRouter.get("/", getAllRecipes);
recipeRouter.get("/:id", getRecipeById);
recipeRouter.put("/:id", updateRecipe);
recipeRouter.delete("/:id", deleteRecipe);
