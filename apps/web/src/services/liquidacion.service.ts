import api from './api';

export interface LiquidacionItem {
  vigilador_id: string;
  legajo: string;
  nombre: string;
  apellido: string;
  valor_hora: number;
  turnos: number;
  hh_planificadas: number;
  hh_trabajadas: number;
  hh_ausentes: number;
  hh_nocturnas: number;
  hh_extra: number;
  llegadas_tarde: number;
  llegadas_tarde_min: number;
  suspension_dias: number;
  bruto: number;
  descuentos: number;
  adelanto_desc: number;
  neto: number;
}

export interface LiquidacionComputo {
  modo: string;
  con_montos: boolean;
  items: LiquidacionItem[];
}

export interface LiquidacionResumen {
  id: string;
  periodo_desde: string;
  periodo_hasta: string;
  modo: string;
  estado: string;
  total_neto: string;
  created_at: string;
}

export const liquidacionService = {
  computar: async (desde: string, hasta: string, valorHoraDefault = 0): Promise<LiquidacionComputo> => {
    const res = await api.get<LiquidacionComputo>('/liquidaciones', {
      params: { desde, hasta, valor_hora_default: valorHoraDefault },
    });
    return res.data;
  },
  cerrar: async (desde: string, hasta: string, valorHoraDefault = 0): Promise<LiquidacionResumen> => {
    const res = await api.post<LiquidacionResumen>('/liquidaciones/cerrar', {
      desde, hasta, valor_hora_default: valorHoraDefault,
    });
    return res.data;
  },
  historial: async (): Promise<LiquidacionResumen[]> => {
    const res = await api.get<LiquidacionResumen[]>('/liquidaciones/historial');
    return res.data;
  },
  getConfig: async (): Promise<{ modo: string }> => {
    const res = await api.get<{ modo: string }>('/liquidaciones/config');
    return res.data;
  },
  setModo: async (modo: string): Promise<{ modo: string }> => {
    const res = await api.post<{ modo: string }>('/liquidaciones/config', { modo });
    return res.data;
  },
};
