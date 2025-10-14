import { Status } from './status'
import { Priority } from './priority'

export interface TaskUpdateDto {
    title?: string;
    description?: string;
    status?: Status;
    priority?: Priority;
    deadline?: Date;
    isAvailable?: boolean;
}
