"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTodo = exports.updateTodo = exports.getAllTodo = exports.CreateToDo = void 0;
const uuid_1 = require("uuid");
const toDoModel_1 = require("../model/toDoModel");
const utils_1 = require("../utils/utils");
/**************** Create Todo ******************/
const CreateToDo = async (req, res) => {
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
        return res.status(201).json({
            todoRecord,
            msg: "You have successfully created a new ToDo",
        });
    }
    catch (error) {
        return res.status(500).json({
            Error: "Internal Server Error",
            route: "/todo/create"
        });
    }
};
exports.CreateToDo = CreateToDo;
/**************** Get All Todo ******************/
const getAllTodo = async (req, res) => {
    try {
        const limit = req.query?.limit;
        const offset = req.query?.offset;
        const getAllTodo = await toDoModel_1.ToDo.findAndCountAll({
            limit: limit,
            offset: offset
        });
        return res.status(200).json({
            getAllTodo,
            msg: "Displaying All Todo"
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ Error: "Internal Server Error", route: "/todo/getAllTodo" });
    }
};
exports.getAllTodo = getAllTodo;
/**************** Update Todo ******************/
const updateTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const { completed } = req.body;
        const validationResult = utils_1.updateTodoSchema.validate(req.body, utils_1.options);
        if (validationResult.error) {
            return res.status(400).json({ Error: validationResult.error.details[0].message });
        }
        const todo = await toDoModel_1.ToDo.findOne({ where: { id } });
        if (!todo) {
            return res.status(400).json({ Error: "todo has not been created." });
        }
        const updatefield = await todo.update({
            completed
        });
        return res.status(200).json({
            msg: "Updated Successfully",
            updatefield
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ Error: "Internal Server Error", route: "/todo/updateTodo" });
    }
};
exports.updateTodo = updateTodo;
/**************** Delete Todo ******************/
const deleteTodo = async (req, res) => {
    try {
        const id = req.params.id;
        const todo = await toDoModel_1.ToDo.findOne({ where: { id } });
        if (!todo) {
            return res.status(404).json({
                Error: "todo not found"
            });
        }
        const todoFound = await todo.destroy();
        return res.status(200).json({
            msg: "todo successfully deleted",
            todoFound
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ Error: "Internal Server Error", route: "/todo/deleteTodo" });
    }
};
exports.deleteTodo = deleteTodo;
