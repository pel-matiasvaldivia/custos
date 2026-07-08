import { defineConfig, devices } from '@playwright/test';
import { CONFIG, STORAGE } from './src/config';

/**
 * Plataforma QA de CustOS.
 *
 * Proyectos:
 *  - setup       login por API + creación de usuarios/tenant de prueba (corre primero)
 *  - api         tests de contrato/negocio contra la API REST (sin browser)
 *  - e2e         flujos de usuario con Page Objects (video + screenshots)
 *  - a11y        accesibilidad con axe-core en páginas clave
 *  - visual      regresión visual (toHaveScreenshot)
 *  - resilience  fallas simuladas: offline, timeouts, 500/401/403, datos corruptos,
 *                doble click, multi-pestaña, refresh en medio de operaciones
 *
 * Suites transversales por tag: @smoke (rápida) y @regression (crítica de negocio).
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: process.env.CI ? 2 : 4,
  retries: process.env.CI ? 1 : 0,
  timeout: 45_000,
  expect: {
    timeout: 10_000,
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.02,
      animations: 'disabled',
    },
  },
  outputDir: 'reports/artifacts',
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/html', open: 'never' }],
    ['json', { outputFile: 'reports/results.json' }],
    ['junit', { outputFile: 'reports/junit.xml' }],
  ],
  use: {
    baseURL: CONFIG.webURL,
    // Entornos con Chromium preinstalado (p. ej. contenedores gestionados):
    // exportar QA_CHROMIUM_PATH=/opt/pw-browsers/chromium para no re-descargar.
    ...(process.env.QA_CHROMIUM_PATH
      ? { launchOptions: { executablePath: process.env.QA_CHROMIUM_PATH } }
      : {}),
    screenshot: 'on',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    locale: 'es-AR',
    timezoneId: 'America/Argentina/Buenos_Aires',
  },
  projects: [
    { name: 'setup', testMatch: /global\.setup\.ts/ },
    {
      name: 'api',
      testDir: './tests/api',
      dependencies: ['setup'],
      use: { baseURL: CONFIG.apiURL },
    },
    {
      name: 'e2e',
      testDir: './tests/e2e',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: STORAGE.admin,
        video: 'on',
      },
    },
    {
      name: 'a11y',
      testDir: './tests/a11y',
      dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'], storageState: STORAGE.admin },
    },
    {
      name: 'visual',
      testDir: './tests/visual',
      dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'], storageState: STORAGE.admin },
    },
    {
      name: 'resilience',
      testDir: './tests/resilience',
      dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'], storageState: STORAGE.admin },
    },
  ],
});
