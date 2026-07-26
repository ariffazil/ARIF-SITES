import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: 'npm run preview -- --host 127.0.0.1 --port 4173',
      url: 'http://127.0.0.1:4173',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
    {
      command: 'python3 -m http.server 8080 --directory ../arifos.arif-fazil.com',
      url: 'http://127.0.0.1:8080',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
    {
      command: 'python3 -m http.server 4174 --bind 127.0.0.1 --directory ../wealth.arif-fazil.com',
      url: 'http://127.0.0.1:4174',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    }
  ],
});
