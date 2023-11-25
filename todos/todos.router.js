import express from "express";
import * as todosController from "./todos.controller.js";

export const todosRouter = express.Router();

todosRouter.get("/", todosController.getAllTodos);
todosRouter.post("/", todosController.createTodo);
todosRouter.delete("/:id", todosController.deleteTodoById);
