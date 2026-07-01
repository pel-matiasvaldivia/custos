import { useEffect, useState } from 'react';
import { Plus, Trash2, ListChecks } from 'lucide-react';
import { catalogoService, CatalogoItemOption } from '../../services/catalogo.service';

const LISTAS = [
  { categoria: 'CREDENCIAL_TIPO', titulo: 'Tipos de Credencial' },
  { categoria: 'NOVEDAD_TIPO', titulo: 'Novedades' },
];

const ListaCatalogo = ({ categoria, titulo }: { categoria: string; titulo: string }) => {
  const [items, setItems] = useState<CatalogoItemOption[]>([]);
  const [nuevaEtiqueta, setNuevaEtiqueta] = useState('');
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargar = async () => {
    const data = await catalogoService.getItems(categoria);
    setItems(data);
  };

  useEffect(() => {
    setLoading(true);
    cargar().finally(() => setLoading(false));
  }, [categoria]);

  const handleAgregar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevaEtiqueta.trim()) return;
    setEnviando(true);
    setError(null);
    try {
      await catalogoService.create(categoria, nuevaEtiqueta.trim());
      setNuevaEtiqueta('');
      await cargar();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'No se pudo agregar el item.');
    } finally {
      setEnviando(false);
    }
  };

  const handleEliminar = async (item: CatalogoItemOption) => {
    if (!item.id) return;
    await catalogoService.remove(categoria, item.id);
    await cargar();
  };

  return (
    <div className="card space-y-4">
      <h3 className="text-lg font-bold text-navy flex items-center gap-2 border-b pb-2">
        <ListChecks size={20} className="text-brand-blue" /> {titulo}
      </h3>

      {loading ? (
        <p className="text-sm text-muted">Cargando...</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item.codigo}
              className="flex justify-between items-center px-3 py-2 bg-canvas border border-line rounded-md text-sm"
            >
              <span className="text-navy">{item.etiqueta}</span>
              {item.esDefault ? (
                <span className="text-xs text-muted italic">Predeterminado</span>
              ) : (
                <button
                  onClick={() => handleEliminar(item)}
                  className="text-muted hover:text-red-600 transition-colors"
                  title="Quitar"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleAgregar} className="flex gap-2 pt-2">
        <input
          className="input flex-1"
          placeholder="Nuevo item (ej: Carnet de Conducir A1)"
          value={nuevaEtiqueta}
          onChange={(e) => setNuevaEtiqueta(e.target.value)}
        />
        <button type="submit" className="btn btn-primary flex items-center gap-2" disabled={enviando}>
          <Plus size={16} /> Agregar
        </button>
      </form>
      {error && <p className="text-sm text-amber">{error}</p>}
    </div>
  );
};

export const CatalogosTab = () => {
  return (
    <div className="space-y-6">
      <p className="text-muted">
        Agregá tus propios items a las listas que usa el sistema. Los predeterminados no se pueden eliminar.
      </p>
      {LISTAS.map((lista) => (
        <ListaCatalogo key={lista.categoria} categoria={lista.categoria} titulo={lista.titulo} />
      ))}
    </div>
  );
};
