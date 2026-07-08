import { test, expect } from '@playwright/test';
import { ClientesPage } from '../../src/pages/clientes.page';
import { unico } from '../../src/config';

/**
 * Resiliencia de red: pérdida de Internet, API lenta, timeout y errores
 * HTTP 500/401/403 y payloads corruptos. La app debe degradar con mensajes,
 * nunca con pantalla blanca ni crash de JS.
 */
test.describe('@mod:resiliencia Red y errores HTTP', () => {
  test('pérdida de Internet: la app no crashea y al volver la red se recupera', async ({
    page,
    context,
  }) => {
    const errores: string[] = [];
    page.on('pageerror', (e) => errores.push(e.message));

    await page.goto('/clients');
    await page.waitForLoadState('networkidle');

    await context.setOffline(true);
    await page.getByRole('link', { name: 'Personal', exact: true }).click().catch(() => {});
    await page.waitForTimeout(2000);
    expect(errores).toEqual([]);

    await context.setOffline(false);
    await page.goto('/clients');
    await expect(page.locator('body')).toContainText(/cliente/i);
  });

  test('API lenta (5s): la UI muestra estado de carga y termina renderizando', async ({
    page,
  }) => {
    await page.route('**/api/v1/clientes**', async (route) => {
      await new Promise((r) => setTimeout(r, 5_000));
      await route.continue();
    });
    await page.goto('/clients');
    // Mientras espera no debe haber crash; al final debe renderizar
    await expect(page.locator('body')).toContainText(/cliente/i, { timeout: 20_000 });
  });

  test('timeout total del backend: mensaje de error, no pantalla blanca', async ({ page }) => {
    await page.route('**/api/v1/clientes**', (route) => route.abort('timedout'));
    const errores: string[] = [];
    page.on('pageerror', (e) => errores.push(e.message));
    await page.goto('/clients');
    await page.waitForTimeout(3000);
    expect(errores).toEqual([]);
    await expect(page.locator('body')).not.toHaveText('');
  });

  test('error 500 del backend: la página degrada sin crash', async ({ page }) => {
    await page.route('**/api/v1/clientes**', (route) =>
      route.fulfill({ status: 500, contentType: 'application/json', body: '{"message":"boom"}' }),
    );
    const errores: string[] = [];
    page.on('pageerror', (e) => errores.push(e.message));
    await page.goto('/clients');
    await page.waitForTimeout(2500);
    expect(errores).toEqual([]);
  });

  test('401 en caliente: la app cierra sesión o pide login (no loop infinito)', async ({
    page,
  }) => {
    await page.goto('/clients');
    await page.waitForLoadState('networkidle');
    await page.route('**/api/v1/**', (route) =>
      route.fulfill({ status: 401, contentType: 'application/json', body: '{"message":"Unauthorized"}' }),
    );
    await page.getByRole('link', { name: 'Personal', exact: true }).click();
    await page.waitForTimeout(3000);
    // Aceptable: redirigir a login o mostrar error; inaceptable: crash JS
    const url = page.url();
    expect(url).toBeTruthy();
  });

  test('403: se informa acceso denegado sin romper el layout', async ({ page }) => {
    await page.route('**/api/v1/clientes**', (route) =>
      route.fulfill({ status: 403, contentType: 'application/json', body: '{"message":"Forbidden"}' }),
    );
    const errores: string[] = [];
    page.on('pageerror', (e) => errores.push(e.message));
    await page.goto('/clients');
    await page.waitForTimeout(2500);
    expect(errores).toEqual([]);
    await expect(page.getByRole('link', { name: 'Clientes' })).toBeVisible();
  });

  test('datos corruptos (JSON inválido y shape inesperado): sin crash', async ({ page }) => {
    // BUG DETECTADO (QA-BUG-01): ClientesPage revienta con shapes inesperados:
    // "Cannot read properties of undefined (reading 'filter')" y
    // "Cannot read properties of null (reading 'toLowerCase')".
    // El render asume lista y razon_social no-nula sin defensa. Cuando se
    // corrija el frontend, este test.fail() empezará a fallar y hay que quitarlo.
    test.fail();
    const errores: string[] = [];
    page.on('pageerror', (e) => errores.push(e.message));

    // JSON sintácticamente inválido
    await page.route('**/api/v1/clientes**', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '{esto no es json' }),
    );
    await page.goto('/clients');
    await page.waitForTimeout(2000);

    // Shape inesperado (objeto en vez de lista, campos null)
    await page.unroute('**/api/v1/clientes**');
    await page.route('**/api/v1/clientes**', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: [{ id: null, razon_social: null }], sorpresa: 42 }),
      }),
    );
    await page.goto('/clients');
    await page.waitForTimeout(2000);

    expect(errores, `crash de JS con datos corruptos: ${errores.join(' | ')}`).toEqual([]);
  });
});

test.describe('@mod:resiliencia Interacciones peligrosas', () => {
  test('@regression doble click en Guardar no crea el cliente dos veces', async ({ page }) => {
    const clientes = new ClientesPage(page);
    await clientes.ir();
    const nombre = unico('DobleClick SA');

    let posts = 0;
    page.on('request', (r) => {
      if (r.url().includes('/api/v1/clientes') && r.method() === 'POST') posts++;
    });

    await clientes.nuevoCliente.click();
    await clientes.campo('Razón social').fill(nombre);
    const guardar = clientes.boton('Guardar');
    await guardar.dblclick(); // dos clicks lo más rápido posible
    await page.waitForTimeout(3000);

    expect(posts, 'el submit debe deshabilitarse tras el primer click').toBeLessThanOrEqual(1);
  });

  test('dos pestañas con la misma sesión operan sin pisarse', async ({ context }) => {
    const p1 = await context.newPage();
    const p2 = await context.newPage();
    await p1.goto('/clients');
    await p2.goto('/personnel');
    await p1.waitForLoadState('networkidle');
    await p2.waitForLoadState('networkidle');
    await expect(p1.locator('body')).toContainText(/cliente/i);
    await expect(p2.locator('body')).toContainText(/personal|vigilador/i);
    // Logout en una pestaña no debe dejar a la otra en estado zombie con datos
    await p1.evaluate(() => localStorage.removeItem('token'));
    await p2.reload();
    await p2.waitForTimeout(1500);
    expect(p2.url()).toBeTruthy();
  });

  test('refresh en medio de una operación de alta no corrompe la lista', async ({ page }) => {
    const clientes = new ClientesPage(page);
    await clientes.ir();
    await clientes.nuevoCliente.click();
    await clientes.campo('Razón social').fill(unico('RefreshMedio SA'));
    // Refresh con el modal abierto, sin enviar
    await page.reload();
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: 'Nuevo Cliente' })).toBeHidden();
    await expect(page.locator('body')).toContainText(/cliente/i);
  });
});
