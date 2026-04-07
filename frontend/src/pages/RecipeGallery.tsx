import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api.ts';
import { FiClock, FiUsers, FiImage, FiEye, FiEdit, FiTrash2 } from 'react-icons/fi';

// Define the shape of a Recipe so TypeScript knows what properties exist
interface Recipe {
  id: string | number;
  name: string;
  image?: string;
  category: string;
  cookingTime: number;
  servings: number;
}

const categories = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack'];

export default function RecipeGallery() {
  // Tell useState that this array will hold Recipe objects
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const navigate = useNavigate();

  // Wrap the fetch function in useCallback to stabilize it for useEffect
  const fetchRecipes = useCallback(async () => {
    try {
      const endpoint = categoryFilter ? `/recipes?category=${categoryFilter}` : '/recipes';
      const { data } = await api.get(endpoint);
      setRecipes(data);
    } catch (err) {
      console.error(err);
    }
  }, [categoryFilter]);

  // Safely include fetchRecipes in the dependency array
  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const deleteRecipe = async (id: string | number) => {
    if (window.confirm('Delete this recipe?')) {
      await api.delete(`/recipes/${id}`);
      fetchRecipes();
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
        <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
            Recipe Gallery
        </h2>

        <div className="flex gap-3 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-gray-200 bg-white/70 backdrop-blur px-4 py-2.5 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 outline-none text-sm"
          >
            <option value="">All</option>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>

          <button
            onClick={() => navigate('/add-recipe')}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl shadow-md transition text-sm font-medium"
          >
            + Add
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        
        {recipes.length === 0 && (
          <div className="col-span-full text-center py-20 border-2 border-dashed rounded-2xl bg-gray-50">
            <p className="text-gray-500 text-lg">No recipes yet 🍳</p>
          </div>
        )}

        {recipes.map(recipe => (
          <div
            key={recipe.id}
            className="group bg-white/70 backdrop-blur-lg border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 hover:-translate-y-1 flex flex-col"
          >

            {/* Image */}
            <div className="relative h-48 overflow-hidden">
              {recipe.image ? (
                <img
                  src={recipe.image}
                  alt={recipe.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-gray-100">
                  <FiImage size={30} />
                  <span>No Image</span>
                </div>
              )}

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

              {/* Category Badge */}
              <span className="absolute top-3 left-3 bg-white/90 text-gray-700 text-xs px-3 py-1 rounded-full shadow">
                {recipe.category}
              </span>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
              
              <h3 className="text-lg font-semibold text-gray-800 mb-3 line-clamp-1">
                {recipe.name}
              </h3>

              <div className="space-y-2 text-sm text-gray-600 mb-5">
                <p className="flex items-center gap-2">
                  <FiClock /> {recipe.cookingTime} mins
                </p>
                <p className="flex items-center gap-2">
                  <FiUsers /> {recipe.servings} servings
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-between gap-2 mt-auto">
                
                <button
                  onClick={() => navigate(`/recipes/${recipe.id}`)}
                  className="flex-1 flex items-center justify-center gap-1 bg-blue-50 text-blue-600 hover:bg-blue-100 py-2 rounded-lg text-sm transition"
                >
                  <FiEye /> View
                </button>

                <button
                  onClick={() => navigate(`/edit-recipe/${recipe.id}`)}
                  className="flex-1 flex items-center justify-center gap-1 bg-amber-50 text-amber-600 hover:bg-amber-100 py-2 rounded-lg text-sm transition"
                >
                  <FiEdit /> Edit
                </button>

                <button
                  onClick={() => deleteRecipe(recipe.id)}
                  className="flex-1 flex items-center justify-center gap-1 bg-red-50 text-red-600 hover:bg-red-100 py-2 rounded-lg text-sm transition"
                >
                  <FiTrash2 /> Delete
                </button>

              </div>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}