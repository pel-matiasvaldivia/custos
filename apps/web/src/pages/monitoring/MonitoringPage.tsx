import { useState, useEffect } from 'react';
import { 
  Shield, 
  AlertCircle, 
  Radar, 
  Activity, 
  Clock, 
  ChevronRight, 
  UserCheck, 
  Search,
  Building2,
  Box,
  Eye,
  MoreVertical,
  LayoutGrid,
  Map as MapIcon
} from 'lucide-react';
import { useSocket } from '../../hooks/useSocket';
import { VideoPlayer } from './VideoPlayer';
import { MapView } from '../../components/monitoring/MapView';
import { ProtocoloIncidenteModal } from './ProtocoloIncidenteModal';
import api from '../../services/api';
import { puestoService } from '../../services/puesto.service';
import { objetivoService } from '../../services/objetivo.service';
import { vehiculoService } from '../../services/vehiculo.service';
import { tenantConfigService } from '../../services/tenantConfig.service';
import { useAuth } from '../../context/AuthContext';

type TabIncidentes = 'PENDIENTES' | 'EN_ATENCION' | 'VERIFICANDO' | 'CERRADOS';

export const MonitoringPage = () => {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState<any[]>([]);
  const [closedIncidents, setClosedIncidents] = useState<any[]>([]);
  const [tab, setTab] = useState<TabIncidentes>('PENDIENTES');
  const [events, setEvents] = useState<any[]>([]);
  const [guards, setGuards] = useState<Record<string, any>>({});
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [activeVideo, setActiveVideo] = useState<any | null>(null);
  const [protocoloId, setProtocoloId] = useState<string | null>(null);
  const [devices, setDevices] = useState<any[]>([]);
  const [puestos, setPuestos] = useState<any[]>([]);
  const [objetivos, setObjetivos] = useState<any[]>([]);
  const [vehiculos, setVehiculos] = useState<any[]>([]);
  // Centro por defecto del mapa: domicilio del tenant (o el default de MapView).
  const [defaultCenter, setDefaultCenter] = useState<[number, number] | null>(null);
  // Búsqueda de objetivo y objetivo enfocado (para "volar" en el mapa).
  const [busqueda, setBusqueda] = useState('');
  const [focus, setFocus] = useState<{ lat: number; lng: number } | null>(null);
  const { isConnected, on } = useSocket('co', user?.tenantId);

  useEffect(() => {
    fetchActiveIncidents();
    fetchDevices();
    fetchPuestos();
    objetivoService.getAll(1, 200).then(setObjetivos).catch(() => {});
    vehiculoService.getAll(1, 200).then(setVehiculos).catch(() => {});
    tenantConfigService.get()
      .then((t) => { if (t.lat != null && t.lng != null) setDefaultCenter([t.lat, t.lng]); })
      .catch(() => {});
  }, []);

  const fetchDevices = async () => {
    try {
      const res = await api.get('/centro-operaciones/dispositivos');
      setDevices(res.data);
    } catch (err) {
      console.error('Error fetching devices', err);
    }
  };

  const fetchPuestos = async () => {
    try {
      const data = await puestoService.findAll();
      setPuestos(data);
    } catch (err) {
      console.error('Error fetching puestos', err);
    }
  };

  const fetchActiveIncidents = async () => {
    try {
      const res = await api.get('/centro-operaciones/incidentes/activos');
      setIncidents(res.data);
    } catch (err) {
      console.error('Error fetching incidents', err);
    }
  };

  const fetchClosedIncidents = async () => {
    try {
      const res = await api.get('/centro-operaciones/incidentes/cerrados');
      setClosedIncidents(res.data);
    } catch (err) {
      console.error('Error fetching closed incidents', err);
    }
  };

  // Los cerrados se cargan al entrar a la pestaña (no en cada render).
  useEffect(() => {
    if (tab === 'CERRADOS') fetchClosedIncidents();
  }, [tab]);

  // Listen for real-time events
  on('event.new', (event: any) => {
    setEvents(prev => [event, ...prev.slice(0, 49)]); // Keep last 50
  });

  // Ronda cerrada como INCOMPLETA (tolerancia vencida / fin de turno):
  // entra al stream de eventos con severidad ALTA.
  on('ronda.alerta', (data: {
    ts?: string;
    motivo?: string;
    ronda_nombre?: string;
    vigilador_nombre?: string;
    puesto_nombre?: string;
  }) => {
    setEvents(prev => [
      {
        ts_evento: data.ts ?? new Date().toISOString(),
        severidad: 'ALTA',
        tipo: data.motivo === 'TOLERANCIA_VENCIDA' ? 'RONDA VENCIDA' : 'RONDA INCOMPLETA',
        objetivo: { nombre: `${data.ronda_nombre} · ${data.vigilador_nombre}` },
        origen: 'RONDAS',
        zona_id: data.puesto_nombre,
        dispositivo_id: '',
      },
      ...prev.slice(0, 49),
    ]);
  });

  on('incident.new', (incident: any) => {
    setIncidents(prev => [incident, ...prev]);
    // Auto-verify if CRITICAL
    if (incident.severidad === 'CRITICA') {
      setActiveVideo({
        id: incident.id,
        title: `Verificación: ${incident.tipo} - ${incident.objetivo?.nombre || 'ALERTA'}`,
        streamUrl: '' // fetched on demand
      });
    }
  });

  on('incident.updated', (updated: any) => {
    setIncidents(prev => prev.map(inc => inc.id === updated.id ? { ...inc, ...updated } : inc));
  });

  on('incident.resolved', (resolved: any) => {
    setIncidents(prev => prev.filter(inc => inc.id !== resolved.id));
    // Si el operador está mirando "Cerrados", que el incidente aparezca ahí ya.
    fetchClosedIncidents();
  });

  // Novedad cargada desde el móvil: entra al stream con su prioridad.
  on('novedad.new', (data: any) => {
    setEvents(prev => [
      {
        ts_evento: data.ts ?? new Date().toISOString(),
        severidad: data.prioridad === 'CRITICA' ? 'CRITICA' : data.prioridad === 'ALTA' ? 'ALTA' : 'INFO',
        tipo: `NOVEDAD ${data.tipo ?? ''}`.trim(),
        objetivo: { nombre: data.vigilador_nombre || 'Vigilador' },
        origen: 'MÓVIL',
        zona_id: data.puesto_nombre,
        dispositivo_id: '',
      },
      ...prev.slice(0, 49),
    ]);
  });

  // Inicio de ronda desde el móvil.
  on('ronda.start', (data: any) => {
    setEvents(prev => [
      {
        ts_evento: data.ts ?? new Date().toISOString(),
        severidad: 'INFO',
        tipo: 'RONDA INICIADA',
        objetivo: { nombre: `${data.ronda_nombre ?? 'Ronda'} · ${data.vigilador_nombre ?? ''}` },
        origen: 'RONDAS',
        zona_id: null,
        dispositivo_id: '',
      },
      ...prev.slice(0, 49),
    ]);
  });

  // Escaneo de QR/NFC de un punto de control durante la ronda.
  on('ronda.checkpoint', (data: any) => {
    const progreso = data.ronda ? ` (${data.ronda.marcados}/${data.ronda.total})` : '';
    setEvents(prev => [
      {
        ts_evento: data.ts ?? new Date().toISOString(),
        severidad: 'INFO',
        tipo: data.ronda?.completada ? 'RONDA COMPLETADA' : `PUNTO ESCANEADO${progreso}`,
        objetivo: { nombre: `${data.punto_nombre ?? 'Punto'} · ${data.vigilador_nombre ?? ''}` },
        origen: 'RONDAS',
        zona_id: data.puesto_nombre,
        dispositivo_id: '',
      },
      ...prev.slice(0, 49),
    ]);
  });

  on('vigilante.location', (data: any) => {
    // Clave por vigilador; si el dispositivo aún no se identificó, cae bajo su
    // objetivo para no pisar a otros dispositivos sin identificar.
    const key = data.vigiladorId ?? `obj:${data.objetivoId}`;
    setGuards(prev => ({
      ...prev,
      [key]: data,
    }));
  });

  // Abrir el protocolo guiado del incidente (tomar → verificar → despachar → cerrar).
  const abrirProtocolo = (id: string) => setProtocoloId(id);

  return (
    <div className="space-y-8 font-display bg-canvas min-h-screen">
      {/* Header SOC */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg">
              <Radar size={22} className="text-brand-blue animate-pulse" />
            </div>
            <h2 className="text-4xl font-black text-navy tracking-tighter uppercase italic">
              SOC <span className="text-brand-blue">Console</span>
            </h2>
          </div>
          <div className="flex items-center gap-3 text-muted ml-1">
            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${isConnected ? 'bg-emerald/10 text-emerald' : 'bg-red-500/10 text-red-500'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald animate-pulse' : 'bg-red-500'}`} />
              {isConnected ? 'Sistema en Vivo' : 'Desconectado'}
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Presencia: Central Operativa</span>
          </div>
        </div>
        
        <div className="flex gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar objetivo por nombre, código o dirección..."
              className="bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-blue/10 w-72 transition-all"
            />
            {busqueda.trim() && (
              <div className="absolute top-full left-0 mt-1 w-72 max-h-64 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-lg z-30">
                {objetivos
                  .filter((o) => {
                    const q = busqueda.toLowerCase();
                    return (
                      (o.nombre || '').toLowerCase().includes(q) ||
                      (o.codigo || '').toLowerCase().includes(q) ||
                      (o.direccion || '').toLowerCase().includes(q)
                    );
                  })
                  .slice(0, 15)
                  .map((o) => (
                    <button
                      key={o.id}
                      onClick={() => {
                        setBusqueda('');
                        if (o.lat != null && o.lng != null) {
                          setViewMode('map');
                          setFocus({ lat: o.lat, lng: o.lng });
                        }
                      }}
                      disabled={o.lat == null || o.lng == null}
                      className="w-full text-left px-3 py-2 hover:bg-canvas border-b border-slate-100 last:border-0 disabled:opacity-50"
                    >
                      <p className="text-sm font-medium text-navy">{o.nombre}</p>
                      <p className="text-xs text-muted">
                        {o.codigo}{o.direccion ? ` · ${o.direccion}` : ''}
                        {o.lat == null && <span className="text-amber"> · sin geo</span>}
                      </p>
                    </button>
                  ))}
                {objetivos.filter((o) => {
                  const q = busqueda.toLowerCase();
                  return (
                    (o.nombre || '').toLowerCase().includes(q) ||
                    (o.codigo || '').toLowerCase().includes(q) ||
                    (o.direccion || '').toLowerCase().includes(q)
                  );
                }).length === 0 && (
                  <p className="text-xs text-muted px-3 py-3">Sin coincidencias.</p>
                )}
              </div>
            )}
          </div>
          <button className="bg-slate-900 text-white p-2.5 rounded-xl hover:bg-black transition-all">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* View Switcher */}
      <div className="flex gap-2 bg-white/50 backdrop-blur p-1 rounded-2xl border border-slate-200/50 w-fit">
          <button 
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'grid' ? 'bg-navy text-white shadow-lg' : 'text-slate-400 hover:text-navy'}`}
          >
            <LayoutGrid size={14} /> Vista Grilla
          </button>
          <button 
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'map' ? 'bg-brand-blue text-white shadow-lg' : 'text-slate-400 hover:text-brand-blue'}`}
          >
            <MapIcon size={14} /> Mapa en Vivo
          </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Main Incident Feed */}
        <div className="lg:col-span-3">
          {viewMode === 'grid' ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex gap-6">
                  <FilterTab
                    label="Pendientes"
                    count={incidents.filter(i => i.estado === 'NUEVO').length}
                    active={tab === 'PENDIENTES'}
                    onClick={() => setTab('PENDIENTES')}
                  />
                  <FilterTab
                    label="En Atención"
                    count={incidents.filter(i => ['EN_ATENCION', 'DESPACHADO'].includes(i.estado)).length}
                    active={tab === 'EN_ATENCION'}
                    onClick={() => setTab('EN_ATENCION')}
                  />
                  <FilterTab
                    label="Verificando"
                    count={incidents.filter(i => i.estado === 'VERIFICANDO').length}
                    active={tab === 'VERIFICANDO'}
                    onClick={() => setTab('VERIFICANDO')}
                  />
                  <FilterTab
                    label="Cerrados"
                    count={tab === 'CERRADOS' ? closedIncidents.length : undefined}
                    active={tab === 'CERRADOS'}
                    onClick={() => setTab('CERRADOS')}
                  />
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Prioridad: Critica &gt; Alta
                </div>
              </div>

              {tab === 'CERRADOS' ? (
                <div className="space-y-4">
                  {closedIncidents.length === 0 ? (
                    <div className="py-20 text-center space-y-4 bg-white/50 border-2 border-dashed border-slate-200 rounded-[2.5rem]">
                      <Shield size={48} className="mx-auto text-slate-200" />
                      <p className="text-slate-400 font-bold uppercase tracking-widest">Sin incidentes cerrados</p>
                    </div>
                  ) : closedIncidents.map(inc => (
                    <ClosedIncidentCard key={inc.id} incident={inc} onOpen={() => abrirProtocolo(inc.id)} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {(() => {
                    const visibles = incidents.filter(i =>
                      tab === 'PENDIENTES'
                        ? i.estado === 'NUEVO'
                        : tab === 'EN_ATENCION'
                          ? ['EN_ATENCION', 'DESPACHADO'].includes(i.estado)
                          : i.estado === 'VERIFICANDO',
                    );
                    return visibles.length === 0 ? (
                      <div className="py-20 text-center space-y-4 bg-white/50 border-2 border-dashed border-slate-200 rounded-[2.5rem]">
                        <Shield size={48} className="mx-auto text-slate-200" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest">No hay incidentes en esta vista</p>
                      </div>
                    ) : visibles.map(inc => (
                      <IncidentCard key={inc.id} incident={inc} onTake={() => abrirProtocolo(inc.id)} />
                    ));
                  })()}
                </div>
              )}
            </div>
          ) : (
            <div className="h-[calc(100vh-250px)] w-full">
              <MapView
                objectives={objetivos.length ? objetivos : devices.map(d => d.objetivo).filter((v, i, a) => v && a.findIndex(t => t?.id === v.id) === i)}
                puestos={puestos}
                vehiculos={vehiculos}
                incidents={incidents}
                guards={guards}
                defaultCenter={defaultCenter}
                focus={focus}
              />
            </div>
          )}
        </div>

        {/* Real-time Event Stream Side Panel */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[2rem] p-6 text-white h-[calc(100vh-200px)] flex flex-col shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-brand-blue/20 to-transparent pointer-events-none" />
            
            <div className="flex items-center justify-between mb-6 relative z-10">
              <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <Activity size={16} className="text-brand-blue" /> Event stream
              </h3>
              <div className="text-[10px] bg-white/10 px-2 py-0.5 rounded font-mono text-white/50 uppercase tracking-widest">
                Real-time
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 scrollbar-hide">
              {events.length === 0 && <p className="text-white/20 text-[10px] uppercase font-bold italic py-8">Esperando señales...</p>}
              {events.map((ev, i) => (
                <div key={i} className="group animate-in slide-in-from-right duration-300">
                  <div className="flex justify-between items-start text-[10px] mb-1">
                    <span className="font-mono text-white/40">{new Date(ev.ts_evento).toLocaleTimeString()}</span>
                    <span className={`font-black uppercase tracking-widest ${ev.severidad === 'CRITICA' ? 'text-red-400' : ev.severidad === 'ALTA' ? 'text-orange-400' : 'text-brand-blue'}`}>
                      {ev.tipo}
                    </span>
                  </div>
                  <div className="bg-white/5 group-hover:bg-white/10 p-3 rounded-xl border border-white/5 transition-colors">
                    <p className="text-xs font-bold text-white/80">{ev.objetivo?.nombre || (ev.dispositivo_id ? 'Dispositivo ' + ev.dispositivo_id.slice(0, 4) : 'Evento')}</p>
                    <p className="text-[10px] text-white/40 mt-1 uppercase tracking-tight">{ev.origen} | ZONA {ev.zona_id || 'GENERAL'}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-4 border-t border-white/5 mt-4">
              <button className="w-full py-2 text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors">
                Ver historial completo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Protocolo guiado del incidente */}
      {protocoloId && (
        <ProtocoloIncidenteModal
          incidenteId={protocoloId}
          onClose={() => setProtocoloId(null)}
          onCambio={fetchActiveIncidents}
        />
      )}

      {/* Video Verification Modal */}
      {activeVideo && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-xl z-[100] flex items-center justify-center p-8 animate-in fade-in duration-500">
            <div className="w-full max-w-5xl space-y-6">
                <div className="flex justify-between items-end text-white">
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-blue block mb-2">Video-Verificación Prioritaria</span>
                        <h3 className="text-4xl font-black italic uppercase tracking-tighter">{activeVideo.title}</h3>
                    </div>
                    <button 
                        onClick={() => setActiveVideo(null)}
                        className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
                    >
                        Cerrar Verificación
                    </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <VideoPlayer incidentId={activeVideo.id} title={activeVideo.title} />
                    </div>
                    <div className="space-y-6">
                        <div className="bg-white/5 rounded-[2rem] p-6 border border-white/10 h-full">
                            <h4 className="text-xs font-black uppercase tracking-widest text-white/40 mb-4 italic">Protocolo Sugerido</h4>
                            <div className="space-y-4">
                                <Step number={1} text="Verificar presencia de personas no autorizadas" active />
                                <Step number={2} text="Llamar a contacto de emergencia (Titular)" />
                                <Step number={3} text="Despachar móvil de verificación" />
                                <Step number={4} text="Avisar a centro de despacho policial" />
                            </div>
                            <div className="mt-8 pt-8 border-t border-white/10">
                                <button className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-red-600/20">
                                    Disparar Pánico / Despacho
                                </button>
                                <button className="w-full mt-3 bg-white/5 hover:bg-white/10 text-white/60 py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all">
                                    Falsa Alarma
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

function FilterTab({ label, count, active = false, onClick }: { label: string; count?: number; active?: boolean; onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-1 pb-4 border-b-2 transition-all ${active ? 'border-brand-blue text-navy' : 'border-transparent text-slate-400 hover:text-navy hover:border-slate-200'}`}>
      <span className="text-xs font-black uppercase tracking-widest">{label}</span>
      {count !== undefined && (
        <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${active ? 'bg-brand-blue text-white' : 'bg-slate-100 text-slate-400'}`}>
          {count}
        </span>
      )}
    </button>
  );
}

const DISPOSICION_LABEL: Record<string, string> = {
  REAL: 'Evento real',
  FALSA: 'Falsa alarma',
  TECNICA: 'Falla técnica',
  PRUEBA: 'Prueba',
  SIN_NOVEDAD: 'Sin novedad',
};

/** Incidente RESUELTO: tarjeta compacta con disposición y hora de cierre. */
function ClosedIncidentCard({ incident, onOpen }: { incident: any; onOpen: () => void }) {
  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden transition-all hover:shadow-lg">
      <div className="p-6 flex justify-between items-center gap-4">
        <div className="flex gap-4 items-center">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-emerald-100 text-emerald-600">
            <UserCheck size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                {incident.severidad}
              </span>
              <span className="text-xs font-mono text-slate-400">#{incident.codigo}</span>
            </div>
            <h3 className="text-lg font-black text-navy uppercase italic tracking-tighter leading-none">
              {incident.tipo}
            </h3>
            <div className="flex items-center gap-4 mt-2 text-xs font-bold text-slate-600">
              <span className="flex items-center gap-1.5">
                <Building2 size={14} className="text-brand-blue" /> {incident.objetivo?.nombre}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                Cerrado: {incident.resuelto_el ? new Date(incident.resuelto_el).toLocaleString() : '—'}
              </span>
              {incident.disposicion && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                  {DISPOSICION_LABEL[incident.disposicion] ?? incident.disposicion}
                </span>
              )}
            </div>
          </div>
        </div>
        <button onClick={onOpen} className="bg-slate-100 text-navy px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center gap-2">
          Ver reporte <Eye size={14} />
        </button>
      </div>
    </div>
  );
}

function IncidentCard({ incident, onTake }: { incident: any, onTake: () => void }) {
  const isNuevo = incident.estado === 'NUEVO';
  const isCritica = incident.severidad === 'CRITICA';

  return (
    <div className={`bg-white rounded-[2rem] border overflow-hidden transition-all hover:shadow-xl group ${isNuevo ? (isCritica ? 'border-red-500 shadow-red-500/5' : 'border-orange-500 shadow-orange-500/5') : 'border-slate-100'}`}>
      <div className="p-6">
        <div className="flex justify-between items-start gap-4">
          <div className="flex gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${isNuevo ? (isCritica ? 'bg-red-500 text-white animate-pulse' : 'bg-orange-500 text-white') : 'bg-slate-100 text-slate-400'}`}>
              <AlertCircle size={30} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${isCritica ? 'bg-red-500 text-white' : 'bg-orange-100 text-orange-600'}`}>
                  {incident.severidad}
                </span>
                <span className="text-xs font-mono text-slate-400">#{incident.codigo}</span>
              </div>
              <h3 className="text-xl font-black text-navy uppercase italic tracking-tighter leading-none">
                {incident.tipo}
              </h3>
              <div className="flex items-center gap-4 mt-3">
                <p className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                  <Building2 size={14} className="text-brand-blue" /> {incident.objetivo?.nombre}
                </p>
                <p className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                  <Clock size={14} /> {new Date(incident.abierto_el).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            {isNuevo ? (
              <button 
                onClick={onTake}
                className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all active:scale-95 flex items-center gap-2"
              >
                Atender Ahora <ChevronRight size={14} />
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase leading-none">Estado</p>
                  <p className="text-xs font-bold text-navy">{incident.estado?.replace('_', ' ')}</p>
                </div>
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 ring-4 ring-emerald-50">
                  <UserCheck size={20} />
                </div>
                <button onClick={onTake} className="bg-brand-blue text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-brand-deep transition-all flex items-center gap-2">
                  Procesar <Eye size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mini footer with events summary */}
      <div className="bg-slate-50 px-6 py-3 border-t flex justify-between items-center">
        <div className="flex -space-x-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center">
              <Box size={10} className="text-slate-400" />
            </div>
          ))}
          <span className="pl-4 text-[10px] font-bold text-slate-400 uppercase self-center italic">+{incident.eventos?.length || 0} eventos correlacionados</span>
        </div>
        <div className="flex items-center gap-2">
          {incident.estado === 'EN_ATENCION' && (
             <span className="flex items-center gap-1 text-[10px] font-black text-emerald uppercase tracking-widest animate-pulse">
               <Activity size={10} /> Escuchando...
             </span>
          )}
        </div>
      </div>
    </div>
  );
}

function Step({ number, text, active = false }: { number: number, text: string, active?: boolean }) {
    return (
        <div className={`flex gap-4 items-center p-3 rounded-xl transition-all ${active ? 'bg-brand-blue/20 border border-brand-blue/30' : 'opacity-40'}`}>
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs ${active ? 'bg-brand-blue text-white' : 'bg-white/10 text-white'}`}>
                {number}
            </div>
            <p className="text-xs font-bold text-white/90 leading-tight">{text}</p>
        </div>
    )
}
