import { describe, it, expect, vi } from 'vitest'
import CreateUser from "../src/pages/CreateUser/CreateUser"
import { render, screen, waitFor } from "./utils/test-utils"
import { MemoryRouter } from "react-router-dom"
import userEvent from "@testing-library/user-event"
import * as api from '../src/api'
import '@testing-library/jest-dom'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})
vi.mock('../src/api')

describe('CreateUser', () => {
  it('form is rendered successfully', async () => {
    render(
      <MemoryRouter>
        <CreateUser />
       </MemoryRouter>
    )
    expect(screen.getByText("Create New User")).toBeInTheDocument()
  })

  it('button is disabled when form is invalid', async () => {
    render(
      <MemoryRouter>
        <CreateUser />
       </MemoryRouter>
    )
    const button = screen.getByRole("button", { name: /create user/i })
    expect(button).toBeDisabled()
  })

  it('shows validation errors when fields are touched and invalid', async () => {
    const user = userEvent.setup()
    
    render(
      <MemoryRouter>
        <CreateUser />
       </MemoryRouter>
    )
    
    const nameInput = screen.getByLabelText(/Name/i)
    const emailInput = screen.getByLabelText(/Email/i)
    
    await user.click(nameInput)
    await user.tab()

    await user.click(emailInput)
    await user.type(emailInput, "invalid-email")
    await user.tab()
    
    expect(await screen.findByText("Name must have at least 2 characters")).toBeInTheDocument()
    expect(await screen.findByText("Invalid email address")).toBeInTheDocument()
  })

  it('submits the form and navigates on successful creation', async () => {
    const user = userEvent.setup()
    const createUserMock = vi.mocked(api.createUser)
    createUserMock.mockResolvedValue({ 
      id: 123, 
      name: 'Alice Smith', 
      email: 'alice.smith@example.com', 
      isActive: true,
      lastLoginAt: null,
      createdAt: '2025-11-20',
      updatedAt: '2025-11-20'
    })

    render(
      <MemoryRouter>
        <CreateUser />
      </MemoryRouter>
    )

    await user.type(screen.getByLabelText(/Name/i), 'Alice Smith')
    await user.type(screen.getByLabelText(/Email/i), 'alice.smith@example.com')

    const submitButton = screen.getByRole('button', { name: /Create User/i })
    expect(submitButton).not.toBeDisabled()

    await user.click(submitButton)

    await waitFor(() => {
      expect(createUserMock).toHaveBeenCalled()
      expect(mockNavigate).toHaveBeenCalledWith('/users')
    })
  })

  it('cancel button navigates back to users', async () => {
    render(
      <MemoryRouter>
        <CreateUser />
      </MemoryRouter>
    );

    const cancelBtn = screen.getByRole('button', { name: /cancel/i });
    await cancelBtn.click();
    expect(mockNavigate).toHaveBeenCalledWith('/users');
  })

  it('handles error when createUser fails', async () => {
    const user = userEvent.setup();
    const createUserMock = vi.mocked(api.createUser);
    createUserMock.mockRejectedValue(new Error('Network error'));

    ;

    render(
      <MemoryRouter>
        <CreateUser />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/Name/i), 'Alice Smith')
    await user.type(screen.getByLabelText(/Email/i), 'alice.smith@example.com')

    const submitButton = screen.getByRole('button', { name: /Create User/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(createUserMock).toHaveBeenCalled();
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });

    ;
  })

  it('handles non-Error exception when createUser fails', async () => {
    const user = userEvent.setup();
    const createUserMock = vi.mocked(api.createUser);
    createUserMock.mockRejectedValue('String error');

    ;

    render(
      <MemoryRouter>
        <CreateUser />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/Name/i), 'Alice Smith')
    await user.type(screen.getByLabelText(/Email/i), 'alice.smith@example.com')

    const submitButton = screen.getByRole('button', { name: /Create User/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(createUserMock).toHaveBeenCalled();
      expect(screen.getByText('Error creating user')).toBeInTheDocument();
    });

    ;
  })
})
