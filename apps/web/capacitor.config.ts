import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Configuración de Capacitor para empaquetar la app web (misma base React de
 * CustOS GO) como apps nativas Android e iOS.
 *
 * - webDir: 'dist' → se empaquetan los assets ya buildeados por Vite.
 * - Para el build nativo hay que apuntar la API al backend de producción con
 *   la variable VITE_API_URL (en Capacitor window.location.origin es
 *   capacitor://localhost, no sirve como base de API). Ej:
 *     VITE_API_URL=https://app.custos.pymesenlinea.com.ar/api/v1 npm run build
 *   y luego `npx cap sync`.
 */
const config: CapacitorConfig = {
  appId: 'ar.com.pymesenlinea.custos',
  appName: 'CustOS GO',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
