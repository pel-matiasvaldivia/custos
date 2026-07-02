import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, AlertCircle, Smartphone, User, Nfc } from 'lucide-react';
import { mobileAuthService } from '../../services/mobileAuth.service';

type Modo = 'dispositivo' | 'vigilador';

export default function MobileLogin() {
  const navigate = useNavigate();
  const [modo, setModo] = useState<Modo>('dispositivo');
  const [legajoNro, setLegajoNro] = useState('');
  const [pin, setPin] = useState('');
  const [objetivoCodigo, setObjetivoCodigo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [nfcLeyendo, setNfcLeyendo] = useState(false);
  const [error, setError] = useState('');

  const nfcDisponible = typeof window !== 'undefined' && 'NDEFReader' in window;

  const irADashboard = () => navigate('/mobile', { replace: true });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      if (modo === 'vigilador') {
        const data = await mobileAuthService.login(legajoNro, pin);
        mobileAuthService.guardarSesion(data);
      } else {
        const data = await mobileAuthService.loginDispositivo({
          objetivo_codigo: objetivoCodigo.trim(),
          pin,
        });
        mobileAuthService.guardarSesionDispositivo(data);
      }
      irADashboard();
    } catch (err) {
      const msg =
        (err as { response?: { data?: { message?: string | string[] } } })?.response?.data?.message ||
        (modo === 'vigilador' ? 'Legajo o PIN incorrecto.' : 'Objetivo o PIN incorrecto.');
      setError(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setIsLoading(false);
    }
  };

  const escanearNfc = async () => {
    setError('');
    setNfcLeyendo(true);
    try {
      // Web NFC (Android/Chrome). El serial del TAG identifica al objetivo.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const reader = new (window as any).NDEFReader();
      await reader.scan();
      reader.onreading = async (ev: { serialNumber?: string }) => {
        const tag = ev.serialNumber;
        if (!tag) return;
        try {
          const data = await mobileAuthService.loginDispositivo({ nfc_tag: tag });
          mobileAuthService.guardarSesionDispositivo(data);
          irADashboard();
        } catch {
          setError('TAG no reconocido. Configurá el objetivo o usá código + PIN.');
          setNfcLeyendo(false);
        }
      };
    } catch {
      setError('No se pudo leer el TAG NFC.');
      setNfcLeyendo(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#04140f] via-slate-950 to-[#050b16] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Identidad "de campo" de CustOS GO — distinta del login de oficina (azul). */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-brand-blue/10 rounded-full blur-3xl pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, #10b981 0, #10b981 1px, transparent 1px, transparent 22px)',
        }}
      />

      <div className="relative z-10 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-brand-blue rounded-2xl flex items-center justify-center shadow-lg shadow-brand-blue/30">
              <ShieldCheck size={24} className="text-white" />
            </div>
            <span className="text-white font-black italic uppercase tracking-tighter text-3xl">
              CustOS <span className="text-brand-blue">GO</span>
            </span>
          </div>
          <span className="inline-flex items-center gap-1.5 text-emerald text-[10px] font-black uppercase tracking-[0.2em]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" /> Modo campo
          </span>
        </div>

        {/* Selector de modo */}
        <div className="grid grid-cols-2 gap-2 mb-5 bg-white/5 border border-white/10 rounded-2xl p-1">
          <button
            onClick={() => { setModo('dispositivo'); setError(''); }}
            className={`py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all ${
              modo === 'dispositivo' ? 'bg-brand-blue text-white' : 'text-white/50'
            }`}
          >
            <Smartphone size={14} /> Objetivo
          </button>
          <button
            onClick={() => { setModo('vigilador'); setError(''); }}
            className={`py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all ${
              modo === 'vigilador' ? 'bg-brand-blue text-white' : 'text-white/50'
            }`}
          >
            <User size={14} /> Vigilador
          </button>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
          <p className="text-white/40 text-[11px] text-center font-bold uppercase tracking-widest mb-6">
            {modo === 'dispositivo'
              ? 'Este celular pertenece a un objetivo'
              : 'Ingresá con tu legajo y PIN'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
                <AlertCircle size={18} className="text-red-400 shrink-0" />
                <p className="text-red-400 text-xs font-bold">{error}</p>
              </div>
            )}

            {modo === 'dispositivo' ? (
              <div className="space-y-2">
                <label className="text-white/50 text-[10px] font-black uppercase tracking-widest block">
                  Código del objetivo
                </label>
                <input
                  type="text"
                  value={objetivoCodigo}
                  onChange={(e) => setObjetivoCodigo(e.target.value)}
                  required
                  autoFocus
                  placeholder="Ej: OBJ-001"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-white/20 text-sm font-bold outline-none focus:border-brand-blue/50 focus:ring-2 focus:ring-brand-blue/10 transition-all uppercase"
                />
              </div>
            ) : (
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
            )}

            <div className="space-y-2">
              <label className="text-white/50 text-[10px] font-black uppercase tracking-widest block">PIN</label>
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
              className="w-full bg-brand-blue hover:bg-brand-deep disabled:opacity-50 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-3 shadow-xl shadow-brand-blue/25"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {modo === 'dispositivo' ? 'Activar dispositivo' : 'Ingresar'} <ArrowRight size={18} />
                </>
              )}
            </button>

            {modo === 'dispositivo' && nfcDisponible && (
              <button
                type="button"
                onClick={escanearNfc}
                disabled={nfcLeyendo}
                className="w-full bg-white/5 border border-white/10 text-white/80 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <Nfc size={16} className={nfcLeyendo ? 'animate-pulse text-emerald' : ''} />
                {nfcLeyendo ? 'Acercá el TAG…' : 'Escanear TAG NFC'}
              </button>
            )}
          </form>
        </div>

        <div className="text-center mt-6">
          <a
            href="/login?force=1"
            className="text-white/30 text-[10px] font-black uppercase tracking-widest hover:text-white/60 transition-colors"
          >
            Ingreso administración
          </a>
        </div>
      </div>
    </div>
  );
}
