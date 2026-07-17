import { test, expect } from '@playwright/test';

/**
 * Smoke de navegación: cada módulo del ERP debe cargar sin errores de consola
 * fatales ni pantallas en blanco. Detecta regresiones de bundle/rutas.
 */
const RUTAS: Array<[nombre: string, ruta: string, señal: RegExp]> = [
  ['Dashboard', '/dashboard', /dashboard|kpi|panel/i],
  ['Clientes', '/clients', /cliente/i],
  ['Objetivos', '/objectives', /objetivo/i],
  ['Cotizaciones', '/quotes', /cotizaci/i],
  ['Personal', '/personnel', /vigilador|personal/i],
  ['Cuadrante', '/quadrant', /cuadrante|mes/i],
  ['Novedades', '/novedades', /novedad/i],
  ['Liquidaciones', '/liquidaciones', /liquidaci/i],
  ['Compras', '/compras', /compra|orden/i],
  ['Herramientas', '/herramientas', /herramienta/i],
  ['Esquema de turnos', '/relevos', /esquema|turno/i],
  ['Monitoreo', '/monitoring', /monitoreo|incidente|mapa/i],
  ['Equipamiento', '/monitoring/devices', /dispositivo|equipamiento/i],
  ['Reportes', '/reports', /informe|reporte|estad/i],
  ['Suscripción', '/suscripcion', /suscripci|plan/i],
  ['Configuración', '/settings', /configuraci/i],
];

test.describe('@mod:superficie Navegación por módulos', () => {
  for (const [nombre, ruta, señal] of RUTAS) {
    test(`@smoke ${nombre} (${ruta}) renderiza contenido`, async ({ page }) => {
      const erroresJs: string[] = [];
      page.on('pageerror', (e) => erroresJs.push(e.message));

      await page.goto(ruta);
      await page.waitForLoadState('networkidle');

      await expect(page.locator('body')).toContainText(señal, { timeout: 15_000 });
      expect(erroresJs, `Errores JS no capturados en ${ruta}: ${erroresJs.join(' | ')}`).toEqual(
        [],
      );
    });
  }
});
