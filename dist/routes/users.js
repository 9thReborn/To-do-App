"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
/********** base route = /users  ***************/
router.post("/register", userController_1.Register);
router.post("/login", userController_1.Login);
router.get("/get-user", userController_1.getAllUsersAndTodos);
router.get("/logout", userController_1.Logout);
exports.default = router;
