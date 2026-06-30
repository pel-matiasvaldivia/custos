import { useState, useEffect } from 'react';
import { Save, Calculator, AlertCircle } from 'lucide-react';
import api from '../../services/api';

export const CostConfigPage = () => {
  const [config, setConfig] = useState({
    costo_hora_base: 0,
    cargas_sociales: 0,
    costos_uniforme: 0,
    otros_costos: 0,
    factor_ajuste: 1.0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/config/costos')
      .then(res => {
        setConfig(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await api.put('/config/costos', config);
    setSaving(false);
  };

  if (loading) return <div className="p-8 text-muted">Cargando configuración...</div>;

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-brand-blue/10 p-3 rounded-xl text-brand-blue">
          <Calculator size={32} />
        </div>
        <div>
          <h2 className="text-3xl font-display font-bold text-navy">Configuración de Costos</h2>
          <p className="text-muted text-lg">Define los parámetros base para el motor de cotizaciones.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card space-y-4">
            <h3 className="text-lg font-bold text-navy mb-4 border-b pb-2">Valores Salariales</h3>
            
            <div>
              <label className="label">Costo Hora Base (ARS)</label>
              <input 
                type="number" 
                className="input"
                value={config.costo_hora_base}
                onChange={e => setConfig({...config, costo_hora_base: Number(e.target.value)})}
              />
              <p className="text-xs text-muted mt-1 italic">Ej: Salario bruto dividido 200hs (aprox).</p>
            </div>

            <div>
              <label className="label">Cargas Sociales (%)</label>
              <input 
                type="number" 
                step="0.01"
                className="input"
                value={config.cargas_sociales}
                onChange={e => setConfig({...config, cargas_sociales: Number(e.target.value)})}
              />
              <p className="text-xs text-muted mt-1 italic">Ej: 0.45 para el 45%.</p>
            </div>
          </div>

          <div className="card space-y-4">
            <h3 className="text-lg font-bold text-navy mb-4 border-b pb-2">Costos Operativos</h3>
            
            <div>
              <label className="label">Uniforme y Equipamiento (por vigilador)</label>
              <input 
                type="number" 
                className="input"
                value={config.costos_uniforme}
                onChange={e => setConfig({...config, costos_uniforme: Number(e.target.value)})}
              />
            </div>

            <div>
              <label className="label">Otros Costos / Overhead (mensual)</label>
              <input 
                type="number" 
                className="input"
                value={config.otros_costos}
                onChange={e => setConfig({...config, otros_costos: Number(e.target.value)})}
              />
            </div>
          </div>
        </div>

        <div className="bg-amber/5 border border-amber/20 p-4 rounded-xl flex gap-3">
          <AlertCircle className="text-amber shrink-0" />
          <p className="text-sm text-amber/80">
            <strong>Importante:</strong> Los cambios en estos parámetros no afectarán a las cotizaciones ya enviadas o aceptadas, solo se aplicarán a las nuevas propuestas.
          </p>
        </div>

        <div className="flex justify-end">
          <button 
            type="submit" 
            className="btn btn-primary flex items-center gap-2"
            disabled={saving}
          >
            <Save size={18} />
            {saving ? 'Guardando...' : 'Guardar Configuración'}
          </button>
        </div>
      </form>
    </div>
  );
};
