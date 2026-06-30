import api from './api';
import { Puesto } from './objetivo.service';

export interface CreatePuestoData {
  objetivo_id: string;
  nombre: string;
  ubicacion?: string;
  lat?: number;
  lng?: number;
  requiere_arma?: boolean;
  requiere_movil?: boolean;
}

export const puestoService = {
  create: async (data: CreatePuestoData): Promise<Puesto> => {
    const response = await api.post<Puesto>('/puestos', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreatePuestoData>): Promise<Puesto> => {
    const response = await api.put<Puesto>(`/puestos/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/puestos/${id}`);
  },

  findAll: async (): Promise<Puesto[]> => {
    const response = await api.get<{ data: Puesto[]; total: number }>('/puestos', {
      params: { limit: 200 },
    });
    return response.data.data;
  },
};
