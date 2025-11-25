import { Op } from "sequelize";
import { PostModel } from "../models/post.model";
import { UserModel } from "../models/user.model";
import { PostFilters } from "../schemas/posts";

export const getAllPosts = async (filters?: PostFilters) : Promise<PostModel[]> => { const where: any = {};
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
        attributes: ["id", "name", "email"], required: true 
        }
    ],
  });
};

export const createPost = async (data: Partial<PostModel>) => {
  try {
    const post = await PostModel.create(data);
    return await PostModel.findByPk(post.id, {
      include: [{ model: UserModel }],
    });
  } catch (err) {
    console.error("DB error:", err);
    throw err;
  }
};

export const getPostById = async (id: number) => {
  return await PostModel.findByPk(id, {
    include: [{ model: UserModel }],
  });
};

export const updatePost = async (id: number, data: Partial<PostModel>) => {
  const post = await PostModel.findByPk(id);
  if (!post) return null;
  await post.update(data);
  return await PostModel.findByPk(id, {
    include: [{ model: UserModel }],
  });
};

export const deletePost = async (id: number) => {
  const deleted = await PostModel.destroy({ where: { id } });
  return deleted > 0;
};
