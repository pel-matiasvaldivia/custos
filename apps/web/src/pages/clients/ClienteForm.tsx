import { useState } from 'react';
import { X } from 'lucide-react';
import { clienteService, Cliente } from '../../services/cliente.service';

const campoClase =
  'w-full px-3 py-2 bg-canvas border border-line rounded-md focus:ring-2 focus:ring-brand-blue/20 outline-none text-sm';
const labelClase = 'text-xs font-medium text-muted uppercase tracking-wider';

interface Props {
  cliente?: Cliente;
  onClose: () => void;
  onSaved: () => void;
}

export const ClienteForm = ({ cliente, onClose, onSaved }: Props) => {
  const [razonSocial, setRazonSocial] = useState(cliente?.razon_social ?? '');
  const [nombreFantasia, setNombreFantasia] = useState(cliente?.nombre_fantasia ?? '');
  const [cuit, setCuit] = useState(cliente?.cuit ?? '');
  const [domicilio, setDomicilio] = useState(cliente?.domicilio ?? '');
  const [contactoNombre, setContactoNombre] = useState(cliente?.contacto_nombre ?? '');
  const [contactoEmail, setContactoEmail] = useState(cliente?.contacto_email ?? '');
  const [contactoTelefono, setContactoTelefono] = useState(cliente?.contacto_telefono ?? '');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setError(null);
    try {
      const data = {
        razon_social: razonSocial,
        nombre_fantasia: nombreFantasia || undefined,
        cuit: cuit || undefined,
        domicilio: domicilio || undefined,
        contacto_nombre: contactoNombre || undefined,
        contacto_email: contactoEmail || undefined,
        contacto_telefono: contactoTelefono || undefined,
      };
      if (cliente) {
        await clienteService.update(cliente.id, data);
      } else {
        await clienteService.create(data);
      }
      onSaved();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'No se pudo guardar el cliente.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-navy/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface w-full max-w-md rounded-xl shadow-xl overflow-hidden border border-line animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-line flex justify-between items-center">
          <h3 className="text-xl font-display font-bold text-navy">{cliente ? 'Editar Cliente' : 'Nuevo Cliente'}</h3>
          <button onClick={onClose} className="text-muted hover:text-navy transition-colors">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className={labelClase}>Razón social</label>
            <input className={campoClase} value={razonSocial} onChange={(e) => setRazonSocial(e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className={labelClase}>Nombre de fantasía</label>
              <input className={campoClase} value={nombreFantasia} onChange={(e) => setNombreFantasia(e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className={labelClase}>CUIT</label>
              <input className={campoClase} value={cuit} onChange={(e) => setCuit(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1">
            <label className={labelClase}>Domicilio</label>
            <input className={campoClase} value={domicilio} onChange={(e) => setDomicilio(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className={labelClase}>Contacto</label>
              <input className={campoClase} value={contactoNombre} onChange={(e) => setContactoNombre(e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className={labelClase}>Teléfono</label>
              <input className={campoClase} value={contactoTelefono} onChange={(e) => setContactoTelefono(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1">
            <label className={labelClase}>Email de contacto</label>
            <input type="email" className={campoClase} value={contactoEmail} onChange={(e) => setContactoEmail(e.target.value)} />
          </div>

          {error && (
            <div className="p-3 bg-amber/10 border border-amber/30 rounded-md text-sm text-amber">{error}</div>
          )}

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-line text-muted font-medium rounded-md hover:bg-canvas transition-colors"
            >
              Cancelar
            </button>
            <button type="submit" className="flex-1 btn-primary" disabled={enviando}>
              {enviando ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
