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
};
