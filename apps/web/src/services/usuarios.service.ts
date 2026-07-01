import api from './api';

export type RolTenant = 'ADMIN' | 'GERENCIA' | 'SUPERVISOR' | 'COMERCIAL' | 'OPERADOR';

export interface Usuario {
  id: string;
  nombre: string | null;
  email: string;
  role: RolTenant;
  created_at: string;
  deleted_at: string | null;
}

export const ROL_INFO: Record<RolTenant, { label: string; descripcion: string; color: string }> = {
  ADMIN: {
    label: 'Administrador',
    descripcion: 'Acceso completo: usuarios, configuración, suscripción y todos los módulos.',
    color: 'bg-navy/10 text-navy',
  },
  GERENCIA: {
    label: 'Gerente',
    descripcion: 'Acceso a todos los módulos operativos y comerciales. No puede gestionar usuarios ni configuración del sistema.',
    color: 'bg-purple-100 text-purple-700',
  },
  SUPERVISOR: {
    label: 'Supervisor',
    descripcion: 'Operación diaria: cuadrante, personal, novedades, herramientas y cambios de turno.',
    color: 'bg-blue-100 text-blue-700',
  },
  COMERCIAL: {
    label: 'Comercial',
    descripcion: 'Clientes, objetivos, cotizaciones y reportes. Sin acceso a operación interna.',
    color: 'bg-emerald/10 text-emerald-700',
  },
  OPERADOR: {
    label: 'Operador de Monitoreo',
    descripcion: 'Centro de operaciones: monitoreo, equipamiento, vigilancia móvil y novedades.',
    color: 'bg-amber/10 text-amber-700',
  },
};

export async function listarUsuarios(): Promise<Usuario[]> {
  const res = await api.get('/usuarios');
  return res.data;
}

export async function crearUsuario(data: {
  nombre?: string;
  email: string;
  password: string;
  role: RolTenant;
}): Promise<Usuario> {
  const res = await api.post('/usuarios', data);
  return res.data;
}

export async function actualizarUsuario(
  id: string,
  data: { nombre?: string; role?: RolTenant },
): Promise<Usuario> {
  const res = await api.patch(`/usuarios/${id}`, data);
  return res.data;
}

export async function resetPasswordUsuario(id: string, password: string): Promise<void> {
  await api.post(`/usuarios/${id}/reset-password`, { password });
}

export async function eliminarUsuario(id: string): Promise<void> {
  await api.delete(`/usuarios/${id}`);
}
