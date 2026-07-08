import { APIRequestContext, request } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { CONFIG } from '../config';

export type Rol = 'admin' | 'operador' | 'tenantB';

/** Lee los tokens que dejó el global.setup. */
export function tokens(): Record<Rol, string> {
  const p = path.join(__dirname, '..', '..', 'reports/.auth/tokens.json');
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

/** Contexto API autenticado con el rol pedido (o anónimo si no se pasa rol). */
export async function apiContext(rol?: Rol): Promise<APIRequestContext> {
  return request.newContext({
    baseURL: CONFIG.apiURL + '/',
    extraHTTPHeaders: rol ? { Authorization: `Bearer ${tokens()[rol]}` } : {},
  });
}

/** POST que espera 2xx y devuelve el JSON (falla con contexto útil si no). */
export async function crear<T = any>(
  api: APIRequestContext,
  ruta: string,
  data: unknown,
): Promise<T> {
  const res = await api.post(ruta, { data });
  if (!res.ok()) {
    throw new Error(`POST ${ruta} → ${res.status()}: ${await res.text()}`);
  }
  return res.json();
}
