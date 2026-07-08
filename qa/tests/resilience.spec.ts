import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('CustOS ERP System Resilience & Fault Tolerance', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
  });

  test('should handle API timeout or slow latency gracefully', async ({ page }) => {
    // Intercept API calls and introduce a simulated latency delay
    await page.route('**/api/**', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      await route.continue();
    });

    await loginPage.navigate();
    await loginPage.loginOffice('admin@custos.com.ar', 'admin123');
    
    // Page should show loading state or successfully load given extra time
    const loader = page.locator('text=Ingresar').first();
    // Buttons should show spin states or disable during transit
    await expect(loader).toBeDisabled();
  });

  test('should display clear error messaging on HTTP 500 server crash', async ({ page }) => {
    // Intercept client query and mock a 500 Internal error
    await page.route('**/api/clientes', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Internal Server Error' })
      });
    });

    await loginPage.navigate();
    await loginPage.loginOffice('admin@custos.com.ar', 'admin123');
    await page.goto('/clients');

    // Page must output warning cards or error states
    await expect(page.locator('text=No se pudo, error, Error, Falló').first()).toBeVisible();
  });

  test('should handle network disconnection offline simulation', async ({ page, context }) => {
    await loginPage.navigate();
    await loginPage.loginOffice('admin@custos.com.ar', 'admin123');
    await page.waitForURL(/\/dashboard/);

    // Simulate network loss/offline state
    await context.setOffline(true);
    
    // Actions on PWA should trigger message/offline banner or queue correctly
    await page.goto('/mobile');
    await expect(page.locator('text=Modo campo, offline, sin conexión, Sin conexión').first()).toBeVisible();
    
    // Restoring connectivity
    await context.setOffline(false);
  });

  test('should prevent double click race conditions on submission buttons', async ({ page }) => {
    await loginPage.navigate();
    const submitBtn = page.locator('button[type="submit"]');
    
    // Trigger double clicks and ensure it locks the first attempt
    await page.fill('input[type="email"]', 'admin@custos.com.ar');
    await page.fill('input[type="password"]', 'admin123');
    
    await submitBtn.dblclick();
    // Submit button should become disabled immediately to prevent duplicate runs
    await expect(submitBtn).toBeDisabled();
  });

  test('should survive refresh mid-creation form without losing session state', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.loginOffice('admin@custos.com.ar', 'admin123');
    await page.waitForURL(/\/dashboard/);

    await page.goto('/clients');
    await page.click('button:has-text("Nuevo Cliente")');
    await page.fill('input:near(label:has-text("Razón social"))', 'Refresh Proof SRL');

    // Refresh page
    await page.reload();
    // User should remain authenticated and login session persisted
    await expect(page).toHaveURL(/\/clients/);
  });
});
