# Reels de CustOS — manual de operaciones en video

Genera los videos verticales (1080×1920, formato Reels / TikTok / Shorts) que
muestran cómo se opera cada módulo de la plataforma, con datos de demostración
realistas, cursor destacado y subtítulos guiados en pantalla.

## Cómo se generan

1. Levantá el stack local (mismo que el workflow de QA): Postgres con el rol
   `custos_app` + RLS, Redis, la API en `:3000` y la web en `:5173`.
2. Grabá los recorridos (siembra el tenant demo + graba un `.webm` por módulo):

   ```bash
   # Corrida limpia: un email nuevo crea el tenant desde cero, así la
   # importación de nómina y el resto pasan "por primera vez" en cámara.
   DEMO_EMAIL=reels+$(date +%s)@custodiaandina.com.ar node tools/demos/grabar-reels.mjs

   # Regrabar solo algunos capítulos:
   node tools/demos/grabar-reels.mjs 3 5
   ```

3. Componé los MP4 verticales (título, marco y sello CustOS):

   ```bash
   bash tools/demos/componer.sh
   ```

Salida en `tools/demos/salida/`: los `.mp4` listos para publicar, las capturas
de cada paso en `capturas/` (sirven para el manual escrito y para redes) y
`guiones.json` con el texto de cada subtítulo (útil como guión de voz en off).

## Capítulos

| # | Reel | Qué muestra |
|---|------|-------------|
| 1 | Ingreso y Dashboard | Login y el resumen de la operación |
| 2 | Comercial y Cotizador | Cartera de clientes y cotización del servicio |
| 3 | Personal + Nómina ARCA | Legajos e importación masiva del CSV/XLSX de ARCA |
| 4 | Cuadrante Operativo | Rotaciones 24 h desfasadas, Generar Mes, exportación |
| 5 | App del Vigilador | Login con legajo+PIN, novedades con foto/audio, solicitud de adelanto |
| 6 | Centro de Operaciones | Mapa en vivo, incidentes, novedades y aprobación del adelanto |
| 7 | Liquidaciones y LSD | Reglas configurables, cómputo con feriados, cierre y Libro de Sueldos Digital |

Los capítulos cuentan una historia continua (el adelanto que se pide en el 5 se
aprueba en el 6 y se descuenta en el 7), así el conjunto funciona como manual
de operaciones además de material de venta.

## Voz en off

Cada subtítulo se locuta con una voz femenina en español y se mezcla en el
MP4 en el instante exacto en que aparece en pantalla (el ritmo del video se
adapta a la duración de cada línea). El motor por defecto es
`espeak-ng + MBROLA es3` (100 % offline, paquetes de Ubuntu:
`apt-get install espeak-ng mbrola mbrola-es3`), con ecualización y loudness
parejo vía ffmpeg.

**Para una voz premium** (recomendado para publicar): seteá `VOZ_CMD` con
cualquier CLI que reciba `{texto}` y `{salida}` — se borra el caché
`salida/voz/` y se regraba. Ejemplos:

```bash
# Microsoft Edge TTS (gratis, requiere salida a internet):
VOZ_CMD='edge-tts --voice es-AR-ElenaNeural --text {texto} --write-media {salida}' \
  node tools/demos/grabar-reels.mjs

# Piper (local, con un modelo descargado):
VOZ_CMD='sh -c "echo {texto} | piper -m es_MX-claude-high.onnx -f {salida}"' ...
```

La pronunciación de siglas y marcas (CustOS, LSD, QR, 24/7…) se ajusta en el
mapa `PRONUNCIACION` de `grabar-reels.mjs`.

## Notas

- Los datos son 100 % ficticios (`Custodia Andina S.R.L.`, nóminas
  `nomina-preseed.csv` / `nomina-demo.csv` con CUILs y nombres inventados).
- Requiere `ffmpeg` con `libx264` y `drawtext` (el de Playwright no alcanza:
  `apt-get install ffmpeg`). Chromium se toma de `QA_CHROMIUM_PATH`
  (default `/opt/pw-browsers/chromium`).
- Cada paso de un recorrido es tolerante a fallas: si un selector cambió, se
  loguea `⚠` y el reel sigue — revisá la consola y las capturas al regrabar.
- Variables: `DEMO_API`, `DEMO_WEB`, `DEMO_EMAIL`, `DEMO_EMPRESA`,
  `DEMO_PSQL_URL`, `QA_CHROMIUM_PATH`.
