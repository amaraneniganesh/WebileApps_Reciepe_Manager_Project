"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../config/db");
class Recipe extends sequelize_1.Model {
}
Recipe.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING, allowNull: false
    },
    category: {
        type: sequelize_1.DataTypes.STRING, allowNull: false
    },
    ingredients: {
        type: sequelize_1.DataTypes.JSON, allowNull: false
    },
    instructions: {
        type: sequelize_1.DataTypes.TEXT, allowNull: false
    },
    cookingTime: {
        type: sequelize_1.DataTypes.INTEGER, allowNull: false
    },
    servings: {
        type: sequelize_1.DataTypes.INTEGER, allowNull: false
    },
    image: {
        type: sequelize_1.DataTypes.STRING, defaultValue: ''
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE, defaultValue: sequelize_1.DataTypes.NOW
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE, defaultValue: sequelize_1.DataTypes.NOW
    }
}, {
    sequelize: db_1.sequelize,
    tableName: 'recipes'
});
exports.default = Recipe;
