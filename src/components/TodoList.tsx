import { useState } from 'react'

function TodoList() {
  const [input, setInput] = useState('')
  const [todos, setTodos] = useState<string[]>([])

  function addTodo() {
    const trimmed = input.trim()
    if (!trimmed) return
    setTodos((prev) => [...prev, trimmed])
    setInput('')
  }

  function removeTodo(index: number) {
    setTodos((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <section aria-label="todo">
      <h2>Todo List</h2>
      <input
        type="text"
        placeholder="Enter a task..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        aria-label="task input"
      />
      <button onClick={addTodo}>Add</button>

      {todos.length === 0 ? (
        <p>No tasks yet.</p>
      ) : (
        <ul>
          {todos.map((todo, i) => (
            <li key={i}>
              {todo}
              <button onClick={() => removeTodo(i)} aria-label={`remove ${todo}`}>
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default TodoList
