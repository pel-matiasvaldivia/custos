import mobileApi from './mobileApi';
import { enqueue, OutboxFile } from '../offline/outbox';
import { mobileAuthService } from './mobileAuth.service';

// En modo dispositivo agrega el vigilador que opera; en modo personal es
// undefined y el backend usa el vigilador del token.
const conActor = (body: Record<string, unknown>): Record<string, unknown> => {
  const vigiladorId = mobileAuthService.vigiladorIdParaAccion();
  return vigiladorId ? { ...body, vigiladorId } : body;
};

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
  tolerancia_min: number | null;
  puntos: RondaPuntoMovil[];
  ejecucion: {
    id: string;
    estado: string;
    hora_inicio: string;
    hora_fin: string | null;
  } | null;
}

export interface VigiladorObjetivo {
  id: string;
  nombre: string;
  apellido: string;
  legajo_nro: string | null;
  estado_turno: 'EN_TURNO' | 'PROXIMO' | 'SIN_TURNO';
  turno: {
    id: string;
    inicio_plan: string;
    fin_plan: string;
    inicio_real: string | null;
    fin_real: string | null;
  } | null;
}

export const vigilanciaMovilService = {
  // Vigiladores asignados al objetivo del dispositivo (selector "¿Quién sos?").
  vigiladoresDelObjetivo: async (): Promise<VigiladorObjetivo[]> => {
    const response = await mobileApi.get<VigiladorObjetivo[]>('/mobile/objetivo/vigiladores');
    return response.data;
  },

  turnoActual: async (): Promise<TurnoActual | null> => {
    const vigiladorId = mobileAuthService.vigiladorIdParaAccion();
    const response = await mobileApi.get<TurnoActual | null>('/mobile/turno-actual', {
      params: vigiladorId ? { vigiladorId } : undefined,
    });
    return response.data;
  },

  // Escrituras críticas → van por la cola offline (se envían al backend con
  // idempotencia y el timestamp del dispositivo; funcionan sin señal).
  checkin: async (turnoId: string, metodo: string, location?: Location) => {
    return enqueue('checkin', '/mobile/asistencia/checkin', conActor({ turnoId, metodo, location }));
  },

  checkout: async (turnoId: string, metodo: string, location?: Location) => {
    return enqueue('checkout', '/mobile/asistencia/checkout', conActor({ turnoId, metodo, location }));
  },

  panic: async (location?: Location) => {
    return enqueue('panic', '/mobile/panic', conActor({ location }));
  },

  checkpoint: async (checkpointId: string, location?: Location) => {
    return enqueue('checkpoint', '/mobile/checkpoint', conActor({ checkpointId, location }));
  },

  rondas: async (): Promise<RondaMovil[]> => {
    const vigiladorId = mobileAuthService.vigiladorIdParaAccion();
    const response = await mobileApi.get<RondaMovil[]>('/mobile/rondas', {
      params: vigiladorId ? { vigiladorId } : undefined,
    });
    return response.data;
  },

  iniciarRonda: async (plantillaId: string) => {
    return enqueue('ronda_inicio', '/mobile/rondas/iniciar', conActor({ plantillaId }));
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
    adelanto?: { monto: number; cuotas: number },
  ) => {
    const files: OutboxFile[] = adjuntos.map((a) => ({
      field: 'media',
      filename: a.filename,
      blob: a.blob,
    }));
    const payload: Record<string, unknown> = { tipo, descripcion, prioridad };
    if (adelanto) {
      payload.monto = adelanto.monto;
      payload.cuotas = adelanto.cuotas;
    }
    return enqueue('novedad', '/mobile/novedades', conActor(payload), files);
  },

  solicitarRelevo: async (turnoOriginalId: string, motivo?: string) => {
    const response = await mobileApi.post('/mobile/relevos', conActor({
      turno_original_id: turnoOriginalId,
      motivo,
    }));
    return response.data;
  },
};
