import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

// Marcadores locales (SVG en divIcon) — sin depender de CDNs externos, que el
// proxy de producción puede bloquear. Cada tipo tiene su color de la paleta.
const pin = (color: string, glyph: string, pulse = false) =>
  L.divIcon({
    className: '',
    html: `
      <div style="position:relative;width:30px;height:40px;${pulse ? 'animation:cutosPulse 1.4s ease-in-out infinite;' : ''}">
        <svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 0C6.7 0 0 6.7 0 15c0 10 15 25 15 25s15-15 15-25C30 6.7 23.3 0 15 0z" fill="${color}"/>
          <circle cx="15" cy="15" r="11" fill="#ffffff"/>
        </svg>
        <div style="position:absolute;top:5px;left:0;width:30px;height:22px;display:flex;align-items:center;justify-content:center;font-size:13px;line-height:1;">${glyph}</div>
      </div>`,
    iconSize: [30, 40],
    iconAnchor: [15, 40],
    popupAnchor: [0, -36],
  });

// keyframes para el pulso de incidentes (inyectado una vez)
if (typeof document !== 'undefined' && !document.getElementById('cutos-map-kf')) {
  const style = document.createElement('style');
  style.id = 'cutos-map-kf';
  style.textContent = '@keyframes cutosPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.18)}}';
  document.head.appendChild(style);
}

const objetivoIcon = pin('#1b57d6', '🏢');
const puestoIcon = pin('#7c3aed', '🛡️');
const guardIcon = pin('#0e9f6e', '👮');
const vehiculoIcon = pin('#e8a33d', '🚓');
const incidentIcon = pin('#ef4444', '⚠️', true);

interface MapViewProps {
  objectives: any[];
  incidents: any[];
  guards: Record<string, any>;
  puestos?: any[];
  vehiculos?: any[];
}

export const MapView: React.FC<MapViewProps> = ({ objectives, incidents, guards, puestos = [], vehiculos = [] }) => {
  const center: [number, number] = [-34.6037, -58.3816]; // Buenos Aires default

  return (
    <div className="h-full w-full rounded-[2rem] overflow-hidden border border-slate-200 shadow-inner relative">
      <MapContainer 
        center={center} 
        zoom={13} 
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Objectives */}
        {objectives.filter(o => o.lat && o.lng).map(obj => (
          <Marker key={obj.id} position={[obj.lat, obj.lng]} icon={objetivoIcon}>
            <Popup>
              <div className="p-2">
                <h4 className="font-bold text-navy">{obj.nombre}</h4>
                <p className="text-xs text-muted">{obj.direccion}</p>
                <div className="mt-2 text-[10px] font-black uppercase text-brand-blue tracking-widest">OBJETIVO</div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Puestos */}
        {puestos.filter(p => p.lat && p.lng).map(p => (
          <Marker key={p.id} position={[p.lat, p.lng]} icon={puestoIcon}>
            <Popup>
              <div className="p-2">
                <h4 className="font-bold text-navy">{p.nombre}</h4>
                {p.ubicacion && <p className="text-xs text-muted">{p.ubicacion}</p>}
                <div className="mt-2 text-[10px] font-black uppercase text-purple-600 tracking-widest">PUESTO</div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Incidents (Live pulsing) */}
        {incidents.filter(inc => inc.objetivo?.lat).map(inc => (
          <Marker 
            key={inc.id} 
            position={[inc.objetivo.lat, inc.objetivo.lng]} 
            icon={incidentIcon}
          >
            <Popup>
              <div className="p-2">
                <h4 className="font-bold text-red-600 uppercase italic">⚠️ {inc.tipo}</h4>
                <p className="text-xs">{inc.resumen}</p>
                <div className="mt-2 text-[10px] font-black uppercase text-red-500 tracking-widest animate-pulse">INCIDENTE ACTIVO</div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Guards (Live moving) — guardias en funciones con dispositivo móvil */}
        {Object.values(guards).map(guard => (
           <Marker
            key={guard.vigilanteId}
            position={[guard.lat, guard.lng]}
            icon={guardIcon}
           >
             <Popup>
              <div className="p-2">
                <h4 className="font-bold text-emerald italic uppercase">GUARDIA EN FUNCIONES</h4>
                <p className="text-xs">{guard.nombre || `ID: ${guard.vigilanteId.slice(0,8)}`}</p>
                <p className="text-[10px] text-muted">Último contacto: {guard.ts ? new Date(guard.ts).toLocaleTimeString() : '—'}</p>
              </div>
             </Popup>
           </Marker>
        ))}

        {/* Vehículos con supervisor en funciones */}
        {vehiculos.filter(v => v.lat && v.lng).map(v => (
          <Marker key={v.id} position={[Number(v.lat), Number(v.lng)]} icon={vehiculoIcon}>
            <Popup>
              <div className="p-2">
                <h4 className="font-bold text-amber italic uppercase">MÓVIL / SUPERVISOR</h4>
                <p className="text-xs text-navy">{v.patente || v.dominio || v.nombre}</p>
                {v.supervisor && <p className="text-[11px] text-muted">Supervisor: {v.supervisor}</p>}
                {v.marca && <p className="text-[10px] text-muted">{v.marca} {v.modelo}</p>}
              </div>
            </Popup>
          </Marker>
        ))}

        <AutoCenter incidents={incidents} />
      </MapContainer>
    </div>
  );
};

// Component to auto-center map when a new critical incident occurs
function AutoCenter({ incidents }: { incidents: any[] }) {
    const map = useMap();
    useEffect(() => {
        const critical = incidents.find(inc => inc.severidad === 'CRITICA' && inc.objetivo?.lat);
        if (critical) {
            map.setView([critical.objetivo.lat, critical.objetivo.lng], 16);
        }
    }, [incidents, map]);
    return null;
}
