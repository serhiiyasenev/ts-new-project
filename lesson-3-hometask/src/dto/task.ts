import { Status } from './status'
import { Priority } from './priority'

export interface Task {
    id: string;
    title: string;
    description?: string;
    createdAt: Date;
    status: Status;
    priority: Priority;
    deadline: Date;
}
