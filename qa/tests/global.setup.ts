import { test as setup, expect, request, APIRequestContext } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { CONFIG, STORAGE } from '../src/config';

/**
 * Setup global:
 * 1. Login por API con el admin del seed → guarda token para tests API y
 *    fabrica un storageState web (la app guarda el JWT en localStorage).
 * 2. Crea (idempotente) un usuario OPERADOR en el tenant A → matriz RBAC.
 * 3. Registra (idempotente) un segundo tenant → pruebas de aislamiento RLS.
 */

async function login(api: APIRequestContext, email: string, password: string) {
  const res = await api.post(`${CONFIG.apiURL}/auth/login`, { data: { email, password } });
  expect(res.ok(), `login de ${email} falló: ${res.status()}`).toBeTruthy();
  const body = await res.json();
  return { token: body.access_token as string, user: body.user };
}

function guardarEstadoWeb(archivo: string, token: string, user: unknown) {
  const origen = new URL(CONFIG.webURL).origin;
  const estado = {
    cookies: [],
    origins: [
      {
        origin: origen,
        localStorage: [
          { name: 'token', value: token },
          { name: 'user', value: JSON.stringify(user) },
        ],
      },
    ],
  };
  fs.mkdirSync(path.dirname(archivo), { recursive: true });
  fs.writeFileSync(archivo, JSON.stringify(estado, null, 2));
}

setup('autenticación y datos base', async () => {
  const api = await request.newContext();

  // 1. Admin (tenant A, seed oficial)
  const admin = await login(api, CONFIG.admin.email, CONFIG.admin.password);
  guardarEstadoWeb(path.join(__dirname, '..', STORAGE.admin), admin.token, admin.user);
  fs.writeFileSync(
    path.join(__dirname, '..', 'reports/.auth/tokens.json'),
    JSON.stringify({ admin: admin.token }, null, 2),
  );

  // 2. Usuario OPERADOR para la matriz de permisos (idempotente: 409/400 si ya existe)
  const resOp = await api.post(`${CONFIG.apiURL}/usuarios`, {
    headers: { Authorization: `Bearer ${admin.token}` },
    data: {
      nombre: 'QA Operador',
      email: CONFIG.operador.email,
      password: CONFIG.operador.password,
      role: 'OPERADOR',
    },
  });
  expect([200, 201, 400, 409]).toContain(resOp.status());
  const operador = await login(api, CONFIG.operador.email, CONFIG.operador.password);
  guardarEstadoWeb(path.join(__dirname, '..', STORAGE.operador), operador.token, operador.user);

  // 3. Segundo tenant para aislamiento multi-tenant (idempotente)
  const resReg = await api.post(`${CONFIG.apiURL}/auth/registro`, {
    data: {
      empresa_nombre: CONFIG.tenantB.empresa,
      cuit: CONFIG.tenantB.cuit,
      email: CONFIG.tenantB.email,
      password: CONFIG.tenantB.password,
    },
  });
  expect([200, 201, 400, 409]).toContain(resReg.status());
  const tenantB = await login(api, CONFIG.tenantB.email, CONFIG.tenantB.password);

  const tokens = {
    admin: admin.token,
    operador: operador.token,
    tenantB: tenantB.token,
  };
  fs.writeFileSync(
    path.join(__dirname, '..', 'reports/.auth/tokens.json'),
    JSON.stringify(tokens, null, 2),
  );

  await api.dispose();
});
