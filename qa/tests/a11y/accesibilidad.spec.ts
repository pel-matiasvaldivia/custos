import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

import * as fs from 'fs';
import * as path from 'path';

/**
 * Accesibilidad (WCAG 2.1 A/AA) con axe-core sobre las páginas principales.
 *
 * Gate de REGRESIÓN con baseline: la deuda existente (registrada en
 * baseline.json, hallazgo QA-BUG-02) no rompe el build, pero cualquier
 * violación grave NUEVA sí falla. Para regenerar el baseline después de
 * arreglar deuda: borrar baseline.json y correr con QA_A11Y_UPDATE=1.
 */
const BASELINE_PATH = path.join(__dirname, 'baseline.json');
const baseline: Record<string, string[]> = fs.existsSync(BASELINE_PATH)
  ? JSON.parse(fs.readFileSync(BASELINE_PATH, 'utf8'))
  : {};
const PAGINAS: Array<[nombre: string, ruta: string]> = [
  ['Login', '/login'],
  ['Dashboard', '/dashboard'],
  ['Clientes', '/clients'],
  ['Personal', '/personnel'],
  ['Cuadrante', '/quadrant'],
  ['Novedades', '/novedades'],
  ['Liquidaciones', '/liquidaciones'],
  ['Configuración', '/settings'],
];

test.describe('@mod:a11y Accesibilidad', () => {
  for (const [nombre, ruta] of PAGINAS) {
    test(`axe en ${nombre}`, async ({ page }, testInfo) => {
      await page.goto(ruta);
      await page.waitForLoadState('networkidle');

      const resultados = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();

      await testInfo.attach(`axe-${nombre}.json`, {
        body: JSON.stringify(resultados.violations, null, 2),
        contentType: 'application/json',
      });

      const graves = resultados.violations.filter((v) =>
        ['serious', 'critical'].includes(v.impact ?? ''),
      );
      const ids = graves.map((v) => v.id).sort();

      if (process.env.QA_A11Y_UPDATE) {
        baseline[nombre] = ids;
        fs.writeFileSync(BASELINE_PATH, JSON.stringify(baseline, null, 2));
        return;
      }

      const conocidas = new Set(baseline[nombre] ?? []);
      const nuevas = graves.filter((v) => !conocidas.has(v.id));
      expect(
        nuevas.map((v) => `${v.id} (${v.impact}) x${v.nodes.length}: ${v.help}`),
        `Violaciones graves NUEVAS (no en baseline) en ${nombre}`,
      ).toEqual([]);
    });
  }
});
