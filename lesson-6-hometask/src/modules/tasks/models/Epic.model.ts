import { Task } from './Task.model';

export class Epic extends Task {
    private children: string[];

    constructor(children: string[], ...args: ConstructorParameters<typeof Task>) {
        super(...args);
        // store a shallow copy to avoid external mutation
        this.children = [...children];
    }

    getChildren(): string[] {
        return [...this.children];
    }

    addChild(child: string): void {
        this.children = [...this.children, child];
    }

    removeChild(child: string): boolean {
        const before = this.children.length;
        this.children = this.children.filter(c => c !== child);
        return this.children.length !== before;
    }

    override getTaskInfo(): string {
        return `Epic [${this.id}] — ${this.getTitle()}, contains ${this.children.length} tasks`;
    }
}
