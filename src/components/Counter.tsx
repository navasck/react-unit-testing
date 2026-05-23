import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <section aria-label="counter">
      <h2>Counter</h2>
      <p data-testid="count-display">Count: {count}</p>
      <button onClick={() => setCount((c) => c - 1)}>Decrement</button>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </section>
  )
}

export default Counter
