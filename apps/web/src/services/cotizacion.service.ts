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
  items: CotizacionItem[];
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
};
