import { Activity, LogIn, LogOut } from 'lucide-react';
import { TurnoActual } from '../../services/vigilanciaMovil.service';

const formatHora = (iso: string) =>
  new Date(iso).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

interface Props {
  turno: TurnoActual | null;
  procesando: boolean;
  onCheckin: () => void;
  onCheckout: () => void;
}

export const AsistenciaCard = ({ turno, procesando, onCheckin, onCheckout }: Props) => {
  if (!turno) {
    return (
      <div className="bg-white/5 rounded-[2.5rem] p-6 border border-white/10 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white/40">
          <Activity size={24} />
        </div>
        <div>
          <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Estado de Guardía</p>
          <h3 className="text-lg font-bold text-white/60">Sin turno asignado</h3>
        </div>
      </div>
    );
  }

  const enServicio = !!turno.inicio_real && !turno.fin_real;
  const finalizado = !!turno.fin_real;

  return (
    <div className="bg-white/5 rounded-[2.5rem] p-6 border border-white/10 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-4 items-center">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              enServicio ? 'bg-emerald/10 text-emerald' : 'bg-amber/10 text-amber'
            }`}
          >
            <Activity size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">
              {turno.puesto?.nombre ?? 'Puesto'}
            </p>
            <h3 className="text-lg font-bold">{enServicio ? 'En Servicio' : finalizado ? 'Turno finalizado' : 'Turno pendiente'}</h3>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Horario</p>
          <p className="text-sm font-bold">
            {formatHora(turno.inicio_plan)}-{formatHora(turno.fin_plan)}
          </p>
        </div>
      </div>

      {!finalizado && (
        <button
          onClick={turno.inicio_real ? onCheckout : onCheckin}
          disabled={procesando}
          className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 ${
            turno.inicio_real ? 'bg-amber/90 text-slate-950' : 'bg-emerald text-slate-950'
          }`}
        >
          {turno.inicio_real ? <LogOut size={18} /> : <LogIn size={18} />}
          {procesando ? 'Procesando...' : turno.inicio_real ? 'Marcar salida' : 'Marcar entrada'}
        </button>
      )}
    </div>
  );
};
