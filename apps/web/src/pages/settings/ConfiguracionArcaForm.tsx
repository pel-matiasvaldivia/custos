import { useEffect, useRef, useState } from 'react';
import {
  Landmark, Save, CheckCircle2, UploadCloud, ShieldCheck, AlertTriangle, Loader2,
} from 'lucide-react';
import { arcaService, ConfiguracionArca } from '../../services/arca.service';

const CONDICIONES = [
  { v: 'RESPONSABLE_INSCRIPTO', label: 'Responsable Inscripto' },
  { v: 'MONOTRIBUTO', label: 'Monotributo' },
  { v: 'EXENTO', label: 'Exento' },
];

/**
 * Configuración fiscal de la empresa para operar contra ARCA: entorno, CUIT,
 * condición de IVA, puntos de venta y los archivos de certificado (.crt) y clave
 * privada (.key). El certificado/clave nunca vuelven al frontend: solo se informa
 * si ya están cargados.
 */
export const ConfiguracionArcaForm = ({
  onCambio,
}: {
  onCambio?: (cfg: ConfiguracionArca) => void;
}) => {
  const [cfg, setCfg] = useState<ConfiguracionArca | null>(null);
  const [ambiente, setAmbiente] = useState('HOMOLOGACION');
  const [cuit, setCuit] = useState('');
  const [condicion, setCondicion] = useState('');
  const [puntos, setPuntos] = useState('');
  const [certificado, setCertificado] = useState<File | null>(null);
  const [clave, setClave] = useState<File | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [probando, setProbando] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const certInput = useRef<HTMLInputElement>(null);
  const claveInput = useRef<HTMLInputElement>(null);

  const cargar = async () => {
    try {
      const c = await arcaService.getConfig();
      setCfg(c);
      setAmbiente(c.ambiente);
      setCuit(c.cuit_emisor ?? '');
      setCondicion(c.condicion_iva ?? '');
      setPuntos((c.puntos_venta ?? []).join(', '));
    } catch {
      /* noop */
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const guardar = async () => {
    setGuardando(true);
    setMsg(null);
    setError(null);
    try {
      const actualizada = await arcaService.guardarConfig({
        ambiente,
        cuit_emisor: cuit.replace(/\D/g, ''),
        condicion_iva: condicion,
        puntos_venta: puntos,
        certificado,
        clave,
      });
      setCfg(actualizada);
      setCertificado(null);
      setClave(null);
      onCambio?.(actualizada);
      setMsg('Configuración de ARCA guardada.');
    } catch (e) {
      setError(msgErr(e) || 'No se pudo guardar la configuración.');
    } finally {
      setGuardando(false);
    }
  };

  const probar = async () => {
    setProbando(true);
    setMsg(null);
    setError(null);
    try {
      const r = await arcaService.probarConexion();
      const vto = new Date(r.ta_expira).toLocaleString('es-AR');
      setMsg(`Conexión con ARCA OK. Token válido hasta ${vto}.`);
    } catch (e) {
      setError(msgErr(e) || 'No se pudo conectar con ARCA.');
    } finally {
      setProbando(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-2">
        <Landmark className="text-brand-blue" size={20} />
        <h3 className="font-display font-bold text-navy text-lg">Integración con ARCA</h3>
        {cfg?.configurado && cfg.tiene_certificado && cfg.tiene_clave && (
          <span className="ml-2 text-[10px] font-black uppercase tracking-widest text-emerald flex items-center gap-1">
            <CheckCircle2 size={13} /> Configurado
          </span>
        )}
      </div>
      <p className="text-sm text-muted -mt-3">
        Cargá el certificado y la clave privada emitidos por ARCA para tu CUIT, y los
        puntos de venta habilitados. Con esto vas a poder emitir facturas electrónicas
        y obtener el CAE en tiempo real.
      </p>

      <div className="card space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Campo label="Entorno">
            <select value={ambiente} onChange={(e) => setAmbiente(e.target.value)} className="inp bg-white">
              <option value="HOMOLOGACION">Homologación (pruebas)</option>
              <option value="PRODUCCION">Producción</option>
            </select>
          </Campo>
          <Campo label="CUIT del emisor" requerido>
            <input value={cuit} onChange={(e) => setCuit(e.target.value)} className="inp font-mono" placeholder="30123456789" />
          </Campo>
          <Campo label="Condición frente al IVA" requerido>
            <select value={condicion} onChange={(e) => setCondicion(e.target.value)} className="inp bg-white">
              <option value="">Elegí…</option>
              {CONDICIONES.map((c) => <option key={c.v} value={c.v}>{c.label}</option>)}
            </select>
          </Campo>
          <Campo label="Puntos de venta (separados por coma)">
            <input value={puntos} onChange={(e) => setPuntos(e.target.value)} className="inp font-mono" placeholder="1, 2" />
          </Campo>
        </div>

        {ambiente === 'PRODUCCION' && (
          <div className="flex items-start gap-2 text-xs text-amber bg-amber/5 border border-amber/20 rounded-lg p-2.5">
            <AlertTriangle size={14} className="shrink-0 mt-0.5" />
            <span>En producción los comprobantes son fiscales y no se pueden anular desde acá. Probá primero en homologación.</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FileBox
            label="Certificado (.crt / .pem)"
            file={certificado}
            yaCargado={cfg?.tiene_certificado}
            inputRef={certInput}
            onPick={setCertificado}
            accept=".crt,.pem,.cer"
          />
          <FileBox
            label="Clave privada (.key / .pem)"
            file={clave}
            yaCargado={cfg?.tiene_clave}
            inputRef={claveInput}
            onPick={setClave}
            accept=".key,.pem"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button onClick={guardar} disabled={guardando}
            className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white text-sm font-medium rounded-lg hover:bg-brand-deep transition-colors disabled:opacity-50">
            <Save size={15} /> {guardando ? 'Guardando…' : 'Guardar configuración'}
          </button>
          <button onClick={probar} disabled={probando || !cfg?.configurado}
            className="flex items-center gap-2 px-4 py-2 border border-line text-navy text-sm font-medium rounded-lg hover:border-brand-blue transition-colors disabled:opacity-50">
            {probando ? <Loader2 size={15} className="animate-spin" /> : <ShieldCheck size={15} />}
            {probando ? 'Conectando…' : 'Probar conexión'}
          </button>
        </div>
      </div>

      {msg && <p className="text-sm text-emerald flex items-center gap-1"><CheckCircle2 size={14} /> {msg}</p>}
      {error && <p className="text-sm text-amber flex items-center gap-1"><AlertTriangle size={14} /> {error}</p>}

      <style>{`.inp{width:100%;border:1px solid #E2E8F2;border-radius:.5rem;padding:.5rem .625rem;font-size:.875rem}`}</style>
    </div>
  );
};

function FileBox({
  label, file, yaCargado, inputRef, onPick, accept,
}: {
  label: string;
  file: File | null;
  yaCargado?: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  onPick: (f: File | null) => void;
  accept: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-black uppercase tracking-widest text-muted block">{label}</label>
      <input ref={inputRef} type="file" accept={accept} className="hidden"
        onChange={(e) => onPick(e.target.files?.[0] ?? null)} />
      <button onClick={() => inputRef.current?.click()}
        className="w-full flex items-center justify-center gap-2 py-2 border border-line rounded-lg text-sm font-medium text-navy hover:border-brand-blue">
        <UploadCloud size={15} />
        {file ? file.name : yaCargado ? 'Reemplazar (ya cargado)' : 'Elegir archivo'}
      </button>
      {yaCargado && !file && (
        <p className="text-[11px] text-emerald flex items-center gap-1"><CheckCircle2 size={11} /> Cargado</p>
      )}
    </div>
  );
}

function Campo({ label, requerido, children }: { label: string; requerido?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[10px] font-black uppercase tracking-widest text-muted mb-1 block">
        {label}{requerido && <span className="text-amber ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

function msgErr(e: unknown): string {
  const resp = (e as { response?: { data?: { message?: string } } })?.response;
  return resp?.data?.message || (e instanceof Error ? e.message : '');
}
