import { useState } from 'react';
import { X } from 'lucide-react';
import { Puesto } from '../../services/objetivo.service';
import { cuadranteService, sugerirDotacion, PuestoCobertura } from '../../services/cuadrante.service';

const DIAS = [
  { value: 1, label: 'Lun' },
  { value: 2, label: 'Mar' },
  { value: 3, label: 'Mié' },
  { value: 4, label: 'Jue' },
  { value: 5, label: 'Vie' },
  { value: 6, label: 'Sáb' },
  { value: 7, label: 'Dom' },
];

const JORNADA_MAX_SEMANAL_DEFAULT = 48;

interface Props {
  puesto: Puesto;
  coberturaActual: PuestoCobertura | null;
  onClose: () => void;
  onGuardado: () => void;
}

export const PuestoCoberturaForm = ({ puesto, coberturaActual, onClose, onGuardado }: Props) => {
  const [horasDia, setHorasDia] = useState(coberturaActual?.ventana?.horas_dia ?? 24);
  const [dias, setDias] = useState<number[]>(coberturaActual?.ventana?.dias ?? [1, 2, 3, 4, 5, 6, 7]);
  const [overrideManual, setOverrideManual] = useState(coberturaActual?.dotacion_requerida ?? null);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sugerido = sugerirDotacion(horasDia, dias.length, JORNADA_MAX_SEMANAL_DEFAULT);
  const dotacionFinal = overrideManual ?? sugerido;

  const toggleDia = (d: number) => {
    setDias((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d].sort()));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (dias.length === 0) {
      setError('Elegí al menos un día de cobertura.');
      return;
    }
    setEnviando(true);
    setError(null);
    try {
      await cuadranteService.upsertCobertura(puesto.id, {
        dotacion_requerida: overrideManual ?? undefined,
        ventana: { horas_dia: horasDia, dias },
      });
      onGuardado();
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'No se pudo guardar la cobertura.');
    } finally {
      setEnviando(false);
    }
  };

  const campoClase =
    'w-full px-3 py-2 bg-canvas border border-line rounded-md focus:ring-2 focus:ring-brand-blue/20 outline-none text-sm';
  const labelClase = 'text-xs font-medium text-muted uppercase tracking-wider';

  return (
    <div className="fixed inset-0 bg-navy/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface w-full max-w-sm rounded-xl shadow-xl border border-line animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-line flex justify-between items-center">
          <div>
            <h3 className="text-lg font-display font-bold text-navy">Cobertura requerida</h3>
            <p className="text-xs text-muted">{puesto.nombre}</p>
          </div>
          <button onClick={onClose} className="text-muted hover:text-navy transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className={labelClase}>Horas de cobertura por día</label>
            <input
              type="number"
              min={1}
              max={24}
              className={campoClase}
              value={horasDia}
              onChange={(e) => setHorasDia(Math.min(24, Math.max(1, Number(e.target.value))))}
              required
            />
          </div>

          <div className="space-y-1">
            <label className={labelClase}>Días que requieren cobertura</label>
            <div className="flex gap-1 flex-wrap">
              {DIAS.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => toggleDia(d.value)}
                  className={`px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                    dias.includes(d.value)
                      ? 'bg-brand-blue text-white border-brand-blue'
                      : 'border-line text-muted hover:bg-canvas'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-lg border border-line bg-canvas text-sm space-y-2">
            <p className="text-navy">
              Dotación sugerida: <span className="font-bold">{sugerido}</span> vigilador(es)
            </p>
            <div className="space-y-1">
              <label className={labelClase}>Override manual (opcional)</label>
              <input
                type="number"
                min={0}
                placeholder={`${sugerido}`}
                className={campoClase}
                value={overrideManual ?? ''}
                onChange={(e) => setOverrideManual(e.target.value === '' ? null : Number(e.target.value))}
              />
            </div>
            <p className="text-xs text-muted">Se va a guardar: {dotacionFinal} vigilador(es).</p>
          </div>

          {error && <div className="p-3 bg-amber/10 border border-amber/30 rounded-md text-sm text-amber">{error}</div>}

          <div className="pt-2 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-line text-muted font-medium rounded-md hover:bg-canvas transition-colors">
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
