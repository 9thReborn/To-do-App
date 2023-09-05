import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { ToDo } from "../model/toDoModel";
import { options, updateTodoSchema } from "../utils/utils";

/**************** Create Todo ******************/

export const CreateToDo = async (req: Request | any, res: Response) => {
  try {
    const verified = req.user;

    const id = uuidv4();

    const { description, completed } = req.body;

    const todoRecord = await ToDo.create({
      id,
      description,
      completed,
      userId: verified.id,
    });

    return res.status(201).json({
      todoRecord,
      msg: "You have successfully created a new ToDo",
    });
  } catch (error) {
    return res.status(500).json({
        Error: "Internal Server Error",
        route: "/todo/create"
    });
  }
};

/**************** Get All Todo ******************/


export const getAllTodo = async (req: Request, res: Response) => {
    try {

        const limit = req.query?.limit as number | undefined;
        const offset = req.query?.offset as number | undefined;

        const getAllTodo = await ToDo.findAndCountAll({
            limit: limit,
            offset: offset
        });
        return res.status(200).json({
            getAllTodo,
            msg: "Displaying All Todo"
        });
  } catch (error) {
    console.log(error);
    res.status(500).json({ Error: "Internal Server Error", route: "/todo/getAllTodo" });
  }
};

/**************** Update Todo ******************/

export const updateTodo = async(req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { completed } = req.body;

        const validationResult = updateTodoSchema.validate(req.body, options)

        if (validationResult.error) {
            return res.status(400).json({ Error: validationResult.error.details[0].message })
        }

        const todo = await ToDo.findOne({ where: { id } })
        
        if (!todo) {
            return res.status(400).json({ Error: "todo has not been created." })
        }

        const updatefield = await todo.update({
            completed
        })
        return res.status(200).json({
            msg: "Updated Successfully",
            updatefield
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ Error: "Internal Server Error", route : "/todo/updateTodo" });
    }
}

/**************** Delete Todo ******************/

export const deleteTodo = async (req:Request, res:Response) => {
    try {
        const id = req.params.id;
        const todo = await ToDo.findOne({ where: { id } });
        if (!todo) {
            return res.status(404).json({
                Error: "todo not found"
            })
        }
        const todoFound = await todo.destroy();

        return res.status(200).json({
            msg: "todo successfully deleted",
            todoFound
        })
    
} catch (error) {
    console.log(error);
    return res.status(500).json({ Error: "Internal Server Error", route: "/todo/deleteTodo" });
}
}