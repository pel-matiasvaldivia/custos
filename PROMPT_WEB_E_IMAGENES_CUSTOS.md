# Prompt — Web contundente CustOS + imágenes realistas

> Prompt de construcción para una web de una sola página, larga y persuasiva, para CustOS (sistema operativo para empresas de seguridad física y electrónica en Argentina), más los prompts de generación de imágenes realistas para las acciones más importantes.
>
> **Cómo usar:** la **Parte A** se pasa a un builder de sitios (v0, Lovable, Claude) o a un dev/agente. La **Parte B** se pasa a un generador de imágenes (Midjourney v6 / Flux / DALL·E 3 / Ideogram). Los prompts de imagen van en inglés a propósito: rinden mejor en todos los generadores.

---

## PARTE A · Construcción de la web

> **Rol.** Sos diseñador y redactor de producto de un estudio que le da a cada cliente una identidad imposible de confundir. Construí un sitio web de una sola página, largo y persuasivo, para **CustOS**, el sistema operativo para empresas de seguridad **física y electrónica** en Argentina. Público: dueños y gerentes de estas empresas — prácticos, escépticos, cansados de promesas de software.

**Objetivo:** explicar CustOS de forma completa y contundente, y conseguir demos. Cada sección debe ganarse el scroll siguiente.

**Idioma y tono:** español rioplatense (voseo, sin "tú/vosotros"), profesional, directo, sin humo ni superlativos vacíos. Frases cortas. Verbos activos.

**Sistema de marca (obligatorio):**
- Colores: Navy `#0E1F3A` (tinta), Canvas `#F4F6FB` (fondo), Surface `#FFFFFF`, Brand `#1B57D6` (CTA/acento), Emerald `#0E9F6E` (estado OK/cubierto, solo funcional), Amber `#E8A33D` (alerta/hueco, solo funcional), Line `#E2E8F2`, Muted `#5C6B86`.
- Tipografía: **Space Grotesk** (títulos), **Inter** (cuerpo), **IBM Plex Mono** (datos, etiquetas, "voz del sistema").
- Estética: sala de operaciones / centro de monitoreo, no SaaS genérico. Superficies navy oscuras alternadas con secciones claras. El verde/ámbar aparecen solo como capa de datos (estados, grillas), nunca decorativos.

**Elemento distintivo (signature):** un **cuadrante de cobertura en vivo** y un **tablero de central de monitoreo** como piezas visuales recurrentes — celdas verde (cubierto) / ámbar (hueco), datos en mono. Es lo que la web debe hacer memorable.

**Estructura y contenido completo (sección por sección):**

1. **Header fijo** — logo CustOS, navegación (Cómo funciona · La cuenta del 24/7 · Centro de Operaciones · Para tu IA · Preguntas), CTA "Pedir una demo".
2. **Hero** — titular sobre la tensión real del negocio (ej: *"La seguridad de tus clientes no puede depender de un Excel y un grupo de WhatsApp."*). Subtítulo que nombre física + electrónica en un solo sistema. Dos CTAs. **Imagen de fondo: escena del Centro de Operaciones (imagen #1).**
3. **El problema** — "Tu operación vive en pedazos": cuadrante en planilla, relevos en WhatsApp, monitoreo en un sistema aparte, rentabilidad tarde. Imagen #2.
4. **Qué es CustOS** — la plataforma única; física + electrónica conectadas desde la cotización hasta el margen.
5. **La cuenta del 24/7** — la tesis: un puesto 24/7 ≈ 4,2 vigiladores, no 3. Mostrar la fórmula (`dotación = horas a cubrir ÷ horas efectivas`). Tarjeta navy con el cálculo.
6. **Módulos, por beneficio** (no por nombre técnico) — Cuadrante, Personal y habilitaciones, Cotizador, Centro de Operaciones (alarmas/cercos/DVR/NVR/rondas), Flota, Rentabilidad. Cada uno con su imagen (imágenes #3 a #8) y un beneficio concreto.
7. **Centro de Operaciones (destacado)** — sección propia: todas las alarmas, cercos, cámaras y pánicos de rondas en un tablero; despacho del móvil más cercano; protocolos de actuación. Imagen #1 o #6.
8. **Por qué CustOS / diferenciadores** — comparación sobria: (1) une física y electrónica; (2) entiende el negocio argentino (convenio 507, habilitaciones provinciales, ANMAC, factor de cobertura); (3) la IA asiste pero el precio lo calcula un motor auditable; (4) datos aislados por empresa.
9. **Para tu IA** — la web es legible por asistentes (datos estructurados, llms.txt, crawlers habilitados) + asistente operativo por WhatsApp.
10. **Preguntas frecuentes** — 6 preguntas (tipo de empresa, dotación, aislamiento de datos, IA y precios, WhatsApp, módulos).
11. **CTA final** — "En veinte minutos te mostramos tu propia operación adentro." Imagen #7.
12. **Footer** — marca, navegación, contacto, enlaces a llms.txt.

**Reglas técnicas:**
- HTML estático server-rendered (mejor para SEO y para que los crawlers de IA lo lean), responsive (mobile/desktop), foco visible por teclado, `prefers-reduced-motion` respetado.
- SEO completo: meta + OpenGraph + Twitter; JSON-LD (Organization, SoftwareApplication, FAQPage); `llms.txt`, `robots.txt` que habilite GPTBot/ClaudeBot/PerplexityBot.
- Una sola animación orquestada por sección como máximo (evitar el "look de IA"). El cuadrante que se llena al cargar es la animación protagonista.
- Sin métricas inventadas. Afirmaciones verificables en el producto.

---

## PARTE B · Generación de imágenes realistas (acciones más importantes)

### Estilo global — anteponé este bloque a TODOS los prompts
```
Photorealistic editorial documentary photography, Argentine private-security
company context, professional and calm competence (never aggressive, no
brandished weapons). Cinematic but natural lighting, shot on Sony A7 IV,
35mm lens, shallow depth of field. Cohesive color grade: deep navy blues
(#0E1F3A) with cool tones, screens glowing in functional green (#0E9F6E)
and amber (#E8A33D), subtle electric-blue (#1B57D6) accents. Realistic
diverse Argentine people, authentic uniforms and workplaces, no clichés.
Hyper-detailed, 8k, true-to-life skin and materials.
```

### Negativos globales — agregalos a cada prompt
```
--no text, logos, watermarks, brand names, distorted faces, extra fingers,
weapons pointed at camera, violence, cartoonish, oversaturated, stock-photo
fake smiles, military combat gear, fisheye distortion
```

### Las escenas (las acciones más importantes)

**#1 · Centro de Operaciones / SOC — alarma de madrugada** *(hero)*
```
A focused security operator at night inside a modern monitoring center
(central de monitoreo), face lit by a wall of screens showing camera feeds,
an alarm event highlighted in amber, a coverage grid in green. Over-the-
shoulder composition, deep navy room, glowing monitors. Tense but controlled
mood. Aspect 16:9.
```

**#2 · El problema — la operación dispersa**
```
Close-up of a tired security company manager's desk at dusk: a laptop with a
cluttered spreadsheet of shifts, a phone buzzing with a busy WhatsApp group,
a paper logbook, sticky notes. Hands rubbing temples in soft focus behind.
Honest, slightly chaotic, relatable. Aspect 3:2.
```

**#3 · Cuadrante — el supervisor arma los turnos**
```
A supervisor in a control office reviewing a large screen showing a weekly
shift grid (rows of posts, columns of days) with green covered cells and a
couple of amber gaps. Confident, problem-solving expression, mono-spaced data
on screen. Clean navy-and-white workspace. Aspect 3:2.
```

**#4 · Ronda nocturna — vigilador escaneando checkpoint**
```
A uniformed Argentine security guard on night patrol scanning an NFC/QR
checkpoint on a wall with a rugged smartphone, screen glowing green on
confirmation. Industrial or commercial site exterior, cold night light,
breath visible. Professional, attentive. Aspect 4:5 (vertical for mobile).
```

**#5 · Fichaje con geocerca — llegada al puesto**
```
A security guard arriving at a guard post at dawn, checking in on a phone app
that shows a map with a geofence circle and a green "en el puesto" status.
Realistic uniform, lanyard ID badge, golden-hour light, gatehouse in
background. Aspect 4:5.
```

**#6 · Despacho — el móvil de respuesta sale**
```
A marked private-security response vehicle (móvil) leaving at night with
headlights on, a guard getting in, urban Argentine street, motion blur,
amber and blue light reflections on wet pavement. Sense of fast, organized
response. No police, no weapons. Aspect 16:9.
```

**#7 · Rentabilidad — el dueño decide con números**
```
A business owner in a modern office reviewing a laptop dashboard with clean
charts of contract profitability (estimated vs real margin), calm and in
control, a coffee on the desk, large window with city light. Decision-maker
energy. Aspect 3:2.
```

**#8 · Seguridad electrónica — los dispositivos**
```
Detail shots of installed electronic security hardware: a modern alarm panel,
an IP camera/dome on a wall, an electric-fence energizer unit, an NVR with
status LEDs glowing green. Crisp, technical, well-lit, premium product
photography feel against neutral surfaces. Aspect 1:1.
```

### Coherencia y uso
- **Consistencia de campaña:** usá la misma *seed* (o *style reference* en Midjourney `--sref`) en todas para que parezcan una sola producción. Mantené el grading navy + acentos verde/ámbar en todas.
- **Mapa imagen→sección:** #1 hero y Centro de Operaciones · #2 problema · #3 cuadrante · #4 rondas · #5 fichaje · #6 despacho · #7 CTA/rentabilidad · #8 grilla de seguridad electrónica.
- **Verticales (#4, #5)** para mobile/feature; **16:9 (#1, #6)** para hero/banners; **3:2 y 1:1** para tarjetas.
- **Ética visual (innegociable):** competencia profesional y tecnología, nunca exhibición de armas ni violencia. Personas argentinas reales y diversas. Sin logos ni texto generado dentro de la imagen (el texto lo pone la web).

---

## Notas

- Ya existe una landing más acotada en `apps/landing/`. Este prompt apunta a una web más completa y persuasiva: sirve para reemplazarla o para una versión extendida.
- Generadores: **DALL·E 3 (ChatGPT)** o **Ideogram** → pasar los prompts tal cual en lenguaje natural; **Midjourney/Flux** → agregar parámetros (`--ar 16:9 --style raw` y `--sref` para coherencia).
