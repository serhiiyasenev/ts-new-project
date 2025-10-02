import { TaskManager } from './task-manager';
import { Status } from './dto/status';
import { Priority } from './dto/priority';
import * as path from 'path';

// Initialize TaskManager
const taskManager = new TaskManager(path.join(__dirname, 'tasks.json'));

// 1. Get task by ID
const task = taskManager.getTaskById('task1');
console.log('Task 1:', task);

// 2. Create new task
const newTask = taskManager.createTask({
    title: 'New Feature Implementation',
    description: 'Implement new feature "TaskManager"',
    createdAt: new Date(),
    status: Status.TODO,
    priority: Priority.HIGH,
    deadline: new Date('2025-10-20')
});
console.log('New task created:', newTask);

// 3. Update task
const updatedTask = taskManager.updateTask('task2', {
    status: Status.IN_PROGRESS,
    priority: Priority.HIGH
});
console.log('Updated task:', updatedTask);

// 4.1 Filter by status
console.log('\n--- Filtering by Status ---');
const inProgressTasks = taskManager.filterTasks({
    status: Status.IN_PROGRESS
});
console.log('Tasks in progress:', inProgressTasks);

// 4.2 Filter by creation date
console.log('\n--- Filtering by Creation Date ---');
const lastWeekTasks = taskManager.filterTasks({
    createdAfter: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Tasks from last 7 days
    createdBefore: new Date()
});
console.log('Tasks created in the last week:', lastWeekTasks);

// 4.3 Filter by priority
console.log('\n--- Filtering by Priority ---');
const highPriorityTasks = taskManager.filterTasks({
    priority: Priority.HIGH
});
console.log('High priority tasks:', highPriorityTasks);

// 4.4 Combined filters
console.log('\n--- Combined Filtering ---');
const urgentInProgressTasks = taskManager.filterTasks({
    status: Status.IN_PROGRESS,
    priority: Priority.HIGH,
    createdAfter: new Date(Date.now() - 24 * 60 * 60 * 1000) // Tasks from last 24 hours
});
console.log('Urgent tasks in progress from last 24 hours:', urgentInProgressTasks);

// 5. Check deadline
console.log('Is task3 completed before deadline:', taskManager.isTaskCompletedBeforeDeadline('task3'));
console.log('Is task7 completed before deadline:', taskManager.isTaskCompletedBeforeDeadline('task7'));
console.log('Is task10 completed before deadline:', taskManager.isTaskCompletedBeforeDeadline('task10'));

console.log('------------------------------------------------------');