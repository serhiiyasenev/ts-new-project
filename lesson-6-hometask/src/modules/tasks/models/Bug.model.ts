import { Task } from './Task.model';
import { Severity } from '../task.types';

export class Bug extends Task {
    severity: Severity;

    constructor(severity: Severity, ...args: ConstructorParameters<typeof Task>) {
        super(...args);
        this.severity = severity;
    }

    override getTaskInfo(): string {
        return `Bug [${this.id}] Severity: ${this.severity.toUpperCase()} — ${this.title}`;
    }
}
