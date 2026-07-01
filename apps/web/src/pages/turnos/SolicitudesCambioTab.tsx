import { useEffect, useState } from 'react';
import { AlertTriangle, Check, X } from 'lucide-react';
import { relevoService, RelevoPendiente, CandidatoRelevo } from '../../services/relevo.service';

const formatFechaHora = (iso: string) =>
  new Date(iso).toLocaleString('es-AR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

const mensajeError = (err: unknown) =>
  (err as { response?: { data?: { message?: string } } })?.response?.data?.message;

/** Aprobación de solicitudes de cambio de turno (relevos) enviadas por los guardias desde el móvil. */
export const SolicitudesCambioTab = () => {
  const [pendientes, setPendientes] = useState<RelevoPendiente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState<string | null>(null);
  const [candidatos, setCandidatos] = useState<CandidatoRelevo[]>([]);
  const [cargandoCandidatos, setCargandoCandidatos] = useState(false);
  const [accionandoId, setAccionandoId] = useState<string | null>(null);

  const cargar = async () => {
    setLoading(true);
    try {
      const data = await relevoService.listarPendientes();
      setPendientes(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const handleVerCandidatos = async (turnoId: string) => {
    if (turnoSeleccionado === turnoId) {
      setTurnoSeleccionado(null);
      setCandidatos([]);
      return;
    }
    setTurnoSeleccionado(turnoId);
    setCandidatos([]);
    setCargandoCandidatos(true);
    setError(null);
    try {
      const data = await relevoService.sugerirCandidatos(turnoId);
      setCandidatos(data);
    } catch (err) {
      setError(mensajeError(err) || 'No se pudieron cargar los candidatos.');
    } finally {
      setCargandoCandidatos(false);
    }
  };

  const handleAprobar = async (turnoId: string, vigiladorId: string) => {
    setAccionandoId(turnoId);
    setError(null);
    try {
      await relevoService.aprobar(turnoId, vigiladorId);
      setTurnoSeleccionado(null);
      setCandidatos([]);
      await cargar();
    } catch (err) {
      setError(mensajeError(err) || 'No se pudo aprobar el relevo.');
    } finally {
      setAccionandoId(null);
    }
  };

  const handleRechazar = async (turnoId: string) => {
    setAccionandoId(turnoId);
    setError(null);
    try {
      await relevoService.rechazar(turnoId);
      setTurnoSeleccionado(null);
      setCandidatos([]);
      await cargar();
    } catch (err) {
      setError(mensajeError(err) || 'No se pudo rechazar la solicitud.');
    } finally {
      setAccionandoId(null);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">
        Cuando un guardia pide un cambio de turno desde la app móvil, la solicitud aparece acá para que la apruebes
        y elijas quién lo releva.
      </p>

      {error && <div className="p-3 bg-amber/10 border border-amber/30 rounded-md text-sm text-amber">{error}</div>}

      <div className="card">
        {loading ? (
          <p className="py-8 text-center text-muted">Cargando solicitudes...</p>
        ) : pendientes.length === 0 ? (
          <p className="py-8 text-center text-muted">No hay solicitudes de cambio de turno pendientes.</p>
        ) : (
          <div className="space-y-3">
            {pendientes.map((p) => (
              <div key={p.id} className="border border-line rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-sm text-navy">
                      {p.vigilador ? `${p.vigilador.apellido}, ${p.vigilador.nombre}` : 'Vigilador desconocido'}
                    </p>
                    <p className="text-xs text-muted">
                      {p.puestoNombre ?? 'Puesto sin nombre'} · {formatFechaHora(p.inicioPlan)} – {formatFechaHora(p.finPlan)}
                    </p>
                    {p.motivo && (
                      <p className="text-xs text-amber flex items-center gap-1 mt-1">
                        <AlertTriangle size={12} /> {p.motivo}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleVerCandidatos(p.id)}
                      className="text-xs text-brand-blue font-medium hover:underline"
                    >
                      {turnoSeleccionado === p.id ? 'Ocultar candidatos' : 'Ver candidatos'}
                    </button>
                    <button
                      onClick={() => handleRechazar(p.id)}
                      disabled={accionandoId === p.id}
                      className="text-xs text-muted hover:text-amber disabled:opacity-50 flex items-center gap-1"
                    >
                      <X size={12} /> Rechazar
                    </button>
                  </div>
                </div>

                {turnoSeleccionado === p.id && (
                  <div className="pt-3 border-t border-line space-y-2">
                    {cargandoCandidatos ? (
                      <p className="text-xs text-muted">Buscando candidatos...</p>
                    ) : candidatos.length === 0 ? (
                      <p className="text-xs text-muted">No hay vigiladores disponibles para este turno.</p>
                    ) : (
                      candidatos.map((c) => (
                        <div key={c.vigilador.id} className="flex justify-between items-center text-sm">
                          <div>
                            <span className="font-medium text-navy">
                              {c.vigilador.apellido}, {c.vigilador.nombre}
                            </span>
                            {!c.disponible && c.errores.length > 0 && (
                              <span className="text-xs text-amber ml-2">{c.errores.join(', ')}</span>
                            )}
                          </div>
                          <button
                            onClick={() => handleAprobar(p.id, c.vigilador.id)}
                            disabled={!c.disponible || accionandoId === p.id}
                            className="text-xs text-emerald font-medium hover:underline disabled:opacity-50 flex items-center gap-1"
                          >
                            <Check size={12} /> Asignar
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
