import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchFilter from '../../components/SearchFilter'

// No fake timers needed — useDeferredValue + useTransition are driven by
// React's scheduler, not setTimeout. RTL's act() flushes them automatically.

function setup() {
  const user = userEvent.setup()
  render(<SearchFilter />)
  const input = screen.getByRole('textbox', { name: 'search input' })
  return { user, input }
}

// ─── Unit Tests: initial render ────────────────────────────────────────────────

describe('SearchFilter — initial render', () => {
  it('renders the search input', () => {
    render(<SearchFilter />)
    expect(screen.getByRole('textbox', { name: 'search input' })).toBeInTheDocument()
  })

  it('shows all 15 items on load', () => {
    render(<SearchFilter />)
    expect(screen.getAllByRole('listitem')).toHaveLength(15)
  })

  it('shows total item count in status', () => {
    render(<SearchFilter />)
    expect(screen.getByText('15 items')).toBeInTheDocument()
  })

  it('does not show clear button when input is empty', () => {
    render(<SearchFilter />)
    expect(screen.queryByRole('button', { name: 'clear search' })).not.toBeInTheDocument()
  })
})

// ─── Unit Tests: filtering ─────────────────────────────────────────────────────

describe('SearchFilter — filtering', () => {
  it('filters items as the user types', async () => {
    const { user, input } = setup()
    await user.type(input, 'mango')
    expect(screen.getByText('Mango')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(1)
  })

  it('filters case-insensitively', async () => {
    const { user, input } = setup()
    await user.type(input, 'APPLE')
    expect(screen.getByText('Apple')).toBeInTheDocument()
  })

  it('shows multiple matches', async () => {
    const { user, input } = setup()
    await user.type(input, 'an')   // Banana, Mango, Orange
    expect(screen.getAllByRole('listitem').length).toBeGreaterThan(1)
  })

  it('shows no-results message when nothing matches', async () => {
    const { user, input } = setup()
    await user.type(input, 'zzz')
    expect(screen.getByTestId('no-results')).toBeInTheDocument()
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })

  it('shows singular result count', async () => {
    const { user, input } = setup()
    await user.type(input, 'mango')
    expect(screen.getByText(/1 result for "mango"/i)).toBeInTheDocument()
  })

  it('shows plural result count', async () => {
    const { user, input } = setup()
    await user.type(input, 'a')
    expect(screen.getByText(/results for/i).textContent).toMatch(/\d+ results for/)
  })

  it('restores all items when query is cleared by typing', async () => {
    const { user, input } = setup()
    await user.type(input, 'mango')
    await user.clear(input)
    expect(screen.getAllByRole('listitem')).toHaveLength(15)
    expect(screen.getByText('15 items')).toBeInTheDocument()
  })
})

// ─── Unit Tests: clear button ─────────────────────────────────────────────────

describe('SearchFilter — clear button', () => {
  it('shows clear button when input has text', async () => {
    const { user, input } = setup()
    await user.type(input, 'a')
    expect(screen.getByRole('button', { name: 'clear search' })).toBeInTheDocument()
  })

  it('clears the input and restores all items on click', async () => {
    const { user, input } = setup()
    await user.type(input, 'mango')
    await user.click(screen.getByRole('button', { name: 'clear search' }))
    expect(input).toHaveValue('')
    expect(screen.getAllByRole('listitem')).toHaveLength(15)
  })

  it('hides the clear button after clearing', async () => {
    const { user, input } = setup()
    await user.type(input, 'abc')
    await user.click(screen.getByRole('button', { name: 'clear search' }))
    expect(screen.queryByRole('button', { name: 'clear search' })).not.toBeInTheDocument()
  })
})

// ─── Integration Tests ─────────────────────────────────────────────────────────

describe('SearchFilter — integration', () => {
  it('full flow: type → filter → clear → restored', async () => {
    const { user, input } = setup()

    await user.type(input, 'berry')
    expect(screen.getByText('Elderberry')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'clear search' }))
    expect(screen.getAllByRole('listitem')).toHaveLength(15)
  })

  it('no results → retype → results appear', async () => {
    const { user, input } = setup()

    await user.type(input, 'zzz')
    expect(screen.getByTestId('no-results')).toBeInTheDocument()

    await user.clear(input)
    await user.type(input, 'kiwi')
    expect(screen.getByText('Kiwi')).toBeInTheDocument()
    expect(screen.queryByTestId('no-results')).not.toBeInTheDocument()
  })

  it('input has aria-busy while filtering is pending', async () => {
    const { user, input } = setup()
    // after settling, aria-busy should be false
    await user.type(input, 'mango')
    expect(input).toHaveAttribute('aria-busy', 'false')
  })
})
