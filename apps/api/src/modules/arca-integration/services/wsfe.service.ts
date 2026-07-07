import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import axios from 'axios';
import { WSFE_URL, WSFE_NS, IVA_21, CONCEPTO } from '../arca.constants';
import { CredencialesArca } from './arca-config.service';
import {
  ObservacionArca,
  ResultadoCae,
  SolicitudCae,
  TicketAcceso,
} from '../arca.types';

/**
 * WSFEv1: numeración y solicitud de CAE. Sólo arma/parsea los sobres SOAP; la
 * orquestación (persistencia, cálculo de importes) vive en FacturacionService.
 */
@Injectable()
export class WsfeService {
  private readonly logger = new Logger(WsfeService.name);

  private auth(cred: CredencialesArca, ta: TicketAcceso): string {
    return `<ar:Auth>
        <ar:Token>${ta.token}</ar:Token>
        <ar:Sign>${ta.sign}</ar:Sign>
        <ar:Cuit>${cred.cuit}</ar:Cuit>
      </ar:Auth>`;
  }

  /** Último comprobante autorizado para un punto de venta y tipo. 0 = ninguno. */
  async ultimoAutorizado(
    cred: CredencialesArca,
    ta: TicketAcceso,
    puntoVenta: number,
    tipoComprobante: number,
  ): Promise<number> {
    const body = `<ar:FECompUltimoAutorizado>
      ${this.auth(cred, ta)}
      <ar:PtoVta>${puntoVenta}</ar:PtoVta>
      <ar:CbteTipo>${tipoComprobante}</ar:CbteTipo>
    </ar:FECompUltimoAutorizado>`;
    const xml = await this.llamar(cred, 'FECompUltimoAutorizado', body);
    this.chequearErrores(xml);
    const nro = entre(xml, 'CbteNro');
    return nro ? parseInt(nro, 10) : 0;
  }

  /** Solicita el CAE para un comprobante ya numerado. */
  async solicitarCae(
    cred: CredencialesArca,
    ta: TicketAcceso,
    numero: number,
    s: SolicitudCae,
  ): Promise<ResultadoCae> {
    const ivaBloque = s.discriminaIva
      ? `<ar:Iva>
            <ar:AlicIva>
              <ar:Id>${IVA_21.id}</ar:Id>
              <ar:BaseImp>${round2(s.importeNeto)}</ar:BaseImp>
              <ar:Importe>${round2(s.importeIva)}</ar:Importe>
            </ar:AlicIva>
          </ar:Iva>`
      : '';

    // Los comprobantes de servicios (Concepto 2/3) exigen período de servicio y
    // fecha de vto. de pago; usamos la fecha del comprobante para los tres.
    const esServicio = s.concepto !== CONCEPTO.PRODUCTOS;
    const fechasServicio = esServicio
      ? `<ar:FchServDesde>${s.fechaComprobante}</ar:FchServDesde>
         <ar:FchServHasta>${s.fechaComprobante}</ar:FchServHasta>
         <ar:FchVtoPago>${s.fechaComprobante}</ar:FchVtoPago>`
      : '';

    const body = `<ar:FECAESolicitar>
      ${this.auth(cred, ta)}
      <ar:FeCAEReq>
        <ar:FeCabReq>
          <ar:CantReg>1</ar:CantReg>
          <ar:PtoVta>${s.puntoVenta}</ar:PtoVta>
          <ar:CbteTipo>${s.tipoComprobante}</ar:CbteTipo>
        </ar:FeCabReq>
        <ar:FeDetReq>
          <ar:FECAEDetRequest>
            <ar:Concepto>${s.concepto}</ar:Concepto>
            <ar:DocTipo>${s.docTipo}</ar:DocTipo>
            <ar:DocNro>${s.docNro}</ar:DocNro>
            <ar:CbteDesde>${numero}</ar:CbteDesde>
            <ar:CbteHasta>${numero}</ar:CbteHasta>
            <ar:CbteFch>${s.fechaComprobante}</ar:CbteFch>
            <ar:ImpTotal>${round2(s.importeTotal)}</ar:ImpTotal>
            <ar:ImpTotConc>0</ar:ImpTotConc>
            <ar:ImpNeto>${round2(s.importeNeto)}</ar:ImpNeto>
            <ar:ImpOpEx>0</ar:ImpOpEx>
            <ar:ImpIVA>${round2(s.importeIva)}</ar:ImpIVA>
            <ar:ImpTrib>0</ar:ImpTrib>
            ${fechasServicio}
            <ar:MonId>PES</ar:MonId>
            <ar:MonCotiz>1</ar:MonCotiz>
            ${ivaBloque}
          </ar:FECAEDetRequest>
        </ar:FeDetReq>
      </ar:FeCAEReq>
    </ar:FECAESolicitar>`;

    const xml = await this.llamar(cred, 'FECAESolicitar', body);
    return this.parsearResultado(xml, numero);
  }

  private async llamar(
    cred: CredencialesArca,
    metodo: string,
    body: string,
  ): Promise<string> {
    const soap = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ar="${WSFE_NS}">
  <soapenv:Header/>
  <soapenv:Body>
    ${body}
  </soapenv:Body>
</soapenv:Envelope>`;
    try {
      const { data } = await axios.post(WSFE_URL[cred.ambiente], soap, {
        headers: {
          'Content-Type': 'text/xml; charset=utf-8',
          SOAPAction: `${WSFE_NS}${metodo}`,
        },
        timeout: 30_000,
      });
      return typeof data === 'string' ? data : String(data);
    } catch (e) {
      const fault = extraerFault(e);
      this.logger.error(`Fallo en ${metodo} (WSFE): ${fault ?? msg(e)}`);
      throw new ServiceUnavailableException(
        `No se pudo contactar a ARCA (${metodo}): ${fault ?? msg(e)}`,
      );
    }
  }

  /** Errores a nivel método (<Errors>): auth vencida, CUIT sin permisos, etc. */
  private chequearErrores(xml: string): void {
    const errores = extraerLista(xml, 'Err');
    if (errores.length) {
      const detalle = errores.map((e) => `[${e.code}] ${e.msg}`).join(' | ');
      throw new ServiceUnavailableException(
        `ARCA devolvió errores: ${detalle}`,
      );
    }
  }

  private parsearResultado(xml: string, numero: number): ResultadoCae {
    const errores = extraerLista(xml, 'Err');
    const observaciones = extraerLista(xml, 'Obs');
    const resultado = entre(xml, 'Resultado'); // A (aprobado) | R (rechazado)
    const cae = entre(xml, 'CAE');
    const caeVto = entre(xml, 'CAEFchVto');
    const aprobado = resultado === 'A' && !!cae;
    return {
      aprobado,
      cae: aprobado ? cae : null,
      caeVencimiento: aprobado ? caeVto : null,
      numero,
      observaciones,
      errores,
    };
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function round2(n: number): string {
  return (Math.round(n * 100) / 100).toFixed(2);
}

function entre(xml: string, tag: string): string | null {
  const m = xml.match(
    new RegExp(`<(?:\\w+:)?${tag}[^>]*>([\\s\\S]*?)</(?:\\w+:)?${tag}>`, 'i'),
  );
  return m ? m[1].trim() : null;
}

/** Extrae todos los <Obs>/<Err> con sus <Code> y <Msg>. */
function extraerLista(xml: string, tag: string): ObservacionArca[] {
  const re = new RegExp(
    `<(?:\\w+:)?${tag}[^>]*>([\\s\\S]*?)</(?:\\w+:)?${tag}>`,
    'gi',
  );
  const out: ObservacionArca[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null) {
    const bloque = m[1];
    const code = entre(bloque, 'Code');
    const msgTxt = entre(bloque, 'Msg');
    if (code || msgTxt) {
      out.push({ code: code ? parseInt(code, 10) : 0, msg: msgTxt ?? '' });
    }
  }
  return out;
}

function extraerFault(e: unknown): string | null {
  if (axios.isAxiosError(e) && typeof e.response?.data === 'string') {
    return entre(e.response.data, 'faultstring');
  }
  return null;
}

function msg(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}
