import api from './api';

export interface ConfiguracionContrato {
  id: string;
  plantilla_html: string;
  firma_url: string | null;
  firma_nombre: string | null;
  firma_cargo: string | null;
  logo_key: string | null;
  logo_url: string | null;
}

export const contratoConfigService = {
  getOne: async (): Promise<ConfiguracionContrato> => {
    const response = await api.get<ConfiguracionContrato>('/config/contrato');
    return response.data;
  },

  updatePlantilla: async (plantilla_html: string): Promise<ConfiguracionContrato> => {
    const response = await api.put<ConfiguracionContrato>('/config/contrato', { plantilla_html });
    return response.data;
  },

  actualizarFirma: async (file: File, nombre: string, cargo: string): Promise<ConfiguracionContrato> => {
    const form = new FormData();
    form.append('file', file);
    form.append('nombre', nombre);
    form.append('cargo', cargo);
    const response = await api.post<ConfiguracionContrato>('/config/contrato/firma', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  actualizarLogo: async (file: File): Promise<{ logo_key: string; logo_url: string }> => {
    const form = new FormData();
    form.append('file', file);
    const response = await api.post<{ logo_key: string; logo_url: string }>('/config/contrato/logo', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};
