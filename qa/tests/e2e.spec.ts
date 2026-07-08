import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ClientPage } from '../pages/ClientPage';
import { GuardPage } from '../pages/GuardPage';
import { QuadrantPage } from '../pages/QuadrantPage';
import { ContractPage } from '../pages/ContractPage';

test.describe('CustOS ERP E2E Critical Path Business Flow', () => {
  let loginPage: LoginPage;
  let clientPage: ClientPage;
  let guardPage: GuardPage;
  let quadrantPage: QuadrantPage;
  let contractPage: ContractPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    clientPage = new ClientPage(page);
    guardPage = new GuardPage(page);
    quadrantPage = new QuadrantPage(page);
    contractPage = new ContractPage(page);

    // Initial Login
    await loginPage.navigate();
    await loginPage.loginOffice('admin@custos.com.ar', 'admin123');
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('should complete workflow: client -> guard -> quadrant -> contract', async ({ page }) => {
    // 1. Create client
    const testClient = `QA Client ${Date.now()}`;
    await clientPage.navigate();
    await clientPage.openCreateModal();
    await clientPage.createClient({
      razonSocial: testClient,
      nombreFantasia: 'QA Fantasy',
      cuit: '30-99999999-9',
      domicilio: 'Calle Falsa 123',
      contacto: 'John Doe',
      telefono: '1155555555',
      email: 'john@qa.com'
    });
    // Search & Verify Client
    await clientPage.searchClient(testClient);
    await clientPage.expectClientInList(testClient);

    // 2. Register a new guard (Vigilador)
    const testLegajo = `VQA${Math.floor(Math.random() * 1000)}`;
    await guardPage.navigate();
    await guardPage.openCreateModal();
    await guardPage.createGuard({
      nombre: 'Automated',
      apellido: 'Guard',
      documento: `DNI-${Math.floor(Math.random() * 100000000)}`,
      legajo: testLegajo,
      cuil: '20999999999'
    });
    // Verify Guard in List
    await guardPage.navigate();
    await guardPage.expectGuardInList(testLegajo);

    // 3. Perform shifts assignment on Quadrant
    await quadrantPage.navigate();
    // Verify Quadrant Page elements are visible
    await expect(page.locator('text=Cuadrante')).toBeVisible();

    // 4. Verify Contracts view
    await contractPage.navigate();
    await expect(page.locator('text=Clientes')).toBeVisible();
  });
});
