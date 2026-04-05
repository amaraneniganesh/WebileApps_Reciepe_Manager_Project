import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../types/express';

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) { res.status(401).json({ message: 'Access denied.' }); return; }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number, role: string };
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

export const isSuperAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (req.user?.role !== 'superadmin') { res.status(403).json({ message: 'SuperAdmin only.' }); return; }
    next();
};