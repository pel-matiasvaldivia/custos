import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import {
  Shield, ShieldCheck, Users, FileText, BarChart3, Smartphone,
  MapPin, AlertTriangle, CheckCircle, CheckCircle2, ChevronRight,
  ArrowRight, X, Eye, EyeOff, Activity, Zap,
  ClipboardList, Truck, Wrench, Bell, Lock, Globe, Star,
  Calendar, CreditCard, UploadCloud, Menu,
} from 'lucide-react';

/* ─── IVA OPTIONS ─── */
const IVA_OPTIONS = ['Responsable Inscripto', 'Monotributista', 'Exento', 'Consumidor Final'];

/* ─── FIELD HELPER ─── */
function Field({ label, value, onChange, placeholder, type = 'text', full = false }: {
  label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string; type?: string; full?: boolean;
}) {
  return (
    <div className={full ? 'col-span-2' : ''}>
      <label className="block text-[10px] font-black text-muted uppercase tracking-widest mb-2 font-mono">{label}</label>
      <input
        type={type} value={value} onChange={onChange} placeholder={placeholder}
        className="w-full bg-white border border-line rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-medium"
      />
    </div>
  );
}

/* ─── ONBOARDING MODAL ─── */
function DemoModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    nombre: '', razon_social: '', cuit: '', condicion_iva: 'Responsable Inscripto',
    direccion: '', email_contacto: '', telefono_contacto: '', email_admin: '', password: '',
  });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const validStep1 = form.nombre && form.razon_social && form.cuit && form.email_contacto;
  const validStep2 = form.email_admin && form.password.length >= 8;

  const handleCreate = async () => {
    setLoading(true); setError('');
    try {
      await api.post('/system/tenants', form);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Error al crear la empresa. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/70 backdrop-blur-md p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-canvas rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-line">
        {/* Modal header */}
        <div className="bg-navy px-10 py-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/20 to-transparent" />
          <button onClick={onClose} className="absolute top-5 right-5 text-white/40 hover:text-white transition-colors z-10"><X size={20} /></button>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              {[1, 2].map(n => (
                <div key={n} className={`h-1 rounded-full transition-all ${n <= step ? 'bg-brand-blue w-12' : 'bg-white/10 w-6'}`} />
              ))}
              <span className="text-white/30 text-[10px] font-black font-mono uppercase tracking-widest ml-2">Paso {step} de 2</span>
            </div>
            <h2 className="font-display text-2xl font-black text-white uppercase italic tracking-tighter">
              {step === 1 ? 'Datos de la empresa' : 'Tu cuenta de acceso'}
            </h2>
            <p className="text-white/50 text-sm mt-1">
              {step === 1 ? 'Completá los datos de tu empresa de seguridad.' : 'Con esto ingresás como administrador.'}
            </p>
          </div>
        </div>

        {/* Modal body */}
        <div className="p-10 space-y-5">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              <AlertTriangle size={15} className="shrink-0" /> {error}
            </div>
          )}

          {step === 1 ? (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <Field label="Nombre comercial *" value={form.nombre} onChange={set('nombre')} placeholder="Seguridad Austral" />
                <Field label="Razón social *" value={form.razon_social} onChange={set('razon_social')} placeholder="Austral S.A." />
                <Field label="CUIT *" value={form.cuit} onChange={set('cuit')} placeholder="20-12345678-9" />
                <div>
                  <label className="block text-[10px] font-black text-muted uppercase tracking-widest mb-2 font-mono">Condición IVA</label>
                  <select value={form.condicion_iva} onChange={set('condicion_iva')} className="w-full bg-white border border-line rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-blue/20">
                    {IVA_OPTIONS.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <Field label="Email de contacto *" value={form.email_contacto} onChange={set('email_contacto')} placeholder="admin@empresa.com" type="email" />
                <Field label="Teléfono" value={form.telefono_contacto} onChange={set('telefono_contacto')} placeholder="011 4xxx-xxxx" />
              </div>
              <Field label="Dirección legal" value={form.direccion} onChange={set('direccion')} placeholder="Av. Corrientes 1234, CABA" full />
              <div className="flex justify-end pt-2">
                <button
                  disabled={!validStep1}
                  onClick={() => setStep(2)}
                  className="bg-brand-blue text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-brand-deep transition-all disabled:opacity-40 flex items-center gap-2"
                >
                  Siguiente <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <Field label="Email del administrador *" value={form.email_admin} onChange={set('email_admin')} placeholder="tumail@empresa.com" type="email" full />
              <div className="relative">
                <Field label="Contraseña *" value={form.password} onChange={set('password')} placeholder="Mínimo 8 caracteres" type={showPwd ? 'text' : 'password'} full />
                <button type="button" className="absolute right-3 top-10 text-muted" onClick={() => setShowPwd(s => !s)}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <div className="bg-navy/5 rounded-2xl p-5 border border-line text-sm space-y-2">
                <p className="text-[10px] font-black text-muted uppercase tracking-widest font-mono flex items-center gap-2"><FileText size={12} /> Resumen</p>
                <div className="grid grid-cols-2 gap-y-2 mt-3 text-xs">
                  <span className="text-muted">Empresa</span><span className="font-bold text-navy text-right">{form.nombre}</span>
                  <span className="text-muted">Aislamiento</span><span className="font-bold text-emerald text-right">PostgreSQL RLS ✓</span>
                  <span className="text-muted">Período de prueba</span><span className="font-bold text-brand-blue text-right">30 días gratis</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted">
                <Lock size={12} className="text-emerald" />
                Tus datos nunca se comparten. Instancia aislada garantizada.
              </div>

              <div className="flex justify-between pt-2">
                <button onClick={() => setStep(1)} className="text-muted font-black text-xs uppercase tracking-widest hover:text-navy transition-colors">
                  ← Volver
                </button>
                <button
                  disabled={!validStep2 || loading}
                  onClick={handleCreate}
                  className="bg-brand-blue text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-brand-deep transition-all disabled:opacity-40 shadow-xl shadow-brand-blue/20 flex items-center gap-2"
                >
                  {loading ? 'Creando cuenta…' : <><Zap size={14} /> Activar mi cuenta</>}
                </button>
              </div>
            </div>
          )}
        </div>
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
    <div className="min-h-screen bg-canvas font-sans overflow-x-hidden">
      {showModal && <DemoModal onClose={() => setShowModal(false)} />}

      {/* ── NAV ── */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-navy/5 border-b border-line' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center shadow-lg shadow-brand-blue/30">
              <Shield size={17} className="text-white" />
            </div>
            <span className={`font-display text-xl font-black tracking-tighter uppercase italic ${scrolled ? 'text-navy' : 'text-white'}`}>
              Cust<span className="text-brand-blue">OS</span>
            </span>
          </div>

          <div className={`hidden md:flex gap-8 text-[10px] font-black font-mono uppercase tracking-[0.2em] ${scrolled ? 'text-muted' : 'text-white/60'}`}>
            {[['#problema', 'El Problema'], ['#modulos', 'Módulos'], ['#como-funciona', 'Cómo funciona'], ['#planes', 'Planes']].map(([href, label]) => (
              <a key={href} href={href} className="hover:text-brand-blue transition-colors">{label}</a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className={`hidden md:block text-[10px] font-black font-mono uppercase tracking-widest transition-colors ${scrolled ? 'text-muted hover:text-navy' : 'text-white/60 hover:text-white'}`}>
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
          <div className="md:hidden bg-white border-t border-line px-6 py-4 space-y-3">
            {[['#problema', 'El Problema'], ['#modulos', 'Módulos'], ['#como-funciona', 'Cómo funciona'], ['#planes', 'Planes']].map(([href, label]) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)} className="block text-sm font-bold text-navy py-2">{label}</a>
            ))}
            <Link to="/login" className="block text-sm font-bold text-muted py-2">Ingresar</Link>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-navy">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-brand-blue/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-brand-blue/5 rounded-full blur-[80px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-brand-blue/20 border border-brand-blue/30 px-4 py-2 rounded-full">
                <div className="w-1.5 h-1.5 bg-emerald rounded-full animate-pulse" />
                <span className="text-[10px] font-black font-mono text-brand-blue uppercase tracking-[0.2em]">ERP para seguridad privada · Argentina</span>
              </div>

              <h1 className="font-display text-5xl lg:text-7xl font-black text-white leading-[0.9] tracking-tighter uppercase italic">
                Tu empresa de<br />
                seguridad,<br />
                <span className="text-brand-blue">bajo control.</span>
              </h1>

              <p className="text-white/50 text-lg leading-relaxed max-w-lg">
                CustOS integra la gestión de personal, cuadrantes, contratos, monitoreo electrónico y facturación en una sola plataforma — pensada para el Convenio 507 y la operación real de Argentina.
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
                  className="border border-white/20 text-white/70 hover:text-white hover:border-white/40 px-8 py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2"
                >
                  Ya tengo cuenta
                </Link>
              </div>

              <p className="text-white/30 text-xs font-mono">Sin tarjeta de crédito · 30 días gratis · Instancia propia</p>
            </div>

            {/* Hero visual: dashboard preview */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
                      <span className="text-white/40 text-xs font-mono">Centro de Operaciones · En vivo</span>
                    </div>
                    <span className="text-white/20 text-xs font-mono">03:17 AM</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Vigiladores activos', value: '24', color: 'text-emerald' },
                      { label: 'Cobertura actual', value: '100%', color: 'text-emerald' },
                      { label: 'Alertas abiertas', value: '0', color: 'text-white' },
                    ].map(m => (
                      <div key={m.label} className="bg-white/5 rounded-2xl p-4 border border-white/5">
                        <p className={`text-2xl font-black italic ${m.color}`}>{m.value}</p>
                        <p className="text-white/30 text-[10px] font-mono uppercase tracking-wider mt-1">{m.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5 space-y-3">
                    <p className="text-white/30 text-[10px] font-mono uppercase tracking-wider">Puestos activos</p>
                    {[
                      { name: 'Banco Austral – Acceso principal', status: 'OK', guards: 2 },
                      { name: 'Planta Norte – Perímetro', status: 'OK', guards: 1 },
                      { name: 'Edificio Mitre – Lobby', status: 'OK', guards: 1 },
                    ].map(p => (
                      <div key={p.name} className="flex items-center justify-between">
                        <span className="text-white/60 text-xs">{p.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-white/30 text-xs">{p.guards} v</span>
                          <span className="w-2 h-2 rounded-full bg-emerald" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                      <p className="text-white/30 text-[10px] font-mono">Credenciales ×vencer</p>
                      <p className="text-amber text-xl font-black italic mt-1">3</p>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                      <p className="text-white/30 text-[10px] font-mono">Contratos activos</p>
                      <p className="text-white text-xl font-black italic mt-1">12</p>
                    </div>
                  </div>
                </div>
                {/* floating tag */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-2xl border border-line flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald/10 rounded-xl flex items-center justify-center">
                    <CheckCircle2 size={16} className="text-emerald" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black font-mono text-muted uppercase tracking-widest">Dotación calculada</p>
                    <p className="text-sm font-black text-navy">4.2 vigs / puesto 24×7</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div className="bg-brand-blue text-white py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: '100%', label: 'Multi-tenant aislado' },
              { num: 'Convenio 507', label: 'Cumplimiento argentino' },
              { num: '10+ módulos', label: 'Operación integrada' },
              { num: '30 días', label: 'Prueba sin costo' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-2xl font-black italic font-display">{s.num}</p>
                <p className="text-white/60 text-[10px] font-mono uppercase tracking-widest mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── EL PROBLEMA ── */}
      <section id="problema" className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <span className="text-[10px] font-black font-mono text-brand-blue uppercase tracking-[0.2em]">El Problema</span>
            <h2 className="font-display text-4xl lg:text-6xl font-black text-navy italic uppercase tracking-tighter">
              La operación vive<br /><span className="text-brand-blue">en pedazos.</span>
            </h2>
            <p className="text-muted text-lg max-w-2xl mx-auto leading-relaxed">
              Toda empresa de seguridad física empieza igual: un Excel para cuadrantes, WhatsApp para relevos, y una hoja de cálculo para la facturación. Cuando escalan, el caos escala con ellos.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Calendar, title: 'Cuadrantes sin control', desc: 'Un turno en blanco a las 2 AM lo descubre el cliente, no vos. Los cambios de guardia se coordinan por mensaje y no quedan registrados.' },
              { icon: Users, title: 'Habilitaciones vencidas', desc: 'El Carnet de Vigilador, el Psicofísico, los antecedentes — todo vence. Sin seguimiento, exponés a la empresa a multas y a pérdida de licitaciones.' },
              { icon: FileText, title: 'Cotizaciones imprecisas', desc: 'Un puesto 24/7 no lo cubre un vigilador, ni dos, ni tres. Sin calcular el factor de cobertura real (4.2), cada contrato puede ser deficitario.' },
              { icon: BarChart3, title: 'Margen invisible', desc: 'Sabés cuánto cobran pero no cuánto ganás. Los costos de personal, vehículos, herramientas y horas extras diluyen el margen sin que te des cuenta.' },
              { icon: MapPin, title: 'Monitoreo desconectado', desc: 'El software de alarmas no habla con RRHH, las rondas de vigiladores no aparecen en el tablero, y las alertas SIA llegan sin contexto operativo.' },
              { icon: AlertTriangle, title: 'Relevos por WhatsApp', desc: 'Cuando un vigilador falta, el supervisor llama hasta encontrar un reemplazo. Sin sistema, no hay trazabilidad, no hay aprobación formal, no hay registro.' },
            ].map(p => (
              <div key={p.title} className="p-6 border border-line rounded-2xl hover:border-red-200 hover:bg-red-50/30 transition-all group">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-100 transition-colors">
                  <p.icon size={20} className="text-red-400" />
                </div>
                <h3 className="font-bold text-navy mb-2">{p.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LA SOLUCIÓN ── */}
      <section className="py-20 bg-navy text-white">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-8">
          <span className="text-[10px] font-black font-mono text-brand-blue uppercase tracking-[0.2em]">La Solución</span>
          <h2 className="font-display text-4xl lg:text-6xl font-black italic uppercase tracking-tighter leading-tight">
            Un solo sistema.<br /><span className="text-brand-blue">Toda la operación.</span>
          </h2>
          <p className="text-white/50 text-lg max-w-3xl mx-auto leading-relaxed">
            CustOS es un ERP diseñado exclusivamente para empresas de seguridad privada argentina. Desde la cotización hasta el cheque de cada vigilador, pasando por el monitoreo electrónico en tiempo real.
          </p>
          <button onClick={openDemo} className="bg-brand-blue text-white px-10 py-4 rounded-2xl font-black text-sm hover:bg-brand-deep transition-all shadow-2xl shadow-brand-blue/30 inline-flex items-center gap-2 group active:scale-95">
            Ver demostración <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* ── MÓDULOS ── */}
      <section id="modulos" ref={featuresRef} className="py-28 bg-canvas">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <span className="text-[10px] font-black font-mono text-brand-blue uppercase tracking-[0.2em]">Plataforma Completa</span>
            <h2 className="font-display text-4xl lg:text-6xl font-black text-navy italic uppercase tracking-tighter">
              Todo lo que necesitás,<br />en un lugar.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Users, color: 'bg-brand-blue/10 text-brand-blue',
                title: 'Gestión de Personal',
                desc: 'Ficha completa de cada vigilador: legajo, documentación, credenciales, foto y estado. Alertas automáticas de vencimiento para Carnet, Psicofísico y Antecedentes.',
                tags: ['Legajos digitales', 'Credenciales y vencimientos', 'Importación masiva Excel'],
              },
              {
                icon: Calendar, color: 'bg-emerald/10 text-emerald',
                title: 'Cuadrante Inteligente',
                desc: 'Esquemas de turno cíclicos (12x12, 24x24, etc.), afectación automática de vigiladores a puestos y generación de turnos planificados. Detección de huecos de cobertura en tiempo real.',
                tags: ['Turnos automáticos', 'Cobertura por puesto', 'Cambios de turno'],
              },
              {
                icon: FileText, color: 'bg-purple-100 text-purple-600',
                title: 'Cotizaciones y Contratos',
                desc: 'Cotizador con cálculo automático de dotación requerida (factor 4.2), margen y cargas sociales. Generación de contratos en PDF con plantilla editable y logo de la empresa.',
                tags: ['Factor dotación real', 'Contratos en PDF', 'Histórico de versiones'],
              },
              {
                icon: BarChart3, color: 'bg-amber/10 text-amber',
                title: 'Clientes y Objetivos',
                desc: 'Gestión de clientes con ficha completa, objetivos de seguridad asociados, puestos definidos por turno y vinculación directa con contratos y cobertura operativa.',
                tags: ['Multi-objetivo por cliente', 'Puestos por turno', 'Activación controlada'],
              },
              {
                icon: Activity, color: 'bg-red-100 text-red-500',
                title: 'Centro de Operaciones',
                desc: 'Monitoreo en tiempo real con protocolo SIA DC-09. Eventos de alarma recibidos, clasificados y vinculados al objetivo. WebRTC para comunicación directa con vigiladores.',
                tags: ['SIA DC-09', 'Mapa en vivo', 'Alertas de pánico'],
              },
              {
                icon: Smartphone, color: 'bg-brand-blue/10 text-brand-blue',
                title: 'App Vigilancia Móvil',
                desc: 'Los vigiladores se autentican con su legajo y PIN. Ven su turno actual, registran entrada/salida, hacen rondas con QR y solicitan cambios de turno desde el celular.',
                tags: ['Login por legajo+PIN', 'Check-in/checkout', 'Solicitud de relevo'],
              },
              {
                icon: Truck, color: 'bg-emerald/10 text-emerald',
                title: 'Flota y Vehículos',
                desc: 'Registro de vehículos con VTV, seguro y habilitaciones. Asignación a objetivos, control de costo por hora y alertas de documentación vencida.',
                tags: ['VTV y seguro', 'Asignación por objetivo', 'Costo operativo'],
              },
              {
                icon: Wrench, color: 'bg-orange-100 text-orange-500',
                title: 'Herramientas y Equipos',
                desc: 'Inventario de equipos asignados a cada vigilador. Trazabilidad de qué tiene cada uno, cuándo se le entregó y su estado actual.',
                tags: ['Inventario por vigilador', 'Trazabilidad', 'Estado del equipo'],
              },
              {
                icon: ClipboardList, color: 'bg-purple-100 text-purple-600',
                title: 'Novedades y Rondas',
                desc: 'Registro digital de novedades por turno. Rondas verificadas con puntos de control QR. Historial completo por objetivo y vigilador.',
                tags: ['Rondas con QR', 'Novedades digitales', 'Historial de turnos'],
              },
              {
                icon: Bell, color: 'bg-amber/10 text-amber',
                title: 'Notificaciones y Alertas',
                desc: 'Sistema de alertas en tiempo real para credenciales por vencer, personal insuficiente, eventos de alarma y pánico desde el campo.',
                tags: ['Alertas en app', 'Email automático', 'Pánico en campo'],
              },
              {
                icon: CreditCard, color: 'bg-emerald/10 text-emerald',
                title: 'Facturación y Compras',
                desc: 'Configuración de facturación por contrato (abono fijo, por horas planificadas o reales). Módulo de compras para gestionar proveedores y gastos operativos.',
                tags: ['Abono fijo', 'Por horas', 'Gestión de proveedores'],
              },
              {
                icon: UploadCloud, color: 'bg-brand-blue/10 text-brand-blue',
                title: 'Configuración y Branding',
                desc: 'Logo y firma de la empresa en todos los documentos. Plantilla de contratos y cotizaciones personalizable. Multi-usuario con roles y permisos.',
                tags: ['Logo y firma', 'Plantillas editables', 'Roles y permisos'],
              },
            ].map(m => (
              <div key={m.title} className="bg-white p-6 rounded-2xl border border-line hover:shadow-xl hover:-translate-y-1 transition-all group">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${m.color} group-hover:scale-110 transition-transform`}>
                  <m.icon size={22} />
                </div>
                <h3 className="font-bold text-navy text-base mb-2">{m.title}</h3>
                <p className="text-muted text-sm leading-relaxed mb-4">{m.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {m.tags.map(t => (
                    <span key={t} className="bg-canvas border border-line text-muted text-[10px] font-bold px-2 py-1 rounded-full font-mono uppercase tracking-wider">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FACTOR 4.2 ── */}
      <section className="py-24 bg-navy text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <span className="text-[10px] font-black font-mono text-brand-blue uppercase tracking-[0.2em]">Diferencial Financiero</span>
              <h2 className="font-display text-4xl lg:text-6xl font-black italic uppercase tracking-tighter leading-tight">
                Un puesto 24×7<br />no son 3 vigiladores.<br />
                <span className="text-brand-blue">Son 4.2.</span>
              </h2>
              <p className="text-white/50 text-base leading-relaxed">
                Francos, vacaciones, ausentismo, días feriados. CustOS calcula automáticamente la dotación real que necesita cada puesto y lo refleja en la cotización. Si lo cotizás con tres, la diferencia la pagás vos.
              </p>
              <div className="flex items-center gap-4 pt-4">
                <div className="text-center">
                  <p className="font-display text-5xl font-black italic text-brand-blue">4.2</p>
                  <p className="text-white/30 text-[10px] font-mono uppercase tracking-widest mt-1">Cálculo CustOS</p>
                </div>
                <div className="text-white/20 text-3xl font-black">vs</div>
                <div className="text-center">
                  <p className="font-display text-5xl font-black italic text-white/20 line-through">3</p>
                  <p className="text-white/20 text-[10px] font-mono uppercase tracking-widest mt-1">Error común</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Horas anuales por puesto (24x7)', value: '8.760 hs' },
                { label: 'Jornada máxima legal (Conv. 507)', value: '48 hs/sem' },
                { label: 'Vigiladores necesarios por cálculo', value: '3.44 base' },
                { label: 'Factor real (francos + vacaciones)', value: '× 1.22' },
                { label: 'Dotación real requerida', value: '≈ 4.2 vigiladores', highlight: true },
              ].map(row => (
                <div key={row.label} className={`flex justify-between items-center py-3 border-b border-white/5 ${row.highlight ? 'text-brand-blue' : ''}`}>
                  <span className={`text-sm ${row.highlight ? 'font-black' : 'text-white/50'}`}>{row.label}</span>
                  <span className={`font-black font-mono text-sm ${row.highlight ? 'text-brand-blue text-base' : 'text-white'}`}>{row.value}</span>
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
            <h2 className="font-display text-4xl lg:text-5xl font-black text-navy italic uppercase tracking-tighter">
              Tres pasos para<br />tener todo bajo control.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[calc(33%-20px)] right-[calc(33%-20px)] h-0.5 bg-gradient-to-r from-transparent via-brand-blue/30 to-transparent" />
            {[
              {
                step: '01', icon: Globe, title: 'Creá tu cuenta',
                desc: 'Registrá tu empresa en minutos. Se genera una instancia aislada con tus datos, tu logo y tu equipo. Sin compartir nada con nadie.'
              },
              {
                step: '02', icon: Users, title: 'Cargá tu operación',
                desc: 'Importá vigiladores en masa con Excel, cargá clientes y objetivos, definí los puestos de seguridad y comenzá con los cuadrantes.'
              },
              {
                step: '03', icon: CheckCircle2, title: 'Operá en tiempo real',
                desc: 'Tus vigiladores trabajan desde la app, el COC ve las alarmas en vivo, y vos ves el margen real de cada contrato — todo en un panel.'
              },
            ].map(s => (
              <div key={s.step} className="relative text-center p-8 space-y-5">
                <div className="w-12 h-12 bg-brand-blue/10 rounded-2xl flex items-center justify-center mx-auto relative z-10">
                  <s.icon size={22} className="text-brand-blue" />
                </div>
                <div className="absolute -top-2 left-6 text-[80px] font-black text-line leading-none font-display italic select-none">{s.step}</div>
                <h3 className="font-bold text-navy text-lg">{s.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEGURIDAD Y COMPLIANCE ── */}
      <section className="py-20 bg-canvas">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-navy rounded-3xl p-10 md:p-16 grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-[10px] font-black font-mono text-brand-blue uppercase tracking-[0.2em]">Seguridad de datos</span>
              <h2 className="font-display text-3xl lg:text-5xl font-black text-white italic uppercase tracking-tighter leading-tight">
                Tus datos son<br /><span className="text-brand-blue">solo tuyos.</span>
              </h2>
              <p className="text-white/50 text-base leading-relaxed">
                Cada empresa opera en una instancia lógicamente aislada mediante PostgreSQL Row Level Security. Ningún cliente puede acceder a los datos de otro — ni por error, ni por diseño.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Lock, label: 'PostgreSQL RLS', desc: 'Aislamiento de datos por tenant' },
                { icon: ShieldCheck, label: 'JWT firmado', desc: 'Tokens con validación de tenant' },
                { icon: Star, label: 'Convenio 507', desc: 'Cumplimiento normativo argentino' },
                { icon: Globe, label: 'HTTPS full', desc: 'Cifrado en tránsito y en reposo' },
              ].map(f => (
                <div key={f.label} className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-2">
                  <f.icon size={20} className="text-brand-blue" />
                  <p className="text-white font-bold text-sm">{f.label}</p>
                  <p className="text-white/40 text-xs">{f.desc}</p>
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
            <h2 className="font-display text-4xl lg:text-6xl font-black text-navy italic uppercase tracking-tighter">
              Escalá a tu ritmo.
            </h2>
            <p className="text-muted text-base max-w-xl mx-auto">Todos los planes incluyen 30 días de prueba gratuita. Sin tarjeta de crédito.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-start">
            {[
              {
                name: 'Core', badge: null, featured: false,
                subtitle: 'Para empresas que arrancan a ordenar la operación.',
                price: 'Consultar', priceNote: 'por vigilador activo / mes',
                features: [
                  'Gestión de personal completa',
                  'Cuadrante inteligente',
                  'Clientes y objetivos',
                  'Cotizador con cálculo de dotación',
                  'Contratos en PDF',
                  'App Vigilancia Móvil',
                  'Rondas con QR',
                  'Novedades digitales',
                ],
              },
              {
                name: 'Pro', badge: 'Más elegido', featured: true,
                subtitle: 'Control total del margen y la operación.',
                price: 'Consultar', priceNote: 'por vigilador activo / mes',
                features: [
                  'Todo en Core',
                  'Centro de Operaciones (SIA)',
                  'Monitoreo en tiempo real',
                  'Gestión de flota y vehículos',
                  'Herramientas y equipos',
                  'Módulo de compras',
                  'Facturación por contrato',
                  'Análisis de rentabilidad',
                ],
              },
              {
                name: 'Command', badge: null, featured: false,
                subtitle: 'Para grupos con múltiples empresas o regiones.',
                price: 'Custom', priceNote: 'según volumen de operación',
                features: [
                  'Todo en Pro',
                  'Multi-empresa en un panel',
                  'API e integraciones',
                  'VPC dedicado',
                  'SLA garantizado',
                  'Soporte técnico prioritario',
                  'Capacitación y onboarding',
                  'Configuración a medida',
                ],
              },
            ].map(plan => (
              <div key={plan.name} className={`rounded-3xl border p-8 flex flex-col transition-all ${plan.featured ? 'bg-navy text-white border-brand-blue/40 shadow-2xl shadow-navy/20 scale-105' : 'bg-white text-navy border-line hover:shadow-xl'}`}>
                {plan.badge && (
                  <span className="inline-block bg-brand-blue text-white text-[10px] font-black font-mono px-3 py-1 rounded-full uppercase tracking-widest mb-4">{plan.badge}</span>
                )}
                <h3 className={`font-display text-2xl font-black italic uppercase tracking-tighter mb-1`}>CustOS {plan.name}</h3>
                <p className={`text-sm mb-6 ${plan.featured ? 'text-white/50' : 'text-muted'}`}>{plan.subtitle}</p>
                <div className="mb-8">
                  <p className={`font-display text-3xl font-black italic ${plan.featured ? 'text-brand-blue' : 'text-navy'}`}>{plan.price}</p>
                  <p className={`text-[10px] font-mono mt-1 ${plan.featured ? 'text-white/30' : 'text-muted'}`}>{plan.priceNote}</p>
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <CheckCircle size={14} className={`mt-0.5 shrink-0 ${plan.featured ? 'text-brand-blue' : 'text-emerald'}`} />
                      <span className={plan.featured ? 'text-white/70' : 'text-navy/70'}>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={openDemo}
                  className={`w-full py-3 rounded-xl font-black text-xs font-mono uppercase tracking-widest transition-all active:scale-95 ${plan.featured ? 'bg-brand-blue text-white hover:bg-brand-deep shadow-xl shadow-brand-blue/30' : 'bg-canvas border border-line text-navy hover:bg-brand-blue hover:text-white hover:border-brand-blue'}`}
                >
                  Probá gratis 30 días
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-28 bg-brand-blue text-white">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <h2 className="font-display text-4xl lg:text-6xl font-black italic uppercase tracking-tighter leading-tight">
            Empezá hoy.<br />Sin excusas.
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
            30 días gratis, instancia propia, sin tarjeta de crédito. En menos de 5 minutos tenés CustOS configurado con los datos de tu empresa.
          </p>
          <button
            onClick={openDemo}
            className="bg-white text-brand-blue px-12 py-5 rounded-2xl font-black text-base shadow-2xl hover:bg-canvas transition-all inline-flex items-center gap-3 group active:scale-95"
          >
            Crear mi cuenta de prueba
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-white/30 text-xs font-mono">Sin tarjeta · Sin compromiso · Cancelás cuando querés</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-navy text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 pb-12 border-b border-white/5">
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center shadow-lg shadow-brand-blue/20">
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
