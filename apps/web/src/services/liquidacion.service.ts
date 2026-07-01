import api from './api';

export interface LiquidacionItem {
  vigilador_id: string;
  legajo: string;
  nombre: string;
  apellido: string;
  turnos: number;
  hh_planificadas: number;
  hh_trabajadas: number;
  hh_ausentes: number;
  hh_nocturnas: number;
  hh_extra: number;
  llegadas_tarde: number;
  llegadas_tarde_min: number;
  suspension_dias: number;
  adelanto_monto: number;
}

export const liquidacionService = {
  computar: async (desde: string, hasta: string): Promise<LiquidacionItem[]> => {
    const res = await api.get<LiquidacionItem[]>('/liquidaciones', { params: { desde, hasta } });
    return res.data;
  },
};
