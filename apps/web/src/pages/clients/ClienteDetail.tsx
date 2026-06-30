import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, FileText, Plus, Pencil, Building2 } from 'lucide-react';
import { clienteService, Cliente } from '../../services/cliente.service';
import { contratoService } from '../../services/contrato.service';
import { objetivoService, Contrato, Objetivo } from '../../services/objetivo.service';
import { ClienteForm } from './ClienteForm';
import { ContratoForm } from '../objectives/ContratoForm';

export const ClienteDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [objetivos, setObjetivos] = useState<Objetivo[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalContrato, setModalContrato] = useState(false);

  const cargar = async () => {
    if (!id) return;
    const [c, cs, os] = await Promise.all([
      clienteService.getOne(id),
      contratoService.getByCliente(id),
      objetivoService.getAll(1, 200, id),
    ]);
    setCliente(c);
    setContratos(cs);
    setObjetivos(os);
  };

  useEffect(() => {
    setLoading(true);
    cargar().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const objetivoNombre = (objetivoId?: string | null) =>
    objetivos.find((o) => o.id === objetivoId)?.nombre;

  if (loading) return <div className="p-8 text-muted">Cargando cliente...</div>;
  if (!cliente) return <div className="p-8 text-amber">Cliente no encontrado.</div>;

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/clients')}
        className="text-muted hover:text-navy transition-colors flex items-center gap-2 font-medium"
      >
        <ArrowLeft size={18} /> Volver al listado
      </button>

      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-display font-bold text-navy">{cliente.razon_social}</h2>
          {cliente.nombre_fantasia && <p className="text-muted">{cliente.nombre_fantasia}</p>}
          {cliente.cuit && <p className="text-muted font-mono text-sm mt-1">CUIT: {cliente.cuit}</p>}
        </div>
        <div className="flex flex-col items-end gap-2">
          <button
            onClick={() => setModalEditar(true)}
            className="text-brand-blue hover:text-brand-deep transition-colors text-sm font-medium flex items-center gap-1"
          >
            <Pencil size={14} /> Editar ficha
          </button>
          <span className={`status-badge ${cliente.estado === 'ACTIVO' ? 'status-badge-ok' : 'status-badge-alert'}`}>
            {cliente.estado}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-display font-bold text-navy flex items-center gap-2">
                <FileText className="text-brand-blue" size={20} /> Contratos
              </h3>
              <button
                onClick={() => setModalContrato(true)}
                className="text-brand-blue hover:text-brand-deep transition-colors text-sm font-medium flex items-center gap-1"
              >
                <Plus size={16} /> Nuevo Contrato
              </button>
            </div>
            {contratos.length === 0 ? (
              <p className="text-sm text-muted py-4 text-center">
                Este cliente todavía no tiene contratos.
              </p>
            ) : (
              <div className="space-y-3">
                {contratos.map((c) => (
                  <div key={c.id} className="p-4 border border-line rounded-lg bg-canvas">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-mono font-bold text-sm text-navy">{c.codigo}</p>
                        <p className="text-xs text-muted mt-0.5">
                          {c.objetivo_id ? `Objetivo: ${objetivoNombre(c.objetivo_id) || c.objetivo_id}` : 'Sin objetivo asignado'}
                        </p>
                      </div>
                      <span className={`status-badge ${c.estado === 'ACTIVO' ? 'status-badge-ok' : 'status-badge-alert'}`}>
                        {c.estado}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-display font-bold text-navy mb-4 flex items-center gap-2">
              <Building2 className="text-brand-blue" size={18} /> Objetivos
            </h3>
            {objetivos.length === 0 ? (
              <p className="text-sm text-muted py-2 text-center">Sin objetivos para este cliente.</p>
            ) : (
              <ul className="space-y-2">
                {objetivos.map((o) => (
                  <li key={o.id} className="flex justify-between items-center text-sm py-2 border-b border-line last:border-b-0">
                    <Link to={`/objectives/${o.id}`} className="font-medium text-navy hover:text-brand-blue transition-colors">
                      {o.nombre}
                    </Link>
                    <span className="text-xs text-muted font-mono">{o.codigo}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {modalEditar && (
        <ClienteForm
          cliente={cliente}
          onClose={() => setModalEditar(false)}
          onSaved={() => {
            setModalEditar(false);
            cargar();
          }}
        />
      )}

      {modalContrato && cliente && (
        <ContratoForm
          clienteId={cliente.id}
          clienteNombre={cliente.razon_social}
          onClose={() => setModalContrato(false)}
          onCreated={() => {
            setModalContrato(false);
            cargar();
          }}
        />
      )}
    </div>
  );
};
