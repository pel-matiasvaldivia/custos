import { useEffect, useState } from 'react';
import { dashboardService, DashboardKpis } from '../../services/dashboard.service';

export const DashboardPage = () => {
  const [kpis, setKpis] = useState<DashboardKpis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService.kpis()
      .then(setKpis)
      .finally(() => setLoading(false));
  }, []);

  const val = (n: number | undefined, suffix = '') =>
    loading ? '…' : n === undefined ? '—' : `${n}${suffix}`;

  return (
    <div>
      <h2 className="text-3xl font-display font-bold text-navy mb-2">Bienvenido a CustOS</h2>
      <p className="text-muted text-lg">Resumen de operaciones y alertas rápidas.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="card">
          <h3 className="text-muted font-medium mb-1 uppercase text-xs tracking-wider">Vigiladores Activos</h3>
          <p className="text-4xl font-bold text-navy">{val(kpis?.vigiladores_activos)}</p>
        </div>
        <div className="card border-amber/20 bg-amber/5">
          <h3 className="text-amber font-medium mb-1 uppercase text-xs tracking-wider">Credenciales por Vencer</h3>
          <p className="text-4xl font-bold text-amber">{val(kpis?.credenciales_por_vencer)}</p>
        </div>
        <div className="card">
          <h3 className="text-muted font-medium mb-1 uppercase text-xs tracking-wider">Cobertura Hoy</h3>
          <p className="text-4xl font-bold text-emerald">{val(kpis?.cobertura_hoy, '%')}</p>
          {!loading && kpis && kpis.turnos_hoy > 0 && (
            <p className="text-xs text-muted mt-1">
              {kpis.turnos_cubiertos_hoy}/{kpis.turnos_hoy} turnos con asistencia
            </p>
          )}
          {!loading && kpis && kpis.turnos_hoy === 0 && (
            <p className="text-xs text-muted mt-1">Sin turnos planificados para hoy</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
