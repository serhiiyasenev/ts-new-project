import { Status } from '../../dto/status';
import { Priority } from '../../dto/priority';

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

export class Task implements BaseTask{
    public readonly id: string;
    public readonly createdAt: Date;
    private updatedAt: Date;
    public deadline?: Date | undefined;

    constructor(
        id: string,
        public title: string,
        public description: string = '',
        public status: Status = Status.TODO,
        public priority: Priority = Priority.MEDIUM,
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

export class Subtask extends Task {
    parentId: string;

    constructor(parentId: string, ...args: ConstructorParameters<typeof Task>) {
        super(...args);
        this.parentId = parentId;
    }

    override getTaskInfo(): string {
        return `Subtask of ${this.parentId}: ${this.getTitle()}`;
    }
}

export class Bug extends Task {
    severity: 'minor' | 'major' | 'critical';

    constructor(severity: 'minor' | 'major' | 'critical', ...args: ConstructorParameters<typeof Task>) {
        super(...args);
        this.severity = severity;
    }

    override getTaskInfo(): string {
        return `Bug [${this.id}] Severity: ${this.severity.toUpperCase()} — ${this.getTitle()}`;
    }
}

export class Story extends Task {
    storyPoints: number;

    constructor(storyPoints: number, ...args: ConstructorParameters<typeof Task>) {
        super(...args);
        if (storyPoints < 0) throw new Error('Story points cannot be negative.');
        this.storyPoints = storyPoints;
    }

    override getTaskInfo(): string {
        return `Story [${this.id}] — ${this.getTitle()} (${this.storyPoints} points)`;
    }
}

export class Epic extends Task {
    children: string[];

    constructor(children: string[], ...args: ConstructorParameters<typeof Task>) {
        super(...args);
        this.children = children;
    }

    override getTaskInfo(): string {
        return `Epic [${this.id}] — ${this.getTitle()}, contains ${this.children.length} tasks`;
    }
}
