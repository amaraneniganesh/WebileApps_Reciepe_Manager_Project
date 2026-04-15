import express, { Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import { verifyToken, isSuperAdmin } from '../middleware/auth';
import multer from 'multer';
import { uploadImage } from '../utils/cloudinary';
import { AuthRequest } from '../types/express';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(verifyToken, isSuperAdmin); 

router.get('/', async (req: AuthRequest, res: Response) => {
    try {
        const users = await User.findAll({ where: { role: 'admin' }, attributes: ['id', 'name', 'email', 'role', 'isActive', 'image'] });
        res.json(users);
    } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.post('/', upload.single('image'), async (req: AuthRequest, res: Response) => {
    try {
        let imageUrl = req.body.imageUrl || '';
        if (req.file) imageUrl = await uploadImage(req.file.buffer, req.file.mimetype);

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        await User.create({ name: req.body.name, email: req.body.email, password: hashedPassword, role: 'admin', image: imageUrl });
        res.status(201).json({ message: 'Admin created successfully' });
    } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', upload.single('image'), async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // FIXED: Added "as string"
        const user = await User.findByPk(req.params.id as string);
        if (!user) { res.status(404).json({ message: 'Admin not found.' }); return; }

        let imageUrl = user.image;
        if (req.file) imageUrl = await uploadImage(req.file.buffer, req.file.mimetype);
        else if (req.body.imageUrl !== undefined) imageUrl = req.body.imageUrl;

        await user.update({ name: req.body.name, email: req.body.email, image: imageUrl });
        res.json({ message: 'Admin details updated successfully.' });
    } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.patch('/:id/toggle', async (req: AuthRequest, res: Response) => {
    try {
        // FIXED: Added "as string"
        const user = await User.findByPk(req.params.id as string);
        if (user) { await user.update({ isActive: !user.isActive }); res.json({ message: 'Status toggled' }); }
    } catch (err: any) { res.status(500).json({ error: err.message }); }
    
});

router.delete('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // 1. Safely convert the URL parameter to a number
        const userId = parseInt(req.params.id as string, 10);

        if (req.user!.id === userId) { 
            res.status(403).json({ message: "Cannot delete your own account." }); 
            return; 
        }
        
        // 2. Pass the NUMBER to Sequelize, keeping TypeScript happy!
        const deleted = await User.destroy({ where: { id: userId } });
        
        if (!deleted) { 
            res.status(404).json({ message: 'Admin not found.' }); 
            return; 
        }
        
        res.json({ message: 'Admin deleted successfully' });
    } catch (err: any) { 
        res.status(500).json({ error: err.message }); 
    }
});

export default router;