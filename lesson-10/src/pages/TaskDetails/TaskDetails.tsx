import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Task, User } from '../../types';
import './TaskDetails.css';
import { fetchTaskById, updateTask, deleteTask, fetchUsers } from '../../api';
import { taskSchema, type TaskFormFields } from '../../schema/taskSchema';

const TaskDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit, formState: { errors, isDirty, isValid }, reset } = useForm<TaskFormFields>({
    resolver: zodResolver(taskSchema),
  });

  useEffect(() => {
    if (id) {
      Promise.all([
        fetchTaskById(Number(id)),
        fetchUsers()
      ])
        .then(([taskData, usersData]) => {
          setTask(taskData);
          setUsers(usersData);
          reset({
            title: taskData.title,
            description: taskData.description,
            status: taskData.status,
            priority: taskData.priority,
            userId: taskData.userId,
          });
        })
        .catch((err: Error) => {
          setError(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, reset]);

  const handleUpdate = async (data: TaskFormFields) => {
    try {
      const updated = await updateTask(Number(id!), data);
      setTask(updated);
      setIsEditing(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update task');
    }
  };

  const handleDelete = async () => {
    if (!id || !window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await deleteTask(Number(id));
      navigate('/board');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete task');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;
  if (!task) return <div>Task not found</div>;

  if (isEditing) {
    return (
      <div className="task-details">
        <h1>Edit Task</h1>
        <form onSubmit={handleSubmit(handleUpdate)} className="task-form">
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input id="title" type="text" {...register('title')} />
            <div className="error">{errors.title?.message}</div>
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea id="description" {...register('description')} rows={5} />
            <div className="error">{errors.description?.message}</div>
          </div>
          
          <div className="form-group">
            <label htmlFor="status">Status:</label>
            <select id="status" {...register('status')}>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
            <div className="error">{errors.status?.message}</div>
          </div>
          
          <div className="form-group">
            <label htmlFor="priority">Priority:</label>
            <select id="priority" {...register('priority')}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <div className="error">{errors.priority?.message}</div>
          </div>
          
          <div className="form-group">
            <label htmlFor="userId">Assign to User:</label>
            <select id="userId" {...register('userId', { valueAsNumber: true })}>
              <option value="">None</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
            {errors.userId?.message && <div className="error">{String(errors.userId.message)}</div>}
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={() => setIsEditing(false)} className="button-secondary">
              Cancel
            </button>
            <button type="submit" className="button-primary" disabled={!isDirty || !isValid}>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="task-details">
      <Link to="/board" className="back-button">← Back to Board</Link>
      
      <div className="task-content">
        <h1>{task.title}</h1>
        
        <div className="task-info">
          <div className="info-item">
            <strong>Status:</strong>
            <span className={`task-status status-${task.status}`}>
              {task.status.replace('_', ' ')}
            </span>
          </div>
          <div className="info-item">
            <strong>Priority:</strong>
            <span className={`priority-${task.priority}`}>{task.priority}</span>
          </div>
          <div className="info-item">
            <strong>Assigned To:</strong>
            <span>{task.userId ? users.find(u => u.id === task.userId)?.name || `User #${task.userId}` : 'Unassigned'}</span>
          </div>
          <div className="info-item">
            <strong>Created:</strong>
            <span>{new Date(task.createdAt).toLocaleString()}</span>
          </div>
          <div className="info-item">
            <strong>Updated:</strong>
            <span>{new Date(task.updatedAt).toLocaleString()}</span>
          </div>
        </div>
        <div className="task-description-full">
          <h2>Description</h2>
          <p>{task.description || 'No description provided'}</p>
        </div>
        <div className="form-actions">
          <button onClick={() => setIsEditing(true)} className="button-primary">Edit</button>
          <button onClick={handleDelete} className="button-danger">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
