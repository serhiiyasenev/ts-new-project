import { Op } from "sequelize";
import { PostModel } from "../models/post.model";
import { UserModel } from "../models/user.model";
import { PostFilters } from "../types/filters";
import { CreatePostDto } from "../dtos/postRequest.dto";
import { ApiError } from "../types/errors";
import { assertUserExists } from "../helpers/user";
import { mapCreatePostDtoToPayload } from "../helpers/post";

export const getAllPosts = async (
  filters?: PostFilters,
): Promise<PostModel[]> => {
  const where: Record<string, unknown> = {};
  if (filters?.title) {
    where.title = { [Op.iLike]: `%${filters.title}%` };
  }
  if (filters?.content) {
    where.content = { [Op.iLike]: `%${filters.content}%` };
  }
  if (filters?.userId) {
    where.userId = filters.userId;
  }
  return await PostModel.findAll({
    where,
    include: [
      {
        model: UserModel,
        attributes: ["id", "name", "email"],
        required: true,
      },
    ],
  });
};

export const createPost = async (data: CreatePostDto) => {
  await assertUserExists(data.userId);
  const payload = mapCreatePostDtoToPayload(data);
  const post = await PostModel.create(payload);
  await post.reload({ include: [{ model: UserModel }] });
  return post;
};

export const getPostById = async (id: number) => {
  return await PostModel.findByPk(id, {
    include: [{ model: UserModel }],
  });
};

export const updatePost = async (
  id: number,
  changes: Partial<Pick<PostModel, "title" | "content">>,
  actorUserId: number,
) => {
  const post = await PostModel.findByPk(id);
  if (!post) return null;
  if (post.userId !== actorUserId) {
    throw new ApiError("Forbidden: cannot modify another user's post", 403);
  }
  await post.update(changes);
  return await PostModel.findByPk(id, {
    include: [{ model: UserModel }],
  });
};

export const deletePost = async (id: number) => {
  const deleted = await PostModel.destroy({ where: { id } });
  return deleted > 0;
};
