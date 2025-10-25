import { Task } from './models/Task.model';
import { Status, Priority, TaskCreateDto, TaskUpdateDto, TaskFilterDto } from './task.types';
import { v4 as uuidv4 } from 'uuid';

export class TaskService {
    private tasks: Task[] = [];

    create(dto: TaskCreateDto): Task {
        const task = new Task(
            uuidv4(),
            dto.title,
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

        if (dto.title !== undefined) task.title = dto.title;
        if (dto.description !== undefined) task.description = dto.description;
        if (dto.status !== undefined) task.status = dto.status;
        if (dto.priority !== undefined) task.priority = dto.priority;
        if (dto.isAvailable !== undefined) task.availability = dto.isAvailable;
        if (dto.deadline !== undefined) task.deadline = dto.deadline;

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
        return this.tasks.filter(task => {
            if (filters.status && task.status !== filters.status) return false;
            if (filters.priority && task.priority !== filters.priority) return false;
            if (filters.isAvailable !== undefined && task.isAvailable !== filters.isAvailable) return false;
            return true;
        });
    }
}
