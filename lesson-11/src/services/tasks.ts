import { Op } from "sequelize";
import { TaskModel } from "../models/task.model";
import { TaskFilters } from "../types/tasks";

export const getAllTasks = async (filters?: TaskFilters): Promise<TaskModel[]> => {
  const where: any = {};

  if (filters?.createdAt) {
    where.createdAt = { [Op.iLike]: `%${filters.createdAt}%` };
  }

  if (filters?.status?.length) {
    where.status = { [Op.in]: filters.status };
  }

  if (filters?.priority?.length) {
    where.priority = { [Op.in]: filters.priority };
  }

  if (filters?.title) {
    where.title = { [Op.iLike]: `%${filters.title}%` };
  }

  return await TaskModel.findAll({ where });
};

export const createTask = async (data: Partial<TaskModel>) => {
  try {
    return await TaskModel.create(data);
  } catch (err: any) {
    console.error("DB error:", err);
    throw err;
  }
};

export const getTaskById = async (id: number): Promise<TaskModel | null> => {
  return await TaskModel.findByPk(id);
};

export const updateTask = async (id: number,updatedData: Partial<TaskModel>): Promise<TaskModel | null> => {
  const task = await TaskModel.findByPk(id);
  if (!task) return null;
  try {
    return await task.update(updatedData);
  } catch (err: any) {
    console.error("DB error:", err);
    throw err;
  }
};

export const deleteTask = async (id: number): Promise<boolean> => {
  const deleted = await TaskModel.destroy({ where: { id } });
  return deleted > 0;
};
