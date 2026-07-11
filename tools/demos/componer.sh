#!/usr/bin/env bash
# Compone los .webm grabados por grabar-reels.mjs en MP4 vertical 1080x1920
# (formato Reels / TikTok / Shorts): fondo azul marca, título arriba, video
# centrado y sello CustOS abajo. Requiere ffmpeg con libx264 y drawtext.
set -euo pipefail
AQUI="$(cd "$(dirname "$0")" && pwd)"
SALIDA="$AQUI/salida"
FUENTE="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FUENTE_LIGERA="/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"

titulo() {
  case "$1" in
    reel-01-*) echo "Ingreso y Dashboard" ;;
    reel-02-*) echo "Comercial y Cotizador" ;;
    reel-03-*) echo "Personal + Nómina ARCA" ;;
    reel-04-*) echo "Cuadrante Operativo" ;;
    reel-05-*) echo "App del Vigilador" ;;
    reel-06-*) echo "Centro de Operaciones" ;;
    reel-07-*) echo "Liquidaciones y LSD" ;;
    *) echo "CustOS" ;;
  esac
}

numero() { basename "$1" .webm | sed -E 's/^reel-0?([0-9]+).*/\1/'; }

for webm in "$SALIDA"/reel-*.webm; do
  [ -e "$webm" ] || { echo "No hay .webm en $SALIDA; corré primero grabar-reels.mjs"; exit 1; }
  base="$(basename "$webm" .webm)"
  out="$SALIDA/$base.mp4"
  t="$(titulo "$base")"
  n="$(numero "$webm")"
  ttxt="$SALIDA/.t_$base.txt"; printf '%s' "$t" > "$ttxt"
  stxt="$SALIDA/.s_$base.txt"; printf 'Manual de operaciones · Cap. %s' "$n" > "$stxt"

  # Los reels de escritorio son 1280x720; el de la app móvil es 390x844 y se
  # escala más grande porque ya es vertical.
  if [ "$base" = "reel-05-app-del-vigilador" ]; then
    escala="scale=-2:1360"; ypos="380"
  else
    escala="scale=1040:-2"; ypos="(H-h)/2"
  fi

  ffmpeg -hide_banner -loglevel error -y -i "$webm" -filter_complex "
    color=c=0x0a162c:s=1080x1920:r=30[bg];
    [0:v]${escala},format=yuv420p[v];
    [bg][v]overlay=(W-w)/2:${ypos}:shortest=1[c1];
    [c1]drawtext=fontfile=$FUENTE:textfile=$ttxt:fontcolor=white:fontsize=58:x=(w-text_w)/2:y=200[c2];
    [c2]drawtext=fontfile=$FUENTE_LIGERA:textfile=$stxt:fontcolor=0x9db2d0:fontsize=30:x=(w-text_w)/2:y=290[c3];
    [c3]drawtext=fontfile=$FUENTE:text='CustOS':fontcolor=white:fontsize=44:x=(w-text_w)/2:y=1750[c4];
    [c4]drawtext=fontfile=$FUENTE_LIGERA:text='el sistema operativo de tu empresa de seguridad':fontcolor=0x9db2d0:fontsize=24:x=(w-text_w)/2:y=1815
  " -c:v libx264 -preset medium -crf 21 -movflags +faststart -an "$out"
  rm -f "$ttxt" "$stxt"
  echo "✔ $out"
done
echo "Listo: MP4 verticales en $SALIDA/"
