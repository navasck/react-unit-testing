import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Counter from '../../components/Counter'

describe('Counter', () => {
  it('starts at 0', () => {
    render(<Counter />)
    expect(screen.getByTestId('count-display')).toHaveTextContent('Count: 0')
  })

  it('increments the count', async () => {
    const user = userEvent.setup()
    render(<Counter />)
    await user.click(screen.getByRole('button', { name: 'Increment' }))
    expect(screen.getByTestId('count-display')).toHaveTextContent('Count: 1')
  })

  it('decrements the count', async () => {
    const user = userEvent.setup()
    render(<Counter />)
    await user.click(screen.getByRole('button', { name: 'Decrement' }))
    expect(screen.getByTestId('count-display')).toHaveTextContent('Count: -1')
  })

  it('resets the count to 0', async () => {
    const user = userEvent.setup()
    render(<Counter />)
    await user.click(screen.getByRole('button', { name: 'Increment' }))
    await user.click(screen.getByRole('button', { name: 'Increment' }))
    await user.click(screen.getByRole('button', { name: 'Reset' }))
    expect(screen.getByTestId('count-display')).toHaveTextContent('Count: 0')
  })
})
