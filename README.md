# CustOS — ERP para empresas de seguridad privada

CustOS es un ERP SaaS multi-tenant para empresas argentinas de seguridad física y electrónica. Conecta cuadrante de turnos, personal, clientes/objetivos, cotización y contratos, centro de operaciones (monitoreo en vivo) y la app móvil del vigilador (CustOS GO) en un solo sistema.

Este documento es la puerta de entrada técnica al repo. Para la guía de uso de cada módulo (qué hace, cómo se opera desde la web y desde la app), ver **[MANUAL_DE_USO.md](./MANUAL_DE_USO.md)**.

## Stack

| Capa | Tecnología |
|---|---|
| Backend | NestJS + Prisma + PostgreSQL (Row-Level Security por `tenant_id`) |
| Frontend | React + Vite + TypeScript + Tailwind |
| Colas / jobs | BullMQ + Redis |
| Storage de archivos | MinIO (S3-compatible) |
| Tiempo real | Socket.IO (Centro de Operaciones, tracking del móvil) |
| App del vigilador | PWA instalable (`apps/web`, rutas `/mobile/*`), Capacitor listo para Android/iOS |
| Video | MediaMTX (streams RTSP/HLS de cámaras) |
| Infra | Docker Compose (`infra/docker-compose.yml`), detrás de Nginx Proxy Manager en producción |

## Estructura del repo

```
apps/
  api/            NestJS. Un módulo por dominio en src/ y src/modules/.
    prisma/
      schema.prisma       Modelo de datos completo
      migrations/         Migraciones SQL versionadas (nombradas por fecha)
  web/            React + Vite. Una carpeta por módulo en src/pages/.
    src/
      pages/               Páginas por módulo (ver mapa abajo)
      services/            Clientes HTTP tipados, uno por dominio
      components/          Componentes compartidos (layout, mapas, wizard)
      offline/             Cola de sincronización offline de la app móvil
infra/
  docker-compose.yml       Stack completo: api, web, postgres, redis, minio, mediamtx
  .env.example             Variables de entorno requeridas
packages/                  Paquetes compartidos (si aplica)
```

Documentos de especificación original (contrato de diseño, no reflejan necesariamente el 100% de lo implementado — para eso está `MANUAL_DE_USO.md`):
`PROMPT_ARQUITECTONICO_ERP_SEGURIDAD.md`, `MODELO_MOTOR_DE_TIEMPO_Y_CUADRANTE.md`, `MODELOS_M2_A_M6_Y_PLATAFORMA.md`, `PROMPT_M7_CENTRO_DE_OPERACIONES.md`, `PROMPT_UX_ONBOARDING_GUIADO.md`, `PROCESO_VENTA_A_COBRANZA.md` (camino crítico venta→cobranza, con estado real vs código).

## Multi-tenancy y seguridad

- **Aislamiento por tenant**: cada tabla con `tenant_id` tiene una política RLS (`tenant_isolation`) que filtra automáticamente por `current_setting('app.current_tenant')`. `PrismaService` fija ese setting en cada request a partir del JWT (`TenantMiddleware`); sin contexto de tenant, las queries no ven nada (fail-closed).
- **`PrismaAdminService`** hace *bypass* de RLS para operaciones legítimamente cross-tenant (login pre-auth, jobs de fan-out, receptor SIA) — cada uso fija `tenant_id` explícitamente a mano.
- **Dos JWT distintos**: el de oficina (`{ tenant_id, userId, role }`, guard `JwtAuthGuard`) y el de la app del vigilador (`{ tenantId, vigiladorId | objetivoId, tipo }`, guard `VigiladorJwtGuard`, estrategia `jwt-vigilador`). No comparten sesión ni almacenamiento en el navegador.
- **Rate limiting por usuario** (no por IP): pensado para operar detrás de un único NAT/proxy público (celulares de guardias + tracking GPS + oficina compartiendo la misma IP saliente). Ver `apps/api/src/main.ts`.

## Cómo correr el proyecto

### Con Docker (recomendado, replica producción)

```bash
cd infra
cp .env.example .env   # completar secretos
docker compose up -d
```

Al arrancar, el contenedor `api` corre `prisma migrate deploy` (aplica migraciones pendientes) y el build corre `prisma generate`. El `web` sirve el build de Vite detrás de nginx, con proxy a `/api` y `/socket.io/`.

### En desarrollo (sin Docker)

```bash
npm install                      # instala todos los workspaces
npm run dev                      # corre api + web en paralelo (npm workspaces)
```

Requiere Postgres y Redis corriendo localmente (o apuntar `DATABASE_URL`/`REDIS_URL` a instancias externas) y las variables de `infra/.env.example` en `apps/api/.env`.

### Migraciones

```bash
cd apps/api
npx prisma migrate dev --name nombre_descriptivo   # crea + aplica en dev
npx prisma generate                                 # regenera el cliente tras cambiar schema.prisma
```

Las migraciones de este repo son **SQL manual** (no autogenerado por `prisma migrate dev` en la mayoría de los casos recientes), con el patrón `IF NOT EXISTS` + habilitación de RLS al final de cada archivo que crea tablas nuevas. Ver cualquier migración en `apps/api/prisma/migrations/` como plantilla.

### Verificación antes de commitear

```bash
# Backend
cd apps/api && npm run lint && npx tsc --noEmit && npm test

# Frontend
cd apps/web && npm run lint && npx tsc --noEmit && npm run build
```

> Nota para desarrollo en sandbox sin acceso a red: `npx prisma generate` puede fallar si no puede descargar el engine binario. Los errores de `tsc` que mencionan modelos/campos que sí existen en `schema.prisma` (p. ej. `Property 'X' does not exist on type 'PrismaService'`) son casi siempre cliente Prisma desactualizado, no un bug real — compara el conteo de errores contra el mismo comando en la rama base antes de asumir que el cambio los introdujo. En CI y en el Dockerfile, `prisma generate` corre con red disponible.

## Mapa de módulos (código ↔ producto)

| Módulo en el producto | Frontend (`apps/web/src/pages/`) | Backend (`apps/api/src/` o `src/modules/`) |
|---|---|---|
| Dashboard | `dashboard/` | `dashboard/` |
| Cotizaciones | `quoting/` | `cotizacion/`, `costos/` |
| Clientes | `clients/` | `cliente/` |
| Objetivos (sedes del cliente, puestos, geo, rondas, dispositivo) | `objectives/` | `objetivo/`, `puesto/`, `ronda/` |
| Cuadrante (esquemas de turno, afectación, cobertura) | `quadrant/` | `modules/cuadrante/` |
| Personal (legajos, credenciales, herramientas) | `personnel/` | `vigilante/`, `credencial/`, `herramienta/` |
| Novedades | `novedades/` | `novedad/` |
| Liquidaciones | `liquidaciones/` | `modules/liquidaciones/` |
| Compras | `compras/` | `compras/` |
| Esquema de turnos / Cambios de turno (relevos) | `turnos/` | `modules/relevos/` |
| Centro de Operaciones (monitoreo, protocolo de incidentes, mapa) | `monitoring/` | `modules/centro-operaciones/` |
| App del vigilador — CustOS GO (Vigilancia Móvil) | `mobile/` (rutas `/mobile/login`, `/mobile`) | `modules/vigilancia-movil/`, `modules/vigilante-auth/` |
| Reportes | `reports/` | `modules/reports/` |
| Suscripción / plan | `suscripcion/` | `modules/suscripcion/` |
| Configuración (usuarios, costos, calculadora HH, ubicación, catálogos, contratos) | `settings/` | `usuarios/`, `costos/`, `tenant/`, `catalogo/`, `contrato-config/` |
| Onboarding guiado | `onboarding/` | — (usa endpoints de los módulos de arriba) |
| Notificaciones (in-app) | componente `NotificationBell` | `modules/notificaciones/` |
| Kiosk | `kiosk/` | — (pantalla experimental, sin conectar al backend todavía) |

## Convenciones del código

- **Español rioplatense** en nombres de dominio, mensajes de usuario y comentarios; identificadores técnicos (variables, tipos) en el idioma que ya use el archivo.
- **Comentarios**: solo cuando explican un *por qué* no obvio (una restricción, un workaround, una decisión de diseño); nunca describen *qué* hace el código.
- **DTOs con `class-validator`**: el `ValidationPipe` global usa `whitelist: true, forbidNonWhitelisted: true` — cualquier campo nuevo en el body de un endpoint necesita su decorador en el DTO o el request se rechaza.
- **PDFs**: se generan con `pdfmake` (patrón establecido en `modules/reports/reports.service.ts`); requiere `// @ts-ignore` sobre el `import ... = require('pdfmake')` porque el paquete no trae tipos — es el patrón esperado, no un descuido.
- **Servicios frontend**: un archivo por dominio en `apps/web/src/services/`, con las interfaces TypeScript de las respuestas junto a las funciones que las consumen.

## Estado del proyecto

Este es un producto en desarrollo activo. `MANUAL_DE_USO.md` refleja el estado funcional real de cada módulo al momento de su última actualización — incluye qué está implementado, qué es manual todavía y qué falta.
