import api from './api';

export interface Tenant {
  id: string;
  nombre: string;
  razon_social?: string;
  cuit?: string;
  condicion_iva?: string;
  direccion?: string;
  logo_url?: string;
  email_contacto?: string;
  telefono_contacto?: string;
  created_at: string;
}

export const tenantService = {
  getAll: async () => {
    const response = await api.get<Tenant[]>('/system/tenants');
    return response.data;
  },

  create: async (data: Partial<Tenant>) => {
    const response = await api.post<Tenant>('/system/tenants', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Tenant>) => {
    const response = await api.put<Tenant>(`/system/tenants/${id}`, data);
    return response.data;
  },
};
