import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';
import { mobileAuthService } from '../../services/mobileAuth.service';

export default function MobileLogin() {
  const navigate = useNavigate();
  const [legajoNro, setLegajoNro] = useState('');
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const data = await mobileAuthService.login(legajoNro, pin);
      mobileAuthService.guardarSesion(data);
      navigate('/mobile', { replace: true });
    } catch (err) {
      const msg =
        (err as { response?: { data?: { message?: string | string[] } } })?.response?.data?.message ||
        'Legajo o PIN incorrecto.';
      setError(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-brand-blue/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-brand-blue/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-brand-blue rounded-2xl flex items-center justify-center shadow-lg shadow-brand-blue/30">
              <ShieldCheck size={24} className="text-white" />
            </div>
            <span className="text-white font-black italic uppercase tracking-tighter text-3xl">
              CustOS <span className="text-brand-blue">GO</span>
            </span>
          </div>
          <p className="text-white/40 font-bold uppercase tracking-widest text-xs">
            Ingresá con tu legajo y PIN
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
                <AlertCircle size={18} className="text-red-400 shrink-0" />
                <p className="text-red-400 text-xs font-bold">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-white/50 text-[10px] font-black uppercase tracking-widest block">
                Legajo
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={legajoNro}
                onChange={(e) => setLegajoNro(e.target.value)}
                required
                autoFocus
                placeholder="N° de legajo"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-white/20 text-sm font-bold outline-none focus:border-brand-blue/50 focus:ring-2 focus:ring-brand-blue/10 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-white/50 text-[10px] font-black uppercase tracking-widest block">
                PIN
              </label>
              <input
                type="password"
                inputMode="numeric"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                required
                placeholder="••••"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-white/20 text-sm font-bold outline-none focus:border-brand-blue/50 focus:ring-2 focus:ring-brand-blue/10 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-blue hover:bg-brand-deep disabled:opacity-50 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-3 shadow-xl shadow-brand-blue/25 mt-4"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Ingresar <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
