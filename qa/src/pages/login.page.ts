import { expect } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  readonly ruta = '/login';

  readonly email = this.page.getByPlaceholder('operador@empresa.com');
  readonly password = this.page.getByPlaceholder('••••••••');
  readonly entrar = this.page.locator('button[type="submit"]');

  async login(email: string, password: string) {
    await this.ir();
    await this.email.fill(email);
    await this.password.fill(password);
    await this.entrar.click();
  }

  async loginOk(email: string, password: string) {
    await this.login(email, password);
    await expect(this.page).toHaveURL(/dashboard|\/$/, { timeout: 15_000 });
  }
}
