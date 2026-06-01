import { useState, useRef } from 'react'

type Todo = {
  id: number
  text: string
  done: boolean
}

function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([])
  const nextId = useRef(1)

  const addTodo = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return
    setTodos((prev) => [...prev, { id: nextId.current++, text: trimmed, done: false }])
  }

  const removeTodo = (id: number) => {
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }

  const toggleTodo = (id: number) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  }

  const clearDone = () => {
    setTodos((prev) => prev.filter((t) => !t.done))
  }

  return { todos, addTodo, removeTodo, toggleTodo, clearDone }
}

export default useTodos
