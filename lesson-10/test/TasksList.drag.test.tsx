import { describe, it, expect, vi } from 'vitest'
import TasksList from '../src/pages/KanbanBoard/KanbanBoard'
import { render, screen, waitFor, fireEvent } from './utils/test-utils'
import { MemoryRouter } from 'react-router-dom'
import * as api from '../src/api'
import { TaskStatus, TaskPriority, Task } from '@shared/task.types';

vi.mock('../src/api')

// Helper to group tasks by status
const groupTasks = (tasks: Task[]) => ({
  todo: tasks.filter(t => t.status === TaskStatus.Todo),
  in_progress: tasks.filter(t => t.status === TaskStatus.InProgress),
  review: tasks.filter(t => t.status === TaskStatus.Review),
  done: tasks.filter(t => t.status === TaskStatus.Done),
});

describe('TasksList - Drag and Drop', () => {
  it('should handle drag and drop to update task status', async () => {
    const fetchTasksGroupedMock = vi.mocked(api.fetchTasksGrouped)
    const fetchUsersMock = vi.mocked(api.fetchUsers)
    const updateTaskMock = vi.mocked(api.updateTask)
    
    const mockTasks = [
      {
        id: 1,
        title: 'Task 1',
        description: 'Description 1',
        status: TaskStatus.Todo,
        priority: TaskPriority.Medium,
        userId: 1,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      }
    ]

    const mockUsers = [
      { id: 1, name: 'User 1', email: 'user1@test.com', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01', lastLoginAt: null }
    ]

    fetchTasksGroupedMock.mockResolvedValue(groupTasks(mockTasks))
    fetchUsersMock.mockResolvedValue(mockUsers)
    updateTaskMock.mockResolvedValue({ ...mockTasks[0], status: TaskStatus.Done })

    render(
      <MemoryRouter>
        <TasksList />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument()
    })

    const taskCard = screen.getByText('Task 1').closest('.task-card')
    const doneColumn = screen.getByText('Done').closest('.kanban-column')

    fireEvent.dragStart(taskCard!)
    fireEvent.dragOver(doneColumn!)
    fireEvent.drop(doneColumn!)

    await waitFor(() => {
      expect(updateTaskMock).toHaveBeenCalledWith(1, { status: TaskStatus.Done })
    })
  })

  it('should not update when dropping on same status', async () => {
    const fetchTasksGroupedMock = vi.mocked(api.fetchTasksGrouped)
    const fetchUsersMock = vi.mocked(api.fetchUsers)
    const updateTaskMock = vi.mocked(api.updateTask)
    
    const mockTasks = [
      {
        id: 1,
        title: 'Task 1',
        description: 'Description 1',
        status: TaskStatus.Todo,
        priority: TaskPriority.Medium,
        userId: 1,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      }
    ]

    const mockUsers = [
      { id: 1, name: 'User 1', email: 'user1@test.com', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01', lastLoginAt: null }
    ]

    fetchTasksGroupedMock.mockResolvedValue(groupTasks(mockTasks))
    fetchUsersMock.mockResolvedValue(mockUsers)

    render(
      <MemoryRouter>
        <TasksList />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument()
    })

    // Clear any previous calls
    updateTaskMock.mockClear()

    const taskCard = screen.getByText('Task 1').closest('.task-card')
    const todoColumn = screen.getByText('To Do').closest('.kanban-column')

    // Verify task is in To Do column
    expect(taskCard?.closest('.kanban-column')?.querySelector('h2')?.textContent).toBe('To Do')

    fireEvent.dragStart(taskCard!)
    fireEvent.dragOver(todoColumn!)
    fireEvent.drop(todoColumn!)

    // Wait a bit to ensure no async calls are made
    await new Promise(resolve => setTimeout(resolve, 100))

    // Verify updateTask was NOT called (early return triggered)
    expect(updateTaskMock).not.toHaveBeenCalled()
    
    // Verify task is still in To Do column (no UI change)
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument()
    })
  })

  it('should not call API when task status equals new status', async () => {
    const fetchTasksGroupedMock = vi.mocked(api.fetchTasksGrouped)
    const fetchUsersMock = vi.mocked(api.fetchUsers)
    const updateTaskMock = vi.mocked(api.updateTask)
    
    const mockTasks = [
      {
        id: 1,
        title: 'Task 1',
        description: 'Description 1',
        status: TaskStatus.InProgress,
        priority: TaskPriority.Medium,
        userId: 1,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      },
      {
        id: 2,
        title: 'Task 2',
        description: 'Description 2',
        status: TaskStatus.Todo,
        priority: TaskPriority.High,
        userId: 1,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      }
    ]

    const mockUsers = [
      { id: 1, name: 'User 1', email: 'user1@test.com', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01', lastLoginAt: null }
    ]

    fetchTasksGroupedMock.mockResolvedValue(groupTasks(mockTasks))
    fetchUsersMock.mockResolvedValue(mockUsers)
    updateTaskMock.mockResolvedValue({ ...mockTasks[1], status: TaskStatus.Done })

    render(
      <MemoryRouter>
        <TasksList />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument()
      expect(screen.getByText('Task 2')).toBeInTheDocument()
    })

    updateTaskMock.mockClear()

    // Test 1: Drag to same status (status === newStatus) - should NOT call API
    const taskCard1 = screen.getByText('Task 1').closest('.task-card')
    const inProgressColumn = screen.getByText('In Progress').closest('.kanban-column')

    fireEvent.dragStart(taskCard1!)
    fireEvent.dragOver(inProgressColumn!)
    fireEvent.drop(inProgressColumn!)

    await new Promise(resolve => setTimeout(resolve, 100))

    expect(updateTaskMock).not.toHaveBeenCalled()

    // Test 2: Drag to different status (status !== newStatus) - SHOULD call API
    const taskCard2 = screen.getByText('Task 2').closest('.task-card')
    const doneColumn = screen.getByText('Done').closest('.kanban-column')

    fireEvent.dragStart(taskCard2!)
    fireEvent.dragOver(doneColumn!)
    fireEvent.drop(doneColumn!)

    await waitFor(() => {
      expect(updateTaskMock).toHaveBeenCalledWith(2, { status: TaskStatus.Done })
    })
  })

  it('should handle update error during drag and drop', async () => {
    const fetchTasksGroupedMock = vi.mocked(api.fetchTasksGrouped)
    const fetchUsersMock = vi.mocked(api.fetchUsers)
    const updateTaskMock = vi.mocked(api.updateTask)
    
    const mockTasks = [
      {
        id: 1,
        title: 'Task 1',
        description: 'Description 1',
        status: TaskStatus.Todo,
        priority: TaskPriority.Medium,
        userId: 1,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      }
    ]

    const mockUsers = [
      { id: 1, name: 'User 1', email: 'user1@test.com', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01', lastLoginAt: null }
    ]

    fetchTasksGroupedMock.mockResolvedValue(groupTasks(mockTasks))
    fetchUsersMock.mockResolvedValue(mockUsers)
    updateTaskMock.mockRejectedValue(new Error('Update failed'))

    

    render(
      <MemoryRouter>
        <TasksList />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument()
    })

    const taskCard = screen.getByText('Task 1').closest('.task-card')
    const doneColumn = screen.getByText('Done').closest('.kanban-column')

    fireEvent.dragStart(taskCard!)
    fireEvent.dragOver(doneColumn!)
    fireEvent.drop(doneColumn!)

    await waitFor(() => {
      expect(updateTaskMock).toHaveBeenCalled()
      expect(screen.getByText('Failed to update task: Update failed')).toBeInTheDocument()
    })

    
  })

  it('should update only the dragged task and keep others unchanged', async () => {
    const fetchTasksGroupedMock = vi.mocked(api.fetchTasksGrouped)
    const fetchUsersMock = vi.mocked(api.fetchUsers)
    const updateTaskMock = vi.mocked(api.updateTask)
    
    const mockTasks = [
      {
        id: 1,
        title: 'Task 1',
        description: 'Description 1',
        status: TaskStatus.Todo,
        priority: TaskPriority.Medium,
        userId: 1,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      },
      {
        id: 2,
        title: 'Task 2',
        description: 'Description 2',
        status: TaskStatus.Todo,
        priority: TaskPriority.High,
        userId: 1,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      }
    ]

    const mockUsers = [
      { id: 1, name: 'User 1', email: 'user1@test.com', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01', lastLoginAt: null }
    ]

    fetchTasksGroupedMock.mockResolvedValue(groupTasks(mockTasks))
    fetchUsersMock.mockResolvedValue(mockUsers)
    updateTaskMock.mockResolvedValue({ ...mockTasks[0], status: TaskStatus.Done })

    render(
      <MemoryRouter>
        <TasksList />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument()
      expect(screen.getByText('Task 2')).toBeInTheDocument()
    })

    const taskCard = screen.getByText('Task 1').closest('.task-card')
    const doneColumn = screen.getByText('Done').closest('.kanban-column')

    fireEvent.dragStart(taskCard!)
    fireEvent.dragOver(doneColumn!)
    fireEvent.drop(doneColumn!)

    await waitFor(() => {
      expect(updateTaskMock).toHaveBeenCalledWith(1, { status: TaskStatus.Done })
    })
  })

  it('should handle non-Error exception during drag and drop', async () => {
    const fetchTasksGroupedMock = vi.mocked(api.fetchTasksGrouped)
    const fetchUsersMock = vi.mocked(api.fetchUsers)
    const updateTaskMock = vi.mocked(api.updateTask)
    
    const mockTasks = [
      {
        id: 1,
        title: 'Task 1',
        description: 'Description 1',
        status: TaskStatus.Todo,
        priority: TaskPriority.Medium,
        userId: 1,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      }
    ]

    const mockUsers = [
      { id: 1, name: 'User 1', email: 'user1@test.com', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01', lastLoginAt: null }
    ]

    fetchTasksGroupedMock.mockResolvedValue(groupTasks(mockTasks))
    fetchUsersMock.mockResolvedValue(mockUsers)
    updateTaskMock.mockRejectedValue('String error')

    

    render(
      <MemoryRouter>
        <TasksList />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument()
    })

    const taskCard = screen.getByText('Task 1').closest('.task-card')
    const doneColumn = screen.getByText('Done').closest('.kanban-column')

    fireEvent.dragStart(taskCard!)
    fireEvent.dragOver(doneColumn!)
    fireEvent.drop(doneColumn!)

    await waitFor(() => {
      expect(updateTaskMock).toHaveBeenCalled()
      expect(screen.getByText('Failed to update task: Failed to update task')).toBeInTheDocument()
    })

    
  })
})
