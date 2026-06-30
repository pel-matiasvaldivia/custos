import { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { credencialService, TipoCredencial } from '../../services/credencial.service';

const TIPOS: { value: TipoCredencial; label: string }[] = [
  { value: 'CARNET_VIGILADOR', label: 'Carnet de Vigilador' },
  { value: 'PSICOFISICO', label: 'Psicofísico' },
  { value: 'ANTECEDENTES', label: 'Certificado de Antecedentes' },
  { value: 'ANMAC', label: 'Credencial ANMAC' },
  { value: 'CAPACITACION', label: 'Capacitación' },
];

const campoClase =
  'w-full px-3 py-2 bg-canvas border border-line rounded-md focus:ring-2 focus:ring-brand-blue/20 outline-none text-sm';
const labelClase = 'text-xs font-medium text-muted uppercase tracking-wider';

interface Props {
  vigiladorId: string;
  onClose: () => void;
  onCreated: () => void;
}

export const CredencialForm = ({ vigiladorId, onClose, onCreated }: Props) => {
  const [tipo, setTipo] = useState<TipoCredencial>('CARNET_VIGILADOR');
  const [numero, setNumero] = useState('');
  const [organismo, setOrganismo] = useState('');
  const [emitidaEl, setEmitidaEl] = useState('');
  const [venceEl, setVenceEl] = useState('');
  const [archivo, setArchivo] = useState<File | undefined>();
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setError(null);
    try {
      await credencialService.create(vigiladorId, {
        tipo,
        numero: numero || undefined,
        organismo: organismo || undefined,
        emitida_el: emitidaEl || undefined,
        vence_el: venceEl || undefined,
        archivo,
      });
      onCreated();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'No se pudo guardar la credencial.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-navy/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface w-full max-w-md rounded-xl shadow-xl overflow-hidden border border-line animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-line flex justify-between items-center">
          <h3 className="text-xl font-display font-bold text-navy">Agregar Credencial</h3>
          <button onClick={onClose} className="text-muted hover:text-navy transition-colors">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className={labelClase}>Tipo</label>
            <select
              className={campoClase}
              value={tipo}
              onChange={(e) => setTipo(e.target.value as TipoCredencial)}
            >
              {TIPOS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className={labelClase}>Número</label>
              <input className={campoClase} value={numero} onChange={(e) => setNumero(e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className={labelClase}>Organismo</label>
              <input className={campoClase} value={organismo} onChange={(e) => setOrganismo(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className={labelClase}>Emitida el</label>
              <input
                type="date"
                className={campoClase}
                value={emitidaEl}
                onChange={(e) => setEmitidaEl(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className={labelClase}>Vence el</label>
              <input
                type="date"
                className={campoClase}
                value={venceEl}
                onChange={(e) => setVenceEl(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className={labelClase}>Documento digital (JPG, PNG o PDF)</label>
            <label className="flex items-center gap-2 px-3 py-2 bg-canvas border border-dashed border-line rounded-md text-sm text-muted cursor-pointer hover:border-brand-blue/40 transition-colors">
              <Upload size={16} />
              {archivo ? archivo.name : 'Seleccionar archivo'}
              <input
                type="file"
                accept="image/jpeg,image/png,application/pdf"
                className="hidden"
                onChange={(e) => setArchivo(e.target.files?.[0])}
              />
            </label>
          </div>

          {error && (
            <div className="p-3 bg-amber/10 border border-amber/30 rounded-md text-sm text-amber">{error}</div>
          )}

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-line text-muted font-medium rounded-md hover:bg-canvas transition-colors"
            >
              Cancelar
            </button>
            <button type="submit" className="flex-1 btn-primary" disabled={enviando}>
              {enviando ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
