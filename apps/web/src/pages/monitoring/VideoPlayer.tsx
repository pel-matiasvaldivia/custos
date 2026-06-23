import React from 'react';
import { Maximize2, Video, VideoOff, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

interface VideoPlayerProps {
  streamUrl: string;
  title?: string;
  onClose?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ streamUrl, title, onClose }) => {

  // In a real WebRTC implementation with MediaMTX, we would use their library
  // or a simple native WebRTC implementation. For this mockup, we'll use a 
  // simulated high-end player UI with a placeholder video.
  
  return (
    <div className="bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl border border-white/5 relative group">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-center z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-white/80">{title || 'LIVE FEED'}</span>
        </div>
        <div className="flex gap-2">
          <button className="text-white/40 hover:text-white transition-colors"><Maximize2 size={16} /></button>
          {onClose && <button onClick={onClose} className="text-white/40 hover:text-white transition-colors"><VideoOff size={16} /></button>}
        </div>
      </div>

      {/* Video Content */}
      <div className="aspect-video bg-black flex items-center justify-center relative">
        {/* Placeholder Simulating Real CCTV */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557597774-9d2739f85a76?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-40 mix-blend-luminosity" />
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/10 to-transparent pointer-events-none" />
        
        {/* Scanline Effect */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,1,0.02))] bg-[length:100%_4px,3px_100%] shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />

        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 animate-pulse">
            <Video size={32} className="text-white/50" />
          </div>
          <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Connecting to Secure Stream...</span>
        </div>

        {/* OSD - On Screen Display */}
        <div className="absolute bottom-4 left-6 font-mono text-[10px] text-emerald/80 tracking-tighter">
          REC ● CAM_04 // HQ_STREAM_SECURE<br/>
          SRC: {streamUrl || 'INTERNAL_PATH'}<br/>
          {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}<br/>
          BITRATE: 4.2 MBPS // LATENCY: 24MS
        </div>
      </div>

      {/* PTZ Control Overlay */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex justify-center">
            <PtzBtn icon={ChevronUp} />
        </div>
        <div className="flex gap-1">
            <PtzBtn icon={ChevronLeft} />
            <PtzBtn icon={ZoomIn} active />
            <PtzBtn icon={ChevronRight} />
        </div>
        <div className="flex justify-center">
            <PtzBtn icon={ChevronDown} />
        </div>
      </div>
    </div>
  );
};

function PtzBtn({ icon: Icon, active = false }: { icon: any, active?: boolean }) {
    return (
        <button className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${active ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/40' : 'bg-black/40 text-white/60 hover:bg-black/80 hover:text-white backdrop-blur-sm'}`}>
            <Icon size={16} />
        </button>
    )
}
