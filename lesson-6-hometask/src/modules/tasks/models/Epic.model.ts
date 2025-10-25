import { Task } from './Task.model';

export class Epic extends Task {
    children: string[];

    constructor(children: string[], ...args: ConstructorParameters<typeof Task>) {
        super(...args);
        this.children = [...children];
    }

    override getTaskInfo(): string {
        return `Epic [${this.id}] — ${this.getTitle()}, contains ${this.children.length} tasks`;
    }
}
