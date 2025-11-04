import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskFormSchema, type TaskFormData } from '../schemas/taskSchema';
import { TaskAPI } from '../api';
import type { Task } from '../types';
import './CreateTaskForm.css';

interface CreateTaskFormProps {
    onTaskCreated?: () => void;
}

export const CreateTaskForm = ({ onTaskCreated }: CreateTaskFormProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        reset,
    } = useForm<TaskFormData>({
        resolver: zodResolver(taskFormSchema),
        mode: 'onChange',
        defaultValues: {
            title: '',
            description: '',
            status: 'todo',
            priority: 'medium',
            deadline: '',
        },
    });

    const onSubmit = async (data: TaskFormData) => {
        try {
            const taskData: Omit<Task, 'id'> = {
                title: data.title,
                description: data.description,
                status: data.status,
                priority: data.priority,
                createdAt: new Date(),
                deadline: data.deadline ? new Date(data.deadline) : null,
            };

            const createdTask = await TaskAPI.createTask(taskData);
            console.log('Task created successfully:', createdTask);
            
            // Reset form after successful submission
            reset();
            
            // Trigger task list refresh
            if (onTaskCreated) {
                onTaskCreated();
            }
            
            // Show success message
            alert('Task created successfully!');
        } catch (error) {
            console.error('Failed to create task:', error);
            alert('Failed to create task. Please try again.');
        }
    };

    return (
        <div className="create-task-form-container">
            <h2>Create New Task</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="create-task-form">
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

                <button
                    type="submit"
                    className="submit-button"
                    disabled={!isValid}
                >
                    Create Task
                </button>
            </form>
        </div>
    );
};
