import './style.css';
import { TaskAPI } from './api';
import type { Status, Task } from './types';
import { createTaskHeader, createTaskMeta, createTaskActions } from './dom-utils';
import { updateStatistics } from './stats';
import { formDataToTask, formDataToPartialTask, fillEditForm } from './form-utils';

/**
 * Sorts tasks by creation date in descending order (newest first).
 * Creates a new array and does not mutate the original.
 * @param tasks - Array of tasks to sort
 * @returns New array of tasks sorted by creation date (newest first)
 */
export function sortTasksByCreatedDate(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Gets or creates an error message element within a form.
 * The element is created once and reused for all error displays.
 * 
 * @param form - The form element to attach the error element to
 * @param className - CSS class name for the error element
 * @returns The error message element
 */
function getOrCreateErrorElement(form: HTMLElement, className: string): HTMLElement {
  let errorEl = form.querySelector(`.${className}`) as HTMLElement;
  if (!errorEl) {
    errorEl = document.createElement('div');
    errorEl.className = className;
    errorEl.setAttribute('role', 'alert');
    errorEl.setAttribute('aria-live', 'assertive');
    form.appendChild(errorEl);
  }
  // ARIA attributes are only set when creating new element (not on every call)
  return errorEl;
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
  
  // Drag events handled via event delegation on parent container
  return taskEl;
}

function clearTaskLists(): void {
  document.querySelector('#todoList')!.replaceChildren();
  document.querySelector('#inProgressList')!.replaceChildren();
  document.querySelector('#doneList')!.replaceChildren();
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
  const backendStatus = document.querySelector<HTMLDivElement>('#backendStatus')!;
  const editForm = document.querySelector('.task-edit-form') as HTMLFormElement;
  
  // Create error message elements once using helper function
  const editFormErrorEl = getOrCreateErrorElement(editForm, 'modal-error');
  const createFormErrorEl = getOrCreateErrorElement(taskForm, 'form-error');

  // Load and render tasks
  async function loadTasks() {
    try {
      const tasks = await TaskAPI.getAllTasks();
      renderTasks(tasks, editTask, deleteTask);
      // Hide backend error on successful load
      backendStatus.style.display = 'none';
    } catch (error) {
      console.error('Error loading tasks:', error);
      // Show backend error message
      backendStatus.style.display = 'block';
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
      
      // Fill form with task data
      fillEditForm(editForm, task);

      // Show modal
      modalOverlay?.classList.add('active');
      editForm?.classList.add('active');

      // Clear previous error
      editFormErrorEl.textContent = '';

      // Controller to auto-clean listeners on cancel/submit
      const controller = new AbortController();
      const { signal } = controller;

      // Handle cancel
      const handleCancel = () => {
        modalOverlay?.classList.remove('active');
        editForm?.classList.remove('active');
        editFormErrorEl.textContent = ''; // Clear error on cancel
        // Abort all listeners associated with this modal interaction
        controller.abort();
      };

      // Overlay click handler to close modal when clicking outside
      const overlayClickHandler = (e: Event) => {
        if (e.target === modalOverlay) handleCancel();
      };

      // Handle form submission
      const handleSubmit = async (e: Event) => {
        e.preventDefault();
        editFormErrorEl.textContent = ''; // Clear error on new attempt
        
        try {
          const formData = new FormData(editForm);
          const updates = formDataToPartialTask(formData);
          await TaskAPI.updateTask(task.id, { ...task, ...updates });
          modalOverlay?.classList.remove('active');
          editForm?.classList.remove('active');
          controller.abort(); // Clean up listeners on success
          await loadTasks();
        } catch (err) {
          editFormErrorEl.textContent = err instanceof Error ? err.message : 'Failed to update task. Please try again.';
          // Don't abort - allow retry
        }
      };

      editForm.addEventListener('submit', handleSubmit, { signal });
      editForm.querySelector('.cancel')?.addEventListener('click', handleCancel, { signal });
      modalOverlay?.addEventListener('click', overlayClickHandler, { signal });
    } catch (error) {
      console.error('Error editing task:', error);
    }
  };

  // Handle form submission
  taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    createFormErrorEl.textContent = ''; // Clear previous error
    
    try {
      const formData = new FormData(taskForm);
      const newTask = formDataToTask(formData);
      await TaskAPI.createTask(newTask);
      taskForm.reset();
      await loadTasks();
    } catch (error) {
      // Display validation or API errors to the user
      if (error instanceof Error) {
        createFormErrorEl.textContent = error.message;
      } else {
        createFormErrorEl.textContent = 'Failed to create task. Please try again.';
      }
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

  // Setup drag event delegation on task-list container
  const taskList = document.querySelector('.task-list');
  if (taskList) {
    // Delegated dragstart handler
    taskList.addEventListener('dragstart', (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('task-item')) {
        target.classList.add('dragging');
        const dragEvent = e as DragEvent;
        const taskId = target.dataset.id;
        if (taskId) {
          dragEvent.dataTransfer?.setData('text/plain', taskId);
        }
      }
    });

    // Delegated dragend handler
    taskList.addEventListener('dragend', (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('task-item')) {
        target.classList.remove('dragging');
      }
    });
  }

  // Initial load
  await loadTasks();
}

// Only run init if not in test environment
// Tests import functions from this file but need manual control over initialization
// rather than automatic execution on module load
if (import.meta.env.MODE !== 'test') {
  init();
}