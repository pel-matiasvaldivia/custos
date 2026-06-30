import { useEffect, useState } from 'react';
import { comprasService, OrdenCompra } from '../../services/compras';
import { CheckCircle, Clock, AlertTriangle, Plus, Package, CreditCard } from 'lucide-react';

const ComprasPage = () => {
  const [ordenes, setOrdenes] = useState<OrdenCompra[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const data = await comprasService.getOrdenes();
      setOrdenes(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case 'EN_APROBACION': return <Clock className="text-amber-500" size={20} />;
      case 'APROBADA': return <CheckCircle className="text-blue-500" size={20} />;
      case 'RECIBIDA': return <Package className="text-emerald-500" size={20} />;
      case 'PAGADA': return <CreditCard className="text-indigo-500" size={20} />;
      default: return <AlertTriangle className="text-slate-500" size={20} />;
    }
  };

  if (loading) return <div className="p-6">Cargando módulo de compras...</div>;

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Módulo de Compras (M5)</h1>
          <p className="text-slate-500 mt-1">Gestión de abastecimiento y flujo de aprobación.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition-all shadow-lg hover:shadow-indigo-200 active:scale-95">
          <Plus size={20} />
          <span>Nueva Orden</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-sm">Pendientes Aprobación</p>
          <p className="text-2xl font-bold text-slate-900">{ordenes.filter(o => o.estado === 'EN_APROBACION').length}</p>
        </div>
        {/* Statistics cards... */}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">Proveedor</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">Fecha</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">Total</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">Estado</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {ordenes.map(oc => (
              <tr key={oc.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{oc.proveedor_nombre}</td>
                <td className="px-6 py-4 text-slate-600 text-sm">{new Date(oc.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4 font-bold text-slate-900">${oc.total.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 w-fit">
                    {getStatusIcon(oc.estado)}
                    <span className="text-xs font-semibold text-slate-700">{oc.estado.replace('_', ' ')}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold">Detalles</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComprasPage;
