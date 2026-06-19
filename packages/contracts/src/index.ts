// Shared interfaces and types for the CustOS monorepo

export interface Tenant {
  id: string;
  nombre: string;
  factor_cobertura: number;
  margen_objetivo: number;
  created_at: Date;
  updated_at: Date;
}

export interface User {
  id: string;
  tenant_id: string;
  email: string;
  role: UserRole;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  GERENCIA = 'GERENCIA',
  SUPERVISOR = 'SUPERVISOR',
  OPERADOR = 'OPERADOR',
  RRHH = 'RRHH',
  COMPRAS = 'COMPRAS',
}

export interface Vigilador {
  id: string;
  tenant_id: string;
  legajo_nro: string;
  nombre: string;
  apellido: string;
  documento: string;
  estado: VigiladorEstado;
}

export enum VigiladorEstado {
  ACTIVO = 'ACTIVO',
  SUSPENDIDO = 'SUSPENDIDO',
  BAJA = 'BAJA',
}

export interface Credencial {
  id: string;
  tenant_id: string;
  vigilador_id: string;
  tipo: TipoCredencial;
  numero?: string;
  vence_el?: Date;
}

export enum TipoCredencial {
  CARNET_VIGILADOR = 'CARNET_VIGILADOR',
  PSICOFISICO = 'PSICOFISICO',
  ANTECEDENTES = 'ANTECEDENTES',
  ANMAC = 'ANMAC',
  CAPACITACION = 'CAPACITACION',
}
