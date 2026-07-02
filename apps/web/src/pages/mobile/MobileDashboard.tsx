import { useState, useEffect, useCallback } from 'react';
import {
  AlertTriangle,
  Scan,
  MessageSquare,
  Camera,
  MapPin,
  Shield,
  ChevronRight,
  Zap,
  RefreshCw,
  WifiOff,
} from 'lucide-react';
import mobileApi from '../../services/mobileApi';
import {
  vigilanciaMovilService,
  TurnoActual,
  Location,
  RondaMovil,
  VigiladorObjetivo,
} from '../../services/vigilanciaMovil.service';
import { AsistenciaCard } from './AsistenciaCard';
import { SolicitarRelevoModal } from './SolicitarRelevoModal';
import { NovedadMovilModal } from './NovedadMovilModal';
import { EscanerQRModal } from './EscanerQRModal';
import { useOnline } from '../../hooks/useOnline';
import { usePendingSync } from '../../hooks/usePendingSync';
import { useWakeLock } from '../../hooks/useWakeLock';
import { initOutbox } from '../../offline/outbox';
import { mobileAuthService, VigiladorActivo } from '../../services/mobileAuth.service';
import { Users, LogOut, ChevronDown } from 'lucide-react';

export const MobileDashboard = () => {
  const online = useOnline();
  const pendientes = usePendingSync();
  const modoDispositivo = mobileAuthService.getModo() === 'DISPOSITIVO';
  const objetivo = mobileAuthService.getObjetivo();
  const sesion = mobileAuthService.getSesion();
  // Mantiene la pantalla encendida mientras la app está en primer plano, para
  // que el guardia no pierda el turno en curso por el bloqueo del celular.
  useWakeLock();
  const [isPanicActive, setIsPanicActive] = useState(false);
  const [location, setLocation] = useState<Location | null>(null);
  const [turno, setTurno] = useState<TurnoActual | null>(null);
  const [procesandoAsistencia, setProcesandoAsistencia] = useState(false);
  const [modalRelevo, setModalRelevo] = useState(false);
  const [modalNovedad, setModalNovedad] = useState(false);
  const [modalEscaner, setModalEscaner] = useState(false);
  const [scanMensaje, setScanMensaje] = useState<string | null>(null);

  const [rondas, setRondas] = useState<RondaMovil[]>([]);

  // Modo dispositivo: quién opera ahora + lista de guardias del objetivo.
  const [activo, setActivo] = useState<VigiladorActivo | null>(
    mobileAuthService.getVigiladorActivo(),
  );
  const [vigiladores, setVigiladores] = useState<VigiladorObjetivo[]>([]);
  // En modo personal ya hay identidad; en dispositivo, hasta elegir "¿Quién sos?".
  const identificado = !modoDispositivo || !!activo;

  const cargarTurno = useCallback(async () => {
    if (!identificado) return;
    try {
      const data = await vigilanciaMovilService.turnoActual();
      setTurno(data);
    } catch {
      setTurno(null);
    }
  }, [identificado]);

  const cargarRondas = useCallback(async () => {
    if (!identificado) return;
    try {
      const data = await vigilanciaMovilService.rondas();
      setRondas(data);
    } catch {
      // sin señal: conservamos el estado local (marcas optimistas)
    }
  }, [identificado]);

  const cargarVigiladores = useCallback(async () => {
    if (!modoDispositivo) return;
    try {
      setVigiladores(await vigilanciaMovilService.vigiladoresDelObjetivo());
    } catch {
      setVigiladores([]);
    }
  }, [modoDispositivo]);

  const elegirVigilador = (v: VigiladorObjetivo) => {
    const va: VigiladorActivo = {
      id: v.id, nombre: v.nombre, apellido: v.apellido, legajo_nro: v.legajo_nro,
    };
    mobileAuthService.setVigiladorActivo(va);
    setActivo(va);
  };

  const cambiarVigilador = () => {
    mobileAuthService.setVigiladorActivo(null);
    setActivo(null);
    setTurno(null);
    setRondas([]);
    cargarVigiladores();
  };

  useEffect(() => {
    initOutbox(); // arranca la sincronización de la cola offline
    cargarVigiladores();
  }, [cargarVigiladores]);

  useEffect(() => {
    cargarTurno();
    cargarRondas();
  }, [cargarTurno, cargarRondas]);

  useEffect(() => {
    // Start GPS tracking
    if ('geolocation' in navigator) {
      const watchId = navigator.geolocation.watchPosition((pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLocation(coords);
        mobileApi.post('/mobile/tracking', { location: coords }).catch(() => {});
      });
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  const handlePanic = async () => {
    setIsPanicActive(true);
    // El pánico se encola y se envía apenas hay señal (funciona offline).
    await vigilanciaMovilService.panic(location ?? undefined);
    setTimeout(() => setIsPanicActive(false), 3000);
  };

  const handleQRDetectado = async (codigo: string) => {
    setModalEscaner(false);
    // El scan se encola y se envía apenas hay señal (offline-safe).
    await vigilanciaMovilService.checkpoint(codigo, location ?? undefined);

    // Marca optimista local (por si no hay señal); luego intentamos refrescar.
    const ahora = new Date().toISOString();
    setRondas((prev) =>
      prev.map((r) => ({
        ...r,
        puntos: r.puntos.map((p) =>
          !p.marcada && (p.codigo_qr === codigo || p.id === codigo)
            ? { ...p, marcada: ahora }
            : p,
        ),
      })),
    );
    setScanMensaje('Punto de control registrado');
    setTimeout(() => setScanMensaje(null), 2500);
    cargarRondas();
  };

  const handleIniciarRonda = async (plantillaId: string) => {
    await vigilanciaMovilService.iniciarRonda(plantillaId);
    // Optimista: la ronda queda en progreso al toque (con marcas en cero si es
    // un reintento tras quedar incompleta); se sincroniza detrás.
    setRondas((prev) =>
      prev.map((r) =>
        r.id === plantillaId && r.ejecucion?.estado !== 'EN_PROGRESO'
          ? {
              ...r,
              puntos: r.puntos.map((p) => ({ ...p, marcada: null })),
              ejecucion: {
                id: 'local',
                estado: 'EN_PROGRESO',
                hora_inicio: new Date().toISOString(),
                hora_fin: null,
              },
            }
          : r,
      ),
    );
    cargarRondas();
  };

  const handleCheckin = async () => {
    if (!turno) return;
    setProcesandoAsistencia(true);
    try {
      await vigilanciaMovilService.checkin(turno.id, 'APP', location ?? undefined);
      // Optimista: reflejamos el ingreso al toque; se sincroniza en segundo plano.
      setTurno({ ...turno, inicio_real: new Date().toISOString() });
    } finally {
      setProcesandoAsistencia(false);
    }
  };

  const handleCheckout = async () => {
    if (!turno) return;
    // No se puede finalizar el turno antes del horario de fin: si el guardia
    // necesita salir antes, se lo deriva a solicitar un cambio de turno.
    if (new Date() < new Date(turno.fin_plan)) {
      setModalRelevo(true);
      return;
    }
    setProcesandoAsistencia(true);
    try {
      await vigilanciaMovilService.checkout(turno.id, 'APP', location ?? undefined);
      setTurno({ ...turno, fin_real: new Date().toISOString() });
    } finally {
      setProcesandoAsistencia(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950 text-white font-display flex flex-col">

      {/* Mobile Top Bar */}
      <div className="p-6 bg-slate-900/50 backdrop-blur-xl flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-2">
            <div className="p-2 bg-brand-blue rounded-lg shadow-lg shadow-brand-blue/20">
                <Shield size={18} />
            </div>
            <span className="font-black italic uppercase tracking-tighter text-lg">CustOS <span className="text-brand-blue">GO</span></span>
        </div>
        <div className="flex items-center gap-3">
            {modoDispositivo ? (
              activo && (
                <button onClick={cambiarVigilador} className="text-right leading-tight flex items-center gap-1.5">
                  <div>
                    <p className="text-[11px] font-bold text-white truncate max-w-[120px]">
                      {activo.apellido}, {activo.nombre}
                    </p>
                    <p className="text-[9px] font-mono uppercase tracking-widest text-emerald">
                      Cambiar guardia
                    </p>
                  </div>
                  <ChevronDown size={14} className="text-white/40" />
                </button>
              )
            ) : (
              sesion && (
                <div className="text-right leading-tight">
                  <p className="text-[11px] font-bold text-white truncate max-w-[130px]">
                    {sesion.apellido}, {sesion.nombre}
                  </p>
                  <p className="text-[9px] font-mono uppercase tracking-widest text-white/40">
                    {sesion.legajo_nro ? `Legajo ${sesion.legajo_nro}` : 'Vigilador'}
                  </p>
                </div>
              )
            )}
            <div className={`w-2 h-2 rounded-full ${location ? 'bg-emerald animate-pulse' : 'bg-red-500'}`} title="GPS" />
        </div>
      </div>

      {/* Modo dispositivo: barra del objetivo al que pertenece el celular */}
      {modoDispositivo && objetivo && (
        <div className="px-6 py-2 bg-brand-blue/10 border-b border-brand-blue/20 flex items-center gap-2 text-brand-blue">
          <MapPin size={14} />
          <span className="text-[11px] font-black uppercase tracking-widest truncate">{objetivo.nombre}</span>
        </div>
      )}

      {/* Selector "¿Quién sos?" — bloquea el tablero hasta identificarse */}
      {modoDispositivo && !activo && (
        <div className="flex-1 overflow-y-auto p-6">
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Users size={26} className="text-brand-blue" />
            </div>
            <h2 className="text-xl font-black italic uppercase tracking-tighter">¿Quién sos?</h2>
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest mt-1">
              Elegí tu nombre para operar
            </p>
          </div>
          {vigiladores.length === 0 ? (
            <p className="text-center text-white/40 text-sm py-8">
              No hay vigiladores asignados a este objetivo todavía.
            </p>
          ) : (
            <div className="space-y-2">
              {vigiladores.map((v) => (
                <button
                  key={v.id}
                  onClick={() => elegirVigilador(v)}
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 active:scale-95 transition-all text-left"
                >
                  <div>
                    <p className="font-bold text-sm">{v.apellido}, {v.nombre}</p>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-white/40">
                      {v.legajo_nro ? `Legajo ${v.legajo_nro}` : 'Sin legajo'}
                    </p>
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-widest ${
                    v.estado_turno === 'EN_TURNO' ? 'text-emerald' : v.estado_turno === 'PROXIMO' ? 'text-amber' : 'text-white/30'
                  }`}>
                    {v.estado_turno === 'EN_TURNO' ? 'En turno' : v.estado_turno === 'PROXIMO' ? 'Próximo' : 'Sin turno'}
                  </span>
                </button>
              ))}
            </div>
          )}
          <button
            onClick={() => { mobileAuthService.cerrarSesion(); window.location.href = '/mobile/login'; }}
            className="w-full mt-6 py-3 rounded-2xl border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
          >
            <LogOut size={13} /> Salir del objetivo
          </button>
        </div>
      )}


      {/* Estado de conexión + GPS bajo la barra, para no competir con la identidad */}
      <div className="px-6 py-1.5 bg-slate-900/30 flex items-center justify-end gap-2 border-b border-white/5">
        <span className={`text-[9px] font-black uppercase tracking-widest ${online ? 'text-emerald' : 'text-amber'}`}>
          {online ? 'En línea' : 'Sin conexión'}
        </span>
      </div>

      {/* Aviso offline: la app sigue operando; las acciones se sincronizan al volver la señal */}
      {!online && (
        <div className="bg-amber/15 border-b border-amber/30 px-6 py-2.5 flex items-center gap-2 text-amber">
          <WifiOff size={15} />
          <span className="text-[11px] font-bold uppercase tracking-wider">
            Sin conexión · seguí trabajando{pendientes > 0 ? ` · ${pendientes} sin sincronizar` : ''}
          </span>
        </div>
      )}
      {online && pendientes > 0 && (
        <div className="bg-brand-blue/15 border-b border-brand-blue/30 px-6 py-2.5 flex items-center gap-2 text-brand-blue">
          <RefreshCw size={14} className="animate-spin" />
          <span className="text-[11px] font-bold uppercase tracking-wider">
            Sincronizando {pendientes} acción(es)...
          </span>
        </div>
      )}

      {identificado && (
      <main className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide pb-32">

        {/* Asistencia / Estado de Guardia */}
        <AsistenciaCard
          turno={turno}
          procesando={procesandoAsistencia}
          onCheckin={handleCheckin}
          onCheckout={handleCheckout}
        />

        {turno && (
          <button
            onClick={() => setModalRelevo(true)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-white/10 text-white/60 text-xs font-black uppercase tracking-widest hover:text-white hover:bg-white/5 transition-all"
          >
            <RefreshCw size={14} /> Solicitar cambio de turno
          </button>
        )}

        {/* Big Actions */}
        <div className="grid grid-cols-2 gap-4">
            <button
                onClick={() => setModalEscaner(true)}
                className="bg-brand-blue aspect-square rounded-[3rem] shadow-2xl shadow-brand-blue/20 flex flex-col items-center justify-center gap-3 active:scale-95 transition-all text-white relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full blur-xl -mr-4 -mt-4" />
                <Scan size={32} />
                <span className="font-black uppercase text-xs tracking-widest">Escanear QR</span>
            </button>

            <button
                onClick={() => setModalNovedad(true)}
                className="bg-white/5 border border-white/10 aspect-square rounded-[3rem] flex flex-col items-center justify-center gap-3 active:scale-95 transition-all text-white/80"
            >
                <Camera size={32} />
                <span className="font-black uppercase text-xs tracking-widest">Novedad</span>
            </button>
        </div>

        {/* Rondas asignadas al objetivo del turno */}
        {rondas.length > 0 && (
          <div className="bg-slate-900 rounded-[2.5rem] p-8 border border-white/5 relative overflow-hidden shadow-2xl">
            <div className="flex justify-between items-start mb-6">
                <div>
                   <h4 className="text-sm font-black uppercase tracking-widest text-brand-blue mb-1">Rondas del Turno</h4>
                   <p className="text-xl font-black italic uppercase tracking-tighter">{turno?.puesto?.nombre ?? 'Objetivo'}</p>
                </div>
                <div className="p-3 bg-white/5 rounded-2xl text-white/60">
                    <MapPin size={20} />
                </div>
            </div>

            <div className="space-y-6">
              {rondas.map((r) => {
                const marcados = r.puntos.filter((p) => p.marcada).length;
                const enProgreso = r.ejecucion?.estado === 'EN_PROGRESO';
                const completada = r.ejecucion?.estado === 'COMPLETADA';
                const incompleta = r.ejecucion?.estado === 'INCOMPLETA';
                return (
                  <div key={r.id}>
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-xs font-black uppercase tracking-widest text-white/70">
                        {r.nombre}
                        {r.tolerancia_min != null && (
                          <span className="text-white/30 normal-case tracking-normal font-bold">
                            {' '}· {r.tolerancia_min} min
                          </span>
                        )}
                      </p>
                      <span
                        className={`text-[9px] font-black uppercase tracking-widest ${
                          completada
                            ? 'text-emerald'
                            : enProgreso
                              ? 'text-amber'
                              : incompleta
                                ? 'text-red-500'
                                : 'text-white/30'
                        }`}
                      >
                        {completada
                          ? 'Completada'
                          : enProgreso
                            ? `${marcados}/${r.puntos.length} puntos`
                            : incompleta
                              ? 'Incompleta'
                              : 'Sin iniciar'}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {r.puntos.map((p) => (
                        <RondaItem
                          key={p.id}
                          label={p.nombre}
                          time={
                            p.marcada
                              ? new Date(p.marcada).toLocaleTimeString('es-AR', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : 'Pendiente'
                          }
                          done={!!p.marcada}
                        />
                      ))}
                    </div>
                    {!enProgreso && !completada && (
                      <button
                        onClick={() => handleIniciarRonda(r.id)}
                        className="w-full mt-4 py-4 bg-brand-blue/20 border border-brand-blue/40 rounded-2xl text-[10px] font-black uppercase tracking-widest text-brand-blue hover:bg-brand-blue/30 transition-all active:scale-95"
                      >
                        {incompleta ? 'Reintentar ronda' : 'Iniciar ronda'}
                      </button>
                    )}
                    {enProgreso && (
                      <p className="mt-3 text-[10px] text-white/40 font-bold uppercase tracking-widest text-center">
                        Escaneá el QR de cada punto
                        {r.tolerancia_min != null
                          ? ` · Tenés ${r.tolerancia_min} min para completarla`
                          : ''}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick Chat */}
        <div className="flex items-center gap-4 bg-brand-blue/5 border border-brand-blue/20 p-4 rounded-[2rem]">
            <div className="w-10 h-10 bg-brand-blue rounded-full flex items-center justify-center">
                <MessageSquare size={18} />
            </div>
            <div className="flex-1">
                <p className="text-[10px] font-black text-brand-blue uppercase tracking-widest">Chat SOC</p>
                <p className="text-sm font-bold text-white/60">Operador: "Novedades?"</p>
            </div>
            <ChevronRight size={20} className="text-white/20" />
        </div>
      </main>
      )}

      {/* Panic Zone - visible una vez identificado */}
      {identificado && (
      <div className="absolute bottom-0 left-0 right-0 p-6 pb-12 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent">
        <button
            onContextMenu={(e) => e.preventDefault()}
            onTouchStart={() => {}} // In a real app we would use a long-press hook
            onClick={handlePanic}
            className={`w-full py-6 rounded-[2.5rem] flex items-center justify-center gap-4 shadow-2xl transition-all active:scale-95 ${isPanicActive ? 'bg-red-500 scale-110 shadow-red-500/50' : 'bg-red-600/90 shadow-red-600/30'}`}
        >
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center animate-ping absolute" />
            <AlertTriangle size={28} className="relative z-10" />
            <span className="text-xl font-black italic uppercase tracking-tighter relative z-10">PÁNICO / SOS</span>
        </button>
      </div>
      )}

      {isPanicActive && (
        <div className="fixed inset-0 z-[100] bg-red-600 flex items-center justify-center animate-in fade-in zoom-in duration-300">
            <div className="text-center">
                 <Zap size={80} className="mx-auto mb-6 animate-bounce" />
                 <h2 className="text-5xl font-black italic uppercase tracking-tighter mb-2">ALERTA ENVIADA</h2>
                 <p className="text-white/80 font-bold uppercase tracking-widest text-sm">EL SOC ESTÁ INTERVINIENDO</p>
            </div>
        </div>
      )}

      {modalRelevo && turno && (
        <SolicitarRelevoModal
          turnoId={turno.id}
          onClose={() => setModalRelevo(false)}
          onSolicitado={() => {
            setModalRelevo(false);
            cargarTurno();
          }}
        />
      )}

      {modalNovedad && (
        <NovedadMovilModal onClose={() => setModalNovedad(false)} onCreada={() => setModalNovedad(false)} />
      )}

      {modalEscaner && (
        <EscanerQRModal onDetectado={handleQRDetectado} onClose={() => setModalEscaner(false)} />
      )}

      {scanMensaje && (
        <div className="fixed top-24 left-6 right-6 z-[96] bg-emerald text-slate-950 rounded-2xl px-5 py-3 text-center text-xs font-black uppercase tracking-widest shadow-2xl animate-in fade-in slide-in-from-top duration-300">
          {scanMensaje}
        </div>
      )}
    </div>
  );
};

function RondaItem({ label, time, done = false }: { label: string, time: string, done?: boolean }) {
    return (
        <div className={`p-4 rounded-2xl flex justify-between items-center ${done ? 'bg-emerald/10 border border-emerald/20' : 'bg-white/5 border border-white/5'}`}>
            <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${done ? 'bg-emerald' : 'bg-white/10'}`} />
                <span className={`text-xs font-bold ${done ? 'text-emerald' : 'text-white/60'}`}>{label}</span>
            </div>
            <span className="text-[10px] font-black uppercase text-white/30 tracking-widest">{time}</span>
        </div>
    );
}
