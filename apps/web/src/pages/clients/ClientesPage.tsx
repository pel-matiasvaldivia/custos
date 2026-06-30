import { useEffect, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { clienteService, Cliente } from '../../services/cliente.service';
import { ClienteForm } from './ClienteForm';

export const ClientesPage = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [formAbierto, setFormAbierto] = useState(false);

  const fetchClientes = async () => {
    setLoading(true);
    try {
      const data = await clienteService.getAll();
      setClientes(data);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const filtrados = clientes.filter((c) => {
    const q = busqueda.toLowerCase();
    return (
      c.razon_social.toLowerCase().includes(q) ||
      (c.nombre_fantasia || '').toLowerCase().includes(q) ||
      (c.cuit || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-display font-bold text-navy">Clientes</h2>
          <p className="text-muted">Empresas que contratan servicio, consolidan cotizaciones, contratos y objetivos.</p>
        </div>
        <button onClick={() => setFormAbierto(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Nuevo Cliente
        </button>
      </div>

      {formAbierto && (
        <ClienteForm
          onClose={() => setFormAbierto(false)}
          onSaved={() => {
            setFormAbierto(false);
            fetchClientes();
          }}
        />
      )}

      <div className="card">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input
              type="text"
              placeholder="Buscar por razón social, fantasía o CUIT..."
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
                <th className="pb-3 px-4">Razón social</th>
                <th className="pb-3 px-4">Nombre de fantasía</th>
                <th className="pb-3 px-4">CUIT</th>
                <th className="pb-3 px-4">Contacto</th>
                <th className="pb-3 px-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {loading ? (
                <tr><td colSpan={5} className="py-8 text-center text-muted">Cargando clientes...</td></tr>
              ) : filtrados.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center text-muted">No se encontraron clientes.</td></tr>
              ) : (
                filtrados.map((c) => (
                  <tr key={c.id} className="hover:bg-canvas/50 transition-colors text-sm">
                    <td className="py-4 px-4 font-medium text-navy">{c.razon_social}</td>
                    <td className="py-4 px-4 text-muted">{c.nombre_fantasia || '—'}</td>
                    <td className="py-4 px-4 text-muted font-mono">{c.cuit || '—'}</td>
                    <td className="py-4 px-4 text-muted">
                      {c.contacto_nombre || c.contacto_telefono || c.contacto_email
                        ? [c.contacto_nombre, c.contacto_telefono].filter(Boolean).join(' · ')
                        : '—'}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`status-badge ${c.estado === 'ACTIVO' ? 'status-badge-ok' : 'status-badge-alert'}`}>
                        {c.estado}
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
