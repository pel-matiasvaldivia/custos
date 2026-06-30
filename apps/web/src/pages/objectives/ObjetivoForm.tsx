import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { objetivoService, Objetivo } from '../../services/objetivo.service';
import { ClientePicker } from '../../components/clients/ClientePicker';

const campoClase =
  'w-full px-3 py-2 bg-canvas border border-line rounded-md focus:ring-2 focus:ring-brand-blue/20 outline-none text-sm';
const labelClase = 'text-xs font-medium text-muted uppercase tracking-wider';

interface Props {
  objetivo?: Objetivo | null;
  hasContratoActivo?: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export const ObjetivoForm = ({ objetivo, hasContratoActivo = false, onClose, onSaved }: Props) => {
  const [clienteId, setClienteId] = useState(objetivo?.cliente_id || '');
  const [clienteNombre, setClienteNombre] = useState(objetivo?.cliente_nombre || '');
  const [nombre, setNombre] = useState(objetivo?.nombre || '');
  const [direccion, setDireccion] = useState(objetivo?.direccion || '');
  const [estado, setEstado] = useState<'ACTIVO' | 'INACTIVO'>(objetivo?.estado || 'ACTIVO');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setError(null);
    try {
      const data = {
        cliente_id: clienteId || undefined,
        cliente_nombre: clienteNombre,
        nombre,
        direccion: direccion || undefined,
        ...(objetivo ? { estado } : {}),
      };
      if (objetivo) {
        await objetivoService.update(objetivo.id, data);
      } else {
        await objetivoService.create(data);
      }
      onSaved();
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'No se pudo guardar el objetivo.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-navy/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface w-full max-w-md rounded-xl shadow-xl overflow-hidden border border-line animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-line flex justify-between items-center">
          <h3 className="text-xl font-display font-bold text-navy">
            {objetivo ? 'Editar Objetivo' : 'Nuevo Objetivo'}
          </h3>
          <button onClick={onClose} className="text-muted hover:text-navy transition-colors">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <ClientePicker
            clienteId={clienteId}
            onChange={(id, nombre) => {
              setClienteId(id);
              setClienteNombre(nombre);
            }}
          />
          <div className="space-y-1">
            {objetivo && (
              <div className="flex items-center gap-2 mb-1">
                <span className={labelClase}>Código</span>
                <span className="font-mono text-xs font-bold text-navy bg-canvas border border-line rounded px-2 py-0.5">
                  {objetivo.codigo}
                </span>
              </div>
            )}
            <label className={labelClase}>Nombre del Sitio</label>
            <input className={campoClase} value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          </div>
          <div className="space-y-1">
            <label className={labelClase}>Dirección</label>
            <input className={campoClase} value={direccion} onChange={(e) => setDireccion(e.target.value)} />
          </div>

          {objetivo && (
            <div className="space-y-1">
              <label className={labelClase}>Estado</label>
              <select
                className={campoClase}
                value={estado}
                onChange={(e) => setEstado(e.target.value as 'ACTIVO' | 'INACTIVO')}
              >
                <option value="INACTIVO">INACTIVO</option>
                <option value="ACTIVO" disabled={!hasContratoActivo}>
                  ACTIVO{!hasContratoActivo ? ' (requiere contrato activo)' : ''}
                </option>
              </select>
              {!hasContratoActivo && (
                <p className="flex items-center gap-1 text-xs text-amber mt-1">
                  <AlertTriangle size={12} />
                  Sin contrato activo vinculado no se puede activar el objetivo.
                </p>
              )}
            </div>
          )}

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
              {enviando ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
