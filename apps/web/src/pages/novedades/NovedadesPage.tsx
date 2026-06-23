import { useState, useEffect } from 'react';
import { Plus, Search, Filter, MessageSquare, Clock, User, MapPin } from 'lucide-react';

export const NovedadesPage = () => {
  const [novedades, setNovedades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/novedades')
      .then(res => res.json())
      .then(data => {
        setNovedades(data);
        setLoading(false);
      });
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICA': return 'bg-red-500 text-white ring-red-200';
      case 'ALTA': return 'bg-amber text-navy ring-amber/20';
      default: return 'bg-brand-blue text-surface ring-brand-blue/20';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-display font-bold text-navy">Novedades del Servicio</h2>
          <p className="text-muted text-lg">Reportes e incidencias en tiempo real desde los puestos.</p>
        </div>
        <button className="btn btn-primary flex items-center gap-2">
          <Plus size={20} />
          Reportar Novedad
        </button>
      </div>

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
