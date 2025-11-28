import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { Task, TaskStatus, User } from '../../types';
import './TasksList.css';
import { fetchTasks, updateTask, fetchUsers } from '../../api';

const TasksList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const loadData = async () => {
    try {
      const [tasksData, usersData] = await Promise.all([
        fetchTasks(),
        fetchUsers()
      ]);
      setTasks(tasksData);
      setUsers(usersData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (newStatus: TaskStatus) => {
    if (!draggedTask || draggedTask.status === newStatus) {
      setDraggedTask(null);
      return;
    }

    try {
      const updated = await updateTask(draggedTask.id, { status: newStatus });
      setTasks(tasks.map(t => t.id === updated.id ? updated : t));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update task');
    } finally {
      setDraggedTask(null);
    }
  };

  const tasksByStatus = useMemo(() => {
    const statusMap: Record<string, Task[]> = {
      'todo': [],
      'in_progress': [],
      'done': []
    };
    tasks.forEach(task => {
      if (statusMap[task.status]) {
        statusMap[task.status].push(task);
      }
    });
    return statusMap;
  }, [tasks]);

  if (loading) return <div>Loading tasks...</div>;
  
  if (error) {
    return (
      <div className="error-message">
        <h2>Error</h2>
        <p>Error: {error}</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <h2>No tasks yet</h2>
        <p>Create your first task to get started!</p>
        <Link to="/tasks/create" className="create-task-btn">
          Create Task
        </Link>
      </div>
    );
  }

  const renderColumn = (status: TaskStatus, title: string, colorClass: string) => (
    <div 
      className={`task-column ${draggedTask && draggedTask.status !== status ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDrop={() => handleDrop(status)}
    >
      <div className="column-header">
        <h2 className="column-title">
          <span className={`status-badge ${colorClass}`}>{title}</span>
          <span className="task-count">{tasksByStatus[status].length}</span>
        </h2>
      </div>
      <div className="task-cards">
        {tasksByStatus[status].map((task) => (
          <div
            key={task.id}
            className={`task-card ${draggedTask?.id === task.id ? 'dragging' : ''} priority-${task.priority}`}
            draggable
            onDragStart={() => handleDragStart(task)}
          >
            <div className="task-card-header">
              <span className={`priority-badge priority-${task.priority}`}>
                {task.priority.toUpperCase()}
              </span>
            </div>
            <Link to={`/tasks/${task.id}`} className="task-card-link">
              <h3 className="task-title">{task.title}</h3>
              {task.description && (
                <p className="task-description">{task.description}</p>
              )}
            </Link>
            <div className="task-card-footer">
              {task.userId ? (
                <span className="task-assignee">
                  👤 {users.find(u => u.id === task.userId)?.name || `User #${task.userId}`}
                </span>
              ) : (
                <span className="task-unassigned">Unassigned</span>
              )}
            </div>
          </div>
        ))}
        {tasksByStatus[status].length === 0 && (
          <div className="empty-column">Drop tasks here</div>
        )}
      </div>
    </div>
  );

  return (
    <div className="tasks-board">
      <div className="board-header">
        <div>
          <h1>Board</h1>
          <p className="board-subtitle">{tasks.length} tasks</p>
        </div>
        <Link to="/tasks/create" className="button-primary">
          + Create Task
        </Link>
      </div>
      
      <div className="board-columns">
        {renderColumn('todo', 'TO DO', 'status-todo')}
        {renderColumn('in_progress', 'IN PROGRESS', 'status-in-progress')}
        {renderColumn('done', 'DONE', 'status-done')}
      </div>
    </div>
  );
};

export default TasksList;
