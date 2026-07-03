import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FileText,
  Download,
  BarChart3,
  PieChart,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import {
  informesService,
  type EstadisticasInformes,
} from '../../services/informes.service';

function isoHaceDias(dias: number) {
  return new Date(Date.now() - dias * 86400000).toISOString().slice(0, 10);
}

/** Minutos -> "4.2m" / "1.3h"; null -> "—". */
function fmtDuracion(min: number | null) {
  if (min == null) return '—';
  if (min < 60) return `${min}m`;
  return `${(min / 60).toFixed(1)}h`;
}

const SEVERIDAD_COLOR: Record<string, string> = {
  CRITICA: 'bg-red-500',
  ALTA: 'bg-orange-500',
  MEDIA: 'bg-amber-400',
  BAJA: 'bg-brand-blue',
};

const PALETA = [
  'bg-red-500',
  'bg-orange-500',
  'bg-brand-blue',
  'bg-emerald-500',
  'bg-violet-500',
  'bg-slate-400',
];

export const ReportsPage = () => {
  const [desde, setDesde] = useState(isoHaceDias(30));
  const [hasta, setHasta] = useState(isoHaceDias(0));
  const [stats, setStats] = useState<EstadisticasInformes | null>(null);
  const [loading, setLoading] = useState(true);
  const [descargando, setDescargando] = useState<'pdf' | 'excel' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setStats(await informesService.estadisticas(desde, hasta));
    } catch {
      setError('No se pudieron cargar las estadísticas del período.');
    } finally {
      setLoading(false);
    }
  }, [desde, hasta]);

  useEffect(() => {
    cargar();
    // Solo en el montaje inicial; los cambios de rango se aplican con el botón.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const descargar = async (formato: 'pdf' | 'excel') => {
    setDescargando(formato);
    setError(null);
    try {
      await informesService.descargar(formato, desde, hasta);
    } catch {
      setError('No se pudo generar el reporte. Intente nuevamente.');
    } finally {
      setDescargando(null);
    }
  };

  const maxFrecuencia = useMemo(
    () => Math.max(1, ...(stats?.frecuencia.map((f) => f.total) ?? [0])),
    [stats],
  );

  const kpis = stats?.kpis;

  return (
    <div className="space-y-8 font-display">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-4xl font-black text-navy tracking-tighter uppercase italic">
            Informes & <span className="text-brand-blue">Analítica</span>
          </h2>
          <p className="text-muted text-sm font-bold uppercase tracking-widest mt-1">
            Inteligencia de Negocios y Auditoría
          </p>
        </div>
        {stats && (
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {stats.rango.desde} → {stats.rango.hasta}
          </span>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-6 py-4 text-xs font-bold uppercase tracking-widest">
          {error}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KpiCard
          label="Incidentes (Período)"
          value={loading ? '…' : String(kpis?.total ?? 0)}
          icon={BarChart3}
        />
        <KpiCard
          label="Tasa de Resolución"
          value={loading ? '…' : `${kpis?.tasaResolucion ?? 0}%`}
          icon={CheckCircle2}
        />
        <KpiCard
          label="T. Medio de Respuesta"
          value={loading ? '…' : fmtDuracion(kpis?.tiempoMedioRespuestaMin ?? null)}
          icon={Clock}
        />
        <KpiCard
          label="T. Medio de Resolución"
          value={loading ? '…' : fmtDuracion(kpis?.tiempoMedioResolucionMin ?? null)}
          icon={TrendingUp}
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
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest block mb-2">
                  Desde
                </label>
                <input
                  type="date"
                  value={desde}
                  max={hasta}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-blue/30 outline-none transition-all"
                  onChange={(e) => setDesde(e.target.value)}
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest block mb-2">
                  Hasta
                </label>
                <input
                  type="date"
                  value={hasta}
                  min={desde}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-blue/30 outline-none transition-all"
                  onChange={(e) => setHasta(e.target.value)}
                />
              </div>

              <button
                onClick={cargar}
                disabled={loading}
                className="w-full bg-white/10 border border-white/10 text-white py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/20 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : null}
                Aplicar Filtros
              </button>

              <div className="pt-4 space-y-3 border-t border-white/10">
                <button
                  onClick={() => descargar('pdf')}
                  disabled={descargando !== null}
                  className="w-full bg-white text-navy py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {descargando === 'pdf' ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <FileText size={16} />
                  )}{' '}
                  Descargar PDF
                </button>
                <button
                  onClick={() => descargar('excel')}
                  disabled={descargando !== null}
                  className="w-full bg-brand-blue text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-blue-dark transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {descargando === 'excel' ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <TrendingUp size={16} />
                  )}{' '}
                  Exportar Excel
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm min-h-[360px] flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-black italic uppercase tracking-tighter text-navy flex items-center gap-2">
                <TrendingUp size={20} className="text-brand-blue" /> Frecuencia de
                Incidentes
              </h3>
              <span className="px-3 py-1.5 bg-slate-900 rounded-lg text-[10px] font-black uppercase tracking-widest text-white">
                {stats?.granularidad === 'MES' ? 'Por mes' : 'Por día'}
              </span>
            </div>

            {loading ? (
              <div className="flex-1 flex items-center justify-center text-slate-300">
                <Loader2 size={28} className="animate-spin" />
              </div>
            ) : !stats || stats.frecuencia.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-xs font-black uppercase tracking-widest text-slate-300">
                Sin incidentes en el período
              </div>
            ) : (
              <>
                <div className="flex-1 flex items-end gap-2 px-1 min-h-[200px]">
                  {stats.frecuencia.map((f) => (
                    <div
                      key={f.periodo}
                      className="group relative flex-1 flex flex-col justify-end"
                      title={`${f.periodo}: ${f.total}`}
                    >
                      <span className="text-center text-[9px] font-black text-slate-400 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {f.total}
                      </span>
                      <div
                        className="w-full rounded-t-lg bg-slate-200 group-hover:bg-brand-blue transition-all duration-500"
                        style={{
                          height: `${Math.max(4, (f.total / maxFrecuencia) * 100)}%`,
                        }}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-4 px-1 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                  <span>{stats.frecuencia[0]?.periodo}</span>
                  <span>
                    {stats.frecuencia[stats.frecuencia.length - 1]?.periodo}
                  </span>
                </div>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                <PieChart size={14} /> Distribución por Tipo
              </h4>
              <Distribucion
                loading={loading}
                items={stats?.porTipo}
                colorPara={(_, i) => PALETA[i % PALETA.length]}
              />
            </div>
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                <AlertTriangle size={14} /> Distribución por Severidad
              </h4>
              <Distribucion
                loading={loading}
                items={stats?.porSeveridad}
                colorPara={(clave, i) =>
                  SEVERIDAD_COLOR[clave] ?? PALETA[i % PALETA.length]
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function KpiCard({ label, value, icon: Icon }: any) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4 group hover:shadow-xl transition-all">
      <div className="w-14 h-14 rounded-[1.5rem] bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-brand-blue group-hover:text-white transition-all shadow-inner shrink-0">
        <Icon size={24} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 truncate">
          {label}
        </p>
        <h3 className="text-2xl font-black text-navy">{value}</h3>
      </div>
    </div>
  );
}

function Distribucion({
  loading,
  items,
  colorPara,
}: {
  loading: boolean;
  items?: { clave: string; total: number; porcentaje: number }[];
  colorPara: (clave: string, index: number) => string;
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-6 text-slate-300">
        <Loader2 size={20} className="animate-spin" />
      </div>
    );
  }
  if (!items || items.length === 0) {
    return (
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 py-6 text-center">
        Sin datos
      </p>
    );
  }
  return (
    <div className="space-y-4">
      {items.map((it, i) => (
        <div key={it.clave} className="space-y-2">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
            <span className="text-slate-600">{it.clave}</span>
            <span className="text-slate-400">
              {it.total} · {it.porcentaje}%
            </span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full ${colorPara(it.clave, i)} transition-all duration-700`}
              style={{ width: `${it.porcentaje}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
