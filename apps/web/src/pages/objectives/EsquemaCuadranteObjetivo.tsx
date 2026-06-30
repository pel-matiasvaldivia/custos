import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, UserPlus, Settings, AlertTriangle, Trash2, Check, X } from 'lucide-react';
import { Puesto } from '../../services/objetivo.service';
import {
  cuadranteService,
  AsignacionEsquema,
  CuadrantePuesto,
  PuestoCobertura,
} from '../../services/cuadrante.service';
import { AfectarVigiladorModal } from './AfectarVigiladorModal';
import { PuestoCoberturaForm } from './PuestoCoberturaForm';

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

const formatHora = (iso: string) =>
  new Date(iso).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

interface Props {
  objetivoId: string;
  puestos: Puesto[];
}

export const EsquemaCuadranteObjetivo = ({ objetivoId, puestos }: Props) => {
  const [semanaInicio, setSemanaInicio] = useState(() => inicioSemana(new Date()));
  const [cuadrante, setCuadrante] = useState<CuadrantePuesto[]>([]);
  const [asignaciones, setAsignaciones] = useState<AsignacionEsquema[]>([]);
  const [coberturas, setCoberturas] = useState<Map<string, PuestoCobertura | null>>(new Map());
  const [cargando, setCargando] = useState(true);
  const [modalAfectar, setModalAfectar] = useState<Puesto | null>(null);
  const [modalCobertura, setModalCobertura] = useState<Puesto | null>(null);
  const [confirmandoFinalizar, setConfirmandoFinalizar] = useState<string | null>(null);
  const [finalizando, setFinalizando] = useState(false);

  const dias = Array.from({ length: 7 }, (_, i) => sumarDias(semanaInicio, i));

  const cargar = async () => {
    if (puestos.length === 0) {
      setCargando(false);
      return;
    }
    setCargando(true);
    try {
      const [cuadranteData, asignacionesData, coberturasData] = await Promise.all([
        cuadranteService.cuadranteDeObjetivo(objetivoId, aIsoDate(semanaInicio), aIsoDate(sumarDias(semanaInicio, 7))),
        cuadranteService.listarAsignacionesPorObjetivo(objetivoId),
        Promise.all(puestos.map((p) => cuadranteService.obtenerCobertura(p.id))),
      ]);
      setCuadrante(cuadranteData);
      setAsignaciones(asignacionesData);
      setCoberturas(new Map(puestos.map((p, i) => [p.id, coberturasData[i]])));
    } finally {
      setCargando(false);
    }
  };

  const handleFinalizar = async (asignacionId: string) => {
    setFinalizando(true);
    try {
      await cuadranteService.finalizarAsignacion(asignacionId, new Date().toISOString().slice(0, 10));
      // Optimistic: remove from local state immediately so the row disappears at once
      setAsignaciones((prev) => prev.filter((a) => a.id !== asignacionId));
      setConfirmandoFinalizar(null);
      // Then refresh the full cuadrante in background
      cargar();
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setConfirmandoFinalizar(null);
      alert(msg || 'No se pudo finalizar la afectación.');
    } finally {
      setFinalizando(false);
    }
  };

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [objetivoId, semanaInicio, puestos.length]);

  if (puestos.length === 0) {
    return <p className="text-sm text-muted py-4 text-center">Cargá un puesto para poder armar el cuadrante.</p>;
  }

  const cuadrantePorPuesto = new Map(cuadrante.map((c) => [c.puestoId, c]));

  return (
    <div className="space-y-4">
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

      <div className="space-y-3">
        {puestos.map((p) => {
          const datosCuadrante = cuadrantePorPuesto.get(p.id);
          const cobertura = coberturas.get(p.id) ?? null;
          const asignacionesPuesto = asignaciones.filter((a) => a.puestoId === p.id);
          const huecos = datosCuadrante?.cobertura?.huecos ?? [];
          const tieneCobertura = !!cobertura;
          const sinHuecos = tieneCobertura && huecos.length === 0;

          return (
            <div key={p.id} className="border border-line rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm text-navy">{p.nombre}</p>
                  <p className="text-xs text-muted">
                    {tieneCobertura
                      ? `Dotación requerida: ${cobertura!.dotacion_requerida} · Afectados: ${asignacionesPuesto.length}`
                      : 'Sin cobertura configurada'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {tieneCobertura && (
                    <span className={`status-badge ${sinHuecos ? 'status-badge-ok' : 'status-badge-alert'}`}>
                      {sinHuecos ? 'Cubierto' : 'Con huecos'}
                    </span>
                  )}
                  <button
                    onClick={() => setModalCobertura(p)}
                    className="p-1.5 text-muted hover:text-brand-blue transition-colors"
                    title="Configurar cobertura"
                  >
                    <Settings size={16} />
                  </button>
                  <button
                    onClick={() => setModalAfectar(p)}
                    className="p-1.5 text-muted hover:text-brand-blue transition-colors"
                    title="Afectar vigilador"
                  >
                    <UserPlus size={16} />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto border border-line rounded-md">
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr className="bg-canvas/50 text-muted uppercase tracking-tighter">
                      {dias.map((d) => (
                        <th key={aIsoDate(d)} className="p-1.5 border-r border-b border-line text-center min-w-[90px] last:border-r-0">
                          {DIAS_CORTOS[(d.getDay() + 6) % 7]} {d.getDate()}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {dias.map((d) => {
                        const turnosDia = (datosCuadrante?.turnos ?? []).filter(
                          (t) => aIsoDate(new Date(t.inicioPlan)) === aIsoDate(d),
                        );
                        return (
                          <td key={aIsoDate(d)} className="p-1.5 border-r border-line align-top last:border-r-0">
                            {turnosDia.length === 0 ? (
                              <span className="text-muted">—</span>
                            ) : (
                              <div className="space-y-0.5">
                                {turnosDia.map((t) => (
                                  <div key={t.id} className="text-navy">
                                    <span className="font-medium">
                                      {t.vigilador ? t.vigilador.apellido : '?'}
                                    </span>{' '}
                                    <span className="text-muted">
                                      {formatHora(t.inicioPlan)}-{formatHora(t.finPlan)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Afectaciones activas */}
              {asignacionesPuesto.length > 0 && (
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Afectaciones activas</p>
                  {asignacionesPuesto.map((a) => {
                    const confirmando = confirmandoFinalizar === a.id;
                    return (
                      <div
                        key={a.id}
                        className={`flex items-center justify-between px-3 py-2 rounded-md text-xs border transition-colors ${
                          confirmando ? 'border-red-300 bg-red-50' : 'border-line bg-canvas'
                        }`}
                      >
                        <div className="min-w-0">
                          <span className="font-medium text-navy">
                            {a.vigilador ? `${a.vigilador.apellido}, ${a.vigilador.nombre}` : 'Vigilador desconocido'}
                          </span>
                          <span className="text-muted ml-2">{a.esquemaNombre}</span>
                          <span className="text-muted/60 ml-2">
                            desde {new Date(a.vigenteDesde).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })}
                          </span>
                        </div>
                        {confirmando ? (
                          <div className="flex items-center gap-1.5 shrink-0 ml-2">
                            <span className="text-red-500 font-medium">¿Finalizar?</span>
                            <button
                              onClick={() => handleFinalizar(a.id)}
                              disabled={finalizando}
                              className="p-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 transition-colors"
                            >
                              <Check size={12} />
                            </button>
                            <button
                              onClick={() => setConfirmandoFinalizar(null)}
                              disabled={finalizando}
                              className="p-1 border border-line text-muted rounded hover:bg-surface transition-colors"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmandoFinalizar(a.id)}
                            className="shrink-0 ml-2 p-1 text-muted hover:text-red-500 transition-colors"
                            title="Finalizar afectación"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {huecos.length > 0 && (
                <div className="p-2 rounded-md border border-amber/30 bg-amber/5 text-xs text-amber space-y-1">
                  {huecos.map((h, i) => (
                    <p key={i} className="flex items-center gap-1.5">
                      <AlertTriangle size={12} />
                      {new Date(h.inicio).toLocaleDateString('es-AR', { weekday: 'short', day: '2-digit', month: 'short' })}{' '}
                      {formatHora(h.inicio)}–{formatHora(h.fin)}: faltan {h.requerida - h.dotacion} vigilador(es).
                    </p>
                  ))}
                </div>
              )}

              {cargando && <p className="text-xs text-muted">Actualizando...</p>}
            </div>
          );
        })}
      </div>

      {modalAfectar && (
        <AfectarVigiladorModal
          puesto={modalAfectar}
          onClose={() => setModalAfectar(null)}
          onAfectado={() => {
            setModalAfectar(null);
            cargar();
          }}
        />
      )}

      {modalCobertura && (
        <PuestoCoberturaForm
          puesto={modalCobertura}
          coberturaActual={coberturas.get(modalCobertura.id) ?? null}
          onClose={() => setModalCobertura(null)}
          onGuardado={() => {
            setModalCobertura(null);
            cargar();
          }}
        />
      )}
    </div>
  );
};
