
export enum IngredientType {
  NORMAL = 'NORMAL',
  CONSTANT = 'CONSTANT',
}

export interface TasteAdjustmentConfig {
  mildReductionPercentage: number;
  spicyIncreasePercentage: number;
  indianBoostIncreasePercentage: number;
}

export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  type: IngredientType;
  constantLimit?: number;
  imageUrl?: string;
  isTasteAdjustable?: boolean;
  tasteAdjustmentConfig?: TasteAdjustmentConfig;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  baseServings: number;
  ingredients: Ingredient[];
  imageUrl: string;
  createdAt: number;
}
