import type { Task } from '../types';
import './TaskCard.css';

interface TaskCardProps {
    task: Task;
    onEdit: (task: Task) => void;
    onDragStart?: (task: Task) => void;
}

export const TaskCard = ({ task, onEdit, onDragStart }: TaskCardProps) => {
    const formatDate = (date: Date | string | null | undefined) => {
        if (!date) return 'No deadline';
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return dateObj.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getPriorityClass = (priority: string) => {
        return `priority-badge priority-${priority}`;
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', task.id);
        
        if (onDragStart) {
            onDragStart(task);
        }
        
        // Add a slight delay to allow the drag image to be created
        setTimeout(() => {
            e.currentTarget.classList.add('dragging');
        }, 0);
    };

    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        e.currentTarget.classList.remove('dragging');
    };

    return (
        <div 
            className="task-card"
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="task-card-header">
                <h3 className="task-title">{task.title}</h3>
                <div className="task-badges">
                    <span className={getPriorityClass(task.priority)}>
                        {task.priority.toUpperCase()}
                    </span>
                </div>
            </div>
            
            <p className="task-description">{task.description}</p>
            
            <div className="task-card-footer">
                <div className="task-dates">
                    <span className="task-date">
                        <strong>Created:</strong> {formatDate(task.createdAt)}
                    </span>
                    {task.deadline && (
                        <span className="task-date">
                            <strong>Deadline:</strong> {formatDate(task.deadline)}
                        </span>
                    )}
                </div>
                <button 
                    className="edit-button" 
                    onClick={() => onEdit(task)}
                    aria-label="Edit task"
                >
                    ✏️ Edit
                </button>
            </div>
        </div>
    );
};
