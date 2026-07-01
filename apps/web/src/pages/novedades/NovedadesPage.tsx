import { useState, useEffect } from 'react';
import { Plus, Search, Filter, MessageSquare, Clock, User, MapPin } from 'lucide-react';
import api from '../../services/api';
import { catalogoService, CatalogoItemOption } from '../../services/catalogo.service';
import { PageHint } from '../../components/common/PageHint';

export const NovedadesPage = () => {
  const [novedades, setNovedades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tiposNovedad, setTiposNovedad] = useState<CatalogoItemOption[]>([]);
  const [formData, setFormData] = useState({ tipo: 'GENERAL', prioridad: 'NORMAL', descripcion: '' });
  const [adelantoMonto, setAdelantoMonto] = useState('');
  const [adelantoCuotas, setAdelantoCuotas] = useState(1);

  const esAdelanto = formData.tipo === 'ADELANTO_SUELDO';

  const fetchData = () => {
    setLoading(true);
    api.get<{ data: any[] }>('/novedades')
      .then(res => {
        setNovedades(res.data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
    catalogoService.getItems('NOVEDAD_TIPO').then(setTiposNovedad).catch(() => {});
  }, []);

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
                <label className="label text-xs uppercase font-black">Tipo de Novedad</label>
                <select
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
                    <label className="label text-xs uppercase font-black">Monto del adelanto</label>
                    <input
                      type="number"
                      className="input"
                      placeholder="50000"
                      value={adelantoMonto}
                      onChange={e => setAdelantoMonto(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="label text-xs uppercase font-black">Devolución en cuotas</label>
                    <select className="input" value={adelantoCuotas} onChange={e => setAdelantoCuotas(Number(e.target.value))}>
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

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
          <input type="text" placeholder="Buscar por puestos o descripción..." className="input pl-10" />
        </div>
        <button className="btn btn-secondary flex items-center gap-2">
          <Filter size={18} /> Filtrar
        </button>
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
