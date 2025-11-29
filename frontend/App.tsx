
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { CreateRecipe } from './pages/CreateRecipe';
import { RecipeView } from './pages/RecipeView';
import { ChefHat } from 'lucide-react';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen bg-stone-50 font-sans text-stone-900 selection:bg-chef-200 selection:text-chef-900">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/create" element={<CreateRecipe />} />
          <Route path="/edit/:id" element={<CreateRecipe />} />
          <Route path="/recipe/:id" element={<RecipeView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <footer className="py-8 text-center text-stone-500 text-sm font-medium">
          <div className="flex items-center justify-center gap-2 mb-2 text-stone-600">
            <ChefHat className="w-4 h-4" />
            <span className="font-bold">CulinaryScale</span>
          </div>
          <p>© {new Date().getFullYear()} Precision Cooking Interface</p>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
