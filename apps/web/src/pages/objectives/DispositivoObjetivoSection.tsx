import { useEffect, useState } from 'react';
import { Smartphone, KeyRound, Nfc, CheckCircle2, Save } from 'lucide-react';
import { objetivoService } from '../../services/objetivo.service';

interface Props {
  objetivoId: string;
  objetivoCodigo: string;
}

/**
 * Configuración del dispositivo compartido del objetivo (modo "un celular por
 * objetivo"): PIN y TAG NFC con los que el celular del puesto inicia sesión.
 */
export const DispositivoObjetivoSection = ({ objetivoId, objetivoCodigo }: Props) => {
  const [tienePin, setTienePin] = useState(false);
  const [nfcTag, setNfcTag] = useState('');
  const [nuevoPin, setNuevoPin] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cargar = async () => {
    try {
      const d = await objetivoService.getDispositivo(objetivoId);
      setTienePin(d.tiene_pin);
      setNfcTag(d.nfc_tag_id ?? '');
    } catch {
      /* noop */
    }
  };

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [objetivoId]);

  const guardar = async () => {
    setGuardando(true);
    setMsg(null);
    setError(null);
    try {
      const body: { pin?: string; nfc_tag_id?: string } = { nfc_tag_id: nfcTag.trim() };
      if (nuevoPin.trim()) body.pin = nuevoPin.trim();
      const d = await objetivoService.configurarDispositivo(objetivoId, body);
      setTienePin(d.tiene_pin);
      setNfcTag(d.nfc_tag_id ?? '');
      setNuevoPin('');
      setMsg('Credenciales del dispositivo actualizadas.');
    } catch (e) {
      setError(
        (e as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'No se pudo guardar.',
      );
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="card">
      <h3 className="text-lg font-display font-bold text-navy mb-1 flex items-center gap-2">
        <Smartphone className="text-brand-blue" size={20} /> Dispositivo del objetivo
      </h3>
      <p className="text-xs text-muted mb-4">
        Un celular por objetivo: los vigiladores asignados no inician sesión, se
        identifican por acción. El celular se activa con el código del objetivo +
        PIN, o acercando el TAG NFC.
      </p>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-canvas border border-line rounded-lg">
          <span className="text-xs font-medium text-muted uppercase tracking-wider">Código del objetivo</span>
          <span className="font-mono font-bold text-navy">{objetivoCodigo}</span>
        </div>

        <div>
          <label className="text-xs font-medium text-muted uppercase tracking-wider flex items-center gap-1.5">
            <KeyRound size={13} /> PIN del dispositivo
          </label>
          {tienePin && !nuevoPin && (
            <p className="text-[11px] text-emerald flex items-center gap-1 mt-1">
              <CheckCircle2 size={12} /> PIN configurado — dejá vacío para conservarlo
            </p>
          )}
          <input
            type="text"
            inputMode="numeric"
            value={nuevoPin}
            onChange={(e) => setNuevoPin(e.target.value)}
            placeholder={tienePin ? '•••• (sin cambios)' : '4 a 8 dígitos'}
            className="w-full mt-1 border border-line rounded-lg p-2 text-sm font-mono"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-muted uppercase tracking-wider flex items-center gap-1.5">
            <Nfc size={13} /> TAG NFC (opcional)
          </label>
          <input
            type="text"
            value={nfcTag}
            onChange={(e) => setNfcTag(e.target.value)}
            placeholder="Serial del TAG pegado en el objetivo"
            className="w-full mt-1 border border-line rounded-lg p-2 text-sm font-mono"
          />
        </div>

        {msg && <p className="text-xs text-emerald">{msg}</p>}
        {error && <p className="text-xs text-amber">{error}</p>}

        <button
          onClick={guardar}
          disabled={guardando}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-brand-blue text-white text-sm font-medium rounded-lg hover:bg-brand-deep transition-colors disabled:opacity-50"
        >
          <Save size={15} /> {guardando ? 'Guardando...' : 'Guardar credenciales'}
        </button>
      </div>
    </div>
  );
};
