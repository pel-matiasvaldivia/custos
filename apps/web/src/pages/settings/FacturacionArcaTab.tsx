import { useEffect, useState } from 'react';
import { FileText, Download, RefreshCw } from 'lucide-react';
import { ConfiguracionArcaForm } from './ConfiguracionArcaForm';
import { BotonFacturarElectronico } from '../billing/BotonFacturarElectronico';
import {
  arcaService, ConfiguracionArca, FacturaResumen,
} from '../../services/arca.service';

/**
 * Pestaña de Configuración → Facturación (ARCA): reúne la configuración fiscal,
 * la emisión de comprobantes y el listado de los últimos emitidos.
 */
export const FacturacionArcaTab = () => {
  const [cfg, setCfg] = useState<ConfiguracionArca | null>(null);
  const [facturas, setFacturas] = useState<FacturaResumen[]>([]);
  const [cargando, setCargando] = useState(false);

  const cargarFacturas = async () => {
    setCargando(true);
    try {
      setFacturas(await arcaService.listarFacturas());
    } catch {
      /* noop */
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    arcaService.getConfig().then(setCfg).catch(() => undefined);
    cargarFacturas();
  }, []);

  const listo = !!(cfg?.configurado && cfg.tiene_certificado && cfg.tiene_clave);

  return (
    <div className="space-y-8">
      <ConfiguracionArcaForm onCambio={setCfg} />

      <div className="max-w-3xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="text-emerald" size={20} />
            <h3 className="font-display font-bold text-navy text-lg">Comprobantes emitidos</h3>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={cargarFacturas} className="text-muted hover:text-navy" title="Refrescar">
              <RefreshCw size={16} className={cargando ? 'animate-spin' : ''} />
            </button>
            {listo && (
              <BotonFacturarElectronico
                puntosVenta={cfg?.puntos_venta ?? []}
                label="Nueva factura"
                onEmitida={cargarFacturas}
              />
            )}
          </div>
        </div>

        {!listo && (
          <p className="text-sm text-muted">
            Configurá el certificado, la clave y los puntos de venta arriba para empezar a emitir comprobantes.
          </p>
        )}

        {listo && (
          <div className="card overflow-hidden p-0">
            {facturas.length === 0 ? (
              <p className="text-sm text-muted p-4">Todavía no emitiste comprobantes.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[10px] uppercase tracking-widest text-muted border-b border-line">
                    <th className="p-3">Comprobante</th>
                    <th className="p-3">Cliente</th>
                    <th className="p-3">CAE</th>
                    <th className="p-3 text-right">Total</th>
                    <th className="p-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {facturas.map((f) => (
                    <tr key={f.id} className="border-b border-line/60 last:border-0">
                      <td className="p-3">
                        <div className="font-medium text-navy">{f.tipo_label}</div>
                        <div className="text-xs text-muted font-mono">{f.numero_formateado}</div>
                      </td>
                      <td className="p-3 text-navy">{f.cliente_nombre}</td>
                      <td className="p-3 font-mono text-xs">{f.cae ?? '—'}</td>
                      <td className="p-3 text-right font-medium">
                        ${f.importe_total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-3 text-right">
                        <button onClick={() => arcaService.descargarFacturaPdf(f.id)}
                          className="text-brand-blue hover:text-brand-deep" title="Descargar PDF">
                          <Download size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
