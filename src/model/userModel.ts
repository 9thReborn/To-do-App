import { DataTypes, Model } from "sequelize";
import db from '../config/database.config'
import { ToDo } from "./toDoModel";

export interface UserAttributes{
    id: string;
    email: string;
    firstName: string;
    password: string;
}
export class User extends Model<UserAttributes> { }

User.init({
    id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    sequelize: db,
    tableName: 'users'
})

User.hasMany(ToDo, { foreignKey: 'userId', as: 'todo' })
ToDo.belongsTo(User, { foreignKey: 'userId', as: 'users' })