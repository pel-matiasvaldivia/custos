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
  Zap,
  Building2
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { TenantSwitcher } from './TenantSwitcher';

const navGroups = [
  {
    label: null,
    items: [{ icon: LayoutDashboard, label: 'Dashboard', path: '/' }],
  },
  {
    label: 'Comercial',
    items: [
      { icon: Building2, label: 'Clientes', path: '/clients' },
      { icon: Shield, label: 'Objetivos', path: '/objectives' },
      { icon: Shield, label: 'Cotizaciones', path: '/quotes' },
    ],
  },
  {
    label: 'Operación',
    items: [
      { icon: Calendar, label: 'Cuadrante', path: '/quadrant' },
      { icon: Users, label: 'Personal', path: '/personnel' },
      { icon: AlertCircle, label: 'Novedades', path: '/novedades' },
      { icon: ShoppingCart, label: 'Compras', path: '/compras' },
    ],
  },
  {
    label: 'Centro de Operaciones',
    items: [
      { icon: Activity, label: 'Monitoreo', path: '/monitoring' },
      { icon: Smartphone, label: 'Equipamiento', path: '/monitoring/devices' },
      { icon: Zap, label: 'Vigilancia Móvil', path: '/mobile' },
      { icon: BarChart3, label: 'Reportes', path: '/reports' },
    ],
  },
  {
    label: 'Sistema',
    items: [
      { icon: Settings, label: 'Onboarding', path: '/onboarding' },
      { icon: Settings, label: 'Configuración', path: '/settings' },
    ],
  },
];

export const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <aside className="w-64 bg-navy h-screen text-surface flex flex-col fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-2xl font-display font-bold tracking-tight flex items-center gap-2">
          <Shield className="text-brand-blue" /> CustOS
        </h1>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-4 overflow-y-auto">
        {navGroups.map((group, i) => (
          <div key={group.label ?? `group-${i}`} className="space-y-1">
            {group.label && (
              <p className="px-3 pt-2 pb-1 text-xs font-semibold uppercase tracking-wider text-surface/40">
                {group.label}
              </p>
            )}
            {group.items.map((item) => (
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
          </div>
        ))}
      </nav>

      <div className="border-t border-surface/10 pt-3">
        <TenantSwitcher />
      </div>

      <div className="p-4 border-t border-surface/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 w-full text-muted hover:text-surface transition-colors"
        >
          <LogOut size={20} />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};
