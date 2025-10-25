import { Task } from './Task.model';

export class Epic extends Task {
    private readonly children: string[];

    constructor(children: string[], ...args: ConstructorParameters<typeof Task>) {
        super(...args);
        this.children = [...children];
    }

    getChildren(): string[] {
        return [...this.children];
    }

    addChild(child: string): void {
        this.children.push(child);
    }

    removeChild(child: string): boolean {
        const index = this.children.indexOf(child);
        if (index !== -1) {
            this.children.splice(index, 1);
            return true;
        }
        return false;
    }
    override getTaskInfo(): string {
        return `Epic [${this.id}] — ${this.getTitle()}, contains ${this.children.length} tasks`;
    }
}
