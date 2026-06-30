import api from './api';

export type TipoCredencial = 'CARNET_VIGILADOR' | 'PSICOFISICO' | 'ANTECEDENTES' | 'ANMAC' | 'CAPACITACION';

export interface Credencial {
  id: string;
  vigilador_id: string;
  tipo: TipoCredencial;
  numero?: string | null;
  organismo?: string | null;
  emitida_el?: string | null;
  vence_el?: string | null;
  documento_url?: string | null;
  created_at: string;
}

export interface CreateCredencialData {
  tipo: TipoCredencial;
  numero?: string;
  organismo?: string;
  emitida_el?: string;
  vence_el?: string;
  archivo?: File;
}

export const credencialService = {
  getByVigilador: async (vigiladorId: string): Promise<Credencial[]> => {
    const response = await api.get<Credencial[]>(`/vigilantes/${vigiladorId}/credenciales`);
    return response.data;
  },

  create: async (vigiladorId: string, data: CreateCredencialData): Promise<Credencial> => {
    const form = new FormData();
    form.append('tipo', data.tipo);
    if (data.numero) form.append('numero', data.numero);
    if (data.organismo) form.append('organismo', data.organismo);
    if (data.emitida_el) form.append('emitida_el', data.emitida_el);
    if (data.vence_el) form.append('vence_el', data.vence_el);
    if (data.archivo) form.append('file', data.archivo);
    const response = await api.post<Credencial>(`/vigilantes/${vigiladorId}/credenciales`, form);
    return response.data;
  },
};
