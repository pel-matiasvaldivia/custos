import { test, expect } from '@playwright/test';
import { STORAGE } from '../../src/config';

/**
 * La UI del OPERADOR no debe exponer acciones administrativas,
 * y si fuerza la URL la API igual lo bloquea (defensa en profundidad).
 */
test.describe('@mod:auth RBAC en la interfaz', () => {
  test.use({ storageState: STORAGE.operador });

  test('@regression operador entra al dashboard con su sesión', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    await expect(page).not.toHaveURL(/login/);
  });

  test('operador que fuerza /settings no obtiene datos administrativos', async ({ page }) => {
    const respuestasProhibidas: number[] = [];
    page.on('response', (r) => {
      if (r.url().includes('/api/v1/usuarios') && r.status() === 200) {
        respuestasProhibidas.push(r.status());
      }
    });
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');
    expect(respuestasProhibidas, 'un OPERADOR no debería recibir 200 de /usuarios').toEqual([]);
  });
});
