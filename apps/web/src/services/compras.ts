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

export const comprasService = {
  getOrdenes: async () => {
    const response = await api.get<OrdenCompra[]>('/compras/ordenes');
    return response.data;
  },

  createOrden: async (data: any) => {
    const response = await api.post<OrdenCompra>('/compras/ordenes', data);
    return response.data;
  },

  recibirOrden: async (id: string, items: { itemId: string, cantidad: number }[]) => {
    const response = await api.patch(`/compras/ordenes/${id}/recibir`, { items });
    return response.data;
  },

  pagarOrden: async (id: string, monto: number) => {
    const response = await api.patch(`/compras/ordenes/${id}/pagar`, { monto });
    return response.data;
  },
};
