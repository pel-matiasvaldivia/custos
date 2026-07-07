import api from './api';

export interface ConfiguracionArca {
  configurado: boolean;
  ambiente: 'HOMOLOGACION' | 'PRODUCCION';
  cuit_emisor: string | null;
  condicion_iva: string | null;
  puntos_venta: number[];
  tiene_certificado: boolean;
  tiene_clave: boolean;
}

export interface ResultadoImportacion {
  importados: number;
  omitidos: number;
  errores: string[];
}

export interface ItemFactura {
  descripcion: string;
  cantidad: number;
  precio_unitario: number;
}

export interface FacturarInput {
  cliente_id?: string;
  cliente_nombre: string;
  tipo_comprobante: number;
  punto_venta: number;
  doc_tipo: number;
  doc_nro: string;
  concepto?: number;
  items: ItemFactura[];
}

export interface ResultadoFactura {
  id: string;
  tipo_label: string;
  numero_formateado: string;
  cae: string | null;
  cae_vencimiento: string | null;
  importe_total: number;
  observaciones: { code: number; msg: string }[];
}

export interface FacturaResumen {
  id: string;
  cliente_nombre: string;
  tipo_label: string;
  numero_formateado: string;
  cae: string | null;
  estado: string;
  importe_total: number;
  fecha_emision: string;
}

/** Dispara la descarga en el navegador de un blob obtenido con auth. */
function descargarBlob(blob: Blob, nombre: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nombre;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export const arcaService = {
  // ─── Configuración ─────────────────────────────────────────────────────────
  async getConfig(): Promise<ConfiguracionArca> {
    const { data } = await api.get('/arca-integration/configuracion');
    return data;
  },

  async guardarConfig(campos: {
    ambiente?: string;
    cuit_emisor?: string;
    condicion_iva?: string;
    puntos_venta?: string;
    certificado?: File | null;
    clave?: File | null;
  }): Promise<ConfiguracionArca> {
    const fd = new FormData();
    if (campos.ambiente) fd.append('ambiente', campos.ambiente);
    if (campos.cuit_emisor !== undefined) fd.append('cuit_emisor', campos.cuit_emisor);
    if (campos.condicion_iva !== undefined) fd.append('condicion_iva', campos.condicion_iva);
    if (campos.puntos_venta !== undefined) fd.append('puntos_venta', campos.puntos_venta);
    if (campos.certificado) fd.append('certificado', campos.certificado);
    if (campos.clave) fd.append('clave', campos.clave);
    const { data } = await api.put('/arca-integration/configuracion', fd);
    return data;
  },

  async probarConexion(): Promise<{ ok: boolean; ta_expira: string }> {
    const { data } = await api.post('/arca-integration/probar-conexion');
    return data;
  },

  // ─── Nómina / LSD ──────────────────────────────────────────────────────────
  async importarNomina(archivo: File): Promise<ResultadoImportacion> {
    const fd = new FormData();
    fd.append('archivo', archivo);
    const { data } = await api.post('/arca-integration/importar-nomina', fd);
    return data;
  },

  async descargarAltas(ids: string[]): Promise<void> {
    const { data } = await api.get('/arca-integration/exportar-altas-txt', {
      params: { ids: ids.join(',') },
      responseType: 'blob',
    });
    descargarBlob(data, 'altas_arca.txt');
  },

  async descargarLsd(liquidacionId: string): Promise<void> {
    const { data } = await api.get('/arca-integration/exportar-lsd-txt', {
      params: { liquidacionId },
      responseType: 'blob',
    });
    descargarBlob(data, 'lsd.txt');
  },

  // ─── Facturación ───────────────────────────────────────────────────────────
  async facturar(input: FacturarInput): Promise<ResultadoFactura> {
    const { data } = await api.post('/arca-integration/facturar', input);
    return data;
  },

  async listarFacturas(): Promise<FacturaResumen[]> {
    const { data } = await api.get('/arca-integration/facturas');
    return data;
  },

  async descargarFacturaPdf(id: string): Promise<void> {
    const { data } = await api.get(`/arca-integration/facturas/${id}/pdf`, {
      responseType: 'blob',
    });
    descargarBlob(data, `comprobante-${id.slice(0, 8)}.pdf`);
  },
};
