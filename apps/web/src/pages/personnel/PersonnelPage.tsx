import { useEffect, useState } from 'react';
import {
  vigilanteService,
  Vigilador,
  ESTADOS_SELECCIONABLES,
  estadoMeta,
} from '../../services/vigilante.service';
import { UserPlus, Search, MoreVertical, Pencil, Upload } from 'lucide-react';

const badgeClase = (badge: 'ok' | 'alert' | 'muted') =>
  badge === 'ok' ? 'status-badge-ok' : badge === 'alert' ? 'status-badge-alert' : 'status-badge';
import { VigiladorWizard } from './VigiladorWizard';
import { VigiladorEditForm } from './VigiladorEditForm';
import { ImportarVigiladoresModal } from './ImportarVigiladoresModal';
import { Link } from 'react-router-dom';

export const PersonnelPage = () => {
  const [vigiladores, setVigiladores] = useState<Vigilador[]>([]);
  const [loading, setLoading] = useState(true);
  const [wizardAbierto, setWizardAbierto] = useState(false);
  const [importarAbierto, setImportarAbierto] = useState(false);
  const [menuAbiertoId, setMenuAbiertoId] = useState<string | null>(null);
  const [vigiladorEditando, setVigiladorEditando] = useState<Vigilador | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<string>('TODOS');

  const fetchVigiladores = async () => {
    setLoading(true);
    try {
      const data = await vigilanteService.getAll();
      setVigiladores(data);
    } catch (error) {
      console.error('Error al cargar personal:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVigiladores();
  }, []);

  const vigiladoresFiltrados = vigiladores.filter((v) => {
    const coincideEstado = filtroEstado === 'TODOS' || v.estado === filtroEstado;
    const q = busqueda.trim().toLowerCase();
    const coincideBusqueda =
      q === '' ||
      `${v.nombre} ${v.apellido}`.toLowerCase().includes(q) ||
      v.legajo_nro.toLowerCase().includes(q) ||
      v.documento.toLowerCase().includes(q);
    return coincideEstado && coincideBusqueda;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-display font-bold text-navy">Personal</h2>
          <p className="text-muted">Gestión de vigiladores y credenciales.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setImportarAbierto(true)}
            className="btn-secondary flex items-center gap-2"
          >
            <Upload size={16} /> Importar
          </button>
          <button
            onClick={() => setWizardAbierto(true)}
            className="btn-primary flex items-center gap-2"
          >
            <UserPlus size={18} /> Nuevo Vigilador
          </button>
        </div>
      </div>

      {wizardAbierto && (
        <VigiladorWizard
          onClose={() => setWizardAbierto(false)}
          onCreated={() => {
            setWizardAbierto(false);
            fetchVigiladores();
          }}
        />
      )}

      {importarAbierto && (
        <ImportarVigiladoresModal
          onClose={() => setImportarAbierto(false)}
          onImportado={fetchVigiladores}
        />
      )}

      <div className="card">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre, apellido, legajo o documento..."
              className="w-full pl-10 pr-4 py-2 bg-canvas border border-line rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all text-sm"
            />
          </div>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="px-3 py-2 bg-canvas border border-line rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
          >
            <option value="TODOS">Todos los estados</option>
            {ESTADOS_SELECCIONABLES.map((e) => (
              <option key={e} value={e}>
                {estadoMeta(e).label}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-line text-muted text-sm font-medium">
                <th className="pb-3 px-4">Legajo</th>
                <th className="pb-3 px-4">Nombre Completo</th>
                <th className="pb-3 px-4">Documento</th>
                <th className="pb-3 px-4">Estado</th>
                <th className="pb-3 px-4">Ficha</th>
                <th className="pb-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {loading ? (
                <tr><td colSpan={6} className="py-8 text-center text-muted">Cargando personal...</td></tr>
              ) : vigiladoresFiltrados.length === 0 ? (
                <tr><td colSpan={6} className="py-8 text-center text-muted">No se encontraron vigiladores.</td></tr>
              ) : vigiladoresFiltrados.map((v) => (
                <tr key={v.id} className="hover:bg-canvas/50 transition-colors text-sm">
                  <td className="py-4 px-4 font-mono font-medium text-brand-blue">
                    <Link to={`/personnel/${v.id}`} className="hover:underline">{v.legajo_nro}</Link>
                  </td>
                  <td className="py-4 px-4 font-medium">{v.apellido}, {v.nombre}</td>
                  <td className="py-4 px-4 text-muted">{v.documento}</td>
                  <td className="py-4 px-4">
                    <span className={`status-badge ${badgeClase(estadoMeta(v.estado).badge)}`}>
                      {estadoMeta(v.estado).label}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`status-badge ${v.completitud === 'COMPLETO' ? 'status-badge-ok' : 'status-badge-alert'}`}>
                      {v.completitud === 'COMPLETO' ? 'Completa' : 'Incompleta'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right relative">
                    <button
                      onClick={() => setMenuAbiertoId(menuAbiertoId === v.id ? null : v.id)}
                      className="text-muted hover:text-navy transition-colors"
                    >
                      <MoreVertical size={18} />
                    </button>
                    {menuAbiertoId === v.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setMenuAbiertoId(null)} />
                        <div className="absolute right-4 top-10 z-20 bg-surface border border-line rounded-md shadow-lg py-1 w-36 text-left">
                          <button
                            onClick={() => {
                              setMenuAbiertoId(null);
                              setVigiladorEditando(v);
                            }}
                            className="w-full px-3 py-2 text-sm text-navy hover:bg-canvas transition-colors flex items-center gap-2"
                          >
                            <Pencil size={14} /> Editar
                          </button>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {vigiladorEditando && (
        <VigiladorEditForm
          vigilador={vigiladorEditando}
          onClose={() => setVigiladorEditando(null)}
          onSaved={() => {
            setVigiladorEditando(null);
            fetchVigiladores();
          }}
        />
      )}
    </div>
  );
};
