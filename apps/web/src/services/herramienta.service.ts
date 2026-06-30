import api from './api';

export interface Herramienta {
  id: string;
  codigo: string;
  tipo: string;
  descripcion: string;
  numero_serie?: string | null;
  estado: 'DISPONIBLE' | 'ASIGNADA' | 'EN_REPARACION' | 'BAJA';
  foto_url?: string | null;
  asignaciones?: HerramientaAsignacion[];
}

export interface HerramientaAsignacion {
  id: string;
  herramienta_id: string;
  vigilador_id: string;
  entregada_el: string;
  devuelta_el?: string | null;
  herramienta?: Herramienta;
  vigilador?: { id: string; nombre: string; apellido: string };
}

export const TIPOS_HERRAMIENTA = [
  { value: 'CELULAR', label: 'Celular' },
  { value: 'LINTERNA', label: 'Linterna' },
  { value: 'CONO', label: 'Cono' },
  { value: 'CINTA_TRANSITO', label: 'Cinta de tránsito' },
  { value: 'RADIO', label: 'Radio' },
  { value: 'HANDIE', label: 'Handie' },
  { value: 'CHALECO', label: 'Chaleco' },
  { value: 'ARMA', label: 'Arma' },
  { value: 'OTRO', label: 'Otro' },
];

export const herramientaService = {
  getAll: async (): Promise<Herramienta[]> => {
    const response = await api.get('/herramientas', { params: { limit: 200 } });
    return response.data.data;
  },
  getDeVigilador: async (vigiladorId: string): Promise<HerramientaAsignacion[]> => {
    const response = await api.get(`/vigilantes/${vigiladorId}/herramientas`);
    return response.data;
  },
  create: async (data: { tipo: string; descripcion: string }): Promise<Herramienta> => {
    const response = await api.post('/herramientas', data);
    return response.data;
  },
  asignar: async (herramientaId: string, vigiladorId: string): Promise<void> => {
    await api.post(`/herramientas/${herramientaId}/asignar`, { vigilador_id: vigiladorId });
  },
  devolver: async (herramientaId: string): Promise<void> => {
    await api.post(`/herramientas/${herramientaId}/devolver`);
  },
  darDeBaja: async (herramientaId: string): Promise<Herramienta> => {
    const response = await api.post(`/herramientas/${herramientaId}/baja`);
    return response.data;
  },
};
