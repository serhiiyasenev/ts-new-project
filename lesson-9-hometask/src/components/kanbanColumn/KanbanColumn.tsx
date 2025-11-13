import type React from 'react';
import type { Status, Task } from "../../types/types";
import { TaskCard } from "../taskCard/TaskCard";
import './KanbanColumn.css';

interface KanbanColumnProps {
    status: Status;
    title: string;
    icon: string;
    tasks: Task[];
    isDragOver: boolean;
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragLeave: () => void;
    onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
    onEditTask: (task: Task) => void;
    onDragStart: (task: Task) => void;
}

export const KanbanColumn = ({
    status,
    title,
    icon,
    tasks,
    isDragOver,
    onDragOver,
    onDragLeave,
    onDrop,
    onEditTask,
    onDragStart,
}: KanbanColumnProps) => {
    return (
        <div
            className={`kanban-column ${isDragOver ? 'drag-over' : ''}`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
        >
            <div className={`column-header ${status}-header`}>
                <h3>
                    {icon} {title}
                </h3>
                <span className="task-count">{tasks.length}</span>
            </div>
            <div className="column-content">
                {tasks.map((task) => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={onEditTask}
                        onDragStart={onDragStart}
                    />
                ))}
                {tasks.length === 0 && (
                    <div className="column-empty">No tasks</div>
                )}
            </div>
        </div>
    );
};
