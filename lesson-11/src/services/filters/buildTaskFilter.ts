import { TaskFilters } from "@shared/filters";
import { TaskPriority, TaskStatus } from "../../schemas/tasks";

export interface TaskQueryParams {
  status?: string;
  priority?: string;
  title?: string;
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export const buildTaskFilter = (params: {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  title?: string;
  userId?: number;
  dateFrom?: string;
  dateTo?: string;
}): TaskFilters => {
  return {
    status: params.status,
    priority: params.priority,
    title: params.title,
    userId: params.userId,
    dateFrom: params.dateFrom,
    dateTo: params.dateTo,
  };
};
