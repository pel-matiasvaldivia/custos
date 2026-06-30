import { useEffect, useState } from 'react';
import { vigilanteService, Vigilador } from '../../services/vigilante.service';
import { UserPlus, Search, MoreVertical } from 'lucide-react';
import { VigiladorWizard } from './VigiladorWizard';
import { Link } from 'react-router-dom';

export const PersonnelPage = () => {
  const [vigiladores, setVigiladores] = useState<Vigilador[]>([]);
  const [loading, setLoading] = useState(true);
  const [wizardAbierto, setWizardAbierto] = useState(false);

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-display font-bold text-navy">Personal</h2>
          <p className="text-muted">Gestión de vigiladores y credenciales.</p>
        </div>
        <button
          onClick={() => setWizardAbierto(true)}
          className="btn-primary flex items-center gap-2"
        >
          <UserPlus size={18} /> Nuevo Vigilador
        </button>
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

      <div className="card">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nombre, apellido o legajo..."
              className="w-full pl-10 pr-4 py-2 bg-canvas border border-line rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all text-sm"
            />
          </div>
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
              ) : vigiladores.length === 0 ? (
                <tr><td colSpan={6} className="py-8 text-center text-muted">No se encontraron vigiladores.</td></tr>
              ) : vigiladores.map((v) => (
                <tr key={v.id} className="hover:bg-canvas/50 transition-colors text-sm">
                  <td className="py-4 px-4 font-mono font-medium text-brand-blue">
                    <Link to={`/personnel/${v.id}`} className="hover:underline">{v.legajo_nro}</Link>
                  </td>
                  <td className="py-4 px-4 font-medium">{v.apellido}, {v.nombre}</td>
                  <td className="py-4 px-4 text-muted">{v.documento}</td>
                  <td className="py-4 px-4">
                    <span className={`status-badge ${v.estado === 'ACTIVO' ? 'status-badge-ok' : 'status-badge-alert'}`}>
                      {v.estado}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`status-badge ${v.completitud === 'COMPLETO' ? 'status-badge-ok' : 'status-badge-alert'}`}>
                      {v.completitud === 'COMPLETO' ? 'Completa' : 'Incompleta'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button className="text-muted hover:text-navy transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
