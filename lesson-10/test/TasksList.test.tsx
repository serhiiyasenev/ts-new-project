import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from './utils/test-utils';
import { MemoryRouter } from 'react-router-dom';
import TasksList from '../src/pages/KanbanBoard/KanbanBoard';
import * as api from '../src/api';
import { TaskStatus, TaskPriority, Task } from '@shared/task.types';
import '@testing-library/jest-dom';

vi.mock('../src/api');

// Helper to group tasks by status
const groupTasks = (tasks: Task[]) => ({
  todo: tasks.filter(t => t.status === TaskStatus.Todo),
  in_progress: tasks.filter(t => t.status === TaskStatus.InProgress),
  review: tasks.filter(t => t.status === TaskStatus.Review),
  done: tasks.filter(t => t.status === TaskStatus.Done),
});

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

    vi.mocked(api.fetchTasksGrouped).mockResolvedValue(groupTasks(mockTasks));
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
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Review')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('should show empty state when no tasks exist', async () => {
    vi.mocked(api.fetchTasksGrouped).mockResolvedValue({ todo: [], in_progress: [], review: [], done: [] });
    vi.mocked(api.fetchUsers).mockResolvedValue([]);

    render(
      <MemoryRouter>
        <TasksList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Task Board')).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /Create Task/i })).toBeInTheDocument();
  });

  it('should display error message when fetch fails', async () => {
    const errorMessage = 'Failed to fetch tasks';
    vi.mocked(api.fetchTasksGrouped).mockRejectedValue(new Error(errorMessage));
    vi.mocked(api.fetchUsers).mockResolvedValue([]);

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

    vi.mocked(api.fetchTasksGrouped).mockResolvedValue(groupTasks(mockTasks));
    vi.mocked(api.fetchUsers).mockResolvedValue([]);

    render(
      <MemoryRouter>
        <TasksList />
      </MemoryRouter>
    );

    await waitFor(() => {
      // Verify the task is in the In Progress column
      expect(screen.getByText('In Progress Task')).toBeInTheDocument();
      // Verify empty columns show 0 count
      const counts = screen.getAllByText('0');
      expect(counts.length).toBeGreaterThan(0);
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

    vi.mocked(api.fetchTasksGrouped).mockResolvedValue(groupTasks(mockTasks));
    vi.mocked(api.fetchUsers).mockResolvedValue([]);

    render(
      <MemoryRouter>
        <TasksList />
      </MemoryRouter>
    );

    await waitFor(() => {
      // Verify the task is in the Done column
      expect(screen.getByText('Done Task')).toBeInTheDocument();
      // Verify other columns show 0 count
      const counts = screen.getAllByText('0');
      expect(counts.length).toBe(3); // To Do, In Progress, Review
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

    vi.mocked(api.fetchTasksGrouped).mockResolvedValue(groupTasks(mockTasks));
    vi.mocked(api.fetchUsers).mockResolvedValue([]);

    render(
      <MemoryRouter>
        <TasksList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Task Board')).toBeInTheDocument();
    });
  });

  it('should handle non-Error exception when loading data fails', async () => {
    vi.mocked(api.fetchTasksGrouped).mockRejectedValue('String error');
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

    vi.mocked(api.fetchTasksGrouped).mockResolvedValue(groupTasks(mockTasks));
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

    vi.mocked(api.fetchTasksGrouped).mockResolvedValue(groupTasks(mockTasks));
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

  it('should handle grouped response with null status arrays', async () => {
    // Mock API to return grouped object with null arrays (tests || [] fallback)
    const partialGrouped = {
      todo: null,
      in_progress: null,
      review: null,
      done: null,
    };

    // @ts-expect-error - Testing null grouped response
    vi.mocked(api.fetchTasksGrouped).mockResolvedValue(partialGrouped);
    vi.mocked(api.fetchUsers).mockResolvedValue([]);

    render(
      <MemoryRouter>
        <TasksList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Task Board')).toBeInTheDocument();
      // Verify all columns show 0 count (empty arrays from || [])
      const counts = screen.getAllByText('0');
      expect(counts.length).toBe(4); // all statuses
    });
  });

  it('should handle grouped response with all status arrays populated', async () => {
    // Test the truthy branch of || [] by providing actual arrays
    const fullGrouped = {
      todo: [
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
      ],
      in_progress: [
        {
          id: 2,
          title: 'In Progress Task',
          description: 'Description',
          status: TaskStatus.InProgress,
          priority: TaskPriority.Medium,
          userId: null,
          createdAt: '2025-11-15T10:00:00.000Z',
          updatedAt: '2025-11-15T10:00:00.000Z',
        },
      ],
      review: [
        {
          id: 3,
          title: 'Review Task',
          description: 'Description',
          status: TaskStatus.Review,
          priority: TaskPriority.Low,
          userId: null,
          createdAt: '2025-11-15T10:00:00.000Z',
          updatedAt: '2025-11-15T10:00:00.000Z',
        },
      ],
      done: [
        {
          id: 4,
          title: 'Done Task',
          description: 'Description',
          status: TaskStatus.Done,
          priority: TaskPriority.High,
          userId: null,
          createdAt: '2025-11-15T10:00:00.000Z',
          updatedAt: '2025-11-15T10:00:00.000Z',
        },
      ],
    };

    vi.mocked(api.fetchTasksGrouped).mockResolvedValue(fullGrouped);
    vi.mocked(api.fetchUsers).mockResolvedValue([]);

    render(
      <MemoryRouter>
        <TasksList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Todo Task')).toBeInTheDocument();
      expect(screen.getByText('In Progress Task')).toBeInTheDocument();
      expect(screen.getByText('Review Task')).toBeInTheDocument();
      expect(screen.getByText('Done Task')).toBeInTheDocument();
    });
  });

  it('should handle array response from API and group tasks', async () => {
    const mockTasks: Task[] = [
      {
        id: 1,
        title: 'Array Task 1',
        description: 'Description',
        status: TaskStatus.Todo,
        priority: TaskPriority.High,
        userId: null,
        createdAt: '2025-11-15T10:00:00.000Z',
        updatedAt: '2025-11-15T10:00:00.000Z',
      },
      {
        id: 2,
        title: 'Array Task 2',
        description: 'Description',
        status: TaskStatus.Done,
        priority: TaskPriority.Low,
        userId: null,
        createdAt: '2025-11-15T11:00:00.000Z',
        updatedAt: '2025-11-15T11:00:00.000Z',
      },
    ];

    // Mock API to return array instead of grouped object
    // @ts-expect-error - Testing fallback behavior when API returns array instead of grouped object
    vi.mocked(api.fetchTasksGrouped).mockResolvedValue(mockTasks);
    vi.mocked(api.fetchUsers).mockResolvedValue([]);

    render(
      <MemoryRouter>
        <TasksList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Array Task 1')).toBeInTheDocument();
      expect(screen.getByText('Array Task 2')).toBeInTheDocument();
    });
  });

  it('should refresh tasks when Refresh button is clicked', async () => {
    const initialTasks: Task[] = [
      {
        id: 1,
        title: 'Initial Task',
        description: 'Description',
        status: TaskStatus.Todo,
        priority: TaskPriority.Medium,
        userId: null,
        createdAt: '2025-11-15T10:00:00.000Z',
        updatedAt: '2025-11-15T10:00:00.000Z',
      },
    ];

    const refreshedTasks: Task[] = [
      {
        id: 2,
        title: 'Refreshed Task',
        description: 'Description',
        status: TaskStatus.InProgress,
        priority: TaskPriority.High,
        userId: null,
        createdAt: '2025-11-15T11:00:00.000Z',
        updatedAt: '2025-11-15T11:00:00.000Z',
      },
    ];

    vi.mocked(api.fetchTasksGrouped)
      .mockResolvedValueOnce(groupTasks(initialTasks))
      .mockResolvedValueOnce(groupTasks(refreshedTasks));
    vi.mocked(api.fetchUsers).mockResolvedValue([]);

    render(
      <MemoryRouter>
        <TasksList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Initial Task')).toBeInTheDocument();
    });

    const refreshButton = screen.getByRole('button', { name: /Refresh/i });
    fireEvent.click(refreshButton);

    await waitFor(() => {
      expect(screen.getByText('Refreshed Task')).toBeInTheDocument();
      expect(screen.queryByText('Initial Task')).not.toBeInTheDocument();
    });
  });

  it('should handle refresh with null grouped response', async () => {
    const initialTasks = groupTasks([
      {
        id: 1,
        title: 'Initial Task',
        description: 'Description',
        status: TaskStatus.Todo,
        priority: TaskPriority.Medium,
        userId: null,
        createdAt: '2025-11-15T10:00:00.000Z',
        updatedAt: '2025-11-15T10:00:00.000Z',
      },
    ]);

    // Null grouped response (tests || [] fallback in loadTasks)
    const nullRefreshed = {
      todo: null,
      in_progress: null,
      review: null,
      done: null,
    };

    vi.mocked(api.fetchTasksGrouped)
      .mockResolvedValueOnce(initialTasks)
      // @ts-expect-error - Testing null grouped response
      .mockResolvedValueOnce(nullRefreshed);
    vi.mocked(api.fetchUsers).mockResolvedValue([]);

    render(
      <MemoryRouter>
        <TasksList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Initial Task')).toBeInTheDocument();
    });

    const refreshButton = screen.getByRole('button', { name: /Refresh/i });
    fireEvent.click(refreshButton);

    await waitFor(() => {
      // After refresh with null arrays, all columns should be empty
      const counts = screen.getAllByText('0');
      expect(counts.length).toBe(4); // all statuses should be 0
      expect(screen.queryByText('Initial Task')).not.toBeInTheDocument();
    });
  });

  it('should handle refresh with populated grouped response', async () => {
    const initialTasks = groupTasks([
      {
        id: 1,
        title: 'Initial Task',
        description: 'Description',
        status: TaskStatus.Todo,
        priority: TaskPriority.Medium,
        userId: null,
        createdAt: '2025-11-15T10:00:00.000Z',
        updatedAt: '2025-11-15T10:00:00.000Z',
      },
    ]);

    // Fully populated grouped response (tests truthy branch of || [])
    const fullRefreshed = {
      todo: [],
      in_progress: [
        {
          id: 2,
          title: 'Refreshed Task',
          description: 'Description',
          status: TaskStatus.InProgress,
          priority: TaskPriority.High,
          userId: null,
          createdAt: '2025-11-15T11:00:00.000Z',
          updatedAt: '2025-11-15T11:00:00.000Z',
        },
      ],
      review: [],
      done: [],
    };

    vi.mocked(api.fetchTasksGrouped)
      .mockResolvedValueOnce(initialTasks)
      .mockResolvedValueOnce(fullRefreshed);
    vi.mocked(api.fetchUsers).mockResolvedValue([]);

    render(
      <MemoryRouter>
        <TasksList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Initial Task')).toBeInTheDocument();
    });

    const refreshButton = screen.getByRole('button', { name: /Refresh/i });
    fireEvent.click(refreshButton);

    await waitFor(() => {
      expect(screen.getByText('Refreshed Task')).toBeInTheDocument();
      expect(screen.queryByText('Initial Task')).not.toBeInTheDocument();
    });
  });

  it('should navigate to create page when Create Task button is clicked', async () => {
    const originalLocation = window.location.href;
    // @ts-expect-error - Mocking window.location for testing
    delete window.location;
    // @ts-expect-error - Mocking window.location for testing
    window.location = { href: '' };

    vi.mocked(api.fetchTasksGrouped).mockResolvedValue({ todo: [], in_progress: [], review: [], done: [] });
    vi.mocked(api.fetchUsers).mockResolvedValue([]);

    render(
      <MemoryRouter>
        <TasksList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Task Board')).toBeInTheDocument();
    });

    const createButton = screen.getByRole('button', { name: /Create Task/i });
    fireEvent.click(createButton);

    expect(window.location.href).toBe('/board/create');

    // Restore original location
    window.location.href = originalLocation;
  });

  it('should navigate to edit page when Edit button is clicked', async () => {
    const originalLocation = window.location.href;
    // @ts-expect-error - Mocking window.location for testing
    delete window.location;
    // @ts-expect-error - Mocking window.location for testing
    window.location = { href: '' };

    const mockTasks: Task[] = [
      {
        id: 123,
        title: 'Editable Task',
        description: 'Description',
        status: TaskStatus.Todo,
        priority: TaskPriority.Medium,
        userId: null,
        createdAt: '2025-11-15T10:00:00.000Z',
        updatedAt: '2025-11-15T10:00:00.000Z',
      },
    ];

    vi.mocked(api.fetchTasksGrouped).mockResolvedValue(groupTasks(mockTasks));
    vi.mocked(api.fetchUsers).mockResolvedValue([]);

    render(
      <MemoryRouter>
        <TasksList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Editable Task')).toBeInTheDocument();
    });

    const editButtons = screen.getAllByRole('button', { name: /Edit/i });
    const taskEditButton = editButtons.find(btn => 
      btn.closest('.task-card')?.querySelector('.task-title')?.textContent === 'Editable Task'
    );
    
    fireEvent.click(taskEditButton!);

    expect(window.location.href).toBe('/board/123');

    // Restore original location
    window.location.href = originalLocation;
  });

  it('should handle array response when refreshing tasks', async () => {
    const initialTasks: Task[] = [
      {
        id: 1,
        title: 'Initial Task',
        description: 'Description',
        status: TaskStatus.Todo,
        priority: TaskPriority.Medium,
        userId: null,
        createdAt: '2025-11-15T10:00:00.000Z',
        updatedAt: '2025-11-15T10:00:00.000Z',
      },
    ];

    const refreshedArrayTasks: Task[] = [
      {
        id: 2,
        title: 'Array Refreshed Task',
        description: 'Description',
        status: TaskStatus.InProgress,
        priority: TaskPriority.High,
        userId: null,
        createdAt: '2025-11-15T11:00:00.000Z',
        updatedAt: '2025-11-15T11:00:00.000Z',
      },
    ];

    vi.mocked(api.fetchTasksGrouped)
      .mockResolvedValueOnce(groupTasks(initialTasks))
      .mockResolvedValueOnce(refreshedArrayTasks as unknown as api.TasksByStatus);
    vi.mocked(api.fetchUsers).mockResolvedValue([]);

    render(
      <MemoryRouter>
        <TasksList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Initial Task')).toBeInTheDocument();
    });

    const refreshButton = screen.getByRole('button', { name: /Refresh/i });
    fireEvent.click(refreshButton);

    await waitFor(() => {
      expect(screen.getByText('Array Refreshed Task')).toBeInTheDocument();
      expect(screen.queryByText('Initial Task')).not.toBeInTheDocument();
    });
  });

  it('should handle error when refreshing tasks', async () => {
    const initialTasks: Task[] = [
      {
        id: 1,
        title: 'Initial Task',
        description: 'Description',
        status: TaskStatus.Todo,
        priority: TaskPriority.Medium,
        userId: null,
        createdAt: '2025-11-15T10:00:00.000Z',
        updatedAt: '2025-11-15T10:00:00.000Z',
      },
    ];

    vi.mocked(api.fetchTasksGrouped)
      .mockResolvedValueOnce(groupTasks(initialTasks))
      .mockRejectedValueOnce(new Error('Refresh failed'));
    vi.mocked(api.fetchUsers).mockResolvedValue([]);

    render(
      <MemoryRouter>
        <TasksList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Initial Task')).toBeInTheDocument();
    });

    const refreshButton = screen.getByRole('button', { name: /Refresh/i });
    fireEvent.click(refreshButton);

    await waitFor(() => {
      expect(screen.getByText(/Refresh failed/i)).toBeInTheDocument();
    });
  });

  it('should handle non-Error exception when refreshing tasks', async () => {
    const initialTasks: Task[] = [
      {
        id: 1,
        title: 'Initial Task',
        description: 'Description',
        status: TaskStatus.Todo,
        priority: TaskPriority.Medium,
        userId: null,
        createdAt: '2025-11-15T10:00:00.000Z',
        updatedAt: '2025-11-15T10:00:00.000Z',
      },
    ];

    vi.mocked(api.fetchTasksGrouped)
      .mockResolvedValueOnce(groupTasks(initialTasks))
      .mockRejectedValueOnce('String error');
    vi.mocked(api.fetchUsers).mockResolvedValue([]);

    render(
      <MemoryRouter>
        <TasksList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Initial Task')).toBeInTheDocument();
    });

    const refreshButton = screen.getByRole('button', { name: /Refresh/i });
    fireEvent.click(refreshButton);

    await waitFor(() => {
      expect(screen.getByText(/Failed to load tasks/i)).toBeInTheDocument();
    });
  });
});
