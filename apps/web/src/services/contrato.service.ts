import api from './api';
import { Contrato } from './objetivo.service';

export interface CreateContratoData {
  cliente_id?: string;
  cliente_nombre?: string;
  codigo?: string;
  objetivo_id?: string;
  inicio?: string;
  fin?: string;
  modo: 'POR_PLANIFICADO' | 'POR_REAL' | 'ABONO_FIJO';
  tarifa_hora?: number;
  abono_mensual?: number;
  redondeo_min?: number;
  penaliza_hueco?: boolean;
}

export type UpdateContratoData = Partial<CreateContratoData> & { estado?: string };

export const contratoService = {
  getByObjetivo: async (objetivoId: string): Promise<Contrato[]> => {
    const response = await api.get<Contrato[]>('/contratos', { params: { objetivoId } });
    return response.data;
  },

  getByCliente: async (clienteId: string): Promise<Contrato[]> => {
    const response = await api.get<Contrato[]>('/contratos', { params: { clienteId } });
    return response.data;
  },

  create: async (data: CreateContratoData): Promise<Contrato> => {
    const response = await api.post<Contrato>('/contratos', data);
    return response.data;
  },

  update: async (id: string, data: UpdateContratoData): Promise<Contrato> => {
    const response = await api.put<Contrato>(`/contratos/${id}`, data);
    return response.data;
  },

  getDocumentoHtml: async (id: string): Promise<string> => {
    const response = await api.get<{ html: string }>(`/contratos/${id}/documento-html`);
    return response.data.html;
  },

  generarDocumento: async (id: string, html: string): Promise<Blob> => {
    const response = await api.post(`/contratos/${id}/documento`, { html }, { responseType: 'blob' });
    return response.data;
  },

  descargarDocumento: async (id: string): Promise<Blob> => {
    const response = await api.get(`/contratos/${id}/documento`, { responseType: 'blob' });
    return response.data;
  },
};
