import { useRef, useState } from 'react';
import {
  X, UploadCloud, FileSpreadsheet, Loader2, CheckCircle2, AlertTriangle,
} from 'lucide-react';
import { arcaService, ResultadoImportacion } from '../../services/arca.service';

/**
 * Importa la nómina desde el CSV de Simplificación Registral / "Mis Empleados"
 * de ARCA. Cada fila (CUIL, apellido, nombre, fecha de ingreso) se da de alta
 * como vigilador; los CUIL ya existentes se omiten.
 */
export const ImportarNominaModal = ({
  onClose,
  onImportado,
}: {
  onClose: () => void;
  onImportado: () => void;
}) => {
  const [archivo, setArchivo] = useState<File | null>(null);
  const [subiendo, setSubiendo] = useState(false);
  const [resultado, setResultado] = useState<ResultadoImportacion | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [arrastrando, setArrastrando] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const importar = async () => {
    if (!archivo) return;
    setSubiendo(true);
    setError(null);
    try {
      const r = await arcaService.importarNomina(archivo);
      setResultado(r);
      if (r.importados > 0) onImportado();
    } catch (e) {
      const data = (e as { response?: { data?: { message?: string } } })?.response?.data;
      setError(data?.message || (e instanceof Error ? e.message : 'No se pudo importar la nómina.'));
    } finally {
      setSubiendo(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setArrastrando(false);
    const f = e.dataTransfer.files?.[0];
    if (f) setArchivo(f);
  };

  return (
    <div className="fixed inset-0 bg-navy/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-line">
          <h3 className="font-display font-bold text-navy flex items-center gap-2">
            <FileSpreadsheet size={18} className="text-brand-blue" /> Importar nómina de ARCA
          </h3>
          <button onClick={onClose} className="text-muted hover:text-navy"><X size={18} /></button>
        </div>

        <div className="p-5 space-y-4">
          {resultado ? (
            <div className="space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald/10 flex items-center justify-center mx-auto">
                <CheckCircle2 size={30} className="text-emerald" />
              </div>
              <p className="text-center font-display font-bold text-navy">
                {resultado.importados} vigilador{resultado.importados === 1 ? '' : 'es'} importado{resultado.importados === 1 ? '' : 's'} con éxito
              </p>
              {resultado.omitidos > 0 && (
                <p className="text-center text-sm text-muted">{resultado.omitidos} omitido(s) (ya existían o sin datos válidos).</p>
              )}
              {resultado.errores.length > 0 && (
                <div className="bg-amber/5 border border-amber/20 rounded-lg p-3 max-h-32 overflow-y-auto">
                  {resultado.errores.map((er, i) => <p key={i} className="text-xs text-amber">{er}</p>)}
                </div>
              )}
              <button onClick={onClose} className="w-full py-2 bg-brand-blue text-white text-sm font-medium rounded-lg hover:bg-brand-deep">
                Listo
              </button>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted">
                Subí el archivo CSV que exporta ARCA desde Simplificación Registral / "Mis Empleados".
                Reconocemos las columnas CUIL, apellido, nombre y fecha de ingreso.
              </p>
              <div
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setArrastrando(true); }}
                onDragLeave={() => setArrastrando(false)}
                onDrop={onDrop}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                  arrastrando ? 'border-brand-blue bg-brand-blue/5' : 'border-line hover:border-brand-blue/50'
                }`}
              >
                <UploadCloud size={28} className="mx-auto text-muted mb-2" />
                {archivo ? (
                  <p className="text-sm font-medium text-navy">{archivo.name}</p>
                ) : (
                  <p className="text-sm text-muted">Arrastrá el archivo acá o hacé clic para elegirlo</p>
                )}
                <input ref={inputRef} type="file" accept=".csv,.txt,text/csv" className="hidden"
                  onChange={(e) => setArchivo(e.target.files?.[0] ?? null)} />
              </div>

              {error && <p className="text-sm text-amber flex items-center gap-1"><AlertTriangle size={14} /> {error}</p>}

              <button onClick={importar} disabled={!archivo || subiendo}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-brand-blue text-white font-medium rounded-lg hover:bg-brand-deep disabled:opacity-50">
                {subiendo ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
                {subiendo ? 'Importando…' : 'Importar nómina'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
