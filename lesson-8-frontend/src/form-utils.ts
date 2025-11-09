import type { Priority, Status, Task } from './types';

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

// Convert FormData to task update object (all fields required for update)
export function formDataToPartialTask(formData: FormData): Omit<Task, 'id' | 'createdAt'> {
  const data = Object.fromEntries(formData);
  return {
    title: data.title as string,
    description: data.description as string,
    status: data.status as Status,
    priority: data.priority as Priority,
    deadline: data.deadline ? new Date(data.deadline as string) : null
  };
}

// Fill edit form with task data
export function fillEditForm(form: HTMLFormElement, task: Task): void {
  (form.elements.namedItem('title') as HTMLInputElement).value = task.title;
  (form.elements.namedItem('description') as HTMLTextAreaElement).value = task.description;
  (form.elements.namedItem('status') as HTMLSelectElement).value = task.status;
  (form.elements.namedItem('priority') as HTMLSelectElement).value = task.priority;
  (form.elements.namedItem('deadline') as HTMLInputElement).value = 
    task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : '';
}
