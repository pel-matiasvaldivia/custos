import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Clock,
  BarChart3,
  Zap,
  ChevronRight,
  X,
  Building2,
  CheckCircle,
  Users,
  Eye,
  EyeOff,
  FileText,
} from 'lucide-react';

/* ─── Unsplash security imagery ─── */
const IMGS = {
  hero: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1600&q=80', // control room
  guard: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=900&q=80', // security guard
  patrol: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=900&q=80', // patrol / surveillance
};

/* ─── Condition IVA options (Argentina) ─── */
const IVA_OPTIONS = ['Responsable Inscripto', 'Monotributista', 'Exento', 'Consumidor Final'];

/* ─── Onboarding Modal ─── */
function OnboardingModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nombre: '',
    razon_social: '',
    cuit: '',
    condicion_iva: 'Responsable Inscripto',
    direccion: '',
    email_contacto: '',
    telefono_contacto: '',
    // Admin user
    email_admin: '',
    password: '',
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleCreate = async () => {
    setLoading(true);
    try {
      // Create tenant
      const res = await fetch('/api/v1/system/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre,
          razon_social: form.razon_social,
          cuit: form.cuit,
          condicion_iva: form.condicion_iva,
          direccion: form.direccion,
          email_contacto: form.email_contacto,
          telefono_contacto: form.telefono_contacto,
        }),
      });
      if (!res.ok) throw new Error('No se pudo crear la empresa');
      navigate('/dashboard');
    } catch {
      alert('Hubo un error al crear la empresa. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
          >
            <X size={22} />
          </button>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
              <Building2 size={22} className="text-white" />
            </div>
            <span className="text-white/60 text-sm font-medium uppercase tracking-widest">Alta de empresa</span>
          </div>
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">
            Registrá tu empresa
          </h2>
          <p className="text-indigo-200/70 mt-2 text-sm">
            Completá los datos para comenzar a operar en CustOS.
          </p>

          {/* Step indicator */}
          <div className="flex gap-2 mt-6">
            {[1, 2].map(s => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-all ${step >= s ? 'bg-indigo-400' : 'bg-white/10'}`}
              />
            ))}
          </div>
          <p className="text-white/30 text-xs mt-2">Paso {step} de 2</p>
        </div>

        {/* Body */}
        <div className="p-8 space-y-5">
          {step === 1 && (
            <>
              <h3 className="text-slate-900 font-bold text-lg mb-4">Datos de la empresa</h3>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Nombre comercial *" value={form.nombre} onChange={set('nombre')} placeholder="Ej: Seguridad Austral" />
                <Field label="Razón social *" value={form.razon_social} onChange={set('razon_social')} placeholder="Ej: Austral S.A." />
                <Field label="CUIT *" value={form.cuit} onChange={set('cuit')} placeholder="20-12345678-9" />
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Condición ante el IVA *</label>
                  <select
                    value={form.condicion_iva}
                    onChange={set('condicion_iva')}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-100"
                  >
                    {IVA_OPTIONS.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              </div>
              <Field label="Dirección" value={form.direccion} onChange={set('direccion')} placeholder="Av. Corrientes 1234, CABA" full />
              <div className="grid grid-cols-2 gap-4">
                <Field label="Email de contacto *" value={form.email_contacto} onChange={set('email_contacto')} placeholder="admin@empresa.com" type="email" />
                <Field label="Teléfono" value={form.telefono_contacto} onChange={set('telefono_contacto')} placeholder="011 15-1234-5678" />
              </div>
              <div className="flex justify-end pt-2">
                <button
                  className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-all active:scale-95 flex items-center gap-2"
                  onClick={() => setStep(2)}
                  disabled={!form.nombre || !form.razon_social || !form.cuit || !form.email_contacto}
                >
                  Siguiente <ChevronRight size={18} />
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h3 className="text-slate-900 font-bold text-lg mb-4">Cuenta de administrador</h3>
              <Field label="Email del administrador *" value={form.email_admin} onChange={set('email_admin')} placeholder="vos@empresa.com" type="email" full />
              <div className="relative">
                <Field label="Contraseña *" value={form.password} onChange={set('password')} placeholder="Mínimo 8 caracteres" type={showPassword ? 'text' : 'password'} full />
                <button
                  type="button"
                  className="absolute right-3 top-8 text-slate-400 hover:text-slate-700"
                  onClick={() => setShowPassword(s => !s)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Summary */}
              <div className="bg-slate-50 rounded-2xl p-5 space-y-2 mt-2 text-sm">
                <p className="font-bold text-slate-700 mb-3 flex items-center gap-2"><FileText size={16} /> Resumen</p>
                <Row label="Empresa" value={form.nombre} />
                <Row label="CUIT" value={form.cuit} />
                <Row label="IVA" value={form.condicion_iva} />
                <Row label="Email" value={form.email_contacto} />
              </div>

              <div className="flex gap-3 justify-between pt-2">
                <button
                  className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all"
                  onClick={() => setStep(1)}
                >
                  ← Volver
                </button>
                <button
                  className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50"
                  onClick={handleCreate}
                  disabled={loading || !form.email_admin || !form.password}
                >
                  {loading ? 'Creando...' : (
                    <><CheckCircle size={18} /> Crear empresa y acceder</>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label, value, onChange, placeholder, type = 'text', full = false,
}: {
  label: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string; type?: string; full?: boolean;
}) {
  return (
    <div className={full ? 'col-span-2' : ''}>
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
      />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-slate-500">
      <span className="font-medium">{label}</span>
      <span className="text-slate-900 font-bold">{value || '—'}</span>
    </div>
  );
}

/* ─── Main Landing Page ─── */
export default function LandingPage() {
  const [showModal, setShowModal] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">
      {showModal && <OnboardingModal onClose={() => setShowModal(false)} />}

      {/* ─── NAV ─── */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-slate-100' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <ShieldCheck size={20} className="text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase italic text-slate-900">
              Cust<span className="text-indigo-600">OS</span>
            </span>
          </div>

          <div className="hidden md:flex gap-8 text-[13px] font-semibold uppercase tracking-widest text-slate-500">
            <a href="#caracteristicas" className="hover:text-indigo-600 transition-colors">Características</a>
            <a href="#modulos" className="hover:text-indigo-600 transition-colors">Módulos</a>
            <a href="#seguridad" className="hover:text-indigo-600 transition-colors">Seguridad</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-5 py-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95"
            >
              Registrá tu empresa
            </button>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* background image */}
        <div className="absolute inset-0">
          <img
            src={IMGS.hero}
            alt="Centro de control"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/70 to-slate-900/30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-20 w-full">
          <div className="max-w-3xl space-y-8">
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 backdrop-blur-sm px-4 py-1.5 rounded-full text-indigo-300 text-[11px] font-black uppercase tracking-widest">
              <Zap size={13} /> El ERP que entiende la seguridad privada argentina
            </div>

            <h1 className="text-6xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter italic uppercase">
              Operaciones <br />
              <span className="text-indigo-400">sin fricción.</span><br />
              <span className="text-white/50 text-4xl lg:text-5xl not-italic normal-case tracking-normal font-bold">Control total.</span>
            </h1>

            <p className="text-xl text-white/70 max-w-xl font-medium leading-relaxed">
              Del cuadrante a la rentabilidad, en tiempo real. Gestioná tu empresa de vigilancia sin hojas de cálculo, sin errores, sin excusas.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => setShowModal(true)}
                className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-lg shadow-2xl shadow-indigo-900/40 hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                Empezar ahora — es gratis <ChevronRight size={22} />
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-white/10 border border-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all active:scale-95"
              >
                Ver el panel
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-12 pt-8 border-t border-white/10">
              {[
                { n: '99.8%', label: 'Efectividad operativa' },
                { n: '< 5s', label: 'Tiempo de asignación' },
                { n: '100%', label: 'Cumplimiento legal' },
              ].map(s => (
                <div key={s.n}>
                  <p className="text-3xl font-black text-indigo-400">{s.n}</p>
                  <p className="text-white/50 text-xs font-medium uppercase tracking-wider mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="caracteristicas" className="py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <p className="text-indigo-600 text-xs font-black uppercase tracking-widest mb-4">¿Por qué CustOS?</p>
            <h2 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">
              Diseñado para los<br />
              <span className="text-indigo-600">rumbos más exigentes.</span>
            </h2>
            <p className="text-slate-500 font-medium text-lg mt-6">
              Dejá de pelear con planillas. CustOS automatiza la complejidad para que vos te enfoqués en el cliente.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Clock,
                title: 'Cuadrante inteligente',
                desc: 'Algoritmos que calculan dotaciones 24/7 sin errores de sub-dotación ni superposición de turnos. Nunca más un puesto descubierto.',
                color: 'bg-blue-50 text-blue-600 border-blue-100',
              },
              {
                icon: ShieldCheck,
                title: 'Credenciales bajo control',
                desc: 'Bloqueo automático de asignaciones si la habilitación policial o el psicofísico están vencidos. Cumplimiento legal en cada turno.',
                color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
              },
              {
                icon: BarChart3,
                title: 'Rentabilidad por objetivo',
                desc: 'Análisis preciso de costos vs. facturación. Sabés cuánto ganás en cada puesto antes de cerrar cualquier contrato.',
                color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
              },
            ].map((f, i) => (
              <div
                key={i}
                className="bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all border border-slate-100 group"
              >
                <div className={`${f.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-8 border group-hover:scale-110 transition-transform`}>
                  <f.icon size={30} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{f.title}</h3>
                <p className="text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── GUARD IMAGE SPLIT ─── */}
      <section className="py-28 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
        <div>
          <div className="rounded-[3rem] overflow-hidden shadow-2xl relative">
            <img src={IMGS.guard} alt="Vigilador en servicio" className="w-full h-[520px] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20">
              <p className="text-white font-black text-lg">García, Juan M.</p>
              <p className="text-white/60 text-sm">Habilitación ✓ · Psicofísico ✓ · Matrícula ✓</p>
              <div className="mt-3 flex gap-2">
                <span className="bg-emerald-500 text-white text-xs font-black px-3 py-1 rounded-full">ACTIVO</span>
                <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">Turno Noche · 20:00–06:00</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8" id="modulos">
          <p className="text-indigo-600 text-xs font-black uppercase tracking-widest">Personal y credenciales</p>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter italic uppercase leading-[0.95]">
            Tu gente, <br />
            <span className="text-indigo-600">siempre habilitada.</span>
          </h2>
          <p className="text-slate-500 text-lg leading-relaxed">
            CustOS valida en tiempo real las credenciales de cada vigilador. Si la habilitación venció o el psicofísico está próximo a expirar, el sistema lo bloquea antes de que vos te enterés del problema.
          </p>
          <div className="space-y-4">
            {[
              'Alerta preventiva 30 días antes del vencimiento',
              'Bloqueo duro de asignaciones por credenciales vencidas',
              'Historial completo de documentación digitalizada',
              'Gestión de roles y permisos por área',
            ].map((item, i) => (
              <div key={i} className="flex gap-3 items-start">
                <CheckCircle size={18} className="text-indigo-600 mt-0.5 shrink-0" />
                <p className="text-slate-600 font-medium">{item}</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-black transition-all active:scale-95 flex items-center gap-2"
          >
            Registrá tu empresa <ChevronRight size={18} />
          </button>
        </div>
      </section>

      {/* ─── PATROL / MONITORING SPLIT ─── */}
      <section className="py-10 pb-28 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-8">
          <p className="text-indigo-600 text-xs font-black uppercase tracking-widest">Rondas y monitoreo</p>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter italic uppercase leading-[0.95]">
            Cada ronda,<br />
            <span className="text-indigo-600">bajo control.</span>
          </h2>
          <p className="text-slate-500 text-lg leading-relaxed">
            Seguí las rondas de tus vigiladores en tiempo real. Puntos de control QR/NFC, alertas de incumplimiento y reporting automático para cada cliente.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Users, title: '24 vigiladores', sub: 'en turno activo ahora' },
              { icon: ShieldCheck, title: '4 rondas', sub: 'en ejecución' },
              { icon: Zap, title: '0 alertas', sub: 'sin resolver hoy' },
              { icon: BarChart3, title: '98%', sub: 'cobertura de objetivos' },
            ].map((s, i) => (
              <div key={i} className="bg-slate-50 border border-slate-100 rounded-2xl p-5 hover:border-indigo-200 transition-colors">
                <s.icon size={20} className="text-indigo-600 mb-2" />
                <p className="text-2xl font-black text-slate-900">{s.title}</p>
                <p className="text-slate-500 text-xs font-medium">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[3rem] overflow-hidden shadow-2xl">
          <img src={IMGS.patrol} alt="Ronda de vigilancia" className="w-full h-[520px] object-cover" />
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section id="seguridad" className="py-10 pb-28 px-6">
        <div className="max-w-7xl mx-auto bg-slate-950 rounded-[3rem] p-12 lg:p-20 text-center relative overflow-hidden">
          {/* Subtle grid bg */}
          <div
            className="absolute inset-0 opacity-5"
            style={{ backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}
          />
          <ShieldCheck size={52} className="mx-auto text-indigo-400 mb-6 animate-pulse" />
          <h2 className="text-5xl lg:text-7xl font-black text-white italic uppercase tracking-tighter leading-none max-w-4xl mx-auto">
            ¿Listo para operar como los grandes?
          </h2>
          <p className="text-indigo-200/60 text-xl font-medium max-w-2xl mx-auto mt-6">
            Aislamiento total de datos entre empresas. Seguridad multinivel. Soporte dedicado.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <button
              onClick={() => setShowModal(true)}
              className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black text-xl shadow-2xl shadow-indigo-900/50 hover:bg-indigo-500 transition-all active:scale-95"
            >
              Registrá tu empresa ahora
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-transparent border-2 border-white/20 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-white/10 transition-all active:scale-95"
            >
              Entrar al panel de demo
            </button>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-slate-100 py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <ShieldCheck size={17} className="text-white" />
              </div>
              <span className="text-xl font-black tracking-tighter italic uppercase">CustOS</span>
            </div>
            <p className="text-slate-400 text-sm max-w-xs">ERP para empresas de seguridad privada en Argentina. Hecho en Buenos Aires.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-10 text-sm">
            {[
              {
                title: 'Módulos', links: ['Personal y RRHH', 'Cuadrante', 'Rondas', 'Compras (M5)', 'Cotizador']
              },
              {
                title: 'Plataforma', links: ['Multi-tenancy', 'Seguridad RLS', 'Auditoría', 'API REST']
              },
              {
                title: 'Empresa', links: ['Nosotros', 'Privacidad', 'Términos', 'Contacto']
              },
            ].map(col => (
              <div key={col.title}>
                <p className="font-black uppercase tracking-widest text-xs text-slate-900 mb-5">{col.title}</p>
                <ul className="space-y-2.5">
                  {col.links.map(l => (
                    <li key={l}><a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-50 text-center text-slate-300 text-xs">
          © 2026 CustOS ERP · Todos los derechos reservados · Buenos Aires, Argentina
        </div>
      </footer>
    </div>
  );
}
