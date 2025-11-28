import { describe, it, expect, vi } from 'vitest'
import Users from '../src/pages/Users/Users'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import * as api from '../src/api'

vi.mock('../src/api')

describe('Users - Additional Coverage', () => {
  it('should handle delete cancellation', async () => {
    const user = userEvent.setup()
    const fetchUsersMock = vi.mocked(api.fetchUsers)
    const deleteUserMock = vi.mocked(api.deleteUser)
    
    const mockUsers = [
      {
        id: 1,
        name: 'User 1',
        email: 'user1@example.com',
        isActive: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
        lastLoginAt: null
      }
    ]

    fetchUsersMock.mockResolvedValue(mockUsers)

    vi.spyOn(window, 'confirm').mockReturnValue(false)

    render(
      <MemoryRouter>
        <Users />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('User 1')).toBeInTheDocument()
    })

    const deleteButton = screen.getByRole('button', { name: /Delete/i })
    await user.click(deleteButton)

    expect(deleteUserMock).not.toHaveBeenCalled()
  })

  it('should handle delete error', async () => {
    const user = userEvent.setup()
    const fetchUsersMock = vi.mocked(api.fetchUsers)
    const deleteUserMock = vi.mocked(api.deleteUser)
    
    const mockUsers = [
      {
        id: 1,
        name: 'User 1',
        email: 'user1@example.com',
        isActive: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
        lastLoginAt: null
      }
    ]

    fetchUsersMock.mockResolvedValue(mockUsers)
    deleteUserMock.mockRejectedValue(new Error('Delete failed'))

    vi.spyOn(window, 'confirm').mockReturnValue(true)
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

    render(
      <MemoryRouter>
        <Users />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('User 1')).toBeInTheDocument()
    })

    const deleteButton = screen.getByRole('button', { name: /Delete/i })
    await user.click(deleteButton)

    await waitFor(() => {
      expect(deleteUserMock).toHaveBeenCalled()
      expect(alertSpy).toHaveBeenCalledWith('Delete failed')
    })

    alertSpy.mockRestore()
  })

  it('should handle non-Error delete exception', async () => {
    const user = userEvent.setup()
    const fetchUsersMock = vi.mocked(api.fetchUsers)
    const deleteUserMock = vi.mocked(api.deleteUser)
    
    const mockUsers = [
      {
        id: 1,
        name: 'User 1',
        email: 'user1@example.com',
        isActive: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
        lastLoginAt: null
      }
    ]

    fetchUsersMock.mockResolvedValue(mockUsers)
    deleteUserMock.mockRejectedValue('String error')

    vi.spyOn(window, 'confirm').mockReturnValue(true)
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

    render(
      <MemoryRouter>
        <Users />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('User 1')).toBeInTheDocument()
    })

    const deleteButton = screen.getByRole('button', { name: /Delete/i })
    await user.click(deleteButton)

    await waitFor(() => {
      expect(deleteUserMock).toHaveBeenCalled()
      expect(alertSpy).toHaveBeenCalledWith('Failed to delete user')
    })

    alertSpy.mockRestore()
  })

  it('should successfully delete user and update list', async () => {
    const user = userEvent.setup()
    const fetchUsersMock = vi.mocked(api.fetchUsers)
    const deleteUserMock = vi.mocked(api.deleteUser)
    
    const mockUsers = [
      {
        id: 1,
        name: 'User 1',
        email: 'user1@example.com',
        isActive: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
        lastLoginAt: null
      },
      {
        id: 2,
        name: 'User 2',
        email: 'user2@example.com',
        isActive: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
        lastLoginAt: null
      }
    ]

    fetchUsersMock.mockResolvedValue(mockUsers)
    deleteUserMock.mockResolvedValue(undefined)

    vi.spyOn(window, 'confirm').mockReturnValue(true)

    render(
      <MemoryRouter>
        <Users />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('User 1')).toBeInTheDocument()
      expect(screen.getByText('User 2')).toBeInTheDocument()
    })

    const deleteButtons = screen.getAllByRole('button', { name: /Delete/i })
    await user.click(deleteButtons[0])

    await waitFor(() => {
      expect(deleteUserMock).toHaveBeenCalledWith(1)
      expect(screen.queryByText('User 1')).not.toBeInTheDocument()
      expect(screen.getByText('User 2')).toBeInTheDocument()
    })
  })
})
