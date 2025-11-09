import type { Priority, Status, Task } from './types';

// Valid enum values for runtime validation - exported for use in tests
export const VALID_STATUSES: Status[] = ['todo', 'in_progress', 'done'];
export const VALID_PRIORITIES: Priority[] = ['low', 'medium', 'high'];

/**
 * Validates if a string is a valid Status value
 */
function isValidStatus(value: unknown): value is Status {
  return typeof value === 'string' && VALID_STATUSES.includes(value as Status);
}

/**
 * Validates if a string is a valid Priority value
 */
function isValidPriority(value: unknown): value is Priority {
  return typeof value === 'string' && VALID_PRIORITIES.includes(value as Priority);
}

/**
 * Converts a form data value to a Date or null
 * @param value - The form data value (could be string or empty)
 * @returns Date object if valid date string, null otherwise
 */
function parseDeadline(value: unknown): Date | null {
  if (!value || typeof value !== 'string' || value.trim() === '') {
    return null;
  }
  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date;
}

/**
 * Converts FormData from task creation form to a Task object (without id).
 * Validates all fields and throws an error if validation fails.
 * 
 * @param formData - FormData object from the task form
 * @returns Task object without id field
 * @throws Error if validation fails
 */
export function formDataToTask(formData: FormData): Omit<Task, 'id'> {
  const data = Object.fromEntries(formData);
  
  // Validate required fields
  const title = data.title as string;
  const description = data.description as string;
  
  if (!title || title.trim() === '') {
    throw new Error('Title is required');
  }
  
  if (!description || description.trim() === '') {
    throw new Error('Description is required');
  }
  
  if (!isValidStatus(data.status)) {
    throw new Error(`Invalid status: ${data.status}. Must be one of: ${VALID_STATUSES.join(', ')}`);
  }
  
  if (!isValidPriority(data.priority)) {
    throw new Error(`Invalid priority: ${data.priority}. Must be one of: ${VALID_PRIORITIES.join(', ')}`);
  }
  
  return {
    title: title.trim(),
    description: description.trim(),
    status: data.status as Status,
    priority: data.priority as Priority,
    createdAt: new Date(),
    deadline: parseDeadline(data.deadline)
  };
}

/**
 * Converts FormData from task edit form to a task update object.
 * All fields are required for updates. Validates all fields.
 * 
 * @param formData - FormData object from the edit form
 * @returns Task update object without id and createdAt fields
 * @throws Error if validation fails
 */
export function formDataToPartialTask(formData: FormData): Omit<Task, 'id' | 'createdAt'> {
  const data = Object.fromEntries(formData);
  
  // Validate required fields
  const title = data.title as string;
  const description = data.description as string;
  
  if (!title || title.trim() === '') {
    throw new Error('Title is required');
  }
  
  if (!description || description.trim() === '') {
    throw new Error('Description is required');
  }
  
  if (!isValidStatus(data.status)) {
    throw new Error(`Invalid status: ${data.status}. Must be one of: ${VALID_STATUSES.join(', ')}`);
  }
  
  if (!isValidPriority(data.priority)) {
    throw new Error(`Invalid priority: ${data.priority}. Must be one of: ${VALID_PRIORITIES.join(', ')}`);
  }
  
  return {
    title: title.trim(),
    description: description.trim(),
    status: data.status as Status,
    priority: data.priority as Priority,
    deadline: parseDeadline(data.deadline)
  };
}

/**
 * Fills an edit form with task data.
 * Sets all form field values based on the provided task.
 * 
 * @param form - The HTMLFormElement to fill
 * @param task - The Task object containing data to populate the form
 */
export function fillEditForm(form: HTMLFormElement, task: Task): void {
  (form.elements.namedItem('title') as HTMLInputElement).value = task.title;
  (form.elements.namedItem('description') as HTMLTextAreaElement).value = task.description;
  (form.elements.namedItem('status') as HTMLSelectElement).value = task.status;
  (form.elements.namedItem('priority') as HTMLSelectElement).value = task.priority;
  (form.elements.namedItem('deadline') as HTMLInputElement).value = 
    task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : '';
}

