import { renderHook, act } from '@testing-library/react'
import useDebounce from '../../hooks/useDebounce'

// vi.useFakeTimers() replaces setTimeout/clearTimeout with controllable fakes.
// vi.advanceTimersByTime(ms) fast-forwards all pending timers by ms milliseconds.

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

// ─── Initial value ─────────────────────────────────────────────────────────────

describe('useDebounce — initial value', () => {
  it('returns the initial value immediately (no delay)', () => {
    const { result } = renderHook(() => useDebounce('hello', 500))
    expect(result.current).toBe('hello')
  })

  it('works with numbers', () => {
    const { result } = renderHook(() => useDebounce(42, 300))
    expect(result.current).toBe(42)
  })

  it('works with objects', () => {
    const obj = { a: 1 }
    const { result } = renderHook(() => useDebounce(obj, 300))
    expect(result.current).toBe(obj)
  })
})

// ─── Does not update before delay ─────────────────────────────────────────────

describe('useDebounce — before delay', () => {
  it('does not update if delay has not elapsed', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'hello' } }
    )

    rerender({ value: 'world' })
    act(() => vi.advanceTimersByTime(499))   // 1ms short of delay

    expect(result.current).toBe('hello')     // still old value
  })

  it('does not update at exactly 1ms before delay', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 1000),
      { initialProps: { value: 'a' } }
    )

    rerender({ value: 'b' })
    act(() => vi.advanceTimersByTime(999))

    expect(result.current).toBe('a')
  })
})

// ─── Updates after delay ───────────────────────────────────────────────────────

describe('useDebounce — after delay', () => {
  it('updates to new value after the delay elapses', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'hello' } }
    )

    rerender({ value: 'world' })
    act(() => vi.advanceTimersByTime(500))   // exactly at delay

    expect(result.current).toBe('world')
  })

  it('updates after delay with a number', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 0 } }
    )

    rerender({ value: 99 })
    act(() => vi.advanceTimersByTime(300))

    expect(result.current).toBe(99)
  })
})

// ─── Debounce reset ────────────────────────────────────────────────────────────

describe('useDebounce — timer reset on rapid changes', () => {
  it('resets the timer when value changes before delay', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'a' } }
    )

    rerender({ value: 'ab' })
    act(() => vi.advanceTimersByTime(300))   // 300ms — timer not fired yet

    rerender({ value: 'abc' })              // resets timer back to 0
    act(() => vi.advanceTimersByTime(300))   // only 300ms since last change

    expect(result.current).toBe('a')        // still the original
  })

  it('eventually settles on the last value after rapid changes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'a' } }
    )

    rerender({ value: 'ab' })
    act(() => vi.advanceTimersByTime(300))

    rerender({ value: 'abc' })
    act(() => vi.advanceTimersByTime(500))   // full delay since last change

    expect(result.current).toBe('abc')
  })

  it('ignores intermediate values — only last value is applied', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'start' } }
    )

    // rapid-fire three changes
    rerender({ value: 'one' })
    act(() => vi.advanceTimersByTime(100))
    rerender({ value: 'two' })
    act(() => vi.advanceTimersByTime(100))
    rerender({ value: 'three' })
    act(() => vi.advanceTimersByTime(500))   // settle

    expect(result.current).toBe('three')    // 'one' and 'two' were discarded
  })
})

// ─── Cleanup ───────────────────────────────────────────────────────────────────

describe('useDebounce — cleanup', () => {
  it('cancels the timer when the hook unmounts', () => {
    const { result, rerender, unmount } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'hello' } }
    )

    rerender({ value: 'world' })
    unmount()                               // effect cleanup runs — timer cleared

    act(() => vi.advanceTimersByTime(500))  // timer would have fired here

    // result is still the initial value since component was unmounted
    expect(result.current).toBe('hello')
  })
})
