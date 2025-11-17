import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Users from '../src/pages/Users/Users';
import * as usersApi from '../src/api/usersApi';

vi.mock('../src/api/usersApi');

describe('Users', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display users list correctly', async () => {
    const mockUsers = [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        dateOfBirth: '1990-01-15',
      },
      {
        id: 2,
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        dateOfBirth: '1992-05-20',
      },
    ];

    vi.mocked(usersApi.fetchUsers).mockResolvedValue(mockUsers);

    render(
      <MemoryRouter>
        <Users />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('John')).toBeInTheDocument();
      expect(screen.getByText('Jane')).toBeInTheDocument();
    });

    expect(screen.getByText('Doe')).toBeInTheDocument();
    expect(screen.getByText('Smith')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  it('should show loading state initially', () => {
    vi.mocked(usersApi.fetchUsers).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(
      <MemoryRouter>
        <Users />
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it('should display error message when fetch fails', async () => {
    const errorMessage = 'Failed to fetch users';
    vi.mocked(usersApi.fetchUsers).mockRejectedValue(new Error(errorMessage));

    render(
      <MemoryRouter>
        <Users />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('should render email links correctly', async () => {
    const mockUsers = [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        dateOfBirth: '1990-01-15',
      },
    ];

    vi.mocked(usersApi.fetchUsers).mockResolvedValue(mockUsers);

    render(
      <MemoryRouter>
        <Users />
      </MemoryRouter>
    );

    await waitFor(() => {
      const emailLink = screen.getByText('john@example.com');
      expect(emailLink).toBeInTheDocument();
      expect(emailLink).toHaveAttribute('href', '/users/1');
    });
  });
});
