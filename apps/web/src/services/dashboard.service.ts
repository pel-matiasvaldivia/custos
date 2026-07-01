import api from './api';

export interface DashboardKpis {
  vigiladores_activos: number;
  credenciales_por_vencer: number;
  cobertura_hoy: number;
  turnos_hoy: number;
  turnos_cubiertos_hoy: number;
}

export const dashboardService = {
  kpis: async (): Promise<DashboardKpis> => {
    const res = await api.get<DashboardKpis>('/dashboard/kpis');
    return res.data;
  },
};
