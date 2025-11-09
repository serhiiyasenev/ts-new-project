import './style.css';
import { TaskAPI } from './api';
import type { Status, Task } from './types';
import { createTaskHeader, createTaskMeta, createTaskActions } from './dom-utils';
import { updateStatistics } from './stats';
import { formDataToTask, formDataToPartialTask, fillEditForm } from './form-utils';

// Sort tasks by creation date (newest first)
export function sortTasksByCreatedDate(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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

async function init() {
  const taskForm = document.querySelector<HTMLFormElement>('#taskForm')!;
  const backendOk = await checkBackendHealth();
  const backendStatus = document.querySelector<HTMLDivElement>('#backendStatus')!;

  if (!backendOk) {
    backendStatus.style.display = 'block';
    console.error('Backend is not available at http://localhost:3000');
    return;
  } else {
    backendStatus.style.display = 'none';
  }

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

// Health check for backend availability
async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch('http://localhost:3000/tasks', { method: 'GET' });
    return response.ok;
  } catch {
    return false;
  }
}