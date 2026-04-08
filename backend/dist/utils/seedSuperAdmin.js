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
exports.seedSuperAdmin = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const seedSuperAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingSuperAdmin = yield User_1.default.findOne({ where: { role: 'superadmin' } });
        if (existingSuperAdmin)
            return;
        if (!process.env.SUPERADMIN_EMAIL || !process.env.SUPERADMIN_PASSWORD) {
            console.log('Missing SuperAdmin credentials in .env. Skipping.');
            return;
        }
        const hashedPassword = yield bcryptjs_1.default.hash(process.env.SUPERADMIN_PASSWORD, 10);
        yield User_1.default.create({
            name: process.env.SUPERADMIN_NAME || 'Super Admin',
            email: process.env.SUPERADMIN_EMAIL,
            password: hashedPassword,
            role: 'superadmin',
            isActive: true,
            image: ''
        });
        console.log('SuperAdmin account successfully created from .env.');
    }
    catch (error) {
        console.error('Error creating SuperAdmin:', error.message);
    }
});
exports.seedSuperAdmin = seedSuperAdmin;
