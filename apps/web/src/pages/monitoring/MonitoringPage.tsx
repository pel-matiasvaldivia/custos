import { useState, useEffect } from 'react';
import { Shield, Users, AlertCircle, Map, LayoutGrid, Clock, Radar, Activity } from 'lucide-react';

export const MonitoringPage = () => {
  const [stats] = useState({
    activeGuards: 12,
    activeRondas: 4,
    criticalIncidents: 1,
    coverage: '98%'
  });

  useEffect(() => {
    // Real-time Simulation / Polling
    const interval = setInterval(() => {
      // Fetch data logic here
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 font-display">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black text-navy tracking-tighter uppercase italic">Centro de Monitoreo <span className="text-brand-blue">CustOS</span></h2>
          <div className="flex items-center gap-2 text-muted mt-2">
            <Activity size={16} className="text-emerald animate-pulse" />
            <span className="text-sm font-bold uppercase tracking-widest leading-none">Sistema en Línea / Tiempo Real</span>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="btn btn-secondary flex items-center gap-2">
            <Map size={18} /> Ver Mapa
          </button>
          <button className="btn btn-primary flex items-center gap-2">
            <LayoutGrid size={18} /> Grilla Total
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Vigiladores Activos', value: stats.activeGuards, icon: Users, color: 'text-brand-blue' },
          { label: 'Rondas en Curso', value: stats.activeRondas, icon: Radar, color: 'text-emerald' },
          { label: 'Alertas Críticas', value: stats.criticalIncidents, icon: AlertCircle, color: 'text-red-500' },
          { label: 'Cobertura Global', value: stats.coverage, icon: Shield, color: 'text-navy' }
        ].map((s, i) => (
          <div key={i} className="card p-6 border-b-4 border-b-brand-blue/20 hover:border-b-brand-blue transition-all group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-black text-muted uppercase tracking-widest mb-1">{s.label}</p>
                <h3 className={`text-4xl font-black ${s.color} group-hover:scale-105 transition-transform origin-left`}>{s.value}</h3>
              </div>
              <s.icon className={`${s.color} opacity-20`} size={32} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="section-header flex items-center justify-between">
            <h3 className="text-xl font-bold text-navy flex items-center gap-2">
              <Radar size={20} className="text-brand-blue" /> Rondas Activas
            </h3>
            <span className="text-xs text-muted font-mono uppercase">Actualizado hace 2s</span>
          </div>
          <div className="card divide-y border-surface/5 p-0 overflow-hidden">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="p-4 hover:bg-canvas transition-colors flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-brand-blue/10 rounded-lg flex items-center justify-center text-brand-blue">
                    <Users size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-navy text-sm">Objetivo {i + 1}: Puerto Madero</h4>
                    <p className="text-xs text-muted">Vigilador: Juan Perez • Iniciada 14:{20 + i * 5}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex gap-1">
                    {[1, 1, 1, 0, 0].map((dot, j) => (
                      <div key={j} className={`w-2 h-2 rounded-full ${dot ? 'bg-emerald shadow-[0_0_5px_theme(colors.emerald.DEFAULT)]' : 'bg-surface/20'}`} />
                    ))}
                  </div>
                  <span className="text-[10px] uppercase font-black text-muted tracking-tighter">Progreso: 60%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="section-header flex items-center justify-between">
            <h3 className="text-xl font-bold text-navy flex items-center gap-2">
              <AlertCircle size={20} className="text-red-500" /> Alertas Recientes
            </h3>
          </div>
          <div className="space-y-4">
            <div className="card bg-red-50 border-red-500/20 p-4 border-l-4 border-l-red-500 animate-pulse">
              <div className="flex gap-3">
                <div className="bg-red-500 text-white rounded p-1 h-fit">
                  <AlertCircle size={16} />
                </div>
                <div>
                  <h4 className="font-black text-red-900 text-xs uppercase tracking-tight">Incidente Crítico</h4>
                  <p className="text-xs text-red-800 mt-1">Puerta de Emergencia abierta sin autorización en Sector B.</p>
                  <p className="text-[10px] text-red-500 mt-1 font-mono">HACE 2 MINUTOS • PUESTO ALFA</p>
                </div>
              </div>
            </div>
            <div className="card p-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-muted border-b pb-2 mb-2">
                <span>Últimas Novedades</span>
                <Clock size={12} />
              </div>
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-blue mt-1.5 shrink-0" />
                  <div>
                    <span className="text-navy font-bold">Cambio de Guardia </span>
                    <span className="text-muted">en Objetivo Central. Todo en orden.</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
