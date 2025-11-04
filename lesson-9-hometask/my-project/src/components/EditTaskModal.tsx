import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskFormSchema, type TaskFormData } from '../schemas/taskSchema';
import { TaskAPI } from '../api';
import type { Task } from '../types';
import './EditTaskModal.css';

interface EditTaskModalProps {
    task: Task;
    onClose: () => void;
    onTaskUpdated: () => void;
}

export const EditTaskModal = ({ task, onClose, onTaskUpdated }: EditTaskModalProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<TaskFormData>({
        resolver: zodResolver(taskFormSchema),
        mode: 'onChange',
        defaultValues: {
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            deadline: task.deadline 
                ? new Date(task.deadline).toISOString().split('T')[0] 
                : '',
        },
    });

    const onSubmit = async (data: TaskFormData) => {
        try {
            const updates: Partial<Task> = {
                title: data.title,
                description: data.description,
                status: data.status,
                priority: data.priority,
                deadline: data.deadline ? new Date(data.deadline) : null,
            };

            await TaskAPI.updateTask(task.id, updates);
            console.log('Task updated successfully');
            
            // Trigger task list refresh
            onTaskUpdated();
            
            // Close modal
            onClose();
        } catch (error) {
            console.error('Failed to update task:', error);
            alert('Failed to update task. Please try again.');
        }
    };

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Edit Task</h2>
                    <button 
                        type="button" 
                        className="close-button" 
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="edit-task-form">
                    <div className="form-group">
                        <label htmlFor="edit-title">
                            Title <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="edit-title"
                            {...register('title')}
                            className={errors.title ? 'input-error' : ''}
                            placeholder="Enter task title"
                        />
                        {errors.title && (
                            <span className="error-message">{errors.title.message}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="edit-description">
                            Description <span className="required">*</span>
                        </label>
                        <textarea
                            id="edit-description"
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
                            <label htmlFor="edit-status">
                                Status <span className="required">*</span>
                            </label>
                            <select
                                id="edit-status"
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
                            <label htmlFor="edit-priority">
                                Priority <span className="required">*</span>
                            </label>
                            <select
                                id="edit-priority"
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

                    <div className="form-group">
                        <label htmlFor="edit-deadline">Deadline (optional)</label>
                        <input
                            type="date"
                            id="edit-deadline"
                            {...register('deadline')}
                            className={errors.deadline ? 'input-error' : ''}
                        />
                        {errors.deadline && (
                            <span className="error-message">{errors.deadline.message}</span>
                        )}
                    </div>

                    <div className="modal-actions">
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="submit-button"
                            disabled={!isValid}
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
