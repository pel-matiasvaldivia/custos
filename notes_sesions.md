# Notas de Sesiones - CustOS ERP QA

## Sesion 1: Plataforma QA Automation

Se construyo la plataforma completa de QA automation para el ERP CustOS:

- **Playwright** con patron Page Object Model (POM) para tests E2E
- **axe-core** para auditorias de accesibilidad WCAG 2.1 A/AA
- **k6** para pruebas de carga y rendimiento
- Tests de resiliencia: red offline, API lenta, timeouts, errores HTTP, datos corruptos
- Sistema de baseline de regresion para a11y
- CI pipeline con GitHub Actions

### Bugs detectados
- **QA-BUG-01** (ALTA): ClientesPage crash con datos corruptos del backend
- **QA-BUG-02** (MEDIA): Deuda de accesibilidad WCAG en todas las paginas

---

## Sesion 2: Fix de Bugs QA-BUG-01 y QA-BUG-02

### QA-BUG-01 - ClientesPage crash con datos corruptos (Severidad: ALTA)

**Problema:** La pagina de clientes crasheaba (pantalla blanca) cuando el backend devolvia JSON invalido o datos con shape inesperado.

**Solucion:** Se agrego `Array.isArray()` guard y filtro null-safe en `ClientesPage.tsx`.

**Archivo:** `apps/web/src/pages/clients/ClientesPage.tsx`

### QA-BUG-02 - Deuda de accesibilidad WCAG (Severidad: MEDIA)

**Problema:** Multiples violaciones de accesibilidad en todas las paginas:
- `button-name`: botones sin texto accesible
- `select-name`: selects sin label asociado
- `label`: inputs sin label asociado
- `color-contrast`: contraste insuficiente

**Solucion:** Se corrigieron todas las violaciones excepto `color-contrast` (requiere revision mas profunda del sistema de colores Tailwind).

**Archivos modificados:**
- `apps/web/tailwind.config.js` - color muted #5c6b86 -> #546178
- `apps/web/src/pages/auth/LoginPage.tsx` - labels, aria-labels, contraste
- `apps/web/src/pages/clients/ClientesPage.tsx` - guard de datos corruptos
- `apps/web/src/pages/personnel/PersonnelPage.tsx` - aria-labels en select y botones
- `apps/web/src/pages/novedades/NovedadesPage.tsx` - htmlFor/id en controles
- `apps/web/src/pages/liquidaciones/LiquidacionesPage.tsx` - htmlFor/id en controles
- `apps/web/src/pages/settings/UsuariosTab.tsx` - htmlFor/id y aria-labels
- `apps/web/src/pages/settings/ConfiguracionArcaForm.tsx` - Campo con htmlFor, ids en inputs/selects
- `apps/web/src/pages/settings/EmpresaTab.tsx` - htmlFor/id en todos los campos
- `apps/web/src/pages/dashboard/BienvenidaModal.tsx` - aria-label en botones de navegacion
- `apps/web/src/pages/objectives/CuadranteObjetivo.tsx` - aria-labels en botones icono
- `apps/web/src/pages/quadrant/QuadrantPage.tsx` - aria-labels en navegacion de mes
- `qa/tests/resilience/red-y-errores.spec.ts` - removido test.fail() del test de datos corruptos
- `qa/tests/a11y/baseline.json` - actualizado baseline (solo queda color-contrast)

### CI Fixes durante la sesion

1. bitnami/minio eliminado de Docker Hub -> removido servicio MinIO
2. dump.rdb sin trackear -> eliminado + .gitignore
3. Test mobile login 429 vs 401 -> agregadas env vars de rate limit
4. k6 `http_req_failed` 18.54% -> removido query param invalido `busqueda`
5. Baseline a11y vacio causo 8 test failures -> restaurado `color-contrast` en baseline

### Resultado final

- **PR #88** mergeado exitosamente
- **CI verde**: typecheck OK, qa OK (105 tests, 97 passed)
- **Commits:**
  - `e04b70f` - fix: resolve QA-BUG-01 and QA-BUG-02
  - `630ca9f` - fix(qa): restore color-contrast in a11y baseline

### Deuda tecnica pendiente

- `color-contrast` sigue en el baseline de todas las paginas (Tailwind utilities como `text-amber`, clases con opacidad generan contraste insuficiente)
- Requiere revision integral del sistema de colores para cumplir WCAG AA en todos los contextos
