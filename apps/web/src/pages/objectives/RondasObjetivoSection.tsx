import { useCallback, useEffect, useState } from 'react';
import {
  Plus,
  Pencil,
  Route,
  Trash2,
  X,
  CheckCircle2,
  Clock,
  MapPin,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  puntoControlService,
  PuntoControl,
  RondaPlantilla,
  RondaEjecucion,
} from '../../services/puntoControl.service';
import { Puesto } from '../../services/objetivo.service';

interface Props {
  objetivoId: string;
  puestos: Puesto[];
}

const ESTADOS: Record<string, { label: string; clase: string }> = {
  EN_PROGRESO: { label: 'En progreso', clase: 'status-badge-alert' },
  COMPLETADA: { label: 'Completada', clase: 'status-badge-ok' },
  INCOMPLETA: { label: 'Incompleta', clase: 'status-badge-alert' },
};

const hora = (iso: string) =>
  new Date(iso).toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

export const RondasObjetivoSection = ({ objetivoId, puestos }: Props) => {
  const [plantillas, setPlantillas] = useState<RondaPlantilla[]>([]);
  const [ejecuciones, setEjecuciones] = useState<RondaEjecucion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [modalCrear, setModalCrear] = useState(false);
  const [editando, setEditando] = useState<RondaPlantilla | null>(null);
  const [ejecucionAbierta, setEjecucionAbierta] = useState<string | null>(null);
  const [confirmandoBaja, setConfirmandoBaja] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const [pl, ej] = await Promise.all([
        puntoControlService.listarPlantillas(objetivoId),
        puntoControlService.listarEjecuciones(objetivoId),
      ]);
      setPlantillas(pl);
      setEjecuciones(ej);
    } finally {
      setCargando(false);
    }
  }, [objetivoId]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const handleBaja = async (id: string) => {
    await puntoControlService.desactivarPlantilla(id);
    setConfirmandoBaja(null);
    cargar();
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-display font-bold text-navy flex items-center gap-2">
          <Route className="text-brand-blue" size={20} /> Rondas del objetivo
        </h3>
        <button
          onClick={() => setModalCrear(true)}
          className="text-brand-blue hover:text-brand-deep transition-colors text-sm font-medium flex items-center gap-1"
        >
          <Plus size={16} /> Crear ronda
        </button>
      </div>

      {cargando ? (
        <p className="text-sm text-muted py-2 text-center">Cargando...</p>
      ) : (
        <>
          {plantillas.length === 0 ? (
            <p className="text-sm text-muted py-2 text-center">
              Sin rondas configuradas. Creá una para que el personal de turno la cumpla escaneando los puntos.
            </p>
          ) : (
            <ul className="space-y-2">
              {plantillas.map((pl) => (
                <li
                  key={pl.id}
                  className="p-3 border border-line rounded-lg bg-canvas flex justify-between items-center"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-navy">{pl.nombre}</p>
                    <p className="text-xs text-muted">
                      {pl.puntos.length} punto{pl.puntos.length !== 1 ? 's' : ''}:{' '}
                      {pl.puntos.map((p) => p.punto_control.nombre).join(' → ')}
                    </p>
                    <p className="text-xs text-muted mt-0.5">
                      {pl.tolerancia_min
                        ? `Tolerancia: ${pl.tolerancia_min} min — si no se completa a tiempo, alerta al Centro de Operaciones`
                        : 'Sin tolerancia configurada'}
                    </p>
                  </div>
                  {confirmandoBaja === pl.id ? (
                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      <span className="text-xs text-red-500 font-medium">¿Dar de baja?</span>
                      <button
                        onClick={() => handleBaja(pl.id)}
                        className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                      <button
                        onClick={() => setConfirmandoBaja(null)}
                        className="p-1 border border-line text-muted rounded hover:bg-surface transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 shrink-0 ml-3">
                      <button
                        onClick={() => setEditando(pl)}
                        className="p-1 text-muted hover:text-brand-blue transition-colors"
                        title="Editar la ronda"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setConfirmandoBaja(pl.id)}
                        className="p-1 text-muted hover:text-red-500 transition-colors"
                        title="Dar de baja la ronda"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}

          {/* Evidencia de cumplimiento */}
          <div className="mt-5 pt-4 border-t border-line">
            <p className="text-xs font-medium text-muted uppercase tracking-wider mb-2">
              Cumplimiento (últimas ejecuciones)
            </p>
            {ejecuciones.length === 0 ? (
              <p className="text-sm text-muted py-2 text-center">
                Todavía no hay rondas ejecutadas por el personal.
              </p>
            ) : (
              <ul className="space-y-2">
                {ejecuciones.map((e) => {
                  const total = e.plantilla?.puntos.length ?? e.marcas.length;
                  const abierta = ejecucionAbierta === e.id;
                  const estado = ESTADOS[e.estado] ?? { label: e.estado, clase: '' };
                  return (
                    <li key={e.id} className="border border-line rounded-lg">
                      <button
                        onClick={() => setEjecucionAbierta(abierta ? null : e.id)}
                        className="w-full p-3 flex justify-between items-center text-left"
                      >
                        <div className="min-w-0">
                          <p className="font-medium text-sm text-navy">
                            {e.nombre} · {e.vigilador.apellido}, {e.vigilador.nombre}
                          </p>
                          <p className="text-xs text-muted flex items-center gap-1">
                            <Clock size={11} /> {hora(e.hora_inicio)}
                            {e.hora_fin ? ` → ${hora(e.hora_fin)}` : ''} · {e.marcas.length}/{total}{' '}
                            puntos
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 ml-3">
                          <span className={`status-badge ${estado.clase}`}>{estado.label}</span>
                          {abierta ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </div>
                      </button>
                      {abierta && (
                        <div className="px-3 pb-3 space-y-1.5">
                          {e.marcas.length === 0 ? (
                            <p className="text-xs text-muted">Sin puntos escaneados.</p>
                          ) : (
                            e.marcas.map((m) => (
                              <div
                                key={m.id}
                                className="flex items-center justify-between text-xs bg-canvas border border-line rounded p-2"
                              >
                                <span className="flex items-center gap-1.5 text-navy font-medium">
                                  <CheckCircle2 size={12} className="text-emerald" />
                                  {m.punto_control.nombre}
                                </span>
                                <span className="flex items-center gap-2 text-muted">
                                  {m.lat != null && m.lng != null && (
                                    <span className="flex items-center gap-0.5">
                                      <MapPin size={10} /> {m.lat.toFixed(4)}, {m.lng.toFixed(4)}
                                    </span>
                                  )}
                                  {hora(m.timestamp)}
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </>
      )}

      {(modalCrear || editando) && (
        <CrearRondaModal
          objetivoId={objetivoId}
          puestos={puestos}
          plantillaEditando={editando}
          onClose={() => { setModalCrear(false); setEditando(null); }}
          onCreada={() => {
            setModalCrear(false);
            setEditando(null);
            cargar();
          }}
        />
      )}
    </div>
  );
};

// ─── Modal de creación ───

interface ModalProps {
  objetivoId: string;
  puestos: Puesto[];
  plantillaEditando?: RondaPlantilla | null;
  onClose: () => void;
  onCreada: () => void;
}

interface PuntoDisponible extends PuntoControl {
  puestoNombre: string;
}

function CrearRondaModal({ objetivoId, puestos, plantillaEditando, onClose, onCreada }: ModalProps) {
  const esEdicion = !!plantillaEditando;
  const [nombre, setNombre] = useState(plantillaEditando?.nombre ?? '');
  const [tolerancia, setTolerancia] = useState(
    plantillaEditando?.tolerancia_min != null ? String(plantillaEditando.tolerancia_min) : '',
  );
  const [disponibles, setDisponibles] = useState<PuntoDisponible[]>([]);
  const [seleccion, setSeleccion] = useState<string[]>(
    plantillaEditando ? plantillaEditando.puntos.map((p) => p.punto_control_id) : [],
  );
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const result: PuntoDisponible[] = [];
        for (const p of puestos) {
          const lista = await puntoControlService.listarPorPuesto(p.id);
          lista.forEach((pc) => result.push({ ...pc, puestoNombre: p.nombre }));
        }
        setDisponibles(result);
      } finally {
        setCargando(false);
      }
    })();
  }, [puestos]);

  const toggle = (id: string) => {
    setSeleccion((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const guardar = async () => {
    if (!nombre.trim()) {
      setError('Poné un nombre a la ronda (ej: "Ronda nocturna").');
      return;
    }
    if (seleccion.length === 0) {
      setError('Elegí al menos un punto de control.');
      return;
    }
    const toleranciaMin = tolerancia.trim() === '' ? null : Number(tolerancia);
    if (toleranciaMin !== null && (!Number.isInteger(toleranciaMin) || toleranciaMin < 1)) {
      setError('La tolerancia debe ser un número entero de minutos mayor a cero.');
      return;
    }
    setGuardando(true);
    setError(null);
    try {
      const puntosDto = seleccion.map((id, i) => ({ punto_control_id: id, orden: i }));
      if (esEdicion && plantillaEditando) {
        await puntoControlService.actualizarPlantilla(plantillaEditando.id, {
          nombre: nombre.trim(),
          tolerancia_min: toleranciaMin,
          puntos: puntosDto,
        });
      } else {
        await puntoControlService.crearPlantilla({
          objetivo_id: objetivoId,
          nombre: nombre.trim(),
          tolerancia_min: toleranciaMin,
          puntos: puntosDto,
        });
      }
      onCreada();
    } catch {
      setError(esEdicion ? 'No se pudo guardar la ronda.' : 'No se pudo crear la ronda.');
      setGuardando(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-display font-bold text-navy">{esEdicion ? 'Editar ronda' : 'Crear ronda'}</h3>
          <button onClick={onClose} className="text-muted hover:text-navy">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted uppercase tracking-wider">
              Nombre de la ronda
            </label>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder='Ej: "Ronda perimetral nocturna"'
              className="w-full mt-1 border border-line rounded-lg p-2 text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted uppercase tracking-wider">
              Tiempo de tolerancia (minutos)
            </label>
            <input
              type="number"
              min={1}
              value={tolerancia}
              onChange={(e) => setTolerancia(e.target.value)}
              placeholder="Opcional — ej: 30"
              className="w-full mt-1 border border-line rounded-lg p-2 text-sm"
            />
            <p className="text-[11px] text-muted mt-1">
              Si la ronda no se completa dentro de este tiempo desde su inicio, queda
              INCOMPLETA y se alerta al Centro de Operaciones. Vacío = sin límite.
            </p>
          </div>

          <div>
            <label className="text-xs font-medium text-muted uppercase tracking-wider">
              Puntos de control (en orden de recorrido)
            </label>
            {cargando ? (
              <p className="text-sm text-muted py-3 text-center">Cargando puntos...</p>
            ) : disponibles.length === 0 ? (
              <p className="text-sm text-muted py-3 text-center">
                Este objetivo no tiene puntos de control. Crealos primero en la sección
                "Puntos de control".
              </p>
            ) : (
              <div className="mt-1 space-y-1.5 max-h-64 overflow-y-auto">
                {disponibles.map((p) => {
                  const idx = seleccion.indexOf(p.id);
                  const elegido = idx >= 0;
                  return (
                    <button
                      key={p.id}
                      onClick={() => toggle(p.id)}
                      className={`w-full flex justify-between items-center p-2.5 rounded-lg border text-left transition-colors ${
                        elegido
                          ? 'border-brand-blue bg-brand-blue/5'
                          : 'border-line bg-canvas hover:border-brand-blue/40'
                      }`}
                    >
                      <span className="min-w-0">
                        <span className="block text-sm font-medium text-navy">{p.nombre}</span>
                        <span className="block text-xs text-muted">{p.puestoNombre}</span>
                      </span>
                      {elegido && (
                        <span className="shrink-0 ml-2 w-6 h-6 rounded-full bg-brand-blue text-white text-xs font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
            <p className="text-[11px] text-muted mt-1.5">
              El número indica el orden del recorrido (según el orden en que los elijas).
            </p>
          </div>

          {error && <p className="text-xs text-amber">{error}</p>}

          <div className="flex gap-2 justify-end pt-1">
            <button onClick={onClose} className="text-sm text-muted hover:text-navy px-4 py-2">
              Cancelar
            </button>
            <button
              onClick={guardar}
              disabled={guardando}
              className="text-sm bg-brand-blue text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-deep transition-colors disabled:opacity-50"
            >
              {guardando ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Crear ronda'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
