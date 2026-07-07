import { useEffect, useRef, useState } from 'react';
import {
  Building2, Save, CheckCircle2, UploadCloud, PenTool, Image as ImageIcon,
} from 'lucide-react';
import {
  tenantConfigService,
  DatosEmpresaInput,
} from '../../services/tenantConfig.service';
import { contratoConfigService } from '../../services/contratoConfig.service';

const CONDICIONES = [
  { v: 'RESPONSABLE_INSCRIPTO', label: 'Responsable Inscripto' },
  { v: 'MONOTRIBUTO', label: 'Monotributo' },
  { v: 'EXENTO', label: 'Exento' },
  { v: 'CONSUMIDOR_FINAL', label: 'Consumidor Final' },
];

/**
 * Datos de empresa/facturación + logo + firma. Es el paso final del onboarding:
 * lo que la empresa necesita cargado para emitir cotizaciones y contratos.
 */
export const EmpresaTab = () => {
  const [form, setForm] = useState<DatosEmpresaInput>({});
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [firmaUrl, setFirmaUrl] = useState<string | null>(null);
  const [firmaNombre, setFirmaNombre] = useState('');
  const [firmaCargo, setFirmaCargo] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const logoInput = useRef<HTMLInputElement>(null);
  const firmaInput = useRef<HTMLInputElement>(null);

  const cargar = async () => {
    try {
      const [t, cfg] = await Promise.all([
        tenantConfigService.get(),
        contratoConfigService.getOne().catch(() => null),
      ]);
      setForm({
        razon_social: t.razon_social ?? '',
        cuit: t.cuit ?? '',
        condicion_iva: t.condicion_iva ?? '',
        direccion: t.direccion ?? '',
        email_contacto: t.email_contacto ?? '',
        telefono_contacto: t.telefono_contacto ?? '',
      });
      if (cfg) {
        setLogoUrl(cfg.logo_url);
        setFirmaUrl(cfg.firma_url);
        setFirmaNombre(cfg.firma_nombre ?? '');
        setFirmaCargo(cfg.firma_cargo ?? '');
      }
    } catch {
      /* noop */
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const set = (k: keyof DatosEmpresaInput, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const guardar = async () => {
    setGuardando(true);
    setMsg(null);
    setError(null);
    try {
      await tenantConfigService.actualizar(form);
      setMsg('Datos de la empresa guardados.');
    } catch (e) {
      setError(msgErr(e) || 'No se pudieron guardar los datos.');
    } finally {
      setGuardando(false);
    }
  };

  const subirLogo = async (file?: File) => {
    if (!file) return;
    setError(null);
    try {
      const r = await contratoConfigService.actualizarLogo(file);
      setLogoUrl(r.logo_url);
      setMsg('Logo actualizado.');
    } catch (e) {
      setError(msgErr(e) || 'No se pudo subir el logo.');
    }
  };

  const subirFirma = async (file?: File) => {
    if (!file) return;
    setError(null);
    try {
      const cfg = await contratoConfigService.actualizarFirma(
        file,
        firmaNombre,
        firmaCargo,
      );
      setFirmaUrl(cfg.firma_url);
      setMsg('Firma actualizada.');
    } catch (e) {
      setError(msgErr(e) || 'No se pudo subir la firma.');
    }
  };

  const completo = !!(
    form.razon_social &&
    form.cuit &&
    form.condicion_iva &&
    form.direccion
  );

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-2">
        <Building2 className="text-brand-blue" size={20} />
        <h3 className="font-display font-bold text-navy text-lg">Datos de la empresa</h3>
        {completo && (
          <span className="ml-2 text-[10px] font-black uppercase tracking-widest text-emerald flex items-center gap-1">
            <CheckCircle2 size={13} /> Completo
          </span>
        )}
      </div>
      <p className="text-sm text-muted -mt-3">
        Estos datos aparecen en tus cotizaciones y contratos. Completá la información de
        facturación, el logo y la firma del responsable.
      </p>

      {/* Datos de facturación */}
      <div className="card space-y-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted">Facturación</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Campo label="Razón social" requerido>
            <input value={form.razon_social ?? ''} onChange={(e) => set('razon_social', e.target.value)}
              className="inp" placeholder="Seguridad S.R.L." />
          </Campo>
          <Campo label="CUIT" requerido>
            <input value={form.cuit ?? ''} onChange={(e) => set('cuit', e.target.value)}
              className="inp font-mono" placeholder="30-12345678-9" />
          </Campo>
          <Campo label="Condición frente al IVA" requerido>
            <select value={form.condicion_iva ?? ''} onChange={(e) => set('condicion_iva', e.target.value)}
              className="inp bg-white">
              <option value="">Elegí…</option>
              {CONDICIONES.map((c) => <option key={c.v} value={c.v}>{c.label}</option>)}
            </select>
          </Campo>
          <Campo label="Dirección fiscal" requerido>
            <input value={form.direccion ?? ''} onChange={(e) => set('direccion', e.target.value)}
              className="inp" placeholder="Av. Siempreviva 742" />
          </Campo>
          <Campo label="Email de contacto">
            <input value={form.email_contacto ?? ''} onChange={(e) => set('email_contacto', e.target.value)}
              className="inp" placeholder="admin@empresa.com" />
          </Campo>
          <Campo label="Teléfono">
            <input value={form.telefono_contacto ?? ''} onChange={(e) => set('telefono_contacto', e.target.value)}
              className="inp" placeholder="+54 9 11 …" />
          </Campo>
        </div>
        <button onClick={guardar} disabled={guardando}
          className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white text-sm font-medium rounded-lg hover:bg-brand-deep transition-colors disabled:opacity-50">
          <Save size={15} /> {guardando ? 'Guardando…' : 'Guardar datos'}
        </button>
      </div>

      {/* Logo y firma */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card space-y-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted flex items-center gap-1.5">
            <ImageIcon size={13} /> Logo
          </p>
          <div className="h-24 rounded-xl border border-line bg-canvas flex items-center justify-center overflow-hidden">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="max-h-20 object-contain" />
            ) : (
              <span className="text-xs text-muted">Sin logo</span>
            )}
          </div>
          <input ref={logoInput} type="file" accept="image/png,image/jpeg" className="hidden"
            onChange={(e) => subirLogo(e.target.files?.[0])} />
          <button onClick={() => logoInput.current?.click()}
            className="w-full flex items-center justify-center gap-2 py-2 border border-line rounded-lg text-sm font-medium text-navy hover:border-brand-blue">
            <UploadCloud size={15} /> Cargar logo
          </button>
        </div>

        <div className="card space-y-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted flex items-center gap-1.5">
            <PenTool size={13} /> Firma del responsable
          </p>
          <div className="h-24 rounded-xl border border-line bg-canvas flex items-center justify-center overflow-hidden">
            {firmaUrl ? (
              <img src={firmaUrl} alt="Firma" className="max-h-20 object-contain" />
            ) : (
              <span className="text-xs text-muted">Sin firma</span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input value={firmaNombre} onChange={(e) => setFirmaNombre(e.target.value)}
              className="inp" placeholder="Nombre" />
            <input value={firmaCargo} onChange={(e) => setFirmaCargo(e.target.value)}
              className="inp" placeholder="Cargo" />
          </div>
          <input ref={firmaInput} type="file" accept="image/png,image/jpeg" className="hidden"
            onChange={(e) => subirFirma(e.target.files?.[0])} />
          <button onClick={() => firmaInput.current?.click()}
            className="w-full flex items-center justify-center gap-2 py-2 border border-line rounded-lg text-sm font-medium text-navy hover:border-brand-blue">
            <UploadCloud size={15} /> Cargar firma
          </button>
        </div>
      </div>

      {msg && <p className="text-sm text-emerald flex items-center gap-1"><CheckCircle2 size={14} /> {msg}</p>}
      {error && <p className="text-sm text-amber">{error}</p>}

      <style>{`.inp{width:100%;border:1px solid #E2E8F2;border-radius:.5rem;padding:.5rem .625rem;font-size:.875rem}`}</style>
    </div>
  );
};

function Campo({ label, requerido, children }: { label: string; requerido?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[10px] font-black uppercase tracking-widest text-muted mb-1 block">
        {label}{requerido && <span className="text-amber ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

function msgErr(e: unknown): string {
  const resp = (e as { response?: { data?: { message?: string } } })?.response;
  return resp?.data?.message || (e instanceof Error ? e.message : '');
}
