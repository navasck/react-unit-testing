import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

// Unit tests – individual behaviour in isolation
describe('Counter button', () => {
  it('renders with initial count of 0', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /count is 0/i })).toBeInTheDocument()
  })

  it('increments count on each click', async () => {
    const user = userEvent.setup()
    render(<App />)
    const button = screen.getByRole('button', { name: /count is 0/i })

    await user.click(button)
    expect(screen.getByRole('button', { name: /count is 1/i })).toBeInTheDocument()

    await user.click(button)
    expect(screen.getByRole('button', { name: /count is 2/i })).toBeInTheDocument()
  })
})

// Integration tests – multiple elements working together
describe('App integration', () => {
  it('renders the page heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /get started/i })).toBeInTheDocument()
  })

  it('renders documentation and social sections', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /documentation/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /connect with us/i })).toBeInTheDocument()
  })

  it('renders external links for Vite and React', () => {
    render(<App />)
    expect(screen.getByRole('link', { name: /explore vite/i })).toHaveAttribute('href', 'https://vite.dev/')
    expect(screen.getByRole('link', { name: /learn more/i })).toHaveAttribute('href', 'https://react.dev/')
  })

  it('counter state is independent per render', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<App />)
    await user.click(screen.getByRole('button', { name: /count is 0/i }))
    expect(screen.getByRole('button', { name: /count is 1/i })).toBeInTheDocument()
    unmount()

    // Fresh render starts at 0 again
    render(<App />)
    expect(screen.getByRole('button', { name: /count is 0/i })).toBeInTheDocument()
  })
})
