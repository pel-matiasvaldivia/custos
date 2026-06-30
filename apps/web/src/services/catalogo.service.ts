import api from './api';

export interface CatalogoItemOption {
  id: string | null;
  codigo: string;
  etiqueta: string;
  esDefault: boolean;
}

export const catalogoService = {
  getItems: async (categoria: string): Promise<CatalogoItemOption[]> => {
    const response = await api.get<CatalogoItemOption[]>(`/catalogos/${categoria}`);
    return response.data;
  },

  create: async (categoria: string, etiqueta: string): Promise<CatalogoItemOption> => {
    const response = await api.post(`/catalogos/${categoria}`, { etiqueta });
    return response.data;
  },

  remove: async (categoria: string, id: string): Promise<void> => {
    await api.delete(`/catalogos/${categoria}/${id}`);
  },
};
