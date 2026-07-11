/**
 * Generador de reels de CustOS — manual de operaciones en video.
 *
 * Siembra un tenant de demostración con datos realistas (via API + SQL),
 * recorre cada módulo con Playwright a velocidad humana (cursor destacado y
 * subtítulos guiados EN pantalla) y graba un .webm por módulo en `salida/`.
 * Después, `componer.sh` los convierte a MP4 vertical 1080x1920 (formato
 * Reels/TikTok/Shorts) con título y marca.
 *
 * Requisitos: stack local corriendo (API en :3000, web en :5173, Postgres,
 * Redis) — el mismo que levanta el workflow de QA. Uso:
 *
 *   node tools/demos/grabar-reels.mjs            # todos los reels
 *   node tools/demos/grabar-reels.mjs 3 5        # solo los reels 3 y 5
 *   bash tools/demos/componer.sh                 # webm -> mp4 vertical
 */
import { chromium } from 'playwright';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const SALIDA = path.join(AQUI, 'salida');
const CAPTURAS = path.join(SALIDA, 'capturas');
const TMP = path.join(SALIDA, 'tmp');
const API = process.env.DEMO_API ?? 'http://localhost:3000/api/v1';
const WEB = process.env.DEMO_WEB ?? 'http://localhost:5173';
const CHROMIUM = process.env.QA_CHROMIUM_PATH ?? '/opt/pw-browsers/chromium';
const PSQL_URL =
  process.env.DEMO_PSQL_URL ?? 'postgresql://postgres:postgres@localhost:5432/custos';

const DEMO = {
  empresa: process.env.DEMO_EMPRESA ?? 'Custodia Andina S.R.L.',
  // Un email nuevo crea un tenant desde cero: usalo para una corrida "limpia"
  // donde la importación de nómina y el resto pasan por primera vez en cámara.
  email: process.env.DEMO_EMAIL ?? 'demo@custodiaandina.com.ar',
  password: 'CustosDemo2026!',
  pin: '2468',
};

fs.mkdirSync(CAPTURAS, { recursive: true });
fs.mkdirSync(TMP, { recursive: true });

// ─── API helper ───────────────────────────────────────────────────────────────
let TOKEN = '';
async function req(metodo, ruta, body, opts = {}) {
  const r = await fetch(`${API}${ruta}`, {
    method: metodo,
    headers: {
      ...(opts.form ? {} : { 'Content-Type': 'application/json' }),
      ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
    },
    body: opts.form ? body : body ? JSON.stringify(body) : undefined,
  });
  const text = await r.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  if (!r.ok && !opts.tolerar) {
    throw new Error(`${metodo} ${ruta} -> ${r.status}: ${text.slice(0, 300)}`);
  }
  return { status: r.status, data };
}

// ─── Siembra de datos de demostración ────────────────────────────────────────
async function sembrar() {
  console.log('· Sembrando tenant de demostración…');

  // Login o registro del tenant demo.
  const login = await req('POST', '/auth/login', { email: DEMO.email, password: DEMO.password }, { tolerar: true });
  if (login.status === 200 || login.status === 201) {
    TOKEN = login.data.access_token;
    console.log('  tenant demo ya existía, reutilizando.');
  } else {
    const reg = await req('POST', '/auth/registro', {
      empresa_nombre: DEMO.empresa,
      razon_social: DEMO.empresa,
      email: DEMO.email,
      password: DEMO.password,
      telefono: '261-555-0100',
    });
    TOKEN = reg.data.access_token;
    console.log('  tenant demo creado.');
  }

  // Reglas de liquidación: feriados pagos + adelanto móvil habilitado.
  await req('PUT', '/config/reglas-laborales', {
    pagar_recargo_feriado: true,
    recargo_feriado_pct: 100,
    adelanto_movil_habilitado: true,
  });

  // Clientes y objetivos (idempotente: solo si no existen).
  const clientes = (await req('GET', '/clientes?limit=50')).data;
  const lista = Array.isArray(clientes) ? clientes : clientes.data ?? [];
  let cliente = lista.find((c) => c.razon_social === 'Bodegas Valle Alto S.A.');
  if (!cliente) {
    cliente = (
      await req('POST', '/clientes', {
        razon_social: 'Bodegas Valle Alto S.A.',
        nombre_fantasia: 'Valle Alto',
        cuit: '30-65432109-7',
        domicilio: 'Ruta 60 km 12',
        localidad: 'Luján de Cuyo',
        provincia: 'Mendoza',
        contacto_nombre: 'Laura Giménez',
        contacto_email: 'seguridad@valleaalto.com.ar',
        contacto_telefono: '261-555-0182',
      })
    ).data;
    await req('POST', '/clientes', {
      razon_social: 'Parque Logístico Cuyo S.A.',
      nombre_fantasia: 'PLC',
      cuit: '30-69876543-2',
      domicilio: 'Carril Rodríguez Peña 4200',
      localidad: 'Maipú',
      provincia: 'Mendoza',
      contacto_nombre: 'Sergio Battaglia',
      contacto_email: 'operaciones@plcuyo.com.ar',
      contacto_telefono: '261-555-0733',
    }, { tolerar: true });
  }

  const objetivos = (await req('GET', '/objetivos?limit=50')).data;
  const objList = Array.isArray(objetivos) ? objetivos : objetivos.data ?? [];
  let objetivo = objList.find((o) => o.nombre === 'Planta Luján de Cuyo');
  if (!objetivo) {
    objetivo = (
      await req('POST', '/objetivos', {
        cliente_id: cliente.id,
        nombre: 'Planta Luján de Cuyo',
        direccion: 'Ruta 60 km 12, Luján de Cuyo, Mendoza',
        lat: -33.045,
        lng: -68.878,
      })
    ).data;
  }

  // Nómina base (13 vigiladores) importada por API — el reel 3 importa OTRO
  // archivo en cámara, así el "12 importados con éxito" es real.
  const vigs = (await req('GET', '/vigilantes?limit=100')).data;
  const vigList = Array.isArray(vigs) ? vigs : vigs.data ?? [];
  if (vigList.length < 10) {
    const csv = fs.readFileSync(path.join(AQUI, 'nomina-preseed.csv'));
    const form = new FormData();
    form.append('archivo', new Blob([csv], { type: 'text/csv' }), 'nomina-preseed.csv');
    const imp = await req('POST', '/arca-integration/importar-nomina', form, { form: true });
    console.log(`  nómina base: ${imp.data.importados} importados.`);
  }

  // Valor hora + PIN del primer legajo (para la app móvil y liquidaciones).
  const todos = (await req('GET', '/vigilantes?limit=100')).data;
  const todosList = Array.isArray(todos) ? todos : todos.data ?? [];
  for (const v of todosList) {
    if (!Number(v.valor_hora)) {
      await req('PUT', `/vigilantes/${v.id}`, { valor_hora: 3500 }, { tolerar: true });
    }
  }
  const conPin = todosList.find((v) => v.legajo_nro === '1') ?? todosList[0];
  await req('POST', `/vigilantes/${conPin.id}/pin`, { pin: DEMO.pin }, { tolerar: true });
  // El login móvil matchea por legajo+PIN GLOBAL: si otra corrida dejó un
  // tenant demo previo con el mismo legajo y PIN, el vigilador entraría al
  // tenant equivocado. Se limpia el PIN de los demo viejos (solo tenants demo).
  const miTenant = (await req('GET', '/config/tenant')).data;
  sql(`UPDATE vigiladores v SET pin = NULL
       FROM tenants t
       WHERE v.tenant_id = t.id AND t.nombre = '${DEMO.empresa.replace(/'/g, "''")}'
         AND v.tenant_id <> '${miTenant.id}' AND v.pin IS NOT NULL;`);

  // Puesto 24 h armado con el asistente (rotación desfasada + cobertura).
  const asigs = (await req('GET', `/cuadrante/asignaciones?objetivoId=${objetivo.id}`)).data;
  if (!asigs.length) {
    const ids = todosList.slice(0, 6).map((v) => v.id);
    await req('POST', '/cuadrante/asistente-puesto', {
      objetivo_id: objetivo.id,
      puesto_nombre: 'Acceso Principal',
      vigente_desde: '2026-07-01',
      fecha_ancla: '2026-07-01',
      generar_hasta: '2026-07-31',
      bandas: [
        { label: 'Diurno', hora_inicio: '06:00', duracion_horas: 12, dotacion: 1, vigilador_ids: ids.slice(0, 3) },
        { label: 'Nocturno', hora_inicio: '18:00', duracion_horas: 12, dotacion: 1, vigilador_ids: ids.slice(3, 6) },
      ],
    });
    console.log('  puesto "Acceso Principal" armado (rotación 24 h).');
  }

  // Feriado del 9 de Julio + asistencia real de los turnos ya pasados (para
  // que Liquidaciones muestre horas y montos). SQL directo: es seed de demo.
  sql(`INSERT INTO feriados (tenant_id, fecha, nombre)
       SELECT t.id, '2026-07-09', 'Día de la Independencia' FROM tenants t
       WHERE t.nombre = '${DEMO.empresa.replace(/'/g, "''")}'
       ON CONFLICT DO NOTHING;`);
  sql(`UPDATE turnos_planificados tp SET
         inicio_real = tp.inicio_plan,
         fin_real = tp.fin_plan,
         asistencia_estado = 'OK'
       FROM tenants t
       WHERE tp.tenant_id = t.id AND t.nombre = '${DEMO.empresa.replace(/'/g, "''")}'
         AND tp.fin_plan < NOW() AND tp.inicio_real IS NULL;`);

  // Novedades para que el módulo se vea vivo.
  const nov = (await req('GET', '/novedades?limit=5')).data;
  if ((nov.data ?? []).length < 3) {
    const [v1, v2] = todosList;
    await req('POST', '/novedades', {
      tipo: 'RELEVAMIENTO', prioridad: 'NORMAL', vigilador_id: v1.id,
      descripcion: 'Ronda perimetral completa, portones y cerco en condiciones.',
    });
    await req('POST', '/novedades', {
      tipo: 'GENERAL', prioridad: 'ALTA', vigilador_id: v2.id,
      descripcion: 'Camión de proveedor sin autorización previa en Acceso Principal; se retuvo en portería y se avisó al supervisor.',
    });
  }

  // Credenciales con vencimiento próximo → alimentan la campana de
  // notificaciones y el KPI del dashboard ("CustOS te avisa solo").
  const [c1, c2] = todosList;
  const creds = (await req('GET', `/vigilantes/${c1.id}/credenciales`, undefined, { tolerar: true })).data;
  if (!Array.isArray(creds) || creds.length === 0) {
    const dias = (n) => new Date(Date.now() + n * 86_400_000).toISOString().slice(0, 10);
    await req('POST', `/vigilantes/${c1.id}/credenciales`, {
      tipo: 'PSICOFISICO', numero: 'PSF-30412', vence_el: dias(9),
    }, { tolerar: true });
    await req('POST', `/vigilantes/${c2.id}/credenciales`, {
      tipo: 'CREDENCIAL RNS', numero: 'RNS-118220', vence_el: dias(21),
    }, { tolerar: true });
  }

  // Turno de HOY para el vigilador con PIN: el reel de la app marca la
  // entrada en cámara (control de asistencia real, con hora y ubicación).
  sql(`INSERT INTO turnos_planificados
         (tenant_id, puesto_id, vigilador_id, inicio_plan, fin_plan, tipo_bloque, estado)
       SELECT '${miTenant.id}', p.id, v.id,
              NOW() - interval '20 minutes', NOW() + interval '11 hours',
              'DIURNO', 'PLANIFICADA'
       FROM puestos p, vigiladores v
       WHERE p.tenant_id = '${miTenant.id}' AND p.nombre = 'Acceso Principal'
         AND v.tenant_id = '${miTenant.id}' AND v.id = '${conPin.id}'
         AND NOT EXISTS (
           SELECT 1 FROM turnos_planificados tp
           WHERE tp.tenant_id = '${miTenant.id}' AND tp.vigilador_id = v.id
             AND tp.inicio_plan > NOW() - interval '2 hours'
             AND tp.inicio_plan < NOW() + interval '2 hours'
         );`);
  console.log('· Siembra lista.');
}

function sql(consulta) {
  const plano = consulta.replace(/\s+/g, ' ').trim();
  execSync(`psql "${PSQL_URL}" -q -c ${JSON.stringify(plano)}`, { stdio: 'pipe' });
}

// ─── Overlay: cursor destacado + subtítulos en pantalla ──────────────────────
const OVERLAY = `
(() => {
  if (window.__demoOverlay) return; window.__demoOverlay = true;
  const arm = () => {
    if (!document.body) return setTimeout(arm, 30);
    const cur = document.createElement('div');
    cur.id = '__demo_cursor';
    cur.style.cssText = 'position:fixed;z-index:2147483647;width:26px;height:26px;border-radius:50%;background:rgba(27,87,214,.55);border:3px solid #fff;box-shadow:0 2px 14px rgba(0,0,0,.45), 0 0 0 2px rgba(27,87,214,.7);pointer-events:none;left:-60px;top:-60px;transform:translate(-50%,-50%);transition:transform .12s';
    document.body.appendChild(cur);
    const cap = document.createElement('div');
    cap.id = '__demo_caption';
    const fontCap = window.innerWidth < 500 ? '700 14px/1.4' : '700 19px/1.35';
    cap.style.cssText = 'position:fixed;z-index:2147483646;left:50%;bottom:26px;transform:translateX(-50%);max-width:92%;background:rgba(10,22,44,.94);color:#fff;font:' + fontCap + ' system-ui,sans-serif;padding:12px 18px;border-radius:16px;border:1px solid rgba(255,255,255,.14);box-shadow:0 8px 30px rgba(0,0,0,.5);opacity:0;transition:opacity .35s;text-align:center;pointer-events:none';
    document.body.appendChild(cap);
    window.addEventListener('mousemove', (e) => { cur.style.left = e.clientX + 'px'; cur.style.top = e.clientY + 'px'; }, true);
    window.addEventListener('mousedown', () => { cur.style.transform = 'translate(-50%,-50%) scale(.55)'; }, true);
    window.addEventListener('mouseup', () => { cur.style.transform = 'translate(-50%,-50%) scale(1)'; }, true);
    window.__demoCap = (t) => { if (!t) { cap.style.opacity = '0'; return; } cap.textContent = t; cap.style.opacity = '1'; };
  };
  arm();
})();
`;

// ─── Acciones a velocidad humana ─────────────────────────────────────────────
const pausa = (ms) => new Promise((r) => setTimeout(r, ms));
const guiones = {}; // reel -> [captions] (para el manual)

async function cap(page, reel, texto, ms = 2800) {
  (guiones[reel] ??= []).push(texto);
  await page.evaluate((t) => window.__demoCap?.(t), texto).catch(() => {});
  await pausa(ms);
}

async function mover(page, locator) {
  const box = await locator.boundingBox();
  if (!box) return;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 28 });
  await pausa(250);
}

async function click(page, locator) {
  await locator.scrollIntoViewIfNeeded().catch(() => {});
  await mover(page, locator);
  await locator.click();
  await pausa(500);
}

async function tipear(page, locator, texto) {
  await click(page, locator);
  await page.keyboard.type(texto, { delay: 65 });
  await pausa(300);
}

async function foto(page, nombre) {
  await page.screenshot({ path: path.join(CAPTURAS, `${nombre}.png`) }).catch(() => {});
}

// Un paso puede fallar (selector que cambió) sin tirar todo el reel abajo.
async function paso(nombre, fn) {
  try { await fn(); } catch (e) {
    console.warn(`  ⚠ paso "${nombre}": ${String(e).split('\n')[0]}`);
  }
}

// ─── Runner de reels ─────────────────────────────────────────────────────────
let browser;
let estadoAdmin; // storageState con la sesión web iniciada

async function grabarReel(nombre, opts, fn) {
  const size = opts.movil ? { width: 390, height: 844 } : { width: 1280, height: 720 };
  const context = await browser.newContext({
    viewport: size,
    recordVideo: { dir: TMP, size },
    storageState: opts.conSesion ? estadoAdmin : undefined,
    ...(opts.movil
      ? {
          hasTouch: true,
          isMobile: true,
          // Check-in con ubicación real: la posición simulada es el objetivo demo.
          geolocation: { latitude: -33.045, longitude: -68.878 },
          permissions: ['geolocation'],
        }
      : {}),
  });
  await context.addInitScript(OVERLAY);
  // Timeout corto: un selector que falla no debe congelar medio minuto de video.
  context.setDefaultTimeout(8000);
  const page = await context.newPage();
  page.on('dialog', (d) => d.accept().catch(() => {}));
  console.log(`· Grabando ${nombre}…`);
  try {
    await fn(page, context);
    await page.evaluate(() => window.__demoCap?.('')).catch(() => {});
    await pausa(900);
  } catch (e) {
    console.warn(`  ⚠ reel ${nombre} incompleto: ${String(e).split('\n')[0]}`);
  } finally {
    const video = page.video();
    await context.close();
    if (video) {
      const p = await video.path();
      fs.renameSync(p, path.join(SALIDA, `${nombre}.webm`));
      console.log(`  ✔ salida/${nombre}.webm`);
    }
  }
}

// ─── Los reels ────────────────────────────────────────────────────────────────
const REELS = {
  1: async () =>
    grabarReel('reel-01-ingreso-y-dashboard', {}, async (page, context) => {
      const R = 'reel-01-ingreso-y-dashboard';
      await page.goto(`${WEB}/login`);
      await cap(page, R, 'Entrá a CustOS con tu usuario de la empresa.', 2200);
      await tipear(page, page.getByPlaceholder('operador@empresa.com'), DEMO.email);
      await tipear(page, page.getByPlaceholder('••••••••'), DEMO.password);
      await foto(page, 'r1-login');
      await click(page, page.getByRole('button', { name: /Ingresar/i }));
      await page.waitForURL('**/dashboard', { timeout: 15000 });
      await pausa(1500);
      await cap(page, R, 'El Dashboard resume tu operación: personal, objetivos y actividad del día.');
      await foto(page, 'r1-dashboard');
      await paso('scroll dashboard', async () => {
        await page.mouse.wheel(0, 400); await pausa(1400);
        await page.mouse.wheel(0, -400); await pausa(800);
      });
      await cap(page, R, 'Desde el menú accedés a todos los módulos: comercial, operación y centro de operaciones.');
      await paso('recorrer sidebar', async () => {
        for (const item of ['Clientes', 'Personal', 'Cuadrante', 'Monitoreo']) {
          await mover(page, page.getByRole('link', { name: item }).first());
          await pausa(500);
        }
      });
      estadoAdmin = await context.storageState();
    }),

  2: async () =>
    grabarReel('reel-02-comercial-clientes', { conSesion: true }, async (page) => {
      const R = 'reel-02-comercial-clientes';
      await page.goto(`${WEB}/clients`);
      await pausa(1500);
      await cap(page, R, 'En Clientes vive tu cartera comercial: datos, contactos y objetivos de cada cuenta.');
      await foto(page, 'r2-clientes');
      await cap(page, R, 'Alta en segundos: "Nuevo Cliente" y completás los datos.', 2000);
      await paso('nuevo cliente', async () => {
        await click(page, page.getByRole('button', { name: /Nuevo Cliente/i }));
        await pausa(800);
        // El form no asocia labels con htmlFor: el primer input del modal es Razón social.
        await tipear(page, page.locator('div.fixed input').first(), 'Centro Comercial Los Nogales S.A.');
        await foto(page, 'r2-nuevo-cliente');
        await pausa(800);
        await page.keyboard.press('Escape');
        await pausa(600);
      });
      await cap(page, R, 'Y con el Cotizador armás la propuesta económica del servicio, lista para enviar.', 2400);
      await page.goto(`${WEB}/quotes`);
      await pausa(1800);
      await foto(page, 'r2-cotizador');
      await paso('abrir wizard', async () => {
        await click(page, page.getByRole('button', { name: /Nueva Cotización|Nueva cotización/i }).or(page.getByRole('link', { name: /Nueva/i })).first());
        await pausa(2000);
        await foto(page, 'r2-wizard');
      });
      await cap(page, R, '¿Cuánto sale de verdad una hora-hombre? La Calculadora lo resuelve con la paritaria vigente.', 2600);
      await page.goto(`${WEB}/settings?tab=calculadora`);
      await pausa(2200);
      await foto(page, 'r2-calculadora');
      await paso('scroll calculadora', async () => {
        await page.mouse.wheel(0, 420); await pausa(2000);
        await foto(page, 'r2-calculadora-resultado');
        await page.mouse.wheel(0, -420); await pausa(600);
      });
      await cap(page, R, 'Básico, cargas sociales, puesto 24/7 con dotación real: costo y precio con tu margen objetivo.', 3000);
      await page.goto(`${WEB}/settings?tab=contratos`);
      await pausa(2200);
      await foto(page, 'r2-contrato');
      await cap(page, R, 'Y el modelo de contrato es TUYO: editás la plantilla y cada contrato sale con tu texto y tu firma.', 3000);
      await paso('scroll contrato', async () => {
        await page.mouse.wheel(0, 400); await pausa(1800);
        await foto(page, 'r2-contrato-plantilla');
      });
      await cap(page, R, 'De la cotización al contrato firmado, sin salir de CustOS.', 2400);
    }),

  3: async () =>
    grabarReel('reel-03-personal-arca', { conSesion: true }, async (page) => {
      const R = 'reel-03-personal-arca';
      await page.goto(`${WEB}/personnel`);
      await pausa(1500);
      await cap(page, R, 'Personal: los legajos de tus vigiladores con estado y credenciales.');
      await foto(page, 'r3-personal');
      await cap(page, R, '¿Nómina nueva? Importala directo del archivo que exporta ARCA.', 2200);
      await click(page, page.getByRole('button', { name: /Nómina ARCA/i }));
      await pausa(1000);
      await paso('subir csv', async () => {
        const [chooser] = await Promise.all([
          page.waitForEvent('filechooser'),
          click(page, page.getByText(/Arrastrá el archivo/i)),
        ]);
        await chooser.setFiles(path.join(AQUI, 'nomina-demo.csv'));
      });
      await pausa(800);
      await foto(page, 'r3-modal-arca');
      await click(page, page.getByRole('button', { name: /Importar nómina/i }));
      await pausa(2200);
      await foto(page, 'r3-importados');
      await cap(page, R, 'Listo: cada CUIL del archivo se convierte en un legajo. Sin tipear nada.', 2800);
      await paso('cerrar modal', () => click(page, page.getByRole('button', { name: /^Listo$/i })));
      await pausa(1200);
      await cap(page, R, 'Y CustOS vigila los vencimientos por vos: psicofísico, credencial, lo que cargues…', 2400);
      await paso('campana de vencimientos', async () => {
        await click(page, page.getByRole('button', { name: /Notificaciones de credenciales/i }));
        await pausa(2200);
        await foto(page, 'r3-vencimientos');
      });
      await cap(page, R, 'Te avisa ANTES de que venzan. Nada de enterarte con el vigilador en el puesto.', 2800);
      await foto(page, 'r3-tabla');
    }),

  4: async () =>
    grabarReel('reel-04-cuadrante', { conSesion: true }, async (page) => {
      const R = 'reel-04-cuadrante';
      await page.goto(`${WEB}/quadrant`);
      await pausa(2000);
      await cap(page, R, 'El Cuadrante Operativo: todos los turnos del mes, en una sola vista.');
      await foto(page, 'r4-cuadrante-puesto');
      await cap(page, R, '"Armar puesto" crea la rotación completa: CustOS desfasa los turnos para cubrir las 24 horas.', 3000);
      await paso('vista por vigilador', async () => {
        await click(page, page.getByRole('button', { name: /Por vigilador/i }));
        await pausa(2000);
        await foto(page, 'r4-por-vigilador');
      });
      await cap(page, R, 'Por vigilador ves mañanas, noches y francos repartidos, sin superposiciones.', 2800);
      await paso('generar mes', async () => {
        await click(page, page.getByRole('button', { name: /Generar Mes/i }));
        await pausa(2500);
      });
      await cap(page, R, '"Generar Mes" proyecta las asignaciones vigentes al mes siguiente. Idempotente: nunca duplica.', 2800);
      await paso('exportar', async () => {
        const [descarga] = await Promise.all([
          page.waitForEvent('download', { timeout: 8000 }),
          click(page, page.getByRole('button', { name: /Exportar/i })),
        ]);
        await descarga.cancel().catch(() => {});
      });
      await cap(page, R, 'Y lo exportás a planilla con un clic.', 2200);
      await foto(page, 'r4-final');
    }),

  5: async () =>
    grabarReel('reel-05-app-del-vigilador', { movil: true }, async (page) => {
      const R = 'reel-05-app-del-vigilador';
      await page.goto(`${WEB}/mobile/login`);
      await pausa(1500);
      await cap(page, R, 'El vigilador tiene su propia app: entra con legajo y PIN.', 2400);
      await paso('modo vigilador', () => click(page, page.getByRole('button', { name: 'Vigilador', exact: true })));
      await tipear(page, page.getByPlaceholder(/legajo/i), '1');
      await tipear(page, page.getByPlaceholder('••••', { exact: true }), DEMO.pin);
      await foto(page, 'r5-login');
      await click(page, page.getByRole('button', { name: /^Ingresar/i }));
      await pausa(3000);
      await foto(page, 'r5-dashboard');
      await cap(page, R, 'Su turno de hoy ya lo espera, con puesto y horario. Nada que adivinar.', 2600);
      await paso('marcar entrada', async () => {
        await click(page, page.getByRole('button', { name: /Marcar entrada/i }));
        await pausa(2600);
        await foto(page, 'r5-en-servicio');
      });
      await cap(page, R, 'Un toque y la entrada queda registrada con hora y ubicación reales.', 2800);
      await cap(page, R, 'Ese registro ES la asistencia: alimenta el cuadrante y la liquidación, solo.', 2800);
      await paso('scroll movil', async () => {
        await page.mouse.wheel(0, 350); await pausa(1400);
        await foto(page, 'r5-acciones');
        await page.mouse.wheel(0, -350); await pausa(600);
      });
      await cap(page, R, 'Rondas con QR, novedades con foto y audio, y botón de pánico directo al SOC.', 3000);
      await cap(page, R, 'Todo funciona aún sin señal: la app sincroniza cuando vuelve la conexión.', 2800);
    }),

  6: async () =>
    grabarReel('reel-06-centro-de-operaciones', { conSesion: true }, async (page) => {
      const R = 'reel-06-centro-de-operaciones';
      await page.goto(`${WEB}/monitoring`);
      await pausa(2500);
      await cap(page, R, 'El Centro de Operaciones: mapa en vivo, incidentes y eventos de todos los objetivos.');
      await foto(page, 'r6-soc');
      await paso('pestañas', async () => {
        for (const t of ['En Atención', 'Cerrados', 'Pendientes']) {
          await paso(`tab ${t}`, () => click(page, page.getByText(t, { exact: false }).first()));
          await pausa(900);
        }
      });
      await cap(page, R, 'Pánico, intrusión y alarmas SIA llegan acá, con protocolo de despacho.', 2800);
      await page.goto(`${WEB}/novedades`);
      await pausa(2000);
      await cap(page, R, 'En Novedades queda el registro vivo de los puestos: partes, fotos y audios del móvil.');
      await foto(page, 'r6-novedades');
      await paso('scroll novedades', async () => {
        await page.mouse.wheel(0, 420); await pausa(1800);
        await foto(page, 'r6-novedades-detalle');
      });
      await cap(page, R, 'Cada entrada del móvil quedó acá: con hora real, puesto y quién la reportó.', 2800);
      await cap(page, R, 'Control total de la operación, sin llamar a nadie para preguntar "¿está el vigilador?".', 2800);
    }),

  7: async () =>
    grabarReel('reel-07-liquidaciones', { conSesion: true }, async (page) => {
      const R = 'reel-07-liquidaciones';
      await page.goto(`${WEB}/settings?tab=liquidacion`);
      await pausa(2000);
      await cap(page, R, 'Vos decidís las reglas de pago: feriados con recargo, con un switch.');
      await foto(page, 'r7-config');
      await page.goto(`${WEB}/liquidaciones`);
      await pausa(1500);
      await cap(page, R, 'La asistencia que marcó cada vigilador en la app se convierte en horas a pagar. Sola.', 2600);
      await click(page, page.getByRole('button', { name: /Calcular/i }));
      await pausa(2500);
      await foto(page, 'r7-computo');
      await cap(page, R, 'Trabajadas, nocturnas, extras y feriados: las horas EXACTAS de cada legajo. Neto listo.', 3000);
      await paso('scroll tabla', async () => { await page.mouse.wheel(0, 350); await pausa(1500); });
      await cap(page, R, 'Cerrás el período y queda auditado, con historial.', 2400);
      await paso('cerrar liquidacion', async () => {
        await click(page, page.getByRole('button', { name: /Cerrar liquidación/i }));
        await pausa(2500);
        await foto(page, 'r7-cerrada');
      });
      await paso('historial + LSD', async () => {
        await page.mouse.wheel(0, 700);
        await pausa(1500);
        await foto(page, 'r7-historial');
        await cap(page, R, 'Cada liquidación cerrada exporta el Libro de Sueldos Digital para ARCA. Un clic.', 2800);
        const [descarga] = await Promise.all([
          page.waitForEvent('download', { timeout: 8000 }),
          click(page, page.getByRole('button', { name: /LSD/i }).first()),
        ]);
        await descarga.cancel().catch(() => {});
        await pausa(1200);
      });
      await cap(page, R, 'De la asistencia al recibo, sin planillas. Eso es CustOS.', 2800);
    }),
};

// ─── Main ─────────────────────────────────────────────────────────────────────
const soloEstos = process.argv.slice(2).map(Number).filter(Boolean);

(async () => {
  await sembrar();
  browser = await chromium.launch({ executablePath: CHROMIUM, headless: true });

  // El reel 1 genera la sesión (storageState) que reutilizan los demás.
  const orden = soloEstos.length ? soloEstos : [1, 2, 3, 4, 5, 6, 7];
  if (!orden.includes(1) && !estadoAdmin) {
    // Sesión sin cámara para reels sueltos.
    const ctx = await browser.newContext();
    const p = await ctx.newPage();
    await p.goto(`${WEB}/login`);
    await p.getByPlaceholder('operador@empresa.com').fill(DEMO.email);
    await p.getByPlaceholder('••••••••').fill(DEMO.password);
    await p.getByRole('button', { name: /Ingresar/i }).click();
    await p.waitForURL('**/dashboard');
    estadoAdmin = await ctx.storageState();
    await ctx.close();
  }
  for (const n of orden) {
    if (REELS[n]) await REELS[n]();
  }
  await browser.close();

  fs.writeFileSync(path.join(SALIDA, 'guiones.json'), JSON.stringify(guiones, null, 2));
  console.log('· Guiones (texto de cada reel) en salida/guiones.json');
  console.log('· Ahora: bash tools/demos/componer.sh');
})().catch((e) => { console.error(e); process.exit(1); });
