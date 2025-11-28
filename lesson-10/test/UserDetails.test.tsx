import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import UserDetails from '../src/pages/UserDetails/UserDetails';
import * as api from '../src/api';

vi.mock('../src/api');

describe('UserDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display user details correctly', async () => {
    const mockUser = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      isActive: true,
      lastLoginAt: null,
      createdAt: '2025-11-20',
      updatedAt: '2025-11-20'
    };

    vi.mocked(api.fetchUserById).mockResolvedValue(mockUser);

    render(
      <MemoryRouter initialEntries={['/users/1']}>
        <Routes>
          <Route path="/users/:id" element={<UserDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('should show loading state initially', () => {
    vi.mocked(api.fetchUserById).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(
      <MemoryRouter initialEntries={['/users/1']}>
        <Routes>
          <Route path="/users/:id" element={<UserDetails />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it('should display error message when fetch fails', async () => {
    const errorMessage = 'Failed to fetch user';
    vi.mocked(api.fetchUserById).mockRejectedValue(
      new Error(errorMessage)
    );

    render(
      <MemoryRouter initialEntries={['/users/1']}>
        <Routes>
          <Route path="/users/:id" element={<UserDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
    });
  });

  it('should have back to users link', async () => {
    const mockUser = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      isActive: true,
      lastLoginAt: null,
      createdAt: '2025-11-20',
      updatedAt: '2025-11-20'
    };

    vi.mocked(api.fetchUserById).mockResolvedValue(mockUser);

    render(
      <MemoryRouter initialEntries={['/users/1']}>
        <Routes>
          <Route path="/users/:id" element={<UserDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Back to Users')).toBeInTheDocument();
    });

    const backLink = screen.getByText('Back to Users');
    expect(backLink).toHaveAttribute('href', '/users');
  });

  it('should show error when API returns null', async () => {
    vi.mocked(api.fetchUserById).mockRejectedValue(new Error('User not found'));

    render(
      <MemoryRouter initialEntries={['/users/1']}>
        <Routes>
          <Route path="/users/:id" element={<UserDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Error:/i)).toBeInTheDocument();
    });
  });

  it('does nothing when no id param is provided (loading stays true)', () => {
    render(
      <MemoryRouter initialEntries={['/users']}>
        <Routes>
          <Route path="/users" element={<UserDetails />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

});
