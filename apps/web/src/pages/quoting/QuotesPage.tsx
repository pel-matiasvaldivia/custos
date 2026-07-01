import { useState, useEffect } from 'react';
import { Plus, Search, CheckCircle2, Clock, Send, XCircle, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cotizacionService, Cotizacion, EstadoCotizacion } from '../../services/cotizacion.service';
import { CotizacionDocumentoModal } from './CotizacionDocumentoModal';
import { ContratoCreatedModal } from './ContratoCreatedModal';
import { PageHint } from '../../components/common/PageHint';
import { Contrato } from '../../services/objetivo.service';

export const QuotesPage = () => {
  const [quotes, setQuotes] = useState<Cotizacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [actuando, setActuando] = useState<string | null>(null);
  const [modalDocumento, setModalDocumento] = useState<Cotizacion | null>(null);
  const [contratoCreado, setContratoCreado] = useState<Contrato | null>(null);

  const cargar = () => {
    cotizacionService
      .getAll()
      .then((data) => setQuotes(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    cargar();
  }, []);

  const cambiarEstado = async (id: string, estado: EstadoCotizacion) => {
    setActuando(id);
    try {
      const { contrato } = await cotizacionService.cambiarEstado(id, estado);
      cargar();
      if (estado === 'ACEPTADA' && contrato) {
        setContratoCreado(contrato);
      }
    } catch (err) {
      alert(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'No se pudo cambiar el estado de la cotización.',
      );
    } finally {
      setActuando(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACEPTADA':
        return <span className="bg-emerald/10 text-emerald px-2 py-1 rounded text-xs font-bold ring-1 ring-emerald/20 flex items-center gap-1 w-fit"><CheckCircle2 size={12}/> ACEPTADA</span>;
      case 'RECHAZADA':
        return <span className="bg-red-50 text-red-600 px-2 py-1 rounded text-xs font-bold ring-1 ring-red-200 flex items-center gap-1 w-fit"><XCircle size={12}/> RECHAZADA</span>;
      case 'ENVIADA':
        return <span className="bg-brand-blue/10 text-brand-blue px-2 py-1 rounded text-xs font-bold ring-1 ring-brand-blue/20 flex items-center gap-1 w-fit"><Send size={12}/> ENVIADA</span>;
      case 'BORRADOR':
        return <span className="bg-zinc-100 text-zinc-500 px-2 py-1 rounded text-xs font-bold ring-1 ring-zinc-200 flex items-center gap-1 w-fit"><Clock size={12}/> BORRADOR</span>;
      default:
        return <span className="bg-zinc-100 text-zinc-500 px-2 py-1 rounded text-xs font-bold ring-1 ring-zinc-200">{status}</span>;
    }
  };

  return (
    <div className="space-y-8">
      <PageHint id="cotizaciones" title="Presupuestá servicios y generá el PDF">
        Creá una cotización cargando ítems por horas hombre, vehículo o servicios especiales. Al aceptarla
        podés convertirla en contrato, y generar el PDF con tu logo y la firma del director.
      </PageHint>
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-display font-bold text-navy">Cotizaciones</h2>
          <p className="text-muted text-lg">Gestiona tus propuestas comerciales y presupuestos.</p>
        </div>
        <Link to="/quotes/new" className="btn btn-primary flex items-center gap-2">
          <Plus size={20} />
          Nueva Cotización
        </Link>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
          <input type="text" placeholder="Buscar por cliente o número..." className="input pl-10" />
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-canvas border-b border-surface/10">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Cliente</th>
              <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Total Mensual</th>
              <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Vencimiento</th>
              <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Estado</th>
              <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Documento</th>
              <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface/10">
            {loading ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-muted italic">Cargando...</td></tr>
            ) : quotes.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-muted italic">No hay cotizaciones emitidas.</td></tr>
            ) : quotes.map(quote => (
              <tr key={quote.id} className="hover:bg-canvas/50 transition-colors">
                <td className="px-6 py-4">
                  <span className="font-bold text-navy block">{quote.cliente_nombre}</span>
                  <span className="text-xs text-muted font-mono">COT-{quote.id.slice(0,8).toUpperCase()}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-mono font-bold text-navy">${Number(quote.total_mensual).toLocaleString()}</span>
                </td>
                <td className="px-6 py-4 text-sm text-muted">
                  {new Date(quote.vencimiento).toLocaleDateString('es-AR')}
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(quote.estado)}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => setModalDocumento(quote)}
                    className="flex items-center gap-1.5 text-sm text-brand-blue hover:underline font-medium"
                  >
                    <FileText size={14} />
                    {quote.documento_key ? 'Ver / editar' : 'Generar'}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {quote.estado === 'BORRADOR' && (
                      <button
                        disabled={actuando === quote.id}
                        onClick={() => cambiarEstado(quote.id, 'ENVIADA')}
                        className="text-brand-blue hover:underline text-sm font-bold disabled:opacity-50"
                      >
                        Enviar
                      </button>
                    )}
                    {quote.estado === 'ENVIADA' && (
                      <>
                        <button
                          disabled={actuando === quote.id}
                          onClick={() => cambiarEstado(quote.id, 'ACEPTADA')}
                          className="text-emerald hover:underline text-sm font-bold disabled:opacity-50"
                        >
                          Aceptar
                        </button>
                        <button
                          disabled={actuando === quote.id}
                          onClick={() => cambiarEstado(quote.id, 'RECHAZADA')}
                          className="text-red-600 hover:underline text-sm font-bold disabled:opacity-50"
                        >
                          Rechazar
                        </button>
                      </>
                    )}
                    {(quote.estado === 'ACEPTADA' || quote.estado === 'RECHAZADA') && (
                      <span className="text-xs text-muted italic">Sin más acciones</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalDocumento && (
        <CotizacionDocumentoModal
          cotizacion={modalDocumento}
          onClose={() => setModalDocumento(null)}
          onGenerado={() => {
            cargar();
            setModalDocumento(null);
          }}
        />
      )}

      {contratoCreado && (
        <ContratoCreatedModal
          contrato={contratoCreado}
          onClose={() => setContratoCreado(null)}
        />
      )}
    </div>
  );
};
