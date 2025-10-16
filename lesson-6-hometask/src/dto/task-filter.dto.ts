import { Status } from './status';
import { Priority } from './priority';

export interface TaskFilterDto {
    status?: Status;
    priority?: Priority;
    createdAfter?: Date;
    createdBefore?: Date;
    isAvailable?: boolean;
}
