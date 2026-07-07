import api from './api';

export interface MiTenant {
  id: string;
  nombre: string;
  razon_social: string | null;
  cuit: string | null;
  condicion_iva: string | null;
  direccion: string | null;
  lat: number | null;
  lng: number | null;
  email_contacto: string | null;
  telefono_contacto: string | null;
}

export interface DatosEmpresaInput {
  razon_social?: string;
  cuit?: string;
  condicion_iva?: string;
  direccion?: string;
  email_contacto?: string;
  telefono_contacto?: string;
}

export const tenantConfigService = {
  get: async (): Promise<MiTenant> => {
    const { data } = await api.get<MiTenant>('/config/tenant');
    return data;
  },
  actualizar: async (input: DatosEmpresaInput): Promise<MiTenant> => {
    const { data } = await api.put<MiTenant>('/config/tenant', input);
    return data;
  },
  setGeo: async (lat: number | null, lng: number | null) => {
    const { data } = await api.put('/config/tenant/geo', { lat, lng });
    return data;
  },
};
