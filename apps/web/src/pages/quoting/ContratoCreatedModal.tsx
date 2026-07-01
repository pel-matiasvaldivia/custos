import { CheckCircle2, Circle, ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Contrato } from '../../services/objetivo.service';

interface Props {
  contrato: Contrato;
  onClose: () => void;
}

export const ContratoCreatedModal = ({ contrato, onClose }: Props) => {
  const navigate = useNavigate();

  const tieneFact = !!contrato.facturacion;
  const tieneDoc = !!contrato.documento_key;
  const estaActivo = contrato.estado === 'ACTIVO';
  const tieneObjetivo = !!contrato.objetivo_id;

  const pasos = [
    { label: 'Contrato generado en borrador', done: true },
    { label: 'Configurar facturación (modo, tarifa o abono)', done: tieneFact },
    { label: 'Generar documento del contrato', done: tieneDoc },
    { label: 'Activar el contrato', done: estaActivo },
    { label: 'Vincular y activar el objetivo', done: tieneObjetivo && estaActivo },
  ];

  const handleIrAlCliente = () => {
    onClose();
    if (contrato.cliente_id) navigate(`/clients/${contrato.cliente_id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-surface rounded-xl shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-line">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald/10 flex items-center justify-center">
              <CheckCircle2 size={20} className="text-emerald" />
            </div>
            <div>
              <h3 className="font-display font-bold text-navy">Cotización aceptada</h3>
              <p className="text-xs font-mono text-muted">{contrato.codigo}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted hover:text-navy transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          <p className="text-sm text-muted">
            Se generó el contrato <span className="font-mono font-semibold text-navy">{contrato.codigo}</span> en estado <strong>Borrador</strong>. Seguí estos pasos para activarlo:
          </p>

          <ol className="space-y-3">
            {pasos.map((paso, i) => (
              <li key={i} className="flex items-start gap-3">
                {paso.done ? (
                  <CheckCircle2 size={18} className="text-emerald mt-0.5 shrink-0" />
                ) : (
                  <Circle size={18} className="text-muted mt-0.5 shrink-0" />
                )}
                <span className={`text-sm ${paso.done ? 'text-muted line-through' : 'text-navy'}`}>
                  {paso.label}
                </span>
              </li>
            ))}
          </ol>

          {!tieneFact && (
            <div className="p-3 rounded-lg bg-amber/10 border border-amber/20 text-xs text-amber-800">
              El próximo paso es configurar la facturación para poder activar el contrato.
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-line">
          <button onClick={onClose} className="btn-secondary">
            Cerrar
          </button>
          {contrato.cliente_id && (
            <button onClick={handleIrAlCliente} className="btn-primary flex items-center gap-2">
              Ir al cliente <ArrowRight size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
