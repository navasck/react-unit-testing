import { useState } from 'react'
import useTodos from '../hooks/useTodos'

function TodoList() {
  const [input, setInput] = useState('')
  const { todos, addTodo, removeTodo, toggleTodo, clearDone } = useTodos()

  function handleAdd() {
    addTodo(input)
    setInput('')
  }

  const hasDone = todos.some((t) => t.done)

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
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          onClick={handleAdd}
          className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition"
        >
          Add
        </button>
      </div>

      {todos.length === 0 ? (
        <p className="text-gray-400 dark:text-gray-500 text-sm text-center py-4">No tasks yet.</p>
      ) : (
        <>
          <ul className="space-y-2 mb-3">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center justify-between px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700"
              >
                <span
                  onClick={() => toggleTodo(todo.id)}
                  className={`cursor-pointer select-none ${todo.done ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-200'}`}
                >
                  {todo.text}
                </span>
                <button
                  onClick={() => removeTodo(todo.id)}
                  aria-label={`remove ${todo.text}`}
                  className="ml-3 text-gray-400 hover:text-red-500 transition text-lg leading-none"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
          {hasDone && (
            <button
              onClick={clearDone}
              className="text-sm text-red-400 hover:text-red-600 transition"
            >
              Clear completed
            </button>
          )}
        </>
      )}
    </section>
  )
}

export default TodoList
