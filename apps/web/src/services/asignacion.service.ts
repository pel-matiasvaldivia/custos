import api from './api';
import { Puesto } from './objetivo.service';
import { Vigilador } from './vigilante.service';

export interface Asignacion {
  id: string;
  puesto_id: string;
  vigilador_id?: string | null;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  estado: 'PENDIENTE' | 'ASIGNADO' | string;
  puesto: Puesto;
  vigilador?: Vigilador | null;
}

export interface CreateAsignacionData {
  puesto_id: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
}

export const asignacionService = {
  getByObjetivo: async (objetivoId: string, desde: string, hasta: string): Promise<Asignacion[]> => {
    const response = await api.get<Asignacion[]>('/asignaciones', {
      params: { objetivoId, desde, hasta },
    });
    return response.data;
  },

  create: async (data: CreateAsignacionData): Promise<Asignacion> => {
    const response = await api.post<Asignacion>('/asignaciones', data);
    return response.data;
  },

  asignarVigilador: async (asignacionId: string, vigiladorId: string): Promise<Asignacion> => {
    const response = await api.put<Asignacion>(`/asignaciones/${asignacionId}/vigilador`, {
      vigilador_id: vigiladorId,
    });
    return response.data;
  },

  liberar: async (asignacionId: string): Promise<Asignacion> => {
    const response = await api.delete<Asignacion>(`/asignaciones/${asignacionId}/vigilador`);
    return response.data;
  },

  eliminar: async (asignacionId: string): Promise<void> => {
    await api.delete(`/asignaciones/${asignacionId}`);
  },
};
