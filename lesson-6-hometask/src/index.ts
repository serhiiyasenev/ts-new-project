import { TaskController } from './modules/tasks/task.controller';
import { TaskService } from './modules/tasks/task.service';
import { Status, Priority } from './modules/tasks/task.types';

const service = new TaskService();
const controller = new TaskController(service);

const task1 = controller.createTask({
    title: 'Implement authentication',
    description: 'Create login and register endpoints',
    status: Status.TODO,
    priority: Priority.HIGH,
    deadline: new Date(Date.now() + 3 * 86400000)
});

const task2 = controller.createTask({
    title: 'Write unit tests',
    description: 'Cover authentication module with tests',
    status: Status.IN_PROGRESS,
    priority: Priority.MEDIUM,
    deadline: new Date(Date.now() + 7 * 86400000)
});

const task3 = controller.createTask({
    title: 'Test task 3',
    description: 'Just a test task',
    status: Status.DONE,
    priority: Priority.LOW,
    deadline: new Date(Date.now())
});


console.log('\nAll Tasks:');
controller.getAllTasks().forEach(t => console.log(t.getTaskInfo()));

controller.updateTask(task1.id, { status: Status.IN_PROGRESS, title: 'Implement auth endpoints' });

console.log('\nFiltered Tasks (IN_PROGRESS):');
controller.filterTasks({ status: Status.IN_PROGRESS }).forEach(t => console.log(t.getTaskInfo()));

console.log('🗑️ Deleting task2');
controller.deleteTask(task2.id);