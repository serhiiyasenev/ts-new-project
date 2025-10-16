import { Status } from './status';
import { Priority } from './priority';

export interface TaskCreateDto {
    title: string;
    description?: string;
    status?: Status;
    priority?: Priority;
    isAvailable?: boolean;
    deadline?: Date;
}
