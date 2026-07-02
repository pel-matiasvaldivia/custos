import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { X, AlertTriangle, Loader2 } from 'lucide-react';

interface Props {
  onDetectado: (codigo: string) => void;
  onClose: () => void;
}

export const EscanerQRModal = ({ onDetectado, onClose }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<{ stop: () => void } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [iniciando, setIniciando] = useState(true);

  useEffect(() => {
    const reader = new BrowserMultiFormatReader();
    let cancelado = false;

    (async () => {
      try {
        if (!videoRef.current) return;
        const controls = await reader.decodeFromVideoDevice(
          undefined,
          videoRef.current,
          (result) => {
            if (result && !cancelado) {
              cancelado = true;
              controls.stop();
              onDetectado(result.getText());
            }
          },
        );
        controlsRef.current = controls;
        setIniciando(false);
      } catch {
        setError('No se pudo acceder a la cámara. Revisá los permisos.');
        setIniciando(false);
      }
    })();

    return () => {
      cancelado = true;
      controlsRef.current?.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 bg-slate-950 z-[95] flex flex-col text-white">
      <div className="p-5 flex justify-between items-center border-b border-white/10">
        <h3 className="text-lg font-black italic uppercase tracking-tighter">Escanear QR</h3>
        <button onClick={onClose} className="text-white/50 hover:text-white">
          <X size={22} />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        {error ? (
          <div className="p-6 text-center">
            <AlertTriangle size={40} className="mx-auto mb-3 text-amber" />
            <p className="text-sm text-white/70">{error}</p>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              muted
              playsInline
              autoPlay
            />
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-64 h-64 border-4 border-brand-blue rounded-2xl shadow-[0_0_0_9999px_rgba(2,6,23,0.6)]" />
            </div>
            {iniciando && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-950/70">
                <Loader2 size={32} className="animate-spin text-brand-blue" />
              </div>
            )}
          </>
        )}
      </div>

      <div className="p-5 text-center text-xs font-bold uppercase tracking-widest text-white/50">
        Apuntá al QR del punto de control
      </div>
    </div>
  );
};
