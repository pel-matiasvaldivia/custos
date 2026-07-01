import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';

interface AuthUser {
  id: string;
  email: string;
  role: string;
  tenantId: string;
  tenantNombre?: string;
  impersonating?: boolean;
}

export interface RegistroPayload {
  empresa_nombre: string;
  razon_social?: string;
  cuit?: string;
  email: string;
  password: string;
  telefono?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  registro: (data: RegistroPayload) => Promise<{ trial_hasta: string }>;
  logout: () => void;
  isLoading: boolean;
  switchTenant: (tenantId: string) => Promise<void>;
  exitImpersonation: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Restore session from localStorage
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    const { access_token, user: userData } = res.data;
    localStorage.setItem('token', access_token);
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    }
    setToken(access_token);
  };

  const registro = async (data: RegistroPayload) => {
    const res = await api.post('/auth/registro', data);
    const { access_token, user: userData, trial_hasta } = res.data;
    localStorage.setItem('token', access_token);
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    }
    setToken(access_token);
    return { trial_hasta };
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('superadmin_token');
    localStorage.removeItem('superadmin_user');
    setToken(null);
    setUser(null);
  };

  // SUPERADMIN entra a operar dentro de otro tenant (rol efectivo ADMIN ahí).
  // Guarda la sesión original de superadmin para poder volver sin reloguear.
  const switchTenant = async (tenantId: string) => {
    if (!localStorage.getItem('superadmin_token') && token && user?.role === 'SUPERADMIN') {
      localStorage.setItem('superadmin_token', token);
      localStorage.setItem('superadmin_user', JSON.stringify(user));
    }
    const res = await api.post('/auth/impersonate', { tenant_id: tenantId });
    const { access_token, user: userData } = res.data;
    localStorage.setItem('token', access_token);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(access_token);
    setUser(userData);
  };

  const exitImpersonation = () => {
    const superadminToken = localStorage.getItem('superadmin_token');
    const superadminUser = localStorage.getItem('superadmin_user');
    if (!superadminToken || !superadminUser) return;
    localStorage.setItem('token', superadminToken);
    localStorage.setItem('user', superadminUser);
    localStorage.removeItem('superadmin_token');
    localStorage.removeItem('superadmin_user');
    setToken(superadminToken);
    setUser(JSON.parse(superadminUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, login, registro, logout, isLoading, switchTenant, exitImpersonation }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
