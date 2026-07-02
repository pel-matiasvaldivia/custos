import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Plus, Printer, QrCode, MapPin } from 'lucide-react';
import { puntoControlService, PuntoControl } from '../../services/puntoControl.service';
import { Puesto } from '../../services/objetivo.service';

interface Props {
  objetivoNombre: string;
  puestos: Puesto[];
}

interface PuntoConPuesto extends PuntoControl {
  puestoNombre: string;
}

export const PuntosControlSection = ({ objetivoNombre, puestos }: Props) => {
  const [puntos, setPuntos] = useState<PuntoConPuesto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [creando, setCreando] = useState(false);
  const [nuevoPuestoId, setNuevoPuestoId] = useState('');
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [qrPreview, setQrPreview] = useState<{ punto: PuntoConPuesto; dataUrl: string } | null>(null);

  const cargar = async () => {
    setCargando(true);
    try {
      const result: PuntoConPuesto[] = [];
      for (const p of puestos) {
        const lista = await puntoControlService.listarPorPuesto(p.id);
        lista.forEach((pc) => result.push({ ...pc, puestoNombre: p.nombre }));
      }
      setPuntos(result);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (puestos.length > 0) cargar();
    else {
      setPuntos([]);
      setCargando(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [puestos.map((p) => p.id).join(',')]);

  const handleCrear = async () => {
    if (!nuevoPuestoId || !nuevoNombre.trim()) {
      setError('Elegí un puesto y escribí un nombre para el punto.');
      return;
    }
    setError(null);
    try {
      await puntoControlService.crear({ puesto_id: nuevoPuestoId, nombre: nuevoNombre.trim() });
      setNuevoNombre('');
      setNuevoPuestoId('');
      setCreando(false);
      cargar();
    } catch {
      setError('No se pudo crear el punto de control.');
    }
  };

  const generarQr = async (punto: PuntoConPuesto) => {
    const contenido = punto.codigo_qr || punto.id;
    const dataUrl = await QRCode.toDataURL(contenido, { width: 512, margin: 2 });
    setQrPreview({ punto, dataUrl });
  };

  const imprimir = () => {
    if (!qrPreview) return;
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`
      <html>
        <head>
          <title>QR ${qrPreview.punto.nombre}</title>
          <style>
            body { font-family: sans-serif; text-align: center; padding: 40px; }
            h1 { font-size: 42px; margin: 20px 0 6px; }
            h2 { font-size: 24px; color: #555; margin: 0 0 30px; font-weight: normal; }
            img { width: 480px; height: 480px; }
            p { color: #888; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <h1>${qrPreview.punto.nombre}</h1>
          <h2>${objetivoNombre} · ${qrPreview.punto.puestoNombre}</h2>
          <img src="${qrPreview.dataUrl}" />
          <p>Escaneá este código con la app CustOS GO durante la ronda</p>
          <script>window.onload = () => window.print();</script>
        </body>
      </html>
    `);
    w.document.close();
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-display font-bold text-navy flex items-center gap-2">
          <QrCode className="text-brand-blue" size={20} /> Puntos de control (rondas)
        </h3>
        {puestos.length > 0 && (
          <button
            onClick={() => setCreando(true)}
            className="text-brand-blue hover:text-brand-deep transition-colors text-sm font-medium flex items-center gap-1"
          >
            <Plus size={16} /> Agregar punto
          </button>
        )}
      </div>

      {puestos.length === 0 ? (
        <p className="text-sm text-muted py-2 text-center">
          Cargá al menos un puesto para poder crear puntos de control.
        </p>
      ) : cargando ? (
        <p className="text-sm text-muted py-2 text-center">Cargando...</p>
      ) : puntos.length === 0 ? (
        <p className="text-sm text-muted py-2 text-center">
          Todavía no hay puntos de control. Creá uno y pegá el QR impreso en el lugar físico.
        </p>
      ) : (
        <ul className="space-y-2">
          {puntos.map((p) => (
            <li
              key={p.id}
              className="flex justify-between items-center p-3 border border-line rounded-lg bg-canvas"
            >
              <div className="min-w-0">
                <p className="font-medium text-sm text-navy">{p.nombre}</p>
                <p className="text-xs text-muted flex items-center gap-1">
                  <MapPin size={11} /> {p.puestoNombre}
                </p>
              </div>
              <button
                onClick={() => generarQr(p)}
                className="text-brand-blue hover:text-brand-deep transition-colors text-xs font-medium flex items-center gap-1 shrink-0"
              >
                <QrCode size={14} /> Ver QR
              </button>
            </li>
          ))}
        </ul>
      )}

      {creando && (
        <div className="mt-4 p-4 border border-brand-blue/30 bg-brand-blue/5 rounded-lg space-y-3">
          <div>
            <label className="text-xs font-medium text-muted uppercase tracking-wider">Puesto</label>
            <select
              value={nuevoPuestoId}
              onChange={(e) => setNuevoPuestoId(e.target.value)}
              className="w-full mt-1 border border-line rounded-lg p-2 text-sm bg-white"
            >
              <option value="">Elegí un puesto...</option>
              {puestos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted uppercase tracking-wider">Nombre del punto</label>
            <input
              value={nuevoNombre}
              onChange={(e) => setNuevoNombre(e.target.value)}
              placeholder="Ej: Acceso principal, Depósito Este..."
              className="w-full mt-1 border border-line rounded-lg p-2 text-sm"
            />
          </div>
          {error && <p className="text-xs text-amber">{error}</p>}
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => {
                setCreando(false);
                setError(null);
                setNuevoNombre('');
                setNuevoPuestoId('');
              }}
              className="text-xs text-muted hover:text-navy px-3 py-1.5"
            >
              Cancelar
            </button>
            <button
              onClick={handleCrear}
              className="text-xs bg-brand-blue text-white px-3 py-1.5 rounded font-medium hover:bg-brand-deep transition-colors"
            >
              Crear punto
            </button>
          </div>
        </div>
      )}

      {qrPreview && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => setQrPreview(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-md w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-display font-bold text-navy">{qrPreview.punto.nombre}</h3>
            <p className="text-sm text-muted mb-4">
              {objetivoNombre} · {qrPreview.punto.puestoNombre}
            </p>
            <img src={qrPreview.dataUrl} alt="QR" className="mx-auto w-64 h-64" />
            <p className="text-xs text-muted mt-4">
              Imprimí este código y pegalo en el lugar físico. Los guardias lo escanean con la app durante la ronda.
            </p>
            <div className="flex gap-2 justify-center mt-5">
              <button
                onClick={() => setQrPreview(null)}
                className="text-sm text-muted hover:text-navy px-4 py-2"
              >
                Cerrar
              </button>
              <button
                onClick={imprimir}
                className="text-sm bg-brand-blue text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-deep transition-colors flex items-center gap-2"
              >
                <Printer size={14} /> Imprimir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
