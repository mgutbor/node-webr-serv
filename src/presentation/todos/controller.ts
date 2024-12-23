import { Request, Response } from "express";
import { prisma } from "../../data/postgres";
import { CreateTodoDto, UpdateTodoDto } from '../../domain/DTO';

//* HTTP response status codes: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status

// ? DTO (Data Transfer Object): used to transfer data between the server and the client
// ? +info: https://www.okta.com/identity-101/dto/

// ? Para gestionar gratis una BBDD postgres: 
// ? 1) https://neon.tech
// ? 2) https://railway.app
export class TodosController {
  constructor() {}

  public getTodos = async(req: Request, res: Response) => {
    const todo = await prisma.todo.findMany();
    res.json(todo);
  }

  public getTodoById = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (isNaN(Number(id))) {
      res.status(400).json({ error: 'Id must be a number' });
    }
    const todo = await prisma.todo.findUnique({
      where: { id: Number(id) },
    });

    (todo) 
      ? res.json(todo)
      : res.status(404).json({ error: `Todo with id(${ id }) not found` });
  }

  public createTodo = async (req: Request, res: Response) => {
    
    const [error, createTodoDto] = CreateTodoDto.create(req.body);

    if (error) {
      res.status(400).json({ error });
      return;
    }

    const todo = await prisma.todo.create({
      data: createTodoDto!
    });

    res.json(todo);
  }

  public updateTodo = async(req: Request, res: Response) => {
    const { id } = req.params;

    const [error, updateTodoDto] = UpdateTodoDto.create({...req.body, id});

    if (error) res.status(400).json({ error });

    const todo = await prisma.todo.findUnique({
      where: { id: Number(id) }
    })

    if (!todo) res.status(404).json({ error: `Todo with id(${ id }) not found` })
    

    const updatedTodo = await prisma.todo.update({
      where: { id: Number(id) },
      data: updateTodoDto!.values
    });

    res.json(updatedTodo);
  }

  public deleteTodo = async(req: Request, res: Response) => {
    const { id } = req.params;
    if (isNaN(Number(id))) {
      res.status(400).json({ error: 'Id must be a number' });
    }

    const todo = await prisma.todo.findUnique({
      where: { id: Number(id) }
    })

    
    if (!todo) res.status(404).json({ error: `Todo with id(${ id }) not found` });
    
    const deleted = await prisma.todo.delete({
      where: { id: Number(id) }
    });
    
    (deleted)
      ? res.json(deleted)
      : res.status(400).json({ error: `Todo with id(${ id }) not found` });
  }
}