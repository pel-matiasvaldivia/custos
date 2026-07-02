import mobileApi from './mobileApi';

export interface VigiladorSesion {
  id: string;
  nombre: string;
  apellido: string;
  legajo_nro?: string;
  tenantId: string;
}

export interface LoginVigiladorResponse {
  access_token: string;
  vigilador: VigiladorSesion;
}

export interface ObjetivoDispositivo {
  id: string;
  nombre: string;
  direccion: string | null;
  lat: number | null;
  lng: number | null;
  tenantId: string;
}

export interface LoginDispositivoResponse {
  access_token: string;
  objetivo: ObjetivoDispositivo;
}

/** Vigilador que está operando el dispositivo compartido en este momento. */
export interface VigiladorActivo {
  id: string;
  nombre: string;
  apellido: string;
  legajo_nro?: string | null;
}

const K_TOKEN = 'vigilador_token';
const K_USER = 'vigilador_user';
const K_OBJETIVO = 'vigilador_objetivo';
const K_ACTIVO = 'vigilador_activo'; // sessionStorage: quién opera ahora

export const mobileAuthService = {
  // ── Login personal (legajo + PIN) ──
  login: async (legajoNro: string, pin: string): Promise<LoginVigiladorResponse> => {
    const response = await mobileApi.post<LoginVigiladorResponse>('/mobile/auth/login', {
      legajo_nro: legajoNro,
      pin,
    });
    return response.data;
  },

  guardarSesion: (data: LoginVigiladorResponse) => {
    localStorage.setItem(K_TOKEN, data.access_token);
    localStorage.setItem(K_USER, JSON.stringify(data.vigilador));
    localStorage.removeItem(K_OBJETIVO);
  },

  // ── Login de dispositivo (un celular por objetivo) ──
  loginDispositivo: async (body: {
    nfc_tag?: string;
    objetivo_codigo?: string;
    pin?: string;
  }): Promise<LoginDispositivoResponse> => {
    const response = await mobileApi.post<LoginDispositivoResponse>('/mobile/auth/device', body);
    return response.data;
  },

  guardarSesionDispositivo: (data: LoginDispositivoResponse) => {
    localStorage.setItem(K_TOKEN, data.access_token);
    localStorage.setItem(K_OBJETIVO, JSON.stringify(data.objetivo));
    localStorage.removeItem(K_USER);
    sessionStorage.removeItem(K_ACTIVO);
  },

  cerrarSesion: () => {
    localStorage.removeItem(K_TOKEN);
    localStorage.removeItem(K_USER);
    localStorage.removeItem(K_OBJETIVO);
    sessionStorage.removeItem(K_ACTIVO);
  },

  getSesion: (): VigiladorSesion | null => {
    const raw = localStorage.getItem(K_USER);
    return raw ? JSON.parse(raw) : null;
  },

  getObjetivo: (): ObjetivoDispositivo | null => {
    const raw = localStorage.getItem(K_OBJETIVO);
    return raw ? JSON.parse(raw) : null;
  },

  /** 'DISPOSITIVO' si el celular está logueado a un objetivo; si no, 'VIGILADOR'. */
  getModo: (): 'DISPOSITIVO' | 'VIGILADOR' => {
    return localStorage.getItem(K_OBJETIVO) ? 'DISPOSITIVO' : 'VIGILADOR';
  },

  isAutenticado: (): boolean => {
    return !!localStorage.getItem(K_TOKEN);
  },

  // ── Vigilador activo (sólo en modo dispositivo) ──
  setVigiladorActivo: (v: VigiladorActivo | null) => {
    if (v) sessionStorage.setItem(K_ACTIVO, JSON.stringify(v));
    else sessionStorage.removeItem(K_ACTIVO);
  },

  getVigiladorActivo: (): VigiladorActivo | null => {
    const raw = sessionStorage.getItem(K_ACTIVO);
    return raw ? JSON.parse(raw) : null;
  },

  /** Id del vigilador que ejecuta la acción, sólo en modo dispositivo. */
  vigiladorIdParaAccion: (): string | undefined => {
    if (localStorage.getItem(K_OBJETIVO)) {
      const raw = sessionStorage.getItem(K_ACTIVO);
      return raw ? (JSON.parse(raw) as VigiladorActivo).id : undefined;
    }
    return undefined; // modo personal: el backend usa el token
  },
};
