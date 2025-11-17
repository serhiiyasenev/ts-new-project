import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { fetchTasks } from '../../api';
import type { Task } from '../../types';
import './TasksList.css';

const TasksList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks()
      .then((data) => {
        setTasks(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const tasksByStatus = useMemo(() => ({
    'To Do': tasks.filter(task => task.status === 'To Do'),
    'In Progress': tasks.filter(task => task.status === 'In Progress'),
    'Done': tasks.filter(task => task.status === 'Done'),
  }), [tasks]);

  if (loading) return <div>Loading tasks...</div>;
  
  if (error) {
    return (
      <div className="error-message">
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <h2>No tasks yet</h2>
        <p>Create your first task to get started!</p>
        <Link to="/tasks/create" className="button-primary">
          Create Task
        </Link>
      </div>
    );
  }

  return (
    <div className="tasks-list">
      <div className="tasks-header">
        <h1>Tasks</h1>
        <Link to="/tasks/create" className="button-primary">
          Create Task
        </Link>
      </div>
      
      <div className="tasks-columns">
        <div className="task-column">
          <h2 className="column-title">
            <span className="status-badge status-todo">To Do</span>
            <span className="task-count">{tasksByStatus['To Do'].length}</span>
          </h2>
          <div className="task-cards">
            {tasksByStatus['To Do'].map((task) => (
              <Link to={`/tasks/${task.id}`} key={task.id} className="task-card">
                <h3>{task.title}</h3>
                <p className="task-description">{task.description}</p>
                <div className="task-meta">
                  <span className="task-date">📅 {task.dueDate}</span>
                </div>
              </Link>
            ))}
            {tasksByStatus['To Do'].length === 0 && (
              <div className="empty-column">No tasks</div>
            )}
          </div>
        </div>

        <div className="task-column">
          <h2 className="column-title">
            <span className="status-badge status-in-progress">In Progress</span>
            <span className="task-count">{tasksByStatus['In Progress'].length}</span>
          </h2>
          <div className="task-cards">
            {tasksByStatus['In Progress'].map((task) => (
              <Link to={`/tasks/${task.id}`} key={task.id} className="task-card">
                <h3>{task.title}</h3>
                <p className="task-description">{task.description}</p>
                <div className="task-meta">
                  <span className="task-date">📅 {task.dueDate}</span>
                </div>
              </Link>
            ))}
            {tasksByStatus['In Progress'].length === 0 && (
              <div className="empty-column">No tasks</div>
            )}
          </div>
        </div>

        <div className="task-column">
          <h2 className="column-title">
            <span className="status-badge status-done">Done</span>
            <span className="task-count">{tasksByStatus['Done'].length}</span>
          </h2>
          <div className="task-cards">
            {tasksByStatus['Done'].map((task) => (
              <Link to={`/tasks/${task.id}`} key={task.id} className="task-card">
                <h3>{task.title}</h3>
                <p className="task-description">{task.description}</p>
                <div className="task-meta">
                  <span className="task-date">📅 {task.dueDate}</span>
                </div>
              </Link>
            ))}
            {tasksByStatus['Done'].length === 0 && (
              <div className="empty-column">No tasks</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksList;
