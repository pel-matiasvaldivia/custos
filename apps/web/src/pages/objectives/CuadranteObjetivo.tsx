import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X, Trash2 } from 'lucide-react';
import { Puesto } from '../../services/objetivo.service';
import { asignacionService, Asignacion } from '../../services/asignacion.service';
import { vigilanteService, Vigilador } from '../../services/vigilante.service';

const DIAS_CORTOS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

const aIsoDate = (d: Date) => d.toISOString().slice(0, 10);

const inicioSemana = (d: Date) => {
  const fecha = new Date(d);
  const diaSemana = (fecha.getDay() + 6) % 7; // 0 = lunes
  fecha.setDate(fecha.getDate() - diaSemana);
  fecha.setHours(0, 0, 0, 0);
  return fecha;
};

const sumarDias = (d: Date, n: number) => {
  const fecha = new Date(d);
  fecha.setDate(fecha.getDate() + n);
  return fecha;
};

interface Props {
  objetivoId: string;
  puestos: Puesto[];
}

export const CuadranteObjetivo = ({ objetivoId, puestos }: Props) => {
  const [semanaInicio, setSemanaInicio] = useState(() => inicioSemana(new Date()));
  const [asignaciones, setAsignaciones] = useState<Asignacion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [modal, setModal] = useState<{ puesto: Puesto; fecha: Date; asignacion?: Asignacion } | null>(null);

  const dias = Array.from({ length: 7 }, (_, i) => sumarDias(semanaInicio, i));

  const cargar = async () => {
    setCargando(true);
    try {
      const data = await asignacionService.getByObjetivo(
        objetivoId,
        aIsoDate(semanaInicio),
        aIsoDate(sumarDias(semanaInicio, 6)),
      );
      setAsignaciones(data);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [objetivoId, semanaInicio]);

  const buscarAsignacion = (puestoId: string, fecha: Date) =>
    asignaciones.find((a) => a.puesto_id === puestoId && a.fecha.slice(0, 10) === aIsoDate(fecha));

  if (puestos.length === 0) {
    return <p className="text-sm text-muted py-4 text-center">Cargá un puesto para poder armar el cuadrante.</p>;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setSemanaInicio(sumarDias(semanaInicio, -7))}
          className="p-1 hover:bg-canvas rounded transition-colors text-muted hover:text-navy"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="text-xs font-bold text-navy uppercase tracking-widest">
          {dias[0].toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })} -{' '}
          {dias[6].toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })}
        </span>
        <button
          onClick={() => setSemanaInicio(sumarDias(semanaInicio, 7))}
          className="p-1 hover:bg-canvas rounded transition-colors text-muted hover:text-navy"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="overflow-x-auto border border-line rounded-lg">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-canvas/50 text-muted uppercase tracking-tighter">
              <th className="p-2 border-r border-b border-line text-left min-w-[140px]">Puesto</th>
              {dias.map((d) => (
                <th key={aIsoDate(d)} className="p-2 border-r border-b border-line text-center min-w-[80px]">
                  {DIAS_CORTOS[(d.getDay() + 6) % 7]} {d.getDate()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {puestos.map((p) => (
              <tr key={p.id} className="border-b border-line last:border-b-0">
                <td className="p-2 border-r border-line font-medium text-navy truncate max-w-[140px]">{p.nombre}</td>
                {dias.map((d) => {
                  const a = buscarAsignacion(p.id, d);
                  return (
                    <td
                      key={aIsoDate(d)}
                      onClick={() => setModal({ puesto: p, fecha: d, asignacion: a })}
                      className={`p-2 border-r border-line text-center cursor-pointer transition-colors ${
                        a?.vigilador
                          ? 'bg-emerald/10 text-emerald font-bold hover:bg-emerald/20'
                          : 'text-muted hover:bg-canvas'
                      }`}
                      title={a?.vigilador ? `${a.vigilador.apellido}, ${a.vigilador.nombre}` : 'Asignar vigilador'}
                    >
                      {a?.vigilador ? a.vigilador.apellido : cargando ? '' : '+'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <TurnoModal
          puesto={modal.puesto}
          fecha={modal.fecha}
          asignacion={modal.asignacion}
          onClose={() => setModal(null)}
          onGuardado={() => {
            setModal(null);
            cargar();
          }}
        />
      )}
    </div>
  );
};

interface TurnoModalProps {
  puesto: Puesto;
  fecha: Date;
  asignacion?: Asignacion;
  onClose: () => void;
  onGuardado: () => void;
}

const TurnoModal = ({ puesto, fecha, asignacion, onClose, onGuardado }: TurnoModalProps) => {
  const [vigiladores, setVigiladores] = useState<Vigilador[]>([]);
  const [vigiladorId, setVigiladorId] = useState('');
  const [horaInicio, setHoraInicio] = useState(asignacion?.hora_inicio || '08:00');
  const [horaFin, setHoraFin] = useState(asignacion?.hora_fin || '20:00');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    vigilanteService.getAll().then((data) => {
      const activos = data.filter((v) => v.estado === 'ACTIVO');
      setVigiladores(activos);
      if (activos.length > 0) setVigiladorId(activos[0].id);
    });
  }, []);

  const handleAsignar = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setError(null);
    try {
      let asignacionId = asignacion?.id;
      if (!asignacionId) {
        const creada = await asignacionService.create({
          puesto_id: puesto.id,
          fecha: aIsoDate(fecha),
          hora_inicio: horaInicio,
          hora_fin: horaFin,
        });
        asignacionId = creada.id;
      }
      await asignacionService.asignarVigilador(asignacionId, vigiladorId);
      onGuardado();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'No se pudo asignar el vigilador.');
    } finally {
      setEnviando(false);
    }
  };

  const handleLiberar = async () => {
    if (!asignacion) return;
    setEnviando(true);
    setError(null);
    try {
      await asignacionService.liberar(asignacion.id);
      onGuardado();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'No se pudo liberar el turno.');
    } finally {
      setEnviando(false);
    }
  };

  const handleEliminar = async () => {
    if (!asignacion) return;
    setEnviando(true);
    setError(null);
    try {
      await asignacionService.eliminar(asignacion.id);
      onGuardado();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'No se pudo eliminar el turno.');
    } finally {
      setEnviando(false);
    }
  };

  const campoClase =
    'w-full px-3 py-2 bg-canvas border border-line rounded-md focus:ring-2 focus:ring-brand-blue/20 outline-none text-sm';
  const labelClase = 'text-xs font-medium text-muted uppercase tracking-wider';

  return (
    <div className="fixed inset-0 bg-navy/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface w-full max-w-sm rounded-xl shadow-xl overflow-hidden border border-line animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-line flex justify-between items-center">
          <div>
            <h3 className="text-lg font-display font-bold text-navy">{puesto.nombre}</h3>
            <p className="text-xs text-muted">{fecha.toLocaleDateString('es-AR', { weekday: 'long', day: '2-digit', month: 'long' })}</p>
          </div>
          <button onClick={onClose} className="text-muted hover:text-navy transition-colors">
            <X size={20} />
          </button>
        </div>

        {asignacion?.vigilador ? (
          <div className="p-6 space-y-4">
            <div className="p-3 rounded-lg border border-emerald/30 bg-emerald/5 text-sm">
              <p className="font-medium text-navy">
                {asignacion.vigilador.apellido}, {asignacion.vigilador.nombre}
              </p>
              <p className="text-xs text-muted">{asignacion.hora_inicio} - {asignacion.hora_fin}</p>
            </div>
            {error && <div className="p-3 bg-amber/10 border border-amber/30 rounded-md text-sm text-amber">{error}</div>}
            <button
              onClick={handleLiberar}
              disabled={enviando}
              className="w-full px-4 py-2 border border-line text-muted font-medium rounded-md hover:bg-canvas transition-colors disabled:opacity-60"
            >
              {enviando ? 'Liberando...' : 'Liberar turno'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleAsignar} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className={labelClase}>Desde</label>
                <input type="time" className={campoClase} value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} required />
              </div>
              <div className="space-y-1">
                <label className={labelClase}>Hasta</label>
                <input type="time" className={campoClase} value={horaFin} onChange={(e) => setHoraFin(e.target.value)} required />
              </div>
            </div>
            <div className="space-y-1">
              <label className={labelClase}>Vigilador</label>
              {vigiladores.length === 0 ? (
                <p className="text-xs text-amber">No hay vigiladores activos en la nómina.</p>
              ) : (
                <select className={campoClase} value={vigiladorId} onChange={(e) => setVigiladorId(e.target.value)}>
                  {vigiladores.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.apellido}, {v.nombre}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {error && <div className="p-3 bg-amber/10 border border-amber/30 rounded-md text-sm text-amber">{error}</div>}

            <div className="pt-2 flex gap-3">
              {asignacion && (
                <button
                  type="button"
                  onClick={handleEliminar}
                  disabled={enviando}
                  className="px-3 py-2 border border-line text-muted hover:text-amber rounded-md transition-colors disabled:opacity-60"
                  title="Eliminar turno"
                >
                  <Trash2 size={16} />
                </button>
              )}
              <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-line text-muted font-medium rounded-md hover:bg-canvas transition-colors">
                Cancelar
              </button>
              <button type="submit" className="flex-1 btn-primary" disabled={enviando || vigiladores.length === 0}>
                {enviando ? 'Guardando...' : 'Asignar'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
