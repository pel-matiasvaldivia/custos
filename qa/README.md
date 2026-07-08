# Plataforma QA — CustOS ERP

Plataforma completa de Quality Assurance del ERP de seguridad privada CustOS,
construida a partir del análisis del código del monorepo (API NestJS + Prisma
con RLS multi-tenant, frontend React/Vite, workers BullMQ, MinIO, sockets).

## Cómo correr

```bash
# 1. Stack arriba (Postgres 16 + Redis + MinIO + API :3000 + Web :5173)
#    con migraciones aplicadas y seed oficial (apps/api/prisma/seed.ts).
# 2. Desde qa/:
npx playwright test                 # toda la suite (api, e2e, a11y, visual, resiliencia)
npx playwright test --project=api   # solo API
npm run test:regression             # solo la regresión crítica (@regression)
npm run test:smoke                  # humo rápido (@smoke)
npm run coverage:funcional          # reporte de cobertura funcional por módulo
npm run report                      # abre el reporte HTML (videos + screenshots + traces)
npm run k6:smoke | k6:load | k6:stress   # carga y estrés (requiere k6)
```

Variables útiles: `QA_WEB_URL`, `QA_API_URL`, `QA_CHROMIUM_PATH` (usar el
Chromium preinstalado del contenedor), credenciales `QA_*` (ver `src/config.ts`).
En CI todo esto lo orquesta `.github/workflows/qa.yml`, que publica el reporte
HTML, videos, screenshots, `junit.xml` y la cobertura funcional como artefacto.

## Qué se descubrió del sistema (leyendo el código)

**Módulos funcionales** (37 controladores, 64 modelos Prisma): auth/registro
self-service, usuarios y RBAC, clientes, objetivos y puestos, vigiladores
(legajos, credenciales, PIN móvil, importación masiva), cotizador, contratos y
facturación, cuadrante (motor de tiempo: esquemas de turno, asignaciones,
turnos planificados, coberturas, relevos), novedades con adjuntos (MinIO),
liquidaciones y adelantos, compras, herramientas, flota, centro de operaciones
(incidentes SIA DC-09, video Hikvision/MediaMTX, mapa en vivo por sockets),
vigilancia móvil (asistencia, rondas QR/NFC, pánico, cola offline), reportes,
dashboard, suscripción (Mercado Pago) e integración ARCA (nómina/LSD + WSFEv1).

**Procesos críticos**: (1) cliente → objetivo → puesto → vigilador → esquema →
asignación → cuadrante generado → novedad → fin de asignación (cubierto E2E por
`tests/api/operacion-flujo.spec.ts`); (2) login multi-rol y aislamiento por
tenant; (3) asistencia/pánico móvil; (4) liquidación de horas (incl. nocturnas).

**Roles**: `SUPERADMIN` (global) y por tenant `ADMIN | GERENCIA | SUPERVISOR |
COMERCIAL | OPERADOR` (guard `roles.guard.ts` + decorador `@Roles`). El
aislamiento multi-tenant se implementa con RLS de Postgres (rol `custos_app`
sin BYPASSRLS) + extensión de scoping en `PrismaService`.

## Estructura

| Carpeta | Contenido |
|---|---|
| `src/pages/` | Page Objects (login, clientes, personal, cuadrante, etc.) |
| `src/api/` | Cliente API autenticado por rol (tokens del global-setup) |
| `tests/global.setup.ts` | Login admin, alta de usuario OPERADOR y de un 2º tenant |
| `tests/api/` | Contratos y negocio: auth, RBAC, aislamiento RLS, CRUD, flujo operativo, móvil, ARCA |
| `tests/e2e/` | Flujos de usuario con Page Objects (video siempre activado) |
| `tests/a11y/` | axe-core WCAG 2.1 A/AA con baseline de regresión |
| `tests/visual/` | Snapshots de zonas estables (baseline versionado) |
| `tests/resilience/` | Offline, API lenta, timeout, 500/401/403, JSON corrupto, doble click, multi-pestaña, refresh |
| `k6/` | `carga.js` (perfil realista) y `estres.js` (6 escenarios, hasta 2000 VUs) |
| `scripts/coverage-funcional.ts` | Cobertura funcional por módulo → `reports/cobertura-funcional.{md,html}` |

Convenciones: `@regression` marca la suite crítica de pre-despliegue, `@smoke`
el humo rápido, y `@mod:<modulo>` asigna cada test a un módulo del inventario
para la cobertura funcional.

## Bugs y hallazgos detectados por esta plataforma

| ID | Severidad | Hallazgo | Estado |
|---|---|---|---|
| QA-BUG-01 | ALTA | `ClientesPage` crashea con datos corruptos/shape inesperado de la API: `Cannot read properties of undefined (reading 'filter')` y `... of null (reading 'toLowerCase')`. Sin defensa en el render de la lista. | Rastreado con `test.fail()` en `tests/resilience/red-y-errores.spec.ts` |
| QA-BUG-02 | MEDIA | Deuda de accesibilidad en todas las páginas auditadas: `button-name` (botones de ícono sin nombre accesible), `color-contrast`, `label`/`select-name` (los `<label>` no están asociados a sus inputs — sin `htmlFor`). | Baseline en `tests/a11y/baseline.json`; el gate falla solo ante violaciones nuevas |
| QA-OBS-01 | INFO | `PUT /clientes/:id` (no PATCH); `GET /cuadrante/asignaciones` exige `objetivoId`; `GET /liquidaciones` exige `desde/hasta`; `GET /cuadrante/objetivos/:id` exige `desde/hasta` — contratos documentados por los tests de API. | Documentado |
| QA-OBS-02 | INFO | El rate-limit de login (`LOGIN_RATE_LIMIT_MAX`) funciona y bloquea con 429; los entornos de test deben elevarlo (hecho en `qa.yml`). | Documentado |

## Objetivo del programa

> **>90% de módulos funcionales con cobertura automatizada y 0 fallas en
> criticidad ALTA antes de cada despliegue.** El estado actual se mide con
> `npm run coverage:funcional` sobre la última corrida.
