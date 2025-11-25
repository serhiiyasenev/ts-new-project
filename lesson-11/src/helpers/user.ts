import { CreationAttributes } from "sequelize";
import { CreateUserDto } from "../dtos/userRequest.dto";
import { UserModel } from "../models/user.model";
import { ApiError } from "../types/errors";

export const mapCreateUserDtoToPayload = (
  data: CreateUserDto
): CreationAttributes<UserModel> => {
  const payload: CreationAttributes<UserModel> = {
    name: data.name,
    email: data.email,
    ...(typeof data.isActive !== "undefined" ? { isActive: data.isActive } : {}),
  };
  return payload;
};

export const assertUserExists = async (userId: number): Promise<UserModel> => {
  const user = await UserModel.findByPk(userId);
  if (!user) {
    throw new ApiError("User not found", 404);
  }
  return user;
};

