/**
 * Interfaces tipadas de los request/response SOAP de ARCA (WSAA y WSFEv1).
 * Modelan solo los campos que consumimos; el resto de la respuesta se ignora.
 */

// ─── WSAA: Ticket de Acceso ──────────────────────────────────────────────────
export interface TicketAcceso {
  token: string;
  sign: string;
  // Epoch ms en el que expira (viene de <expirationTime> del TA).
  expira: number;
}

// ─── WSFEv1: numeración ──────────────────────────────────────────────────────
export interface UltimoComprobante {
  puntoVenta: number;
  tipoComprobante: number;
  numero: number;
}

// ─── WSFEv1: solicitud de CAE ────────────────────────────────────────────────
export interface ItemComprobante {
  descripcion: string;
  cantidad: number;
  precioUnitario: number; // neto por unidad (sin IVA)
}

export interface SolicitudCae {
  tipoComprobante: number;
  puntoVenta: number;
  concepto: number;
  docTipo: number;
  docNro: string;
  // Neto gravado, IVA e importe total ya calculados por el service.
  importeNeto: number;
  importeIva: number;
  importeTotal: number;
  // 21 % por defecto; el monotributo (Factura C) va sin IVA discriminado.
  discriminaIva: boolean;
  fechaComprobante: string; // yyyymmdd
}

export interface ObservacionArca {
  code: number;
  msg: string;
}

// Resultado de FECAESolicitar ya parseado y normalizado.
export interface ResultadoCae {
  aprobado: boolean;
  cae: string | null;
  caeVencimiento: string | null; // yyyymmdd
  numero: number;
  observaciones: ObservacionArca[];
  errores: ObservacionArca[];
}
