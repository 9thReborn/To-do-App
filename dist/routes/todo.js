"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const toDoController_1 = require("../controllers/toDoController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
/********** base route = /todo  ***************/
router.post("/create", auth_1.auth, toDoController_1.CreateToDo);
router.get("/getAllTodo", auth_1.auth, toDoController_1.getAllTodo);
router.patch("/updateTodo/:id", auth_1.auth, toDoController_1.updateTodo);
router.delete("/deleteTodo/:id", auth_1.auth, toDoController_1.deleteTodo);
exports.default = router;
