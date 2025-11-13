import type React from 'react';
import { TaskAPI } from '../../api/api';
import type { TaskFormData } from '../../schemas/taskSchema';
import type { Task } from '../../types/types';
import { convertFormDataToTask, convertTaskToFormData } from '../../utils/taskConverters';
import { TaskForm } from '../taskForm/TaskForm';
import './EditTaskModal.css';

interface EditTaskModalProps {
    task: Task;
    onClose: () => void;
    onTaskUpdated: () => void;
    onError: (message: string) => void;
    onSuccess: (message: string) => void;
}

export const EditTaskModal = ({ task, onClose, onTaskUpdated, onError, onSuccess }: EditTaskModalProps) => {
    const defaultValues = convertTaskToFormData(task);

    const handleSubmit = async (data: TaskFormData) => {
        try {
            const updates = convertFormDataToTask(data);

            await TaskAPI.updateTask(task.id, updates);
            onTaskUpdated();
            onClose();
            onSuccess('Task updated successfully!');
        } catch (error) {
            console.error('Failed to update task:', error);
            onError('Failed to update task. Please try again.');
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
                <div className="modal-body">
                    <TaskForm
                        defaultValues={defaultValues}
                        onSubmit={handleSubmit}
                        submitLabel="Save Changes"
                        onCancel={onClose}
                    />
                </div>
            </div>
        </div>
    );
};
