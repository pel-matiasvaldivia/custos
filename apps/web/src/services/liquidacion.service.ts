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
  hh_feriado: number;
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
  paga_feriado: boolean;
  items: LiquidacionItem[];
}

export interface ReglasLiquidacion {
  pagar_recargo_feriado: boolean;
  recargo_feriado_pct: number;
  adelanto_movil_habilitado: boolean;
  recargo_nocturno_pct: number;
  recargo_extra_pct: number;
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
  descargarPdf: async (desde: string, hasta: string, valorHoraDefault = 0): Promise<void> => {
    const res = await api.get('/liquidaciones/reporte/pdf', {
      params: { desde, hasta, valor_hora_default: valorHoraDefault },
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `liquidacion-${desde}_${hasta}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
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
  getReglas: async (): Promise<ReglasLiquidacion> => {
    const res = await api.get<ReglasLiquidacion>('/config/reglas-laborales');
    return res.data;
  },
  setReglas: async (reglas: Partial<ReglasLiquidacion>): Promise<ReglasLiquidacion> => {
    const res = await api.put<ReglasLiquidacion>('/config/reglas-laborales', reglas);
    return res.data;
  },
};
