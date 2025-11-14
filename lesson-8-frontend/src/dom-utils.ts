import type { Task } from './types';

/**
 * Capitalizes the first letter of a string.
 * Used for formatting priority and status values for display.
 * 
 * @param str - The string to capitalize
 * @returns The string with the first letter capitalized
 * @example capitalize('low') // returns 'Low'
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Optional document parameter pattern for all DOM creation functions:
 * @param doc - Document object (defaults to global document; pass mock for testing with happy-dom)
 */

/**
 * Creates a task header DOM element containing the title and priority badge.
 * The header includes:
 * - An h3 element with the task title
 * - A priority badge with appropriate CSS class
 * 
 * @param task - The task object to create a header for
 * @param doc - Document object (defaults to global document; pass mock for testing)
 * @returns A div element with class 'task-header'
 */
export function createTaskHeader(task: Task, doc: Document = document): HTMLDivElement {
  const headerDiv = doc.createElement('div');
  headerDiv.className = 'task-header';
  
  const h3 = doc.createElement('h3');
  h3.textContent = task.title;
  headerDiv.appendChild(h3);
  
  const badgesDiv = doc.createElement('div');
  badgesDiv.className = 'task-badges';
  
  const prioritySpan = doc.createElement('span');
  prioritySpan.className = `badge priority-${task.priority}`;
  prioritySpan.textContent = capitalize(task.priority);
  badgesDiv.appendChild(prioritySpan);
  
  headerDiv.appendChild(badgesDiv);
  return headerDiv;
}

/**
 * Creates a task metadata DOM element showing creation date and optional deadline.
 * Displays:
 * - Creation date (always shown)
 * - Deadline date (only if task has a deadline)
 * 
 * @param task - The task object to create metadata for
 * @param doc - Document object (defaults to global document; pass mock for testing)
 * @returns A div element with class 'task-meta'
 */
export function createTaskMeta(task: Task, doc: Document = document): HTMLDivElement {
  const metaDiv = doc.createElement('div');
  metaDiv.className = 'task-meta';
  
  const createdSpan = doc.createElement('span');
  createdSpan.textContent = `Created: ${new Date(task.createdAt).toLocaleDateString()}`;
  metaDiv.appendChild(createdSpan);
  
  if (task.deadline) {
    const deadlineSpan = doc.createElement('span');
    deadlineSpan.textContent = `Deadline: ${new Date(task.deadline).toLocaleDateString()}`;
    metaDiv.appendChild(deadlineSpan);
  }
  
  return metaDiv;
}

/**
 * Creates a task actions DOM element with Edit and Delete buttons.
 * Buttons use data attributes for task ID instead of inline event listeners.
 * Click events are handled via event delegation on the task list container.
 * 
 * @param task - The task object these actions are for
 * @param doc - Document object (defaults to global document; pass mock for testing)
 * @returns A div element with class 'task-actions' containing the buttons
 */
export function createTaskActions(
  task: Task,
  doc: Document = document
): HTMLDivElement {
  const actionsDiv = doc.createElement('div');
  actionsDiv.className = 'task-actions';
  
  const editBtn = doc.createElement('button');
  editBtn.className = 'edit';
  editBtn.textContent = 'Edit';
  editBtn.dataset.action = 'edit';
  editBtn.dataset.taskId = task.id;
  actionsDiv.appendChild(editBtn);
  
  const deleteBtn = doc.createElement('button');
  deleteBtn.className = 'delete';
  deleteBtn.textContent = 'Delete';
  deleteBtn.dataset.action = 'delete';
  deleteBtn.dataset.taskId = task.id;
  actionsDiv.appendChild(deleteBtn);
  
  return actionsDiv;
}
