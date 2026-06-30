import { useState } from 'react';
import { X } from 'lucide-react';
import { contratoService } from '../../services/contrato.service';
import { ClientePicker } from '../../components/clients/ClientePicker';

const campoClase =
  'w-full px-3 py-2 bg-canvas border border-line rounded-md focus:ring-2 focus:ring-brand-blue/20 outline-none text-sm';
const labelClase = 'text-xs font-medium text-muted uppercase tracking-wider';

const MODOS: { value: 'POR_PLANIFICADO' | 'POR_REAL' | 'ABONO_FIJO'; label: string }[] = [
  { value: 'POR_PLANIFICADO', label: 'Por planificado' },
  { value: 'POR_REAL', label: 'Por real' },
  { value: 'ABONO_FIJO', label: 'Abono fijo' },
];

interface Props {
  objetivoId: string;
  clienteIdSugerido?: string;
  onClose: () => void;
  onCreated: () => void;
}

export const ContratoForm = ({ objetivoId, clienteIdSugerido, onClose, onCreated }: Props) => {
  const [clienteId, setClienteId] = useState(clienteIdSugerido || '');
  const [clienteNombre, setClienteNombre] = useState('');
  const [modo, setModo] = useState<'POR_PLANIFICADO' | 'POR_REAL' | 'ABONO_FIJO'>('POR_PLANIFICADO');
  const [tarifaHora, setTarifaHora] = useState('');
  const [abonoMensual, setAbonoMensual] = useState('');
  const [inicio, setInicio] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setError(null);
    try {
      await contratoService.create({
        cliente_id: clienteId || undefined,
        cliente_nombre: clienteNombre || undefined,
        objetivo_id: objetivoId,
        modo,
        tarifa_hora: tarifaHora ? Number(tarifaHora) : undefined,
        abono_mensual: abonoMensual ? Number(abonoMensual) : undefined,
        inicio: inicio || undefined,
      });
      onCreated();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'No se pudo guardar el contrato.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-navy/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface w-full max-w-md rounded-xl shadow-xl overflow-hidden border border-line animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-line flex justify-between items-center">
          <h3 className="text-xl font-display font-bold text-navy">Configurar Contrato</h3>
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
            <label className={labelClase}>Tipo de contrato</label>
            <select className={campoClase} value={modo} onChange={(e) => setModo(e.target.value as any)}>
              {MODOS.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className={labelClase}>Tarifa por hora</label>
              <input
                type="number"
                className={campoClase}
                value={tarifaHora}
                onChange={(e) => setTarifaHora(e.target.value)}
                disabled={modo === 'ABONO_FIJO'}
              />
            </div>
            <div className="space-y-1">
              <label className={labelClase}>Abono mensual</label>
              <input
                type="number"
                className={campoClase}
                value={abonoMensual}
                onChange={(e) => setAbonoMensual(e.target.value)}
                disabled={modo !== 'ABONO_FIJO'}
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className={labelClase}>Inicio</label>
            <input type="date" className={campoClase} value={inicio} onChange={(e) => setInicio(e.target.value)} />
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
              {enviando ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
