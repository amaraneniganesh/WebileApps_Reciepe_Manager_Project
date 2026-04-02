import bcrypt from 'bcryptjs';
import User from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

export const seedSuperAdmin = async () => {
    try {
        const existingSuperAdmin = await User.findOne({ where: { role: 'superadmin' } });
        if (existingSuperAdmin) return; 

        if (!process.env.SUPERADMIN_EMAIL || !process.env.SUPERADMIN_PASSWORD) {
            console.log('Missing SuperAdmin credentials in .env. Skipping.');
            return;
        }

        const hashedPassword = await bcrypt.hash(process.env.SUPERADMIN_PASSWORD, 10);
        
        await User.create({
            name: process.env.SUPERADMIN_NAME || 'Super Admin',
            email: process.env.SUPERADMIN_EMAIL,
            password: hashedPassword,
            role: 'superadmin',
            isActive: true,
            image: ''
        });
        console.log('SuperAdmin account successfully created from .env.');
    } catch (error: any) {
        console.error('Error creating SuperAdmin:', error.message);
    }
};