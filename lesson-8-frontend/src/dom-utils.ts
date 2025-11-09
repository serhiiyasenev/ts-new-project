import type { Task } from './types';

// Capitalize first letter of a string
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
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

export function createTaskActions(
  task: Task,
  editTask: (id: string) => void,
  deleteTask: (id: string) => void
): HTMLDivElement {
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
