import { useEffect, useState } from 'react';
import { PenTool, Save } from 'lucide-react';
import { contratoConfigService, ConfiguracionContrato } from '../../services/contratoConfig.service';
import { FirmaModal } from './FirmaModal';

const PLACEHOLDERS = [
  'tenant_razon_social', 'tenant_cuit', 'tenant_direccion',
  'cliente_nombre', 'cliente_cuit', 'cliente_domicilio',
  'contrato_codigo', 'contrato_inicio', 'objetivos_tabla',
  'facturacion_resumen', 'fecha_actual', 'firma_imagen', 'firma_nombre', 'firma_cargo',
];

export const ContratoConfigTab = () => {
  const [config, setConfig] = useState<ConfiguracionContrato | null>(null);
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mostrarFirmaModal, setMostrarFirmaModal] = useState(false);

  useEffect(() => {
    contratoConfigService
      .getOne()
      .then((c) => {
        setConfig(c);
        setHtml(c.plantilla_html);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleGuardar = async () => {
    setGuardando(true);
    setError(null);
    setMensaje(null);
    try {
      const actualizado = await contratoConfigService.updatePlantilla(html);
      setConfig(actualizado);
      setMensaje('Plantilla guardada.');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'No se pudo guardar la plantilla.');
    } finally {
      setGuardando(false);
    }
  };

  if (loading) return <p className="text-muted italic">Cargando...</p>;

  return (
    <div className="space-y-6">
      <div className="card p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-md border border-line bg-canvas flex items-center justify-center overflow-hidden">
            {config?.firma_url ? (
              <img src={config.firma_url} alt="Firma" className="max-h-12" />
            ) : (
              <PenTool size={24} className="text-muted" />
            )}
          </div>
          <div>
            <p className="font-bold text-navy">{config?.firma_nombre || 'Sin firma digital cargada'}</p>
            <p className="text-sm text-muted">{config?.firma_cargo || 'Cargá la firma del Director o Responsable'}</p>
          </div>
        </div>
        <button onClick={() => setMostrarFirmaModal(true)} className="btn btn-secondary whitespace-nowrap">
          {config?.firma_url ? 'Cambiar firma' : 'Cargar firma'}
        </button>
      </div>

      <div className="card p-5 space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-navy">Plantilla del contrato (HTML)</h3>
            <p className="text-sm text-muted">
              Se completa automáticamente con los datos del contrato al generarse. Placeholders disponibles:{' '}
              {PLACEHOLDERS.map((p) => `{{${p}}}`).join(', ')}.
            </p>
          </div>
          <button onClick={handleGuardar} disabled={guardando} className="btn btn-primary flex items-center gap-2 whitespace-nowrap">
            <Save size={16} />
            {guardando ? 'Guardando...' : 'Guardar plantilla'}
          </button>
        </div>

        {mensaje && <div className="p-3 bg-emerald/10 border border-emerald/30 rounded-md text-sm text-emerald">{mensaje}</div>}
        {error && <div className="p-3 bg-amber/10 border border-amber/30 rounded-md text-sm text-amber">{error}</div>}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted uppercase tracking-wider">HTML</label>
            <textarea
              className="w-full h-[500px] p-3 bg-canvas border border-line rounded-md font-mono text-xs outline-none focus:ring-2 focus:ring-brand-blue/20"
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              spellCheck={false}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted uppercase tracking-wider">Vista previa</label>
            <iframe title="preview" srcDoc={html} className="w-full h-[500px] bg-white border border-line rounded-md" />
          </div>
        </div>
      </div>

      {mostrarFirmaModal && config && (
        <FirmaModal
          config={config}
          onClose={() => setMostrarFirmaModal(false)}
          onSaved={(actualizado) => {
            setConfig(actualizado);
            setMostrarFirmaModal(false);
          }}
        />
      )}
    </div>
  );
};
