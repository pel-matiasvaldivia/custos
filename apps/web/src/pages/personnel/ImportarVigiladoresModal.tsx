import { useRef, useState } from 'react';
import { X, Download, Upload, CheckCircle, AlertTriangle, FileSpreadsheet } from 'lucide-react';
import { vigilanteService } from '../../services/vigilante.service';

interface Props {
  onClose: () => void;
  onImportado: () => void;
}

type Fase = 'instrucciones' | 'subiendo' | 'resultados';

interface ResultadoImport {
  creados: number;
  errores: { fila: number; mensaje: string }[];
}

export const ImportarVigiladoresModal = ({ onClose, onImportado }: Props) => {
  const [fase, setFase] = useState<Fase>('instrucciones');
  const [descargando, setDescargando] = useState(false);
  const [subiendo, setSubiendo] = useState(false);
  const [resultado, setResultado] = useState<ResultadoImport | null>(null);
  const [archivoNombre, setArchivoNombre] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleDescargarPlantilla = async () => {
    setDescargando(true);
    try {
      await vigilanteService.descargarPlantilla();
    } finally {
      setDescargando(false);
    }
  };

  const handleArchivoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setArchivoNombre(file.name);
  };

  const handleImportar = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    setSubiendo(true);
    try {
      const res = await vigilanteService.importarMasivo(file);
      setResultado(res);
      setFase('resultados');
      if (res.creados > 0) onImportado();
    } catch {
      setResultado({ creados: 0, errores: [{ fila: 0, mensaje: 'Error inesperado al procesar el archivo.' }] });
      setFase('resultados');
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-surface rounded-xl shadow-xl w-full max-w-lg mx-4 flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-line">
          <h3 className="font-display font-bold text-navy text-lg">Importar Vigiladores</h3>
          <button onClick={onClose} className="text-muted hover:text-navy transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {fase === 'instrucciones' && (
            <>
              <div className="bg-canvas rounded-lg p-4 space-y-3">
                <p className="text-sm text-navy font-medium">Campos obligatorios en la plantilla:</p>
                <ul className="text-sm text-muted space-y-1 list-disc list-inside">
                  <li>Nombre y Apellido</li>
                  <li>Documento (DNI/CUIL)</li>
                  <li>Celular</li>
                  <li>Domicilio</li>
                  <li>Nombre y celular del contacto de emergencia</li>
                </ul>
                <p className="text-sm text-muted">Campos opcionales: Legajo (se auto-genera si no se indica), Vinculo del contacto de emergencia.</p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleDescargarPlantilla}
                  disabled={descargando}
                  className="btn-secondary flex items-center justify-center gap-2"
                >
                  <Download size={16} />
                  {descargando ? 'Descargando…' : 'Descargar plantilla Excel'}
                </button>

                <div
                  className="border-2 border-dashed border-line rounded-lg p-6 text-center cursor-pointer hover:border-brand-blue/50 transition-colors"
                  onClick={() => fileRef.current?.click()}
                >
                  <FileSpreadsheet size={28} className="mx-auto mb-2 text-muted" />
                  <p className="text-sm text-navy font-medium">
                    {archivoNombre ?? 'Haz clic para seleccionar el archivo'}
                  </p>
                  {!archivoNombre && (
                    <p className="text-xs text-muted mt-1">Formato .xlsx</p>
                  )}
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    className="hidden"
                    onChange={handleArchivoChange}
                  />
                </div>
              </div>
            </>
          )}

          {fase === 'resultados' && resultado && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-canvas">
                <CheckCircle size={22} className="text-green-500 shrink-0" />
                <div>
                  <p className="font-semibold text-navy">
                    {resultado.creados} vigilador{resultado.creados !== 1 ? 'es' : ''} importado{resultado.creados !== 1 ? 's' : ''}
                  </p>
                  {resultado.errores.length > 0 && (
                    <p className="text-sm text-muted">{resultado.errores.length} fila{resultado.errores.length !== 1 ? 's' : ''} con errores</p>
                  )}
                </div>
              </div>

              {resultado.errores.length > 0 && (
                <div className="space-y-2 max-h-52 overflow-y-auto">
                  {resultado.errores.map((e, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm p-2 rounded bg-red-50">
                      <AlertTriangle size={15} className="text-red-500 mt-0.5 shrink-0" />
                      <span className="text-red-700">
                        {e.fila > 0 ? <><strong>Fila {e.fila}:</strong> </> : null}{e.mensaje}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-line">
          {fase === 'instrucciones' && (
            <>
              <button onClick={onClose} className="btn-secondary">Cancelar</button>
              <button
                onClick={handleImportar}
                disabled={!archivoNombre || subiendo}
                className="btn-primary flex items-center gap-2 disabled:opacity-50"
              >
                <Upload size={16} />
                {subiendo ? 'Importando…' : 'Importar'}
              </button>
            </>
          )}
          {fase === 'resultados' && (
            <button onClick={onClose} className="btn-primary">Cerrar</button>
          )}
        </div>
      </div>
    </div>
  );
};
