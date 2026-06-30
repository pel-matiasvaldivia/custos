import { useEffect, useState } from 'react';
import { X, Download, FileSignature, History } from 'lucide-react';
import { contratoService, ContratoVersionEntry } from '../../services/contrato.service';
import { Contrato } from '../../services/objetivo.service';
import { RichHtmlEditor } from '../../components/common/RichHtmlEditor';

interface Props {
  contrato: Contrato;
  onClose: () => void;
  onGenerado: () => void;
}

const descargarBlob = (blob: Blob, nombreArchivo: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nombreArchivo;
  a.click();
  URL.revokeObjectURL(url);
};

export const ContratoDocumentoModal = ({ contrato, onClose, onGenerado }: Props) => {
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(true);
  const [generando, setGenerando] = useState(false);
  const [descargando, setDescargando] = useState(false);
  const [descargandoVersion, setDescargandoVersion] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [versiones, setVersiones] = useState<ContratoVersionEntry[]>([]);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);

  useEffect(() => {
    contratoService
      .getDocumentoHtml(contrato.id)
      .catch((err) => {
        setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'No se pudo cargar la plantilla del contrato.');
        return '';
      })
      .then((h) => setHtml(h))
      .finally(() => setLoading(false));

    if (contrato.documento_key) {
      contratoService.getVersiones(contrato.id).then(setVersiones).catch(() => {});
    }
  }, [contrato.id, contrato.documento_key]);

  const handleGenerar = async () => {
    setGenerando(true);
    setError(null);
    try {
      const blob = await contratoService.generarDocumento(contrato.id, html);
      descargarBlob(blob, `${contrato.codigo}.pdf`);
      const nuevasVersiones = await contratoService.getVersiones(contrato.id);
      setVersiones(nuevasVersiones);
      onGenerado();
    } catch (err) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'No se pudo generar el documento.');
    } finally {
      setGenerando(false);
    }
  };

  const handleDescargarExistente = async () => {
    setDescargando(true);
    setError(null);
    try {
      const blob = await contratoService.descargarDocumento(contrato.id);
      descargarBlob(blob, `${contrato.codigo}.pdf`);
    } catch (err) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'No se pudo descargar el documento.');
    } finally {
      setDescargando(false);
    }
  };

  const handleDescargarVersion = async (version: number) => {
    setDescargandoVersion(version);
    try {
      const blob = await contratoService.descargarVersion(contrato.id, version);
      descargarBlob(blob, `${contrato.codigo}-v${version}.pdf`);
    } catch (err) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'No se pudo descargar la versión.');
    } finally {
      setDescargandoVersion(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-navy/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface w-full max-w-6xl rounded-xl shadow-xl overflow-hidden border border-line animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-line flex justify-between items-center">
          <div>
            <h3 className="text-xl font-display font-bold text-navy flex items-center gap-2">
              <FileSignature size={20} className="text-brand-blue" /> Documento del contrato {contrato.codigo}
            </h3>
            <p className="text-sm text-muted mt-1">
              Editá el HTML si es necesario y generá el PDF firmado para enviar al cliente.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {versiones.length > 0 && (
              <button
                onClick={() => setMostrarHistorial(!mostrarHistorial)}
                className="flex items-center gap-1.5 text-sm text-muted hover:text-navy transition-colors border border-line rounded-md px-3 py-1.5"
              >
                <History size={15} />
                {versiones.length} {versiones.length === 1 ? 'versión' : 'versiones'}
              </button>
            )}
            <button onClick={onClose} className="text-muted hover:text-navy transition-colors ml-2">
              <X size={20} />
            </button>
          </div>
        </div>

        {mostrarHistorial && versiones.length > 0 && (
          <div className="border-b border-line bg-canvas px-6 py-4">
            <p className="text-xs font-medium text-muted uppercase tracking-wider mb-3">Historial de versiones</p>
            <div className="space-y-1.5">
              {versiones.map((v) => (
                <div key={v.id} className="flex items-center justify-between gap-4 text-sm">
                  <span className="font-mono text-xs bg-surface border border-line rounded px-2 py-0.5 text-navy">
                    v{v.version}
                  </span>
                  <span className="text-muted flex-1">
                    {new Date(v.generado_at).toLocaleString('es-AR')}
                  </span>
                  <button
                    onClick={() => handleDescargarVersion(v.version)}
                    disabled={descargandoVersion === v.version}
                    className="flex items-center gap-1 text-brand-blue hover:underline text-xs"
                  >
                    <Download size={12} />
                    {descargandoVersion === v.version ? 'Descargando...' : 'Descargar'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-6 space-y-4">
          {error && <div className="p-3 bg-amber/10 border border-amber/30 rounded-md text-sm text-amber">{error}</div>}

          {loading ? (
            <p className="text-muted italic py-8 text-center">Cargando documento...</p>
          ) : (
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted uppercase tracking-wider">Documento</label>
              <RichHtmlEditor value={html} onChange={setHtml} height={450} />
            </div>
          )}

          {contrato.documento_generado_at && (
            <p className="text-xs text-muted">
              Último documento generado el {new Date(contrato.documento_generado_at).toLocaleString('es-AR')}.
            </p>
          )}

          <div className="pt-2 flex gap-3 justify-end">
            {contrato.documento_key && (
              <button
                type="button"
                onClick={handleDescargarExistente}
                disabled={descargando}
                className="px-4 py-2 border border-line text-muted font-medium rounded-md hover:bg-canvas transition-colors flex items-center gap-2"
              >
                <Download size={16} /> {descargando ? 'Descargando...' : 'Descargar último PDF'}
              </button>
            )}
            <button
              type="button"
              onClick={handleGenerar}
              disabled={generando || loading}
              className="btn btn-primary flex items-center gap-2"
            >
              <FileSignature size={16} /> {generando ? 'Generando...' : 'Generar y descargar PDF firmado'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
