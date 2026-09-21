import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  retries: 0,
  workers: 1,
  timeout: 300000, // 5 minutos de tiempo límite para que no se cierre por lentitud
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    headless: false, // Abre la ventana del navegador automáticamente
    launchOptions: {
      slowMo: 1500, // Pausa de 1.5 segundos entre cada acción (clic, tipeo, modal)
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});