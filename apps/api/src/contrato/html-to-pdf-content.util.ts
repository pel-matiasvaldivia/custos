// Conversor mínimo de HTML (el subconjunto que produce la plantilla de
// contrato: h1-h3, p, b/strong, i/em, br, table/tr/td/th, ul/li, hr, img) a
// un "content" de pdfmake. No es un parser HTML genérico: solo cubre lo que
// la plantilla de contrato puede generar, editada a mano por el tenant desde
// Configuración. Por seguridad, las imágenes solo se embeben si vienen como
// data URI (nunca se hace fetch de URLs externas desde el servidor).

function decodeEntities(text: string): string {
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function stripTags(text: string): string {
  return text.replace(/<[^>]+>/g, '');
}

function parseInline(html: string): any {
  const normalized = html.replace(/<br\s*\/?>/gi, '\n');
  const runs: any[] = [];
  const re = /<(b|strong)>([\s\S]*?)<\/\1>|<(i|em)>([\s\S]*?)<\/\3>|([^<]+)/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(normalized))) {
    if (m[1]) runs.push({ text: decodeEntities(stripTags(m[2])), bold: true });
    else if (m[3])
      runs.push({ text: decodeEntities(stripTags(m[4])), italics: true });
    else if (m[5] && m[5].trim() !== '')
      runs.push({ text: decodeEntities(m[5]) });
  }
  return runs.length ? runs : '';
}

function parseImg(tag: string): any | null {
  const srcMatch = /src\s*=\s*"([^"]*)"/i.exec(tag);
  if (!srcMatch || !srcMatch[1].startsWith('data:')) return null;
  const widthMatch = /width\s*=\s*"(\d+)"/i.exec(tag);
  return {
    image: srcMatch[1],
    width: widthMatch ? Number(widthMatch[1]) : 120,
    margin: [0, 0, 0, 4],
  };
}

function parseTable(openTag: string, inner: string): any {
  const rows: any[] = [];
  let maxCols = 0;
  const rowRe = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let rm: RegExpExecArray | null;
  while ((rm = rowRe.exec(inner))) {
    const cells: any[] = [];
    const cellRe = /<(td|th)([^>]*)>([\s\S]*?)<\/\1>/gi;
    let cm: RegExpExecArray | null;
    while ((cm = cellRe.exec(rm[1]))) {
      const isHeader = cm[1].toLowerCase() === 'th';
      const cellInner = cm[3];
      const cellContent = /<(p|img|table|h[1-3]|ul)\b/i.test(cellInner)
        ? { stack: parseBlocks(cellInner) }
        : { text: parseInline(cellInner) };
      cells.push(
        isHeader
          ? { ...cellContent, bold: true, fillColor: '#f0f0f0' }
          : cellContent,
      );
    }
    if (cells.length) {
      rows.push(cells);
      maxCols = Math.max(maxCols, cells.length);
    }
  }
  rows.forEach((r) => {
    while (r.length < maxCols) r.push({ text: '' });
  });
  const sinBorde = /border\s*:\s*none|border\s*:\s*0/i.test(openTag);
  return {
    table: { widths: Array(maxCols).fill('*'), body: rows },
    layout: sinBorde ? 'noBorders' : 'lightHorizontalLines',
    margin: [0, 8, 0, 8],
  };
}

export function parseBlocks(html: string): any[] {
  const content: any[] = [];
  const blockRe =
    /<(h[1-3]|p|table|ul|ol)\b([^>]*)>([\s\S]*?)<\/\1>|<hr\s*\/?>|<img\b[^>]*\/?>/gi;
  let m: RegExpExecArray | null;
  while ((m = blockRe.exec(html))) {
    const full = m[0];
    if (/^<hr/i.test(full)) {
      content.push({
        canvas: [
          {
            type: 'line',
            x1: 0,
            y1: 0,
            x2: 515,
            y2: 0,
            lineWidth: 1,
            lineColor: '#cccccc',
          },
        ],
        margin: [0, 10, 0, 10],
      });
      continue;
    }
    if (/^<img/i.test(full)) {
      const img = parseImg(full);
      if (img) content.push(img);
      continue;
    }
    const tag = m[1].toLowerCase();
    const inner = m[3];
    if (tag === 'h1' || tag === 'h2' || tag === 'h3') {
      content.push({
        text: parseInline(inner),
        style: tag,
        margin: [0, 10, 0, 6],
      });
    } else if (tag === 'p') {
      content.push({ text: parseInline(inner), margin: [0, 2, 0, 6] });
    } else if (tag === 'table') {
      content.push(parseTable(full, inner));
    } else if (tag === 'ul' || tag === 'ol') {
      const items: any[] = [];
      const liRe = /<li[^>]*>([\s\S]*?)<\/li>/gi;
      let lm: RegExpExecArray | null;
      while ((lm = liRe.exec(inner))) {
        items.push(parseInline(lm[1]));
      }
      content.push({
        [tag === 'ul' ? 'ul' : 'ol']: items,
        margin: [0, 2, 0, 6],
      });
    }
  }
  return content;
}

export const PDF_STYLES = {
  h1: { fontSize: 16, bold: true },
  h2: { fontSize: 13, bold: true },
  h3: { fontSize: 11, bold: true },
};
