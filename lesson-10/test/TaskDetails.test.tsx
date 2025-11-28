import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import TaskDetails from '../src/pages/TaskDetails/TaskDetails';
import type { Task } from '../src/types/task';
import * as api from '../src/api';

vi.mock('../src/api');

describe('TaskDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display task details correctly', async () => {
    const mockTask: Task = {
      id: 1,
      title: 'Test Task',
      description: 'This is a test task description',
      status: 'todo',
      priority: 'high',
      userId: null,
      createdAt: '2025-11-17T10:00:00.000Z',
      updatedAt: '2025-11-17T10:00:00.000Z',
    };

    vi.mocked(api.fetchTaskById).mockResolvedValue(mockTask);
    vi.mocked(api.fetchUsers).mockResolvedValue([]);

    render(
      <MemoryRouter initialEntries={['/tasks/1']}>
        <Routes>
          <Route path="/tasks/:id" element={<TaskDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Task')).toBeInTheDocument();
    });

    expect(screen.getByText('This is a test task description')).toBeInTheDocument();
    expect(screen.getByText('high')).toBeInTheDocument();
  });

  it('should show loading state initially', () => {
    vi.mocked(api.fetchTaskById).mockImplementation(
      () => new Promise(() => {})
    );

    render(
      <MemoryRouter initialEntries={['/tasks/1']}>
        <Routes>
          <Route path="/tasks/:id" element={<TaskDetails />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it('should display error message when fetch fails', async () => {
    const errorMessage = 'Failed to fetch task';
    vi.mocked(api.fetchTaskById).mockRejectedValue(
      new Error(errorMessage)
    );

    render(
      <MemoryRouter initialEntries={['/tasks/1']}>
        <Routes>
          <Route path="/tasks/:id" element={<TaskDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
    });
  });

  it('should have back to tasks link', async () => {
    const mockTask: Task = {
      id: 1,
      title: 'Test Task',
      description: 'Test description',
      status: 'todo',
      priority: 'medium',
      userId: null,
      createdAt: '2025-11-17T10:00:00.000Z',
      updatedAt: '2025-11-17T10:00:00.000Z',
    };

    vi.mocked(api.fetchTaskById).mockResolvedValue(mockTask);
    vi.mocked(api.fetchUsers).mockResolvedValue([]);

    render(
      <MemoryRouter initialEntries={['/tasks/1']}>
        <Routes>
          <Route path="/tasks/:id" element={<TaskDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Back to Board/i)).toBeInTheDocument();
    });

    const backLink = screen.getByText(/Back to Tasks/i);
    expect(backLink).toHaveAttribute('href', '/tasks');
  });

  it('should show "Task not found" when API returns null', async () => {
    vi.mocked(api.fetchTaskById).mockRejectedValue(new Error('Task not found'));

    render(
      <MemoryRouter initialEntries={['/tasks/1']}>
        <Routes>
          <Route path="/tasks/:id" element={<TaskDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Task not found/i)).toBeInTheDocument();
    });
  });

  it('renders fallbacks for missing fields', async () => {
    const mockTask: Task = {
      id: 2,
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      userId: null,
      createdAt: '',
      updatedAt: '',
    };
    vi.mocked(api.fetchTaskById).mockResolvedValue(mockTask);
    vi.mocked(api.fetchUsers).mockResolvedValue([]);

    render(
      <MemoryRouter initialEntries={['/tasks/2']}>
        <Routes>
          <Route path="/tasks/:id" element={<TaskDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('No description provided')).toBeInTheDocument();
    });
  });

  it('renders status correctly', async () => {
    const mockTask: Task = {
      id: 3,
      title: 'Test Task',
      description: 'Test Description',
      status: 'in_progress',
      priority: 'high',
      userId: null,
      createdAt: '2025-11-17T10:00:00.000Z',
      updatedAt: '2025-11-17T10:00:00.000Z',
    };
    vi.mocked(api.fetchTaskById).mockResolvedValue(mockTask);
    vi.mocked(api.fetchUsers).mockResolvedValue([]);

    const { container } = render(
      <MemoryRouter initialEntries={['/tasks/3']}>
        <Routes>
          <Route path="/tasks/:id" element={<TaskDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      const statusEl = container.querySelector('.task-status');
      expect(statusEl).toBeTruthy();
      expect(statusEl?.className).toContain('status-in_progress');
    });
  });

  it('does nothing when no id param is provided (loading stays true)', () => {
    render(
      <MemoryRouter initialEntries={['/tasks']}>
        <Routes>
          <Route path="/tasks" element={<TaskDetails />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });
});
