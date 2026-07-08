import { Page, expect } from '@playwright/test';

export class ClientPage {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto('/clients');
  }

  async openCreateModal() {
    await this.page.click('button:has-text("Nuevo Cliente")');
  }

  async createClient(data: {
    razonSocial: string;
    nombreFantasia?: string;
    cuit?: string;
    domicilio?: string;
    contacto?: string;
    telefono?: string;
    email?: string;
  }) {
    await this.page.fill('input:near(label:has-text("Razón social"))', data.razonSocial);
    if (data.nombreFantasia) {
      await this.page.fill('input:near(label:has-text("Nombre de fantasía"))', data.nombreFantasia);
    }
    if (data.cuit) {
      await this.page.fill('input:near(label:has-text("CUIT"))', data.cuit);
    }
    if (data.domicilio) {
      await this.page.fill('input:near(label:has-text("Domicilio"))', data.domicilio);
    }
    if (data.contacto) {
      await this.page.fill('input:near(label:has-text("Contacto"))', data.contacto);
    }
    if (data.telefono) {
      await this.page.fill('input:near(label:has-text("Teléfono"))', data.telefono);
    }
    if (data.email) {
      await this.page.fill('input:near(label:has-text("Email de contacto"))', data.email);
    }
    await this.page.click('button:has-text("Guardar")');
  }

  async searchClient(query: string) {
    await this.page.fill('input[placeholder*="Buscar"]', query);
  }

  async expectClientInList(razonSocial: string) {
    await expect(this.page.locator(`text=${razonSocial}`)).toBeVisible();
  }
}
