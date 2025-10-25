// Enums
export enum Status {
    TODO = 'todo',
    IN_PROGRESS = 'in_progress',
    DONE = 'done'
}

export enum Priority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high'
}

// Type aliases
export type Severity = 'minor' | 'major' | 'critical';

// Base interface
export interface BaseTask {
    id: string;
    title: string;
    description?: string;
    createdAt: Date;
    status: Status;
    priority: Priority;
    deadline?: Date | undefined;
    getTaskInfo(): string;
}

// DTOs
export interface TaskCreateDto {
    title: string;
    description?: string;
    status?: Status;
    priority?: Priority;
    isAvailable?: boolean;
    deadline?: Date;
}

export type TaskUpdateDto = Partial<TaskCreateDto>;

export interface TaskFilterDto {
    status?: Status;
    priority?: Priority;
    isAvailable?: boolean;
}
