import { useTheme } from '../context/ThemeContext'

function ThemeToggle() {
  const { theme, toggleTheme, setTheme } = useTheme()

  return (
    <div aria-label="theme toggle" className="flex flex-col items-center gap-4">
      <p className="text-gray-700 dark:text-gray-300">
        Current theme: <strong data-testid="theme-value">{theme}</strong>
      </p>

      <button
        onClick={toggleTheme}
        aria-label="toggle theme"
        className={`px-6 py-2 rounded-lg font-medium transition ${
          theme === 'light'
            ? 'bg-gray-800 text-white hover:bg-gray-700'
            : 'bg-yellow-400 text-gray-900 hover:bg-yellow-300'
        }`}
      >
        Switch to {theme === 'light' ? '🌙 Dark' : '☀️ Light'} mode
      </button>

      <div className="flex gap-2">
        <button
          onClick={() => setTheme('light')}
          aria-label="set light theme"
          aria-pressed={theme === 'light'}
          className={`px-4 py-1 rounded-lg text-sm transition ${
            theme === 'light'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
          }`}
        >
          Light
        </button>
        <button
          onClick={() => setTheme('dark')}
          aria-label="set dark theme"
          aria-pressed={theme === 'dark'}
          className={`px-4 py-1 rounded-lg text-sm transition ${
            theme === 'dark'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
          }`}
        >
          Dark
        </button>
      </div>
    </div>
  )
}

export default ThemeToggle
