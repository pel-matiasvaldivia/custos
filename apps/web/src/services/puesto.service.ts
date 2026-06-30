import api from './api';
import { Puesto } from './objetivo.service';

export interface CreatePuestoData {
  objetivo_id: string;
  nombre: string;
  ubicacion?: string;
  requiere_arma?: boolean;
  requiere_movil?: boolean;
}

export const puestoService = {
  create: async (data: CreatePuestoData): Promise<Puesto> => {
    const response = await api.post<Puesto>('/puestos', data);
    return response.data;
  },
};
