import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import TaskDetails from '../src/pages/TaskDetails/TaskDetails';
import * as tasksApi from '../src/api/tasksApi';

vi.mock('../src/api/tasksApi');

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

    vi.mocked(tasksApi.fetchTaskById).mockResolvedValue(mockTask);

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
    expect(screen.getByText('12/31/2025')).toBeInTheDocument();
  });

  it('should show loading state initially', () => {
    vi.mocked(tasksApi.fetchTaskById).mockImplementation(
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
    vi.mocked(tasksApi.fetchTaskById).mockRejectedValue(
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

    vi.mocked(tasksApi.fetchTaskById).mockResolvedValue(mockTask);

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
});
