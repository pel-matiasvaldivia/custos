/**
 * Cobertura funcional por módulo del ERP.
 *
 * Cruza dos fuentes:
 *  1. El inventario de módulos funcionales descubierto en el código
 *     (controladores NestJS + rutas del frontend), mantenido acá.
 *  2. Los resultados reales de la corrida (qa/reports/results.json del
 *     reporter JSON de Playwright), agrupando por tag @mod:<modulo>.
 *
 * Salida: qa/reports/cobertura-funcional.md + .html con % por módulo.
 * Uso: npm run coverage:funcional (después de `playwright test`).
 */
import * as fs from 'fs';
import * as path from 'path';

/** Módulos funcionales del ERP (inventario descubierto en el repo). */
const MODULOS: Record<string, { descripcion: string; criticidad: 'ALTA' | 'MEDIA' | 'BAJA' }> = {
  auth: { descripcion: 'Autenticación, RBAC, registro y multi-tenancy de sesión', criticidad: 'ALTA' },
  tenancy: { descripcion: 'Aislamiento multi-tenant (RLS Postgres)', criticidad: 'ALTA' },
  clientes: { descripcion: 'Clientes (comercial)', criticidad: 'ALTA' },
  objetivos: { descripcion: 'Objetivos y puestos de servicio', criticidad: 'ALTA' },
  personal: { descripcion: 'Vigiladores: legajos, credenciales, importación', criticidad: 'ALTA' },
  cuadrante: { descripcion: 'Motor de tiempo: esquemas, asignaciones, turnos', criticidad: 'ALTA' },
  novedades: { descripcion: 'Novedades operativas y adjuntos', criticidad: 'MEDIA' },
  liquidaciones: { descripcion: 'Liquidación de sueldos y adelantos', criticidad: 'ALTA' },
  contratos: { descripcion: 'Contratos y facturación del servicio', criticidad: 'ALTA' },
  cotizaciones: { descripcion: 'Cotizador comercial', criticidad: 'MEDIA' },
  'centro-operaciones': { descripcion: 'SOC: incidentes, eventos, video, mapa en vivo', criticidad: 'ALTA' },
  'vigilancia-movil': { descripcion: 'App móvil del guardia: asistencia, rondas, pánico', criticidad: 'ALTA' },
  compras: { descripcion: 'Solicitudes y órdenes de compra', criticidad: 'BAJA' },
  herramientas: { descripcion: 'Herramientas y asignaciones', criticidad: 'BAJA' },
  flota: { descripcion: 'Vehículos, vencimientos, combustible', criticidad: 'BAJA' },
  reportes: { descripcion: 'Informes y estadísticas', criticidad: 'MEDIA' },
  dashboard: { descripcion: 'KPIs y onboarding', criticidad: 'MEDIA' },
  suscripcion: { descripcion: 'Suscripción SaaS / Mercado Pago', criticidad: 'MEDIA' },
  'arca-integration': { descripcion: 'ARCA: nómina/LSD y factura electrónica', criticidad: 'MEDIA' },
  superficie: { descripcion: 'Smoke transversal de rutas del frontend', criticidad: 'MEDIA' },
  a11y: { descripcion: 'Accesibilidad WCAG 2.1 A/AA', criticidad: 'MEDIA' },
  visual: { descripcion: 'Regresión visual', criticidad: 'BAJA' },
  resiliencia: { descripcion: 'Fallas de red, errores HTTP, datos corruptos', criticidad: 'ALTA' },
};

interface Stats { total: number; passed: number; failed: number; skipped: number }

function recolectar(suite: any, acc: Array<{ titulo: string; estado: string }>, pila: string[] = []) {
  for (const s of suite.suites ?? []) recolectar(s, acc, [...pila, s.title]);
  for (const spec of suite.specs ?? []) {
    const titulo = [...pila, spec.title].join(' › ');
    // spec.tests[].status es el veredicto ('expected' cubre test.fail() de bugs
    // conocidos); results[].status sería el estado crudo y daría falso negativo.
    const estado = spec.tests?.[0]?.status ?? (spec.ok ? 'expected' : 'unexpected');
    acc.push({ titulo, estado });
  }
}

function main() {
  const rutaResultados = path.join(__dirname, '..', 'reports', 'results.json');
  if (!fs.existsSync(rutaResultados)) {
    console.error('No existe reports/results.json. Corré primero: npx playwright test');
    process.exit(1);
  }
  const data = JSON.parse(fs.readFileSync(rutaResultados, 'utf8'));
  const tests: Array<{ titulo: string; estado: string }> = [];
  for (const suite of data.suites ?? []) recolectar(suite, tests, [suite.title]);

  const porModulo = new Map<string, Stats>();
  for (const mod of Object.keys(MODULOS)) porModulo.set(mod, { total: 0, passed: 0, failed: 0, skipped: 0 });

  for (const t of tests) {
    const m = t.titulo.match(/@mod:([a-z0-9-]+)/i);
    const mod = m ? m[1] : 'superficie';
    if (!porModulo.has(mod)) porModulo.set(mod, { total: 0, passed: 0, failed: 0, skipped: 0 });
    const st = porModulo.get(mod)!;
    st.total++;
    if (t.estado === 'expected' || t.estado === 'passed' || t.estado === 'flaky') st.passed++;
    else if (t.estado === 'skipped') st.skipped++;
    else st.failed++;
  }

  const cubiertos = [...porModulo.entries()].filter(([, s]) => s.total > 0).length;
  const totalModulos = Object.keys(MODULOS).length;
  const pctModulos = Math.round((cubiertos / totalModulos) * 100);

  let md = `# Cobertura funcional por módulo — CustOS ERP\n\n`;
  md += `Generado: ${new Date().toISOString()} · Tests ejecutados: ${tests.length}\n\n`;
  md += `**Módulos con cobertura automatizada: ${cubiertos}/${totalModulos} (${pctModulos}%)**\n\n`;
  md += `| Módulo | Criticidad | Descripción | Tests | Pass | Fail | Skip | Estado |\n`;
  md += `|---|---|---|---|---|---|---|---|\n`;
  const orden = [...porModulo.entries()].sort((a, b) => b[1].total - a[1].total);
  for (const [mod, s] of orden) {
    const info = MODULOS[mod] ?? { descripcion: '(no inventariado)', criticidad: 'MEDIA' as const };
    const estado = s.total === 0 ? '⚠️ SIN COBERTURA' : s.failed > 0 ? '❌ CON FALLAS' : '✅ OK';
    md += `| ${mod} | ${info.criticidad} | ${info.descripcion} | ${s.total} | ${s.passed} | ${s.failed} | ${s.skipped} | ${estado} |\n`;
  }
  md += `\n> Objetivo del programa QA: >90% de módulos con cobertura y 0 fallas en criticidad ALTA antes de cada despliegue.\n`;

  const salidaMd = path.join(__dirname, '..', 'reports', 'cobertura-funcional.md');
  fs.writeFileSync(salidaMd, md);

  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Cobertura funcional CustOS</title>
<style>body{font-family:system-ui;margin:2rem;max-width:1000px}table{border-collapse:collapse;width:100%}
td,th{border:1px solid #ddd;padding:6px 10px;font-size:14px}th{background:#0e1f3a;color:#fff;text-align:left}
tr:nth-child(even){background:#f6f8fa}h1{color:#0e1f3a}.kpi{font-size:22px;font-weight:700}</style></head><body>
<h1>Cobertura funcional por módulo — CustOS ERP</h1>
<p class="kpi">Módulos cubiertos: ${cubiertos}/${totalModulos} (${pctModulos}%)</p>
<p>Generado: ${new Date().toISOString()} — Tests ejecutados: ${tests.length}</p>
<table><tr><th>Módulo</th><th>Criticidad</th><th>Descripción</th><th>Tests</th><th>Pass</th><th>Fail</th><th>Skip</th><th>Estado</th></tr>
${orden
  .map(([mod, s]) => {
    const info = MODULOS[mod] ?? { descripcion: '(no inventariado)', criticidad: 'MEDIA' };
    const estado = s.total === 0 ? '⚠️ SIN COBERTURA' : s.failed > 0 ? '❌ CON FALLAS' : '✅ OK';
    return `<tr><td>${mod}</td><td>${info.criticidad}</td><td>${info.descripcion}</td><td>${s.total}</td><td>${s.passed}</td><td>${s.failed}</td><td>${s.skipped}</td><td>${estado}</td></tr>`;
  })
  .join('\n')}
</table></body></html>`;
  fs.writeFileSync(path.join(__dirname, '..', 'reports', 'cobertura-funcional.html'), html);

  console.log(md);
  console.log(`\nEscrito: ${salidaMd} y cobertura-funcional.html`);
}

main();
