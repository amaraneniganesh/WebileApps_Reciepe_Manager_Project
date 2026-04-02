import {Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional} from 'sequelize';
import {sequelize} from '../config/db';

class User extends Model<InferAttributes<User>,InferCreationAttributes<User>>{
    declare id: CreationOptional<number>;
    declare name:string;
    declare email:string;
    declare password:string;
    declare role:CreationOptional<'superamin' | 'admin'>;
    declare image:CreationOptional<string>;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

User.init({
    id:{type:DataTypes.INTEGER, autoIncrement:true, primaryKey:true},
    name: {type:DataTypes.STRING, allowNull:false},
    email:{type:DataTypes.STRING, allowNull:false,unique:true},
    password:{type:DataTypes.STRING, allowNull:false},
    role:{type:DataTypes.ENUM('superadmin','admin'), defaultValue:'admin'},
    image:{type:DataTypes.STRING, defaultValue:''},
    createdAt:{type:DataTypes.DATE, defaultValue:DataTypes.NOW},
    updatedAt:{type:DataTypes.DATE, defaultValue:DataTypes.NOW}
},{
    sequelize,
    tableName:'users',
})

export default User;