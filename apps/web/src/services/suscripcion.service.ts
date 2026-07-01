import api from './api';

export interface EstadoSuscripcion {
  plan: 'TRIAL' | 'ACTIVO' | 'VENCIDO' | 'SUSPENDIDO';
  trial_hasta: string | null;
  dias_restantes: number | null;
  suscripcion_id: string | null;
}

export async function getEstado(): Promise<EstadoSuscripcion> {
  const res = await api.get('/suscripcion/estado');
  return res.data;
}

export async function crearCheckoutMP(plan: 'mensual' | 'anual', back_url: string) {
  const res = await api.post('/suscripcion/mp/checkout', { plan, back_url });
  return res.data as { init_point: string | null; sandbox_init_point?: string; demo?: boolean; mensaje?: string };
}

export interface DatosFacturacion {
  nombre: string;
  razon_social: string | null;
  cuit: string | null;
  condicion_iva: string | null;
  direccion: string | null;
  email_contacto: string | null;
  telefono_contacto: string | null;
}

export async function getDatosFacturacion(): Promise<DatosFacturacion> {
  const res = await api.get('/suscripcion/facturacion');
  return res.data;
}

export async function updateDatosFacturacion(
  data: Partial<Omit<DatosFacturacion, 'nombre'>>,
): Promise<DatosFacturacion> {
  const res = await api.put('/suscripcion/facturacion', data);
  return res.data;
}
