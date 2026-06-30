import { useEffect, useState } from 'react';
import { X, Download, FileSignature } from 'lucide-react';
import { contratoService } from '../../services/contrato.service';
import { Contrato } from '../../services/objetivo.service';

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    contratoService
      .getDocumentoHtml(contrato.id)
      .catch((err) => {
        setError(err?.response?.data?.message || 'No se pudo cargar la plantilla del contrato.');
        return '';
      })
      .then((h) => setHtml(h))
      .finally(() => setLoading(false));
  }, [contrato.id]);

  const handleGenerar = async () => {
    setGenerando(true);
    setError(null);
    try {
      const blob = await contratoService.generarDocumento(contrato.id, html);
      descargarBlob(blob, `${contrato.codigo}.pdf`);
      onGenerado();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'No se pudo generar el documento.');
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
    } catch (err: any) {
      setError(err?.response?.data?.message || 'No se pudo descargar el documento.');
    } finally {
      setDescargando(false);
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
          <button onClick={onClose} className="text-muted hover:text-navy transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {error && <div className="p-3 bg-amber/10 border border-amber/30 rounded-md text-sm text-amber">{error}</div>}

          {loading ? (
            <p className="text-muted italic py-8 text-center">Cargando documento...</p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted uppercase tracking-wider">HTML</label>
                <textarea
                  className="w-full h-[450px] p-3 bg-canvas border border-line rounded-md font-mono text-xs outline-none focus:ring-2 focus:ring-brand-blue/20"
                  value={html}
                  onChange={(e) => setHtml(e.target.value)}
                  spellCheck={false}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted uppercase tracking-wider">Vista previa</label>
                <iframe title="preview" srcDoc={html} className="w-full h-[450px] bg-white border border-line rounded-md" />
              </div>
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
