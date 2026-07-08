import { test, expect } from '@playwright/test';
import { apiContext } from '../../src/api/client';

/**
 * Matriz RBAC descubierta en los controladores (@Roles):
 * roles de tenant: ADMIN | GERENCIA | SUPERVISOR | COMERCIAL | OPERADOR.
 * El OPERADOR es el rol más restringido → probamos que los endpoints
 * administrativos lo rechacen con 403.
 */
test.describe('@mod:auth Permisos por rol (RBAC)', () => {
  test('@regression OPERADOR no puede administrar usuarios → 403', async () => {
    const api = await apiContext('operador');
    const crear = await api.post('usuarios', {
      data: { email: 'x@x.com', password: 'password123', role: 'ADMIN' },
    });
    expect(crear.status()).toBe(403);
  });

  test('@regression OPERADOR no puede crear esquemas de cuadrante → 403', async () => {
    const api = await apiContext('operador');
    const res = await api.post('cuadrante/esquemas', { data: {} });
    expect(res.status()).toBe(403);
  });

  test('OPERADOR no puede generar el mes del cuadrante → 403', async () => {
    const api = await apiContext('operador');
    const res = await api.post('cuadrante/generar-mes', { data: { anio: 2026, mes: 7 } });
    expect(res.status()).toBe(403);
  });

  test('@regression usuario de tenant no accede a endpoints SUPERADMIN → 403', async () => {
    const api = await apiContext('admin');
    const res = await api.get('auth/tenants');
    expect(res.status()).toBe(403);
  });

  test('OPERADOR sí puede consultar el cuadrante por objetivo (rol permitido)', async () => {
    const api = await apiContext('operador');
    // objetivoId es obligatorio; con un UUID ajeno debe responder 200 vacío (no 403)
    const res = await api.get(
      'cuadrante/asignaciones?objetivoId=00000000-0000-4000-8000-000000000000',
    );
    expect(res.status()).toBe(200);
  });

  test('ADMIN puede listar usuarios de su tenant', async () => {
    const api = await apiContext('admin');
    const res = await api.get('usuarios');
    expect(res.status()).toBe(200);
    const usuarios = await res.json();
    const lista = Array.isArray(usuarios) ? usuarios : usuarios.data;
    expect(Array.isArray(lista)).toBeTruthy();
  });
});
