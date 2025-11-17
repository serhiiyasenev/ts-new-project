import { useState, useEffect } from 'react';
import type React from 'react';
import { TaskAPI } from "../../api/api";
import type { Status, Task } from "../../types/types";
import { KanbanColumn } from "../kanbanColumn/KanbanColumn";
import './TaskList.css';

interface TaskListProps {
    onEditTask: (task: Task) => void;
    onTaskMoved: () => void;
    onError: (message: string) => void;
}

export const TaskList = ({ onEditTask, onTaskMoved, onError }: TaskListProps) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [draggedTask, setDraggedTask] = useState<Task | null>(null);
    const [dragOverColumn, setDragOverColumn] = useState<Status | null>(null);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            setError(null);
            const fetchedTasks = await TaskAPI.getAllTasks();
            // Sort by creation date (newest first)
            const sortedTasks = fetchedTasks.sort((a, b) => {
                const dateA = new Date(a.createdAt).getTime();
                const dateB = new Date(b.createdAt).getTime();
                return dateB - dateA;
            });
            setTasks(sortedTasks);
        } catch (err) {
            setError('Failed to load tasks. Please try again.');
            console.error('Error fetching tasks:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const getTasksByStatus = (status: Status): Task[] => {
        return tasks.filter((task) => task.status === status);
    };

    const handleDragStart = (task: Task) => {
        setDraggedTask(task);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>, status: Status) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverColumn(status);
    };

    const handleDragLeave = () => {
        setDragOverColumn(null);
    };

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>, newStatus: Status) => {
        e.preventDefault();
        setDragOverColumn(null);

        if (!draggedTask || draggedTask.status === newStatus) {
            setDraggedTask(null);
            return;
        }

        try {
            // Optimistically update UI
            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task.id === draggedTask.id
                        ? { ...task, status: newStatus }
                        : task
                )
            );

            // Update on server
            await TaskAPI.updateTask(draggedTask.id, { status: newStatus });
            onTaskMoved();
        } catch (error) {
            console.error('Failed to update task status:', error);
            onError('Failed to move task. Please try again.');
            // Revert on error
            await fetchTasks();
        } finally {
            setDraggedTask(null);
        }
    };

    if (loading) {
        return (
            <div className="task-list-container">
                <div className="loading-spinner">Loading tasks...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="task-list-container">
                <div className="error-message-box">
                    <p>{error}</p>
                    <button onClick={fetchTasks} className="retry-button">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const todoTasks = getTasksByStatus('todo');
    const inProgressTasks = getTasksByStatus('in_progress');
    const doneTasks = getTasksByStatus('done');

    return (
        <div className="task-list-container">
            <div className="task-list-header">
                <h2>All Tasks ({tasks.length})</h2>
                <button onClick={fetchTasks} className="refresh-button">
                    🔄 Refresh
                </button>
            </div>

            {tasks.length === 0 ? (
                <div className="empty-state">
                    <p>No tasks yet. Create your first task above! 📝</p>
                </div>
            ) : (
                <div className="kanban-board">
                    <KanbanColumn
                        status="todo"
                        title="To Do"
                        icon="📋"
                        tasks={todoTasks}
                        isDragOver={dragOverColumn === 'todo'}
                        onDragOver={(e) => handleDragOver(e, 'todo')}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, 'todo')}
                        onEditTask={onEditTask}
                        onDragStart={handleDragStart}
                    />

                    <KanbanColumn
                        status="in_progress"
                        title="In Progress"
                        icon="⚙️"
                        tasks={inProgressTasks}
                        isDragOver={dragOverColumn === 'in_progress'}
                        onDragOver={(e) => handleDragOver(e, 'in_progress')}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, 'in_progress')}
                        onEditTask={onEditTask}
                        onDragStart={handleDragStart}
                    />

                    <KanbanColumn
                        status="done"
                        title="Done"
                        icon="✅"
                        tasks={doneTasks}
                        isDragOver={dragOverColumn === 'done'}
                        onDragOver={(e) => handleDragOver(e, 'done')}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, 'done')}
                        onEditTask={onEditTask}
                        onDragStart={handleDragStart}
                    />
                </div>
            )}
        </div>
    );
};
