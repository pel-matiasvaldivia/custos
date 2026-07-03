import api from './api';

export interface EstadisticasInformes {
  rango: { desde: string; hasta: string };
  granularidad: 'DIA' | 'MES';
  kpis: {
    total: number;
    resueltos: number;
    tasaResolucion: number;
    tiempoMedioRespuestaMin: number | null;
    tiempoMedioResolucionMin: number | null;
  };
  frecuencia: { periodo: string; total: number }[];
  porTipo: { clave: string; total: number; porcentaje: number }[];
  porSeveridad: { clave: string; total: number; porcentaje: number }[];
}

const BASE = 'centro-operaciones/informes';

export const informesService = {
  async estadisticas(desde?: string, hasta?: string) {
    const { data } = await api.get<EstadisticasInformes>(`${BASE}/estadisticas`, {
      params: { desde: desde || undefined, hasta: hasta || undefined },
    });
    return data;
  },

  /** Descarga autenticada (blob) del reporte de incidentes. */
  async descargar(formato: 'pdf' | 'excel', desde?: string, hasta?: string) {
    const { data } = await api.get(`${BASE}/incidentes/${formato}`, {
      params: { desde: desde || undefined, hasta: hasta || undefined },
      responseType: 'blob',
    });
    const ext = formato === 'pdf' ? 'pdf' : 'xlsx';
    const url = URL.createObjectURL(data as Blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte-incidentes.${ext}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  },
};
