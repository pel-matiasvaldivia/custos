import { useState } from 'react';
import { X } from 'lucide-react';
import { vigilanteService, Vigilador } from '../../services/vigilante.service';

const campoClase =
  'w-full px-3 py-2 bg-canvas border border-line rounded-md focus:ring-2 focus:ring-brand-blue/20 outline-none text-sm';
const labelClase = 'text-xs font-medium text-muted uppercase tracking-wider';

interface Props {
  vigilador: Vigilador;
  onClose: () => void;
  onSaved: (vigilador: Vigilador) => void;
}

export const VigiladorEditForm = ({ vigilador, onClose, onSaved }: Props) => {
  const [nombre, setNombre] = useState(vigilador.nombre);
  const [apellido, setApellido] = useState(vigilador.apellido);
  const [documento, setDocumento] = useState(vigilador.documento);
  const [legajoNro, setLegajoNro] = useState(vigilador.legajo_nro);
  const [telefono, setTelefono] = useState(vigilador.telefono || '');
  const [domicilio, setDomicilio] = useState(vigilador.domicilio || '');
  const [localidad, setLocalidad] = useState(vigilador.localidad || '');
  const [provincia, setProvincia] = useState(vigilador.provincia || '');
  const [codigoPostal, setCodigoPostal] = useState(vigilador.codigo_postal || '');
  const [contactoEmergNombre, setContactoEmergNombre] = useState(vigilador.contacto_emerg_nombre || '');
  const [contactoEmergTelefono, setContactoEmergTelefono] = useState(vigilador.contacto_emerg_telefono || '');
  const [contactoEmergVinculo, setContactoEmergVinculo] = useState(vigilador.contacto_emerg_vinculo || '');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setError(null);
    try {
      const actualizado = await vigilanteService.update(vigilador.id, {
        nombre,
        apellido,
        documento,
        legajo_nro: legajoNro,
        telefono: telefono || undefined,
        domicilio: domicilio || undefined,
        localidad: localidad || undefined,
        provincia: provincia || undefined,
        codigo_postal: codigoPostal || undefined,
        contacto_emerg_nombre: contactoEmergNombre || undefined,
        contacto_emerg_telefono: contactoEmergTelefono || undefined,
        contacto_emerg_vinculo: contactoEmergVinculo || undefined,
      });
      onSaved(actualizado);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'No se pudo guardar los cambios.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-navy/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface w-full max-w-lg rounded-xl shadow-xl overflow-hidden border border-line animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-line flex justify-between items-center sticky top-0 bg-surface">
          <h3 className="text-xl font-display font-bold text-navy">Editar Ficha de Vigilador</h3>
          <button onClick={onClose} className="text-muted hover:text-navy transition-colors">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className={labelClase}>Nombre</label>
              <input className={campoClase} value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            </div>
            <div className="space-y-1">
              <label className={labelClase}>Apellido</label>
              <input className={campoClase} value={apellido} onChange={(e) => setApellido(e.target.value)} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className={labelClase}>Documento</label>
              <input className={campoClase} value={documento} onChange={(e) => setDocumento(e.target.value)} required />
            </div>
            <div className="space-y-1">
              <label className={labelClase}>Legajo</label>
              <input className={campoClase} value={legajoNro} onChange={(e) => setLegajoNro(e.target.value)} required />
            </div>
          </div>
          <div className="space-y-1">
            <label className={labelClase}>Teléfono</label>
            <input className={campoClase} value={telefono} onChange={(e) => setTelefono(e.target.value)} />
          </div>

          <div className="pt-2 border-t border-line space-y-4">
            <p className="text-xs font-medium text-muted uppercase tracking-wider">Domicilio</p>
            <div className="space-y-1">
              <label className={labelClase}>Domicilio</label>
              <input className={campoClase} value={domicilio} onChange={(e) => setDomicilio(e.target.value)} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className={labelClase}>Localidad</label>
                <input className={campoClase} value={localidad} onChange={(e) => setLocalidad(e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className={labelClase}>Provincia</label>
                <input className={campoClase} value={provincia} onChange={(e) => setProvincia(e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className={labelClase}>C.P.</label>
                <input className={campoClase} value={codigoPostal} onChange={(e) => setCodigoPostal(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-line space-y-4">
            <p className="text-xs font-medium text-muted uppercase tracking-wider">Contacto de emergencia</p>
            <div className="space-y-1">
              <label className={labelClase}>Nombre</label>
              <input
                className={campoClase}
                value={contactoEmergNombre}
                onChange={(e) => setContactoEmergNombre(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className={labelClase}>Teléfono</label>
                <input
                  className={campoClase}
                  value={contactoEmergTelefono}
                  onChange={(e) => setContactoEmergTelefono(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className={labelClase}>Vínculo</label>
                <input
                  className={campoClase}
                  value={contactoEmergVinculo}
                  onChange={(e) => setContactoEmergVinculo(e.target.value)}
                />
              </div>
            </div>
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
              {enviando ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
