import express, { Request, Response, NextFunction } from "express";
import { auth } from "../middleware/auth";
import { ToDo } from "../model/toDoModel";
import { v4 as uuidv4 } from "uuid";
import { User } from "../model/userModel";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.render("register");
});

router.get("/dashboard", auth, async (req: Request | any, res: Response) => {
  try {
    const { id } = req.user;
    const { todo } = (await User.findOne({
      where: { id },
      include: { model: ToDo, as: "todo" },
    })) as unknown as any;

    return res.render("home", { todolist: todo });
  } catch (error) {
    console.log(error);
  }
});


router.get("/login", (req: Request, res: Response) => {
  res.render("login");
});

router.post("/dashboard", auth, async (req: Request | any, res: Response) => {
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

    return res.redirect("/dashboard");
  } catch (error) {
    return res.status(500).json({
      Error: "Internal Server Error",
      route: "/todo/create",
    });
  }
});

router.get('/dashboard/:id', auth,async (req:Request, res:Response) => {
  try {
    const { id } = req.params;
    const todo = await ToDo.findOne({ where: { id } });
    if (!todo) {
      return res.render("home", { error: "todo not found" });
    }

    await todo.destroy();

   return res.redirect('/dashboard')

  } catch (error) {
    console.log(error);
  }
})


export default router;
