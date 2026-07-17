import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/login.page';
import { CONFIG } from '../../src/config';

test.describe('@mod:auth Login (UI)', () => {
  test.use({ storageState: { cookies: [], origins: [] } }); // sin sesión previa

  test('@smoke @regression login correcto llega al dashboard', async ({ page }) => {
    const login = new LoginPage(page);
    await login.loginOk(CONFIG.admin.email, CONFIG.admin.password);
    await expect(page.getByRole('link', { name: 'Clientes' })).toBeVisible();
  });

  test('@regression credenciales inválidas muestran error y no navegan', async ({ page }) => {
    const login = new LoginPage(page);
    await login.login(CONFIG.admin.email, 'password-mala');
    await expect(page).toHaveURL(/login/);
    await expect(page.getByText(/inválid|incorrect|error/i).first()).toBeVisible({
      timeout: 10_000,
    });
  });

  test('ruta protegida sin sesión redirige a login', async ({ page }) => {
    await page.goto('/clients');
    await expect(page).toHaveURL(/login|landing|\/$/);
  });
});
