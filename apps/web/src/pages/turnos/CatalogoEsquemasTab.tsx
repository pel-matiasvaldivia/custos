import { useEffect, useState } from 'react';
import { Plus, Trash2, CalendarClock, Loader2 } from 'lucide-react';
import { cuadranteService, EsquemaTurno, horasSemanaEsquema } from '../../services/cuadrante.service';
import { EsquemaTurnoForm } from '../objectives/EsquemaTurnoForm';

const mensajeError = (err: unknown) =>
  (err as { response?: { data?: { message?: string } } })?.response?.data?.message;

/** Resumen legible del patrón: "Trabaja 07:00 (12h) · Franco". */
const resumenPatron = (esquema: EsquemaTurno): string => {
  const { dias_ciclo, dias } = esquema.definicion;
  return dias
    .slice(0, dias_ciclo)
    .map((d) => {
      if (d.tipo === 'FRANCO') return 'Franco';
      const b = (d.bloques ?? [])[0];
      return b ? `${b.hora_inicio} (${b.duracion_horas}h)` : 'Trabaja';
    })
    .join(' · ');
};

export const CatalogoEsquemasTab = () => {
  const [esquemas, setEsquemas] = useState<EsquemaTurno[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [confirmando, setConfirmando] = useState<string | null>(null);
  const [eliminando, setEliminando] = useState(false);

  const cargar = async () => {
    setLoading(true);
    try {
      const data = await cuadranteService.listarEsquemas();
      setEsquemas(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const handleEliminar = async (id: string) => {
    setEliminando(true);
    setError(null);
    try {
      await cuadranteService.eliminarEsquema(id);
      setEsquemas((prev) => prev.filter((e) => e.id !== id));
      setConfirmando(null);
    } catch (err) {
      setError(mensajeError(err) || 'No se pudo eliminar el esquema.');
      setConfirmando(null);
    } finally {
      setEliminando(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted max-w-2xl">
          Estos son los patrones de turno reutilizables (12×24, 24×48, etc.). Definilos una vez acá y después
          aplicalos a cualquier puesto desde el objetivo.
        </p>
        <button onClick={() => setModalAbierto(true)} className="btn-primary flex items-center gap-2 shrink-0">
          <Plus size={16} /> Nuevo esquema
        </button>
      </div>

      {error && <div className="p-3 bg-amber/10 border border-amber/30 rounded-md text-sm text-amber">{error}</div>}

      {loading ? (
        <div className="card py-10 flex items-center justify-center text-muted">
          <Loader2 className="animate-spin mr-2" size={18} /> Cargando esquemas...
        </div>
      ) : esquemas.length === 0 ? (
        <div className="card py-10 text-center space-y-2">
          <p className="text-muted">Todavía no creaste ningún esquema de turno.</p>
          <button onClick={() => setModalAbierto(true)} className="text-brand-blue font-medium text-sm hover:underline">
            Crear el primero
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {esquemas.map((e) => {
            const confirma = confirmando === e.id;
            return (
              <div
                key={e.id}
                className={`border rounded-lg p-4 space-y-3 transition-colors ${
                  confirma ? 'border-red-300 bg-red-50' : 'border-line bg-surface'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-bold text-navy truncate">{e.nombre}</p>
                    <p className="text-xs text-muted mt-0.5">Ciclo de {e.dias_ciclo} día(s)</p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] text-brand-blue bg-brand-blue/5 border border-brand-blue/20 rounded-full px-2 py-0.5 shrink-0">
                    <CalendarClock size={11} /> {horasSemanaEsquema(e)} hs/sem
                  </span>
                </div>

                <p className="text-xs text-muted leading-relaxed">{resumenPatron(e)}</p>

                <div className="pt-2 border-t border-line flex justify-end">
                  {confirma ? (
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-red-500 font-medium">¿Eliminar?</span>
                      <button
                        onClick={() => handleEliminar(e.id)}
                        disabled={eliminando}
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                      >
                        Sí
                      </button>
                      <button
                        onClick={() => setConfirmando(null)}
                        disabled={eliminando}
                        className="px-2 py-1 border border-line text-muted rounded hover:bg-surface"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmando(e.id)}
                      className="text-muted hover:text-red-500 transition-colors flex items-center gap-1 text-xs"
                      title="Eliminar esquema"
                    >
                      <Trash2 size={13} /> Eliminar
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modalAbierto && (
        <EsquemaTurnoForm
          onClose={() => setModalAbierto(false)}
          onCreado={() => {
            setModalAbierto(false);
            cargar();
          }}
        />
      )}
    </div>
  );
};
