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

export enum Severity {
    MINOR = 'minor',
    MAJOR = 'major',
    CRITICAL = 'critical'
}

// Base interface
export interface BaseTask {
    id: string;
    createdAt: Date;
    getTitle(): string;
    getDescription(): string;
    getStatus(): Status;
    getPriority(): Priority;
    getDeadline(): Date | undefined;
    setTitle(title: string): void;
    setDescription(description: string): void;
    setStatus(status: Status): void;
    setPriority(priority: Priority): void;
    setDeadline(deadline: Date | undefined): void;
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
