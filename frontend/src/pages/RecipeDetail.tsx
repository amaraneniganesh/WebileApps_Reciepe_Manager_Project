import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api.ts';
import { Recipe } from '../types';
import { FiFolder, FiClock, FiUsers, FiEdit2, FiImage, FiArrowLeft } from 'react-icons/fi';

const RecipeDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const res = await api.get<Recipe>(`/recipes/${id}`);
                setRecipe(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchRecipe();
    }, [id]);

    if (loading) return <div className="text-center mt-20 text-gray-500">Loading recipe...</div>;
    if (!recipe) return <div className="text-center mt-20 text-red-500">Recipe not found.</div>;

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            {/* Header Actions */}
            <div className="flex justify-between items-center mb-6">
                <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition font-medium">
                    <FiArrowLeft /> Back to Gallery
                </button>
                <button onClick={() => navigate(`/edit-recipe/${recipe.id}`)} className="flex items-center gap-2 bg-yellow-50 text-yellow-600 hover:bg-yellow-100 px-4 py-2 rounded-lg font-medium transition">
                    <FiEdit2 /> Edit Recipe
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Image Section */}
                {recipe.image ? (
                    <img src={recipe.image} alt={recipe.name} className="w-full h-64 sm:h-96 object-cover" />
                ) : (
                    <div className="w-full h-64 sm:h-96 bg-gray-100 flex flex-col items-center justify-center text-gray-400">
                        <FiImage size={60} className="mb-4" />
                        <span>No Image Available</span>
                    </div>
                )}

                {/* Content Section */}
                <div className="p-6 sm:p-10">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">{recipe.name}</h1>

                    {/* Meta Tags */}
                    <div className="flex flex-wrap gap-4 mb-8">
                        <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-semibold">
                            <FiFolder /> {recipe.category}
                        </span>
                        <span className="inline-flex items-center gap-2 bg-orange-50 text-orange-700 px-3 py-1.5 rounded-full text-sm font-semibold">
                            <FiClock /> {recipe.cookingTime} mins
                        </span>
                        <span className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm font-semibold">
                            <FiUsers /> {recipe.servings} servings
                        </span>
                    </div>

                    <hr className="border-gray-100 mb-8" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {/* Ingredients */}
                        <div className="md:col-span-1">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Ingredients</h2>
                            <ul className="bg-gray-50 rounded-xl p-5 space-y-3">
                                {recipe.ingredients.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-gray-700">
                                        <span className="text-blue-500 mt-1">•</span> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Instructions */}
                        <div className="md:col-span-2">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Instructions</h2>
                            <div className="bg-gray-50 rounded-xl p-6">
                                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                    {recipe.instructions}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipeDetail;