"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recipeRouter = void 0;
const express_1 = __importDefault(require("express"));
const recipeController_1 = require("../controllers/recipeController");
exports.recipeRouter = express_1.default.Router();
exports.recipeRouter.post("/create", recipeController_1.createRecipe);
exports.recipeRouter.get("/", recipeController_1.getAllRecipes);
exports.recipeRouter.get("/:id", recipeController_1.getRecipeById);
exports.recipeRouter.put("/:id", recipeController_1.updateRecipe);
exports.recipeRouter.delete("/:id", recipeController_1.deleteRecipe);
