import api from './api';

export interface DashboardKpis {
  vigiladores_activos: number;
  credenciales_por_vencer: number;
  cobertura_hoy: number;
  turnos_hoy: number;
  turnos_cubiertos_hoy: number;
}

export interface OnboardingProgress {
  tiene_personal: boolean;
  tiene_clientes: boolean;
  tiene_objetivos: boolean;
  tiene_puestos: boolean;
  tiene_esquemas: boolean;
  tiene_cuadrante: boolean;
  tiene_cotizaciones: boolean;
}

export const dashboardService = {
  kpis: async (): Promise<DashboardKpis> => {
    const res = await api.get<DashboardKpis>('/dashboard/kpis');
    return res.data;
  },

  onboarding: async (): Promise<OnboardingProgress> => {
    const res = await api.get<OnboardingProgress>('/dashboard/onboarding');
    return res.data;
  },
};
