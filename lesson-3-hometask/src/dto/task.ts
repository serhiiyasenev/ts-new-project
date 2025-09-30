import { Status } from './status'
import { Priority } from './priority'

export interface Task {
    id: string | number;
    title: string;
    description?: string;
    createdAt: Date | string;
    status: Status;
    priority: Priority;
    deadline: Date | string;
}
