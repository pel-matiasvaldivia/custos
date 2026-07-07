import { useEffect, useState } from 'react';
import {
  X, Phone, Video, Radio, Truck, Shield, Ambulance, Flame, UserCog,
  CheckCircle2, Circle, Clock, AlertTriangle, Building2, ChevronRight,
} from 'lucide-react';
import {
  centroOperacionesService,
  IncidenteDetalle,
  BitacoraEntrada,
} from '../../services/centroOperaciones.service';
import { VideoPlayer } from './VideoPlayer';

interface Props {
  incidenteId: string;
  onClose: () => void;
  onCambio: () => void; // refrescar la lista al cambiar de estado
}

// Orden del protocolo. Cada estado habilita la acción siguiente.
const PASOS = ['NUEVO', 'EN_ATENCION', 'VERIFICANDO', 'DESPACHADO', 'RESUELTO'];
const PASO_LABEL: Record<string, string> = {
  NUEVO: 'Ingresado', EN_ATENCION: 'Tomado', VERIFICANDO: 'Verificado',
  DESPACHADO: 'Despachado', RESUELTO: 'Resuelto',
};

const METODOS_VERIF = [
  { v: 'LLAMADA_GUARDIA', label: 'Llamé al guardia', icon: Phone },
  { v: 'CAMARA', label: 'Verifiqué cámara', icon: Video },
  { v: 'LLAMADA_CLIENTE', label: 'Llamé al cliente', icon: Phone },
  { v: 'AUDIO', label: 'Escuché audio', icon: Radio },
];
const DESTINOS = [
  { v: 'POLICIA', label: 'Policía (911)', icon: Shield },
  { v: 'MOVIL_PROPIO', label: 'Móvil propio', icon: Truck },
  { v: 'SUPERVISOR', label: 'Supervisor', icon: UserCog },
  { v: 'EMERGENCIAS_MEDICAS', label: 'Emergencias médicas', icon: Ambulance },
  { v: 'BOMBEROS', label: 'Bomberos', icon: Flame },
];
const DISPOSICIONES = [
  { v: 'REAL', label: 'Evento real', desc: 'Se confirmó una situación real' },
  { v: 'FALSA', label: 'Falsa alarma', desc: 'Sin situación / disparo accidental' },
  { v: 'TECNICA', label: 'Falla técnica', desc: 'Problema del equipo/sensor' },
  { v: 'PRUEBA', label: 'Prueba', desc: 'Test del sistema o simulacro' },
  { v: 'SIN_NOVEDAD', label: 'Sin novedad', desc: 'Verificado, todo en orden' },
];

// Guía por prioridad, para que el monitorista sepa qué hacer.
const GUIA: Record<string, string[]> = {
  CRITICA: [
    'Tomá el evento de inmediato (es prioridad máxima).',
    'Verificá: llamá al guardia del objetivo y confirmá su estado.',
    'Si no responde o confirma la emergencia, despachá policía y móvil propio.',
    'Avisá al supervisor de turno.',
    'Cerrá con la disposición real cuando la situación esté controlada.',
  ],
  ALTA: [
    'Tomá el evento.',
    'Verificá por cámara o llamando al guardia/cliente.',
    'Despachá el recurso que corresponda si se confirma.',
    'Cerrá con la disposición correspondiente.',
  ],
};

const hora = (iso: string) =>
  new Date(iso).toLocaleString('es-AR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

const ACCION_LABEL: Record<string, string> = {
  TOMAR: 'Tomó el incidente', VERIFICACION: 'Verificación', DESPACHO: 'Despacho',
  NOTA: 'Nota', CIERRE: 'Cierre',
};

export const ProtocoloIncidenteModal = ({ incidenteId, onClose, onCambio }: Props) => {
  const [inc, setInc] = useState<IncidenteDetalle | null>(null);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [nota, setNota] = useState('');
  const [metodo, setMetodo] = useState('');
  const [destino, setDestino] = useState('');
  const [disposicion, setDisposicion] = useState('');
  const [resumen, setResumen] = useState('');
  const [verVideo, setVerVideo] = useState(false);

  const cargar = async () => {
    try {
      setInc(await centroOperacionesService.obtenerIncidente(incidenteId));
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incidenteId]);

  const hacer = async (fn: () => Promise<unknown>) => {
    setProcesando(true);
    try {
      await fn();
      await cargar();
      onCambio();
    } finally {
      setProcesando(false);
    }
  };

  if (cargando || !inc) {
    return (
      <Overlay onClose={onClose}>
        <p className="text-white/50 text-sm p-8 text-center">Cargando incidente…</p>
      </Overlay>
    );
  }

  const idx = PASOS.indexOf(inc.estado);
  const critica = inc.severidad === 'CRITICA';
  const guia = GUIA[inc.severidad] ?? GUIA.ALTA;

  return (
    <Overlay onClose={onClose}>
      <div className="flex items-center justify-between p-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${critica ? 'bg-red-500 animate-pulse' : 'bg-amber'}`}>
            <AlertTriangle size={22} className={critica ? 'text-white' : 'text-slate-900'} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${critica ? 'bg-red-500 text-white' : 'bg-amber/20 text-amber'}`}>{inc.severidad}</span>
              <span className="font-mono text-xs text-white/40">#{inc.codigo}</span>
            </div>
            <h3 className="text-lg font-black italic uppercase tracking-tighter text-white">{inc.tipo}</h3>
          </div>
        </div>
        <button onClick={onClose} className="text-white/40 hover:text-white"><X size={22} /></button>
      </div>

      <div className="p-5 overflow-y-auto space-y-5" style={{ maxHeight: '70vh' }}>
        <div className="flex items-center gap-4 text-xs text-white/50">
          <span className="flex items-center gap-1.5"><Building2 size={13} /> {inc.objetivo?.nombre ?? 'S/D'}</span>
          <span className="flex items-center gap-1.5"><Clock size={13} /> {hora(inc.abierto_el)}</span>
        </div>

        {/* Stepper del protocolo */}
        <div className="flex items-center gap-1">
          {PASOS.map((p, i) => (
            <div key={p} className="flex-1 flex flex-col items-center">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                i < idx ? 'bg-emerald text-slate-950' : i === idx ? 'bg-brand-blue text-white ring-4 ring-brand-blue/20' : 'bg-white/10 text-white/30'
              }`}>
                {i < idx ? <CheckCircle2 size={16} /> : <Circle size={14} />}
              </div>
              <span className={`text-[8px] font-black uppercase tracking-wide mt-1 ${i <= idx ? 'text-white/70' : 'text-white/25'}`}>{PASO_LABEL[p]}</span>
            </div>
          ))}
        </div>

        {/* Video verificación: la cámara que disparó el evento, según la config */}
        {inc.estado !== 'RESUELTO' && (
          <div>
            {verVideo ? (
              <div className="space-y-2">
                <VideoPlayer incidentId={inc.id} title={`Cámara · ${inc.tipo}`} />
                <button
                  onClick={() => setVerVideo(false)}
                  className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white"
                >
                  Ocultar cámara
                </button>
              </div>
            ) : (
              <button
                onClick={() => setVerVideo(true)}
                className="w-full py-3 rounded-2xl bg-white/5 border border-white/10 text-white/80 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/10"
              >
                <Video size={15} /> Ver cámara que disparó
              </button>
            )}
          </div>
        )}

        {inc.estado !== 'RESUELTO' && (
          <div className="bg-brand-blue/10 border border-brand-blue/20 rounded-2xl p-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-brand-blue mb-2">Protocolo · prioridad {inc.severidad}</p>
            <ol className="space-y-1.5">
              {guia.map((g, i) => (
                <li key={i} className="flex gap-2 text-xs text-white/70">
                  <span className="text-brand-blue font-black">{i + 1}.</span> {g}
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Acción del paso actual */}
        {inc.estado === 'NUEVO' && (
          <StepBox titulo="Paso 1 · Tomar el incidente">
            <button
              onClick={() => hacer(() => centroOperacionesService.tomar(inc.id))}
              disabled={procesando}
              className="w-full py-3 rounded-xl bg-brand-blue text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50"
            >
              Tomar y atender <ChevronRight size={15} />
            </button>
          </StepBox>
        )}

        {inc.estado === 'EN_ATENCION' && (
          <StepBox titulo="Paso 2 · Verificar">
            <div className="grid grid-cols-2 gap-2 mb-3">
              {METODOS_VERIF.map((m) => (
                <button key={m.v} onClick={() => setMetodo(m.v)}
                  className={`py-2.5 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 border transition-all ${metodo === m.v ? 'bg-brand-blue border-brand-blue text-white' : 'bg-white/5 border-white/10 text-white/60'}`}>
                  <m.icon size={14} /> {m.label}
                </button>
              ))}
            </div>
            <textarea value={nota} onChange={(e) => setNota(e.target.value)} rows={2} placeholder="Qué observaste (opcional)"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-white/30 mb-3 outline-none" />
            <button
              onClick={() => hacer(async () => { await centroOperacionesService.verificar(inc.id, metodo, nota); setNota(''); setMetodo(''); })}
              disabled={procesando || !metodo}
              className="w-full py-3 rounded-xl bg-brand-blue text-white font-black text-xs uppercase tracking-widest disabled:opacity-40"
            >
              Registrar verificación
            </button>
          </StepBox>
        )}

        {inc.estado === 'VERIFICANDO' && (
          <StepBox titulo="Paso 3 · Despachar respuesta">
            <div className="grid grid-cols-2 gap-2 mb-3">
              {DESTINOS.map((d) => (
                <button key={d.v} onClick={() => setDestino(d.v)}
                  className={`py-2.5 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 border transition-all ${destino === d.v ? 'bg-brand-blue border-brand-blue text-white' : 'bg-white/5 border-white/10 text-white/60'}`}>
                  <d.icon size={14} /> {d.label}
                </button>
              ))}
            </div>
            <textarea value={nota} onChange={(e) => setNota(e.target.value)} rows={2} placeholder="Detalle del despacho (opcional)"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-white/30 mb-3 outline-none" />
            <div className="flex gap-2">
              <button
                onClick={() => hacer(async () => { await centroOperacionesService.despachar(inc.id, destino, nota); setNota(''); setDestino(''); })}
                disabled={procesando || !destino}
                className="flex-1 py-3 rounded-xl bg-brand-blue text-white font-black text-xs uppercase tracking-widest disabled:opacity-40"
              >
                Despachar
              </button>
            </div>
          </StepBox>
        )}

        {/* Cierre disponible desde que fue tomado */}
        {inc.estado !== 'NUEVO' && inc.estado !== 'RESUELTO' && (
          <StepBox titulo="Cerrar el incidente">
            <div className="grid grid-cols-1 gap-1.5 mb-3">
              {DISPOSICIONES.map((d) => (
                <button key={d.v} onClick={() => setDisposicion(d.v)}
                  className={`px-3 py-2 rounded-xl text-left border transition-all ${disposicion === d.v ? 'bg-emerald/15 border-emerald/40' : 'bg-white/5 border-white/10'}`}>
                  <p className={`text-xs font-bold ${disposicion === d.v ? 'text-emerald' : 'text-white/80'}`}>{d.label}</p>
                  <p className="text-[10px] text-white/40">{d.desc}</p>
                </button>
              ))}
            </div>
            <textarea value={resumen} onChange={(e) => setResumen(e.target.value)} rows={2} placeholder="Resumen del cierre"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-white/30 mb-3 outline-none" />
            <button
              onClick={() => hacer(() => centroOperacionesService.resolver(inc.id, disposicion, resumen || disposicion))}
              disabled={procesando || !disposicion}
              className="w-full py-3 rounded-xl bg-emerald text-slate-950 font-black text-xs uppercase tracking-widest disabled:opacity-40"
            >
              Cerrar incidente
            </button>
          </StepBox>
        )}

        {inc.estado === 'RESUELTO' && (
          <div className="bg-emerald/10 border border-emerald/25 rounded-2xl p-4 text-center">
            <CheckCircle2 size={28} className="mx-auto text-emerald mb-2" />
            <p className="text-emerald font-black uppercase tracking-widest text-sm">Incidente resuelto</p>
            <p className="text-white/50 text-xs mt-1">Disposición: {inc.disposicion} · {inc.resumen}</p>
          </div>
        )}

        {/* Bitácora */}
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Bitácora</p>
          <div className="space-y-2">
            {inc.bitacora.length === 0 && <p className="text-xs text-white/30">Sin registros todavía.</p>}
            {inc.bitacora.map((b: BitacoraEntrada) => (
              <div key={b.id} className="flex gap-3 text-xs">
                <span className="font-mono text-white/30 shrink-0">{hora(b.ts)}</span>
                <div className="flex-1">
                  <span className="font-bold text-white/80">{ACCION_LABEL[b.accion] ?? b.accion}</span>
                  {b.actor_nombre && <span className="text-white/40"> · {b.actor_nombre}</span>}
                  {detalleTexto(b.detalle) && <p className="text-white/50">{detalleTexto(b.detalle)}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Overlay>
  );
};

function detalleTexto(d: Record<string, unknown>): string {
  const partes: string[] = [];
  if (d.metodo) partes.push(`Método: ${d.metodo}`);
  if (d.destino) partes.push(`Despacho: ${d.destino}`);
  if (d.disposicion) partes.push(`Disposición: ${d.disposicion}`);
  if (d.nota) partes.push(String(d.nota));
  if (d.resumen) partes.push(String(d.resumen));
  return partes.join(' · ');
}

function StepBox({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
      <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-3">{titulo}</p>
      {children}
    </div>
  );
}

function Overlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/70 z-[90] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-950 border border-white/10 rounded-3xl w-full max-w-lg shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
