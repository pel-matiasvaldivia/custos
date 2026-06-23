import { useState } from 'react';
import { 
  FileText, 
  Download, 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  CheckCircle2,
  Clock,
  AlertTriangle
} from 'lucide-react';

export const ReportsPage = () => {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({ desde: '', hasta: '' });

  const downloadReport = async (format: 'pdf' | 'excel') => {
    setLoading(true);
    try {
      const url = `/api/v1/reports/incidentes/${format === 'pdf' ? 'pdf' : 'excel'}?desde=${dateRange.desde}&hasta=${dateRange.hasta}`;
      window.open(url, '_blank');
    } catch (err) {
      console.error('Error downloading report', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 font-display">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black text-navy tracking-tighter uppercase italic">
            Informes & <span className="text-brand-blue">Analítica</span>
          </h2>
          <p className="text-muted text-sm font-bold uppercase tracking-widest mt-1">Inteligencia de Negocios y Auditoría</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard 
          label="Incidentes Total (Mes)" 
          value="142" 
          change="+12%" 
          positive 
          icon={BarChart3} 
        />
        <KpiCard 
          label="Tiempo Medio de Respuesta" 
          value="4.2m" 
          change="-0.5m" 
          positive 
          icon={Clock} 
        />
        <KpiCard 
          label="Resolución en Primer Contacto" 
          value="88%" 
          change="+5%" 
          positive 
          icon={CheckCircle2} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Export Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card p-8 bg-slate-900 text-white rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/20 rounded-full blur-3xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700" />
            
            <h3 className="text-xl font-black italic uppercase tracking-tighter mb-6 flex items-center gap-2">
              <Download size={20} className="text-brand-blue" /> Exportar Datos
            </h3>

            <div className="space-y-4 relative z-10">
              <div>
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest block mb-2">Desde</label>
                <input 
                  type="date" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-blue/30 outline-none transition-all"
                  onChange={(e) => setDateRange(prev => ({ ...prev, desde: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest block mb-2">Hasta</label>
                <input 
                  type="date" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-blue/30 outline-none transition-all"
                  onChange={(e) => setDateRange(prev => ({ ...prev, hasta: e.target.value }))}
                />
              </div>

              <div className="pt-6 space-y-3">
                <button 
                  onClick={() => downloadReport('pdf')}
                  disabled={loading}
                  className="w-full bg-white text-navy py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <FileText size={16} /> Descargar PDF
                </button>
                <button 
                  onClick={() => downloadReport('excel')}
                  disabled={loading}
                  className="w-full bg-brand-blue text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-blue-dark transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <TrendingUp size={16} /> Exportar Excel
                </button>
              </div>
            </div>
          </div>

          <div className="card p-8 border-brand-blue/20 bg-brand-blue/5 rounded-[2.5rem]">
             <h4 className="text-xs font-black uppercase tracking-widest text-brand-blue mb-4">Informes Programados</h4>
             <p className="text-xs text-slate-500 leading-relaxed">
               Configure envíos automáticos de reportes a la gerencia todos los lunes a las 08:00 AM.
             </p>
             <button className="mt-4 text-xs font-black uppercase text-navy hover:text-brand-blue transition-colors flex items-center gap-2">
               Configurar Ahora <ChevronRight size={14} />
             </button>
          </div>
        </div>

        {/* Analytics Charts Mockup */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm min-h-[400px] flex flex-col">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-black italic uppercase tracking-tighter text-navy flex items-center gap-2">
                    <TrendingUp size={20} className="text-brand-blue" /> Frecuencia de Incidentes
                </h3>
                <div className="flex gap-2">
                   <button className="px-3 py-1.5 bg-slate-100 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-500">7D</button>
                   <button className="px-3 py-1.5 bg-slate-900 rounded-lg text-[10px] font-black uppercase tracking-widest text-white">30D</button>
                </div>
            </div>
            
            <div className="flex-1 flex items-end gap-3 px-4">
              {[40, 20, 60, 45, 90, 65, 30, 80, 50, 70, 40, 100].map((h, i) => (
                <div key={i} className="group relative flex-1">
                   <div 
                    className={`w-full rounded-t-lg transition-all duration-1000 ${i === 11 ? 'bg-brand-blue shadow-[0_0_15px_theme(colors.brand-blue.DEFAULT)]' : 'bg-slate-200 group-hover:bg-slate-300'}`} 
                    style={{ height: `${h}%` }} 
                   />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 px-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                <span>Ene</span>
                <span>Jun</span>
                <span>Dic</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                    <PieChart size={14} /> Distribución por Tipo
                </h4>
                <div className="space-y-4">
                    <StatusLine label="Intrusión" percent={65} color="bg-red-500" />
                    <StatusLine label="Pánico" percent={20} color="bg-orange-500" />
                    <StatusLine label="Técnico" percent={15} color="bg-brand-blue" />
                </div>
            </div>
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                    <AlertTriangle size={14} /> Severidad Promedio
                </h4>
                <div className="flex flex-col items-center justify-center h-full pb-6">
                    <div className="text-5xl font-black text-navy italic">8.4</div>
                    <div className="text-[10px] font-black text-red-500 uppercase tracking-widest mt-2">Nivel Crítico</div>
                </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

function KpiCard({ label, value, change, positive, icon: Icon }: any) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-xl transition-all">
      <div className="w-16 h-16 rounded-[2rem] bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-brand-blue group-hover:text-white transition-all shadow-inner">
        <Icon size={28} />
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-3xl font-black text-navy">{value}</h3>
          <span className={`text-[10px] font-black ${positive ? 'text-emerald' : 'text-red-500'}`}>{change}</span>
        </div>
      </div>
    </div>
  );
}

function StatusLine({ label, percent, color }: any) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-slate-600">{label}</span>
                <span className="text-slate-400">{percent}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full ${color} transition-all duration-1000`} style={{ width: `${percent}%` }} />
            </div>
        </div>
    )
}

function ChevronRight({ size, className }: any) {
    return <TrendingUp size={size} className={className} /> // Replaced because lack of import but actually TrendingUp is imported. 
}
