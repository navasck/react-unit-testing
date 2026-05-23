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
npx vitest                          # Starts Vitest
npx vitest run                      # Runs all tests once
npx vitest --ui                     # Starts browser-based test UI
npx vitest run --coverage           # Runs tests with coverage

# Target specific tests
npx vitest src/components/Button.test.tsx   # Run a specific test file
npx vitest -t "renders button"             # Run tests matching a name
npx vitest --dir src/components            # Run tests from a folder

# Output control
npx vitest --reporter=verbose       # Shows detailed test logs
npx vitest --silent                 # Hides console logs
npx vitest --watch                  # Reruns on file changes

# Test behaviour
npx vitest --bail=1                 # Stops after first failed test
npx vitest --retry=2                # Retries failed tests 2 times
npx vitest --globals                # Enables global APIs (describe, it, expect)
npx vitest --dom                    # Runs tests in DOM environment
```

---

## 📊 Coverage Report

```bash
open coverage/index.html            # Mac/Linux — opens report in browser
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
