
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.TenantScalarFieldEnum = {
  id: 'id',
  nombre: 'nombre',
  factor_cobertura: 'factor_cobertura',
  margen_objetivo: 'margen_objetivo',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  tenant_id: 'tenant_id',
  email: 'email',
  password: 'password',
  role: 'role',
  created_at: 'created_at',
  updated_at: 'updated_at',
  deleted_at: 'deleted_at'
};

exports.Prisma.VigiladorScalarFieldEnum = {
  id: 'id',
  tenant_id: 'tenant_id',
  legajo_nro: 'legajo_nro',
  nombre: 'nombre',
  apellido: 'apellido',
  documento: 'documento',
  estado: 'estado',
  created_at: 'created_at',
  updated_at: 'updated_at',
  deleted_at: 'deleted_at'
};

exports.Prisma.CredencialScalarFieldEnum = {
  id: 'id',
  tenant_id: 'tenant_id',
  vigilador_id: 'vigilador_id',
  tipo: 'tipo',
  numero: 'numero',
  organismo: 'organismo',
  emitida_el: 'emitida_el',
  vence_el: 'vence_el',
  created_at: 'created_at'
};

exports.Prisma.ObjetivoScalarFieldEnum = {
  id: 'id',
  tenant_id: 'tenant_id',
  cliente_id: 'cliente_id',
  codigo: 'codigo',
  nombre: 'nombre',
  direccion: 'direccion',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.PuestoScalarFieldEnum = {
  id: 'id',
  tenant_id: 'tenant_id',
  objetivo_id: 'objetivo_id',
  nombre: 'nombre',
  ubicacion: 'ubicacion',
  requiere_arma: 'requiere_arma',
  requiere_movil: 'requiere_movil',
  esquema_horario: 'esquema_horario',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.AsignacionScalarFieldEnum = {
  id: 'id',
  tenant_id: 'tenant_id',
  puesto_id: 'puesto_id',
  vigilador_id: 'vigilador_id',
  fecha: 'fecha',
  hora_inicio: 'hora_inicio',
  hora_fin: 'hora_fin',
  estado: 'estado',
  created_at: 'created_at'
};

exports.Prisma.AsistenciaScalarFieldEnum = {
  id: 'id',
  tenant_id: 'tenant_id',
  asignacion_id: 'asignacion_id',
  inicio_real: 'inicio_real',
  fin_real: 'fin_real',
  metodo: 'metodo',
  lat: 'lat',
  lng: 'lng'
};

exports.Prisma.FeriadoScalarFieldEnum = {
  id: 'id',
  tenant_id: 'tenant_id',
  nombre: 'nombre',
  fecha: 'fecha',
  created_at: 'created_at'
};

exports.Prisma.ConfiguracionCostosScalarFieldEnum = {
  id: 'id',
  tenant_id: 'tenant_id',
  costo_hora_base: 'costo_hora_base',
  cargas_sociales: 'cargas_sociales',
  costos_uniforme: 'costos_uniforme',
  otros_costos: 'otros_costos',
  factor_ajuste: 'factor_ajuste',
  updated_at: 'updated_at'
};

exports.Prisma.CotizacionScalarFieldEnum = {
  id: 'id',
  tenant_id: 'tenant_id',
  cliente_nombre: 'cliente_nombre',
  vencimiento: 'vencimiento',
  estado: 'estado',
  total_mensual: 'total_mensual',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.CotizacionItemScalarFieldEnum = {
  id: 'id',
  cotizacion_id: 'cotizacion_id',
  puesto_nombre: 'puesto_nombre',
  horas_mensuales: 'horas_mensuales',
  costo_hora: 'costo_hora',
  margen: 'margen',
  subtotal: 'subtotal'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};


exports.Prisma.ModelName = {
  Tenant: 'Tenant',
  User: 'User',
  Vigilador: 'Vigilador',
  Credencial: 'Credencial',
  Objetivo: 'Objetivo',
  Puesto: 'Puesto',
  Asignacion: 'Asignacion',
  Asistencia: 'Asistencia',
  Feriado: 'Feriado',
  ConfiguracionCostos: 'ConfiguracionCostos',
  Cotizacion: 'Cotizacion',
  CotizacionItem: 'CotizacionItem'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
