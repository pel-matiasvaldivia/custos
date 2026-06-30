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
  findAll: async (): Promise<Puesto[]> => {
    const response = await api.get<{ data: Puesto[]; total: number }>('/puestos', {
      params: { limit: 200 },
    });
    return response.data.data;
  },
};
