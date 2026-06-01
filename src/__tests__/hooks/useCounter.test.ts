import { renderHook, act } from '@testing-library/react'
import useCounter from '../../hooks/useCounter'

// ─── Initial state ─────────────────────────────────────────────────────────────

describe('useCounter — initial state', () => {
  it('starts at 0 by default', () => {
    const { result } = renderHook(() => useCounter())
    expect(result.current.count).toBe(0)
  })

  it('starts at the given initial value', () => {
    const { result } = renderHook(() => useCounter(10))
    expect(result.current.count).toBe(10)
  })

  it('starts at a negative initial value', () => {
    const { result } = renderHook(() => useCounter(-5))
    expect(result.current.count).toBe(-5)
  })
})

// ─── increment ─────────────────────────────────────────────────────────────────

describe('useCounter — increment', () => {
  it('increments count by 1', () => {
    const { result } = renderHook(() => useCounter())
    act(() => result.current.increment())
    expect(result.current.count).toBe(1)
  })

  it('increments multiple times', () => {
    const { result } = renderHook(() => useCounter())
    act(() => {
      result.current.increment()
      result.current.increment()
      result.current.increment()
    })
    expect(result.current.count).toBe(3)
  })
})

// ─── decrement ─────────────────────────────────────────────────────────────────

describe('useCounter — decrement', () => {
  it('decrements count by 1', () => {
    const { result } = renderHook(() => useCounter(5))
    act(() => result.current.decrement())
    expect(result.current.count).toBe(4)
  })

  it('goes below zero', () => {
    const { result } = renderHook(() => useCounter())
    act(() => result.current.decrement())
    expect(result.current.count).toBe(-1)
  })
})

// ─── reset ─────────────────────────────────────────────────────────────────────

describe('useCounter — reset', () => {
  it('resets to 0 when initial was 0', () => {
    const { result } = renderHook(() => useCounter())
    act(() => result.current.increment())
    act(() => result.current.increment())
    act(() => result.current.reset())
    expect(result.current.count).toBe(0)
  })

  it('resets to the original initial value', () => {
    const { result } = renderHook(() => useCounter(10))
    act(() => result.current.increment())
    act(() => result.current.decrement())
    act(() => result.current.reset())
    expect(result.current.count).toBe(10)
  })
})

// ─── setTo ──────────────────────────────────────────────────────────────────────

describe('useCounter — setTo', () => {
  it('sets count to an arbitrary value', () => {
    const { result } = renderHook(() => useCounter())
    act(() => result.current.setTo(42))
    expect(result.current.count).toBe(42)
  })

  it('sets count to a negative value', () => {
    const { result } = renderHook(() => useCounter())
    act(() => result.current.setTo(-99))
    expect(result.current.count).toBe(-99)
  })
})

// ─── combined sequences ────────────────────────────────────────────────────────

describe('useCounter — combined sequences', () => {
  it('increment → decrement → reset returns to initial', () => {
    const { result } = renderHook(() => useCounter(5))
    act(() => {
      result.current.increment()  // 6
      result.current.increment()  // 7
      result.current.decrement()  // 6
      result.current.reset()      // 5
    })
    expect(result.current.count).toBe(5)
  })
})
