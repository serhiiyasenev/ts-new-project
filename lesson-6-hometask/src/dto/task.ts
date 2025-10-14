import { Status } from './status'
import { Priority } from './priority'

export class Task {
    public readonly id: string;
    public readonly createdAt: Date;
    private updatedAt: Date;
    private deadline?: Date;

    constructor(
        id: string,
        private title: string,
        private description: string = '',
        private status: Status = Status.TODO,
        private priority: Priority = Priority.MEDIUM,
        private isAvailable: boolean = true
    ) {
        this.id = id;
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.validate();
    }

    private validate(): void {
        if (!this.title.trim()) {
            throw new Error('Title cannot be empty');
        }
        if (this.title.length < 3) {
            throw new Error('Title must be at least 3 characters long');
        }
    }

    // Getters
    getTitle(): string { return this.title; }
    getDescription(): string { return this.description; }
    getStatus(): Status { return this.status; }
    getPriority(): Priority { return this.priority; }
    getIsAvailable(): boolean { return this.isAvailable; }
    getUpdatedAt(): Date { return this.updatedAt; }
    getDeadline(): Date | undefined { return this.deadline; }
    getCreatedAt(): Date { return this.createdAt; }

    // Setters with validation
    setTitle(title: string): void {
        if (!title.trim()) {
            throw new Error('Title cannot be empty');
        }
        if (title.length < 3) {
            throw new Error('Title must be at least 3 characters long');
        }
        this.title = title;
        this.updatedAt = new Date();
    }

    setDescription(description: string): void {
        this.description = description;
        this.updatedAt = new Date();
    }

    setStatus(status: Status): void {
        this.status = status;
        this.updatedAt = new Date();
    }

    setPriority(priority: Priority): void {
        this.priority = priority;
        this.updatedAt = new Date();
    }

    setAvailability(isAvailable: boolean): void {
        this.isAvailable = isAvailable;
        this.updatedAt = new Date();
    }

    setDeadline(deadline: Date): void {
        if (deadline < new Date()) {
            throw new Error('Deadline cannot be in the past');
        }
        this.deadline = deadline;
        this.updatedAt = new Date();
    }

    // Info method
    getTaskInfo(): string {
        return `
            Task ID: ${this.id}
            Title: ${this.title}
            Description: ${this.description}
            Status: ${this.status}
            Priority: ${this.priority}
            Available: ${this.isAvailable}
            Created At: ${this.createdAt.toLocaleString()}
            Updated At: ${this.updatedAt.toLocaleString()}
            ${this.deadline ? `Deadline: ${this.deadline.toLocaleString()}` : 'No deadline set'}
        `;
    }
}
