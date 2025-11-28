import { describe, it, expect, vi } from 'vitest'
import UserDetails from '../src/pages/UserDetails/UserDetails'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
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

describe('UserDetails - Additional Coverage', () => {
  it('should handle update error', async () => {
    const user = userEvent.setup()
    const fetchUserByIdMock = vi.mocked(api.fetchUserById)
    const updateUserMock = vi.mocked(api.updateUser)
    
    const mockUser = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      isActive: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      lastLoginAt: '2024-01-01'
    }

    fetchUserByIdMock.mockResolvedValue(mockUser)
    updateUserMock.mockRejectedValue(new Error('Update failed'))

    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

    render(
      <MemoryRouter initialEntries={['/users/1']}>
        <Routes>
          <Route path="/users/:id" element={<UserDetails />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument()
    })

    const editButton = screen.getByRole('button', { name: /Edit/i })
    await user.click(editButton)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Save Changes/i })).toBeInTheDocument()
    })

    const nameInput = screen.getByLabelText(/Name/i)
    await user.clear(nameInput)
    await user.type(nameInput, 'Updated User')

    const saveButton = screen.getByRole('button', { name: /Save Changes/i })
    await user.click(saveButton)

    await waitFor(() => {
      expect(updateUserMock).toHaveBeenCalled()
      expect(alertSpy).toHaveBeenCalledWith('Update failed')
    })

    alertSpy.mockRestore()
  })

  it('should handle delete cancellation', async () => {
    const user = userEvent.setup()
    const fetchUserByIdMock = vi.mocked(api.fetchUserById)
    const deleteUserMock = vi.mocked(api.deleteUser)
    
    const mockUser = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      isActive: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      lastLoginAt: null
    }

    fetchUserByIdMock.mockResolvedValue(mockUser)

    vi.spyOn(window, 'confirm').mockReturnValue(false)

    render(
      <MemoryRouter initialEntries={['/users/1']}>
        <Routes>
          <Route path="/users/:id" element={<UserDetails />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument()
    })

    const deleteButton = screen.getByRole('button', { name: /Delete/i })
    await user.click(deleteButton)

    expect(deleteUserMock).not.toHaveBeenCalled()
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('should handle delete error', async () => {
    const user = userEvent.setup()
    const fetchUserByIdMock = vi.mocked(api.fetchUserById)
    const deleteUserMock = vi.mocked(api.deleteUser)
    
    const mockUser = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      isActive: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      lastLoginAt: null
    }

    fetchUserByIdMock.mockResolvedValue(mockUser)
    deleteUserMock.mockRejectedValue(new Error('Delete failed'))

    vi.spyOn(window, 'confirm').mockReturnValue(true)
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

    render(
      <MemoryRouter initialEntries={['/users/1']}>
        <Routes>
          <Route path="/users/:id" element={<UserDetails />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument()
    })

    const deleteButton = screen.getByRole('button', { name: /Delete/i })
    await user.click(deleteButton)

    await waitFor(() => {
      expect(deleteUserMock).toHaveBeenCalled()
      expect(alertSpy).toHaveBeenCalledWith('Delete failed')
    })

    alertSpy.mockRestore()
  })

  it('should display user with lastLoginAt as Never when null', async () => {
    const fetchUserByIdMock = vi.mocked(api.fetchUserById)
    
    const mockUser = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      isActive: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      lastLoginAt: null
    }

    fetchUserByIdMock.mockResolvedValue(mockUser)

    render(
      <MemoryRouter initialEntries={['/users/1']}>
        <Routes>
          <Route path="/users/:id" element={<UserDetails />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Never')).toBeInTheDocument()
    })
  })

  it('should handle non-Error update exception', async () => {
    const user = userEvent.setup()
    const fetchUserByIdMock = vi.mocked(api.fetchUserById)
    const updateUserMock = vi.mocked(api.updateUser)
    
    const mockUser = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      isActive: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      lastLoginAt: null
    }

    fetchUserByIdMock.mockResolvedValue(mockUser)
    updateUserMock.mockRejectedValue('String error')

    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

    render(
      <MemoryRouter initialEntries={['/users/1']}>
        <Routes>
          <Route path="/users/:id" element={<UserDetails />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument()
    })

    const editButton = screen.getByRole('button', { name: /Edit/i })
    await user.click(editButton)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Save Changes/i })).toBeInTheDocument()
    })

    // Make a change to enable the save button
    const nameInput = screen.getByLabelText(/Name/i)
    await user.clear(nameInput)
    await user.type(nameInput, 'Updated User')

    const saveButton = screen.getByRole('button', { name: /Save Changes/i })
    await user.click(saveButton)

    await waitFor(() => {
      expect(updateUserMock).toHaveBeenCalled()
      expect(alertSpy).toHaveBeenCalledWith('Failed to update user')
    })

    alertSpy.mockRestore()
  })

  it('should handle non-Error delete exception', async () => {
    const user = userEvent.setup()
    const fetchUserByIdMock = vi.mocked(api.fetchUserById)
    const deleteUserMock = vi.mocked(api.deleteUser)
    
    const mockUser = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      isActive: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      lastLoginAt: null
    }

    fetchUserByIdMock.mockResolvedValue(mockUser)
    deleteUserMock.mockRejectedValue('String error')

    vi.spyOn(window, 'confirm').mockReturnValue(true)
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

    render(
      <MemoryRouter initialEntries={['/users/1']}>
        <Routes>
          <Route path="/users/:id" element={<UserDetails />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument()
    })

    const deleteButton = screen.getByRole('button', { name: /Delete/i })
    await user.click(deleteButton)

    await waitFor(() => {
      expect(deleteUserMock).toHaveBeenCalled()
      expect(alertSpy).toHaveBeenCalledWith('Failed to delete user')
    })

    alertSpy.mockRestore()
  })

it('should successfully update user and exit edit mode', async () => {
  const user = userEvent.setup();
  const fetchUserByIdMock = vi.mocked(api.fetchUserById);
  const updateUserMock = vi.mocked(api.updateUser);
  
  const mockUser = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    isActive: true,
    lastLoginAt: null,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  };

  const updatedUser = {
    ...mockUser,
    name: 'Updated User'
  };

  fetchUserByIdMock.mockResolvedValue(mockUser);
  updateUserMock.mockResolvedValue(updatedUser);

  render(
    <MemoryRouter initialEntries={['/users/1']}>
      <Routes>
        <Route path="/users/:id" element={<UserDetails />} />
      </Routes>
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  const editButton = screen.getByRole('button', { name: /Edit/i });
  await user.click(editButton);

  await waitFor(() => {
    expect(screen.getByRole('button', { name: /Save/i })).toBeInTheDocument();
  });

  const nameInput = screen.getByLabelText(/Name/i);
  await user.clear(nameInput);
  await user.type(nameInput, 'Updated User');

  const saveButton = screen.getByRole('button', { name: /Save/i });
  await user.click(saveButton);

  await waitFor(() => {
    expect(updateUserMock).toHaveBeenCalled();
    expect(screen.getByText('Updated User')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Edit/i })).toBeInTheDocument();
  });
});

it('should successfully delete user and navigate to users list', async () => {
  const user = userEvent.setup();
  const fetchUserByIdMock = vi.mocked(api.fetchUserById);
  const deleteUserMock = vi.mocked(api.deleteUser);
  
  const mockUser = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    isActive: true,
    lastLoginAt: null,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  };

  fetchUserByIdMock.mockResolvedValue(mockUser);
  deleteUserMock.mockResolvedValue(undefined);

  vi.spyOn(window, 'confirm').mockReturnValue(true);

  render(
    <MemoryRouter initialEntries={['/users/1']}>
      <Routes>
        <Route path="/users/:id" element={<UserDetails />} />
      </Routes>
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  const deleteButton = screen.getByRole('button', { name: /Delete/i });
  await user.click(deleteButton);

  await waitFor(() => {
    expect(deleteUserMock).toHaveBeenCalledWith(1);
    expect(mockNavigate).toHaveBeenCalledWith('/users');
  });
});

it('should cancel edit mode when cancel button is clicked', async () => {
  const user = userEvent.setup();
  const fetchUserByIdMock = vi.mocked(api.fetchUserById);
  
  const mockUser = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    isActive: true,
    lastLoginAt: null,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  };

  fetchUserByIdMock.mockResolvedValue(mockUser);

  render(
    <MemoryRouter initialEntries={['/users/1']}>
      <Routes>
        <Route path="/users/:id" element={<UserDetails />} />
      </Routes>
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  const editButton = screen.getByRole('button', { name: /Edit/i });
  await user.click(editButton);

  await waitFor(() => {
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
  });

  const cancelButton = screen.getByRole('button', { name: /Cancel/i });
  await user.click(cancelButton);

  await waitFor(() => {
    expect(screen.getByRole('button', { name: /Edit/i })).toBeInTheDocument();
  });
});

it('should show user not found when user is null', async () => {
  const fetchUserByIdMock = vi.mocked(api.fetchUserById);
  
  fetchUserByIdMock.mockRejectedValue(new Error('User not found'));

  render(
    <MemoryRouter initialEntries={['/users/1']}>
      <Routes>
        <Route path="/users/:id" element={<UserDetails />} />
      </Routes>
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText(/User not found/i)).toBeInTheDocument();
  });
});
});
