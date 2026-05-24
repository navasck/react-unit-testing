import Counter from './components/Counter'
import TodoList from './components/TodoList'
import UserList from './components/UserList'

function App() {
  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900 px-4 py-10">
      <div className="max-w-xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-8">
          Testing Playground
        </h1>
        <Counter />
        <TodoList />
        <section aria-label="users" className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 mt-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Users</h2>
          <UserList />
        </section>
      </div>
    </main>
  )
}

export default App
