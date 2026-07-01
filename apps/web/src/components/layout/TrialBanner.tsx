import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CreditCard, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getEstado, EstadoSuscripcion } from '../../services/suscripcion.service';

export function TrialBanner() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [estado, setEstado] = useState<EstadoSuscripcion | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!user) return;
    getEstado().then(setEstado).catch(() => {});
  }, [user]);

  if (!estado || estado.plan !== 'TRIAL' || dismissed) return null;
  if (estado.dias_restantes === null) return null;

  const urgent = estado.dias_restantes <= 7;

  return (
    <div className={`flex items-center justify-between gap-3 px-6 py-2 text-sm ${
      urgent ? 'bg-amber/10 border-b border-amber/30 text-amber-800' : 'bg-navy/5 border-b border-line text-navy'
    }`}>
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 shrink-0" />
        <span>
          {urgent
            ? `Tu período de prueba vence en ${estado.dias_restantes} día${estado.dias_restantes === 1 ? '' : 's'}. `
            : `Período de prueba: ${estado.dias_restantes} días restantes. `}
          Suscribite para continuar sin interrupciones.
        </span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => navigate('/suscripcion')}
          className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-navy text-white text-xs font-medium hover:bg-navy/90 transition-colors"
        >
          <CreditCard className="w-3.5 h-3.5" />
          Ver planes
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="text-muted hover:text-navy transition-colors"
          title="Cerrar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
