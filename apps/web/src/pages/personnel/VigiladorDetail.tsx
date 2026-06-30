import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { vigilanteService, Vigilador, Completitud } from '../../services/vigilante.service';
import { credencialService, Credencial } from '../../services/credencial.service';
import { ArrowLeft, Plus, AlertCircle, FileCheck, User, MapPin, Phone, Pencil } from 'lucide-react';
import { CredencialForm } from './CredencialForm';
import { VigiladorEditForm } from './VigiladorEditForm';

const ETIQUETAS_TIPO: Record<string, string> = {
  CARNET_VIGILADOR: 'Carnet de Vigilador',
  PSICOFISICO: 'Psicofísico',
  ANTECEDENTES: 'Antecedentes',
  ANMAC: 'ANMAC',
  CAPACITACION: 'Capacitación',
};

const ETIQUETAS_FALTANTE: Record<string, string> = {
  foto: 'Foto actualizada',
  domicilio: 'Domicilio',
  telefono: 'Teléfono de contacto',
  'credencial:CARNET_VIGILADOR': 'Carnet de Vigilador',
  'credencial:PSICOFISICO': 'Psicofísico',
  'credencial:ANTECEDENTES': 'Certificado de Antecedentes',
};

const estaVencida = (venceEl?: string | null) => {
  if (!venceEl) return false;
  return new Date(venceEl) < new Date();
};

const proximaAVencer = (venceEl?: string | null) => {
  if (!venceEl) return false;
  const dias = (new Date(venceEl).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
  return dias >= 0 && dias <= 30;
};

export const VigiladorDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vigilador, setVigilador] = useState<Vigilador | null>(null);
  const [credenciales, setCredenciales] = useState<Credencial[]>([]);
  const [completitud, setCompletitud] = useState<Completitud | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalCredencialAbierto, setModalCredencialAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);

  const cargarTodo = async () => {
    if (!id) return;
    const [v, creds, comp] = await Promise.all([
      vigilanteService.getOne(id),
      credencialService.getByVigilador(id),
      vigilanteService.getCompletitud(id),
    ]);
    setVigilador(v);
    setCredenciales(creds);
    setCompletitud(comp);
  };

  useEffect(() => {
    setLoading(true);
    cargarTodo().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleFoto = async (file: File) => {
    if (!id) return;
    const actualizado = await vigilanteService.subirFoto(id, file);
    setVigilador(actualizado);
    const comp = await vigilanteService.getCompletitud(id);
    setCompletitud(comp);
  };

  const handleVerDocumento = async (credencialId: string) => {
    if (!id) return;
    const blob = await credencialService.descargarDocumento(id, credencialId);
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  };

  if (loading) return <div className="p-8 text-muted">Cargando detalles...</div>;
  if (!vigilador) return <div className="p-8 text-amber">Vigilador no encontrado.</div>;

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/personnel')}
        className="text-muted hover:text-navy transition-colors flex items-center gap-2 font-medium"
      >
        <ArrowLeft size={18} /> Volver al listado
      </button>

      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <label className="w-16 h-16 rounded-full bg-canvas border border-line flex items-center justify-center overflow-hidden cursor-pointer group relative shrink-0">
            {vigilador.foto_url ? (
              <img src={vigilador.foto_url} alt="Foto" className="w-full h-full object-cover" />
            ) : (
              <User size={28} className="text-muted" />
            )}
            <span className="absolute inset-0 bg-navy/60 text-surface text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              Cambiar
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFoto(e.target.files[0])}
            />
          </label>
          <div>
            <h2 className="text-3xl font-display font-bold text-navy">
              {vigilador.apellido}, {vigilador.nombre}
            </h2>
            <p className="text-muted flex items-center gap-2">
              Legajo: <span className="font-mono font-bold text-navy">{vigilador.legajo_nro}</span> • DNI: {vigilador.documento}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <button
            onClick={() => setModalEditarAbierto(true)}
            className="text-brand-blue hover:text-brand-deep transition-colors text-sm font-medium flex items-center gap-1"
          >
            <Pencil size={14} /> Editar ficha
          </button>
          <span className={`status-badge ${vigilador.estado === 'ACTIVO' ? 'status-badge-ok' : 'status-badge-alert'}`}>
            {vigilador.estado}
          </span>
          <span className={`status-badge ${completitud?.completo ? 'status-badge-ok' : 'status-badge-alert'}`}>
            Ficha {completitud?.completo ? 'completa' : 'incompleta'}
          </span>
        </div>
      </div>

      {completitud && !completitud.completo && (
        <div className="card bg-amber/5 border-amber/20">
          <div className="flex justify-between items-start mb-2">
            <p className="font-medium text-amber flex items-center gap-2">
              <AlertCircle size={16} /> Faltan datos para completar la ficha
            </p>
            <button
              onClick={() => setModalEditarAbierto(true)}
              className="text-amber hover:text-amber/80 transition-colors text-sm font-medium flex items-center gap-1 shrink-0"
            >
              <Pencil size={14} /> Editar
            </button>
          </div>
          <ul className="flex flex-wrap gap-2 text-xs">
            {completitud.faltantes.map((f) => (
              <li key={f} className="px-2 py-1 bg-amber/10 text-amber rounded-md">
                {ETIQUETAS_FALTANTE[f] || f}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-display font-bold text-navy flex items-center gap-2">
                <FileCheck className="text-brand-blue" size={20} /> Credenciales y Documentación
              </h3>
              <button
                onClick={() => setModalCredencialAbierto(true)}
                className="text-brand-blue hover:text-brand-deep transition-colors text-sm font-medium flex items-center gap-1"
              >
                <Plus size={16} /> Agregar Credencial
              </button>
            </div>

            <div className="space-y-3">
              {credenciales.length === 0 ? (
                <p className="text-sm text-muted py-4 text-center">
                  Todavía no se cargó ninguna credencial. Empezá agregando el Carnet de Vigilador.
                </p>
              ) : (
                credenciales.map((c) => {
                  const vencida = estaVencida(c.vence_el);
                  const porVencer = !vencida && proximaAVencer(c.vence_el);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => c.documento_key && handleVerDocumento(c.id)}
                      disabled={!c.documento_key}
                      className={`w-full text-left p-4 border rounded-lg flex justify-between items-center transition-colors ${
                        vencida
                          ? 'bg-red-50 border-red-200'
                          : porVencer
                            ? 'bg-amber/5 border-amber/20'
                            : 'bg-canvas border-line'
                      } ${c.documento_key ? 'hover:opacity-80 cursor-pointer' : 'cursor-default'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            vencida || porVencer ? 'bg-amber/10 text-amber' : 'bg-brand-tint text-brand-blue'
                          }`}
                        >
                          {vencida || porVencer ? <AlertCircle size={20} /> : <FileCheck size={20} />}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-navy uppercase tracking-tight">
                            {ETIQUETAS_TIPO[c.tipo] || c.tipo}
                          </h4>
                          {c.vence_el && (
                            <p className="text-xs text-muted">
                              Vencimiento: {new Date(c.vence_el).toLocaleDateString('es-AR')}
                            </p>
                          )}
                        </div>
                      </div>
                      <span
                        className={`status-badge ${
                          vencida ? 'status-badge-alert' : porVencer ? 'status-badge-alert' : 'status-badge-ok'
                        }`}
                      >
                        {vencida ? 'Vencida' : porVencer ? 'Por Vencer' : 'Vigente'}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-display font-bold text-navy mb-4 flex items-center gap-2">
              <MapPin className="text-brand-blue" size={18} /> Domicilio
            </h3>
            {vigilador.domicilio ? (
              <p className="text-sm text-navy">
                {vigilador.domicilio}
                {vigilador.localidad && `, ${vigilador.localidad}`}
                {vigilador.provincia && `, ${vigilador.provincia}`}
                {vigilador.codigo_postal && ` (${vigilador.codigo_postal})`}
              </p>
            ) : (
              <p className="text-sm text-muted">Sin domicilio registrado.</p>
            )}
          </div>

          <div className="card">
            <h3 className="text-lg font-display font-bold text-navy mb-4 flex items-center gap-2">
              <Phone className="text-brand-blue" size={18} /> Contacto
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-muted uppercase tracking-wider">Teléfono</p>
                <p className="text-navy">{vigilador.telefono || 'Sin registrar'}</p>
              </div>
              <div className="pt-2 border-t border-line">
                <p className="text-xs text-muted uppercase tracking-wider">Emergencia</p>
                {vigilador.contacto_emerg_nombre ? (
                  <p className="text-navy">
                    {vigilador.contacto_emerg_nombre}
                    {vigilador.contacto_emerg_vinculo && ` (${vigilador.contacto_emerg_vinculo})`}
                    {vigilador.contacto_emerg_telefono && ` · ${vigilador.contacto_emerg_telefono}`}
                  </p>
                ) : (
                  <p className="text-muted">Sin registrar</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {modalCredencialAbierto && id && (
        <CredencialForm
          vigiladorId={id}
          onClose={() => setModalCredencialAbierto(false)}
          onCreated={() => {
            setModalCredencialAbierto(false);
            cargarTodo();
          }}
        />
      )}

      {modalEditarAbierto && (
        <VigiladorEditForm
          vigilador={vigilador}
          onClose={() => setModalEditarAbierto(false)}
          onSaved={() => {
            setModalEditarAbierto(false);
            cargarTodo();
          }}
        />
      )}
    </div>
  );
};
