export interface User {
    id: number;
    name: string;
    email: string;
    role: 'superadmin' | 'admin';
    isActive: boolean;
    image: string;
}

export interface Recipe {
    id: number;
    name: string;
    category: string;
    ingredients: string[];
    instructions: string;
    cookingTime: number;
    servings: number;
    image: string;
}