import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import TaskCreate from '../src/pages/TaskCreate/TaskCreate'
import * as api from '../src/api'
import { TaskStatus, TaskPriority } from '@shared/task.types';

vi.mock('../src/api')
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('TaskCreate - Submit Error Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(api.fetchUsers).mockResolvedValue([])
  })

  it('handles Error exception when createTask fails', async () => {
    const user = userEvent.setup()
    vi.mocked(api.createTask).mockRejectedValue(new Error('Network error'))
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

    render(
      <MemoryRouter>
        <TaskCreate />
      </MemoryRouter>
    )

    await user.type(screen.getByLabelText(/Title/i), 'Test Task')

    const submitButton = screen.getByRole('button', { name: /Create Task/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Network error')
    })

    alertSpy.mockRestore()
  })

  it('handles non-Error exception when createTask fails', async () => {
    const user = userEvent.setup()
    vi.mocked(api.createTask).mockRejectedValue('String error')
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

    render(
      <MemoryRouter>
        <TaskCreate />
      </MemoryRouter>
    )

    await user.type(screen.getByLabelText(/Title/i), 'Test Task')

    const submitButton = screen.getByRole('button', { name: /Create Task/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Error creating task')
    })

    alertSpy.mockRestore()
  })

  it('successfully creates task and navigates to tasks list', async () => {
    const user = userEvent.setup()
    vi.mocked(api.createTask).mockResolvedValue({
      id: 1,
      title: 'New Task',
      description: 'Test description',
      status: TaskStatus.Todo,
      priority: TaskPriority.Medium,
      userId: null,
      createdAt: '2025-11-28',
      updatedAt: '2025-11-28'
    })

    render(
      <MemoryRouter>
        <TaskCreate />
      </MemoryRouter>
    )

    await user.type(screen.getByLabelText(/Title/i), 'New Task')

    const submitButton = screen.getByRole('button', { name: /Create Task/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/board')
    })
  })

  it('successfully creates task with userId', async () => {
    const user = userEvent.setup()
    const mockUsers = [
      { id: 1, name: 'User 1', email: 'user1@test.com', isActive: true, lastLoginAt: null, createdAt: '2025-11-28', updatedAt: '2025-11-28' }
    ]
    vi.mocked(api.fetchUsers).mockResolvedValue(mockUsers)
    vi.mocked(api.createTask).mockResolvedValue({
      id: 1,
      title: 'New Task',
      description: 'Test description',
      status: TaskStatus.Todo,
      priority: TaskPriority.Medium,
      userId: 1,
      createdAt: '2025-11-28',
      updatedAt: '2025-11-28'
    })

    render(
      <MemoryRouter>
        <TaskCreate />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByLabelText(/Assign to User/i)).toBeInTheDocument()
    })

    await user.type(screen.getByLabelText(/Title/i), 'New Task')
    
    const userSelect = screen.getByLabelText(/Assign to User/i)
    await user.selectOptions(userSelect, '1')

    const submitButton = screen.getByRole('button', { name: /Create Task/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(vi.mocked(api.createTask)).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'New Task',
          userId: 1
        })
      )
      expect(mockNavigate).toHaveBeenCalledWith('/board')
    })
  })
})
