import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, ChevronRight } from 'lucide-react';
import { dashboardService } from '../../services/dashboard.service';
import {
  Paso,
  construirPasos,
  indiceActivo,
  onboardingCompleto,
} from '../../pages/dashboard/onboardingSteps';

/**
 * Barra de onboarding persistente: acompaña al usuario en TODAS las pantallas
 * mientras la configuración inicial esté incompleta, mostrando el paso actual y
 * un botón para continuar. Así, después de completar un paso en otra vista, el
 * asistente sigue presente para seguir con el siguiente (antes había que volver
 * al dashboard manualmente).
 *
 * Se oculta en el dashboard (ahí ya está la guía completa) y cuando todo lo
 * obligatorio está listo. Refresca el progreso en cada cambio de ruta.
 */
export const OnboardingBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [pasos, setPasos] = useState<Paso[] | null>(null);

  useEffect(() => {
    let cancelado = false;
    dashboardService
      .onboarding()
      .then((p) => { if (!cancelado) setPasos(construirPasos(p)); })
      .catch(() => { if (!cancelado) setPasos(null); });
    return () => { cancelado = true; };
    // Se recalcula al navegar: si completó el paso, avanza al siguiente.
  }, [location.pathname]);

  if (!pasos) return null;
  // En el dashboard ya está la guía completa; no duplicamos.
  if (location.pathname === '/' || location.pathname === '/dashboard') return null;
  if (onboardingCompleto(pasos)) return null;

  const activo = indiceActivo(pasos);
  const paso = activo >= 0 ? pasos[activo] : null;
  if (!paso) return null;

  const total = pasos.filter((p) => !p.opcional).length;
  const numero = activo + 1;

  return (
    <div className="bg-brand-blue text-white px-8 py-2.5 flex items-center justify-between gap-4 text-sm">
      <div className="flex items-center gap-2.5 min-w-0">
        <Sparkles size={16} className="shrink-0" />
        <span className="font-bold shrink-0">Paso {numero} de {total}:</span>
        <span className="truncate text-white/90">{paso.titulo}</span>
      </div>
      <button
        onClick={() => navigate(paso.to)}
        className="shrink-0 flex items-center gap-1 bg-white/15 hover:bg-white/25 transition-colors px-3 py-1.5 rounded-lg font-bold text-xs uppercase tracking-wide"
      >
        {paso.cta} <ChevronRight size={14} />
      </button>
    </div>
  );
};
