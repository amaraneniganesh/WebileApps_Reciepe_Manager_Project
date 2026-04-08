"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../config/db");
class User extends sequelize_1.Model {
}
User.init({
    id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    email: { type: sequelize_1.DataTypes.STRING, allowNull: false, unique: true },
    password: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    role: { type: sequelize_1.DataTypes.ENUM('superadmin', 'admin'), defaultValue: 'admin' },
    isActive: { type: sequelize_1.DataTypes.BOOLEAN, defaultValue: true },
    image: { type: sequelize_1.DataTypes.STRING(1000), defaultValue: '' },
    createdAt: sequelize_1.DataTypes.DATE,
    updatedAt: sequelize_1.DataTypes.DATE,
}, { sequelize: db_1.sequelize, tableName: 'users' });
exports.default = User;
