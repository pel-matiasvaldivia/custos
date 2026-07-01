import { useState } from 'react';
import { Shield, Users, CalendarClock, Smartphone, ChevronLeft, ChevronRight, X } from 'lucide-react';

const VISTA_KEY = 'custos_bienvenida_vista';

interface Slide {
  icon: typeof Shield;
  titulo: string;
  texto: string;
}

const SLIDES: Slide[] = [
  {
    icon: Shield,
    titulo: 'Bienvenido a CustOS',
    texto: 'La plataforma para gestionar tu empresa de seguridad física de punta a punta: personal, clientes, objetivos, turnos, asistencia y facturación, todo en un solo lugar.',
  },
  {
    icon: Users,
    titulo: 'Cargá tu operación',
    texto: 'Primero das de alta tu personal (los vigiladores) y tus clientes. Después creás los objetivos (los lugares a cubrir) con sus puestos.',
  },
  {
    icon: CalendarClock,
    titulo: 'Armá los turnos',
    texto: 'Definís un esquema de turno (12×24, 24×48, etc.) y afectás a tu gente a cada puesto. CustOS genera el cuadrante automáticamente y te avisa si quedan huecos de cobertura.',
  },
  {
    icon: Smartphone,
    titulo: 'Controlá en tiempo real',
    texto: 'Tus guardias marcan asistencia desde la app móvil, ves todo en el mapa del Centro de Operaciones, y al cierre liquidás las horas trabajadas. ¡Empecemos!',
  },
];

export const BienvenidaModal = () => {
  const [visible, setVisible] = useState(() => localStorage.getItem(VISTA_KEY) !== '1');
  const [i, setI] = useState(0);

  if (!visible) return null;

  const cerrar = () => {
    localStorage.setItem(VISTA_KEY, '1');
    setVisible(false);
  };

  const slide = SLIDES[i];
  const Icono = slide.icon;
  const ultimo = i === SLIDES.length - 1;

  return (
    <div className="fixed inset-0 bg-navy/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface w-full max-w-md rounded-2xl shadow-2xl border border-line animate-in fade-in zoom-in duration-200 overflow-hidden">
        <div className="flex justify-end p-3">
          <button onClick={cerrar} className="text-muted hover:text-navy transition-colors" title="Saltar">
            <X size={18} />
          </button>
        </div>

        <div className="px-8 pb-2 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-blue/10 text-brand-blue flex items-center justify-center">
            <Icono size={30} />
          </div>
          <h2 className="text-xl font-display font-bold text-navy">{slide.titulo}</h2>
          <p className="text-sm text-muted leading-relaxed">{slide.texto}</p>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-1.5 py-5">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              className={`h-1.5 rounded-full transition-all ${idx === i ? 'w-6 bg-brand-blue' : 'w-1.5 bg-line'}`}
            />
          ))}
        </div>

        <div className="p-4 border-t border-line flex items-center justify-between gap-3">
          <button
            onClick={() => setI((v) => Math.max(0, v - 1))}
            disabled={i === 0}
            className="px-3 py-2 text-sm text-muted hover:text-navy disabled:opacity-0 transition-colors flex items-center gap-1"
          >
            <ChevronLeft size={16} /> Atrás
          </button>
          {ultimo ? (
            <button onClick={cerrar} className="btn-primary px-6">
              Empezar
            </button>
          ) : (
            <button
              onClick={() => setI((v) => Math.min(SLIDES.length - 1, v + 1))}
              className="btn-primary px-6 flex items-center gap-1"
            >
              Siguiente <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
