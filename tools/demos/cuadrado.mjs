/**
 * Genera versiones 1:1 (1080x1080, feed de Instagram/LinkedIn) a partir de los
 * MP4 verticales 9:16 que produce componer.mjs. No re-graba ni recompone: opera
 * sobre el video terminado (ya trae voz, música y subtítulos quemados).
 *
 *   - Reels de escritorio: recorte centrado al cuadrado (llena el feed) y se
 *     vuelven a estampar título y marca, que el crop deja fuera.
 *   - Reel móvil (app del vigilador): el "teléfono" es más alto que ancho, así
 *     que se escala a alto 1080 y se rellena con navy a los costados (no corta).
 *
 * Uso:
 *   node tools/demos/cuadrado.mjs [dir_entrada]
 * dir_entrada por defecto es salida/. Escribe en <dir_entrada>/1x1/.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const ENTRADA = process.argv[2] ? path.resolve(process.argv[2]) : path.join(AQUI, 'salida');
const DESTINO = path.join(ENTRADA, '1x1');
const NAVY = '0x0a162c';
const FUENTE = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf';
const FUENTE_LIGERA = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf';

const TITULOS = {
  'reel-01': 'Ingreso y Dashboard',
  'reel-02': 'Comercial y Cotizador',
  'reel-03': 'Personal + Nómina ARCA',
  'reel-04': 'Cuadrante Operativo',
  'reel-05': 'App del Vigilador',
  'reel-06': 'Centro de Operaciones',
  'reel-07': 'Liquidaciones y LSD',
};

fs.mkdirSync(DESTINO, { recursive: true });
const mp4s = fs
  .readdirSync(ENTRADA)
  .filter((f) => f.startsWith('reel-') && f.endsWith('.mp4'))
  .sort();
if (!mp4s.length) {
  console.error(`No hay reel-*.mp4 en ${ENTRADA}`);
  process.exit(1);
}

// Escapa el texto para el filtro drawtext.
const esc = (t) => t.replace(/\\/g, '\\\\').replace(/:/g, '\\:').replace(/'/g, "\\'");

for (const mp4 of mp4s) {
  const base = mp4.replace(/\.mp4$/, '');
  const pref = base.slice(0, 7);
  const titulo = TITULOS[pref] ?? 'CustOS';
  const numero = String(parseInt(base.slice(5, 7), 10));
  const esMovil = base.includes('app-del-vigilador');

  let vf;
  if (esMovil) {
    // El video 9:16 completo (título, teléfono, subtítulos y marca) escalado a
    // alto 1080 y centrado con relleno navy: no se corta nada.
    vf = `scale=-2:1080,pad=1080:1080:(1080-iw)/2:0:color=${NAVY}`;
  } else {
    // Recorte centrado al cuadrado + se re-estampan título, subtítulo y marca.
    vf =
      `crop=1080:1080:0:420,` +
      `drawtext=fontfile=${FUENTE}:text='${esc(titulo)}':fontcolor=white:fontsize=46:x=(w-text_w)/2:y=48,` +
      `drawtext=fontfile=${FUENTE_LIGERA}:text='${esc(`Manual de operaciones · Cap. ${numero}`)}':fontcolor=0x9db2d0:fontsize=25:x=(w-text_w)/2:y=108,` +
      `drawtext=fontfile=${FUENTE}:text='CustOS':fontcolor=white:fontsize=40:x=(w-text_w)/2:y=980,` +
      `drawtext=fontfile=${FUENTE_LIGERA}:text='el sistema operativo de tu empresa de seguridad':fontcolor=0x9db2d0:fontsize=21:x=(w-text_w)/2:y=1036`;
  }

  const salida = path.join(DESTINO, `${base}-1x1.mp4`);
  execFileSync('ffmpeg', [
    '-hide_banner', '-loglevel', 'error', '-y', '-i', path.join(ENTRADA, mp4),
    '-vf', vf, '-c:a', 'copy',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '21', '-movflags', '+faststart',
    salida,
  ], { stdio: 'inherit' });
  console.log(`✔ ${salida}${esMovil ? ' (móvil · pad)' : ' (crop)'}`);
}
console.log(`Listo: versiones 1:1 en ${DESTINO}/`);
