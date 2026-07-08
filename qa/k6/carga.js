/**
 * Prueba de CARGA (perfil realista de oficina + SOC).
 *
 *   k6 run -e PROFILE=smoke qa/k6/carga.js   → humo (CI, 30s, 5 VUs)
 *   k6 run -e PROFILE=load  qa/k6/carga.js   → carga sostenida (100 VUs, 10 min)
 *
 * Mezcla descubierta del uso real del ERP:
 *  40% consultas de cuadrante/cobertura, 25% búsquedas, 15% listados de
 *  contratos, 10% novedades, 10% dashboard.
 */
import { sleep } from 'k6';
import { login, get } from './lib.js';

const PROFILES = {
  smoke: {
    vus: 5,
    duration: '30s',
    thresholds: {
      http_req_duration: ['p(95)<1500'],
      http_req_failed: ['rate<0.01'],
    },
  },
  load: {
    stages: [
      { duration: '2m', target: 50 },
      { duration: '6m', target: 100 },
      { duration: '2m', target: 0 },
    ],
    thresholds: {
      http_req_duration: ['p(95)<2000', 'p(99)<5000'],
      http_req_failed: ['rate<0.02'],
    },
  },
};

const perfil = PROFILES[__ENV.PROFILE || 'smoke'];
export const options = Object.assign({}, perfil);

export function setup() {
  return { token: login() };
}

export default function ({ token }) {
  const dado = Math.random();
  if (dado < 0.4) {
    get(token, 'cuadrante/esquemas', 'GET cuadrante');
  } else if (dado < 0.65) {
    get(token, `clientes?busqueda=se`, 'GET busqueda clientes');
    get(token, `vigilantes`, 'GET listado vigiladores');
  } else if (dado < 0.8) {
    get(token, 'contratos', 'GET contratos');
  } else if (dado < 0.9) {
    get(token, 'novedades', 'GET novedades');
  } else {
    get(token, 'dashboard/kpis', 'GET dashboard');
  }
  sleep(Math.random() * 2 + 0.5);
}
