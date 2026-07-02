import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L, { LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Save, Building2, Info } from 'lucide-react';
import { tenantConfigService, MiTenant } from '../../services/tenantConfig.service';

const pinIcon = L.divIcon({
  className: '',
  html: `<svg width="26" height="34" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 0C6.7 0 0 6.7 0 15c0 10 15 25 15 25s15-15 15-25C30 6.7 23.3 0 15 0z" fill="#1b57d6"/>
    <circle cx="15" cy="15" r="8" fill="#ffffff"/></svg>`,
  iconSize: [26, 34],
  iconAnchor: [13, 34],
});

/**
 * Setea el domicilio de la empresa en el mapa. Con esto el mapa del Centro de
 * Operaciones arranca centrado ahí (antes caía en CABA por default).
 */
export const TenantGeoTab = () => {
  const [tenant, setTenant] = useState<MiTenant | null>(null);
  const [punto, setPunto] = useState<{ lat: number; lng: number } | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    tenantConfigService.get().then((t) => {
      setTenant(t);
      if (t.lat != null && t.lng != null) setPunto({ lat: t.lat, lng: t.lng });
    }).catch(() => {});
  }, []);

  const centro: [number, number] = useMemo(() => {
    if (punto) return [punto.lat, punto.lng];
    return [-34.6037, -58.3816];
  }, [punto]);

  const guardar = async () => {
    setGuardando(true);
    setMsg(null);
    try {
      await tenantConfigService.setGeo(punto?.lat ?? null, punto?.lng ?? null);
      setMsg('Ubicación guardada. El mapa del Centro de Operaciones ahora arranca centrado acá.');
    } catch {
      setMsg('No se pudo guardar la ubicación.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="card">
        <h3 className="text-lg font-bold text-navy flex items-center gap-2 mb-2">
          <Building2 className="text-brand-blue" size={20} /> Ubicación de la empresa
        </h3>
        {tenant?.direccion && <p className="text-sm text-muted mb-4">{tenant.direccion}</p>}

        <div className="flex items-start gap-2 mb-3 p-2 bg-brand-tint/40 border border-brand-blue/15 rounded-lg text-xs text-muted">
          <Info size={13} className="text-brand-blue shrink-0 mt-0.5" />
          Hacé click en el mapa para fijar el domicilio. El mapa del Centro de Operaciones
          va a arrancar centrado en este punto — no en un default de CABA.
        </div>

        <div className="h-96 rounded-xl overflow-hidden border border-line">
          <MapContainer center={centro} zoom={13} scrollWheelZoom className="h-full w-full">
            <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Recentrar target={centro} />
            <ClickHandler onPunto={setPunto} />
            {punto && <Marker position={[punto.lat, punto.lng]} icon={pinIcon} />}
          </MapContainer>
        </div>

        <div className="mt-3 flex items-center gap-3">
          {punto && (
            <span className="text-xs font-mono text-muted flex items-center gap-1">
              <MapPin size={13} /> {punto.lat.toFixed(6)}, {punto.lng.toFixed(6)}
            </span>
          )}
          <div className="flex-1" />
          {msg && <span className="text-xs text-emerald">{msg}</span>}
          <button
            onClick={guardar}
            disabled={guardando || !punto}
            className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white text-sm font-medium rounded-lg hover:bg-brand-deep disabled:opacity-50"
          >
            <Save size={15} /> {guardando ? 'Guardando...' : 'Guardar ubicación'}
          </button>
        </div>
      </div>
    </div>
  );
};

function ClickHandler({ onPunto }: { onPunto: (p: { lat: number; lng: number }) => void }) {
  useMapEvents({
    click(e: { latlng: LatLng }) {
      onPunto({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

function Recentrar({ target }: { target: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(target, map.getZoom());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target[0], target[1]]);
  return null;
}
