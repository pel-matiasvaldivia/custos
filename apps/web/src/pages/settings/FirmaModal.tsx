import { useState } from 'react';
import { X } from 'lucide-react';
import { contratoConfigService, ConfiguracionContrato } from '../../services/contratoConfig.service';

const campoClase =
  'w-full px-3 py-2 bg-canvas border border-line rounded-md focus:ring-2 focus:ring-brand-blue/20 outline-none text-sm';
const labelClase = 'text-xs font-medium text-muted uppercase tracking-wider';

interface Props {
  config: ConfiguracionContrato;
  onClose: () => void;
  onSaved: (config: ConfiguracionContrato) => void;
}

export const FirmaModal = ({ config, onClose, onSaved }: Props) => {
  const [archivo, setArchivo] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(config.firma_url);
  const [nombre, setNombre] = useState(config.firma_nombre || '');
  const [cargo, setCargo] = useState(config.firma_cargo || 'Director');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleArchivo = (file: File | null) => {
    setArchivo(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!archivo) {
      setError('Seleccioná una imagen de la firma.');
      return;
    }
    setEnviando(true);
    setError(null);
    try {
      const actualizado = await contratoConfigService.actualizarFirma(archivo, nombre, cargo);
      onSaved(actualizado);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'No se pudo guardar la firma.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-navy/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface w-full max-w-md rounded-xl shadow-xl overflow-hidden border border-line animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-line flex justify-between items-center">
          <h3 className="text-xl font-display font-bold text-navy">Firma digital del Director</h3>
          <button onClick={onClose} className="text-muted hover:text-navy transition-colors">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-sm text-muted">
            Cargá una imagen de la firma (PNG/JPG, fondo transparente recomendado) del Director o Responsable
            de la empresa. Se usará para firmar automáticamente los contratos generados en PDF.
          </p>

          <div className="space-y-1">
            <label className={labelClase}>Imagen de la firma</label>
            <input
              type="file"
              accept="image/png,image/jpeg"
              className={campoClase}
              onChange={(e) => handleArchivo(e.target.files?.[0] || null)}
            />
          </div>

          {preview && (
            <div className="p-4 bg-canvas border border-line rounded-md flex items-center justify-center">
              <img src={preview} alt="Vista previa de la firma" className="max-h-24" />
            </div>
          )}

          <div className="space-y-1">
            <label className={labelClase}>Nombre y apellido</label>
            <input
              type="text"
              className={campoClase}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Juan Pérez"
            />
          </div>
          <div className="space-y-1">
            <label className={labelClase}>Cargo</label>
            <input
              type="text"
              className={campoClase}
              value={cargo}
              onChange={(e) => setCargo(e.target.value)}
              placeholder="Ej: Director / Responsable de Seguridad"
            />
          </div>

          {error && (
            <div className="p-3 bg-amber/10 border border-amber/30 rounded-md text-sm text-amber">{error}</div>
          )}

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-line text-muted font-medium rounded-md hover:bg-canvas transition-colors"
            >
              Cancelar
            </button>
            <button type="submit" className="flex-1 btn-primary" disabled={enviando}>
              {enviando ? 'Guardando...' : 'Guardar firma'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
