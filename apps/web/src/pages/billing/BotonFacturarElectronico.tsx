import { useEffect, useMemo, useState } from 'react';
import {
  Receipt, X, Plus, Trash2, Loader2, CheckCircle2, AlertTriangle, Download,
} from 'lucide-react';
import {
  arcaService, FacturarInput, ItemFactura, ResultadoFactura,
} from '../../services/arca.service';

const TIPOS = [
  { v: 1, label: 'Factura A' },
  { v: 6, label: 'Factura B' },
  { v: 11, label: 'Factura C' },
  { v: 3, label: 'Nota de Crédito A' },
  { v: 8, label: 'Nota de Crédito B' },
  { v: 13, label: 'Nota de Crédito C' },
];

const DOC_TIPOS = [
  { v: 80, label: 'CUIT' },
  { v: 96, label: 'DNI' },
  { v: 99, label: 'Consumidor Final' },
];

const FASES = ['Conectando con ARCA…', 'Solicitando CAE…', 'Registrando comprobante…'];

interface Props {
  puntosVenta: number[];
  prefill?: Partial<FacturarInput>;
  label?: string;
  onEmitida?: (r: ResultadoFactura) => void;
}

/**
 * Botón + modal para emitir un comprobante electrónico. Muestra el estado del
 * pedido a ARCA (conexión, CAE) y, al aprobarse, el número legal, el CAE y la
 * descarga del PDF. Reutilizable desde un contrato, una lista de clientes, etc.
 */
export const BotonFacturarElectronico = ({ puntosVenta, prefill, label, onEmitida }: Props) => {
  const [abierto, setAbierto] = useState(false);
  return (
    <>
      <button onClick={() => setAbierto(true)}
        className="flex items-center gap-2 px-4 py-2 bg-emerald text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity">
        <Receipt size={15} /> {label ?? 'Facturar electrónicamente'}
      </button>
      {abierto && (
        <ModalFacturar
          puntosVenta={puntosVenta}
          prefill={prefill}
          onEmitida={onEmitida}
          onClose={() => setAbierto(false)}
        />
      )}
    </>
  );
};

function ModalFacturar({ puntosVenta, prefill, onEmitida, onClose }: Props & { onClose: () => void }) {
  const [tipo, setTipo] = useState(prefill?.tipo_comprobante ?? 6);
  const [pv, setPv] = useState(prefill?.punto_venta ?? puntosVenta[0] ?? 1);
  const [docTipo, setDocTipo] = useState(prefill?.doc_tipo ?? 80);
  const [docNro, setDocNro] = useState(prefill?.doc_nro ?? '');
  const [clienteNombre, setClienteNombre] = useState(prefill?.cliente_nombre ?? '');
  const [items, setItems] = useState<ItemFactura[]>(
    prefill?.items?.length
      ? prefill.items
      : [{ descripcion: 'Servicio de vigilancia física', cantidad: 1, precio_unitario: 0 }],
  );
  const [fase, setFase] = useState(0);
  const [emitiendo, setEmitiendo] = useState(false);
  const [resultado, setResultado] = useState<ResultadoFactura | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rechazo, setRechazo] = useState<{ code: number; msg: string }[] | null>(null);

  // Anima las fases del pedido mientras se espera la respuesta de ARCA.
  useEffect(() => {
    if (!emitiendo) return;
    const id = setInterval(() => setFase((f) => Math.min(f + 1, FASES.length - 1)), 1200);
    return () => clearInterval(id);
  }, [emitiendo]);

  const neto = useMemo(
    () => items.reduce((acc, i) => acc + i.cantidad * i.precio_unitario, 0),
    [items],
  );
  const discriminaIva = tipo !== 11 && tipo !== 13;
  const iva = discriminaIva ? neto * 0.21 : 0;
  const total = neto + iva;

  const setItem = (i: number, campo: keyof ItemFactura, valor: string) => {
    setItems((arr) =>
      arr.map((it, idx) =>
        idx === i
          ? { ...it, [campo]: campo === 'descripcion' ? valor : Number(valor) || 0 }
          : it,
      ),
    );
  };

  const emitir = async () => {
    setError(null);
    setRechazo(null);
    if (!clienteNombre.trim()) return setError('Ingresá el nombre/razón social del cliente.');
    if (docTipo !== 99 && !docNro.trim()) return setError('Ingresá el documento del cliente.');
    if (total <= 0) return setError('El total debe ser mayor a cero.');

    setEmitiendo(true);
    setFase(0);
    try {
      const input: FacturarInput = {
        cliente_id: prefill?.cliente_id,
        cliente_nombre: clienteNombre.trim(),
        tipo_comprobante: tipo,
        punto_venta: pv,
        doc_tipo: docTipo,
        doc_nro: docNro.replace(/\D/g, '') || '0',
        concepto: 2,
        items,
      };
      const r = await arcaService.facturar(input);
      setResultado(r);
      onEmitida?.(r);
    } catch (e) {
      type RespuestaError = {
        message?: string;
        rechazo?: boolean;
        errores?: { code: number; msg: string }[];
        observaciones?: { code: number; msg: string }[];
      };
      const data = (e as { response?: { data?: RespuestaError } })?.response?.data;
      if (data?.rechazo) {
        setRechazo([...(data.errores ?? []), ...(data.observaciones ?? [])]);
      } else {
        setError(data?.message || (e instanceof Error ? e.message : 'No se pudo emitir el comprobante.'));
      }
    } finally {
      setEmitiendo(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-navy/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-line">
          <h3 className="font-display font-bold text-navy flex items-center gap-2">
            <Receipt size={18} className="text-emerald" /> Facturación electrónica
          </h3>
          <button onClick={onClose} className="text-muted hover:text-navy"><X size={18} /></button>
        </div>

        <div className="p-5 space-y-4">
          {resultado ? (
            <Exito resultado={resultado} onClose={onClose} />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Campo label="Comprobante">
                  <select value={tipo} onChange={(e) => setTipo(Number(e.target.value))} className="inp bg-white">
                    {TIPOS.map((t) => <option key={t.v} value={t.v}>{t.label}</option>)}
                  </select>
                </Campo>
                <Campo label="Punto de venta">
                  {puntosVenta.length ? (
                    <select value={pv} onChange={(e) => setPv(Number(e.target.value))} className="inp bg-white">
                      {puntosVenta.map((p) => <option key={p} value={p}>{String(p).padStart(4, '0')}</option>)}
                    </select>
                  ) : (
                    <input type="number" value={pv} onChange={(e) => setPv(Number(e.target.value))} className="inp" />
                  )}
                </Campo>
              </div>

              <Campo label="Cliente (razón social)">
                <input value={clienteNombre} onChange={(e) => setClienteNombre(e.target.value)} className="inp" placeholder="Cliente S.A." />
              </Campo>

              <div className="grid grid-cols-2 gap-3">
                <Campo label="Tipo de doc.">
                  <select value={docTipo} onChange={(e) => setDocTipo(Number(e.target.value))} className="inp bg-white">
                    {DOC_TIPOS.map((d) => <option key={d.v} value={d.v}>{d.label}</option>)}
                  </select>
                </Campo>
                <Campo label="Nº de documento">
                  <input value={docNro} onChange={(e) => setDocNro(e.target.value)} className="inp font-mono"
                    disabled={docTipo === 99} placeholder={docTipo === 99 ? '—' : '30123456789'} />
                </Campo>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted block">Ítems</label>
                {items.map((it, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input value={it.descripcion} onChange={(e) => setItem(i, 'descripcion', e.target.value)}
                      className="inp flex-1" placeholder="Descripción" />
                    <input type="number" value={it.cantidad || ''} onChange={(e) => setItem(i, 'cantidad', e.target.value)}
                      className="inp w-16" placeholder="Cant." />
                    <input type="number" value={it.precio_unitario || ''} onChange={(e) => setItem(i, 'precio_unitario', e.target.value)}
                      className="inp w-28" placeholder="P. unit." />
                    {items.length > 1 && (
                      <button onClick={() => setItems((a) => a.filter((_, idx) => idx !== i))} className="text-muted hover:text-amber">
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                ))}
                <button onClick={() => setItems((a) => [...a, { descripcion: '', cantidad: 1, precio_unitario: 0 }])}
                  className="text-xs text-brand-blue flex items-center gap-1 hover:underline">
                  <Plus size={13} /> Agregar ítem
                </button>
              </div>

              <div className="bg-canvas rounded-lg p-3 text-sm space-y-1">
                <div className="flex justify-between text-muted"><span>Neto</span><span>{money(neto)}</span></div>
                {discriminaIva && <div className="flex justify-between text-muted"><span>IVA 21%</span><span>{money(iva)}</span></div>}
                <div className="flex justify-between font-bold text-navy"><span>Total</span><span>{money(total)}</span></div>
              </div>

              {emitiendo && (
                <div className="flex items-center gap-2 text-sm text-brand-blue">
                  <Loader2 size={15} className="animate-spin" /> {FASES[fase]}
                </div>
              )}
              {rechazo && (
                <div className="text-sm text-amber bg-amber/5 border border-amber/20 rounded-lg p-3 space-y-1">
                  <p className="font-bold flex items-center gap-1"><AlertTriangle size={14} /> ARCA rechazó el comprobante:</p>
                  {rechazo.map((o, i) => <p key={i} className="text-xs">[{o.code}] {o.msg}</p>)}
                </div>
              )}
              {error && <p className="text-sm text-amber flex items-center gap-1"><AlertTriangle size={14} /> {error}</p>}

              <button onClick={emitir} disabled={emitiendo}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald text-white font-medium rounded-lg hover:opacity-90 disabled:opacity-50">
                {emitiendo ? <Loader2 size={16} className="animate-spin" /> : <Receipt size={16} />}
                {emitiendo ? 'Emitiendo…' : 'Emitir y obtener CAE'}
              </button>
            </>
          )}
        </div>
        <style>{`.inp{width:100%;border:1px solid #E2E8F2;border-radius:.5rem;padding:.5rem .625rem;font-size:.875rem}`}</style>
      </div>
    </div>
  );
}

function Exito({ resultado, onClose }: { resultado: ResultadoFactura; onClose: () => void }) {
  const [descargando, setDescargando] = useState(false);
  const descargar = async () => {
    setDescargando(true);
    try {
      await arcaService.descargarFacturaPdf(resultado.id);
    } finally {
      setDescargando(false);
    }
  };
  return (
    <div className="text-center space-y-3 py-2">
      <div className="w-14 h-14 rounded-full bg-emerald/10 flex items-center justify-center mx-auto">
        <CheckCircle2 size={30} className="text-emerald" />
      </div>
      <div>
        <p className="font-display font-bold text-navy text-lg">{resultado.tipo_label} emitida</p>
        <p className="text-sm text-muted">Nº {resultado.numero_formateado}</p>
      </div>
      <div className="bg-canvas rounded-lg p-3 text-sm text-left space-y-1">
        <div className="flex justify-between"><span className="text-muted">CAE</span><span className="font-mono">{resultado.cae}</span></div>
        <div className="flex justify-between"><span className="text-muted">Vto. CAE</span><span>{resultado.cae_vencimiento ? new Date(resultado.cae_vencimiento).toLocaleDateString('es-AR') : '—'}</span></div>
        <div className="flex justify-between font-bold"><span>Total</span><span>{money(resultado.importe_total)}</span></div>
      </div>
      <div className="flex gap-2">
        <button onClick={descargar} disabled={descargando}
          className="flex-1 flex items-center justify-center gap-2 py-2 bg-brand-blue text-white text-sm font-medium rounded-lg hover:bg-brand-deep disabled:opacity-50">
          {descargando ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />} Descargar PDF
        </button>
        <button onClick={onClose} className="flex-1 py-2 border border-line text-navy text-sm font-medium rounded-lg hover:border-brand-blue">
          Cerrar
        </button>
      </div>
    </div>
  );
}

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[10px] font-black uppercase tracking-widest text-muted mb-1 block">{label}</label>
      {children}
    </div>
  );
}

function money(n: number): string {
  return `$${n.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;
}
