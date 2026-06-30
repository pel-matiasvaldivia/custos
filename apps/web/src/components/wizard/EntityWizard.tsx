import { ReactNode, useState } from 'react';
import { Check, ChevronLeft, ChevronRight, X } from 'lucide-react';

export interface WizardStep<T> {
  id: string;
  titulo: string;
  descripcion?: string;
  opcional?: boolean;
  render: (data: T, setData: (patch: Partial<T>) => void) => ReactNode;
  validar?: (data: T) => string | null;
}

interface EntityWizardProps<T> {
  titulo: string;
  pasos: WizardStep<T>[];
  datosIniciales: T;
  loQueVasANecesitar?: string[];
  onFinalizar: (data: T) => Promise<void>;
  onClose: () => void;
  textoBotonFinal?: string;
}

export function EntityWizard<T>({
  titulo,
  pasos,
  datosIniciales,
  loQueVasANecesitar,
  onFinalizar,
  onClose,
  textoBotonFinal = 'Crear',
}: EntityWizardProps<T>) {
  const [pasoActual, setPasoActual] = useState(loQueVasANecesitar ? -1 : 0);
  const [data, setDataState] = useState<T>(datosIniciales);
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const setData = (patch: Partial<T>) => {
    setDataState((prev) => ({ ...prev, ...patch }));
  };

  const esIntro = pasoActual === -1;
  const paso = !esIntro ? pasos[pasoActual] : null;
  const esUltimoPaso = pasoActual === pasos.length - 1;

  const irAlSiguiente = async () => {
    if (esIntro) {
      setPasoActual(0);
      return;
    }
    if (paso?.validar) {
      const mensaje = paso.validar(data);
      if (mensaje) {
        setError(mensaje);
        return;
      }
    }
    setError(null);

    if (esUltimoPaso) {
      setEnviando(true);
      try {
        await onFinalizar(data);
      } catch (e: any) {
        setError(e?.response?.data?.message || 'Ocurrió un error. Intentá de nuevo.');
      } finally {
        setEnviando(false);
      }
      return;
    }
    setPasoActual((p) => p + 1);
  };

  const irAtras = () => {
    setError(null);
    if (pasoActual === 0 && loQueVasANecesitar) {
      setPasoActual(-1);
      return;
    }
    setPasoActual((p) => Math.max(0, p - 1));
  };

  const saltarPaso = () => {
    setError(null);
    if (esUltimoPaso) {
      irAlSiguiente();
      return;
    }
    setPasoActual((p) => p + 1);
  };

  return (
    <div className="fixed inset-0 bg-navy/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface w-full max-w-lg rounded-xl shadow-xl overflow-hidden border border-line animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-line flex justify-between items-center">
          <h3 className="text-xl font-display font-bold text-navy">{titulo}</h3>
          <button onClick={onClose} className="text-muted hover:text-navy transition-colors">
            <X size={20} />
          </button>
        </div>

        {!esIntro && (
          <div className="px-6 pt-4 flex items-center gap-1.5">
            {pasos.map((p, i) => (
              <div
                key={p.id}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  i < pasoActual ? 'bg-brand-blue' : i === pasoActual ? 'bg-brand-blue/60' : 'bg-line'
                }`}
              />
            ))}
          </div>
        )}

        <div className="p-6 overflow-y-auto flex-1">
          {esIntro ? (
            <div className="space-y-4">
              <p className="text-sm text-muted">
                Antes de empezar, te conviene tener a mano:
              </p>
              <ul className="space-y-2">
                {loQueVasANecesitar?.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-navy">
                    <Check size={16} className="text-brand-blue shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted">
                No te preocupes si todavía no tenés todo: podés guardar y completar el resto más tarde.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-navy text-sm uppercase tracking-wider">{paso!.titulo}</h4>
                {paso!.descripcion && <p className="text-xs text-muted mt-1">{paso!.descripcion}</p>}
              </div>
              {paso!.render(data, setData)}
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-amber/10 border border-amber/30 rounded-md text-sm text-amber">
              {error}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-line flex gap-3 items-center">
          {(pasoActual > 0 || (pasoActual === 0 && loQueVasANecesitar)) && (
            <button
              type="button"
              onClick={irAtras}
              className="px-4 py-2 text-muted font-medium rounded-md hover:bg-canvas transition-colors flex items-center gap-1"
              disabled={enviando}
            >
              <ChevronLeft size={16} /> Atrás
            </button>
          )}
          <div className="flex-1" />
          {!esIntro && paso?.opcional && !esUltimoPaso && (
            <button
              type="button"
              onClick={saltarPaso}
              className="px-4 py-2 text-muted font-medium rounded-md hover:bg-canvas transition-colors"
              disabled={enviando}
            >
              Completar después
            </button>
          )}
          <button
            type="button"
            onClick={irAlSiguiente}
            className="btn-primary flex items-center gap-1"
            disabled={enviando}
          >
            {enviando
              ? 'Guardando...'
              : esIntro
                ? 'Empezar'
                : esUltimoPaso
                  ? textoBotonFinal
                  : 'Siguiente'}
            {!esIntro && !esUltimoPaso && <ChevronRight size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
