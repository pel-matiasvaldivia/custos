import { useState, type ReactNode } from 'react';
import { Lightbulb, X } from 'lucide-react';

const key = (id: string) => `custos_hint_${id}`;

interface Props {
  /** Identificador único del hint (se recuerda como visto en localStorage). */
  id: string;
  title: string;
  children: ReactNode;
}

/**
 * Ayuda contextual que aparece la primera vez que el usuario entra a un módulo.
 * Explica para qué sirve la pantalla y cuál es la primera acción. Al descartarla
 * se recuerda por localStorage y no vuelve a mostrarse.
 */
export const PageHint = ({ id, title, children }: Props) => {
  const [visible, setVisible] = useState(() => localStorage.getItem(key(id)) !== '1');

  if (!visible) return null;

  const descartar = () => {
    localStorage.setItem(key(id), '1');
    setVisible(false);
  };

  return (
    <div className="flex items-start gap-3 p-4 rounded-lg border border-brand-blue/20 bg-brand-blue/[0.05] animate-in fade-in slide-in-from-top-1 duration-300">
      <div className="p-1.5 rounded-md bg-brand-blue/10 text-brand-blue shrink-0">
        <Lightbulb size={16} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-navy">{title}</p>
        <p className="text-xs text-muted mt-0.5 leading-relaxed">{children}</p>
      </div>
      <button
        onClick={descartar}
        className="shrink-0 text-xs font-medium text-brand-blue hover:underline flex items-center gap-1"
        title="No mostrar de nuevo"
      >
        Entendido <X size={13} />
      </button>
    </div>
  );
};

/** Reinicia todos los hints (por si el usuario quiere volver a verlos). */
export const resetPageHints = () => {
  Object.keys(localStorage)
    .filter((k) => k.startsWith('custos_hint_'))
    .forEach((k) => localStorage.removeItem(k));
};
