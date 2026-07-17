import { Page, expect } from '@playwright/test';

export class ContractPage {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto('/clients'); // Contracts are linked from client list or settings
  }

  async configureContractTemplate(templateHtml: string) {
    await this.page.goto('/settings');
    await this.page.click('text=Contratos');
    await this.page.fill('textarea', templateHtml);
    await this.page.click('button:has-text("Guardar")');
  }

  async viewClientContracts(clientName: string) {
    await this.navigate();
    await this.page.click(`text=${clientName}`);
    await this.page.click('text=Contratos');
  }

  async expectContractActive(contractCode: string) {
    await expect(this.page.locator(`text=${contractCode}`)).toBeVisible();
  }
}
