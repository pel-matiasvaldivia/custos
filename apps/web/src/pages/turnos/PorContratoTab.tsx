import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ChevronRight, Users, AlertTriangle, CheckCircle2, FileText } from 'lucide-react';
import { objetivoService, ObjetivoDetalle } from '../../services/objetivo.service';

/** Vista orientada a RRHH: cada objetivo con contrato, sus horas a cubrir y si la dotación alcanza. */
export const PorContratoTab = () => {
  const navigate = useNavigate();
  const [detalles, setDetalles] = useState<ObjetivoDetalle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let activo = true;
    (async () => {
      setLoading(true);
      try {
        const objetivos = await objetivoService.getAll(1, 100);
        const results = await Promise.all(
          objetivos.map((o) => objetivoService.getDetalle(o.id).catch(() => null)),
        );
        if (activo) setDetalles(results.filter((d): d is ObjetivoDetalle => d !== null));
      } finally {
        if (activo) setLoading(false);
      }
    })();
    return () => {
      activo = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="card py-10 flex items-center justify-center text-muted">
        <Loader2 className="animate-spin mr-2" size={18} /> Calculando horas por contrato...
      </div>
    );
  }

  // Ordenar: primero los que tienen contrato, y dentro de esos los que no cubren la dotación.
  const ordenados = [...detalles].sort((a, b) => {
    const ca = a.contrato ? 1 : 0;
    const cb = b.contrato ? 1 : 0;
    if (ca !== cb) return cb - ca;
    const sa = a.dotacion.suficiente ? 1 : 0;
    const sb = b.dotacion.suficiente ? 1 : 0;
    return sa - sb;
  });

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted max-w-2xl">
        Cada objetivo con su contrato vinculado: cuántas horas semanales hay que cubrir según los puestos, cuántos
        vigiladores hacen falta y si la dotación actual alcanza. Entrá a un objetivo para armar el cuadrante.
      </p>

      {ordenados.length === 0 ? (
        <div className="card py-10 text-center text-muted">No hay objetivos cargados todavía.</div>
      ) : (
        <div className="space-y-2">
          {ordenados.map((d) => {
            const { objetivo, contrato, dotacion, puestos } = d;
            const cubre = dotacion.suficiente;
            return (
              <button
                key={objetivo.id}
                onClick={() => navigate(`/objectives/${objetivo.id}`)}
                className="w-full text-left card hover:border-brand-blue/40 hover:shadow-sm transition-all flex items-center gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-navy truncate">{objetivo.nombre}</p>
                    {contrato ? (
                      <span className="inline-flex items-center gap-1 text-[10px] text-muted bg-canvas border border-line rounded-full px-2 py-0.5">
                        <FileText size={10} /> {contrato.codigo}
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber bg-amber/5 border border-amber/20 rounded-full px-2 py-0.5">
                        Sin contrato
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted mt-0.5 truncate">
                    {objetivo.cliente_nombre} · {puestos.length} puesto(s)
                  </p>
                </div>

                <div className="hidden sm:flex flex-col items-end shrink-0">
                  <span className="text-sm font-bold text-navy">{dotacion.horasSemanales} hs/sem</span>
                  <span className="text-[11px] text-muted flex items-center gap-1">
                    <Users size={11} /> {dotacion.vigiladoresRequeridos} req. · {dotacion.vigiladoresActivosTotal} activos
                  </span>
                </div>

                <span
                  className={`shrink-0 inline-flex items-center gap-1 text-xs font-medium rounded-full px-2.5 py-1 ${
                    cubre ? 'text-emerald bg-emerald/5' : 'text-amber bg-amber/5'
                  }`}
                >
                  {cubre ? <CheckCircle2 size={13} /> : <AlertTriangle size={13} />}
                  {cubre ? 'Dotación OK' : 'Falta dotación'}
                </span>

                <ChevronRight size={18} className="text-muted shrink-0" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
