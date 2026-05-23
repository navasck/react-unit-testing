# React Testing

Jest and Vitest are both JavaScript testing frameworks/test runners. In a project, we typically use either Jest or Vitest, not both together. Vitest is becoming popular in modern React/Vite projects because of its speed and better developer experience.

npm install --save-dev vitest @vitest/coverage-v8 @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitest/ui

# What each package does

vitest → Fast unit testing framework for Vite/React projects   -  Test runner
@vitest/coverage-v8 → Generates test coverage reports using V8 coverage
@testing-library/react → Utilities for testing React components   - React component testing
@testing-library/jest-dom → Extra DOM matchers like toBeInTheDocument()  - Browser environment
@testing-library/user-event → Simulates real user interactions
jsdom → Browser-like environment for testing in Node.js
@vitest/ui - provides a visual interface for running and debugging tests in Vitest.  -  Browser dashboard


# Commands

npm run test → Runs tests in watch mode
npm run test:run → Runs tests once and exits
npm run test:ui → Opens Vitest UI dashboard in browser
npm run test:coverage → Generates test coverage report
npx vitest → Starts Vitest directly
npx vitest run → Runs all tests once
npx vitest --ui → Starts browser-based test UI
npx vitest run --coverage → Runs tests with coverage
npx vitest src/components/Button.test.tsx → Runs a specific test file
npx vitest -t "renders button" → Runs tests matching a specific name
npx vitest --watch → Reruns tests automatically on file changes
npx vitest --reporter=verbose → Shows detailed test logs
npx vitest --silent → Hides console logs
npx vitest --dir src/components → Runs tests from a specific folder
npx vitest --bail=1 → Stops after first failed test
npx vitest --retry=2 → Retries failed tests 2 times
npx vitest --globals → Enables global APIs like describe, it, expect
npx vitest --dom → Runs tests in DOM environment
open coverage/index.html → Opens coverage report in browser (Mac/Linux)
npm install --save-dev vitest → Installs Vitest
npm install --save-dev @vitest/ui → Installs Vitest UI dashboard
npm install --save-dev @vitest/coverage-v8 → Installs coverage support
npm install --save-dev @testing-library/react → Installs React Testing Library
npm install --save-dev @testing-library/jest-dom → Installs extra DOM matchers
npm install --save-dev @testing-library/user-event → Installs user interaction utilities
npm install --save-dev jsdom → Installs browser-like DOM environment

