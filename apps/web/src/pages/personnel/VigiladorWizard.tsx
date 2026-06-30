import { EntityWizard, WizardStep } from '../../components/wizard/EntityWizard';
import { vigilanteService, Vigilador } from '../../services/vigilante.service';
import { Camera, User } from 'lucide-react';

interface VigiladorWizardData {
  legajo_nro: string;
  nombre: string;
  apellido: string;
  documento: string;
  domicilio: string;
  localidad: string;
  provincia: string;
  codigo_postal: string;
  telefono: string;
  contacto_emerg_nombre: string;
  contacto_emerg_telefono: string;
  contacto_emerg_vinculo: string;
  fotoFile?: File;
}

const DATOS_INICIALES: VigiladorWizardData = {
  legajo_nro: '',
  nombre: '',
  apellido: '',
  documento: '',
  domicilio: '',
  localidad: '',
  provincia: '',
  codigo_postal: '',
  telefono: '',
  contacto_emerg_nombre: '',
  contacto_emerg_telefono: '',
  contacto_emerg_vinculo: '',
};

const campoClase =
  'w-full px-3 py-2 bg-canvas border border-line rounded-md focus:ring-2 focus:ring-brand-blue/20 outline-none text-sm';
const labelClase = 'text-xs font-medium text-muted uppercase tracking-wider';

interface Props {
  onClose: () => void;
  onCreated: (vigilador: Vigilador) => void;
}

export const VigiladorWizard = ({ onClose, onCreated }: Props) => {
  const pasos: WizardStep<VigiladorWizardData>[] = [
    {
      id: 'datos-basicos',
      titulo: 'Datos básicos',
      descripcion: 'Lo mínimo para registrar al vigilador en el sistema.',
      validar: (data) => {
        if (!data.nombre || !data.apellido || !data.documento || !data.legajo_nro) {
          return 'Completá nombre, apellido, documento y número de legajo para continuar.';
        }
        return null;
      },
      render: (data, setData) => (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className={labelClase}>Nombre</label>
              <input
                autoFocus
                className={campoClase}
                value={data.nombre}
                onChange={(e) => setData({ nombre: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className={labelClase}>Apellido</label>
              <input
                className={campoClase}
                value={data.apellido}
                onChange={(e) => setData({ apellido: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className={labelClase}>Documento (DNI)</label>
            <input
              className={campoClase}
              value={data.documento}
              onChange={(e) => setData({ documento: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className={labelClase}>Nro. Legajo</label>
            <input
              placeholder="Ej: V-001"
              className={`${campoClase} font-mono`}
              value={data.legajo_nro}
              onChange={(e) => setData({ legajo_nro: e.target.value })}
            />
          </div>
        </div>
      ),
    },
    {
      id: 'foto',
      titulo: 'Foto actualizada',
      descripcion: 'Una foto reciente ayuda a identificar al vigilador en los puestos.',
      opcional: true,
      render: (data, setData) => (
        <div className="flex flex-col items-center gap-4 py-2">
          <div className="w-28 h-28 rounded-full bg-canvas border-2 border-dashed border-line flex items-center justify-center overflow-hidden">
            {data.fotoFile ? (
              <img
                src={URL.createObjectURL(data.fotoFile)}
                alt="Vista previa"
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={36} className="text-muted" />
            )}
          </div>
          <label className="btn-primary flex items-center gap-2 cursor-pointer text-sm">
            <Camera size={16} />
            {data.fotoFile ? 'Cambiar foto' : 'Subir foto'}
            <input
              type="file"
              accept="image/jpeg,image/png"
              className="hidden"
              onChange={(e) => setData({ fotoFile: e.target.files?.[0] })}
            />
          </label>
        </div>
      ),
    },
    {
      id: 'domicilio',
      titulo: 'Domicilio actual',
      descripcion: 'Necesario para la cobertura de seguro y la asignación de puestos cercanos.',
      opcional: true,
      render: (data, setData) => (
        <div className="space-y-4">
          <div className="space-y-1">
            <label className={labelClase}>Domicilio</label>
            <input
              placeholder="Calle y número"
              className={campoClase}
              value={data.domicilio}
              onChange={(e) => setData({ domicilio: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className={labelClase}>Localidad</label>
              <input
                className={campoClase}
                value={data.localidad}
                onChange={(e) => setData({ localidad: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className={labelClase}>Provincia</label>
              <input
                className={campoClase}
                value={data.provincia}
                onChange={(e) => setData({ provincia: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className={labelClase}>Código Postal</label>
            <input
              className={campoClase}
              value={data.codigo_postal}
              onChange={(e) => setData({ codigo_postal: e.target.value })}
            />
          </div>
        </div>
      ),
    },
    {
      id: 'contacto',
      titulo: 'Contacto y emergencias',
      descripcion: 'Para comunicarte con el vigilador o con un familiar ante una urgencia.',
      opcional: true,
      render: (data, setData) => (
        <div className="space-y-4">
          <div className="space-y-1">
            <label className={labelClase}>Teléfono del vigilador</label>
            <input
              className={campoClase}
              value={data.telefono}
              onChange={(e) => setData({ telefono: e.target.value })}
            />
          </div>
          <div className="pt-2 border-t border-line space-y-4">
            <p className="text-xs font-medium text-muted uppercase tracking-wider">Contacto de emergencia</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className={labelClase}>Nombre</label>
                <input
                  className={campoClase}
                  value={data.contacto_emerg_nombre}
                  onChange={(e) => setData({ contacto_emerg_nombre: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className={labelClase}>Vínculo</label>
                <input
                  placeholder="Ej: Esposa, hermano"
                  className={campoClase}
                  value={data.contacto_emerg_vinculo}
                  onChange={(e) => setData({ contacto_emerg_vinculo: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className={labelClase}>Teléfono</label>
              <input
                className={campoClase}
                value={data.contacto_emerg_telefono}
                onChange={(e) => setData({ contacto_emerg_telefono: e.target.value })}
              />
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <EntityWizard
      titulo="Nuevo Vigilador"
      pasos={pasos}
      datosIniciales={DATOS_INICIALES}
      textoBotonFinal="Crear Vigilador"
      loQueVasANecesitar={[
        'Foto actualizada del vigilador (JPG o PNG)',
        'Domicilio actual',
        'Datos de un contacto de emergencia',
      ]}
      onClose={onClose}
      onFinalizar={async (data) => {
        const vigilador = await vigilanteService.create({
          legajo_nro: data.legajo_nro,
          nombre: data.nombre,
          apellido: data.apellido,
          documento: data.documento,
          domicilio: data.domicilio || undefined,
          localidad: data.localidad || undefined,
          provincia: data.provincia || undefined,
          codigo_postal: data.codigo_postal || undefined,
          telefono: data.telefono || undefined,
          contacto_emerg_nombre: data.contacto_emerg_nombre || undefined,
          contacto_emerg_telefono: data.contacto_emerg_telefono || undefined,
          contacto_emerg_vinculo: data.contacto_emerg_vinculo || undefined,
        });
        let final = vigilador;
        if (data.fotoFile) {
          final = await vigilanteService.subirFoto(vigilador.id, data.fotoFile);
        }
        onCreated(final);
      }}
    />
  );
};
