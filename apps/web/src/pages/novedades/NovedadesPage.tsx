import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Download, MessageSquare, Clock, User, MapPin, X, Paperclip } from 'lucide-react';
import api from '../../services/api';
import { useSocket } from '../../hooks/useSocket';
import { useAuth } from '../../context/AuthContext';
import { catalogoService, CatalogoItemOption } from '../../services/catalogo.service';
import { objetivoService, Objetivo, Puesto } from '../../services/objetivo.service';
import { puestoService } from '../../services/puesto.service';
import { vigilanteService, Vigilador } from '../../services/vigilante.service';
import { PageHint } from '../../components/common/PageHint';

interface Filtros {
  objetivoId: string;
  puestoId: string;
  vigiladorId: string;
  tipo: string;
  prioridad: string;
  desde: string;
  hasta: string;
  q: string;
}

const FILTROS_VACIOS: Filtros = {
  objetivoId: '', puestoId: '', vigiladorId: '', tipo: '', prioridad: '', desde: '', hasta: '', q: '',
};

export const NovedadesPage = () => {
  const { user } = useAuth();
  const [novedades, setNovedades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tiposNovedad, setTiposNovedad] = useState<CatalogoItemOption[]>([]);
  const [formData, setFormData] = useState({ tipo: 'GENERAL', prioridad: 'NORMAL', descripcion: '' });
  const [adelantoMonto, setAdelantoMonto] = useState('');
  const [adelantoCuotas, setAdelantoCuotas] = useState(1);

  const [filtros, setFiltros] = useState<Filtros>(FILTROS_VACIOS);
  const [objetivos, setObjetivos] = useState<Objetivo[]>([]);
  const [puestos, setPuestos] = useState<Puesto[]>([]);
  const [vigiladores, setVigiladores] = useState<Vigilador[]>([]);
  const [descargando, setDescargando] = useState(false);
  const [errorDescarga, setErrorDescarga] = useState<string | null>(null);
  const { on } = useSocket('co', user?.tenantId);

  const esAdelanto = formData.tipo === 'ADELANTO_SUELDO';

  // Query string común al listado y al reporte PDF.
  const queryParams = useCallback(() => {
    const p = new URLSearchParams();
    (Object.keys(filtros) as (keyof Filtros)[]).forEach((k) => {
      if (filtros[k]) p.set(k, filtros[k]);
    });
    return p;
  }, [filtros]);

  const fetchData = useCallback(() => {
    setLoading(true);
    api.get<{ data: any[] }>(`/novedades?${queryParams().toString()}`)
      .then(res => {
        setNovedades(res.data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [queryParams]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Novedad nueva desde el móvil → refresca el listado en vivo.
  on('novedad.new', () => fetchData());

  useEffect(() => {
    catalogoService.getItems('NOVEDAD_TIPO').then(setTiposNovedad).catch(() => {});
    objetivoService.getAll(1, 200).then(setObjetivos).catch(() => {});
    puestoService.findAll().then(setPuestos).catch(() => {});
    vigilanteService.getAll(1, 200).then(setVigiladores).catch(() => {});
  }, []);

  const puestosFiltrados = filtros.objetivoId
    ? puestos.filter((p) => p.objetivo_id === filtros.objetivoId)
    : puestos;

  const hayFiltros = Object.values(filtros).some(Boolean);

  const setF = (k: keyof Filtros, val: string) =>
    setFiltros((prev) => ({
      ...prev,
      [k]: val,
      // Si cambia el objetivo, se limpia el puesto que ya no aplica.
      ...(k === 'objetivoId' ? { puestoId: '' } : {}),
    }));

  const descargarPdf = async () => {
    setDescargando(true);
    setErrorDescarga(null);
    try {
      const res = await api.get(`/novedades/reporte/pdf?${queryParams().toString()}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte-novedades-${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch {
      // Antes fallaba en silencio y parecía que el botón "no hacía nada".
      setErrorDescarga('No se pudo generar el reporte. Reintentá en unos segundos.');
    } finally {
      setDescargando(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let payload = { ...formData };
    if (esAdelanto) {
      const monto = Number(adelantoMonto);
      if (!monto || monto <= 0) return;
      // Se codifica el monto y las cuotas para que Liquidaciones lo descuente.
      payload = {
        ...payload,
        descripcion: `[ADELANTO monto=${monto} cuotas=${adelantoCuotas}] ${formData.descripcion}`.trim(),
      };
    }
    await api.post('/novedades', payload);
    setIsModalOpen(false);
    setFormData({ tipo: 'GENERAL', prioridad: 'NORMAL', descripcion: '' });
    setAdelantoMonto('');
    setAdelantoCuotas(1);
    fetchData();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICA': return 'bg-red-500 text-white ring-red-200';
      case 'ALTA': return 'bg-amber text-navy ring-amber/20';
      default: return 'bg-brand-blue text-surface ring-brand-blue/20';
    }
  };

  return (
    <div className="space-y-8">
      <PageHint id="novedades" title="El registro vivo de lo que pasa en los puestos">
        Cargá incidencias, partes y eventos (incluido "Adelanto de sueldo", que impacta en la liquidación).
        El tipo de novedad sale del catálogo que configurás en Configuración › Catálogos.
      </PageHint>
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-display font-bold text-navy">Novedades del Servicio</h2>
          <p className="text-muted text-lg">Reportes e incidencias en tiempo real desde los puestos.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary flex items-center gap-2">
          <Plus size={20} />
          Reportar Novedad
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card w-full max-w-lg animate-in fade-in zoom-in duration-200">
            <h3 className="text-2xl font-bold text-navy mb-6">Reportar Novedad</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="nov-tipo" className="label text-xs uppercase font-black">Tipo de Novedad</label>
                <select
                  id="nov-tipo"
                  className="input"
                  value={formData.tipo}
                  onChange={e => setFormData({...formData, tipo: e.target.value})}
                >
                  {tiposNovedad.map(t => (
                    <option key={t.codigo} value={t.codigo}>{t.etiqueta}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label text-xs uppercase font-black">Prioridad</label>
                <div className="flex gap-2">
                  {['NORMAL', 'ALTA', 'CRITICA'].map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setFormData({...formData, prioridad: p})}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                        formData.prioridad === p
                        ? 'bg-brand-blue text-surface shadow-lg'
                        : 'bg-canvas text-muted hover:bg-surface/10'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              {esAdelanto && (
                <div className="grid grid-cols-2 gap-3 p-3 bg-brand-tint/50 border border-brand-blue/20 rounded-xl">
                  <div>
                    <label htmlFor="nov-adelanto-monto" className="label text-xs uppercase font-black">Monto del adelanto</label>
                    <input
                      id="nov-adelanto-monto"
                      type="number"
                      className="input"
                      placeholder="50000"
                      value={adelantoMonto}
                      onChange={e => setAdelantoMonto(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="nov-adelanto-cuotas" className="label text-xs uppercase font-black">Devolución en cuotas</label>
                    <select id="nov-adelanto-cuotas" className="input" value={adelantoCuotas} onChange={e => setAdelantoCuotas(Number(e.target.value))}>
                      {[1, 2, 3, 4, 5, 6].map(n => (
                        <option key={n} value={n}>{n} {n === 1 ? 'cuota' : 'cuotas'}</option>
                      ))}
                    </select>
                  </div>
                  <p className="col-span-2 text-[11px] text-muted">
                    Se descuenta en la liquidación. Ante baja del empleado, el saldo se descuenta en la liquidación final.
                  </p>
                </div>
              )}
              <div>
                <label className="label text-xs uppercase font-black">Descripción Detallada</label>
                <textarea
                  className="input h-32 py-3"
                  placeholder="Describa lo sucedido..."
                  value={formData.descripcion}
                  onChange={e => setFormData({...formData, descripcion: e.target.value})}
                  required={!esAdelanto}
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 btn btn-secondary"
                >
                  Cancelar
                </button>
                <button type="submit" className="flex-1 btn btn-primary">
                  Enviar Reporte
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card space-y-4">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="relative flex-1 min-w-[200px]">
            <label htmlFor="nov-buscar" className="label text-[10px] uppercase font-black">Buscar</label>
            <Search className="absolute left-3 top-[34px] text-muted" size={16} />
            <input
              id="nov-buscar"
              type="text"
              placeholder="Texto en la descripción..."
              className="input pl-9"
              value={filtros.q}
              onChange={(e) => setF('q', e.target.value)}
            />
          </div>
          <div className="min-w-[160px]">
            <label htmlFor="nov-f-objetivo" className="label text-[10px] uppercase font-black">Objetivo</label>
            <select id="nov-f-objetivo" className="input" value={filtros.objetivoId} onChange={(e) => setF('objetivoId', e.target.value)}>
              <option value="">Todos</option>
              {objetivos.map((o) => <option key={o.id} value={o.id}>{o.nombre}</option>)}
            </select>
          </div>
          <div className="min-w-[150px]">
            <label htmlFor="nov-f-puesto" className="label text-[10px] uppercase font-black">Puesto</label>
            <select id="nov-f-puesto" className="input" value={filtros.puestoId} onChange={(e) => setF('puestoId', e.target.value)}>
              <option value="">Todos</option>
              {puestosFiltrados.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
            </select>
          </div>
          <div className="min-w-[160px]">
            <label htmlFor="nov-f-vigilador" className="label text-[10px] uppercase font-black">Vigilador</label>
            <select id="nov-f-vigilador" className="input" value={filtros.vigiladorId} onChange={(e) => setF('vigiladorId', e.target.value)}>
              <option value="">Todos</option>
              {vigiladores.map((v) => <option key={v.id} value={v.id}>{v.apellido}, {v.nombre}</option>)}
            </select>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 items-end">
          <div className="min-w-[130px]">
            <label htmlFor="nov-f-tipo" className="label text-[10px] uppercase font-black">Tipo</label>
            <select id="nov-f-tipo" className="input" value={filtros.tipo} onChange={(e) => setF('tipo', e.target.value)}>
              <option value="">Todos</option>
              {tiposNovedad.map((t) => <option key={t.codigo} value={t.codigo}>{t.etiqueta}</option>)}
            </select>
          </div>
          <div className="min-w-[130px]">
            <label htmlFor="nov-f-prioridad" className="label text-[10px] uppercase font-black">Prioridad</label>
            <select id="nov-f-prioridad" className="input" value={filtros.prioridad} onChange={(e) => setF('prioridad', e.target.value)}>
              <option value="">Todas</option>
              {['NORMAL', 'ALTA', 'CRITICA'].map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="nov-f-desde" className="label text-[10px] uppercase font-black">Desde</label>
            <input id="nov-f-desde" type="date" className="input" value={filtros.desde} onChange={(e) => setF('desde', e.target.value)} />
          </div>
          <div>
            <label htmlFor="nov-f-hasta" className="label text-[10px] uppercase font-black">Hasta</label>
            <input id="nov-f-hasta" type="date" className="input" value={filtros.hasta} onChange={(e) => setF('hasta', e.target.value)} />
          </div>
          <div className="flex-1" />
          {hayFiltros && (
            <button onClick={() => setFiltros(FILTROS_VACIOS)} className="btn btn-secondary flex items-center gap-2">
              <X size={16} /> Limpiar
            </button>
          )}
          <button onClick={descargarPdf} disabled={descargando} className="btn btn-primary flex items-center gap-2">
            <Download size={16} /> {descargando ? 'Generando...' : 'Descargar reporte'}
          </button>
        </div>
        {errorDescarga && <p className="text-xs text-red-500 text-right">{errorDescarga}</p>}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="p-8 text-center text-muted italic">Cargando novedades...</div>
        ) : novedades.length === 0 ? (
          <div className="p-12 text-center card bg-canvas/40 border-dashed">
            <MessageSquare className="mx-auto text-muted/30 mb-4" size={48} />
            <p className="text-muted text-lg">No hay novedades registradas en las últimas horas.</p>
          </div>
        ) : novedades.map((nov) => (
          <div key={nov.id} className="card hover:shadow-lg transition-all p-0 overflow-hidden flex">
            <div className={`w-2 ${getPriorityColor(nov.prioridad).split(' ')[0]}`} />
            <div className="p-6 flex-1 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter ${getPriorityColor(nov.prioridad)}`}>
                    {nov.prioridad}
                  </span>
                  <span className="text-navy font-bold">{nov.tipo}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted font-mono">
                  <Clock size={12} />
                  {new Date(nov.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              <p className="text-navy leading-relaxed">{nov.descripcion}</p>

              {Array.isArray(nov.adjuntos) && nov.adjuntos.length > 0 && (
                <div className="flex flex-wrap items-center gap-3">
                  {nov.adjuntos.map((key: string, i: number) => (
                    <AdjuntoNovedad key={`${nov.id}-${i}`} novedadId={nov.id} indice={i} storageKey={key} />
                  ))}
                </div>
              )}

              <div className="flex items-center gap-6 pt-4 border-t border-surface/5">
                <div className="flex items-center gap-2 text-xs text-muted">
                  <MapPin size={14} className="text-brand-blue" />
                  <span className="font-bold">{nov.puesto?.nombre || 'General'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted">
                  <User size={14} className="text-brand-blue" />
                  <span>{nov.vigilador?.nombre} {nov.vigilador?.apellido}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Foto o audio adjunto de una novedad (subidos desde el móvil). Los archivos
 * viven en MinIO detrás de la API con auth, así que <img>/<audio> no pueden
 * apuntar directo a la URL: se baja el blob con el token y se usa un objectURL.
 */
function AdjuntoNovedad({ novedadId, indice, storageKey }: { novedadId: string; indice: number; storageKey: string }) {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const esAudio = /\.(webm|ogg|oga|mp3|m4a|aac|wav)$/i.test(storageKey);

  useEffect(() => {
    let objUrl: string | null = null;
    let cancelado = false;
    api
      .get(`/novedades/${novedadId}/adjuntos/${indice}`, { responseType: 'blob' })
      .then((res) => {
        objUrl = URL.createObjectURL(res.data);
        if (!cancelado) setUrl(objUrl);
      })
      .catch(() => !cancelado && setError(true));
    return () => {
      cancelado = true;
      if (objUrl) URL.revokeObjectURL(objUrl);
    };
  }, [novedadId, indice]);

  if (error) {
    return (
      <span className="flex items-center gap-1.5 text-xs text-muted italic">
        <Paperclip size={13} /> Adjunto no disponible
      </span>
    );
  }
  if (!url) {
    return (
      <span className="flex items-center gap-1.5 text-xs text-muted animate-pulse">
        <Paperclip size={13} /> Cargando adjunto...
      </span>
    );
  }
  if (esAudio) {
    return <audio controls src={url} className="h-10 max-w-xs" preload="metadata" />;
  }
  return (
    <a href={url} target="_blank" rel="noreferrer" title="Ver foto completa">
      <img src={url} alt="Adjunto de la novedad" className="h-24 w-24 object-cover rounded-xl border border-line hover:opacity-90 transition-opacity" />
    </a>
  );
}
