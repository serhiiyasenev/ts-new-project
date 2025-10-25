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
        description: string = '',
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

    // Getters using get syntax
    get title(): string {
        return this._title;
    }

    get description(): string {
        return this._description;
    }

    get status(): Status {
        return this._status;
    }

    get priority(): Priority {
        return this._priority;
    }

    get isAvailable(): boolean {
        return this._isAvailable;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }

    get deadline(): Date | undefined {
        return this._deadline;
    }

    // Setters using set syntax with validation
    set title(title: string) {
        if (!title.trim()) {
            throw new Error('Title cannot be empty');
        }
        if (title.length < 3) {
            throw new Error('Title must be at least 3 characters long');
        }
        this._title = title;
        this._updatedAt = new Date();
    }

    set description(description: string) {
        this._description = description;
        this._updatedAt = new Date();
    }

    set status(status: Status) {
        this._status = status;
        this._updatedAt = new Date();
    }

    set priority(priority: Priority) {
        this._priority = priority;
        this._updatedAt = new Date();
    }

    set availability(isAvailable: boolean) {
        this._isAvailable = isAvailable;
        this._updatedAt = new Date();
    }

    set deadline(deadline: Date | undefined) {
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
            Title: ${this._title}
            Description: ${this._description}
            Status: ${this._status}
            Priority: ${this._priority}
            Available: ${this._isAvailable}
            Created At: ${this.createdAt.toLocaleString()}
            Updated At: ${this._updatedAt.toLocaleString()}
            ${this._deadline ? `Deadline: ${this._deadline.toLocaleString()}` : 'No deadline set'}
        `;
    }
}
