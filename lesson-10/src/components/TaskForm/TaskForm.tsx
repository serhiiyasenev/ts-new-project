/**
 * Reusable Task Form Component
 * Handles both create and edit modes with proper validation
 */

import { useState, useMemo, FormEvent } from 'react';
import { TaskStatus, TaskPriority } from '@shared/task.types';
import type { Task, CreateTaskData, UpdateTaskData, User } from '../../types';
import './TaskForm.css';

interface TaskFormProps {
  mode: 'create' | 'edit';
  initialData?: Task;
  users: User[];
  onSubmit: (data: CreateTaskData | UpdateTaskData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

interface FormErrors {
  title?: string;
  description?: string;
  userId?: string;
}

export function TaskForm({
  mode,
  initialData,
  users,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: TaskFormProps) {
  // Initialize form data from props using useMemo
  const initialFormData = useMemo(() => ({
    title: initialData?.title || '',
    description: initialData?.description || '',
    status: initialData?.status || TaskStatus.Todo,
    priority: initialData?.priority || TaskPriority.Medium,
    userId: initialData?.userId?.toString() || '',
  }), [initialData]);

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'title':
        if (!value.trim()) {
          return 'Title is required';
        }
        if (value.length > 255) {
          return 'Title must not exceed 255 characters';
        }
        break;
      case 'description':
        if (value.length > 5000) {
          return 'Description must not exceed 5000 characters';
        }
        break;
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    const titleError = validateField('title', formData.title);
    if (titleError) newErrors.title = titleError;

    const descError = validateField('description', formData.description);
    if (descError) newErrors.description = descError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate on change if field was touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      title: true,
      description: true,
      userId: true,
    });

    if (!validateForm()) {
      return;
    }

    const submitData: CreateTaskData | UpdateTaskData = {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      status: formData.status,
      priority: formData.priority,
      userId: formData.userId ? parseInt(formData.userId, 10) : null,
    };

    await onSubmit(submitData);
  };

  const isFormValid = !errors.title && !errors.description && formData.title.trim();

  return (
    <form onSubmit={handleSubmit} className="task-form" noValidate>
      <div className="form-group">
        <label htmlFor="title" className="form-label required">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`form-input ${errors.title && touched.title ? 'input-error' : ''}`}
          placeholder="Enter task title"
          maxLength={255}
          required
          disabled={isSubmitting}
        />
        {errors.title && touched.title && (
          <span className="error-message">{errors.title}</span>
        )}
        <span className="char-count">{formData.title.length}/255</span>
      </div>

      <div className="form-group">
        <label htmlFor="description" className="form-label">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`form-textarea ${errors.description && touched.description ? 'input-error' : ''}`}
          placeholder="Enter task description (optional)"
          rows={4}
          maxLength={5000}
          disabled={isSubmitting}
        />
        {errors.description && touched.description && (
          <span className="error-message">{errors.description}</span>
        )}
        <span className="char-count">{formData.description.length}/5000</span>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="status" className="form-label">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="form-select"
            disabled={isSubmitting}
          >
            <option value={TaskStatus.Todo}>To Do</option>
            <option value={TaskStatus.InProgress}>In Progress</option>
            <option value={TaskStatus.Review}>Review</option>
            <option value={TaskStatus.Done}>Done</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="priority" className="form-label">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="form-select"
            disabled={isSubmitting}
          >
            <option value={TaskPriority.Low}>Low</option>
            <option value={TaskPriority.Medium}>Medium</option>
            <option value={TaskPriority.High}>High</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="userId" className="form-label">
          Assign to User
        </label>
        <select
          id="userId"
          name="userId"
          value={formData.userId}
          onChange={handleChange}
          className="form-select"
          disabled={isSubmitting}
        >
          <option value="">Unassigned</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>
      </div>

      <div className="form-actions">
        <button
          type="button"
          onClick={onCancel}
          className="button-secondary"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="button-primary"
          disabled={!isFormValid || isSubmitting}
        >
          {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Task' : 'Update Task'}
        </button>
      </div>
    </form>
  );
}
