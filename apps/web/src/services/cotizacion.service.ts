import api from './api';
import { Contrato } from './objetivo.service';

export interface CotizacionItem {
  id: string;
  puesto_nombre: string;
  horas_mensuales: number;
  costo_hora?: string;
  margen?: string;
  subtotal?: string;
}

export interface Cotizacion {
  id: string;
  tenant_id: string;
  cliente_id?: string | null;
  cliente_nombre: string;
  vencimiento: string;
  estado: 'BORRADOR' | 'ENVIADA' | 'ACEPTADA' | 'RECHAZADA';
  total_mensual?: string;
  documento_key?: string | null;
  documento_generado_at?: string | null;
  created_at: string;
  items: CotizacionItem[];
}

export interface CotizacionDocumentoEntry {
  id: string;
  version: number;
  documento_key: string;
  generado_at: string;
  notas: string | null;
}

export type EstadoCotizacion = 'ENVIADA' | 'ACEPTADA' | 'RECHAZADA';

export const cotizacionService = {
  getAll: async (): Promise<Cotizacion[]> => {
    const response = await api.get<{ data: Cotizacion[] }>('/cotizaciones');
    return response.data.data;
  },

  getOne: async (id: string): Promise<Cotizacion> => {
    const response = await api.get<Cotizacion>(`/cotizaciones/${id}`);
    return response.data;
  },

  cambiarEstado: async (
    id: string,
    estado: EstadoCotizacion,
  ): Promise<{ cotizacion: Cotizacion; contrato: Contrato | null }> => {
    const response = await api.patch<{ cotizacion: Cotizacion; contrato: Contrato | null }>(
      `/cotizaciones/${id}/estado`,
      { estado },
    );
    return response.data;
  },

  getDocumentoHtml: async (id: string): Promise<string> => {
    const response = await api.get<{ html: string }>(`/cotizaciones/${id}/documento-html`);
    return response.data.html;
  },

  generarDocumento: async (id: string, html: string): Promise<Blob> => {
    const response = await api.post(`/cotizaciones/${id}/documento`, { html }, { responseType: 'blob' });
    return response.data;
  },

  getVersiones: async (id: string): Promise<CotizacionDocumentoEntry[]> => {
    const response = await api.get<CotizacionDocumentoEntry[]>(`/cotizaciones/${id}/versiones`);
    return response.data;
  },

  descargarVersion: async (id: string, version: number): Promise<Blob> => {
    const response = await api.get(`/cotizaciones/${id}/versiones/${version}/documento`, { responseType: 'blob' });
    return response.data;
  },
};
