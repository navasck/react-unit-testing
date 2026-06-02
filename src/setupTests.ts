import '@testing-library/jest-dom'

// jsdom has no IntersectionObserver — provide a no-op stub so any component
// that uses it doesn't throw. Individual tests override this via vi.stubGlobal.
globalThis.IntersectionObserver = class {
  observe()    {}
  unobserve()  {}
  disconnect() {}
  constructor(_cb: unknown) {}
} as unknown as typeof IntersectionObserver
