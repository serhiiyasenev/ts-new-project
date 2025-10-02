import { Status } from './dto/status'
import { Priority } from './dto/priority'
import { Task } from './dto/task'
import { DEFAULT_STATUS, DEFAULT_PRIORITY, DEFAULT_DESCRIPTION } from './constants';
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
            const jsonData = JSON.parse(fileContent);
            
            // Validate and transform the data
            this.tasks = jsonData.tasks.map((task: any) => this.validateAndTransformTask(task));
        } catch (error) {
            console.error('Error loading tasks:', error);
            this.tasks = [];
        }
    }

    private validateAndTransformTask(taskData: any): Task {
        return {
            id: taskData.id,
            title: taskData.title,
            description: taskData.description || DEFAULT_DESCRIPTION,
            createdAt: new Date(taskData.createdAt),
            status: this.validateStatus(taskData.status),
            priority: this.validatePriority(taskData.priority),
            deadline: new Date(taskData.deadline)
        };
    }

    private validateStatus(status: string): Status {
        return Object.values(Status).includes(status as Status) 
            ? status as Status 
            : DEFAULT_STATUS;
    }

    private validatePriority(priority: string): Priority {
        return Object.values(Priority).includes(priority as Priority)
            ? priority as Priority
            : DEFAULT_PRIORITY;
    }

    // Get task by ID
    getTaskById(id: string): Task | undefined {
        return this.tasks.find(task => task.id === id);
    }

    // Create new task
    createTask(task: Omit<Task, 'id'>): Task {
        const newTask: Task = {
            ...task,
            id: this.generateId()
        };
        this.tasks.push(newTask);
        return newTask;
    }

    // Update task
    updateTask(id: string, updates: Partial<Omit<Task, 'id'>>): Task | undefined {
        const taskIndex = this.tasks.findIndex(task => task.id === id);
        if (taskIndex === -1) return undefined;

        this.tasks[taskIndex] = {
            ...this.tasks[taskIndex],
            ...updates
        };
        return this.tasks[taskIndex];
    }

    // Delete task
    deleteTask(id: string): boolean {
        const initialLength = this.tasks.length;
        this.tasks = this.tasks.filter(task => task.id !== id);
        return this.tasks.length !== initialLength;
    }

    // Filter tasks
    filterTasks(filters: {
        status?: Status;
        priority?: Priority;
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

    // Check if task is completed before deadline
    isTaskCompletedBeforeDeadline(id: string): boolean {
        const task = this.getTaskById(id);
        if (!task) return false;
        
        return task.status === Status.DONE && new Date() <= task.deadline;
    }

    private generateId(): string {
        return `task${Date.now()}${Math.floor(Math.random() * 1000)}`;
    }
}