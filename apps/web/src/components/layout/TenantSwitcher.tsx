import { useEffect, useState } from 'react';
import { Building2, Undo2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authService, Tenant } from '../../services/auth.service';

export const TenantSwitcher = () => {
  const { user, switchTenant, exitImpersonation } = useAuth();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [cambiando, setCambiando] = useState(false);

  const esSuperadmin = user?.role === 'SUPERADMIN' || user?.impersonating;

  useEffect(() => {
    if (!esSuperadmin) return;
    authService.getTenants().then(setTenants).catch(() => {});
  }, [esSuperadmin]);

  if (!esSuperadmin) return null;

  const handleChange = async (tenantId: string) => {
    if (!tenantId) return;
    setCambiando(true);
    try {
      await switchTenant(tenantId);
    } finally {
      setCambiando(false);
    }
  };

  return (
    <div className="px-4 pb-3 space-y-2">
      {user?.impersonating && (
        <div className="px-3 py-1.5 bg-amber/10 border border-amber/30 rounded-md text-xs text-amber">
          Operando como ADMIN de <strong>{user.tenantNombre}</strong>
        </div>
      )}
      <div className="flex items-center gap-2">
        <Building2 size={16} className="text-surface/50 shrink-0" />
        <select
          className="flex-1 bg-surface/10 text-surface text-xs rounded-md px-2 py-1.5 outline-none border border-surface/10"
          value={user?.impersonating ? user.tenantId : ''}
          disabled={cambiando}
          onChange={(e) => handleChange(e.target.value)}
        >
          <option value="" disabled>
            Entrar a un tenant...
          </option>
          {tenants.map((t) => (
            <option key={t.id} value={t.id}>
              {t.nombre}
            </option>
          ))}
        </select>
      </div>
      {user?.impersonating && (
        <button
          onClick={exitImpersonation}
          className="flex items-center gap-2 text-xs text-surface/70 hover:text-surface transition-colors"
        >
          <Undo2 size={14} /> Volver a superadmin
        </button>
      )}
    </div>
  );
};
