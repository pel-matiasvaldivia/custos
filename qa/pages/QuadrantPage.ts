import { Page, expect } from '@playwright/test';

export class QuadrantPage {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto('/quadrant');
  }

  async affectGuardToPuesto(guardName: string, puestoName: string) {
    // Select objective / puesto
    // Open affect guard modal
    // Select guard and confirm
    // Detail actions depend on UI. We can click cells on the quadrant or buttons.
    // Let's specify generalized E2E triggers:
    await this.page.click(`text=${puestoName}`);
    await this.page.click('button:has-text("Afectar"), button:has-text("Asignar")');
    await this.page.fill('input[placeholder*="Buscar vigilador"]', guardName);
    await this.page.click(`text=${guardName}`);
    await this.page.click('button:has-text("Confirmar"), button:has-text("Asignar")');
  }

  async checkCoverageConflictExists() {
    // Look for red border, warning icons, or text like "Sin vigilador" or "Conflictos"
    const conflict = this.page.locator('.bg-red-500\\/10, text=Sin cubrir, text=Conflicto');
    await expect(conflict.first()).toBeVisible();
  }
}
