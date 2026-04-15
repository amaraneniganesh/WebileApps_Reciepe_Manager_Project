import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// 1. Import Database & Models FIRST
import { sequelize } from './config/db';
import User from './models/User';
import Recipe from './models/Recipe';

// 2. DEFINE ASSOCIATIONS GLOBALLY (This fixes your error!)
User.hasMany(Recipe, { foreignKey: 'adminId', as: 'recipes' });
Recipe.belongsTo(User, { foreignKey: 'adminId', as: 'admin' });

// 3. Import Utils & Routes AFTER associations are made
import { seedSuperAdmin } from './utils/seedSuperAdmin';
import authRoutes from './routes/auth';
import recipeRoutes from './routes/recipes';
import userRoutes from './routes/users';

// Initialize environment variables
dotenv.config();

// Initialize Express application
const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());

// Register API Routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully.');

        // Use { alter: true } so Sequelize syncs the new adminId column
        await sequelize.sync({ alter: true });
        console.log('✅ Database tables synced successfully.');

        await seedSuperAdmin();

        app.listen(PORT, () => {
            console.log(`🚀 Server running in TypeScript on port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1); 
    }
};

startServer();