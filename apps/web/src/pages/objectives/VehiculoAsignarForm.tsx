import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { vehiculoService } from '../../services/vehiculo.service';
import { objetivoService, Vehiculo } from '../../services/objetivo.service';

const campoClase =
  'w-full px-3 py-2 bg-canvas border border-line rounded-md focus:ring-2 focus:ring-brand-blue/20 outline-none text-sm';
const labelClase = 'text-xs font-medium text-muted uppercase tracking-wider';

interface Props {
  objetivoId: string;
  onClose: () => void;
  onAsignado: () => void;
}

export const VehiculoAsignarForm = ({ objetivoId, onClose, onAsignado }: Props) => {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [modoNuevo, setModoNuevo] = useState(false);
  const [vehiculoId, setVehiculoId] = useState('');
  const [patente, setPatente] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [costoHora, setCostoHora] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    vehiculoService.getDisponibles().then((data) => {
      setVehiculos(data);
      if (data.length > 0) setVehiculoId(data[0].id);
      else setModoNuevo(true);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setError(null);
    try {
      let id = vehiculoId;
      if (modoNuevo) {
        const creado = await vehiculoService.create({
          patente,
          marca: marca || undefined,
          modelo: modelo || undefined,
          costo_hora: costoHora ? Number(costoHora) : undefined,
        });
        id = creado.id;
      }
      await objetivoService.asignarVehiculo(objetivoId, id);
      onAsignado();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'No se pudo asignar el vehículo.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-navy/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface w-full max-w-md rounded-xl shadow-xl overflow-hidden border border-line animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-line flex justify-between items-center">
          <h3 className="text-xl font-display font-bold text-navy">Asignar Vehículo</h3>
          <button onClick={onClose} className="text-muted hover:text-navy transition-colors">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {!modoNuevo && vehiculos.length > 0 ? (
            <div className="space-y-1">
              <label className={labelClase}>Vehículo disponible</label>
              <select className={campoClase} value={vehiculoId} onChange={(e) => setVehiculoId(e.target.value)}>
                {vehiculos.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.patente} {v.marca ? `· ${v.marca} ${v.modelo || ''}` : ''}
                    {v.costo_hora ? ` · $${v.costo_hora}/h` : ''}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted">Solo se listan vehículos operativos sin asignación activa.</p>
              <button
                type="button"
                onClick={() => setModoNuevo(true)}
                className="text-brand-blue hover:text-brand-deep text-xs font-medium"
              >
                + Cargar un vehículo nuevo
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-1">
                <label className={labelClase}>Patente</label>
                <input className={campoClase} value={patente} onChange={(e) => setPatente(e.target.value)} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className={labelClase}>Marca</label>
                  <input className={campoClase} value={marca} onChange={(e) => setMarca(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className={labelClase}>Modelo</label>
                  <input className={campoClase} value={modelo} onChange={(e) => setModelo(e.target.value)} />
                </div>
              </div>
              <div className="space-y-1">
                <label className={labelClase}>Costo por hora</label>
                <input
                  type="number"
                  className={campoClase}
                  value={costoHora}
                  onChange={(e) => setCostoHora(e.target.value)}
                  placeholder="Para estimar el costo de operación"
                />
              </div>
              {vehiculos.length > 0 && (
                <button
                  type="button"
                  onClick={() => setModoNuevo(false)}
                  className="text-brand-blue hover:text-brand-deep text-xs font-medium"
                >
                  Usar un vehículo existente
                </button>
              )}
            </>
          )}

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
              {enviando ? 'Guardando...' : 'Asignar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
