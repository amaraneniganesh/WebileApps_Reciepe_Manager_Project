import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();
const dbName = process.env.DB_NAME || '';
const dbUser = process.env.DB_USER || '';
const dbPasword = process.env.DB_PASSWORD || '';
const dbHost = process.env.DB_HOST || '';
 export const sequelize  = new Sequelize(
    dbName,
    dbPasword,
    dbHost,{
        host:dbHost,
        dialect:"mysql",
        logging:false
    }

 );
