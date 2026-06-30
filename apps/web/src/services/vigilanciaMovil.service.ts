import mobileApi from './mobileApi';

export interface TurnoActual {
  id: string;
  inicio_plan: string;
  fin_plan: string;
  inicio_real: string | null;
  fin_real: string | null;
  estado: string;
  motivo: string | null;
  puesto: { id: string; nombre: string; ubicacion: string | null } | null;
  enCurso: boolean;
}

export interface Location {
  lat: number;
  lng: number;
}

export const vigilanciaMovilService = {
  turnoActual: async (): Promise<TurnoActual | null> => {
    const response = await mobileApi.get<TurnoActual | null>('/mobile/turno-actual');
    return response.data;
  },

  checkin: async (turnoId: string, metodo: string, location?: Location) => {
    const response = await mobileApi.post('/mobile/asistencia/checkin', { turnoId, metodo, location });
    return response.data;
  },

  checkout: async (turnoId: string, metodo: string, location?: Location) => {
    const response = await mobileApi.post('/mobile/asistencia/checkout', { turnoId, metodo, location });
    return response.data;
  },

  solicitarRelevo: async (turnoOriginalId: string, motivo?: string) => {
    const response = await mobileApi.post('/mobile/relevos', {
      turno_original_id: turnoOriginalId,
      motivo,
    });
    return response.data;
  },
};
