"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const IngredientSchema = new mongoose_1.Schema({
    id: String,
    name: String,
    quantity: Number,
    unit: String,
    type: {
        type: String,
        enum: ["NORMAL", "CONSTANT"],
        default: "NORMAL",
    },
    constantLimit: { type: Number, default: 6 },
    isTasteAdjustable: { type: Boolean, default: false },
    tasteAdjustmentConfig: {
        mildReductionPercentage: { type: Number, default: 20 },
        spicyIncreasePercentage: { type: Number, default: 30 },
        indianBoostIncreasePercentage: { type: Number, default: 60 },
    },
    imageUrl: String,
});
const RecipeSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, default: "" },
    baseServings: { type: Number, required: true },
    imageUrl: String,
    ingredients: [IngredientSchema],
    steps: [String],
});
exports.default = (0, mongoose_1.model)("Recipe", RecipeSchema);
