"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
// Database & Utils
const db_1 = require("./config/db");
const seedSuperAdmin_1 = require("./utils/seedSuperAdmin");
// Routes
const auth_1 = __importDefault(require("./routes/auth"));
const recipes_1 = __importDefault(require("./routes/recipes"));
const users_1 = __importDefault(require("./routes/users"));
// Initialize environment variables
dotenv_1.default.config();
// Initialize Express application
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Register API Routes
app.use('/api/auth', auth_1.default);
app.use('/api/recipes', recipes_1.default);
app.use('/api/users', users_1.default);
const PORT = process.env.PORT || 5000;
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 1. Authenticate with MySQL (Assumes you created the DB in Workbench)
        yield db_1.sequelize.authenticate();
        console.log('✅ Database connection established successfully.');
        // 2. Sync all defined models to the DB (Creates tables if missing)
        yield db_1.sequelize.sync();
        console.log('✅ Database tables synced successfully.');
        // 3. Seed the initial SuperAdmin account from .env
        yield (0, seedSuperAdmin_1.seedSuperAdmin)();
        // 4. Start the Express Server
        app.listen(PORT, () => {
            console.log(`🚀 Server running in TypeScript on port ${PORT}`);
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1); // Stop the server completely if the database fails
    }
});
// Execute the startup function
startServer();
