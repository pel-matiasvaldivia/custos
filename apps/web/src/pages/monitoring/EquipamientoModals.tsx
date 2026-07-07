import { useEffect, useState } from 'react';
import {
  X, Wifi, CheckCircle2, AlertTriangle, Loader2, Server, Camera,
  Save, Radio, Link2,
} from 'lucide-react';
import {
  dispositivosService,
  Canal,
  ZonaConCanal,
} from '../../services/dispositivos.service';
import { objetivoService } from '../../services/objetivo.service';

const TIPOS = [
  { v: 'NVR', label: 'NVR', icon: Server },
  { v: 'DVR', label: 'DVR', icon: Server },
  { v: 'CAMARA_IP', label: 'Cámara IP', icon: Camera },
  { v: 'PANEL_ALARMA', label: 'Panel de alarma', icon: Radio },
];

interface NuevoProps {
  onClose: () => void;
  onCreado: () => void;
}

/** Wizard de alta de un dispositivo Hikvision (F1). */
export const NuevoDispositivoModal = ({ onClose, onCreado }: NuevoProps) => {
  const [paso, setPaso] = useState(1);
  const [objetivos, setObjetivos] = useState<{ id: string; nombre: string }[]>([]);
  const [objetivoId, setObjetivoId] = useState('');
  const [tipo, setTipo] = useState('NVR');

  const [ip, setIp] = useState('');
  const [puertoHttp, setPuertoHttp] = useState('80');
  const [puertoRtsp, setPuertoRtsp] = useState('554');
  const [usuario, setUsuario] = useState('admin');
  const [password, setPassword] = useState('');
  const [https, setHttps] = useState(false);

  const [probando, setProbando] = useState(false);
  const [prueba, setPrueba] = useState<null | {
    ok: boolean;
    model?: string;
    firmwareVersion?: string;
    error?: string;
  }>(null);

  const [creando, setCreando] = useState(false);
  const [dispositivoId, setDispositivoId] = useState<string | null>(null);
  const [ingestToken, setIngestToken] = useState<string | null>(null);
  const [canales, setCanales] = useState<Canal[]>([]);
  const [descubriendo, setDescubriendo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    objetivoService
      .getAll(1, 200)
      .then((os: { id: string; nombre: string }[]) =>
        setObjetivos(os.map((o) => ({ id: o.id, nombre: o.nombre }))),
      )
      .catch(() => {});
  }, []);

  const conexion = () => ({
    ip,
    puerto_http: Number(puertoHttp) || 80,
    puerto_rtsp: Number(puertoRtsp) || 554,
    usuario,
    password,
    https,
  });

  const probar = async () => {
    setProbando(true);
    setPrueba(null);
    try {
      const r = await dispositivosService.probar(conexion());
      setPrueba(r);
    } catch (e) {
      setPrueba({ ok: false, error: msgErr(e) || 'No se pudo conectar' });
    } finally {
      setProbando(false);
    }
  };

  const crear = async () => {
    setCreando(true);
    setError(null);
    try {
      const d = await dispositivosService.crear({
        ...conexion(),
        objetivo_id: objetivoId,
        tipo,
      });
      setDispositivoId(d.id);
      setIngestToken(d.ingest_token ?? null);
      setPaso(3);
    } catch (e) {
      setError(msgErr(e) || 'No se pudo crear el dispositivo');
    } finally {
      setCreando(false);
    }
  };

  const descubrir = async () => {
    if (!dispositivoId) return;
    setDescubriendo(true);
    try {
      setCanales(await dispositivosService.descubrirCanales(dispositivoId));
    } catch {
      /* el equipo puede no exponer canales (panel) */
    } finally {
      setDescubriendo(false);
    }
  };

  const finalizar = () => {
    onCreado();
    onClose();
  };

  const puedeConectar = ip && usuario && password;

  return (
    <Overlay onClose={onClose}>
      <Header titulo="Nuevo dispositivo" paso={paso} onClose={onClose} />

      <div className="p-6 space-y-5">
        {paso === 1 && (
          <>
            <Campo label="Objetivo">
              <select
                value={objetivoId}
                onChange={(e) => setObjetivoId(e.target.value)}
                className="w-full border border-line rounded-lg p-2.5 text-sm bg-white"
              >
                <option value="">Elegí un objetivo…</option>
                {objetivos.map((o) => (
                  <option key={o.id} value={o.id}>{o.nombre}</option>
                ))}
              </select>
            </Campo>
            <Campo label="Tipo de equipo">
              <div className="grid grid-cols-2 gap-2">
                {TIPOS.map((t) => (
                  <button
                    key={t.v}
                    onClick={() => setTipo(t.v)}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-bold transition-all ${
                      tipo === t.v
                        ? 'border-brand-blue bg-brand-blue/5 text-brand-blue'
                        : 'border-line text-muted hover:border-slate-300'
                    }`}
                  >
                    <t.icon size={16} /> {t.label}
                  </button>
                ))}
              </div>
            </Campo>
            <p className="text-xs text-muted flex items-center gap-1.5">
              <span className="font-bold text-navy">Marca:</span> Hikvision · Protocolo ISAPI
            </p>
            <BotonPrimario
              disabled={!objetivoId}
              onClick={() => setPaso(2)}
            >
              Continuar
            </BotonPrimario>
          </>
        )}

        {paso === 2 && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Campo label="Dirección IP">
                <input value={ip} onChange={(e) => setIp(e.target.value)}
                  placeholder="10.20.0.5" className="input-hik" />
              </Campo>
              <Campo label="Usuario">
                <input value={usuario} onChange={(e) => setUsuario(e.target.value)}
                  className="input-hik" />
              </Campo>
              <Campo label="Puerto HTTP (ISAPI)">
                <input value={puertoHttp} onChange={(e) => setPuertoHttp(e.target.value)}
                  inputMode="numeric" className="input-hik" />
              </Campo>
              <Campo label="Puerto RTSP">
                <input value={puertoRtsp} onChange={(e) => setPuertoRtsp(e.target.value)}
                  inputMode="numeric" className="input-hik" />
              </Campo>
              <Campo label="Contraseña">
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  className="input-hik" />
              </Campo>
              <Campo label="HTTPS">
                <button
                  onClick={() => setHttps((v) => !v)}
                  className={`w-full p-2.5 rounded-lg border text-sm font-bold ${
                    https ? 'border-brand-blue bg-brand-blue/5 text-brand-blue' : 'border-line text-muted'
                  }`}
                >
                  {https ? 'Activado' : 'Desactivado'}
                </button>
              </Campo>
            </div>

            <button
              onClick={probar}
              disabled={!puedeConectar || probando}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-brand-blue text-brand-blue font-bold text-sm disabled:opacity-40"
            >
              {probando ? <Loader2 size={16} className="animate-spin" /> : <Wifi size={16} />}
              Probar conexión
            </button>

            {prueba && (
              <div className={`rounded-xl p-3 text-sm flex items-start gap-2 ${
                prueba.ok ? 'bg-emerald/10 text-emerald' : 'bg-red-500/10 text-red-500'
              }`}>
                {prueba.ok ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
                <div>
                  {prueba.ok ? (
                    <>
                      <p className="font-bold">Conectado</p>
                      <p className="text-xs opacity-80">
                        {prueba.model || 'Equipo'} · firmware {prueba.firmwareVersion || 's/d'}
                      </p>
                    </>
                  ) : (
                    <p>{prueba.error || 'No se pudo conectar'}</p>
                  )}
                </div>
              </div>
            )}

            {error && <p className="text-xs text-red-500">{error}</p>}

            <div className="flex gap-2">
              <BotonSecundario onClick={() => setPaso(1)}>Atrás</BotonSecundario>
              <BotonPrimario
                disabled={!puedeConectar || creando}
                onClick={crear}
              >
                {creando ? 'Creando…' : 'Crear dispositivo'}
              </BotonPrimario>
            </div>
          </>
        )}

        {paso === 3 && (
          <>
            <p className="text-sm text-muted">
              Dispositivo creado. Descubrí sus canales de video para poder verificar en vivo.
            </p>
            <button
              onClick={descubrir}
              disabled={descubriendo}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-brand-blue text-white font-bold text-sm disabled:opacity-40"
            >
              {descubriendo ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
              Descubrir canales
            </button>

            {canales.length > 0 && (
              <div className="border border-line rounded-xl divide-y divide-line max-h-48 overflow-y-auto">
                {canales.map((c) => (
                  <div key={c.id} className="flex items-center justify-between px-3 py-2 text-sm">
                    <span className="font-mono text-navy">Canal {c.numero_canal}</span>
                    <span className="text-muted">{c.nombre || 'Sin nombre'}</span>
                    {c.tiene_ptz && (
                      <span className="text-[10px] font-black uppercase text-brand-blue">PTZ</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {ingestToken && (
              <div className="bg-canvas border border-line rounded-xl p-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-1">
                  URL de Alarm Server (configurar en el equipo)
                </p>
                <code className="text-[11px] break-all text-navy">
                  {`${window.location.origin}/api/v1/centro-operaciones/hik/eventos/${ingestToken}`}
                </code>
              </div>
            )}

            <BotonPrimario onClick={finalizar}>Finalizar</BotonPrimario>
          </>
        )}
      </div>
    </Overlay>
  );
};

interface CanalesProps {
  dispositivoId: string;
  dispositivoNombre: string;
  onClose: () => void;
}

/** Modal de canales + mapeo zona→canal (F4). */
export const DispositivoCanalesModal = ({
  dispositivoId,
  dispositivoNombre,
  onClose,
}: CanalesProps) => {
  const [canales, setCanales] = useState<Canal[]>([]);
  const [zonas, setZonas] = useState<ZonaConCanal[]>([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState<string | null>(null);

  const cargar = async () => {
    try {
      const [cs, zs] = await Promise.all([
        dispositivosService.getCanales(dispositivoId),
        dispositivosService.getZonas(dispositivoId),
      ]);
      setCanales(cs);
      setZonas(zs);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispositivoId]);

  const mapear = async (zonaId: string, canalId: string) => {
    setGuardando(zonaId);
    try {
      await dispositivosService.mapearZona(zonaId, canalId || null);
      await cargar();
    } finally {
      setGuardando(null);
    }
  };

  return (
    <Overlay onClose={onClose}>
      <div className="flex items-center justify-between p-5 border-b border-line">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-brand-blue">
            Canales y verificación
          </p>
          <h3 className="text-lg font-display font-bold text-navy">{dispositivoNombre}</h3>
        </div>
        <button onClick={onClose} className="text-muted hover:text-navy"><X size={20} /></button>
      </div>

      <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
        {cargando ? (
          <p className="text-sm text-muted text-center py-8">Cargando…</p>
        ) : (
          <>
            <section>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-2">
                Canales de video
              </p>
              {canales.length === 0 ? (
                <p className="text-xs text-muted">
                  Todavía no hay canales. Descubrilos desde el detalle del equipo.
                </p>
              ) : (
                <div className="border border-line rounded-xl divide-y divide-line">
                  {canales.map((c) => (
                    <div key={c.id} className="flex items-center gap-2 px-3 py-2 text-sm">
                      <Camera size={14} className="text-brand-blue" />
                      <span className="font-mono text-navy">Canal {c.numero_canal}</span>
                      <span className="text-muted flex-1">{c.nombre || 'Sin nombre'}</span>
                      {c.tiene_ptz && (
                        <span className="text-[10px] font-black uppercase text-brand-blue">PTZ</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-2 flex items-center gap-1.5">
                <Link2 size={13} /> Zonas → cámara que las verifica
              </p>
              {zonas.length === 0 ? (
                <p className="text-xs text-muted">
                  Este equipo no tiene zonas de alarma. El mapeo aplica a paneles.
                </p>
              ) : (
                <div className="space-y-2">
                  {zonas.map((z) => (
                    <div key={z.id} className="flex items-center gap-3">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-navy">
                          Zona {z.numero_zona} · {z.descripcion}
                        </p>
                        <p className="text-[10px] text-muted uppercase">{z.tipo}</p>
                      </div>
                      <select
                        value={z.canal_id ?? ''}
                        disabled={guardando === z.id}
                        onChange={(e) => mapear(z.id, e.target.value)}
                        className="border border-line rounded-lg p-2 text-sm bg-white w-48"
                      >
                        <option value="">Sin cámara</option>
                        {canales.map((c) => (
                          <option key={c.id} value={c.id}>
                            Canal {c.numero_canal}{c.nombre ? ` · ${c.nombre}` : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </Overlay>
  );
};

function msgErr(e: unknown): string {
  const resp = (e as { response?: { data?: { message?: string } } })?.response;
  return resp?.data?.message || (e instanceof Error ? e.message : '');
}

// --- helpers de UI ----------------------------------------------------------

function Overlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-[95] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <style>{`.input-hik{width:100%;border:1px solid var(--tw-line,#E2E8F2);border-radius:.5rem;padding:.5rem .625rem;font-size:.875rem}`}</style>
        {children}
      </div>
    </div>
  );
}

function Header({ titulo, paso, onClose }: { titulo: string; paso: number; onClose: () => void }) {
  return (
    <div className="flex items-center justify-between p-5 border-b border-line">
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-brand-blue">Paso {paso} de 3</p>
        <h3 className="text-lg font-display font-bold text-navy">{titulo}</h3>
      </div>
      <button onClick={onClose} className="text-muted hover:text-navy"><X size={20} /></button>
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

function BotonPrimario({ children, disabled, onClick }: { children: React.ReactNode; disabled?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-brand-blue text-white font-bold text-sm hover:bg-brand-deep transition-colors disabled:opacity-40"
    >
      <Save size={15} /> {children}
    </button>
  );
}

function BotonSecundario({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex-1 py-2.5 rounded-lg border border-line text-muted font-bold text-sm hover:border-slate-300"
    >
      {children}
    </button>
  );
}
