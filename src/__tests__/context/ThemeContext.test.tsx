import { render, screen } from '@testing-library/react'
import { renderHook, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider, useTheme } from '../../context/ThemeContext'
import ThemeToggle from '../../components/ThemeToggle'

// Reusable wrapper — passes ThemeProvider as the hook's React tree
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
)

// Helper — renders ThemeToggle inside ThemeProvider
function renderWithProvider(defaultTheme?: 'light' | 'dark') {
  return render(
    <ThemeProvider defaultTheme={defaultTheme}>
      <ThemeToggle />
    </ThemeProvider>
  )
}

// ─── useTheme hook (via renderHook) ───────────────────────────────────────────

describe('useTheme — default state', () => {
  it('returns light as the default theme', () => {
    const { result } = renderHook(() => useTheme(), { wrapper })
    expect(result.current.theme).toBe('light')
  })

  it('throws when used outside ThemeProvider', () => {
    // suppress the expected error in test output
    vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => renderHook(() => useTheme())).toThrow(
      'useTheme must be used within a ThemeProvider'
    )
  })
})

describe('useTheme — toggleTheme', () => {
  it('toggles from light to dark', () => {
    const { result } = renderHook(() => useTheme(), { wrapper })
    act(() => result.current.toggleTheme())
    expect(result.current.theme).toBe('dark')
  })

  it('toggles from dark back to light', () => {
    const { result } = renderHook(() => useTheme(), { wrapper })
    act(() => result.current.toggleTheme()) // → dark
    act(() => result.current.toggleTheme()) // → light
    expect(result.current.theme).toBe('light')
  })

  it('toggles correctly multiple times', () => {
    const { result } = renderHook(() => useTheme(), { wrapper })
    act(() => {
      result.current.toggleTheme() // dark
      result.current.toggleTheme() // light
      result.current.toggleTheme() // dark
    })
    expect(result.current.theme).toBe('dark')
  })
})

describe('useTheme — setTheme', () => {
  it('sets theme directly to dark', () => {
    const { result } = renderHook(() => useTheme(), { wrapper })
    act(() => result.current.setTheme('dark'))
    expect(result.current.theme).toBe('dark')
  })

  it('sets theme directly to light from dark', () => {
    const darkWrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider defaultTheme="dark">{children}</ThemeProvider>
    )
    const { result } = renderHook(() => useTheme(), { wrapper: darkWrapper })
    expect(result.current.theme).toBe('dark')
    act(() => result.current.setTheme('light'))
    expect(result.current.theme).toBe('light')
  })
})

// ─── ThemeProvider defaultTheme prop ──────────────────────────────────────────

describe('ThemeProvider — defaultTheme prop', () => {
  it('starts with light theme by default', () => {
    const { result } = renderHook(() => useTheme(), { wrapper })
    expect(result.current.theme).toBe('light')
  })

  it('accepts dark as the default theme', () => {
    const darkWrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider defaultTheme="dark">{children}</ThemeProvider>
    )
    const { result } = renderHook(() => useTheme(), { wrapper: darkWrapper })
    expect(result.current.theme).toBe('dark')
  })
})

// ─── ThemeToggle component (consumes context) ─────────────────────────────────

describe('ThemeToggle — rendering', () => {
  it('displays the current theme as light by default', () => {
    renderWithProvider()
    expect(screen.getByTestId('theme-value')).toHaveTextContent('light')
  })

  it('displays dark when defaultTheme is dark', () => {
    renderWithProvider('dark')
    expect(screen.getByTestId('theme-value')).toHaveTextContent('dark')
  })

  it('shows "Switch to Dark mode" when theme is light', () => {
    renderWithProvider()
    expect(screen.getByRole('button', { name: /toggle theme/i })).toHaveTextContent(/dark/i)
  })

  it('shows "Switch to Light mode" when theme is dark', () => {
    renderWithProvider('dark')
    expect(screen.getByRole('button', { name: /toggle theme/i })).toHaveTextContent(/light/i)
  })

  it('Light button is pressed when theme is light', () => {
    renderWithProvider('light')
    expect(screen.getByRole('button', { name: /set light theme/i })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: /set dark theme/i })).toHaveAttribute('aria-pressed', 'false')
  })
})

describe('ThemeToggle — interactions', () => {
  it('toggles from light to dark on toggle button click', async () => {
    const user = userEvent.setup()
    renderWithProvider()
    await user.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(screen.getByTestId('theme-value')).toHaveTextContent('dark')
  })

  it('toggles back to light on second toggle click', async () => {
    const user = userEvent.setup()
    renderWithProvider()
    await user.click(screen.getByRole('button', { name: /toggle theme/i }))
    await user.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(screen.getByTestId('theme-value')).toHaveTextContent('light')
  })

  it('sets dark theme directly via Dark button', async () => {
    const user = userEvent.setup()
    renderWithProvider()
    await user.click(screen.getByRole('button', { name: /set dark theme/i }))
    expect(screen.getByTestId('theme-value')).toHaveTextContent('dark')
  })

  it('sets light theme directly via Light button', async () => {
    const user = userEvent.setup()
    renderWithProvider('dark')
    await user.click(screen.getByRole('button', { name: /set light theme/i }))
    expect(screen.getByTestId('theme-value')).toHaveTextContent('light')
  })
})

// ─── Multiple consumers share the same context value ─────────────────────────

describe('ThemeProvider — shared state across consumers', () => {
  it('two consumers reflect the same theme value', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
        <ThemeToggle />
      </ThemeProvider>
    )
    const values = screen.getAllByTestId('theme-value')
    expect(values).toHaveLength(2)
    values.forEach((v) => expect(v).toHaveTextContent('light'))
  })

  it('toggling in one consumer updates all consumers', async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider>
        <ThemeToggle />
        <ThemeToggle />
      </ThemeProvider>
    )
    // click the first toggle button
    await user.click(screen.getAllByRole('button', { name: /toggle theme/i })[0])

    // both consumers now show dark
    screen.getAllByTestId('theme-value').forEach((v) => {
      expect(v).toHaveTextContent('dark')
    })
  })
})
