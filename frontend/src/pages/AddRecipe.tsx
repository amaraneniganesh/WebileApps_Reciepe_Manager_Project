import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api.ts';
import { FiUploadCloud } from 'react-icons/fi';

const AddRecipe: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '', category: 'Breakfast', ingredients: '', instructions: '', cookingTime: '', servings: '', imageUrl: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setFormData({ ...formData, imageUrl: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const ingredientsArray = formData.ingredients.split(',').map(item => item.trim()).filter(Boolean);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('category', formData.category);
    data.append('instructions', formData.instructions);
    data.append('cookingTime', formData.cookingTime);
    data.append('servings', formData.servings);
    data.append('ingredients', JSON.stringify(ingredientsArray));

    if (imageFile) data.append('image', imageFile);
    else data.append('imageUrl', formData.imageUrl);

    try {
      await api.post('/recipes', data);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add recipe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Recipe</h1>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Recipe Name</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                {['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ingredients (comma separated)</label>
            <textarea name="ingredients" required rows={3} value={formData.ingredients} onChange={handleChange} placeholder="e.g. 2 eggs, 1 cup flour, milk" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none resize-none"></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
            <textarea name="instructions" required rows={5} value={formData.instructions} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none resize-none"></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cooking Time (mins)</label>
              <input type="number" name="cookingTime" required min="1" value={formData.cookingTime} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Servings</label>
              <input type="number" name="servings" required min="1" value={formData.servings} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>

          {/* Image Area */}
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 bg-gray-50 text-center">
            <label className="block text-sm font-bold text-gray-700 mb-4">Recipe Image</label>
            <label className="cursor-pointer inline-flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 transition">
              <FiUploadCloud size={20} /> Upload File
              <input type="file" hidden accept="image/*" onChange={handleFileChange} />
            </label>
            {imageFile && <p className="text-sm text-green-600 mt-2 font-medium">{imageFile.name}</p>}

            <p className="text-gray-400 text-sm my-3 font-medium">OR</p>

            <input type="text" name="imageUrl" placeholder="Paste Image URL" value={formData.imageUrl} onChange={handleChange} disabled={!!imageFile} className="w-full max-w-md mx-auto border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none block text-sm" />
          </div>

          <div className="flex gap-4 pt-4">
            <button type="submit" disabled={loading} className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-8 rounded-lg transition disabled:opacity-50">
              {loading ? 'Saving...' : 'Save Recipe'}
            </button>
            <button type="button" onClick={() => navigate('/')} className="flex-1 sm:flex-none bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-8 rounded-lg transition">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRecipe;