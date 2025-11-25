import { CreationAttributes } from "sequelize";
import { CreateTaskDto } from "../dtos/taskRequest.dto";
import { TaskModel } from "../models/task.model";

export const mapCreateTaskDtoToPayload = (
  data: CreateTaskDto
): CreationAttributes<TaskModel> => {
  const payload: CreationAttributes<TaskModel> = {
    title: data.title,
    // map optional description to null when not provided so DB nullable column is satisfied
    description: typeof data.description === "undefined" ? null : data.description,
    status: data.status,
    priority: data.priority,
    // userId column is nullable in the model; map undefined -> null
    userId: typeof data.userId === "undefined" ? null : data.userId,
  };
  return payload;
};
