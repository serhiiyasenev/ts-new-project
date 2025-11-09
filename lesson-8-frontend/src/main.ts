import './style.css';
import { TaskAPI } from './api';
import type { Priority, Status, Task } from './types';

// Capitalize first letter of a string
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Sort tasks by creation date (newest first)
export function sortTasksByCreatedDate(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// Convert FormData to task object
export function formDataToTask(formData: FormData): Omit<Task, 'id'> {
  const data = Object.fromEntries(formData);
  return {
    title: data.title as string,
    description: data.description as string,
    status: data.status as Status,
    priority: data.priority as Priority,
    createdAt: new Date(),
    deadline: data.deadline ? new Date(data.deadline as string) : null
  };
}

// Convert FormData to partial task update
export function formDataToPartialTask(formData: FormData): Partial<Omit<Task, 'id' | 'createdAt'>> {
  const data = Object.fromEntries(formData);
  return {
    title: data.title as string,
    description: data.description as string,
    status: data.status as Status,
    priority: data.priority as Priority,
    deadline: data.deadline ? new Date(data.deadline as string) : null
  };
}

export function updateTotalTasks(count: number): void {
  document.querySelector('#totalTasks')!.textContent = count.toString();
}

export function updateStatusCounts(tasks: Task[]): void {
  const counts = {
    todo: tasks.filter(t => t.status === 'todo').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    done: tasks.filter(t => t.status === 'done').length
  };

  document.querySelector('#todoCount')!.textContent = counts.todo.toString();
  document.querySelector('#inProgressCount')!.textContent = counts.in_progress.toString();
  document.querySelector('#doneCount')!.textContent = counts.done.toString();
}

export function updatePriorityCounts(tasks: Task[]): void {
  const counts = {
    high: tasks.filter(t => t.priority === 'high').length,
    medium: tasks.filter(t => t.priority === 'medium').length,
    low: tasks.filter(t => t.priority === 'low').length
  };

  document.querySelector('#highPriorityCount')!.textContent = counts.high.toString();
  document.querySelector('#mediumPriorityCount')!.textContent = counts.medium.toString();
  document.querySelector('#lowPriorityCount')!.textContent = counts.low.toString();
}

export function updateUpcomingDeadlines(tasks: Task[]): void {
  const upcomingDeadlines = tasks
    .filter(task => task.deadline && new Date(task.deadline) > new Date())
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
    .slice(0, 3);

  const container = document.querySelector('#upcomingDeadlines')!;
  container.innerHTML = '';
  
  if (upcomingDeadlines.length) {
    upcomingDeadlines.forEach(task => {
      const statItem = document.createElement('div');
      statItem.className = 'stat-item';
      
      const label = document.createElement('span');
      label.className = 'stat-label';
      const truncatedTitle = task.title.length > 20 
        ? task.title.slice(0, 20).trimEnd() + '...' 
        : task.title;
      label.textContent = truncatedTitle;
      
      const date = document.createElement('span');
      date.textContent = new Date(task.deadline!).toLocaleDateString();
      
      statItem.appendChild(label);
      statItem.appendChild(date);
      container.appendChild(statItem);
    });
  } else {
    const noDeadlines = document.createElement('div');
    noDeadlines.className = 'stat-item';
    noDeadlines.textContent = 'No upcoming deadlines';
    container.appendChild(noDeadlines);
  }
}

function updateStatistics(tasks: Task[]): void {
  updateTotalTasks(tasks.length);
  updateStatusCounts(tasks);
  updatePriorityCounts(tasks);
  updateUpcomingDeadlines(tasks);
}

export function createTaskHeader(task: Task): HTMLDivElement {
  const headerDiv = document.createElement('div');
  headerDiv.className = 'task-header';
  
  const h3 = document.createElement('h3');
  h3.textContent = task.title;
  headerDiv.appendChild(h3);
  
  const badgesDiv = document.createElement('div');
  badgesDiv.className = 'task-badges';
  
  const prioritySpan = document.createElement('span');
  prioritySpan.className = `badge priority-${task.priority}`;
  prioritySpan.textContent = capitalize(task.priority);
  badgesDiv.appendChild(prioritySpan);
  
  headerDiv.appendChild(badgesDiv);
  return headerDiv;
}

export function createTaskMeta(task: Task): HTMLDivElement {
  const metaDiv = document.createElement('div');
  metaDiv.className = 'task-meta';
  
  const createdSpan = document.createElement('span');
  createdSpan.textContent = `Created: ${new Date(task.createdAt).toLocaleDateString()}`;
  metaDiv.appendChild(createdSpan);
  
  if (task.deadline) {
    const deadlineSpan = document.createElement('span');
    deadlineSpan.textContent = `Deadline: ${new Date(task.deadline).toLocaleDateString()}`;
    metaDiv.appendChild(deadlineSpan);
  }
  
  return metaDiv;
}

function createTaskActions(task: Task, editTask: (id: string) => void, deleteTask: (id: string) => void): HTMLDivElement {
  const actionsDiv = document.createElement('div');
  actionsDiv.className = 'task-actions';
  
  const editBtn = document.createElement('button');
  editBtn.className = 'edit';
  editBtn.textContent = 'Edit';
  editBtn.addEventListener('click', () => editTask(task.id));
  actionsDiv.appendChild(editBtn);
  
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete';
  deleteBtn.textContent = 'Delete';
  deleteBtn.addEventListener('click', () => deleteTask(task.id));
  actionsDiv.appendChild(deleteBtn);
  
  return actionsDiv;
}

function attachDragEvents(taskEl: HTMLElement, taskId: string): void {
  taskEl.addEventListener('dragstart', (e) => {
    taskEl.classList.add('dragging');
    e.dataTransfer?.setData('text/plain', taskId);
  });

  taskEl.addEventListener('dragend', () => {
    taskEl.classList.remove('dragging');
  });
}

function createTaskElement(task: Task, editTask: (id: string) => void, deleteTask: (id: string) => void): HTMLDivElement {
  const taskEl = document.createElement('div');
  taskEl.className = 'task-item';
  taskEl.setAttribute('draggable', 'true');
  taskEl.dataset.id = task.id;
  
  // Add components
  taskEl.appendChild(createTaskHeader(task));
  
  const descP = document.createElement('p');
  descP.textContent = task.description;
  taskEl.appendChild(descP);
  
  taskEl.appendChild(createTaskMeta(task));
  taskEl.appendChild(createTaskActions(task, editTask, deleteTask));
  
  // Attach drag events
  attachDragEvents(taskEl, task.id);
  
  return taskEl;
}

function clearTaskLists(): void {
  document.querySelector('#todoList')!.innerHTML = '';
  document.querySelector('#inProgressList')!.innerHTML = '';
  document.querySelector('#doneList')!.innerHTML = '';
}

function attachTaskToColumn(taskEl: HTMLElement, status: Status): void {
  const columnMap = {
    todo: '#todoList',
    in_progress: '#inProgressList',
    done: '#doneList'
  };
  
  document.querySelector(columnMap[status])!.appendChild(taskEl);
}

function renderTasks(tasks: Task[], editTask: (id: string) => void, deleteTask: (id: string) => void): void {
  updateStatistics(tasks);
  clearTaskLists();
  
  const sortedTasks = sortTasksByCreatedDate(tasks);
  sortedTasks.forEach(task => {
    const taskEl = createTaskElement(task, editTask, deleteTask);
    attachTaskToColumn(taskEl, task.status);
  });
}

function fillEditForm(form: HTMLFormElement, task: Task): void {
  (form.elements.namedItem('title') as HTMLInputElement).value = task.title;
  (form.elements.namedItem('description') as HTMLTextAreaElement).value = task.description;
  (form.elements.namedItem('status') as HTMLSelectElement).value = task.status;
  (form.elements.namedItem('priority') as HTMLSelectElement).value = task.priority;
  (form.elements.namedItem('deadline') as HTMLInputElement).value = 
    task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : '';
}

async function init() {
  const taskForm = document.querySelector<HTMLFormElement>('#taskForm')!;

  // Load and render tasks
  async function loadTasks() {
    try {
      const tasks = await TaskAPI.getAllTasks();
      renderTasks(tasks, editTask, deleteTask);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  }

  // Delete task handler
  const deleteTask = async (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await TaskAPI.deleteTask(id);
        await loadTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  // Edit task handler
  const editTask = async (id: string) => {
    try {
      const task = await TaskAPI.getTaskById(id);
      const modalOverlay = document.querySelector('.modal-overlay');
      const form = document.querySelector('.task-edit-form') as HTMLFormElement;
      
      // Fill form with task data
      fillEditForm(form, task);

      // Show modal
      modalOverlay?.classList.add('active');
      form?.classList.add('active');

      // Controller to auto-clean listeners on cancel/submit
      const controller = new AbortController();
      const { signal } = controller;

      // Handle form submission
      const handleSubmit = async (e: Event) => {
        e.preventDefault();
        const formData = new FormData(form);
        const updates = formDataToPartialTask(formData);
        await TaskAPI.updateTask(task.id, { ...task, ...updates });
        modalOverlay?.classList.remove('active');
        form?.classList.remove('active');
        await loadTasks();
      };

      // Overlay click handler to close modal when clicking outside
      function overlayClickHandler(e: Event) {
        if (e.target === modalOverlay) handleCancel();
      }

      // Handle cancel
      const handleCancel = () => {
        modalOverlay?.classList.remove('active');
        form?.classList.remove('active');
        // Abort all listeners associated with this modal interaction
        controller.abort();
      };

      form.addEventListener('submit', handleSubmit, { once: true, signal });
      form.querySelector('.cancel')?.addEventListener('click', handleCancel, { once: true, signal });
      modalOverlay?.addEventListener('click', overlayClickHandler, { once: true, signal });
    } catch (error) {
      console.error('Error editing task:', error);
    }
  };

  // Handle form submission
  taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(taskForm);
    const newTask = formDataToTask(formData);

    try {
      await TaskAPI.createTask(newTask);
      taskForm.reset();
      await loadTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  });

  // Setup drag and drop for columns
  const columns = document.querySelectorAll('.task-column');
  columns.forEach(column => {
    column.addEventListener('dragover', (e: Event) => {
      e.preventDefault();
      const dragEvent = e as DragEvent;
      if (dragEvent.dataTransfer) {
        dragEvent.dataTransfer.dropEffect = 'move';
      }
      column.classList.add('drag-over');
    });

    column.addEventListener('dragleave', () => {
      column.classList.remove('drag-over');
    });

    column.addEventListener('drop', async (e: Event) => {
      e.preventDefault();
      column.classList.remove('drag-over');
      
      const dragEvent = e as DragEvent;
      const taskId = dragEvent.dataTransfer?.getData('text/plain');
      if (!taskId) return;

      const newStatus = (column as HTMLElement).dataset.status || 'todo';
      
      try {
        const task = await TaskAPI.getTaskById(taskId);
        await TaskAPI.updateTask(taskId, { ...task, status: newStatus as Status });
        await loadTasks();
      } catch (error) {
        console.error('Error updating task status:', error);
      }
    });
  });

  // Initial load
  await loadTasks();
}

// Only run init if not in test environment
if (import.meta.env.MODE !== 'test') {
  init();
}

// Helper to create minimal DOM for Vitest
export function setupTestDom(): void {
  document.body.innerHTML = `
    <div id="modal-overlay"></div>
    <form id="taskForm"></form>
    <form id="edit-task-form"></form>
    <span id="totalTasks">0</span>
    <span id="todoCount">0</span>
    <span id="inProgressCount">0</span>
    <span id="doneCount">0</span>
    <span id="lowPriorityCount">0</span>
    <span id="mediumPriorityCount">0</span>
    <span id="highPriorityCount">0</span>
    <div id="upcomingDeadlines"></div>
    <div id="todoList" data-status="todo"></div>
    <div id="inProgressList" data-status="in_progress"></div>
    <div id="doneList" data-status="done"></div>
  `;
}
