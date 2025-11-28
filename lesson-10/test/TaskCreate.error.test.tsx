import { describe, it, expect, vi } from 'vitest'
import TaskCreate from '../src/pages/TaskCreate/TaskCreate'
import { render, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import * as api from '../src/api'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})
vi.mock('../src/api')

describe('TaskCreate - Error Handling', () => {
  it('should handle fetchUsers error', async () => {
    const fetchUsersMock = vi.mocked(api.fetchUsers)
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    fetchUsersMock.mockRejectedValue(new Error('Failed to fetch users'))

    render(
      <MemoryRouter>
        <TaskCreate />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(fetchUsersMock).toHaveBeenCalled()
      expect(consoleErrorSpy).toHaveBeenCalled()
    })

    consoleErrorSpy.mockRestore()
  })
})
