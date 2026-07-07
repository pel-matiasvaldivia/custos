import { useState, useEffect, useMemo } from 'react';
import {
  Building2, Smartphone, CheckCircle, XCircle, Search, Plus, ShieldCheck,
  Zap, Activity, Camera, Trash2, FlaskConical,
} from 'lucide-react';
import {
  dispositivosService,
  Dispositivo,
} from '../../services/dispositivos.service';
import { NuevoDispositivoModal, DispositivoCanalesModal } from './EquipamientoModals';

export const DevicesPage = () => {
  const [devices, setDevices] = useState<Dispositivo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('');
  const [nuevo, setNuevo] = useState(false);
  const [canalesDe, setCanalesDe] = useState<Dispositivo | null>(null);

  const fetchDevices = async () => {
    try {
      setDevices(await dispositivosService.listar());
    } catch (err) {
      console.error('Error fetching devices', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const visibles = useMemo(() => {
    const q = filtro.trim().toLowerCase();
    if (!q) return devices;
    return devices.filter((d) =>
      [d.marca, d.modelo, d.nro_abonado, d.objetivo?.nombre, d.tipo]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q)),
    );
  }, [devices, filtro]);

  const walkTest = async (d: Dispositivo) => {
    await dispositivosService.actualizar(d.id, { en_prueba: true });
    fetchDevices();
  };

  const eliminar = async (d: Dispositivo) => {
    if (!confirm(`¿Eliminar ${d.marca ?? ''} ${d.modelo ?? ''}?`)) return;
    await dispositivosService.eliminar(d.id);
    fetchDevices();
  };

  const enLinea = devices.filter((d) => d.estado === 'EN_LINEA').length;
  const fuera = devices.filter((d) => d.estado === 'FUERA_DE_LINEA').length;

  return (
    <div className="space-y-8 font-display">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black text-navy tracking-tighter uppercase italic">
            Equipamiento <span className="text-brand-blue">Electrónico</span>
          </h2>
          <p className="text-muted text-sm font-bold uppercase tracking-widest mt-1">Paneles, cámaras e IoT</p>
        </div>
        <button
          onClick={() => setNuevo(true)}
          className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 active:scale-95 shadow-xl shadow-slate-200"
        >
          <Plus size={16} /> Nuevo Dispositivo
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Equipos', value: devices.length, icon: Smartphone, color: 'text-brand-blue', bg: 'bg-brand-blue/5' },
          { label: 'En Línea', value: enLinea, icon: CheckCircle, color: 'text-emerald', bg: 'bg-emerald/5' },
          { label: 'Fuera de Línea', value: fuera, icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/5' },
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

      {/* List */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              type="text"
              placeholder="Filtrar por abonado, marca, objetivo…"
              className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-blue/10 transition-all"
            />
          </div>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/30 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
              <th className="px-8 py-5">Dispositivo</th>
              <th className="px-8 py-5">Tipo / Protocolo</th>
              <th className="px-8 py-5">Abonado</th>
              <th className="px-8 py-5">Objetivo</th>
              <th className="px-8 py-5">Estado</th>
              <th className="px-8 py-5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              [1, 2, 3].map((i) => <tr key={i} className="animate-pulse bg-white"><td colSpan={6} className="h-16 px-8"></td></tr>)
            ) : visibles.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-20 text-center">
                  <Activity size={48} className="mx-auto text-slate-200 mb-4" />
                  <p className="text-slate-400 font-bold uppercase tracking-widest">
                    {devices.length === 0 ? 'No hay dispositivos registrados' : 'Sin coincidencias'}
                  </p>
                </td>
              </tr>
            ) : visibles.map((dev) => (
              <tr key={dev.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-brand-blue group-hover:text-white transition-all">
                      <Camera size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-navy">{dev.marca} {dev.modelo}</p>
                      <p className="text-[10px] text-muted uppercase tracking-wider">
                        {dev._count?.canales ?? 0} canales
                      </p>
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
                    <div className={`w-2 h-2 rounded-full ${dev.estado === 'EN_LINEA' ? 'bg-emerald animate-pulse' : 'bg-red-500'}`} />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${dev.estado === 'EN_LINEA' ? 'text-emerald' : 'text-red-500'}`}>
                      {dev.estado.replace(/_/g, ' ')}
                    </span>
                  </div>
                  {dev.ultimo_latido && (
                    <p className="text-[9px] text-muted font-bold mt-1 uppercase tracking-tighter">
                      Latido: {new Date(dev.ultimo_latido).toLocaleTimeString()}
                    </p>
                  )}
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => setCanalesDe(dev)}
                      title="Canales y verificación"
                      className="p-2 text-slate-400 hover:text-brand-blue hover:bg-brand-blue/5 rounded-lg transition-all"
                    >
                      <Camera size={18} />
                    </button>
                    <button
                      onClick={() => walkTest(dev)}
                      title="Modo prueba (walk-test)"
                      className="p-2 text-slate-400 hover:text-amber hover:bg-amber/5 rounded-lg transition-all"
                    >
                      <FlaskConical size={18} />
                    </button>
                    <button
                      onClick={() => eliminar(dev)}
                      title="Eliminar"
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
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
            El sistema monitorea el latido de cada equipo. Si un abonado deja de reportar, se genera una alerta automáticamente.
          </p>
        </div>

        <div className="card border-brand-blue/20 bg-brand-blue/5 p-8 rounded-[3rem]">
          <h4 className="text-xl font-black italic uppercase tracking-tighter text-navy mb-4 flex items-center gap-2">
            <ShieldCheck size={20} className="text-brand-blue" /> Modo Prueba (Walk-Test)
          </h4>
          <p className="text-slate-500 text-sm leading-relaxed">
            Activá el modo prueba en un equipo (ícono de matraz) para hacer mantenimiento sin generar incidentes: los eventos quedan registrados solo para auditoría.
          </p>
        </div>
      </div>

      {nuevo && (
        <NuevoDispositivoModal onClose={() => setNuevo(false)} onCreado={fetchDevices} />
      )}
      {canalesDe && (
        <DispositivoCanalesModal
          dispositivoId={canalesDe.id}
          dispositivoNombre={`${canalesDe.marca ?? ''} ${canalesDe.modelo ?? ''}`.trim() || 'Dispositivo'}
          onClose={() => setCanalesDe(null)}
        />
      )}
    </div>
  );
};
