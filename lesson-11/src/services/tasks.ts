import { Op } from "sequelize";
import { TaskModel } from "../models/task.model";
import { UserModel } from "../models/user.model";
import { TaskFilters } from "../types/filters";
import { CreateTaskDto, UpdateTaskDto } from "../dtos/taskRequest.dto";
import { assertUserExists } from "../helpers/user";
import { mapCreateTaskDtoToPayload } from "../helpers/task";

export const getAllTasks = async (filters?: TaskFilters): Promise<TaskModel[]> => {
  const where: Record<string, unknown> = {};
  if (filters?.status?.length) {
    where.status = { [Op.in]: filters.status };
  }
  if (filters?.priority?.length) {
    where.priority = { [Op.in]: filters.priority };
  }
  if (filters?.title) {
    where.title = { [Op.iLike]: `%${filters.title}%` };
  }
  if (filters?.userId) {
    where.userId = filters.userId;
  }
  return await TaskModel.findAll({
    where,
    include: [
      {
        model: UserModel,
        attributes: ["id", "name", "email"],
        required: false
      },
    ],
  });
};

export const createTask = async (data: CreateTaskDto) => {
  if (data.userId) {
    await assertUserExists(data.userId);
  }
  const payload = mapCreateTaskDtoToPayload(data);
  const created = await TaskModel.create(payload);
  await created.reload({
    include: [{ model: UserModel, attributes: ["id", "name", "email"], required: false }],
  });
  return created;
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
  if (updatedData.userId) {
    await assertUserExists(updatedData.userId);
  }
  await task.update(updatedData);
  return await TaskModel.findByPk(id, {
    include: [{ model: UserModel, attributes: ["id", "name", "email"], required: false }],
  });
};

export const deleteTask = async (id: number): Promise<boolean> => {
  const deleted = await TaskModel.destroy({ where: { id } });
  return deleted > 0;
};
