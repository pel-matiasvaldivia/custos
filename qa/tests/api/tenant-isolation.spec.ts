import { test, expect } from '@playwright/test';
import { apiContext, crear } from '../../src/api/client';
import { unico } from '../../src/config';

/**
 * Aislamiento multi-tenant (RLS de Postgres + scoping de Prisma).
 * El tenant B no debe ver ni tocar datos del tenant A.
 */
test.describe('@mod:tenancy Aislamiento multi-tenant', () => {
  test('@regression cliente creado en tenant A es invisible para tenant B', async () => {
    const apiA = await apiContext('admin');
    const apiB = await apiContext('tenantB');

    const nombre = unico('Aislamiento SA');
    const cliente = await crear(apiA, 'clientes', { razon_social: nombre });
    expect(cliente.id).toBeTruthy();

    // Listado de B no lo contiene
    const listaB = await (await apiB.get('clientes?busqueda=' + encodeURIComponent(nombre))).json();
    const filasB = Array.isArray(listaB) ? listaB : (listaB.data ?? []);
    expect(filasB.find((c: any) => c.id === cliente.id)).toBeFalsy();

    // Acceso directo por id desde B → 404/403 (nunca 200)
    const directo = await apiB.get(`clientes/${cliente.id}`);
    expect([403, 404]).toContain(directo.status());

    // Update cross-tenant → rechazado
    const upd = await apiB.put(`clientes/${cliente.id}`, {
      data: { razon_social: 'HACKEADO' },
    });
    expect([403, 404]).toContain(upd.status());

    // Confirmar que A sigue viendo el dato intacto
    const desdeA = await (await apiA.get(`clientes/${cliente.id}`)).json();
    expect(desdeA.razon_social).toBe(nombre);
  });

  test('@regression vigiladores de A invisibles para B', async () => {
    const apiA = await apiContext('admin');
    const apiB = await apiContext('tenantB');
    const listaA = await (await apiA.get('vigilantes')).json();
    const vigsA = Array.isArray(listaA) ? listaA : (listaA.data ?? []);
    test.skip(vigsA.length === 0, 'tenant A sin vigiladores seed');

    const res = await apiB.get(`vigilantes/${vigsA[0].id}`);
    expect([403, 404]).toContain(res.status());
  });

  test('novedad de A inaccesible para B por id', async () => {
    const apiA = await apiContext('admin');
    const apiB = await apiContext('tenantB');
    const nov = await crear(apiA, 'novedades', {
      tipo: 'OBSERVACION',
      descripcion: unico('novedad aislamiento'),
    });
    const res = await apiB.get(`novedades/${nov.id}`);
    expect([403, 404]).toContain(res.status());
  });
});
