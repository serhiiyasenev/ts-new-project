import {Route, Get, Post, Put, Delete, Query, Path, Body } from "tsoa";
import * as userService from "../services/users";
import { queryUsersSchema, UserFilters, CreateUserDto, UpdateUserDto } from "../schemas/users";
import { ApiError } from "../types/errors";
import { UserResponseDto, mapUserModelToDto } from "../dtos/userResponse.dto";
import { Tags } from "tsoa";

@Tags("Users")
@Route("users")
export class UserController {

  @Get()
  public async getAllUsers(
    @Query() name?: string,
    @Query() email?: string,
    @Query() isActive?: string
  ): Promise<UserResponseDto[]> {
    const query = queryUsersSchema.parse({ name, email, isActive });
    const filters: UserFilters = query;
    const users = await userService.getAllUsers(filters);
    return users.map(mapUserModelToDto);
  }

  @Get("{id}")
  public async getUserById(
    @Path() id: number
  ): Promise<UserResponseDto> {
    const user = await userService.getUserById(id);
    if (!user) {
      throw new ApiError("User not found", 404);
    }
    return mapUserModelToDto(user);
  }

  @Post()
  public async createUser(
    @Body() data: CreateUserDto
  ): Promise<UserResponseDto> {
    const user = await userService.createUser(data);
    if (!user) {
      throw new ApiError("Failed to create user", 500);
    }
    return mapUserModelToDto(user);
  }

  @Put("{id}")
  public async updateUser(
    @Path() id: number,
    @Body() data: UpdateUserDto
  ): Promise<UserResponseDto> {
    const updated = await userService.updateUser(id, data);
    if (!updated) {
      throw new ApiError("User not found", 404);
    }
    return mapUserModelToDto(updated);
  }

  @Delete("{id}")
  public async deleteUser(
    @Path() id: number
  ): Promise<void> {
    const deleted = await userService.deleteUser(id);
    if (!deleted) {
      throw new ApiError("User not found", 404);
    }
  }
}
