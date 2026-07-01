import { useEffect, useState, FormEvent } from 'react';
import {
  UserPlus,
  Edit2,
  Trash2,
  KeyRound,
  Loader2,
  AlertCircle,
  CheckCircle,
  X,
  Eye,
  EyeOff,
  Shield,
} from 'lucide-react';
import {
  Usuario,
  RolTenant,
  ROL_INFO,
  listarUsuarios,
  crearUsuario,
  actualizarUsuario,
  resetPasswordUsuario,
  eliminarUsuario,
} from '../../services/usuarios.service';
import { useAuth } from '../../context/AuthContext';

type Modal =
  | { tipo: 'crear' }
  | { tipo: 'editar'; usuario: Usuario }
  | { tipo: 'password'; usuario: Usuario }
  | { tipo: 'eliminar'; usuario: Usuario }
  | null;

const ROLES: RolTenant[] = ['ADMIN', 'GERENCIA', 'SUPERVISOR', 'COMERCIAL', 'OPERADOR'];

const ACCESOS: Record<RolTenant, string[]> = {
  ADMIN: ['Dashboard', 'Clientes', 'Objetivos', 'Cotizaciones', 'Cuadrante', 'Personal', 'Novedades', 'Compras', 'Herramientas', 'Cambios de turno', 'Monitoreo', 'Reportes', 'Configuración', 'Suscripción'],
  GERENCIA: ['Dashboard', 'Clientes', 'Objetivos', 'Cotizaciones', 'Cuadrante', 'Personal', 'Novedades', 'Compras', 'Herramientas', 'Cambios de turno', 'Monitoreo', 'Reportes'],
  SUPERVISOR: ['Dashboard', 'Objetivos', 'Cuadrante', 'Personal', 'Novedades', 'Herramientas', 'Cambios de turno'],
  COMERCIAL: ['Dashboard', 'Clientes', 'Objetivos', 'Cotizaciones', 'Reportes'],
  OPERADOR: ['Dashboard', 'Objetivos', 'Novedades', 'Monitoreo', 'Equipamiento', 'Vigilancia Móvil'],
};

export function UsuariosTab() {
  const { user: me } = useAuth();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState<Modal>(null);
  const [toast, setToast] = useState('');

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      setUsuarios(await listarUsuarios());
    } catch {
      setError('Error al cargar usuarios.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const isAdmin = me?.role === 'ADMIN' || me?.role === 'SUPERADMIN';

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-emerald text-white px-4 py-2 rounded-lg shadow-lg text-sm animate-fade-in">
          <CheckCircle className="w-4 h-4" /> {toast}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-navy">Usuarios y perfiles</h2>
          <p className="text-sm text-muted mt-0.5">Gestioná los usuarios con acceso a la plataforma.</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setModal({ tipo: 'crear' })}
            className="btn-primary flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Nuevo usuario
          </button>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {/* User table */}
      {cargando ? (
        <div className="flex items-center gap-2 text-muted py-8 justify-center">
          <Loader2 className="w-5 h-5 animate-spin" /> Cargando...
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface border-b border-line">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Usuario</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Perfil</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider hidden md:table-cell">Módulos</th>
                {isAdmin && <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider text-right">Acciones</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {usuarios.map((u) => {
                const info = ROL_INFO[u.role] ?? { label: u.role, color: 'bg-line text-muted', descripcion: '' };
                const accesos = ACCESOS[u.role] ?? [];
                const esYo = u.id === me?.id;
                return (
                  <tr key={u.id} className={`hover:bg-surface/50 transition-colors ${u.deleted_at ? 'opacity-40' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="font-medium text-navy">{u.nombre ?? '—'}</div>
                      <div className="text-muted text-xs">{u.email}</div>
                      {esYo && <span className="text-xs text-brand-blue font-medium">(vos)</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${info.color}`}>
                        {info.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {accesos.slice(0, 5).map((a) => (
                          <span key={a} className="text-xs bg-line text-muted px-1.5 py-0.5 rounded">{a}</span>
                        ))}
                        {accesos.length > 5 && (
                          <span className="text-xs text-muted">+{accesos.length - 5}</span>
                        )}
                      </div>
                    </td>
                    {isAdmin && (
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 justify-end">
                          <button
                            onClick={() => setModal({ tipo: 'editar', usuario: u })}
                            className="p-1.5 text-muted hover:text-navy rounded transition-colors"
                            title="Editar"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          {!esYo && (
                            <>
                              <button
                                onClick={() => setModal({ tipo: 'password', usuario: u })}
                                className="p-1.5 text-muted hover:text-amber rounded transition-colors"
                                title="Resetear contraseña"
                              >
                                <KeyRound className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setModal({ tipo: 'eliminar', usuario: u })}
                                className="p-1.5 text-muted hover:text-red-600 rounded transition-colors"
                                title="Eliminar"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
              {usuarios.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted text-sm">
                    No hay usuarios registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Role reference */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-muted" />
          <h3 className="font-semibold text-navy text-sm">Perfiles disponibles</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ROLES.map((rol) => {
            const info = ROL_INFO[rol];
            return (
              <div key={rol} className="border border-line rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${info.color}`}>{info.label}</span>
                </div>
                <p className="text-xs text-muted">{info.descripcion}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {(ACCESOS[rol] ?? []).map((a) => (
                    <span key={a} className="text-xs bg-line text-muted px-1.5 py-0.5 rounded">{a}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      {modal && (
        <UsuarioModal
          modal={modal}
          onClose={() => setModal(null)}
          onSuccess={(msg) => { showToast(msg); cargar(); setModal(null); }}
        />
      )}
    </div>
  );
}

/* ─── Modal helpers ─── */

interface ModalProps {
  modal: NonNullable<Modal>;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}

function UsuarioModal({ modal, onClose, onSuccess }: ModalProps) {
  const [nombre, setNombre] = useState(modal.tipo === 'editar' ? (modal.usuario.nombre ?? '') : '');
  const [email, setEmail] = useState(modal.tipo === 'editar' ? modal.usuario.email : '');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [role, setRole] = useState<RolTenant>(
    modal.tipo === 'editar' ? modal.usuario.role : 'OPERADOR',
  );
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      if (modal.tipo === 'crear') {
        await crearUsuario({ nombre: nombre || undefined, email, password, role });
        onSuccess('Usuario creado.');
      } else if (modal.tipo === 'editar') {
        await actualizarUsuario(modal.usuario.id, { nombre: nombre || undefined, role });
        onSuccess('Usuario actualizado.');
      } else if (modal.tipo === 'password') {
        if (password.length < 8) { setErr('Mínimo 8 caracteres.'); setLoading(false); return; }
        await resetPasswordUsuario(modal.usuario.id, password);
        onSuccess('Contraseña actualizada.');
      } else if (modal.tipo === 'eliminar') {
        await eliminarUsuario(modal.usuario.id);
        onSuccess('Usuario eliminado.');
      }
    } catch (e) {
      const msg = (e as { response?: { data?: { message?: string | string[] } } })?.response?.data?.message;
      setErr(Array.isArray(msg) ? msg[0] : (msg ?? 'Error inesperado.'));
    } finally {
      setLoading(false);
    }
  };

  const titles: Record<string, string> = {
    crear: 'Nuevo usuario',
    editar: 'Editar usuario',
    password: 'Resetear contraseña',
    eliminar: 'Eliminar usuario',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-line">
          <h2 className="font-semibold text-navy">{titles[modal.tipo]}</h2>
          <button onClick={onClose} className="text-muted hover:text-navy transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={submit} className="p-6 space-y-4">
          {err && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" /> {err}
            </div>
          )}

          {modal.tipo === 'eliminar' ? (
            <p className="text-sm text-navy">
              ¿Confirmás que querés eliminar a <strong>{modal.usuario.nombre ?? modal.usuario.email}</strong>?
              El usuario perderá acceso de inmediato.
            </p>
          ) : modal.tipo === 'password' ? (
            <div>
              <label className="block text-sm font-medium text-navy mb-1">Nueva contraseña</label>
              <div className="relative">
                <input
                  className="input w-full pr-10"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  required
                  autoFocus
                />
                <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-navy mb-1">Nombre</label>
                <input
                  className="input w-full"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Nombre completo"
                  autoFocus
                />
              </div>
              {modal.tipo === 'crear' && (
                <div>
                  <label className="block text-sm font-medium text-navy mb-1">Email <span className="text-red-500">*</span></label>
                  <input
                    className="input w-full"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              )}
              {modal.tipo === 'crear' && (
                <div>
                  <label className="block text-sm font-medium text-navy mb-1">Contraseña <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input
                      className="input w-full pr-10"
                      type={showPw ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 8 caracteres"
                      required
                    />
                    <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted">
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-navy mb-1">Perfil <span className="text-red-500">*</span></label>
                <select
                  className="input w-full"
                  value={role}
                  onChange={(e) => setRole(e.target.value as RolTenant)}
                  required
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>{ROL_INFO[r].label}</option>
                  ))}
                </select>
                {role && (
                  <p className="text-xs text-muted mt-1">{ROL_INFO[role]?.descripcion}</p>
                )}
              </div>
            </>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 flex items-center justify-center gap-2 ${
                modal.tipo === 'eliminar' ? 'bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors' : 'btn-primary'
              }`}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {modal.tipo === 'crear' ? 'Crear usuario'
                : modal.tipo === 'editar' ? 'Guardar'
                : modal.tipo === 'password' ? 'Actualizar contraseña'
                : 'Eliminar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
