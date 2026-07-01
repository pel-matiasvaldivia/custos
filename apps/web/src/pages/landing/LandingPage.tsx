import { useState, useEffect, useRef, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Shield, ShieldCheck, Users, FileText, BarChart3, Smartphone,
  MapPin, AlertTriangle, CheckCircle, CheckCircle2, ChevronRight, ChevronLeft,
  ArrowRight, X, Eye, EyeOff, Activity, Building2, User, Check,
  ClipboardList, Truck, Wrench, Bell, Lock, Globe, Star,
  Calendar, CreditCard, UploadCloud, Menu,
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
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/98 backdrop-blur-xl shadow-sm border-b border-slate-100'
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center shadow-lg shadow-brand-blue/30">
              <Shield size={17} className="text-white" />
            </div>
            <span className={`font-display text-xl font-black tracking-tighter uppercase italic transition-colors ${scrolled ? 'text-navy' : 'text-white'}`}>
              Cust<span className="text-brand-blue">OS</span>
            </span>
          </div>

          <div className={`hidden md:flex gap-8 text-[10px] font-black font-mono uppercase tracking-[0.2em] transition-colors ${scrolled ? 'text-slate-500' : 'text-white/70'}`}>
            {[['#problema', 'El Problema'], ['#modulos', 'Módulos'], ['#como-funciona', 'Cómo funciona'], ['#planes', 'Planes']].map(([href, label]) => (
              <a key={href} href={href} className="hover:text-brand-blue transition-colors">{label}</a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className={`hidden md:block text-[10px] font-black font-mono uppercase tracking-widest transition-colors ${scrolled ? 'text-slate-500 hover:text-navy' : 'text-white/70 hover:text-white'}`}>
              Ingresar
            </Link>
            <button onClick={openDemo} className="bg-brand-blue text-white px-5 py-2.5 rounded-xl font-black text-[10px] font-mono uppercase tracking-widest shadow-xl shadow-brand-blue/30 hover:bg-brand-deep transition-all active:scale-95">
              Probá gratis
            </button>
            <button onClick={() => setMenuOpen(m => !m)} className={`md:hidden ${scrolled ? 'text-navy' : 'text-white'}`}>
              <Menu size={22} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 px-6 py-4 space-y-1 shadow-xl">
            {[['#problema', 'El Problema'], ['#modulos', 'Módulos'], ['#como-funciona', 'Cómo funciona'], ['#planes', 'Planes']].map(([href, label]) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)} className="block text-sm font-bold text-navy py-3 border-b border-slate-50 last:border-b-0">{label}</a>
            ))}
            <Link to="/login" className="block text-sm font-bold text-slate-400 py-3">Ingresar</Link>
          </div>
        )}
      </nav>

      {/* ── HERO — imagen de guardia de seguridad ── */}
      <section
        className="relative min-h-screen flex items-center overflow-hidden bg-slate-900"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      >
        {/* Overlays para legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-slate-900/10" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16 w-full">
          <div className="max-w-3xl space-y-8">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full">
              <div className="w-1.5 h-1.5 bg-emerald rounded-full animate-pulse" />
              <span className="text-[10px] font-black font-mono text-white/80 uppercase tracking-[0.2em]">ERP para seguridad privada · Argentina</span>
            </div>

            <h1 className="font-display text-5xl lg:text-7xl font-black text-white leading-[0.9] tracking-tighter uppercase italic">
              Tu empresa de<br />seguridad,<br />
              <span className="text-brand-blue">bajo control.</span>
            </h1>

            <p className="text-white/60 text-lg leading-relaxed max-w-xl">
              CustOS integra la gestión de personal, cuadrantes, contratos, monitoreo electrónico y facturación en una sola plataforma — pensada para el Convenio 507 y la operación real de Argentina.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={openDemo}
                className="bg-brand-blue text-white px-8 py-4 rounded-2xl font-black text-sm shadow-2xl shadow-brand-blue/40 hover:bg-brand-deep transition-all flex items-center justify-center gap-2 group active:scale-95"
              >
                Crear cuenta de prueba gratis
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <Link
                to="/login"
                className="border border-white/20 text-white/70 hover:text-white hover:border-white/40 px-8 py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
              >
                Ya tengo cuenta
              </Link>
            </div>

            <p className="text-white/30 text-xs font-mono">Sin tarjeta de crédito · 30 días gratis · Instancia propia</p>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-30 animate-bounce">
          <div className="w-px h-8 bg-white" />
          <ChevronRight size={14} className="text-white rotate-90" />
        </div>
      </section>

      {/* ── STATS BAR — fondo claro ── */}
      <div className="bg-white border-b border-slate-100 py-8 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-100">
            {[
              { num: '100%', label: 'Multi-tenant aislado', color: 'text-brand-blue' },
              { num: 'Convenio 507', label: 'Cumplimiento argentino', color: 'text-navy' },
              { num: '12+ módulos', label: 'Operación integrada', color: 'text-navy' },
              { num: '30 días', label: 'Prueba sin costo', color: 'text-emerald' },
            ].map(s => (
              <div key={s.label} className="px-4">
                <p className={`text-xl font-black font-display italic ${s.color}`}>{s.num}</p>
                <p className="text-slate-400 text-[10px] font-mono uppercase tracking-widest mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── EL PROBLEMA ── */}
      <section id="problema" className="py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <span className="text-[10px] font-black font-mono text-brand-blue uppercase tracking-[0.2em]">El Problema</span>
            <h2 className="font-display text-4xl lg:text-6xl font-black text-navy italic uppercase tracking-tighter">
              La operación vive<br /><span className="text-red-500">en pedazos.</span>
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
              Toda empresa de seguridad física empieza igual: un Excel para cuadrantes, WhatsApp para relevos, y una hoja de cálculo para la facturación. Cuando escalan, el caos escala con ellos.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Calendar, title: 'Cuadrantes sin control', desc: 'Un turno en blanco a las 2 AM lo descubre el cliente, no vos. Los cambios de guardia se coordinan por mensaje y no quedan registrados.' },
              { icon: Users, title: 'Habilitaciones vencidas', desc: 'El Carnet de Vigilador, el Psicofísico, los antecedentes — todo vence. Sin seguimiento, exponés a la empresa a multas y pérdida de licitaciones.' },
              { icon: FileText, title: 'Cotizaciones imprecisas', desc: 'Un puesto 24/7 no lo cubre un vigilador, ni dos, ni tres. Sin calcular el factor de cobertura real (4.2), cada contrato puede ser deficitario.' },
              { icon: BarChart3, title: 'Margen invisible', desc: 'Sabés cuánto cobran pero no cuánto ganás. Los costos de personal, vehículos, herramientas y horas extras diluyen el margen sin que te des cuenta.' },
              { icon: MapPin, title: 'Monitoreo desconectado', desc: 'El software de alarmas no habla con RRHH, las rondas no aparecen en el tablero, y las alertas SIA llegan sin contexto operativo.' },
              { icon: AlertTriangle, title: 'Relevos por WhatsApp', desc: 'Cuando un vigilador falta, el supervisor llama hasta encontrar reemplazo. Sin sistema, no hay trazabilidad, aprobación formal ni registro.' },
            ].map(p => (
              <div key={p.title} className="p-6 bg-white border border-slate-100 rounded-2xl hover:border-red-100 hover:shadow-lg transition-all group">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-100 transition-colors">
                  <p.icon size={20} className="text-red-400" />
                </div>
                <h3 className="font-bold text-navy mb-2">{p.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LA SOLUCIÓN — split con imagen ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <span className="text-[10px] font-black font-mono text-brand-blue uppercase tracking-[0.2em]">La Solución</span>
              <h2 className="font-display text-4xl lg:text-5xl font-black text-navy italic uppercase tracking-tighter leading-tight">
                Un solo sistema.<br /><span className="text-brand-blue">Toda la operación.</span>
              </h2>
              <p className="text-slate-500 text-base leading-relaxed">
                CustOS es un ERP diseñado exclusivamente para empresas de seguridad privada argentina. Desde la cotización hasta el cheque de cada vigilador, pasando por el monitoreo electrónico en tiempo real.
              </p>
              <ul className="space-y-3">
                {[
                  'Cuadrantes generados automáticamente desde esquemas de turno',
                  'Alertas de credenciales antes de que venzan',
                  'Cotizaciones con factor de dotación real (4.2)',
                  'Contratos en PDF con tu logo y firma digital',
                  'App móvil para cada vigilador — check-in y rondas',
                ].map(item => (
                  <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
                    <CheckCircle2 size={16} className="text-emerald shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={openDemo}
                className="bg-brand-blue text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-brand-deep transition-all shadow-xl shadow-brand-blue/20 inline-flex items-center gap-2 group active:scale-95"
              >
                Probá 30 días gratis <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Imagen de equipo profesional */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-slate-200">
              <img
                src="https://images.unsplash.com/photo-1521791055366-0d553872952f?auto=format&fit=crop&w=800&q=80"
                alt="Equipo de seguridad profesional"
                className="w-full h-[520px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/10 to-transparent" />
              {/* Floating status card */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 flex items-center gap-4 shadow-xl">
                  <div className="w-10 h-10 bg-emerald/10 rounded-xl flex items-center justify-center shrink-0">
                    <CheckCircle2 size={20} className="text-emerald" />
                  </div>
                  <div>
                    <p className="text-navy font-bold text-sm">Cobertura verificada · En vivo</p>
                    <p className="text-slate-400 text-xs mt-0.5">24 vigiladores activos · 0 huecos de cobertura</p>
                  </div>
                  <div className="ml-auto w-2 h-2 bg-emerald rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MÓDULOS ── */}
      <section id="modulos" ref={featuresRef} className="py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <span className="text-[10px] font-black font-mono text-brand-blue uppercase tracking-[0.2em]">Plataforma Completa</span>
            <h2 className="font-display text-4xl lg:text-6xl font-black text-navy italic uppercase tracking-tighter">
              Todo lo que necesitás,<br />en un lugar.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: Users, color: 'bg-brand-blue/10 text-brand-blue', border: 'hover:border-brand-blue/20',
                title: 'Gestión de Personal',
                desc: 'Ficha completa: legajo, documentación, credenciales y foto. Alertas automáticas de vencimiento de Carnet, Psicofísico y Antecedentes.',
                tags: ['Legajos digitales', 'Credenciales', 'Importación Excel'],
              },
              {
                icon: Calendar, color: 'bg-emerald/10 text-emerald', border: 'hover:border-emerald/20',
                title: 'Cuadrante Inteligente',
                desc: 'Esquemas cíclicos (12x12, 24x24), afectación automática a puestos y generación de turnos. Detección de huecos en tiempo real.',
                tags: ['Turnos automáticos', 'Cobertura por puesto', 'Cambios de turno'],
              },
              {
                icon: FileText, color: 'bg-purple-100 text-purple-600', border: 'hover:border-purple-100',
                title: 'Cotizaciones y Contratos',
                desc: 'Cotizador con cálculo de dotación real (factor 4.2), margen y cargas sociales. Contratos en PDF con plantilla editable y logo.',
                tags: ['Factor 4.2 real', 'Contratos PDF', 'Historial'],
              },
              {
                icon: BarChart3, color: 'bg-amber/10 text-amber', border: 'hover:border-amber/20',
                title: 'Clientes y Objetivos',
                desc: 'Gestión de clientes con objetivos asociados, puestos por turno y vinculación directa con contratos y cobertura operativa.',
                tags: ['Multi-objetivo', 'Puestos por turno', 'Activación'],
              },
              {
                icon: Activity, color: 'bg-red-100 text-red-500', border: 'hover:border-red-100',
                title: 'Centro de Operaciones',
                desc: 'Monitoreo en tiempo real con protocolo SIA DC-09. Eventos de alarma recibidos, clasificados y vinculados al objetivo.',
                tags: ['SIA DC-09', 'Mapa en vivo', 'Alertas de pánico'],
              },
              {
                icon: Smartphone, color: 'bg-brand-blue/10 text-brand-blue', border: 'hover:border-brand-blue/20',
                title: 'App Vigilancia Móvil',
                desc: 'Login por legajo y PIN. Turno actual, check-in/checkout, rondas con QR y solicitud de cambio de turno desde el celular.',
                tags: ['Login por PIN', 'Check-in/checkout', 'Rondas QR'],
              },
              {
                icon: Truck, color: 'bg-emerald/10 text-emerald', border: 'hover:border-emerald/20',
                title: 'Flota y Vehículos',
                desc: 'Registro de vehículos con VTV, seguro y habilitaciones. Asignación a objetivos y control de costo por hora.',
                tags: ['VTV y seguro', 'Por objetivo', 'Costo operativo'],
              },
              {
                icon: Wrench, color: 'bg-orange-100 text-orange-500', border: 'hover:border-orange-100',
                title: 'Herramientas y Equipos',
                desc: 'Inventario de equipos por vigilador. Trazabilidad de entrega, estado actual e historial de asignaciones.',
                tags: ['Por vigilador', 'Trazabilidad', 'Estado'],
              },
              {
                icon: ClipboardList, color: 'bg-purple-100 text-purple-600', border: 'hover:border-purple-100',
                title: 'Novedades y Rondas',
                desc: 'Registro digital de novedades por turno. Rondas verificadas con puntos de control QR. Historial por objetivo y vigilador.',
                tags: ['Rondas con QR', 'Novedades digitales', 'Historial'],
              },
              {
                icon: Bell, color: 'bg-amber/10 text-amber', border: 'hover:border-amber/20',
                title: 'Notificaciones y Alertas',
                desc: 'Alertas en tiempo real para credenciales por vencer, personal insuficiente, eventos de alarma y pánico desde el campo.',
                tags: ['Alertas en app', 'Email automático', 'Pánico'],
              },
              {
                icon: CreditCard, color: 'bg-emerald/10 text-emerald', border: 'hover:border-emerald/20',
                title: 'Facturación y Compras',
                desc: 'Configuración de facturación por contrato: abono fijo, por horas planificadas o reales. Módulo de compras para gastos operativos.',
                tags: ['Abono fijo', 'Por horas', 'Proveedores'],
              },
              {
                icon: UploadCloud, color: 'bg-brand-blue/10 text-brand-blue', border: 'hover:border-brand-blue/20',
                title: 'Configuración y Branding',
                desc: 'Logo y firma en todos los documentos. Plantillas personalizables. Multi-usuario con roles y permisos granulares.',
                tags: ['Logo y firma', 'Plantillas', 'Roles'],
              },
            ].map(m => (
              <div key={m.title} className={`bg-white p-6 rounded-2xl border border-slate-100 ${m.border} hover:shadow-lg transition-all group`}>
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

      {/* ── FACTOR 4.2 — imagen de fondo con overlay claro ── */}
      <section className="relative py-28 overflow-hidden bg-slate-900"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-navy/88" />
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <span className="text-[10px] font-black font-mono text-brand-blue uppercase tracking-[0.2em]">Diferencial Financiero</span>
              <h2 className="font-display text-4xl lg:text-6xl font-black text-white italic uppercase tracking-tighter leading-tight">
                Un puesto 24×7<br />no son 3 vigiladores.<br />
                <span className="text-brand-blue">Son 4.2.</span>
              </h2>
              <p className="text-white/55 text-base leading-relaxed">
                Francos, vacaciones, ausentismo, feriados. CustOS calcula automáticamente la dotación real de cada puesto y la refleja en la cotización. Si cotizás con tres, la diferencia la pagás vos.
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
                <div key={row.label} className={`flex justify-between items-center py-4 border-b border-white/8 ${row.highlight ? 'border-brand-blue/30' : ''}`}>
                  <span className={`text-sm ${row.highlight ? 'font-black text-white' : 'text-white/50'}`}>{row.label}</span>
                  <span className={`font-black font-mono text-sm ${row.highlight ? 'text-brand-blue text-lg' : 'text-white'}`}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CÓMO FUNCIONA — fondo blanco, limpio ── */}
      <section id="como-funciona" className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <span className="text-[10px] font-black font-mono text-brand-blue uppercase tracking-[0.2em]">Onboarding</span>
            <h2 className="font-display text-4xl lg:text-5xl font-black text-navy italic uppercase tracking-tighter">
              Tres pasos para<br />tener todo bajo control.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-14 left-[calc(33%-40px)] right-[calc(33%-40px)] h-0.5 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
            {[
              { step: '01', icon: Globe, title: 'Creá tu cuenta', desc: 'Registrá tu empresa en minutos. Se genera una instancia aislada con tus datos, tu logo y tu equipo. Sin compartir nada con nadie.' },
              { step: '02', icon: Users, title: 'Cargá tu operación', desc: 'Importá vigiladores en masa con Excel, cargá clientes y objetivos, definí los puestos de seguridad y comenzá con los cuadrantes.' },
              { step: '03', icon: CheckCircle2, title: 'Operá en tiempo real', desc: 'Tus vigiladores trabajan desde la app, el COC ve las alarmas en vivo, y vos ves el margen real de cada contrato — todo en un panel.' },
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

      {/* ── IMAGEN FULL-WIDTH: patrulla de seguridad ── */}
      <section
        className="relative py-32 overflow-hidden bg-slate-900"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/80 to-navy/60" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-8">
          <span className="text-[10px] font-black font-mono text-brand-blue uppercase tracking-[0.3em]">Seguridad que no se improvisa</span>
          <h2 className="font-display text-4xl lg:text-6xl font-black text-white italic uppercase tracking-tighter leading-tight">
            Cada guardia en su puesto.<br /><span className="text-brand-blue">Cada turno, cubierto.</span>
          </h2>
          <p className="text-white/55 text-lg max-w-2xl mx-auto leading-relaxed">
            Tu empresa cuida el patrimonio de sus clientes. CustOS cuida tu operación. Nada queda librado al azar: turnos, cobertura, credenciales y comunicación — todo trazado y auditado.
          </p>
          <button
            onClick={openDemo}
            className="bg-brand-blue text-white px-10 py-4 rounded-2xl font-black text-sm hover:bg-brand-deep transition-all shadow-2xl shadow-brand-blue/30 inline-flex items-center gap-2 group active:scale-95"
          >
            Empezá hoy gratis <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* ── SEGURIDAD Y COMPLIANCE — fondo claro ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <span className="text-[10px] font-black font-mono text-brand-blue uppercase tracking-[0.2em]">Seguridad de datos</span>
              <h2 className="font-display text-3xl lg:text-5xl font-black text-navy italic uppercase tracking-tighter leading-tight">
                Tus datos son<br /><span className="text-brand-blue">solo tuyos.</span>
              </h2>
              <p className="text-slate-500 text-base leading-relaxed">
                Cada empresa opera en una instancia lógicamente aislada mediante PostgreSQL Row Level Security. Ningún cliente puede acceder a los datos de otro — ni por error, ni por diseño.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Lock, label: 'PostgreSQL RLS', desc: 'Aislamiento de datos por tenant', bg: 'bg-brand-blue/5 border-brand-blue/10', iconColor: 'text-brand-blue' },
                { icon: ShieldCheck, label: 'JWT firmado', desc: 'Tokens con validación de tenant', bg: 'bg-emerald/5 border-emerald/10', iconColor: 'text-emerald' },
                { icon: Star, label: 'Convenio 507', desc: 'Cumplimiento normativo argentino', bg: 'bg-amber/5 border-amber/10', iconColor: 'text-amber' },
                { icon: Globe, label: 'HTTPS full', desc: 'Cifrado en tránsito y en reposo', bg: 'bg-purple-50 border-purple-100', iconColor: 'text-purple-500' },
              ].map(f => (
                <div key={f.label} className={`border rounded-2xl p-5 space-y-2 ${f.bg}`}>
                  <f.icon size={20} className={f.iconColor} />
                  <p className="text-navy font-bold text-sm">{f.label}</p>
                  <p className="text-slate-400 text-xs">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PLANES ── */}
      <section id="planes" className="py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <span className="text-[10px] font-black font-mono text-brand-blue uppercase tracking-[0.2em]">Planes</span>
            <h2 className="font-display text-4xl lg:text-6xl font-black text-navy italic uppercase tracking-tighter">
              Escalá a tu ritmo.
            </h2>
            <p className="text-slate-500 text-base max-w-xl mx-auto">Todos los planes incluyen 30 días de prueba gratuita. Sin tarjeta de crédito.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-start">
            {[
              {
                name: 'Core', badge: null, featured: false,
                subtitle: 'Para empresas que arrancan a ordenar la operación.',
                price: 'Consultar', priceNote: 'por vigilador activo / mes',
                features: ['Gestión de personal completa', 'Cuadrante inteligente', 'Clientes y objetivos', 'Cotizador con cálculo de dotación', 'Contratos en PDF', 'App Vigilancia Móvil', 'Rondas con QR', 'Novedades digitales'],
              },
              {
                name: 'Pro', badge: 'Más elegido', featured: true,
                subtitle: 'Control total del margen y la operación.',
                price: 'Consultar', priceNote: 'por vigilador activo / mes',
                features: ['Todo en Core', 'Centro de Operaciones (SIA)', 'Monitoreo en tiempo real', 'Gestión de flota y vehículos', 'Herramientas y equipos', 'Módulo de compras', 'Facturación por contrato', 'Análisis de rentabilidad'],
              },
              {
                name: 'Command', badge: null, featured: false,
                subtitle: 'Para grupos con múltiples empresas o regiones.',
                price: 'Custom', priceNote: 'según volumen de operación',
                features: ['Todo en Pro', 'Multi-empresa en un panel', 'API e integraciones', 'VPC dedicado', 'SLA garantizado', 'Soporte prioritario', 'Capacitación y onboarding', 'Configuración a medida'],
              },
            ].map(plan => (
              <div key={plan.name} className={`rounded-3xl border p-8 flex flex-col transition-all ${
                plan.featured
                  ? 'bg-navy text-white border-brand-blue/30 shadow-2xl shadow-navy/20 scale-105'
                  : 'bg-white text-navy border-slate-100 hover:shadow-xl hover:border-slate-200'
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
                    plan.featured
                      ? 'bg-brand-blue text-white hover:bg-brand-deep shadow-xl shadow-brand-blue/30'
                      : 'bg-slate-50 border border-slate-200 text-navy hover:bg-brand-blue hover:text-white hover:border-brand-blue'
                  }`}
                >
                  Probá gratis 30 días
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL — imagen imponente de seguridad ── */}
      <section
        className="relative py-36 overflow-hidden bg-slate-900"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/98 via-slate-900/85 to-slate-900/60" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-8">
          <h2 className="font-display text-4xl lg:text-6xl font-black text-white italic uppercase tracking-tighter leading-tight">
            Empezá hoy.<br />Sin excusas.
          </h2>
          <p className="text-white/55 text-lg max-w-2xl mx-auto leading-relaxed">
            30 días gratis, instancia propia, sin tarjeta de crédito. En menos de 5 minutos tenés CustOS configurado con los datos de tu empresa.
          </p>
          <button
            onClick={openDemo}
            className="bg-white text-navy px-12 py-5 rounded-2xl font-black text-base shadow-2xl shadow-black/30 hover:bg-slate-50 transition-all inline-flex items-center gap-3 group active:scale-95"
          >
            Crear mi cuenta de prueba
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform text-brand-blue" />
          </button>
          <p className="text-white/25 text-xs font-mono">Sin tarjeta · Sin compromiso · Cancelás cuando querés</p>
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
                <span className="font-display text-xl font-black italic uppercase">CustOS</span>
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
