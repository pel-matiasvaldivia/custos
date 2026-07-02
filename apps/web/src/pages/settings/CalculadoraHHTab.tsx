import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, RotateCcw, Info, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

/**
 * Calculadora interna de costo y precio de la hora-hombre de seguridad.
 *
 * Herramienta de gestión (no comercial pública): con los valores de la paritaria
 * vigente del CCT 507/07 estima el costo laboral cargado, el costo de un puesto
 * 24/7 con el factor de dotación real (4,2) y la hora-hombre a facturar para un
 * margen objetivo. Es cálculo puro del lado del cliente; los valores ingresados
 * se guardan por tenant en localStorage para no recargarlos cada vez.
 */

interface Valores {
  basico: number;
  presentismo: number;
  viatico: number;
  otrosNoRem: number;
  cargasPct: number;
  horasMes: number;
  factorCobertura: number;
  horasPuesto: number;
  margenPct: number;
  tipoCambio: number; // 0 = sin conversión a USD
}

// Referencia CCT 507/07 (Vigilador General) — mediados 2026. Editable por el usuario.
const DEFAULTS: Valores = {
  basico: 911650,
  presentismo: 165000,
  viatico: 498000,
  otrosNoRem: 70000,
  cargasPct: 35,
  horasMes: 200,
  factorCobertura: 4.2,
  horasPuesto: 730,
  margenPct: 25,
  tipoCambio: 0,
};

const money = (n: number) =>
  '$' + Math.round(n).toLocaleString('es-AR');

const CAMPOS_PARITARIA: { key: keyof Valores; label: string; hint: string }[] = [
  { key: 'basico', label: 'Sueldo básico', hint: 'Remunerativo' },
  { key: 'presentismo', label: 'Presentismo', hint: 'Remunerativo' },
  { key: 'viatico', label: 'Viático', hint: 'No remunerativo' },
  { key: 'otrosNoRem', label: 'Otros adicionales', hint: 'No remunerativo' },
];

const CAMPOS_PARAMS: {
  key: keyof Valores;
  label: string;
  hint: string;
  step?: number;
  suffix?: string;
}[] = [
  { key: 'cargasPct', label: 'Cargas sociales y seguros', hint: 'Sobre base remunerativa', suffix: '%' },
  { key: 'horasMes', label: 'Horas mensuales del vigilador', hint: 'Divisor de convenio (≈200)', suffix: 'hs' },
  { key: 'factorCobertura', label: 'Factor de dotación (24/7)', hint: 'Vigiladores por puesto', step: 0.1 },
  { key: 'horasPuesto', label: 'Horas del puesto por mes', hint: '24×7 ≈ 730', suffix: 'hs' },
  { key: 'margenPct', label: 'Margen objetivo', hint: 'Sobre el precio de venta', suffix: '%' },
];

export const CalculadoraHHTab = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const storageKey = `custos:calc-hh:${user?.tenantId ?? 'default'}`;

  const [v, setV] = useState<Valores>(DEFAULTS);
  // Cargas sociales que aplica el cotizador (sobre el costo_hora base). Se lee
  // para "des-cargar" el costo antes de mandarlo y no duplicar cargas allá.
  const [cargasCotizador, setCargasCotizador] = useState<number | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setV({ ...DEFAULTS, ...JSON.parse(saved) });
    } catch {
      /* valores por defecto */
    }
  }, [storageKey]);

  useEffect(() => {
    api
      .get('/config/costos')
      .then((res) => setCargasCotizador(Number(res.data?.cargas_sociales)))
      .catch(() => setCargasCotizador(null));
  }, []);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(v));
  }, [storageKey, v]);

  const set = (key: keyof Valores, val: string) =>
    setV((prev) => ({ ...prev, [key]: val === '' ? 0 : Number(val) }));

  const r = useMemo(() => {
    const baseRem = v.basico + v.presentismo;
    const conformado = baseRem + v.viatico + v.otrosNoRem;
    const cargas = baseRem * (v.cargasPct / 100);
    const costoCargado = conformado + cargas;

    const horasMes = v.horasMes || 1;
    const costoHoraProductiva = costoCargado / horasMes;
    const valorHoraNormal = v.basico / horasMes;

    const costoPuestoMes = v.factorCobertura * costoCargado;
    const horasPuesto = v.horasPuesto || 1;
    const costoHoraPuesto = costoPuestoMes / horasPuesto;

    // Margen sobre el precio de venta (mismo criterio que el cotizador).
    const margenFrac = Math.min(Math.max(v.margenPct / 100, 0), 0.95);
    const hhFacturada = costoHoraPuesto / (1 - margenFrac);
    const facturacionPuestoMes = hhFacturada * horasPuesto;
    const margenPuestoMes = facturacionPuestoMes - costoPuestoMes;

    return {
      conformado,
      cargas,
      costoCargado,
      valorHoraNormal,
      costoHoraProductiva,
      costoPuestoMes,
      costoHoraPuesto,
      hhFacturada,
      facturacionPuestoMes,
      margenPuestoMes,
    };
  }, [v]);

  const usd = (n: number) =>
    v.tipoCambio > 0 ? ` · US$ ${Math.round(n / v.tipoCambio).toLocaleString('es-AR')}` : '';

  // Cierra el circuito: arranca una cotización con este puesto precargado. El
  // cotizador reaplica sus cargas sobre el costo_hora, así que le mandamos el
  // costo por hora-hombre "des-cargado" para que su precio reproduzca la HH de
  // acá exactamente. El margen usa el mismo criterio (sobre el precio).
  const aplicarAlCotizador = () => {
    const factorCargas = 1 + (cargasCotizador ?? v.cargasPct / 100);
    const costoHoraBase = r.costoHoraPuesto / factorCargas;
    navigate('/quotes/new', {
      state: {
        prefill: {
          puesto_nombre: 'Puesto 24/7 (calculadora HH)',
          tipo: 'HORAS_HOMBRE',
          horas_mensuales: v.horasPuesto,
          costo_hora: Math.round(costoHoraBase),
          margen: Math.min(Math.max(v.margenPct / 100, 0), 0.95),
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 p-4 rounded-lg border border-brand-blue/20 bg-brand-blue/5">
        <Info size={18} className="text-brand-blue shrink-0 mt-0.5" />
        <p className="text-sm text-muted">
          Herramienta interna de gestión. Cargá los valores de la paritaria vigente del
          CCT 507/07 y obtené el costo real de la hora-hombre y el precio a facturar para
          tu margen objetivo. Usa el mismo criterio de dotación 4,2 que el cotizador.
          Los valores quedan guardados en este equipo.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Inputs ── */}
        <div className="space-y-6">
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-navy flex items-center gap-2">
                <Calculator size={20} className="text-brand-blue" /> Valores de paritaria
              </h3>
              <button
                onClick={() => setV(DEFAULTS)}
                className="text-xs text-muted hover:text-brand-blue flex items-center gap-1 transition-colors"
                title="Restablecer a los valores de referencia"
              >
                <RotateCcw size={13} /> Restablecer
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {CAMPOS_PARITARIA.map((c) => (
                <Campo
                  key={c.key}
                  label={c.label}
                  hint={c.hint}
                  prefix="$"
                  value={v[c.key]}
                  onChange={(val) => set(c.key, val)}
                />
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold text-navy mb-4">Parámetros de cálculo</h3>
            <div className="grid grid-cols-2 gap-3">
              {CAMPOS_PARAMS.map((c) => (
                <Campo
                  key={c.key}
                  label={c.label}
                  hint={c.hint}
                  suffix={c.suffix}
                  step={c.step}
                  value={v[c.key]}
                  onChange={(val) => set(c.key, val)}
                />
              ))}
              <Campo
                label="Tipo de cambio"
                hint="Opcional, para ver en USD"
                prefix="$"
                value={v.tipoCambio}
                onChange={(val) => set('tipoCambio', val)}
              />
            </div>
          </div>
        </div>

        {/* ── Resultados ── */}
        <div className="space-y-4">
          <div className="card">
            <h3 className="text-lg font-bold text-navy mb-4">Costo del vigilador</h3>
            <Fila label="Total conformado / mes" valor={money(r.conformado)} sub={usd(r.conformado)} />
            <Fila label="Cargas sociales y seguros" valor={money(r.cargas)} sub={usd(r.cargas)} />
            <Fila label="Costo laboral cargado / mes" valor={money(r.costoCargado)} sub={usd(r.costoCargado)} destacado />
            <Fila label="Valor hora normal (convenio)" valor={money(r.valorHoraNormal)} />
            <Fila label="Costo por hora productiva" valor={money(r.costoHoraProductiva)} />
          </div>

          <div className="card bg-navy text-white border-navy">
            <h3 className="text-lg font-bold mb-1 text-white">Puesto 24/7</h3>
            <p className="text-xs text-white/50 mb-4">
              {v.factorCobertura} vigiladores · {v.horasPuesto} hs/mes
            </p>
            <FilaDark label="Costo del puesto / mes" valor={money(r.costoPuestoMes)} sub={usd(r.costoPuestoMes)} />
            <FilaDark label="Costo por hora-hombre" valor={money(r.costoHoraPuesto)} sub={usd(r.costoHoraPuesto)} />

            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-[11px] font-mono uppercase tracking-widest text-brand-blue mb-1">
                HH a facturar · margen {v.margenPct}%
              </p>
              <p className="text-4xl font-display font-black italic tracking-tighter text-white">
                {money(r.hhFacturada)}
                <span className="text-base font-mono not-italic text-white/40">/ hora{usd(r.hhFacturada)}</span>
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="bg-white/5 rounded-xl p-3">
                <p className="text-[10px] font-mono uppercase tracking-wider text-white/40">Facturación / mes</p>
                <p className="text-lg font-bold text-white">{money(r.facturacionPuestoMes)}</p>
              </div>
              <div className="bg-emerald/15 border border-emerald/25 rounded-xl p-3">
                <p className="text-[10px] font-mono uppercase tracking-wider text-emerald">Margen / mes</p>
                <p className="text-lg font-bold text-emerald">{money(r.margenPuestoMes)}</p>
              </div>
            </div>

            <button
              onClick={aplicarAlCotizador}
              className="w-full mt-4 py-3 rounded-xl bg-brand-blue hover:bg-brand-deep transition-colors flex items-center justify-center gap-2 text-sm font-bold text-white"
            >
              Aplicar al cotizador <ArrowRight size={16} />
            </button>
            <p className="text-[11px] text-white/40 text-center mt-2">
              Arranca una cotización con este puesto y esta HH ya cargados.
            </p>
          </div>

          <p className="text-xs text-muted px-1">
            Estimación de gestión. Los valores de convenio se mueven con cada paritaria;
            actualizá los montos cuando se homologue un nuevo acuerdo. No incluye adicionales
            por antigüedad, nocturnidad, arma ni zona.
          </p>
        </div>
      </div>
    </div>
  );
};

// ── Subcomponentes ──

function Campo({
  label,
  hint,
  value,
  onChange,
  prefix,
  suffix,
  step,
}: {
  label: string;
  hint?: string;
  value: number;
  onChange: (v: string) => void;
  prefix?: string;
  suffix?: string;
  step?: number;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-navy">{label}</span>
      {hint && <span className="block text-[10px] text-muted mb-1">{hint}</span>}
      <div className="flex items-center border border-line rounded-md bg-white focus-within:border-brand-blue transition-colors mt-0.5">
        {prefix && <span className="pl-2 text-muted text-sm">{prefix}</span>}
        <input
          type="number"
          inputMode="decimal"
          step={step ?? 1}
          value={value === 0 ? '' : value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-2 py-1.5 text-sm font-mono text-navy bg-transparent outline-none"
        />
        {suffix && <span className="pr-2 text-muted text-xs">{suffix}</span>}
      </div>
    </label>
  );
}

function Fila({
  label,
  valor,
  sub,
  destacado,
}: {
  label: string;
  valor: string;
  sub?: string;
  destacado?: boolean;
}) {
  return (
    <div
      className={`flex justify-between items-baseline py-2 border-b border-line last:border-0 ${
        destacado ? 'font-bold' : ''
      }`}
    >
      <span className={`text-sm ${destacado ? 'text-navy' : 'text-muted'}`}>{label}</span>
      <span className={`font-mono text-sm ${destacado ? 'text-brand-blue' : 'text-navy'}`}>
        {valor}
        {sub && <span className="text-[10px] text-muted">{sub}</span>}
      </span>
    </div>
  );
}

function FilaDark({ label, valor, sub }: { label: string; valor: string; sub?: string }) {
  return (
    <div className="flex justify-between items-baseline py-1.5">
      <span className="text-sm text-white/60">{label}</span>
      <span className="font-mono text-sm text-white">
        {valor}
        {sub && <span className="text-[10px] text-white/40">{sub}</span>}
      </span>
    </div>
  );
}
