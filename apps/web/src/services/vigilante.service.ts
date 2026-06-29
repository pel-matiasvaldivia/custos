import api from './api';

export interface Vigilador {
  id: string;
  legajo_nro: string;
  nombre: string;
  apellido: string;
  documento: string;
  estado: 'ACTIVO' | 'SUSPENDIDO' | 'BAJA';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export const vigilanteService = {
  getAll: async (page = 1, limit = 50): Promise<Vigilador[]> => {
    const response = await api.get<PaginatedResponse<Vigilador>>('/vigilantes', {
      params: { page, limit },
    });
    return response.data.data;
  },

  getOne: async (id: string): Promise<Vigilador> => {
    const response = await api.get<Vigilador>(`/vigilantes/${id}`);
    return response.data;
  },

  create: async (data: Partial<Vigilador>): Promise<Vigilador> => {
    const response = await api.post<Vigilador>('/vigilantes', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Vigilador>): Promise<Vigilador> => {
    const response = await api.put<Vigilador>(`/vigilantes/${id}`, data);
    return response.data;
  },
};
