import { TaskAPI } from '../../api/api';
import type { TaskFormData } from '../../schemas/taskSchema';
import { convertFormDataToTask } from '../../utils/taskConverters';
import { TaskForm } from '../taskForm/TaskForm';
import './CreateTaskForm.css';

interface CreateTaskFormProps {
    onTaskCreated: () => void;
    onError: (message: string) => void;
    onSuccess: (message: string) => void;
}

export const CreateTaskForm = ({ onTaskCreated, onError, onSuccess }: CreateTaskFormProps) => {
    const handleSubmit = async (data: TaskFormData) => {
        try {
            const taskData = {
                ...convertFormDataToTask(data),
                createdAt: new Date(),
            };

            await TaskAPI.createTask(taskData);
            onTaskCreated();
            onSuccess('Task created successfully!');
        } catch (error) {
            console.error('Failed to create task:', error);
            onError('Failed to create task. Please try again.');
        }
    };

    return (
        <div className="create-task-form-container">
            <h2>Create New Task</h2>
            <TaskForm onSubmit={handleSubmit} submitLabel="Create Task" />
        </div>
    );
};
