import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X, Trash2 } from 'lucide-react';
import { Puesto } from '../../services/objetivo.service';
import { asignacionService, Asignacion } from '../../services/asignacion.service';
import { vigilanteService, Vigilador } from '../../services/vigilante.service';
import { herramientaService, Herramienta, TIPOS_HERRAMIENTA } from '../../services/herramienta.service';

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
  const [turno24hs, setTurno24hs] = useState(asignacion?.hora_inicio === '00:00' && asignacion?.hora_fin === '23:59');
  const [horaInicio, setHoraInicio] = useState(asignacion?.hora_inicio || '08:00');
  const [horaFin, setHoraFin] = useState(asignacion?.hora_fin || '20:00');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [herramientas, setHerramientas] = useState<Herramienta[]>([]);
  const [asignadasIds, setAsignadasIds] = useState<Set<string>>(new Set());
  const [cargandoHerramientas, setCargandoHerramientas] = useState(false);
  const [mostrarNuevaHerramienta, setMostrarNuevaHerramienta] = useState(false);
  const [nuevoTipo, setNuevoTipo] = useState(TIPOS_HERRAMIENTA[0].value);
  const [nuevaDescripcion, setNuevaDescripcion] = useState('');

  const vigiladorActivo = asignacion?.vigilador?.id || vigiladorId;

  useEffect(() => {
    vigilanteService.getAll().then((data) => {
      const activos = data.filter((v) => v.estado === 'ACTIVO');
      setVigiladores(activos);
      if (!asignacion?.vigilador && activos.length > 0) setVigiladorId(activos[0].id);
    });
    herramientaService.getAll().then(setHerramientas);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!vigiladorActivo) {
      setAsignadasIds(new Set());
      return;
    }
    herramientaService.getDeVigilador(vigiladorActivo).then((data) => {
      setAsignadasIds(new Set(data.map((a) => a.herramienta_id)));
    });
  }, [vigiladorActivo]);

  const handleToggle24hs = (checked: boolean) => {
    setTurno24hs(checked);
    if (checked) {
      setHoraInicio('00:00');
      setHoraFin('23:59');
    } else {
      setHoraInicio('08:00');
      setHoraFin('20:00');
    }
  };

  const handleToggleHerramienta = async (h: Herramienta) => {
    if (!vigiladorActivo) return;
    setCargandoHerramientas(true);
    setError(null);
    try {
      if (asignadasIds.has(h.id)) {
        await herramientaService.devolver(h.id);
        setAsignadasIds((prev) => {
          const next = new Set(prev);
          next.delete(h.id);
          return next;
        });
        setHerramientas((prev) => prev.map((x) => (x.id === h.id ? { ...x, estado: 'DISPONIBLE' } : x)));
      } else {
        await herramientaService.asignar(h.id, vigiladorActivo);
        setAsignadasIds((prev) => new Set(prev).add(h.id));
        setHerramientas((prev) => prev.map((x) => (x.id === h.id ? { ...x, estado: 'ASIGNADA' } : x)));
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'No se pudo actualizar la herramienta.');
    } finally {
      setCargandoHerramientas(false);
    }
  };

  const handleCrearHerramienta = async () => {
    if (!nuevaDescripcion.trim()) return;
    setCargandoHerramientas(true);
    setError(null);
    try {
      const creada = await herramientaService.create({ tipo: nuevoTipo, descripcion: nuevaDescripcion.trim() });
      setHerramientas((prev) => [...prev, creada]);
      setNuevaDescripcion('');
      setMostrarNuevaHerramienta(false);
      if (vigiladorActivo) await handleToggleHerramienta(creada);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'No se pudo crear la herramienta.');
    } finally {
      setCargandoHerramientas(false);
    }
  };

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

  const herramientasVisibles = herramientas.filter((h) => h.estado === 'DISPONIBLE' || asignadasIds.has(h.id));

  const seccionHerramientas = (
    <div className="space-y-2 pt-3 border-t border-line">
      <div className="flex items-center justify-between">
        <label className={labelClase}>Herramientas</label>
        <button
          type="button"
          onClick={() => setMostrarNuevaHerramienta((m) => !m)}
          className="text-xs text-brand-blue font-medium hover:underline"
        >
          + Nueva
        </button>
      </div>

      {mostrarNuevaHerramienta && (
        <div className="flex flex-col gap-2 p-2 bg-canvas rounded-md border border-line">
          <select className={campoClase} value={nuevoTipo} onChange={(e) => setNuevoTipo(e.target.value)}>
            {TIPOS_HERRAMIENTA.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Descripción (ej: Celular Motorola #3)"
              className={campoClase}
              value={nuevaDescripcion}
              onChange={(e) => setNuevaDescripcion(e.target.value)}
            />
            <button
              type="button"
              onClick={handleCrearHerramienta}
              disabled={cargandoHerramientas || !nuevaDescripcion.trim()}
              className="btn btn-primary px-3 py-2 text-xs whitespace-nowrap disabled:opacity-60"
            >
              Agregar
            </button>
          </div>
        </div>
      )}

      {!vigiladorActivo ? (
        <p className="text-xs text-muted">Elegí un vigilador para asignarle herramientas.</p>
      ) : herramientasVisibles.length === 0 ? (
        <p className="text-xs text-muted">No hay herramientas cargadas todavía.</p>
      ) : (
        <div className="space-y-0.5 max-h-36 overflow-y-auto pr-1">
          {herramientasVisibles.map((h) => (
            <label key={h.id} className="flex items-center gap-2 text-sm px-2 py-1.5 rounded-md hover:bg-canvas cursor-pointer">
              <input
                type="checkbox"
                checked={asignadasIds.has(h.id)}
                disabled={cargandoHerramientas}
                onChange={() => handleToggleHerramienta(h)}
              />
              <span className="text-navy">{h.descripcion}</span>
              <span className="text-xs text-muted">
                ({TIPOS_HERRAMIENTA.find((t) => t.value === h.tipo)?.label || h.tipo})
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-navy/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface w-full max-w-sm rounded-xl shadow-xl border border-line animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-line flex justify-between items-center shrink-0">
          <div>
            <h3 className="text-lg font-display font-bold text-navy">{puesto.nombre}</h3>
            <p className="text-xs text-muted">{fecha.toLocaleDateString('es-AR', { weekday: 'long', day: '2-digit', month: 'long' })}</p>
          </div>
          <button onClick={onClose} className="text-muted hover:text-navy transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto">
          {asignacion?.vigilador ? (
            <div className="p-6 space-y-4">
              <div className="p-3 rounded-lg border border-emerald/30 bg-emerald/5 text-sm">
                <p className="font-medium text-navy">
                  {asignacion.vigilador.apellido}, {asignacion.vigilador.nombre}
                </p>
                <p className="text-xs text-muted">{asignacion.hora_inicio} - {asignacion.hora_fin}</p>
              </div>

              {seccionHerramientas}

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
              <label className="flex items-center gap-2 text-sm text-navy cursor-pointer">
                <input type="checkbox" checked={turno24hs} onChange={(e) => handleToggle24hs(e.target.checked)} />
                Turno de 24 horas
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className={labelClase}>Desde</label>
                  <input
                    type="time"
                    className={`${campoClase} disabled:opacity-60`}
                    value={horaInicio}
                    onChange={(e) => setHoraInicio(e.target.value)}
                    disabled={turno24hs}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className={labelClase}>Hasta</label>
                  <input
                    type="time"
                    className={`${campoClase} disabled:opacity-60`}
                    value={horaFin}
                    onChange={(e) => setHoraFin(e.target.value)}
                    disabled={turno24hs}
                    required
                  />
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

              {seccionHerramientas}

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
    </div>
  );
};
