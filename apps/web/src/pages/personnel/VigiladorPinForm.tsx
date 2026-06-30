import { useState } from 'react';
import { X, KeyRound } from 'lucide-react';
import { vigilanteService } from '../../services/vigilante.service';

interface Props {
  vigiladorId: string;
  onClose: () => void;
  onGuardado: () => void;
}

export const VigiladorPinForm = ({ vigiladorId, onClose, onGuardado }: Props) => {
  const [pin, setPin] = useState('');
  const [confirmacion, setConfirmacion] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{4,6}$/.test(pin)) {
      setError('El PIN debe ser numérico de 4 a 6 dígitos.');
      return;
    }
    if (pin !== confirmacion) {
      setError('Los PIN no coinciden.');
      return;
    }
    setEnviando(true);
    setError(null);
    try {
      await vigilanteService.setPin(vigiladorId, pin);
      onGuardado();
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'No se pudo configurar el PIN.');
    } finally {
      setEnviando(false);
    }
  };

  const campoClase =
    'w-full px-3 py-2 bg-canvas border border-line rounded-md focus:ring-2 focus:ring-brand-blue/20 outline-none text-sm';
  const labelClase = 'text-xs font-medium text-muted uppercase tracking-wider';

  return (
    <div className="fixed inset-0 bg-navy/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface w-full max-w-sm rounded-xl shadow-xl border border-line animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-line flex justify-between items-center">
          <div>
            <h3 className="text-lg font-display font-bold text-navy flex items-center gap-2">
              <KeyRound className="text-brand-blue" size={18} /> Configurar PIN de acceso
            </h3>
            <p className="text-xs text-muted">Para App Móvil y Kiosco</p>
          </div>
          <button onClick={onClose} className="text-muted hover:text-navy transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className={labelClase}>Nuevo PIN</label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={6}
              placeholder="4 a 6 dígitos"
              className={campoClase}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              required
              autoFocus
            />
          </div>

          <div className="space-y-1">
            <label className={labelClase}>Confirmar PIN</label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={6}
              placeholder="Repetí el PIN"
              className={campoClase}
              value={confirmacion}
              onChange={(e) => setConfirmacion(e.target.value.replace(/\D/g, ''))}
              required
            />
          </div>

          {error && <div className="p-3 bg-amber/10 border border-amber/30 rounded-md text-sm text-amber">{error}</div>}

          <div className="pt-2 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-line text-muted font-medium rounded-md hover:bg-canvas transition-colors">
              Cancelar
            </button>
            <button type="submit" className="flex-1 btn-primary" disabled={enviando}>
              {enviando ? 'Guardando...' : 'Guardar PIN'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
