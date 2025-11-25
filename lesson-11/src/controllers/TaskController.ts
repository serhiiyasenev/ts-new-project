import { Route, Get, Post, Put, Delete, Query, Path, Body, SuccessResponse, Tags, Controller } from "tsoa";
import * as taskService from "../services/tasks";
import { queryTasksSchema, createTaskSchema, updateTaskSchema } from "../schemas/tasks";
import { ApiError } from "../types/errors";
import { mapTaskModelToDto, TaskResponseDto } from "../dtos/taskResponse.dto";
import { validateNumericId, validateWithSchema } from "../helpers/validation";
import { CreateTaskDto, UpdateTaskDto } from "../dtos/taskRequest.dto";
import { TaskFilters } from "../types/filters";

@Route("tasks")
@Tags("Tasks")
export class TaskController extends Controller {
  @Get()
  public async getAllTasks(
    @Query() status?: string,
    @Query() priority?: string,
    @Query() title?: string,
    @Query() userId?: string
  ): Promise<TaskResponseDto[]> {
    const query = validateWithSchema(
      queryTasksSchema,
      { status, priority, title, userId },
      "Invalid task query parameters"
    );
    const filters: TaskFilters = {
      status: query.status,
      priority: query.priority,
      title: query.title,
      userId: query.userId,
    };
    const tasks = await taskService.getAllTasks(filters);
    return tasks.map(mapTaskModelToDto);
  }

  @Get("{id}")
  public async getTaskById(
    @Path() id: string
  ): Promise<TaskResponseDto> {
    const taskId = validateNumericId(id, "Task id");
    const task = await taskService.getTaskById(taskId);
    if (!task) {
      throw new ApiError("Task not found", 404);
    }
    return mapTaskModelToDto(task);
  }

  @Post()
  @SuccessResponse("201", "Created")
  public async createTask(
    @Body() data: CreateTaskDto
  ): Promise<TaskResponseDto> {
    const payload = validateWithSchema(createTaskSchema, data, "Invalid task payload");
    const task = await taskService.createTask(payload as CreateTaskDto);
    if (!task) {
      throw new ApiError("Failed to create task", 500);
    }
    this.setStatus(201);
    return mapTaskModelToDto(task);
  }

  @Put("{id}")
  public async updateTask(
    @Path() id: string,
    @Body() data: UpdateTaskDto
  ): Promise<TaskResponseDto> {
    const taskId = validateNumericId(id, "Task id");
    const payload = validateWithSchema(updateTaskSchema, data, "Invalid task update payload");
    if (!Object.keys(payload).length) {
      throw new ApiError("Update payload cannot be empty", 400);
    }
    const updated = await taskService.updateTask(taskId, payload);
    if (!updated) {
      throw new ApiError("Task not found", 404);
    }
    return mapTaskModelToDto(updated);
  }

  @Delete("{id}")
  @SuccessResponse("204", "No Content")
  public async deleteTask(
    @Path() id: string
  ): Promise<void> {
    const taskId = validateNumericId(id, "Task id");
    const deleted = await taskService.deleteTask(taskId);
    if (!deleted) {
        throw new ApiError("Task not found", 404);
    }
    this.setStatus(204);
  }
}
