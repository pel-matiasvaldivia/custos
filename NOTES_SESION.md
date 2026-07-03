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

## FIX 5 — Adelanto de sueldo desde mobile no se registra en Liquidaciones ✅ APLICADO

**Decisión del usuario: OPCIÓN B** (sacar ADELANTO_SUELDO del móvil).

**Problema:** dos caminos crean novedades pero solo la web alimenta el ledger:
web → `NovedadService.create` parsea `[ADELANTO monto=NNN cuotas=N]` y crea la fila
`adelanto` (VIGENTE) que Liquidaciones descuenta al cerrar. Mobile →
`VigilanciaMovilService.crearNovedad` creaba la novedad directo, sin ledger y sin
campos de monto/cuotas → adelanto fantasma que nunca se descontaba.

**Fundamento de B (vs A = paridad con monto/cuotas en el modal móvil):** crear la fila
`adelanto` significa "adelanto OTORGADO" (descuenta plata del recibo al cerrar el
período). Desde la web lo carga la oficina que aprueba/entrega el dinero; desde el
móvil sería el propio vigilador auto-registrándose un adelanto sin aprobación. Un flujo
de solicitud+aprobación sería una feature aparte, no este fix.

**Cambios (solo `vigilancia-movil.service.ts`):**
- `listarNovedadTipos()`: filtra `ADELANTO_SUELDO` del catálogo que ve el móvil.
- `crearNovedad()`: rechaza `tipo === 'ADELANTO_SUELDO'` con
  `BadRequestException({ code: 'ADELANTO_SOLO_OFICINA' })` — ocultar el botón no
  alcanza, un request armado a mano igual crearía la novedad sin ledger.
- Frontend sin cambios: el modal renderiza los tipos que devuelve el endpoint.

**Verificación:** `tsc --noEmit` API → 0 errores.

## FIX 6 — Dos cálculos de horas nocturnas que no coinciden ✅ APLICADO

**Desajuste confirmado (mismo turno, resultados distintos):**
- `conciliacion.domain.ts` (facturación): minuto-precisa PERO asumía ventana que cruza
  medianoche (`h >= ini || h < fin`) → con ventana 00→06 contaba las 24h como nocturnas.
- `liquidaciones.service.ts` (pago): manejaba ambas ventanas PERO iteraba en tramos de
  1h anclados al inicio del turno, clasificando el tramo por la hora en que empieza →
  turno 20:30→06:00 con ventana 21→06 daba 8.5h en vez de 9 (perdía 21:00–21:30).
  Se facturaban 9h al cliente y se pagaban 8.5 al vigilador.

**Cambios:**
- `conciliacion.domain.ts::horasNocturnas`: única fuente de verdad. Minuto-precisa +
  soporta ventana que cruza y que no cruza medianoche; inicio===fin → ventana vacía (0).
- `liquidaciones.service.ts`: se borró el método privado `horasNocturnas`; importa el
  de dominio y lo usa en `agregarTurnos`. `horasEntre` se queda (duración simple).
- Tests nuevos en `conciliacion.domain.spec.ts`: 20:30→21:30 → 0.5; 20:30→06:00 → 9;
  ventana 00→06 con turno 22→08 → 6 y diurno → 0; ventana vacía → 0.

**Verificación:** `npm run test -- --testPathPattern "cuadrante|conciliacion|liquidaciones"`
→ 5 suites, 37/37 passing. `tsc --noEmit` → 0 errores. (No existe spec de liquidaciones.)

**Evaluación hh_feriado (solo informe, SIN cambios, como se pidió):**
`ReglaLaboral` ya tiene `recargo_feriado_pct` (default 100) y existe la tabla `feriados`
por tenant; la conciliación computa `hh_feriado` y lo persiste en `conciliacion_hh`.
Liquidaciones lo IGNORA: no selecciona `recargo_feriado_pct`, no cruza turnos con
`feriados`, `LiquidacionItem` no tiene columna `hh_feriado`, y el bruto es solo
trabajadas + nocturnas + extra → el feriado se factura al cliente pero al vigilador
se le paga como día común. SÍ correspondería el recargo (CCT vigilancia: feriado
trabajado al 100%). Implementarlo requiere: cruzar `inicio_real` con `feriados`,
acumular `hh_feriado` en `agregarTurnos`, sumar `vh·recFeriado·hh_feriado` al bruto,
y migración para `LiquidacionItem.hh_feriado`. Impacto monetario directo en recibos →
queda reportado como trabajo aparte.

---

## Verificación final (post 6 fixes)

- `apps/api npm run build` → OK (exit 0).
- `apps/api npm run test` → 84 passed, 5 skipped, **1 failed PREEXISTENTE**:
  `vigilante.service.spec.ts › update › should update vigilante after verifying tenant`.
  Falla idéntico en el commit base `bc89f65` (main, verificado con worktree); ninguno
  de los 6 fixes toca `src/vigilante`. No fue introducido por esta sesión.
- `apps/web npm run build` → OK (tsc + vite + PWA, exit 0).

**Estado:** los 6 fixes APLICADOS. Nada quedó pendiente de decisión del usuario.
Trabajo reportado para hacer aparte (no incluido a propósito):
- FIX 6: recargo de feriado en Liquidaciones (ver informe en FIX 6).
- FIX 5: si el negocio quiere "solicitud de adelanto" desde la app, es un flujo
  con aprobación a diseñar como feature.

---

---

# Ronda 2 — 8 bugs reportados por QA (2026-07-03)

Diagnóstico hecho leyendo el código de la rama (los 6 fixes anteriores ya aplicados).
OJO: el error de consola que reportó QA es de un bundle de producción
(`index-C_mYU1t0.js`) que NO incluye esta rama; parte de lo reportado ya estaba
arreglado acá (FIX 2) y falta deployar.

## B1 — Comercial /objetivos: el mapa queda por encima de los modales
**Causa:** Leaflet usa z-index 400–1000 en sus panes/controles internos y
`.leaflet-container` no crea stacking context; los modales del app usan `z-50`
(50 < 400) → el mapa (GeoObjetivoSection y cualquier otro) tapa el overlay.
**Fix:** CSS global en `index.css`: `.leaflet-container { z-index: 0; isolation: isolate; }`
(encapsula los z-index internos del mapa). ✅ APLICADO

## B2 — Login del móvil con ID de objetivo + PIN falla
**Causa probable:** el código se genera `OBJ-2026-0001` (mayúsculas). El input de
`MobileLogin.tsx` tiene clase CSS `uppercase` (solo visual) y manda lo tipeado tal
cual; el backend compara `codigo` case-sensitive → "obj-2026-0001" no matchea
aunque el usuario lo ve en mayúsculas.
**Fix:** frontend manda `.toUpperCase()`; backend busca con `mode: 'insensitive'`
(defensa doble). ✅ APLICADO

## B3 — Pánico atendido/cerrado desaparece y no hay dónde verlo
**Causa:** al resolver, `incident.resolved` lo saca del dashboard, pero el único
endpoint es `GET incidentes/activos` (estado != RESUELTO) y no existe NINGUNA
vista de cerrados. Además las pestañas Pendientes/En Atención/Verificando del SOC
eran decorativas (sin onClick).
**Fix:** endpoint `GET /centro-operaciones/incidentes/cerrados` (RESUELTO, últimos
100, filtro desde/hasta) + pestañas funcionales en MonitoringPage con nueva pestaña
"Cerrados" que lista disposición y hora de cierre. ✅ APLICADO

## B4 — Mapa en Vivo: TypeError .slice sobre undefined
**Causa:** era el bug de FIX 2 (MapView usaba `guard.vigilanteId.slice(0,8)` con el
campo mal nombrado → siempre undefined). YA ESTÁ ARREGLADO en esta rama; el bundle
del deploy es anterior. Quedaba un `.slice` hermano sin guardar:
`MonitoringPage:314` `ev.dispositivo_id.slice(0,4)` revienta si un evento llega sin
`dispositivo_id` (p. ej. los sintéticos de rondas ya mandan `''`, pero un payload
sin el campo crashea el stream).
**Fix:** guard con `?.` + fallback; y `processEvent` ahora emite `event.new` con
`objetivo: { nombre }` incluido para que el stream muestre el nombre real. ✅ APLICADO
**Pendiente de infra:** deployar el frontend de esta rama.

## B5 — Cuadrante no se condice con asignaciones; Generar Mes/Exportar no hacen nada
**Causa:** `QuadrantPage.tsx` era un MOCKUP hardcodeado (filas "PÉREZ"/"GONZÁLEZ"
con módulo 5/7, mes fijo "Junio 2026", botones sin onClick). El cuadrante real
existe por objetivo (`GET /cuadrante/objetivos/:id`).
**Fix:** página reescrita consolidando el cuadrante real de todos los objetivos
activos (mes navegable); "Generar Mes" llama al nuevo endpoint
`POST /cuadrante/generar-mes` (recorre asignaciones-esquema vigentes que pisan el
mes y genera con la lógica idempotente existente); "Exportar" baja CSV. ✅ APLICADO

## B6 — Novedades: no se ven en vivo y el informe no baja
**Causa (en vivo):** el backend emite `novedad.new` pero NADIE lo escucha:
ni MonitoringPage (stream) ni NovedadesPage. Además el payload solo traía IDs.
**Causa (informe) — CONFIRMADA en runtime:** pdfmake es ^0.3.11 y en 0.3 el
export es una instancia singleton, NO un constructor. `new printer(fonts)` +
`createPdfKitDocument()` tiran `TypeError: printer is not a constructor` → el
endpoint devolvía 500 SIEMPRE (verificado con script aislado). `contrato-pdf` y
`cotizacion-pdf` ya usaban la API nueva (`setFonts` + `createPdf().getBuffer()`);
novedades, liquidaciones y reports quedaron con la vieja.
**Fix:** migrados los 3 servicios rotos a `setFonts` + `createPdf().getBuffer()`
(devuelven Buffer; los controllers hacen `res.send(buffer)`); patrón validado en
runtime (genera `%PDF-` OK). Payload de `novedad.new` enriquecido (vigilador,
puesto, prioridad, descripción); MonitoringPage lo suma al event stream;
NovedadesPage se suscribe y refresca en vivo; catch con mensaje visible en la
descarga (antes fallaba en silencio). ✅ APLICADO
**Observación fuera de alcance:** `ReportsPage.tsx` (Informes) es un mockup:
KPIs hardcodeados y descarga vía `window.open('/api/v1/reports/...')` que ni
coincide con la ruta real (`centro-operaciones/informes/...`) ni manda el JWT.
Se arregló el 500 del backend, pero esa página necesita su propio rework.

## B7 — No se ven inicios de ronda ni escaneos QR en el SOC
**Causa:** el backend emite `ronda.start` y `ronda.checkpoint` pero MonitoringPage
solo escuchaba `ronda.alerta`. Payloads con IDs pelados (sin nombres).
**Fix:** payloads enriquecidos (vigilador, plantilla/punto) + listeners en
MonitoringPage que los meten al event stream. ✅ APLICADO

## B8 — No se puede escuchar el audio ni ver la foto de la novedad del móvil
**Causa:** el móvil sube foto/audio a MinIO y guarda las KEYS en
`novedad.adjuntos`, pero (a) no existía endpoint para servir esos archivos
(la URL firmada de MinIO apunta al hostname interno) y (b) NovedadesPage ni
siquiera renderizaba los adjuntos.
**Fix:** `GET /novedades/:id/adjuntos/:indice` (valida tenant y streamea desde
MinIO vía StorageService.descargar) + NovedadesPage renderiza miniaturas de fotos
y reproductor de audio (fetch autenticado a blob). ✅ APLICADO

### Notas de entorno
- El repo se clonó en `/workspace/custos` (la tarea inicialmente apuntaba al repo
  equivocado `frigoapp`; el correcto es `custos`).
- `npm install` a nivel raíz (workspaces). Prisma Client se genera con
  `cd apps/api && npx prisma generate` (necesario para typecheck sin errores).
- Frontend NO tiene script `type-check`; usar `npx tsc --noEmit` directo.
- Tests: `cd apps/api && npm run test` (jest).
