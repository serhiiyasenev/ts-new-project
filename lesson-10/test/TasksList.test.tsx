import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TasksList from '../src/pages/TasksList/TasksList';
import * as api from '../src/api';
import '@testing-library/jest-dom';

vi.mock('../src/api');

describe('TasksList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display tasks correctly', async () => {
    const mockTasks = [
      {
        id: 1,
        title: 'Test Task 1',
        description: 'Test description 1',
        status: 'To Do' as const,
        dueDate: '2025-12-01',
        createdAt: '2025-11-15T10:00:00.000Z',
      },
      {
        id: 2,
        title: 'Test Task 2',
        description: 'Test description 2',
        status: 'In Progress' as const,
        dueDate: '2025-12-05',
        createdAt: '2025-11-15T11:00:00.000Z',
      },
    ];

    vi.mocked(api.fetchTasks).mockResolvedValue(mockTasks);

    render(
      <MemoryRouter>
        <TasksList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
      expect(screen.getByText('Test Task 2')).toBeInTheDocument();
    });

    expect(screen.getByText('Test description 1')).toBeInTheDocument();
    expect(screen.getByText('Test description 2')).toBeInTheDocument();
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  it('should show empty state when no tasks exist', async () => {
    vi.mocked(api.fetchTasks).mockResolvedValue([]);

    render(
      <MemoryRouter>
        <TasksList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/No tasks yet/i)).toBeInTheDocument();
    });

    expect(screen.getByRole('link', { name: /Create Task/i })).toBeInTheDocument();
  });

  it('should display error message when fetch fails', async () => {
    const errorMessage = 'Failed to fetch tasks';
    vi.mocked(api.fetchTasks).mockRejectedValue(new Error(errorMessage));

    render(
      <MemoryRouter>
        <TasksList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch tasks/i)).toBeInTheDocument();
    });
  });
});
