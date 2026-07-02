import mobileApi from './mobileApi';
import { enqueue, OutboxFile } from '../offline/outbox';

export interface NovedadTipo {
  id: string | null;
  codigo: string;
  etiqueta: string;
  esDefault: boolean;
}

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

export interface RondaPuntoMovil {
  id: string;
  nombre: string;
  codigo_qr: string | null;
  orden: number;
  marcada: string | null;
}

export interface RondaMovil {
  id: string;
  nombre: string;
  puntos: RondaPuntoMovil[];
  ejecucion: {
    id: string;
    estado: string;
    hora_inicio: string;
    hora_fin: string | null;
  } | null;
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

  rondas: async (): Promise<RondaMovil[]> => {
    const response = await mobileApi.get<RondaMovil[]>('/mobile/rondas');
    return response.data;
  },

  iniciarRonda: async (plantillaId: string) => {
    return enqueue('ronda_inicio', '/mobile/rondas/iniciar', { plantillaId });
  },

  novedadTipos: async (): Promise<NovedadTipo[]> => {
    const response = await mobileApi.get<NovedadTipo[]>('/mobile/novedad-tipos');
    return response.data;
  },

  crearNovedad: async (
    tipo: string,
    descripcion: string,
    prioridad: string,
    adjuntos: { blob: Blob; filename: string }[],
  ) => {
    const files: OutboxFile[] = adjuntos.map((a) => ({
      field: 'media',
      filename: a.filename,
      blob: a.blob,
    }));
    return enqueue('novedad', '/mobile/novedades', { tipo, descripcion, prioridad }, files);
  },

  solicitarRelevo: async (turnoOriginalId: string, motivo?: string) => {
    const response = await mobileApi.post('/mobile/relevos', {
      turno_original_id: turnoOriginalId,
      motivo,
    });
    return response.data;
  },
};
