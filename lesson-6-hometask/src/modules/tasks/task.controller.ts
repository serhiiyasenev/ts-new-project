import { Task } from './models/Task.model';
import { TaskService } from './task.service';
import { TaskCreateDto, TaskUpdateDto, TaskFilterDto } from './task.types';


export class TaskController {
    private readonly service: TaskService;

    constructor(service: TaskService) {
        this.service = service;
    }

    createTask(dto: TaskCreateDto): Task {
        try {
            const task = this.service.create(dto);
            console.log('✅ Task created successfully:', task.getTaskInfo());
            return task;
        } catch (error) {
            console.error('❌ Failed to create task:', error instanceof Error ? error.message : error);
            throw error;
        } 
    }

    getAllTasks(): Task[] {
        return this.service.getAll();
    }

    getTaskById(id: string): Task | undefined {
        try {
            const task = this.service.getById(id);
            if (!task) throw new Error(`Task with id "${id}" not found.`);
            return task;
        } catch (error) {
            console.error('❌ Failed to get task:', error instanceof Error ? error.message : error);
            throw error;
        }
    }

    updateTask(id: string, dto: TaskUpdateDto): Task {
        try {
            const updated = this.service.update(id, dto);
            console.log(`✅ Task ${id} updated successfully.`);
            return updated;
        } catch (error) {
            console.error('❌ Failed to update task:', error instanceof Error ? error.message : error);
            throw error;
        }
    }

    deleteTask(id: string): string {
        try {
            const result = this.service.delete(id);
            console.log('🗑️', result);
            return result;
        } catch (error) {
            console.error('❌ Failed to delete task:', error instanceof Error ? error.message : error);
            throw error;
        }
    }

    filterTasks(filters: TaskFilterDto): Task[] {
        return this.service.filter(filters);
    }
}
