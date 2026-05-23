import Counter from './components/Counter'
import TodoList from './components/TodoList'

function App() {
  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900 px-4 py-10">
      <div className="max-w-xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-8">
          Testing Playground
        </h1>
        <Counter />
        <TodoList />
      </div>
    </main>
  )
}

export default App
