import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { LoginPage } from '../pages/LoginPage';

test.describe('CustOS ERP Visual and Accessibility (A11y) Page Verification', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
  });

  test('should pass WCAG accessibility audits on the login page', async ({ page }) => {
    await loginPage.navigate();
    
    // Run Axe scanning on the visible page content
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'best-practice'])
      .analyze();
    
    expect(results.violations).toEqual([]);
  });

  test('should verify login page visual layout matches master reference snapshot', async ({ page }) => {
    await loginPage.navigate();
    
    // Capture page screenshot and match snapshot
    // Soft assertions let tests continue even if slight anti-aliasing pixel mismatch occurs
    const loginScreenshot = await page.screenshot();
    expect(loginScreenshot).toMatchSnapshot('login-page.png', {
      maxDiffPixelRatio: 0.1
    });
  });

  test('should pass WCAG accessibility audits on the admin dashboard after login', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.loginOffice('admin@custos.com.ar', 'admin123');
    await page.waitForURL(/\/dashboard/);
    
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    expect(results.violations).toEqual([]);
  });
});
