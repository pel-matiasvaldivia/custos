/**
 * Prueba de ESTRÉS: miles de usuarios virtuales ejecutando los procesos
 * críticos del ERP en simultáneo, con rampa hasta el punto de quiebre.
 *
 *   k6 run -e PROFILE=stress qa/k6/estres.js          → rampa a 2000 VUs
 *   k6 run -e PROFILE=stress -e MAX_VUS=500 ...       → tope configurable
 *
 * Escenarios simultáneos (pedidos por negocio):
 *  - logins            oleadas de inicio de sesión
 *  - crear_clientes    altas comerciales concurrentes
 *  - cuadrantes        consulta masiva de cuadrantes/cobertura
 *  - asignaciones      asignación de vigiladores a puestos
 *  - contratos         consulta de contratos
 *  - busquedas         búsquedas de texto en clientes/personal
 */
import { sleep } from 'k6';
import { login, get, post } from './lib.js';

const MAX = Number(__ENV.MAX_VUS || 2000);
const rampa = (peso) => [
  { duration: '1m', target: Math.ceil(MAX * peso * 0.25) },
  { duration: '3m', target: Math.ceil(MAX * peso) },
  { duration: '2m', target: Math.ceil(MAX * peso) },
  { duration: '1m', target: 0 },
];

export const options = {
  scenarios: {
    logins: {
      executor: 'ramping-vus',
      exec: 'escenarioLogin',
      stages: rampa(0.2),
    },
    crear_clientes: {
      executor: 'ramping-vus',
      exec: 'escenarioCrearCliente',
      stages: rampa(0.1),
    },
    cuadrantes: {
      executor: 'ramping-vus',
      exec: 'escenarioCuadrante',
      stages: rampa(0.3),
    },
    asignaciones: {
      executor: 'ramping-vus',
      exec: 'escenarioAsignacion',
      stages: rampa(0.1),
    },
    contratos: {
      executor: 'ramping-vus',
      exec: 'escenarioContratos',
      stages: rampa(0.1),
    },
    busquedas: {
      executor: 'ramping-vus',
      exec: 'escenarioBusquedas',
      stages: rampa(0.2),
    },
  },
  thresholds: {
    // En estrés se tolera degradación, pero no colapso:
    http_req_failed: ['rate<0.10'],
    'http_req_duration{name:POST /auth/login}': ['p(95)<4000'],
    'http_req_duration{name:GET cuadrante}': ['p(95)<4000'],
  },
};

export function setup() {
  const token = login();
  // Datos base para el escenario de asignación (esquema + puesto + vigilador)
  const hoy = new Date().toISOString().slice(0, 10);
  const suf = Date.now().toString(36);
  const cliente = post(token, 'clientes', { razon_social: `k6 Estres ${suf}` }).json();
  const objetivo = post(token, 'objetivos', { cliente_id: cliente.id, nombre: `k6 Objetivo ${suf}` }).json();
  const puesto = post(token, 'puestos', { objetivo_id: objetivo.id, nombre: `k6 Puesto ${suf}` }).json();
  const esquema = post(token, 'cuadrante/esquemas', {
    nombre: `k6 4x2 ${suf}`,
    dias_ciclo: 6,
    dias: [
      { tipo: 'TRABAJO', bloques: [{ hora_inicio: '08:00', duracion_horas: 12 }] },
      { tipo: 'TRABAJO', bloques: [{ hora_inicio: '08:00', duracion_horas: 12 }] },
      { tipo: 'TRABAJO', bloques: [{ hora_inicio: '08:00', duracion_horas: 12 }] },
      { tipo: 'TRABAJO', bloques: [{ hora_inicio: '08:00', duracion_horas: 12 }] },
      { tipo: 'FRANCO' },
      { tipo: 'FRANCO' },
    ],
  }).json();
  return { token, hoy, puestoId: puesto.id, esquemaId: esquema.id, objetivoId: objetivo.id };
}

export function escenarioLogin() {
  login();
  sleep(Math.random() * 3 + 1);
}

export function escenarioCrearCliente(data) {
  post(
    data.token,
    'clientes',
    { razon_social: `k6 Cliente ${__VU}-${__ITER}-${Date.now().toString(36)}` },
    'POST clientes',
  );
  sleep(Math.random() * 2 + 1);
}

export function escenarioCuadrante(data) {
  get(data.token, `cuadrante/asignaciones?objetivoId=${data.objetivoId}`, 'GET cuadrante');
  get(
    data.token,
    `cuadrante/objetivos/${data.objetivoId}?desde=${data.hoy}&hasta=${data.hoy}`,
    'GET cuadrante objetivo',
  );
  sleep(Math.random() * 2 + 0.5);
}

export function escenarioAsignacion(data) {
  // Alta de vigilador + asignación al puesto (proceso operativo completo)
  const suf = `${__VU}${__ITER}${Date.now() % 100000}`;
  const legajo = `K6${suf}`.slice(0, 12);
  const res = post(
    data.token,
    'vigilantes',
    {
      legajo_nro: legajo,
      nombre: 'Carga',
      apellido: `K6 ${suf}`,
      documento: `${(Number(suf) % 90000000) + 10000000}`,
      cuil: `20${(Number(suf) % 90000000) + 10000000}9`,
    },
    'POST vigilantes',
  );
  if (res.status < 300) {
    post(
      data.token,
      'cuadrante/asignaciones',
      {
        puesto_id: data.puestoId,
        vigilador_id: res.json('id'),
        esquema_id: data.esquemaId,
        fecha_ancla: data.hoy,
        vigente_desde: data.hoy,
      },
      'POST asignaciones',
    );
  }
  sleep(Math.random() * 3 + 1);
}

export function escenarioContratos(data) {
  get(data.token, 'contratos', 'GET contratos');
  sleep(Math.random() * 2 + 0.5);
}

export function escenarioBusquedas(data) {
  const letras = 'aeiourstln';
  const q = letras[Math.floor(Math.random() * letras.length)] + letras[Math.floor(Math.random() * letras.length)];
  get(data.token, `clientes?busqueda=${q}`, 'GET busqueda clientes');
  get(data.token, `vigilantes`, 'GET listado vigiladores');
  sleep(Math.random() * 1.5 + 0.5);
}
