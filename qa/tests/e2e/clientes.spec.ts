import { test, expect } from '@playwright/test';
import { ClientesPage } from '../../src/pages/clientes.page';
import { unico } from '../../src/config';

test.describe('@mod:clientes Clientes (UI)', () => {
  test('@smoke @regression alta de cliente desde el modal y aparece en la lista', async ({
    page,
  }) => {
    const clientes = new ClientesPage(page);
    await clientes.ir();
    const nombre = unico('E2E Cliente SA');
    await clientes.crear({ razonSocial: nombre, cuit: '30-70999999-5' });
    await clientes.buscar(nombre);
    await expect(clientes.fila(nombre)).toBeVisible();
  });

  test('@regression la búsqueda filtra resultados', async ({ page }) => {
    const clientes = new ClientesPage(page);
    await clientes.ir();
    await clientes.buscar('zzz-inexistente-zzz');
    await expect(clientes.fila('zzz-inexistente-zzz')).toHaveCount(0);
  });

  test('el modal se puede cancelar sin crear nada', async ({ page }) => {
    const clientes = new ClientesPage(page);
    await clientes.ir();
    await clientes.nuevoCliente.click();
    await clientes.boton('Cancelar').click();
    await expect(page.getByRole('heading', { name: 'Nuevo Cliente' })).toBeHidden();
  });
});
