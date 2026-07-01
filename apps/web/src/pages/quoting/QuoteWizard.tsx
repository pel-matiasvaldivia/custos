import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, ArrowLeft, Save, Calculator, Users } from 'lucide-react';
import api from '../../services/api';
import { ClientePicker } from '../../components/clients/ClientePicker';
import { TipoHora, TIPO_HORA_LABELS } from '../../services/cotizacion.service';

const TIPOS: TipoHora[] = ['HORAS_HOMBRE', 'HORAS_VEHICULO', 'HORAS_SERVICIO_ESPECIAL'];

const TIPO_BADGE: Record<TipoHora, string> = {
  HORAS_HOMBRE: 'bg-brand-blue/10 text-brand-blue',
  HORAS_VEHICULO: 'bg-amber/10 text-amber',
  HORAS_SERVICIO_ESPECIAL: 'bg-emerald/10 text-emerald',
};

interface ItemState {
  puesto_nombre: string;
  tipo: TipoHora;
  horas_mensuales: number;
  costo_hora: number;
  margen: number;
}

export const QuoteWizard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<any>(null);
  const [quote, setQuote] = useState({
    cliente_id: '',
    cliente_nombre: '',
    vencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: [
      { puesto_nombre: 'Puesto de Seguridad 24hs', tipo: 'HORAS_HOMBRE' as TipoHora, horas_mensuales: 720, costo_hora: 0, margen: 0.25 }
    ]
  });

  useEffect(() => {
    api.get('/config/costos')
      .then(res => {
        const cfg = res.data;
        setConfig(cfg);
        setQuote(prev => ({
          ...prev,
          items: prev.items.map(item => ({
            ...item,
            costo_hora: item.costo_hora || Number(cfg.costo_hora_base),
          })),
        }));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const addItem = () => {
    setQuote({
      ...quote,
      items: [...quote.items, {
        puesto_nombre: '',
        tipo: 'HORAS_HOMBRE',
        horas_mensuales: 720,
        costo_hora: config ? Number(config.costo_hora_base) : 0,
        margen: 0.25,
      }]
    });
  };

  const removeItem = (index: number) => {
    setQuote({ ...quote, items: quote.items.filter((_, i) => i !== index) });
  };

  const updateItem = (index: number, field: string, value: unknown) => {
    const newItems = [...quote.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setQuote({ ...quote, items: newItems });
  };

  const calculateSubtotal = (item: ItemState) => {
    if (!config) return 0;
    const factorCargas = 1 + Number(config.cargas_sociales);
    const result = (item.horas_mensuales * item.costo_hora * factorCargas) / (1 - item.margen);
    return isNaN(result) ? 0 : result;
  };

  const handleSave = async () => {
    const payload = {
      cliente_id: quote.cliente_id || undefined,
      cliente_nombre: quote.cliente_nombre || undefined,
      vencimiento: quote.vencimiento,
      items: quote.items.map(item => ({
        puesto_nombre: item.puesto_nombre,
        tipo: item.tipo,
        horas_mensuales: item.horas_mensuales,
        margen: item.margen,
        costo_hora: item.costo_hora,
        subtotal: calculateSubtotal(item),
      })),
    };
    await api.post('/cotizaciones', payload);
    navigate('/quotes');
  };

  if (loading) return <div className="p-8 text-muted">Cargando motor de cálculo...</div>;

  const total = quote.items.reduce((acc, item) => acc + calculateSubtotal(item), 0);

  const horasPorTipo = TIPOS.map(tipo => ({
    tipo,
    horas: quote.items.filter(i => i.tipo === tipo).reduce((s, i) => s + i.horas_mensuales, 0),
  })).filter(x => x.horas > 0);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/quotes')} className="hover:bg-canvas p-2 rounded-lg transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h2 className="text-3xl font-display font-bold text-navy">Nueva Cotización</h2>
          <p className="text-muted text-lg">Crea una propuesta comercial basada en costos reales.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h3 className="text-lg font-bold text-navy mb-4 border-b pb-2">Datos Generales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <ClientePicker
                  clienteId={quote.cliente_id}
                  onChange={(id, nombre) => setQuote({ ...quote, cliente_id: id, cliente_nombre: nombre })}
                />
              </div>
              <div>
                <label className="label">Vencimiento de Oferta</label>
                <input
                  type="date"
                  className="input"
                  value={quote.vencimiento}
                  onChange={e => setQuote({ ...quote, vencimiento: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h3 className="text-lg font-bold text-navy">Items del Servicio</h3>
              <button onClick={addItem} className="text-brand-blue hover:text-navy flex items-center gap-1 text-sm font-bold">
                <Plus size={16} /> Agregar Item
              </button>
            </div>

            <div className="space-y-4">
              {quote.items.map((item, index) => (
                <div key={index} className="p-4 bg-canvas/50 rounded-xl border border-surface/5 space-y-3">
                  <div className="flex justify-between gap-4">
                    <div className="flex-1">
                      <label className="label text-xs">Descripción del Servicio</label>
                      <input
                        type="text"
                        className="input input-sm"
                        placeholder="Ej: Vigilancia Nocturna"
                        value={item.puesto_nombre}
                        onChange={e => updateItem(index, 'puesto_nombre', e.target.value)}
                      />
                    </div>
                    <button onClick={() => removeItem(index)} className="text-red-400 hover:text-red-600 self-end mb-2">
                      <Trash2 size={20} />
                    </button>
                  </div>

                  <div>
                    <label className="label text-xs">Tipo de hora</label>
                    <div className="flex gap-2 flex-wrap">
                      {TIPOS.map(tipo => (
                        <button
                          key={tipo}
                          type="button"
                          onClick={() => updateItem(index, 'tipo', tipo)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                            item.tipo === tipo
                              ? `${TIPO_BADGE[tipo]} border-current`
                              : 'border-line text-muted hover:border-brand-blue/40'
                          }`}
                        >
                          {TIPO_HORA_LABELS[tipo]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="label text-xs">Hs Mensuales</label>
                      <input
                        type="number"
                        className="input input-sm"
                        value={item.horas_mensuales}
                        onChange={e => updateItem(index, 'horas_mensuales', Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <label className="label text-xs">Costo / Hora</label>
                      <input
                        type="number"
                        className="input input-sm"
                        value={item.costo_hora}
                        onChange={e => updateItem(index, 'costo_hora', Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <label className="label text-xs">Margen Bruto (%)</label>
                      <input
                        type="number"
                        step="0.01"
                        className="input input-sm"
                        value={item.margen}
                        onChange={e => updateItem(index, 'margen', Number(e.target.value))}
                      />
                    </div>
                    <div className="flex flex-col justify-end text-right">
                      <span className="text-xs text-muted font-bold uppercase">Subtotal</span>
                      <span className="text-lg font-mono font-bold text-navy">
                        ${calculateSubtotal(item).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card bg-navy text-surface sticky top-8">
            <h3 className="text-lg font-bold mb-4 border-b border-surface/10 pb-2 flex items-center gap-2">
              <Calculator size={20} className="text-brand-blue" />
              Resumen de Propuesta
            </h3>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="opacity-70">Costo Hora Base:</span>
                <span className="font-mono text-emerald">${Number(config.costo_hora_base).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="opacity-70">Cargas Sociales:</span>
                <span className="font-mono">{config.cargas_sociales * 100}%</span>
              </div>
            </div>

            {horasPorTipo.length > 0 && (
              <div className="space-y-1 mb-4 border-t border-surface/10 pt-3">
                <p className="text-xs opacity-60 uppercase tracking-wider mb-2">Horas por tipo</p>
                {horasPorTipo.map(({ tipo, horas }) => (
                  <div key={tipo} className="flex justify-between text-sm">
                    <span className="opacity-70">{TIPO_HORA_LABELS[tipo]}:</span>
                    <span className="font-mono">{horas.toLocaleString()} hs</span>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-surface/10 pt-4 mt-2">
              <span className="text-xs font-bold uppercase opacity-60 tracking-widest block mb-1">Total Mensual Neto (ARS)</span>
              <div className="text-3xl font-mono font-bold text-brand-blue break-all">
                ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
            </div>

            <button
              onClick={handleSave}
              className="btn btn-primary w-full mt-8 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!quote.cliente_id || total === 0}
            >
              <Save size={20} />
              Generar Cotización
            </button>
            {!quote.cliente_id && (
              <p className="text-xs text-amber mt-2 text-center">
                Seleccioná o creá un cliente para poder generar la cotización.
              </p>
            )}
          </div>

          <div className="card border-brand-blue/20 bg-brand-blue/5">
            <h4 className="font-bold text-navy flex items-center gap-2 mb-2">
              <Users size={16} /> Personal Requerido
            </h4>
            <p className="text-sm text-muted leading-relaxed">
              Basado en el factor de cobertura actual de <strong>4.20</strong>, esta propuesta requiere aproximadamente{' '}
              <strong className="text-navy">
                {(quote.items
                  .filter(i => i.tipo === 'HORAS_HOMBRE')
                  .reduce((acc, i) => acc + i.horas_mensuales, 0) / 172).toFixed(1)} vigiladores
              </strong>{' '}
              operativos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
