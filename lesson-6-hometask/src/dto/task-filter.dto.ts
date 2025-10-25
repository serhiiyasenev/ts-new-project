import { Status, Priority } from '../modules/tasks/task.types';

export interface TaskFilterDto {
    status?: Status;
    priority?: Priority;
    createdAfter?: Date;
    createdBefore?: Date;
    isAvailable?: boolean;
}
