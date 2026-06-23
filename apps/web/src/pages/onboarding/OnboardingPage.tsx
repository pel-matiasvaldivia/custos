import { useEffect, useState } from 'react';
import { tenantService, Tenant } from '../../services/tenant';
import { Building2, Plus, Mail, Phone, MapPin, Globe } from 'lucide-react';

const OnboardingPage = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await tenantService.getAll();
      setTenants(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Cargando sistema de onboarding...</div>;

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Control de <span className="text-indigo-600">Tenants</span></h1>
          <p className="text-slate-500 mt-1 font-medium">Panel de administración global para el alta de nuevas empresas.</p>
        </div>
        <button className="btn btn-primary flex items-center gap-2 px-6 py-3 rounded-2xl shadow-xl shadow-indigo-100 transition-all active:scale-95">
          <Plus size={20} />
          <span className="font-bold">Alta de Empresa</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tenants.map(tenant => (
          <div key={tenant.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all p-6 group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-indigo-50 transition-colors">
                {tenant.logo_url ? (
                  <img src={tenant.logo_url} alt={tenant.nombre} className="w-12 h-12 object-contain" />
                ) : (
                  <Building2 size={32} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                )}
              </div>
              <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Activo</span>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{tenant.nombre}</h3>
                <p className="text-slate-400 text-sm font-medium">{tenant.razon_social || 'Razón Social no definida'}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <Globe size={14} className="text-slate-300" />
                  <span className="font-mono">CUIT: {tenant.cuit || '---'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <Mail size={14} className="text-slate-300" />
                  <span>{tenant.email_contacto || 'Sin email'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <Phone size={14} className="text-slate-300" />
                  <span>{tenant.telefono_contacto || 'Sin teléfono'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <MapPin size={14} className="text-slate-300" />
                  <span className="truncate">{tenant.direccion || 'Sin dirección'}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-50 flex gap-2">
                <button className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-xs py-2 rounded-xl transition-colors">Configurar</button>
                <button className="flex-1 bg-slate-900 hover:bg-black text-white font-bold text-xs py-2 rounded-xl transition-colors">Ver Detalles</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {tenants.length === 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <Building2 size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500 font-medium">No hay empresas registradas en el sistema.</p>
        </div>
      )}
    </div>
  );
};

export default OnboardingPage;
