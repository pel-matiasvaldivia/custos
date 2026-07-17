import { expect } from '@playwright/test';
import { BasePage } from './base.page';

export class ClientesPage extends BasePage {
  readonly ruta = '/clients';

  readonly nuevoCliente = this.boton('Nuevo Cliente');
  readonly buscador = this.page.getByPlaceholder(/Buscar por razón social/);

  async crear(datos: { razonSocial: string; cuit?: string; fantasia?: string }) {
    await this.nuevoCliente.click();
    await expect(this.page.getByRole('heading', { name: 'Nuevo Cliente' })).toBeVisible();
    await this.campo('Razón social').fill(datos.razonSocial);
    if (datos.fantasia) await this.campo('Nombre de fantasía').fill(datos.fantasia);
    if (datos.cuit) await this.campo('CUIT').fill(datos.cuit);
    await this.boton('Guardar').click();
    await this.esperarToastOModalCerrado('Nuevo Cliente');
  }

  async buscar(texto: string) {
    await this.buscador.fill(texto);
    await this.page.waitForTimeout(600); // debounce del buscador
    await this.esperarSinSpinners();
  }

  fila(razonSocial: string) {
    return this.page.getByText(razonSocial, { exact: false }).first();
  }
}
