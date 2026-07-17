import { useEffect, useState } from 'react';
import { Calculator, CheckCircle2, Smartphone } from 'lucide-react';
import { liquidacionService, ReglasLiquidacion } from '../../services/liquidacion.service';

/**
 * Reglas de liquidación del tenant:
 *  - Si se paga el recargo por feriado trabajado (y con qué porcentaje).
 *  - Si el personal puede solicitar adelantos de sueldo desde la app móvil
 *    (la oficina los aprueba desde Novedades antes de que toquen el recibo).
 */
export const ReglasLiquidacionTab = () => {
  const [reglas, setReglas] = useState<ReglasLiquidacion | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    liquidacionService
      .getReglas()
      .then(setReglas)
      .catch(() => setError('No se pudo cargar la configuración.'));
  }, []);

  const guardar = async (cambios: Partial<ReglasLiquidacion>) => {
    if (!reglas) return;
    const previo = reglas;
    setReglas({ ...reglas, ...cambios });
    setGuardando(true);
    setMsg('');
    setError('');
    try {
      const r = await liquidacionService.setReglas({
        pagar_recargo_feriado: cambios.pagar_recargo_feriado ?? reglas.pagar_recargo_feriado,
        recargo_feriado_pct: cambios.recargo_feriado_pct ?? reglas.recargo_feriado_pct,
        adelanto_movil_habilitado:
          cambios.adelanto_movil_habilitado ?? reglas.adelanto_movil_habilitado,
      });
      setReglas(r);
      setMsg('Configuración guardada.');
    } catch {
      setReglas(previo);
      setError('No se pudo guardar la configuración.');
    } finally {
      setGuardando(false);
    }
  };

  if (!reglas) {
    return <p className="text-sm text-muted">{error || 'Cargando configuración…'}</p>;
  }

  const Toggle = ({ activo, onToggle, id }: { activo: boolean; onToggle: () => void; id: string }) => (
    <button
      id={id}
      role="switch"
      aria-checked={activo}
      onClick={onToggle}
      disabled={guardando}
      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
        activo ? 'bg-brand-blue' : 'bg-line'
      }`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
          activo ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  );

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h3 className="text-lg font-display font-bold text-navy flex items-center gap-2">
          <Calculator size={18} className="text-brand-blue" /> Reglas de liquidación
        </h3>
        <p className="text-sm text-muted">
          Definen cómo se calculan los recibos al cerrar el período. Los cambios aplican a las
          próximas liquidaciones; las ya cerradas no se recalculan.
        </p>
      </div>

      <div className="card space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <label htmlFor="toggle-feriado" className="font-medium text-navy block">
              Pagar recargo por feriado trabajado
            </label>
            <p className="text-xs text-muted mt-1">
              Las horas trabajadas en un feriado (cargado en el calendario de feriados) suman un
              recargo sobre el valor hora. El CCT de vigilancia prevé el 100%. Apagado, el feriado
              se computa e informa pero se paga como día común.
            </p>
          </div>
          <Toggle
            id="toggle-feriado"
            activo={reglas.pagar_recargo_feriado}
            onToggle={() => guardar({ pagar_recargo_feriado: !reglas.pagar_recargo_feriado })}
          />
        </div>

        {reglas.pagar_recargo_feriado && (
          <div className="flex items-center gap-3 pl-1">
            <label htmlFor="recargo-feriado-pct" className="text-sm text-muted">
              Recargo por hora de feriado:
            </label>
            <input
              id="recargo-feriado-pct"
              type="number"
              min={0}
              max={300}
              className="input w-24"
              value={reglas.recargo_feriado_pct}
              onChange={(e) => setReglas({ ...reglas, recargo_feriado_pct: Number(e.target.value) })}
              onBlur={(e) => guardar({ recargo_feriado_pct: Number(e.target.value) })}
            />
            <span className="text-sm text-muted">%</span>
          </div>
        )}
      </div>

      <div className="card space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <label htmlFor="toggle-adelanto-movil" className="font-medium text-navy flex items-center gap-2">
              <Smartphone size={15} className="text-brand-blue" /> Solicitud de adelanto desde la app móvil
            </label>
            <p className="text-xs text-muted mt-1">
              Permite que el vigilador pida un adelanto de sueldo desde su teléfono. El pedido llega
              como solicitud al módulo Novedades y NO descuenta nada hasta que la oficina lo apruebe;
              recién ahí entra al ledger de adelantos y se descuenta al cerrar la liquidación.
            </p>
          </div>
          <Toggle
            id="toggle-adelanto-movil"
            activo={reglas.adelanto_movil_habilitado}
            onToggle={() => guardar({ adelanto_movil_habilitado: !reglas.adelanto_movil_habilitado })}
          />
        </div>
      </div>

      <p className="text-xs text-muted">
        Recargos vigentes: nocturno {reglas.recargo_nocturno_pct}% · hora extra {reglas.recargo_extra_pct}%
        {reglas.pagar_recargo_feriado ? ` · feriado ${reglas.recargo_feriado_pct}%` : ' · feriado no se paga'}
      </p>

      {msg && (
        <p className="text-sm text-emerald flex items-center gap-1">
          <CheckCircle2 size={14} /> {msg}
        </p>
      )}
      {error && <p className="text-sm text-amber">{error}</p>}
    </div>
  );
};
