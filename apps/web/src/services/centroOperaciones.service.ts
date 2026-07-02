import api from './api';

export interface BitacoraEntrada {
  id: string;
  ts: string;
  accion: string;
  actor_nombre: string | null;
  detalle: Record<string, unknown>;
}

export interface IncidenteDetalle {
  id: string;
  codigo: string;
  tipo: string;
  severidad: string;
  estado: string;
  resumen: string | null;
  disposicion: string | null;
  abierto_el: string;
  tomado_el: string | null;
  despachado_el: string | null;
  resuelto_el: string | null;
  objetivo?: { id: string; nombre: string; direccion: string | null } | null;
  bitacora: BitacoraEntrada[];
}

export const centroOperacionesService = {
  obtenerIncidente: async (id: string): Promise<IncidenteDetalle> => {
    const { data } = await api.get<IncidenteDetalle>(`/centro-operaciones/incidentes/${id}`);
    return data;
  },
  tomar: async (id: string) => {
    const { data } = await api.post(`/centro-operaciones/incidentes/${id}/tomar`);
    return data;
  },
  verificar: async (id: string, metodo: string, nota?: string) => {
    const { data } = await api.post(`/centro-operaciones/incidentes/${id}/verificar`, { metodo, nota });
    return data;
  },
  despachar: async (id: string, destino: string, nota?: string) => {
    const { data } = await api.post(`/centro-operaciones/incidentes/${id}/despachar`, { destino, nota });
    return data;
  },
  nota: async (id: string, nota: string) => {
    const { data } = await api.post(`/centro-operaciones/incidentes/${id}/nota`, { nota });
    return data;
  },
  resolver: async (id: string, disposicion: string, resumen: string) => {
    const { data } = await api.post(`/centro-operaciones/incidentes/${id}/resolver`, { disposicion, resumen });
    return data;
  },
};
