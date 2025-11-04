import { useEffect, useState } from 'react';
import { TaskAPI } from '../api';
import type { Task, Status } from '../types';
import { TaskCard } from './TaskCard';
import './TaskList.css';

interface TaskListProps {
    onEditTask: (task: Task) => void;
}

export const TaskList = ({ onEditTask }: TaskListProps) => {
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
            console.log(`Task moved to ${newStatus}`);
        } catch (error) {
            console.error('Failed to update task status:', error);
            // Revert on error
            await fetchTasks();
            alert('Failed to move task. Please try again.');
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
                    <div 
                        className={`kanban-column ${dragOverColumn === 'todo' ? 'drag-over' : ''}`}
                        onDragOver={(e) => handleDragOver(e, 'todo')}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, 'todo')}
                    >
                        <div className="column-header todo-header">
                            <h3>📋 To Do</h3>
                            <span className="task-count">{todoTasks.length}</span>
                        </div>
                        <div className="column-content">
                            {todoTasks.map((task) => (
                                <TaskCard 
                                    key={task.id} 
                                    task={task} 
                                    onEdit={onEditTask}
                                    onDragStart={handleDragStart}
                                />
                            ))}
                            {todoTasks.length === 0 && (
                                <div className="column-empty">No tasks</div>
                            )}
                        </div>
                    </div>

                    <div 
                        className={`kanban-column ${dragOverColumn === 'in_progress' ? 'drag-over' : ''}`}
                        onDragOver={(e) => handleDragOver(e, 'in_progress')}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, 'in_progress')}
                    >
                        <div className="column-header in-progress-header">
                            <h3>⚙️ In Progress</h3>
                            <span className="task-count">{inProgressTasks.length}</span>
                        </div>
                        <div className="column-content">
                            {inProgressTasks.map((task) => (
                                <TaskCard 
                                    key={task.id} 
                                    task={task} 
                                    onEdit={onEditTask}
                                    onDragStart={handleDragStart}
                                />
                            ))}
                            {inProgressTasks.length === 0 && (
                                <div className="column-empty">No tasks</div>
                            )}
                        </div>
                    </div>

                    <div 
                        className={`kanban-column ${dragOverColumn === 'done' ? 'drag-over' : ''}`}
                        onDragOver={(e) => handleDragOver(e, 'done')}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, 'done')}
                    >
                        <div className="column-header done-header">
                            <h3>✅ Done</h3>
                            <span className="task-count">{doneTasks.length}</span>
                        </div>
                        <div className="column-content">
                            {doneTasks.map((task) => (
                                <TaskCard 
                                    key={task.id} 
                                    task={task} 
                                    onEdit={onEditTask}
                                    onDragStart={handleDragStart}
                                />
                            ))}
                            {doneTasks.length === 0 && (
                                <div className="column-empty">No tasks</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
