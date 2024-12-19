import { Request, Response } from "express";

const todos = [
  { id: 1, text: 'Todo 1', createdAt: new Date() },
  { id: 2, text: 'Todo 2', createdAt: new Date() },
  { id: 3, text: 'Todo 3', createdAt: new Date() },
];

//* HTTP response status codes: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
export class TodosController {
  constructor() {}

  public getTodos = (req: Request, res: Response) => {
    res.json(todos)
  }

  public getTodoById = (req: Request, res: Response) => {
    const { id } = req.params;
    if (isNaN(Number(id))) {
      res.status(400).json({ error: 'Id must be a number' });
    }
    const todo = todos.find(t => t.id === Number(id));

    (todo) 
      ? res.json(todo)
      : res.status(404).json({ error: `Todo with id(${ id }) not found` });
  }

  public createTodo = (req: Request, res: Response) => {
    const {text} = req.body;

    if(!text) {
      res.status(400).json({ error: 'Text is required' });
    }

    const todo = {
      id: todos.length + 1,
      text,
      createdAt: new Date()
    }

    todos.push(todo); 
    res.json(todos);
  }

  public updateTodo = (req: Request, res: Response) => {
    const { id } = req.params;
    const { text, createdAt } = req.body;

    if (isNaN(Number(id))) {
      res.status(400).json({ error: 'Id must be a number' });
    }

    const todoIndex = todos.findIndex(t => t.id === Number(id));
    const todo = todos[todoIndex];

    if (!todo) {
      res.status(404).json({ error: `Todo with id(${ id }) not found` });
    } else {
      todo.text = text || todo.text;
      todo.createdAt = new Date(createdAt || todo.createdAt);
      res.json(todos);
    }
  }

  public deleteTodo = (req: Request, res: Response) => {
    const { id } = req.params;
    if (isNaN(Number(id))) {
      res.status(400).json({ error: 'Id must be a number' });
    }
    const todoIndex = todos.findIndex(t => t.id === Number(id));
    if (todoIndex === -1) {
      res.status(404).json({ error: `Todo with id(${ id }) not found` });
    } else {
      todos.splice(todoIndex, 1);
      res.json(todos);
    }
  }
}