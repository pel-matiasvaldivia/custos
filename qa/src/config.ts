/**
 * Configuración central de la plataforma QA.
 * Todo sale de env con defaults que matchean el stack local / CI:
 * - Web (Vite):  http://localhost:5173  (proxy /api → API)
 * - API (Nest):  http://localhost:3000/api/v1
 * Credenciales: las del seed oficial (apps/api/prisma/seed.ts).
 */
export const CONFIG = {
  webURL: process.env.QA_WEB_URL || 'http://localhost:5173',
  apiURL: process.env.QA_API_URL || 'http://localhost:3000/api/v1',

  admin: {
    email: process.env.QA_ADMIN_EMAIL || 'admin@custos.com.ar',
    password: process.env.QA_ADMIN_PASSWORD || 'admin123',
  },
  superadmin: {
    email: process.env.QA_SUPERADMIN_EMAIL || 'superadmin@custos.com.ar',
    password: process.env.QA_SUPERADMIN_PASSWORD || 'CustosSuperAdmin2026!',
  },
  /** Usuario de rol bajo que el global-setup crea vía API para probar RBAC. */
  operador: {
    email: process.env.QA_OPERADOR_EMAIL || 'qa.operador@custos.com.ar',
    password: process.env.QA_OPERADOR_PASSWORD || 'OperadorQA2026!',
  },
  /** Segundo tenant que el global-setup registra para probar aislamiento. */
  tenantB: {
    email: process.env.QA_TENANT_B_EMAIL || 'qa.tenantb@custos.com.ar',
    password: process.env.QA_TENANT_B_PASSWORD || 'TenantBQA2026!',
    empresa: 'QA Tenant B Seguridad SRL',
    cuit: '30-71111111-9',
  },
};

export const STORAGE = {
  admin: 'reports/.auth/admin.json',
  operador: 'reports/.auth/operador.json',
};

/** Sufijo único por corrida para no colisionar datos entre ejecuciones. */
export const RUN_ID = process.env.QA_RUN_ID || `${Date.now().toString(36)}`;
export const unico = (s: string) => `${s}-qa-${RUN_ID}`;
