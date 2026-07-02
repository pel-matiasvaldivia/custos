import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, Polygon, useMap } from 'react-leaflet';
import L, { LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Save, Undo2, Trash2, Info } from 'lucide-react';
import { objetivoService } from '../../services/objetivo.service';

const pinIcon = L.divIcon({
  className: '',
  html: `<svg width="26" height="34" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 0C6.7 0 0 6.7 0 15c0 10 15 25 15 25s15-15 15-25C30 6.7 23.3 0 15 0z" fill="#1b57d6"/>
    <circle cx="15" cy="15" r="8" fill="#ffffff"/></svg>`,
  iconSize: [26, 34],
  iconAnchor: [13, 34],
});

interface Props {
  objetivoId: string;
  lat?: number | null;
  lng?: number | null;
  area?: Array<{ lat: number; lng: number }> | null;
  direccion?: string | null;
  onSaved: () => void;
}

/**
 * Editor de geoposición y área de cobertura del objetivo.
 * - Click en el mapa (modo "punto"): fija la ubicación del objetivo.
 * - Click en el mapa (modo "área"): agrega un vértice al polígono. El botón
 *   "Deshacer" quita el último; "Limpiar" borra el polígono.
 */
export const GeoObjetivoSection = ({ objetivoId, lat, lng, area, direccion, onSaved }: Props) => {
  const [modo, setModo] = useState<'punto' | 'area'>('punto');
  const [punto, setPunto] = useState<{ lat: number; lng: number } | null>(
    lat != null && lng != null ? { lat, lng } : null,
  );
  const [poligono, setPoligono] = useState<Array<{ lat: number; lng: number }>>(area ?? []);
  const [guardando, setGuardando] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (lat != null && lng != null) setPunto({ lat, lng });
    if (area) setPoligono(area);
  }, [lat, lng, area]);

  // Centro del mapa: el punto si está, si no un default (obelisco).
  const centro: [number, number] = useMemo(() => {
    if (punto) return [punto.lat, punto.lng];
    if (poligono.length > 0) return [poligono[0].lat, poligono[0].lng];
    return [-34.6037, -58.3816];
  }, [punto, poligono]);

  const guardar = async () => {
    setGuardando(true);
    setMsg(null);
    try {
      await objetivoService.setGeo(objetivoId, {
        lat: punto?.lat ?? null,
        lng: punto?.lng ?? null,
        area_cobertura: poligono.length >= 3 ? poligono : null,
      });
      setMsg('Geoposición actualizada.');
      onSaved();
    } catch {
      setMsg('No se pudo guardar.');
    } finally {
      setGuardando(false);
    }
  };

  // Se puede guardar si hay algo nuevo o si se está limpiando el polígono existente.
  const puedeGuardar =
    punto !== null ||
    (poligono.length >= 3) ||
    (poligono.length === 0 && Array.isArray(area) && area.length > 0);

  return (
    <div className="card">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-display font-bold text-navy flex items-center gap-2">
            <MapPin className="text-brand-blue" size={20} /> Geoposición y área de cobertura
          </h3>
          {direccion && <p className="text-xs text-muted">{direccion}</p>}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setModo('punto')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium ${modo === 'punto' ? 'bg-brand-blue text-white' : 'bg-canvas border border-line text-muted'}`}
          >
            Ubicación
          </button>
          <button
            onClick={() => setModo('area')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium ${modo === 'area' ? 'bg-brand-blue text-white' : 'bg-canvas border border-line text-muted'}`}
          >
            Área de cobertura
          </button>
        </div>
      </div>

      <div className="flex items-start gap-2 mb-3 p-2 bg-brand-tint/40 border border-brand-blue/15 rounded-lg text-xs text-muted">
        <Info size={13} className="text-brand-blue shrink-0 mt-0.5" />
        {modo === 'punto'
          ? 'Hacé click en el mapa para fijar la ubicación exacta del objetivo.'
          : `Hacé click en el mapa para agregar vértices al polígono (${poligono.length} vértices — mínimo 3).`}
      </div>

      <div className="h-80 rounded-xl overflow-hidden border border-line">
        <MapContainer center={centro} zoom={16} scrollWheelZoom className="h-full w-full">
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <RecentrarSi target={centro} />
          <ClickHandler
            modo={modo}
            onPunto={(p) => setPunto(p)}
            onVertice={(v) => setPoligono((prev) => [...prev, v])}
          />
          {punto && <Marker position={[punto.lat, punto.lng]} icon={pinIcon} />}
          {poligono.length >= 2 && (
            <Polygon
              positions={poligono.map((p) => [p.lat, p.lng] as [number, number])}
              pathOptions={{ color: '#1b57d6', fillColor: '#1b57d6', fillOpacity: 0.15, weight: 2 }}
            />
          )}
        </MapContainer>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {modo === 'area' && (
          <>
            <button
              onClick={() => setPoligono((prev) => prev.slice(0, -1))}
              disabled={poligono.length === 0}
              className="text-xs flex items-center gap-1 px-3 py-1.5 border border-line rounded-lg text-muted hover:bg-canvas disabled:opacity-40"
            >
              <Undo2 size={13} /> Deshacer último
            </button>
            <button
              onClick={() => setPoligono([])}
              disabled={poligono.length === 0}
              className="text-xs flex items-center gap-1 px-3 py-1.5 border border-line rounded-lg text-red-500 hover:bg-red-50 disabled:opacity-40"
            >
              <Trash2 size={13} /> Limpiar polígono
            </button>
          </>
        )}
        {modo === 'punto' && punto && (
          <span className="text-xs font-mono text-muted">
            {punto.lat.toFixed(6)}, {punto.lng.toFixed(6)}
          </span>
        )}
        <div className="flex-1" />
        {msg && <span className="text-xs text-emerald">{msg}</span>}
        <button
          onClick={guardar}
          disabled={guardando || !puedeGuardar}
          className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white text-sm font-medium rounded-lg hover:bg-brand-deep disabled:opacity-50"
        >
          <Save size={15} /> {guardando ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </div>
  );
};

function ClickHandler({
  modo,
  onPunto,
  onVertice,
}: {
  modo: 'punto' | 'area';
  onPunto: (p: { lat: number; lng: number }) => void;
  onVertice: (v: { lat: number; lng: number }) => void;
}) {
  useMapEvents({
    click(e: { latlng: LatLng }) {
      const { lat, lng } = e.latlng;
      if (modo === 'punto') onPunto({ lat, lng });
      else onVertice({ lat, lng });
    },
  });
  return null;
}

// Recentra el mapa cuando cambia el punto (solo al cargar/setear inicialmente).
function RecentrarSi({ target }: { target: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(target, map.getZoom());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target[0], target[1]]);
  return null;
}
