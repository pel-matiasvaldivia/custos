import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Building2,
  Shield,
  CalendarClock,
  ClipboardList,
  FileText,
  Check,
  ChevronRight,
  Sparkles,
  X,
  PartyPopper,
} from 'lucide-react';
import { dashboardService, OnboardingProgress } from '../../services/dashboard.service';

const OCULTAR_KEY = 'custos_guia_inicio_oculta';

interface Paso {
  key: string;
  done: boolean;
  icon: typeof Users;
  titulo: string;
  desc: string;
  cta: string;
  to: string;
  opcional?: boolean;
}

const construirPasos = (p: OnboardingProgress): Paso[] => [
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

export const GuiaInicio = () => {
  const navigate = useNavigate();
  const [pasos, setPasos] = useState<Paso[] | null>(null);
  const [oculta, setOculta] = useState(() => localStorage.getItem(OCULTAR_KEY) === '1');

  const cargar = () => {
    dashboardService
      .onboarding()
      .then((p) => setPasos(construirPasos(p)))
      .catch(() => setPasos(null));
  };

  useEffect(() => {
    cargar();
    // Al volver a la pestaña, refrescar el progreso (por si completó un paso en otra vista).
    const onFocus = () => cargar();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  if (oculta || !pasos) return null;

  const obligatorios = pasos.filter((p) => !p.opcional);
  const completados = obligatorios.filter((p) => p.done).length;
  const total = obligatorios.length;
  const todoListo = completados === total;
  const pct = Math.round((completados / total) * 100);

  const ocultar = () => {
    localStorage.setItem(OCULTAR_KEY, '1');
    setOculta(true);
  };

  return (
    <div className="card border-brand-blue/20 bg-gradient-to-br from-brand-blue/[0.04] to-transparent">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-brand-blue/10 text-brand-blue shrink-0">
            {todoListo ? <PartyPopper size={20} /> : <Sparkles size={20} />}
          </div>
          <div>
            <h3 className="font-display font-bold text-navy">
              {todoListo ? '¡Tu empresa ya está en funciones!' : 'Primeros pasos para poner tu empresa en marcha'}
            </h3>
            <p className="text-sm text-muted">
              {todoListo
                ? 'Completaste la configuración inicial. Podés ocultar esta guía.'
                : 'Seguí estos pasos en orden para dejar todo operativo. Cada uno te lleva a la pantalla correcta.'}
            </p>
          </div>
        </div>
        <button onClick={ocultar} className="text-muted hover:text-navy transition-colors shrink-0" title="Ocultar guía">
          <X size={18} />
        </button>
      </div>

      {/* Barra de progreso */}
      <div className="mt-4 space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-navy">
            {completados} de {total} pasos completados
          </span>
          <span className="text-muted">{pct}%</span>
        </div>
        <div className="h-2 w-full bg-canvas rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${todoListo ? 'bg-emerald' : 'bg-brand-blue'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Lista de pasos */}
      <div className="mt-4 space-y-2">
        {pasos.map((paso, i) => {
          const Icono = paso.icon;
          return (
            <div
              key={paso.key}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                paso.done ? 'border-emerald/20 bg-emerald/[0.04]' : 'border-line bg-surface'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                  paso.done ? 'bg-emerald text-white' : 'bg-canvas text-muted border border-line'
                }`}
              >
                {paso.done ? <Check size={15} /> : <span className="text-xs font-bold">{i + 1}</span>}
              </div>
              <Icono size={18} className={paso.done ? 'text-emerald shrink-0' : 'text-brand-blue shrink-0'} />
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-medium ${paso.done ? 'text-muted line-through' : 'text-navy'}`}>
                  {paso.titulo}
                  {paso.opcional && <span className="ml-2 text-[10px] uppercase text-muted/70">opcional</span>}
                </p>
                {!paso.done && <p className="text-xs text-muted mt-0.5">{paso.desc}</p>}
              </div>
              {!paso.done && (
                <button
                  onClick={() => navigate(paso.to)}
                  className="shrink-0 text-xs font-medium text-brand-blue hover:underline flex items-center gap-0.5"
                >
                  {paso.cta} <ChevronRight size={14} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
