import { CreationAttributes } from "sequelize";
import { CreateTaskDto } from "../dtos/taskRequest.dto";
import { TaskModel } from "../models/task.model";

export const mapCreateTaskDtoToPayload = (
  data: CreateTaskDto,
): CreationAttributes<TaskModel> => {
  const payload: CreationAttributes<TaskModel> = {
    title: data.title,
    description: data.description ?? null,
    status: data.status,
    priority: data.priority,
    userId: data.userId ?? null,
  };
  return payload;
};
