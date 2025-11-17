import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import './TaskCreate.css';
import type { CreateTaskData } from '../../types';
import { createTask } from '../../api';

const taskSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  status: z.enum(['To Do', 'In Progress', 'Done']),
  dueDate: z.string().refine((date) => {
    if (!date || date.trim() === '') {
      return false;
    }
    const dueDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate >= today;
  }, {
    message: 'Due date must be today or in the future',
  }),
});

const TaskCreate = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { isValid, errors } } = useForm<CreateTaskData>({
    mode: 'onTouched',
    resolver: zodResolver(taskSchema),
    defaultValues: {
      status: 'To Do',
    },
  });

  const onSubmit = async (data: CreateTaskData) => {
    try {
      await createTask(data);
      navigate('/tasks');
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <div className="task-create">
      <h1>Create New Task</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="task-form">
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            id="title"
            type="text"
            {...register('title')}
            placeholder="Enter task title"
          />
          {errors.title && (
            <div className="error">{errors.title.message}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            {...register('description')}
            placeholder="Enter task description"
            rows={5}
          />
          {errors.description && (
            <div className="error">{errors.description.message}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="status">Status:</label>
          <select id="status" {...register('status')}>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
          {errors.status && (
            <div className="error">{errors.status.message}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="dueDate">Due Date:</label>
          <input
            id="dueDate"
            type="date"
            {...register('dueDate')}
          />
          {errors.dueDate && (
            <div className="error">{errors.dueDate.message}</div>
          )}
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/tasks')} className="button-secondary">
            Cancel
          </button>
          <button type="submit" disabled={!isValid} className="button-primary">
            Create Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskCreate;
