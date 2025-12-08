import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './TaskCreate.css'
import { createTask, fetchUsers } from '../../api'
import { taskSchema } from '../../schema/taskSchema'
import type { TaskFormFields } from '../../schema/taskSchema'
import type { User } from '@shared/user.types'
import { TaskStatus, TaskPriority } from '@shared/task.types'
import { useToast } from '../../hooks/useToast'

const TaskCreate = () => {
  const [users, setUsers] = useState<User[]>([])
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormFields>({
    mode: 'onChange',
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: TaskStatus.Todo,
      priority: TaskPriority.Medium,
      userId: '',
    },
  })

  const navigate = useNavigate()
  const { showToast } = useToast()

  useEffect(() => {
    fetchUsers().then(setUsers).catch(console.error)
  }, [])

  const onSubmit = async (data: TaskFormFields) => {
    try {
      const taskData = {
        ...data,
        userId: data.userId && data.userId !== '' ? Number(data.userId) : undefined,
      }
      await createTask(taskData)
      showToast('Task created successfully', 'success')
      navigate('/board')
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Error creating task', 'error')
    }
  }

  return (
    <div className="task-create">
      <h1>Create New Task</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="task-form">
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input id="title" type="text" {...register('title')} placeholder="Enter task title" />
          {errors.title && <div className="error">{errors.title.message}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            {...register('description')}
            placeholder="Enter task description"
            rows={5}
          />
          {errors.description && <div className="error">{errors.description.message}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="status">Status:</label>
          <select id="status" {...register('status')}>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="review">Review</option>
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
          <label htmlFor="userId">Assign to User (optional):</label>
          <select id="userId" {...register('userId')}>
            <option value="">None</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/board')} className="button-secondary">
            Cancel
          </button>
          <button type="submit" className="button-primary">
            Create Task
          </button>
        </div>
      </form>
    </div>
  )
}

export default TaskCreate
