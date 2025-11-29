import { Schema, model } from "mongoose";

const IngredientSchema = new Schema({
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

const RecipeSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },

  baseServings: { type: Number, required: true },

  imageUrl: String,

  ingredients: [IngredientSchema],
  steps: [String],
});

export default model("Recipe", RecipeSchema);
