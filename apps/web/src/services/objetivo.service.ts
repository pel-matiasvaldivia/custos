import api from './api';

export interface Objetivo {
  id: string;
  cliente_nombre: string;
  codigo: string;
  nombre: string;
  direccion?: string | null;
  estado: 'ACTIVO' | 'INACTIVO';
  lat?: number | null;
  lng?: number | null;
  created_at: string;
  _count?: { puestos: number };
}

export interface Puesto {
  id: string;
  objetivo_id?: string | null;
  nombre: string;
  ubicacion?: string | null;
  lat?: number | null;
  lng?: number | null;
  requiere_arma: boolean;
  requiere_movil: boolean;
}

export interface ContratoFacturacion {
  id: string;
  modo: 'POR_PLANIFICADO' | 'POR_REAL' | 'ABONO_FIJO';
  tarifa_hora?: string | null;
  abono_mensual?: string | null;
  redondeo_min: number;
  penaliza_hueco: boolean;
}

export interface Contrato {
  id: string;
  codigo: string;
  cliente_nombre: string;
  objetivo_id?: string | null;
  estado: 'ACTIVO' | 'SUSPENDIDO' | 'FINALIZADO';
  inicio?: string | null;
  fin?: string | null;
  facturacion?: ContratoFacturacion | null;
}

export interface Vehiculo {
  id: string;
  patente: string;
  marca?: string | null;
  modelo?: string | null;
  tipo?: string | null;
  estado: string;
}

export interface VehiculoAsignado {
  id: string;
  vehiculo_id: string;
  desde: string;
  hasta?: string | null;
  vehiculo: Vehiculo;
}

export interface PersonalResumen {
  id: string;
  nombre: string;
  apellido: string;
  estado: string;
}

export interface HerramientaResumen {
  id: string;
  herramienta: { id: string; codigo: string; tipo: string; descripcion: string };
  vigilador: { id: string; nombre: string; apellido: string };
  entregada_el: string;
}

export interface ObjetivoDetalle {
  objetivo: Objetivo;
  puestos: Puesto[];
  contrato: Contrato | null;
  vehiculosAsignados: VehiculoAsignado[];
  personal: PersonalResumen[];
  herramientas: HerramientaResumen[];
}

export interface CreateObjetivoData {
  cliente_nombre: string;
  codigo: string;
  nombre: string;
  direccion?: string;
  lat?: number;
  lng?: number;
}

export const objetivoService = {
  getAll: async (page = 1, limit = 50): Promise<Objetivo[]> => {
    const response = await api.get<{ data: Objetivo[] }>('/objetivos', { params: { page, limit } });
    return response.data.data;
  },

  getDetalle: async (id: string): Promise<ObjetivoDetalle> => {
    const response = await api.get<ObjetivoDetalle>(`/objetivos/${id}`);
    return response.data;
  },

  create: async (data: CreateObjetivoData): Promise<Objetivo> => {
    const response = await api.post<Objetivo>('/objetivos', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateObjetivoData> & { estado?: string }): Promise<Objetivo> => {
    const response = await api.put<Objetivo>(`/objetivos/${id}`, data);
    return response.data;
  },

  asignarVehiculo: async (objetivoId: string, vehiculoId: string): Promise<VehiculoAsignado> => {
    const response = await api.post<VehiculoAsignado>(`/objetivos/${objetivoId}/vehiculos`, {
      vehiculo_id: vehiculoId,
    });
    return response.data;
  },

  liberarVehiculo: async (objetivoId: string, asignacionId: string): Promise<void> => {
    await api.delete(`/objetivos/${objetivoId}/vehiculos/${asignacionId}`);
  },
};
