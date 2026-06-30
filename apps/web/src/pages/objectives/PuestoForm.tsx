import { useState } from 'react';
import { X } from 'lucide-react';
import { puestoService } from '../../services/puesto.service';
import { Puesto } from '../../services/objetivo.service';

const campoClase =
  'w-full px-3 py-2 bg-canvas border border-line rounded-md focus:ring-2 focus:ring-brand-blue/20 outline-none text-sm';
const labelClase = 'text-xs font-medium text-muted uppercase tracking-wider';

interface Props {
  objetivoId: string;
  puesto?: Puesto;
  onClose: () => void;
  onCreated: () => void;
}

const coordStr = (p?: Puesto) =>
  p?.lat != null && p?.lng != null ? `${p.lat}, ${p.lng}` : '';

export const PuestoForm = ({ objetivoId, puesto, onClose, onCreated }: Props) => {
  const editando = !!puesto;
  const [nombre, setNombre] = useState(puesto?.nombre ?? '');
  const [ubicacion, setUbicacion] = useState(puesto?.ubicacion ?? '');
  const [coordenadas, setCoordenadas] = useState(coordStr(puesto));
  const [requiereArma, setRequiereArma] = useState(puesto?.requiere_arma ?? false);
  const [requiereMovil, setRequiereMovil] = useState(puesto?.requiere_movil ?? false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setError(null);
    try {
      let lat: number | undefined;
      let lng: number | undefined;
      if (coordenadas.trim()) {
        const partes = coordenadas.split(',').map((p) => parseFloat(p.trim()));
        if (partes.length !== 2 || partes.some((n) => Number.isNaN(n))) {
          setError('Las coordenadas deben tener el formato: latitud, longitud. Ej: -32.928311, -68.815628');
          setEnviando(false);
          return;
        }
        [lat, lng] = partes;
      }
      if (editando && puesto) {
        await puestoService.update(puesto.id, {
          nombre,
          ubicacion: ubicacion || undefined,
          lat,
          lng,
          requiere_arma: requiereArma,
          requiere_movil: requiereMovil,
        });
      } else {
        await puestoService.create({
          objetivo_id: objetivoId,
          nombre,
          ubicacion: ubicacion || undefined,
          lat,
          lng,
          requiere_arma: requiereArma,
          requiere_movil: requiereMovil,
        });
      }
      onCreated();
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'No se pudo guardar el puesto.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-navy/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface w-full max-w-md rounded-xl shadow-xl overflow-hidden border border-line animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-line flex justify-between items-center">
          <h3 className="text-xl font-display font-bold text-navy">
            {editando ? 'Editar Puesto' : 'Nuevo Puesto'}
          </h3>
          <button onClick={onClose} className="text-muted hover:text-navy transition-colors">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className={labelClase}>Nombre</label>
            <input className={campoClase} value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          </div>
          <div className="space-y-1">
            <label className={labelClase}>Ubicación</label>
            <input className={campoClase} value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} />
          </div>
          <div className="space-y-1">
            <label className={labelClase}>Coordenadas (mapa en vivo)</label>
            <input
              className={campoClase}
              value={coordenadas}
              onChange={(e) => setCoordenadas(e.target.value)}
              placeholder="-32.928311, -68.815628"
            />
            <p className="text-xs text-muted">Latitud, longitud separadas por coma. Opcional.</p>
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm text-navy">
              <input type="checkbox" checked={requiereArma} onChange={(e) => setRequiereArma(e.target.checked)} />
              Requiere arma
            </label>
            <label className="flex items-center gap-2 text-sm text-navy">
              <input type="checkbox" checked={requiereMovil} onChange={(e) => setRequiereMovil(e.target.checked)} />
              Requiere móvil
            </label>
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
              {enviando ? 'Guardando...' : editando ? 'Guardar cambios' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
