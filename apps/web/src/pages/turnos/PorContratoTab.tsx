import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Loader2,
  ChevronRight,
  ChevronDown,
  Users,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Trash2,
  ExternalLink,
  UserCheck,
} from 'lucide-react';
import { objetivoService, ObjetivoDetalle } from '../../services/objetivo.service';
import {
  cuadranteService,
  AsignacionEsquema,
  EsquemaTurno,
  horasSemanaEsquema,
} from '../../services/cuadrante.service';

const mensajeError = (err: unknown) =>
  (err as { response?: { data?: { message?: string } } })?.response?.data?.message;

const hoyISO = () => new Date().toISOString().slice(0, 10);

/** Vista orientada a RRHH: cada objetivo con contrato, sus horas a cubrir, la dotación
 *  y —al expandir— los esquemas asignados por puesto con la posibilidad de eliminarlos. */
export const PorContratoTab = () => {
  const navigate = useNavigate();
  const [detalles, setDetalles] = useState<ObjetivoDetalle[]>([]);
  const [loading, setLoading] = useState(true);
  const [hsPorEsquema, setHsPorEsquema] = useState<Map<string, number>>(new Map());
  const [expandido, setExpandido] = useState<string | null>(null);
  const [asignaciones, setAsignaciones] = useState<Map<string, AsignacionEsquema[]>>(new Map());
  const [cargandoAsig, setCargandoAsig] = useState<string | null>(null);
  const [eliminandoId, setEliminandoId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let activo = true;
    (async () => {
      setLoading(true);
      try {
        const [objetivos, esquemas] = await Promise.all([
          objetivoService.getAll(1, 100),
          cuadranteService.listarEsquemas().catch(() => [] as EsquemaTurno[]),
        ]);
        const results = await Promise.all(
          objetivos.map((o) => objetivoService.getDetalle(o.id).catch(() => null)),
        );
        if (!activo) return;
        setDetalles(results.filter((d): d is ObjetivoDetalle => d !== null));
        setHsPorEsquema(new Map(esquemas.map((e) => [e.id, horasSemanaEsquema(e)])));
      } finally {
        if (activo) setLoading(false);
      }
    })();
    return () => {
      activo = false;
    };
  }, []);

  const toggleExpandir = async (objetivoId: string) => {
    if (expandido === objetivoId) {
      setExpandido(null);
      return;
    }
    setExpandido(objetivoId);
    setError(null);
    if (!asignaciones.has(objetivoId)) {
      setCargandoAsig(objetivoId);
      try {
        const data = await cuadranteService.listarAsignacionesPorObjetivo(objetivoId);
        setAsignaciones((prev) => new Map(prev).set(objetivoId, data));
      } catch (err) {
        setError(mensajeError(err) || 'No se pudieron cargar las asignaciones.');
      } finally {
        setCargandoAsig(null);
      }
    }
  };

  const handleEliminar = async (objetivoId: string, asignacionId: string) => {
    setEliminandoId(asignacionId);
    setError(null);
    try {
      await cuadranteService.finalizarAsignacion(asignacionId, hoyISO());
      setAsignaciones((prev) => {
        const copia = new Map(prev);
        copia.set(objetivoId, (copia.get(objetivoId) ?? []).filter((a) => a.id !== asignacionId));
        return copia;
      });
    } catch (err) {
      setError(mensajeError(err) || 'No se pudo eliminar la asignación.');
    } finally {
      setEliminandoId(null);
    }
  };

  if (loading) {
    return (
      <div className="card py-10 flex items-center justify-center text-muted">
        <Loader2 className="animate-spin mr-2" size={18} /> Calculando horas por contrato...
      </div>
    );
  }

  const ordenados = [...detalles].sort((a, b) => {
    const ca = a.contrato ? 1 : 0;
    const cb = b.contrato ? 1 : 0;
    if (ca !== cb) return cb - ca;
    const sa = a.dotacion.suficiente ? 1 : 0;
    const sb = b.dotacion.suficiente ? 1 : 0;
    return sa - sb;
  });

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted max-w-2xl">
        Cada objetivo con su contrato vinculado: horas semanales a cubrir según los puestos, dotación necesaria y
        —al abrir— los esquemas asignados a cada puesto. Podés eliminar una asignación desde acá.
      </p>

      {error && <div className="p-3 bg-amber/10 border border-amber/30 rounded-md text-sm text-amber">{error}</div>}

      {ordenados.length === 0 ? (
        <div className="card py-10 text-center text-muted">No hay objetivos cargados todavía.</div>
      ) : (
        <div className="space-y-2">
          {ordenados.map((d) => {
            const { objetivo, contrato, dotacion, puestos } = d;
            const cubre = dotacion.suficiente;
            const abierto = expandido === objetivo.id;
            const asigObjetivo = asignaciones.get(objetivo.id) ?? [];

            return (
              <div key={objetivo.id} className="card !p-0 overflow-hidden">
                {/* Fila resumen (click para expandir) */}
                <button
                  onClick={() => toggleExpandir(objetivo.id)}
                  className="w-full text-left p-4 flex items-center gap-4 hover:bg-canvas/50 transition-colors"
                >
                  {abierto ? (
                    <ChevronDown size={18} className="text-muted shrink-0" />
                  ) : (
                    <ChevronRight size={18} className="text-muted shrink-0" />
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-navy truncate">{objetivo.nombre}</p>
                      {contrato ? (
                        <span className="inline-flex items-center gap-1 text-[10px] text-muted bg-canvas border border-line rounded-full px-2 py-0.5">
                          <FileText size={10} /> {contrato.codigo}
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber bg-amber/5 border border-amber/20 rounded-full px-2 py-0.5">
                          Sin contrato
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted mt-0.5 truncate">
                      {objetivo.cliente_nombre} · {puestos.length} puesto(s)
                    </p>
                  </div>

                  <div className="hidden sm:flex flex-col items-end shrink-0">
                    <span className="text-sm font-bold text-navy">{dotacion.horasSemanales} hs/sem</span>
                    <span className="text-[11px] text-muted flex items-center gap-1">
                      <Users size={11} /> {dotacion.vigiladoresRequeridos} req. · {dotacion.vigiladoresActivosTotal} activos
                    </span>
                  </div>

                  <span
                    className={`shrink-0 inline-flex items-center gap-1 text-xs font-medium rounded-full px-2.5 py-1 ${
                      cubre ? 'text-emerald bg-emerald/5' : 'text-amber bg-amber/5'
                    }`}
                  >
                    {cubre ? <CheckCircle2 size={13} /> : <AlertTriangle size={13} />}
                    {cubre ? 'Dotación OK' : 'Falta dotación'}
                  </span>
                </button>

                {/* Panel expandido: esquemas asignados por puesto */}
                {abierto && (
                  <div className="border-t border-line bg-canvas/30 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-muted uppercase tracking-wider">
                        Esquemas asignados por puesto
                      </p>
                      <button
                        onClick={() => navigate(`/objectives/${objetivo.id}`)}
                        className="text-xs text-brand-blue font-medium hover:underline flex items-center gap-1"
                      >
                        Abrir objetivo y armar cuadrante <ExternalLink size={12} />
                      </button>
                    </div>

                    {cargandoAsig === objetivo.id ? (
                      <p className="text-xs text-muted flex items-center gap-2 py-2">
                        <Loader2 className="animate-spin" size={14} /> Cargando asignaciones...
                      </p>
                    ) : puestos.length === 0 ? (
                      <p className="text-xs text-muted py-2">Este objetivo no tiene puestos cargados.</p>
                    ) : (
                      <div className="space-y-2">
                        {puestos.map((p) => {
                          const asigPuesto = asigObjetivo.filter((a) => a.puestoId === p.id);
                          const horasCubiertas = asigPuesto.reduce(
                            (acc, a) => acc + (hsPorEsquema.get(a.esquemaId) ?? 0),
                            0,
                          );
                          return (
                            <div key={p.id} className="rounded-lg border border-line bg-surface p-3 space-y-2">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-navy">{p.nombre}</p>
                                <span className="text-[11px] text-muted inline-flex items-center gap-1">
                                  <UserCheck size={12} /> {asigPuesto.length} afectado(s) ·{' '}
                                  <span className="font-semibold text-navy">{horasCubiertas} hs/sem cubiertas</span>
                                </span>
                              </div>

                              {asigPuesto.length === 0 ? (
                                <p className="text-xs text-muted italic">Sin vigiladores afectados.</p>
                              ) : (
                                <div className="space-y-1">
                                  {asigPuesto.map((a) => {
                                    const hs = hsPorEsquema.get(a.esquemaId);
                                    return (
                                      <div
                                        key={a.id}
                                        className="flex items-center justify-between text-xs px-2.5 py-1.5 rounded-md bg-canvas border border-line"
                                      >
                                        <div className="min-w-0">
                                          <span className="font-medium text-navy">
                                            {a.vigilador ? `${a.vigilador.apellido}, ${a.vigilador.nombre}` : 'Vigilador desconocido'}
                                          </span>
                                          <span className="text-muted ml-2">{a.esquemaNombre}</span>
                                          {hs !== undefined && <span className="text-muted/70 ml-2">{hs} hs/sem</span>}
                                        </div>
                                        <button
                                          onClick={() => handleEliminar(objetivo.id, a.id)}
                                          disabled={eliminandoId === a.id}
                                          className="shrink-0 ml-2 p-1 text-muted hover:text-red-500 disabled:opacity-50 transition-colors"
                                          title="Eliminar asignación"
                                        >
                                          {eliminandoId === a.id ? (
                                            <Loader2 className="animate-spin" size={13} />
                                          ) : (
                                            <Trash2 size={13} />
                                          )}
                                        </button>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
