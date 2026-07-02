import api from './api';

export interface PuntoControl {
  id: string;
  puesto_id: string;
  nombre: string;
  codigo_qr: string | null;
  nfc_id: string | null;
  lat: number | null;
  lng: number | null;
  created_at: string;
}

export interface CreatePuntoControlDto {
  puesto_id: string;
  nombre: string;
  lat?: number;
  lng?: number;
}

export interface RondaPlantillaPunto {
  id: string;
  punto_control_id: string;
  orden: number;
  punto_control: PuntoControl & { puesto?: { id: string; nombre: string } };
}

export interface RondaPlantilla {
  id: string;
  objetivo_id: string;
  nombre: string;
  tolerancia_min: number | null;
  activa: boolean;
  created_at: string;
  puntos: RondaPlantillaPunto[];
}

export interface MarcaRonda {
  id: string;
  punto_control_id: string;
  timestamp: string;
  lat: number | null;
  lng: number | null;
  punto_control: PuntoControl;
}

export interface RondaEjecucion {
  id: string;
  nombre: string;
  estado: string; // EN_PROGRESO | COMPLETADA | INCOMPLETA
  hora_inicio: string;
  hora_fin: string | null;
  vigilador: { id: string; nombre: string; apellido: string };
  plantilla: RondaPlantilla | null;
  marcas: MarcaRonda[];
}

export const puntoControlService = {
  listarPorPuesto: async (puestoId: string): Promise<PuntoControl[]> => {
    const { data } = await api.get<PuntoControl[]>(`/rondas/checkpoints/${puestoId}`);
    return data;
  },

  crear: async (dto: CreatePuntoControlDto): Promise<PuntoControl> => {
    const payload = {
      ...dto,
      codigo_qr: crypto.randomUUID(),
    };
    const { data } = await api.post<PuntoControl>('/rondas/checkpoints', payload);
    return data;
  },

  // ─── Plantillas de ronda (rondas programadas del objetivo) ───

  listarPlantillas: async (objetivoId: string): Promise<RondaPlantilla[]> => {
    const { data } = await api.get<RondaPlantilla[]>('/rondas/plantillas', {
      params: { objetivoId },
    });
    return data;
  },

  crearPlantilla: async (dto: {
    objetivo_id: string;
    nombre: string;
    tolerancia_min?: number | null;
    puntos: { punto_control_id: string; orden: number }[];
  }): Promise<RondaPlantilla> => {
    const { data } = await api.post<RondaPlantilla>('/rondas/plantillas', dto);
    return data;
  },

  actualizarPlantilla: async (
    id: string,
    dto: {
      nombre?: string;
      tolerancia_min?: number | null;
      puntos?: { punto_control_id: string; orden: number }[];
    },
  ): Promise<RondaPlantilla> => {
    const { data } = await api.put<RondaPlantilla>(`/rondas/plantillas/${id}`, dto);
    return data;
  },

  desactivarPlantilla: async (id: string): Promise<void> => {
    await api.delete(`/rondas/plantillas/${id}`);
  },

  /** Evidencia: ejecuciones de ronda del objetivo con sus marcas. */
  listarEjecuciones: async (objetivoId: string): Promise<RondaEjecucion[]> => {
    const { data } = await api.get<RondaEjecucion[]>('/rondas/ejecuciones', {
      params: { objetivoId },
    });
    return data;
  },
};
