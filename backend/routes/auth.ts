import express, { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { verifyToken } from '../middleware/auth';
import { AuthRequest } from '../types/express';

const router = express.Router();

router.post('/login', async (req, res: Response): Promise<void> => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) { res.status(404).json({ message: 'User not found' }); return; }
        if (!user.isActive) { res.status(403).json({ message: 'Account is deactivated' }); return; }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) { res.status(400).json({ message: 'Invalid credentials' }); return; }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '1d' });
        res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
    } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.get('/me', verifyToken, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = await User.findByPk(req.user!.id, {
            attributes: ['id', 'name', 'email', 'role', 'isActive', 'image', 'createdAt']
        });
        res.json(user);
    } catch (err: any) { res.status(500).json({ error: err.message }); }
});

export default router;