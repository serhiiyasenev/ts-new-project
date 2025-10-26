import { describe, it, expect, beforeEach } from 'vitest';
import { TaskService } from '../tasks/task.service';
import { Status, Priority, Severity } from '../tasks/task.types';
import { Bug } from '../tasks/models/Bug.model';
import { Story } from '../tasks/models/Story.model';
import { Epic } from '../tasks/models/Epic.model';
import { Subtask } from '../tasks/models/Subtask.model';

describe('TaskService full test suite', () => {
    let service: TaskService;

    beforeEach(() => {
        service = new TaskService();
    });

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
        service.create({ title: 'Test task 1' });
        const all = service.getAll();
        expect(all.length).toBeGreaterThan(0);
    });

    it('should return array of Task objects', () => {
        service.create({ title: 'Test task 2' });
        const all = service.getAll();
        expect(all.every(t => typeof t.getTaskInfo === 'function')).toBe(true);
    });

    // ---------- GET BY ID ----------
    it('should get a task by id', () => {
        const task = service.create({ title: 'Get by ID test' });
        const found = service.getById(task.id);
        expect(found?.id).toBe(task.id);
    });

    it('should return undefined for non-existent id', () => {
        const found = service.getById('non-existent-id');
        expect(found).toBeUndefined();
    });

    // ---------- UPDATE ----------
    it('should update title of existing task', () => {
        const task = service.create({ title: 'Original title' });
    const updated = service.update(task.id, { title: 'Updated Title' });
    expect(updated.title).toBe('Updated Title');
    });

    it('should update multiple fields (status, priority)', () => {
        const task = service.create({ title: 'Multi-update test' });
        const updated = service.update(task.id, {
            status: Status.IN_PROGRESS,
            priority: Priority.LOW
        });
        expect(updated.status).toBe(Status.IN_PROGRESS);
        expect(updated.priority).toBe(Priority.LOW);
    });

    it('should throw error when updating with empty title', () => {
        const task = service.create({ title: 'Valid title' });
        expect(() => service.update(task.id, { title: ' ' }))
            .toThrow('Title cannot be empty');
    });

    it('should throw error when updating with past deadline', () => {
        const task = service.create({ title: 'Deadline test' });
        expect(() =>
            service.update(task.id, { deadline: new Date(Date.now() - 1000) })
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

    // ---------- EDGE CASES ----------
    it('should create task with default values when optional fields are omitted', () => {
        const task = service.create({ title: 'Minimal task' });
    expect(task.title).toBe('Minimal task');
    expect(task.description).toBe('No description provided');
    expect(task.status).toBe(Status.TODO);
    expect(task.priority).toBe(Priority.MEDIUM);
    expect(task.isAvailable).toBe(true);
    expect(task.deadline).toBeUndefined();
    });

    it('should throw error when creating task with title less than 3 characters', () => {
        expect(() => service.create({ title: 'AB' }))
            .toThrow('Title must be at least 3 characters long');
    });

    it('should handle task creation with exact 3 character title', () => {
        const task = service.create({ title: 'ABC' });
    expect(task.title).toBe('ABC');
    });

    it('should update task description only', () => {
        const task = service.create({ title: 'Test task' });
        const updated = service.update(task.id, { description: 'New description' });
    expect(updated.description).toBe('New description');
    expect(updated.title).toBe('Test task');
    });

    it('should update task with new deadline', () => {
        const task = service.create({
            title: 'Task with deadline',
            deadline: new Date(Date.now() + 86400000)
        });
    const originalDeadline = task.deadline;
    expect(originalDeadline).toBeDefined();
        
        const newDeadline = new Date(Date.now() + 172800000); // 2 days from now
    const updated = service.update(task.id, { deadline: newDeadline });
    expect(updated.deadline).toEqual(newDeadline);
    expect(updated.deadline).not.toEqual(originalDeadline);
    });

    it('should create task without deadline and deadline remains undefined', () => {
        const task = service.create({
            title: 'Task without deadline',
            description: 'No deadline set'
        });
    expect(task.deadline).toBeUndefined();
        
        // Update other fields but don't touch deadline
    const updated = service.update(task.id, { description: 'Updated description' });
    expect(updated.deadline).toBeUndefined();
    });

    it('should add deadline to task that was created without one', () => {
        const task = service.create({
            title: 'Task without deadline initially'
        });
    expect(task.deadline).toBeUndefined();
        
        const futureDeadline = new Date(Date.now() + 86400000);
    const updated = service.update(task.id, { deadline: futureDeadline });
    expect(updated.deadline).toEqual(futureDeadline);
    expect(updated.deadline).toBeDefined();
    });

    it('should throw error when trying to update deadline to past date', () => {
        const task = service.create({
            title: 'Task with valid deadline',
            deadline: new Date(Date.now() + 86400000)
        });
        
        const pastDate = new Date(Date.now() - 1000);
        expect(() => service.update(task.id, { deadline: pastDate }))
            .toThrow('Deadline cannot be in the past');
    });

    it('should handle filter with no matches', () => {
        service.create({ title: 'Task 1', status: Status.TODO });
        const filtered = service.filter({ status: Status.DONE });
        expect(filtered.length).toBe(0);
    });

    it('should filter with multiple criteria', () => {
        service.create({
            title: 'Match task',
            status: Status.IN_PROGRESS,
            priority: Priority.HIGH,
            isAvailable: true
        });
        service.create({
            title: 'No match',
            status: Status.IN_PROGRESS,
            priority: Priority.LOW,
            isAvailable: true
        });

        const filtered = service.filter({
            status: Status.IN_PROGRESS,
            priority: Priority.HIGH,
            isAvailable: true
        });
    expect(filtered.length).toBe(1);
    expect(filtered[0].title).toBe('Match task');
    });

    it('should maintain updatedAt timestamp after updates', async () => {
        const task = service.create({ title: 'Timestamp test' });
    const initialUpdatedAt = task.updatedAt.getTime();
        
        // Small delay to ensure different timestamp
        await new Promise(res => setTimeout(res, 5));
        
        service.update(task.id, { title: 'Updated title' });
    expect(task.updatedAt.getTime()).toBeGreaterThan(initialUpdatedAt);
    });

    it('should handle empty filter (return all tasks)', () => {
        service.create({ title: 'Task 1' });
        service.create({ title: 'Task 2' });
        const filtered = service.filter({});
        expect(filtered.length).toBe(2);
    });

    it('should preserve task availability when not updated', () => {
        const task = service.create({ title: 'Available task', isAvailable: false });
    expect(task.isAvailable).toBe(false);
        
        const updated = service.update(task.id, { title: 'Updated title' });
    expect(updated.isAvailable).toBe(false);
    });

    it('should update isAvailable field correctly', () => {
        const task = service.create({ title: 'Task', isAvailable: true });
    expect(task.isAvailable).toBe(true);
        
        const updated = service.update(task.id, { isAvailable: false });
    expect(updated.isAvailable).toBe(false);
    });

    // ---------- VALIDATION TESTS ----------
    it('should throw error when updating non-existent task', () => {
        expect(() => service.update('fake-id-999', { title: 'New title' }))
            .toThrow('Task with id "fake-id-999" not found');
    });

    it('should throw error when updating with title less than 3 characters', () => {
        const task = service.create({ title: 'Valid task' });
        expect(() => service.update(task.id, { title: 'AB' }))
            .toThrow('Title must be at least 3 characters long');
    });

    it('should allow future deadline', () => {
        const futureDate = new Date(Date.now() + 1000000);
    const task = service.create({ title: 'Future task', deadline: futureDate });
    expect(task.deadline).toEqual(futureDate);
    });

    it('should throw error when setting deadline to past date on creation', () => {
        const pastDate = new Date(Date.now() - 1000);
        expect(() => service.create({ title: 'Past task', deadline: pastDate }))
            .toThrow('Deadline cannot be in the past');
    });

    // ---------- SPECIALIZED TASK TYPES ----------
    it('should create and verify Bug task with severity', () => {
        const bug = new Bug(
            Severity.CRITICAL,
            'bug-1',
            'Critical bug',
            'System crash on login',
            Status.TODO,
            Priority.HIGH,
            true
        );
        expect(bug.severity).toBe(Severity.CRITICAL);
        expect(bug.getTaskInfo()).toContain('CRITICAL');
        expect(bug.getTaskInfo()).toContain('Critical bug');
    });

    it('should create Bug with all severity levels', () => {
        const minorBug = new Bug(
            Severity.MINOR,
            'bug-minor',
            'Minor bug',
            'Typo in text',
            Status.TODO,
            Priority.LOW,
            true
        );
        expect(minorBug.severity).toBe(Severity.MINOR);

        const majorBug = new Bug(
            Severity.MAJOR,
            'bug-major',
            'Major bug',
            'Performance issue',
            Status.IN_PROGRESS,
            Priority.MEDIUM,
            true
        );
        expect(majorBug.severity).toBe(Severity.MAJOR);

        const criticalBug = new Bug(
            Severity.CRITICAL,
            'bug-critical',
            'Critical bug',
            'Data loss',
            Status.TODO,
            Priority.HIGH,
            true
        );
        expect(criticalBug.severity).toBe(Severity.CRITICAL);
    });

    it('should create and verify Story task with story points', () => {
        const story = new Story(
            5,
            'story-1',
            'User story',
            'As a user, I want to login',
            Status.TODO,
            Priority.HIGH,
            true
        );
        expect(story.storyPoints).toBe(5);
        expect(story.getTaskInfo()).toContain('5 points');
    });

    it('should throw error when creating Story with negative points', () => {
        expect(() => new Story(
            -5,
            'story-invalid',
            'Invalid story',
            'Should fail',
            Status.TODO,
            Priority.LOW,
            true
        )).toThrow('Story points cannot be negative');
    });

    it('should create Story with zero points', () => {
        const story = new Story(
            0,
            'story-zero',
            'Zero point story',
            'Quick task',
            Status.TODO,
            Priority.LOW,
            true
        );
        expect(story.storyPoints).toBe(0);
    });

    it('should create and verify Epic task with children', () => {
        const epic = new Epic(
            ['task-1', 'task-2', 'task-3'],
            'epic-1',
            'Feature epic',
            'Complete authentication feature',
            Status.IN_PROGRESS,
            Priority.HIGH,
            true
        );
    expect(epic.getChildren().length).toBe(3);
        expect(epic.getTaskInfo()).toContain('contains 3 tasks');
    });

    it('should create Epic with no children', () => {
        const epic = new Epic(
            [],
            'epic-empty',
            'Empty epic',
            'No tasks yet',
            Status.TODO,
            Priority.LOW,
            true
        );
        expect(epic.getTaskInfo()).toContain('contains 0 tasks');
    });

    it('should create and verify Subtask with parent reference', () => {
        const subtask = new Subtask(
            'parent-task-id',
            'subtask-1',
            'Subtask title',
            'Subtask description',
            Status.TODO,
            Priority.MEDIUM,
            true
        );
    expect(subtask.parentId).toBe('parent-task-id');
    expect(subtask.getTaskInfo()).toContain('Subtask of parent-task-id');
    });

    // ---------- TASK INFO TESTS ----------
    it('should generate correct task info string', () => {
        const task = service.create({
            title: 'Info test',
            description: 'Testing info method',
            status: Status.IN_PROGRESS,
            priority: Priority.HIGH
        });
        const info = task.getTaskInfo();
    expect(info).toContain('Info test');
    expect(info).toContain('Testing info method');
        expect(info).toContain('in_progress');
        expect(info).toContain('high');
    });

    // ---------- BOUNDARY TESTS ----------
    it('should handle very long title', () => {
        const longTitle = 'A'.repeat(1000);
    const task = service.create({ title: longTitle });
    expect(task.title).toBe(longTitle);
    });

    it('should handle very long description', () => {
        const longDesc = 'D'.repeat(10000);
    const task = service.create({ title: 'Test', description: longDesc });
    expect(task.description).toBe(longDesc);
    });

    it('should handle task with all enum values', () => {
        // Test all status values
        const todoTask = service.create({ title: 'TODO task', status: Status.TODO });
    expect(todoTask.status).toBe(Status.TODO);

        const inProgressTask = service.create({ title: 'In Progress task', status: Status.IN_PROGRESS });
    expect(inProgressTask.status).toBe(Status.IN_PROGRESS);

        const doneTask = service.create({ title: 'Done task', status: Status.DONE });
    expect(doneTask.status).toBe(Status.DONE);

        // Test all priority values
        const lowPriorityTask = service.create({ title: 'Low priority', priority: Priority.LOW });
    expect(lowPriorityTask.priority).toBe(Priority.LOW);

        const mediumPriorityTask = service.create({ title: 'Medium priority', priority: Priority.MEDIUM });
    expect(mediumPriorityTask.priority).toBe(Priority.MEDIUM);

        const highPriorityTask = service.create({ title: 'High priority', priority: Priority.HIGH });
    expect(highPriorityTask.priority).toBe(Priority.HIGH);
    });

    it('should maintain task count correctly after multiple operations', () => {
        const initial = service.getAll().length;
        
        const task1 = service.create({ title: 'Task 1' });
        const task2 = service.create({ title: 'Task 2' });
        const task3 = service.create({ title: 'Task 3' });
        
        expect(service.getAll().length).toBe(initial + 3);
        
        service.delete(task2.id);
        expect(service.getAll().length).toBe(initial + 2);
        
        service.delete(task1.id);
        service.delete(task3.id);
        expect(service.getAll().length).toBe(initial);
    });

    // ---------- DATE FILTER TESTS ----------
    it('should filter tasks created after specific date', async () => {
        const task1 = service.create({ title: 'Old task' });
        
        // Wait a bit to ensure different timestamp (use async delay instead of busy-wait)
        await new Promise(res => setTimeout(res, 10));

        const cutoffDate = new Date();

        // Wait again
        await new Promise(res => setTimeout(res, 10));

        const task2 = service.create({ title: 'New task' });
        
        const filtered = service.filter({ createdAfter: cutoffDate });
        expect(filtered.some(t => t.id === task2.id)).toBe(true);
        expect(filtered.some(t => t.id === task1.id)).toBe(false);
    });

    it('should filter tasks created before specific date', async () => {
        const task1 = service.create({ title: 'First task' });
        
        // Wait a bit (use async delay)
        await new Promise(res => setTimeout(res, 10));
        
        const cutoffDate = new Date();
        
        // Wait again
        await new Promise(res => setTimeout(res, 10));
        
        const task2 = service.create({ title: 'Second task' });
        
        const filtered = service.filter({ createdBefore: cutoffDate });
        expect(filtered.some(t => t.id === task1.id)).toBe(true);
        expect(filtered.some(t => t.id === task2.id)).toBe(false);
    });

    it('should filter tasks created within date range', async () => {
        const task1 = service.create({ title: 'Before range' });
        
        // Wait
        await new Promise(resolve => setTimeout(resolve, 10));
        
        const startDate = new Date();
        
        // Wait
        await new Promise(resolve => setTimeout(resolve, 10));
        
        const task2 = service.create({ title: 'In range' });
        
        // Wait
        await new Promise(resolve => setTimeout(resolve, 10));
        
        const endDate = new Date();
        
        // Wait
        await new Promise(resolve => setTimeout(resolve, 10));
        
        const task3 = service.create({ title: 'After range' });
        
        const filtered = service.filter({ 
            createdAfter: startDate, 
            createdBefore: endDate 
        });
        
        expect(filtered.some(t => t.id === task2.id)).toBe(true);
        expect(filtered.some(t => t.id === task1.id)).toBe(false);
        expect(filtered.some(t => t.id === task3.id)).toBe(false);
    });

    it('should combine date filters with other filters', async () => {
        const task1 = service.create({ 
            title: 'Old high priority', 
            priority: Priority.HIGH 
        });
        
        // Wait
        await new Promise(resolve => setTimeout(resolve, 10));
        
        const cutoffDate = new Date();
        
        // Wait
        await new Promise(resolve => setTimeout(resolve, 10));
        
        const task2 = service.create({ 
            title: 'New high priority', 
            priority: Priority.HIGH 
        });
        
        const task3 = service.create({ 
            title: 'New low priority', 
            priority: Priority.LOW 
        });
        
        const filtered = service.filter({ 
            createdAfter: cutoffDate,
            priority: Priority.HIGH
        });
        
        expect(filtered.length).toBe(1);
        expect(filtered[0].id).toBe(task2.id);
    });

    it('should return empty array when no tasks match date filter', () => {
        service.create({ title: 'Task 1' });
        service.create({ title: 'Task 2' });
        
        const futureDate = new Date(Date.now() + 100000);
        const filtered = service.filter({ createdAfter: futureDate });
        
        expect(filtered.length).toBe(0);
    });

    it('should filter by status and availability combination', () => {
        service.create({ 
            title: 'Available TODO', 
            status: Status.TODO, 
            isAvailable: true 
        });
        service.create({ 
            title: 'Unavailable TODO', 
            status: Status.TODO, 
            isAvailable: false 
        });
        service.create({ 
            title: 'Available IN_PROGRESS', 
            status: Status.IN_PROGRESS, 
            isAvailable: true 
        });
        
        const filtered = service.filter({ 
            status: Status.TODO, 
            isAvailable: true 
        });
        
    expect(filtered.length).toBe(1);
    expect(filtered[0].title).toBe('Available TODO');
    });

    it('should filter by all criteria simultaneously', async () => {
        const task1 = service.create({
            title: 'Perfect match',
            status: Status.IN_PROGRESS,
            priority: Priority.HIGH,
            isAvailable: true
        });
        
        // Wait
        await new Promise(res => setTimeout(res, 10));

        const afterDate = new Date();
        
        service.create({
            title: 'Wrong status',
            status: Status.TODO,
            priority: Priority.HIGH,
            isAvailable: true
        });
        
        service.create({
            title: 'Wrong priority',
            status: Status.IN_PROGRESS,
            priority: Priority.LOW,
            isAvailable: true
        });
        
        service.create({
            title: 'Wrong availability',
            status: Status.IN_PROGRESS,
            priority: Priority.HIGH,
            isAvailable: false
        });
        
        const filtered = service.filter({
            status: Status.IN_PROGRESS,
            priority: Priority.HIGH,
            isAvailable: true,
            createdBefore: afterDate
        });
        
        expect(filtered.length).toBe(1);
        expect(filtered[0].id).toBe(task1.id);
    });

    it('should return all tasks when filter object is empty', () => {
        service.create({ title: 'Task A', status: Status.TODO });
        service.create({ title: 'Task B', status: Status.IN_PROGRESS });
        service.create({ title: 'Task C', status: Status.DONE });
        
        const allTasks = service.getAll();
        const filtered = service.filter({});
        
        expect(filtered.length).toBe(allTasks.length);
        expect(filtered).toEqual(allTasks);
    });
});
