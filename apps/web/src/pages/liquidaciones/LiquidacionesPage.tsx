import { useState } from 'react';
import { Calculator, Search, Clock, AlertTriangle, Info } from 'lucide-react';
import { liquidacionService, LiquidacionItem } from '../../services/liquidacion.service';

type Modo = 'VALOR_HORA_MANUAL' | 'BASICO_507' | 'SOLO_HORAS';

const hoy = new Date();
const primerDia = new Date(hoy.getFullYear(), hoy.getMonth(), 1).toISOString().slice(0, 10);
const ultimoDia = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).toISOString().slice(0, 10);

const money = (n: number) => '$' + n.toLocaleString('es-AR', { maximumFractionDigits: 0 });
const hh = (n: number) => n.toLocaleString('es-AR', { maximumFractionDigits: 1 }) + ' h';

export const LiquidacionesPage = () => {
  const [desde, setDesde] = useState(primerDia);
  const [hasta, setHasta] = useState(ultimoDia);
  const [modo, setModo] = useState<Modo>('VALOR_HORA_MANUAL');
  const [valorHora, setValorHora] = useState(2500);
  const [recargoNoct, setRecargoNoct] = useState(20);
  const [recargoExtra, setRecargoExtra] = useState(50);
  const [items, setItems] = useState<LiquidacionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [buscado, setBuscado] = useState(false);

  const conMontos = modo !== 'SOLO_HORAS';

  const calcular = async () => {
    setLoading(true);
    try {
      const data = await liquidacionService.computar(desde, hasta);
      setItems(data);
      setBuscado(true);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const bruto = (i: LiquidacionItem) =>
    valorHora * i.hh_trabajadas +
    valorHora * (recargoNoct / 100) * i.hh_nocturnas +
    valorHora * (recargoExtra / 100) * i.hh_extra;
  const descSuspension = (i: LiquidacionItem) => valorHora * i.suspension_dias * 8;
  const neto = (i: LiquidacionItem) => Math.max(0, bruto(i) - descSuspension(i) - i.adelanto_monto);

  const totalNeto = items.reduce((s, i) => s + neto(i), 0);
  const totalHoras = items.reduce((s, i) => s + i.hh_trabajadas, 0);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-display font-bold text-navy flex items-center gap-2">
            <Calculator className="text-brand-blue" size={28} /> Liquidaciones
          </h2>
          <p className="text-muted text-lg">Horas exactas por vigilador según la asistencia real del período.</p>
        </div>
      </div>

      {/* Controles */}
      <div className="card space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="label text-xs uppercase font-black">Desde</label>
            <input type="date" className="input" value={desde} onChange={(e) => setDesde(e.target.value)} />
          </div>
          <div>
            <label className="label text-xs uppercase font-black">Hasta</label>
            <input type="date" className="input" value={hasta} onChange={(e) => setHasta(e.target.value)} />
          </div>
          <div>
            <label className="label text-xs uppercase font-black">Modo de cálculo</label>
            <select className="input" value={modo} onChange={(e) => setModo(e.target.value as Modo)}>
              <option value="VALOR_HORA_MANUAL">Valor hora manual + recargos</option>
              <option value="BASICO_507">Básico Convenio 507</option>
              <option value="SOLO_HORAS">Sólo cómputo de horas</option>
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={calcular} disabled={loading} className="btn btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
              <Search size={16} /> {loading ? 'Calculando...' : 'Calcular'}
            </button>
          </div>
        </div>

        {conMontos && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-line">
            <div>
              <label className="label text-xs uppercase font-black">Valor hora {modo === 'BASICO_507' && '(estimado)'}</label>
              <input type="number" className="input" value={valorHora} onChange={(e) => setValorHora(Number(e.target.value))} />
            </div>
            <div>
              <label className="label text-xs uppercase font-black">Recargo nocturno %</label>
              <input type="number" className="input" value={recargoNoct} onChange={(e) => setRecargoNoct(Number(e.target.value))} />
            </div>
            <div>
              <label className="label text-xs uppercase font-black">Recargo horas extra %</label>
              <input type="number" className="input" value={recargoExtra} onChange={(e) => setRecargoExtra(Number(e.target.value))} />
            </div>
          </div>
        )}

        {modo === 'BASICO_507' && (
          <p className="flex items-center gap-2 text-xs text-muted">
            <Info size={13} className="text-brand-blue" /> La escala salarial del Convenio 507 se cargará por categoría en una próxima versión; por ahora usá el valor hora estimado.
          </p>
        )}
      </div>

      {/* Resumen */}
      {buscado && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="card">
            <p className="text-xs uppercase tracking-wider text-muted font-bold">Vigiladores</p>
            <p className="text-3xl font-black text-navy">{items.length}</p>
          </div>
          <div className="card">
            <p className="text-xs uppercase tracking-wider text-muted font-bold">Horas trabajadas</p>
            <p className="text-3xl font-black text-navy">{hh(totalHoras)}</p>
          </div>
          {conMontos && (
            <div className="card border-emerald/20 bg-emerald/5">
              <p className="text-xs uppercase tracking-wider text-emerald font-bold">Total neto a pagar</p>
              <p className="text-3xl font-black text-emerald">{money(totalNeto)}</p>
            </div>
          )}
        </div>
      )}

      {/* Tabla */}
      <div className="card p-0 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-canvas border-b border-line">
            <tr>
              <th className="px-4 py-3 text-xs font-bold text-muted uppercase tracking-wider">Vigilador</th>
              <th className="px-4 py-3 text-xs font-bold text-muted uppercase tracking-wider text-right">Trab.</th>
              <th className="px-4 py-3 text-xs font-bold text-muted uppercase tracking-wider text-right">Noct.</th>
              <th className="px-4 py-3 text-xs font-bold text-muted uppercase tracking-wider text-right">Extra</th>
              <th className="px-4 py-3 text-xs font-bold text-muted uppercase tracking-wider text-right">Ausente</th>
              <th className="px-4 py-3 text-xs font-bold text-muted uppercase tracking-wider text-right">Tarde</th>
              <th className="px-4 py-3 text-xs font-bold text-muted uppercase tracking-wider text-right">Susp.</th>
              {conMontos && <th className="px-4 py-3 text-xs font-bold text-muted uppercase tracking-wider text-right">Adelanto</th>}
              {conMontos && <th className="px-4 py-3 text-xs font-bold text-muted uppercase tracking-wider text-right">Neto</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {!buscado ? (
              <tr><td colSpan={conMontos ? 9 : 7} className="px-4 py-10 text-center text-muted italic">Elegí un período y presioná Calcular.</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={conMontos ? 9 : 7} className="px-4 py-10 text-center text-muted italic">Sin datos de asistencia en el período.</td></tr>
            ) : items.map((i) => (
              <tr key={i.vigilador_id} className="hover:bg-canvas/50">
                <td className="px-4 py-3">
                  <span className="font-bold text-navy block">{i.apellido}, {i.nombre}</span>
                  <span className="text-xs text-muted font-mono">Legajo {i.legajo} · {i.turnos} turnos</span>
                </td>
                <td className="px-4 py-3 text-right font-mono font-bold text-navy">{hh(i.hh_trabajadas)}</td>
                <td className="px-4 py-3 text-right font-mono text-muted">{hh(i.hh_nocturnas)}</td>
                <td className="px-4 py-3 text-right font-mono text-brand-blue">{hh(i.hh_extra)}</td>
                <td className="px-4 py-3 text-right font-mono text-muted">{i.hh_ausentes > 0 ? hh(i.hh_ausentes) : '—'}</td>
                <td className="px-4 py-3 text-right font-mono">
                  {i.llegadas_tarde > 0 ? (
                    <span className="text-amber flex items-center justify-end gap-1"><Clock size={12} /> {i.llegadas_tarde} ({i.llegadas_tarde_min}′)</span>
                  ) : <span className="text-muted">—</span>}
                </td>
                <td className="px-4 py-3 text-right font-mono">
                  {i.suspension_dias > 0 ? <span className="text-red-500">{i.suspension_dias}d</span> : <span className="text-muted">—</span>}
                </td>
                {conMontos && (
                  <td className="px-4 py-3 text-right font-mono text-red-500">{i.adelanto_monto > 0 ? '-' + money(i.adelanto_monto) : '—'}</td>
                )}
                {conMontos && (
                  <td className="px-4 py-3 text-right font-mono font-black text-emerald">{money(neto(i))}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="flex items-center gap-2 text-xs text-muted">
        <AlertTriangle size={13} className="text-amber" />
        El cómputo de horas surge de la asistencia real (check-in/out) y las novedades del período. Verificá los datos antes de generar los pagos.
      </p>
    </div>
  );
};

export default LiquidacionesPage;
