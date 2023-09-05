import { DataTypes, Model } from "sequelize";
import db from "../config/database.config";

export interface ToDoAttributes {
  id: string;
  description: string;
    completed: boolean;
    userId: string
}
export class ToDo extends Model<ToDoAttributes> {}

ToDo.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      
    },
    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    tableName: "todo",
  }
);
