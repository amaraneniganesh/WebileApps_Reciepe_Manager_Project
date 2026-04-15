import {Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional} from 'sequelize';
import {sequelize} from '../config/db'

class Recipe extends Model<InferAttributes<Recipe>, InferCreationAttributes<Recipe>>{
    declare id: CreationOptional<number>;
    declare name:string;
    declare category:string;
    declare ingredients:string[];
    declare instructions:string;
    declare cookingTime:number;
    declare servings:number;
    declare image:CreationOptional<string>;
    declare adminId: number;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

Recipe.init({
    id:{
        type:DataTypes.INTEGER, autoIncrement:true, primaryKey:true
    },
    name:{
        type:DataTypes.STRING, allowNull:false
    },
    category:{
        type:DataTypes.STRING, allowNull:false
    },
    ingredients:{
        type:DataTypes.JSON, allowNull:false
    },
    instructions:{
        type:DataTypes.TEXT, allowNull:false
    },
    cookingTime:{
        type:DataTypes.INTEGER, allowNull:false
    },
    servings:{
        type:DataTypes.INTEGER, allowNull:false
    },
    image:{
        type:DataTypes.STRING, defaultValue:''
    },
    adminId:{
        type:DataTypes.INTEGER, allowNull:false,references:{model: 'users', key:'id'}
    },
    createdAt:{
        type:DataTypes.DATE, defaultValue:DataTypes.NOW
    },
    updatedAt:{
        type:DataTypes.DATE, defaultValue:DataTypes.NOW
    }
},{
    sequelize,
    tableName:'recipes'
})

export default Recipe;
