import { useState, useEffect } from 'react'
import { fetchTasksGrouped, updateTask, TasksByStatus, fetchUsers } from '../../api'
import { Task, TaskStatus } from '@shared/task.types'
import { User } from '@shared/user.types'
import './KanbanBoard.css'
import { useToast } from '../../hooks/useToast'

const KanbanBoard = () => {
  const [tasks, setTasks] = useState<TasksByStatus>({
    todo: [],
    in_progress: [],
    review: [],
    done: [],
  })
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)
  const { showToast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [grouped, usersData] = await Promise.all([fetchTasksGrouped(), fetchUsers()])

      // Handle if API returns flat array instead of grouped object
      let tasksData: TasksByStatus
      if (Array.isArray(grouped)) {
        // If it's an array, group it manually on the frontend
        tasksData = {
          todo: (grouped as Task[]).filter((t) => t.status === TaskStatus.Todo),
          in_progress: (grouped as Task[]).filter((t) => t.status === TaskStatus.InProgress),
          review: (grouped as Task[]).filter((t) => t.status === TaskStatus.Review),
          done: (grouped as Task[]).filter((t) => t.status === TaskStatus.Done),
        }
      } else {
        // Use grouped data from API
        tasksData = {
          todo: grouped.todo || [],
          in_progress: grouped.in_progress || [],
          review: grouped.review || [],
          done: grouped.done || [],
        }
      }

      setTasks(tasksData)
      setUsers(usersData)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const loadTasks = async () => {
    try {
      setLoading(true)
      const grouped = await fetchTasksGrouped()

      // Handle if API returns flat array instead of grouped object
      let tasksData: TasksByStatus
      if (Array.isArray(grouped)) {
        tasksData = {
          todo: (grouped as Task[]).filter((t) => t.status === TaskStatus.Todo),
          in_progress: (grouped as Task[]).filter((t) => t.status === TaskStatus.InProgress),
          review: (grouped as Task[]).filter((t) => t.status === TaskStatus.Review),
          done: (grouped as Task[]).filter((t) => t.status === TaskStatus.Done),
        }
      } else {
        tasksData = {
          todo: grouped.todo || [],
          in_progress: grouped.in_progress || [],
          review: grouped.review || [],
          done: grouped.done || [],
        }
      }

      setTasks(tasksData)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleDragStart = (task: Task) => {
    setDraggedTask(task)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleStatusChange = async (task: Task, newStatus: TaskStatus) => {
    if (task.status === newStatus) return

    const oldStatus = task.status as keyof TasksByStatus
    const newStatusKey = newStatus as keyof TasksByStatus
    const updatedTask = { ...task, status: newStatus }

    // Optimistic UI update
    setTasks((prev) => ({
      ...prev,
      [oldStatus]: prev[oldStatus].filter((t: Task) => t.id !== task.id),
      [newStatusKey]: [...prev[newStatusKey], updatedTask],
    }))

    // Update on backend
    try {
      await updateTask(task.id, { status: newStatus })
    } catch (err) {
      // Revert on error
      setTasks((prev) => ({
        ...prev,
        [newStatusKey]: prev[newStatusKey].filter((t: Task) => t.id !== task.id),
        [oldStatus]: [...prev[oldStatus], task],
      }))
      console.error('Failed to update task:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to update task'
      showToast(`Failed to update task: ${errorMessage}`, 'error')
    }
  }

  const handleDrop = async (newStatus: TaskStatus) => {
    if (!draggedTask || draggedTask.status === newStatus) {
      setDraggedTask(null)
      return
    }

    await handleStatusChange(draggedTask, newStatus)
    setDraggedTask(null)
  }

  if (loading) return <div className="loading">Loading tasks...</div>
  if (error) return <div className="error-message">Error: {error}</div>

  const columns: Array<{ key: TaskStatus; title: string }> = [
    { key: TaskStatus.Todo, title: 'To Do' },
    { key: TaskStatus.InProgress, title: 'In Progress' },
    { key: TaskStatus.Review, title: 'Review' },
    { key: TaskStatus.Done, title: 'Done' },
  ]

  return (
    <div className="kanban-board">
      <div className="kanban-header">
        <h1>Task Board</h1>
        <div className="header-actions">
          <button
            onClick={() => (window.location.href = '/board/create')}
            className="button-primary"
          >
            Create Task
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
                    <span className={`priority-badge ${task.priority}`}>{task.priority}</span>
                  </div>
                  <h3 className="task-title">{task.title}</h3>
                  {task.description && <p className="task-description">{task.description}</p>}
                  <div className="task-footer">
                    {task.userId && (
                      <div className="task-assignee">
                        <span>
                          👤{' '}
                          {users.find((u) => u.id === task.userId)?.name || `User #${task.userId}`}
                        </span>
                      </div>
                    )}
                    <button
                      className="edit-button"
                      onClick={(e) => {
                        e.stopPropagation()
                        window.location.href = `/board/${task.id}`
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
  )
}

export default KanbanBoard
