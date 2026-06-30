import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, AlertCircle } from 'lucide-react';
import { credencialService, CredencialAlerta } from '../../services/credencial.service';

const ETIQUETAS_TIPO: Record<string, string> = {
  CARNET_VIGILADOR: 'Carnet de Vigilador',
  PSICOFISICO: 'Psicofísico',
  ANTECEDENTES: 'Antecedentes',
  ANMAC: 'ANMAC',
  CAPACITACION: 'Capacitación',
};

const DIAS_ANTICIPACION = 15;
const INTERVALO_REFRESCO_MS = 5 * 60 * 1000;

const describirVencimiento = (venceEl: string) => {
  const dias = Math.ceil((new Date(venceEl).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (dias < 0) return `Vencida hace ${Math.abs(dias)} día${Math.abs(dias) === 1 ? '' : 's'}`;
  if (dias === 0) return 'Vence hoy';
  return `Vence en ${dias} día${dias === 1 ? '' : 's'}`;
};

export const NotificationBell = () => {
  const [alertas, setAlertas] = useState<CredencialAlerta[]>([]);
  const [abierto, setAbierto] = useState(false);
  const navigate = useNavigate();
  const contenedorRef = useRef<HTMLDivElement>(null);

  const cargar = () => {
    credencialService.getAlertas(DIAS_ANTICIPACION).then(setAlertas).catch(() => {});
  };

  useEffect(() => {
    cargar();
    const intervalo = setInterval(cargar, INTERVALO_REFRESCO_MS);
    return () => clearInterval(intervalo);
  }, []);

  useEffect(() => {
    const handleClickFuera = (e: MouseEvent) => {
      if (contenedorRef.current && !contenedorRef.current.contains(e.target as Node)) {
        setAbierto(false);
      }
    };
    document.addEventListener('mousedown', handleClickFuera);
    return () => document.removeEventListener('mousedown', handleClickFuera);
  }, []);

  return (
    <div className="relative" ref={contenedorRef}>
      <button
        onClick={() => setAbierto((v) => !v)}
        className="relative text-muted hover:text-navy transition-colors p-2 rounded-full hover:bg-canvas"
        aria-label="Notificaciones de credenciales"
      >
        <Bell size={20} />
        {alertas.length > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {alertas.length > 9 ? '9+' : alertas.length}
          </span>
        )}
      </button>

      {abierto && (
        <div className="absolute right-0 mt-2 w-80 bg-surface border border-line rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          <div className="p-3 border-b border-line">
            <h4 className="text-sm font-bold text-navy">Credenciales por vencer</h4>
          </div>
          {alertas.length === 0 ? (
            <p className="p-4 text-sm text-muted text-center">No hay credenciales vencidas ni próximas a vencer.</p>
          ) : (
            <ul>
              {alertas.map((a) => (
                <li key={a.id} className="border-b border-line last:border-b-0">
                  <button
                    onClick={() => {
                      setAbierto(false);
                      navigate(`/personnel/${a.vigilador.id}`);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-canvas transition-colors flex items-start gap-3"
                  >
                    <AlertCircle size={16} className="text-amber shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-navy">
                        {a.vigilador.apellido}, {a.vigilador.nombre}
                      </p>
                      <p className="text-xs text-muted">{ETIQUETAS_TIPO[a.tipo] || a.tipo}</p>
                      <p className="text-xs text-amber font-medium">
                        {a.vence_el ? describirVencimiento(a.vence_el) : ''}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
