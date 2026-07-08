import http from 'k6/http';
import { check, sleep } from 'k6';

const BACKEND_URL = 'http://localhost:3000';

export const options = {
  stages: [
    { duration: '30s', target: 50 },  // Ramp-up to 50 virtual users
    { duration: '1m', target: 100 },  // Peak stress load at 100 VUs
    { duration: '30s', target: 0 },   // Ramp-down to 0
  ],
  thresholds: {
    http_req_failed: ['rate<0.05'],    // less than 5% errors
    http_req_duration: ['p(95)<1500'], // 95% of requests must complete under 1.5s
  },
};

export default function () {
  // Step 1: Login
  const loginHeaders = { 'Content-Type': 'application/json' };
  const loginPayload = JSON.stringify({
    email: 'admin@custos.com.ar',
    password: 'admin123',
  });
  
  const loginRes = http.post(`${BACKEND_URL}/auth/login`, loginPayload, { headers: loginHeaders });
  
  const loginOk = check(loginRes, {
    'login status is 201/200': (r) => r.status === 200 || r.status === 201,
    'has access token': (r) => JSON.parse(r.body).access_token !== undefined,
  });

  if (!loginOk) {
    sleep(1);
    return;
  }

  const token = JSON.parse(loginRes.body).access_token;
  const authHeaders = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  // Step 2: Create a random client
  const clientPayload = JSON.stringify({
    razon_social: `Stress Test Client ${__VU}-${__ITER}`,
    nombre_fantasia: 'Stress Corp',
    cuit: `30-${Math.floor(10000000 + Math.random() * 90000000)}-9`,
    domicilio: 'Corrientes 1234',
    contacto_nombre: 'Stress Agent',
    contacto_email: `stress-${__VU}@example.com`,
  });

  const createClientRes = http.post(`${BACKEND_URL}/clientes`, clientPayload, { headers: authHeaders });
  
  check(createClientRes, {
    'create client status is 201': (r) => r.status === 201,
  });

  // Step 3: Query Quadrant (fetch asignaciones/puestos)
  const getPuestosRes = http.get(`${BACKEND_URL}/clientes`, { headers: authHeaders });
  check(getPuestosRes, {
    'query clients list status is 200': (r) => r.status === 200,
  });

  // Step 4: Perform search query
  const searchRes = http.get(`${BACKEND_URL}/clientes?busqueda=Stress`, { headers: authHeaders });
  check(searchRes, {
    'search query status is 200': (r) => r.status === 200,
  });

  // Step 5: Assign guards / vigiladores details
  const getGuardsRes = http.get(`${BACKEND_URL}/vigilantes`, { headers: authHeaders });
  check(getGuardsRes, {
    'get vigiladores status is 200': (r) => r.status === 200,
  });

  // Step 6: Query contracts
  const getContractsRes = http.get(`${BACKEND_URL}/contratos`, { headers: authHeaders });
  check(getContractsRes, {
    'get contracts status is 200': (r) => r.status === 200 || r.status === 404, // 404 might be expected if no contracts setup
  });

  sleep(1);
}
