import api from './api';

export interface ComprasItem {
  id: string;
  descripcion: string;
  cantidad: number;
  cantidad_recibida: number;
  precio_unitario: number;
  subtotal: number;
}

export interface OrdenCompra {
  id: string;
  proveedor_nombre: string;
  total: number;
  total_pagado: number;
  estado: string;
  created_at: string;
  items: ComprasItem[];
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export const comprasService = {
  getOrdenes: async (page = 1, limit = 50): Promise<OrdenCompra[]> => {
    const response = await api.get<PaginatedResponse<OrdenCompra>>('/compras/ordenes', {
      params: { page, limit },
    });
    return response.data.data;
  },

  createOrden: async (data: any): Promise<OrdenCompra> => {
    const response = await api.post<OrdenCompra>('/compras/ordenes', data);
    return response.data;
  },

  recibirOrden: async (id: string, items: { itemId: string; cantidad: number }[]) => {
    const response = await api.patch(`/compras/ordenes/${id}/recibir`, { items });
    return response.data;
  },

  pagarOrden: async (id: string, monto: number) => {
    const response = await api.patch(`/compras/ordenes/${id}/pagar`, { monto });
    return response.data;
  },
};
