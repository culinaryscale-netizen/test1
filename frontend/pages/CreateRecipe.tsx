
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Ingredient, IngredientType, Recipe, TasteAdjustmentConfig } from '../types';
import { Button } from '../components/Button';
import { ArrowLeft, Trash2, Plus, HelpCircle, Save, Camera, X, ChefHat, Flame, Link, Upload, Lock } from 'lucide-react';
import { createRecipe, updateRecipe, getRecipeById } from "../lib/api";



const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2, 5);

export const CreateRecipe: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
 

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [baseServings, setBaseServings] = useState<number>(4);
  const [imageUrl, setImageUrl] = useState(`https://picsum.photos/800/600?random=${Math.floor(Math.random() * 100)}`);
  
  // Secret Code State
  const [secretCode, setSecretCode] = useState('');
  const [secretError, setSecretError] = useState(false);
  
  // Image Modal State
  const [activeImageId, setActiveImageId] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');

  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: generateId(), name: '', quantity: 0, unit: 'g', type: IngredientType.NORMAL, isTasteAdjustable: false }
  ]);

  // Load existing recipe if in Edit Mode
 useEffect(() => {
   if (!id) return;

   const load = async () => {
     try {
       const recipe = await getRecipeById(id);
       setTitle(recipe.title);
       setDescription(recipe.description);
       setBaseServings(recipe.baseServings);
       setImageUrl(recipe.imageUrl);
       setIngredients(recipe.ingredients);
     } catch (err) {
       console.error(err);
       navigate("/");
     }
   };

   load();
 }, [id]);


  const handleAddIngredient = () => {
    setIngredients([
      ...ingredients,
      { id: generateId(), name: '', quantity: 0, unit: '', type: IngredientType.NORMAL, isTasteAdjustable: false, constantLimit: 0}
    ]);
  };

  const handleRemoveIngredient = (id: string) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter(ing => ing.id !== id));
    }
  };

  const updateIngredient = (id: string, field: keyof Ingredient, value: any) => {
    setIngredients(ingredients.map(ing => {
      if (ing.id !== id) return ing;
      
      // If toggling isTasteAdjustable to true, initialize config if missing
      if (field === 'isTasteAdjustable' && value === true && !ing.tasteAdjustmentConfig) {
        return {
          ...ing,
          [field]: value,
          tasteAdjustmentConfig: {
            mildReductionPercentage: 20,
            spicyIncreasePercentage: 30,
            indianBoostIncreasePercentage: 60
          }
        };
      }
      
      return { ...ing, [field]: value };
    }));
  };
  
  const updateTasteConfig = (id: string, field: keyof TasteAdjustmentConfig, value: number) => {
    setIngredients(ingredients.map(ing => {
      if (ing.id !== id) return ing;
      return {
        ...ing,
        tasteAdjustmentConfig: {
          ...(ing.tasteAdjustmentConfig || {
            mildReductionPercentage: 20,
            spicyIncreasePercentage: 30,
            indianBoostIncreasePercentage: 60
          }),
          [field]: value
        }
      };
    }));
  };

  // Image Modal Handlers
  const openImageModal = (id: string, currentUrl: string = '') => {
    setActiveImageId(id);
    setUrlInput(currentUrl);
  };

  const handleUrlSave = () => {
    if (activeImageId === 'COVER') {
        setImageUrl(urlInput);
        setActiveImageId(null);
    } else if (activeImageId) {
      updateIngredient(activeImageId, 'imageUrl', urlInput);
      setActiveImageId(null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeImageId) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (activeImageId === 'COVER') {
            setImageUrl(reader.result as string);
        } else {
            updateIngredient(activeImageId, 'imageUrl', reader.result as string);
        }
        setActiveImageId(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecretError(false);

    if (!title.trim()) return;

    if (secretCode !== "1313") {
      setSecretError(true);
      return;
    }

    const payload = {
      title,
      description,
      baseServings,
      imageUrl,
      ingredients,
    };

    if (id) {
      await updateRecipe(id, payload);
    } else {
      await createRecipe(payload);
    }

    navigate("/");
  };

  const inputStyles = "w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 font-semibold focus:ring-2 focus:ring-chef-500/20 focus:border-chef-500 outline-none transition-all duration-200 text-sm placeholder:text-stone-400 hover:bg-white shadow-sm";
  const labelStyles = "block text-xs font-extrabold text-stone-600 mb-2 uppercase tracking-wider";

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => navigate('/')}
        className="mb-6 border-none px-0 hover:bg-transparent hover:text-chef-700 shadow-none bg-transparent font-semibold text-stone-500"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Recipes
      </Button>

      <div className="bg-white rounded-3xl shadow-2xl shadow-stone-200/50 border border-white overflow-hidden">
        <div className="p-8 md:p-10 border-b border-stone-100 bg-gradient-to-r from-stone-50/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-chef-100 rounded-lg text-chef-600">
               <ChefHat className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
                {id ? 'Edit Recipe' : 'New Recipe'}
            </h1>
          </div>
          <p className="text-stone-500 font-medium pl-[52px]">Define your base ingredients and scaling rules.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-12">
          {/* Basic Info Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-8">
              <div className="group">
                <label className={labelStyles}>Recipe Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className={`${inputStyles} text-lg`}
                  placeholder="e.g. Grandma's Famous Lasagna"
                />
              </div>
              
              <div className="group">
                <label className={labelStyles}>Description</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={4}
                  className={inputStyles}
                  placeholder="Describe the flavors, texture, and origin..."
                />
              </div>

              <div className="group">
                <label className={labelStyles}>Base Serving Size</label>
                <div className="relative w-40">
                  <input
                    type="number"
                    min="1"
                    required
                    value={baseServings}
                    onChange={e => setBaseServings(parseInt(e.target.value) || 1)}
                    className={`${inputStyles} pr-16 text-center text-xl font-bold`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 text-xs font-bold pointer-events-none uppercase">Plates</span>
                </div>
                <p className="text-xs text-stone-400 font-medium mt-3 leading-relaxed">
                  All ingredients entered below should correspond to this amount.
                </p>
              </div>
            </div>

            <div className="space-y-5">
               <div className="group">
                <label className={labelStyles}>Cover Image</label>
                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => openImageModal('COVER', imageUrl)}
                    className="flex-1 border-stone-200 text-stone-600 hover:bg-stone-50 font-bold"
                  >
                    <Upload className="w-4 h-4 mr-2" /> Upload / URL
                  </Button>
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={() => setImageUrl(`https://picsum.photos/800/600?random=${Math.floor(Math.random() * 1000)}`)}
                    className="whitespace-nowrap font-bold text-stone-600 bg-stone-100 hover:bg-stone-200"
                  >
                    Random
                  </Button>
                </div>
              </div>
              <div 
                onClick={() => openImageModal('COVER', imageUrl)}
                className="aspect-video w-full rounded-2xl bg-stone-50 overflow-hidden border border-stone-100 relative shadow-inner group cursor-pointer hover:shadow-lg transition-all duration-500"
              >
                {imageUrl ? (
                  <>
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/800x600?text=Invalid+URL')} />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                        <Camera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-stone-400 font-bold">
                      <Camera className="w-8 h-8 mb-2" />
                      <span>Click to set image</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-stone-100 my-8"></div>

          {/* Ingredients Section */}
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
              <div>
                 <h2 className="text-2xl font-bold text-stone-900 mb-1">Ingredients</h2>
                 <p className="text-stone-500 text-sm font-medium">Add all components for the base serving size.</p>
              </div>
              <div className="text-xs font-bold text-stone-600 bg-stone-50 px-4 py-2 rounded-full border border-stone-200 flex items-center shadow-sm">
                <HelpCircle className="w-4 h-4 mr-2 text-chef-500" />
                "Constant" items (like pans/garnishes) don't scale until limit is hit.
              </div>
            </div>
            
            <div className="space-y-4">
              {ingredients.map((ing, index) => (
                <div 
                  key={ing.id} 
                  className={`group relative flex flex-col bg-white p-3 rounded-2xl border transition-all duration-300 ${ing.isTasteAdjustable ? 'border-orange-200 shadow-orange-100/50' : 'border-stone-100 shadow-sm'} hover:shadow-lg`}
                >
                   <div className="flex flex-col md:flex-row gap-4 items-start md:items-center w-full">
                      <div className="absolute -left-3 top-12 md:top-1/2 md:-translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-xs font-bold text-stone-400 md:flex hidden border border-stone-200 shadow-sm z-10 group-hover:scale-110 transition-transform">
                        {index + 1}
                      </div>
                      
                      {/* Image Trigger */}
                      <div className="flex-shrink-0 p-2">
                         <button
                            type="button"
                            onClick={() => openImageModal(ing.id, ing.imageUrl)}
                            className="w-16 h-16 flex-shrink-0 rounded-xl bg-stone-50 border-2 border-dashed border-stone-200 flex items-center justify-center cursor-pointer hover:border-chef-400 hover:bg-chef-50 hover:text-chef-600 text-stone-400 overflow-hidden transition-all relative group/image outline-none focus:ring-2 focus:ring-chef-500 focus:ring-offset-2"
                            title="Set ingredient image"
                          >
                            {ing.imageUrl ? (
                              <>
                                  <img src={ing.imageUrl} alt="" className="w-full h-full object-cover" />
                                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity">
                                      <Camera className="w-5 h-5 text-white" />
                                  </div>
                              </>
                            ) : (
                              <Camera className="w-5 h-5" />
                            )}
                          </button>
                      </div>

                      {/* Main Inputs */}
                      <div className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-3 w-full p-2">
                        {/* Name */}
                        <div className="md:col-span-4">
                          <input
                            type="text"
                            placeholder="Ingredient Name (e.g. Chili Powder)"
                            value={ing.name}
                            onChange={e => updateIngredient(ing.id, 'name', e.target.value)}
                            className={`${inputStyles} font-bold`}
                          />
                        </div>

                        {/* Quantity */}
                        <div className="md:col-span-2">
                          <input
                            type="number"
                            placeholder="Qty"
                            min="0"
                            step="any"
                            value={ing.quantity || ''}
                            onChange={e => updateIngredient(ing.id, 'quantity', parseFloat(e.target.value) || 0)}
                            className={inputStyles}
                          />
                        </div>

                        {/* Unit */}
                        <div className="md:col-span-2">
                          <input
                            type="text"
                            placeholder="Unit"
                            value={ing.unit}
                            onChange={e => updateIngredient(ing.id, 'unit', e.target.value)}
                            className={inputStyles}
                          />
                        </div>

                        {/* Type & Taste Toggles */}
                        <div className="md:col-span-4 flex gap-2">
                          <div className="relative flex-grow">
                            <select
                              value={ing.type}
                              onChange={e => updateIngredient(ing.id, 'type', e.target.value as IngredientType)}
                              className={`w-full px-4 py-3 rounded-xl border text-sm font-bold focus:ring-2 focus:ring-chef-500/20 outline-none cursor-pointer transition-colors appearance-none bg-no-repeat bg-[right_1rem_center] pr-10 truncate ${
                                ing.type === IngredientType.CONSTANT 
                                  ? 'bg-amber-50 border-amber-200 text-amber-800' 
                                  : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-white'
                              }`}
                              style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%234b5563' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")` }}
                            >
                              <option value={IngredientType.NORMAL}>Linear Scaling</option>
                              <option value={IngredientType.CONSTANT}>Constant Limit</option>
                            </select>
                          </div>

                          {/* Taste Toggle Button */}
                          <button
                            type="button"
                            onClick={() => updateIngredient(ing.id, 'isTasteAdjustable', !ing.isTasteAdjustable)}
                            className={`w-12 flex-shrink-0 flex items-center justify-center rounded-xl border transition-all duration-200 ${
                              ing.isTasteAdjustable
                                ? 'bg-orange-100 border-orange-300 text-orange-600 shadow-inner'
                                : 'bg-stone-50 border-stone-200 text-stone-300 hover:text-stone-500 hover:bg-white'
                            }`}
                            title="Mark as Taste Ingredient (scales with Spice Mode)"
                          >
                            <Flame className={`w-5 h-5 ${ing.isTasteAdjustable ? 'fill-orange-500' : ''}`} />
                          </button>
                          
                          {ing.type === IngredientType.CONSTANT && (
                            <div className="relative w-24 animate-fade-in flex-shrink-0 group/limit" title="Keep quantity constant up to this many servings">
                              <input
                                type="number"
                                min="1"
                                value={ing.constantLimit === 0 ? '' : (ing.constantLimit || 6)}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  updateIngredient(ing.id, 'constantLimit', val === '' ? 0 : parseFloat(val));
                                }}
                                className={`${inputStyles} pr-8 border-amber-200 focus:border-amber-400 bg-amber-50/50 text-amber-900 placeholder:text-amber-300`}
                                placeholder="Limit"
                              />
                              
                              {/* Clear Button for Limit */}
                              <button
                                type="button"
                                onClick={() => updateIngredient(ing.id, 'constantLimit', 0)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-amber-300 hover:text-amber-600 rounded-full hover:bg-amber-100 transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveIngredient(ing.id)}
                        className="p-3 mr-2 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors flex-shrink-0 self-start md:self-center"
                        disabled={ingredients.length === 1}
                        title="Remove Ingredient"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                   </div>

                  {/* Taste Configuration Section */}
                  {ing.isTasteAdjustable && (
                      <div className="w-full mt-2 pl-2 md:pl-24 pr-2 pb-2 animate-fade-in">
                        <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 shadow-inner">
                           <div className="text-xs font-bold text-stone-500 uppercase mb-3 flex items-center gap-2">
                              <Flame className="w-3 h-3 text-orange-500" />
                              Taste Profile Adjustments
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {/* Mild */}
                              <div className="space-y-1.5">
                                 <label className="text-xs font-bold text-green-700 uppercase tracking-tight">Mild (Reduction %)</label>
                                 <div className="relative">
                                    <input
                                       type="number"
                                       min="0"
                                       max="100"
                                       value={ing.tasteAdjustmentConfig?.mildReductionPercentage ?? 20}
                                       onChange={(e) => updateTasteConfig(ing.id, 'mildReductionPercentage', parseFloat(e.target.value) || 0)}
                                       className="w-full pl-3 pr-8 py-2.5 bg-white border border-stone-200 rounded-lg text-sm font-bold text-stone-900 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all shadow-sm"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs font-bold">%</span>
                                 </div>
                                 <p className="text-[10px] text-stone-400 font-medium">Decreases base amount</p>
                              </div>

                              {/* Spicy */}
                              <div className="space-y-1.5">
                                 <label className="text-xs font-bold text-orange-700 uppercase tracking-tight">Spicy (Increase %)</label>
                                  <div className="relative">
                                    <input
                                       type="number"
                                       min="0"
                                       value={ing.tasteAdjustmentConfig?.spicyIncreasePercentage ?? 30}
                                       onChange={(e) => updateTasteConfig(ing.id, 'spicyIncreasePercentage', parseFloat(e.target.value) || 0)}
                                       className="w-full pl-3 pr-8 py-2.5 bg-white border border-stone-200 rounded-lg text-sm font-bold text-stone-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all shadow-sm"
                                    />
                                     <span className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs font-bold">%</span>
                                 </div>
                                 <p className="text-[10px] text-stone-400 font-medium">Increases base amount</p>
                              </div>

                              {/* Indian Boost */}
                              <div className="space-y-1.5">
                                 <label className="text-xs font-bold text-purple-700 uppercase tracking-tight">Indian Boost (Increase %)</label>
                                  <div className="relative">
                                    <input
                                       type="number"
                                       min="0"
                                       value={ing.tasteAdjustmentConfig?.indianBoostIncreasePercentage ?? 60}
                                       onChange={(e) => updateTasteConfig(ing.id, 'indianBoostIncreasePercentage', parseFloat(e.target.value) || 0)}
                                       className="w-full pl-3 pr-8 py-2.5 bg-white border border-stone-200 rounded-lg text-sm font-bold text-stone-900 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all shadow-sm"
                                    />
                                     <span className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs font-bold">%</span>
                                 </div>
                                 <p className="text-[10px] text-stone-400 font-medium">Extreme flavor boost</p>
                              </div>
                           </div>
                        </div>
                      </div>
                  )}
                </div>
              ))}
            </div>

            <Button 
              type="button" 
              variant="outline" 
              onClick={handleAddIngredient} 
              className="mt-6 w-full border-dashed border-2 border-stone-200 text-stone-500 font-bold hover:border-chef-400 hover:text-chef-700 hover:bg-chef-50/50 py-4 rounded-2xl transition-all"
            >
              <Plus className="w-5 h-5 mr-2" /> Add Another Ingredient
            </Button>
          </div>

          <div className="pt-8 border-t border-stone-100">
            <div className="flex flex-col md:flex-row justify-end items-end md:items-center gap-6">
                
                <div className="w-full md:w-64 flex flex-col items-end">
                    <label className="text-xs font-extrabold text-stone-400 uppercase mb-2 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Chef Access Code
                    </label>
                    <input 
                        type="password" 
                        value={secretCode}
                        onChange={(e) => {
                            setSecretCode(e.target.value);
                            setSecretError(false);
                        }}
                        placeholder="Enter Secret Code"
                        className={`w-full px-4 py-3 rounded-xl border bg-white text-stone-900 font-bold focus:ring-2 outline-none transition-all text-center tracking-widest ${
                            secretError 
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-200 placeholder:text-red-300' 
                            : 'border-stone-200 focus:border-chef-500 focus:ring-chef-500/20 placeholder:text-stone-300'
                        }`}
                    />
                    {secretError && (
                        <p className="text-xs text-red-500 font-bold mt-1 animate-pulse">Invalid Code. Access Denied.</p>
                    )}
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                    <Button type="button" variant="secondary" onClick={() => navigate('/')} className="flex-1 md:flex-none px-6 py-3 h-auto text-stone-600 font-bold bg-stone-100 hover:bg-stone-200 rounded-xl">
                        Cancel
                    </Button>
                    <Button type="submit" size="lg" className="flex-1 md:flex-none px-8 py-3 h-auto shadow-xl shadow-chef-500/20 hover:shadow-chef-500/30 transition-all font-bold rounded-xl text-lg">
                        <Save className="w-5 h-5 mr-2" />
                        {id ? 'Update Recipe' : 'Save Recipe'}
                    </Button>
                </div>
            </div>
          </div>
        </form>
      </div>

      {/* Image Selection Modal */}
      {activeImageId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
                <div className="p-5 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
                   <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-chef-100 rounded-md text-chef-600">
                        <Camera className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-stone-800">
                        {activeImageId === 'COVER' ? 'Set Cover Image' : 'Set Ingredient Image'}
                      </h3>
                   </div>
                   <button onClick={() => setActiveImageId(null)} className="p-1.5 hover:bg-stone-200 rounded-full text-stone-400 hover:text-stone-600 transition-colors">
                      <X className="w-5 h-5"/>
                   </button>
                </div>
                
                <div className="p-6 space-y-6">
                   {/* URL Section */}
                   <div className="space-y-3">
                      <label className="text-xs font-bold text-stone-500 uppercase flex items-center gap-2">
                        <Link className="w-3 h-3" />
                        Paste Image URL
                      </label>
                      <div className="flex gap-2">
                         <input 
                            type="url" 
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            placeholder="https://example.com/image.jpg"
                            className="flex-1 px-4 py-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-chef-500/20 focus:border-chef-500 outline-none text-sm transition-all bg-white text-stone-900"
                            autoFocus
                         />
                         <Button onClick={handleUrlSave} size="sm" className="rounded-xl" disabled={!urlInput}>
                            Save
                         </Button>
                      </div>
                   </div>
                   
                   <div className="relative flex items-center py-1">
                      <div className="flex-grow border-t border-stone-200"></div>
                      <span className="flex-shrink-0 mx-4 text-stone-300 text-xs font-bold uppercase tracking-widest">Or</span>
                      <div className="flex-grow border-t border-stone-200"></div>
                   </div>
    
                   {/* Upload Section */}
                   <div>
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-stone-200 border-dashed rounded-2xl cursor-pointer hover:bg-stone-50 hover:border-chef-400 transition-all group/upload relative overflow-hidden">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6 z-10">
                              <Upload className="w-8 h-8 mb-3 text-stone-300 group-hover/upload:text-chef-500 transition-colors" />
                              <p className="mb-1 text-sm font-semibold text-stone-600 group-hover/upload:text-chef-700">Upload from Device</p>
                              <p className="text-xs text-stone-400">JPG, PNG, GIF</p>
                          </div>
                          <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                          <div className="absolute inset-0 bg-chef-50/0 group-hover/upload:bg-chef-50/30 transition-colors" />
                      </label>
                   </div>
                </div>

                <div className="p-4 bg-stone-50 border-t border-stone-100 flex justify-center">
                   <button onClick={() => setActiveImageId(null)} className="text-sm font-bold text-stone-500 hover:text-stone-800 transition-colors">
                      Cancel
                   </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
