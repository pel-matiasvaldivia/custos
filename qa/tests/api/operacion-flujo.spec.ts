import { test, expect, APIRequestContext } from '@playwright/test';
import { apiContext, crear } from '../../src/api/client';
import { unico } from '../../src/config';

/**
 * Proceso crítico de negocio end-to-end (capa API):
 * cliente → objetivo → puesto → vigilador → esquema de turnos →
 * asignación → generación del cuadrante → consulta de cobertura.
 * Es el corazón operativo del ERP: si esto se rompe, no hay servicio.
 */
test.describe('@mod:cuadrante Flujo operativo completo', () => {
  test.describe.configure({ mode: 'serial' });

  let api: APIRequestContext;
  const ids: Record<string, string> = {};

  test.beforeAll(async () => {
    api = await apiContext('admin');
  });

  test('@regression 1. alta de cliente', async () => {
    const c = await crear(api, 'clientes', { razon_social: unico('Flujo Operativo SA') });
    ids.cliente = c.id;
    expect(c.id).toBeTruthy();
  });

  test('@regression 2. alta de objetivo vinculado al cliente', async () => {
    const o = await crear(api, 'objetivos', {
      cliente_id: ids.cliente,
      nombre: unico('Planta Industrial'),
      direccion: 'Ruta 9 km 42',
      lat: -34.6,
      lng: -58.4,
    });
    ids.objetivo = o.id;
    expect(o.codigo || o.id).toBeTruthy();
  });

  test('@regression 3. alta de puesto en el objetivo', async () => {
    const p = await crear(api, 'puestos', {
      objetivo_id: ids.objetivo,
      nombre: unico('Puesto Principal'),
    });
    ids.puesto = p.id;
  });

  test('@regression 4. alta de vigilador', async () => {
    const nro = `${Date.now()}`.slice(-6);
    const v = await crear(api, 'vigilantes', {
      legajo_nro: `QA-${nro}`,
      nombre: 'Juan',
      apellido: unico('Perez'),
      documento: `9${nro}0`,
      cuil: `209${nro}09`.padEnd(11, '0').slice(0, 11),
    });
    ids.vigilador = v.id;
  });

  test('@regression 5. crear esquema de turnos 4x2 (12h)', async () => {
    const dias = [
      ...Array.from({ length: 4 }, () => ({
        tipo: 'TRABAJO',
        bloques: [{ hora_inicio: '08:00', duracion_horas: 12 }],
      })),
      { tipo: 'FRANCO' },
      { tipo: 'FRANCO' },
    ];
    const e = await crear(api, 'cuadrante/esquemas', {
      nombre: unico('4x2 Diurno'),
      dias_ciclo: 6,
      dias,
    });
    ids.esquema = e.id;
  });

  test('@regression 6. asignar vigilador al puesto con el esquema', async () => {
    const hoy = new Date().toISOString().slice(0, 10);
    const a = await crear(api, 'cuadrante/asignaciones', {
      puesto_id: ids.puesto,
      vigilador_id: ids.vigilador,
      esquema_id: ids.esquema,
      fecha_ancla: hoy,
      vigente_desde: hoy,
    });
    ids.asignacion = a.id ?? a.asignacion?.id;
    expect(ids.asignacion).toBeTruthy();
  });

  test('@regression 7. el cuadrante del objetivo muestra turnos planificados', async () => {
    const hoy = new Date();
    const desde = new Date(hoy.getTime() - 86400000).toISOString().slice(0, 10);
    const hasta = new Date(hoy.getTime() + 15 * 86400000).toISOString().slice(0, 10);
    const res = await api.get(`cuadrante/objetivos/${ids.objetivo}?desde=${desde}&hasta=${hasta}`);
    expect(res.ok(), await res.text()).toBeTruthy();
    const body = await res.json();
    const turnos = body.turnos ?? body.dias ?? body;
    expect(JSON.stringify(turnos)).toContain(ids.vigilador);
  });

  test('8. cobertura del puesto responde', async () => {
    const res = await api.get(`cuadrante/puestos/${ids.puesto}/cobertura`);
    expect(res.ok(), await res.text()).toBeTruthy();
  });

  test('9. registrar novedad sobre el puesto', async () => {
    const n = await crear(api, 'novedades', {
      puesto_id: ids.puesto,
      vigilador_id: ids.vigilador,
      tipo: 'OBSERVACION',
      prioridad: 'NORMAL',
      descripcion: unico('Novedad del flujo operativo'),
    });
    expect(n.id).toBeTruthy();
  });

  test('10. finalizar la asignación cierra el ciclo', async () => {
    const res = await api.post(`cuadrante/asignaciones/${ids.asignacion}/finalizar`, {
      data: { vigente_hasta: new Date().toISOString().slice(0, 10) },
    });
    expect([200, 201], await res.text()).toContain(res.status());
  });
});
