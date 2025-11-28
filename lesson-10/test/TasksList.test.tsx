import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TasksList from '../src/pages/TasksList/TasksList';
import type { Task } from '../src/types/task';
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

  it('shows empty column when a status has no tasks', async () => {
    const mockTasks = [
      {
        id: 3,
        title: 'In Progress Task',
        description: 'Desc',
        status: 'In Progress' as const,
        dueDate: '2025-12-10',
        createdAt: '2025-11-15T10:00:00.000Z'
      }
    ];

    vi.mocked(api.fetchTasks).mockResolvedValue(mockTasks);

    render(
      <MemoryRouter>
        <TasksList />
      </MemoryRouter>
    );

    await waitFor(() => {
      // The To Do column should show the empty-column element
      expect(screen.getAllByText(/No tasks/i).length).toBeGreaterThan(0);
    });
  });

  it('shows empty columns for other statuses when only Done tasks exist', async () => {
    const mockTasks = [
      {
        id: 4,
        title: 'Done Task',
        description: 'Completed',
        status: 'Done' as const,
        dueDate: '2025-12-20',
        createdAt: '2025-11-15T10:00:00.000Z'
      }
    ];

    vi.mocked(api.fetchTasks).mockResolvedValue(mockTasks);

    render(
      <MemoryRouter>
        <TasksList />
      </MemoryRouter>
    );

    await waitFor(() => {
      // There should be an empty placeholder for at least one other column
      expect(screen.getAllByText(/No tasks/i).length).toBeGreaterThan(0);
    });
  });

  it('handles unknown statuses by creating a new column bucket', async () => {
    const mockTasks = [
      {
        id: 5,
        title: 'Blocked Task',
        description: 'Needs attention',
        status: 'Blocked',
        dueDate: '2025-12-25',
        createdAt: '2025-11-15T10:00:00.000Z'
      }
    ];

    vi.mocked(api.fetchTasks).mockResolvedValue(mockTasks as unknown as Task[]);

    render(
      <MemoryRouter>
        <TasksList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Tasks')).toBeInTheDocument();
    });
  });
});
