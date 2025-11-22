import { Request, Response } from 'express';
import * as taskService from '../services/tasks';
import { TaskFilters, TaskPriority, TaskStatus } from '../types/tasks';
import { ApiError } from '../types/errors';
import { createTaskSchema, queryTasksSchema } from '../schemas/tasks';


function parseCsv(value?: string): string[] | undefined {
  if (!value) return undefined;
  return value.split(',').map(s => s.trim()).filter(Boolean);
}

export const getAllTasks = (req: Request, res: Response, next: Function) => {
  try {
    const parseResult = queryTasksSchema.safeParse(req.query);
    if (!parseResult.success) {
      return res.status(400).json({ message: 'Invalid query params', errors: parseResult.error.issues });
    }

    const { createdAt, status, priority } = parseResult.data;
    const filters: TaskFilters = {};
    if (createdAt) filters.createdAt = createdAt;
    if (status) filters.status = parseCsv(status) as TaskStatus[];
    if (priority) filters.priority = parseCsv(priority) as TaskPriority[];

    const result = taskService.getAllTasks(filters);
    res.json(result);
  } catch (err) {
    console.error(err);
   next(err)
  }
};

export const getTask = (req: Request<{ id: string }>, res: Response, next: Function) => {
  try {
    const id = req.params.id;
    const task = taskService.getTaskById(id);
    if (!task) throw new ApiError('Task not found', 404);
    res.json(task);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const createTask = (req: Request, res: Response, next: Function) => {
  try {
    const parseResult = createTaskSchema.safeParse(req.body);
    if (!parseResult.success) {
     throw new ApiError(parseResult.error.message, 400);
    }

    const data = parseResult.data;
    // provide defaults
    const task = taskService.createTask({
      title: data.title,
      description: data.description ?? '',
      status: data.status ?? 'todo',
      priority: data.priority ?? 'medium'
    });
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
   next(err)
  }
};

export const updateTask = (req: Request, res: Response, next: Function) => {
  try {
    const id = req.params.id as string;
    const parseResult = createTaskSchema.partial().safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ message: 'Invalid body', errors: parseResult.error.issues });
    }

    const updated = taskService.updateTask(id, parseResult.data);
    if (!updated) return res.status(404).json({ message: 'Task not found' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    next(err)
  }
};

export const deleteTask = (req: Request<{ id: string }>, res: Response, next: Function) => {
  try {
    const id = req.params.id;
    const deleted = taskService.deleteTask(id);
    if (!deleted) return res.status(404).json({ message: 'Task not found' });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export default {
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask
};
