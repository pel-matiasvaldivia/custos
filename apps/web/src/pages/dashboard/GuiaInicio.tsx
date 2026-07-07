import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronRight, Sparkles, X, PartyPopper, Lock } from 'lucide-react';
import { dashboardService } from '../../services/dashboard.service';
import {
  Paso,
  construirPasos,
  indiceActivo,
  estadoDe,
  onboardingCompleto,
} from './onboardingSteps';

const OCULTAR_KEY = 'custos_guia_inicio_oculta';

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

  if (!pasos) return null;

  const obligatorios = pasos.filter((p) => !p.opcional);
  const completados = obligatorios.filter((p) => p.done).length;
  const total = obligatorios.length;
  const todoListo = onboardingCompleto(pasos);
  const pct = Math.round((completados / total) * 100);
  const activo = indiceActivo(pasos);

  // La guía es mandatoria: un "oculto" previo solo vale si ya está todo completo.
  if (oculta && todoListo) return null;

  // La guía solo se puede ocultar una vez completado lo obligatorio (es mandatoria).
  const ocultar = () => {
    if (!todoListo) return;
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
                : 'Completá los pasos en orden. Cada uno se habilita al terminar el anterior y te lleva a la pantalla correcta.'}
            </p>
          </div>
        </div>
        {todoListo && (
          <button onClick={ocultar} className="text-muted hover:text-navy transition-colors shrink-0" title="Ocultar guía">
            <X size={18} />
          </button>
        )}
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

      {/* Lista de pasos (secuencial) */}
      <div className="mt-4 space-y-2">
        {pasos.map((paso, i) => {
          const Icono = paso.icon;
          const estado = estadoDe(paso, i, activo);
          const bloqueado = estado === 'locked';
          const accionable = estado === 'active' || estado === 'opcional';
          return (
            <div
              key={paso.key}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                estado === 'done'
                  ? 'border-emerald/20 bg-emerald/[0.04]'
                  : estado === 'active'
                    ? 'border-brand-blue/40 bg-brand-blue/[0.03]'
                    : bloqueado
                      ? 'border-line bg-canvas/40 opacity-60'
                      : 'border-line bg-surface'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                  estado === 'done'
                    ? 'bg-emerald text-white'
                    : estado === 'active'
                      ? 'bg-brand-blue text-white'
                      : 'bg-canvas text-muted border border-line'
                }`}
              >
                {estado === 'done' ? <Check size={15} /> : bloqueado ? <Lock size={13} /> : <span className="text-xs font-bold">{i + 1}</span>}
              </div>
              <Icono size={18} className={`shrink-0 ${estado === 'done' ? 'text-emerald' : estado === 'active' ? 'text-brand-blue' : 'text-muted'}`} />
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-medium ${estado === 'done' ? 'text-muted line-through' : bloqueado ? 'text-muted' : 'text-navy'}`}>
                  {paso.titulo}
                  {paso.opcional && <span className="ml-2 text-[10px] uppercase text-muted/70">opcional</span>}
                </p>
                {estado === 'active' && <p className="text-xs text-muted mt-0.5">{paso.desc}</p>}
              </div>
              {accionable && (
                <button
                  onClick={() => navigate(paso.to)}
                  className={`shrink-0 text-xs font-medium flex items-center gap-0.5 ${
                    estado === 'active' ? 'text-brand-blue hover:underline' : 'text-muted hover:text-navy'
                  }`}
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
