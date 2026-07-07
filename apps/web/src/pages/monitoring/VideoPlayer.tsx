import { useEffect, useRef, useState } from 'react';
import {
  Video, VideoOff, ChevronUp, ChevronDown, ChevronLeft, ChevronRight,
  ZoomIn, Loader2, ImageIcon,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { dispositivosService, StreamInfo } from '../../services/dispositivos.service';

interface VideoPlayerProps {
  incidentId: string;
  title?: string;
  onClose?: () => void;
}

/**
 * Player de video verificación. Muestra primero el SNAPSHOT del instante del
 * disparo (inmediato) y en paralelo negocia el vivo por WHEP (WebRTC nativo,
 * sin librerías) contra el proxy autenticado de la API. PTZ si el canal lo soporta.
 */
export const VideoPlayer: React.FC<VideoPlayerProps> = ({ incidentId, title, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const [info, setInfo] = useState<StreamInfo | null>(null);
  const [snapshot, setSnapshot] = useState<string | null>(null);
  const [estadoVivo, setEstadoVivo] = useState<'conectando' | 'vivo' | 'sin_vivo'>('conectando');

  useEffect(() => {
    let snapUrl: string | null = null;
    let cancelado = false;

    (async () => {
      // 1. Snapshot inmediato (no bloquea el vivo).
      dispositivosService
        .snapshot(incidentId)
        .then((url) => {
          if (cancelado) { URL.revokeObjectURL(url); return; }
          snapUrl = url;
          setSnapshot(url);
        })
        .catch(() => {});

      // 2. Info del stream + WHEP.
      try {
        const s = await dispositivosService.getStream(incidentId);
        if (cancelado) return;
        setInfo(s);
        if (s.disponible && s.whepUrl) {
          await conectarWhep();
        } else {
          setEstadoVivo('sin_vivo');
        }
      } catch {
        setEstadoVivo('sin_vivo');
      }
    })();

    return () => {
      cancelado = true;
      if (snapUrl) URL.revokeObjectURL(snapUrl);
      pcRef.current?.close();
      pcRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incidentId]);

  const conectarWhep = async () => {
    try {
      const pc = new RTCPeerConnection();
      pcRef.current = pc;
      pc.addTransceiver('video', { direction: 'recvonly' });
      pc.addTransceiver('audio', { direction: 'recvonly' });
      pc.ontrack = (ev) => {
        if (videoRef.current && ev.streams[0]) {
          videoRef.current.srcObject = ev.streams[0];
          setEstadoVivo('vivo');
        }
      };
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      const answer = await dispositivosService.whep(incidentId, offer.sdp || '');
      await pc.setRemoteDescription({ type: 'answer', sdp: answer });
    } catch {
      setEstadoVivo('sin_vivo');
    }
  };

  const ptz = (mov: { pan?: number; tilt?: number; zoom?: number }) => {
    dispositivosService.ptz(incidentId, mov).catch(() => {});
  };
  const stopPtz = () => ptz({ pan: 0, tilt: 0, zoom: 0 });

  const tienePtz = !!info?.tienePtz;

  return (
    <div className="bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl border border-white/5 relative group">
      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${estadoVivo === 'vivo' ? 'bg-red-500 animate-pulse' : 'bg-white/40'}`} />
          <span className="text-[10px] font-black uppercase tracking-widest text-white/80">
            {title || info?.canal || 'Cámara'}
          </span>
        </div>
        {onClose && <button onClick={onClose} className="text-white/40 hover:text-white"><VideoOff size={16} /></button>}
      </div>

      <div className="aspect-video bg-black flex items-center justify-center relative">
        {/* Snapshot de fondo (instante del disparo) */}
        {snapshot && (
          <img
            src={snapshot}
            alt="Snapshot del evento"
            className={`absolute inset-0 w-full h-full object-contain transition-opacity ${estadoVivo === 'vivo' ? 'opacity-0' : 'opacity-100'}`}
          />
        )}

        {/* Vivo (WHEP) */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`absolute inset-0 w-full h-full object-contain ${estadoVivo === 'vivo' ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Overlays de estado */}
        {estadoVivo === 'conectando' && (
          <div className="relative z-10 flex flex-col items-center gap-3 text-white/60">
            <Loader2 size={28} className="animate-spin" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Conectando al vivo…</span>
          </div>
        )}
        {estadoVivo === 'sin_vivo' && !snapshot && (
          <div className="relative z-10 flex flex-col items-center gap-3 text-white/40">
            <ImageIcon size={28} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Sin video para este evento</span>
          </div>
        )}
        {estadoVivo === 'sin_vivo' && snapshot && (
          <div className="absolute bottom-4 left-6 z-10 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-amber">
            <Video size={12} /> Solo snapshot (vivo no disponible)
          </div>
        )}
      </div>

      {/* PTZ */}
      {tienePtz && (
        <div className="absolute bottom-4 right-4 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex justify-center">
            <PtzBtn icon={ChevronUp} onDown={() => ptz({ tilt: 60 })} onUp={stopPtz} />
          </div>
          <div className="flex gap-1">
            <PtzBtn icon={ChevronLeft} onDown={() => ptz({ pan: -60 })} onUp={stopPtz} />
            <PtzBtn icon={ZoomIn} onDown={() => ptz({ zoom: 60 })} onUp={stopPtz} />
            <PtzBtn icon={ChevronRight} onDown={() => ptz({ pan: 60 })} onUp={stopPtz} />
          </div>
          <div className="flex justify-center">
            <PtzBtn icon={ChevronDown} onDown={() => ptz({ tilt: -60 })} onUp={stopPtz} />
          </div>
        </div>
      )}
    </div>
  );
};

function PtzBtn({ icon: Icon, onDown, onUp }: { icon: LucideIcon; onDown: () => void; onUp: () => void }) {
  return (
    <button
      onMouseDown={onDown}
      onMouseUp={onUp}
      onMouseLeave={onUp}
      onTouchStart={onDown}
      onTouchEnd={onUp}
      className="w-8 h-8 rounded-lg flex items-center justify-center bg-black/40 text-white/60 hover:bg-black/80 hover:text-white backdrop-blur-sm transition-all"
    >
      <Icon size={16} />
    </button>
  );
}
