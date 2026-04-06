import express, { Response } from 'express';
import Recipe from '../models/Recipe';
import { verifyToken } from '../middleware/auth';
import multer from 'multer';
import { uploadImage } from '../utils/cloudinary';
import { AuthRequest } from '../types/express';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(verifyToken);

router.get('/', async (req: AuthRequest, res: Response) => {
    try {
        const whereClause = req.query.category ? { category: req.query.category as string } : {};
        const recipes = await Recipe.findAll({ where: whereClause });
        res.json(recipes);
    } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.post('/', upload.single('image'), async (req: AuthRequest, res: Response) => {
    try {
        let imageUrl = req.body.imageUrl || '';
        if (req.file) imageUrl = await uploadImage(req.file.buffer, req.file.mimetype);

        let ingredients = typeof req.body.ingredients === 'string' ? JSON.parse(req.body.ingredients) : req.body.ingredients;

        const recipe = await Recipe.create({
            name: req.body.name, category: req.body.category, ingredients, instructions: req.body.instructions,
            cookingTime: Number(req.body.cookingTime), servings: Number(req.body.servings), image: imageUrl
        });
        res.status(201).json({ id: recipe.id, message: 'Recipe created', image: imageUrl });
    } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // FIXED: Added "as string"
        const recipe = await Recipe.findByPk(req.params.id as string);
        if (!recipe) { res.status(404).json({ message: 'Recipe not found' }); return; }
        res.json(recipe);
    } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', upload.single('image'), async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // FIXED: Added "as string"
        const recipe = await Recipe.findByPk(req.params.id as string);
        if (!recipe) { res.status(404).json({ message: 'Recipe not found' }); return; }

        let imageUrl = recipe.image;
        if (req.file) imageUrl = await uploadImage(req.file.buffer, req.file.mimetype);
        else if (req.body.imageUrl !== undefined) imageUrl = req.body.imageUrl;

        let ingredients = typeof req.body.ingredients === 'string' ? JSON.parse(req.body.ingredients) : req.body.ingredients;

        await recipe.update({
            name: req.body.name, category: req.body.category, ingredients, instructions: req.body.instructions,
            cookingTime: Number(req.body.cookingTime), servings: Number(req.body.servings), image: imageUrl
        });
        res.json({ message: 'Recipe updated successfully' });
    } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // FIXED: Added "as string"
        const deleted = await Recipe.destroy({ where: { id: req.params.id as string } });
        if (!deleted) { res.status(404).json({ message: 'Recipe not found' }); return; }
        res.json({ message: 'Recipe deleted' });
    } catch (err: any) { res.status(500).json({ error: err.message }); }
});

export default router;