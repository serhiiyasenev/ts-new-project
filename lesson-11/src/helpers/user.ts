import { UserModel } from "../models/user.model";
import { ApiError } from "../types/errors";

export const assertUserExists = async (userId: number): Promise<UserModel> => {
  const user = await UserModel.findByPk(userId);
  if (!user) {
    throw new ApiError("User not found", 404);
  }
  return user;
};

