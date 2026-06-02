/// <reference types="vitest/config" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html']
    },
    projects: [{
      extends: true,
      test: {
        name: 'unit',
        include: ['src/__tests__/**/*.test.{ts,tsx}'],
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./src/setupTests.ts'],
      }
    }, {
      extends: true,
      plugins: [
      // The plugin will run tests for the stories defined in your Storybook config
      // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
      storybookTest({
        configDir: path.join(dirname, '.storybook')
      })],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: playwright({}),
          instances: [{
            browser: 'chromium'
          }]
        }
      }
    }]
  }
});

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