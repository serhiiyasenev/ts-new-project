import { Task } from './models/Task.model';
import { Status, Priority, TaskCreateDto, TaskUpdateDto, TaskFilterDto } from './task.types';
import { v4 as uuidv4 } from 'uuid';

export class TaskService {
    private tasks: Task[] = [];

    create(dto: TaskCreateDto): Task {
        // Validate title early to avoid depending on runtime class implementation
        if (!dto.title || !dto.title.trim()) {
            throw new Error('Title cannot be empty');
        }
        if (dto.title.length < 3) {
            throw new Error('Title must be at least 3 characters long');
        }

        // Validate deadline if provided
        if (dto.deadline !== undefined && dto.deadline !== null && dto.deadline < new Date()) {
            throw new Error('Deadline cannot be in the past');
        }

        const task = new Task(
            uuidv4(),
            dto.title,
            dto.description || 'No description provided',
            dto.status || Status.TODO,
            dto.priority || Priority.MEDIUM,
            dto.isAvailable ?? true
        );

        // Only set a deadline when a non-null Date is provided
        if (dto.deadline !== undefined && dto.deadline !== null) {
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

        if (dto.title !== undefined) {
            // support both new accessor API and older method-style API
            if (typeof (task as any).setTitle === 'function') {
                (task as any).setTitle(dto.title);
            }
            else {
                (task as any).title = dto.title;
            }
        }

        if (dto.description !== undefined) {
            if (typeof (task as any).setDescription === 'function') {
                (task as any).setDescription(dto.description);
            }
            else {
                (task as any).description = dto.description;
            }
        }

        if (dto.status !== undefined) {
            if (typeof (task as any).setStatus === 'function') {
                (task as any).setStatus(dto.status);
            }
            else {
                (task as any).status = dto.status;
            }
        }

        if (dto.priority !== undefined) {
            if (typeof (task as any).setPriority === 'function') {
                (task as any).setPriority(dto.priority);
            }
            else {
                (task as any).priority = dto.priority;
            }
        }

        if (dto.isAvailable !== undefined) {
            if (typeof (task as any).setAvailability === 'function') {
                (task as any).setAvailability(dto.isAvailable);
            }
            else {
                (task as any).isAvailable = dto.isAvailable;
            }
        }

        if (dto.deadline !== undefined) {
            // treat explicit null as clearing the deadline
            const value = dto.deadline === null ? undefined : dto.deadline;
            if (typeof (task as any).setDeadline === 'function') {
                (task as any).setDeadline(value);
            }
            else {
                (task as any).deadline = value;
            }
        }

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
            if (filters.createdAfter && task.createdAt < filters.createdAfter) return false;
            if (filters.createdBefore && task.createdAt > filters.createdBefore) return false;
            if (filters.isAvailable !== undefined && task.isAvailable !== filters.isAvailable) return false;
            return true;
        });
    }
}
