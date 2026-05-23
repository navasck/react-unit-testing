import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

describe('App integration', () => {
  it('renders the page heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Testing Playground' })).toBeInTheDocument()
  })

  it('renders both Counter and TodoList sections', () => {
    render(<App />)
    expect(screen.getByRole('region', { name: 'counter' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'todo' })).toBeInTheDocument()
  })

  it('counter and todo work independently side by side', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Increment' }))
    await user.type(screen.getByRole('textbox', { name: 'task input' }), 'Read a book')
    await user.click(screen.getByRole('button', { name: 'Add' }))

    expect(screen.getByTestId('count-display')).toHaveTextContent('1')
    expect(screen.getByText('Read a book')).toBeInTheDocument()
  })
})
