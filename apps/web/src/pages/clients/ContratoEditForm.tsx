import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { contratoService, UpdateContratoData } from '../../services/contrato.service';
import { Contrato } from '../../services/objetivo.service';

interface Props {
  contrato: Contrato;
  onClose: () => void;
  onSaved: (updated: Contrato) => void;
}

type Modo = 'POR_PLANIFICADO' | 'POR_REAL' | 'ABONO_FIJO';

const MODOS: { value: Modo; label: string }[] = [
  { value: 'POR_PLANIFICADO', label: 'Por horas planificadas' },
  { value: 'POR_REAL', label: 'Por horas reales' },
  { value: 'ABONO_FIJO', label: 'Abono fijo mensual' },
];

const ESTADOS = [
  { value: 'BORRADOR', label: 'Borrador' },
  { value: 'ACTIVO', label: 'Activo' },
  { value: 'SUSPENDIDO', label: 'Suspendido' },
  { value: 'FINALIZADO', label: 'Finalizado' },
];

export const ContratoEditForm = ({ contrato, onClose, onSaved }: Props) => {
  const fac = contrato.facturacion;

  const [modo, setModo] = useState<Modo>((fac?.modo as Modo) ?? 'ABONO_FIJO');
  const [estado, setEstado] = useState(contrato.estado);
  const [tarifaHora, setTarifaHora] = useState(fac?.tarifa_hora ? String(fac.tarifa_hora) : '');
  const [horasContratadas, setHorasContratadas] = useState('');
  const [abonoMensual, setAbonoMensual] = useState(fac?.abono_mensual ? String(fac.abono_mensual) : '');
  const [inicio, setInicio] = useState(contrato.inicio ? contrato.inicio.slice(0, 10) : '');
  const [fin, setFin] = useState(contrato.fin ? contrato.fin.slice(0, 10) : '');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const facturacionCompleta =
    modo === 'ABONO_FIJO' ? !!abonoMensual : !!tarifaHora;

  const puedeActivar = facturacionCompleta;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (estado === 'ACTIVO' && !facturacionCompleta) {
      setError('Completá la configuración de facturación antes de activar el contrato.');
      return;
    }

    const payload: UpdateContratoData = {
      estado,
      modo,
      inicio: inicio || undefined,
      fin: fin || undefined,
    };

    if (modo === 'ABONO_FIJO') {
      payload.abono_mensual = abonoMensual ? Number(abonoMensual) : undefined;
    } else {
      payload.tarifa_hora = tarifaHora ? Number(tarifaHora) : undefined;
      payload.horas_contratadas = horasContratadas ? Number(horasContratadas) : undefined;
    }

    setGuardando(true);
    try {
      const updated = await contratoService.update(contrato.id, payload);
      onSaved(updated);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Error al guardar el contrato.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-surface rounded-xl shadow-xl w-full max-w-lg mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-line">
          <div>
            <h3 className="font-display font-bold text-navy text-lg">Editar contrato</h3>
            <p className="text-xs font-mono text-muted">{contrato.codigo}</p>
          </div>
          <button onClick={onClose} className="text-muted hover:text-navy transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1">
                Estado
              </label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value as Contrato['estado'])}
                className="w-full input"
              >
                {ESTADOS.map((s) => (
                  <option
                    key={s.value}
                    value={s.value}
                    disabled={s.value === 'ACTIVO' && !puedeActivar}
                  >
                    {s.label}{s.value === 'ACTIVO' && !puedeActivar ? ' (completar facturación)' : ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1">
                Modo de facturación
              </label>
              <select
                value={modo}
                onChange={(e) => setModo(e.target.value as Modo)}
                className="w-full input"
              >
                {MODOS.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>
          </div>

          {modo === 'ABONO_FIJO' ? (
            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1">
                Abono mensual ($) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Ej: 150000"
                value={abonoMensual}
                onChange={(e) => setAbonoMensual(e.target.value)}
                className="w-full input"
                required
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1">
                  Tarifa por hora ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Ej: 2500"
                  value={tarifaHora}
                  onChange={(e) => setTarifaHora(e.target.value)}
                  className="w-full input"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1">
                  Horas contratadas / mes
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="Ej: 720"
                  value={horasContratadas}
                  onChange={(e) => setHorasContratadas(e.target.value)}
                  className="w-full input"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1">
                Inicio del contrato
              </label>
              <input
                type="date"
                value={inicio}
                onChange={(e) => setInicio(e.target.value)}
                className="w-full input"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1">
                Fin del contrato
              </label>
              <input
                type="date"
                value={fin}
                onChange={(e) => setFin(e.target.value)}
                className="w-full input"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" disabled={guardando} className="btn-primary disabled:opacity-50">
              {guardando ? 'Guardando…' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
