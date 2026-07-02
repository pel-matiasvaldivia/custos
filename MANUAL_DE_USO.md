# Manual de uso — CustOS

Guía práctica de cada módulo de la plataforma: qué hace, cómo se usa desde la web y desde la app del vigilador, y qué automatiza. Pensado para onboarding de un cliente nuevo o para orientarse rápido en el producto. Para documentación técnica del repo, ver [README.md](./README.md).

**Roles**: `ADMIN`, `GERENCIA`, `SUPERVISOR`, `OPERADOR`, `COMPRAS`, `SUPERADMIN` (multi-empresa). Cada módulo indica qué roles lo operan cuando es relevante.

---

## 1. Comercial

### 1.1 Cotizaciones (`/quotes`)

Arma la propuesta comercial para un cliente antes de firmar contrato.

- El cotizador calcula la **dotación real** de cada puesto (factor ~4,2 vigiladores por puesto 24/7 — no 3, porque hay que cubrir francos, vacaciones y ausentismo) en vez de una cuenta simple de horas.
- Cada ítem puede ser horas-hombre, horas de vehículo o servicio especial, con costo por hora y margen configurables.
- **Calculadora HH → Cotizador**: desde Configuración → Calculadora HH se puede precargar un ítem directo en una cotización nueva con "Aplicar al cotizador", ya con el costo y el margen calculados.
- Genera el documento de la cotización (HTML/PDF) y guarda versiones históricas.

### 1.2 Clientes (`/clients`)

Alta y ficha de cada empresa cliente (razón social, CUIT, contactos). Los objetivos y contratos se vinculan a un cliente.

### 1.3 Objetivos (`/objectives`)

La ficha central de cada sede/predio que se custodia. Desde acá se configura casi toda la operación de ese lugar:

- **Datos generales y contrato vinculado.**
- **Puestos**: cada punto de guardia dentro del objetivo (con o sin arma, con o sin móvil).
- **Geoposición y área de cobertura**: mapa donde se fija el punto exacto del objetivo (click = ubicación) y, en modo "Área", se dibuja el polígono que cubre (click = agrega vértice del contorno; "Deshacer último" / "Limpiar polígono"). Esa área se ve como zona translúcida en el mapa del Centro de Operaciones — el operador ve de un vistazo el perímetro real, no solo un punto.
- **Puntos de control (rondas)**: se crean con nombre y, opcionalmente, coordenadas (botón "Aquí" toma la ubicación del navegador). Con coordenadas, el punto se marca **verde** en el mapa del SOC apenas el guardia lo escanea durante una ronda; sin marcar, queda gris.
- **Rondas del objetivo**: se arma una plantilla de ronda eligiendo, en orden, los puntos de control que hay que recorrer, con una **tolerancia** opcional en minutos. Si la ronda no se completa dentro de ese tiempo, se cierra sola como incompleta y dispara una alerta al Centro de Operaciones. Las rondas se editan (botón lápiz) o se dan de baja (papelera) sin perder el historial de ejecuciones ya cumplidas.
- **Dispositivo del objetivo**: si el objetivo opera con el modo "un celular por objetivo" (ver §5.2), acá se configura el PIN del dispositivo y, opcionalmente, el TAG NFC físico.
- **Dotación requerida**: calculada automáticamente a partir de la cobertura configurada por puesto (no una fórmula fija por objetivo).

### 1.4 Contratos

Se vinculan desde la ficha del objetivo o del cliente. Definen el modo de facturación (por planificado, por real, abono fijo), tarifa y condiciones. El contrato queda como el documento formal generado a partir de la cotización aceptada.

---

## 2. Operación

### 2.1 Cuadrante (`/quadrant`)

El motor de turnos.

- **Esquemas de turno**: patrones cíclicos (12×12, 24×48, etc.) reutilizables entre puestos.
- **Afectar vigilador a un puesto**: al asignar un vigilador a un puesto con un esquema, el sistema **genera automáticamente** los turnos planificados hacia adelante — no se cargan uno por uno.
- **Cobertura por puesto**: se configura la ventana horaria requerida (horas por día × días de la semana); de ahí sale la dotación requerida real que se muestra en la ficha del objetivo.
- El cuadrante detecta huecos de cobertura (puestos sin vigilador asignado en un horario) para corregirlos antes de que el cliente los note.

### 2.2 Personal (`/personnel`)

Legajos de vigiladores: datos personales, foto, **credenciales** (con alertas de vencimiento — carnet, psicofísico, antecedentes) y **herramientas asignadas** (equipamiento entregado, con historial de entrega/devolución). Acá también se configura el **PIN de acceso a la app móvil** de cada vigilador (login personal, ver §5.1) y el legajo (`legajo_nro`), que es la credencial que usa para loguearse.

### 2.3 Novedades (`/novedades`)

Registro de incidencias reportadas desde los puestos (por la app del guardia o cargadas manualmente desde la web): tipo, prioridad, descripción, y adjuntos (foto/audio) si vienen de la app.

- **Filtros**: por objetivo (acota automáticamente los puestos disponibles), puesto, vigilador, tipo, prioridad y rango de fechas, más búsqueda de texto libre.
- **Descargar reporte**: exporta a PDF el listado con los filtros aplicados en ese momento.
- El tipo "Adelanto de sueldo" impacta directamente en Liquidaciones (se descuenta en las cuotas configuradas).

### 2.4 Liquidaciones (`/liquidaciones`)

Cómputo de horas y montos a pagar por vigilador en un período, a partir de la asistencia real (check-in/check-out) y las novedades cargadas (ausencias, llegadas tarde, suspensiones, adelantos).

- Tres modos configurables por tenant: valor hora manual, básico de convenio, o solo cómputo de horas (sin montos).
- **Descargar reporte**: en el mismo panel donde está "Cerrar liquidación", un botón baja el PDF del período calculado (horas trabajadas/nocturnas/extra/ausentes y, si el modo tiene montos, bruto/descuentos/neto, con totales).
- "Cerrar liquidación" persiste el período y descuenta las cuotas de adelanto vigentes — no se puede deshacer.

### 2.5 Compras (`/compras`)

Solicitudes y órdenes de compra para gastos operativos, con flujo de aprobación por umbral de monto (rol `COMPRAS`/`GERENCIA`/`ADMIN`).

### 2.6 Herramientas (`/herramientas`)

Inventario de equipamiento (handies, chalecos, linternas) con trazabilidad de a quién se le entregó cada ítem y su estado.

### 2.7 Esquema de turnos / Cambios de turno (`/relevos`)

Bandeja de solicitudes de cambio de turno pedidas por los vigiladores desde la app móvil: el vigilador pide relevo con un motivo, y desde acá un supervisor lo aprueba (asignando quién cubre) o lo rechaza. La app del guardia **no deja marcar salida antes del horario de fin del turno planificado** — si necesita irse antes, la propia app lo deriva a este flujo de solicitud en vez de permitir el checkout.

---

## 3. Centro de Operaciones (`/monitoring`)

La consola SOC (Security Operations Center): monitoreo en vivo de alarmas, pánicos y eventos, con mapa y protocolo de atención.

### 3.1 Vista Grilla y Vista Mapa

- **Grilla**: incidentes activos agrupados por estado (Pendientes / En Atención / Verificando), ordenados por prioridad.
- **Mapa en vivo**: arranca centrado en el **domicilio del tenant** (configurable en Configuración → Ubicación — ya no cae en un punto por defecto de Buenos Aires). Muestra objetivos, puestos, guardias en funciones (posición GPS en vivo desde la app), vehículos, incidentes activos (pulsantes), las **áreas de cobertura** dibujadas por objetivo y los **puntos de control de rondas** (verde si el guardia ya los cubrió, gris si están pendientes).
- **Buscador**: filtra objetivos por nombre, código o dirección en vivo; al elegir uno, el mapa "vuela" hasta ahí (cambia automáticamente a vista Mapa si estabas en Grilla). Los objetivos sin geoposición configurada aparecen deshabilitados en el resultado, con el aviso "sin geo".

### 3.2 Protocolo de incidentes

Al hacer click en "Procesar" sobre cualquier incidente (o "Atender ahora" en uno nuevo) se abre un modal con el **protocolo guiado**, para que el operador siempre sepa qué hacer, sobre todo ante un pánico:

1. **Tomar**: el operador se hace cargo del incidente.
2. **Verificar**: registra cómo confirmó la situación (llamada al guardia, cámara, llamada al cliente, audio) con una nota.
3. **Despachar**: elige a quién se convocó (Policía, móvil propio, supervisor, emergencias médicas, bomberos) con detalle.
4. **Cerrar**: obligatorio elegir una disposición (evento real / falsa alarma / falla técnica / prueba / sin novedad) y un resumen.

Cada paso queda en una **bitácora** con hora y operador — trazabilidad completa de cómo se resolvió cada evento. El modal muestra además una guía de texto concreta según la prioridad (los pasos recomendados para un evento CRÍTICO vs. uno de prioridad ALTA).

### 3.3 Equipamiento (`/monitoring/devices`)

Estado de los dispositivos/paneles conectados vía el receptor SIA DC-09 (paneles de alarma, cercos, DVR/NVR).

---

## 4. Reportes (`/reports`)

Reportes agregados (PDF/Excel) sobre incidentes y otra información operativa, complementarios a los reportes puntuales que ya tienen Novedades y Liquidaciones.

---

## 5. Vigilancia Móvil — CustOS GO

La app del vigilador (PWA instalable, rutas `/mobile/*`). Tiene **dos modos de login** según cómo opere la empresa:

### 5.1 Modo personal (login por legajo + PIN)

Cada vigilador tiene su propio legajo y PIN (configurados desde su ficha en Personal). Se loguea individualmente en su propio celular y opera con su identidad durante toda la sesión.

### 5.2 Modo dispositivo — "un celular por objetivo"

Pensado para el caso típico de un solo celular compartido en el puesto (ej. la garita de un barrio privado), con varios vigiladores rotando turnos sobre ese mismo equipo:

- El celular se activa contra el **objetivo**, no contra una persona: con el **código del objetivo + PIN** (configurado en la ficha del objetivo → "Dispositivo del objetivo"), o acercando un **TAG NFC** físico pegado en el puesto (lectura vía Web NFC en navegadores compatibles).
- Los vigiladores asignados **no inician sesión individualmente**: al entrar a la app eligen su nombre en la pantalla **"¿Quién sos?"**, que lista a los guardias asignados a ese objetivo con el estado de su turno (en turno / próximo / sin turno).
- **Cambiar de guardia** en cualquier momento desde el header de la app, sin volver a activar el dispositivo — soporta que dos vigiladores del turno diurno y dos del nocturno se identifiquen por turno sobre el mismo celular.
- Cada acción (check-in, ronda, novedad, pánico) queda registrada con la identidad de quien la hizo en ese momento, validada contra los turnos asignados a ese objetivo.

### 5.3 Funciones disponibles en la app

- **Asistencia**: marcar entrada/salida con geolocalización. No se puede marcar salida antes del horario de fin del turno; si hace falta salir antes, la app deriva directo al formulario de solicitud de cambio de turno.
- **Rondas**: escaneo de QR de los puntos de control del objetivo, con evidencia de hora y ubicación en cada marca. Si la ronda tiene tolerancia configurada, un contador implícito la cierra sola si se pasa de tiempo.
- **Novedades**: carga de incidencias con foto y/o audio adjuntos, con tipo y prioridad.
- **Botón de pánico**: dispara un incidente crítico inmediato al Centro de Operaciones con la ubicación del dispositivo.
- **Solicitar cambio de turno**: pide relevo con un motivo; queda pendiente de aprobación en Esquema de turnos (§2.7).
- **Funciona offline**: las acciones críticas (check-in/out, pánico, rondas, novedades) se encolan localmente y se sincronizan solas al recuperar señal — el guardia sigue operando sin conexión.
- **Redirección automática**: si se entra al login de oficina desde un celular o tablet, se redirige directo al login de la app móvil (la mayoría de las veces quien entra desde un dispositivo móvil es un guardia, no un administrativo). Hay un link de escape ("Ingreso administración") para los casos que sí necesitan la oficina desde un dispositivo móvil.

---

## 6. Configuración (`/settings`)

- **Usuarios**: altas de usuarios de oficina y sus roles.
- **Costos**: parámetros de costo laboral usados por el cotizador.
- **Calculadora HH**: herramienta interna (no pública) para estimar rápido el costo de la hora-hombre y el precio a facturar con margen objetivo, a partir de los valores de la paritaria vigente. Tiene un botón para volcar el resultado directo a una cotización nueva.
- **Ubicación**: domicilio de la empresa — define dónde arranca centrado el mapa del Centro de Operaciones.
- **Catálogos**: listas configurables por tenant (tipos de novedad, etc.).
- **Contratos**: plantilla y datos que se usan al generar el documento de contrato.

---

## 7. Suscripción (`/suscripcion`)

Estado del plan del tenant (Trial / Activo / Vencido / Suspendido) y facturación de la suscripción a CustOS.

---

## 8. Onboarding guiado

Asistente de primeros pasos para un tenant nuevo (guía de inicio + coach marks contextuales la primera vez que se entra a cada módulo), pensado para que un usuario sin capacitación previa pueda cargar su operación sin ayuda externa.
