import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CostConfigPage } from '../quoting/CostConfigPage';
import { CatalogosTab } from './CatalogosTab';
import { ContratoConfigTab } from './ContratoConfigTab';
import { UsuariosTab } from './UsuariosTab';
import { CalculadoraHHTab } from './CalculadoraHHTab';
import { TenantGeoTab } from './TenantGeoTab';
import { EmpresaTab } from './EmpresaTab';
import { FacturacionArcaTab } from './FacturacionArcaTab';

const TABS = [
  { id: 'empresa', label: 'Empresa', render: () => <EmpresaTab /> },
  { id: 'usuarios', label: 'Usuarios', render: () => <UsuariosTab /> },
  { id: 'costos', label: 'Costos', render: () => <CostConfigPage /> },
  { id: 'calculadora', label: 'Calculadora HH', render: () => <CalculadoraHHTab /> },
  { id: 'ubicacion', label: 'Ubicación', render: () => <TenantGeoTab /> },
  { id: 'catalogos', label: 'Catálogos', render: () => <CatalogosTab /> },
  { id: 'contratos', label: 'Contratos', render: () => <ContratoConfigTab /> },
  { id: 'facturacion', label: 'Facturación ARCA', render: () => <FacturacionArcaTab /> },
];

export const SettingsPage = () => {
  // La pestaña puede venir por query param (?tab=empresa) para deep-links del
  // asistente de onboarding.
  const [params, setParams] = useSearchParams();
  const inicial = TABS.find((t) => t.id === params.get('tab'))?.id ?? TABS[0].id;
  const [tabActivo, setTabActivo] = useState(inicial);
  const tab = TABS.find((t) => t.id === tabActivo) || TABS[0];

  const seleccionar = (id: string) => {
    setTabActivo(id);
    setParams((p) => {
      p.set('tab', id);
      return p;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 border-b border-line overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => seleccionar(t.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              tabActivo === t.id
                ? 'border-brand-blue text-brand-blue'
                : 'border-transparent text-muted hover:text-navy'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab.render()}
    </div>
  );
};
