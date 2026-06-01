# ⚛️ React Testing

> Jest and Vitest are both JavaScript testing frameworks/test runners. In a project, we typically use either Jest or Vitest, not both together. Vitest is becoming popular in modern React/Vite projects because of its speed and better developer experience.

---

## 📦 Install All Packages

```bash
npm install --save-dev vitest @vitest/coverage-v8 @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitest/ui
```

---

## 🔍 What Each Package Does

| Package | Purpose | Role |
|---|---|---|
| `vitest` | Fast unit testing framework for Vite/React projects | Test runner |
| `@vitest/coverage-v8` | Generates test coverage reports using V8 coverage | Coverage |
| `@testing-library/react` | Utilities for testing React components | React component testing |
| `@testing-library/jest-dom` | Extra DOM matchers like `toBeInTheDocument()` | Browser environment |
| `@testing-library/user-event` | Simulates real user interactions | User simulation |
| `jsdom` | Browser-like environment for testing in Node.js | DOM environment |
| `@vitest/ui` | Visual interface for running and debugging tests | Browser dashboard |

---

## 🚀 NPM Scripts

```bash
npm run test          # Runs tests in watch mode
npm run test:run      # Runs tests once and exits
npm run test:ui       # Opens Vitest UI dashboard in browser
npm run coverage      # Generates test coverage report
```

---

## 🛠️ Vitest CLI Commands

```bash
# Run directly
npx vitest                                   # Starts Vitest
npx vitest run                               # Runs all tests once
npx vitest --ui                              # Starts browser-based test UI
npx vitest run --coverage                    # Runs tests with coverage

# Target specific tests
npx vitest src/components/Button.test.tsx    # Run a specific test file
npx vitest -t "renders button"              # Run tests matching a name
npx vitest --dir src/components             # Run tests from a folder

# Output control
npx vitest --reporter=verbose               # Shows detailed test logs
npx vitest --silent                         # Hides console logs
npx vitest --watch                          # Reruns on file changes

# Test behaviour
npx vitest --bail=1                         # Stops after first failed test
npx vitest --retry=2                        # Retries failed tests 2 times
npx vitest --globals                        # Enables global APIs (describe, it, expect)
npx vitest --dom                            # Runs tests in DOM environment
```

---

## 📊 Coverage Report

```bash
open coverage/index.html     # Mac/Linux — opens report in browser
```

---

## 📥 Individual Install Commands

```bash
npm install --save-dev vitest
npm install --save-dev @vitest/ui
npm install --save-dev @vitest/coverage-v8
npm install --save-dev @testing-library/react
npm install --save-dev @testing-library/jest-dom
npm install --save-dev @testing-library/user-event
npm install --save-dev jsdom
```

---

## 🧪 Common Methods in Vitest / Jest

| Method | Description |
|---|---|
| `describe()` | Groups related test cases |
| `it()` | Defines a single test case |
| `test()` | Same as `it()` |
| `expect()` | Used for assertions/validation |
| `beforeEach()` | Runs before every test |
| `afterEach()` | Runs after every test |
| `beforeAll()` | Runs once before all tests |
| `afterAll()` | Runs once after all tests |
| `vi.fn()` | Creates mock function in Vitest |
| `jest.fn()` | Creates mock function in Jest |
| `vi.mock()` | Mocks modules/functions in Vitest |
| `jest.mock()` | Mocks modules/functions in Jest |
| `spyOn()` | Watches/mock existing function behavior | vi.spyOn(object, 'methodName')
| `mockReturnValue()` | Returns fixed mock value |
| `mockResolvedValue()` | Mocks resolved async promise |
| `mockRejectedValue()` | Mocks rejected async promise |
| `clearAllMocks()` | Clears mock history |
| `resetAllMocks()` | Resets mocks completely |
| `restoreAllMocks()` | Restores original implementation |

---

## ✅ Common Assertion Methods (`expect`)

| Method | Description |
|---|---|
| `toBe()` | Exact value comparison |
| `toEqual()` | Deep object/array comparison |
| `toStrictEqual()` | Strict deep comparison |
| `toBeTruthy()` | Checks truthy value |
| `toBeFalsy()` | Checks falsy value |
| `toBeNull()` | Checks null |
| `toBeUndefined()` | Checks undefined |
| `toContain()` | Checks array/string contains value |
| `toHaveLength()` | Checks length |
| `toHaveBeenCalled()` | Verifies function call |
| `toHaveBeenCalledTimes()` | Verifies number of calls |
| `toHaveBeenCalledWith()` | Verifies function arguments |
| `toThrow()` | Checks error throwing |
| `toMatch()` | Regex/string matching |

---

## 🖥️ Common React Testing Library Methods

> From `@testing-library/react`

| Method | Description |
|---|---|
| `render()` | Renders component for testing |
| `screen.getByText()` | Finds element by text |
| `screen.getByRole()` | Finds element by role |
| `screen.getByLabelText()` | Finds form field by label |
| `screen.getByPlaceholderText()` | Finds by placeholder |
| `screen.getByTestId()` | Finds element by `data-testid` attribute |
| `screen.queryByText()` | Returns null if not found |
| `screen.findByText()` | Async element search |
| `fireEvent()` | Simulates DOM events |
| `userEvent.click()` | Simulates real click interaction |
| `userEvent.type()` | Simulates typing |
| `waitFor()` | Waits for async updates |
| `renderHook()` | Renders a custom hook in isolation without a component |
| `act()` | Wraps state-updating calls so React flushes updates before assertions |

### `renderHook` — usage

```ts
import { renderHook, act } from '@testing-library/react'
import useCounter from '../hooks/useCounter'

const { result } = renderHook(() => useCounter(0))

// result.current holds the hook's return value
expect(result.current.count).toBe(0)

// wrap any call that triggers a state update in act()
act(() => result.current.increment())
expect(result.current.count).toBe(1)
```

| Property / Method | Description |
|---|---|
| `result.current` | The latest return value of the hook |
| `rerender()` | Re-renders the hook with new arguments |
| `unmount()` | Unmounts the hook (useful for cleanup tests) |

### `act` — usage

```ts
// single state update
act(() => result.current.increment())

// multiple updates batched together
act(() => {
  result.current.increment()
  result.current.increment()
  result.current.reset()
})

// async state update (e.g. after a fetch)
await act(async () => {
  result.current.fetchData()
})
```

> `act()` ensures React processes all state updates and effects before you run `expect()`.
> Without it, assertions may read stale values.

---

## 🎯 Common jest-dom Matchers

> From `@testing-library/jest-dom`

| Matcher | Description |
|---|---|
| `toBeInTheDocument()` | Checks element exists |
| `toBeDisabled()` | Checks disabled state |
| `toBeEnabled()` | Checks enabled state |
| `toBeVisible()` | Checks visibility |
| `toHaveTextContent()` | Checks text content |
| `toHaveAttribute()` | Checks attribute value |
| `toHaveClass()` | Checks class name |
| `toHaveValue()` | Checks input value |
| `toBeChecked()` | Checks checkbox/radio state |




## 🎯 steps that we covered  (real-world testing patterns):


1. Async API Fetch component
A component that fetches data — tests loading state, success state, error state, and API mocking with vi.mock() / vi.fn(). This is the most common real-world scenario missing from the current setup.

2. Form with validation
A multi-field form (name, email, password) with inline error messages. Tests: required field errors, email format, submit disabled until valid — covers userEvent.type, userEvent.tab, and form submission patterns.

3. Custom Hook with renderHook
Extract counter or todo logic into a useCounter / useTodos hook and test the hook in isolation using renderHook from RTL — shows how to test logic separately from UI.

4. Context API
A theme or auth context provider wrapping components — tests that children receive context values correctly and respond to context changes.

Recommended starting point: Async API Fetch — it introduces the most new concepts at once:
