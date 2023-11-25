import * as todosModel from "./todos.model.js";

export async function getAllTodos(_req, res) {
  const todos = await todosModel.getAllTodos();

  res.status(200).json({
    success: true,
    payload: todos,
  });
}

export async function createTodo(req, res) {
  const somethingIsMissing =
    req.body.task === undefined || req.body.completionDate === undefined;

  if (somethingIsMissing) {
    res.status(400).json({
      success: false,
      error: "Please provide a 'task' and 'completionDate'",
    });
    return;
  }

  const created = await todosModel.createTodo({
    task: req.body.task,
    completionDate: req.body.completionDate,
  });

  res.status(201).json({
    success: true,
    payload: created,
  });
}

export async function deleteTodoById(req, res) {
  const todoId = req.params.id;
  const deleted = await todosModel.deleteTodoById(todoId);

  if (!deleted) {
    res.status(404).json({
      success: false,
      error: `No todo with id ${todoId} found`,
    });
    return;
  }

  res.status(200).json({
    success: true,
    payload: deleted,
  });
}
