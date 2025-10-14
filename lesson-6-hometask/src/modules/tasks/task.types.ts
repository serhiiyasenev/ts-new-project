import { Status } from '../../dto/status';
import { Priority } from '../../dto/priority';

export interface BaseTask {
    id: string;
    title: string;
    description?: string;
    createdAt: Date;
    status: Status;
    priority: Priority;
    deadline: Date;
    getTaskInfo(): string;
}

export class Task implements BaseTask {
    id: string;
    title: string;
    description?: string;
    createdAt: Date;
    status: Status;
    priority: Priority;
    deadline: Date;

    constructor(
        id: string,
        title: string,
        description: string,
        status: Status,
        priority: Priority,
        deadline: Date
    ) {
        if (!title.trim()) throw new Error('Title cannot be empty.');
        if (deadline.getTime() < Date.now()) throw new Error('Deadline cannot be in the past.');

        this.id = id;
        this.title = title;
        this.description = description;
        this.createdAt = new Date();
        this.status = status;
        this.priority = priority;
        this.deadline = deadline;
    }

    getTaskInfo(): string {
        return `Task [${this.id}] ${this.title} — ${this.status.toUpperCase()} (${this.priority.toUpperCase()})`;
    }
}

export class Subtask extends Task {
    parentId: string;

    constructor(parentId: string, ...args: ConstructorParameters<typeof Task>) {
        super(...args);
        this.parentId = parentId;
    }

    override getTaskInfo(): string {
        return `Subtask of ${this.parentId}: ${this.title}`;
    }
}

export class Bug extends Task {
    severity: 'minor' | 'major' | 'critical';

    constructor(severity: 'minor' | 'major' | 'critical', ...args: ConstructorParameters<typeof Task>) {
        super(...args);
        this.severity = severity;
    }

    override getTaskInfo(): string {
        return `Bug [${this.id}] Severity: ${this.severity.toUpperCase()} — ${this.title}`;
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
        return `Story [${this.id}] — ${this.title} (${this.storyPoints} points)`;
    }
}

export class Epic extends Task {
    children: string[];

    constructor(children: string[], ...args: ConstructorParameters<typeof Task>) {
        super(...args);
        this.children = children;
    }

    override getTaskInfo(): string {
        return `Epic [${this.id}] — ${this.title}, contains ${this.children.length} tasks`;
    }
}
