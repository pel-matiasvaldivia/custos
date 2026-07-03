# Notas de sesión — Revisión de código (6 fixes)

Branch: `claude/checkout-shift-end-validation-738006`
Repo: `pel-matiasvaldivia/custos`

Se aplican 6 fixes de a uno, con confirmación del usuario antes de cada uno.

---

## FIX 1 — Checkout sin validar horario de fin de turno (backend) ✅ APLICADO

**Commit:** `3b69020`

**Problema:** El método `checkout()` del backend confiaba en el guard del cliente
(`MobileDashboard.tsx::handleCheckout`) para impedir la salida antes de `fin_plan`.
Una llamada directa a `POST /mobile/asistencia/checkout` (o un checkout encolado
offline) podía saltarse la restricción.

**Cambios:**
- `apps/api/src/modules/vigilancia-movil/vigilancia-movil.service.ts` (`checkout()`):
  valida `cuando < turno.fin_plan` y lanza
  `BadRequestException({ code: 'SALIDA_ANTICIPADA', turnoId, finPlan })`.
  - **Decisión sobre cola offline:** se valida con `cuando = this.cuando(ts)` (ts
    del dispositivo = momento real en que se tocó "salir"), NO con la hora del
    servidor. Si el checkout se encoló antes de `fin_plan` y se sincroniza después,
    la intención original fue salir antes → se rechaza igual. Documentado en comentario.
- `apps/web/src/offline/outbox.ts`: nuevo `subscribeRejections()` + `OutboxRejection`
  para que un rechazo permanente 4xx no se descarte en silencio (antes solo `console.warn`).
- `apps/web/src/pages/mobile/MobileDashboard.tsx`: `useEffect` que al recibir un
  rechazo `checkout` con `code === 'SALIDA_ANTICIPADA'` abre el modal de relevo.

**Verificación:** `tsc --noEmit` backend y frontend → 0 errores.
**No existe spec** para `vigilancia-movil` (sin test unitario que correr).

---

## FIX 2 — Tracking sin validar identidad en modo dispositivo ✅ APLICADO

**Decisión:** camino intermedio + fix de bug de campo (usuario eligió "intermedio + fix del campo").

**Problema:** `POST /mobile/tracking` (`updateLocation`) era el único endpoint móvil
que no pasaba por `resolverVigilador()`. En modo dispositivo tomaba `data.vigiladorId`
del body sin validar contra el objetivo. Solo emite un socket (no escribe DB) → el
riesgo es spoofear la posición/identidad de un guardia en el mapa del SOC (dentro del
tenant; tenantId/objetivoId salen del token).

**Bug colateral encontrado:** el backend emite `vigilante.location` con campo
`vigiladorId`, pero el frontend lo consumía como `data.vigilanteId`
(`MonitoringPage.tsx`, `MapView.tsx`) → el mapa de guardias estaba roto (todo caía
bajo la clave `undefined`).

**Cambios:**
- `vigilancia-movil.controller.ts`: `updateLocation` delega en el service pasando
  `req.user` completo + `data.vigiladorId`.
- `vigilancia-movil.service.ts` (`updateLocation`): validación **sin bloquear**.
  Personal → `validado: true`. Dispositivo con vigiladorId asignado al objetivo →
  `validado: true`. Sin vigiladorId o no asignado → igual emite con `validado: false`
  (mapa sigue vivo, identidad marcada como no verificada). Comentario explicando la excepción.
- `MonitoringPage.tsx`: fix `data.vigilanteId`→`data.vigiladorId`; clave estable
  (`vigiladorId ?? obj:${objetivoId}`).
- `MapView.tsx`: nuevo `guardUnverifiedIcon` (gris); marcador/label/color según
  `guard.validado` ("UBICACIÓN SIN VERIFICAR"); usa `vigiladorId` y maneja el caso
  "sin identificar" (antes crasheaba con `.slice` sobre undefined).

**Verificación:** `tsc --noEmit` backend y frontend → 0 errores. Sin spec de módulo.

## FIX 3 — Código de incidente con race condition ✅ APLICADO

**Premisa corregida:** el `@@unique([tenant_id, codigo])` YA existía (schema + migración
`20260630080000`). Hoy la colisión no era silenciosa: tiraba `P2002` sin manejar.

**Cambios:**
- `schema.prisma`: nuevo modelo `IncidenteContador` (`@@id([tenant_id, anio])`, `@@map("incidente_contador")`).
- Migración `20260703000000_incidente_contador`: tabla + FK a tenants + RLS (ENABLE/FORCE +
  policy `tenant_isolation`, mismo patrón del repo).
- `centro-operaciones.service.ts`:
  - Nuevo `crearIncidente()`: correlativo por (tenant, año) vía `upsert`+`increment`
    (atómico, `INSERT ... ON CONFLICT DO UPDATE SET valor = valor + 1`). Reset anual
    (el año es parte de la clave). Retry sobre `P2002`, máx 3 intentos.
  - **Decisión de diseño:** NO se usa transacción interactiva ni SQL crudo, porque el
    scoping de tenant (extensión `$allModels` de PrismaService) solo cubre ops de modelo;
    el `upsert` de modelo pasa por la extensión → RLS OK. La atomicidad del contador basta
    (cada llamador obtiene número distinto); no hace falta acoplarlo al `create`.
- **Fusión por familia (pedido del usuario, resuelto ahora):**
  - Nuevo módulo `incidente-familias.ts` (`familiaDeTipo`, `mismaFamilia`) + spec.
    Familias: SEGURIDAD_FISICA (INTRUSION/PANICO/PANICO_MOVIL/APERTURA), EMERGENCIA_VIDA
    (FUEGO/GAS/HUMO); tipo desconocido → `OTRO:<tipo>` (solo fusiona con su mismo tipo).
  - `handleIncidentTrigger`: ahora trae los incidentes abiertos del objetivo en la ventana
    y fusiona solo con uno de la MISMA familia (antes: cualquier tipo).

**Verificación:** `prisma generate` OK, `tsc --noEmit` API → 0 errores.
Spec `incidente-familias.spec.ts` → 4/4 passing. (Los tests que tocan DB requieren
Postgres, no corridos acá; la migración quedó lista para aplicar con `prisma migrate`.)

## FIX 4 — Endpoints legacy de rondas sin aislamiento de tenant ✅ APLICADO

**Escenario encontrado:** endpoints MUERTOS. Búsqueda en todo el repo (backend, web,
mobile, `.md`, `.json`/Postman, `.e2e-spec`) → 0 consumidores de los 4:
`POST /rondas/start`, `POST /rondas/:id/mark`, `PATCH /rondas/:id/finish`, `GET /rondas/active`.
Reemplazados por el flujo real en `vigilancia-movil`: `POST /mobile/rondas/iniciar`
(`iniciarRonda`), marca por scan QR/NFC (`scan`), cierre por el watcher `RondaVigilanciaService`.

**Bug confirmado (por eso importaba):** `markCheckpoint` creaba `marca_ronda` con solo
`ronda_id`+`punto_control_id`, sin validar que la ronda fuera del tenant; `marca_ronda`
no tiene `tenant_id`, así que RLS no la cubre → cross-tenant. `startRonda` tampoco
validaba `puesto_id`/`vigilador_id`.

**Decisión → eliminar** (código muerto e inseguro; no vale la pena mantener superficie
que nadie usa). Se borraron los 4 handlers del controller + los 4 métodos del service
(`startRonda`, `markCheckpoint`, `finishRonda`, `getActiveRondas`) + el import `Patch`
(quedaba sin uso). Se conservan checkpoints, plantillas y `ejecucionesPorObjetivo`.

**Verificación:** `tsc --noEmit` API → 0 errores.

## FIX 5 — Adelanto de sueldo desde mobile no se registra en Liquidaciones — PENDIENTE
(Decisión A/B pendiente de confirmar.)

## FIX 6 — Dos cálculos de horas nocturnas que no coinciden — PENDIENTE

---

### Notas de entorno
- El repo se clonó en `/workspace/custos` (la tarea inicialmente apuntaba al repo
  equivocado `frigoapp`; el correcto es `custos`).
- `npm install` a nivel raíz (workspaces). Prisma Client se genera con
  `cd apps/api && npx prisma generate` (necesario para typecheck sin errores).
- Frontend NO tiene script `type-check`; usar `npx tsc --noEmit` directo.
- Tests: `cd apps/api && npm run test` (jest).
