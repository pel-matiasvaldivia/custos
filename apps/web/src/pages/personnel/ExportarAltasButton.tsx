import { useState } from 'react';
import { FileDown, Loader2 } from 'lucide-react';
import { arcaService } from '../../services/arca.service';

/**
 * Descarga el .txt de altas de ARCA para los legajos seleccionados en la tabla.
 * El backend valida que pertenezcan al tenant y que tengan CUIL cargado.
 */
export const ExportarAltasButton = ({ ids }: { ids: string[] }) => {
  const [descargando, setDescargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportar = async () => {
    setDescargando(true);
    setError(null);
    try {
      await arcaService.descargarAltas(ids);
    } catch (e) {
      // El blob de error viene como Blob; intentamos leer el mensaje.
      const data = (e as { response?: { data?: unknown } })?.response?.data;
      if (data instanceof Blob) {
        try {
          const txt = await data.text();
          setError(JSON.parse(txt).message ?? 'No se pudo exportar.');
        } catch {
          setError('No se pudo exportar el archivo de altas.');
        }
      } else {
        setError('No se pudo exportar el archivo de altas.');
      }
    } finally {
      setDescargando(false);
    }
  };

  return (
    <div className="flex flex-col items-end">
      <button onClick={exportar} disabled={descargando || ids.length === 0}
        className="btn-secondary flex items-center gap-2 disabled:opacity-50">
        {descargando ? <Loader2 size={16} className="animate-spin" /> : <FileDown size={16} />}
        Exportar altas ARCA ({ids.length})
      </button>
      {error && <span className="text-xs text-amber mt-1">{error}</span>}
    </div>
  );
};
