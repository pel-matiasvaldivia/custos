# Prompt de construcción — UX guiada y carga masiva para maestros operativos

> **Cómo usar este documento.** Es un prompt de construcción complementario a `PROMPT_ARQUITECTONICO_ERP_SEGURIDAD.md`. Ese documento define el QUÉ (módulos, modelo de datos, API). Este define el CÓMO de la experiencia de alta/edición de los maestros operativos (Vigiladores, Objetivos/Puestos, Móviles, Herramientas/Equipos) para que un usuario sin capacitación previa pueda operar el sistema sin ayuda externa. Donde dice "DEBE" es obligatorio; donde dice "PUEDE" queda a criterio de implementación.

---

## 1. Diagnóstico — por qué este prompt existe

Auditoría del código actual (`apps/web/src/pages/personnel/VigiladorForm.tsx`, `apps/api/src/vigilante/dto/create-vigilante.dto.ts`, `apps/api/prisma/schema.prisma`) muestra el problema concreto:

- **Alta de vigilador hoy:** un modal único con 4 campos (`nombre`, `apellido`, `documento`, `legajo_nro`). Sin foto, sin domicilio, sin carga de credenciales, sin documentación digital. El usuario crea un legajo vacío y tiene que "saber" que después hay que ir a otra pantalla a cargar credenciales — si esa pantalla existe.
- **Sin almacenamiento de archivos:** no hay integración MinIO/S3 en el backend (`apps/api/src/**`), pese a que el documento arquitectónico la define en §4 y §13. No hay endpoint de upload, ni `FileInterceptor`, ni campo `foto_url`/`documento_url` en ningún modelo.
- **Sin domicilio en el legajo:** el modelo `Vigilador` (schema.prisma) no tiene domicilio, contacto de emergencia, ni teléfono.
- **Sin módulo de Herramientas/Equipos:** no existe el modelo ni el módulo. El alcance del MVP (§2 y §6 del prompt arquitectónico) habla de "equipo asignado" en el legajo pero no hay tabla ni pantalla.
- **Sin carga masiva en ningún módulo:** no hay endpoint ni componente de importación CSV/Excel en todo el repo (Vigiladores, Objetivos, Vehículos, Herramientas se cargan uno por uno).
- **Sin guía paso a paso:** todos los formularios son modales planos de una sola pantalla. No hay wizard, checklist de completitud, ni mensajes que orienten a un usuario que no sabe qué información necesita reunir antes de empezar.

Esto es el problema que hay que resolver. No es un defecto puntual de un campo: es la ausencia de un patrón de UX consistente para alta/edición de maestros, y la ausencia de la infraestructura de archivos y de importación masiva que ese patrón necesita.

---

## 2. Principios de UX obligatorios

1. **Wizard por pasos, no formulario monolítico.** Toda alta de una entidad con más de ~6 campos o con sub-recursos (credenciales, vencimientos, documentos) DEBE usar un wizard de pasos discretos con barra de progreso (`Paso 2 de 4 — Documentación`). Nunca un modal con scroll infinito.
2. **Guardado progresivo.** Cada paso del wizard DEBE persistir lo ya ingresado (crear el registro en estado `BORRADOR`/`INCOMPLETO` desde el paso 1) para que el usuario pueda abandonar y volver sin perder datos. El wizard nunca es "todo o nada" al final.
3. **El sistema explica qué reunir antes de pedirlo.** El primer paso de cada wizard DEBE mostrar una checklist de "qué vas a necesitar" (ej. "Para dar de alta a un vigilador vas a necesitar: foto reciente tipo carnet, domicilio actual, DNI escaneado o foto, carnet de vigilador provincial, certificado de antecedentes"). Esto resuelve el caso de uso explícito: el usuario no sabe qué hacer si no lo conoce.
4. **Ningún campo obligatorio sin ejemplo o ayuda inline.** Todo input DEBE tener `placeholder` realista o un ícono de ayuda (`?`) con tooltip explicando el formato esperado y por qué se pide.
5. **Indicador de completitud por registro.** Toda entidad de los maestros (vigilador, objetivo, vehículo, herramienta) DEBE mostrar en su listado y en su detalle un indicador visual de completitud (`Legajo completo` / `Falta documentación: 2 de 5`) calculado en backend, no solo en el cliente.
6. **Nada bloquea el alta básica.** Documentación y fotos son completables después; el alta mínima (datos identificatorios) SIEMPRE puede guardarse al toque, marcando el registro como incompleto. Lo que SÍ bloquea es la *operación* (asignar a un puesto, asignar a un objetivo) si falta lo crítico — la regla de bloqueo duro del prompt arquitectónico (§2 y §6, M2/M6) se mantiene intacta.
7. **Carga masiva con plantilla, previsualización y reporte de errores fila por fila.** Nunca "subí un CSV y rezá". Flujo obligatorio: descargar plantilla → completar → subir → preview de validación (qué filas entran, cuáles fallan y por qué, editable inline) → confirmar → resultado con contadores de éxito/error y reintento solo de las filas fallidas.
8. **Estado vacío (empty state) accionable.** Cuando un listado está vacío, el CTA principal DEBE ofrecer las dos vías: "Cargar uno" (wizard) y "Cargar varios" (importación masiva), no solo un botón genérico "Nuevo".
9. **Idioma y tono.** Igual que el resto del sistema: español rioplatense, profesional, sin jerga técnica. Mensajes de error explican qué pasó y qué hacer, nunca un código crudo (`ERR_VALIDATION_400`).

---

## 3. Patrón de wizard — especificación reusable

Construir un componente genérico `EntityWizard` (frontend, `apps/web/src/components/wizard/`) parametrizable por pasos, reusado por los 4 wizards de este documento (no reimplementar el wizard 4 veces).

```
<EntityWizard
  steps={[...]}
  draftEndpoint="/vigiladores"        // POST crea en estado INCOMPLETO al paso 1
  onComplete={...}
/>
```

Cada `step` define: título, descripción de ayuda, campos, validación, y si es opcional/saltable. El wizard persiste contra el backend al completar cada paso (`PATCH /vigiladores/:id` por paso), no junta todo en un solo `submit` final.

---

## 4. Vigiladores — wizard de alta

### Pasos

1. **Datos básicos** (obligatorio, ya existe parcialmente): nombre, apellido, documento, legajo (autogenerado, editable), fecha de nacimiento, género.
2. **Contacto y domicilio** (nuevo): domicilio actual (calle, número, localidad, provincia, CP), teléfono, contacto de emergencia (nombre + teléfono + vínculo). Campo de ayuda: "Necesitamos el domicilio actual para la liquidación de viáticos y para notificaciones urgentes."
3. **Foto** (nuevo): captura desde cámara (mobile/webcam) o subida de archivo. Recorte cuadrado tipo carnet. Sube a MinIO vía `POST /vigiladores/:id/foto` (`multipart/form-data`), guarda `foto_url`. Si se omite, el legajo queda marcado incompleto pero no bloquea el guardado.
4. **Documentación digital** (nuevo, repetible): por cada credencial requerida (carnet de vigilador provincial, apto psicofísico, certificado de antecedentes, ANMAC si aplica, capacitaciones) — tipo, número, organismo emisor, fecha de emisión, fecha de vencimiento, **y archivo adjunto** (PDF o foto, sube a MinIO vía `POST /vigiladores/:id/credenciales` con archivo). El sistema sugiere qué credenciales pedir según si el vigilador se va a asignar a puestos armados (campo "¿va a portar arma?" determina si pide ANMAC). Reusa el modelo `Credencial` existente, agregando `documento_url`.
5. **Resumen y confirmación**: checklist de completitud (qué se cargó, qué falta), botón "Finalizar" que pasa el legajo de `INCOMPLETO` a `ACTIVO` si todo lo obligatorio está, o lo deja `ACTIVO_INCOMPLETO` si falta algo no bloqueante.

### Cambios de modelo (Prisma)

```prisma
model Vigilador {
  // ...existentes...
  foto_url        String?
  domicilio       String?
  localidad       String?
  provincia       String?
  codigo_postal   String?
  telefono        String?
  contacto_emerg_nombre   String?
  contacto_emerg_telefono String?
  contacto_emerg_vinculo  String?
  completitud     String  @default("INCOMPLETO") // INCOMPLETO | COMPLETO
}

model Credencial {
  // ...existentes...
  documento_url String?
}
```

### Endpoints nuevos/ajustados

```
POST   /vigiladores                  # crea en estado INCOMPLETO con datos del paso 1
PATCH  /vigiladores/:id              # actualiza por paso (domicilio, contacto)
POST   /vigiladores/:id/foto         # multipart, sube a MinIO, guarda foto_url
POST   /vigiladores/:id/credenciales # ya existe; ampliar para aceptar archivo adjunto
GET    /vigiladores/:id/completitud  # devuelve checklist de qué falta
```

---

## 5. Objetivos y Puestos — wizard de alta

### Pasos

1. **Cliente y datos del objetivo**: cliente (existente o "crear cliente nuevo" inline sin salir del wizard), código (autogenerado), nombre, dirección con autocompletado de geolocalización (lat/lng ya existen en el modelo `Objetivo`), contacto in situ.
2. **Puestos del objetivo** (repetible, con botón "Agregar otro puesto"): nombre del puesto, ¿requiere arma?, ¿requiere móvil?, esquema horario — acá el wizard PUEDE ofrecer plantillas predefinidas (`12x12`, `24x48`, `8h fijo`) en lugar de pedir el JSON crudo de `esquema_horario`.
3. **Documentación del objetivo** (nuevo, opcional): plano o foto del sitio, contrato de servicio (PDF), contactos de emergencia del cliente (reusa `ContactoEmergencia` existente).
4. **Resumen**: muestra el cálculo preliminar de dotación necesaria por puesto (invocando el motor del cotizador, §6 M3 del prompt arquitectónico) para que el usuario vea de entrada cuántos vigiladores hacen falta antes de pasar a cuadrante.

---

## 6. Móviles (Flota) — wizard de alta + pantalla web faltante

El backend ya tiene el módulo `flota` (`apps/api/src/modules/flota/`) con `Vehiculo`, `VehiculoVencimiento`, `PlanMantenimiento`. **No existe ninguna pantalla en `apps/web` para este módulo** — es la brecha más grande de todas: hay lógica de dominio sin UI.

### Pasos del wizard

1. **Datos del vehículo**: patente, marca, modelo, año, tipo (`COMUN`/`BLINDADO`/`MOTO`), km actual.
2. **Vencimientos críticos**: VTV, seguro, patente, habilitación de caudales si aplica — cada uno con fecha de vencimiento y **foto/PDF de la cédula/póliza** (nuevo campo `documento_url` en `VehiculoVencimiento`).
3. **Plan de mantenimiento**: ofrecer plantillas (service cada 10.000 km, cada 6 meses) en vez de pedir los campos crudos.
4. **Resumen**: estado operativo, próximos vencimientos resaltados con semáforo (verde/amarillo/rojo según proximidad), igual semántica que las credenciales de personal.

### Nuevo

```prisma
model VehiculoVencimiento {
  // ...existentes...
  documento_url String?
}
```

Crear `apps/web/src/pages/flota/` con `FlotaPage.tsx` (listado con semáforo de vencimientos), `VehiculoForm.tsx` (wizard), `VehiculoDetail.tsx` (TCO, histórico de OTs, combustible — consume los endpoints que el prompt arquitectónico ya define en §8).

---

## 7. Herramientas / Equipos — módulo nuevo (no existe)

El prompt arquitectónico menciona "equipo asignado" en el legajo del vigilador (§6 M2) pero nunca lo modela. Si la empresa entrega radios, handies, chalecos, armas reglamentarias, linternas, etc., y necesita saber quién tiene qué, hace falta un módulo mínimo de inventario de herramientas con asignación a vigilador.

### Modelo nuevo

```prisma
model Herramienta {
  id          String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  tenant_id   String    @db.Uuid
  codigo      String    // HER-2026-0042
  tipo        String    // RADIO | HANDIE | CHALECO | ARMA | LINTERNA | OTRO
  descripcion String
  numero_serie String?
  estado      String    @default("DISPONIBLE") // DISPONIBLE | ASIGNADA | EN_REPARACION | BAJA
  foto_url    String?
  created_at  DateTime  @default(now()) @db.Timestamptz
  deleted_at  DateTime? @db.Timestamptz

  tenant      Tenant @relation(fields: [tenant_id], references: [id])
  asignaciones HerramientaAsignacion[]

  @@unique([tenant_id, codigo])
  @@map("herramientas")
}

model HerramientaAsignacion {
  id             String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  tenant_id      String    @db.Uuid
  herramienta_id String    @db.Uuid
  vigilador_id   String    @db.Uuid
  entregada_el   DateTime  @default(now()) @db.Timestamptz
  devuelta_el    DateTime?
  observaciones  String?

  herramienta Herramienta @relation(fields: [herramienta_id], references: [id])
  vigilador   Vigilador   @relation(fields: [vigilador_id], references: [id])

  @@map("herramienta_asignaciones")
}
```

### Wizard de alta

1. Tipo y descripción (con plantillas rápidas por tipo: radio, handie, chaleco, arma).
2. Número de serie + foto.
3. (Opcional) asignación inmediata a un vigilador.

### Endpoints

```
GET    /herramientas
POST   /herramientas
POST   /herramientas/:id/asignar      # body: { vigilador_id, observaciones }
POST   /herramientas/:id/devolver
GET    /vigiladores/:id/herramientas  # equipo en posesión del vigilador
```

Si el ítem es un arma de fuego, la asignación DEBE validar credencial ANMAC vigente del vigilador (mismo bloqueo duro que M2 del prompt arquitectónico).

---

## 8. Carga masiva — módulo transversal

Construir **un solo módulo reusable**, no cuatro implementaciones distintas. Backend: `apps/api/src/modules/importacion/`. Frontend: `apps/web/src/components/bulk-import/BulkImportWizard.tsx`.

### Flujo

1. **Descargar plantilla.** `GET /importacion/:entidad/plantilla` devuelve un `.xlsx` con columnas correctas, una fila de ejemplo y una hoja de "instrucciones" (qué valores acepta cada columna, ej. `tipo` solo admite `COMUN|BLINDADO|MOTO`).
2. **Subir archivo.** `POST /importacion/:entidad/validar` (multipart) — el backend parsea, valida fila por fila contra el DTO de creación de la entidad, y devuelve **sin persistir nada todavía**: `{ filas_validas: [...], filas_con_error: [{ fila, datos, errores }] }`.
3. **Preview editable.** El frontend muestra una tabla: filas válidas en verde, filas con error en rojo con el motivo al lado, editables inline antes de confirmar. El usuario puede corregir y re-validar sin volver a subir el archivo.
4. **Confirmar.** `POST /importacion/:entidad/confirmar` con las filas válidas (+ las corregidas) — persiste en una transacción por fila (una fila que falla no aborta las demás), devuelve contador final `{ creados, fallidos, errores: [...] }`.

### Entidades soportadas (MVP de este prompt)

`vigiladores`, `objetivos`, `vehiculos`, `herramientas`. Diseñar el módulo de forma que agregar una quinta entidad sea registrar un nuevo `ImportadorStrategy` (mapeo columna→DTO + validador), no escribir un controlador nuevo desde cero.

```typescript
interface ImportadorStrategy<TDto> {
  entidad: string;
  columnas: { nombre: string; requerido: boolean; ejemplo: string; ayuda: string }[];
  parsearFila(fila: Record<string, string>): TDto;
  validar(dto: TDto): string[]; // lista de errores, vacía si OK
}
```

### Reglas

- Límite razonable por archivo (ej. 500 filas) para evitar timeouts; si se supera, mensaje claro pidiendo dividir el archivo.
- Las filas importadas heredan `tenant_id` del usuario autenticado; nunca se acepta `tenant_id` desde el archivo.
- Documentos/fotos NO se cargan por esta vía (son por entidad, después, vía el wizard individual o edición masiva posterior) — la carga masiva es para datos estructurados, no archivos.
- Auditoría: cada importación queda registrada (quién, cuándo, cuántas filas, archivo origen) en el módulo de auditoría existente (`apps/api/src/modules/auditoria/`).

---

## 9. Infraestructura de archivos — prerequisito técnico

Ningún wizard de foto/documento funciona sin esto. Implementar antes o en paralelo:

1. Cliente MinIO en el backend (`apps/api/src/shared/storage/storage.service.ts`), con métodos `subir(buffer, key, contentType)` y `obtenerUrlFirmada(key)`. Las variables `MINIO_*` ya están previstas en `infra/.env.example` pero no usadas — conectarlas.
2. Endpoint genérico de upload reusado por todos los wizards: `POST /storage/upload` (multipart, `FileInterceptor`), devuelve `{ url, key }`. Restringir tipos de archivo (`image/jpeg`, `image/png`, `application/pdf`) y tamaño máximo (ej. 5 MB).
3. URLs firmadas con expiración para lectura (no exponer el bucket como público).
4. Validación de virus/contenido PUEDE diferirse a fase posterior; validar al menos tipo MIME real (no solo extensión) para evitar subida de ejecutables disfrazados.

---

## 10. Criterios de aceptación

1. Un usuario sin capacitación previa, partiendo de un tenant recién creado, puede dar de alta un vigilador completo (datos, domicilio, foto, credenciales con documento adjunto) siguiendo únicamente las instrucciones en pantalla, sin consultar a soporte.
2. El wizard de vigilador persiste el progreso: cerrar el navegador a mitad de camino y volver a entrar retoma desde donde quedó, con los datos ya guardados.
3. Existe pantalla web funcional para Flota (hoy ausente) con wizard de alta de vehículo, semáforo de vencimientos y vista de detalle con TCO.
4. Existe el módulo de Herramientas (modelo, API, wizard, asignación a vigilador) con bloqueo duro al asignar un arma sin credencial ANMAC vigente.
5. Carga masiva funcional para Vigiladores, Objetivos, Vehículos y Herramientas: plantilla descargable, preview con errores fila por fila, confirmación parcial (las filas válidas se crean aunque otras fallen), y reporte final.
6. Todo registro de los 4 maestros muestra un indicador de completitud calculado en backend, visible en listado y detalle.
7. Subida de fotos y documentos funciona end-to-end contra MinIO (no mocks), con URLs firmadas, y los archivos son recuperables desde el detalle de cada entidad.
8. Ningún wizard nuevo introduce una segunda implementación de wizard: todos reusan `EntityWizard` y `BulkImportWizard`.

---

## 11. Fuera de alcance de este prompt

- Reconocimiento óptico de documentos (OCR de DNI/carnet) — fase posterior.
- Firma digital de documentos cargados.
- Edición masiva (solo alta masiva está en este alcance; actualización masiva vía archivo queda para fase posterior).
- App móvil offline-first para captura de foto en campo sin conexión (la captura web/mobile-responsive alcanza para el MVP).
