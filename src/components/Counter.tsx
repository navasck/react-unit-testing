import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <section aria-label="counter" className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 mb-6">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Counter</h2>
      <p
        data-testid="count-display"
        className="text-5xl font-bold text-indigo-600 dark:text-indigo-400 mb-6"
      >
        {count}
      </p>
      <div className="flex justify-center gap-3">
        <button
          onClick={() => setCount((c) => c - 1)}
          className="px-5 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 font-medium transition"
        >
          Decrement
        </button>
        <button
          onClick={() => setCount(0)}
          className="px-5 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 font-medium transition"
        >
          Reset
        </button>
        <button
          onClick={() => setCount((c) => c + 1)}
          className="px-5 py-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 font-medium transition"
        >
          Increment
        </button>
      </div>
    </section>
  )
}

export default Counter
