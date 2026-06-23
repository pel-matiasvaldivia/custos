import { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Scan, 
  MessageSquare, 
  Camera, 
  MapPin, 
  Shield, 
  ChevronRight,
  Zap,
  Activity,
  User
} from 'lucide-react';
import axios from 'axios';

export const MobileDashboard = () => {
  const [scanning, setScanning] = useState(false);
  const [isPanicActive, setIsPanicActive] = useState(false);
  const [location, setLocation] = useState<any>(null);

  useEffect(() => {
    // Start GPS tracking
    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition((pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLocation(coords);
        // Send to backend (debounced in real app)
        axios.post('/api/v1/mobile/tracking', { location: coords }).catch(() => {});
      });
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  const handlePanic = async () => {
    setIsPanicActive(true);
    try {
      await axios.post('/api/v1/mobile/panic', { location });
      // Visual feedback
      setTimeout(() => setIsPanicActive(false), 3000);
    } catch (err) {
      alert('Error al enviar pánico');
      setIsPanicActive(false);
    }
  };

  const handleScan = async () => {
    setScanning(true);
    // Simulate QR reading after 1.5s
    setTimeout(async () => {
      try {
        await axios.post('/api/v1/mobile/checkpoint', { 
            checkpointId: '8092023a-f4ef-4b41-b847-1925b3991202', // Dummy UUID
            location 
        });
        alert('Punto de control verificado');
      } catch (err) {
        console.error(err);
      } finally {
        setScanning(false);
      }
    }, 1500);
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
            <div className={`w-2 h-2 rounded-full ${location ? 'bg-emerald animate-pulse' : 'bg-red-500'}`} />
            <User size={20} className="text-white/40" />
        </div>
      </div>

      <main className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide pb-32">
        
        {/* Status Card */}
        <div className="bg-white/5 rounded-[2.5rem] p-6 border border-white/10 flex items-center justify-between">
            <div className="flex gap-4 items-center">
                <div className="w-12 h-12 rounded-2xl bg-emerald/10 flex items-center justify-center text-emerald">
                    <Activity size={24} />
                </div>
                <div>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Estado de Guardía</p>
                    <h3 className="text-xl font-bold">En Servicio</h3>
                </div>
            </div>
            <div className="text-right">
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Turno</p>
                <p className="text-lg font-bold">08:42 hs</p>
            </div>
        </div>

        {/* Big Actions */}
        <div className="grid grid-cols-2 gap-4">
            <button 
                onClick={handleScan}
                disabled={scanning}
                className="bg-brand-blue aspect-square rounded-[3rem] shadow-2xl shadow-brand-blue/20 flex flex-col items-center justify-center gap-3 active:scale-95 transition-all text-white relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full blur-xl -mr-4 -mt-4" />
                <Scan size={32} className={scanning ? 'animate-spin' : ''} />
                <span className="font-black uppercase text-xs tracking-widest">{scanning ? 'Leyendo...' : 'Escanear QR'}</span>
            </button>
            
            <button 
                className="bg-white/5 border border-white/10 aspect-square rounded-[3rem] flex flex-col items-center justify-center gap-3 active:scale-95 transition-all text-white/80"
            >
                <Camera size={32} />
                <span className="font-black uppercase text-xs tracking-widest">Novedad</span>
            </button>
        </div>

        {/* Active Task / Ronda */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 border border-white/5 relative overflow-hidden shadow-2xl">
            <div className="flex justify-between items-start mb-6">
                <div>
                   <h4 className="text-sm font-black uppercase tracking-widest text-brand-blue mb-1">Ronda en Curso</h4>
                   <p className="text-xl font-black italic uppercase tracking-tighter">Objetivo Centenario</p>
                </div>
                <div className="p-3 bg-white/5 rounded-2xl text-white/60">
                    <MapPin size={20} />
                </div>
            </div>
            
            <div className="space-y-4">
                <RondaItem label="Acceso Principal" time="Hace 12m" done />
                <RondaItem label="Depósito Este" time="Pendiente" />
                <RondaItem label="Perímetro Norte" time="Pendiente" />
            </div>

            <button className="w-full mt-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all">
                Ver Mapa de Puntos
            </button>
        </div>

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

      {/* Panic Zone - ALWAYS VISIBLE AT BOTTOM */}
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

      {isPanicActive && (
        <div className="fixed inset-0 z-[100] bg-red-600 flex items-center justify-center animate-in fade-in zoom-in duration-300">
            <div className="text-center">
                 <Zap size={80} className="mx-auto mb-6 animate-bounce" />
                 <h2 className="text-5xl font-black italic uppercase tracking-tighter mb-2">ALERTA ENVIADA</h2>
                 <p className="text-white/80 font-bold uppercase tracking-widest text-sm">EL SOC ESTÁ INTERVINIENDO</p>
            </div>
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
