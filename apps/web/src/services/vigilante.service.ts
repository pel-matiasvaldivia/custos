import api from './api';

export type VigiladorEstado = 'ACTIVO' | 'PE' | 'SP' | 'VC' | 'LC' | 'BAJA';

/** Estados de personal, su etiqueta legible, color de badge y si permite afectación a un puesto. */
export const ESTADO_META: Record<
  string,
  { label: string; badge: 'ok' | 'alert' | 'muted'; disponible: boolean; descripcion: string }
> = {
  ACTIVO: { label: 'Activo', badge: 'ok', disponible: true, descripcion: 'Disponible para asignar a un puesto.' },
  PE: { label: 'Parte de Enfermo', badge: 'alert', disponible: false, descripcion: 'De licencia por enfermedad. No disponible.' },
  SP: { label: 'Suspendido', badge: 'alert', disponible: false, descripcion: 'Suspensión disciplinaria. No disponible.' },
  VC: { label: 'Vacaciones', badge: 'muted', disponible: false, descripcion: 'De vacaciones. No disponible.' },
  LC: { label: 'Licencia Especial', badge: 'muted', disponible: false, descripcion: 'Licencia especial (paternidad, familiar enfermo, etc.). No disponible.' },
  BAJA: { label: 'Baja', badge: 'alert', disponible: false, descripcion: 'Desvinculado. No disponible.' },
  // Alias legacy
  SUSPENDIDO: { label: 'Suspendido', badge: 'alert', disponible: false, descripcion: 'Suspensión. No disponible.' },
  INACTIVO: { label: 'Inactivo', badge: 'muted', disponible: false, descripcion: 'Inactivo. No disponible.' },
};

/** Estados ofrecidos en los selectores de la UI (los canónicos). */
export const ESTADOS_SELECCIONABLES: VigiladorEstado[] = ['ACTIVO', 'PE', 'SP', 'VC', 'LC', 'BAJA'];

export const estadoMeta = (estado: string) =>
  ESTADO_META[estado] ?? { label: estado, badge: 'muted' as const, disponible: false, descripcion: '' };

export interface Vigilador {
  id: string;
  legajo_nro: string;
  nombre: string;
  apellido: string;
  documento: string;
  estado: string;
  foto_url?: string | null;
  domicilio?: string | null;
  localidad?: string | null;
  provincia?: string | null;
  codigo_postal?: string | null;
  telefono?: string | null;
  contacto_emerg_nombre?: string | null;
  contacto_emerg_telefono?: string | null;
  contacto_emerg_vinculo?: string | null;
  completitud?: 'INCOMPLETO' | 'COMPLETO';
}

export interface Completitud {
  completo: boolean;
  faltantes: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export const vigilanteService = {
  getAll: async (page = 1, limit = 50): Promise<Vigilador[]> => {
    const response = await api.get<PaginatedResponse<Vigilador>>('/vigilantes', {
      params: { page, limit },
    });
    return response.data.data;
  },

  getOne: async (id: string): Promise<Vigilador> => {
    const response = await api.get<Vigilador>(`/vigilantes/${id}`);
    return response.data;
  },

  create: async (data: Partial<Vigilador>): Promise<Vigilador> => {
    const response = await api.post<Vigilador>('/vigilantes', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Vigilador>): Promise<Vigilador> => {
    const response = await api.put<Vigilador>(`/vigilantes/${id}`, data);
    return response.data;
  },

  subirFoto: async (id: string, file: File): Promise<Vigilador> => {
    const form = new FormData();
    form.append('file', file);
    const response = await api.post<Vigilador>(`/vigilantes/${id}/foto`, form);
    return response.data;
  },

  getCompletitud: async (id: string): Promise<Completitud> => {
    const response = await api.get<Completitud>(`/vigilantes/${id}/completitud`);
    return response.data;
  },

  setPin: async (id: string, pin: string): Promise<void> => {
    await api.post(`/vigilantes/${id}/pin`, { pin });
  },

  descargarPlantilla: async (): Promise<void> => {
    const response = await api.get('/vigilantes/plantilla', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plantilla_vigiladores.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  },

  importarMasivo: async (
    file: File,
  ): Promise<{ creados: number; errores: { fila: number; mensaje: string }[] }> => {
    const form = new FormData();
    form.append('file', file);
    const response = await api.post('/vigilantes/importar', form);
    return response.data;
  },
};
