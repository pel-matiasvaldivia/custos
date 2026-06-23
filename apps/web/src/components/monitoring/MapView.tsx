import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

// Fix for default Leaflet icons in React
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const incidentIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const guardIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface MapViewProps {
  objectives: any[];
  incidents: any[];
  guards: Record<string, any>;
}

export const MapView: React.FC<MapViewProps> = ({ objectives, incidents, guards }) => {
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
          <Marker key={obj.id} position={[obj.lat, obj.lng]}>
            <Popup>
              <div className="p-2">
                <h4 className="font-bold text-navy">{obj.nombre}</h4>
                <p className="text-xs text-muted">{obj.direccion}</p>
                <div className="mt-2 text-[10px] font-black uppercase text-brand-blue tracking-widest">OBJETIVO</div>
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

        {/* Guards (Live moving) */}
        {Object.values(guards).map(guard => (
           <Marker 
            key={guard.vigilanteId} 
            position={[guard.lat, guard.lng]} 
            icon={guardIcon}
           >
             <Popup>
              <div className="p-2">
                <h4 className="font-bold text-emerald italic uppercase">UNIDAD MÓVIL</h4>
                <p className="text-xs">ID: {guard.vigilanteId.slice(0,8)}</p>
                <p className="text-[10px] text-muted">Último contacto: {new Date(guard.ts).toLocaleTimeString()}</p>
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
