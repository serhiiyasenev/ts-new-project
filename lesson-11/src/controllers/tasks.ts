import { Request, Response } from 'express';
import { z } from 'zod';
import * as taskService from '../services/tasks';
import { TaskFilters } from '../types/tasks';

const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'done']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional()
});

const updateTaskSchema = createTaskSchema.partial();

const querySchema = z.object({
  createdAt: z.string().optional(),
  status: z.string().optional(), // CSV or single
  priority: z.string().optional() // CSV or single
});

function parseCsv(value?: string): string[] | undefined {
  if (!value) return undefined;
  return value.split(',').map(s => s.trim()).filter(Boolean);
}

export const getAllTasks = (req: Request, res: Response) => {
  try {
   router.get('/', validateQueryParams, getAllTasks);
    if (!parseResult.success) {
      return res.status(400).json({ message: 'Invalid query params', errors: parseResult.error.issues });
    }

    const { createdAt, status, priority } = parseResult.data;
    const filters: TaskFilters = {};
    if (createdAt) filters.createdAt = createdAt;
    if (status) filters.status = parseCsv(status) as any;
    if (priority) filters.priority = parseCsv(priority) as any;

    const result = taskService.getAllTasks(filters);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getTask = (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const task = taskService.getTaskById(id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const createTask = (req: Request, res: Response) => {
  try {
    const parseResult = createTaskSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ message: 'Invalid body', errors: parseResult.error.issues });
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
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateTask = (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const parseResult = updateTaskSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ message: 'Invalid body', errors: parseResult.error.issues });
    }

    const updated = taskService.updateTask(id, parseResult.data as any);
    if (!updated) return res.status(404).json({ message: 'Task not found' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deleteTask = (req: Request<{}, {}, {}, { id: string }>, res: Response) => {
  try {
    const id = req.params.id;
    const deleted = taskService.deleteTask(id);
    if (!deleted) return res.status(404).json({ message: 'Task not found' });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default {
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask
};
