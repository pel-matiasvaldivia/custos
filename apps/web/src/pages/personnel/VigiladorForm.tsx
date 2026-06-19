import { useState } from 'react';
import { Vigilador } from '../../services/vigilante.service';
import { X } from 'lucide-react';

interface VigiladorFormProps {
  onSubmit: (data: Partial<Vigilador>) => void;
  onClose: () => void;
  initialData?: Vigilador;
}

export const VigiladorForm = ({ onSubmit, onClose, initialData }: VigiladorFormProps) => {
  const [formData, setFormData] = useState<Partial<Vigilador>>(
    initialData || {
      nombre: '',
      apellido: '',
      documento: '',
      legajo_nro: '',
      estado: 'ACTIVO',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-navy/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface w-full max-w-md rounded-xl shadow-xl overflow-hidden border border-line animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-line flex justify-between items-center">
          <h3 className="text-xl font-display font-bold text-navy">
            {initialData ? 'Editar Vigilador' : 'Nuevo Vigilador'}
          </h3>
          <button onClick={onClose} className="text-muted hover:text-navy transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted uppercase tracking-wider">Nombre</label>
              <input
                required
                type="text"
                className="w-full px-3 py-2 bg-canvas border border-line rounded-md focus:ring-2 focus:ring-brand-blue/20 outline-none text-sm"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted uppercase tracking-wider">Apellido</label>
              <input
                required
                type="text"
                className="w-full px-3 py-2 bg-canvas border border-line rounded-md focus:ring-2 focus:ring-brand-blue/20 outline-none text-sm"
                value={formData.apellido}
                onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-muted uppercase tracking-wider">Documento (DNI)</label>
            <input
              required
              type="text"
              className="w-full px-3 py-2 bg-canvas border border-line rounded-md focus:ring-2 focus:ring-brand-blue/20 outline-none text-sm"
              value={formData.documento}
              onChange={(e) => setFormData({ ...formData, documento: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-muted uppercase tracking-wider">Nro. Legajo</label>
            <input
              required
              type="text"
              placeholder="Ej: V-001"
              className="w-full px-3 py-2 bg-canvas border border-line rounded-md focus:ring-2 focus:ring-brand-blue/20 outline-none text-sm font-mono"
              value={formData.legajo_nro}
              onChange={(e) => setFormData({ ...formData, legajo_nro: e.target.value })}
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-line text-muted font-medium rounded-md hover:bg-canvas transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary"
            >
              {initialData ? 'Guardar Cambios' : 'Crear Vigilador'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
