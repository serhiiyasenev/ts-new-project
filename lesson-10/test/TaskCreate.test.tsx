import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import TaskCreate from '../src/pages/TaskCreate/TaskCreate';

vi.mock('../src/api/tasksApi');
  
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
  });

  it('should have submit button disabled when form is empty or invalid', async () => {
    render(
      <MemoryRouter>
        <TaskCreate />
      </MemoryRouter>
    );

    const submitButton = screen.getByRole('button', { name: /Create Task/i });
    expect(submitButton).toBeDisabled();
  });

  it('should enable submit button when all fields are valid', async () => {
    const user = userEvent.setup();
    
    render(
      <MemoryRouter>
        <TaskCreate />
      </MemoryRouter>
    );

    const titleInput = screen.getByLabelText(/Title/i);
    const descriptionInput = screen.getByLabelText(/Description/i);
    const statusSelect = screen.getByLabelText(/Status/i);
    const dueDateInput = screen.getByLabelText(/Due Date/i);
    const submitButton = screen.getByRole('button', { name: /Create Task/i });

    await user.type(titleInput, 'Valid Task Title');
    await user.type(descriptionInput, 'This is a valid description with more than 10 characters');
    await user.selectOptions(statusSelect, 'To Do');
    await user.type(dueDateInput, '2025-12-31');

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('should show validation errors for invalid fields', async () => {
    const user = userEvent.setup();
    
    render(
      <MemoryRouter>
        <TaskCreate />
      </MemoryRouter>
    );

    const titleInput = screen.getByLabelText(/Title/i);
    const descriptionInput = screen.getByLabelText(/Description/i);
    const dueDateInput = screen.getByLabelText(/Due Date/i);
    const submitButton = screen.getByRole('button', { name: /Create Task/i });

    // Enter invalid values
    await user.type(titleInput, 'AB'); // Less than 3 characters
    await user.type(descriptionInput, 'Short'); // Less than 10 characters
    await user.type(dueDateInput, '2020-01-01'); // Past date
    
    // Blur to trigger validation
    await user.tab();

    // Try to submit (though button should be disabled)
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Title must be at least 3 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/Description must be at least 10 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/Due date must be today or in the future/i)).toBeInTheDocument();
    });

    expect(submitButton).toBeDisabled();
  });
});
