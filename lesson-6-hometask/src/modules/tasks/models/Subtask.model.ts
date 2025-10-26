import { Task } from './Task.model';

export class Subtask extends Task {
    readonly parentId: string;

    constructor(parentId: string, ...args: ConstructorParameters<typeof Task>) {
        super(...args);
        this.parentId = parentId;
    }

    override getTaskInfo(): string {
        return `Subtask of ${this.parentId}: ${this.title}`;
    }
}
