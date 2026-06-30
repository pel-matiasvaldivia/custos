import api from './api';

export interface Cliente {
  id: string;
  razon_social: string;
  nombre_fantasia?: string | null;
  cuit?: string | null;
  domicilio?: string | null;
  localidad?: string | null;
  provincia?: string | null;
  contacto_nombre?: string | null;
  contacto_email?: string | null;
  contacto_telefono?: string | null;
  estado: string;
}

export interface CreateClienteData {
  razon_social: string;
  nombre_fantasia?: string;
  cuit?: string;
  domicilio?: string;
  localidad?: string;
  provincia?: string;
  contacto_nombre?: string;
  contacto_email?: string;
  contacto_telefono?: string;
}

export const clienteService = {
  getAll: async (busqueda?: string, page = 1, limit = 200): Promise<Cliente[]> => {
    const response = await api.get<{ data: Cliente[] }>('/clientes', { params: { busqueda, page, limit } });
    return response.data.data;
  },

  getOne: async (id: string): Promise<Cliente> => {
    const response = await api.get<Cliente>(`/clientes/${id}`);
    return response.data;
  },

  create: async (data: CreateClienteData): Promise<Cliente> => {
    const response = await api.post<Cliente>('/clientes', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateClienteData>): Promise<Cliente> => {
    const response = await api.put<Cliente>(`/clientes/${id}`, data);
    return response.data;
  },
};
