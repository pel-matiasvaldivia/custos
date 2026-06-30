import api from './api';
import { Vehiculo } from './objetivo.service';

export interface CreateVehiculoData {
  patente: string;
  codigo?: string;
  marca?: string;
  modelo?: string;
  year?: number;
  tipo?: string;
}

export const vehiculoService = {
  getAll: async (page = 1, limit = 200): Promise<Vehiculo[]> => {
    const response = await api.get<{ data: Vehiculo[] }>('/vehiculos', { params: { page, limit } });
    return response.data.data;
  },

  create: async (data: CreateVehiculoData): Promise<Vehiculo> => {
    const response = await api.post<Vehiculo>('/vehiculos', data);
    return response.data;
  },
};
