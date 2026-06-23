import { useState, useEffect } from 'react';
import { Fingerprint, LogIn, LogOut, Shield, AlertCircle } from 'lucide-react';

export const KioskPage = () => {
  const [time, setTime] = useState(new Date());
  const [pin, setPin] = useState('');
  const [status, setStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAction = async (type: 'IN' | 'OUT') => {
    if (pin.length < 4) {
      setStatus('ERROR');
      setMessage('PIN inválido');
      return;
    }

    // Mock attendance logic (will connect to API later)
    setStatus('SUCCESS');
    setMessage(`Registrado con éxito: ${type === 'IN' ? 'Entrada' : 'Salida'}`);
    setPin('');
    
    setTimeout(() => {
      setStatus('IDLE');
      setMessage('');
    }, 3000);
  };

  const addDigit = (digit: string) => {
    if (pin.length < 6) setPin(prev => prev + digit);
  };

  return (
    <div className="min-h-screen bg-navy text-surface flex flex-col items-center justify-center p-6 font-display">
      <div className="absolute top-8 left-8 flex items-center gap-2">
        <Shield className="text-brand-blue" size={32} />
        <h1 className="text-2xl font-bold tracking-tight">CustOS <span className="text-brand-blue">Kiosco</span></h1>
      </div>

      <div className="absolute top-8 right-8 text-right">
        <div className="text-5xl font-mono font-bold leading-none">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        <div className="text-muted uppercase tracking-widest text-sm mt-1">
          {time.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
      </div>

      <div className="w-full max-w-sm space-y-8 text-center pt-12">
        {status === 'SUCCESS' ? (
          <div className="card bg-emerald/10 border-emerald/20 p-8 space-y-4 animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-emerald text-surface rounded-full flex items-center justify-center mx-auto">
              <LogIn size={40} />
            </div>
            <h2 className="text-2xl font-bold text-emerald">{message}</h2>
            <p className="text-muted">¡Buen turno, Camarada!</p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">Ingresar PIN</h2>
              <p className="text-muted">Identifíquese para registrar asistencia</p>
            </div>

            <div className="flex justify-center gap-3">
              {[...Array(6)].map((_, i) => (
                <div 
                  key={i} 
                  className={`w-4 h-4 rounded-full border-2 transition-colors ${
                    i < pin.length ? 'bg-brand-blue border-brand-blue shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'border-surface/20'
                  }`}
                />
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 px-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, '←'].map((btn) => (
                <button
                  key={btn}
                  onClick={() => {
                    if (btn === 'C') setPin('');
                    else if (btn === '←') setPin(prev => prev.slice(0, -1));
                    else addDigit(btn.toString());
                  }}
                  className="h-20 bg-surface/5 hover:bg-surface/10 rounded-2xl flex items-center justify-center text-2xl font-bold transition-all active:scale-95"
                >
                  {btn}
                </button>
              ))}
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => handleAction('IN')}
                className="flex-1 btn bg-emerald hover:bg-emerald/80 text-surface h-16 text-xl flex items-center justify-center gap-2"
                disabled={pin.length < 4}
              >
                <LogIn size={24} /> ENTRADA
              </button>
              <button 
                onClick={() => handleAction('OUT')}
                className="flex-1 btn bg-red-500 hover:bg-red-400 text-surface h-16 text-xl flex items-center justify-center gap-2"
                disabled={pin.length < 4}
              >
                <LogOut size={24} /> SALIDA
              </button>
            </div>
            
            {status === 'ERROR' && (
              <div className="text-red-400 flex items-center justify-center gap-2 animate-bounce">
                <AlertCircle size={20} /> {message}
              </div>
            )}
          </>
        )}
      </div>

      <div className="mt-12 text-muted/40 text-xs flex items-center gap-2">
        <Fingerprint size={14} /> Sistema de Control Biométrico / PIN v1.0
      </div>
    </div>
  );
};
