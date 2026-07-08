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
**Observación fuera de alcance (RESUELTA en Ronda 3):** `ReportsPage.tsx`
(Informes) era un mockup: KPIs hardcodeados y descarga vía
`window.open('/api/v1/reports/...')` que ni coincidía con la ruta real
(`centro-operaciones/informes/...`) ni mandaba el JWT. Se arregló el 500 del
backend en esta ronda; el rework completo de la página quedó en la ronda
siguiente (ver más abajo).

## Ronda 3 — Reconstrucción de la página de Informes (2026-07-03)
**Causa:** `ReportsPage.tsx` mostraba KPIs, gráfico de frecuencia y
distribuciones con valores fijos; la descarga usaba `window.open` a una ruta
inexistente y sin token, así que nunca bajaba nada.
**Fix backend:** nuevo `GET centro-operaciones/informes/estadisticas` (JWT,
scoped por tenant) → `ReportsService.getEstadisticas`: computa sobre los
incidentes del rango el total, resueltos, tasa de resolución, tiempo medio de
respuesta (`tomado_el - abierto_el`) y de resolución (`resuelto_el - abierto_el`),
la frecuencia (bucket por día o por mes según el largo del rango) y las
distribuciones por tipo y por severidad.
**Fix frontend:** `informes.service.ts` tipa la respuesta y descarga PDF/Excel
por blob autenticado (`api.get(..., responseType:'blob')`) contra la ruta real,
con `<a download>`. `ReportsPage.tsx` reescrita: filtros de fecha reales
(default últimos 30 días) con botón "Aplicar", 4 KPIs reales, gráfico de barras
de frecuencia, distribuciones por tipo/severidad con colores por clave, y
estados de carga/vacío/error. ✅ APLICADO

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

---

## Integración ARCA (ex-AFIP) — Nómina/LSD + Facturación electrónica (2026-07-07)

**Commits:** `3b84f6c` (módulo ARCA), `fdb4ebd` (CUIL/fecha en alta/edición),
`5d781fd` (CUIL obligatorio en el alta).

### Alcance
Módulo nuevo `apps/api/src/modules/arca-integration/` + UI, cubriendo dos verticales:
sincronización de personal por archivos planos y facturación electrónica WSFEv1
con obtención de CAE en tiempo real.

### Backend — Personal (nómina / LSD)
- `POST /arca-integration/importar-nomina`: parsea el CSV de Simplificación
  Registral / "Mis Empleados" (parser propio en `util/csv.util.ts`, sin
  dependencias; autodetecta separador y BOM). Reconoce CUIL, apellido/nombre
  (juntos o separados) y fecha de ingreso → alta de vigiladores; omite CUIL ya
  cargados. Deriva el DNI de los 8 dígitos centrales del CUIL.
- `GET /arca-integration/exportar-altas-txt?ids=`: `.txt` de altas en ancho fijo
  (`util/ancho-fijo.util.ts`: alfa/num/importe/fechaAmd, normaliza ASCII sin
  acentos/ñ). Valida pertenencia al tenant y que tengan CUIL de 11 dígitos.
- `GET /arca-integration/exportar-lsd-txt?liquidacionId=`: Libro de Sueldos
  Digital con registros F01 (cabecera del legajo: totales) y F02 (conceptos CCT
  UPSRA 507/07). Como la liquidación guarda TOTALES por legajo, el remunerativo
  se emite consolidado (importe = bruto) y las hs nocturnas/extra van como
  cantidad informativa; reconcilia remun − descuentos − adelanto = neto.
- `Vigilador` suma `cuil String?` y `fecha_ingreso DateTime? @db.Date`.

### Backend — Facturación electrónica (WSFEv1)
- `WsaaService`: arma el TRA, lo firma CMS/PKCS#7 con **openssl** (`openssl cms
  -sign`, archivos temporales 0600 que se borran en `finally`) usando el
  certificado y la clave de cada tenant; obtiene el Ticket de Acceso y lo
  **cachea en Redis** (ioredis, key `arca:ta:{tenant}:{ambiente}`) con respaldo
  en DB; renueva antes de las 12 h. Redis degradado a warning si no está.
- `WsfeService`: `FECompUltimoAutorizado` + `FECAESolicitar`, tipado con
  interfaces SOAP req/resp (`arca.types.ts`); parseo de CAE, `<Obs>` y `<Err>`
  por regex tolerante a namespaces.
- `FacturacionService`: numeración correlativa (último + 1), cálculo
  neto/IVA(21%)/total (A y B discriminan IVA; C monotributo no), persiste la
  `Factura` aprobada con su CAE; si ARCA rechaza → `400` con
  `{rechazo, observaciones, errores}` y NO persiste (no rompe la correlatividad).
- `FacturaPdfService`: comprobante legal en PDF (pdfmake, patrón singleton del
  repo con `@ts-ignore` + `require('pdfmake')`) con letra, número, CAE y vto.
- `ArcaConfigService`: cert/clave se guardan **cifrados** (AES-256-GCM vía
  `SecretosService`, `common/crypto`); nunca vuelven al frontend.
- `SolicitudCae` de servicios (Concepto 2/3) incluye FchServDesde/Hasta/VtoPago.

### Modelos nuevos (RLS por tenant, migración `20260707010000_arca_integracion`)
- `ConfiguracionArca` (tenant_id @unique): ambiente HOMOLOGACION|PRODUCCION,
  cuit_emisor, condicion_iva, `puntos_venta Int[]`, certificado_cifrado,
  clave_cifrada, ta_token/ta_sign/ta_expira (respaldo del TA).
- `Factura`: tipo_comprobante, punto_venta, numero, doc_tipo/doc_nro, concepto,
  importes, cae/cae_vencimiento, estado, fecha_emision, items Json,
  observaciones Json. `@@unique([tenant_id, punto_venta, tipo_comprobante, numero])`.
- La migración también agrega `vigiladores.cuil` y `vigiladores.fecha_ingreso`.

### Frontend
- `services/arca.service.ts`: cliente tipado (config multipart, probar-conexión,
  importar-nómina, descargar altas/LSD/PDF por blob, facturar, listar).
- `pages/settings/ConfiguracionArcaForm.tsx`: entorno, CUIT, condición IVA,
  puntos de venta, carga de `.crt`/`.key`, botón "Probar conexión". Cert/clave
  no vuelven: solo informa si ya están cargados.
- `pages/billing/BotonFacturarElectronico.tsx`: modal de emisión reutilizable
  con estados animados (Conectando/Solicitando CAE), número legal + CAE +
  descarga del PDF; maneja rechazo de ARCA con detalle.
- `pages/settings/FacturacionArcaTab.tsx`: nueva pestaña de Configuración
  ("Facturación ARCA") = config + emisión + listado de comprobantes.
- `pages/personnel/ImportarNominaModal.tsx` (drag & drop) y
  `ExportarAltasButton.tsx` (por lote, checkboxes en la tabla de PersonnelPage).

### Alta/edición de vigilador alineada al esquema de ARCA
- `VigiladorWizard`: paso de datos básicos suma **CUIL** (obligatorio; autocompleta
  el DNI con los 8 dígitos centrales) y **fecha de ingreso**.
- `VigiladorEditForm`: agrega CUIL y fecha de ingreso (opcionales) para completar
  legajos existentes.
- DTOs `create` (cuil requerido, 11 dígitos) / `update` (opcional) de vigilante.
  Las importaciones masivas escriben directo en Prisma → no las afecta el DTO.

### Pendiente / limitaciones honestas
- **No probado contra ARCA real** (requiere certificados + homologación en vivo).
  Los layouts de ancho fijo (altas/LSD) son la mejor aproximación al formato
  documentado; conviene validarlos con el aplicativo de ARCA antes de producción.
  Están centralizados en `util/ancho-fijo.util.ts` para ajustar posiciones.
- `exportar-lsd-txt` queda funcional pero SIN botón en la UI: necesita un
  `liquidacionId` persistido (flujo "cerrar liquidación") a revisar.

### Notas de entorno (ARCA)
- Requiere `openssl` en el contenedor (firma CMS del TRA) — presente (3.0.13).
- Redis: reusa `REDIS_URL`/`REDIS_HOST`/`REDIS_PORT`. `APP_SECRET_KEY` cifra
  cert/clave (ya documentada). `ioredis` viene transitivo de bullmq.
- Sin dependencias nuevas: SOAP por XML manual + axios; CSV por parser propio.

---

# Ronda 4 — Plataforma QA Automation completa (2026-07-08)

**Branch:** `claude/erp-qa-automation-x5zh5w`
**PR:** #88 (en monitoreo CI activo)

## Alcance

Plataforma completa de Quality Assurance construida desde cero analizando el
código del monorepo (37 controladores, 64 modelos Prisma, frontend React/Vite).
Workspace `qa/` con Playwright, k6, axe-core, Page Objects, y GitHub Actions CI.

### Estructura de la suite

| Tipo | Archivos | Tests | Descripcion |
|---|---|---|---|
| API | 7 specs | ~38 | auth, RBAC, tenant isolation (RLS), CRUD clientes, flujo operativo completo, movil+ARCA, smoke 18 endpoints |
| E2E | 5 specs | ~26 | login, clientes CRUD, navegacion 16 modulos, cuadrante, RBAC UI |
| Accesibilidad | 1 spec | 8 | axe-core WCAG 2.1 A/AA en 8 paginas con baseline de regresion |
| Visual | 1 spec | 3 | Screenshots de sidebar, login, configuracion (zonas estables) |
| Resiliencia | 1 spec | 11 | offline, API lenta, timeout, 500/401/403, JSON corrupto, doble click, multi-tab, refresh |
| k6 carga | 1 script | - | smoke (5 VUs, 30s) y load (100 VUs, 10 min) |
| k6 estres | 1 script | - | 6 escenarios concurrentes hasta 2000 VUs |

**Total: 105 tests Playwright + 2 scripts k6**
**Cobertura funcional: 23/23 modulos (100%)**

### Procesos criticos cubiertos E2E (API)

`operacion-flujo.spec.ts` — 10 tests seriales:
alta cliente -> alta objetivo -> alta puesto -> alta vigilador -> crear esquema
4x2 -> asignar vigilador -> consultar cuadrante (desde/hasta) -> consultar
cobertura -> registrar novedad -> finalizar asignacion (vigente_hasta)

### CI: `.github/workflows/qa.yml`

Stack completo en GitHub Actions: Postgres 16 (con RLS + custos_app role) +
Redis 7 + API NestJS + Web Vite. Ejecuta Playwright (6 projects: setup, api,
e2e, a11y, visual, resilience) + cobertura funcional + k6 smoke. Publica
artefactos: reporte HTML, videos, screenshots, traces, junit.xml, cobertura.

---

## Bugs y hallazgos detectados

### QA-BUG-01 — ClientesPage crashea con datos corruptos (ALTA) — NO RESUELTO

**Que detecta:** cuando la API devuelve un shape inesperado (JSON corrupto o
campos faltantes), el componente `ClientesPage` del frontend crashea con:
- `Cannot read properties of undefined (reading 'filter')`
- `Cannot read properties of null (reading 'toLowerCase')`

**Causa raiz:** el render de la lista de clientes no tiene defensa contra datos
con shape inesperado. Falta validacion/fallback en el `.filter()` y `.toLowerCase()`
sobre campos que pueden ser undefined/null.

**Donde arreglarlo:** `apps/web/src/pages/clients/ClientesPage.tsx` (o el
componente que renderiza la lista de clientes). Agregar optional chaining y/o
valores por defecto en el map/filter de los datos de la API.

**Estado en QA:** test marcado con `test.fail()` en
`qa/tests/resilience/red-y-errores.spec.ts` — el test pasa como "expected
failure" (no rompe la suite) pero rastrea el bug. Cuando se corrija el codigo,
quitar el `test.fail()` para que el test valide la correccion.

### QA-BUG-02 — Deuda de accesibilidad WCAG en todas las paginas (MEDIA) — NO RESUELTO

**Que detecta:** axe-core encuentra violaciones en las 8 paginas auditadas:
- `button-name`: botones de icono sin texto accesible (aria-label faltante)
- `color-contrast`: contraste insuficiente entre texto y fondo
- `label` / `select-name`: los `<label>` no estan asociados a sus inputs (falta `htmlFor`)

**Donde arreglarlo:** componentes reutilizables del frontend:
- Botones de icono: agregar `aria-label` descriptivo
- Labels de formulario: agregar `htmlFor` que apunte al `id` del input
- Contraste: ajustar colores en el tema CSS/Tailwind

**Estado en QA:** las violaciones existentes estan registradas en
`qa/tests/a11y/baseline.json`. El gate de accesibilidad solo falla ante
violaciones NUEVAS que no esten en el baseline. Para regenerar el baseline
despues de corregir: `QA_A11Y_UPDATE=1 npx playwright test --project=a11y`.

### QA-OBS-01 — Contratos de API documentados (INFO) — OBSERVACION

Comportamientos del API descubiertos y documentados por los tests:
- `PUT /clientes/:id` (no PATCH) — la API usa PUT para actualizar clientes
- `GET /cuadrante/asignaciones` exige `?objetivoId=` obligatorio (400 sin el)
- `GET /liquidaciones` exige `?desde=&hasta=` obligatorio (400 sin ellos)
- `GET /cuadrante/objetivos/:id` exige `?desde=&hasta=` obligatorio
- `GET /vigilantes` NO acepta `?busqueda=` (PaginationDto sin ese campo +
  forbidNonWhitelisted -> 400; los clientes SI lo tienen via FindClientesDto)

No son bugs sino contratos del API que los consumidores deben respetar.
Quedan documentados para referencia de frontend y QA.

### QA-OBS-02 — Rate limiting funcional (INFO) — OBSERVACION

El rate-limiter de login (`LOGIN_RATE_LIMIT_MAX`) funciona correctamente y
devuelve 429 cuando se supera el limite. Los entornos de test/CI deben elevarlo
(hecho en `qa.yml` con `LOGIN_RATE_LIMIT_MAX=100000` y `RATE_LIMIT_MAX=1000000`).

---

## Problemas de CI resueltos (4 iteraciones)

| # | Problema | Causa | Fix | Commit |
|---|---|---|---|---|
| 1 | bitnami/minio image pull fail | Imagen retirada de Docker Hub | Removido MinIO service; API degrada gracefully | `1a00f86` |
| 2 | dump.rdb untracked file | Redis background save en CI | Eliminado + agregado a .gitignore | `7d10893` |
| 3 | Test movil 429 en vez de 401 | Rate limiter sin elevar en CI | LOGIN_RATE_LIMIT_MAX + RATE_LIMIT_MAX en workflow env | `eacb9d9` |
| 4 | k6 http_req_failed 18.54% | vigilantes?busqueda= rechazado por forbidNonWhitelisted | Removido query param invalido de k6 scripts | `f62451f` |

---

## Resumen de estado

- **105 tests Playwright:** todos pasan (incluyendo QA-BUG-01 como expected failure)
- **23/23 modulos cubiertos (100%):** supera el objetivo de >90%
- **QA-BUG-01 (ALTA):** pendiente de corregir en el frontend (ClientesPage)
- **QA-BUG-02 (MEDIA):** pendiente de corregir en el frontend (accesibilidad)
- **CI:** en monitoreo activo, esperando resultado de commit `f62451f`

---

# Ronda 5 — Importación de nómina ARCA rota con CSV/XLSX reales (2026-07-08)

**Branch:** `claude/arca-watcher-csv-import-a0tw7h`

## Bug reportado
Al importar la nómina exportada desde ARCA ("Consulta Nómina",
`Nomina_30717284638_202605_000.csv/.xlsx`), el modal devolvía
"0 vigiladores importados" con "Fila N: sin CUIL o nombre válidos" para
TODAS las filas.

## Causas raíz (verificadas con los archivos reales del usuario)
1. **Preámbulo del export:** el archivo real trae 4 líneas antes de la
   cabecera (`CUIT:`, `Período`, `Secuencia:`, `Contribuyente:`); la cabecera
   real ("CUIL,Apellido y Nombre,…") está en la fila 5. `parsearCsv` tomaba la
   fila 1 como cabecera → ninguna fila de datos encontraba la columna CUIL.
2. **XLSX sin soporte:** el controller hacía `buffer.toString('utf8')` sobre
   el binario (un xlsx es un ZIP) y el input del modal ni aceptaba `.xlsx`.
3. **Orden del nombre:** en el export real "Apellido y Nombre" viene como
   "NOMBRES APELLIDO" (`CLAUDIO WALTER MENDOZA`); la heurística sin coma
   tomaba el PRIMER token como apellido → quedaba "CLAUDIO, WALTER MENDOZA".

## Fix
- `util/csv.util.ts`: nueva `filasDesdeMatriz` (compartida CSV/XLSX) que
  detecta la fila de cabecera buscando la columna CUIL (fallback: columnas de
  nombre, y si no, fila 1 como antes); devuelve `FilaConLinea` con el número
  de línea ORIGINAL del archivo para mensajes de error útiles. El separador
  se autodetecta sobre la línea de cabecera (contar sobre todo el archivo
  engaña: los decimales usan coma, "834975,75").
- `services/nomina.service.ts`: `importarNomina` recibe el Buffer + nombre;
  detecta xlsx por magia ZIP (`PK`) o extensión y lo parsea con **exceljs**
  (ya era dependencia; celdas numéricas/fecha/richText → texto); `.xls` viejo
  (BIFF) se rechaza con mensaje claro. Split sin coma corregido: último token
  = apellido.
- `arca-integration.controller.ts`: pasa `archivo.buffer` + `originalname`.
- `ImportarNominaModal.tsx`: `accept` suma `.xlsx` y el texto menciona Excel.

## Verificación
- Specs nuevos: `csv.util.spec.ts` + `nomina.service.spec.ts` (13 tests, con
  la estructura real del export, xlsx generado con exceljs, `.xls` rechazado,
  duplicados omitidos, número de fila en errores) → 13/13 passing.
- Corrida real contra los DOS archivos subidos por el usuario (CSV y XLSX,
  prisma mockeado): **13/13 vigiladores importados, 0 errores**, apellidos y
  DNI derivados correctos en ambos.
- `tsc --noEmit` API y web → 0 errores. Suite completa API: solo falla el
  preexistente `vigilante.service.spec.ts › update` (documentado en Ronda 1,
  ya fallaba en main).
