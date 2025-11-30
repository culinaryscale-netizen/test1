"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRecipe = exports.updateRecipe = exports.getRecipeById = exports.getAllRecipes = exports.createRecipe = void 0;
const Recipe_1 = __importDefault(require("../models/Recipe"));
// Create Recipe
const createRecipe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recipe = yield Recipe_1.default.create(req.body);
        res.status(201).json(recipe);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.createRecipe = createRecipe;
// Get All Recipes
const getAllRecipes = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recipes = yield Recipe_1.default.find().sort({ createdAt: -1 });
        res.json(recipes);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.getAllRecipes = getAllRecipes;
// Get Single Recipe
const getRecipeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recipe = yield Recipe_1.default.findById(req.params.id);
        if (!recipe)
            return res.status(404).json({ error: "Recipe not found" });
        res.json(recipe);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.getRecipeById = getRecipeById;
// Update Recipe
const updateRecipe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recipe = yield Recipe_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!recipe)
            return res.status(404).json({ error: "Recipe not found" });
        res.json(recipe);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.updateRecipe = updateRecipe;
// Delete Recipe
const deleteRecipe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recipe = yield Recipe_1.default.findByIdAndDelete(req.params.id);
        if (!recipe)
            return res.status(404).json({ error: "Recipe not found" });
        res.json({ success: true });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.deleteRecipe = deleteRecipe;
