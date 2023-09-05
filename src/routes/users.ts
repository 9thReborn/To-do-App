import express from "express";
import { Register, Login, getAllUsersAndTodos, Logout } from "../controllers/userController";

const router = express.Router();

/********** base route = /users  ***************/
router.post("/register", Register );
router.post("/login", Login );
router.get("/get-user", getAllUsersAndTodos);
router.get("/logout", Logout);

export default router;
