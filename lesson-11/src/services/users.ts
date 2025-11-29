import { Op } from "sequelize";
import { PostModel } from "../models/post.model";
import { TaskModel } from "../models/task.model";
import { UserModel } from "../models/user.model";
import { CreateUserDto, UpdateUserDto } from "../dtos/userRequest.dto";
import { EmailAlreadyExistsError } from "@shared/api.types";
import { UserFilters } from "@shared/filters";
import { mapCreateUserDtoToPayload } from "../helpers/user";

export const getAllUsers = async (
  filters?: UserFilters,
): Promise<UserModel[]> => {
  const where: Record<string, unknown> = {};
  if (filters?.email) {
    where.email = { [Op.iLike]: `%${filters.email}%` };
  }
  if (filters?.name) {
    where.name = { [Op.iLike]: `%${filters.name}%` };
  }
  if (filters?.isActive) {
    where.isActive = filters.isActive;
  }
  return await UserModel.findAll({ where });
};

const ensureEmailUnique = async (email: string, excludeUserId?: number) => {
  const where: Record<string, unknown> = { email };
  if (excludeUserId) {
    where.id = { [Op.ne]: excludeUserId };
  }
  const existing = await UserModel.findOne({ where });
  if (existing) {
    throw new EmailAlreadyExistsError();
  }
};

export const createUser = async (data: CreateUserDto): Promise<UserModel> => {
  await ensureEmailUnique(data.email);
  const payload = mapCreateUserDtoToPayload(data);
  return await UserModel.create(payload);
};

export const getUserById = async (id: number): Promise<UserModel | null> => {
  return await UserModel.findByPk(id, {
    include: [
      {
        model: TaskModel,
      },
      {
        model: PostModel,
      },
    ],
  });
};

export const updateUser = async (
  id: number,
  updatedData: UpdateUserDto,
): Promise<UserModel | null> => {
  const user = await UserModel.findByPk(id);
  if (!user) return null;
  if (updatedData.email) {
    await ensureEmailUnique(updatedData.email, id);
  }
  return await user.update(updatedData);
};

export const deleteUser = async (id: number): Promise<boolean> => {
  const deleted = await UserModel.destroy({ where: { id } });
  return deleted > 0;
};
