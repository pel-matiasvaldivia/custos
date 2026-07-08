import { Page, Locator, expect } from '@playwright/test';

/**
 * Base de todos los Page Objects.
 * Nota de selectores: los formularios del app renderizan <label> SIN htmlFor
 * (hallazgo de accesibilidad QA-A11Y-01), por lo que los campos se ubican por
 * el label hermano inmediato: //label[texto]/following-sibling::input.
 */
export abstract class BasePage {
  constructor(readonly page: Page) {}

  abstract readonly ruta: string;

  async ir() {
    await this.page.goto(this.ruta);
  }

  /** Input inmediatamente después de un <label> con ese texto. */
  campo(label: string): Locator {
    return this.page
      .locator(
        `xpath=//label[normalize-space()=${JSON.stringify(label)}]/following-sibling::input` +
          ` | //label[normalize-space()=${JSON.stringify(label)}]/following-sibling::select` +
          ` | //label[normalize-space()=${JSON.stringify(label)}]/following-sibling::textarea`,
      )
      .first();
  }

  boton(texto: string | RegExp): Locator {
    return this.page.getByRole('button', { name: texto });
  }

  /** Navegación por el sidebar del layout autenticado. */
  async navegar(item: string) {
    await this.page.getByRole('link', { name: item, exact: true }).first().click();
  }

  async esperarSinSpinners() {
    await this.page.waitForLoadState('networkidle');
  }

  async esperarToastOModalCerrado(modalTitulo: string) {
    await expect(this.page.getByRole('heading', { name: modalTitulo })).toBeHidden({
      timeout: 15_000,
    });
  }
}
