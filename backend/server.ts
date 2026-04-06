import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Database & Utils
import { sequelize } from './config/db';
import { seedSuperAdmin } from './utils/seedSuperAdmin';

// Routes
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
        // 1. Authenticate with MySQL (Assumes you created the DB in Workbench)
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully.');

        // 2. Sync all defined models to the DB (Creates tables if missing)
        await sequelize.sync();
        console.log('✅ Database tables synced successfully.');

        // 3. Seed the initial SuperAdmin account from .env
        await seedSuperAdmin();

        // 4. Start the Express Server
        app.listen(PORT, () => {
            console.log(`🚀 Server running in TypeScript on port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1); // Stop the server completely if the database fails
    }
};

// Execute the startup function
startServer();