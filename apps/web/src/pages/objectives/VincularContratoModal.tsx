import { useEffect, useState } from 'react';
import { X, Link2 } from 'lucide-react';
import { contratoService } from '../../services/contrato.service';
import { Contrato } from '../../services/objetivo.service';

interface Props {
  objetivoId: string;
  clienteId?: string | null;
  clienteNombre: string;
  onClose: () => void;
  onVinculado: () => void;
}

const campoClase =
  'w-full px-3 py-2 bg-canvas border border-line rounded-md focus:ring-2 focus:ring-brand-blue/20 outline-none text-sm';
const labelClase = 'text-xs font-medium text-muted uppercase tracking-wider';

const ESTADOS: Record<string, string> = {
  BORRADOR: 'Borrador',
  ACTIVO: 'Activo',
  SUSPENDIDO: 'Suspendido',
  FINALIZADO: 'Finalizado',
};

export const VincularContratoModal = ({
  objetivoId,
  clienteId,
  clienteNombre,
  onClose,
  onVinculado,
}: Props) => {
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [contratoSeleccionado, setContratoSeleccionado] = useState('');
  const [vinculando, setVinculando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (!clienteId) return;
    setCargando(true);
    contratoService
      .getByCliente(clienteId)
      .then((cs) => {
        // Show all contracts for this client that are NOT already linked to another objetivo
        // (or linked to this same objetivo — would be the normal state if already linked)
        const disponibles = cs.filter((c) => !c.objetivo_id || c.objetivo_id === objetivoId);
        setContratos(disponibles);
        if (disponibles.length === 1) setContratoSeleccionado(disponibles[0].id);
      })
      .catch(() => setError('No se pudieron cargar los contratos del cliente.'))
      .finally(() => setCargando(false));
  }, [clienteId, objetivoId]);

  const handleVincular = async () => {
    if (!contratoSeleccionado) return;
    setVinculando(true);
    setError(null);
    try {
      await contratoService.update(contratoSeleccionado, { objetivo_id: objetivoId });
      onVinculado();
    } catch (err) {
      setError(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'No se pudo vincular el contrato.',
      );
    } finally {
      setVinculando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-navy/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface w-full max-w-md rounded-xl shadow-xl overflow-hidden border border-line animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-line flex justify-between items-center">
          <h3 className="text-xl font-display font-bold text-navy flex items-center gap-2">
            <Link2 size={18} className="text-brand-blue" /> Vincular contrato
          </h3>
          <button onClick={onClose} className="text-muted hover:text-navy transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-amber/10 border border-amber/30 rounded-md text-sm text-amber">{error}</div>
          )}

          {!clienteId ? (
            <p className="text-sm text-muted">
              Este objetivo no tiene un cliente registrado con ID. Creá el contrato directamente desde la ficha del
              cliente.
            </p>
          ) : cargando ? (
            <p className="text-sm text-muted italic">Cargando contratos...</p>
          ) : contratos.length === 0 ? (
            <p className="text-sm text-muted">
              No hay contratos disponibles para <strong>{clienteNombre}</strong>. Creá uno desde la ficha del cliente y
              seleccioná este objetivo al crearlo.
            </p>
          ) : (
            <div className="space-y-1">
              <label className={labelClase}>Seleccioná el contrato a vincular</label>
              <select
                className={campoClase}
                value={contratoSeleccionado}
                onChange={(e) => setContratoSeleccionado(e.target.value)}
              >
                <option value="">— Elegí un contrato —</option>
                {contratos.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.codigo} · {ESTADOS[c.estado] ?? c.estado}
                    {c.facturacion
                      ? ` · ${c.facturacion.modo === 'ABONO_FIJO' ? `Abono $${c.facturacion.abono_mensual}/mes` : `$${c.facturacion.tarifa_hora}/h`}`
                      : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-line text-muted font-medium rounded-md hover:bg-canvas transition-colors"
            >
              Cancelar
            </button>
            {contratos.length > 0 && (
              <button
                type="button"
                onClick={handleVincular}
                disabled={!contratoSeleccionado || vinculando}
                className="flex-1 btn-primary disabled:opacity-60"
              >
                {vinculando ? 'Vinculando...' : 'Vincular'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
