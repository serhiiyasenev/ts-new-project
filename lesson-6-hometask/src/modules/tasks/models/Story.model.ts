import { Task } from './Task.model';

export class Story extends Task {
    storyPoints: number;

    constructor(storyPoints: number, ...args: ConstructorParameters<typeof Task>) {
        super(...args);
        if (storyPoints < 0) throw new Error('Story points cannot be negative');
        this.storyPoints = storyPoints;
    }

    override getTaskInfo(): string {
        return `Story [${this.id}] — ${this.getTitle()} (${this.storyPoints} points)`;
    }
}
