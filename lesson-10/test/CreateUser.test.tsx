import { describe, it, expect, vi } from 'vitest'
import CreateUser from "../src/pages/CreateUser/CreateUser"
import { render, screen, waitFor } from "@testing-library/react"
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
    
    const firstNameInput = screen.getByLabelText(/First Name/i)
    const lastNameInput = screen.getByLabelText(/Last Name/i)
    const emailInput = screen.getByLabelText(/Email/i)
    
    await user.click(firstNameInput)
    await user.tab()

    await user.click(lastNameInput)
    await user.tab()

    await user.click(emailInput)
    await user.type(emailInput, "invalid-email")
    await user.tab()
    
    expect(await screen.findByText("First name is required")).toBeInTheDocument()
    expect(await screen.findByText("Last name is required")).toBeInTheDocument()
    expect(await screen.findByText("Invalid email address")).toBeInTheDocument()
  })

  it('submits the form and navigates on successful creation', async () => {
    const user = userEvent.setup()
    const createUserMock = vi.mocked(api.createUser)
    createUserMock.mockResolvedValue({ id: 123, firstName: 'A', lastName: 'B', email: 'a@b.com', dateOfBirth: '2000-01-01', createdAt: '2025-11-20' })

    render(
      <MemoryRouter>
        <CreateUser />
      </MemoryRouter>
    )

    await user.type(screen.getByLabelText(/First Name/i), 'Alice')
    await user.type(screen.getByLabelText(/Last Name/i), 'Smith')
    await user.type(screen.getByLabelText(/Email/i), 'alice.smith@example.com')
    await user.type(screen.getByLabelText(/Date of Birth/i), '1990-05-05')

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

  it('logs error when createUser fails', async () => {
    const user = userEvent.setup();
    const createUserMock = vi.mocked(api.createUser);
    createUserMock.mockRejectedValue(new Error('Network error'));

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <MemoryRouter>
        <CreateUser />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/First Name/i), 'Alice')
    await user.type(screen.getByLabelText(/Last Name/i), 'Smith')
    await user.type(screen.getByLabelText(/Email/i), 'alice.smith@example.com')
    await user.type(screen.getByLabelText(/Date of Birth/i), '1990-05-05')

    const submitButton = screen.getByRole('button', { name: /Create User/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(createUserMock).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  })
})