import { Routes, Route, Outlet } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { PersonnelPage } from './pages/personnel/PersonnelPage';
import { VigiladorDetail } from './pages/personnel/VigiladorDetail';
import { QuadrantPage } from './pages/quadrant/QuadrantPage';
import { QuotesPage } from './pages/quoting/QuotesPage';
import { QuoteWizard } from './pages/quoting/QuoteWizard';
import { CostConfigPage } from './pages/quoting/CostConfigPage';
import { KioskPage } from './pages/kiosk/KioskPage';
import { NovedadesPage } from './pages/novedades/NovedadesPage';
import { MonitoringPage } from './pages/monitoring/MonitoringPage';
import { DevicesPage } from './pages/monitoring/DevicesPage';
import { ReportsPage } from './pages/reports/ReportsPage';
import { MobileDashboard } from './pages/mobile/MobileDashboard';
import ComprasPage from './pages/compras/ComprasPage';
import OnboardingPage from './pages/onboarding/OnboardingPage';
import LandingPage from './pages/landing/LandingPage';

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
    <Sidebar />
    <main className="flex-1 ml-64 p-8">
      <Outlet />
    </main>
  </div>
);

/* ─── Root App ─── */
function App() {
  return (
    <Routes>
      {/* ── PUBLIC: Landing page — fully standalone, NO sidebar ── */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/mobile" element={<MobileDashboard />} />

      {/* ── PROTECTED: ERP with sidebar layout ── */}
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/personnel" element={<PersonnelPage />} />
        <Route path="/personnel/:id" element={<VigiladorDetail />} />
        <Route path="/quadrant" element={<QuadrantPage />} />
        <Route path="/quotes" element={<QuotesPage />} />
        <Route path="/quotes/new" element={<QuoteWizard />} />
        <Route path="/settings" element={<CostConfigPage />} />
        <Route path="/novedades" element={<NovedadesPage />} />
        <Route path="/monitoring" element={<MonitoringPage />} />
        <Route path="/monitoring/devices" element={<DevicesPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/compras" element={<ComprasPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/kiosk" element={<KioskPage />} />
        <Route path="*" element={<div className="text-muted">Módulo en construcción...</div>} />
      </Route>
    </Routes>
  );
}

export default App;
