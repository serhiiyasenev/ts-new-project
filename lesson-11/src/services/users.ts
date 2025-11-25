import { PostModel } from "../models/post.model";
import { TaskModel } from "../models/task.model";
import { UserModel } from "../models/user.model";
import { UserFilters } from "../schemas/users";
import { EmailAlreadyExistsError } from "../types/errors";
import { Op } from "sequelize";

export const getAllUsers = async (filters?: UserFilters): Promise<UserModel[]> => { const where: any = {};
  if (filters?.email) {
    where.email = { [Op.iLike]: `%${filters.email}%` };
  }
  if (filters?.name) {
    where.name = { [Op.iLike]: `%${filters.name}%` };
  }
  return await UserModel.findAll({ where });
};

export const createUser = async (data: Partial<UserModel>) => {
  try {
    return await UserModel.create(data);
  } catch (err: any) {
    if (err.name === "SequelizeUniqueConstraintError") {
      throw new EmailAlreadyExistsError();
    }
    console.error("DB error:", err);
    throw err;
  }
};

export const getUserById = async (id: number): Promise<UserModel | null> => {
  return await UserModel.findByPk(id, {
    include: [
      {
        model: TaskModel,
      },
      {
        model: PostModel,
      }
    ]
  });
};

export const updateUser = async (id: number, updatedData: Partial<UserModel>): Promise<UserModel | null> => {
  const user = await UserModel.findByPk(id);
  if (!user) return null;
  try {
    return await user.update(updatedData);
  } catch (err: any) {
    if (err.name === "SequelizeUniqueConstraintError") {
      throw new EmailAlreadyExistsError();
    }
    throw err;
  }
};

export const deleteUser = async (id: number): Promise<boolean> => {
  const deleted = await UserModel.destroy({ where: { id } });
  return deleted > 0;
};
