/**
 * Compone los .webm grabados por grabar-reels.mjs en MP4 vertical 1080x1920
 * (formato Reels / TikTok / Shorts): fondo azul marca, título del capítulo,
 * video centrado, sello CustOS y — si existe salida/tiempos.json — la voz en
 * off mezclada en el instante exacto en que aparece cada subtítulo.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const SALIDA = path.join(AQUI, 'salida');
const VOZ = path.join(SALIDA, 'voz');
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

const tiempos = fs.existsSync(path.join(SALIDA, 'tiempos.json'))
  ? JSON.parse(fs.readFileSync(path.join(SALIDA, 'tiempos.json'), 'utf8'))
  : {};

// ─── Cama musical (RhythmRocket.mp3) ─────────────────────────────────────────
// Se normaliza el track muy por debajo de la voz (I=-22 LUFS, mono) una sola
// vez y se cachea en salida/.bed.wav; después se loopea/recorta por reel y se
// agacha bajo la locución (sidechain) para que la voz siempre quede por encima.
const MUSICA = path.join(AQUI, 'RhythmRocket.mp3');
const BED = path.join(SALIDA, '.bed.wav');
function generarCama() {
  execFileSync('ffmpeg', [
    '-hide_banner', '-loglevel', 'error', '-y', '-i', MUSICA,
    '-map', '0:a', '-af', 'loudnorm=I=-22:TP=-6,highpass=f=40',
    '-ac', '1', '-ar', '44100', BED,
  ], { stdio: 'pipe' });
}
if (!fs.existsSync(BED)) generarCama();

function duracion(archivo) {
  return (
    parseFloat(
      execFileSync('ffprobe', [
        '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', archivo,
      ]).toString().trim(),
    ) || 30
  );
}

const webms = fs.readdirSync(SALIDA).filter((f) => f.startsWith('reel-') && f.endsWith('.webm')).sort();
if (!webms.length) {
  console.error(`No hay .webm en ${SALIDA}; corré primero grabar-reels.mjs`);
  process.exit(1);
}

for (const webm of webms) {
  const base = webm.replace(/\.webm$/, '');
  const pref = base.slice(0, 7);
  const titulo = TITULOS[pref] ?? 'CustOS';
  const numero = String(parseInt(base.slice(5, 7), 10));
  const esMovil = base.includes('app-del-vigilador');

  const ttxt = path.join(SALIDA, `.t_${base}.txt`);
  const stxt = path.join(SALIDA, `.s_${base}.txt`);
  fs.writeFileSync(ttxt, titulo);
  fs.writeFileSync(stxt, `Manual de operaciones · Cap. ${numero}`);

  const escala = esMovil ? 'scale=-2:1360' : 'scale=1040:-2';
  const ypos = esMovil ? '380' : '(H-h)/2';

  const locucion = tiempos[base] ?? [];
  const durVid = duracion(path.join(SALIDA, webm));
  const args = ['-hide_banner', '-loglevel', 'error', '-y', '-i', path.join(SALIDA, webm)];
  for (const l of locucion) args.push('-i', path.join(VOZ, l.archivo));
  // Cama musical como último input, acotada al largo del reel.
  const bedIdx = 1 + locucion.length;
  args.push('-stream_loop', '-1', '-t', durVid.toFixed(2), '-i', BED);

  let fc =
    `color=c=0x0a162c:s=1080x1920:r=30[bg];` +
    `[0:v]${escala},format=yuv420p[v];` +
    `[bg][v]overlay=(W-w)/2:${ypos}:shortest=1[c1];` +
    `[c1]drawtext=fontfile=${FUENTE}:textfile=${ttxt}:fontcolor=white:fontsize=58:x=(w-text_w)/2:y=200[c2];` +
    `[c2]drawtext=fontfile=${FUENTE_LIGERA}:textfile=${stxt}:fontcolor=0x9db2d0:fontsize=30:x=(w-text_w)/2:y=290[c3];` +
    `[c3]drawtext=fontfile=${FUENTE}:text='CustOS':fontcolor=white:fontsize=44:x=(w-text_w)/2:y=1750[c4];` +
    `[c4]drawtext=fontfile=${FUENTE_LIGERA}:text='el sistema operativo de tu empresa de seguridad':fontcolor=0x9db2d0:fontsize=24:x=(w-text_w)/2:y=1815[vout]`;

  // Cama musical: ya viene normalizada baja (I=-22); ducked bajo la voz.
  const bed = `[${bedIdx}:a]volume=1.0[bedraw]`;
  if (locucion.length) {
    const pistas = locucion
      .map((l, i) => `[${i + 1}:a]adelay=${Math.max(0, Math.round(l.inicio * 1000))}:all=1[a${i}]`)
      .join(';');
    const etiquetas = locucion.map((_, i) => `[a${i}]`).join('');
    // Sin apad: el audio puede terminar antes que el video (queda en silencio).
    // apad infinito + -shortest desborda la cola de muxing de ffmpeg (ENOSPC).
    fc +=
      `;${pistas};${etiquetas}amix=inputs=${locucion.length}:normalize=0[vozmix];` +
      `[vozmix]asplit=2[vozout][vozkey];` +
      `${bed};` +
      // La voz agacha la música: en los silencios la cama vuelve a subir.
      `[bedraw][vozkey]sidechaincompress=threshold=0.02:ratio=8:attack=5:release=350:makeup=1[bedduck];` +
      `[bedduck][vozout]amix=inputs=2:normalize=0:duration=longest[aout]`;
  } else {
    fc += `;${bed.replace('[bedraw]', '[aout]')}`;
  }

  const out = path.join(SALIDA, `${base}.mp4`);
  args.push(
    '-filter_complex', fc,
    '-map', '[vout]',
    '-map', '[aout]', '-c:a', 'aac', '-b:a', '128k',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '21', '-movflags', '+faststart',
    out,
  );
  execFileSync('ffmpeg', args, { stdio: 'inherit' });
  fs.rmSync(ttxt, { force: true });
  fs.rmSync(stxt, { force: true });
  console.log(`✔ ${out}${locucion.length ? ` (voz en off: ${locucion.length} líneas)` : ''}`);
}
console.log(`Listo: MP4 verticales en ${SALIDA}/`);
