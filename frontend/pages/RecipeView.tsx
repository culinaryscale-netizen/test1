
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRecipeById } from "../lib/api";

import { IngredientType } from '../types';
import { Button } from '../components/Button';
import { ArrowLeft, Minus, Plus, ChefHat, Info, Scale, Utensils, X, Flame, Leaf, Zap, Droplets } from 'lucide-react';

// Taste Profiles
type TasteProfile = 'MILD' | 'MEDIUM' | 'SPICY' | 'INDIAN_BOOST';

const TASTE_OPTIONS: { id: TasteProfile; label: string; icon: React.FC<any>; description: string; color: string }[] = [
  { id: 'MILD', label: 'Mild', icon: Leaf, description: 'Reduced spice & intensity', color: 'text-green-600 bg-green-50 border-green-200' },
  { id: 'MEDIUM', label: 'Medium', icon: Utensils, description: 'Original balanced recipe', color: 'text-stone-600 bg-stone-50 border-stone-200' },
  { id: 'SPICY', label: 'Spicy', icon: Flame, description: 'Enhanced flavors & heat', color: 'text-orange-600 bg-orange-50 border-orange-200' },
  { id: 'INDIAN_BOOST', label: 'Indian Boost', icon: Zap, description: 'Maximum masala punch', color: 'text-purple-600 bg-purple-50 border-purple-200' },
];

export const RecipeView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState<any>(null);
  const [servings, setServings] = useState<number>(1);
  const [tasteProfile, setTasteProfile] = useState<TasteProfile>("MEDIUM");
  const [viewImage, setViewImage] = useState<string | null>(null);



  useEffect(() => {
    if (!id) return;

    const loadRecipe = async () => {
      try {
        const data = await getRecipeById(id);
        setRecipe(data);
        setServings(data.baseServings);
      } catch (err) {
        console.error(err);
        navigate("/");
      }
    };

    loadRecipe();
  }, [id]);


  // The Core Logic for Scaling & Taste Adjustment
  const scaledIngredients = useMemo(() => {
    if (!recipe) return [];

    return recipe.ingredients.map(ing => {
      let scaledQty = ing.quantity;
      let scalingLabel = '';
      const limit = ing.constantLimit || 6;

      // 1. Base Scaling Logic
      if (ing.type === IngredientType.NORMAL) {
        scaledQty = ing.quantity * (servings / recipe.baseServings);
      } else {
        // Constant Logic
        if (servings <= limit) {
            scaledQty = ing.quantity;
            scalingLabel = `Constant (Batch ≤ ${limit})`;
        } else {
            scaledQty = ing.quantity * (servings / limit);
            scalingLabel = `Scaled (Batch > ${limit})`;
        }
      }

      // 2. Taste Adjustment Logic
      let tasteMultiplier = 1;
      let isAdjusted = false;
      let adjustmentLabel = '';

      if (ing.isTasteAdjustable) {
        const config = ing.tasteAdjustmentConfig;
        
        if (tasteProfile === 'MILD') {
            const reduction = config?.mildReductionPercentage ?? 20;
            tasteMultiplier = Math.max(0, 1 - (reduction / 100));
        } else if (tasteProfile === 'SPICY') {
            const increase = config?.spicyIncreasePercentage ?? 30;
            tasteMultiplier = 1 + (increase / 100);
        } else if (tasteProfile === 'INDIAN_BOOST') {
            const increase = config?.indianBoostIncreasePercentage ?? 60;
            tasteMultiplier = 1 + (increase / 100);
        } else {
            // MEDIUM or default
            tasteMultiplier = 1.0;
        }

        isAdjusted = tasteMultiplier !== 1;
        
        if (isAdjusted) {
          const pct = Math.round((tasteMultiplier - 1) * 100);
          adjustmentLabel = pct > 0 ? `+${pct}% Intensity` : `${pct}% Intensity`;
        }
      }
      
      const finalQty = scaledQty * tasteMultiplier;

      return {
        ...ing,
        scaledQty: finalQty,
        scalingLabel,
        limit,
        isAdjusted,
        adjustmentLabel,
        baseScaledQty: scaledQty // Keep track of what it would be without taste adjustment
      };
    });
  }, [recipe, servings, tasteProfile]);

  const formatNumber = (num: number) => {
    // If very small but not zero, show more precision
    if (num > 0 && num < 0.1) return parseFloat(num.toFixed(3));
    return Number.isInteger(num) ? num : parseFloat(num.toFixed(2));
  };

  const handleServingsChange = (delta: number) => {
    setServings(prev => Math.max(1, prev + delta));
  };

  if (!recipe) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-stone-50">
        <h2 className="text-2xl font-bold text-stone-900 mb-4">Recipe Not Found</h2>
        <Button onClick={() => navigate('/')}>Return Home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Lightbox Modal */}
      {viewImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setViewImage(null)}
        >
          <div className="relative max-w-5xl w-full h-full flex items-center justify-center">
            <img 
              src={viewImage} 
              alt="Detail" 
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" 
            />
            <button 
              onClick={() => setViewImage(null)}
              className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
          </div>
        </div>
      )}

      {/* Hero Image Header */}
      <div className="relative h-[45vh] w-full bg-stone-900 group">
        <img 
          src={recipe.imageUrl} 
          alt={recipe.title} 
          className="w-full h-full object-cover opacity-85 group-hover:opacity-75 transition-opacity duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/95 via-stone-900/50 to-transparent" />
        
        <div className="absolute top-6 left-6 z-20">
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => navigate('/')}
            className="bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border border-white/10 shadow-sm font-semibold rounded-full px-5"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Recipes
          </Button>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 text-white z-10 translate-y-8">
          <div className="container mx-auto max-w-5xl">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-2xl tracking-tight leading-tight">{recipe.title}</h1>
            <p className="text-lg md:text-xl text-stone-200 max-w-2xl drop-shadow-md leading-relaxed font-medium line-clamp-2">{recipe.description}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl relative z-10 mt-4">
        
        {/* Main Control Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          
          {/* Servings Card */}
          <div className="lg:col-span-5 bg-white rounded-2xl shadow-lg shadow-stone-200/50 border border-white p-6 flex flex-col justify-between">
             <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-chef-50 rounded-lg text-chef-600">
                  <Scale className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-stone-800 text-lg">Batch Size</h3>
             </div>
             
             <div className="flex items-center justify-between bg-stone-50 rounded-xl p-2 border border-stone-200">
                <button 
                  onClick={() => handleServingsChange(-1)}
                  className="w-12 h-12 rounded-lg bg-white shadow-sm hover:shadow-md border border-stone-200 text-stone-600 hover:text-chef-600 flex items-center justify-center transition-all active:scale-95"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <div className="flex flex-col items-center">
                  <span className="text-4xl font-black text-stone-900 tabular-nums tracking-tight">{servings}</span>
                  <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Servings</span>
                </div>
                <button 
                  onClick={() => handleServingsChange(1)}
                  className="w-12 h-12 rounded-lg bg-chef-600 shadow-md shadow-chef-200 hover:bg-chef-700 text-white flex items-center justify-center transition-all active:scale-95"
                >
                  <Plus className="w-5 h-5" />
                </button>
             </div>
             <div className="mt-4 text-xs font-medium text-stone-500 text-center bg-stone-50 py-2 rounded-lg">
               Base Recipe: {recipe.baseServings} servings
             </div>
          </div>

          {/* Taste Profile Card */}
          <div className="lg:col-span-7 bg-white rounded-2xl shadow-lg shadow-stone-200/50 border border-white p-6">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                  <Droplets className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-stone-800 text-lg">Spice & Taste Customization</h3>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {TASTE_OPTIONS.map((option) => {
                const Icon = option.icon;
                const isSelected = tasteProfile === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => setTasteProfile(option.id)}
                    className={`relative flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-300 h-28 group ${
                      isSelected 
                        ? `${option.color} shadow-sm ring-1 ring-offset-1 ring-stone-200` 
                        : 'bg-white border-stone-100 text-stone-500 hover:border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <Icon className={`w-6 h-6 mb-2 ${isSelected ? '' : 'text-stone-400 group-hover:text-stone-600'}`} />
                    <span className="text-xs font-bold text-center leading-tight">{option.label}</span>
                    {isSelected && (
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-stone-900 text-white rounded-full flex items-center justify-center shadow-md">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 text-xs font-medium text-stone-500 bg-stone-50 py-2 px-3 rounded-lg border border-stone-100 flex items-center gap-2">
              <Info className="w-3.5 h-3.5" />
              {TASTE_OPTIONS.find(t => t.id === tasteProfile)?.description}
            </div>
          </div>
        </div>

        {/* Ingredients List */}
        <div className="bg-white rounded-3xl shadow-xl shadow-stone-200/40 border border-stone-100 overflow-hidden">
          <div className="p-8 border-b border-stone-100 bg-gradient-to-r from-stone-50/50 to-white flex justify-between items-center">
            <h2 className="text-2xl font-bold text-stone-900 flex items-center gap-3">
              <Utensils className="w-6 h-6 text-stone-400" />
              Ingredients
            </h2>
            <div className="text-sm font-semibold text-stone-500">
              {scaledIngredients.length} Items
            </div>
          </div>

          <div className="divide-y divide-stone-100">
            {scaledIngredients.map((ing, idx) => (
              <div 
                key={ing.id} 
                className={`group relative flex flex-col sm:flex-row sm:items-center justify-between p-6 transition-colors duration-300 ${
                  ing.type === IngredientType.CONSTANT 
                    ? 'bg-amber-50/30 hover:bg-amber-50/60' 
                    : 'hover:bg-stone-50/50'
                }`}
              >
                {/* Left Side: Image & Info */}
                <div className="flex items-center gap-5 flex-grow mb-4 sm:mb-0">
                  <div className="flex-shrink-0 w-8 text-sm font-bold text-stone-300 group-hover:text-chef-500 transition-colors hidden sm:block">
                    {(idx + 1).toString().padStart(2, '0')}
                  </div>
                  
                  {ing.imageUrl ? (
                    <div 
                      className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden shadow-sm border border-stone-200 cursor-zoom-in group-hover:shadow-md transition-all relative"
                      onClick={() => setViewImage(ing.imageUrl!)}
                    >
                        <img src={ing.imageUrl} alt={ing.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        {ing.isTasteAdjustable && (
                          <div className="absolute top-0 left-0 bg-orange-500/90 text-white p-0.5 rounded-br-lg">
                            <Flame className="w-3 h-3" />
                          </div>
                        )}
                    </div>
                  ) : (
                    <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-stone-100 flex items-center justify-center text-stone-300 border border-stone-200 relative">
                      <ChefHat className="w-6 h-6" />
                       {ing.isTasteAdjustable && (
                          <div className="absolute top-0 left-0 bg-orange-500/90 text-white p-0.5 rounded-br-lg">
                            <Flame className="w-3 h-3" />
                          </div>
                        )}
                    </div>
                  )}

                  <div className="min-w-0 pr-4">
                    <h3 className="font-bold text-stone-900 text-lg truncate flex items-center gap-2">
                      {ing.name}
                      {ing.isAdjusted && (
                        <span className={`text-[10px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider ${
                          ing.scaledQty > ing.baseScaledQty 
                            ? 'bg-orange-100 text-orange-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {ing.adjustmentLabel}
                        </span>
                      )}
                    </h3>
                    
                    <div className="flex flex-wrap gap-2 mt-1.5">
                       {ing.isTasteAdjustable && (
                        <span className="text-[10px] font-bold text-orange-700 px-2 py-0.5 bg-orange-50 border border-orange-200 rounded-md inline-flex items-center gap-1">
                           <Flame className="w-3 h-3" />
                           Taste Sensitive
                        </span>
                      )}
                      {ing.type === IngredientType.CONSTANT && (
                        <span className="text-[10px] font-bold text-amber-700 px-2 py-0.5 bg-amber-100 border border-amber-200 rounded-md inline-flex items-center gap-1">
                           <Scale className="w-3 h-3" />
                           Constant up to {ing.limit}
                        </span>
                      )}
                      {ing.scalingLabel && ing.type === IngredientType.CONSTANT && servings > (ing.limit || 0) && (
                         <span className="text-[10px] font-bold text-chef-700 px-2 py-0.5 bg-chef-50 border border-chef-100 rounded-md">
                           Scaling Active
                         </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Right Side: Quantity */}
                <div className="flex items-center justify-between sm:justify-end gap-6 sm:pl-4 min-w-[160px]">
                   <div className="flex flex-col items-start sm:items-end w-full">
                      <div className="flex items-baseline gap-1.5">
                        <span className={`text-3xl font-extrabold tabular-nums tracking-tight ${ing.isAdjusted ? 'text-chef-600' : 'text-stone-800'}`}>
                          {formatNumber(ing.scaledQty)}
                        </span>
                        <span className="text-sm font-bold text-stone-500">{ing.unit}</span>
                      </div>
                      
                      {/* Comparison / Original Info */}
                      <div className="flex flex-col items-end text-xs font-medium text-stone-400 mt-0.5">
                        {ing.isAdjusted && (
                          <span className="line-through decoration-stone-300 text-stone-300">
                             std: {formatNumber(ing.baseScaledQty)}
                          </span>
                        )}
                        <span>base: {ing.quantity}</span>
                      </div>
                   </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 bg-stone-50/80 border-t border-stone-200/60">
             <div className="flex gap-4 items-start max-w-2xl mx-auto text-sm text-stone-600 bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
                <ChefHat className="w-5 h-5 text-chef-500 flex-shrink-0 mt-0.5" />
                <p>
                  <strong className="text-stone-900">Chef's Note:</strong> Ingredients marked "Taste Sensitive" are adjusted by your selected taste profile <em>after</em> serving scaling. Constant ingredients scale only after their batch limit is reached.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
