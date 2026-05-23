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
    <section aria-label="todo" className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Todo List</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter a task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          aria-label="task input"
          onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          onClick={addTodo}
          className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition"
        >
          Add
        </button>
      </div>

      {todos.length === 0 ? (
        <p className="text-gray-400 dark:text-gray-500 text-sm text-center py-4">No tasks yet.</p>
      ) : (
        <ul className="space-y-2">
          {todos.map((todo, i) => (
            <li
              key={i}
              className="flex items-center justify-between px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            >
              <span>{todo}</span>
              <button
                onClick={() => removeTodo(i)}
                aria-label={`remove ${todo}`}
                className="ml-3 text-gray-400 hover:text-red-500 transition text-lg leading-none"
              >
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
