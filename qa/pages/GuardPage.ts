import { Page, expect } from '@playwright/test';

export class GuardPage {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto('/personnel');
  }

  async openCreateModal() {
    await this.page.click('button:has-text("Nuevo Vigilador")');
  }

  async createGuard(data: {
    nombre: string;
    apellido: string;
    documento: string;
    legajo: string;
    cuil?: string;
  }) {
    // Fill wizard details. Since wizard has multiple steps, we fill the first step
    // and click next/continue. Let's check inputs.
    // Note: VigiladorWizard has a step-by-step UI. Let's make sure we find inputs.
    await this.page.fill('input:near(label:has-text("Nombre"))', data.nombre);
    await this.page.fill('input:near(label:has-text("Apellido"))', data.apellido);
    await this.page.fill('input:near(label:has-text("Documento"))', data.documento);
    await this.page.fill('input:near(label:has-text("Legajo"))', data.legajo);
    if (data.cuil) {
      await this.page.fill('input:near(label:has-text("CUIL"))', data.cuil);
    }
    // Wizard might have multiple steps. Let's click "Siguiente" or "Guardar".
    // Let's check if the button contains text "Siguiente" or "Guardar".
    const nextButton = this.page.locator('button:has-text("Siguiente"), button:has-text("Guardar"), button:has-text("Crear")');
    if (await nextButton.isVisible()) {
      await nextButton.click();
    }
  }

  async expectGuardInList(legajo: string) {
    await expect(this.page.locator(`text=${legajo}`)).toBeVisible();
  }
}
