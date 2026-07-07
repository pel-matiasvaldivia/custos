/**
 * Constantes de integración con ARCA (ex-AFIP). Los endpoints difieren entre el
 * entorno de homologación (pruebas) y el de producción; el tenant elige cuál usar.
 */

export type AmbienteArca = 'HOMOLOGACION' | 'PRODUCCION';

export const WSAA_URL: Record<AmbienteArca, string> = {
  HOMOLOGACION: 'https://wsaahomo.afip.gov.ar/ws/services/LoginCms',
  PRODUCCION: 'https://wsaa.afip.gov.ar/ws/services/LoginCms',
};

export const WSFE_URL: Record<AmbienteArca, string> = {
  HOMOLOGACION: 'https://wswhomo.afip.gov.ar/wsfev1/service.asmx',
  PRODUCCION: 'https://servicios1.afip.gov.ar/wsfev1/service.asmx',
};

// Namespace SOAP del WSFEv1. Todos los métodos del servicio viven bajo él.
export const WSFE_NS = 'http://ar.gov.afip.dif.FEV1/';

// Servicio para el que se pide el Ticket de Acceso (WSAA): facturación electrónica.
export const WSAA_SERVICE = 'wsfe';

// El Token de Acceso de ARCA vence a las 12 h; renovamos un poco antes para no
// emitir con un TA que expira en pleno request.
export const TA_TTL_SEGUNDOS = 11 * 60 * 60; // 11 h

// Códigos de comprobante ARCA (tabla FEParamGetTiposCbte).
export const COMPROBANTES = {
  FACTURA_A: 1,
  NOTA_CREDITO_A: 3,
  FACTURA_B: 6,
  NOTA_CREDITO_B: 8,
  FACTURA_C: 11,
  NOTA_CREDITO_C: 13,
} as const;

export const COMPROBANTE_LABEL: Record<number, string> = {
  1: 'Factura A',
  3: 'Nota de Crédito A',
  6: 'Factura B',
  8: 'Nota de Crédito B',
  11: 'Factura C',
  13: 'Nota de Crédito C',
};

// Letra del comprobante, para la leyenda del PDF legal.
export const COMPROBANTE_LETRA: Record<number, string> = {
  1: 'A',
  3: 'A',
  6: 'B',
  8: 'B',
  11: 'C',
  13: 'C',
};

// Tipos de documento del receptor (tabla FEParamGetTiposDoc).
export const DOC_TIPO = {
  CUIT: 80,
  DNI: 96,
  CONSUMIDOR_FINAL: 99,
} as const;

// Conceptos (tabla FEParamGetTiposConcepto). El negocio es servicios de vigilancia.
export const CONCEPTO = {
  PRODUCTOS: 1,
  SERVICIOS: 2,
  PRODUCTOS_Y_SERVICIOS: 3,
} as const;

// Alícuota de IVA 21 % (Id 5 en la tabla FEParamGetTiposIva). Es la general para
// servicios de seguridad; el monotributo factura C sin discriminar IVA.
export const IVA_21 = { id: 5, porcentaje: 0.21 };
