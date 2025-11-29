import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TasksList from '../src/pages/TasksList/TasksList';
import * as api from '../src/api';
import { TaskStatus, TaskPriority } from '../src/types';
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
        status: TaskStatus.Todo,
        priority: TaskPriority.High,
        userId: null,
        createdAt: '2025-11-15T10:00:00.000Z',
        updatedAt: '2025-11-15T10:00:00.000Z',
      },
      {
        id: 2,
        title: 'Test Task 2',
        description: 'Test description 2',
        status: TaskStatus.InProgress,
        priority: TaskPriority.Medium,
        userId: null,
        createdAt: '2025-11-15T11:00:00.000Z',
        updatedAt: '2025-11-15T11:00:00.000Z',
      },
    ];

    vi.mocked(api.fetchTasks).mockResolvedValue(mockTasks);
    vi.mocked(api.fetchUsers).mockResolvedValue([]);

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
    expect(screen.getByText('TO DO')).toBeInTheDocument();
    expect(screen.getByText('IN PROGRESS')).toBeInTheDocument();
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
        status: TaskStatus.InProgress,
        priority: TaskPriority.Medium,
        userId: null,
        createdAt: '2025-11-15T10:00:00.000Z',
        updatedAt: '2025-11-15T10:00:00.000Z'
      }
    ];

    vi.mocked(api.fetchTasks).mockResolvedValue(mockTasks);
    vi.mocked(api.fetchUsers).mockResolvedValue([]);

    render(
      <MemoryRouter>
        <TasksList />
      </MemoryRouter>
    );

    await waitFor(() => {
      // The To Do and Done columns should show "Drop tasks here"
      expect(screen.getAllByText(/Drop tasks here/i).length).toBeGreaterThan(0);
    });
  });

  it('shows empty columns for other statuses when only Done tasks exist', async () => {
    const mockTasks = [
      {
        id: 4,
        title: 'Done Task',
        description: 'Completed',
        status: TaskStatus.Done,
        priority: TaskPriority.Low,
        userId: null,
        createdAt: '2025-11-15T10:00:00.000Z',
        updatedAt: '2025-11-15T10:00:00.000Z'
      }
    ];

    vi.mocked(api.fetchTasks).mockResolvedValue(mockTasks);
    vi.mocked(api.fetchUsers).mockResolvedValue([]);

    render(
      <MemoryRouter>
        <TasksList />
      </MemoryRouter>
    );

    await waitFor(() => {
      // There should be "Drop tasks here" for TO DO and IN PROGRESS columns
      expect(screen.getAllByText(/Drop tasks here/i).length).toBeGreaterThan(0);
    });
  });

  it('renders board with correct title', async () => {
    const mockTasks = [
      {
        id: 5,
        title: 'Test Task',
        description: 'Test',
        status: TaskStatus.Todo,
        priority: TaskPriority.Medium,
        userId: null,
        createdAt: '2025-11-15T10:00:00.000Z',
        updatedAt: '2025-11-15T10:00:00.000Z'
      }
    ];

    vi.mocked(api.fetchTasks).mockResolvedValue(mockTasks);
    vi.mocked(api.fetchUsers).mockResolvedValue([]);

    render(
      <MemoryRouter>
        <TasksList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Board')).toBeInTheDocument();
    });
  });

  it('should handle non-Error exception when loading data fails', async () => {
    vi.mocked(api.fetchTasks).mockRejectedValue('String error');
    vi.mocked(api.fetchUsers).mockRejectedValue('String error');

    render(
      <MemoryRouter>
        <TasksList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Failed to load data/i)).toBeInTheDocument();
    });
  });

  it('should display user name fallback when user not found', async () => {
    const mockTasks = [
      {
        id: 1,
        title: 'Task with unknown user',
        description: 'Description',
        status: TaskStatus.Todo,
        priority: TaskPriority.High,
        userId: 999,
        createdAt: '2025-11-15T10:00:00.000Z',
        updatedAt: '2025-11-15T10:00:00.000Z',
      },
    ];

    vi.mocked(api.fetchTasks).mockResolvedValue(mockTasks);
    vi.mocked(api.fetchUsers).mockResolvedValue([]);

    render(
      <MemoryRouter>
        <TasksList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Task with unknown user')).toBeInTheDocument();
      expect(screen.getByText(/User #999/)).toBeInTheDocument();
    });
  });

  it('should filter tasks by status correctly with unknown status', async () => {
    const mockTasks = [
      {
        id: 1,
        title: 'Todo Task',
        description: 'Description',
        status: TaskStatus.Todo,
        priority: TaskPriority.High,
        userId: null,
        createdAt: '2025-11-15T10:00:00.000Z',
        updatedAt: '2025-11-15T10:00:00.000Z',
      },
      {
        id: 2,
        title: 'Done Task',
        description: 'Description',
        status: TaskStatus.Done,
        priority: TaskPriority.Medium,
        userId: null,
        createdAt: '2025-11-15T11:00:00.000Z',
        updatedAt: '2025-11-15T11:00:00.000Z',
      },
      {
        id: 3,
        title: 'Unknown Status Task',
        description: 'Description',
        status: 'unknown_status' as TaskStatus,
        priority: TaskPriority.Medium,
        userId: null,
        createdAt: '2025-11-15T12:00:00.000Z',
        updatedAt: '2025-11-15T12:00:00.000Z',
      },
    ];

    vi.mocked(api.fetchTasks).mockResolvedValue(mockTasks);
    vi.mocked(api.fetchUsers).mockResolvedValue([]);

    render(
      <MemoryRouter>
        <TasksList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Todo Task')).toBeInTheDocument();
      expect(screen.getByText('Done Task')).toBeInTheDocument();
    });
  });
});
