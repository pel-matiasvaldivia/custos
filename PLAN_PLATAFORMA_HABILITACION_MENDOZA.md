# Plan de acción — Plataforma de habilitación de vigiladores para Mendoza (DISEP)

> Documento de investigación y plan. Fecha: julio 2026. Complementa a CustOS: la plataforma aquí descripta es el **lado estatal** (registro/habilitación) y CustOS es el **lado empresa** (operación). El puente entre ambos es una API pública de padrón.

---

## 1. El problema

En Mendoza, la habilitación de vigiladores privados la otorga la **DISEP** (Dirección de Seguridad Privada, Ministerio de Seguridad y Justicia), creada por la **Ley 9578/24** y su **Decreto Reglamentario 264/25**, que reemplazó al viejo REPAR/REPRIV. Desde el 20/5/2025 es obligatorio que las empresas estén registradas en DISEP.

Hoy el trámite es esencialmente manual:

- Los requisitos se publican como **PDFs** en mendoza.gov.ar (versiones 2020, 2022, 2025).
- Las consultas se atienden por **WhatsApp (261 2779309) y mail (disep@mendoza.gov.ar)**.
- El listado de empresas habilitadas se publica como **PDF estático**.
- No hay padrón consultable en línea de vigiladores habilitados, ni API, ni credencial digital verificable.

Consecuencias: las empresas no saben en tiempo real si un candidato está habilitado o en condiciones de habilitarse; DISEP re-verifica a mano documentación que otros organismos ya tienen digitalizada (identidad, antecedentes, títulos); los clientes finales no pueden verificar que el vigilador que custodia su objetivo esté habilitado; y hay incentivo al trabajo informal/no habilitado (el propio gobierno advirtió públicamente sobre empresas no habilitadas).

## 2. Requisitos legales que la plataforma debe verificar (Ley 9578 + Dto. 264/25)

Por vigilador:

| Requisito | Fuente de verdad | ¿Verificable digitalmente hoy? |
|---|---|---|
| Identidad, edad ≥ 18, DNI vigente | **RENAPER** | Sí — API SID (Sistema de Identidad Digital): validación de DNI, ejemplar vigente, biometría facial. Requiere convenio (organismos públicos) o contrato (privados homologados) |
| Sin condenas por delitos dolosos / DDHH | **Registro Nacional de Reincidencia (RNR)** | Parcial — el CAP se emite 100% online, PDF con firma digital y verificación en `dnrec.jus.gov.ar/ConsultaCAP`. Para consulta directa hace falta **convenio interadministrativo** RNR–Provincia (existen precedentes con provincias) |
| Secundario completo | Títulos digitales (Res. CFE 440/23: desde 11/2023 todos los títulos secundarios se emiten solo en digital, con QR) + registros jurisdiccionales | Sí para títulos ≥ 2017–2023 (verificación por QR / consulta de validez nacional); títulos viejos requieren carga manual + validación documental |
| Alternativa: alumno regular | **DGE Mendoza (sistema GEM)** para secundario en curso / CENS | Requiere convenio interno DGE–Min. Seguridad (misma provincia: viable) |
| Residencia ≥ 2 años en la provincia | Registro Civil Mendoza / certificado de residencia | Provincial, convenio interno |
| Curso básico habilitante + reentrenamiento cada 5 años | IUSP / institutos autorizados por DISEP | La plataforma puede ser la fuente de verdad (los institutos cargan actas de aprobación) |
| Aptitud psicofísica | Profesionales/centros autorizados | La plataforma registra el certificado con vencimiento |
| Relación laboral con empresa habilitada | DISEP (empresas) + **ARCA/AFIP** (alta temprana, F.931) | CustOS ya importa nómina de ARCA; el mismo cruce sirve del lado estatal |
| Portación (vigiladores armados) | **ANMaC (ex RENAR)** — CLU vigente | Consulta/convenio con ANMaC |

> Nota sobre "RENAER": no existe un registro nacional con esa sigla exacta. Los organismos reales involucrados son **RENAPER** (identidad — casi seguro el que se quiso referir), **RNR** (antecedentes penales) y **ANMaC/ex-RENAR** (armas). El plan cubre los tres. Si DISEP usa "RENAER" como sigla interna de otro registro, se releva en la fase de descubrimiento.

## 3. ¿Existe algo parecido?

- **Mendoza: no.** Hoy no hay plataforma; es la oportunidad.
- **Neuquén (marzo 2026):** lanzó `seguridadprivada.neuquen.gov.ar` — habilitación y renovación de empresas online, altas/bajas de personal, objetivos georreferenciados, **credencial digital descargable**, tasas y multas online. Es el benchmark más cercano y demuestra que la demanda es real. No publica API para terceros (ventaja diferencial nuestra).
- **Córdoba:** Registro Público Digital de prestadores dentro de CiDi (consulta ciudadana de empresas y personal habilitado).
- **CABA / PBA:** registros públicos y algunos trámites web (DGSPR), sin API abierta ni vínculo con software de las empresas.
- **Software privado (VigilarSoft, etc.):** opera el lado empresa (rondas, guardias) pero ninguno cierra el circuito con el regulador.

**Conclusión:** existen registros digitales provinciales de primera generación (formularios online + padrón consultable). **No existe en ninguna provincia el modelo que proponemos: registro con verificación automática contra fuentes nacionales + API pública para que el software de las empresas (CustOS u otros) consuma el estado de habilitación en vivo.** Ese es el diferencial.

## 4. Producto propuesto: "Padrón Digital de Seguridad Privada de Mendoza"

Plataforma GovTech para DISEP con cuatro caras:

1. **Back-office DISEP:** bandeja de trámites, semáforo de verificaciones automáticas (identidad ✔, antecedentes ✔, título ✔, curso ✔, psicofísico ⏳), resolución de habilitación con firma digital, credencial digital con QR, vencimientos y suspensiones, fiscalización en campo (app: escanear QR del vigilador en un objetivo).
2. **Portal empresa:** alta/renovación de la empresa, alta de vigiladores propios (vinculación), presentación digital de documentación faltante, estado en vivo de cada legajo, notificaciones de vencimiento.
3. **Portal vigilador (y ciudadano):** el vigilador inicia su propio trámite, sigue el estado, descarga su credencial digital; cualquier ciudadano verifica un QR o consulta el padrón público de empresas/vigiladores habilitados.
4. **API pública de padrón (el puente con CustOS):**
   - `GET /padron/vigiladores/{cuil}` → `{ estado: HABILITADO | SUSPENDIDO | VENCIDO | EN_TRAMITE | NO_REGISTRADO, categoria, vencimiento, empresa_vinculada }`
   - `GET /padron/empresas/{cuit}` → estado de habilitación de la empresa
   - **Webhooks** de cambio de estado (suspensión, vencimiento) hacia los sistemas suscriptos
   - Verificación de credencial por QR (endpoint público, sin auth, datos mínimos)

### Estados del vigilador (máquina de estados)

`PRE_INSCRIPTO → EN_VERIFICACION → OBSERVADO → APTO_PARA_HABILITAR → HABILITADO → (SUSPENDIDO | VENCIDO | BAJA)`

El estado **APTO_PARA_HABILITAR** es el corazón del pedido original: un pool visible de personas que ya pasaron todos los cruces y solo esperan resolución de DISEP y/o vinculación con una empresa. Las empresas (vía portal o vía CustOS) ven ese pool —con consentimiento del vigilador— y pueden reclutar de ahí: una **bolsa de trabajo verificada**.

### Integración con CustOS

- En el legajo del vigilador (módulo Personal) CustOS consulta la API del padrón y muestra el semáforo de habilitación; bloquea (o advierte) la afectación al cuadrante de un vigilador no habilitado o vencido.
- Webhook de suspensión → novedad automática + alerta en Centro de Operaciones.
- El alta de un vigilador en CustOS puede disparar la vinculación empresa-vigilador en el padrón (hoy: nota de presentación + bono de sueldo en papel).
- CustOS se vuelve más vendible ("compliance DISEP automático") y la plataforma estatal nace con al menos un integrador real. La API es pública y documentada para no ser vendor lock-in (condición que el Estado va a exigir).

## 5. Arquitectura técnica (reutiliza el stack CustOS)

- **NestJS + Prisma + PostgreSQL** (RLS no multi-tenant aquí, pero sí segregación por rol: DISEP / empresa / vigilador / público), React + Vite + Tailwind, BullMQ + Redis para los jobs de verificación asíncrona, MinIO para documentación, Docker Compose → infraestructura provincial o cloud con residencia de datos en Argentina.
- **Capa de conectores** (anticorrupción) con un adaptador por organismo: `RenaperConnector`, `RnrConnector`, `TitulosConnector`, `GemConnector`, `AnmacConnector`, `ArcaConnector`. Cada verificación es un job con reintentos, resultado versionado y evidencia guardada (respuesta firmada/PDF) — clave para auditoría. Si un organismo no tiene API todavía, el conector degrada a "verificación manual asistida" (funcionario valida el documento con checklist) sin cambiar el resto del sistema.
- **Seguridad y legal:** Ley 25.326 (datos personales) — consentimiento del vigilador para cruces y para aparecer en la bolsa de trabajo; minimización de datos en endpoints públicos (el QR devuelve nombre, foto, estado y vencimiento, nada más); firma digital de resoluciones; logs de auditoría inmutables de cada consulta al padrón.

## 6. Plan de acción por fases

**Fase 0 — Descubrimiento y validación política (4–6 semanas).** Reuniones con DISEP y Ministerio de Seguridad y Justicia; relevar el proceso real y volúmenes (empresas habilitadas ya publicadas: ~decenas; vigiladores estimados: miles); mapear qué convenios existen (RNR, RENAPER) y cuáles hay que firmar; validar encuadre de contratación (licitación, contratación directa por innovación, o convenio con cámara del sector CAESI/CAS local como sponsor). Entregable: acta de alcance + carta de intención.

**Fase 1 — MVP Padrón (8–10 semanas).** Digitalizar el trámite actual tal cual es (sin cruces automáticos aún): back-office DISEP, portal empresa, carga de documentación, estados, padrón público de empresas y vigiladores, credencial digital con QR verificable. Esto ya elimina el PDF/WhatsApp y da la victoria política temprana.

**Fase 2 — Verificaciones automáticas (8–12 semanas, solapada).** Conectores en orden de factibilidad: (1) verificación de CAP del RNR por código online, (2) RENAPER SID (requiere convenio provincia–RENAPER; Mendoza ya usa SID en otros organismos), (3) títulos digitales por QR + consulta DGE/GEM para alumno regular, (4) cruce ARCA de relación laboral, (5) ANMaC para armados. Semáforo de verificación en el back-office.

**Fase 3 — API pública + integración CustOS (4–6 semanas).** API de padrón con API keys para empresas de software, webhooks, documentación pública (OpenAPI), sandbox. Integración de referencia en CustOS (semáforo en legajo, bloqueo de cuadrante, alertas).

**Fase 4 — Bolsa de trabajo y fiscalización (6–8 semanas).** Pool de `APTO_PARA_HABILITAR` con consentimiento, búsqueda por zona/categoría; app de fiscalización en campo para inspectores DISEP (escaneo de QR en objetivos); tablero de indicadores para el Ministerio (cobertura, informalidad detectada, tiempos de trámite).

**Modelo de negocio sugerido:** licencia/canon anual al Estado (SaaS GovTech) o, alternativa que suele destrabar presupuesto, costo cero para la provincia financiado por una **tasa de trámite digital** (los trámites DISEP ya tienen tasas — la plataforma cobra un fee por trámite procesado) + fee de acceso API para software privado de terceros. CustOS accede a la API en igualdad de condiciones que cualquier otro (evita conflicto de interés en la licitación).

## 7. Beneficios por actor

**DISEP / Gobierno de Mendoza**
- Trámite pasa de semanas en papel a días con verificación automática; trazabilidad total y expediente digital.
- Padrón vivo: sabe en tiempo real cuántos vigiladores habilitados hay, dónde trabajan y cuándo vencen; hoy no lo sabe nadie.
- Fiscalización con datos (QR en campo, cruce contra objetivos declarados) → reduce el mercado informal que hoy denuncian por prensa.
- Vitrina de gestión: Mendoza pasaría de estar detrás de Neuquén/Córdoba a tener el registro más avanzado del país (primero con API pública).

**Empresas de seguridad**
- Consulta instantánea de si un candidato está habilitado o es apto — hoy es imposible saberlo antes de contratar.
- Bolsa de candidatos ya verificados → reduce semanas el time-to-hire y el riesgo de contratar a alguien inhabilitable.
- Cero papel: altas, bajas y renovaciones online; alertas de vencimiento antes de que un vigilador quede fuera de servicio (y de convenio con el cliente).
- Con CustOS: compliance automático — imposible afectar al cuadrante a alguien no habilitado.

**Vigiladores**
- Trámite autoiniciado y seguible online, credencial digital en el teléfono, sin viajes a la sede DISEP.
- Portabilidad: su habilitación es suya, visible para cualquier empresa (con su consentimiento) → más ofertas laborales y empleo formal.
- Transparencia sobre vencimientos y qué le falta para habilitarse (p. ej. terminar el secundario / constancia de alumno regular).

**Clientes finales y ciudadanía**
- Verificación por QR de que el vigilador de su edificio/comercio está habilitado, y padrón público de empresas legales antes de contratar.
- Más seguridad efectiva: personal con antecedentes y formación verificados de verdad, no por declaración jurada.

**Institutos de formación (IUSP y autorizados)**
- Carga digital de actas de cursos; su oferta llega directo a los vigiladores que necesitan reentrenamiento (vencimientos visibles).

## 8. Riesgos principales

| Riesgo | Mitigación |
|---|---|
| Convenios con RENAPER/RNR demoran | Fase 1 no depende de ellos; conectores degradan a verificación manual asistida |
| Cambio de gestión política | Anclar en la Ley 9578 (la ley ya exige registro); MVP rápido con resultados visibles |
| Encuadre de contratación pública | Explorar convenio con cámara del sector como sponsor, o modelo tasa-por-trámite sin erogación provincial |
| Datos personales (Ley 25.326) | Consentimiento explícito, minimización en endpoints públicos, auditoría de accesos, DPO designado |
| Percepción de conflicto CustOS↔plataforma | API pública documentada e igualitaria para todo software; la plataforma estatal es producto separado con marca propia |

## 9. Fuentes

- Ley 9578/24 (Boletín Oficial Mendoza) y Decreto Reglamentario 264/25 — normativa base.
- DISEP — mendoza.gov.ar/seguridad/disep — trámites, requisitos 2025 (PDF), listados de empresas habilitadas (PDF).
- Registro Nacional de Reincidencia — argentina.gob.ar/justicia/reincidencia — CAP online, verificación en dnrec.jus.gov.ar/ConsultaCAP.
- RENAPER / Sistema de Identidad Digital (SID) — argentina.gob.ar — validación de identidad para organismos y privados homologados.
- Res. CFE 440/23 — títulos secundarios exclusivamente digitales desde 11/2023; validación de títulos en argentina.gob.ar/tema/estudiar/validar-titulos.
- Neuquén Informa (26/3/2026) — lanzamiento de seguridadprivada.neuquen.gov.ar (benchmark).
- Prensa Córdoba — Registro Público Digital de prestadores en CiDi (benchmark).
