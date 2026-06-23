# Prompt arquitectónico — M7: Centro de Operaciones (Central de Monitoreo / SOC)

> **Cómo usar este documento.** Es un prompt de construcción que **extiende** `PROMPT_ARQUITECTONICO_ERP_SEGURIDAD.md`. Hereda todas sus convenciones (multi-tenancy con RLS, idioma español rioplatense, numeración por tenant, soft-delete, auditoría, RBAC, stack base). Donde dice "DEBE" es obligatorio; donde dice "PUEDE" queda a criterio de implementación. Este módulo es **M7** y se ubica funcionalmente entre Operaciones (M4) y la plataforma transversal.

---

## 1. Contexto y objetivo

Las empresas de seguridad no solo venden vigilancia física: muchas operan (o quieren operar) una **central de monitoreo** que recibe, las 24 horas, los eventos de los sistemas de seguridad electrónica instalados en los objetivos de sus clientes. Hoy esto vive en software de central propietario (Softguard, SBN, Monitoring Tech, etc.), desconectado del ERP. CustOS lo absorbe.

**Objetivo del M7:** concentrar en un único tablero operativo, en tiempo real y multi-tenant, **todos los eventos** provenientes de:

1. **Paneles de alarma** (intrusión, fuego, pánico, coacción, apertura/cierre).
2. **Cercos eléctricos** (energizadores: corte, tamper, baja tensión).
3. **DVR / NVR y cámaras IP** (analítica de video, detección de movimiento, line-crossing, pérdida de video).
4. **Rondas de vigiladores** desde el móvil (checkpoints NFC/QR, GPS, botón de pánico, omisiones).
5. **Eventos del propio sistema** (falla de comunicación de un dispositivo, falta de supervisión, batería baja).

Y darle al operador un **flujo de atención completo**: clasificación, correlación, verificación (video/llamada), despacho (móvil propio o policía), cierre con disposición (real / falsa / técnica / prueba) y auditoría. Además, **permitir la configuración completa de los dispositivos electrónicos** (alta, parámetros de conexión, mapeo de zonas, supervisión, prueba).

### Tres verdades del dominio que el M7 DEBE respetar

1. **La ausencia de evento también es un evento.** Un panel que deja de "reportar presencia" (supervisión/heartbeat) es una falla crítica: alguien pudo haberlo saboteado. El sistema DEBE detectar silencios y generar `FALLA_COMUNICACION` automáticamente.
2. **La contraseña de coacción salva vidas.** El flujo de verificación telefónica DEBE distinguir contraseña normal de contraseña de coacción (duress); con coacción se confirma el robo sin alertar al delincuente.
3. **Cada segundo cuenta y cada acción se audita.** El tiempo de respuesta (evento → atención → despacho → resolución) es la métrica del negocio y la base de un eventual reclamo. Toda acción del operador DEBE quedar registrada con timestamp inmutable.

---

## 2. Tecnología recomendada (la mejor para este problema)

El M7 rompe el perfil CRUD del resto del ERP: es **ingesta de protocolos heterogéneos + alto volumen + tiempo real**. Se mantiene el principio de **monolito modular** para el dominio y la API, pero los **ingestores de protocolo corren como procesos separados** (el receptor de alarmas es un socket server de larga vida, no puede vivir dentro del HTTP API). Adiciones de infraestructura:

| Necesidad | Tecnología recomendada | Por qué esta y no otra |
|---|---|---|
| **Mensajería de dispositivos IoT y móvil** | **MQTT — broker EMQX** (Mosquitto si la escala es chica) | Estándar de facto IoT. Pub/sub liviano, QoS 0/1/2, *retained* + *last-will* (detecta dispositivo caído), autenticación y **ACL por dispositivo** (clave para multi-tenant: cada equipo solo publica en el tópico de su tenant). MQTT 5.0. Rule engine para puentear a Redis. Escala a millones de conexiones. |
| **Recepción de paneles de alarma** | **Receptor IP propio (TCP/UDP) que implementa SIA DC-09 + Contact ID** | Los paneles **no hablan HTTP ni MQTT**: hablan **Contact ID** (CID) transportado sobre **SIA DC-09** (ANSI/SIA DC-09-2013) por TCP/UDP, con ACK/NAK y AES-128 opcional. Es el lenguaje universal de las receptoras. Se implementa como microservicio Node (`net` sockets) con el parser del framing DC-09. |
| **Cerco eléctrico (energizador)** | **Adaptador por dispositivo**: zona en panel (vía DC-09) **o** módulo IP (Modbus/TCP, SNMP o HTTP) | Los energizadores reportan de dos formas: como zona de un panel, o por su propio módulo IP. El M7 abstrae ambas detrás de un `DeviceAdapter`. |
| **DVR / NVR / cámaras** | **ONVIF** (Events / PullPoint, Profile S y T) + **adaptadores de fabricante** (Hikvision ISAPI `alertStream`, Dahua HTTP) | ONVIF es el estándar abierto para suscribirse a eventos de analítica/movimiento. Donde ONVIF queda corto, el adaptador de fabricante da eventos más ricos. |
| **Video en vivo en la consola** | **MediaMTX** (ex rtsp-simple-server) o **go2rtc** para reempaquetar RTSP → **WebRTC** (latencia sub-segundo) y HLS de respaldo | **Nunca** pasar RTSP crudo por el API. WebRTC da verificación visual en tiempo real; el gateway de media desacopla las cámaras del backend. |
| **Almacén de eventos (alto volumen)** | **TimescaleDB** (extensión de PostgreSQL) | **La mejor decisión de fit**: es una extensión de Postgres → vive en la **misma** base, conserva **RLS, SQL y Prisma**, pero agrega *hypertables* para la tabla de eventos, *continuous aggregates* (eventos/hora por sitio, tasa de falsas alarmas), compresión y *retention policies* (purga automática de eventos crudos a los N meses). Cero base nueva que operar. |
| **Pipeline de tiempo real / backpressure** | **Redis Streams + BullMQ** (ya en el stack) | Los ingestores escriben el evento normalizado en un *stream*; un procesador consume, deduplica, correlaciona, persiste en Timescale y reenvía. BullMQ para jobs diferidos: auto-escalar si no se atiende en N min, timeout de heartbeat. |
| **Push a la consola del operador** | **WebSocket** (NestJS `@WebSocketGateway` con Socket.IO) o SSE | El tablero vive en tiempo real. *Rooms* por tenant (`tenant:{id}`), reconexión y presencia de operadores. |
| **Resumen de incidente (opcional)** | **Claude (`claude-sonnet-4-6`)** solo para *resumir* el caso al operador | La IA **nunca** decide despacho ni clasifica severidad por su cuenta; solo redacta el resumen del incidente y sugiere el próximo paso del SOP. La decisión es del operador; la clasificación es determinística. |

**Regla de oro de ingesta:** todo ingestor (DC-09, MQTT, ONVIF, adaptadores) hace **una sola cosa**: traducir su protocolo al **evento canónico** del §5 y publicarlo en el stream. Nada de lógica de negocio en el ingestor.

### Topología de procesos

```
                     ┌────────────────────────────────────────┐
  Paneles  ──DC-09──▶│ alarm-receiver  (TCP/UDP, AES)          │
  Cercos IP ─Modbus─▶│ device-poller   (Modbus/SNMP/HTTP)      │──┐
  DVR/NVR  ──ONVIF──▶│ cctv-connector  (ONVIF/ISAPI)           │  │
  Móvil/IoT ─MQTT───▶│ EMQX ─▶ mqtt-ingestor                   │  │
                     └────────────────────────────────────────┘  │
                                                                   ▼
                                            Redis Stream  "co:eventos:in"
                                                                   │
                                            ┌──────────────────────┘
                                            ▼
                              event-processor (normaliza→correlaciona→clasifica)
                                            │                       │
                                            ▼                       ▼
                                   TimescaleDB (eventos)     WebSocket Gateway
                                            │                       │
                                            ▼                       ▼
                                   API NestJS (módulo         Consola del operador
                                   centro-operaciones)        (React, tiempo real)
```

---

## 3. Alcance

### Dentro del alcance (M7)

- **Registro y configuración de dispositivos** (paneles, energizadores, DVR/NVR, cámaras, comunicadores, botones) con parámetros de conexión, credenciales cifradas, mapeo de zonas y supervisión.
- **Ingesta normalizada** de los 5 orígenes (§1) en tiempo real.
- **Tablero del operador** en vivo: cola de eventos accionables, mapa/lista de objetivos, estado de dispositivos en línea/fuera de línea.
- **Ciclo de vida del incidente**: atención → verificación → despacho → cierre con disposición, guiado por **procedimientos de actuación (SOP)** configurables por tipo de evento y por cliente.
- **Contactos de emergencia** por objetivo con orden de llamada y **contraseñas (normal y de coacción)**.
- **Programación horaria de armado/desarmado** por objetivo → alarma de "apertura/cierre fuera de horario".
- **Rondas** configurables (checkpoints NFC/QR con SLA de tiempo) y su ejecución desde el móvil del vigilador, con detección de checkpoints omitidos y botón de pánico.
- **Supervisión (heartbeat)**: detección de dispositivos que dejan de reportar.
- **Reportes**: tasa de falsas alarmas por objetivo, tiempo de respuesta, eventos por sitio, dispositivos en falla, cumplimiento de rondas.
- **Notificaciones** al cliente y a la empresa por los canales existentes (IN_APP / EMAIL / WHATSAPP).

### Fuera del alcance (fases posteriores)

- Grabación y almacenamiento de video (VMS) propio; el MVP **referencia** el stream del DVR/NVR, no lo graba.
- Audio bidireccional (hablar por la cámara).
- Integración directa con fuerzas policiales (911/CityBots); el MVP registra el despacho, no lo automatiza.
- Reconocimiento facial / patentes.

---

## 4. Principios de arquitectura (específicos del M7)

- **Ingestores tontos, dominio inteligente.** Los conectores traducen protocolo→evento canónico y nada más. La clasificación, correlación y SOP viven en servicios de dominio puros, testeables sin hardware.
- **Idempotencia.** Cada evento crudo trae un identificador de origen (`account + secuencia` en DC-09, `messageId` en MQTT). El procesador deduplica: un panel que reintenta no genera dos incidentes.
- **Correlación temporal por sitio.** Varias zonas del mismo objetivo en una ventana corta = un solo incidente con múltiples eventos (no diez incidentes). Apertura seguida de restauración en < N segundos = evento transitorio (auto-descartable según política).
- **La severidad es determinística.** Se deriva de una tabla de mapeo (código → tipo normalizado → severidad), nunca de un modelo de IA.
- **Multi-tenant hasta el dispositivo.** Cada dispositivo pertenece a un tenant y a un objetivo. El evento hereda `tenant_id` del dispositivo que lo emite; la autenticación del dispositivo (MQTT ACL, número de abonado del panel) ata físicamente el evento a su tenant. **Ningún evento puede cruzar tenants.**
- **Tiempo real con degradación elegante.** Si la consola pierde el WebSocket, al reconectar reconstruye el estado desde el API (los eventos no se pierden: están en Timescale y el stream).

---

## 5. Evento canónico (normalización)

Todo evento, venga de donde venga, se traduce a esta forma antes de entrar al pipeline:

```jsonc
{
  "tenant_id": "uuid",
  "objetivo_id": "uuid",            // sitio del cliente
  "dispositivo_id": "uuid",
  "zona_id": "uuid|null",           // zona física mapeada (si aplica)
  "ts_evento": "2026-06-22T03:14:00Z",
  "origen": "PANEL|CERCO|CCTV|RONDA|SISTEMA",
  "codigo_crudo": "E130",           // Contact ID / SIA / código de fabricante
  "tipo": "INTRUSION",              // taxonomía normalizada (ver tabla)
  "severidad": "CRITICA|ALTA|MEDIA|BAJA",
  "particion": "01|null",
  "usuario_panel": "005|null",      // quién armó/desarmó, si aplica
  "id_origen": "abonado+seq|msgId", // para idempotencia
  "crudo": { }                      // payload original completo (jsonb, auditoría)
}
```

### Taxonomía normalizada y mapeo Contact ID (representativo)

| `tipo` normalizado | Severidad | Contact ID (qualifier E=alarma, R=restauro) | Origen típico |
|---|---|---|---|
| `INTRUSION` | ALTA | E130 (robo), E131 (perímetro), E133 (24h) | Panel |
| `INTRUSION_VERIFICADA` | CRITICA | (correlación: intrusión + video analítica) | Panel+CCTV |
| `FUEGO` | CRITICA | E110, E111, E114 | Panel |
| `PANICO` | CRITICA | E120, E122 (silencioso) | Panel / botón |
| `COACCION` | CRITICA | E121 (duress) | Panel |
| `MEDICA` | CRITICA | E100 | Panel / botón |
| `CERCO_DISPARO` | ALTA | zona tipo CERCO o módulo energizador | Cerco |
| `CERCO_TAMPER` | MEDIA | E137 / módulo | Cerco |
| `TAMPER` | MEDIA | E137, E383, E384 | Panel / dispositivo |
| `FALLA_ENERGIA` | MEDIA | E301 (pérdida CA), E302 (batería baja), R301 (restauro) | Panel |
| `FALLA_COMUNICACION` | ALTA | E350/E354 o **timeout de supervisión** (generado por el sistema) | Sistema |
| `APERTURA` | BAJA | E401/E407 (disarm) | Panel |
| `CIERRE` | BAJA | R401/R407 (arm) | Panel |
| `APERTURA_FUERA_HORARIO` | MEDIA | (correlación: APERTURA fuera de `programacion_horaria`) | Sistema |
| `BYPASS_ZONA` | BAJA | E570 | Panel |
| `VIDEO_ANALITICA` | MEDIA | ONVIF: motion, line-crossing, intrusion; ISAPI events | CCTV |
| `VIDEO_PERDIDA` | MEDIA | ONVIF videoLoss | CCTV |
| `RONDA_CHECKPOINT` | BAJA | escaneo NFC/QR | Ronda |
| `RONDA_OMITIDA` | MEDIA | (SLA de checkpoint vencido) | Sistema |
| `RONDA_PANICO` | CRITICA | botón de pánico del móvil | Ronda |

> La tabla de mapeo es **dato configurable por tenant** (algunos paneles usan códigos no estándar). Se siembra con los códigos Contact ID/SIA estándar.

---

## 6. Configuración de dispositivos (requisito de primera clase)

El alta y la parametrización de los equipos electrónicos es central. Flujo y entidades:

- **`dispositivos`** — registro maestro. Tipos: `PANEL_ALARMA | ENERGIZADOR_CERCO | DVR | NVR | CAMARA_IP | COMUNICADOR | BOTON_PANICO`. Cada uno con `protocolo` (`SIA_DC09 | CONTACT_ID | ONVIF | ISAPI | DAHUA | MQTT | MODBUS | SNMP | HTTP`), `marca`, `modelo`, `objetivo_id`, `nro_abonado` (para paneles), `params` (jsonb: ip, puerto, usuario, ref a secreto, clave AES ref, intervalo de supervisión), `estado` (`EN_LINEA | FUERA_DE_LINEA | EN_FALLA | DESHABILITADO`), `ultimo_latido`.
- **`zonas`** — mapeo por dispositivo: `numero_zona`, `descripcion` (ej. "PIR Living", "Sensor portón"), `tipo` (`ROBO | FUEGO | PANICO | TAMPER | TECNICA | CERCO | APERTURA`), `particion`, `puesto_id` (opcional, ata la zona a un puesto físico de M4).
- **Onboarding guiado:** alta del dispositivo → asignación a objetivo → mapeo de zonas → **modo prueba (walk-test)**: durante una ventana, los eventos entran marcados como `EN_PRUEBA` y no generan incidentes ni notifican, para validar la instalación.
- **Supervisión/heartbeat:** por dispositivo se define un intervalo esperado de "presencia". Un job (BullMQ) marca `FUERA_DE_LINEA` y genera `FALLA_COMUNICACION` si el equipo no reporta dentro de la ventana + tolerancia.
- **Secretos:** credenciales de dispositivos y claves AES de DC-09 se guardan cifradas (referencia a secreto; nunca en texto plano en `params`). API keys/credenciales nunca al frontend.

---

## 7. Máquinas de estado

| Entidad | Estados |
|---|---|
| Incidente | `NUEVO → EN_ATENCION → VERIFICANDO → DESPACHADO → RESUELTO` / `AUTODESCARTADO` |
| Disposición de cierre (al RESUELTO) | `REAL` / `FALSA` / `TECNICA` / `PRUEBA` / `SIN_NOVEDAD` |
| Dispositivo | `EN_LINEA ↔ FUERA_DE_LINEA`, `EN_FALLA`, `DESHABILITADO` |
| Partición/área de objetivo | `ARMADA ↔ DESARMADA` (derivada de aperturas/cierres) |
| Ejecución de ronda | `EN_CURSO → COMPLETADA` / `INCOMPLETA` (checkpoints omitidos) |

Prioridad de atención de la cola: `CRITICA` antes que `ALTA` antes que `MEDIA` antes que `BAJA`; dentro de cada nivel, FIFO por `ts_evento`. Un incidente `CRITICA` sin tomar en N segundos **escala** (notifica al supervisor).

---

## 8. Modelo de datos (DDL representativo, PostgreSQL + TimescaleDB)

Aplican las reglas comunes del prompt base (`id`, `tenant_id`, timestamps, soft-delete, `created_by`/`updated_by`) y **RLS por `tenant_id` en todas las tablas**.

```sql
-- Dispositivos electrónicos
create table dispositivos (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id),
  objetivo_id uuid not null references objetivos(id),
  tipo text not null,            -- PANEL_ALARMA | ENERGIZADOR_CERCO | DVR | NVR | CAMARA_IP | COMUNICADOR | BOTON_PANICO
  protocolo text not null,       -- SIA_DC09 | CONTACT_ID | ONVIF | ISAPI | DAHUA | MQTT | MODBUS | SNMP | HTTP
  marca text, modelo text,
  nro_abonado text,              -- cuenta del panel (clave para atar eventos DC-09)
  params jsonb not null default '{}', -- ip, puerto, usuario, secreto_ref, aes_key_ref, supervision_seg
  estado text not null default 'FUERA_DE_LINEA',
  ultimo_latido timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (tenant_id, nro_abonado)
);

create table zonas (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id),
  dispositivo_id uuid not null references dispositivos(id),
  numero_zona text not null,
  descripcion text not null,
  tipo text not null,            -- ROBO | FUEGO | PANICO | TAMPER | TECNICA | CERCO | APERTURA
  particion text,
  puesto_id uuid,                -- opcional, ata a un puesto físico (M4)
  unique (tenant_id, dispositivo_id, numero_zona)
);

-- Eventos: HYPERTABLE de Timescale (alto volumen)
create table eventos (
  id uuid not null default gen_random_uuid(),
  tenant_id uuid not null,
  objetivo_id uuid not null,
  dispositivo_id uuid not null,
  zona_id uuid,
  ts_evento timestamptz not null,
  origen text not null,          -- PANEL | CERCO | CCTV | RONDA | SISTEMA
  codigo_crudo text,
  tipo text not null,            -- taxonomía normalizada
  severidad text not null,       -- CRITICA | ALTA | MEDIA | BAJA
  particion text,
  usuario_panel text,
  id_origen text,                -- idempotencia (abonado+seq | msgId)
  en_prueba boolean not null default false,
  incidente_id uuid,             -- se completa al abrir/asociar incidente
  crudo jsonb not null default '{}',
  primary key (id, ts_evento)
);
-- select create_hypertable('eventos','ts_evento');
-- compresión + retención de crudos (ej. 6 meses) vía Timescale policies.
create index on eventos (tenant_id, objetivo_id, ts_evento desc);
create unique index on eventos (tenant_id, dispositivo_id, id_origen, ts_evento); -- dedupe

-- Incidentes (casos accionables)
create table incidentes (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id),
  objetivo_id uuid not null references objetivos(id),
  codigo text not null,          -- INC-2026-0042
  tipo text not null,            -- tipo del evento disparador
  severidad text not null,
  estado text not null default 'NUEVO',
  operador_id uuid,              -- usuario que atiende
  sop_id uuid,                   -- procedimiento aplicado
  abierto_el timestamptz not null default now(),
  tomado_el timestamptz,
  despachado_el timestamptz,
  resuelto_el timestamptz,
  disposicion text,              -- REAL | FALSA | TECNICA | PRUEBA | SIN_NOVEDAD
  resumen text,                  -- redactado por operador (o asistido por IA)
  unique (tenant_id, codigo)
);

-- Bitácora del incidente (acciones del operador, inmutable/auditable)
create table incidente_bitacora (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id),
  incidente_id uuid not null references incidentes(id),
  ts timestamptz not null default now(),
  actor_id uuid,
  accion text not null,          -- VERIFICACION_VIDEO | LLAMADA_CONTACTO | DESPACHO_MOVIL | AVISO_POLICIA | NOTA | CIERRE
  detalle jsonb not null default '{}'
);

-- Procedimientos de actuación (SOP) configurables
create table procedimientos (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id),
  nombre text not null,
  aplica_a jsonb not null,       -- {tipos:["INTRUSION"], cliente_id?, objetivo_id?}
  pasos jsonb not null,          -- [{orden, accion, instruccion, obligatorio}]
  activo boolean not null default true
);

-- Contactos de emergencia por objetivo
create table contactos_emergencia (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id),
  objetivo_id uuid not null references objetivos(id),
  orden int not null,
  nombre text not null,
  telefono text not null,
  password_normal text,          -- contraseña de verificación (hash)
  password_coaccion text,        -- contraseña de coacción/duress (hash)
  rol text                       -- TITULAR | ENCARGADO | EMERGENCIAS
);

-- Programación horaria de armado/desarmado esperado
create table programacion_horaria (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id),
  objetivo_id uuid not null references objetivos(id),
  particion text,
  dia_semana int not null,       -- 1..7
  abre_esperado time, cierra_esperado time,
  tolerancia_min int not null default 15
);

-- Rondas y su ejecución (extiende rondas de M4)
create table rondas (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id),
  objetivo_id uuid not null references objetivos(id),
  nombre text not null,
  checkpoints jsonb not null,    -- [{orden, etiqueta, tag_nfc|qr, sla_min}]
  activa boolean not null default true
);

create table ronda_ejecuciones (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id),
  ronda_id uuid not null references rondas(id),
  vigilador_id uuid not null,
  inicio timestamptz not null default now(),
  fin timestamptz,
  estado text not null default 'EN_CURSO',  -- EN_CURSO | COMPLETADA | INCOMPLETA
  escaneos jsonb not null default '[]'      -- [{checkpoint, ts, lat, lng, foto_ref}]
);
```

> Habilitar RLS en todas: `using (tenant_id = current_setting('app.tenant_id')::uuid)`. La `eventos` es hypertable; la RLS aplica igual sobre la hypertable.

---

## 9. Diseño de API (REST, prefijo `/api/v1`) + tiempo real

```
# Dispositivos y configuración
GET    /dispositivos?objetivo=&tipo=&estado=
POST   /dispositivos
PATCH  /dispositivos/:id
POST   /dispositivos/:id/zonas
POST   /dispositivos/:id/prueba          # inicia walk-test (ventana en minutos)
GET    /dispositivos/:id/salud           # último latido, estado de supervisión

# Eventos (consulta histórica; el vivo va por WebSocket)
GET    /eventos?objetivo=&desde=&hasta=&tipo=&severidad=
POST   /eventos/test                      # inyecta evento sintético (debug/cap.)

# Incidentes (ciclo de vida)
GET    /incidentes?estado=&severidad=
POST   /incidentes/:id/tomar              # NUEVO -> EN_ATENCION (asigna operador)
POST   /incidentes/:id/verificar          # registra verificación (video/llamada + password)
POST   /incidentes/:id/despachar          # despacho móvil (M6/M1) o policía
POST   /incidentes/:id/resolver           # -> RESUELTO + disposicion
POST   /incidentes/:id/nota               # bitácora
GET    /incidentes/:id/sop                # pasos del procedimiento aplicable

# Configuración operativa
GET/POST  /procedimientos
GET/POST  /objetivos/:id/contactos-emergencia
GET/POST  /objetivos/:id/programacion-horaria

# Rondas
GET/POST  /rondas
POST   /rondas/:id/ejecuciones            # inicia ronda (móvil)
POST   /ronda-ejecuciones/:id/escaneo     # checkpoint NFC/QR + GPS + foto
GET    /rondas/cumplimiento?objetivo=&periodo=

# Reportes
GET    /centro-operaciones/tablero        # snapshot: colas, dispositivos online, KPIs
GET    /reportes/falsas-alarmas?objetivo=&periodo=
GET    /reportes/tiempo-respuesta?periodo=

# Tiempo real (WebSocket, namespace /co)
#   server -> client: evento.nuevo, incidente.actualizado, dispositivo.estado
#   client -> server: suscribir(objetivos[]), tomar(incidente)
```

---

## 10. Integración con módulos existentes

- **M4 Operaciones:** los dispositivos cuelgan de `objetivos`; las zonas pueden atarse a `puestos`. El libro de novedades de M4 recibe una entrada cuando un incidente se cierra como `REAL`.
- **M1 Cuadrante + M2 Personal:** el **despacho** sugiere el vigilador/móvil de guardia más cercano al objetivo (quién está en turno según el cuadrante, con credenciales vigentes). Las **rondas** las ejecuta el vigilador desde el móvil que ya usa para fichar (GEO/QR/NFC).
- **M6 Flota:** el despacho de un móvil registra el uso; el costo del móvil puede imputarse al servicio de monitoreo.
- **Notificaciones (plataforma):** los incidentes notifican por IN_APP / EMAIL / WHATSAPP usando el worker existente. El cliente recibe aviso de evento real; la empresa, de escalamientos.
- **WhatsApp:** el asistente puede informar al cliente "se registró apertura en tu local fuera de horario" y permitir que confirme con su contraseña.
- **M3 Comercial / Rentabilidad:** el monitoreo es un servicio facturable (abono mensual por objetivo monitoreado); alimenta el contrato y la rentabilidad como una línea más.

---

## 11. Seguridad, multi-tenancy y RBAC

- **Autenticación de dispositivos:** MQTT con credenciales y **ACL por dispositivo** (cada equipo solo publica en `t/{tenant_id}/...`). Paneles identificados por `nro_abonado` único por tenant; DC-09 con **AES-128** donde el panel lo soporte. Un evento cuyo abonado/credencial no matchea un dispositivo registrado se descarta y se loguea.
- **Aislamiento:** RLS por `tenant_id` en eventos, incidentes y configuración; el `tenant_id` del evento se deriva del dispositivo, no del payload. Tests que verifiquen que el operador del tenant A no ve eventos del tenant B.
- **Nuevo rol:** `OPERADOR_MONITOREO` (atiende incidentes, no ve costos). `SUPERVISOR` recibe escalamientos. Configuración de dispositivos y SOP: `ADMIN` / `GERENCIA`.
- **Auditoría inmutable:** toda acción sobre un incidente (tomar, verificar, despachar, resolver) va a `incidente_bitacora` con actor y timestamp. No se borra ni edita.
- **Contraseñas de contacto** (normal/coacción) almacenadas con hash; la de coacción nunca se muestra como tal al operador (el sistema solo indica "coacción detectada").
- **Secretos** de dispositivos cifrados; nunca al frontend.

---

## 12. Adiciones a Docker Compose

```yaml
  # Broker MQTT para dispositivos IoT y móvil
  emqx:
    image: emqx/emqx:5
    ports: ["1883:1883", "8883:8883", "18083:18083"]   # mqtt, mqtts, dashboard
    volumes: ["emqxdata:/opt/emqx/data"]

  # Receptor de paneles de alarma (SIA DC-09 / Contact ID)
  alarm-receiver:
    build: ./apps/api
    command: ["node", "dist/apps/api/src/centro-operaciones/receivers/dc09.js"]
    env_file: .env
    ports: ["9100:9100/tcp", "9100:9100/udp"]
    depends_on: [redis, postgres]

  # Conector CCTV (ONVIF / ISAPI) y poller de dispositivos IP
  cctv-connector:
    build: ./apps/api
    command: ["node", "dist/apps/api/src/centro-operaciones/connectors/cctv.js"]
    env_file: .env
    depends_on: [redis]

  # Gateway de media: RTSP -> WebRTC/HLS para video en vivo
  mediamtx:
    image: bluenviron/mediamtx:latest
    ports: ["8554:8554", "8889:8889", "8189:8189/udp"]  # rtsp, webrtc, ice

  # TimescaleDB: usar imagen con la extensión, o CREATE EXTENSION en postgres 16
  # postgres:
  #   image: timescale/timescaledb:latest-pg16
```

Variables de entorno nuevas: `MQTT_URL`, `MQTT_APP_USER/PASS`, `DC09_PORT`, `DC09_AES_DEFAULT_KEY`, `MEDIAMTX_URL`, `ONVIF_DISCOVERY_SUBNET`, `CO_EVENT_STREAM` (nombre del Redis Stream), `CO_SUPERVISION_TOLERANCIA_SEG`.

---

## 13. Estructura del repositorio (extensión)

```
/apps/api/src/modules/centro-operaciones
  /dispositivos          # registro y configuración de equipos
  /eventos               # normalización, taxonomía, persistencia (Timescale)
  /incidentes            # ciclo de vida, SOP, bitácora, despacho
  /rondas                # rondas y ejecuciones desde el móvil
  /receivers             # alarm-receiver DC-09/Contact ID (proceso separado)
  /connectors            # cctv (ONVIF/ISAPI), device-poller (Modbus/SNMP/HTTP)
  /ingest                # mqtt-ingestor, event-processor (stream -> dominio)
  /realtime              # WebSocket gateway (@WebSocketGateway /co)
  /reportes              # falsas alarmas, tiempo de respuesta, cumplimiento rondas
/apps/web/src/pages
  /centro-operaciones    # consola del operador (tablero en vivo, incidente, dispositivos)
```

---

## 14. Criterios de aceptación del M7

1. **Alta y configuración** de un panel de alarma con su `nro_abonado`, mapeo de zonas y modo prueba; los eventos en prueba no generan incidentes.
2. **Ingesta de panel:** un evento Contact ID `E130` del abonado registrado entra por el receptor DC-09, se normaliza a `INTRUSION/ALTA`, se persiste y aparece en la consola en vivo (< 2 s).
3. **Idempotencia:** el reintento del mismo evento (mismo `id_origen`) no crea un segundo incidente.
4. **Correlación:** tres zonas del mismo objetivo en 30 s generan **un** incidente con tres eventos asociados.
5. **Supervisión:** un dispositivo que deja de reportar más allá de su ventana genera `FALLA_COMUNICACION` automático y queda `FUERA_DE_LINEA`.
6. **Ciclo de incidente:** tomar → verificar (con contraseña; coacción detectada marca el caso como crítico) → despachar móvil de guardia (sugerido desde el cuadrante) → resolver con disposición; toda acción queda en bitácora.
7. **CCTV:** un evento de analítica ONVIF de un NVR registrado entra como `VIDEO_ANALITICA`; correlacionado con una intrusión, eleva a `INTRUSION_VERIFICADA/CRITICA`.
8. **Cerco eléctrico:** un disparo de energizador (zona CERCO o módulo IP) genera `CERCO_DISPARO/ALTA`.
9. **Rondas:** el vigilador inicia una ronda desde el móvil, escanea checkpoints NFC/QR con GPS; un checkpoint no escaneado dentro del SLA genera `RONDA_OMITIDA`; el botón de pánico genera `RONDA_PANICO/CRITICA`.
10. **Multi-tenant:** un operador del tenant A no ve ningún evento, incidente ni dispositivo del tenant B (test automatizado).
11. **Apertura fuera de horario:** un desarmado fuera de la `programacion_horaria` del objetivo genera `APERTURA_FUERA_HORARIO/MEDIA`.
12. **Reportes:** tasa de falsas alarmas por objetivo y tiempo medio de respuesta del período.

---

## 15. Fases sugeridas de construcción

- **Fase A — Núcleo de eventos:** modelo de datos + Timescale, evento canónico, taxonomía, `event-processor`, persistencia, WebSocket y consola básica (cola de eventos en vivo).
- **Fase B — Paneles:** receptor DC-09/Contact ID, registro de dispositivos y zonas, supervisión/heartbeat, idempotencia y correlación.
- **Fase C — Incidentes:** ciclo de vida, SOP, contactos de emergencia, despacho (integración M1/M6), bitácora y notificaciones.
- **Fase D — CCTV y cerco:** conector ONVIF/ISAPI, gateway de media (WebRTC), adaptadores de energizador; correlación video↔alarma.
- **Fase E — Rondas y reportes:** rondas desde el móvil (MQTT), cumplimiento, programación horaria, tablero de KPIs y reportes.

---

> **Regla transversal heredada:** la IA nunca clasifica severidad, nunca decide despacho y nunca cierra un incidente. El operador decide; el sistema clasifica de forma determinística; Claude, a lo sumo, **resume** el caso y sugiere el próximo paso del SOP ya definido.
