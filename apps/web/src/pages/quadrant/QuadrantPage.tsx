import { useCallback, useEffect, useMemo, useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Download, Loader2, AlertTriangle, LayoutGrid, Users, Wand2 } from 'lucide-react';
import { PageHint } from '../../components/common/PageHint';
import { objetivoService, Objetivo } from '../../services/objetivo.service';
import { cuadranteService, CuadrantePuesto, TurnoPlanificado } from '../../services/cuadrante.service';
import { AsistentePuestoModal } from './AsistentePuestoModal';

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

/** Apellido corto del vigilador para la celda (vista por puesto). */
const etiquetaTurno = (t: TurnoPlanificado) =>
  t.vigilador ? t.vigilador.apellido.toUpperCase() : '¿?';

/** Horas de un turno planificado. */
const horasTurno = (t: TurnoPlanificado) =>
  (new Date(t.finPlan).getTime() - new Date(t.inicioPlan).getTime()) / 3_600_000;

/** Letra del turno según su hora de inicio: M (mañana), T (tarde), N (noche). */
const letraTurno = (t: TurnoPlanificado) => {
  const h = new Date(t.inicioPlan).getHours();
  return h < 12 ? 'M' : h < 19 ? 'T' : 'N';
};

interface FilaVigilador {
  vigiladorId: string;
  nombre: string;
  turnosPorDia: Map<number, TurnoPlanificado[]>;
}

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
  const [vista, setVista] = useState<'puesto' | 'vigilador'>('puesto');
  const [asistenteAbierto, setAsistenteAbierto] = useState(false);

  const desde = useMemo(() => new Date(mes.getFullYear(), mes.getMonth(), 1), [mes]);
  const hasta = useMemo(() => new Date(mes.getFullYear(), mes.getMonth() + 1, 0), [mes]);
  const diasMes = hasta.getDate();
  const diasArray = useMemo(() => Array.from({ length: diasMes }, (_, i) => i + 1), [diasMes]);

  // Reorganiza los turnos por vigilador (cruzando todos los puestos) para la
  // vista tipo planilla: una fila por persona con su turno por día y el total.
  const filasVigilador = useMemo<FilaVigilador[]>(() => {
    const porVig = new Map<string, FilaVigilador>();
    for (const fila of filas) {
      for (const [dia, turnos] of fila.turnosPorDia) {
        for (const t of turnos) {
          if (!t.vigilador) continue;
          let row = porVig.get(t.vigiladorId);
          if (!row) {
            row = {
              vigiladorId: t.vigiladorId,
              nombre: `${t.vigilador.apellido}, ${t.vigilador.nombre}`,
              turnosPorDia: new Map(),
            };
            porVig.set(t.vigiladorId, row);
          }
          const lista = row.turnosPorDia.get(dia) ?? [];
          lista.push(t);
          row.turnosPorDia.set(dia, lista);
        }
      }
    }
    return [...porVig.values()].sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, [filas]);

  const horasDiaVig = (row: FilaVigilador, dia: number) =>
    (row.turnosPorDia.get(dia) ?? []).reduce((a, t) => a + horasTurno(t), 0);
  const totalVig = (row: FilaVigilador) =>
    diasArray.reduce((a, d) => a + horasDiaVig(row, d), 0);
  const totalDia = (dia: number) =>
    filasVigilador.reduce((a, row) => a + horasDiaVig(row, dia), 0);
  const granTotal = filasVigilador.reduce((a, row) => a + totalVig(row), 0);
  const fmtH = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));

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
    let encabezado: string[];
    let lineas: (string | number)[][];
    if (vista === 'vigilador') {
      encabezado = ['Vigilador', ...diasArray.map(String), 'TOTAL HORAS'];
      lineas = filasVigilador.map((row) => [
        row.nombre,
        ...diasArray.map((d) => {
          const turnos = row.turnosPorDia.get(d) ?? [];
          if (!turnos.length) return '';
          return `${turnos.map(letraTurno).join('/')} ${fmtH(horasDiaVig(row, d))}`;
        }),
        fmtH(totalVig(row)),
      ]);
      lineas.push([
        'TOTAL DE HORAS',
        ...diasArray.map((d) => fmtH(totalDia(d))),
        fmtH(granTotal),
      ]);
    } else {
      encabezado = ['Objetivo', 'Puesto', ...diasArray.map(String)];
      lineas = filas.map((f) => [
        f.objetivoNombre,
        f.puestoNombre,
        ...diasArray.map((d) => (f.turnosPorDia.get(d) ?? []).map(etiquetaTurno).join(' / ')),
      ]);
    }
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
          {/* Toggle de vista: por puesto (quién cubre) o por vigilador (planilla con horas). */}
          <div className="flex rounded-md border border-line overflow-hidden">
            <button
              onClick={() => setVista('puesto')}
              className={`px-3 py-2 flex items-center gap-1.5 text-sm font-medium transition-colors ${
                vista === 'puesto' ? 'bg-brand-blue text-white' : 'bg-surface text-muted hover:text-navy'
              }`}
              title="Vista por puesto"
            >
              <LayoutGrid size={15} /> Por puesto
            </button>
            <button
              onClick={() => setVista('vigilador')}
              className={`px-3 py-2 flex items-center gap-1.5 text-sm font-medium transition-colors ${
                vista === 'vigilador' ? 'bg-brand-blue text-white' : 'bg-surface text-muted hover:text-navy'
              }`}
              title="Vista por vigilador (con horas)"
            >
              <Users size={15} /> Por vigilador
            </button>
          </div>
          <button
            onClick={() => setAsistenteAbierto(true)}
            className="px-4 py-2 bg-surface border border-line rounded-md hover:bg-canvas transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <Wand2 size={16} /> Armar puesto
          </button>
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

      {asistenteAbierto && (
        <AsistentePuestoModal
          onClose={() => setAsistenteAbierto(false)}
          onListo={() => {
            setAsistenteAbierto(false);
            cargar();
          }}
        />
      )}

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
          ) : vista === 'puesto' ? (
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
          ) : (
            <table className="w-full border-collapse">
              <thead className="sticky top-0 bg-surface z-10">
                <tr className="border-b border-line bg-canvas/50 text-[10px] font-bold text-muted uppercase tracking-tighter">
                  <th className="p-3 border-r border-line min-w-[180px] bg-surface text-left">Vigilador</th>
                  {diasArray.map((day) => (
                    <th
                      key={day}
                      className={`p-1 border-r border-line text-center min-w-[34px] ${esFinDeSemana(day) ? 'bg-amber/5' : ''}`}
                    >
                      {day}
                    </th>
                  ))}
                  <th className="p-2 border-l-2 border-line text-center min-w-[64px] bg-surface">Total hs</th>
                </tr>
              </thead>
              <tbody className="text-[10px]">
                {filasVigilador.map((row) => (
                  <tr key={row.vigiladorId} className="border-b border-line hover:bg-canvas/30 transition-colors">
                    <td className="p-2 border-r border-line font-bold text-navy max-w-[200px]">
                      <span className="block truncate">{row.nombre}</span>
                    </td>
                    {diasArray.map((day) => {
                      const turnos = row.turnosPorDia.get(day) ?? [];
                      return (
                        <td
                          key={day}
                          title={turnos
                            .map((t) => {
                              const hi = new Date(t.inicioPlan).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                              const hf = new Date(t.finPlan).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                              return `${hi}–${hf} (${fmtH(horasTurno(t))}h)`;
                            })
                            .join('\n')}
                          className={`p-1 border-r border-line text-center align-middle ${
                            turnos.length > 0 ? 'bg-brand-blue/10' : esFinDeSemana(day) ? 'bg-amber/5' : ''
                          }`}
                        >
                          {turnos.length === 0 ? (
                            <span className="text-muted">-</span>
                          ) : (
                            <div className="leading-tight">
                              <div className="font-bold text-brand-blue">{turnos.map(letraTurno).join('/')}</div>
                              <div className="text-navy/70">{fmtH(horasDiaVig(row, day))}</div>
                            </div>
                          )}
                        </td>
                      );
                    })}
                    <td className="p-2 border-l-2 border-line text-center font-bold text-navy bg-canvas/40">
                      {fmtH(totalVig(row))}
                    </td>
                  </tr>
                ))}
                {/* Totales por día y total general (como en la planilla). */}
                <tr className="border-t-2 border-line bg-canvas/60 font-bold text-navy sticky bottom-0">
                  <td className="p-2 border-r border-line text-right uppercase text-[9px] tracking-widest">Total de horas</td>
                  {diasArray.map((day) => (
                    <td key={day} className="p-1 border-r border-line text-center">
                      {totalDia(day) > 0 ? fmtH(totalDia(day)) : ''}
                    </td>
                  ))}
                  <td className="p-2 border-l-2 border-line text-center bg-emerald/10 text-emerald">{fmtH(granTotal)}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
