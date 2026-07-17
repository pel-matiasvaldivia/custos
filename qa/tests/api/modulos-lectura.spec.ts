import { test, expect } from '@playwright/test';
import { apiContext } from '../../src/api/client';

/**
 * Smoke de lectura por módulo: cada endpoint de listado debe responder 200
 * con el ADMIN del tenant. Cubre la superficie funcional completa que la UI
 * consume; una regresión acá rompe la página correspondiente.
 */
const ENDPOINTS: Array<[modulo: string, ruta: string]> = [
  ['clientes', 'clientes'],
  ['objetivos', 'objetivos'],
  ['personal', 'vigilantes'],
  ['cotizaciones', 'cotizaciones'],
  ['contratos', 'contratos'],
  ['novedades', 'novedades'],
  ['cuadrante', 'cuadrante/esquemas'],
  ['liquidaciones', 'liquidaciones?desde=2026-07-01&hasta=2026-07-31'],
  ['compras', 'compras/ordenes'],
  ['herramientas', 'herramientas'],
  ['flota', 'vehiculos'],
  ['dashboard', 'dashboard/kpis'],
  ['centro-operaciones', 'centro-operaciones/incidentes/activos'],
  ['centro-operaciones', 'centro-operaciones/incidentes/cerrados'],
  ['reportes', 'centro-operaciones/informes/estadisticas'],
  ['auth', 'usuarios'],
  ['suscripcion', 'suscripcion/estado'],
  ['liquidaciones', 'liquidaciones/config'],
  ['dashboard', 'dashboard/onboarding'],
];

test.describe('Lecturas por módulo', () => {
  for (const [modulo, ruta] of ENDPOINTS) {
    test(`@smoke @mod:${modulo} GET /${ruta} responde 200`, async () => {
      const api = await apiContext('admin');
      const res = await api.get(ruta);
      expect(res.status(), `GET /${ruta} → ${res.status()}`).toBe(200);
    });
  }
});
