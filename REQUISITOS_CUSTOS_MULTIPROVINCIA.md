# CustOS multi-provincia — Requisitos para operar en cualquier jurisdicción argentina

> Investigación y especificación de requisitos. Fecha: julio 2026. Complementa `PLAN_PLATAFORMA_HABILITACION_MENDOZA.md` (lado estatal); este documento es el lado CustOS (lado empresa).

## 0. El hallazgo estructural

**No existe una ley nacional de seguridad privada.** El Decreto 1002/99 solo alcanza servicios interjurisdiccionales/federales; cada provincia y CABA regula la actividad con su propia ley, autoridad de aplicación, categorías de personal, plazos y libros obligatorios. La consecuencia para CustOS es doble:

1. **CustOS no es el sujeto regulado.** Ninguna norma exige homologar el software: la obligada es la empresa (el tenant). CustOS debe ser la herramienta que le permite *demostrar* cumplimiento en su jurisdicción — con dos excepciones parciales: libros digitales que requieren rúbrica/aceptación de la autoridad, y centros de monitoreo de alarmas donde la normativa alcanza a la infraestructura técnica.
2. **El cumplimiento no se puede hardcodear.** Lo que en PBA es "comunicar bajas dentro de las 48 hs" en otras jurisdicciones es 72 hs, o inmediato, o vía plataforma web propia. La única arquitectura viable es un **motor de reglas por jurisdicción**, no `if (provincia === 'mendoza')` desparramados.

## 1. Mapa normativo (jurisdicciones principales)

| Jurisdicción | Norma | Autoridad de aplicación | Particularidades relevantes para CustOS |
|---|---|---|---|
| **PBA** | Ley 12.297 + Dto. 1897/02 | Dir. Prov. p/ la Gestión de la Seg. Privada (Min. Seguridad) | Libro de personal con altas/bajas comunicadas en **48 hs**; libro de novedades por objetivo con personal, actividades y armas afectadas; acreditación anual de obligaciones previsionales |
| **CABA** | Ley 5688, Libro VI (+ ex Ley 1913) | Dir. Gral. de Seg. Privada (DGSPR) | Comunicación de movimientos en **72 hs**; libro de novedades **digital admitido**; registro público web; categorías propias (vigilador, bombero, custodio, etc.); regula centros de monitoreo |
| **Córdoba** | Ley 10.571 (ex 9236) + Dto. 1215/19 | Min. Seguridad — CiDi | **Registros en formato digital exigidos por ley**; Registro Público web consultable por ciudadanos en tiempo real; registro de vigiladores eventuales; uniformes/materiales aprobados |
| **Santa Fe** | Ley 14.420 (dic. 2025) | En reglamentación | Ley nueva de 70 artículos; incluye **gestión y regulación de alarmas** (alcanza al monitoreo); registro provincial obligatorio con personal, objetivos, armas y recursos técnicos |
| **Mendoza** | Ley 9578/24 + Dto. 264/25 | DISEP | Secundario completo o alumno regular; residencia 2 años; reentrenamiento c/5 años; registro obligatorio desde 5/2025 (ver plan hermano) |
| **Neuquén** | Ley prov. + plataforma 2026 | Dir. Seg. Privada | **Todo el trámite es online** (`seguridadprivada.neuquen.gov.ar`): altas/bajas de personal, objetivos georreferenciados, credencial digital — primer caso donde "cumplir" = integrarse o cargar en un sistema estatal |
| Resto (Salta, Río Negro, Tucumán, etc.) | Leyes propias | Policías/ministerios provinciales | Mismo patrón general con variaciones de plazos y categorías; relevar al entrar a cada mercado |

Transversales a todo el país: **CCT 507/07** (UPSRA–CAESI, laboral), **Ley 25.326** (datos personales), **ANMaC** (armas), **ARCA/AFIP** (fiscal-previsional, ya cubierto por CustOS), **Convenio Multilateral** (IIBB al facturar en varias provincias).

## 2. Requisitos funcionales para CustOS

### R1 — Motor de jurisdicciones (el requisito madre)

Nueva entidad `Jurisdiccion` + `ReglaJurisdiccional` parametrizable, asignable a tenant, objetivo y vigilador (un tenant puede operar en varias provincias a la vez; cada **objetivo** vive en una jurisdicción y esa es la que manda sobre el servicio que se presta ahí):

- Plazos de comunicación (alta personal, baja personal, alta/modificación de objetivo, novedades con armas).
- Categorías de personal habilitado propias de cada provincia (mapeadas a las categorías internas de CustOS).
- Vigencias y vencimientos: credencial, psicofísico, reentrenamiento, CLU de armas — con período por jurisdicción.
- Requisitos documentales del legajo por categoría y jurisdicción (checklist configurable).
- Datos de la autoridad de aplicación (nombre, formato de nota, canal: papel / email / plataforma web).

El motor produce dos cosas: **bloqueos** (no afectar al cuadrante un vigilador sin habilitación vigente *en la jurisdicción del objetivo*) y **tareas con vencimiento** (comunicar esta baja antes del jueves 14:00). Todo bloqueo debe tener override auditado con motivo, porque la realidad operativa siempre le gana al sistema.

### R2 — Legajo con habilitaciones multi-jurisdicción

El módulo Personal debe pasar de "credencial" singular a **N habilitaciones por vigilador** (provincia, categoría, número, estado, vencimiento, evidencia adjunta). Un vigilador puede estar habilitado en Mendoza y San Juan a la vez. Semáforo por jurisdicción en el legajo y en el cuadrante. Donde exista API estatal de padrón (Neuquén hoy, Mendoza si se construye el plan hermano), la habilitación se verifica automáticamente vía conector; donde no, se registra manualmente con alerta de vencimiento.

### R3 — Libros obligatorios con valor probatorio

CustOS ya registra novedades, personal y objetivos; falta darles **forma de libro legal**:

- **Libro de novedades por objetivo** (exigido en casi todas las provincias): las novedades + movimientos de personal + armas afectadas del objetivo, en registro **inmutable** — encadenamiento por hash, sellado de tiempo, sin edición destructiva (correcciones como contra-asiento) — exportable a PDF foliado con el formato que la autoridad inspecciona. CABA ya admite libro digital; Córdoba exige registros digitales; para provincias que aún exigen libro papel rubricado, el PDF foliado es el respaldo imprimible.
- **Libro de personal**: altas y bajas con fecha, categoría y constancia de comunicación a la autoridad.
- **Libro de objetivos/servicios**: objetivos protegidos con vigencia contractual, dotación y armas asignadas.
- **Libro de armas** (si el tenant opera armado): arma, CLU, asignación a objetivo/vigilador, movimientos.

Regla de diseño: los libros **se derivan** de los datos operativos que CustOS ya captura (cuadrante, novedades, legajos) — nunca son una segunda carga de datos.

### R4 — Comunicaciones a la autoridad de aplicación

Generador de presentaciones por jurisdicción: al producirse un hecho comunicable (alta, baja, nuevo objetivo, novedad con arma), CustOS crea la tarea con su plazo legal, genera la nota/formulario en el formato de esa provincia (plantillas parametrizables, pdfmake ya está en el stack) y registra la constancia de presentación (acuse, mail, número de expediente). Donde haya plataforma estatal con API o carga web, un conector por jurisdicción (patrón `RegulatorConnector`, mismo enfoque anticorrupción del plan Mendoza); mientras tanto, el modo mínimo es "nota generada + checklist de presentación + evidencia adjunta".

### R5 — Cumplimiento laboral CCT 507/07 (nacional, ya cerca)

El convenio es único en todo el país, así que esto no varía por provincia, pero es condición de venta en todas: jornadas de hasta 12 hs con descanso mínimo de 12 hs entre turnos y tope semanal de 48 hs (el motor de cuadrante debe validarlo, no solo permitir armarlo), divisores 25/200 para jornal/hora en liquidaciones, adicionales y actas salariales actualizables (CAESI–UPSRA firma actas semestrales), licencias especiales del convenio. Lo provincial aquí son solo las autoridades de trabajo ante las que se acredita (rúbrica de documentación laboral provincial).

### R6 — Datos personales (Ley 25.326) y tracking

- Inscripción de bases de datos: es obligación del tenant ante la AAIP, pero CustOS debe darle el inventario de datos que trata (legajos con datos sensibles: antecedentes, psicofísicos) y políticas de retención configurables.
- **Geolocalización del vigilador (CustOS GO) y video**: notificación y consentimiento del trabajador documentados en el legajo (jurisprudencia laboral exige aviso previo del monitoreo); el tracking debe poder limitarse al horario de servicio.
- Minimización en reportes al cliente final (el cliente ve que el puesto está cubierto, no el legajo del vigilador).

### R7 — Centro de monitoreo (seguridad electrónica)

CABA y la nueva ley de Santa Fe regulan expresamente el monitoreo de alarmas (habilitación del centro, registro de eventos, tiempos de respuesta). Para vender el Centro de Operaciones como "central de monitoreo" en esas jurisdicciones, CustOS necesita: registro de eventos de alarma inmutable y exportable, bitácora de operadores por turno, y parametrización de los reportes que la autoridad exige. Mismo motor de R1, dominio distinto.

### R8 — Fiscal multi-provincia (lado ERP)

Facturar servicios en varias provincias implica **Convenio Multilateral de IIBB**: el módulo de facturación/cotización debe registrar la jurisdicción de prestación de cada contrato para que el contador liquide coeficientes (alcanza con exponer el dato por objetivo y período, no liquidar IIBB dentro de CustOS en una primera etapa). Tasas municipales de seguridad e higiene: mismo tratamiento (dato disponible, cálculo afuera).

## 3. Arquitectura propuesta

```
apps/api/src/modules/compliance/
  jurisdiccion/        Catálogo de jurisdicciones + reglas versionadas (las reglas cambian: guardar vigencia)
  habilitaciones/      Habilitaciones por vigilador × jurisdicción, vencimientos, conectores de padrón
  libros/              Proyección de datos operativos → libros inmutables (hash chain) + export PDF foliado
  presentaciones/      Tareas comunicables con plazo, plantillas por jurisdicción, constancias
  connectors/          RegulatorConnector por provincia (Neuquén API, Mendoza futuro, resto manual-asistido)
```

- Las **reglas jurisdiccionales son datos, no código**: tabla versionada con vigencia (`valido_desde/hasta`), editable por nosotros como catálogo mantenido centralmente y sincronizado a los tenants — el mantenimiento normativo pasa a ser parte del servicio que se cobra (diferencial de venta enorme frente a software genérico).
- El **cuadrante consulta al motor** antes de confirmar una afectación (habilitación vigente en la jurisdicción del objetivo + descansos CCT); devuelve `OK | ADVERTENCIA | BLOQUEO(motivo)`.
- Los **libros son proyecciones append-only** de eventos que ya existen (novedad creada, vigilador afectado, arma asignada): un job BullMQ folia y encadena; nada nuevo que cargar.
- **Feature flags por jurisdicción** en el tenant: un tenant de Córdoba ve "Registro CiDi" y uno de Neuquén ve "Sincronizar con plataforma provincial".

## 4. Plan de implementación sugerido (orden por valor/esfuerzo)

1. **R5 (CCT 507/07 en el motor de cuadrante)** — nacional, afecta a todos los tenants actuales, riesgo laboral real de los clientes hoy. Sin dependencia externa.
2. **R1 + R2 (motor de jurisdicciones + habilitaciones múltiples)** — la base de todo lo demás; cargar como primeras jurisdicciones Mendoza, PBA, CABA y Córdoba (cubren la mayoría del mercado).
3. **R3 (libros legales)** — alto valor de venta ("pasá la inspección desde CustOS"), se apoya en datos ya capturados.
4. **R4 (presentaciones y plazos)** — convierte multas por comunicación tardía en tareas con alerta; empezar con plantillas PDF, conectores después.
5. **R6 (datos personales y consentimientos)** — rápido, mayormente campos en legajo + políticas de retención.
6. **R7 (monitoreo)** y **R8 (fiscal)** — al abrir esos mercados/casos de uso.

**Proceso permanente:** relevamiento normativo por provincia antes de habilitar cada jurisdicción en el catálogo (ficha estándar: norma, autoridad, categorías, plazos, libros, canal de presentación), y suscripción a boletines oficiales — las leyes de este sector están cambiando ahora mismo (Santa Fe dic. 2025, Neuquén mar. 2026, Mendoza 2024/25).

## 5. Qué NO hace falta

- **Homologar CustOS ante autoridad alguna**: no existe ese trámite; la habilitada es la empresa.
- **Liquidar IIBB/convenio multilateral dentro de CustOS** (etapa 1): basta exponer jurisdicción por contrato/objetivo.
- **Cubrir las 24 jurisdicciones de entrada**: el motor debe soportarlas, el catálogo se puebla mercado por mercado.

## 6. Fuentes principales

- PBA: Ley 12.297 y Dto. 1897/02 (mseg.gba.gov.ar — normativa Dir. Prov. Seg. Privada).
- CABA: Ley 5688 Libro VI (boletinoficial.buenosaires.gob.ar; texto en caesi.org.ar); registros públicos en buenosaires.gob.ar.
- Córdoba: Ley 10.571 (boletinoficial.cba.gov.ar) y reglamentación Dto. 1215/19 (SAIJ); Registro Público Digital en CiDi (prensa.cba.gov.ar).
- Santa Fe: Ley 14.420 (santafe.gob.ar/boletinoficial, dic. 2025).
- Mendoza: Ley 9578/24 y Dto. 264/25 (ver `PLAN_PLATAFORMA_HABILITACION_MENDOZA.md`).
- Neuquén: plataforma seguridadprivada.neuquen.gov.ar (neuqueninforma.gob.ar, 26/3/2026).
- Laboral: CCT 507/07 y actas salariales CAESI–UPSRA (upsra.org.ar).
- Nacional: Dto. 1002/99 (InfoLEG); Ley 25.326 de Protección de Datos Personales.
