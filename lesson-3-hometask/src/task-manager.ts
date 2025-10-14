import { Task } from './dto/task'
import { Status } from './dto/status';
import { Priority } from './dto/priority';
import { DEFAULT_STATUS, DEFAULT_PRIORITY, DEFAULT_DESCRIPTION } from './constants';
import { PrioritySchema, StatusSchema, TaskSchema } from './task-schema';
import * as fs from 'fs';

export class TaskManager {
    private tasks: Task[] = [];
    private readonly filePath: string;

    constructor(jsonFilePath: string) {
        this.filePath = jsonFilePath;
        this.loadTasks();
    }

    private loadTasks(): void {
    try {
        const fileContent = fs.readFileSync(this.filePath, 'utf-8');
        const jsonData: unknown = JSON.parse(fileContent);

        if (
            typeof jsonData === 'object' &&
            jsonData !== null &&
            'tasks' in jsonData &&
            Array.isArray((jsonData as any).tasks)
        ) {
            const tasksArray = (jsonData as { tasks: unknown[] }).tasks;
            this.tasks = tasksArray.map((task: unknown) => this.validateAndTransformTask(task));
        } else {
            this.tasks = [];
        }
    } catch (error) {
        console.error('Error loading tasks:', error);
        this.tasks = [];
    }
}

    private validateAndTransformTask(taskData: unknown): Task {
        try {
            const parsed = TaskSchema.partial({
                description: true
            }).parse(taskData);

            return {
                ...parsed,
                description: parsed.description || DEFAULT_DESCRIPTION,
                status: this.validateStatus(parsed.status),
                priority: this.validatePriority(parsed.priority)
            };
        } catch (error) {
            console.error('Invalid task data, skipping:', error);
            throw new Error('Task validation failed');
        }
    }

    private validateStatus(status: string): Status  {
        return StatusSchema.options.includes(status as Status)
            ? (status as any)
            : DEFAULT_STATUS;
    }

    private validatePriority(priority: string): Priority  {
        return PrioritySchema.options.includes(priority as Priority)
            ? (priority as any)
            : DEFAULT_PRIORITY;
    }

    getTaskById(id: string): Task | undefined {
        return this.tasks.find(task => task.id === id);
    }

    createTask(task: Omit<Task, 'id'>): Task {
        const newTask: Task = {
            ...task,
            id: this.generateId()
        };
        this.tasks.push(newTask);
        return newTask;
    }

    updateTask(id: string, updates: Partial<Omit<Task, 'id'>>): Task | undefined {
        const taskIndex = this.tasks.findIndex(task => task.id === id);
        if (taskIndex === -1) return undefined;

        this.tasks[taskIndex] = {
            ...this.tasks[taskIndex],
            ...updates
        };
        return this.tasks[taskIndex];
    }

    deleteTask(id: string): boolean {
        const initialLength = this.tasks.length;
        this.tasks = this.tasks.filter(task => task.id !== id);
        return this.tasks.length !== initialLength;
    }

    filterTasks(filters: {
        status?: string;
        priority?: string;
        createdAfter?: Date;
        createdBefore?: Date;
    }): Task[] {
        return this.tasks.filter(task => {
            if (filters.status && task.status !== filters.status) return false;
            if (filters.priority && task.priority !== filters.priority) return false;
            if (filters.createdAfter && task.createdAt < filters.createdAfter) return false;
            if (filters.createdBefore && task.createdAt > filters.createdBefore) return false;
            return true;
        });
    }

    isTaskCompletedBeforeDeadline(id: string): boolean {
        const task = this.getTaskById(id);
        if (!task) return false;
        return task.status === 'done' && new Date() <= task.deadline;
    }

    private generateId(): string {
        return `${Date.now()}${Math.floor(Math.random() * 1000)}`;
    }
}
