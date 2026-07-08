import { test, expect } from '@playwright/test';
import { apiContext, crear } from '../../src/api/client';
import { unico } from '../../src/config';

test.describe('@mod:clientes Clientes (comercial)', () => {
  test('@smoke @regression CRUD completo de cliente', async () => {
    const api = await apiContext('admin');
    const nombre = unico('CRUD Cliente SA');

    const creado = await crear(api, 'clientes', {
      razon_social: nombre,
      cuit: '30-70000001-1',
      contacto_email: 'contacto@cliente.com',
    });
    expect(creado.razon_social).toBe(nombre);

    const leido = await (await api.get(`clientes/${creado.id}`)).json();
    expect(leido.id).toBe(creado.id);

    const upd = await api.put(`clientes/${creado.id}`, {
      data: { localidad: 'Rosario' },
    });
    expect(upd.ok()).toBeTruthy();
    expect((await upd.json()).localidad).toBe('Rosario');

    const del = await api.delete(`clientes/${creado.id}`);
    expect([200, 204]).toContain(del.status());
  });

  test('@regression búsqueda por razón social encuentra al cliente', async () => {
    const api = await apiContext('admin');
    const nombre = unico('Busqueda Exacta SRL');
    await crear(api, 'clientes', { razon_social: nombre });
    const res = await api.get('clientes?busqueda=' + encodeURIComponent(nombre));
    const body = await res.json();
    const filas = Array.isArray(body) ? body : (body.data ?? []);
    expect(filas.some((c: any) => c.razon_social === nombre)).toBeTruthy();
  });

  test('validación: cliente sin razón social → 400', async () => {
    const api = await apiContext('admin');
    const res = await api.post('clientes', { data: { cuit: '30-1-1' } });
    expect(res.status()).toBe(400);
  });

  test('validación: email de contacto inválido → 400', async () => {
    const api = await apiContext('admin');
    const res = await api.post('clientes', {
      data: { razon_social: unico('Email Malo'), contacto_email: 'no-es-email' },
    });
    expect(res.status()).toBe(400);
  });
});
