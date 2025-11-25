import { CreationAttributes } from "sequelize";
import { CreatePostDto } from "../dtos/postRequest.dto";
import { PostModel } from "../models/post.model";

export const mapCreatePostDtoToPayload = (
  data: CreatePostDto
): CreationAttributes<PostModel> => {
  return {
    title: data.title,
    content: data.content,
    userId: data.userId,
  };
};
