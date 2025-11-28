import { useState, useEffect } from 'react';
import { fetchTasksGrouped, updateTask, TasksByStatus, fetchUsers } from '../../api';
import { Task, TaskStatus, User } from '../../types';
import './KanbanBoard.css';

const KanbanBoard = () => {
  const [tasks, setTasks] = useState<TasksByStatus>({
    todo: [],
    in_progress: [],
    review: [],
    done: [],
  });
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [grouped, usersData] = await Promise.all([
        fetchTasksGrouped(),
        fetchUsers()
      ]);
      setTasks(grouped);
      setUsers(usersData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const loadTasks = async () => {
    try {
      setLoading(true);
      const grouped = await fetchTasksGrouped();
      setTasks(grouped);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleStatusChange = async (task: Task, newStatus: TaskStatus) => {
    if (task.status === newStatus) return;

    const oldStatus = task.status as keyof TasksByStatus;
    const newStatusKey = newStatus as keyof TasksByStatus;
    const updatedTask = { ...task, status: newStatus };

    // Optimistic UI update
    setTasks((prev) => ({
      ...prev,
      [oldStatus]: prev[oldStatus].filter((t: Task) => t.id !== task.id),
      [newStatusKey]: [...prev[newStatusKey], updatedTask],
    }));

    // Update on backend
    try {
      await updateTask(task.id, { status: newStatus });
    } catch (err) {
      // Revert on error
      setTasks((prev) => ({
        ...prev,
        [newStatusKey]: prev[newStatusKey].filter((t: Task) => t.id !== task.id),
        [oldStatus]: [...prev[oldStatus], task],
      }));
      alert(err instanceof Error ? err.message : 'Failed to update task');
    }
  };

  const handleDrop = async (newStatus: 'todo' | 'in_progress' | 'review' | 'done') => {
    if (!draggedTask || draggedTask.status === newStatus) {
      setDraggedTask(null);
      return;
    }

    await handleStatusChange(draggedTask, newStatus);
    setDraggedTask(null);
  };

  if (loading) return <div className="loading">Loading tasks...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  const columns: Array<{ key: keyof TasksByStatus; title: string }> = [
    { key: 'todo', title: 'To Do' },
    { key: 'in_progress', title: 'In Progress' },
    { key: 'review', title: 'Review' },
    { key: 'done', title: 'Done' },
  ];

  return (
    <div className="kanban-board">
      <div className="kanban-header">
        <h1>Task Board</h1>
        <div className="header-actions">
          <button onClick={() => window.location.href = '/board/create'} className="button-primary">
            + Create Task
          </button>
          <button onClick={loadTasks} className="button-secondary">
            Refresh
          </button>
        </div>
      </div>

      <div className="kanban-columns">
        {columns.map((column) => (
          <div
            key={column.key}
            className="kanban-column"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(column.key)}
          >
            <div className="column-header">
              <h2>{column.title}</h2>
              <span className="task-count">{tasks[column.key].length}</span>
            </div>

            <div className="column-content">
              {tasks[column.key].map((task) => (
                <div
                  key={task.id}
                  className={`task-card priority-${task.priority}`}
                  draggable
                  onDragStart={() => handleDragStart(task)}
                >
                  <div className="task-card-header">
                    <span className="task-id">#{task.id}</span>
                    <span className={`priority-badge ${task.priority}`}>
                      {task.priority}
                    </span>
                  </div>
                  <h3 className="task-title">{task.title}</h3>
                  {task.description && (
                    <p className="task-description">{task.description}</p>
                  )}
                  <div className="task-footer">
                    {task.userId && (
                      <div className="task-assignee">
                        <span>👤 {users.find(u => u.id === task.userId)?.name || `User #${task.userId}`}</span>
                      </div>
                    )}
                    <button
                      className="edit-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `/board/${task.id}`;
                      }}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
