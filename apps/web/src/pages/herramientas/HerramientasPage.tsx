import { useEffect, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { herramientaService, Herramienta, TIPOS_HERRAMIENTA } from '../../services/herramienta.service';
import { vigilanteService, Vigilador } from '../../services/vigilante.service';

const ESTADO_LABEL: Record<string, string> = {
  DISPONIBLE: 'Disponible',
  ASIGNADA: 'Asignada',
  EN_REPARACION: 'En reparación',
  BAJA: 'Dada de baja',
};

const ESTADO_BADGE: Record<string, string> = {
  DISPONIBLE: 'status-badge-ok',
  ASIGNADA: 'status-badge-alert',
  EN_REPARACION: 'status-badge-alert',
  BAJA: 'status-badge-alert',
};

const tipoLabel = (tipo: string) => TIPOS_HERRAMIENTA.find((t) => t.value === tipo)?.label || tipo;

export const HerramientasPage = () => {
  const [herramientas, setHerramientas] = useState<Herramienta[]>([]);
  const [vigiladores, setVigiladores] = useState<Vigilador[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<'TODAS' | 'DISPONIBLE' | 'ASIGNADA' | 'BAJA'>('TODAS');
  const [formAbierto, setFormAbierto] = useState(false);
  const [accionandoId, setAccionandoId] = useState<string | null>(null);
  const [asignandoId, setAsignandoId] = useState<string | null>(null);
  const [vigiladorElegido, setVigiladorElegido] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [nuevoTipo, setNuevoTipo] = useState(TIPOS_HERRAMIENTA[0].value);
  const [nuevaDescripcion, setNuevaDescripcion] = useState('');
  const [creando, setCreando] = useState(false);

  const cargar = async () => {
    setLoading(true);
    try {
      const [hs, vs] = await Promise.all([herramientaService.getAll(), vigilanteService.getAll()]);
      setHerramientas(hs);
      setVigiladores(vs.filter((v) => v.estado === 'ACTIVO'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const visibles = herramientas.filter((h) => filtro === 'TODAS' || h.estado === filtro);

  const nombreAsignado = (h: Herramienta) => {
    const activa = h.asignaciones?.find((a) => !a.devuelta_el);
    return activa?.vigilador ? `${activa.vigilador.apellido}, ${activa.vigilador.nombre}` : null;
  };

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevaDescripcion.trim()) return;
    setCreando(true);
    setError(null);
    try {
      await herramientaService.create({ tipo: nuevoTipo, descripcion: nuevaDescripcion.trim() });
      setNuevaDescripcion('');
      setFormAbierto(false);
      await cargar();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'No se pudo crear la herramienta.');
    } finally {
      setCreando(false);
    }
  };

  const handleAsignar = async (h: Herramienta) => {
    if (!vigiladorElegido) return;
    setAccionandoId(h.id);
    setError(null);
    try {
      await herramientaService.asignar(h.id, vigiladorElegido);
      setAsignandoId(null);
      setVigiladorElegido('');
      await cargar();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'No se pudo asignar la herramienta.');
    } finally {
      setAccionandoId(null);
    }
  };

  const handleDevolver = async (h: Herramienta) => {
    setAccionandoId(h.id);
    setError(null);
    try {
      await herramientaService.devolver(h.id);
      await cargar();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'No se pudo devolver la herramienta.');
    } finally {
      setAccionandoId(null);
    }
  };

  const handleBaja = async (h: Herramienta) => {
    if (!confirm(`¿Dar de baja "${h.descripcion}"?`)) return;
    setAccionandoId(h.id);
    setError(null);
    try {
      await herramientaService.darDeBaja(h.id);
      await cargar();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'No se pudo dar de baja la herramienta.');
    } finally {
      setAccionandoId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-display font-bold text-navy">Herramientas</h2>
          <p className="text-muted">Inventario de celulares, linternas, conos, cintas de tránsito y demás equipos.</p>
        </div>
        <button onClick={() => setFormAbierto(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Nueva herramienta
        </button>
      </div>

      {error && <div className="p-3 bg-amber/10 border border-amber/30 rounded-md text-sm text-amber">{error}</div>}

      <div className="flex gap-2">
        {(['TODAS', 'DISPONIBLE', 'ASIGNADA', 'BAJA'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              filtro === f ? 'bg-brand-blue text-white' : 'bg-canvas text-muted hover:text-navy'
            }`}
          >
            {f === 'TODAS' ? 'Todas' : ESTADO_LABEL[f]}
          </button>
        ))}
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-line text-muted text-sm font-medium">
                <th className="pb-3 px-4">Código</th>
                <th className="pb-3 px-4">Tipo</th>
                <th className="pb-3 px-4">Descripción</th>
                <th className="pb-3 px-4">Estado</th>
                <th className="pb-3 px-4">Asignado a</th>
                <th className="pb-3 px-4">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {loading ? (
                <tr><td colSpan={6} className="py-8 text-center text-muted">Cargando herramientas...</td></tr>
              ) : visibles.length === 0 ? (
                <tr><td colSpan={6} className="py-8 text-center text-muted">No hay herramientas para este filtro.</td></tr>
              ) : (
                visibles.map((h) => (
                  <tr key={h.id} className="text-sm">
                    <td className="py-4 px-4 font-mono text-muted">{h.codigo}</td>
                    <td className="py-4 px-4 text-navy">{tipoLabel(h.tipo)}</td>
                    <td className="py-4 px-4 text-navy font-medium">{h.descripcion}</td>
                    <td className="py-4 px-4">
                      <span className={`status-badge ${ESTADO_BADGE[h.estado] || 'status-badge-alert'}`}>
                        {ESTADO_LABEL[h.estado] || h.estado}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-muted">{nombreAsignado(h) || '—'}</td>
                    <td className="py-4 px-4">
                      {h.estado === 'DISPONIBLE' && (
                        <div className="flex items-center gap-2">
                          {asignandoId === h.id ? (
                            <>
                              <select
                                className="text-xs border border-line rounded px-2 py-1 bg-surface outline-none"
                                value={vigiladorElegido}
                                onChange={(e) => setVigiladorElegido(e.target.value)}
                              >
                                <option value="">Elegir vigilador...</option>
                                {vigiladores.map((v) => (
                                  <option key={v.id} value={v.id}>
                                    {v.apellido}, {v.nombre}
                                  </option>
                                ))}
                              </select>
                              <button
                                onClick={() => handleAsignar(h)}
                                disabled={!vigiladorElegido || accionandoId === h.id}
                                className="text-xs text-brand-blue font-medium hover:underline disabled:opacity-50"
                              >
                                Confirmar
                              </button>
                              <button onClick={() => setAsignandoId(null)} className="text-xs text-muted hover:text-navy">
                                <X size={14} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => setAsignandoId(h.id)}
                                className="text-xs text-brand-blue font-medium hover:underline"
                              >
                                Asignar
                              </button>
                              <button
                                onClick={() => handleBaja(h)}
                                disabled={accionandoId === h.id}
                                className="text-xs text-muted hover:text-amber disabled:opacity-50"
                              >
                                Dar de baja
                              </button>
                            </>
                          )}
                        </div>
                      )}
                      {h.estado === 'ASIGNADA' && (
                        <button
                          onClick={() => handleDevolver(h)}
                          disabled={accionandoId === h.id}
                          className="text-xs text-brand-blue font-medium hover:underline disabled:opacity-50"
                        >
                          {accionandoId === h.id ? 'Devolviendo...' : 'Devolver'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {formAbierto && (
        <div className="fixed inset-0 bg-navy/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface w-full max-w-sm rounded-xl shadow-xl border border-line animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-line flex justify-between items-center">
              <h3 className="text-lg font-display font-bold text-navy">Nueva herramienta</h3>
              <button onClick={() => setFormAbierto(false)} className="text-muted hover:text-navy transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCrear} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted uppercase tracking-wider">Tipo</label>
                <select
                  className="w-full px-3 py-2 bg-canvas border border-line rounded-md focus:ring-2 focus:ring-brand-blue/20 outline-none text-sm"
                  value={nuevoTipo}
                  onChange={(e) => setNuevoTipo(e.target.value)}
                >
                  {TIPOS_HERRAMIENTA.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted uppercase tracking-wider">Descripción</label>
                <input
                  type="text"
                  placeholder="Ej: Celular Motorola #3"
                  className="w-full px-3 py-2 bg-canvas border border-line rounded-md focus:ring-2 focus:ring-brand-blue/20 outline-none text-sm"
                  value={nuevaDescripcion}
                  onChange={(e) => setNuevaDescripcion(e.target.value)}
                  required
                />
              </div>
              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setFormAbierto(false)} className="flex-1 px-4 py-2 border border-line text-muted font-medium rounded-md hover:bg-canvas transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 btn-primary" disabled={creando}>
                  {creando ? 'Guardando...' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
