import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldOff, CreditCard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getEstado } from '../../services/suscripcion.service';

export function ExpiredGate() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (!user) return;
    getEstado()
      .then((e) => { if (e.plan === 'VENCIDO') setExpired(true); })
      .catch(() => {});
  }, [user]);

  if (!expired) return null;

  return (
    <div className="fixed inset-0 z-50 bg-canvas/95 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="card max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
            <ShieldOff className="w-7 h-7 text-red-600" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-navy mb-2">Período de prueba vencido</h2>
        <p className="text-muted text-sm mb-6">
          Tu prueba gratuita de 30 días ha finalizado. Elegí un plan para seguir usando CustOS sin perder tus datos.
        </p>
        <button
          onClick={() => navigate('/suscripcion')}
          className="btn-primary w-full flex items-center justify-center gap-2 mb-3"
        >
          <CreditCard className="w-4 h-4" />
          Ver planes y suscribirse
        </button>
        <button
          onClick={logout}
          className="text-sm text-muted hover:text-navy transition-colors"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
