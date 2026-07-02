import { useEffect, useRef, useState } from 'react';
import { X, Camera, Mic, Square, Trash2, Send, Loader2, AlertTriangle } from 'lucide-react';
import { vigilanciaMovilService, NovedadTipo } from '../../services/vigilanciaMovil.service';

interface Props {
  onClose: () => void;
  onCreada: () => void;
}

interface Adjunto {
  blob: Blob;
  filename: string;
  kind: 'foto' | 'audio';
  url: string;
}

const PRIORIDADES = [
  { codigo: 'NORMAL', label: 'Normal' },
  { codigo: 'ALTA', label: 'Alta' },
  { codigo: 'CRITICA', label: 'Crítica' },
];

export const NovedadMovilModal = ({ onClose, onCreada }: Props) => {
  const [tipos, setTipos] = useState<NovedadTipo[]>([]);
  const [tipo, setTipo] = useState<string>('');
  const [descripcion, setDescripcion] = useState('');
  const [prioridad, setPrioridad] = useState('NORMAL');
  const [adjuntos, setAdjuntos] = useState<Adjunto[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [grabando, setGrabando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const fotoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    vigilanciaMovilService
      .novedadTipos()
      .then((t) => {
        setTipos(t);
        if (t.length) setTipo(t[0].codigo);
      })
      .catch(() => setTipos([]));
  }, []);

  const agregarFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAdjuntos((prev) => [
      ...prev,
      { blob: file, filename: file.name || `foto-${Date.now()}.jpg`, kind: 'foto', url: URL.createObjectURL(file) },
    ]);
    e.target.value = '';
  };

  const iniciarGrabacion = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (ev) => ev.data.size > 0 && chunksRef.current.push(ev.data);
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || 'audio/webm' });
        setAdjuntos((prev) => [
          ...prev,
          { blob, filename: `audio-${Date.now()}.webm`, kind: 'audio', url: URL.createObjectURL(blob) },
        ]);
        stream.getTracks().forEach((t) => t.stop());
      };
      mediaRecorderRef.current = rec;
      rec.start();
      setGrabando(true);
    } catch {
      setError('No se pudo acceder al micrófono.');
    }
  };

  const detenerGrabacion = () => {
    mediaRecorderRef.current?.stop();
    setGrabando(false);
  };

  const quitarAdjunto = (i: number) => {
    setAdjuntos((prev) => {
      URL.revokeObjectURL(prev[i].url);
      return prev.filter((_, idx) => idx !== i);
    });
  };

  const enviar = async () => {
    if (!tipo) {
      setError('Elegí un tipo de novedad.');
      return;
    }
    if (!descripcion.trim() && adjuntos.length === 0) {
      setError('Escribí una descripción o adjuntá una foto/audio.');
      return;
    }
    setEnviando(true);
    setError(null);
    try {
      await vigilanciaMovilService.crearNovedad(
        tipo,
        descripcion.trim() || `[${tipo}]`,
        prioridad,
        adjuntos.map((a) => ({ blob: a.blob, filename: a.filename })),
      );
      onCreada();
    } catch {
      setError('No se pudo registrar la novedad.');
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm z-[90] flex flex-col text-white">
      <div className="p-5 flex justify-between items-center border-b border-white/10">
        <h3 className="text-lg font-black italic uppercase tracking-tighter">Nueva novedad</h3>
        <button onClick={onClose} className="text-white/50 hover:text-white">
          <X size={22} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Tipo predefinido */}
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Tipo de novedad</p>
          <div className="flex flex-wrap gap-2">
            {tipos.map((t) => (
              <button
                key={t.codigo}
                onClick={() => setTipo(t.codigo)}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                  tipo === t.codigo
                    ? 'bg-brand-blue border-brand-blue text-white'
                    : 'bg-white/5 border-white/10 text-white/60'
                }`}
              >
                {t.etiqueta}
              </button>
            ))}
            {tipos.length === 0 && <p className="text-xs text-white/40">Cargando tipos...</p>}
          </div>
        </div>

        {/* Prioridad */}
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Prioridad</p>
          <div className="flex gap-2">
            {PRIORIDADES.map((p) => (
              <button
                key={p.codigo}
                onClick={() => setPrioridad(p.codigo)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                  prioridad === p.codigo
                    ? p.codigo === 'CRITICA'
                      ? 'bg-red-600 border-red-600'
                      : p.codigo === 'ALTA'
                        ? 'bg-amber border-amber text-slate-900'
                        : 'bg-brand-blue border-brand-blue'
                    : 'bg-white/5 border-white/10 text-white/60'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Descripción */}
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Descripción</p>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={4}
            placeholder="Contá qué pasó..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white placeholder-white/30 outline-none focus:border-brand-blue/50"
          />
        </div>

        {/* Adjuntos */}
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Adjuntos</p>
          <div className="flex gap-3">
            <input ref={fotoInputRef} type="file" accept="image/*" capture="environment" hidden onChange={agregarFoto} />
            <button
              onClick={() => fotoInputRef.current?.click()}
              className="flex-1 flex flex-col items-center gap-1 py-4 rounded-2xl bg-white/5 border border-white/10 active:scale-95 transition-all"
            >
              <Camera size={22} className="text-brand-blue" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Foto</span>
            </button>
            {grabando ? (
              <button
                onClick={detenerGrabacion}
                className="flex-1 flex flex-col items-center gap-1 py-4 rounded-2xl bg-red-600/90 border border-red-600 active:scale-95 transition-all animate-pulse"
              >
                <Square size={22} />
                <span className="text-[10px] font-black uppercase tracking-widest">Detener</span>
              </button>
            ) : (
              <button
                onClick={iniciarGrabacion}
                className="flex-1 flex flex-col items-center gap-1 py-4 rounded-2xl bg-white/5 border border-white/10 active:scale-95 transition-all"
              >
                <Mic size={22} className="text-brand-blue" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Audio</span>
              </button>
            )}
          </div>

          {adjuntos.length > 0 && (
            <div className="mt-3 space-y-2">
              {adjuntos.map((a, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-2">
                  {a.kind === 'foto' ? (
                    <img src={a.url} alt="" className="w-12 h-12 rounded-lg object-cover" />
                  ) : (
                    <audio src={a.url} controls className="h-8 flex-1" />
                  )}
                  {a.kind === 'foto' && <span className="flex-1 text-xs text-white/60 truncate">{a.filename}</span>}
                  <button onClick={() => quitarAdjunto(i)} className="text-white/40 hover:text-red-500 p-1">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-2 text-amber text-xs font-bold">
            <AlertTriangle size={14} /> {error}
          </div>
        )}
      </div>

      <div className="p-5 border-t border-white/10">
        <button
          onClick={enviar}
          disabled={enviando || grabando}
          className="w-full py-4 rounded-2xl bg-brand-blue font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 transition-all"
        >
          {enviando ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          {enviando ? 'Registrando...' : 'Registrar novedad'}
        </button>
      </div>
    </div>
  );
};
