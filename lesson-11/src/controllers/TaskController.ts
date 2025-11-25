import { Route, Get, Post, Put, Delete, Query, Path, Body } from "tsoa";
import * as taskService from "../services/tasks";
import { CreateTaskDto, UpdateTaskDto, TaskFilters, queryTasksSchema } from "../schemas/tasks";
import { ApiError } from "../types/errors";
import { mapTaskModelToDto, TaskResponseDto } from "../dtos/taskResponse.dto";
import { Tags } from "tsoa";

@Tags("Tasks")
@Route("tasks")
export class TaskController {

  @Get()
  public async getAllTasks(
    @Query() createdAt?: string,
    @Query() status?: string,
    @Query() priority?: string,
    @Query() title?: string
  ): Promise<TaskResponseDto[]> {

    const query = queryTasksSchema.parse({
      createdAt,
      status,
      priority,
      title
    });

    const filters: TaskFilters = {
      createdAt: query.createdAt,
      status: query.status,
      priority: query.priority,
      title: query.title
    };

    const tasks = await taskService.getAllTasks(filters);
    return tasks.map(mapTaskModelToDto);
  }

  @Get("{id}")
  public async getTaskById(
    @Path() id: number
  ): Promise<TaskResponseDto> {
    const task = await taskService.getTaskById(id);

    if (!task) {
      throw new ApiError("Task not found", 404);
    }

    return mapTaskModelToDto(task);
  }

  @Post()
  public async createTask(
    @Body() data: CreateTaskDto
  ): Promise<TaskResponseDto> {

    const task = await taskService.createTask({
      title: data.title,
      description: data.description ?? "",
      status: data.status ?? "todo",
      priority: data.priority ?? "medium",
      userId: data.userId ?? undefined
    });

    if (!task) {
      throw new ApiError("Failed to create task", 500);
    }

    return mapTaskModelToDto(task);
  }

  @Put("{id}")
  public async updateTask(
    @Path() id: number,
    @Body() data: UpdateTaskDto
  ): Promise<TaskResponseDto> {

    const updated = await taskService.updateTask(id, data);

    if (!updated) {
      throw new ApiError("Task not found", 404);
    }
    
    return mapTaskModelToDto(updated);
  }

  @Delete("{id}")
  public async deleteTask(
    @Path() id: number
  ): Promise<void> {

    const deleted = await taskService.deleteTask(id);

    if (!deleted) {
        throw new ApiError("Task not found", 404);
    }
  }
}
