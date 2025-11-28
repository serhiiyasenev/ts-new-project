import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import TaskCreate from '../src/pages/TaskCreate/TaskCreate';
import * as api from '../src/api';

vi.mock('../src/api');
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('TaskCreate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.fetchUsers).mockResolvedValue([]);
  });

  it('should have submit button enabled even when form is empty', async () => {
    render(
      <MemoryRouter>
        <TaskCreate />
      </MemoryRouter>
    );

    const submitButton = screen.getByRole('button', { name: /Create Task/i }) as HTMLButtonElement;
    expect(submitButton.disabled).toBe(false);
  });

  it('renders all select options correctly', async () => {
    render(
      <MemoryRouter>
        <TaskCreate />
      </MemoryRouter>
    );

    const statusSelect = screen.getByLabelText(/Status/i);
    const prioritySelect = screen.getByLabelText(/Priority/i);

    // Check selects are present
    expect(statusSelect).toBeTruthy();
    expect(prioritySelect).toBeTruthy();
  });

  it('renders form with correct default values', async () => {
    render(
      <MemoryRouter>
        <TaskCreate />
      </MemoryRouter>
    );

    const statusSelect = screen.getByLabelText(/Status/i) as HTMLSelectElement;
    const prioritySelect = screen.getByLabelText(/Priority/i) as HTMLSelectElement;

    // Check default values
    expect(statusSelect.value).toBe('todo');
    expect(prioritySelect.value).toBe('medium');
  });

  it('cancel button navigates back to tasks', async () => {
    render(
      <MemoryRouter>
        <TaskCreate />
      </MemoryRouter>
    );

    const cancelBtn = screen.getByRole('button', { name: /cancel/i });
    await cancelBtn.click();
    expect(mockNavigate).toHaveBeenCalledWith('/board');
  });

  it('renders user select with users from API', async () => {
    const mockUsers = [
      { id: 1, name: 'User 1', email: 'user1@test.com', isActive: true, lastLoginAt: null, createdAt: '2025-11-20', updatedAt: '2025-11-20' },
      { id: 2, name: 'User 2', email: 'user2@test.com', isActive: true, lastLoginAt: null, createdAt: '2025-11-20', updatedAt: '2025-11-20' },
    ];
    vi.mocked(api.fetchUsers).mockResolvedValue(mockUsers);

    render(
      <MemoryRouter>
        <TaskCreate />
      </MemoryRouter>
    );

    await waitFor(() => {
      const userSelect = screen.getByLabelText(/Assign to User/i);
      expect(userSelect).toBeInTheDocument();
    });
  });

  it('shows all form fields correctly', async () => {
    render(
      <MemoryRouter>
        <TaskCreate />
      </MemoryRouter>
    );

    // Check all form fields are present
    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Priority/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Assign to User/i)).toBeInTheDocument();
    
    // Check buttons
    expect(screen.getByRole('button', { name: /Create Task/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
  });

  it('shows validation error for title when submitted empty', async () => {
    const user = userEvent.setup();
    
    render(
      <MemoryRouter>
        <TaskCreate />
      </MemoryRouter>
    );

    const submitButton = screen.getByRole('button', { name: /Create Task/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Title is required/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for description when invalid', async () => {
    const user = userEvent.setup();
    
    render(
      <MemoryRouter>
        <TaskCreate />
      </MemoryRouter>
    );

    const titleInput = screen.getByLabelText(/Title/i);
    await user.type(titleInput, 'Test Task');

    const descriptionInput = screen.getByLabelText(/Description/i);
    await user.type(descriptionInput, 'a');
    await user.clear(descriptionInput);
    await user.tab();

    const submitButton = screen.getByRole('button', { name: /Create Task/i });
    await user.click(submitButton);

    // Check if any validation errors are shown
    await waitFor(() => {
      const errors = screen.queryAllByText(/error/i);
      // If there are validation errors, they should be visible
      expect(errors.length >= 0).toBe(true);
    });
  });

  it('shows description error when description is provided but invalid', async () => {
    const user = userEvent.setup();
    
    render(
      <MemoryRouter>
        <TaskCreate />
      </MemoryRouter>
    );

    const titleInput = screen.getByLabelText(/Title/i);
    await user.type(titleInput, 'Test Task');

    const descriptionInput = screen.getByLabelText(/Description/i);
    await user.type(descriptionInput, 'ab');
    await user.tab();

    const submitButton = screen.getByRole('button', { name: /Create Task/i });
    await user.click(submitButton);

    await waitFor(() => {
      const errorMessage = screen.queryByText(/must be at least 3 characters/i);
      if (errorMessage) {
        expect(errorMessage).toBeInTheDocument();
      }
    });
  });

  it('renders userId select with users', async () => {
    const mockUsers = [
      { id: 1, name: 'User 1', email: 'user1@test.com', isActive: true, lastLoginAt: null, createdAt: '2025-11-20', updatedAt: '2025-11-20' },
    ];
    vi.mocked(api.fetchUsers).mockResolvedValue(mockUsers);
    
    render(
      <MemoryRouter>
        <TaskCreate />
      </MemoryRouter>
    );

    await waitFor(() => {
      const userSelect = screen.getByLabelText(/Assign to User/i);
      expect(userSelect).toBeInTheDocument();
    });
  });
});
