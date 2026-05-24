import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FormValidation from '../../components/FormValidation'

// Helpers — fill individual fields
async function typeName(user: ReturnType<typeof userEvent.setup>, value: string) {
  await user.type(screen.getByLabelText(/full name/i), value)
}
async function typeEmail(user: ReturnType<typeof userEvent.setup>, value: string) {
  await user.type(screen.getByLabelText(/email address/i), value)
}
async function typePassword(user: ReturnType<typeof userEvent.setup>, value: string) {
  await user.type(screen.getByLabelText(/password/i), value)
}

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await typeName(user, 'Alice Johnson')
  await typeEmail(user, 'alice@example.com')
  await typePassword(user, 'secret123')
}

// ─── Unit Tests: required field errors ────────────────────────────────────────

describe('FormValidation — required field errors', () => {
  it('shows name error after leaving name field empty', async () => {
    const user = userEvent.setup()
    render(<FormValidation />)

    // tab out of name without typing — triggers blur
    await user.click(screen.getByLabelText(/full name/i))
    await user.tab()

    expect(screen.getByRole('alert')).toHaveTextContent('Name is required')
  })

  it('shows email error after leaving email field empty', async () => {
    const user = userEvent.setup()
    render(<FormValidation />)

    await user.click(screen.getByLabelText(/email address/i))
    await user.tab()

    expect(screen.getByRole('alert')).toHaveTextContent('Email is required')
  })

  it('shows password error after leaving password field empty', async () => {
    const user = userEvent.setup()
    render(<FormValidation />)

    await user.click(screen.getByLabelText(/password/i))
    await user.tab()

    expect(screen.getByRole('alert')).toHaveTextContent('Password is required')
  })

  it('shows all three errors when submitting empty form', async () => {
    const user = userEvent.setup()
    render(<FormValidation />)

    await user.click(screen.getByRole('button', { name: /submit/i }))

    const alerts = screen.getAllByRole('alert')
    expect(alerts).toHaveLength(3)
    expect(alerts[0]).toHaveTextContent('Name is required')
    expect(alerts[1]).toHaveTextContent('Email is required')
    expect(alerts[2]).toHaveTextContent('Password is required')
  })
})

// ─── Unit Tests: field-level validation rules ──────────────────────────────────

describe('FormValidation — field validation rules', () => {
  it('shows error when name is only 1 character', async () => {
    const user = userEvent.setup()
    render(<FormValidation />)

    await typeName(user, 'A')
    await user.tab()

    expect(screen.getByRole('alert')).toHaveTextContent('at least 2 characters')
  })

  it('clears name error once name is long enough', async () => {
    const user = userEvent.setup()
    render(<FormValidation />)

    await typeName(user, 'A')
    await user.tab()
    expect(screen.getByText(/at least 2 characters/i)).toBeInTheDocument()

    // typing back in name will blur email — only assert the name error is gone
    await user.type(screen.getByLabelText(/full name/i), 'lice')
    expect(screen.queryByText(/at least 2 characters/i)).not.toBeInTheDocument()
  })

  it('shows error for invalid email format', async () => {
    const user = userEvent.setup()
    render(<FormValidation />)

    await typeEmail(user, 'not-an-email')
    await user.tab()

    expect(screen.getByRole('alert')).toHaveTextContent('valid email address')
  })

  it('clears email error once email becomes valid', async () => {
    const user = userEvent.setup()
    render(<FormValidation />)

    await typeEmail(user, 'bad')
    await user.tab()
    expect(screen.getByText(/valid email address/i)).toBeInTheDocument()

    // typing back in email will blur password — only assert the email error is gone
    await user.clear(screen.getByLabelText(/email address/i))
    await user.type(screen.getByLabelText(/email address/i), 'good@example.com')
    expect(screen.queryByText(/valid email address/i)).not.toBeInTheDocument()
  })

  it('shows error when password is fewer than 8 characters', async () => {
    const user = userEvent.setup()
    render(<FormValidation />)

    await typePassword(user, 'short')
    await user.tab()

    expect(screen.getByRole('alert')).toHaveTextContent('at least 8 characters')
  })

  it('clears password error once password is long enough', async () => {
    const user = userEvent.setup()
    render(<FormValidation />)

    await typePassword(user, 'short')
    await user.tab()
    expect(screen.getByRole('alert')).toBeInTheDocument()

    await user.type(screen.getByLabelText(/password/i), 'er123')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})

// ─── Unit Tests: submit button state ──────────────────────────────────────────

describe('FormValidation — submit button', () => {
  it('shows submit button as visually disabled when form is empty', () => {
    render(<FormValidation />)
    expect(screen.getByRole('button', { name: /submit/i })).toHaveAttribute('aria-disabled', 'true')
  })

  it('submit button becomes active once all fields are valid', async () => {
    const user = userEvent.setup()
    render(<FormValidation />)

    await fillValidForm(user)

    expect(screen.getByRole('button', { name: /submit/i })).toHaveAttribute('aria-disabled', 'false')
  })

  it('does not submit and shows errors when form is invalid', async () => {
    const user = userEvent.setup()
    render(<FormValidation />)

    await user.click(screen.getByRole('button', { name: /submit/i }))

    // Success message must NOT appear
    expect(screen.queryByLabelText('success message')).not.toBeInTheDocument()
    expect(screen.getAllByRole('alert')).toHaveLength(3)
  })
})

// ─── Integration Tests: full form flow ────────────────────────────────────────

describe('FormValidation — integration', () => {
  it('submits successfully with valid data and shows success message', async () => {
    const user = userEvent.setup()
    render(<FormValidation />)

    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: /submit/i }))

    expect(screen.getByLabelText('success message')).toBeInTheDocument()
    expect(screen.getByText(/welcome, alice johnson/i)).toBeInTheDocument()
  })

  it('resets form after clicking Reset on success screen', async () => {
    const user = userEvent.setup()
    render(<FormValidation />)

    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: /submit/i }))
    await user.click(screen.getByRole('button', { name: /reset/i }))

    expect(screen.getByLabelText(/registration form/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/full name/i)).toHaveValue('')
  })

  it('real user flow: tab through fields, fix errors, then submit', async () => {
    const user = userEvent.setup()
    render(<FormValidation />)

    // Tab through all fields without typing → triggers all blur errors
    await user.click(screen.getByLabelText(/full name/i))
    await user.tab() // to email
    await user.tab() // to password
    await user.tab() // out of password

    expect(screen.getAllByRole('alert')).toHaveLength(3)

    // Fix each field
    await user.type(screen.getByLabelText(/full name/i), 'Bob')
    await user.type(screen.getByLabelText(/email address/i), 'bob@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password99')

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()

    // Submit
    await user.click(screen.getByRole('button', { name: /submit/i }))

    expect(screen.getByLabelText('success message')).toBeInTheDocument()
    expect(screen.getByText(/welcome, bob/i)).toBeInTheDocument()
  })
})
