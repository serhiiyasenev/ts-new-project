import { describe, it, expect } from 'vitest';
import { TaskService } from '../tasks/task.service';
import { Status, Priority } from '../tasks/task.types';


describe('TaskService full test suite', () => {
    const service = new TaskService();

    // ---------- CREATE ----------
    it('should create a task successfully', () => {
        const task = service.create({
            title: 'Create API endpoint',
            description: 'Implement POST /api/tasks',
            status: Status.TODO,
            priority: Priority.HIGH,
            deadline: new Date(Date.now() + 86400000)
        });
        expect(task.title).toBe('Create API endpoint');
    });

    it('should throw error when creating task with empty title', () => {
        expect(() =>
            service.create({
                title: ' ',
                deadline: new Date(Date.now() + 86400000)
            })
        ).toThrow('Title cannot be empty');
    });

    it('should throw error when creating task with past deadline', () => {
        expect(() =>
            service.create({
                title: 'Invalid deadline',
                deadline: new Date(Date.now() - 10000)
            })
        ).toThrow('Deadline cannot be in the past');
    });

    // ---------- GET ALL ----------
    it('should return all tasks', () => {
        const all = service.getAll();
        expect(all.length).toBeGreaterThan(0);
    });

    it('should return array of Task objects', () => {
        const all = service.getAll();
        expect(all.every(t => typeof t.getTaskInfo === 'function')).toBe(true);
    });

    // ---------- GET BY ID ----------
    it('should get a task by id', () => {
        const first = service.getAll()[0];
        const found = service.getById(first.id);
        expect(found?.id).toBe(first.id);
    });

    it('should return undefined for non-existent id', () => {
        const found = service.getById('non-existent-id');
        expect(found).toBeUndefined();
    });

    // ---------- UPDATE ----------
    it('should update title of existing task', () => {
        const first = service.getAll()[0];
        const updated = service.update(first.id, { title: 'Updated Title' });
        expect(updated.title).toBe('Updated Title');
    });

    it('should update multiple fields (status, priority)', () => {
        const first = service.getAll()[0];
        const updated = service.update(first.id, {
            status: Status.IN_PROGRESS,
            priority: Priority.LOW
        });
        expect(updated.status).toBe(Status.IN_PROGRESS);
        expect(updated.priority).toBe(Priority.LOW);
    });

    it('should throw error when updating with empty title', () => {
        const first = service.getAll()[0];
        expect(() => service.update(first.id, { title: ' ' }))
            .toThrow('Title cannot be empty');
    });

    it('should throw error when updating with past deadline', () => {
        const first = service.getAll()[0];
        expect(() =>
            service.update(first.id, { deadline: new Date(Date.now() - 1000) })
        ).toThrow('Deadline cannot be in the past');
    });

    // ---------- DELETE ----------
    it('should delete existing task', () => {
        const task = service.create({
            title: 'Delete me',
            status: Status.TODO,
            priority: Priority.LOW,
            deadline: new Date(Date.now() + 86400000)
        });
        const message = service.delete(task.id);
        expect(message).toContain('deleted successfully');
    });

    it('should throw error when deleting non-existent task', () => {
        expect(() => service.delete('fake-id')).toThrow('not found');
    });

    // ---------- FILTER ----------
    it('should filter tasks by status', () => {
        const filtered = service.filter({ status: Status.IN_PROGRESS });
        expect(filtered.every(t => t.status === Status.IN_PROGRESS)).toBe(true);
    });

    it('should filter tasks by priority', () => {
        const filtered = service.filter({ priority: Priority.LOW });
        expect(filtered.every(t => t.priority === Priority.LOW)).toBe(true);
    });

    it('should filter tasks by availability', () => {
        const filtered = service.filter({ isAvailable: true });
        expect(filtered.every(t => t.isAvailable === true)).toBe(true);
    });

    // ---------- COMBINATIONS ----------
    it('should create, update, then filter task by new status', () => {
        const task = service.create({
            title: 'Chain test',
            status: Status.TODO,
            priority: Priority.MEDIUM,
            deadline: new Date(Date.now() + 86400000)
        });

        service.update(task.id, { status: Status.DONE });
        const filtered = service.filter({ status: Status.DONE });
        expect(filtered.some(t => t.id === task.id)).toBe(true);
    });

    it('should create and then delete, verify it no longer exists', () => {
        const task = service.create({
            title: 'Temp delete test',
            status: Status.TODO,
            priority: Priority.HIGH,
            deadline: new Date(Date.now() + 86400000)
        });

        service.delete(task.id);
        expect(service.getById(task.id)).toBeUndefined();
    });

    it('should handle multiple task creation correctly', () => {
        const countBefore = service.getAll().length;
        for (let i = 0; i < 5; i++) {
            service.create({
                title: `Batch Task ${i}`,
                status: Status.TODO,
                priority: Priority.MEDIUM,
                deadline: new Date(Date.now() + (i + 1) * 86400000)
            });
        }
        expect(service.getAll().length).toBeGreaterThan(countBefore);
    });

    it('should maintain unique IDs for each task', () => {
        const tasks = service.getAll();
        const ids = tasks.map(t => t.id);
        const uniqueIds = new Set(ids);
        expect(uniqueIds.size).toBe(ids.length);
    });

    it('should update then delete task and confirm removal', () => {
        const task = service.create({
            title: 'Lifecycle test',
            status: Status.TODO,
            priority: Priority.HIGH,
            deadline: new Date(Date.now() + 86400000)
        });

        service.update(task.id, { title: 'Updated lifecycle' });
        service.delete(task.id);
        expect(service.getById(task.id)).toBeUndefined();
    });
});
