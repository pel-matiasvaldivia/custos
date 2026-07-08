import { Page, expect } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto('/login?force=1');
  }

  async loginOffice(email: string, pass: string) {
    await this.page.fill('input[type="email"]', email);
    await this.page.fill('input[type="password"]', pass);
    await this.page.click('button:has-text("Ingresar al SOC")');
  }

  async loginMobileVigilador(legajo: string, pin: string) {
    await this.page.goto('/mobile/login');
    // Switch to Vigilador tab
    await this.page.click('button:has-text("Vigilador")');
    await this.page.fill('input[placeholder="N° de legajo"]', legajo);
    await this.page.fill('input[placeholder="••••"]', pin);
    await this.page.click('button:has-text("Ingresar")');
  }

  async loginMobileDispositivo(codigo: string, pin: string) {
    await this.page.goto('/mobile/login');
    // Switch to Objetivo tab
    await this.page.click('button:has-text("Objetivo")');
    await this.page.fill('input[placeholder="Ej: OBJ-001"]', codigo);
    await this.page.fill('input[placeholder="••••"]', pin);
    await this.page.click('button:has-text("Activar dispositivo")');
  }
}
