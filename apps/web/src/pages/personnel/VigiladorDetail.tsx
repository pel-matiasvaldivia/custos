import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { vigilanteService, Vigilador } from '../../services/vigilante.service';
import { ArrowLeft, Plus, AlertCircle, FileCheck } from 'lucide-react';

export const VigiladorDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vigilador, setVigilador] = useState<Vigilador | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      vigilanteService.getOne(id)
        .then(setVigilador)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div className="p-8 text-muted">Cargando detalles...</div>;
  if (!vigilador) return <div className="p-8 text-amber">Vigilador no encontrado.</div>;

  return (
    <div className="space-y-6">
      <button 
        onClick={() => navigate('/personnel')}
        className="text-muted hover:text-navy transition-colors flex items-center gap-2 font-medium"
      >
        <ArrowLeft size={18} /> Volver al listado
      </button>

      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-display font-bold text-navy">
            {vigilador.apellido}, {vigilador.nombre}
          </h2>
          <p className="text-muted flex items-center gap-2">
            Legajo: <span className="font-mono font-bold text-navy">{vigilador.legajo_nro}</span> • DNI: {vigilador.documento}
          </p>
        </div>
        <span className={`status-badge ${vigilador.estado === 'ACTIVO' ? 'status-badge-ok' : 'status-badge-alert'}`}>
          {vigilador.estado}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-display font-bold text-navy flex items-center gap-2">
                <FileCheck className="text-brand-blue" size={20} /> Credenciales y Documentación
              </h3>
              <button className="text-brand-blue hover:text-brand-deep transition-colors text-sm font-medium flex items-center gap-1">
                <Plus size={16} /> Agregar Credencial
              </button>
            </div>

            <div className="space-y-3">
              {/* This will be populated by credentials */}
              <div className="p-4 bg-canvas border border-line rounded-lg flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-tint flex items-center justify-center text-brand-blue">
                    <FileCheck size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-navy uppercase tracking-tight">ANMAC</h4>
                    <p className="text-xs text-muted">Vencimiento: 12/12/2026</p>
                  </div>
                </div>
                <span className="status-badge status-badge-ok">Vigente</span>
              </div>

              <div className="p-4 bg-amber/5 border border-amber/20 rounded-lg flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber/10 flex items-center justify-center text-amber">
                    <AlertCircle size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-navy uppercase tracking-tight">PSICOFÍSICO</h4>
                    <p className="text-xs text-muted">Vencimiento: 15/07/2026</p>
                  </div>
                </div>
                <span className="status-badge status-badge-alert">Por Vencer</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card h-full">
            <h3 className="text-lg font-display font-bold text-navy mb-4">Notas y Alertas</h3>
            <div className="p-3 bg-brand-tint border border-brand-blue/20 rounded-lg text-sm text-brand-deep">
              <p className="font-medium flex items-center gap-2">
                <AlertCircle size={16} /> Documentación próxima a vencer
              </p>
              <p className="mt-1 text-xs opacity-80">
                El vigilador tiene el psicofísico por vencer en menos de 30 días.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
