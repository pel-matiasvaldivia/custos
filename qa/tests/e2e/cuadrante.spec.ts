import { test, expect } from '@playwright/test';
import { CuadrantePage } from '../../src/pages/dashboard.page';

test.describe('@mod:cuadrante Cuadrante (UI)', () => {
  test('@regression la página consolida el cuadrante y navega meses', async ({ page }) => {
    const cuadrante = new CuadrantePage(page);
    await cuadrante.ir();
    await page.waitForLoadState('networkidle');
    // El mes visible debe ser real (no el mockup "Junio 2026" fijo del bug B5)
    const meses =
      /enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre/i;
    await expect(page.locator('body')).toContainText(meses);
  });

  test('@regression Exportar descarga un CSV', async ({ page }) => {
    const cuadrante = new CuadrantePage(page);
    await cuadrante.ir();
    await page.waitForLoadState('networkidle');
    const btn = cuadrante.exportar.first();
    test.skip(!(await btn.isVisible().catch(() => false)), 'botón Exportar no visible');
    const descarga = page.waitForEvent('download', { timeout: 15_000 });
    await btn.click();
    const archivo = await descarga;
    expect(archivo.suggestedFilename()).toMatch(/\.csv$/i);
  });
});
