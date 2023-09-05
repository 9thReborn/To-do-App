import express from "express";
import { CreateToDo, getAllTodo, updateTodo, deleteTodo } from "../controllers/toDoController";
import { auth } from "../middleware/auth";
const router = express.Router();

/********** base route = /todo  ***************/

router.post("/create",auth, CreateToDo);
router.get("/getAllTodo",auth, getAllTodo);
router.patch("/updateTodo/:id",auth, updateTodo);
router.delete("/deleteTodo/:id", auth, deleteTodo);

export default router;
