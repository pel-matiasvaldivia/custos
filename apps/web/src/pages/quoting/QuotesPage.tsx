import { useState, useEffect } from 'react';
import { Plus, Search, CheckCircle2, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const QuotesPage = () => {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/cotizaciones')
      .then(res => res.json())
      .then(data => {
        setQuotes(data);
        setLoading(false);
      });
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACEPTADA':
        return <span className="bg-emerald/10 text-emerald px-2 py-1 rounded text-xs font-bold ring-1 ring-emerald/20 flex items-center gap-1 w-fit"><CheckCircle2 size={12}/> ACEPTADA</span>;
      case 'BORRADOR':
        return <span className="bg-zinc-100 text-zinc-500 px-2 py-1 rounded text-xs font-bold ring-1 ring-zinc-200 flex items-center gap-1 w-fit"><Clock size={12}/> BORRADOR</span>;
      default:
        return <span className="bg-zinc-100 text-zinc-500 px-2 py-1 rounded text-xs font-bold ring-1 ring-zinc-200">{status}</span>;
    }
  };

  return (
    <div className="space-y-8">
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
              <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider w-20"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface/10">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-muted italic">Cargando...</td></tr>
            ) : quotes.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-muted italic">No hay cotizaciones emitidas.</td></tr>
            ) : quotes.map(quote => (
              <tr key={quote.id} className="hover:bg-canvas/50 transition-colors">
                <td className="px-6 py-4">
                  <span className="font-bold text-navy block">{quote.cliente_nombre}</span>
                  <span className="text-xs text-muted">ID: {quote.id.slice(0,8)}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-mono font-bold text-navy">${Number(quote.total_mensual).toLocaleString()}</span>
                </td>
                <td className="px-6 py-4 text-sm text-muted">
                  {new Date(quote.vencimiento).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(quote.estado)}
                </td>
                <td className="px-6 py-4">
                  <button className="text-brand-blue hover:underline text-sm font-bold">Ver</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
