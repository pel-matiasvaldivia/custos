import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Building2,
  User,
  ChevronRight,
  ChevronLeft,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

type Step = 1 | 2 | 3;

interface FormData {
  empresa_nombre: string;
  razon_social: string;
  cuit: string;
  telefono: string;
  email: string;
  password: string;
  confirmar_password: string;
}

const EMPTY: FormData = {
  empresa_nombre: '',
  razon_social: '',
  cuit: '',
  telefono: '',
  email: '',
  password: '',
  confirmar_password: '',
};

export default function RegistroPage() {
  const { registro } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (field: keyof FormData, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const validateStep1 = () => {
    if (form.empresa_nombre.trim().length < 2) return 'El nombre de empresa debe tener al menos 2 caracteres.';
    if (form.cuit && !/^\d{2}-\d{7,8}-\d$/.test(form.cuit))
      return 'CUIT inválido. Formato: XX-XXXXXXXX-X';
    return '';
  };

  const validateStep2 = () => {
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Email inválido.';
    if (form.password.length < 8) return 'La contraseña debe tener al menos 8 caracteres.';
    if (form.password !== form.confirmar_password) return 'Las contraseñas no coinciden.';
    return '';
  };

  const next = () => {
    setError('');
    if (step === 1) {
      const err = validateStep1();
      if (err) { setError(err); return; }
    }
    if (step === 2) {
      const err = validateStep2();
      if (err) { setError(err); return; }
    }
    setStep((s) => (s + 1) as Step);
  };

  const back = () => {
    setError('');
    setStep((s) => (s - 1) as Step);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await registro({
        empresa_nombre: form.empresa_nombre.trim(),
        razon_social: form.razon_social.trim() || undefined,
        cuit: form.cuit.trim() || undefined,
        email: form.email.trim(),
        password: form.password,
        telefono: form.telefono.trim() || undefined,
      });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string | string[] } } })?.response?.data?.message;
      setError(Array.isArray(msg) ? msg[0] : (msg ?? 'Error al registrar. Intentá de nuevo.'));
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { label: 'Empresa', icon: Building2 },
    { label: 'Acceso', icon: User },
    { label: 'Confirmar', icon: Check },
  ];

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <ShieldCheck className="w-9 h-9 text-navy" />
            <span className="text-3xl font-display font-bold text-navy">CustOS</span>
          </div>
          <h1 className="text-xl font-semibold text-navy">Crear cuenta gratis</h1>
          <p className="text-muted text-sm mt-1">30 días de prueba sin límites. Sin tarjeta de crédito.</p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {steps.map((s, i) => {
            const idx = (i + 1) as Step;
            const done = idx < step;
            const active = idx === step;
            const Icon = s.icon;
            return (
              <div key={i} className="flex items-center gap-2">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  done ? 'bg-emerald text-white' : active ? 'bg-navy text-white' : 'bg-line text-muted'
                }`}>
                  <Icon className="w-3.5 h-3.5" />
                  <span>{s.label}</span>
                </div>
                {i < steps.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-muted" />
                )}
              </div>
            );
          })}
        </div>

        <div className="card">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-5 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={step === 3 ? submit : (e) => { e.preventDefault(); next(); }}>
            {/* Step 1: Empresa */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="font-semibold text-navy text-lg mb-4">Datos de la empresa</h2>
                <div>
                  <label className="block text-sm font-medium text-navy mb-1">
                    Nombre de fantasía <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="input w-full"
                    value={form.empresa_nombre}
                    onChange={(e) => set('empresa_nombre', e.target.value)}
                    placeholder="Seguridad Ejemplo S.A."
                    required
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy mb-1">Razón social</label>
                  <input
                    className="input w-full"
                    value={form.razon_social}
                    onChange={(e) => set('razon_social', e.target.value)}
                    placeholder="Ejemplo Seguridad S.A. (opcional)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy mb-1">CUIT</label>
                  <input
                    className="input w-full"
                    value={form.cuit}
                    onChange={(e) => set('cuit', e.target.value)}
                    placeholder="30-12345678-9 (opcional)"
                  />
                  <p className="text-xs text-muted mt-1">Formato: XX-XXXXXXXX-X</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy mb-1">Teléfono</label>
                  <input
                    className="input w-full"
                    value={form.telefono}
                    onChange={(e) => set('telefono', e.target.value)}
                    placeholder="+54 11 1234-5678 (opcional)"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Acceso */}
            {step === 2 && (
              <div className="space-y-4">
                <h2 className="font-semibold text-navy text-lg mb-4">Datos de acceso del administrador</h2>
                <div>
                  <label className="block text-sm font-medium text-navy mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="input w-full"
                    type="email"
                    value={form.email}
                    onChange={(e) => set('email', e.target.value)}
                    placeholder="admin@tuempresa.com"
                    required
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy mb-1">
                    Contraseña <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      className="input w-full pr-10"
                      type={showPw ? 'text' : 'password'}
                      value={form.password}
                      onChange={(e) => set('password', e.target.value)}
                      placeholder="Mínimo 8 caracteres"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted"
                    >
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy mb-1">
                    Confirmar contraseña <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="input w-full"
                    type={showPw ? 'text' : 'password'}
                    value={form.confirmar_password}
                    onChange={(e) => set('confirmar_password', e.target.value)}
                    placeholder="Repetir contraseña"
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 3: Confirm */}
            {step === 3 && (
              <div className="space-y-4">
                <h2 className="font-semibold text-navy text-lg mb-2">Confirmar datos</h2>
                <div className="bg-surface rounded-lg border border-line p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted">Empresa</span>
                    <span className="font-medium text-navy">{form.empresa_nombre}</span>
                  </div>
                  {form.razon_social && (
                    <div className="flex justify-between">
                      <span className="text-muted">Razón social</span>
                      <span className="font-medium text-navy">{form.razon_social}</span>
                    </div>
                  )}
                  {form.cuit && (
                    <div className="flex justify-between">
                      <span className="text-muted">CUIT</span>
                      <span className="font-medium text-navy">{form.cuit}</span>
                    </div>
                  )}
                  {form.telefono && (
                    <div className="flex justify-between">
                      <span className="text-muted">Teléfono</span>
                      <span className="font-medium text-navy">{form.telefono}</span>
                    </div>
                  )}
                  <div className="border-t border-line pt-2 mt-2 flex justify-between">
                    <span className="text-muted">Email admin</span>
                    <span className="font-medium text-navy">{form.email}</span>
                  </div>
                </div>

                <div className="bg-emerald/5 border border-emerald/20 rounded-lg p-4 text-sm text-emerald-700">
                  <p className="font-semibold mb-1">30 días de prueba gratuita</p>
                  <p className="text-muted text-xs">Acceso completo a todos los módulos. Al vencer, podés suscribirte con tarjeta o MercadoPago.</p>
                </div>
              </div>
            )}

            {/* Nav buttons */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-line">
              {step > 1 ? (
                <button type="button" onClick={back} className="btn-secondary flex items-center gap-1.5">
                  <ChevronLeft className="w-4 h-4" />
                  Atrás
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button type="submit" className="btn-primary flex items-center gap-1.5">
                  Siguiente
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex items-center gap-1.5 min-w-[160px] justify-center"
                >
                  {loading ? (
                    <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Crear cuenta
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        <p className="text-center text-sm text-muted mt-4">
          ¿Ya tenés cuenta?{' '}
          <Link to="/login" className="text-navy font-medium hover:underline">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
