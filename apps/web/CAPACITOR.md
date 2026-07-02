# CustOS GO — App móvil (PWA + Capacitor)

La app del guardia/supervisor (`/mobile`) es la **misma base React** de la web,
empaquetable de tres formas sin reescribir código.

## 1. PWA instalable (ya configurada)

`vite-plugin-pwa` genera el service worker y el manifest en el build. La app:

- Se **instala** desde el navegador (Android: "Agregar a pantalla de inicio";
  iOS: Compartir → "Agregar a inicio").
- **Abre sin internet** (precache del app-shell) y muestra aviso de "Sin conexión".
- Abre directo en `/mobile` (ver `manifest.start_url` en `vite.config.ts`).

Nada extra que hacer: `npm run build` y desplegar.

## 2. Apps nativas Android / iOS (Capacitor)

Requisitos: **Android Studio** (Android) y **Mac + Xcode** (iOS), más las cuentas
de desarrollador (Google Play US$25 única vez, Apple US$99/año).

### Primera vez

```bash
cd apps/web

# 1) Build apuntando la API al backend de producción (en nativo no sirve el
#    origin relativo). Ajustá la URL a tu dominio real:
VITE_API_URL=https://app.custos.pymesenlinea.com.ar/api/v1 npm run build

# 2) Crear los proyectos nativos (genera carpetas android/ e ios/)
npm run cap:add:android
npm run cap:add:ios

# 3) Copiar el build web a los proyectos nativos
npm run cap:sync

# 4) Abrir en el IDE nativo para compilar/firmar/publicar
npm run cap:android   # abre Android Studio
npm run cap:ios       # abre Xcode
```

### Cada vez que cambia el código web

```bash
VITE_API_URL=https://.../api/v1 npm run build
npm run cap:sync
```

## 3. Próximo paso (Fase 1 — offline-first)

Sobre esta base se agrega: almacenamiento local (IndexedDB) del turno, cola de
acciones offline (checkin/checkout/pánico/scan) con idempotencia y timestamp del
dispositivo, y sincronización al recuperar señal. Con Capacitor se suman además
los plugins nativos: GPS en segundo plano, push notifications, cámara/QR y
almacenamiento seguro del token.
