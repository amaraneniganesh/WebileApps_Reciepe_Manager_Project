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
const Recipe_1 = __importDefault(require("../models/Recipe"));
const auth_1 = require("../middleware/auth");
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("../utils/cloudinary");
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
router.use(auth_1.verifyToken);
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const whereClause = req.query.category ? { category: req.query.category } : {};
        const recipes = yield Recipe_1.default.findAll({ where: whereClause });
        res.json(recipes);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}));
router.post('/', upload.single('image'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let imageUrl = req.body.imageUrl || '';
        if (req.file)
            imageUrl = yield (0, cloudinary_1.uploadImage)(req.file.buffer, req.file.mimetype);
        let ingredients = typeof req.body.ingredients === 'string' ? JSON.parse(req.body.ingredients) : req.body.ingredients;
        const recipe = yield Recipe_1.default.create({
            name: req.body.name, category: req.body.category, ingredients, instructions: req.body.instructions,
            cookingTime: Number(req.body.cookingTime), servings: Number(req.body.servings), image: imageUrl
        });
        res.status(201).json({ id: recipe.id, message: 'Recipe created', image: imageUrl });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // FIXED: Added "as string"
        const recipe = yield Recipe_1.default.findByPk(req.params.id);
        if (!recipe) {
            res.status(404).json({ message: 'Recipe not found' });
            return;
        }
        res.json(recipe);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}));
router.put('/:id', upload.single('image'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // FIXED: Added "as string"
        const recipe = yield Recipe_1.default.findByPk(req.params.id);
        if (!recipe) {
            res.status(404).json({ message: 'Recipe not found' });
            return;
        }
        let imageUrl = recipe.image;
        if (req.file)
            imageUrl = yield (0, cloudinary_1.uploadImage)(req.file.buffer, req.file.mimetype);
        else if (req.body.imageUrl !== undefined)
            imageUrl = req.body.imageUrl;
        let ingredients = typeof req.body.ingredients === 'string' ? JSON.parse(req.body.ingredients) : req.body.ingredients;
        yield recipe.update({
            name: req.body.name, category: req.body.category, ingredients, instructions: req.body.instructions,
            cookingTime: Number(req.body.cookingTime), servings: Number(req.body.servings), image: imageUrl
        });
        res.json({ message: 'Recipe updated successfully' });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // FIXED: Added "as string"
        const deleted = yield Recipe_1.default.destroy({ where: { id: req.params.id } });
        if (!deleted) {
            res.status(404).json({ message: 'Recipe not found' });
            return;
        }
        res.json({ message: 'Recipe deleted' });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}));
exports.default = router;
