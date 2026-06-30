import api from './api';

export interface Tenant {
  id: string;
  nombre: string;
}

export const authService = {
  getTenants: async (): Promise<Tenant[]> => {
    const response = await api.get<Tenant[]>('/auth/tenants');
    return response.data;
  },
};
