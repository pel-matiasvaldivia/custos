import { 
  Users, 
  Calendar, 
  LayoutDashboard, 
  LogOut,
  ShoppingCart,
  Shield,
  Settings,
  AlertCircle,
  Activity,
  Smartphone,
  BarChart3,
  Zap
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Activity, label: 'Monitoreo', path: '/monitoring' },
  { icon: Smartphone, label: 'Equipamiento', path: '/monitoring/devices' },
  { icon: BarChart3, label: 'Reportes', path: '/reports' },
  { icon: Zap, label: 'Vigilancia Móvil', path: '/mobile' },
  { icon: ShoppingCart, label: 'Compras', path: '/compras' },
  { icon: Settings, label: 'Onboarding', path: '/onboarding' },
  { icon: Users, label: 'Personal', path: '/personnel' },
  { icon: Calendar, label: 'Cuadrante', path: '/quadrant' },
  { icon: Shield, label: 'Cotizaciones', path: '/quotes' },
  { icon: AlertCircle, label: 'Novedades', path: '/novedades' },
  { icon: Shield, label: 'Objetivos', path: '/objectives' },
  { icon: Settings, label: 'Configuración', path: '/settings' },
];

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-navy h-screen text-surface flex flex-col fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-2xl font-display font-bold tracking-tight flex items-center gap-2">
          <Shield className="text-brand-blue" /> CustOS
        </h1>
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }: { isActive: boolean }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md transition-colors font-medium ${
                isActive 
                  ? 'bg-brand-blue text-surface' 
                  : 'text-muted hover:bg-surface/10 hover:text-surface'
              }`
            }
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-surface/10">
        <button className="flex items-center gap-3 px-3 py-2 w-full text-muted hover:text-surface transition-colors">
          <LogOut size={20} />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};
