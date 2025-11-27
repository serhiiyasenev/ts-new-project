import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import TaskDetails from '../src/pages/TaskDetails/TaskDetails';
import * as api from '../src/api';

vi.mock('../src/api');

describe('TaskDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display task details correctly', async () => {
    const mockTask = {
      id: 1,
      title: 'Test Task',
      description: 'This is a test task description',
      status: 'To Do' as const,
      dueDate: '2025-12-31',
      createdAt: '2025-11-17T10:00:00.000Z',
    };

    vi.mocked(api.fetchTaskById).mockResolvedValue(mockTask);

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
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('2025-12-31')).toBeInTheDocument();
  });

  it('should show loading state initially', () => {
    vi.mocked(api.fetchTaskById).mockImplementation(
      () => new Promise(() => {}) // Never resolves
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
    const mockTask = {
      id: 1,
      title: 'Test Task',
      description: 'Test description',
      status: 'To Do' as const,
      dueDate: '2025-12-31',
      createdAt: '2025-11-17T10:00:00.000Z',
    };

    vi.mocked(api.fetchTaskById).mockResolvedValue(mockTask);

    render(
      <MemoryRouter initialEntries={['/tasks/1']}>
        <Routes>
          <Route path="/tasks/:id" element={<TaskDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Back to Tasks/i)).toBeInTheDocument();
    });

    const backLink = screen.getByText(/Back to Tasks/i);
    expect(backLink).toHaveAttribute('href', '/tasks');
  });

  it('should show "Task not found" when API returns null', async () => {
    vi.mocked(api.fetchTaskById).mockResolvedValue(null as TaskDetails);

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
    const mockTask = {
      id: 2,
      title: '',
      description: '',
      status: '',
      dueDate: '',
      createdAt: '',
    };
    vi.mocked(api.fetchTaskById).mockResolvedValue(mockTask as TaskDetails);

    render(
      <MemoryRouter initialEntries={['/tasks/2']}>
        <Routes>
          <Route path="/tasks/:id" element={<TaskDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getAllByText('—').length).toBeGreaterThan(0);
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
