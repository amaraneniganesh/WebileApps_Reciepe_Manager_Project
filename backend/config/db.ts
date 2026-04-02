import {Sequelize} from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const dbName = process.env.DB_NAME || "recipe_manager_db";
const dbUser = process.env.DB_USER || "root";
const dbPassword = process.env.DB_PASSWORD || "1234";
const dbHost = process.env.DB_HOST || "localhost";

export const sequelize = new Sequelize(dbName,dbUser, dbPassword,{host:dbHost, dialect:"mysql",logging: false});