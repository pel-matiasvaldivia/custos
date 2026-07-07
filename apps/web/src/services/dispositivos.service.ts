import api from './api';

export interface Dispositivo {
  id: string;
  tipo: string;
  protocolo: string;
  marca?: string | null;
  modelo?: string | null;
  nro_abonado?: string | null;
  estado: string;
  ultimo_latido?: string | null;
  ingest_token?: string | null;
  objetivo?: { id: string; nombre: string } | null;
  _count?: { canales: number };
}

export interface Canal {
  id: string;
  dispositivo_id: string;
  numero_canal: number;
  nombre?: string | null;
  rtsp_path?: string | null;
  tiene_ptz: boolean;
  habilitado: boolean;
}

export interface ZonaConCanal {
  id: string;
  numero_zona: string;
  descripcion: string;
  tipo: string;
  canal_id: string | null;
  canal?: { id: string; numero_canal: number; nombre?: string | null } | null;
}

export interface PruebaConexion {
  ok: boolean;
  deviceName?: string;
  model?: string;
  serialNumber?: string;
  firmwareVersion?: string;
  error?: string;
}

export interface ConexionInput {
  ip: string;
  puerto_http?: number;
  puerto_rtsp?: number;
  usuario: string;
  password: string;
  https?: boolean;
}

export interface StreamInfo {
  disponible: boolean;
  canal?: string;
  canalId?: string | null;
  dispositivoId?: string;
  numeroCanal?: number;
  tienePtz?: boolean;
  snapshotUrl?: string;
  whepUrl?: string;
  canales?: { id: string; numero_canal: number; nombre?: string | null }[];
}

const BASE = '/centro-operaciones';

export const dispositivosService = {
  listar: async (): Promise<Dispositivo[]> => {
    const { data } = await api.get<Dispositivo[]>(`${BASE}/dispositivos`);
    return data;
  },

  probar: async (input: ConexionInput): Promise<PruebaConexion> => {
    const { data } = await api.post<PruebaConexion>(
      `${BASE}/dispositivos/probar`,
      input,
    );
    return data;
  },

  crear: async (
    input: ConexionInput & {
      objetivo_id: string;
      tipo: string;
      modelo?: string;
      nro_abonado?: string;
    },
  ): Promise<Dispositivo> => {
    const { data } = await api.post<Dispositivo>(`${BASE}/dispositivos`, input);
    return data;
  },

  actualizar: async (
    id: string,
    input: Partial<ConexionInput> & { modelo?: string; en_prueba?: boolean },
  ) => {
    const { data } = await api.put(`${BASE}/dispositivos/${id}`, input);
    return data;
  },

  eliminar: async (id: string) => {
    const { data } = await api.delete(`${BASE}/dispositivos/${id}`);
    return data;
  },

  descubrirCanales: async (id: string): Promise<Canal[]> => {
    const { data } = await api.post<Canal[]>(
      `${BASE}/dispositivos/${id}/descubrir`,
    );
    return data;
  },

  getCanales: async (id: string): Promise<Canal[]> => {
    const { data } = await api.get<Canal[]>(`${BASE}/dispositivos/${id}/canales`);
    return data;
  },

  getZonas: async (id: string): Promise<ZonaConCanal[]> => {
    const { data } = await api.get<ZonaConCanal[]>(
      `${BASE}/dispositivos/${id}/zonas`,
    );
    return data;
  },

  mapearZona: async (zona_id: string, canal_id: string | null) => {
    const { data } = await api.post(`${BASE}/zonas/mapear`, { zona_id, canal_id });
    return data;
  },

  // === Video verificación ===
  getStream: async (incidentId: string): Promise<StreamInfo> => {
    const { data } = await api.get<StreamInfo>(
      `${BASE}/video/stream/${incidentId}`,
    );
    return data;
  },

  ptz: async (
    incidentId: string,
    mov: { pan?: number; tilt?: number; zoom?: number },
  ) => {
    const { data } = await api.post(`${BASE}/video/ptz/${incidentId}`, mov);
    return data;
  },

  /** Señalización WHEP: envía el SDP offer y devuelve el answer (texto). */
  whep: async (incidentId: string, sdpOffer: string): Promise<string> => {
    const { data } = await api.post<string>(
      `${BASE}/video/whep/${incidentId}`,
      sdpOffer,
      {
        headers: { 'Content-Type': 'application/sdp' },
        responseType: 'text',
        transformRequest: [(d) => d],
      },
    );
    return data;
  },

  /**
   * Descarga autenticada del snapshot (el endpoint exige JWT, así que un <img src>
   * directo no sirve). Devuelve un object URL para usar en <img>; recordá revocarlo.
   */
  snapshot: async (incidentId: string): Promise<string> => {
    const { data } = await api.get(`${BASE}/video/snapshot/${incidentId}`, {
      responseType: 'blob',
    });
    return URL.createObjectURL(data as Blob);
  },
};
