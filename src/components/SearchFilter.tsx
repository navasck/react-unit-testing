import { useState, useMemo, useDeferredValue, useTransition, useId } from 'react'

const ITEMS = [
  'Apple', 'Banana', 'Cherry', 'Date', 'Elderberry',
  'Fig', 'Grape', 'Honeydew', 'Kiwi', 'Lemon',
  'Mango', 'Nectarine', 'Orange', 'Papaya', 'Quince',
]

function SearchFilter() {
  // useId — generates a unique, stable ID for linking <label> to <input>
  const inputId = useId()

  const [query, setQuery] = useState('')

  // useTransition — marks the query update as non-urgent.
  // The input always reflects the typed value immediately (urgent),
  // while the filtering work is deferred until the browser is free.
  const [isPending, startTransition] = useTransition()

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    startTransition(() => setQuery(e.target.value))
  }

  // useDeferredValue — keeps a "stale" copy of query while React
  // prepares the next render with the new filtered list.
  // Together with useMemo this replaces the custom useDebounce hook.
  const deferredQuery = useDeferredValue(query)

  // useMemo — filtered list only recomputes when deferredQuery changes,
  // not on every render.
  const filtered = useMemo(
    () =>
      ITEMS.filter((item) =>
        item.toLowerCase().includes(deferredQuery.toLowerCase().trim())
      ),
    [deferredQuery]
  )

  const isFiltering = isPending || query !== deferredQuery

  return (
    <section aria-label="search filter" className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Search & Filter</h2>

      {/* Input */}
      <div className="relative mb-4">
        <label htmlFor={inputId} className="sr-only">Search fruits</label>
        <input
          id={inputId}
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search fruits..."
          aria-label="search input"
          aria-busy={isFiltering}
          className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        {query && (
          <button
            onClick={() => startTransition(() => setQuery(''))}
            aria-label="clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            ✕
          </button>
        )}
      </div>

      {/* Status */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3" aria-live="polite">
        {isFiltering
          ? 'Searching...'
          : deferredQuery
            ? `${filtered.length} result${filtered.length !== 1 ? 's' : ''} for "${deferredQuery}"`
            : `${ITEMS.length} items`}
      </p>

      {/* Results */}
      {!isFiltering && filtered.length === 0 ? (
        <p data-testid="no-results" className="text-center text-gray-400 dark:text-gray-500 py-4">
          No results for "{deferredQuery}"
        </p>
      ) : (
        <ul
          className={`grid grid-cols-2 gap-2 transition-opacity duration-150 ${isFiltering ? 'opacity-50' : 'opacity-100'}`}
        >
          {(isFiltering ? ITEMS : filtered).map((item) => (
            <li
              key={item}
              className="px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default SearchFilter




// useDeferredValue is a React concurrent feature that allows lower-priority updates to be deferred. It keeps urgent updates, such as user typing, responsive while delaying expensive rendering work. Unlike debouncing, it does not use a fixed delay; React schedules the deferred update based on available rendering time. It is commonly used for large lists, search results, and expensive UI computations.
