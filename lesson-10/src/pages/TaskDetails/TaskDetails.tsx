import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Task } from '../../types';
import './TaskDetails.css';
import { fetchTaskById } from '../../api';
import { formatDate } from '../../utils/dateUtils';

const TaskDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchTaskById(Number(id))
        .then((data) => {
          setTask(data);
          setLoading(false);
        })
        .catch((err: Error) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;
  if (!task) return <div>Task not found</div>;

  return (
    <div className="task-details">
      <Link to="/tasks" className="back-button">← Back to Tasks</Link>
      
      <div className="task-content">
        <h1>{task.title || '—'}</h1>
        
        <div className="task-info">
          <div className="info-item">
            <strong>Status:</strong>
            <span className={`task-status status-${task.status ? task.status.toLowerCase().replace(/\s+/g, '-') : 'unknown'}`}>
              {task.status || '—'}
            </span>
          </div>
          <div className="info-item">
            <strong>Due Date:</strong>
            <span>{formatDate(task.dueDate)}</span>
          </div>
          <div className="info-item">
            <strong>Created:</strong>
            <span>{formatDate(task.createdAt)}</span>
          </div>
        </div>
        <div className="task-description-full">
          <h2>Description</h2>
          <p>{task.description || '—'}</p>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
