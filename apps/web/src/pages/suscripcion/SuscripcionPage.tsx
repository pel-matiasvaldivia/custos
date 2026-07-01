import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  CreditCard,
  CheckCircle,
  Zap,
  Calendar,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { getEstado, crearCheckoutMP, EstadoSuscripcion } from '../../services/suscripcion.service';

const PLANES = [
  {
    id: 'mensual' as const,
    nombre: 'Plan Mensual',
    precio: '$299',
    periodo: 'por mes',
    ahorro: null,
    badge: null,
  },
  {
    id: 'anual' as const,
    nombre: 'Plan Anual',
    precio: '$2.990',
    periodo: 'por año',
    ahorro: 'Ahorrás 2 meses',
    badge: 'Más elegido',
  },
];

const FEATURES = [
  'Gestión de vigiladores ilimitada',
  'Cuadrante y esquemas de turno',
  'Centro de operaciones en tiempo real',
  'App móvil para guardias',
  'Cotizaciones y contratos con firma digital',
  'Reportes y análisis de rentabilidad',
  'Soporte por email prioritario',
];

export default function SuscripcionPage() {
  const [searchParams] = useSearchParams();
  const resultado = searchParams.get('resultado');

  const [estado, setEstado] = useState<EstadoSuscripcion | null>(null);
  const [loadingEstado, setLoadingEstado] = useState(true);
  const [procesando, setProcesando] = useState<string | null>(null);
  const [demoMsg, setDemoMsg] = useState('');

  useEffect(() => {
    getEstado()
      .then(setEstado)
      .finally(() => setLoadingEstado(false));
  }, []);

  const handleSuscribir = async (planId: 'mensual' | 'anual') => {
    setProcesando(planId);
    setDemoMsg('');
    try {
      const back_url = window.location.origin;
      const data = await crearCheckoutMP(planId, back_url);
      if (data.demo) {
        setDemoMsg(data.mensaje ?? 'Modo demo: configurá MP_ACCESS_TOKEN en el servidor para activar pagos reales.');
      } else if (data.init_point) {
        window.location.href = data.init_point;
      }
    } catch {
      setDemoMsg('Error al iniciar el proceso de pago. Intentá de nuevo.');
    } finally {
      setProcesando(null);
    }
  };

  const planActivo = estado?.plan === 'ACTIVO';

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-navy">Suscripción</h1>
        <p className="text-muted mt-1">Elegí el plan que mejor se adapta a tu empresa.</p>
      </div>

      {/* MP result banners */}
      {resultado === 'ok' && (
        <div className="flex items-center gap-2 bg-emerald/10 border border-emerald/20 text-emerald-700 rounded-lg px-4 py-3 mb-6 text-sm">
          <CheckCircle className="w-4 h-4 shrink-0" />
          Pago aprobado. Tu suscripción ya está activa.
        </div>
      )}
      {resultado === 'error' && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-6 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          El pago no pudo procesarse. Podés intentarlo de nuevo.
        </div>
      )}
      {resultado === 'pendiente' && (
        <div className="flex items-center gap-2 bg-amber/10 border border-amber/30 text-amber-800 rounded-lg px-4 py-3 mb-6 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          Tu pago está pendiente de confirmación. Te avisaremos cuando se acredite.
        </div>
      )}

      {/* Current status */}
      {loadingEstado ? (
        <div className="card flex items-center gap-2 text-muted mb-6">
          <Loader2 className="w-4 h-4 animate-spin" />
          Verificando estado...
        </div>
      ) : estado && (
        <div className={`card mb-6 flex items-center gap-3 ${
          planActivo ? 'border-emerald/30 bg-emerald/5' : ''
        }`}>
          {planActivo ? (
            <CheckCircle className="w-5 h-5 text-emerald shrink-0" />
          ) : (
            <Zap className="w-5 h-5 text-amber shrink-0" />
          )}
          <div>
            <p className="font-semibold text-navy text-sm">
              {planActivo ? 'Plan Activo' : estado.plan === 'TRIAL' ? 'Período de Prueba' : 'Plan Vencido'}
            </p>
            <p className="text-muted text-xs">
              {estado.plan === 'TRIAL' && estado.dias_restantes !== null
                ? `${estado.dias_restantes} días restantes de prueba gratuita`
                : estado.plan === 'ACTIVO'
                ? 'Tu suscripción está vigente'
                : 'El período de prueba ha finalizado'}
            </p>
          </div>
        </div>
      )}

      {demoMsg && (
        <div className="flex items-start gap-2 bg-amber/10 border border-amber/30 text-amber-800 rounded-lg px-4 py-3 mb-6 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          {demoMsg}
        </div>
      )}

      {/* Plan cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        {PLANES.map((plan) => (
          <div
            key={plan.id}
            className={`card relative flex flex-col ${plan.badge ? 'border-navy/40 shadow-md' : ''}`}
          >
            {plan.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-navy text-white text-xs font-semibold px-3 py-1 rounded-full">
                {plan.badge}
              </div>
            )}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-muted" />
                <span className="font-semibold text-navy">{plan.nombre}</span>
              </div>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-3xl font-bold text-navy">{plan.precio}</span>
                <span className="text-muted text-sm">{plan.periodo}</span>
              </div>
              {plan.ahorro && (
                <span className="text-xs text-emerald font-medium">{plan.ahorro}</span>
              )}
            </div>
            <button
              onClick={() => handleSuscribir(plan.id)}
              disabled={!!procesando || planActivo}
              className={`btn-primary w-full flex items-center justify-center gap-2 mt-auto ${
                planActivo ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {procesando === plan.id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CreditCard className="w-4 h-4" />
              )}
              {planActivo ? 'Ya suscripto' : 'Suscribirse con MercadoPago'}
            </button>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="card">
        <h3 className="font-semibold text-navy mb-4">Todo incluido en ambos planes</h3>
        <ul className="space-y-2">
          {FEATURES.map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-navy">
              <CheckCircle className="w-4 h-4 text-emerald shrink-0" />
              {f}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
