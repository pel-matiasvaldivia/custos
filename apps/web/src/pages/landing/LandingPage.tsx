import { 
  ShieldCheck, 
  Clock, 
  BarChart3, 
  Zap, 
  ChevronRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const HERO_IMAGE = "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=100&w=2070";
const FEATURE_IMAGE = "https://images.unsplash.com/photo-1557597774-9d2739f85a76?auto=format&fit=crop&q=100&w=2070";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-4 flex justify-between items-center max-w-screen-2xl mx-auto left-0 right-0">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <ShieldCheck size={24} />
          </div>
          <span className="text-2xl font-black tracking-tighter text-slate-900 italic uppercase">Cust<span className="text-indigo-600 tracking-normal not-italic">OS</span></span>
        </div>
        
        <div className="hidden md:flex gap-8 text-sm font-bold uppercase tracking-widest text-slate-500">
          <a href="#features" className="hover:text-indigo-600 transition-colors">Características</a>
          <a href="#modules" className="hover:text-indigo-600 transition-colors">Módulos</a>
          <a href="#security" className="hover:text-indigo-600 transition-colors">Seguridad</a>
        </div>

        <div className="flex gap-4">
          <Link to="/login" className="px-6 py-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors flex items-center">
            Login
          </Link>
          <Link to="/dashboard" className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-xl shadow-slate-200 hover:bg-black transition-all active:scale-95">
            Acceder al ERP
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto overflow-hidden">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-indigo-100/50 rounded-full blur-3xl -z-10" />
        <div className="absolute top-80 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -z-10" />

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 animate-in slide-in-from-left duration-700">
            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-4 py-1.5 rounded-full text-indigo-600 text-xs font-black uppercase tracking-widest">
              <Zap size={14} /> El Futuro de la Seguridad Privada
            </div>
            <h1 className="text-6xl lg:text-7xl font-black text-slate-900 leading-[0.95] tracking-tighter italic uppercase">
              Operaciones <br />
              <span className="text-indigo-600">Sin Fricción</span><br />
              Control Total.
            </h1>
            <p className="text-xl text-slate-500 max-w-lg font-medium leading-relaxed">
              El primer ERP diseñado exclusivamente para empresas de vigilancia en Argentina. Del cuadrante a la rentabilidad, en tiempo real.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 active:scale-95">
                Empezar Ahora <ChevronRight size={20} />
              </button>
              <button className="bg-white border-2 border-slate-100 text-slate-900 px-8 py-4 rounded-2xl font-bold text-lg hover:border-slate-300 transition-all active:scale-95">
                Ver Video Demo
              </button>
            </div>
          </div>

          <div className="relative animate-in zoom-in duration-1000 delay-200">
             <div className="bg-slate-900 rounded-[2.5rem] p-3 shadow-2xl shadow-slate-300 ring-1 ring-slate-100 overflow-hidden group">
                <img 
                  src={HERO_IMAGE} 
                  alt="CustOS Dashboard Mockup" 
                  className="rounded-[2rem] w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                />
             </div>
             {/* Floating Stats */}
             <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 animate-bounce duration-[3000ms]">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Efectividad Operativa</p>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-black text-emerald-500">99.8%</span>
                  <BarChart3 className="text-emerald-500 mb-1" size={24} />
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Trust & Operations Section */}
      <section id="features" className="py-20 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none mb-6">
              Diseñado para los rumbos <br />más <span className="text-indigo-600 underline decoration-indigo-200">exigentes.</span>
            </h2>
            <p className="text-slate-500 font-medium text-lg">
              Deje de pelear con hojas de cálculo. CustOS automatiza la complejidad para que usted se enfoque en el cliente.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: Clock, 
                title: "Cuadrante Inteligente", 
                desc: "Algoritmos que calculan dotaciones 24/7 sin errores de sub-dotación ni superposición de turnos.",
                color: "bg-blue-50 text-blue-600"
              },
              { 
                icon: ShieldCheck, 
                title: "Validación de Credenciales", 
                desc: "Bloqueo duro de asignaciones si la habilitación o el psicofísico están vencidos. Cumplimiento legal al 100%.",
                color: "bg-emerald-50 text-emerald-600"
              },
              { 
                icon: BarChart3, 
                title: "Rentabilidad por Objetivo", 
                desc: "Análisis preciso de costos vs facturación. Sepa cuánto gana en cada puesto en tiempo real.",
                color: "bg-indigo-50 text-indigo-600"
              }
            ].map((f, i) => (
              <div key={i} className="bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all border border-slate-100 group">
                <div className={`${f.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-8 border border-slate-100 group-hover:scale-110 transition-transform`}>
                  <f.icon size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{f.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Precision Section */}
      <section className="py-32 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
        <div className="order-2 lg:order-1">
          <div className="bg-indigo-100/50 rounded-[3rem] p-4 shadow-2xl relative">
             <img 
               src={FEATURE_IMAGE} 
               alt="Security Guard App" 
               className="rounded-[2.5rem] w-full mix-blend-multiply" 
             />
             <div className="absolute -top-6 -right-6 w-32 h-32 bg-indigo-400 rounded-full blur-3xl opacity-50 -z-10" />
          </div>
        </div>
        <div className="space-y-8 order-1 lg:order-2">
          <h2 className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter uppercase italic leading-[0.9]">
            Información Precisa <br />
            <span className="text-indigo-600">Acción Inmediata.</span>
          </h2>
          <div className="space-y-6">
            {[
              { label: "Módulo 1: Tiempo Real", text: "Reportes de asistencia integrados directamente al monitoreo central." },
              { label: "Módulo 2: Personal Hardened", text: "Toda la documentación del vigilante digitalizada y con alertas preventivas." },
              { label: "Módulo 6: War Room", text: "Centro de control interactivo para supervisar rondas y novedades." }
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="mt-1.5 w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
                  <CheckCircle size={12} className="text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{item.label}</h4>
                  <p className="text-slate-500">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="text-indigo-600 font-black flex items-center gap-2 group">
            Ver todos los módulos <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Security CTA Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="bg-slate-900 rounded-[3rem] p-12 lg:p-20 text-center space-y-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)] bg-[length:20px_20px]" />
          <ShieldCheck size={64} className="mx-auto text-indigo-400 animate-pulse" />
          <h2 className="text-5xl lg:text-7xl font-black tracking-tighter uppercase italic leading-none max-w-4xl mx-auto">
            ¿Listo para llevar sus operaciones al siguiente nivel?
          </h2>
          <p className="text-indigo-100/60 text-xl font-medium max-w-2xl mx-auto">
            Seguridad Multi-Tenancy garantizada por Row-Level Security. Sus datos están seguros con nosotros.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <button className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-bold text-xl shadow-2xl shadow-indigo-900/50 hover:bg-indigo-700 transition-all active:scale-95">
              Agendar Demo Gratuita
            </button>
            <button className="bg-transparent border-2 border-white/20 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-white/10 transition-all active:scale-95">
              Contactar Soporte
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                <ShieldCheck size={18} />
              </div>
              <span className="text-xl font-black tracking-tighter text-slate-900 italic uppercase">CustOS</span>
            </div>
            <p className="text-slate-400 text-sm">Innovando en la seguridad privada dinámica.</p>
          </div>
          <div>
            <h4 className="font-black uppercase tracking-widest text-xs text-slate-900 mb-6 font-display">Módulos</h4>
            <ul className="space-y-3 text-slate-500 text-sm font-medium">
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Personal y RRHH</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Cuadrante y Guardia</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Compras (Procurement)</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Cotizador Financiero</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black uppercase tracking-widest text-xs text-slate-900 mb-6 font-display">Compañía</h4>
            <ul className="space-y-3 text-slate-500 text-sm font-medium">
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Sobre Nosotros</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Políticas de RLS</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Seguridad de Datos</a></li>
            </ul>
          </div>
          <div className="bg-slate-50 p-8 rounded-3xl space-y-4">
            <h4 className="font-bold text-slate-900">Mantente al día</h4>
            <p className="text-xs text-slate-400">Suscríbete para recibir novedades sobre normativas de seguridad.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="email@empresa.com" className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm w-full outline-none focus:ring-2 focus:ring-indigo-100" />
              <button className="bg-indigo-600 text-white p-2 rounded-xl"><ChevronRight size={20} /></button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-400 text-xs font-medium">© 2026 CustOS ERP. Todos los derechos reservados.</p>
          <div className="flex gap-8 text-xs font-bold uppercase tracking-widest text-slate-400">
            <a href="#" className="hover:text-slate-900">Terminos</a>
            <a href="#" className="hover:text-slate-900">Privacidad</a>
            <a href="#" className="hover:text-slate-900">Cookies</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const CheckCircle = ({ size, className }: { size: number, className: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default LandingPage;
