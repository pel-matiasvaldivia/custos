import { useState, useEffect, useRef, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Shield, ShieldCheck, Users, FileText, BarChart3, Smartphone,
  AlertTriangle, CheckCircle, CheckCircle2, ChevronRight, ChevronLeft,
  ArrowRight, X, Eye, EyeOff, Activity, Building2, User, Check,
  ClipboardList, Truck, Wrench, Bell, Lock, Globe, Star,
  Calendar, CreditCard, UploadCloud, Menu,
  TrendingUp, QrCode, Fingerprint, DollarSign,
} from 'lucide-react';

/* ─── ONBOARDING MODAL — usa el mismo endpoint que /registro ─── */
function DemoModal({ onClose }: { onClose: () => void }) {
  const { registro } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    empresa_nombre: '',
    razon_social: '',
    cuit: '',
    telefono: '',
    email: '',
    password: '',
    confirmar_password: '',
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const validateStep1 = () => {
    if (form.empresa_nombre.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres.';
    if (form.cuit && !/^\d{2}-\d{7,8}-\d$/.test(form.cuit)) return 'CUIT inválido. Formato: XX-XXXXXXXX-X';
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
    const err = step === 1 ? validateStep1() : step === 2 ? validateStep2() : '';
    if (err) { setError(err); return; }
    setStep(s => (s + 1) as 1 | 2 | 3);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
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
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setError(Array.isArray(msg) ? msg[0] : (msg ?? 'Error al crear la cuenta. Intentá de nuevo.'));
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  const stepsMeta = [
    { label: 'Empresa', icon: Building2 },
    { label: 'Acceso', icon: User },
    { label: 'Confirmar', icon: Check },
  ];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="bg-navy px-8 py-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/20 to-transparent pointer-events-none" />
          <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors z-10">
            <X size={18} />
          </button>
          <div className="relative z-10 flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center shadow-lg shadow-brand-blue/30">
              <Shield size={16} className="text-white" />
            </div>
            <span className="font-display text-lg font-black text-white uppercase italic tracking-tighter">CustOS</span>
          </div>
          <div className="relative z-10 flex items-center gap-2">
            {stepsMeta.map((s, i) => {
              const n = (i + 1) as 1 | 2 | 3;
              const done = n < step;
              const active = n === step;
              const Icon = s.icon;
              return (
                <div key={n} className="flex items-center gap-2">
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black font-mono uppercase tracking-wider transition-colors ${
                    done ? 'bg-emerald text-white' : active ? 'bg-brand-blue text-white' : 'bg-white/10 text-white/30'
                  }`}>
                    <Icon size={11} />
                    <span>{s.label}</span>
                  </div>
                  {i < stepsMeta.length - 1 && <ChevronRight size={12} className="text-white/20" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Body */}
        <form onSubmit={step === 3 ? submit : (e) => { e.preventDefault(); next(); }} className="px-8 py-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
              <AlertTriangle size={14} className="shrink-0" /> {error}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-navy text-base">Datos de la empresa</h2>
              <div>
                <label className="block text-sm font-medium text-navy mb-1">Nombre de fantasía <span className="text-red-500">*</span></label>
                <input autoFocus className="input w-full" value={form.empresa_nombre} onChange={set('empresa_nombre')} placeholder="Seguridad Austral S.A." required />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1">Razón social</label>
                <input className="input w-full" value={form.razon_social} onChange={set('razon_social')} placeholder="Austral S.A. (opcional)" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-navy mb-1">CUIT</label>
                  <input className="input w-full" value={form.cuit} onChange={set('cuit')} placeholder="30-12345678-9" />
                  <p className="text-xs text-muted mt-1">Formato: XX-XXXXXXXX-X</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy mb-1">Teléfono</label>
                  <input className="input w-full" value={form.telefono} onChange={set('telefono')} placeholder="+54 11 1234-5678" />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-navy text-base">Acceso del administrador</h2>
              <div>
                <label className="block text-sm font-medium text-navy mb-1">Email <span className="text-red-500">*</span></label>
                <input autoFocus className="input w-full" type="email" value={form.email} onChange={set('email')} placeholder="admin@tuempresa.com" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1">Contraseña <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input className="input w-full pr-10" type={showPwd ? 'text' : 'password'} value={form.password} onChange={set('password')} placeholder="Mínimo 8 caracteres" required />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" onClick={() => setShowPwd(v => !v)}>
                    {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1">Confirmar contraseña <span className="text-red-500">*</span></label>
                <input className="input w-full" type={showPwd ? 'text' : 'password'} value={form.confirmar_password} onChange={set('confirmar_password')} placeholder="Repetir contraseña" required />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-navy text-base">Confirmar datos</h2>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-2 text-sm">
                {[
                  ['Empresa', form.empresa_nombre],
                  form.razon_social ? ['Razón social', form.razon_social] : null,
                  form.cuit ? ['CUIT', form.cuit] : null,
                  form.telefono ? ['Teléfono', form.telefono] : null,
                  ['Email admin', form.email],
                ].filter(Boolean).map((pair) => { const [k, v] = pair as [string, string]; return (
                  <div key={k} className="flex justify-between">
                    <span className="text-slate-400">{k}</span>
                    <span className="font-medium text-navy">{v}</span>
                  </div>
                ); })}
              </div>
              <div className="bg-emerald/5 border border-emerald/20 rounded-xl p-4 text-sm">
                <p className="font-semibold text-emerald mb-1">30 días de prueba gratuita</p>
                <p className="text-slate-500 text-xs">Acceso completo a todos los módulos. Sin tarjeta de crédito.</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Lock size={11} className="text-emerald" />
                Instancia aislada con PostgreSQL RLS. Tus datos son solo tuyos.
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            {step > 1 ? (
              <button type="button" onClick={() => { setError(''); setStep(s => (s - 1) as 1 | 2 | 3); }} className="btn-secondary flex items-center gap-1">
                <ChevronLeft size={15} /> Atrás
              </button>
            ) : (
              <div />
            )}
            {step < 3 ? (
              <button type="submit" className="btn-primary flex items-center gap-1">
                Siguiente <ChevronRight size={15} />
              </button>
            ) : (
              <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 min-w-[140px] justify-center disabled:opacity-50">
                {loading ? <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> : <><Check size={15} /> Crear cuenta</>}
              </button>
            )}
          </div>
        </form>

        <p className="text-center text-xs text-slate-400 pb-5">
          ¿Ya tenés cuenta?{' '}
          <Link to="/login" onClick={onClose} className="text-brand-blue font-semibold hover:underline">Iniciar sesión</Link>
        </p>
      </div>
    </div>
  );
}

/* ─── MOCKUP: marco de navegador (product screenshot look) ─── */
function BrowserFrame({ url = 'app.custos.com.ar', children }: { url?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-2xl shadow-slate-300/40 bg-white">
      <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-b border-slate-100">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-300" />
          <span className="w-3 h-3 rounded-full bg-amber/60" />
          <span className="w-3 h-3 rounded-full bg-emerald/60" />
        </div>
        <div className="flex-1 mx-3">
          <div className="bg-white border border-slate-200 rounded-md px-3 py-1 text-[10px] font-mono text-slate-400 flex items-center gap-1.5 w-fit">
            <Lock size={9} className="text-emerald" /> {url}
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}

/* ─── MOCKUP: teléfono (app del vigilador) ─── */
function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-[280px] rounded-[2.5rem] border-[10px] border-navy bg-navy shadow-2xl shadow-navy/30 overflow-hidden">
      <div className="relative bg-canvas rounded-[1.8rem] overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-navy rounded-b-2xl z-10" />
        {children}
      </div>
    </div>
  );
}

/* ─── MAIN LANDING ─── */
export default function LandingPage() {
  const [showModal, setShowModal] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const openDemo = () => { setShowModal(true); setMenuOpen(false); };

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      {showModal && <DemoModal onClose={() => setShowModal(false)} />}

      {/* ── NAV ── */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/98 backdrop-blur-xl shadow-sm border-b border-slate-100' : 'bg-white/80 backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center shadow-lg shadow-brand-blue/30">
              <Shield size={17} className="text-white" />
            </div>
            <span className="font-display text-xl font-black tracking-tighter uppercase italic text-navy">
              Cust<span className="text-brand-blue">OS</span>
            </span>
          </div>

          <div className="hidden md:flex gap-8 text-[10px] font-black font-mono uppercase tracking-[0.2em] text-slate-500">
            {[['#plataforma', 'Plataforma'], ['#modulos', 'Módulos'], ['#como-funciona', 'Cómo funciona'], ['#planes', 'Planes']].map(([href, label]) => (
              <a key={href} href={href} className="hover:text-brand-blue transition-colors">{label}</a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="hidden md:block text-[10px] font-black font-mono uppercase tracking-widest text-slate-500 hover:text-navy transition-colors">
              Ingresar
            </Link>
            <button onClick={openDemo} className="bg-brand-blue text-white px-5 py-2.5 rounded-xl font-black text-[10px] font-mono uppercase tracking-widest shadow-xl shadow-brand-blue/30 hover:bg-brand-deep transition-all active:scale-95">
              Solicitar demo
            </button>
            <button onClick={() => setMenuOpen(m => !m)} className="md:hidden text-navy">
              <Menu size={22} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 px-6 py-4 space-y-1 shadow-xl">
            {[['#plataforma', 'Plataforma'], ['#modulos', 'Módulos'], ['#como-funciona', 'Cómo funciona'], ['#planes', 'Planes']].map(([href, label]) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)} className="block text-sm font-bold text-navy py-3 border-b border-slate-50 last:border-b-0">{label}</a>
            ))}
            <Link to="/login" className="block text-sm font-bold text-slate-400 py-3">Ingresar</Link>
          </div>
        )}
      </nav>

      {/* ── HERO — texto izquierda + dashboard de producto derecha ── */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-b from-brand-tint/60 via-white to-white">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-blue/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div className="space-y-7">
              <div className="inline-flex items-center gap-2 bg-white border border-slate-200 shadow-sm px-4 py-2 rounded-full">
                <div className="w-1.5 h-1.5 bg-emerald rounded-full animate-pulse" />
                <span className="text-[10px] font-black font-mono text-slate-500 uppercase tracking-[0.2em]">Software de gestión de seguridad · Argentina</span>
              </div>
              <h1 className="font-display text-5xl lg:text-6xl font-black text-navy leading-[0.95] tracking-tighter">
                Toda tu operación<br />de seguridad,<br />
                <span className="text-brand-blue">en una plataforma.</span>
              </h1>
              <p className="text-slate-500 text-lg leading-relaxed max-w-xl">
                CustOS conecta cuadrantes, personal, monitoreo electrónico, contratos y facturación en un solo flujo. Menos trabajo manual, márgenes protegidos y transparencia total para tus clientes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={openDemo}
                  className="bg-brand-blue text-white px-8 py-4 rounded-2xl font-black text-sm shadow-2xl shadow-brand-blue/30 hover:bg-brand-deep transition-all flex items-center justify-center gap-2 group active:scale-95"
                >
                  Crear cuenta de prueba gratis
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <Link
                  to="/login"
                  className="border border-slate-200 text-navy hover:border-brand-blue hover:text-brand-blue px-8 py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2"
                >
                  Ya tengo cuenta
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-emerald" /> 30 días gratis</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-emerald" /> Sin tarjeta de crédito</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-emerald" /> Instancia propia</span>
              </div>
            </div>

            {/* Dashboard mockup */}
            <div className="relative">
              <BrowserFrame url="app.custos.com.ar/monitoring">
                <div className="p-5 bg-canvas space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-navy font-bold text-sm">Centro de Operaciones</p>
                      <p className="text-slate-400 text-[10px] font-mono">En vivo · 03:17 AM</p>
                    </div>
                    <div className="flex items-center gap-1.5 bg-emerald/10 text-emerald px-2.5 py-1 rounded-full text-[10px] font-bold">
                      <span className="w-1.5 h-1.5 bg-emerald rounded-full animate-pulse" /> Operativo
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { val: '24', label: 'Vigiladores', color: 'text-emerald' },
                      { val: '100%', label: 'Cobertura', color: 'text-navy' },
                      { val: '0', label: 'Alertas', color: 'text-navy' },
                    ].map(k => (
                      <div key={k.label} className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm">
                        <p className={`text-2xl font-black italic ${k.color}`}>{k.val}</p>
                        <p className="text-slate-400 text-[9px] font-mono uppercase tracking-wider mt-0.5">{k.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
                    <p className="text-slate-400 text-[9px] font-mono uppercase tracking-wider mb-2.5">Puestos activos</p>
                    {[
                      ['Banco Austral — Acceso', 2],
                      ['Planta Norte — Perímetro', 3],
                      ['Edificio Mitre — Control vehicular', 1],
                    ].map(([name, g]) => (
                      <div key={name as string} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                        <span className="text-slate-600 text-xs truncate">{name}</span>
                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                          <span className="text-slate-400 text-[10px] font-mono">{g}v</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </BrowserFrame>
              {/* tarjeta flotante */}
              <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl p-3.5 shadow-xl border border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 bg-brand-blue/10 rounded-xl flex items-center justify-center">
                  <TrendingUp size={17} className="text-brand-blue" />
                </div>
                <div>
                  <p className="text-[9px] font-black font-mono text-slate-400 uppercase tracking-widest">Dotación calculada</p>
                  <p className="text-sm font-black text-navy">4.2 vigs / puesto 24×7</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <section id="plataforma" className="py-10 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-[10px] font-black font-mono text-slate-400 uppercase tracking-[0.25em] mb-6">
            Construido para la operación real de la seguridad privada argentina
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: Shield, label: 'Convenio 507' },
              { icon: Lock, label: 'Datos aislados por empresa' },
              { icon: Smartphone, label: 'App para cada vigilador' },
              { icon: Activity, label: 'Monitoreo SIA en vivo' },
            ].map(t => (
              <div key={t.label} className="flex items-center justify-center gap-2.5 text-slate-500">
                <t.icon size={18} className="text-brand-blue shrink-0" />
                <span className="text-sm font-bold text-navy">{t.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURE 1 — Cuadrante (texto izq · mockup der) ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 text-[10px] font-black font-mono text-brand-blue uppercase tracking-[0.2em]">
                <Calendar size={13} /> Cuadrante inteligente
              </span>
              <h2 className="font-display text-4xl lg:text-5xl font-black text-navy tracking-tighter leading-tight">
                Los turnos se arman<br /><span className="text-brand-blue">solos.</span>
              </h2>
              <p className="text-slate-500 text-base leading-relaxed">
                Definí un esquema de turno (12×12, 24×24) y afectá un vigilador a un puesto. CustOS genera automáticamente los turnos planificados y te avisa dónde falta cobertura — antes de que lo note el cliente.
              </p>
              <ul className="space-y-3">
                {[
                  'Generación automática de turnos desde esquemas cíclicos',
                  'Detección de huecos de cobertura en tiempo real',
                  'Cálculo de dotación real por puesto (factor 4.2)',
                  'Solicitud y aprobación de cambios de turno',
                ].map(i => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                    <CheckCircle2 size={16} className="text-emerald shrink-0 mt-0.5" /> {i}
                  </li>
                ))}
              </ul>
            </div>
            <BrowserFrame url="app.custos.com.ar/quadrant">
              <div className="p-5 bg-canvas">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-navy font-bold text-sm">Objetivo · Banco Austral</p>
                  <span className="bg-emerald/10 text-emerald text-[10px] font-bold px-2 py-1 rounded-full">Cobertura OK</span>
                </div>
                <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
                  <div className="grid grid-cols-8 text-[9px] font-mono text-slate-400 bg-slate-50 border-b border-slate-100">
                    <div className="p-1.5">Vig.</div>
                    {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => <div key={i} className="p-1.5 text-center">{d}</div>)}
                  </div>
                  {[
                    ['Pérez, J.', [1, 1, 0, 1, 1, 0, 1]],
                    ['García, M.', [0, 1, 1, 0, 1, 1, 0]],
                    ['López, R.', [1, 0, 1, 1, 0, 1, 1]],
                    ['Díaz, S.', [1, 1, 1, 0, 1, 0, 1]],
                  ].map(([name, days]) => (
                    <div key={name as string} className="grid grid-cols-8 items-center border-b border-slate-50 last:border-0">
                      <div className="p-1.5 text-[10px] text-slate-600 font-medium truncate">{name}</div>
                      {(days as number[]).map((on, i) => (
                        <div key={i} className="p-1.5 flex justify-center">
                          <span className={`w-full h-4 rounded ${on ? 'bg-brand-blue/80' : 'bg-slate-100'}`} />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-brand-blue/80" /> Trabaja</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-slate-100" /> Franco</span>
                </div>
              </div>
            </BrowserFrame>
          </div>
        </div>
      </section>

      {/* ── FEATURE 2 — App vigilador (mockup izq · texto der) ── */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <PhoneFrame>
                <div className="pt-8 pb-5 px-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-brand-blue rounded-lg flex items-center justify-center">
                      <Shield size={14} className="text-white" />
                    </div>
                    <span className="font-display text-sm font-black text-navy uppercase italic">CustOS</span>
                  </div>
                  <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                    <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">Turno actual</p>
                    <p className="text-navy font-bold text-sm mt-1">Planta Norte — Perímetro</p>
                    <p className="text-slate-400 text-xs mt-0.5">Hoy · 06:00 – 18:00</p>
                    <div className="mt-3 flex items-center gap-2 text-emerald text-xs font-bold">
                      <CheckCircle2 size={13} /> Entrada registrada 05:58
                    </div>
                  </div>
                  <button className="w-full bg-brand-blue text-white rounded-2xl py-3 text-sm font-black flex items-center justify-center gap-2 shadow-lg shadow-brand-blue/30">
                    <Fingerprint size={16} /> Marcar salida
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white rounded-xl p-3 border border-slate-100 text-center">
                      <QrCode size={18} className="text-brand-blue mx-auto" />
                      <p className="text-[10px] text-slate-500 mt-1 font-medium">Ronda QR</p>
                    </div>
                    <div className="bg-white rounded-xl p-3 border border-slate-100 text-center">
                      <AlertTriangle size={18} className="text-amber mx-auto" />
                      <p className="text-[10px] text-slate-500 mt-1 font-medium">Novedad</p>
                    </div>
                  </div>
                </div>
              </PhoneFrame>
            </div>
            <div className="order-1 lg:order-2 space-y-6">
              <span className="inline-flex items-center gap-2 text-[10px] font-black font-mono text-brand-blue uppercase tracking-[0.2em]">
                <Smartphone size={13} /> App Vigilancia Móvil
              </span>
              <h2 className="font-display text-4xl lg:text-5xl font-black text-navy tracking-tighter leading-tight">
                Cada vigilador,<br /><span className="text-brand-blue">conectado.</span>
              </h2>
              <p className="text-slate-500 text-base leading-relaxed">
                Los vigiladores se autentican con su legajo y PIN. Ven su turno, registran entrada y salida con geolocalización, hacen rondas con QR y solicitan cambios de turno — todo desde el celular, sin llamadas ni WhatsApp.
              </p>
              <ul className="space-y-3">
                {[
                  'Login por legajo + PIN, sin depender de email',
                  'Check-in / check-out con validación de ubicación',
                  'Rondas verificadas con puntos de control QR',
                  'Botón de pánico y novedades en tiempo real',
                ].map(i => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                    <CheckCircle2 size={16} className="text-emerald shrink-0 mt-0.5" /> {i}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURE 3 — Cotización y margen (texto izq · mockup der) ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 text-[10px] font-black font-mono text-brand-blue uppercase tracking-[0.2em]">
                <DollarSign size={13} /> Cotización y facturación
              </span>
              <h2 className="font-display text-4xl lg:text-5xl font-black text-navy tracking-tighter leading-tight">
                Sabé tu margen<br /><span className="text-brand-blue">antes de firmar.</span>
              </h2>
              <p className="text-slate-500 text-base leading-relaxed">
                El cotizador calcula la dotación real, las cargas sociales y el margen de cada contrato. Generá el contrato en PDF con tu logo, configurá la facturación (abono fijo o por horas) y controlá la rentabilidad de punta a punta.
              </p>
              <ul className="space-y-3">
                {[
                  'Cotizador con factor de dotación 4.2 y cargas sociales',
                  'Contratos en PDF con plantilla editable y firma',
                  'Facturación por abono fijo o por horas reales',
                  'Rentabilidad visible por contrato y objetivo',
                ].map(i => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                    <CheckCircle2 size={16} className="text-emerald shrink-0 mt-0.5" /> {i}
                  </li>
                ))}
              </ul>
            </div>
            <BrowserFrame url="app.custos.com.ar/quotes">
              <div className="p-5 bg-canvas space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-navy font-bold text-sm">Cotización · Planta Norte</p>
                  <span className="bg-brand-blue/10 text-brand-blue text-[10px] font-bold px-2 py-1 rounded-full">Margen 28%</span>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm space-y-2.5">
                  {[
                    ['Puesto 24×7 · dotación', '4.2 vigs'],
                    ['Costo laboral + cargas', '$3.180.000'],
                    ['Vehículo + herramientas', '$420.000'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between text-xs">
                      <span className="text-slate-500">{k}</span>
                      <span className="text-navy font-mono font-bold">{v}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm pt-2 border-t border-slate-100">
                    <span className="text-navy font-bold">Total mensual</span>
                    <span className="text-brand-blue font-mono font-black">$5.010.000</span>
                  </div>
                </div>
                {/* mini bar chart */}
                <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
                  <p className="text-slate-400 text-[9px] font-mono uppercase tracking-wider mb-3">Facturación · últimos 6 meses</p>
                  <div className="flex items-end justify-between gap-2 h-20">
                    {[45, 58, 52, 70, 66, 82].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className={`w-full rounded-t ${i === 5 ? 'bg-brand-blue' : 'bg-brand-blue/30'}`} style={{ height: `${h}%` }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </BrowserFrame>
          </div>
        </div>
      </section>

      {/* ── FEATURE 4 — Centro de operaciones (mockup izq · texto der) ── */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <BrowserFrame url="app.custos.com.ar/monitoring">
                <div className="p-5 bg-navy space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-white font-bold text-sm">Mapa operativo · En vivo</p>
                    <span className="text-white/40 text-[10px] font-mono">SIA DC-09</span>
                  </div>
                  {/* mock map */}
                  <div className="relative h-40 rounded-xl bg-[#0a1830] border border-white/10 overflow-hidden">
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 20h40M20 0v40' stroke='%234a7fd4' stroke-width='0.4'/%3E%3C/svg%3E\")" }} />
                    <span className="absolute top-6 left-10 w-3 h-3 rounded-full bg-emerald ring-4 ring-emerald/20" />
                    <span className="absolute top-20 left-32 w-3 h-3 rounded-full bg-emerald ring-4 ring-emerald/20" />
                    <span className="absolute top-14 right-14 w-3 h-3 rounded-full bg-amber ring-4 ring-amber/20 animate-pulse" />
                    <span className="absolute bottom-8 left-20 w-3 h-3 rounded-full bg-emerald ring-4 ring-emerald/20" />
                  </div>
                  <div className="bg-amber/10 border border-amber/20 rounded-xl p-3 flex items-center gap-2.5">
                    <AlertTriangle size={14} className="text-amber shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-amber text-xs font-bold">Alarma · Edificio Mitre</p>
                      <p className="text-white/40 text-[10px]">Zona 3 — apertura fuera de horario · 03:12</p>
                    </div>
                    <span className="text-white/30 text-[10px] font-mono">ETA 4′</span>
                  </div>
                </div>
              </BrowserFrame>
            </div>
            <div className="order-1 lg:order-2 space-y-6">
              <span className="inline-flex items-center gap-2 text-[10px] font-black font-mono text-brand-blue uppercase tracking-[0.2em]">
                <Activity size={13} /> Centro de Operaciones
              </span>
              <h2 className="font-display text-4xl lg:text-5xl font-black text-navy tracking-tighter leading-tight">
                Monitoreo y campo,<br /><span className="text-brand-blue">en el mismo tablero.</span>
              </h2>
              <p className="text-slate-500 text-base leading-relaxed">
                Las alarmas SIA DC-09, las rondas de los vigiladores y los eventos de pánico llegan al mismo lugar, vinculados al objetivo y con contexto operativo. El operador ve dónde está cada uno y despacha en segundos.
              </p>
              <ul className="space-y-3">
                {[
                  'Recepción de eventos de alarma con protocolo SIA DC-09',
                  'Mapa en vivo con estado de cada puesto',
                  'Alertas de pánico desde la app del vigilador',
                  'Trazabilidad completa de cada evento',
                ].map(i => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                    <CheckCircle2 size={16} className="text-emerald shrink-0 mt-0.5" /> {i}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── MÓDULOS ── */}
      <section id="modulos" ref={featuresRef} className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <span className="text-[10px] font-black font-mono text-brand-blue uppercase tracking-[0.2em]">Una sola plataforma</span>
            <h2 className="font-display text-4xl lg:text-5xl font-black text-navy tracking-tighter">
              Todo lo que tu operación necesita.
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">Doce módulos integrados que reemplazan las planillas, los grupos de WhatsApp y los sistemas sueltos.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Users, color: 'bg-brand-blue/10 text-brand-blue', title: 'Gestión de Personal', desc: 'Legajos, credenciales y foto. Alertas de vencimiento de Carnet, Psicofísico y Antecedentes.', tags: ['Legajos', 'Credenciales', 'Importación Excel'] },
              { icon: Calendar, color: 'bg-emerald/10 text-emerald', title: 'Cuadrante Inteligente', desc: 'Esquemas cíclicos, afectación automática a puestos y detección de huecos en tiempo real.', tags: ['Turnos automáticos', 'Cobertura', 'Cambios de turno'] },
              { icon: FileText, color: 'bg-purple-100 text-purple-600', title: 'Cotizaciones y Contratos', desc: 'Cotizador con dotación real (4.2), margen y cargas. Contratos en PDF con plantilla y logo.', tags: ['Factor 4.2', 'PDF', 'Historial'] },
              { icon: BarChart3, color: 'bg-amber/10 text-amber', title: 'Clientes y Objetivos', desc: 'Clientes con objetivos asociados, puestos por turno y vínculo directo con contratos.', tags: ['Multi-objetivo', 'Puestos', 'Activación'] },
              { icon: Activity, color: 'bg-red-100 text-red-500', title: 'Centro de Operaciones', desc: 'Monitoreo en tiempo real con SIA DC-09. Eventos clasificados y vinculados al objetivo.', tags: ['SIA DC-09', 'Mapa en vivo', 'Pánico'] },
              { icon: Smartphone, color: 'bg-brand-blue/10 text-brand-blue', title: 'App Vigilancia Móvil', desc: 'Login por legajo y PIN, check-in/checkout, rondas con QR y solicitud de cambio de turno.', tags: ['Login PIN', 'Check-in', 'Rondas QR'] },
              { icon: Truck, color: 'bg-emerald/10 text-emerald', title: 'Flota y Vehículos', desc: 'VTV, seguro y habilitaciones. Asignación a objetivos y control de costo por hora.', tags: ['VTV', 'Por objetivo', 'Costo'] },
              { icon: Wrench, color: 'bg-orange-100 text-orange-500', title: 'Herramientas y Equipos', desc: 'Inventario por vigilador. Trazabilidad de entrega, estado e historial.', tags: ['Por vigilador', 'Trazabilidad', 'Estado'] },
              { icon: ClipboardList, color: 'bg-purple-100 text-purple-600', title: 'Novedades y Rondas', desc: 'Novedades digitales por turno. Rondas verificadas con QR e historial por objetivo.', tags: ['Rondas QR', 'Novedades', 'Historial'] },
              { icon: Bell, color: 'bg-amber/10 text-amber', title: 'Notificaciones y Alertas', desc: 'Alertas en tiempo real de credenciales por vencer, personal insuficiente y pánico.', tags: ['En app', 'Email', 'Pánico'] },
              { icon: CreditCard, color: 'bg-emerald/10 text-emerald', title: 'Facturación y Compras', desc: 'Facturación por abono fijo o por horas. Módulo de compras para gastos operativos.', tags: ['Abono', 'Por horas', 'Proveedores'] },
              { icon: UploadCloud, color: 'bg-brand-blue/10 text-brand-blue', title: 'Configuración y Branding', desc: 'Logo y firma en documentos. Plantillas personalizables y roles con permisos.', tags: ['Logo', 'Plantillas', 'Roles'] },
            ].map(m => (
              <div key={m.title} className="bg-white p-6 rounded-2xl border border-slate-100 hover:shadow-lg hover:border-slate-200 transition-all group">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${m.color} group-hover:scale-110 transition-transform`}>
                  <m.icon size={22} />
                </div>
                <h3 className="font-bold text-navy text-base mb-2">{m.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">{m.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {m.tags.map(t => (
                    <span key={t} className="bg-slate-50 border border-slate-100 text-slate-400 text-[10px] font-bold px-2 py-1 rounded-full font-mono uppercase tracking-wider">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FACTOR 4.2 — banda de datos (navy) ── */}
      <section className="relative py-24 overflow-hidden bg-navy">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_80%_at_100%_50%,rgba(27,87,214,0.25),transparent)]" />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <span className="text-[10px] font-black font-mono text-brand-blue uppercase tracking-[0.2em]">Diferencial financiero</span>
              <h2 className="font-display text-4xl lg:text-5xl font-black text-white tracking-tighter leading-tight">
                Un puesto 24×7<br />no son 3 vigiladores.<br />
                <span className="text-brand-blue">Son 4.2.</span>
              </h2>
              <p className="text-white/55 text-base leading-relaxed">
                Francos, vacaciones, ausentismo y feriados. CustOS calcula la dotación real de cada puesto y la refleja en la cotización. Si cotizás con tres, la diferencia la pagás vos.
              </p>
              <div className="flex items-center gap-6 pt-2">
                <div className="text-center">
                  <p className="font-display text-6xl font-black italic text-brand-blue">4.2</p>
                  <p className="text-white/30 text-[10px] font-mono uppercase tracking-widest mt-1">Cálculo CustOS</p>
                </div>
                <div className="text-white/20 text-3xl font-black">vs</div>
                <div className="text-center">
                  <p className="font-display text-6xl font-black italic text-white/20 line-through">3</p>
                  <p className="text-white/20 text-[10px] font-mono uppercase tracking-widest mt-1">Error común</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Horas anuales por puesto (24×7)', value: '8.760 hs' },
                { label: 'Jornada máxima legal (Conv. 507)', value: '48 hs/sem' },
                { label: 'Vigiladores necesarios base', value: '3.44' },
                { label: 'Factor real (francos + vacaciones)', value: '× 1.22' },
                { label: 'Dotación real requerida', value: '≈ 4.2 vigiladores', highlight: true },
              ].map(row => (
                <div key={row.label} className={`flex justify-between items-center py-4 border-b ${row.highlight ? 'border-brand-blue/30' : 'border-white/8'}`}>
                  <span className={`text-sm ${row.highlight ? 'font-black text-white' : 'text-white/50'}`}>{row.label}</span>
                  <span className={`font-black font-mono text-sm ${row.highlight ? 'text-brand-blue text-lg' : 'text-white'}`}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CÓMO FUNCIONA ── */}
      <section id="como-funciona" className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <span className="text-[10px] font-black font-mono text-brand-blue uppercase tracking-[0.2em]">Onboarding</span>
            <h2 className="font-display text-4xl lg:text-5xl font-black text-navy tracking-tighter">
              Operativo en tres pasos.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-14 left-[calc(33%-40px)] right-[calc(33%-40px)] h-0.5 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
            {[
              { step: '01', icon: Globe, title: 'Creá tu cuenta', desc: 'Registrá tu empresa en minutos. Se genera una instancia aislada con tus datos, tu logo y tu equipo.' },
              { step: '02', icon: Users, title: 'Cargá tu operación', desc: 'Importá vigiladores con Excel, cargá clientes y objetivos, definí los puestos y armá los cuadrantes.' },
              { step: '03', icon: CheckCircle2, title: 'Operá en tiempo real', desc: 'Los vigiladores trabajan desde la app, el COC ve las alarmas en vivo y vos ves el margen de cada contrato.' },
            ].map(s => (
              <div key={s.step} className="relative text-center p-8 space-y-5 rounded-2xl border border-slate-100 hover:border-brand-blue/20 hover:shadow-lg transition-all">
                <div className="absolute -top-2 left-6 text-[90px] font-black text-slate-50 leading-none font-display italic select-none">{s.step}</div>
                <div className="w-14 h-14 bg-brand-blue/10 rounded-2xl flex items-center justify-center mx-auto relative z-10">
                  <s.icon size={26} className="text-brand-blue" />
                </div>
                <h3 className="font-bold text-navy text-lg relative z-10">{s.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed relative z-10">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL / SEGURIDAD ── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-10 md:p-14 text-center space-y-6">
            <div className="flex justify-center gap-1">
              {[...Array(5)].map((_, i) => <Star key={i} size={18} className="text-amber fill-amber" />)}
            </div>
            <p className="font-display text-2xl lg:text-3xl font-bold text-navy leading-snug tracking-tight">
              “Pasamos de tres planillas y un grupo de WhatsApp a un solo tablero. Ahora sé la cobertura de cada objetivo y el margen de cada contrato en tiempo real.”
            </p>
            <div>
              <p className="font-bold text-navy">Dirección de Operaciones</p>
              <p className="text-slate-400 text-sm">Empresa de seguridad privada · Buenos Aires</p>
            </div>
            <div className="pt-6 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: Lock, label: 'PostgreSQL RLS' },
                { icon: ShieldCheck, label: 'JWT firmado' },
                { icon: Star, label: 'Convenio 507' },
                { icon: Globe, label: 'HTTPS full' },
              ].map(f => (
                <div key={f.label} className="flex items-center justify-center gap-2 text-slate-500">
                  <f.icon size={16} className="text-brand-blue" />
                  <span className="text-xs font-bold text-navy">{f.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PLANES ── */}
      <section id="planes" className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <span className="text-[10px] font-black font-mono text-brand-blue uppercase tracking-[0.2em]">Planes</span>
            <h2 className="font-display text-4xl lg:text-5xl font-black text-navy tracking-tighter">
              Escalá a tu ritmo.
            </h2>
            <p className="text-slate-500 text-base max-w-xl mx-auto">Todos los planes incluyen 30 días de prueba gratuita. Sin tarjeta de crédito.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-start">
            {[
              { name: 'Core', badge: null, featured: false, subtitle: 'Para empresas que arrancan a ordenar la operación.', price: 'Consultar', priceNote: 'por vigilador activo / mes', features: ['Gestión de personal completa', 'Cuadrante inteligente', 'Clientes y objetivos', 'Cotizador con dotación', 'Contratos en PDF', 'App Vigilancia Móvil', 'Rondas con QR', 'Novedades digitales'] },
              { name: 'Pro', badge: 'Más elegido', featured: true, subtitle: 'Control total del margen y la operación.', price: 'Consultar', priceNote: 'por vigilador activo / mes', features: ['Todo en Core', 'Centro de Operaciones (SIA)', 'Monitoreo en tiempo real', 'Gestión de flota', 'Herramientas y equipos', 'Módulo de compras', 'Facturación por contrato', 'Análisis de rentabilidad'] },
              { name: 'Command', badge: null, featured: false, subtitle: 'Para grupos con múltiples empresas o regiones.', price: 'Custom', priceNote: 'según volumen de operación', features: ['Todo en Pro', 'Multi-empresa en un panel', 'API e integraciones', 'VPC dedicado', 'SLA garantizado', 'Soporte prioritario', 'Onboarding asistido', 'Configuración a medida'] },
            ].map(plan => (
              <div key={plan.name} className={`rounded-3xl border p-8 flex flex-col transition-all ${
                plan.featured ? 'bg-navy text-white border-brand-blue/30 shadow-2xl shadow-navy/20 scale-105' : 'bg-white text-navy border-slate-100 hover:shadow-xl hover:border-slate-200'
              }`}>
                {plan.badge && (
                  <span className="inline-block bg-brand-blue text-white text-[10px] font-black font-mono px-3 py-1 rounded-full uppercase tracking-widest mb-4 w-fit">{plan.badge}</span>
                )}
                <h3 className="font-display text-2xl font-black italic uppercase tracking-tighter mb-1">CustOS {plan.name}</h3>
                <p className={`text-sm mb-6 ${plan.featured ? 'text-white/50' : 'text-slate-400'}`}>{plan.subtitle}</p>
                <div className="mb-8">
                  <p className={`font-display text-3xl font-black italic ${plan.featured ? 'text-brand-blue' : 'text-navy'}`}>{plan.price}</p>
                  <p className={`text-[10px] font-mono mt-1 ${plan.featured ? 'text-white/30' : 'text-slate-400'}`}>{plan.priceNote}</p>
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <CheckCircle size={14} className={`mt-0.5 shrink-0 ${plan.featured ? 'text-brand-blue' : 'text-emerald'}`} />
                      <span className={plan.featured ? 'text-white/70' : 'text-slate-600'}>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={openDemo}
                  className={`w-full py-3 rounded-xl font-black text-xs font-mono uppercase tracking-widest transition-all active:scale-95 ${
                    plan.featured ? 'bg-brand-blue text-white hover:bg-brand-deep shadow-xl shadow-brand-blue/30' : 'bg-slate-50 border border-slate-200 text-navy hover:bg-brand-blue hover:text-white hover:border-brand-blue'
                  }`}
                >
                  Probá gratis 30 días
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="relative py-28 overflow-hidden bg-brand-blue">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_0%_0%,rgba(255,255,255,0.12),transparent)]" />
        <div className="relative max-w-4xl mx-auto px-6 text-center space-y-8">
          <h2 className="font-display text-4xl lg:text-6xl font-black text-white tracking-tighter leading-tight">
            Modernizá tu operación<br />hoy mismo.
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
            30 días gratis, instancia propia, sin tarjeta de crédito. En menos de 5 minutos tenés CustOS configurado con los datos de tu empresa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={openDemo}
              className="bg-white text-brand-blue px-10 py-4 rounded-2xl font-black text-base shadow-2xl shadow-black/20 hover:bg-slate-50 transition-all inline-flex items-center justify-center gap-2 group active:scale-95"
            >
              Crear mi cuenta de prueba
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <Link
              to="/login"
              className="border border-white/30 text-white hover:bg-white/10 px-10 py-4 rounded-2xl font-black text-base transition-all inline-flex items-center justify-center gap-2"
            >
              Ya tengo cuenta
            </Link>
          </div>
          <p className="text-white/40 text-xs font-mono">Sin tarjeta · Sin compromiso · Cancelás cuando querés</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-navy text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 pb-12 border-b border-white/5">
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center">
                  <Shield size={17} className="text-white" />
                </div>
                <span className="font-display text-xl font-black italic uppercase">Cust<span className="text-brand-blue">OS</span></span>
              </div>
              <p className="text-white/30 text-sm leading-relaxed max-w-xs">
                El sistema operativo de la seguridad privada en Argentina. Cuadrantes, personal, contratos y monitoreo en un solo lugar.
              </p>
              <p className="text-white/20 text-[10px] font-mono uppercase tracking-widest">Hecho en Buenos Aires · Convenio 507/07</p>
            </div>
            <div>
              <h5 className="text-[10px] font-black font-mono text-brand-blue uppercase tracking-widest mb-6">Plataforma</h5>
              <ul className="space-y-3 text-sm text-white/40">
                {['Personal y Cuadrante', 'Clientes y Contratos', 'Centro de Operaciones', 'App Vigilador', 'Facturación'].map(l => (
                  <li key={l}><a href="#modulos" className="hover:text-white transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="text-[10px] font-black font-mono text-brand-blue uppercase tracking-widest mb-6">Empresa</h5>
              <ul className="space-y-3 text-sm text-white/40">
                {[['#como-funciona', 'Cómo funciona'], ['#planes', 'Planes'], ['/login', 'Ingresar']].map(([href, label]) => (
                  <li key={label}>
                    <a href={href} className="hover:text-white transition-colors">{label}</a>
                  </li>
                ))}
                <li>
                  <button onClick={openDemo} className="text-brand-blue hover:text-white transition-colors font-bold">Probá gratis →</button>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono uppercase tracking-widest text-white/20">
            <p>© {new Date().getFullYear()} CustOS ERP · Buenos Aires, Argentina</p>
            <p>Protegé tu margen · Custodiá tu operación</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
