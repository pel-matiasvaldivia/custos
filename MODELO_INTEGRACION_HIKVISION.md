# Integración de dispositivos Hikvision al Centro de Operaciones

> Solución técnica para vincular DVR, NVR, cámaras IP y paneles de alarma **Hikvision** desde el modal de *Equipamiento Electrónico*, recibir sus eventos, correlacionarlos en incidentes y que el operador **verifique en video la cámara que disparó el evento, según la configuración**. Escrito sobre la arquitectura real del repo (no reescribe lo que ya funciona: lo completa).

---

## 1. Diagnóstico de la arquitectura actual

Lo que ya está y sirve:

| Pieza | Estado | Archivo |
|---|---|---|
| Modelo `Dispositivo` (tipo, protocolo, `params` JSON, `nro_abonado`, heartbeat, estado) | ✅ Sólido | `schema.prisma:744` |
| Modelo `Zona` (numero_zona, tipo, particion, `puesto_id`) | ✅ | `schema.prisma:771` |
| `Evento` → correlación → `Incidente` (idempotencia por `id_origen`, dedup de familia, contador atómico) | ✅ Muy bueno | `centro-operaciones.service.ts:16` |
| Receptor **SIA DC-09** TCP (paneles genéricos por IP) | ✅ Funciona | `receivers/sia-receiver.service.ts` |
| Gateway Socket.IO en vivo (`event.new`, `incident.new/updated`) | ✅ | `gateways/co.gateway.ts` |
| Modal de protocolo del operador (tomar → verificar → despachar → cerrar) | ✅ | `ProtocoloIncidenteModal.tsx` |
| MediaMTX en el stack (RTSP 8554 / HLS 8888 / WebRTC 8889 / API 9997) | ✅ Corriendo | `infra/docker-compose.yml:75` |

Los **4 huecos** que hay que cerrar para cumplir el pedido:

1. **Sin onboarding de dispositivos.** El botón "Nuevo Dispositivo" del modal es estático y el `CentroOperacionesController` solo expone `GET /dispositivos`. No hay alta, ni prueba de conexión, ni descubrimiento de canales.
2. **Sin ingesta Hikvision.** Solo entra SIA DC-09. Nada consume ISAPI ni el *Alarm Server* de Hikvision, así que los eventos nativos (line crossing, intrusion, motion, video loss, IO, PIR del AX PRO) no llegan.
3. **Sin mapeo zona → cámara.** No existe la relación "esta zona/entrada se verifica con este canal de este NVR". Sin eso, el operador no puede ver *la cámara que disparó* — que es el corazón del pedido.
4. **`VideoService` es un stub inseguro.** `getStreamUrl` devuelve rutas ficticias, PTZ y grabación están simulados, **y no valida `tenant_id`** (un operador podría pedir el stream de otro tenant — IDOR). El modal ofrece "Verifiqué cámara" pero no muestra ninguna imagen.

> Nota de seguridad adicional: el `SiaReceiverService` resuelve el dispositivo por `nro_abonado` **global** (`findFirst`), pero el `@@unique` del schema es `[tenant_id, nro_abonado]`. Dos tenants con el mismo número de abonado colisionan. La solución de abajo lo corrige exigiendo unicidad global del identificador de ingesta.

---

## 2. Principios de diseño (el "eficiente" del pedido)

1. **Push, no polling.** Hikvision puede **empujar** eventos hacia nosotros (Alarm Server / HTTP Host). Evitamos mantener una conexión ISAPI *alertStream* viva por dispositivo (no escala en multi-tenant cloud). El fallback por `alertStream` queda para equipos en LAN sin salida.
2. **Video bajo demanda.** No se streamea ninguna cámara 24/7. MediaMTX levanta el path **solo cuando se abre el incidente** (`sourceOnDemand`) y lo baja al cerrar. Se paga ancho de banda solo de la cámara que disparó, mientras el operador la mira.
3. **Snapshot primero, video después.** Al llegar el evento capturamos un **JPEG** por ISAPI (una sola GET, barata) y lo adjuntamos al evento. El operador ve la foto del instante del disparo **al toque**, mientras el stream en vivo carga en segundo plano. En el 80% de las verificaciones alcanza con la foto.
4. **La configuración manda.** El mapeo "zona → canal de video" es dato configurable por objetivo. Un evento nativo de cámara (line crossing) ya trae su canal; un evento de panel (PIR zona 3) se resuelve por el mapeo a un canal del NVR.
5. **No reinventar lo que anda.** Reusamos `processEvent` (idempotencia, correlación, gateway). Hikvision es solo una **nueva fuente** que normaliza a la misma taxonomía de `Evento`.
6. **Secretos fuera del JSON en claro.** Las credenciales de cámara no viven en `params` en texto plano: `params.secreto_ref` apunta a un secreto cifrado.

---

## 3. Modelo de datos (cambios mínimos)

### 3.1 Nueva tabla `DispositivoCanal` — los canales de un DVR/NVR
Un DVR/NVR tiene N cámaras. Cada canal es una fuente de video verificable.

```prisma
model DispositivoCanal {
  id             String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  tenant_id      String   @db.Uuid
  dispositivo_id String   @db.Uuid            // el DVR/NVR (o la propia CAMARA_IP)
  numero_canal   Int                          // 1..N (canal Hikvision)
  nombre         String?                       // "Frente", "Depósito"
  rtsp_path      String?                       // override; si null se arma por convención
  tiene_ptz      Boolean  @default(false)
  habilitado     Boolean  @default(true)

  dispositivo Dispositivo @relation(fields: [dispositivo_id], references: [id])
  zonas       Zona[]                           // zonas que se verifican con este canal

  @@unique([tenant_id, dispositivo_id, numero_canal])
  @@map("dispositivo_canales")
}
```

### 3.2 `Zona` gana el mapeo de verificación
```prisma
model Zona {
  // ...campos actuales...
  canal_id String? @db.Uuid          // NUEVO: canal de video que verifica esta zona
  canal    DispositivoCanal? @relation(fields: [canal_id], references: [id])
}
```

Esto es "según la configuración": la zona 3 del panel del objetivo se ve por el canal 5 del NVR. Para una cámara Hikvision con analítica propia (line crossing), el evento ya nace con su `dispositivo_id` + `numero_canal`, así que la verificación es directa sin pasar por `Zona`.

### 3.3 `Evento` guarda el snapshot y el canal
```prisma
model Evento {
  // ...campos actuales...
  canal_numero Int?                  // canal Hikvision que originó el evento nativo
  snapshot_key String?               // objeto en MinIO con el JPEG del instante
}
```

> Alternativa sin tocar el schema: guardar `canal_numero` y `snapshot_key` dentro del JSON `crudo`. Recomiendo columnas propias: se indexan, se muestran en la lista y no ensucian el crudo de auditoría.

### 3.4 Convención de `params` para un dispositivo Hikvision
```jsonc
{
  "ip": "10.20.0.5",
  "puerto_http": 80,          // ISAPI
  "puerto_rtsp": 554,
  "usuario": "operador",
  "secreto_ref": "sec_9f...", // credencial cifrada, NO la password en claro
  "https": false,
  "supervision_seg": 60,      // heartbeat esperado
  "ingest_token": "hk_ab12"   // token único que el equipo manda en el push (ver §4.2)
}
```

---

## 4. Ingesta de eventos Hikvision

Hikvision expone dos mecanismos. Elegimos según dónde está el equipo.

### 4.1 Mecanismos disponibles
| Mecanismo | Cómo funciona | Cuándo usarlo |
|---|---|---|
| **Alarm Server / HTTP Host** (recomendado) | El DVR/NVR/cámara **POSTea** el evento (XML/JSON multipart, opcionalmente con snapshot) a una URL nuestra. Se configura por ISAPI `/ISAPI/Event/notification/httpHosts`. | Cloud multi-tenant. El equipo está en el sitio del cliente con salida a internet y alcanza nuestra API. Sin conexiones persistentes. |
| **ISAPI alertStream** (fallback) | Nosotros abrimos `GET /ISAPI/Event/notification/alertStream` (multipart *replace* persistente) contra el equipo y leemos el flujo. | Equipos en LAN que no pueden POSTear afuera, o integración on-prem. Una conexión viva por equipo. |
| **SIA DC-09 / Contact ID** (ya existe) | El panel AX PRO/AX Hub reporta al receptor TCP 9100. | Para la parte de **alarma** de los paneles Hikvision. Se mantiene tal cual. |

**Recomendación:** *Alarm Server* para video/analítica de DVR/NVR/cámaras; **SIA** para la central de alarma. Un mismo panel AX PRO puede hacer ambas: SIA para las zonas y Alarm Server para los eventos con imagen.

### 4.2 Endpoint receptor (Alarm Server)
Nuevo módulo `hikvision` dentro de `centro-operaciones`:

```
POST /centro-operaciones/hik/eventos/:ingest_token
```
- **`ingest_token`** en la URL identifica al dispositivo sin exponer IDs internos ni requerir JWT (el equipo no puede autenticar con Bearer). Se resuelve `token → dispositivo → tenant` con el cliente **admin** (igual patrón que el receptor SIA: resolver cross-tenant y luego procesar dentro del `TenantContext` del tenant resuelto, respetando RLS).
- El token es **único global** (evita la colisión de `nro_abonado` señalada arriba) y rota si se compromete.
- Acepta `multipart/form-data`: parte XML/JSON del evento + parte `Picture` (JPEG) si el equipo la manda.
- Rate-limit y validación de tamaño. Idempotencia por `dateTime + eventType + channelID` → `id_origen` (reusa la dedup existente en `processEvent`).

Handler:
```ts
@Post('hik/eventos/:token')
@UseInterceptors(AnyFilesInterceptor())
async recibir(@Param('token') token, @Body() body, @UploadedFiles() files) {
  const disp = await this.hik.resolverPorToken(token);      // admin, cross-tenant
  const eventos = this.hik.normalizar(disp, body, files);   // → taxonomía CustOS
  await this.tenantContext.run(disp.tenant_id, async () => {
    for (const e of eventos) await this.coService.processEvent(e);
  });
  return { ok: true };
}
```

### 4.3 Normalización Hikvision → taxonomía CustOS
El `eventType` de Hikvision se mapea a `Evento.tipo` / `severidad`, análogo a lo que hace `parseDC09`:

| Hikvision `eventType` | CustOS `tipo` | Severidad | Origen |
|---|---|---|---|
| `linedetection`, `fielddetection`, `regionEntrance`, `regionExiting` | `INTRUSION` | ALTA | CCTV |
| `VMD` (motion) | `MOVIMIENTO` | MEDIA | CCTV |
| `tamperdetection` (shelter) | `TAMPER` | ALTA | CCTV |
| `videoloss` | `PERDIDA_VIDEO` | ALTA | CCTV |
| `IO` / `inputproxy` (entrada seca) | según mapeo de zona | — | PANEL |
| AX PRO `zoneAlarm` PIR/magnético | `INTRUSION` | ALTA | PANEL |
| `PIR`, `fire` | `FUEGO` | CRITICA | PANEL |
| `diskfull`, `diskerror`, `ipConflict` | `TECNICA` | BAJA | SISTEMA |

El evento normalizado sale con `dispositivo_id`, `objetivo_id`, `canal_numero` (del `channelID` de Hikvision), `zona_id` (si aplica el mapeo), `id_origen` (idempotencia) y `snapshot_key` (si vino la foto, subida a MinIO). De ahí en más **es el mismo `processEvent` de siempre**: dedup, correlación en incidente y push por el gateway. Cero cambios en esa lógica.

### 4.4 Heartbeat / supervisión
Hikvision manda `videoloss`/`keepalive` y, con Alarm Server, un `heartBeat` periódico. Cada push actualiza `ultimo_latido` y `estado='EN_LINEA'` (ya lo hace `processEvent`). Un job de barrido marca `FUERA_DE_LINEA` los que superan `supervision_seg` — alimenta el KPI "Fuera de línea" del modal de Equipamiento, que hoy es real pero sin nadie que lo actualice.

---

## 5. Video verificación (el núcleo del pedido)

### 5.1 Resolver "qué cámara disparó"
Al abrir el incidente, el backend resuelve el/los canal(es) de video:

```
Evento nativo de cámara (CCTV)  → dispositivo_id + canal_numero      (directo)
Evento de panel/entrada (PANEL) → zona.canal_id → DispositivoCanal    (por config)
```

Si la zona no tiene `canal_id` configurado, se ofrece igual la lista de canales del objetivo para que el operador elija manualmente (degradación elegante).

### 5.2 URL RTSP de Hikvision (convención)
```
Cámara/canal principal:  rtsp://<user>:<pass>@<ip>:554/Streaming/Channels/<canal>01
Sub-stream (verificación): rtsp://<user>:<pass>@<ip>:554/Streaming/Channels/<canal>02
```
Para NVR el canal es 1..N (`/Streaming/Channels/501` = canal 5 principal, `502` = sub). **Se usa el sub-stream** para verificar: menor bitrate, arranca más rápido, alcanza para confirmar. `rtsp_path` en `DispositivoCanal` permite override si el modelo no sigue la convención.

### 5.3 MediaMTX bajo demanda (reescritura de `VideoService`)
`getStreamUrl` real y seguro:

```ts
async getStreamForIncident(incidentId, tenantId, operador) {
  // 1) SEGURIDAD: el incidente y el dispositivo deben ser del tenant del operador
  const canal = await this.resolverCanalDelIncidente(incidentId, tenantId); // valida RLS
  const disp  = canal.dispositivo;

  const pathId = `t_${tenantId}/dev_${disp.id}/ch_${canal.numero_canal}`;    // namespaced por tenant
  const rtsp   = this.armarRtsp(disp, canal, /*sub*/ true);                  // credencial resuelta del secreto

  // 2) Alta ON-DEMAND en MediaMTX (no persistente)
  await axios.post(`${MEDIAMTX_API}/config/paths/add/${encodeURIComponent(pathId)}`, {
    source: rtsp,
    sourceOnDemand: true,               // se conecta al RTSP solo cuando alguien lo pide
    sourceOnDemandCloseAfter: '30s',    // se baja solo al dejar de mirar
  });

  // 3) URL que consume el operador — SIEMPRE proxeada por nuestra API con JWT,
  //    nunca el 8889/8888 de MediaMTX expuesto directo.
  return { whep: `/co/video/whep/${pathId}`, hls: `/co/video/hls/${pathId}`, canal: canal.nombre };
}
```

Puntos clave:
- **`sourceOnDemand`**: MediaMTX no toca la cámara hasta que el operador abre el player; la suelta a los 30 s de cerrarlo. Esta es la mayor ganancia de eficiencia.
- **Namespacing por tenant** en el nombre del path: imposible pedir el video de otro tenant.
- **Proxy autenticado**: el frontend nunca habla con MediaMTX directo. La API valida JWT + tenant y hace de reverse-proxy hacia WHEP/HLS. En producción, los puertos 8889/8888/9997 de MediaMTX **no se publican** (hoy el compose los expone — hay que cerrarlos y dejarlos solo en la red interna de Docker).

### 5.4 Snapshot instantáneo
```
GET /ISAPI/Streaming/channels/<canal>01/picture   → JPEG
```
Al ingerir el evento (§4.2) capturamos la foto y la subimos a MinIO (`snapshot_key`). El modal la muestra **inmediatamente**, sin esperar el video. Si el equipo ya mandó la `Picture` en el push, ni siquiera hay que pedirla.

### 5.5 PTZ y grabación (cerrar el stub)
- **PTZ** por ISAPI: `PUT /ISAPI/PTZCtrl/channels/<canal>/continuous` (pan/tilt/zoom con velocidad) y `/momentary`. Reemplaza el `sendPTZCommand` simulado.
- **Grabación de la verificación**: al abrir el incidente, `POST` a MediaMTX para grabar el path unos segundos, o descargar el clip por ISAPI Playback (`/ISAPI/ContentMgmt/download`) del tramo del evento. El clip queda adjunto al incidente como evidencia (disposición REAL/FALSA con respaldo).

---

## 6. Onboarding desde el modal de Equipamiento Electrónico

Convertir el botón estático "Nuevo Dispositivo" en un **wizard de 4 pasos**. Nuevos endpoints en `CentroOperacionesController`:

```
POST   /centro-operaciones/dispositivos                 # alta
POST   /centro-operaciones/dispositivos/probar          # test de conexión ISAPI (sin guardar)
POST   /centro-operaciones/dispositivos/:id/descubrir   # auto-descubrir canales
GET    /centro-operaciones/dispositivos/:id/canales
PUT    /centro-operaciones/dispositivos/:id
DELETE /centro-operaciones/dispositivos/:id             # soft-delete (deleted_at)
```

**Wizard:**
1. **Tipo y marca** — DVR / NVR / Cámara IP / Panel. Marca *Hikvision* → protocolo `ISAPI` (o `SIA_DC09` para la parte de alarma del panel).
2. **Conexión** — objetivo, IP, puertos, usuario, contraseña (se guarda como secreto cifrado → `secreto_ref`). Botón **"Probar conexión"**: pega a `/ISAPI/System/deviceInfo` con digest auth y muestra modelo/firmware reales. Si responde, verde; si no, error claro (timeout / credenciales / no es Hikvision).
3. **Descubrir canales** — llama a `/ISAPI/ContentMgmt/InputProxy/channels` (NVR) o `/ISAPI/Streaming/channels` (DVR/cámara) y crea los `DispositivoCanal`. El operador nombra cada canal ("Frente", "Depósito").
4. **Mapear zonas → cámaras y activar push** — para cada zona del panel se elige el canal que la verifica (`zona.canal_id`). El sistema configura el **Alarm Server** del equipo por ISAPI (`httpHosts`) apuntando a `/hik/eventos/<ingest_token>`, dejando el push andando sin tocar la web de Hikvision.

Al terminar, la fila del dispositivo en el modal muestra estado real (heartbeat), y "Modo Prueba (Walk-Test)" —que hoy es un botón muerto— pasa a marcar `en_prueba=true` en los eventos para no generar incidentes durante mantenimiento (el campo `Evento.en_prueba` ya existe en el schema).

---

## 7. Flujo end-to-end

```
1. Sensor/analítica dispara en el sitio del cliente
   → Panel AX PRO (zona) o cámara Hikvision (line crossing)

2a. Panel → SIA DC-09 → receptor TCP 9100        (ya existe)
2b. DVR/NVR/cámara → POST /hik/eventos/<token>    (nuevo; con snapshot)

3. Normalización → Evento (tipo, severidad, canal_numero, zona_id, snapshot_key, id_origen)

4. processEvent (SIN CAMBIOS): dedup → correlación → Incidente → gateway 'incident.new'

5. SOC Console recibe el incidente en vivo (Socket.IO)

6. Operador abre el ProtocoloIncidenteModal:
   - Ve el SNAPSHOT del instante del disparo al toque
   - El sistema resolvió zona/canal → botón "Ver cámara" abre el stream WHEP on-demand
     de EXACTAMENTE la cámara que disparó
   - MediaMTX levanta el path solo ahora; lo baja al cerrar

7. Operador verifica (método CAMARA con evidencia), despacha y cierra con disposición.
   El snapshot + clip quedan como respaldo del incidente.
```

---

## 8. Cambios concretos por capa (resumen accionable)

**Backend**
- Migración: `dispositivo_canales`, `zona.canal_id`, `evento.canal_numero`, `evento.snapshot_key` (con RLS en la tabla nueva).
- Módulo `hikvision/`: `hik.controller.ts` (receptor Alarm Server), `hik.service.ts` (resolver token, normalizar, snapshot ISAPI, configurar httpHosts), `hik-isapi.client.ts` (digest auth: deviceInfo, canales, PTZ, picture).
- Reescribir `VideoService`: on-demand MediaMTX + validación de tenant + PTZ/snapshot reales.
- `CentroOperacionesController`: CRUD de dispositivos + probar/descubrir + endpoints de video proxeados (WHEP/HLS con JWT).
- Corregir la resolución por `nro_abonado`/token a identificador **global único**.
- Secretos: tabla/servicio de credenciales cifradas (`secreto_ref`).

**Frontend**
- `DevicesPage`: wizard de alta (4 pasos), filtro real, acciones (editar/probar/eliminar/walk-test), estado por heartbeat.
- `ProtocoloIncidenteModal`: bloque de **video verificación** — snapshot inmediato + player WHEP de la cámara resuelta + PTZ si el canal lo soporta. El botón "Verifiqué cámara" pasa a exigir/registrar la evidencia real.
- Sección de mapeo zona↔canal en el detalle del objetivo.

**Infra**
- MediaMTX: **cerrar** los puertos públicos (8889/8888/9997) y dejarlo en la red interna; API como reverse-proxy autenticado. Habilitar grabación on-demand.
- (Opcional) endpoint público sólo para `/hik/eventos/*` detrás del proxy, con rate-limit.

---

## 9. Plan por fases

| Fase | Entregable | Resultado visible |
|---|---|---|
| **F1 — Onboarding** | CRUD de dispositivos + probar/descubrir ISAPI + wizard en `DevicesPage` | Se puede dar de alta un Hikvision real y ver sus canales y su estado |
| **F2 — Ingesta** | Módulo `hikvision`, Alarm Server, normalización, snapshot | Los eventos de Hikvision generan incidentes en el SOC, con foto |
| **F3 — Video verificación** | `VideoService` on-demand + proxy seguro + bloque de video en el modal | El operador ve *la* cámara que disparó, bajo demanda |
| **F4 — Mapeo y PTZ** | `zona.canal_id`, UI de mapeo, PTZ, grabación de evidencia | Verificación guiada por configuración + evidencia adjunta |
| **F5 — Endurecer** | Secretos cifrados, cierre de puertos MediaMTX, supervisión offline, walk-test | Producción segura y auditable |

Cada fase es desplegable de forma independiente y no rompe lo existente: Hikvision entra como **una fuente más** sobre el `processEvent` que ya funciona.

---

## 10. Por qué es la opción eficiente

- **Reusa el 100% del pipeline de eventos** (dedup, correlación, gateway). Hikvision solo agrega un normalizador.
- **Push + on-demand**: sin conexiones persistentes por cámara ni streaming permanente. Se consume CPU/ancho de banda solo de la cámara que disparó, mientras se la mira.
- **Snapshot-first**: verificación en <1 s en la mayoría de los casos, sin depender de que el WHEP negocie.
- **Multi-tenant seguro por diseño**: path namespaced + proxy con JWT + RLS, cerrando de paso el IDOR actual de `getStreamUrl`.
- **Estándar del fabricante**: ISAPI + RTSP + SIA son los caminos oficiales de Hikvision; nada de ingeniería inversa ni SDK propietario que ate el deploy.

---

*Documento de diseño. Deriva la taxonomía de eventos de `incidente-familias.ts` y el flujo del operador de `ProtocoloIncidenteModal.tsx`.*

---

## 11. Estado de implementación (F1–F4) ✅

Implementado en esta ronda. Falta solo **F5 — Endurecer** (cierre de puertos de MediaMTX, rotación de tokens, barrido de offline como job).

**Backend**
- Migración `20260707000000_hikvision_canales_video`: `dispositivo_canales`, `zona.canal_id`, `evento.canal_numero`/`snapshot_key`, `dispositivo.ingest_token` (único global), con RLS en la tabla nueva.
- `hikvision/hik-isapi.client.ts`: cliente ISAPI con **Digest auth** (sin dependencias) — deviceInfo, descubrir canales, snapshot (JPEG), PTZ continuo, configurar Alarm Server.
- `hikvision/hikvision.service.ts`: resolver token→dispositivo (admin/cross-tenant), normalizar push (XML/JSON) → taxonomía CustOS, captura y subida de snapshot a MinIO.
- `hikvision/hik.controller.ts`: receptor `POST /centro-operaciones/hik/eventos/:token` (multipart, **sin JWT**, procesa dentro del `TenantContext`).
- `common/crypto/secretos.service.ts`: cifrado AES-256-GCM de contraseñas de cámara.
- `centro-operaciones.service.ts`: CRUD de dispositivos, probar/descubrir, canales, mapeo zona→canal, walk-test; `processEvent` persiste canal/snapshot y **salta el incidente en modo prueba**.
- `video.service.ts` reescrito: resuelve la cámara del incidente (canal nativo o zona→canal), registra el path **on-demand** en MediaMTX, proxy WHEP, snapshot servido por la API y PTZ real. Path namespaceado por tenant.
- `video.controller.ts`: `stream/:id`, `whep/:id`, `snapshot/:id`, `ptz/:id`. `main.ts` suma parser de texto para SDP/XML.

**Frontend**
- `services/dispositivos.service.ts`: cliente tipado de todo lo anterior + WHEP + snapshot autenticado (blob).
- `DevicesPage.tsx`: datos reales, filtro real, y wizard de alta (`EquipamientoModals.tsx`) con probar conexión, descubrir canales y URL de Alarm Server; acciones de walk-test, canales/mapeo y borrado.
- `EquipamientoModals.tsx`: wizard de 3 pasos + modal de canales y **mapeo zona→canal**.
- `VideoPlayer.tsx` reescrito: **snapshot inmediato + vivo por WHEP** (WebRTC nativo) + PTZ.
- `ProtocoloIncidenteModal.tsx`: botón **"Ver cámara que disparó"** que abre el player dentro del protocolo.

**Verificación:** `tsc --noEmit` limpio (API y web), `nest build` y `vite build` OK, ESLint limpio en los archivos nuevos/tocados.

**Notas de despliegue / F5 pendiente**
- El vivo por WHEP requiere que MediaMTX publique candidatos ICE alcanzables por el navegador (`webrtcAdditionalHosts` + puertos UDP). En LAN/demo el snapshot funciona siempre; el vivo depende de esa config de red.
- Cerrar los puertos públicos de MediaMTX (8889/8888/9997) dejándolos solo en la red interna; la API ya hace de proxy.
- Configurar `APP_SECRET_KEY`, `MEDIAMTX_API`, `MEDIAMTX_WHEP` (ver `infra/.env.example`).
