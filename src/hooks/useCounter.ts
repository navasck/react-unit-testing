import { useState } from 'react'

function useCounter(initial = 0) {
  const [count, setCount] = useState(initial)

  const increment = () => setCount((c) => c + 1)
  const decrement = () => setCount((c) => c - 1)
  const reset = () => setCount(initial)
  const setTo = (value: number) => setCount(value)

  return { count, increment, decrement, reset, setTo }
}

export default useCounter
