import { describe, it, expect, vi } from 'vitest'
import TaskDetails from '../src/pages/TaskDetails/TaskDetails'
import { render, screen, waitFor } from './utils/test-utils'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import * as api from '../src/api'
import { TaskStatus, TaskPriority } from '@shared/task.types';

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})
vi.mock('../src/api')

describe('TaskDetails - Additional Coverage', () => {
  it('should handle update error', async () => {
    const user = userEvent.setup()
    const fetchTaskByIdMock = vi.mocked(api.fetchTaskById)
    const fetchUsersMock = vi.mocked(api.fetchUsers)
    const updateTaskMock = vi.mocked(api.updateTask)
    
    const mockTask = {
      id: 1,
      title: 'Test Task',
      description: 'Description',
      status: TaskStatus.Todo,
      priority: TaskPriority.Medium,
      userId: 1,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    }

    fetchTaskByIdMock.mockResolvedValue(mockTask)
    fetchUsersMock.mockResolvedValue([
      { id: 1, name: 'User 1', email: 'user1@test.com', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01', lastLoginAt: null }
    ])
    updateTaskMock.mockRejectedValue(new Error('Update failed'))

    

    render(
      <MemoryRouter initialEntries={['/tasks/1']}>
        <Routes>
          <Route path="/tasks/:id" element={<TaskDetails />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Test Task')).toBeInTheDocument()
    })

    const editButton = screen.getByRole('button', { name: /Edit/i })
    await user.click(editButton)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Save/i })).toBeInTheDocument()
    })

    const titleInput = screen.getByLabelText(/Title/i)
    await user.clear(titleInput)
    await user.type(titleInput, 'Updated Task')

    const saveButton = screen.getByRole('button', { name: /Save/i })
    await user.click(saveButton)

    await waitFor(() => {
      expect(updateTaskMock).toHaveBeenCalled()
      expect(screen.getByText('Update failed')).toBeInTheDocument()
    })

    
  })

  it('should handle delete cancellation', async () => {
    const user = userEvent.setup()
    const fetchTaskByIdMock = vi.mocked(api.fetchTaskById)
    const fetchUsersMock = vi.mocked(api.fetchUsers)
    const deleteTaskMock = vi.mocked(api.deleteTask)
    
    const mockTask = {
      id: 1,
      title: 'Test Task',
      description: 'Description',
      status: TaskStatus.Todo,
      priority: TaskPriority.Medium,
      userId: 1,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    }

    fetchTaskByIdMock.mockResolvedValue(mockTask)
    fetchUsersMock.mockResolvedValue([
      { id: 1, name: 'User 1', email: 'user1@test.com', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01', lastLoginAt: null }
    ])

    vi.spyOn(window, 'confirm').mockReturnValue(false)

    render(
      <MemoryRouter initialEntries={['/tasks/1']}>
        <Routes>
          <Route path="/tasks/:id" element={<TaskDetails />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Test Task')).toBeInTheDocument()
    })

    const deleteButton = screen.getByRole('button', { name: /Delete/i })
    await user.click(deleteButton)

    expect(deleteTaskMock).not.toHaveBeenCalled()
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('should handle delete error', async () => {
    const user = userEvent.setup()
    const fetchTaskByIdMock = vi.mocked(api.fetchTaskById)
    const fetchUsersMock = vi.mocked(api.fetchUsers)
    const deleteTaskMock = vi.mocked(api.deleteTask)
    
    const mockTask = {
      id: 1,
      title: 'Test Task',
      description: 'Description',
      status: TaskStatus.Todo,
      priority: TaskPriority.Medium,
      userId: 1,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    }

    fetchTaskByIdMock.mockResolvedValue(mockTask)
    fetchUsersMock.mockResolvedValue([
      { id: 1, name: 'User 1', email: 'user1@test.com', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01', lastLoginAt: null }
    ])
    deleteTaskMock.mockRejectedValue(new Error('Delete failed'))

    vi.spyOn(window, 'confirm').mockReturnValue(true)
    

    render(
      <MemoryRouter initialEntries={['/tasks/1']}>
        <Routes>
          <Route path="/tasks/:id" element={<TaskDetails />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Test Task')).toBeInTheDocument()
    })

    const deleteButton = screen.getByRole('button', { name: /Delete/i })
    await user.click(deleteButton)

    await waitFor(() => {
      expect(deleteTaskMock).toHaveBeenCalled()
      expect(screen.getByText('Delete failed')).toBeInTheDocument()
    })

    
  })

  it('should handle non-Error update exception', async () => {
    const user = userEvent.setup()
    const fetchTaskByIdMock = vi.mocked(api.fetchTaskById)
    const fetchUsersMock = vi.mocked(api.fetchUsers)
    const updateTaskMock = vi.mocked(api.updateTask)
    
    const mockTask = {
      id: 1,
      title: 'Test Task',
      description: 'Description',
      status: TaskStatus.Todo,
      priority: TaskPriority.Medium,
      userId: 1,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    }

    fetchTaskByIdMock.mockResolvedValue(mockTask)
    fetchUsersMock.mockResolvedValue([
      { id: 1, name: 'User 1', email: 'user1@test.com', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01', lastLoginAt: null }
    ])
    updateTaskMock.mockRejectedValue('String error')

    

    render(
      <MemoryRouter initialEntries={['/tasks/1']}>
        <Routes>
          <Route path="/tasks/:id" element={<TaskDetails />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Test Task')).toBeInTheDocument()
    })

    const editButton = screen.getByRole('button', { name: /Edit/i })
    await user.click(editButton)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Save/i })).toBeInTheDocument()
    })

    // Make a change to enable the save button
    const titleInput = screen.getByLabelText(/Title/i)
    await user.clear(titleInput)
    await user.type(titleInput, 'Updated Task')

    const saveButton = screen.getByRole('button', { name: /Save/i })
    await user.click(saveButton)

    await waitFor(() => {
      expect(updateTaskMock).toHaveBeenCalled()
      expect(screen.getByText('Failed to update task')).toBeInTheDocument()
    })

    
  })

  it('should handle non-Error delete exception', async () => {
    const user = userEvent.setup()
    const fetchTaskByIdMock = vi.mocked(api.fetchTaskById)
    const fetchUsersMock = vi.mocked(api.fetchUsers)
    const deleteTaskMock = vi.mocked(api.deleteTask)
    
    const mockTask = {
      id: 1,
      title: 'Test Task',
      description: 'Description',
      status: TaskStatus.Todo,
      priority: TaskPriority.Medium,
      userId: 1,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    }

    fetchTaskByIdMock.mockResolvedValue(mockTask)
    fetchUsersMock.mockResolvedValue([
      { id: 1, name: 'User 1', email: 'user1@test.com', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01', lastLoginAt: null }
    ])
    deleteTaskMock.mockRejectedValue('String error')

    vi.spyOn(window, 'confirm').mockReturnValue(true)
    

    render(
      <MemoryRouter initialEntries={['/tasks/1']}>
        <Routes>
          <Route path="/tasks/:id" element={<TaskDetails />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Test Task')).toBeInTheDocument()
    })

    const deleteButton = screen.getByRole('button', { name: /Delete/i })
    await user.click(deleteButton)

    await waitFor(() => {
      expect(deleteTaskMock).toHaveBeenCalled()
      expect(screen.getByText('Failed to delete task')).toBeInTheDocument()
    })

    
  })

  it('should successfully update task and exit edit mode', async () => {
    const user = userEvent.setup()
    const fetchTaskByIdMock = vi.mocked(api.fetchTaskById)
    const fetchUsersMock = vi.mocked(api.fetchUsers)
    const updateTaskMock = vi.mocked(api.updateTask)
    
    const mockTask = {
      id: 1,
      title: 'Test Task',
      description: 'Description',
      status: TaskStatus.Todo,
      priority: TaskPriority.Medium,
      userId: 1,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    }

    const updatedTask = {
      ...mockTask,
      title: 'Updated Task'
    }

    fetchTaskByIdMock.mockResolvedValue(mockTask)
    fetchUsersMock.mockResolvedValue([
      { id: 1, name: 'User 1', email: 'user1@test.com', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01', lastLoginAt: null }
    ])
    updateTaskMock.mockResolvedValue(updatedTask)

    render(
      <MemoryRouter initialEntries={['/tasks/1']}>
        <Routes>
          <Route path="/tasks/:id" element={<TaskDetails />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Test Task')).toBeInTheDocument()
    })

    const editButton = screen.getByRole('button', { name: /Edit/i })
    await user.click(editButton)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Save/i })).toBeInTheDocument()
    })

    const titleInput = screen.getByLabelText(/Title/i)
    await user.clear(titleInput)
    await user.type(titleInput, 'Updated Task')

    const saveButton = screen.getByRole('button', { name: /Save/i })
    await user.click(saveButton)

    await waitFor(() => {
      expect(updateTaskMock).toHaveBeenCalled()
      expect(screen.getByText('Updated Task')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Edit/i })).toBeInTheDocument()
    })
  })

  it('should successfully delete task and navigate to tasks list', async () => {
    const user = userEvent.setup()
    const fetchTaskByIdMock = vi.mocked(api.fetchTaskById)
    const fetchUsersMock = vi.mocked(api.fetchUsers)
    const deleteTaskMock = vi.mocked(api.deleteTask)
    
    const mockTask = {
      id: 1,
      title: 'Test Task',
      description: 'Description',
      status: TaskStatus.Todo,
      priority: TaskPriority.Medium,
      userId: 1,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    }

    fetchTaskByIdMock.mockResolvedValue(mockTask)
    fetchUsersMock.mockResolvedValue([
      { id: 1, name: 'User 1', email: 'user1@test.com', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01', lastLoginAt: null }
    ])
    deleteTaskMock.mockResolvedValue(undefined)

    vi.spyOn(window, 'confirm').mockReturnValue(true)

    render(
      <MemoryRouter initialEntries={['/tasks/1']}>
        <Routes>
          <Route path="/tasks/:id" element={<TaskDetails />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Test Task')).toBeInTheDocument()
    })

    const deleteButton = screen.getByRole('button', { name: /Delete/i })
    await user.click(deleteButton)

    await waitFor(() => {
      expect(deleteTaskMock).toHaveBeenCalledWith(1)
      expect(mockNavigate).toHaveBeenCalledWith('/board')
    })
  })

  it('should cancel edit mode when cancel button is clicked', async () => {
    const user = userEvent.setup()
    const fetchTaskByIdMock = vi.mocked(api.fetchTaskById)
    const fetchUsersMock = vi.mocked(api.fetchUsers)
    
    const mockTask = {
      id: 1,
      title: 'Test Task',
      description: 'Description',
      status: TaskStatus.Todo,
      priority: TaskPriority.Medium,
      userId: 1,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    }

    fetchTaskByIdMock.mockResolvedValue(mockTask)
    fetchUsersMock.mockResolvedValue([
      { id: 1, name: 'User 1', email: 'user1@test.com', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01', lastLoginAt: null }
    ])

    render(
      <MemoryRouter initialEntries={['/tasks/1']}>
        <Routes>
          <Route path="/tasks/:id" element={<TaskDetails />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Test Task')).toBeInTheDocument()
    })

    const editButton = screen.getByRole('button', { name: /Edit/i })
    await user.click(editButton)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument()
    })

    const cancelButton = screen.getByRole('button', { name: /Cancel/i })
    await user.click(cancelButton)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Edit/i })).toBeInTheDocument()
    })
  })

  it('should show task not found when task is null', async () => {
    const fetchTaskByIdMock = vi.mocked(api.fetchTaskById)
    const fetchUsersMock = vi.mocked(api.fetchUsers)
    
    fetchTaskByIdMock.mockRejectedValue(new Error('Task not found'))
    fetchUsersMock.mockResolvedValue([])

    render(
      <MemoryRouter initialEntries={['/tasks/1']}>
        <Routes>
          <Route path="/tasks/:id" element={<TaskDetails />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/Task not found/i)).toBeInTheDocument()
    })
  })
})
