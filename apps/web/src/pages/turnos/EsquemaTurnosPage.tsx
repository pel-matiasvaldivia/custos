import { useState } from 'react';
import { LayoutGrid, FileText, RefreshCw } from 'lucide-react';
import { CatalogoEsquemasTab } from './CatalogoEsquemasTab';
import { PorContratoTab } from './PorContratoTab';
import { SolicitudesCambioTab } from './SolicitudesCambioTab';

type TabPrincipal = 'esquemas' | 'solicitudes';
type VistaEsquemas = 'catalogo' | 'contrato';

export const EsquemaTurnosPage = () => {
  const [tab, setTab] = useState<TabPrincipal>('esquemas');
  const [vista, setVista] = useState<VistaEsquemas>('contrato');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-display font-bold text-navy">Esquema de turnos</h2>
        <p className="text-muted">
          Definí cómo se cubren los puestos y gestioná los cambios de turno del personal.
        </p>
      </div>

      {/* Pestañas principales */}
      <div className="flex gap-1 border-b border-line">
        <button
          onClick={() => setTab('esquemas')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
            tab === 'esquemas'
              ? 'border-brand-blue text-brand-blue'
              : 'border-transparent text-muted hover:text-navy'
          }`}
        >
          Esquemas de turno
        </button>
        <button
          onClick={() => setTab('solicitudes')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors flex items-center gap-1.5 ${
            tab === 'solicitudes'
              ? 'border-brand-blue text-brand-blue'
              : 'border-transparent text-muted hover:text-navy'
          }`}
        >
          <RefreshCw size={14} /> Solicitudes de cambio
        </button>
      </div>

      {tab === 'esquemas' ? (
        <div className="space-y-4">
          {/* Toggle entre las dos formas de organizar (el usuario elige la que le convenga) */}
          <div className="inline-flex rounded-lg border border-line bg-canvas p-1 gap-1">
            <button
              onClick={() => setVista('contrato')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                vista === 'contrato' ? 'bg-surface text-navy shadow-sm' : 'text-muted hover:text-navy'
              }`}
            >
              <FileText size={14} /> Por contrato / objetivo
            </button>
            <button
              onClick={() => setVista('catalogo')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                vista === 'catalogo' ? 'bg-surface text-navy shadow-sm' : 'text-muted hover:text-navy'
              }`}
            >
              <LayoutGrid size={14} /> Catálogo de esquemas
            </button>
          </div>

          {vista === 'contrato' ? <PorContratoTab /> : <CatalogoEsquemasTab />}
        </div>
      ) : (
        <SolicitudesCambioTab />
      )}
    </div>
  );
};

export default EsquemaTurnosPage;
