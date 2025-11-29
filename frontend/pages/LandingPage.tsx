
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Plus, ChefHat, Clock, Users, MoreVertical, Edit, Trash2, Lock, X } from 'lucide-react';
import { Button } from '../components/Button';
import { getAllRecipes, deleteRecipeById } from "../lib/api";

export const LandingPage: React.FC = () => {
  

  const [recipes, setRecipes] = useState<any[]>([]);
  React.useEffect(() => {
    getAllRecipes().then(setRecipes).catch(console.error);
  }, []);


  const navigate = useNavigate();

  // Security Modal State
  const [securityModal, setSecurityModal] = useState<{
    isOpen: boolean;
    type: 'EDIT' | 'DELETE' | null;
    recipeId: string | null;
  }>({
    isOpen: false,
    type: null,
    recipeId: null,
  });
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);

  const handleAction = (type: 'EDIT' | 'DELETE', recipeId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    setSecurityModal({ isOpen: true, type, recipeId });
    setCode('');
    setError(false);
  };

 const confirmSecurity = async () => {
   if (code !== "1313") {
     setError(true);
     return;
   }

   if (securityModal.type === "DELETE" && securityModal.recipeId) {
     await deleteRecipeById(securityModal.recipeId);
     setRecipes((prev) => prev.filter((r) => r._id !== securityModal.recipeId));
   } else if (securityModal.type === "EDIT" && securityModal.recipeId) {
     navigate(`/edit/${securityModal.recipeId}`);
   }


   setSecurityModal({ isOpen: false, type: null, recipeId: null });
 };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-stone-900 flex items-center gap-3 tracking-tight">
            <ChefHat className="w-10 h-10 text-chef-600" />
            CulinaryScale
          </h1>
          <p className="text-stone-600 mt-2 font-medium text-lg">
            Smart ingredient scaling for professional and home kitchens.
          </p>
        </div>
        <Button
          onClick={() => navigate("/create")}
          size="lg"
          className="shadow-lg shadow-chef-200 font-bold"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create New Recipe
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recipes.map((recipe) => (
          <div
            key={recipe._id}
            onClick={() => navigate(`/recipe/${recipe._id}`)}
            className="group bg-white rounded-2xl shadow-sm border border-stone-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full relative"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={recipe.imageUrl}
                alt={recipe.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-stone-800 shadow-sm border border-white/50">
                {recipe.ingredients?.length ?? 0} Ingredients
              </div>

              {/* Action Menu (Visible on Hover) */}
              <div
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="group/menu relative">
                  <button className="p-2 bg-white/90 hover:bg-white text-stone-600 hover:text-chef-600 rounded-full shadow-sm backdrop-blur-sm transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>

                  {/* Dropdown */}
                  <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-xl shadow-xl border border-stone-100 overflow-hidden transform scale-95 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible group-hover/menu:scale-100 transition-all duration-200 z-10 origin-top-right">
                    <button
                      onClick={(e) => handleAction("EDIT", recipe._id, e)}
                      className="w-full text-left px-4 py-3 text-sm font-bold text-stone-600 hover:bg-stone-50 hover:text-chef-600 flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" /> Edit
                    </button>
                    <button
                      onClick={(e) => handleAction("DELETE", recipe._id, e)}
                      className="w-full text-left px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 flex items-center gap-2 border-t border-stone-50"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-xl font-bold text-stone-900 mb-2 group-hover:text-chef-600 transition-colors">
                {recipe.title}
              </h3>
              <p className="text-stone-600 text-sm mb-4 line-clamp-2 flex-1 font-medium">
                {recipe.description}
              </p>

              <div className="flex items-center gap-4 text-xs text-stone-500 font-bold pt-4 border-t border-stone-100 uppercase tracking-wide">
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  <span>Base: {recipe.baseServings}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Just now</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {recipes.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-stone-300">
          <ChefHat className="w-16 h-16 text-stone-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-stone-900">No recipes yet</h3>
          <p className="text-stone-500 mb-6 font-medium">
            Get started by creating your first culinary masterpiece.
          </p>
          <Button onClick={() => navigate("/create")}>Create Recipe</Button>
        </div>
      )}

      {/* Security Modal */}
      {securityModal.isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setSecurityModal({ ...securityModal, isOpen: false })}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-red-100 rounded-md text-red-600">
                  <Lock className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-stone-800">Security Check</h3>
              </div>
              <button
                onClick={() =>
                  setSecurityModal({ ...securityModal, isOpen: false })
                }
                className="p-1.5 hover:bg-stone-200 rounded-full text-stone-400 hover:text-stone-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-stone-500 text-sm mb-4 font-medium">
                Enter the chef's secret code to{" "}
                {securityModal.type === "DELETE"
                  ? "permanently delete"
                  : "edit"}{" "}
                this recipe.
              </p>

              <input
                type="password"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setError(false);
                }}
                onKeyDown={(e) => e.key === "Enter" && confirmSecurity()}
                autoFocus
                placeholder="Enter Code"
                className={`w-full px-4 py-3 rounded-xl border font-bold text-center tracking-widest text-lg outline-none focus:ring-2 transition-all ${
                  error
                    ? "border-red-300 bg-red-50 text-red-900 focus:ring-red-200 placeholder:text-red-300"
                    : "border-stone-200 bg-white text-stone-900 focus:border-chef-500 focus:ring-chef-500/20"
                }`}
              />
              {error && (
                <p className="text-center text-xs text-red-500 font-bold mt-2">
                  Access Denied. Incorrect Code.
                </p>
              )}
            </div>

            <div className="p-4 bg-stone-50 border-t border-stone-100 flex gap-3">
              <Button
                variant="secondary"
                className="flex-1 bg-white border border-stone-200"
                onClick={() =>
                  setSecurityModal({ ...securityModal, isOpen: false })
                }
              >
                Cancel
              </Button>
              <Button
                className="flex-1 font-bold shadow-lg"
                onClick={confirmSecurity}
                variant={securityModal.type === "DELETE" ? "danger" : "primary"}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
