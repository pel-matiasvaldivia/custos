import api from './api';

export interface RelevoPendiente {
  id: string;
  inicioPlan: string;
  finPlan: string;
  motivo: string | null;
  vigiladorId: string;
  vigilador: { id: string; nombre: string; apellido: string; legajo_nro: string } | null;
  puestoId: string;
  puestoNombre: string | null;
}

export interface CandidatoRelevo {
  vigilador: { id: string; nombre: string; apellido: string; legajo_nro: string };
  disponible: boolean;
  errores: string[];
}

export const relevoService = {
  listarPendientes: async (): Promise<RelevoPendiente[]> => {
    const response = await api.get<RelevoPendiente[]>('/relevos/pendientes');
    return response.data;
  },

  sugerirCandidatos: async (turnoId: string): Promise<CandidatoRelevo[]> => {
    const response = await api.get<CandidatoRelevo[]>(`/relevos/${turnoId}/candidatos`);
    return response.data;
  },

  aprobar: async (turnoId: string, vigiladorRelevistaId: string) => {
    const response = await api.post(`/relevos/${turnoId}/aprobar`, {
      vigilador_relevista_id: vigiladorRelevistaId,
    });
    return response.data;
  },

  rechazar: async (turnoId: string) => {
    const response = await api.post(`/relevos/${turnoId}/rechazar`);
    return response.data;
  },
};
