import { useEffect } from 'react'
import { useTheme } from './context/ThemeContext'
import Counter from './components/Counter'
import TodoList from './components/TodoList'
import UserList from './components/UserList'
import FormValidation from './components/FormValidation'
import ThemeToggle from './components/ThemeToggle'

function App() {
  const { theme } = useTheme()

  // apply/remove the 'dark' class on <html> so all dark: Tailwind classes respond
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900 px-4 py-10 transition-colors duration-300">
      <div className="max-w-xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white">
          Testing Playground
        </h1>
        <Counter />
        <TodoList />
        <section aria-label="users" className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Users</h2>
          <UserList />
        </section>
        <section aria-label="registration" className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Register</h2>
          <FormValidation />
        </section>
        <section aria-label="theme" className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Theme</h2>
          <ThemeToggle />
        </section>
      </div>
    </main>
  )
}

export default App
