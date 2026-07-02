import api from './api';

export interface MiTenant {
  id: string;
  nombre: string;
  razon_social: string | null;
  cuit: string | null;
  direccion: string | null;
  lat: number | null;
  lng: number | null;
  email_contacto: string | null;
  telefono_contacto: string | null;
}

export const tenantConfigService = {
  get: async (): Promise<MiTenant> => {
    const { data } = await api.get<MiTenant>('/config/tenant');
    return data;
  },
  setGeo: async (lat: number | null, lng: number | null) => {
    const { data } = await api.put('/config/tenant/geo', { lat, lng });
    return data;
  },
};
