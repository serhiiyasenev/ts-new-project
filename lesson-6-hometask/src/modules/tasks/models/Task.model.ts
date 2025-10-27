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
        this.validate(title);
        this.id = id;
        this.createdAt = new Date();
        this._updatedAt = new Date();
        this._title = title;
        this._description = description;
        this._status = status;
        this._priority = priority;
        this._isAvailable = isAvailable;
    }

    private validate(value: string): void {
        if (!value.trim()) {
            throw new Error('Title cannot be empty');
        }
        if (value.length < 3) {
            throw new Error('Title must be at least 3 characters long');
        }
    }

    private updateTimestamp(): void {
        this._updatedAt = new Date();
    }

    get title(): string {
        return this._title;
    }

    set title(value: string) {
        this.validate(value);
        this._title = value;
        this.updateTimestamp();
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
        this.updateTimestamp();
    }

    get status(): Status {
        return this._status;
    }

    set status(value: Status) {
        this._status = value;
        this.updateTimestamp();
    }

    get priority(): Priority {
        return this._priority;
    }

    set priority(value: Priority) {
        this._priority = value;
        this.updateTimestamp();
    }

    get isAvailable(): boolean {
        return this._isAvailable;
    }

    set isAvailable(value: boolean) {
        this._isAvailable = value;
        this.updateTimestamp();
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }

    get deadline(): Date | undefined {
        return this._deadline;
    }

    set deadline(value: Date | undefined) {
        if (value && value < new Date()) {
            throw new Error('Deadline cannot be in the past');
        }
        this._deadline = value;
        this.updateTimestamp();
    }

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
