import { useCallback, useEffect, useMemo, useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Download, Loader2, AlertTriangle } from 'lucide-react';
import { PageHint } from '../../components/common/PageHint';
import { objetivoService, Objetivo } from '../../services/objetivo.service';
import { cuadranteService, CuadrantePuesto, TurnoPlanificado } from '../../services/cuadrante.service';

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const aIsoDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

interface FilaCuadrante {
  objetivoNombre: string;
  puestoId: string;
  puestoNombre: string;
  /** día del mes (1..31) → turnos que ARRANCAN ese día */
  turnosPorDia: Map<number, TurnoPlanificado[]>;
}

/** Apellido corto del vigilador para la celda. */
const etiquetaTurno = (t: TurnoPlanificado) =>
  t.vigilador ? t.vigilador.apellido.toUpperCase() : '¿?';

export const QuadrantPage = () => {
  // Primer día del mes visible.
  const [mes, setMes] = useState(() => {
    const hoy = new Date();
    return new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  });
  const [filas, setFilas] = useState<FilaCuadrante[]>([]);
  const [loading, setLoading] = useState(true);
  const [generando, setGenerando] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const desde = useMemo(() => new Date(mes.getFullYear(), mes.getMonth(), 1), [mes]);
  const hasta = useMemo(() => new Date(mes.getFullYear(), mes.getMonth() + 1, 0), [mes]);
  const diasMes = hasta.getDate();
  const diasArray = useMemo(() => Array.from({ length: diasMes }, (_, i) => i + 1), [diasMes]);

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const objetivos = await objetivoService.getAll(1, 200);
      const activos = objetivos.filter((o: Objetivo) => o.estado === 'ACTIVO');
      const porObjetivo = await Promise.all(
        activos.map(async (o) => ({
          objetivo: o,
          puestos: await cuadranteService
            .cuadranteDeObjetivo(o.id, aIsoDate(desde), aIsoDate(hasta))
            .catch(() => [] as CuadrantePuesto[]),
        })),
      );

      const nuevas: FilaCuadrante[] = [];
      for (const { objetivo, puestos } of porObjetivo) {
        for (const p of puestos) {
          const turnosPorDia = new Map<number, TurnoPlanificado[]>();
          for (const t of p.turnos) {
            const inicio = new Date(t.inicioPlan);
            // Solo turnos que arrancan dentro del mes visible.
            if (inicio.getMonth() !== desde.getMonth() || inicio.getFullYear() !== desde.getFullYear()) continue;
            const dia = inicio.getDate();
            const lista = turnosPorDia.get(dia) ?? [];
            lista.push(t);
            turnosPorDia.set(dia, lista);
          }
          nuevas.push({
            objetivoNombre: objetivo.nombre,
            puestoId: p.puestoId,
            puestoNombre: p.puestoNombre,
            turnosPorDia,
          });
        }
      }
      setFilas(nuevas);
    } catch {
      setError('No se pudo cargar el cuadrante.');
    } finally {
      setLoading(false);
    }
  }, [desde, hasta]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const generarMes = async () => {
    setGenerando(true);
    setMsg(null);
    setError(null);
    try {
      const r = await cuadranteService.generarMes(aIsoDate(desde), aIsoDate(hasta));
      setMsg(
        `Generación: ${r.asignaciones} asignación(es), ${r.creados} turno(s) nuevos` +
          (r.rechazados.length ? `, ${r.rechazados.length} rechazado(s) por reglas laborales` : '') +
          '.',
      );
      await cargar();
    } catch (e) {
      const m = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(m || 'No se pudo generar el mes.');
    } finally {
      setGenerando(false);
    }
  };

  const exportarCsv = () => {
    const encabezado = ['Objetivo', 'Puesto', ...diasArray.map(String)];
    const lineas = filas.map((f) => [
      f.objetivoNombre,
      f.puestoNombre,
      ...diasArray.map((d) => (f.turnosPorDia.get(d) ?? []).map(etiquetaTurno).join(' / ')),
    ]);
    const csv = [encabezado, ...lineas]
      .map((cols) => cols.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(';'))
      .join('\n');
    // BOM para que Excel abra el UTF-8 con acentos bien.
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cuadrante-${aIsoDate(desde).slice(0, 7)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const esFinDeSemana = (dia: number) => {
    const dow = new Date(mes.getFullYear(), mes.getMonth(), dia).getDay();
    return dow === 0 || dow === 6;
  };

  return (
    <div className="space-y-6 overflow-hidden flex flex-col h-full">
      <PageHint id="cuadrante" title="La vista global de la operación">
        Acá ves la distribución real de turnos del mes en todos los objetivos activos. Los esquemas se
        asignan desde cada objetivo; "Generar Mes" crea los turnos de todas las asignaciones vigentes.
      </PageHint>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-display font-bold text-navy">Cuadrante Operativo</h2>
          <p className="text-muted">Distribución de servicios y asignaciones.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportarCsv}
            disabled={loading || filas.length === 0}
            className="px-4 py-2 bg-surface border border-line rounded-md hover:bg-canvas transition-colors flex items-center gap-2 text-sm font-medium disabled:opacity-50"
          >
            <Download size={16} /> Exportar
          </button>
          <button
            onClick={generarMes}
            disabled={generando}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            {generando ? <Loader2 size={18} className="animate-spin" /> : <CalendarIcon size={18} />}
            {generando ? 'Generando...' : 'Generar Mes'}
          </button>
        </div>
      </div>

      {msg && <p className="text-sm text-emerald">{msg}</p>}
      {error && (
        <p className="text-sm text-red-500 flex items-center gap-2">
          <AlertTriangle size={15} /> {error}
        </p>
      )}

      <div className="card flex-1 flex flex-col p-0 overflow-hidden">
        <div className="p-4 border-b border-line flex items-center justify-between bg-canvas/30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMes(new Date(mes.getFullYear(), mes.getMonth() - 1, 1))}
              className="p-1 hover:bg-canvas rounded transition-colors text-muted hover:text-navy"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="font-display font-bold text-navy uppercase tracking-widest text-sm">
              {MESES[mes.getMonth()]} {mes.getFullYear()}
            </span>
            <button
              onClick={() => setMes(new Date(mes.getFullYear(), mes.getMonth() + 1, 1))}
              className="p-1 hover:bg-canvas rounded transition-colors text-muted hover:text-navy"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          {!loading && (
            <span className="text-xs text-muted">
              {filas.length} puesto(s) · objetivos activos
            </span>
          )}
        </div>

        <div className="overflow-auto flex-1 h-[600px]">
          {loading ? (
            <div className="p-12 text-center text-muted italic">Cargando cuadrante...</div>
          ) : filas.length === 0 ? (
            <div className="p-12 text-center text-muted">
              No hay puestos con turnos este mes. Asigná esquemas desde cada objetivo y usá "Generar Mes".
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead className="sticky top-0 bg-surface z-10">
                <tr className="border-b border-line bg-canvas/50 text-[10px] font-bold text-muted uppercase tracking-tighter">
                  <th className="p-3 border-r border-line min-w-[200px] bg-surface text-left">Objetivo / Puesto</th>
                  {diasArray.map((day) => (
                    <th
                      key={day}
                      className={`p-1 border-r border-line text-center min-w-[40px] ${esFinDeSemana(day) ? 'bg-amber/5' : ''}`}
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-[10px]">
                {filas.map((fila) => (
                  <tr key={fila.puestoId} className="border-b border-line hover:bg-canvas/30 transition-colors">
                    <td className="p-2 border-r border-line font-bold text-navy max-w-[220px]">
                      <span className="block truncate">{fila.objetivoNombre}</span>
                      <span className="block truncate text-muted font-normal">{fila.puestoNombre}</span>
                    </td>
                    {diasArray.map((day) => {
                      const turnos = fila.turnosPorDia.get(day) ?? [];
                      return (
                        <td
                          key={day}
                          title={turnos
                            .map((t) => {
                              const v = t.vigilador ? `${t.vigilador.apellido}, ${t.vigilador.nombre}` : 'Sin vigilador';
                              const hi = new Date(t.inicioPlan).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                              const hf = new Date(t.finPlan).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                              return `${v} · ${hi}–${hf}`;
                            })
                            .join('\n')}
                          className={`p-1 border-r border-line text-center align-top ${
                            turnos.length > 0 ? 'bg-brand-blue/10 text-brand-blue font-bold' : esFinDeSemana(day) ? 'bg-amber/5' : ''
                          }`}
                        >
                          {turnos.length === 0 ? '-' : turnos.map(etiquetaTurno).join(' / ')}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
