/**
 * Reusable task form component using react-hook-form and Zod validation
 * Used for both creating and editing tasks
 */
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskFormSchema, type TaskFormData } from "../../schemas/taskSchema";
import './TaskForm.css';

interface TaskFormProps {
    defaultValues?: TaskFormData;
    onSubmit: (data: TaskFormData) => void | Promise<void>;
    submitLabel: string;
    onCancel?: () => void;
}

export const TaskForm = ({ defaultValues, onSubmit, submitLabel, onCancel }: TaskFormProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isValid, isSubmitting },
    } = useForm<TaskFormData>({
        resolver: zodResolver(taskFormSchema),
        mode: 'onChange',
        defaultValues: defaultValues || {
            title: '',
            description: '',
            status: 'todo',
            priority: 'medium',
            deadline: '',
        },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="task-form">
            <div className="form-group">
                <label htmlFor="title">
                    Title <span className="required">*</span>
                </label>
                <input
                    type="text"
                    id="title"
                    {...register('title')}
                    className={errors.title ? 'input-error' : ''}
                    placeholder="Enter task title"
                />
                {errors.title && (
                    <span className="error-message">{errors.title.message}</span>
                )}
            </div>

            <div className="form-group">
                <label htmlFor="description">
                    Description <span className="required">*</span>
                </label>
                <textarea
                    id="description"
                    {...register('description')}
                    className={errors.description ? 'input-error' : ''}
                    placeholder="Enter task description"
                    rows={4}
                />
                {errors.description && (
                    <span className="error-message">{errors.description.message}</span>
                )}
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="status">
                        Status <span className="required">*</span>
                    </label>
                    <select
                        id="status"
                        {...register('status')}
                        className={errors.status ? 'input-error' : ''}
                    >
                        <option value="todo">Todo</option>
                        <option value="in_progress">In Progress</option>
                        <option value="done">Done</option>
                    </select>
                    {errors.status && (
                        <span className="error-message">{errors.status.message}</span>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="priority">
                        Priority <span className="required">*</span>
                    </label>
                    <select
                        id="priority"
                        {...register('priority')}
                        className={errors.priority ? 'input-error' : ''}
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                    {errors.priority && (
                        <span className="error-message">{errors.priority.message}</span>
                    )}
                </div>
            </div>

            <div className="form-row-deadline">
                <div className="form-group">
                    <label htmlFor="deadline">Deadline (optional)</label>
                    <input
                        type="date"
                        id="deadline"
                        {...register('deadline')}
                        className={errors.deadline ? 'input-error' : ''}
                    />
                    {errors.deadline && (
                        <span className="error-message">{errors.deadline.message}</span>
                    )}
                </div>
                
                <div className="form-group-button">
                    <button
                        type="submit"
                        className="submit-button"
                        disabled={!isValid || isSubmitting}
                    >
                        {isSubmitting ? 'Saving...' : submitLabel}
                    </button>
                </div>
            </div>

            {onCancel && (
                <div className="form-actions">
                    <button
                        type="button"
                        className="cancel-button"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                </div>
            )}
        </form>
    );
};
