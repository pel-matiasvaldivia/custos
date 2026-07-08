import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load env vars from API if needed
dotenv.config({ path: path.resolve(__dirname, '../apps/api/.env') });

export default defineConfig({
  testDir: './tests',
  fullyParallel: false, // Run sequentially to avoid DB lock / RLS state interference during E2E
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Single worker avoids database seed / RLS conflicts
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list']
  ],
  use: {
    baseURL: process.env.BASE_URL || 'https://app.custos.pymesenlinea.com.ar',
    trace: 'on-first-retry',
    video: 'on',
    screenshot: 'on',
    viewport: { width: 1280, height: 720 },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
