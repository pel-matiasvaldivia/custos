import http from 'k6/http';
import { check } from 'k6';

export const API = __ENV.QA_API_URL || 'http://localhost:3000/api/v1';
export const ADMIN_EMAIL = __ENV.QA_ADMIN_EMAIL || 'admin@custos.com.ar';
export const ADMIN_PASSWORD = __ENV.QA_ADMIN_PASSWORD || 'admin123';

export function login(email = ADMIN_EMAIL, password = ADMIN_PASSWORD) {
  const res = http.post(`${API}/auth/login`, JSON.stringify({ email, password }), {
    headers: { 'Content-Type': 'application/json' },
    tags: { name: 'POST /auth/login' },
  });
  check(res, { 'login 201': (r) => r.status === 201 });
  return res.json('access_token');
}

export function auth(token) {
  return {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  };
}

export function get(token, ruta, nombre) {
  const res = http.get(`${API}/${ruta}`, Object.assign({ tags: { name: nombre || `GET /${ruta}` } }, auth(token)));
  check(res, { [`${nombre || ruta} 200`]: (r) => r.status === 200 });
  return res;
}

export function post(token, ruta, body, nombre) {
  const res = http.post(
    `${API}/${ruta}`,
    JSON.stringify(body),
    Object.assign({ tags: { name: nombre || `POST /${ruta}` } }, auth(token)),
  );
  check(res, { [`${nombre || ruta} 2xx`]: (r) => r.status >= 200 && r.status < 300 });
  return res;
}
