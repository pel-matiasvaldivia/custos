import { test, expect } from '@playwright/test';

/**
 * Regresión visual. Los baselines se versionan en qa/tests/visual/*-snapshots/.
 * Primera corrida: `npx playwright test --project=visual --update-snapshots`.
 * Se enmascaran zonas dinámicas (fechas, contadores, mapas).
 */
// Solo páginas/zonas visualmente estables: las listas (clientes, personal)
// cambian con los datos que crean las otras suites y darían falsos positivos.
const PAGINAS: Array<[nombre: string, ruta: string]> = [
  ['login', '/login'],
  ['configuracion', '/settings'],
];

test.describe('@mod:visual Regresión visual', () => {
  test('el layout autenticado (sidebar) es estable', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    await page.addStyleTag({
      content: `*,*::before,*::after{animation:none!important;transition:none!important}`,
    });
    const sidebar = page.locator('aside, nav').first();
    await expect(sidebar).toHaveScreenshot('sidebar.png');
  });

  for (const [nombre, ruta] of PAGINAS) {
    test(`captura estable de ${nombre}`, async ({ page }) => {
      await page.goto(ruta);
      await page.waitForLoadState('networkidle');
      await page.addStyleTag({
        content: `*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}`,
      });
      await expect(page).toHaveScreenshot(`${nombre}.png`, {
        fullPage: true,
        mask: [
          page.locator('.leaflet-container'),
          page.locator('canvas'),
          page.locator('video'),
          page.locator('time'),
        ],
      });
    });
  }
});
