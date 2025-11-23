import { Request, Response } from 'express';
import * as taskService from '../services/tasks';
import { TaskFilters, TaskPriority, TaskStatus } from '../types/tasks';
import { ApiError } from '../types/errors';


function parseCsv(value?: string): string[] | undefined {
  if (!value) return undefined;
  return value.split(',').map(s => s.trim()).filter(Boolean);
}

export const getAllTasks = (req: Request<{}, {}, {}, Record<string, string | undefined>>, res: Response, next: Function) => {
  try {
    const { createdAt, status, priority, title } = req.query;
    const filters: TaskFilters = {};
    if (createdAt) filters.createdAt = createdAt;
    if (status) filters.status = parseCsv(status) as TaskStatus[];
    if (priority) filters.priority = parseCsv(priority) as TaskPriority[];
    if (title) filters.title = title;

    const result = taskService.getAllTasks(filters);
    res.json(result);
  } catch (err) {
    console.error(err);
    next(err)
  }
};

export const getTaskById = (req: Request<{ id: string }>, res: Response, next: Function) => {
  try {
    const idParam = req.params.id;
    if (!idParam) {
    return res.status(400).json({ message: "Missing task id" });
  }

    const task = taskService.getTaskById(idParam);
    if (!task) throw new ApiError('Task not found', 404);
    res.json(task);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const createTask = (req: Request, res: Response, next: Function) => {
  try {
      const data = req.body;
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

export const updateTask = (req: Request<{ id: string }>, res: Response, next: Function) => {
  try {
    const idParam = req.params.id;
    if (!idParam) {
    return res.status(400).json({ message: "Missing task id" });
  }
    const updated = taskService.updateTask(idParam, req.body);
    if (!updated) throw new ApiError('Task not found', 404);
    res.json(updated);
  } catch (err) {
    console.error(err);
    next(err)
  }
};

export const deleteTask = (req: Request<{ id: string }>, res: Response, next: Function) => {
  try {
    const idParam = req.params.id; 
  if (!idParam) {
    return res.status(400).json({ message: "Missing task id" });
  }
    const deleted = taskService.deleteTask(idParam);
    if (!deleted) throw new ApiError('Task not found', 404);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    next(err);
  }
};
