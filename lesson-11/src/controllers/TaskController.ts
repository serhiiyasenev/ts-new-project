import {
  Route,
  Get,
  Post,
  Put,
  Delete,
  Query,
  Path,
  Body,
  SuccessResponse,
  Tags,
  Controller,
} from "tsoa";
import * as taskService from "../services/tasks";
import {
  queryTasksSchema,
  createTaskSchema,
  updateTaskSchema,
} from "../schemas/tasks";
import { ApiError } from "@shared/api.types";
import {
  mapTaskModelToDto,
  TaskResponseDto,
  TasksGroupedByStatusDto,
  groupTasksByStatus,
} from "../dtos/taskResponse.dto";
import {
  validateNumericId,
  validateWithSchema,
  ensureNotEmpty,
} from "../helpers/validation";
import { CreateTaskDto, UpdateTaskDto } from "../dtos/taskRequest.dto";
import { buildTaskFilter } from "../services/filters/buildTaskFilter";

@Route("tasks")
@Tags("Tasks")
export class TaskController extends Controller {
  @Get()
  public async getAllTasks(
    @Query() status?: string,
    @Query() priority?: string,
    @Query() title?: string,
    @Query() userId?: string,
    @Query() groupBy?: string,
    @Query() dateFrom?: string,
    @Query() dateTo?: string,
  ): Promise<TaskResponseDto[] | TasksGroupedByStatusDto> {
    const query = validateWithSchema(
      queryTasksSchema,
      { status, priority, title, userId, groupBy, dateFrom, dateTo },
      "Invalid task query parameters",
    );

    const filters = buildTaskFilter({
      status: query.status,
      priority: query.priority,
      title: query.title,
      userId: query.userId,
      dateFrom: query.dateFrom,
      dateTo: query.dateTo,
    });
    const tasks = await taskService.getAllTasks(filters);

    // If groupBy=status, return grouped tasks for Kanban board
    if (query.groupBy === "status") {
      return groupTasksByStatus(tasks);
    }

    return tasks.map(mapTaskModelToDto);
  }

  @Get("{id}")
  public async getTaskById(@Path() id: string): Promise<TaskResponseDto> {
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
    @Body() data: CreateTaskDto,
  ): Promise<TaskResponseDto | null> {
    const payload = validateWithSchema(
      createTaskSchema,
      data,
      "Invalid task payload",
    );
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
    @Body() data: UpdateTaskDto,
  ): Promise<TaskResponseDto> {
    const taskId = validateNumericId(id, "Task id");
    const payload = ensureNotEmpty(
      validateWithSchema(updateTaskSchema, data, "Invalid task update payload"),
    );

    const updated = await taskService.updateTask(taskId, payload);
    if (!updated) {
      throw new ApiError("Task not found", 404);
    }
    return mapTaskModelToDto(updated);
  }

  @Delete("{id}")
  @SuccessResponse("204", "No Content")
  public async deleteTask(@Path() id: string): Promise<void> {
    const taskId = validateNumericId(id, "Task id");
    const deleted = await taskService.deleteTask(taskId);
    if (!deleted) {
      throw new ApiError("Task not found", 404);
    }
    this.setStatus(204);
  }
}
