import { useState } from 'react';
import { CostConfigPage } from '../quoting/CostConfigPage';
import { CatalogosTab } from './CatalogosTab';
import { ContratoConfigTab } from './ContratoConfigTab';

const TABS = [
  { id: 'costos', label: 'Costos', render: () => <CostConfigPage /> },
  { id: 'catalogos', label: 'Catálogos', render: () => <CatalogosTab /> },
  { id: 'contratos', label: 'Contratos', render: () => <ContratoConfigTab /> },
];

export const SettingsPage = () => {
  const [tabActivo, setTabActivo] = useState(TABS[0].id);
  const tab = TABS.find((t) => t.id === tabActivo) || TABS[0];

  return (
    <div className="space-y-6">
      <div className="flex gap-2 border-b border-line">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTabActivo(t.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
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
