"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const toDoModel_1 = require("../model/toDoModel");
const uuid_1 = require("uuid");
const userModel_1 = require("../model/userModel");
const router = express_1.default.Router();
router.get("/", (req, res) => {
    res.render("register");
});
router.get("/dashboard", auth_1.auth, async (req, res) => {
    try {
        const { id } = req.user;
        const { todo } = (await userModel_1.User.findOne({
            where: { id },
            include: { model: toDoModel_1.ToDo, as: "todo" },
        }));
        return res.render("home", { todolist: todo });
    }
    catch (error) {
        console.log(error);
    }
});
router.get("/login", (req, res) => {
    res.render("login");
});
router.post("/dashboard", auth_1.auth, async (req, res) => {
    try {
        const verified = req.user;
        const id = (0, uuid_1.v4)();
        const { description, completed } = req.body;
        const todoRecord = await toDoModel_1.ToDo.create({
            id,
            description,
            completed,
            userId: verified.id,
        });
        return res.redirect("/dashboard");
    }
    catch (error) {
        return res.status(500).json({
            Error: "Internal Server Error",
            route: "/todo/create",
        });
    }
});
router.get('/dashboard/:id', auth_1.auth, async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await toDoModel_1.ToDo.findOne({ where: { id } });
        if (!todo) {
            return res.render("home", { error: "todo not found" });
        }
        await todo.destroy();
        return res.redirect('/dashboard');
    }
    catch (error) {
        console.log(error);
    }
});
exports.default = router;
