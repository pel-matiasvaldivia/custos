import api from './api';

export interface Vigilador {
  id: string;
  legajo_nro: string;
  nombre: string;
  apellido: string;
  documento: string;
  estado: 'ACTIVO' | 'SUSPENDIDO' | 'BAJA';
}

export const vigilanteService = {
  getAll: async () => {
    const response = await api.get<Vigilador[]>('/vigilantes');
    return response.data;
  },
  
  getOne: async (id: string) => {
    const response = await api.get<Vigilador>(`/vigilantes/${id}`);
    return response.data;
  },

  create: async (data: Partial<Vigilador>) => {
    const response = await api.post<Vigilador>('/vigilantes', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Vigilador>) => {
    const response = await api.put<Vigilador>(`/vigilantes/${id}`, data);
    return response.data;
  },
};
