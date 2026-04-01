import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();
const dbName = process.env.DB_NAME || 'recipe_manager_db';
const dbUser = process.env.DB_USER || 'root';
const dbPasword = process.env.DB_PASSWORD || 'm115@224A';
const dbHost = process.env.DB_HOST || 'localhost';
 export const sequelize  = new Sequelize(
    dbName,
    dbPasword,
    dbHost,{
        host:dbHost,
        dialect:"mysql",
        logging:false
    }

 );
