import { BasePage } from './base.page';

export class PersonalPage extends BasePage {
  readonly ruta = '/personnel';

  readonly nuevoVigilador = this.boton('Nuevo Vigilador');
  readonly buscador = this.page.getByPlaceholder(/Buscar por nombre, apellido/);

  async buscar(texto: string) {
    await this.buscador.fill(texto);
    await this.page.waitForTimeout(600);
    await this.esperarSinSpinners();
  }

  fila(apellido: string) {
    return this.page.getByText(apellido, { exact: false }).first();
  }
}
