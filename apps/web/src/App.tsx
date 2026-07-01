import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { NotificationBell } from './components/layout/NotificationBell';
import { PersonnelPage } from './pages/personnel/PersonnelPage';
import { VigiladorDetail } from './pages/personnel/VigiladorDetail';
import { QuadrantPage } from './pages/quadrant/QuadrantPage';
import { ObjetivosPage } from './pages/objectives/ObjetivosPage';
import { ObjetivoDetail } from './pages/objectives/ObjetivoDetail';
import { ClientesPage } from './pages/clients/ClientesPage';
import { ClienteDetail } from './pages/clients/ClienteDetail';
import { QuotesPage } from './pages/quoting/QuotesPage';
import { QuoteWizard } from './pages/quoting/QuoteWizard';
import { SettingsPage } from './pages/settings/SettingsPage';
import { KioskPage } from './pages/kiosk/KioskPage';
import { NovedadesPage } from './pages/novedades/NovedadesPage';
import { MonitoringPage } from './pages/monitoring/MonitoringPage';
import { DevicesPage } from './pages/monitoring/DevicesPage';
import { ReportsPage } from './pages/reports/ReportsPage';
import { MobileDashboard } from './pages/mobile/MobileDashboard';
import MobileLogin from './pages/mobile/MobileLogin';
import ComprasPage from './pages/compras/ComprasPage';
import { HerramientasPage } from './pages/herramientas/HerramientasPage';
import { RelevosPage } from './pages/relevos/RelevosPage';
import OnboardingPage from './pages/onboarding/OnboardingPage';
import LandingPage from './pages/landing/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegistroPage from './pages/auth/RegistroPage';
import SuscripcionPage from './pages/suscripcion/SuscripcionPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { MobileProtectedRoute } from './components/auth/MobileProtectedRoute';
import { TrialBanner } from './components/layout/TrialBanner';
import { ExpiredGate } from './components/layout/ExpiredGate';
import { AuthProvider, useAuth } from './context/AuthContext';

/* ─── Dashboard placeholder ─── */
const Dashboard = () => (
  <div>
    <h2 className="text-3xl font-display font-bold text-navy mb-2">Bienvenido a CustOS</h2>
    <p className="text-muted text-lg">Resumen de operaciones y alertas rápidas.</p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      <div className="card">
        <h3 className="text-muted font-medium mb-1 uppercase text-xs tracking-wider">Vigiladores Activos</h3>
        <p className="text-4xl font-bold text-navy">24</p>
      </div>
      <div className="card border-amber/20 bg-amber/5">
        <h3 className="text-amber font-medium mb-1 uppercase text-xs tracking-wider">Credenciales por Vencer</h3>
        <p className="text-4xl font-bold text-amber">3</p>
      </div>
      <div className="card">
        <h3 className="text-muted font-medium mb-1 uppercase text-xs tracking-wider">Cobertura Hoy</h3>
        <p className="text-4xl font-bold text-emerald">98%</p>
      </div>
    </div>
  </div>
);

/* ─── ERP Layout (sidebar + content) ─── */
const AppLayout = () => (
  <div className="flex min-h-screen bg-canvas">
    <ExpiredGate />
    <Sidebar />
    <div className="flex-1 ml-64 flex flex-col">
      <TrialBanner />
      <header className="h-16 border-b border-line bg-surface flex items-center justify-end px-8 shrink-0">
        <NotificationBell />
      </header>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  </div>
);

/* ─── Root redirect: / → /login or /dashboard ─── */
const RootRedirect = () => {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  return <Navigate to={user ? '/dashboard' : '/login'} replace />;
};

/* ─── Route tree ─── */
function AppRoutes() {
  return (
    <Routes>
      {/* ROOT: smart redirect */}
      <Route path="/" element={<RootRedirect />} />

      {/* PUBLIC */}
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegistroPage />} />
      <Route path="/mobile/login" element={<MobileLogin />} />

      {/* PROTECTED: requires vigilador login */}
      <Route element={<MobileProtectedRoute />}>
        <Route path="/mobile" element={<MobileDashboard />} />
      </Route>

      {/* PROTECTED: requires login */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/personnel" element={<PersonnelPage />} />
          <Route path="/personnel/:id" element={<VigiladorDetail />} />
          <Route path="/quadrant" element={<QuadrantPage />} />
          <Route path="/objectives" element={<ObjetivosPage />} />
          <Route path="/objectives/:id" element={<ObjetivoDetail />} />
          <Route path="/clients" element={<ClientesPage />} />
          <Route path="/clients/:id" element={<ClienteDetail />} />
          <Route path="/quotes" element={<QuotesPage />} />
          <Route path="/quotes/new" element={<QuoteWizard />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/novedades" element={<NovedadesPage />} />
          <Route path="/monitoring" element={<MonitoringPage />} />
          <Route path="/monitoring/devices" element={<DevicesPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/compras" element={<ComprasPage />} />
          <Route path="/herramientas" element={<HerramientasPage />} />
          <Route path="/relevos" element={<RelevosPage />} />
          <Route path="/suscripcion" element={<SuscripcionPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/kiosk" element={<KioskPage />} />
          <Route path="*" element={<div className="text-muted">Módulo en construcción...</div>} />
        </Route>
      </Route>
    </Routes>
  );
}

/* ─── Root App ─── */
function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
