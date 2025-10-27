import { Task } from './models/Task.model';
import { Status, Priority, TaskCreateDto, TaskUpdateDto, TaskFilterDto } from './task.types';
import { v4 as uuidv4 } from 'uuid';

type Writable<T> = { -readonly [P in keyof T]: T[P] };

export class TaskService {
    private tasks: Task[] = [];

    create(dto: TaskCreateDto): Task {
        if (!dto.title?.trim()) {
            throw new Error('Title cannot be empty');
        }

        const task = new Task(
            uuidv4(),
            dto.title.trim(),
            dto.description || 'No description provided',
            dto.status || Status.TODO,
            dto.priority || Priority.MEDIUM,
            dto.isAvailable ?? true
        );

        if (dto.deadline) {
            task.deadline = dto.deadline;
        }

        this.tasks.push(task);
        return task;
    }

    getAll(): Task[] {
        return this.tasks;
    }

    getById(id: string): Task | undefined {
        return this.tasks.find(t => t.id === id);
    }

    update(id: string, dto: TaskUpdateDto): Task {
        const task = this.getById(id);
        if (!task) throw new Error(`Task with id "${id}" not found.`);

        const cleanDto = Object.fromEntries(
            Object.entries(dto).filter(([_, v]) => v !== undefined)
        );

        Object.assign(task as Writable<Task>, cleanDto);

        if (dto.deadline === null) task.deadline = undefined;

        return task;
    }

    delete(id: string): string {
        const index = this.tasks.findIndex(task => task.id === id);
        if (index === -1) {
            throw new Error(`Task with id "${id}" not found.`);
        }

        this.tasks.splice(index, 1);
        return `Task with id "${id}" deleted successfully.`;
    }

    filter(filters: TaskFilterDto): Task[] {
        const { status, priority, createdAfter, createdBefore, isAvailable } = filters;

        return this.tasks.filter(task => (
            (!status || task.status === status) &&
            (!priority || task.priority === priority) &&
            (!createdAfter || task.createdAt >= createdAfter) &&
            (!createdBefore || task.createdAt <= createdBefore) &&
            (isAvailable === undefined || task.isAvailable === isAvailable)
        ));
    }
}
