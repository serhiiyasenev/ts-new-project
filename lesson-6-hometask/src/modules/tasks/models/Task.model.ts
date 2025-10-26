import { BaseTask, Status, Priority } from '../task.types';

export class Task implements BaseTask {
    public readonly id: string;
    public readonly createdAt: Date;
    private _updatedAt: Date;
    private _title: string;
    private _description: string;
    private _status: Status;
    private _priority: Priority;
    private _isAvailable: boolean;
    private _deadline?: Date | undefined;

    constructor(
        id: string,
        title: string,
        description: string = 'No description provided',
        status: Status = Status.TODO,
        priority: Priority = Priority.MEDIUM,
        isAvailable: boolean = true
    ) {
        this.id = id;
        this.createdAt = new Date();
        this._updatedAt = new Date();
        this._title = title;
        this._description = description;
        this._status = status;
        this._priority = priority;
        this._isAvailable = isAvailable;
        this.validate();
    }

    private validate(): void {
        if (!this._title.trim()) {
            throw new Error('Title cannot be empty');
        }
        if (this._title.length < 3) {
            throw new Error('Title must be at least 3 characters long');
        }
    }

    // Method-style Getters
    getTitle(): string {
        return this._title;
    }

    getDescription(): string {
        return this._description;
    }

    getStatus(): Status {
        return this._status;
    }

    getPriority(): Priority {
        return this._priority;
    }

    getIsAvailable(): boolean {
        return this._isAvailable;
    }

    getUpdatedAt(): Date {
        return this._updatedAt;
    }

    getCreatedAt(): Date {
        return this.createdAt;
    }

    getDeadline(): Date | undefined {
        return this._deadline;
    }

    // Method-style Setters with validation
    setTitle(title: string): void {
        if (!title.trim()) {
            throw new Error('Title cannot be empty');
        }
        if (title.length < 3) {
            throw new Error('Title must be at least 3 characters long');
        }
        this._title = title;
        this._updatedAt = new Date();
    }

    setDescription(description: string): void {
        this._description = description;
        this._updatedAt = new Date();
    }

    setStatus(status: Status): void {
        this._status = status;
        this._updatedAt = new Date();
    }

    setPriority(priority: Priority): void {
        this._priority = priority;
        this._updatedAt = new Date();
    }

    setAvailability(isAvailable: boolean): void {
        this._isAvailable = isAvailable;
        this._updatedAt = new Date();
    }

    setDeadline(deadline: Date | undefined): void {
        if (deadline && deadline < new Date()) {
            throw new Error('Deadline cannot be in the past');
        }
        this._deadline = deadline;
        this._updatedAt = new Date();
    }

    // Info method
    getTaskInfo(): string {
        return `
            Task ID: ${this.id}
            Title: ${this.getTitle()}
            Description: ${this.getDescription()}
            Status: ${this.getStatus()}
            Priority: ${this.getPriority()}
            Available: ${this.getIsAvailable()}
            Created At: ${this.getCreatedAt().toLocaleString()}
            Updated At: ${this.getUpdatedAt().toLocaleString()}
            ${this.getDeadline() ? `Deadline: ${this.deadline.toLocaleString()}` : 'No deadline set'}
        `;
    }
}
