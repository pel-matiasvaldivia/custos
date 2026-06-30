import { useState } from 'react';
import { X } from 'lucide-react';
import { cuadranteService, DiaDef, EsquemaTurno } from '../../services/cuadrante.service';

interface Props {
  onClose: () => void;
  onCreado: (esquema: EsquemaTurno) => void;
}

interface DiaFormState {
  tipo: 'TRABAJO' | 'FRANCO';
  hora_inicio: string;
  duracion_horas: number;
}

const diaInicial = (): DiaFormState => ({ tipo: 'TRABAJO', hora_inicio: '08:00', duracion_horas: 12 });

/** v1: un bloque por día (cubre patrones 12x12 / 24x24). Ciclos multi-bloque quedan para una pasada futura. */
export const EsquemaTurnoForm = ({ onClose, onCreado }: Props) => {
  const [nombre, setNombre] = useState('');
  const [diasCiclo, setDiasCiclo] = useState(2);
  const [dias, setDias] = useState<DiaFormState[]>([diaInicial(), { tipo: 'FRANCO', hora_inicio: '08:00', duracion_horas: 12 }]);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCambiarDiasCiclo = (n: number) => {
    const nuevo = Math.max(1, n);
    setDiasCiclo(nuevo);
    setDias((prev) => {
      const copia = [...prev];
      while (copia.length < nuevo) copia.push(diaInicial());
      return copia.slice(0, nuevo);
    });
  };

  const actualizarDia = (idx: number, cambio: Partial<DiaFormState>) => {
    setDias((prev) => prev.map((d, i) => (i === idx ? { ...d, ...cambio } : d)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setError('Indicá un nombre para el esquema.');
      return;
    }
    setEnviando(true);
    setError(null);
    try {
      const dto: DiaDef[] = dias.map((d) =>
        d.tipo === 'FRANCO'
          ? { tipo: 'FRANCO' as const }
          : {
              tipo: 'TRABAJO' as const,
              bloques: [{ hora_inicio: d.hora_inicio, duracion_horas: d.duracion_horas }],
            },
      );
      const esquema = await cuadranteService.crearEsquema({
        nombre: nombre.trim(),
        dias_ciclo: diasCiclo,
        dias: dto,
      });
      onCreado(esquema);
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'No se pudo crear el esquema.');
    } finally {
      setEnviando(false);
    }
  };

  const campoClase =
    'w-full px-3 py-2 bg-canvas border border-line rounded-md focus:ring-2 focus:ring-brand-blue/20 outline-none text-sm';
  const labelClase = 'text-xs font-medium text-muted uppercase tracking-wider';

  return (
    <div className="fixed inset-0 bg-navy/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface w-full max-w-md rounded-xl shadow-xl border border-line animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-line flex justify-between items-center shrink-0">
          <h3 className="text-lg font-display font-bold text-navy">Nuevo esquema de turno</h3>
          <button onClick={onClose} className="text-muted hover:text-navy transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div className="space-y-1">
            <label className={labelClase}>Nombre</label>
            <input
              type="text"
              placeholder="Ej: 12x36, 24x48"
              className={campoClase}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className={labelClase}>Días del ciclo</label>
            <input
              type="number"
              min={1}
              max={28}
              className={campoClase}
              value={diasCiclo}
              onChange={(e) => handleCambiarDiasCiclo(Number(e.target.value))}
              required
            />
          </div>

          <div className="space-y-3">
            <label className={labelClase}>Patrón por día del ciclo</label>
            {dias.map((d, idx) => (
              <div key={idx} className="p-3 border border-line rounded-lg bg-canvas space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-navy">Día {idx + 1}</span>
                  <select
                    className="px-2 py-1 bg-surface border border-line rounded-md text-xs"
                    value={d.tipo}
                    onChange={(e) => actualizarDia(idx, { tipo: e.target.value as 'TRABAJO' | 'FRANCO' })}
                  >
                    <option value="TRABAJO">Trabajo</option>
                    <option value="FRANCO">Franco</option>
                  </select>
                </div>
                {d.tipo === 'TRABAJO' && (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] text-muted uppercase">Hora inicio</label>
                      <input
                        type="time"
                        className={campoClase}
                        value={d.hora_inicio}
                        onChange={(e) => actualizarDia(idx, { hora_inicio: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-muted uppercase">Duración (hs)</label>
                      <input
                        type="number"
                        min={1}
                        max={24}
                        className={campoClase}
                        value={d.duracion_horas}
                        onChange={(e) => actualizarDia(idx, { duracion_horas: Number(e.target.value) })}
                        required
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {error && <div className="p-3 bg-amber/10 border border-amber/30 rounded-md text-sm text-amber">{error}</div>}

          <div className="pt-2 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-line text-muted font-medium rounded-md hover:bg-canvas transition-colors">
              Cancelar
            </button>
            <button type="submit" className="flex-1 btn-primary" disabled={enviando}>
              {enviando ? 'Creando...' : 'Crear esquema'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
