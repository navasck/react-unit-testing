import { render, screen, act } from '@testing-library/react'
import { createElement } from 'react'
import useIntersectionObserver from '../../hooks/useIntersectionObserver'

// ─── Mock factory ─────────────────────────────────────────────────────────────
// vi.fn(class {...}) wraps a class in a spy so we can assert how many times
// IntersectionObserver was constructed while still acting as a real class.

type IOCallback = IntersectionObserverCallback

function createIOMock() {
  let storedCallback: IOCallback | null = null
  const observe    = vi.fn()
  const disconnect = vi.fn()

  const MockIO = vi.fn(class {
    observe    = observe
    disconnect = disconnect
    constructor(cb: IOCallback) { storedCallback = cb }
  })

  vi.stubGlobal('IntersectionObserver', MockIO)

  function trigger(isIntersecting: boolean) {
    act(() => {
      storedCallback?.(
        [{ isIntersecting } as IntersectionObserverEntry],
        {} as IntersectionObserver
      )
    })
  }

  return { MockIO, observe, disconnect, trigger }
}

afterEach(() => vi.unstubAllGlobals())

// ─── Wrapper component ────────────────────────────────────────────────────────
// renderHook alone can't attach a ref to a real DOM element.
// A wrapper component renders a <div> with the ref properly bound.

function TestTarget({
  onIntersect,
  enabled = true,
}: {
  onIntersect: () => void
  enabled?: boolean
}) {
  const ref = useIntersectionObserver<HTMLDivElement>(onIntersect, enabled)
  return createElement('div', { ref, 'data-testid': 'target' })
}

// ─── Setup ────────────────────────────────────────────────────────────────────

describe('useIntersectionObserver — setup', () => {
  it('creates an IntersectionObserver and observes the target element', () => {
    const { MockIO, observe } = createIOMock()
    render(createElement(TestTarget, { onIntersect: vi.fn() }))
    expect(MockIO).toHaveBeenCalledTimes(1)
    expect(observe).toHaveBeenCalledWith(screen.getByTestId('target'))
  })

  it('does NOT create an observer when enabled is false', () => {
    const { MockIO } = createIOMock()
    render(createElement(TestTarget, { onIntersect: vi.fn(), enabled: false }))
    expect(MockIO).not.toHaveBeenCalled()
  })
})

// ─── Callback ─────────────────────────────────────────────────────────────────

describe('useIntersectionObserver — callback', () => {
  it('calls onIntersect when element enters the viewport', () => {
    const { trigger } = createIOMock()
    const onIntersect = vi.fn()
    render(createElement(TestTarget, { onIntersect }))
    trigger(true)
    expect(onIntersect).toHaveBeenCalledTimes(1)
  })

  it('does NOT call onIntersect when element leaves the viewport', () => {
    const { trigger } = createIOMock()
    const onIntersect = vi.fn()
    render(createElement(TestTarget, { onIntersect }))
    trigger(false)
    expect(onIntersect).not.toHaveBeenCalled()
  })

  it('always calls the latest callback without recreating the observer', () => {
    const { MockIO, trigger } = createIOMock()
    const first  = vi.fn()
    const second = vi.fn()

    const { rerender } = render(createElement(TestTarget, { onIntersect: first }))
    rerender(createElement(TestTarget, { onIntersect: second }))

    // Observer was NOT recreated — callback changed via ref, not re-subscribe
    expect(MockIO).toHaveBeenCalledTimes(1)

    trigger(true)
    expect(first).not.toHaveBeenCalled()
    expect(second).toHaveBeenCalledTimes(1)
  })
})

// ─── Enabled toggle ───────────────────────────────────────────────────────────

describe('useIntersectionObserver — enabled toggle', () => {
  it('disconnects when enabled changes to false', () => {
    const { disconnect } = createIOMock()
    const { rerender } = render(
      createElement(TestTarget, { onIntersect: vi.fn(), enabled: true })
    )
    rerender(createElement(TestTarget, { onIntersect: vi.fn(), enabled: false }))
    expect(disconnect).toHaveBeenCalled()
  })

  it('creates a new observer when enabled changes back to true', () => {
    const { MockIO } = createIOMock()
    const { rerender } = render(
      createElement(TestTarget, { onIntersect: vi.fn(), enabled: true })
    )
    rerender(createElement(TestTarget, { onIntersect: vi.fn(), enabled: false }))
    rerender(createElement(TestTarget, { onIntersect: vi.fn(), enabled: true }))
    expect(MockIO).toHaveBeenCalledTimes(2)
  })

  it('disconnects on unmount', () => {
    const { disconnect } = createIOMock()
    const { unmount } = render(createElement(TestTarget, { onIntersect: vi.fn() }))
    unmount()
    expect(disconnect).toHaveBeenCalled()
  })
})
