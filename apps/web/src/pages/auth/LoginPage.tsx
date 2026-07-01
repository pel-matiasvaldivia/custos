import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string | string[] } } })?.response?.data?.message;
      setError(Array.isArray(msg) ? msg[0] : (msg ?? 'Credenciales incorrectas.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#1B57D6]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#1B57D6]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-[#1B57D6] rounded-2xl flex items-center justify-center shadow-lg shadow-[#1B57D6]/30">
              <ShieldCheck size={24} className="text-white" />
            </div>
            <span className="text-white font-black italic uppercase tracking-tighter text-3xl">
              Cust<span className="text-[#1B57D6]">OS</span>
            </span>
          </div>
          <h1 className="text-white text-3xl font-black italic uppercase tracking-tighter mb-2">
            Centro de Operaciones
          </h1>
          <p className="text-white/40 font-bold uppercase tracking-widest text-xs">
            Ingresá con tus credenciales de operador
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error */}
            {error && (
              <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
                <AlertCircle size={18} className="text-red-400 shrink-0" />
                <p className="text-red-400 text-xs font-bold">{error}</p>
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <label className="text-white/50 text-[10px] font-black uppercase tracking-widest block">
                Email / Usuario
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
                placeholder="operador@empresa.com"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-white/20 text-sm font-bold outline-none focus:border-[#1B57D6]/50 focus:ring-2 focus:ring-[#1B57D6]/10 transition-all"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-white/50 text-[10px] font-black uppercase tracking-widest block">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 pr-14 text-white placeholder-white/20 text-sm font-bold outline-none focus:border-[#1B57D6]/50 focus:ring-2 focus:ring-[#1B57D6]/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1B57D6] hover:bg-[#1445b0] disabled:opacity-50 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-3 shadow-xl shadow-[#1B57D6]/25 mt-4"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Ingresar al SOC <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-white/20 text-xs font-bold uppercase tracking-widest mt-6">
          Acceso restringido · Solo personal autorizado
        </p>
        <p className="text-center text-white/30 text-xs mt-3">
          ¿No tenés cuenta?{' '}
          <Link to="/registro" className="text-[#1B57D6] hover:text-[#4a7fe8] transition-colors font-semibold">
            Crear cuenta gratis
          </Link>
        </p>
      </div>
    </div>
  );
}
