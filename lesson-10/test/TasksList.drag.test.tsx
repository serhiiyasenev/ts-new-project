import { describe, it, expect, vi } from 'vitest'
import TasksList from '../src/pages/TasksList/TasksList'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import * as api from '../src/api'

vi.mock('../src/api')

describe('TasksList - Drag and Drop', () => {
  it('should handle drag and drop to update task status', async () => {
    const fetchTasksMock = vi.mocked(api.fetchTasks)
    const fetchUsersMock = vi.mocked(api.fetchUsers)
    const updateTaskMock = vi.mocked(api.updateTask)
    
    const mockTasks = [
      {
        id: 1,
        title: 'Task 1',
        description: 'Description 1',
        status: 'todo' as const,
        priority: 'medium' as const,
        userId: 1,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      }
    ]

    const mockUsers = [
      { id: 1, name: 'User 1', email: 'user1@test.com', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01', lastLoginAt: null }
    ]

    fetchTasksMock.mockResolvedValue(mockTasks)
    fetchUsersMock.mockResolvedValue(mockUsers)
    updateTaskMock.mockResolvedValue({ ...mockTasks[0], status: 'done' })

    render(
      <MemoryRouter>
        <TasksList />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument()
    })

    const taskCard = screen.getByText('Task 1').closest('.task-card')
    const doneColumn = screen.getByText('DONE').closest('.task-column')

    fireEvent.dragStart(taskCard!)
    fireEvent.dragOver(doneColumn!)
    fireEvent.drop(doneColumn!)

    await waitFor(() => {
      expect(updateTaskMock).toHaveBeenCalledWith(1, { status: 'done' })
    })
  })

  it('should not update when dropping on same status', async () => {
    const fetchTasksMock = vi.mocked(api.fetchTasks)
    const fetchUsersMock = vi.mocked(api.fetchUsers)
    const updateTaskMock = vi.mocked(api.updateTask)
    
    const mockTasks = [
      {
        id: 1,
        title: 'Task 1',
        description: 'Description 1',
        status: 'todo' as const,
        priority: 'medium' as const,
        userId: 1,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      }
    ]

    const mockUsers = [
      { id: 1, name: 'User 1', email: 'user1@test.com', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01', lastLoginAt: null }
    ]

    fetchTasksMock.mockResolvedValue(mockTasks)
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
    const todoColumn = screen.getByText('TO DO').closest('.task-column')

    fireEvent.dragStart(taskCard!)
    fireEvent.dragOver(todoColumn!)
    fireEvent.drop(todoColumn!)

    // Wait a bit to ensure no async calls are made
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(updateTaskMock).not.toHaveBeenCalled()
  })

  it('should handle update error during drag and drop', async () => {
    const fetchTasksMock = vi.mocked(api.fetchTasks)
    const fetchUsersMock = vi.mocked(api.fetchUsers)
    const updateTaskMock = vi.mocked(api.updateTask)
    
    const mockTasks = [
      {
        id: 1,
        title: 'Task 1',
        description: 'Description 1',
        status: 'todo' as const,
        priority: 'medium' as const,
        userId: 1,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      }
    ]

    const mockUsers = [
      { id: 1, name: 'User 1', email: 'user1@test.com', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01', lastLoginAt: null }
    ]

    fetchTasksMock.mockResolvedValue(mockTasks)
    fetchUsersMock.mockResolvedValue(mockUsers)
    updateTaskMock.mockRejectedValue(new Error('Update failed'))

    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

    render(
      <MemoryRouter>
        <TasksList />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument()
    })

    const taskCard = screen.getByText('Task 1').closest('.task-card')
    const doneColumn = screen.getByText('DONE').closest('.task-column')

    fireEvent.dragStart(taskCard!)
    fireEvent.dragOver(doneColumn!)
    fireEvent.drop(doneColumn!)

    await waitFor(() => {
      expect(updateTaskMock).toHaveBeenCalled()
      expect(alertSpy).toHaveBeenCalledWith('Update failed')
    })

    alertSpy.mockRestore()
  })
})
