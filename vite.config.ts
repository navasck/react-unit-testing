import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
    },
  },
})




// test: {
//   globals: true,
// }

// So Vitest automatically makes these globally available:

// describe
// it
// test
// expect
// vi
// beforeEach
// afterEach
// beforeAll
// afterAll

// this will works without import:
//In Vitest, when globals: true is enabled in the configuration, methods like describe, it, expect, and vi become globally available, so we do not need to import them manually in each test file.
