import { test, expect } from '@playwright/test';
import { apiContext } from '../../src/api/client';

test.describe('@mod:vigilancia-movil App móvil (API)', () => {
  test('@regression login móvil con credenciales inválidas → 401', async () => {
    const api = await apiContext();
    const res = await api.post('mobile/auth/login', {
      data: { legajo: 'NOEXISTE', pin: '0000' },
    });
    expect([400, 401]).toContain(res.status());
  });

  test('login por dispositivo con código de objetivo inexistente es rechazado', async () => {
    const api = await apiContext();
    const res = await api.post('mobile/auth/device', {
      data: { codigo: 'OBJ-0000-0000', pin: '0000' },
    });
    expect([400, 401, 404]).toContain(res.status());
  });

  test('@regression endpoints móviles sin token → 401', async () => {
    const api = await apiContext();
    for (const [metodo, ruta] of [
      ['get', 'mobile/turno-actual'],
      ['post', 'mobile/asistencia/checkin'],
      ['post', 'mobile/asistencia/checkout'],
      ['post', 'mobile/panico'],
      ['post', 'mobile/novedades'],
    ] as const) {
      const res =
        metodo === 'get' ? await api.get(ruta) : await api.post(ruta, { data: {} });
      expect([401, 403, 404], `${metodo.toUpperCase()} /${ruta}`).toContain(res.status());
      expect(res.status(), `${metodo.toUpperCase()} /${ruta} no debe aceptar anónimos`).not.toBe(
        200,
      );
    }
  });

  test('un usuario web no puede usar el token en endpoints que exigen identidad móvil', async () => {
    const api = await apiContext('admin');
    const res = await api.post('mobile/asistencia/checkin', { data: {} });
    expect(res.status()).not.toBe(500); // debe fallar controlado (400/401/403), no explotar
    expect([400, 401, 403, 404]).toContain(res.status());
  });
});

test.describe('@mod:arca-integration Integración ARCA (API)', () => {
  test('configuración ARCA responde sin filtrar cert/clave', async () => {
    const api = await apiContext('admin');
    const res = await api.get('arca-integration/configuracion');
    expect(res.status()).toBe(200);
    const body = await res.json();
    const texto = JSON.stringify(body);
    expect(texto).not.toContain('PRIVATE KEY');
    expect(texto).not.toMatch(/certificado_cifrado|clave_cifrada/);
  });

  test('probar conexión sin certificados configurados falla controlado', async () => {
    const api = await apiContext('admin');
    const res = await api.post('arca-integration/probar-conexion', { data: {} });
    expect([400, 404, 422]).toContain(res.status());
  });

  test('listado de facturas electrónicas responde 200', async () => {
    const api = await apiContext('admin');
    const res = await api.get('arca-integration/facturas');
    expect(res.status()).toBe(200);
  });

  test('exportar altas sin ids válidos falla controlado (no 500)', async () => {
    const api = await apiContext('admin');
    const res = await api.get('arca-integration/exportar-altas-txt?ids=');
    expect(res.status()).not.toBe(500);
  });
});
