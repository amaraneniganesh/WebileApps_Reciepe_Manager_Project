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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
const auth_1 = require("../middleware/auth");
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("../utils/cloudinary");
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
router.use(auth_1.verifyToken, auth_1.isSuperAdmin);
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.findAll({ where: { role: 'admin' }, attributes: ['id', 'name', 'email', 'role', 'isActive', 'image'] });
        res.json(users);
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
        const hashedPassword = yield bcryptjs_1.default.hash(req.body.password, 10);
        yield User_1.default.create({ name: req.body.name, email: req.body.email, password: hashedPassword, role: 'admin', image: imageUrl });
        res.status(201).json({ message: 'Admin created successfully' });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}));
router.put('/:id', upload.single('image'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // FIXED: Added "as string"
        const user = yield User_1.default.findByPk(req.params.id);
        if (!user) {
            res.status(404).json({ message: 'Admin not found.' });
            return;
        }
        let imageUrl = user.image;
        if (req.file)
            imageUrl = yield (0, cloudinary_1.uploadImage)(req.file.buffer, req.file.mimetype);
        else if (req.body.imageUrl !== undefined)
            imageUrl = req.body.imageUrl;
        yield user.update({ name: req.body.name, email: req.body.email, image: imageUrl });
        res.json({ message: 'Admin details updated successfully.' });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}));
router.patch('/:id/toggle', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // FIXED: Added "as string"
        const user = yield User_1.default.findByPk(req.params.id);
        if (user) {
            yield user.update({ isActive: !user.isActive });
            res.json({ message: 'Status toggled' });
        }
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 1. Safely convert the URL parameter to a number
        const userId = parseInt(req.params.id, 10);
        if (req.user.id === userId) {
            res.status(403).json({ message: "Cannot delete your own account." });
            return;
        }
        // 2. Pass the NUMBER to Sequelize, keeping TypeScript happy!
        const deleted = yield User_1.default.destroy({ where: { id: userId } });
        if (!deleted) {
            res.status(404).json({ message: 'Admin not found.' });
            return;
        }
        res.json({ message: 'Admin deleted successfully' });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}));
exports.default = router;
