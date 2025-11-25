import { Op } from "sequelize";
import { TaskModel } from "../models/task.model";
import { TaskFilters, UpdateTaskDto } from "../schemas/tasks";
import { UserModel } from "../models/user.model";

export const getAllTasks = async (filters?: TaskFilters): Promise<TaskModel[]> => {
  const where: any = {};
  if (filters?.status?.length) {
    where.status = { [Op.in]: filters.status };
  }
  if (filters?.priority?.length) {
    where.priority = { [Op.in]: filters.priority };
  }
  if (filters?.title) {
    where.title = { [Op.iLike]: `%${filters.title}%` };
  }
  return await TaskModel.findAll({
    where,
    include: [
      {
        model: UserModel,
        attributes: ["id", "name", "email"], required: false
      },
    ],
  });
};

export const createTask = async (data: Partial<TaskModel>) => {
  try {
    const created = await TaskModel.create(data);
    return await TaskModel.findByPk(created.id, {
      include: [{ model: UserModel, attributes: ["id", "name", "email"], required: false }],
    });
  } catch (err: any) {
    console.error("DB error:", err);
    throw err;
  }
};

export const getTaskById = async (id: number): Promise<TaskModel | null> => {
  return await TaskModel.findByPk(id, {
    include: [
      {
        model: UserModel,
        attributes: ["id", "name", "email"], required: false
      }
    ],
  });
}

export const updateTask = async (
  id: number,
  updatedData: UpdateTaskDto
): Promise<TaskModel | null> => {
  const task = await TaskModel.findByPk(id);
  if (!task) return null;
  await task.update(updatedData);
  return await TaskModel.findByPk(id, {
    include: [{ model: UserModel, attributes: ["id", "name", "email"], required: false }],
  });
};

export const deleteTask = async (id: number): Promise<boolean> => {
  const deleted = await TaskModel.destroy({ where: { id } });
  return deleted > 0;
};
