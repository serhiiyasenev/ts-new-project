import type { Priority, Status, Task } from './types';

// Valid enum values for runtime validation - exported for use in tests
export const VALID_STATUSES: Status[] = ['todo', 'in_progress', 'done'];
export const VALID_PRIORITIES: Priority[] = ['low', 'medium', 'high'];

// Validates if a string is a valid Status value
function isValidStatus(value: unknown): value is Status {
  return typeof value === 'string' && VALID_STATUSES.includes(value as Status);
}

// Validates if a string is a valid Priority value
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
 * Validates form data fields and returns validated values.
 * Shared validation logic used by both formDataToTask and formDataToPartialTask.
 * 
 * @param data - Object from FormData entries
 * @returns Validated and trimmed form fields
 * @throws Error if validation fails with user-friendly messages
 */
function validateFormData(data: Record<string, FormDataEntryValue>) {
  const title = data.title as string;
  const description = data.description as string;
  
  if (!title || title.trim() === '') {
    throw new Error('Please enter a task title');
  }
  
  if (!description || description.trim() === '') {
    throw new Error('Please enter a task description');
  }
  
  if (!isValidStatus(data.status)) {
    throw new Error('Please select a valid status');
  }
  
  if (!isValidPriority(data.priority)) {
    throw new Error('Please select a valid priority');
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
 * Converts FormData from task creation form to a Task object (without id).
 * Validates all fields and throws an error if validation fails.
 * 
 * @param formData - FormData object from the task form
 * @returns Task object without id field
 * @throws Error if validation fails
 */
export function formDataToTask(formData: FormData): Omit<Task, 'id'> {
  const data = Object.fromEntries(formData);
  const validated = validateFormData(data);
  
  return {
    ...validated,
    createdAt: new Date()
  };
}

/**
 * Converts FormData from task edit form to a task update object.
 * Returns an object with all user-editable fields (title, description, status, priority, deadline)
 * required and validated, omitting only id and createdAt.
 * 
 * @param formData - FormData object from the edit form
 * @returns Task update object without id and createdAt fields (all other fields are required)
 * @throws Error if validation fails (empty title/description, invalid status/priority)
 */
export function formDataToTaskUpdate(formData: FormData): Omit<Task, 'id' | 'createdAt'> {
  const data = Object.fromEntries(formData);
  return validateFormData(data);
}

/**
 * Fills an edit form with task data.
 * Sets all form field values based on the provided task.
 * 
 * @param form - The HTMLFormElement to fill
 * @param task - The Task object containing data to populate the form
 */
export function fillEditForm(form: HTMLFormElement, task: Task): void {
  const titleEl = form.elements.namedItem('title') as HTMLInputElement | null;
  if (titleEl) titleEl.value = task.title;
  const descEl = form.elements.namedItem('description') as HTMLTextAreaElement | null;
  if (descEl) descEl.value = task.description;
  const statusEl = form.elements.namedItem('status') as HTMLSelectElement | null;
  if (statusEl) statusEl.value = task.status;
  const priorityEl = form.elements.namedItem('priority') as HTMLSelectElement | null;
  if (priorityEl) priorityEl.value = task.priority;
  const deadlineEl = form.elements.namedItem('deadline') as HTMLInputElement | null;
  if (deadlineEl) {
    deadlineEl.value = task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : '';
  }
}
