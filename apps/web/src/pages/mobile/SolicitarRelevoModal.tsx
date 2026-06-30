import { useState } from 'react';
import { X } from 'lucide-react';
import { vigilanciaMovilService } from '../../services/vigilanciaMovil.service';

interface Props {
  turnoId: string;
  onClose: () => void;
  onSolicitado: () => void;
}

export const SolicitarRelevoModal = ({ turnoId, onClose, onSolicitado }: Props) => {
  const [motivo, setMotivo] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setError(null);
    try {
      await vigilanciaMovilService.solicitarRelevo(turnoId, motivo.trim() || undefined);
      onSolicitado();
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'No se pudo enviar la solicitud.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 w-full max-w-sm rounded-[2rem] shadow-2xl border border-white/10 animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h3 className="text-lg font-black uppercase tracking-tighter text-white">Solicitar cambio de turno</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-white/50 text-[10px] font-black uppercase tracking-widest block">
              Motivo (opcional)
            </label>
            <textarea
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              rows={3}
              placeholder="Contale al SOC por qué necesitás el cambio"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-white/20 text-sm font-medium outline-none focus:border-brand-blue/50 focus:ring-2 focus:ring-brand-blue/10 transition-all resize-none"
            />
          </div>

          {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-sm text-red-400">{error}</div>}

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-white/10 text-white/60 font-bold rounded-2xl hover:bg-white/5 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={enviando}
              className="flex-1 bg-brand-blue text-white font-black uppercase tracking-widest text-xs rounded-2xl py-3 disabled:opacity-50"
            >
              {enviando ? 'Enviando...' : 'Solicitar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
