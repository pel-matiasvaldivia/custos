import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, MapPin } from 'lucide-react';
import { objetivoService, Objetivo } from '../../services/objetivo.service';
import { ObjetivoForm } from './ObjetivoForm';
import { PageHint } from '../../components/common/PageHint';

export const ObjetivosPage = () => {
  const [objetivos, setObjetivos] = useState<Objetivo[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [formAbierto, setFormAbierto] = useState(false);

  const fetchObjetivos = async () => {
    setLoading(true);
    try {
      const data = await objetivoService.getAll();
      setObjetivos(data);
    } catch (error) {
      console.error('Error al cargar objetivos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchObjetivos();
  }, []);

  const filtrados = objetivos.filter((o) => {
    const q = busqueda.toLowerCase();
    return (
      o.nombre.toLowerCase().includes(q) ||
      o.cliente_nombre.toLowerCase().includes(q) ||
      o.codigo.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <PageHint id="objetivos" title="Los lugares que cubrís">
        Un objetivo es el sitio a vigilar (barrio, fábrica, local). Creá el objetivo, cargale sus puestos y
        desde el detalle armás el cuadrante afectando vigiladores a cada puesto.
      </PageHint>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-display font-bold text-navy">Objetivos</h2>
          <p className="text-muted">Ubicaciones físicas y recursos asociados: personal, vehículos, herramientas y contrato.</p>
        </div>
        <button onClick={() => setFormAbierto(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Nuevo Objetivo
        </button>
      </div>

      {formAbierto && (
        <ObjetivoForm
          onClose={() => setFormAbierto(false)}
          onSaved={() => {
            setFormAbierto(false);
            fetchObjetivos();
          }}
        />
      )}

      <div className="card">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input
              type="text"
              placeholder="Buscar por nombre, cliente o código..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-canvas border border-line rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-line text-muted text-sm font-medium">
                <th className="pb-3 px-4">Código</th>
                <th className="pb-3 px-4">Sitio</th>
                <th className="pb-3 px-4">Cliente</th>
                <th className="pb-3 px-4">Dirección</th>
                <th className="pb-3 px-4">Puestos</th>
                <th className="pb-3 px-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {loading ? (
                <tr><td colSpan={6} className="py-8 text-center text-muted">Cargando objetivos...</td></tr>
              ) : filtrados.length === 0 ? (
                <tr><td colSpan={6} className="py-8 text-center text-muted">No se encontraron objetivos.</td></tr>
              ) : (
                filtrados.map((o) => (
                  <tr key={o.id} className="hover:bg-canvas/50 transition-colors text-sm">
                    <td className="py-4 px-4 font-mono font-medium text-brand-blue">
                      <Link to={`/objectives/${o.id}`} className="hover:underline">{o.codigo}</Link>
                    </td>
                    <td className="py-4 px-4 font-medium text-navy">{o.nombre}</td>
                    <td className="py-4 px-4 text-muted">{o.cliente_nombre}</td>
                    <td className="py-4 px-4 text-muted flex items-center gap-1">
                      {o.direccion && <MapPin size={14} className="shrink-0" />} {o.direccion || '—'}
                    </td>
                    <td className="py-4 px-4 text-muted">{o._count?.puestos ?? 0}</td>
                    <td className="py-4 px-4">
                      <span className={`status-badge ${o.estado === 'ACTIVO' ? 'status-badge-ok' : 'status-badge-alert'}`}>
                        {o.estado}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
