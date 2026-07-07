import {
  Users, Building2, Shield, CalendarClock, ClipboardList, FileText,
  BadgeDollarSign,
} from 'lucide-react';
import { OnboardingProgress } from '../../services/dashboard.service';

export interface Paso {
  key: string;
  done: boolean;
  icon: typeof Users;
  titulo: string;
  desc: string;
  cta: string;
  to: string;
  opcional?: boolean;
}

export type EstadoPaso = 'done' | 'active' | 'locked' | 'opcional';

/**
 * Pasos del onboarding, en orden. Los obligatorios van primero y se completan de
 * forma secuencial; la cotización es opcional y queda al final. El último paso
 * obligatorio son los datos de la empresa (facturación, logo, firma).
 */
export const construirPasos = (p: OnboardingProgress): Paso[] => [
  {
    key: 'personal',
    done: p.tiene_personal,
    icon: Users,
    titulo: 'Cargá tu personal',
    desc: 'Dá de alta a tus vigiladores (uno por uno o importándolos desde Excel). Son las personas que vas a asignar a los puestos.',
    cta: 'Ir a Personal',
    to: '/personnel',
  },
  {
    key: 'clientes',
    done: p.tiene_clientes,
    icon: Building2,
    titulo: 'Registrá tus clientes',
    desc: 'Las empresas o personas a las que les prestás el servicio de seguridad. Después vas a poder vincularles objetivos y contratos.',
    cta: 'Ir a Clientes',
    to: '/clients',
  },
  {
    key: 'objetivos',
    done: p.tiene_objetivos && p.tiene_puestos,
    icon: Shield,
    titulo: 'Creá un objetivo con sus puestos',
    desc: 'El objetivo es el lugar a cubrir (un barrio, una fábrica, un local). Dentro cargás los puestos concretos que hay que vigilar.',
    cta: 'Ir a Objetivos',
    to: '/objectives',
  },
  {
    key: 'esquemas',
    done: p.tiene_esquemas,
    icon: CalendarClock,
    titulo: 'Definí un esquema de turno',
    desc: 'El patrón con el que se cubre un puesto (12×24, 24×48, etc.). Elegí una plantilla lista o armá el tuyo a medida.',
    cta: 'Ir a Esquema de turnos',
    to: '/relevos',
  },
  {
    key: 'cuadrante',
    done: p.tiene_cuadrante,
    icon: ClipboardList,
    titulo: 'Armá el cuadrante',
    desc: 'Afectá a tus vigiladores a los puestos según el esquema elegido. El sistema genera los turnos automáticamente y te avisa si quedan huecos.',
    cta: 'Ir a Objetivos',
    to: '/objectives',
  },
  {
    key: 'empresa',
    done: p.tiene_datos_empresa,
    icon: BadgeDollarSign,
    titulo: 'Cargá los datos de tu empresa',
    desc: 'Completá los datos de facturación (razón social, CUIT, condición de IVA, domicilio), el logo y la firma del responsable. Son los que aparecen en cotizaciones y contratos.',
    cta: 'Ir a Datos de empresa',
    to: '/settings?tab=empresa',
  },
  {
    key: 'cotizaciones',
    done: p.tiene_cotizaciones,
    icon: FileText,
    titulo: 'Generá tu primera cotización',
    desc: 'Calculá el precio de un servicio por horas hombre / vehículo y generá el PDF para enviar al cliente. (Opcional)',
    cta: 'Ir a Cotizaciones',
    to: '/quotes',
    opcional: true,
  },
];

/** Índice del primer paso obligatorio no completado (o -1 si están todos). */
export const indiceActivo = (pasos: Paso[]): number =>
  pasos.findIndex((p) => !p.opcional && !p.done);

/** Estado de un paso para el render secuencial (mandatorio). */
export const estadoDe = (
  paso: Paso,
  idx: number,
  activo: number,
): EstadoPaso => {
  if (paso.done) return 'done';
  if (paso.opcional) return 'opcional';
  if (activo === -1 || idx <= activo) return 'active';
  return 'locked';
};

/** ¿Están todos los pasos obligatorios completos? */
export const onboardingCompleto = (pasos: Paso[]): boolean =>
  pasos.filter((p) => !p.opcional).every((p) => p.done);
