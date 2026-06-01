import { renderHook, act } from '@testing-library/react'
import useTodos from '../../hooks/useTodos'

// ─── Initial state ─────────────────────────────────────────────────────────────

describe('useTodos — initial state', () => {
  it('starts with an empty list', () => {
    const { result } = renderHook(() => useTodos())
    expect(result.current.todos).toHaveLength(0)
  })
})

// ─── addTodo ───────────────────────────────────────────────────────────────────

describe('useTodos — addTodo', () => {
  it('adds a todo to the list', () => {
    const { result } = renderHook(() => useTodos())
    act(() => result.current.addTodo('Buy milk'))
    expect(result.current.todos).toHaveLength(1)
    expect(result.current.todos[0].text).toBe('Buy milk')
  })

  it('trims whitespace from the todo text', () => {
    const { result } = renderHook(() => useTodos())
    act(() => result.current.addTodo('  Buy milk  '))
    expect(result.current.todos[0].text).toBe('Buy milk')
  })

  it('does not add an empty string', () => {
    const { result } = renderHook(() => useTodos())
    act(() => result.current.addTodo(''))
    expect(result.current.todos).toHaveLength(0)
  })

  it('does not add a whitespace-only string', () => {
    const { result } = renderHook(() => useTodos())
    act(() => result.current.addTodo('   '))
    expect(result.current.todos).toHaveLength(0)
  })

  it('assigns a unique id to each todo', () => {
    const { result } = renderHook(() => useTodos())
    act(() => {
      result.current.addTodo('Task A')
      result.current.addTodo('Task B')
    })
    const [a, b] = result.current.todos
    expect(a.id).not.toBe(b.id)
  })

  it('new todos start as not done', () => {
    const { result } = renderHook(() => useTodos())
    act(() => result.current.addTodo('Task'))
    expect(result.current.todos[0].done).toBe(false)
  })

  it('adds multiple todos in order', () => {
    const { result } = renderHook(() => useTodos())
    act(() => {
      result.current.addTodo('First')
      result.current.addTodo('Second')
      result.current.addTodo('Third')
    })
    const texts = result.current.todos.map((t) => t.text)
    expect(texts).toEqual(['First', 'Second', 'Third'])
  })
})

// ─── removeTodo ────────────────────────────────────────────────────────────────

describe('useTodos — removeTodo', () => {
  it('removes a todo by id', () => {
    const { result } = renderHook(() => useTodos())
    act(() => result.current.addTodo('Task A'))
    const id = result.current.todos[0].id
    act(() => result.current.removeTodo(id))
    expect(result.current.todos).toHaveLength(0)
  })

  it('removes only the targeted todo', () => {
    const { result } = renderHook(() => useTodos())
    act(() => {
      result.current.addTodo('Task A')
      result.current.addTodo('Task B')
      result.current.addTodo('Task C')
    })
    const idB = result.current.todos[1].id
    act(() => result.current.removeTodo(idB))
    const texts = result.current.todos.map((t) => t.text)
    expect(texts).toEqual(['Task A', 'Task C'])
  })

  it('does nothing when id does not exist', () => {
    const { result } = renderHook(() => useTodos())
    act(() => result.current.addTodo('Task'))
    act(() => result.current.removeTodo(9999))
    expect(result.current.todos).toHaveLength(1)
  })
})

// ─── toggleTodo ────────────────────────────────────────────────────────────────

describe('useTodos — toggleTodo', () => {
  it('marks a todo as done', () => {
    const { result } = renderHook(() => useTodos())
    act(() => result.current.addTodo('Task'))
    const id = result.current.todos[0].id
    act(() => result.current.toggleTodo(id))
    expect(result.current.todos[0].done).toBe(true)
  })

  it('toggles a done todo back to not done', () => {
    const { result } = renderHook(() => useTodos())
    act(() => result.current.addTodo('Task'))
    const id = result.current.todos[0].id
    act(() => result.current.toggleTodo(id))  // done
    act(() => result.current.toggleTodo(id))  // not done
    expect(result.current.todos[0].done).toBe(false)
  })

  it('only toggles the targeted todo', () => {
    const { result } = renderHook(() => useTodos())
    act(() => {
      result.current.addTodo('Task A')
      result.current.addTodo('Task B')
    })
    const idA = result.current.todos[0].id
    act(() => result.current.toggleTodo(idA))
    expect(result.current.todos[0].done).toBe(true)
    expect(result.current.todos[1].done).toBe(false)
  })
})

// ─── clearDone ─────────────────────────────────────────────────────────────────

describe('useTodos — clearDone', () => {
  it('removes all completed todos', () => {
    const { result } = renderHook(() => useTodos())
    act(() => {
      result.current.addTodo('Task A')
      result.current.addTodo('Task B')
      result.current.addTodo('Task C')
    })
    const idA = result.current.todos[0].id
    const idC = result.current.todos[2].id
    act(() => {
      result.current.toggleTodo(idA)
      result.current.toggleTodo(idC)
    })
    act(() => result.current.clearDone())
    expect(result.current.todos).toHaveLength(1)
    expect(result.current.todos[0].text).toBe('Task B')
  })

  it('does nothing when no todos are done', () => {
    const { result } = renderHook(() => useTodos())
    act(() => {
      result.current.addTodo('Task A')
      result.current.addTodo('Task B')
    })
    act(() => result.current.clearDone())
    expect(result.current.todos).toHaveLength(2)
  })
})
