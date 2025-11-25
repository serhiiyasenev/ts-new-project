import { NextFunction, Request, Response } from "express";
import * as taskService from "../services/tasks";
import { TaskFilters, TaskStatus, TaskPriority } from "../schemas/tasks";
import { parseCsv } from "../helpers/helpers";

export const getAllTasks = async (
  req: Request<{}, {}, {}, Record<string, string | undefined>>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { createdAt, status, priority, title } = req.query;
    const filters: TaskFilters = {};
    if (createdAt) filters.createdAt = createdAt;
    if (status) filters.status = parseCsv(status) as TaskStatus[];
    if (priority) filters.priority = parseCsv(priority) as TaskPriority[];
    if (title) filters.title = title;
    const tasks = await taskService.getAllTasks(filters);
    return res.json(tasks);
  } catch (err) {
    next(err);
  }
};

export const getTaskById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const task = await taskService.getTaskById(Number(req.params.id));
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    return res.json(task);
  } catch (err) {
    next(err);
  }
};

export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body;
    const task = await taskService.createTask({
      title: data.title,
      description: data.description ?? "",
      status: data.status ?? "todo",
      priority: data.priority ?? "medium",
    });
    return res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

export const updateTask = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const updated = await taskService.updateTask(Number(req.params.id), req.body);
    if (!updated) {
      return res.status(404).json({ message: "Task not found" });
    }
    return res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteTask = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const deleted = await taskService.deleteTask(Number(req.params.id));
    if (!deleted) {
      return res.status(404).json({ message: "Task not found" });
    }
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
};
