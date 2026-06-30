import { useEffect, useState } from 'react';
import { clienteService, Cliente } from '../../services/cliente.service';

const campoClase =
  'w-full px-3 py-2 bg-canvas border border-line rounded-md focus:ring-2 focus:ring-brand-blue/20 outline-none text-sm';
const labelClase = 'text-xs font-medium text-muted uppercase tracking-wider';

interface Props {
  clienteId: string;
  onChange: (clienteId: string, clienteNombre: string) => void;
}

export const ClientePicker = ({ clienteId, onChange }: Props) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [modoNuevo, setModoNuevo] = useState(false);
  const [creando, setCreando] = useState(false);
  const [nuevaRazonSocial, setNuevaRazonSocial] = useState('');

  useEffect(() => {
    clienteService.getAll().then((data) => {
      setClientes(data);
      if (data.length === 0) setModoNuevo(true);
    });
  }, []);

  const handleSelect = (id: string) => {
    const cliente = clientes.find((c) => c.id === id);
    onChange(id, cliente?.razon_social || '');
  };

  const handleCrear = async () => {
    if (!nuevaRazonSocial.trim()) return;
    setCreando(true);
    try {
      const creado = await clienteService.create({ razon_social: nuevaRazonSocial.trim() });
      setClientes((prev) => [...prev, creado]);
      onChange(creado.id, creado.razon_social);
      setModoNuevo(false);
      setNuevaRazonSocial('');
    } finally {
      setCreando(false);
    }
  };

  if (!modoNuevo) {
    return (
      <div className="space-y-1">
        <label className={labelClase}>Cliente</label>
        <select className={campoClase} value={clienteId} onChange={(e) => handleSelect(e.target.value)} required>
          <option value="" disabled>
            Seleccioná un cliente
          </option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.razon_social}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setModoNuevo(true)}
          className="text-brand-blue hover:text-brand-deep text-xs font-medium"
        >
          + Crear un cliente nuevo
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <label className={labelClase}>Cliente nuevo</label>
      <div className="flex gap-2">
        <input
          className={campoClase}
          value={nuevaRazonSocial}
          onChange={(e) => setNuevaRazonSocial(e.target.value)}
          placeholder="Razón social"
        />
        <button
          type="button"
          onClick={handleCrear}
          disabled={creando || !nuevaRazonSocial.trim()}
          className="px-3 py-2 bg-brand-blue text-white rounded-md text-sm font-medium disabled:opacity-60 whitespace-nowrap"
        >
          {creando ? 'Creando...' : 'Crear'}
        </button>
      </div>
      {clientes.length > 0 && (
        <button
          type="button"
          onClick={() => setModoNuevo(false)}
          className="text-brand-blue hover:text-brand-deep text-xs font-medium"
        >
          Usar un cliente existente
        </button>
      )}
    </div>
  );
};
