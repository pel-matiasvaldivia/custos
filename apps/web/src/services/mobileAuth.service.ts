import mobileApi from './mobileApi';

export interface VigiladorSesion {
  id: string;
  nombre: string;
  apellido: string;
  tenantId: string;
}

export interface LoginVigiladorResponse {
  access_token: string;
  vigilador: VigiladorSesion;
}

export const mobileAuthService = {
  login: async (legajoNro: string, pin: string): Promise<LoginVigiladorResponse> => {
    const response = await mobileApi.post<LoginVigiladorResponse>('/mobile/auth/login', {
      legajo_nro: legajoNro,
      pin,
    });
    return response.data;
  },

  guardarSesion: (data: LoginVigiladorResponse) => {
    localStorage.setItem('vigilador_token', data.access_token);
    localStorage.setItem('vigilador_user', JSON.stringify(data.vigilador));
  },

  cerrarSesion: () => {
    localStorage.removeItem('vigilador_token');
    localStorage.removeItem('vigilador_user');
  },

  getSesion: (): VigiladorSesion | null => {
    const raw = localStorage.getItem('vigilador_user');
    return raw ? JSON.parse(raw) : null;
  },

  isAutenticado: (): boolean => {
    return !!localStorage.getItem('vigilador_token');
  },
};
