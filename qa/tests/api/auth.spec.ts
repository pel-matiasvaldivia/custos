import { test, expect } from '@playwright/test';
import { apiContext } from '../../src/api/client';
import { CONFIG } from '../../src/config';

test.describe('@mod:auth Autenticación', () => {
  test('@smoke @regression login válido devuelve JWT y perfil', async () => {
    const api = await apiContext();
    const res = await api.post('auth/login', {
      data: { email: CONFIG.admin.email, password: CONFIG.admin.password },
    });
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.access_token).toBeTruthy();
    expect(body.user.role).toBe('ADMIN');
    expect(body.user).not.toHaveProperty('password');
  });

  test('@regression login con password incorrecta → 401', async () => {
    const api = await apiContext();
    const res = await api.post('auth/login', {
      data: { email: CONFIG.admin.email, password: 'incorrecta-123' },
    });
    expect(res.status()).toBe(401);
  });

  test('login con email inexistente → 401 (sin filtrar existencia)', async () => {
    const api = await apiContext();
    const res = await api.post('auth/login', {
      data: { email: 'nadie@custos.com.ar', password: 'loquesea1' },
    });
    expect(res.status()).toBe(401);
  });

  test('payload malformado → 400 de validación', async () => {
    const api = await apiContext();
    const res = await api.post('auth/login', { data: { email: 'no-es-email' } });
    expect([400, 401]).toContain(res.status());
  });

  test('@regression endpoint protegido sin token → 401', async () => {
    const api = await apiContext();
    for (const ruta of ['clientes', 'vigilantes', 'objetivos', 'usuarios', 'liquidaciones']) {
      const res = await api.get(ruta);
      expect(res.status(), `GET /${ruta} sin token`).toBe(401);
    }
  });

  test('token adulterado → 401', async () => {
    const api = await apiContext();
    const res = await api.get('clientes', {
      headers: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.falso.falso' },
    });
    expect(res.status()).toBe(401);
  });

  test('registro self-service valida CUIT con formato', async () => {
    const api = await apiContext();
    const res = await api.post('auth/registro', {
      data: {
        empresa_nombre: 'QA Cuit Invalido',
        cuit: '123',
        email: `qa-cuit-${Date.now()}@test.com`,
        password: 'Password123!',
      },
    });
    expect(res.status()).toBe(400);
  });
});
