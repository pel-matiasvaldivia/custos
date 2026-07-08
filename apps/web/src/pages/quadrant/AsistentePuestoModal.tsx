import { useEffect, useMemo, useState } from 'react';
import {
  X, Wand2, Loader2, CheckCircle2, AlertTriangle, Plus, UserMinus, ShieldCheck,
} from 'lucide-react';
import { objetivoService, Objetivo } from '../../services/objetivo.service';
import { vigilanteService, Vigilador } from '../../services/vigilante.service';
import {
  cuadranteService, AsistentePuestoResultado, BandaPuestoInput,
} from '../../services/cuadrante.service';

interface BandaPreset {
  label: string;
  hora_inicio: string;
  duracion_horas: number;
  tipo_bloque: string;
}

const PRESETS: { id: string; titulo: string; desc: string; bandas: BandaPreset[] }[] = [
  {
    id: '3x8',
    titulo: '24 h · 3 turnos de 8 h',
    desc: 'Mañana, tarde y noche (M/T/N). El clásico puesto de 24 horas.',
    bandas: [
      { label: 'Mañana', hora_inicio: '06:00', duracion_horas: 8, tipo_bloque: 'DIURNO' },
      { label: 'Tarde', hora_inicio: '14:00', duracion_horas: 8, tipo_bloque: 'DIURNO' },
      { label: 'Noche', hora_inicio: '22:00', duracion_horas: 8, tipo_bloque: 'NOCTURNO' },
    ],
  },
  {
    id: '2x12',
    titulo: '24 h · 2 turnos de 12 h',
    desc: 'Un turno de día y uno de noche, de 12 horas cada uno.',
    bandas: [
      { label: 'Día', hora_inicio: '06:00', duracion_horas: 12, tipo_bloque: 'DIURNO' },
      { label: 'Noche', hora_inicio: '18:00', duracion_horas: 12, tipo_bloque: 'NOCTURNO' },
    ],
  },
  {
    id: 'noche8',
    titulo: 'Solo noche · 8 h',
    desc: 'Un único turno nocturno de 8 horas.',
    bandas: [{ label: 'Noche', hora_inicio: '22:00', duracion_horas: 8, tipo_bloque: 'NOCTURNO' }],
  },
  {
    id: 'noche12',
    titulo: 'Solo noche · 12 h',
    desc: 'Un único turno nocturno de 12 horas.',
    bandas: [{ label: 'Noche', hora_inicio: '18:00', duracion_horas: 12, tipo_bloque: 'NOCTURNO' }],
  },
];

// Sugerencia de personas por banda para no exceder las 48 h semanales: cubre la
// banda todos los días repartiendo francos (1 fijo + 1 franquero como mínimo).
function sugeridas(duracion: number): number {
  return Math.max(2, Math.ceil((7 * duracion) / 48));
}

export const AsistentePuestoModal = ({
  onClose,
  onListo,
}: {
  onClose: () => void;
  onListo: () => void;
}) => {
  const [objetivos, setObjetivos] = useState<Objetivo[]>([]);
  const [vigiladores, setVigiladores] = useState<Vigilador[]>([]);
  const [objetivoId, setObjetivoId] = useState('');
  const [puestoNombre, setPuestoNombre] = useState('');
  const [presetId, setPresetId] = useState('3x8');
  const [vigenteDesde, setVigenteDesde] = useState(() => new Date().toISOString().slice(0, 10));
  // banda.label → vigilador_ids
  const [seleccion, setSeleccion] = useState<Record<string, string[]>>({});
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<AsistentePuestoResultado | null>(null);

  const preset = PRESETS.find((p) => p.id === presetId) ?? PRESETS[0];

  useEffect(() => {
    objetivoService.getAll(1, 200).then((os) => {
      const activos = os.filter((o) => o.estado === 'ACTIVO');
      setObjetivos(activos);
      if (activos[0]) setObjetivoId(activos[0].id);
    }).catch(() => undefined);
    vigilanteService.getAll().then((vs) =>
      setVigiladores(vs.filter((v) => v.estado === 'ACTIVO')),
    ).catch(() => undefined);
  }, []);

  // Al cambiar de preset, reinicia la selección de personas.
  useEffect(() => {
    setSeleccion({});
  }, [presetId]);

  const usados = useMemo(
    () => new Set(Object.values(seleccion).flat()),
    [seleccion],
  );

  const agregar = (banda: string, vigId: string) => {
    if (!vigId) return;
    setSeleccion((s) => ({ ...s, [banda]: [...(s[banda] ?? []), vigId] }));
  };
  const quitar = (banda: string, vigId: string) => {
    setSeleccion((s) => ({ ...s, [banda]: (s[banda] ?? []).filter((id) => id !== vigId) }));
  };

  const nombreVig = (id: string) => {
    const v = vigiladores.find((x) => x.id === id);
    return v ? `${v.apellido}, ${v.nombre}` : id;
  };

  const armar = async () => {
    setError(null);
    if (!objetivoId) return setError('Elegí un objetivo.');
    if (!puestoNombre.trim()) return setError('Ponele un nombre al puesto.');
    for (const b of preset.bandas) {
      if (!(seleccion[b.label]?.length)) {
        return setError(`Asigná al menos un vigilador a la banda "${b.label}".`);
      }
    }
    setEnviando(true);
    try {
      const bandas: BandaPuestoInput[] = preset.bandas.map((b) => ({
        label: b.label,
        hora_inicio: b.hora_inicio,
        duracion_horas: b.duracion_horas,
        tipo_bloque: b.tipo_bloque,
        dotacion: 1,
        vigilador_ids: seleccion[b.label] ?? [],
      }));
      const r = await cuadranteService.asistentePuesto({
        objetivo_id: objetivoId,
        puesto_nombre: puestoNombre.trim(),
        vigente_desde: vigenteDesde,
        bandas,
      });
      setResultado(r);
    } catch (e) {
      const m = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(m || 'No se pudo armar el puesto.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-navy/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-2xl shadow-xl w-full max-w-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-line sticky top-0 bg-surface">
          <h3 className="font-display font-bold text-navy flex items-center gap-2">
            <Wand2 size={18} className="text-brand-blue" /> Armar puesto con franquero automático
          </h3>
          <button onClick={onClose} className="text-muted hover:text-navy"><X size={18} /></button>
        </div>

        <div className="p-5 space-y-5">
          {resultado ? (
            <Exito resultado={resultado} onListo={onListo} />
          ) : (
            <>
              <p className="text-sm text-muted">
                Elegí el tipo de cobertura y quién rota en cada turno. El asistente crea los esquemas,
                reparte los francos y genera el mes cubierto. Las personas que sobran de cada turno actúan
                de <strong>franqueros</strong>.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Campo label="Objetivo">
                  <select value={objetivoId} onChange={(e) => setObjetivoId(e.target.value)} className="inp bg-white">
                    {objetivos.length === 0 && <option value="">Sin objetivos activos</option>}
                    {objetivos.map((o) => <option key={o.id} value={o.id}>{o.nombre}</option>)}
                  </select>
                </Campo>
                <Campo label="Nombre del puesto">
                  <input value={puestoNombre} onChange={(e) => setPuestoNombre(e.target.value)}
                    className="inp" placeholder="Ej: Portería principal" />
                </Campo>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-muted mb-2 block">Tipo de cobertura</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {PRESETS.map((p) => (
                    <button key={p.id} onClick={() => setPresetId(p.id)}
                      className={`text-left p-3 rounded-lg border transition-colors ${
                        presetId === p.id ? 'border-brand-blue bg-brand-blue/[0.04]' : 'border-line hover:border-brand-blue/40'
                      }`}>
                      <p className="text-sm font-bold text-navy">{p.titulo}</p>
                      <p className="text-xs text-muted mt-0.5">{p.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Asignación de personas por banda */}
              <div className="space-y-3">
                {preset.bandas.map((b) => {
                  const sel = seleccion[b.label] ?? [];
                  const sug = sugeridas(b.duracion_horas);
                  const disponibles = vigiladores.filter((v) => !usados.has(v.id));
                  return (
                    <div key={b.label} className="card space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-navy">
                          {b.label} <span className="font-normal text-muted">· {b.hora_inicio} ({b.duracion_horas}h)</span>
                        </p>
                        <span className="text-[11px] text-muted">
                          {sel.length} asignado(s) · sugerido {sug} (1 fijo + {sug - 1} franquero{sug - 1 === 1 ? '' : 's'})
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {sel.map((id) => (
                          <span key={id} className="inline-flex items-center gap-1 bg-brand-blue/10 text-brand-blue text-xs font-medium px-2 py-1 rounded-full">
                            {nombreVig(id)}
                            <button onClick={() => quitar(b.label, id)} className="hover:text-amber"><UserMinus size={12} /></button>
                          </span>
                        ))}
                        {sel.length === 0 && <span className="text-xs text-muted">Sin asignar</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <Plus size={14} className="text-muted" />
                        <select value="" onChange={(e) => agregar(b.label, e.target.value)} className="inp bg-white flex-1">
                          <option value="">Agregar vigilador…</option>
                          {disponibles.map((v) => (
                            <option key={v.id} value={v.id}>{v.apellido}, {v.nombre} ({v.legajo_nro})</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Campo label="Vigente desde">
                <input type="date" value={vigenteDesde} onChange={(e) => setVigenteDesde(e.target.value)} className="inp" />
              </Campo>

              {error && <p className="text-sm text-amber flex items-center gap-1"><AlertTriangle size={14} /> {error}</p>}

              <button onClick={armar} disabled={enviando}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-brand-blue text-white font-medium rounded-lg hover:bg-brand-deep disabled:opacity-50">
                {enviando ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
                {enviando ? 'Armando y generando…' : 'Armar puesto y generar turnos'}
              </button>

              <style>{`.inp{width:100%;border:1px solid #E2E8F2;border-radius:.5rem;padding:.5rem .625rem;font-size:.875rem}`}</style>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

function Exito({ resultado, onListo }: { resultado: AsistentePuestoResultado; onListo: () => void }) {
  const sinHuecos = resultado.huecos === 0;
  const rechazados = resultado.generacion.rechazados.length;
  return (
    <div className="space-y-4 text-center py-2">
      <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto ${sinHuecos ? 'bg-emerald/10' : 'bg-amber/10'}`}>
        {sinHuecos ? <ShieldCheck size={30} className="text-emerald" /> : <AlertTriangle size={30} className="text-amber" />}
      </div>
      <div>
        <p className="font-display font-bold text-navy text-lg">Puesto “{resultado.puestoNombre}” armado</p>
        <p className="text-sm text-muted">
          {resultado.totalPersonas} persona(s) · {resultado.generacion.creados} turnos generados
        </p>
      </div>
      <div className="bg-canvas rounded-lg p-3 text-left text-sm space-y-1">
        {resultado.bandas.map((b) => (
          <div key={b.label} className="flex justify-between">
            <span className="text-muted">{b.label}</span>
            <span className="text-navy">{b.fijos} fijo(s){b.franqueros > 0 ? ` + ${b.franqueros} franquero(s)` : ''}</span>
          </div>
        ))}
      </div>
      {sinHuecos ? (
        <p className="text-sm text-emerald flex items-center justify-center gap-1">
          <CheckCircle2 size={14} /> Cobertura completa: no quedaron huecos.
        </p>
      ) : (
        <p className="text-sm text-amber flex items-center justify-center gap-1">
          <AlertTriangle size={14} /> Quedaron {resultado.huecos} tramo(s) con huecos{rechazados ? ` (${rechazados} turno(s) rechazado(s) por reglas laborales)` : ''}.
        </p>
      )}
      <button onClick={onListo} className="w-full py-2.5 bg-brand-blue text-white font-medium rounded-lg hover:bg-brand-deep">
        Ver en el cuadrante
      </button>
    </div>
  );
}

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[10px] font-black uppercase tracking-widest text-muted mb-1 block">{label}</label>
      {children}
    </div>
  );
}
