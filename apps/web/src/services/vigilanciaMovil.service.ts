import mobileApi from './mobileApi';
import { enqueue } from '../offline/outbox';

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

  // Escrituras críticas → van por la cola offline (se envían al backend con
  // idempotencia y el timestamp del dispositivo; funcionan sin señal).
  checkin: async (turnoId: string, metodo: string, location?: Location) => {
    return enqueue('checkin', '/mobile/asistencia/checkin', { turnoId, metodo, location });
  },

  checkout: async (turnoId: string, metodo: string, location?: Location) => {
    return enqueue('checkout', '/mobile/asistencia/checkout', { turnoId, metodo, location });
  },

  panic: async (location?: Location) => {
    return enqueue('panic', '/mobile/panic', { location });
  },

  checkpoint: async (checkpointId: string, location?: Location) => {
    return enqueue('checkpoint', '/mobile/checkpoint', { checkpointId, location });
  },

  solicitarRelevo: async (turnoOriginalId: string, motivo?: string) => {
    const response = await mobileApi.post('/mobile/relevos', {
      turno_original_id: turnoOriginalId,
      motivo,
    });
    return response.data;
  },
};
