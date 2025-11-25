import { Route, Get, Post, Put, Delete, Query, Path, Body, SuccessResponse, Tags, Controller } from "tsoa";
import * as userService from "../services/users";
import { createUserSchema, queryUsersSchema, updateUserSchema } from "../schemas/users";
import { ApiError } from "../types/errors";
import { UserResponseDto, mapUserModelToDto } from "../dtos/userResponse.dto";
import { validateNumericId, validateWithSchema } from "../helpers/validation";
import { CreateUserDto, UpdateUserDto } from "../dtos/userRequest.dto";
import { UserFilters } from "../types/filters";

@Route("users")
@Tags("Users")
export class UserController extends Controller {

  @Get()
  public async getAllUsers(
    @Query() name?: string,
    @Query() email?: string,
    @Query() isActive?: string
  ): Promise<UserResponseDto[]> {
    const query = validateWithSchema(
      queryUsersSchema,
      { name, email, isActive },
      "Invalid user query parameters"
    );
    const filters: UserFilters = {
      name: query.name,
      email: query.email,
      isActive: query.isActive,
    };
    const users = await userService.getAllUsers(filters);
    return users.map(mapUserModelToDto);
  }

  @Get("{id}")
  public async getUserById(
    @Path() id: string
  ): Promise<UserResponseDto> {
    const userId = validateNumericId(id, "User id");
    const user = await userService.getUserById(userId);
    if (!user) {
      throw new ApiError("User not found", 404);
    }
    return mapUserModelToDto(user);
  }

  @Post()
  @SuccessResponse("201", "Created")
  public async createUser(
    @Body() data: CreateUserDto
  ): Promise<UserResponseDto> {
    const payload = validateWithSchema(createUserSchema, data, "Invalid user payload");
    const user = await userService.createUser(payload);
    this.setStatus(201);
    return mapUserModelToDto(user);
  }

  @Put("{id}")
  public async updateUser(
    @Path() id: string,
    @Body() data: UpdateUserDto
  ): Promise<UserResponseDto> {
    const userId = validateNumericId(id, "User id");
    const payload = validateWithSchema(updateUserSchema, data, "Invalid user update payload");
    if (!Object.keys(payload).length) {
      throw new ApiError("Update payload cannot be empty", 400);
    }
    const updated = await userService.updateUser(userId, payload);
    if (!updated) {
      throw new ApiError("User not found", 404);
    }
    return mapUserModelToDto(updated);
  }

  @Delete("{id}")
  @SuccessResponse("204", "No Content")
  public async deleteUser(
    @Path() id: string
  ): Promise<void> {
    const userId = validateNumericId(id, "User id");
    const deleted = await userService.deleteUser(userId);
    if (!deleted) {
      throw new ApiError("User not found", 404);
    }
    this.setStatus(204);
  }
}
