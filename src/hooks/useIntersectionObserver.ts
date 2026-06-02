import { useEffect, useRef } from 'react'

// Stores the latest callback in a ref so the IntersectionObserver never needs
// to be torn down and rebuilt when the callback identity changes.
function useIntersectionObserver<T extends HTMLElement>(
  onIntersect: () => void,
  enabled = true,
  options: IntersectionObserverInit = {}
) {
  const targetRef   = useRef<T>(null)
  const callbackRef = useRef(onIntersect)

  // Keep callbackRef current on every render without adding it to effect deps
  // This is an optimization so the effect doesn't need to be re-run (tearing down and re-creating the observer) every time the callback changes. The observer calls the latest callbackRef.current, which is updated on every render, so it always has the current callback without needing to be a dependency of the effect that creates the observer.

  // callbackRef.current always contains the latest callback because a ref object persists across renders, while its .current property can be updated. The observer callback closes over the ref object, not the callback itself. When the component re-renders, we assign callbackRef.current = onIntersect, so when the observer later executes callbackRef.current(), it invokes the most recent callback and avoids stale closure issues without recreating the observer.
  
  useEffect(() => {
    callbackRef.current = onIntersect
  })

  useEffect(() => {
    if (!enabled || !targetRef.current) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) callbackRef.current()
    }, options)

    observer.observe(targetRef.current)
    return () => observer.disconnect()
  }, [enabled]) // only recreate observer when enabled toggled

  return targetRef
}

export default useIntersectionObserver
