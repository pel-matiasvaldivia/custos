import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Puesto } from '../../services/objetivo.service';
import { vigilanteService, Vigilador } from '../../services/vigilante.service';
import { cuadranteService, EsquemaTurno, GeneracionResultado } from '../../services/cuadrante.service';
import { EsquemaTurnoForm } from './EsquemaTurnoForm';

const hoyIso = () => new Date().toISOString().slice(0, 10);

interface Props {
  puesto: Puesto;
  onClose: () => void;
  onAfectado: () => void;
}

export const AfectarVigiladorModal = ({ puesto, onClose, onAfectado }: Props) => {
  const [esquemas, setEsquemas] = useState<EsquemaTurno[]>([]);
  const [vigiladores, setVigiladores] = useState<Vigilador[]>([]);
  const [esquemaId, setEsquemaId] = useState('');
  const [vigiladorId, setVigiladorId] = useState('');
  const [fechaAncla, setFechaAncla] = useState(hoyIso());
  const [vigenteDesde, setVigenteDesde] = useState(hoyIso());
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalNuevoEsquema, setModalNuevoEsquema] = useState(false);
  const [resultado, setResultado] = useState<GeneracionResultado | null>(null);
  const [noDisponibles, setNoDisponibles] = useState(0);

  const cargar = async () => {
    const [eList, vList] = await Promise.all([cuadranteService.listarEsquemas(), vigilanteService.getAll()]);
    setEsquemas(eList);
    const activos = vList.filter((v) => v.estado === 'ACTIVO');
    setVigiladores(activos);
    setNoDisponibles(vList.length - activos.length);
    if (eList.length > 0) setEsquemaId((prev) => prev || eList[0].id);
  };

  useEffect(() => {
    cargar();
  }, []);

  useEffect(() => {
    if (vigiladores.length > 0 && !vigiladorId) setVigiladorId(vigiladores[0].id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vigiladores]);

  const handleEsquemaCreado = (esquema: EsquemaTurno) => {
    setEsquemas((prev) => [...prev, esquema]);
    setEsquemaId(esquema.id);
    setModalNuevoEsquema(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!esquemaId || !vigiladorId) {
      setError('Elegí un esquema y un vigilador.');
      return;
    }
    setEnviando(true);
    setError(null);
    try {
      const { generacion } = await cuadranteService.crearAsignacion({
        puesto_id: puesto.id,
        vigilador_id: vigiladorId,
        esquema_id: esquemaId,
        fecha_ancla: fechaAncla,
        vigente_desde: vigenteDesde,
      });
      setResultado(generacion);
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'No se pudo afectar al vigilador.');
    } finally {
      setEnviando(false);
    }
  };

  const campoClase =
    'w-full px-3 py-2 bg-canvas border border-line rounded-md focus:ring-2 focus:ring-brand-blue/20 outline-none text-sm';
  const labelClase = 'text-xs font-medium text-muted uppercase tracking-wider';

  if (resultado) {
    return (
      <div className="fixed inset-0 bg-navy/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-surface w-full max-w-sm rounded-xl shadow-xl border border-line animate-in fade-in zoom-in duration-200 p-6 space-y-4">
          <h3 className="text-lg font-display font-bold text-navy">Vigilador afectado</h3>
          <div className="p-3 rounded-lg border border-emerald/30 bg-emerald/5 text-sm text-emerald">
            Se generaron {resultado.creados} de {resultado.generados} turno(s).
          </div>
          {resultado.rechazados.length > 0 && (
            <div className="p-3 rounded-lg border border-amber/30 bg-amber/5 text-sm text-amber space-y-1">
              <p className="font-medium">{resultado.rechazados.length} turno(s) no se pudieron generar:</p>
              <ul className="text-xs space-y-0.5 max-h-32 overflow-y-auto">
                {resultado.rechazados.map((r, i) => (
                  <li key={i}>
                    {new Date(r.inicio_plan).toLocaleDateString('es-AR')}: {r.errores.join(', ')}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button onClick={onAfectado} className="w-full btn-primary">
            Listo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-navy/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface w-full max-w-sm rounded-xl shadow-xl border border-line animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-line flex justify-between items-center shrink-0">
          <div>
            <h3 className="text-lg font-display font-bold text-navy">Afectar vigilador</h3>
            <p className="text-xs text-muted">{puesto.nombre}</p>
          </div>
          <button onClick={onClose} className="text-muted hover:text-navy transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className={labelClase}>Esquema de turno</label>
              <button
                type="button"
                onClick={() => setModalNuevoEsquema(true)}
                className="text-xs text-brand-blue font-medium hover:underline"
              >
                + Crear esquema nuevo
              </button>
            </div>
            {esquemas.length === 0 ? (
              <p className="text-xs text-amber">No hay esquemas de turno creados todavía.</p>
            ) : (
              <select className={campoClase} value={esquemaId} onChange={(e) => setEsquemaId(e.target.value)}>
                {esquemas.map((eq) => (
                  <option key={eq.id} value={eq.id}>
                    {eq.nombre} ({eq.dias_ciclo} días)
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="space-y-1">
            <label className={labelClase}>Vigilador</label>
            {vigiladores.length === 0 ? (
              <p className="text-xs text-amber">No hay vigiladores activos en la nómina.</p>
            ) : (
              <select className={campoClase} value={vigiladorId} onChange={(e) => setVigiladorId(e.target.value)}>
                {vigiladores.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.apellido}, {v.nombre}
                  </option>
                ))}
              </select>
            )}
            <p className="text-[11px] text-muted">
              Solo se puede afectar personal Activo.
              {noDisponibles > 0 &&
                ` ${noDisponibles} vigilador(es) no figuran por estar de enfermo, vacaciones, licencia, suspendidos o de baja.`}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className={labelClase}>Fecha ancla</label>
              <input
                type="date"
                className={campoClase}
                value={fechaAncla}
                onChange={(e) => setFechaAncla(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <label className={labelClase}>Vigente desde</label>
              <input
                type="date"
                className={campoClase}
                value={vigenteDesde}
                onChange={(e) => setVigenteDesde(e.target.value)}
                required
              />
            </div>
          </div>

          {error && <div className="p-3 bg-amber/10 border border-amber/30 rounded-md text-sm text-amber">{error}</div>}

          <div className="pt-2 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-line text-muted font-medium rounded-md hover:bg-canvas transition-colors">
              Cancelar
            </button>
            <button type="submit" className="flex-1 btn-primary" disabled={enviando || esquemas.length === 0 || vigiladores.length === 0}>
              {enviando ? 'Afectando...' : 'Afectar'}
            </button>
          </div>
        </form>
      </div>

      {modalNuevoEsquema && (
        <EsquemaTurnoForm onClose={() => setModalNuevoEsquema(false)} onCreado={handleEsquemaCreado} />
      )}
    </div>
  );
};
