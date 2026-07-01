import { useState } from 'react';
import { X, Sun, Moon, Clock, Sunset, Zap, Pencil, Users, CalendarClock } from 'lucide-react';
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

interface Plantilla {
  id: string;
  icono: React.ReactNode;
  label: string;
  turno: string;
  detalle: string;
  vigiladores: number;
  nombre: string;
  diasCiclo: number;
  dias: DiaFormState[];
}

const T = (hora: string, hs: number): DiaFormState => ({ tipo: 'TRABAJO', hora_inicio: hora, duracion_horas: hs });
const F = (): DiaFormState => ({ tipo: 'FRANCO', hora_inicio: '08:00', duracion_horas: 12 });

const PLANTILLAS: Plantilla[] = [
  {
    id: '12x24-diurno',
    icono: <Sun size={18} />,
    label: '12×24 Diurno',
    turno: '07:00 a 19:00',
    detalle: 'Cada persona trabaja 12hs y descansa 24hs. Se necesitan 3 personas rotando para cubrir el puesto las 24hs, todos los días.',
    vigiladores: 3,
    nombre: '12×24 Diurno',
    diasCiclo: 2,
    dias: [T('07:00', 12), F()],
  },
  {
    id: '12x24-nocturno',
    icono: <Moon size={18} />,
    label: '12×24 Nocturno',
    turno: '19:00 a 07:00',
    detalle: 'Turno de noche. Cada persona trabaja 12hs y descansa 24hs. 3 personas rotando cubren la franja nocturna todos los días. Aplica recargo nocturno.',
    vigiladores: 3,
    nombre: '12×24 Nocturno',
    diasCiclo: 2,
    dias: [T('19:00', 12), F()],
  },
  {
    id: '12x36',
    icono: <Sunset size={18} />,
    label: '12×36 Rotativo',
    turno: 'Alterna día y noche',
    detalle: 'Trabaja 12hs y descansa 36hs, alternando día y noche. Ronda las 42hs semanales: es el esquema más favorable al trabajador. Requiere 4 personas para cubrir 24/7.',
    vigiladores: 4,
    nombre: '12×36 Rotativo',
    diasCiclo: 4,
    dias: [T('07:00', 12), F(), F(), T('19:00', 12)],
  },
  {
    id: '24x48',
    icono: <Zap size={18} />,
    label: '24×48',
    turno: '08:00 a 08:00 del día siguiente',
    detalle: 'Jornada de 24hs continuas seguida de 48hs de descanso. 3 personas cubren el puesto 24/7. Ojo: puede generar horas extra según el convenio.',
    vigiladores: 3,
    nombre: '24×48',
    diasCiclo: 3,
    dias: [T('08:00', 24), F(), F()],
  },
  {
    id: '8hs-diurno-lv',
    icono: <Clock size={18} />,
    label: '8hs Lun a Vie',
    turno: '08:00 a 16:00',
    detalle: 'Jornada de oficina estándar: 8hs, de lunes a viernes, con sábado y domingo libres. 40hs semanales. 1 sola persona cubre el puesto.',
    vigiladores: 1,
    nombre: '8hs Diurno Lun–Vie',
    diasCiclo: 7,
    dias: [T('08:00', 8), T('08:00', 8), T('08:00', 8), T('08:00', 8), T('08:00', 8), F(), F()],
  },
  {
    id: '8hs-nocturno-lv',
    icono: <Moon size={18} />,
    label: '8hs Noche Lun a Vie',
    turno: '22:00 a 06:00',
    detalle: 'Turno nocturno de 8hs, de lunes a viernes. 40hs semanales. Aplica recargo nocturno del CCT 421/05. 1 sola persona cubre el puesto.',
    vigiladores: 1,
    nombre: '8hs Nocturno Lun–Vie',
    diasCiclo: 7,
    dias: [T('22:00', 8), T('22:00', 8), T('22:00', 8), T('22:00', 8), T('22:00', 8), F(), F()],
  },
];

const diaInicial = (): DiaFormState => ({ tipo: 'TRABAJO', hora_inicio: '08:00', duracion_horas: 12 });

/** Horas de trabajo promedio por semana del patrón (para mostrar al usuario). */
const horasSemana = (dias: DiaFormState[], diasCiclo: number): number => {
  const totalTrabajo = dias
    .slice(0, diasCiclo)
    .filter((d) => d.tipo === 'TRABAJO')
    .reduce((acc, d) => acc + d.duracion_horas, 0);
  if (diasCiclo <= 0) return 0;
  return Math.round((totalTrabajo / diasCiclo) * 7);
};

const finDeTurno = (inicio: string, duracion: number): string => {
  const [h, m] = inicio.split(':').map(Number);
  const fin = (h + duracion) % 24;
  return `${String(fin).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

export const EsquemaTurnoForm = ({ onClose, onCreado }: Props) => {
  const [plantillaId, setPlantillaId] = useState<string | null>(null);
  const [nombre, setNombre] = useState('');
  const [diasCiclo, setDiasCiclo] = useState(2);
  const [dias, setDias] = useState<DiaFormState[]>([diaInicial(), F()]);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const aplicarPlantilla = (p: Plantilla) => {
    setPlantillaId(p.id);
    setNombre(p.nombre);
    setDiasCiclo(p.diasCiclo);
    setDias(p.dias);
    setError(null);
  };

  const seleccionarPersonalizado = () => {
    setPlantillaId('custom');
    setNombre('');
    setDiasCiclo(2);
    setDias([diaInicial(), F()]);
    setError(null);
  };

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

  const mostrarFormulario = plantillaId !== null;
  const plantillaSel = PLANTILLAS.find((p) => p.id === plantillaId);
  const hsSem = horasSemana(dias, diasCiclo);

  return (
    <div className="fixed inset-0 bg-navy/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface w-full max-w-lg rounded-xl shadow-xl border border-line animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-line flex justify-between items-center shrink-0">
          <div>
            <h3 className="text-lg font-display font-bold text-navy">Nuevo esquema de turno</h3>
            <p className="text-xs text-muted mt-0.5">
              {mostrarFormulario
                ? 'Revisá cómo queda el turno y ajustá si hace falta'
                : 'Elegí un patrón según cómo se cubre el puesto'}
            </p>
          </div>
          <button onClick={onClose} className="text-muted hover:text-navy transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          {/* Selección de plantilla */}
          <div className="p-6 space-y-3">
            <p className={labelClase}>Patrones más usados (CCT 421/05)</p>
            <div className="grid grid-cols-2 gap-2">
              {PLANTILLAS.map((p) => {
                const seleccionada = plantillaId === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => aplicarPlantilla(p)}
                    className={`text-left p-3 rounded-lg border transition-all ${
                      seleccionada
                        ? 'border-brand-blue bg-brand-blue/5 ring-2 ring-brand-blue/20'
                        : 'border-line hover:border-brand-blue/40 hover:bg-canvas'
                    }`}
                  >
                    <div className={`flex items-center gap-2 mb-1 font-bold text-sm ${seleccionada ? 'text-brand-blue' : 'text-navy'}`}>
                      <span className={seleccionada ? 'text-brand-blue' : 'text-muted'}>{p.icono}</span>
                      {p.label}
                    </div>
                    <p className="text-xs text-muted leading-snug">{p.turno}</p>
                    <div className="flex items-center gap-2 mt-2 text-[10px] text-muted/80">
                      <span className="inline-flex items-center gap-1 bg-canvas border border-line rounded-full px-2 py-0.5">
                        <CalendarClock size={11} /> {horasSemana(p.dias, p.diasCiclo)} hs/sem
                      </span>
                      <span className="inline-flex items-center gap-1 bg-canvas border border-line rounded-full px-2 py-0.5">
                        <Users size={11} /> {p.vigiladores}
                      </span>
                    </div>
                  </button>
                );
              })}

              {/* Opción personalizada */}
              <button
                type="button"
                onClick={seleccionarPersonalizado}
                className={`text-left p-3 rounded-lg border transition-all col-span-2 ${
                  plantillaId === 'custom'
                    ? 'border-brand-blue bg-brand-blue/5 ring-2 ring-brand-blue/20'
                    : 'border-dashed border-line hover:border-brand-blue/40 hover:bg-canvas'
                }`}
              >
                <div className={`flex items-center gap-2 font-bold text-sm ${plantillaId === 'custom' ? 'text-brand-blue' : 'text-muted'}`}>
                  <Pencil size={16} /> Armar un esquema a medida
                </div>
                <p className="text-xs text-muted mt-0.5">Definí vos mismo el ciclo, los horarios y los francos</p>
              </button>
            </div>

            {/* Detalle en lenguaje simple de la plantilla seleccionada */}
            {plantillaSel && (
              <div className="p-3 rounded-lg bg-brand-blue/5 border border-brand-blue/20 text-xs text-navy leading-relaxed">
                {plantillaSel.detalle}
              </div>
            )}
          </div>

          {/* Formulario — visible solo tras elegir */}
          {mostrarFormulario && (
            <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4 border-t border-line pt-5">
              {/* Resumen legible del ciclo */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className={labelClase}>Así queda el ciclo</p>
                  <span className="text-[11px] font-semibold text-brand-blue bg-brand-blue/5 border border-brand-blue/20 rounded-full px-2.5 py-0.5">
                    ≈ {hsSem} hs/semana
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {dias.slice(0, diasCiclo).map((d, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col items-center rounded-md border px-2.5 py-1.5 text-center min-w-[64px] ${
                        d.tipo === 'TRABAJO'
                          ? 'border-emerald/30 bg-emerald/5'
                          : 'border-line bg-canvas'
                      }`}
                    >
                      <span className="text-[9px] uppercase tracking-wider text-muted">Día {idx + 1}</span>
                      {d.tipo === 'TRABAJO' ? (
                        <span className="text-[10px] font-bold text-emerald-700">
                          {d.hora_inicio}–{finDeTurno(d.hora_inicio, d.duracion_horas)}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-muted">Franco</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className={labelClase}>Nombre del esquema</label>
                <input
                  type="text"
                  placeholder="Ej: 12x36, 24x48, Guardia fin de semana"
                  className={campoClase}
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  autoFocus={plantillaId === 'custom'}
                />
              </div>

              <div className="space-y-1">
                <label className={labelClase}>Cada cuántos días se repite (ciclo)</label>
                <input
                  type="number"
                  min={1}
                  max={28}
                  className={campoClase}
                  value={diasCiclo}
                  onChange={(e) => handleCambiarDiasCiclo(Number(e.target.value))}
                  required
                />
                <p className="text-[11px] text-muted">
                  El patrón de abajo se repite en bucle. Ej: en 12x24 el ciclo es de 2 días (trabaja, franco).
                </p>
              </div>

              <div className="space-y-3">
                <label className={labelClase}>Qué hace la persona cada día del ciclo</label>
                {dias.slice(0, diasCiclo).map((d, idx) => (
                  <div key={idx} className="p-3 border border-line rounded-lg bg-canvas space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-navy">Día {idx + 1}</span>
                      <select
                        className="px-2 py-1 bg-surface border border-line rounded-md text-xs"
                        value={d.tipo}
                        onChange={(e) => actualizarDia(idx, { tipo: e.target.value as 'TRABAJO' | 'FRANCO' })}
                      >
                        <option value="TRABAJO">Trabaja</option>
                        <option value="FRANCO">Franco (descanso)</option>
                      </select>
                    </div>
                    {d.tipo === 'TRABAJO' && (
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[10px] text-muted uppercase">Entra a las</label>
                          <input
                            type="time"
                            className={campoClase}
                            value={d.hora_inicio}
                            onChange={(e) => actualizarDia(idx, { hora_inicio: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-muted uppercase">Cuántas horas</label>
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
          )}
        </div>
      </div>
    </div>
  );
};
