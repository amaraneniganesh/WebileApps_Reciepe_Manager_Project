import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { sequelize } from '../config/db';

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: CreationOptional<number>;
    declare name: string;
    declare email: string;
    declare password: string;
    declare role: CreationOptional<'superadmin' | 'admin'>;
    declare isActive: CreationOptional<boolean>;
    declare image: CreationOptional<string>;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

User.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('superadmin', 'admin'), defaultValue: 'admin' },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    image: { type: DataTypes.STRING(1000), defaultValue: 'https://www.deccanchronicle.com/h-upload/2025/11/15/1978625-mahesh-babu.webp' },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
}, { sequelize, tableName: 'users' });

export default User;
