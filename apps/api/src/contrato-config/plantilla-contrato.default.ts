// Plantilla por defecto del contrato, editable en modo HTML desde
// Configuración > Contratos. Los placeholders {{...}} se completan al
// generar el documento de un Contrato puntual (ver ContratoPdfService).
export const PLANTILLA_CONTRATO_DEFAULT = `<h1>CONTRATO DE PRESTACIÓN DE SERVICIOS DE SEGURIDAD PRIVADA</h1>
<p>En {{tenant_direccion}}, a {{fecha_actual}}, entre <b>{{tenant_razon_social}}</b>, CUIT {{tenant_cuit}}, con domicilio en {{tenant_direccion}}, en adelante "LA PRESTADORA", y <b>{{cliente_nombre}}</b>, CUIT {{cliente_cuit}}, con domicilio en {{cliente_domicilio}}, en adelante "EL CLIENTE", convienen celebrar el presente contrato de prestación de servicios de seguridad privada, identificado con el código <b>{{contrato_codigo}}</b>, sujeto a las siguientes cláusulas:</p>

<h2>PRIMERA - OBJETO</h2>
<p>LA PRESTADORA se obliga a prestar el servicio de vigilancia y seguridad privada en el/los objetivo/s detallados a continuación, con la dotación, modalidad y horario allí indicados.</p>

{{objetivos_tabla}}

<h2>SEGUNDA - FACTURACIÓN</h2>
<p>{{facturacion_resumen}}</p>

<h2>TERCERA - VIGENCIA</h2>
<p>El presente contrato entra en vigencia a partir del {{contrato_inicio}} y se renueva automáticamente por períodos iguales, salvo notificación fehaciente de cualquiera de las partes con una antelación mínima de 30 días.</p>

<h2>CUARTA - PERSONAL</h2>
<p>LA PRESTADORA destinará personal propio, habilitado y registrado conforme a la normativa de seguridad privada vigente, manteniendo la dirección y poder disciplinario exclusivo sobre dicho personal, sin que ello genere relación de dependencia laboral con EL CLIENTE.</p>

<h2>QUINTA - RESPONSABILIDAD</h2>
<p>LA PRESTADORA mantendrá vigente una póliza de seguro de responsabilidad civil que cubra los daños que pudiera ocasionar el personal afectado al servicio, en los términos del Código Civil y Comercial de la Nación.</p>

<p>En prueba de conformidad, se firma el presente en el lugar y fecha indicados.</p>

<table style="width:100%; margin-top:40px; border:none;">
  <tr style="border:none;">
    <td style="border:none; text-align:center; width:50%;">
      {{firma_imagen}}
      <p>_____________________________</p>
      <p><b>{{firma_nombre}}</b><br/>{{firma_cargo}}<br/>Por {{tenant_razon_social}}</p>
    </td>
    <td style="border:none; text-align:center; width:50%;">
      <p>&nbsp;</p>
      <p>_____________________________</p>
      <p><b>{{cliente_nombre}}</b><br/>Por EL CLIENTE</p>
    </td>
  </tr>
</table>
`;
