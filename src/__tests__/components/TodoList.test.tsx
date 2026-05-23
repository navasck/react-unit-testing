import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TodoList from '../../components/TodoList'

describe('TodoList', () => {
  it('shows empty state by default', () => {
    render(<TodoList />)
    expect(screen.getByText('No tasks yet.')).toBeInTheDocument()
  })

  it('adds a task', async () => {
    const user = userEvent.setup()
    render(<TodoList />)
    await user.type(screen.getByRole('textbox', { name: 'task input' }), 'Buy groceries')
    await user.click(screen.getByRole('button', { name: 'Add' }))
    expect(screen.getByText('Buy groceries')).toBeInTheDocument()
  })

  it('clears the input after adding', async () => {
    const user = userEvent.setup()
    render(<TodoList />)
    await user.type(screen.getByRole('textbox', { name: 'task input' }), 'Buy groceries')
    await user.click(screen.getByRole('button', { name: 'Add' }))
    expect(screen.getByRole('textbox', { name: 'task input' })).toHaveValue('')
  })

  it('does not add an empty task', async () => {
    const user = userEvent.setup()
    render(<TodoList />)
    await user.click(screen.getByRole('button', { name: 'Add' }))
    expect(screen.getByText('No tasks yet.')).toBeInTheDocument()
  })

  it('removes a task', async () => {
    const user = userEvent.setup()
    render(<TodoList />)
    await user.type(screen.getByRole('textbox', { name: 'task input' }), 'Walk the dog')
    await user.click(screen.getByRole('button', { name: 'Add' }))
    await user.click(screen.getByRole('button', { name: 'remove Walk the dog' }))
    expect(screen.queryByText('Walk the dog')).not.toBeInTheDocument()
  })

  it('can add multiple tasks and remove one without affecting others', async () => {
    const user = userEvent.setup()
    render(<TodoList />)

    for (const task of ['Task A', 'Task B', 'Task C']) {
      await user.type(screen.getByRole('textbox', { name: 'task input' }), task)
      await user.click(screen.getByRole('button', { name: 'Add' }))
    }

    await user.click(screen.getByRole('button', { name: 'remove Task B' }))

    expect(screen.getByText('Task A')).toBeInTheDocument()
    expect(screen.queryByText('Task B')).not.toBeInTheDocument()
    expect(screen.getByText('Task C')).toBeInTheDocument()
  })
})
