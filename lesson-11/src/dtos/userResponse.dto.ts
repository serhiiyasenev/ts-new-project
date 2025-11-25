import { UserModel } from "../models/user.model";
import { TaskResponseDto, mapTaskModelToDto } from "./taskResponse.dto";
import { PostResponseDto, mapPostModelToDto } from "./postResponse.dto";

export interface UserResponseDto {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;

  // nested relations — optional
  tasks?: TaskResponseDto[];
  posts?: PostResponseDto[];
}

export function mapUserModelToDto(model: UserModel): UserResponseDto {
  return {
    id: model.id,
    name: model.name,
    email: model.email,
    isActive: model.isActive,
    lastLoginAt: model.lastLoginAt ? model.lastLoginAt.toISOString() : null,
    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),

    tasks: model.tasks ? model.tasks.map(mapTaskModelToDto) : undefined,
    posts: model.posts ? model.posts.map(mapPostModelToDto) : undefined,
  };
}
