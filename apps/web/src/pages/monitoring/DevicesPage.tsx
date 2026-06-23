import { useState, useEffect } from 'react';
import { 
  Building2, 
  Smartphone, 
  Settings, 
  CheckCircle, 
  XCircle, 
  Search, 
  Plus, 
  History, 
  ShieldCheck,
  Zap,
  Activity,
  MoreHorizontal
} from 'lucide-react';
import axios from 'axios';

export const DevicesPage = () => {
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const res = await axios.get('/api/v1/centro-operaciones/dispositivos');
      setDevices(res.data);
    } catch (err) {
      console.error('Error fetching devices', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 font-display">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black text-navy tracking-tighter uppercase italic">
            Equipamiento <span className="text-brand-blue">Electrónico</span>
          </h2>
          <p className="text-muted text-sm font-bold uppercase tracking-widest mt-1">Configuración de Paneles, Cámaras e IoT</p>
        </div>
        <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 active:scale-95 shadow-xl shadow-slate-200">
          <Plus size={16} /> Nuevo Dispositivo
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Equipos', value: devices.length, icon: Smartphone, color: 'text-brand-blue', bg: 'bg-brand-blue/5' },
          { label: 'En Línea', value: devices.filter(d => d.estado === 'EN_LINEA').length, icon: CheckCircle, color: 'text-emerald', bg: 'bg-emerald/5' },
          { label: 'Fuera de Línea', value: devices.filter(d => d.estado === 'FUERA_DE_LINEA').length, icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/5' },
          { label: 'En Prueba', value: 0, icon: Zap, color: 'text-amber', bg: 'bg-amber/5' },
        ].map((s, i) => (
          <div key={i} className={`card p-6 border-none ${s.bg} flex justify-between items-start`}>
            <div>
              <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-1">{s.label}</p>
              <h3 className={`text-4xl font-black ${s.color}`}>{s.value}</h3>
            </div>
            <s.icon className={s.color} size={28} />
          </div>
        ))}
      </div>

      {/* Device List */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Filtrar por abonado, marca o cliente..." 
              className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-blue/10 transition-all"
            />
          </div>
          <div className="flex gap-2">
             <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-navy transition-all"><History size={20} /></button>
             <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-navy transition-all"><Settings size={20} /></button>
          </div>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/30 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
              <th className="px-8 py-5">Dispositivo</th>
              <th className="px-8 py-5">Tipo / Protocolo</th>
              <th className="px-8 py-5">Abonado / ID</th>
              <th className="px-8 py-5">Objetivo</th>
              <th className="px-8 py-5">Estado</th>
              <th className="px-8 py-5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              [1, 2, 3].map(i => <tr key={i} className="animate-pulse bg-white"><td colSpan={6} className="h-16 px-8"></td></tr>)
            ) : devices.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-20 text-center">
                  <Activity size={48} className="mx-auto text-slate-200 mb-4" />
                  <p className="text-slate-400 font-bold uppercase tracking-widest">No hay dispositivos registrados</p>
                </td>
              </tr>
            ) : devices.map(dev => (
              <tr key={dev.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-brand-blue group-hover:text-white transition-all">
                      <Smartphone size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-navy">{dev.marca} {dev.modelo}</p>
                      <p className="text-[10px] text-muted uppercase tracking-wider">SN: {dev.id.slice(0, 8)}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="text-xs font-bold text-slate-600 uppercase bg-slate-100 px-2.5 py-1 rounded-lg">
                    {dev.tipo} / <span className="text-brand-blue">{dev.protocolo}</span>
                  </span>
                </td>
                <td className="px-8 py-6">
                  <span className="font-mono text-sm font-bold text-slate-500">#{dev.nro_abonado || 'N/A'}</span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    <Building2 size={14} className="text-brand-blue" />
                    <span className="text-sm font-bold text-slate-600">{dev.objetivo?.nombre || 'S/D'}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${dev.estado === 'EN_LINEA' ? 'bg-emerald animate-pulse shadow-[0_0_8px_theme(colors.emerald.DEFAULT)]' : 'bg-red-500 shadow-[0_0_8px_theme(colors.red.500)]'}`} />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${dev.estado === 'EN_LINEA' ? 'text-emerald' : 'text-red-500'}`}>
                      {dev.estado.replace(/_/g, ' ')}
                    </span>
                  </div>
                  {dev.ultimo_latido && (
                    <p className="text-[9px] text-muted font-bold mt-1 uppercase tracking-tighter">Latido: {new Date(dev.ultimo_latido).toLocaleTimeString()}</p>
                  )}
                </td>
                <td className="px-8 py-6 text-right">
                  <button className="p-2 text-slate-300 hover:text-navy hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-100">
                    <MoreHorizontal size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Info Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card bg-slate-900 text-white p-8 rounded-[3rem] relative overflow-hidden group shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/20 rounded-full blur-3xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700" />
          <h4 className="text-xl font-black italic uppercase tracking-tighter mb-4 flex items-center gap-2">
            <Zap size={20} className="text-brand-blue" /> Supervisión Activa
          </h4>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            El sistema monitorea la señal de todos los equipos cada <span className="text-white font-bold">60 segundos</span>. Si un abonado deja de reportar, se genera una alerta crítica automáticamente.
          </p>
          <div className="flex gap-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex-1">
              <p className="text-[10px] font-black text-white/30 uppercase mb-1">Muestreo</p>
              <p className="text-lg font-bold">1/min</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex-1">
              <p className="text-[10px] font-black text-white/30 uppercase mb-1">Tolerancia</p>
              <p className="text-lg font-bold">2 fali.</p>
            </div>
          </div>
        </div>

        <div className="card border-brand-blue/20 bg-brand-blue/5 p-8 rounded-[3rem]">
          <h4 className="text-xl font-black italic uppercase tracking-tighter text-navy mb-4 flex items-center gap-2">
            <ShieldCheck size={20} className="text-brand-blue" /> Modo Prueba (Walk-Test)
          </h4>
          <p className="text-slate-500 text-sm leading-relaxed mb-6">
            Activá el modo prueba para realizar mantenimientos sin generar incidentes reales en el SOC Console. Los eventos quedarán registrados únicamente para auditoría.
          </p>
          <button className="w-full bg-brand-blue text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-blue-dark transition-all active:scale-95 shadow-lg shadow-brand-blue/20">
            Iniciar Mantenimiento
          </button>
        </div>
      </div>
    </div>
  );
};
