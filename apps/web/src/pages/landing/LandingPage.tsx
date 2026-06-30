import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  ShieldCheck,
  Zap,
  ChevronRight,
  X,
  Building2,
  CheckCircle,
  Users,
  Eye,
  EyeOff,
  FileText,
  AlertTriangle,
  LayoutGrid,
  Shield,
  Smartphone,
  Activity
} from 'lucide-react';

/* ─── Unsplash security imagery ─── */
const IMGS = {
  hero: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1600&q=80', // professional security setup
  guard: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=900&q=80', // security guard
  controlRoom: 'https://images.unsplash.com/photo-1541872703-74c5e443d1f9?auto=format&fit=crop&w=1600&q=80',
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
    email_admin: '',
    password: '',
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleCreate = async () => {
    setLoading(true);
    try {
      await api.post('/system/tenants', form);
      navigate('/dashboard');
    } catch {
      alert('Hubo un error al crear la empresa. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/60 backdrop-blur-md p-4">
      <div className="bg-canvas rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in duration-300 border border-line">
        {/* Header */}
        <div className="bg-navy p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/10 rounded-full blur-3xl -mr-32 -mt-32" />
          <button onClick={onClose} className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"><X size={22} /></button>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center shadow-lg shadow-brand-blue/30"><Building2 size={22} className="text-white" /></div>
            <span className="text-mono text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Alta de Operación</span>
          </div>
          <h2 className="text-display text-3xl font-black text-white italic uppercase tracking-tighter">Registrá tu empresa</h2>
          <p className="text-white/60 mt-2 text-sm max-w-sm">Completá los datos para activar tu instancia aislada en la red CustOS.</p>
        </div>

        {/* Body */}
        <div className="p-10 space-y-5">
          {step === 1 ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <Field label="Nombre comercial *" value={form.nombre} onChange={set('nombre')} placeholder="Seguridad Austral" />
                <Field label="Razón social *" value={form.razon_social} onChange={set('razon_social')} placeholder="Austral S.A." />
                <Field label="CUIT *" value={form.cuit} onChange={set('cuit')} placeholder="20-12345678-9" />
                <div>
                  <label className="block text-mono text-[10px] font-black text-muted uppercase tracking-widest mb-2">Condición IVA *</label>
                  <select value={form.condicion_iva} onChange={set('condicion_iva')} className="w-full bg-white border border-line rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-blue/10 transition-all">
                    {IVA_OPTIONS.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              </div>
              <Field label="Dirección Legal" value={form.direccion} onChange={set('direccion')} placeholder="Av. Corrientes 1234, CABA" full />
              <div className="grid grid-cols-2 gap-6">
                <Field label="Email de contacto *" value={form.email_contacto} onChange={set('email_contacto')} placeholder="admin@empresa.com" type="email" />
                <Field label="Teléfono" value={form.telefono_contacto} onChange={set('telefono_contacto')} placeholder="011 ..." />
              </div>
              <div className="flex justify-end pt-4">
                <button className="bg-brand-blue text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-deep transition-all active:scale-95 flex items-center gap-2" onClick={() => setStep(2)}>
                  Siguiente paso <ChevronRight size={18} />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <Field label="Email del administrador *" value={form.email_admin} onChange={set('email_admin')} placeholder="vos@empresa.com" type="email" full />
              <div className="relative">
                <Field label="Contraseña de acceso *" value={form.password} onChange={set('password')} placeholder="Mínimo 8 caracteres" type={showPassword ? 'text' : 'password'} full />
                <button type="button" className="absolute right-3 top-10 text-muted hover:text-navy" onClick={() => setShowPassword(s => !s)}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </div>
              <div className="bg-navy/5 rounded-2xl p-6 border border-navy/5">
                <p className="text-mono text-[10px] font-black text-muted uppercase tracking-widest mb-4 flex items-center gap-2"><FileText size={14} /> Resumen de activación</p>
                <div className="grid grid-cols-2 gap-y-3">
                  <span className="text-xs text-muted">Empresa:</span><span className="text-xs font-bold text-navy text-right">{form.nombre || '—'}</span>
                  <span className="text-xs text-muted">Aislamiento:</span><span className="text-xs font-bold text-emerald text-right uppercase tracking-widest">Postgres RLS ACTIVO</span>
                </div>
              </div>
              <div className="flex gap-4 justify-between pt-4">
                <button className="px-6 py-4 rounded-2xl text-navy font-black text-xs uppercase tracking-widest hover:bg-navy/5 transition-all" onClick={() => setStep(1)}>← Volver</button>
                <button className="bg-brand-blue text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-brand-blue/20 hover:bg-brand-deep transition-all active:scale-95 disabled:opacity-50" onClick={handleCreate} disabled={loading || !form.email_admin || !form.password}>
                  {loading ? 'Activando...' : 'Confirmar e ingresar'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = 'text', full = false }: any) {
  return (
    <div className={full ? 'col-span-2' : ''}>
      <label className="block text-mono text-[10px] font-black text-muted uppercase tracking-widest mb-2">{label}</label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} className="w-full bg-white border border-line rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-blue/10 transition-all font-medium" />
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
    <div className="min-h-screen bg-canvas text-navy font-sans overflow-x-hidden">
      {showModal && <OnboardingModal onClose={() => setShowModal(false)} />}

      {/* ─── NAV ─── */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/95 backdrop-blur-xl shadow-xl shadow-navy/5 border-b border-line' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center shadow-lg shadow-brand-blue/20 rotate-3 group-hover:rotate-0 transition-transform">
              <Shield size={18} className="text-white" />
            </div>
            <span className="text-display text-2xl font-black tracking-tighter uppercase italic text-navy">
              Cust<span className="text-brand-blue">OS</span>
            </span>
          </div>

          <div className="hidden md:flex gap-10 text-mono text-[10px] font-black uppercase tracking-[0.2em] text-muted">
            <a href="#operacion" className="hover:text-brand-blue transition-colors">La Operación</a>
            <a href="#diferenciales" className="hover:text-brand-blue transition-colors">Diferenciales</a>
            <a href="#planes" className="hover:text-brand-blue transition-colors">Planes</a>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/dashboard')} className="text-mono text-[10px] font-black uppercase tracking-widest text-muted hover:text-navy transition-colors">Ingresar</button>
            <button onClick={() => setShowModal(true)} className="bg-navy text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-navy/20 hover:bg-black transition-all active:scale-95">Pedí tu demo</button>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-navy">
          <img src={IMGS.hero} alt="SOC" className="w-full h-full object-cover opacity-30 mix-blend-overlay scale-110 animate-pulse duration-[10s]" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 w-full">
          <div className="max-w-4xl space-y-10">
            <div className="inline-flex items-center gap-3 bg-brand-blue/20 border border-brand-blue/30 backdrop-blur-md px-5 py-2 rounded-full">
              <div className="w-2 h-2 bg-brand-blue rounded-full animate-pulse" />
              <span className="text-mono text-brand-blue text-[10px] font-black uppercase tracking-[0.2em]">Hecho en Argentina · Convenio 507/07</span>
            </div>

            <h1 className="text-display text-7xl lg:text-9xl font-black text-white leading-[0.85] tracking-tighter italic uppercase">
              Son las <span className="text-brand-blue">3 AM.</span><br />
              ¿Sabés quién <br />
              <span className="text-white/40">está de guardia?</span>
            </h1>

            <p className="text-xl text-white/50 max-w-2xl font-medium leading-relaxed border-l-2 border-brand-blue/30 pl-8">
              Tu operación vive en pedazos. El cuadrante en un Excel, los relevos por WhatsApp y la rentabilidad... cuando ya es tarde. CustOS es el sistema operativo que une la seguridad física y la electrónica en un solo lugar.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 pt-6">
              <button onClick={() => setShowModal(true)} className="bg-brand-blue text-white px-12 py-6 rounded-3xl font-black text-xl shadow-2xl shadow-brand-blue/30 hover:bg-brand-deep transition-all flex items-center justify-center gap-3 group active:scale-95">
                Pedí tu demo <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <div className="flex items-center gap-4 px-8 border border-white/10 rounded-3xl backdrop-blur-sm">
                <Activity size={20} className="text-brand-blue" />
                <span className="text-white/60 font-black text-[10px] uppercase tracking-widest leading-none">
                  SIA DC-09 & <br /> WebRTC Integrated
                </span>
              </div>
            </div>
            
            <p className="text-mono text-[9px] font-bold text-white/30 uppercase tracking-[0.3em] italic">CustOS — El sistema operativo de la seguridad privada.</p>
          </div>
        </div>
      </section>

      {/* ─── THE PROBLEM: OPERACION EN PEDAZOS ─── */}
      <section id="operacion" className="py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
              <span className="text-mono text-brand-blue text-[10px] font-black uppercase tracking-[0.2em]">Ayer vs Hoy</span>
              <h2 className="text-display text-5xl lg:text-7xl font-black text-navy leading-none tracking-tighter italic uppercase">
                Tu operación <br /> <span className="text-brand-blue">vive en pedazos.</span>
              </h2>
              <p className="text-muted text-lg leading-relaxed">
                No te falta esfuerzo, te falta un solo lugar. CustOS integra vigiladores, móviles, alarmas y cámaras en una sola plataforma táctica. Dejá de adivinar y empezá a dirigir con números reales.
              </p>
              
              <div className="grid grid-cols-1 gap-6">
                <ProblemItem text="Cuadrantes en planillas que nadie actualiza." />
                <ProblemItem text="Relevos coordinados por grupos de WhatsApp." />
                <ProblemItem text="Habilitaciones vencidas que te enterás de casualidad." />
                <ProblemItem text="Software de monitoreo viejo que no habla con RRHH." />
              </div>
            </div>
            
            <div className="relative">
                <div className="bg-canvas rounded-[3rem] p-10 shadow-2xl border border-line relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-full h-1 bg-brand-blue" />
                    <div className="flex justify-between items-center mb-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-navy rounded-xl flex items-center justify-center text-white"><LayoutGrid size={20}/></div>
                            <span className="font-black text-sm uppercase tracking-tighter italic">Unified SOC Console</span>
                        </div>
                        <div className="px-3 py-1 bg-emerald/10 text-emerald text-[10px] font-black rounded-full uppercase tracking-widest">En Vivo</div>
                    </div>
                    {/* Abstract dashboard visuals */}
                    <div className="space-y-4 opacity-40 group-hover:opacity-100 transition-opacity">
                        <div className="h-32 bg-navy/5 rounded-3xl border border-line flex items-center justify-center italic text-muted text-xs">Visualización de Flota & GPS</div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="h-40 bg-navy/5 rounded-3xl border border-line p-6">
                                <div className="w-8 h-1 bg-brand-blue mb-2" />
                                <div className="text-[10px] font-black text-navy uppercase tracking-widest">Credenciales</div>
                                <div className="mt-4 text-2xl font-black text-emerald italic">100% OK</div>
                            </div>
                            <div className="h-40 bg-navy/10 rounded-3xl border border-brand-blue/20 p-6 shadow-inner">
                                <div className="w-8 h-1 bg-brand-blue mb-2" />
                                <div className="text-[10px] font-black text-navy uppercase tracking-widest">Margen Real</div>
                                <div className="mt-4 text-2xl font-black text-navy italic">+14.2%</div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Float tags */}
                <div className="absolute -top-10 -right-10 bg-white shadow-2xl p-5 rounded-2xl border border-line animate-bounce duration-[3s]">
                    <div className="flex items-center gap-3">
                        <Users className="text-brand-blue" />
                        <div>
                            <p className="text-[10px] font-black uppercase text-muted tracking-widest">Dotación Real</p>
                            <p className="text-lg font-black text-navy italic">4.21 v/h</p>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── THE 4.2 RULE SECTION ─── */}
      <section className="py-32 bg-navy text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto space-y-10">
            <span className="text-mono text-brand-blue text-[10px] font-black uppercase tracking-[0.2em]">Diferencial Financiero</span>
            <h2 className="text-display text-5xl lg:text-8xl font-black italic uppercase leading-none tracking-tighter">
              Un puesto 24/7 <br />
              <span className="text-brand-blue">no son 3 vigiladores.</span>
            </h2>
            <p className="text-white/40 text-2xl font-bold max-w-2xl mx-auto leading-relaxed">
              Factor de cobertura real: con francos, vacaciones y ausentismo, la dotación ronda **4.2 personas**. 
              Si cotizás con tres, la diferencia la estás pagando vos.
            </p>
            <div className="pt-10 flex flex-col md:flex-row justify-center gap-20">
                <div>
                    <h4 className="text-brand-blue text-5xl font-black italic">4.2</h4>
                    <p className="text-mono text-[10px] font-black uppercase tracking-widest mt-2">Dotación CustOS</p>
                </div>
                <div className="opacity-20 flex items-center justify-center">
                    <X size={32} />
                </div>
                <div className="opacity-40">
                    <h4 className="text-white text-5xl font-black italic line-through">3.0</h4>
                    <p className="text-mono text-[10px] font-black uppercase tracking-widest mt-2">Error Común</p>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES: THE 4 PILLARS ─── */}
      <section id="diferenciales" className="py-32 bg-canvas">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
             <FeatureCard 
                icon={Smartphone} 
                title="Física + Electrónica" 
                desc="Tus vigiladores y tus alarmas hablando el mismo idioma en un solo dashboard táctico." 
             />
             <FeatureCard 
                icon={ShieldCheck} 
                title="Sólida Local" 
                desc="Convenio 507, ANMAC, VTV y habilitaciones provinciales. Hecho por y para Argentina." 
             />
             <FeatureCard 
                icon={Shield} 
                title="Aislamiento Total" 
                desc="Tus datos operan en una instancia hermética. Nadie ve tu margen, nunca. PostgreSQL RLS." 
             />
             <FeatureCard 
                icon={Zap} 
                title="IA Operativa" 
                desc="Consultá el estado de tu flota o pedí relevos por WhatsApp. Nuestra IA asiste, no inventa." 
             />
          </div>
        </div>
      </section>

      {/* ─── PLANS ─── */}
      <section id="planes" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 space-y-4">
             <span className="text-mono text-brand-blue text-[10px] font-black uppercase tracking-[0.2em]">Inversión</span>
             <h2 className="text-display text-5xl lg:text-7xl font-black text-navy italic uppercase tracking-tighter">Escalá tu control.</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <PlanCard 
                name="CustOS Core" 
                price="Consultar" 
                desc="Ordená la operación base."
                features={['Cuadrante Inteligente', 'Habilitaciones/RRHH', 'App Vigilador (Rondas)', 'Cotizador Base']}
            />
            <PlanCard 
                name="CustOS Pro" 
                price="Premium" 
                desc="Control total del margen."
                featured
                features={['Todo en Core', 'Gestión de Compras (M5)', 'Flota & Combustible', 'Análisis de Rentabilidad']}
            />
            <PlanCard 
                name="CustOS Command" 
                price="Custom" 
                desc="Operaciones multi-empresa."
                features={['Todo en Pro', 'API & Integraciones', 'VPC Dedicado', 'Soporte 24/7 Priority']}
            />
          </div>
          <p className="text-center mt-12 text-muted text-xs font-bold uppercase tracking-widest leading-relaxed">
            Precios por vigilador activo / mes. <br /> Sin costos ocultos. Operación transparente.
          </p>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-navy py-20 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-20">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center shadow-lg shadow-brand-blue/20">
                    <Shield size={18} className="text-white" />
                </div>
                <span className="text-display text-xl font-black italic uppercase">CustOS</span>
              </div>
              <p className="text-white/30 text-sm max-w-xs leading-relaxed">
                El sistema operativo de la seguridad privada en Argentina. <br /> Sabés el margen de cada contrato, en serio.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
                <div>
                    <h5 className="text-mono text-[10px] font-black text-brand-blue uppercase tracking-widest mb-6">Producto</h5>
                    <ul className="space-y-3 text-xs font-bold text-white/50">
                        <li><a href="#" className="hover:text-white transition-colors">Cuadrante</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Personal</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Monitoreo</a></li>
                    </ul>
                </div>
                <div>
                    <h5 className="text-mono text-[10px] font-black text-brand-blue uppercase tracking-widest mb-6">Empresa</h5>
                    <ul className="space-y-3 text-xs font-bold text-white/50">
                        <li><a href="#" className="hover:text-white transition-colors">Sobre nosotros</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Seguridad</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
                    </ul>
                </div>
            </div>
          </div>
          <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between text-[10px] font-black uppercase tracking-widest text-white/20">
            <p>© 2026 CUSTOS ERP · HECHO EN BUENOS AIRES</p>
            <p>Protegé tu margen · Custodiá tu operación</p>
          </div>
        </div>
      </footer>
    </div>
  );
}


function ProblemItem({ text }: { text: string }) {
    return (
        <div className="flex gap-4 items-center p-5 bg-canvas rounded-2xl border border-line group hover:border-brand-blue/30 transition-all">
            <AlertTriangle size={18} className="text-brand-blue opacity-40" />
            <p className="text-sm font-bold text-navy">{text}</p>
        </div>
    );
}

function FeatureCard({ icon: Icon, title, desc }: any) {
    return (
        <div className="bg-white p-8 rounded-[2rem] border border-line shadow-sm hover:shadow-2xl transition-all hover:-translate-y-2 group">
            <div className="w-14 h-14 bg-brand-blue/10 rounded-2xl flex items-center justify-center text-brand-blue mb-8 group-hover:scale-110 transition-transform">
                <Icon size={28} />
            </div>
            <h3 className="text-xl font-black text-navy uppercase italic tracking-tighter mb-4">{title}</h3>
            <p className="text-muted text-sm leading-relaxed">{desc}</p>
        </div>
    );
}

function PlanCard({ name, price, desc, features, featured = false }: any) {
    return (
        <div className={`p-10 rounded-[3rem] border transition-all ${featured ? 'bg-navy text-white shadow-2xl shadow-navy/40 scale-105 border-brand-blue/50' : 'bg-white border-line text-navy hover:shadow-xl'}`}>
            {featured && <span className="inline-block bg-brand-blue text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-6 italic">Más Elegido</span>}
            <h4 className="text-2xl font-black italic uppercase tracking-tighter mb-2">{name}</h4>
            <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-black italic text-brand-blue">{price}</span>
            </div>
            <p className={`text-sm font-medium mb-10 ${featured ? 'text-white/50' : 'text-muted'}`}>{desc}</p>
            <ul className="space-y-4 mb-12">
                {features.map((f: string, i: number) => (
                    <li key={i} className="flex gap-3 items-center text-xs font-bold leading-none">
                        <CheckCircle size={14} className="text-brand-blue shrink-0" />
                        <span className={featured ? 'text-white/70' : 'text-navy/60'}>{f}</span>
                    </li>
                ))}
            </ul>
            <button className={`w-full py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all ${featured ? 'bg-brand-blue text-white hover:bg-brand-deep' : 'bg-navy text-white hover:bg-black underline decoration-brand-blue underline-offset-8'}`}>Pedí tu demo</button>
        </div>
    );
}
