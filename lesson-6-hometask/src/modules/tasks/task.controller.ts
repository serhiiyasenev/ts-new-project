import { TaskService } from './task.service';
import { TaskCreateDto } from '../../dto/task-create.dto';
import { TaskUpdateDto } from '../../dto/task-update.dto';
import { TaskFilterDto } from '../../dto/task-filter.dto';
import { Task } from '../../dto/task';

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
        } catch (error: any) {
            console.error('❌ Failed to create task:', error.message);
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
        } catch (error: any) {
            console.error(error.message);
            throw error;
        }
    }

    updateTask(id: string, dto: TaskUpdateDto): Task {
        try {
            const updated = this.service.update(id, dto);
            console.log(`✅ Task ${id} updated successfully.`);
            return updated;
        } catch (error: any) {
            console.error('❌ Failed to update task:', error.message);
            throw error;
        }
    }

    deleteTask(id: string): string {
        try {
            const result = this.service.delete(id);
            console.log('🗑️', result);
            return result;
        } catch (error: any) {
            console.error('❌ Failed to delete task:', error.message);
            throw error;
        }
    }

    filterTasks(filters: TaskFilterDto): Task[] {
        return this.service.filter(filters);
    }
}
