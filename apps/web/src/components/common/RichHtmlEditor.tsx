import { useEffect, useRef, useState } from 'react';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Code2,
  Undo2,
  Redo2,
} from 'lucide-react';

const FUENTES = [
  { label: 'Predeterminada', value: '' },
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Times New Roman', value: "'Times New Roman', serif" },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Courier New', value: "'Courier New', monospace" },
  { label: 'Verdana', value: 'Verdana, sans-serif' },
];

const TAMANOS = [
  { label: '10', value: '1' },
  { label: '13', value: '2' },
  { label: '16', value: '3' },
  { label: '18', value: '4' },
  { label: '24', value: '5' },
  { label: '32', value: '6' },
  { label: '48', value: '7' },
];

const botonClase =
  'p-1.5 rounded hover:bg-canvas text-muted hover:text-navy transition-colors';

interface Props {
  value: string;
  onChange: (html: string) => void;
  height?: number;
}

export const RichHtmlEditor = ({ value, onChange, height = 450 }: Props) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [modoCodigo, setModoCodigo] = useState(false);
  // El contentEditable no se vuelve a sincronizar con `value` en cada render
  // (perdería la posición del cursor); solo se hidrata al montar o al volver
  // del modo código.
  const valorInicial = useRef(value);

  useEffect(() => {
    if (!modoCodigo && editorRef.current) {
      editorRef.current.innerHTML = valorInicial.current;
    }
  }, [modoCodigo]);

  const emitirCambio = () => {
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  const ejecutar = (comando: string, valor?: string) => {
    editorRef.current?.focus();
    document.execCommand(comando, false, valor);
    emitirCambio();
  };

  const handleCodigoChange = (html: string) => {
    valorInicial.current = html;
    onChange(html);
  };

  return (
    <div className="border border-line rounded-md overflow-hidden bg-canvas">
      <div className="flex flex-wrap items-center gap-1 p-1.5 border-b border-line bg-surface">
        <select
          className="text-xs border border-line rounded px-1.5 py-1 bg-surface outline-none"
          defaultValue=""
          disabled={modoCodigo}
          onChange={(e) => ejecutar('fontName', e.target.value)}
          title="Fuente"
        >
          {FUENTES.map((f) => (
            <option key={f.label} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
        <select
          className="text-xs border border-line rounded px-1.5 py-1 bg-surface outline-none"
          defaultValue="3"
          disabled={modoCodigo}
          onChange={(e) => ejecutar('fontSize', e.target.value)}
          title="Tamaño (px aprox.)"
        >
          {TAMANOS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}px
            </option>
          ))}
        </select>

        <div className="w-px h-5 bg-line mx-1" />

        <button type="button" disabled={modoCodigo} className={botonClase} onMouseDown={(e) => e.preventDefault()} onClick={() => ejecutar('bold')} title="Negrita">
          <Bold size={15} />
        </button>
        <button type="button" disabled={modoCodigo} className={botonClase} onMouseDown={(e) => e.preventDefault()} onClick={() => ejecutar('italic')} title="Cursiva">
          <Italic size={15} />
        </button>
        <button type="button" disabled={modoCodigo} className={botonClase} onMouseDown={(e) => e.preventDefault()} onClick={() => ejecutar('underline')} title="Subrayado">
          <Underline size={15} />
        </button>

        <div className="w-px h-5 bg-line mx-1" />

        <button type="button" disabled={modoCodigo} className={botonClase} onMouseDown={(e) => e.preventDefault()} onClick={() => ejecutar('justifyLeft')} title="Alinear izquierda">
          <AlignLeft size={15} />
        </button>
        <button type="button" disabled={modoCodigo} className={botonClase} onMouseDown={(e) => e.preventDefault()} onClick={() => ejecutar('justifyCenter')} title="Centrar">
          <AlignCenter size={15} />
        </button>
        <button type="button" disabled={modoCodigo} className={botonClase} onMouseDown={(e) => e.preventDefault()} onClick={() => ejecutar('justifyRight')} title="Alinear derecha">
          <AlignRight size={15} />
        </button>

        <div className="w-px h-5 bg-line mx-1" />

        <button type="button" disabled={modoCodigo} className={botonClase} onMouseDown={(e) => e.preventDefault()} onClick={() => ejecutar('insertUnorderedList')} title="Lista">
          <List size={15} />
        </button>
        <button type="button" disabled={modoCodigo} className={botonClase} onMouseDown={(e) => e.preventDefault()} onClick={() => ejecutar('insertOrderedList')} title="Lista numerada">
          <ListOrdered size={15} />
        </button>

        <div className="w-px h-5 bg-line mx-1" />

        <button type="button" disabled={modoCodigo} className={botonClase} onMouseDown={(e) => e.preventDefault()} onClick={() => ejecutar('undo')} title="Deshacer">
          <Undo2 size={15} />
        </button>
        <button type="button" disabled={modoCodigo} className={botonClase} onMouseDown={(e) => e.preventDefault()} onClick={() => ejecutar('redo')} title="Rehacer">
          <Redo2 size={15} />
        </button>

        <div className="flex-1" />

        <button
          type="button"
          onClick={() => setModoCodigo((m) => !m)}
          className={`${botonClase} flex items-center gap-1 text-xs font-medium ${modoCodigo ? 'bg-brand-blue/10 text-brand-blue' : ''}`}
          title="Ver/editar HTML"
        >
          <Code2 size={15} /> HTML
        </button>
      </div>

      {modoCodigo ? (
        <textarea
          className="w-full p-3 font-mono text-xs outline-none bg-canvas resize-none"
          style={{ height }}
          value={value}
          onChange={(e) => handleCodigoChange(e.target.value)}
          spellCheck={false}
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          className="w-full p-4 bg-white outline-none overflow-y-auto prose prose-sm max-w-none"
          style={{ height }}
          onInput={emitirCambio}
          onBlur={emitirCambio}
        />
      )}
    </div>
  );
};
