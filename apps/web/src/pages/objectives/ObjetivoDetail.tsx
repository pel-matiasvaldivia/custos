import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  MapPin,
  Shield,
  Users,
  Truck,
  Wrench,
  FileText,
  Pencil,
  Trash2,
  AlertTriangle,
  Bell,
} from 'lucide-react';
import { objetivoService, ObjetivoDetalle, Puesto } from '../../services/objetivo.service';
import { puestoService } from '../../services/puesto.service';
import { ObjetivoForm } from './ObjetivoForm';
import { PuestoForm } from './PuestoForm';
import { VehiculoAsignarForm } from './VehiculoAsignarForm';
import { EsquemaCuadranteObjetivo } from './EsquemaCuadranteObjetivo';

const ETIQUETAS_MODO: Record<string, string> = {
  POR_PLANIFICADO: 'Por planificado',
  POR_REAL: 'Por real',
  ABONO_FIJO: 'Abono fijo',
};

export const ObjetivoDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [detalle, setDetalle] = useState<ObjetivoDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalPuesto, setModalPuesto] = useState(false);
  const [modalEditarPuesto, setModalEditarPuesto] = useState<Puesto | null>(null);
  const [confirmandoEliminarPuesto, setConfirmandoEliminarPuesto] = useState<string | null>(null);
  const [errorEliminarPuesto, setErrorEliminarPuesto] = useState<{ id: string; msg: string } | null>(null);
  const [modalVehiculo, setModalVehiculo] = useState(false);
  const [enviandoNotificacion, setEnviandoNotificacion] = useState(false);
  const [notificacionEnviada, setNotificacionEnviada] = useState(false);

  const cargar = async () => {
    if (!id) return;
    const data = await objetivoService.getDetalle(id);
    setDetalle(data);
  };

  useEffect(() => {
    setLoading(true);
    cargar().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleEliminarPuesto = async (puestoId: string) => {
    try {
      await puestoService.delete(puestoId);
      setConfirmandoEliminarPuesto(null);
      setErrorEliminarPuesto(null);
      cargar();
    } catch (err) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'No se pudo eliminar el puesto.';
      setConfirmandoEliminarPuesto(null);
      setErrorEliminarPuesto({ id: puestoId, msg });
    }
  };

  const handleLiberarVehiculo = async (asignacionId: string) => {
    if (!id) return;
    await objetivoService.liberarVehiculo(id, asignacionId);
    cargar();
  };

  const handleNotificarPersonal = async () => {
    if (!id) return;
    setEnviandoNotificacion(true);
    try {
      await objetivoService.notificarPersonalInsuficiente(id);
      setNotificacionEnviada(true);
    } catch {
      // el botón ya está deshabilitado al estar suficiente la dotación
    } finally {
      setEnviandoNotificacion(false);
    }
  };

  if (loading) return <div className="p-8 text-muted">Cargando objetivo...</div>;
  if (!detalle) return <div className="p-8 text-amber">Objetivo no encontrado.</div>;

  const { objetivo, puestos, contrato, vehiculosAsignados, personal, herramientas, dotacion } = detalle;

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/objectives')}
        className="text-muted hover:text-navy transition-colors flex items-center gap-2 font-medium"
      >
        <ArrowLeft size={18} /> Volver al listado
      </button>

      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-display font-bold text-navy">{objetivo.nombre}</h2>
          <p className="text-muted flex items-center gap-2">
            Código: <span className="font-mono font-bold text-navy">{objetivo.codigo}</span> • Cliente: {objetivo.cliente_nombre}
          </p>
          {objetivo.direccion && (
            <p className="text-muted flex items-center gap-1 mt-1">
              <MapPin size={14} /> {objetivo.direccion}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <button
            onClick={() => setModalEditar(true)}
            className="text-brand-blue hover:text-brand-deep transition-colors text-sm font-medium flex items-center gap-1"
          >
            <Pencil size={14} /> Editar ficha
          </button>
          <span className={`status-badge ${objetivo.estado === 'ACTIVO' ? 'status-badge-ok' : 'status-badge-alert'}`}>
            {objetivo.estado}
          </span>
        </div>
      </div>

      {objetivo.estado === 'ACTIVO' && (!contrato || contrato.estado !== 'ACTIVO') && (
        <div className="flex items-start gap-3 p-3 rounded-lg border border-amber/40 bg-amber/10 text-sm text-amber">
          <AlertTriangle size={16} className="shrink-0 mt-0.5" />
          <span>
            Este objetivo está marcado como <strong>ACTIVO</strong> pero no tiene un contrato activo vinculado.
            Sin contrato no se pueden asignar recursos ni personal. Vinculá un contrato desde la ficha del cliente.
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-display font-bold text-navy flex items-center gap-2">
                <Shield className="text-brand-blue" size={20} /> Puestos
              </h3>
              <button
                onClick={() => setModalPuesto(true)}
                className="text-brand-blue hover:text-brand-deep transition-colors text-sm font-medium flex items-center gap-1"
              >
                <Plus size={16} /> Agregar Puesto
              </button>
            </div>
            <div className="space-y-3">
              {puestos.length === 0 ? (
                <p className="text-sm text-muted py-4 text-center">
                  Todavía no se cargó ningún puesto para este objetivo.
                </p>
              ) : (
                puestos.map((p) => {
                  const eliminando = confirmandoEliminarPuesto === p.id;
                  const errorEste = errorEliminarPuesto?.id === p.id ? errorEliminarPuesto.msg : null;
                  return (
                    <div key={p.id} className="space-y-1">
                    <div
                      className={`p-4 border rounded-lg flex justify-between items-center transition-colors ${
                        eliminando ? 'border-red-300 bg-red-50' : 'border-line bg-canvas'
                      }`}
                    >
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm text-navy">{p.nombre}</h4>
                        {p.ubicacion && <p className="text-xs text-muted">{p.ubicacion}</p>}
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-3">
                        {p.requiere_arma && <span className="status-badge status-badge-alert">Arma</span>}
                        {p.requiere_movil && <span className="status-badge status-badge-ok">Móvil</span>}
                        {eliminando ? (
                          <>
                            <span className="text-xs text-red-500 font-medium">¿Eliminar?</span>
                            <button
                              onClick={() => handleEliminarPuesto(p.id)}
                              className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                              title="Confirmar eliminación"
                            >
                              <Trash2 size={12} />
                            </button>
                            <button
                              onClick={() => setConfirmandoEliminarPuesto(null)}
                              className="p-1 border border-line text-muted rounded hover:bg-surface transition-colors"
                              title="Cancelar"
                            >
                              <ArrowLeft size={12} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => { setModalEditarPuesto(p); setErrorEliminarPuesto(null); }}
                              className="p-1 text-muted hover:text-brand-blue transition-colors"
                              title="Editar puesto"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => { setConfirmandoEliminarPuesto(p.id); setErrorEliminarPuesto(null); }}
                              className="p-1 text-muted hover:text-red-500 transition-colors"
                              title="Eliminar puesto"
                            >
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    {errorEste && (
                      <p className="text-xs text-amber px-1">{errorEste}</p>
                    )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-display font-bold text-navy mb-4 flex items-center gap-2">
              <Users className="text-brand-blue" size={20} /> Personal Asignado
            </h3>
            {dotacion.horasSemanales > 0 && (
              <div
                className={`mb-4 p-3 rounded-lg border text-sm ${
                  dotacion.suficiente
                    ? 'border-emerald/30 bg-emerald/5 text-emerald'
                    : 'border-amber/30 bg-amber/5 text-amber'
                }`}
              >
                <p className="font-medium flex items-center gap-1.5">
                  {!dotacion.suficiente && <AlertTriangle size={14} />}
                  Dotación requerida: {dotacion.vigiladoresRequeridos} · Disponibles en nómina: {dotacion.vigiladoresActivosTotal}
                </p>
                <p className="text-xs opacity-80 mt-0.5">
                  Calculado sobre {dotacion.horasSemanales}hs semanales de cobertura.
                </p>
                {!dotacion.suficiente && (
                  <button
                    onClick={handleNotificarPersonal}
                    disabled={enviandoNotificacion || notificacionEnviada}
                    className="mt-2 text-amber hover:text-amber/80 transition-colors text-xs font-medium flex items-center gap-1 disabled:opacity-60"
                  >
                    <Bell size={12} />
                    {notificacionEnviada
                      ? 'Notificación enviada'
                      : enviandoNotificacion
                        ? 'Enviando...'
                        : 'Notificar necesidad de contratación'}
                  </button>
                )}
              </div>
            )}
            <EsquemaCuadranteObjetivo objetivoId={id!} puestos={puestos} />

            {personal.length > 0 && (
              <div className="mt-4 pt-4 border-t border-line">
                <p className="text-xs font-medium text-muted uppercase tracking-wider mb-2">Vigiladores con asignación reciente</p>
                <ul className="space-y-2">
                  {personal.map((p) => (
                    <li key={p.id} className="flex justify-between items-center text-sm py-1">
                      <Link to={`/personnel/${p.id}`} className="font-medium text-navy hover:text-brand-blue transition-colors">
                        {p.apellido}, {p.nombre}
                      </Link>
                      <span className={`status-badge ${p.estado === 'ACTIVO' ? 'status-badge-ok' : 'status-badge-alert'}`}>
                        {p.estado}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="card">
            <h3 className="text-lg font-display font-bold text-navy mb-4 flex items-center gap-2">
              <Wrench className="text-brand-blue" size={20} /> Herramientas en Uso
            </h3>
            {herramientas.length === 0 ? (
              <p className="text-sm text-muted py-2 text-center">
                Sin herramientas entregadas al personal de este objetivo.
              </p>
            ) : (
              <ul className="space-y-2">
                {herramientas.map((h) => (
                  <li key={h.id} className="flex justify-between items-center text-sm py-2 border-b border-line last:border-b-0">
                    <div>
                      <p className="font-medium text-navy">{h.herramienta.descripcion}</p>
                      <p className="text-xs text-muted">{h.herramienta.codigo} · {h.herramienta.tipo}</p>
                    </div>
                    <span className="text-xs text-muted">{h.vigilador.apellido}, {h.vigilador.nombre}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-display font-bold text-navy flex items-center gap-2">
                <FileText className="text-brand-blue" size={18} /> Contrato
              </h3>
            </div>
            {contrato ? (
              <div className="space-y-2 text-sm">
                <p className="font-mono font-bold text-navy">{contrato.codigo}</p>
                <p className="text-muted">{contrato.cliente_nombre}</p>
                <span className={`status-badge ${contrato.estado === 'ACTIVO' ? 'status-badge-ok' : 'status-badge-alert'}`}>
                  {contrato.estado}
                </span>
                {contrato.facturacion && (
                  <div className="pt-2 border-t border-line mt-2">
                    <p className="text-xs text-muted uppercase tracking-wider">Tipo de contrato</p>
                    <p className="text-navy font-medium">{ETIQUETAS_MODO[contrato.facturacion.modo] || contrato.facturacion.modo}</p>
                    {contrato.facturacion.modo === 'ABONO_FIJO' && contrato.facturacion.abono_mensual && (
                      <p className="text-muted">Abono: ${contrato.facturacion.abono_mensual}/mes</p>
                    )}
                    {contrato.facturacion.modo !== 'ABONO_FIJO' && contrato.facturacion.tarifa_hora && (
                      <p className="text-muted">Tarifa: ${contrato.facturacion.tarifa_hora}/h</p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-2">
                <p className="text-sm text-muted">
                  Este objetivo todavía no tiene contrato vinculado. El contrato se crea desde la ficha del cliente.
                </p>
              </div>
            )}
          </div>

          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-display font-bold text-navy flex items-center gap-2">
                <Truck className="text-brand-blue" size={18} /> Vehículos
              </h3>
              <button
                onClick={() => setModalVehiculo(true)}
                className="text-brand-blue hover:text-brand-deep transition-colors text-sm font-medium flex items-center gap-1"
              >
                <Plus size={16} />
              </button>
            </div>
            {vehiculosAsignados.length === 0 ? (
              <p className="text-sm text-muted py-2 text-center">Sin vehículos asignados.</p>
            ) : (
              <ul className="space-y-2">
                {vehiculosAsignados.map((va) => (
                  <li key={va.id} className="flex justify-between items-center text-sm py-2 border-b border-line last:border-b-0">
                    <div>
                      <p className="font-mono font-medium text-navy">{va.vehiculo.patente}</p>
                      <p className="text-xs text-muted">{va.vehiculo.marca} {va.vehiculo.modelo}</p>
                      {va.costo_estimado_mensual && (
                        <p className="text-xs text-brand-blue font-medium">
                          ~${Number(va.costo_estimado_mensual).toLocaleString('es-AR')}/mes ({va.horas_estimadas_mes}hs)
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleLiberarVehiculo(va.id)}
                      className="text-muted hover:text-amber transition-colors"
                      title="Liberar vehículo"
                    >
                      <Trash2 size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {modalEditar && (
        <ObjetivoForm
          objetivo={objetivo}
          hasContratoActivo={!!contrato && contrato.estado === 'ACTIVO'}
          onClose={() => setModalEditar(false)}
          onSaved={() => {
            setModalEditar(false);
            cargar();
          }}
        />
      )}

      {modalPuesto && id && (
        <PuestoForm
          objetivoId={id}
          onClose={() => setModalPuesto(false)}
          onCreated={() => {
            setModalPuesto(false);
            cargar();
          }}
        />
      )}

      {modalEditarPuesto && id && (
        <PuestoForm
          objetivoId={id}
          puesto={modalEditarPuesto}
          onClose={() => setModalEditarPuesto(null)}
          onCreated={() => {
            setModalEditarPuesto(null);
            cargar();
          }}
        />
      )}

      {modalVehiculo && id && (
        <VehiculoAsignarForm
          objetivoId={id}
          onClose={() => setModalVehiculo(false)}
          onAsignado={() => {
            setModalVehiculo(false);
            cargar();
          }}
        />
      )}
    </div>
  );
};
