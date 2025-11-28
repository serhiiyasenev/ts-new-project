import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Users from '../src/pages/Users/Users';
import * as api from '../src/api';

vi.mock('../src/api');

describe('Users', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display users list correctly', async () => {
    const mockUsers = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        isActive: true,
        lastLoginAt: null,
        createdAt: '2025-11-20',
        updatedAt: '2025-11-20'
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        isActive: false,
        lastLoginAt: null,
        createdAt: '2025-11-20',
        updatedAt: '2025-11-20'
      },
    ];

    vi.mocked(api.fetchUsers).mockResolvedValue(mockUsers);

    render(
      <MemoryRouter>
        <Users />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });

  it('should show loading state initially', () => {
    vi.mocked(api.fetchUsers).mockImplementation(
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
    vi.mocked(api.fetchUsers).mockRejectedValue(new Error(errorMessage));

    render(
      <MemoryRouter>
        <Users />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('shows default error text when rejection is not an Error instance', async () => {
    // provide a non-Error rejection at runtime but keep TypeScript happy
    vi.mocked(api.fetchUsers).mockRejectedValue('oops' as unknown as Error);

    render(
      <MemoryRouter>
        <Users />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch users')).toBeInTheDocument();
    });
  });

  it('should render name links correctly', async () => {
    vi.mocked(api.fetchUsers).mockResolvedValue([
      { id: 1, name: 'John Doe', email: 'john@example.com', isActive: true, createdAt: '2025-11-20', updatedAt: '2025-11-20', lastLoginAt: null }
    ]);

    render(
      <MemoryRouter>
        <Users />
      </MemoryRouter>
    );

    await waitFor(() => {
      const nameLink = screen.getByText('John Doe');
      expect(nameLink).toBeInTheDocument();
      expect(nameLink).toHaveAttribute('href', '/users/1');
      
      const email = screen.getByText('john@example.com');
      expect(email).toBeInTheDocument();
    });
  });
});
