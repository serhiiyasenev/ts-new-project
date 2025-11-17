import { describe, it, expect } from 'vitest'
import CreateUser from "../src/pages/Createuser"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import userEvent from "@testing-library/user-event"

describe('CreateUser', () => {
  it('form is rendered successfully', async () => {
    render(
      <MemoryRouter>
        <CreateUser />
       </MemoryRouter>
    )
    expect(screen.getByText("Create User Page")).toBeInTheDocument()
  })

  it('button is disabled when form is invalid', async () => {
    render(
      <MemoryRouter>
        <CreateUser />
       </MemoryRouter>
    )
    const button = screen.getByRole("button", { name: /create/i })
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
})