
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Tenant
 * 
 */
export type Tenant = $Result.DefaultSelection<Prisma.$TenantPayload>
/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Vigilador
 * 
 */
export type Vigilador = $Result.DefaultSelection<Prisma.$VigiladorPayload>
/**
 * Model Credencial
 * 
 */
export type Credencial = $Result.DefaultSelection<Prisma.$CredencialPayload>
/**
 * Model Objetivo
 * 
 */
export type Objetivo = $Result.DefaultSelection<Prisma.$ObjetivoPayload>
/**
 * Model Puesto
 * 
 */
export type Puesto = $Result.DefaultSelection<Prisma.$PuestoPayload>
/**
 * Model Asignacion
 * 
 */
export type Asignacion = $Result.DefaultSelection<Prisma.$AsignacionPayload>
/**
 * Model Asistencia
 * 
 */
export type Asistencia = $Result.DefaultSelection<Prisma.$AsistenciaPayload>
/**
 * Model Feriado
 * 
 */
export type Feriado = $Result.DefaultSelection<Prisma.$FeriadoPayload>
/**
 * Model ConfiguracionCostos
 * 
 */
export type ConfiguracionCostos = $Result.DefaultSelection<Prisma.$ConfiguracionCostosPayload>
/**
 * Model Cotizacion
 * 
 */
export type Cotizacion = $Result.DefaultSelection<Prisma.$CotizacionPayload>
/**
 * Model CotizacionItem
 * 
 */
export type CotizacionItem = $Result.DefaultSelection<Prisma.$CotizacionItemPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Tenants
 * const tenants = await prisma.tenant.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Tenants
   * const tenants = await prisma.tenant.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.tenant`: Exposes CRUD operations for the **Tenant** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tenants
    * const tenants = await prisma.tenant.findMany()
    * ```
    */
  get tenant(): Prisma.TenantDelegate<ExtArgs>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs>;

  /**
   * `prisma.vigilador`: Exposes CRUD operations for the **Vigilador** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Vigiladors
    * const vigiladors = await prisma.vigilador.findMany()
    * ```
    */
  get vigilador(): Prisma.VigiladorDelegate<ExtArgs>;

  /**
   * `prisma.credencial`: Exposes CRUD operations for the **Credencial** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Credencials
    * const credencials = await prisma.credencial.findMany()
    * ```
    */
  get credencial(): Prisma.CredencialDelegate<ExtArgs>;

  /**
   * `prisma.objetivo`: Exposes CRUD operations for the **Objetivo** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Objetivos
    * const objetivos = await prisma.objetivo.findMany()
    * ```
    */
  get objetivo(): Prisma.ObjetivoDelegate<ExtArgs>;

  /**
   * `prisma.puesto`: Exposes CRUD operations for the **Puesto** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Puestos
    * const puestos = await prisma.puesto.findMany()
    * ```
    */
  get puesto(): Prisma.PuestoDelegate<ExtArgs>;

  /**
   * `prisma.asignacion`: Exposes CRUD operations for the **Asignacion** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Asignacions
    * const asignacions = await prisma.asignacion.findMany()
    * ```
    */
  get asignacion(): Prisma.AsignacionDelegate<ExtArgs>;

  /**
   * `prisma.asistencia`: Exposes CRUD operations for the **Asistencia** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Asistencias
    * const asistencias = await prisma.asistencia.findMany()
    * ```
    */
  get asistencia(): Prisma.AsistenciaDelegate<ExtArgs>;

  /**
   * `prisma.feriado`: Exposes CRUD operations for the **Feriado** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Feriados
    * const feriados = await prisma.feriado.findMany()
    * ```
    */
  get feriado(): Prisma.FeriadoDelegate<ExtArgs>;

  /**
   * `prisma.configuracionCostos`: Exposes CRUD operations for the **ConfiguracionCostos** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ConfiguracionCostos
    * const configuracionCostos = await prisma.configuracionCostos.findMany()
    * ```
    */
  get configuracionCostos(): Prisma.ConfiguracionCostosDelegate<ExtArgs>;

  /**
   * `prisma.cotizacion`: Exposes CRUD operations for the **Cotizacion** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Cotizacions
    * const cotizacions = await prisma.cotizacion.findMany()
    * ```
    */
  get cotizacion(): Prisma.CotizacionDelegate<ExtArgs>;

  /**
   * `prisma.cotizacionItem`: Exposes CRUD operations for the **CotizacionItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CotizacionItems
    * const cotizacionItems = await prisma.cotizacionItem.findMany()
    * ```
    */
  get cotizacionItem(): Prisma.CotizacionItemDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
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

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "tenant" | "user" | "vigilador" | "credencial" | "objetivo" | "puesto" | "asignacion" | "asistencia" | "feriado" | "configuracionCostos" | "cotizacion" | "cotizacionItem"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Tenant: {
        payload: Prisma.$TenantPayload<ExtArgs>
        fields: Prisma.TenantFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TenantFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TenantFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          findFirst: {
            args: Prisma.TenantFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TenantFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          findMany: {
            args: Prisma.TenantFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>[]
          }
          create: {
            args: Prisma.TenantCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          createMany: {
            args: Prisma.TenantCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TenantCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>[]
          }
          delete: {
            args: Prisma.TenantDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          update: {
            args: Prisma.TenantUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          deleteMany: {
            args: Prisma.TenantDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TenantUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TenantUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          aggregate: {
            args: Prisma.TenantAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTenant>
          }
          groupBy: {
            args: Prisma.TenantGroupByArgs<ExtArgs>
            result: $Utils.Optional<TenantGroupByOutputType>[]
          }
          count: {
            args: Prisma.TenantCountArgs<ExtArgs>
            result: $Utils.Optional<TenantCountAggregateOutputType> | number
          }
        }
      }
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Vigilador: {
        payload: Prisma.$VigiladorPayload<ExtArgs>
        fields: Prisma.VigiladorFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VigiladorFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VigiladorPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VigiladorFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VigiladorPayload>
          }
          findFirst: {
            args: Prisma.VigiladorFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VigiladorPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VigiladorFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VigiladorPayload>
          }
          findMany: {
            args: Prisma.VigiladorFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VigiladorPayload>[]
          }
          create: {
            args: Prisma.VigiladorCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VigiladorPayload>
          }
          createMany: {
            args: Prisma.VigiladorCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VigiladorCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VigiladorPayload>[]
          }
          delete: {
            args: Prisma.VigiladorDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VigiladorPayload>
          }
          update: {
            args: Prisma.VigiladorUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VigiladorPayload>
          }
          deleteMany: {
            args: Prisma.VigiladorDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VigiladorUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.VigiladorUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VigiladorPayload>
          }
          aggregate: {
            args: Prisma.VigiladorAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVigilador>
          }
          groupBy: {
            args: Prisma.VigiladorGroupByArgs<ExtArgs>
            result: $Utils.Optional<VigiladorGroupByOutputType>[]
          }
          count: {
            args: Prisma.VigiladorCountArgs<ExtArgs>
            result: $Utils.Optional<VigiladorCountAggregateOutputType> | number
          }
        }
      }
      Credencial: {
        payload: Prisma.$CredencialPayload<ExtArgs>
        fields: Prisma.CredencialFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CredencialFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CredencialPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CredencialFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CredencialPayload>
          }
          findFirst: {
            args: Prisma.CredencialFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CredencialPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CredencialFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CredencialPayload>
          }
          findMany: {
            args: Prisma.CredencialFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CredencialPayload>[]
          }
          create: {
            args: Prisma.CredencialCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CredencialPayload>
          }
          createMany: {
            args: Prisma.CredencialCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CredencialCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CredencialPayload>[]
          }
          delete: {
            args: Prisma.CredencialDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CredencialPayload>
          }
          update: {
            args: Prisma.CredencialUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CredencialPayload>
          }
          deleteMany: {
            args: Prisma.CredencialDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CredencialUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CredencialUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CredencialPayload>
          }
          aggregate: {
            args: Prisma.CredencialAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCredencial>
          }
          groupBy: {
            args: Prisma.CredencialGroupByArgs<ExtArgs>
            result: $Utils.Optional<CredencialGroupByOutputType>[]
          }
          count: {
            args: Prisma.CredencialCountArgs<ExtArgs>
            result: $Utils.Optional<CredencialCountAggregateOutputType> | number
          }
        }
      }
      Objetivo: {
        payload: Prisma.$ObjetivoPayload<ExtArgs>
        fields: Prisma.ObjetivoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ObjetivoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObjetivoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ObjetivoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObjetivoPayload>
          }
          findFirst: {
            args: Prisma.ObjetivoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObjetivoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ObjetivoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObjetivoPayload>
          }
          findMany: {
            args: Prisma.ObjetivoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObjetivoPayload>[]
          }
          create: {
            args: Prisma.ObjetivoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObjetivoPayload>
          }
          createMany: {
            args: Prisma.ObjetivoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ObjetivoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObjetivoPayload>[]
          }
          delete: {
            args: Prisma.ObjetivoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObjetivoPayload>
          }
          update: {
            args: Prisma.ObjetivoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObjetivoPayload>
          }
          deleteMany: {
            args: Prisma.ObjetivoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ObjetivoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ObjetivoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObjetivoPayload>
          }
          aggregate: {
            args: Prisma.ObjetivoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateObjetivo>
          }
          groupBy: {
            args: Prisma.ObjetivoGroupByArgs<ExtArgs>
            result: $Utils.Optional<ObjetivoGroupByOutputType>[]
          }
          count: {
            args: Prisma.ObjetivoCountArgs<ExtArgs>
            result: $Utils.Optional<ObjetivoCountAggregateOutputType> | number
          }
        }
      }
      Puesto: {
        payload: Prisma.$PuestoPayload<ExtArgs>
        fields: Prisma.PuestoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PuestoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PuestoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PuestoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PuestoPayload>
          }
          findFirst: {
            args: Prisma.PuestoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PuestoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PuestoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PuestoPayload>
          }
          findMany: {
            args: Prisma.PuestoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PuestoPayload>[]
          }
          create: {
            args: Prisma.PuestoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PuestoPayload>
          }
          createMany: {
            args: Prisma.PuestoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PuestoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PuestoPayload>[]
          }
          delete: {
            args: Prisma.PuestoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PuestoPayload>
          }
          update: {
            args: Prisma.PuestoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PuestoPayload>
          }
          deleteMany: {
            args: Prisma.PuestoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PuestoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PuestoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PuestoPayload>
          }
          aggregate: {
            args: Prisma.PuestoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePuesto>
          }
          groupBy: {
            args: Prisma.PuestoGroupByArgs<ExtArgs>
            result: $Utils.Optional<PuestoGroupByOutputType>[]
          }
          count: {
            args: Prisma.PuestoCountArgs<ExtArgs>
            result: $Utils.Optional<PuestoCountAggregateOutputType> | number
          }
        }
      }
      Asignacion: {
        payload: Prisma.$AsignacionPayload<ExtArgs>
        fields: Prisma.AsignacionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AsignacionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsignacionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AsignacionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsignacionPayload>
          }
          findFirst: {
            args: Prisma.AsignacionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsignacionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AsignacionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsignacionPayload>
          }
          findMany: {
            args: Prisma.AsignacionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsignacionPayload>[]
          }
          create: {
            args: Prisma.AsignacionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsignacionPayload>
          }
          createMany: {
            args: Prisma.AsignacionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AsignacionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsignacionPayload>[]
          }
          delete: {
            args: Prisma.AsignacionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsignacionPayload>
          }
          update: {
            args: Prisma.AsignacionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsignacionPayload>
          }
          deleteMany: {
            args: Prisma.AsignacionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AsignacionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AsignacionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsignacionPayload>
          }
          aggregate: {
            args: Prisma.AsignacionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAsignacion>
          }
          groupBy: {
            args: Prisma.AsignacionGroupByArgs<ExtArgs>
            result: $Utils.Optional<AsignacionGroupByOutputType>[]
          }
          count: {
            args: Prisma.AsignacionCountArgs<ExtArgs>
            result: $Utils.Optional<AsignacionCountAggregateOutputType> | number
          }
        }
      }
      Asistencia: {
        payload: Prisma.$AsistenciaPayload<ExtArgs>
        fields: Prisma.AsistenciaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AsistenciaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsistenciaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AsistenciaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsistenciaPayload>
          }
          findFirst: {
            args: Prisma.AsistenciaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsistenciaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AsistenciaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsistenciaPayload>
          }
          findMany: {
            args: Prisma.AsistenciaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsistenciaPayload>[]
          }
          create: {
            args: Prisma.AsistenciaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsistenciaPayload>
          }
          createMany: {
            args: Prisma.AsistenciaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AsistenciaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsistenciaPayload>[]
          }
          delete: {
            args: Prisma.AsistenciaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsistenciaPayload>
          }
          update: {
            args: Prisma.AsistenciaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsistenciaPayload>
          }
          deleteMany: {
            args: Prisma.AsistenciaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AsistenciaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AsistenciaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsistenciaPayload>
          }
          aggregate: {
            args: Prisma.AsistenciaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAsistencia>
          }
          groupBy: {
            args: Prisma.AsistenciaGroupByArgs<ExtArgs>
            result: $Utils.Optional<AsistenciaGroupByOutputType>[]
          }
          count: {
            args: Prisma.AsistenciaCountArgs<ExtArgs>
            result: $Utils.Optional<AsistenciaCountAggregateOutputType> | number
          }
        }
      }
      Feriado: {
        payload: Prisma.$FeriadoPayload<ExtArgs>
        fields: Prisma.FeriadoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FeriadoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeriadoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FeriadoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeriadoPayload>
          }
          findFirst: {
            args: Prisma.FeriadoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeriadoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FeriadoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeriadoPayload>
          }
          findMany: {
            args: Prisma.FeriadoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeriadoPayload>[]
          }
          create: {
            args: Prisma.FeriadoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeriadoPayload>
          }
          createMany: {
            args: Prisma.FeriadoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FeriadoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeriadoPayload>[]
          }
          delete: {
            args: Prisma.FeriadoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeriadoPayload>
          }
          update: {
            args: Prisma.FeriadoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeriadoPayload>
          }
          deleteMany: {
            args: Prisma.FeriadoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FeriadoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.FeriadoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeriadoPayload>
          }
          aggregate: {
            args: Prisma.FeriadoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFeriado>
          }
          groupBy: {
            args: Prisma.FeriadoGroupByArgs<ExtArgs>
            result: $Utils.Optional<FeriadoGroupByOutputType>[]
          }
          count: {
            args: Prisma.FeriadoCountArgs<ExtArgs>
            result: $Utils.Optional<FeriadoCountAggregateOutputType> | number
          }
        }
      }
      ConfiguracionCostos: {
        payload: Prisma.$ConfiguracionCostosPayload<ExtArgs>
        fields: Prisma.ConfiguracionCostosFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ConfiguracionCostosFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfiguracionCostosPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ConfiguracionCostosFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfiguracionCostosPayload>
          }
          findFirst: {
            args: Prisma.ConfiguracionCostosFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfiguracionCostosPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ConfiguracionCostosFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfiguracionCostosPayload>
          }
          findMany: {
            args: Prisma.ConfiguracionCostosFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfiguracionCostosPayload>[]
          }
          create: {
            args: Prisma.ConfiguracionCostosCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfiguracionCostosPayload>
          }
          createMany: {
            args: Prisma.ConfiguracionCostosCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ConfiguracionCostosCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfiguracionCostosPayload>[]
          }
          delete: {
            args: Prisma.ConfiguracionCostosDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfiguracionCostosPayload>
          }
          update: {
            args: Prisma.ConfiguracionCostosUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfiguracionCostosPayload>
          }
          deleteMany: {
            args: Prisma.ConfiguracionCostosDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ConfiguracionCostosUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ConfiguracionCostosUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfiguracionCostosPayload>
          }
          aggregate: {
            args: Prisma.ConfiguracionCostosAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateConfiguracionCostos>
          }
          groupBy: {
            args: Prisma.ConfiguracionCostosGroupByArgs<ExtArgs>
            result: $Utils.Optional<ConfiguracionCostosGroupByOutputType>[]
          }
          count: {
            args: Prisma.ConfiguracionCostosCountArgs<ExtArgs>
            result: $Utils.Optional<ConfiguracionCostosCountAggregateOutputType> | number
          }
        }
      }
      Cotizacion: {
        payload: Prisma.$CotizacionPayload<ExtArgs>
        fields: Prisma.CotizacionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CotizacionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CotizacionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CotizacionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CotizacionPayload>
          }
          findFirst: {
            args: Prisma.CotizacionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CotizacionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CotizacionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CotizacionPayload>
          }
          findMany: {
            args: Prisma.CotizacionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CotizacionPayload>[]
          }
          create: {
            args: Prisma.CotizacionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CotizacionPayload>
          }
          createMany: {
            args: Prisma.CotizacionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CotizacionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CotizacionPayload>[]
          }
          delete: {
            args: Prisma.CotizacionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CotizacionPayload>
          }
          update: {
            args: Prisma.CotizacionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CotizacionPayload>
          }
          deleteMany: {
            args: Prisma.CotizacionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CotizacionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CotizacionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CotizacionPayload>
          }
          aggregate: {
            args: Prisma.CotizacionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCotizacion>
          }
          groupBy: {
            args: Prisma.CotizacionGroupByArgs<ExtArgs>
            result: $Utils.Optional<CotizacionGroupByOutputType>[]
          }
          count: {
            args: Prisma.CotizacionCountArgs<ExtArgs>
            result: $Utils.Optional<CotizacionCountAggregateOutputType> | number
          }
        }
      }
      CotizacionItem: {
        payload: Prisma.$CotizacionItemPayload<ExtArgs>
        fields: Prisma.CotizacionItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CotizacionItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CotizacionItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CotizacionItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CotizacionItemPayload>
          }
          findFirst: {
            args: Prisma.CotizacionItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CotizacionItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CotizacionItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CotizacionItemPayload>
          }
          findMany: {
            args: Prisma.CotizacionItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CotizacionItemPayload>[]
          }
          create: {
            args: Prisma.CotizacionItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CotizacionItemPayload>
          }
          createMany: {
            args: Prisma.CotizacionItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CotizacionItemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CotizacionItemPayload>[]
          }
          delete: {
            args: Prisma.CotizacionItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CotizacionItemPayload>
          }
          update: {
            args: Prisma.CotizacionItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CotizacionItemPayload>
          }
          deleteMany: {
            args: Prisma.CotizacionItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CotizacionItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CotizacionItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CotizacionItemPayload>
          }
          aggregate: {
            args: Prisma.CotizacionItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCotizacionItem>
          }
          groupBy: {
            args: Prisma.CotizacionItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<CotizacionItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.CotizacionItemCountArgs<ExtArgs>
            result: $Utils.Optional<CotizacionItemCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type TenantCountOutputType
   */

  export type TenantCountOutputType = {
    users: number
    vigiladores: number
    credenciales: number
    objetivos: number
    puestos: number
    asignaciones: number
    asistencias: number
    feriados: number
    cotizaciones: number
  }

  export type TenantCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | TenantCountOutputTypeCountUsersArgs
    vigiladores?: boolean | TenantCountOutputTypeCountVigiladoresArgs
    credenciales?: boolean | TenantCountOutputTypeCountCredencialesArgs
    objetivos?: boolean | TenantCountOutputTypeCountObjetivosArgs
    puestos?: boolean | TenantCountOutputTypeCountPuestosArgs
    asignaciones?: boolean | TenantCountOutputTypeCountAsignacionesArgs
    asistencias?: boolean | TenantCountOutputTypeCountAsistenciasArgs
    feriados?: boolean | TenantCountOutputTypeCountFeriadosArgs
    cotizaciones?: boolean | TenantCountOutputTypeCountCotizacionesArgs
  }

  // Custom InputTypes
  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantCountOutputType
     */
    select?: TenantCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountUsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountVigiladoresArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VigiladorWhereInput
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountCredencialesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CredencialWhereInput
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountObjetivosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ObjetivoWhereInput
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountPuestosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PuestoWhereInput
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountAsignacionesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AsignacionWhereInput
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountAsistenciasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AsistenciaWhereInput
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountFeriadosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FeriadoWhereInput
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountCotizacionesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CotizacionWhereInput
  }


  /**
   * Count Type VigiladorCountOutputType
   */

  export type VigiladorCountOutputType = {
    credenciales: number
    asignaciones: number
  }

  export type VigiladorCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    credenciales?: boolean | VigiladorCountOutputTypeCountCredencialesArgs
    asignaciones?: boolean | VigiladorCountOutputTypeCountAsignacionesArgs
  }

  // Custom InputTypes
  /**
   * VigiladorCountOutputType without action
   */
  export type VigiladorCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VigiladorCountOutputType
     */
    select?: VigiladorCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * VigiladorCountOutputType without action
   */
  export type VigiladorCountOutputTypeCountCredencialesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CredencialWhereInput
  }

  /**
   * VigiladorCountOutputType without action
   */
  export type VigiladorCountOutputTypeCountAsignacionesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AsignacionWhereInput
  }


  /**
   * Count Type ObjetivoCountOutputType
   */

  export type ObjetivoCountOutputType = {
    puestos: number
  }

  export type ObjetivoCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    puestos?: boolean | ObjetivoCountOutputTypeCountPuestosArgs
  }

  // Custom InputTypes
  /**
   * ObjetivoCountOutputType without action
   */
  export type ObjetivoCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ObjetivoCountOutputType
     */
    select?: ObjetivoCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ObjetivoCountOutputType without action
   */
  export type ObjetivoCountOutputTypeCountPuestosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PuestoWhereInput
  }


  /**
   * Count Type PuestoCountOutputType
   */

  export type PuestoCountOutputType = {
    asignaciones: number
  }

  export type PuestoCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    asignaciones?: boolean | PuestoCountOutputTypeCountAsignacionesArgs
  }

  // Custom InputTypes
  /**
   * PuestoCountOutputType without action
   */
  export type PuestoCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PuestoCountOutputType
     */
    select?: PuestoCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PuestoCountOutputType without action
   */
  export type PuestoCountOutputTypeCountAsignacionesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AsignacionWhereInput
  }


  /**
   * Count Type CotizacionCountOutputType
   */

  export type CotizacionCountOutputType = {
    items: number
  }

  export type CotizacionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    items?: boolean | CotizacionCountOutputTypeCountItemsArgs
  }

  // Custom InputTypes
  /**
   * CotizacionCountOutputType without action
   */
  export type CotizacionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CotizacionCountOutputType
     */
    select?: CotizacionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CotizacionCountOutputType without action
   */
  export type CotizacionCountOutputTypeCountItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CotizacionItemWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Tenant
   */

  export type AggregateTenant = {
    _count: TenantCountAggregateOutputType | null
    _avg: TenantAvgAggregateOutputType | null
    _sum: TenantSumAggregateOutputType | null
    _min: TenantMinAggregateOutputType | null
    _max: TenantMaxAggregateOutputType | null
  }

  export type TenantAvgAggregateOutputType = {
    factor_cobertura: Decimal | null
    margen_objetivo: Decimal | null
  }

  export type TenantSumAggregateOutputType = {
    factor_cobertura: Decimal | null
    margen_objetivo: Decimal | null
  }

  export type TenantMinAggregateOutputType = {
    id: string | null
    nombre: string | null
    factor_cobertura: Decimal | null
    margen_objetivo: Decimal | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type TenantMaxAggregateOutputType = {
    id: string | null
    nombre: string | null
    factor_cobertura: Decimal | null
    margen_objetivo: Decimal | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type TenantCountAggregateOutputType = {
    id: number
    nombre: number
    factor_cobertura: number
    margen_objetivo: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type TenantAvgAggregateInputType = {
    factor_cobertura?: true
    margen_objetivo?: true
  }

  export type TenantSumAggregateInputType = {
    factor_cobertura?: true
    margen_objetivo?: true
  }

  export type TenantMinAggregateInputType = {
    id?: true
    nombre?: true
    factor_cobertura?: true
    margen_objetivo?: true
    created_at?: true
    updated_at?: true
  }

  export type TenantMaxAggregateInputType = {
    id?: true
    nombre?: true
    factor_cobertura?: true
    margen_objetivo?: true
    created_at?: true
    updated_at?: true
  }

  export type TenantCountAggregateInputType = {
    id?: true
    nombre?: true
    factor_cobertura?: true
    margen_objetivo?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type TenantAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tenant to aggregate.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Tenants
    **/
    _count?: true | TenantCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TenantAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TenantSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TenantMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TenantMaxAggregateInputType
  }

  export type GetTenantAggregateType<T extends TenantAggregateArgs> = {
        [P in keyof T & keyof AggregateTenant]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTenant[P]>
      : GetScalarType<T[P], AggregateTenant[P]>
  }




  export type TenantGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TenantWhereInput
    orderBy?: TenantOrderByWithAggregationInput | TenantOrderByWithAggregationInput[]
    by: TenantScalarFieldEnum[] | TenantScalarFieldEnum
    having?: TenantScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TenantCountAggregateInputType | true
    _avg?: TenantAvgAggregateInputType
    _sum?: TenantSumAggregateInputType
    _min?: TenantMinAggregateInputType
    _max?: TenantMaxAggregateInputType
  }

  export type TenantGroupByOutputType = {
    id: string
    nombre: string
    factor_cobertura: Decimal
    margen_objetivo: Decimal
    created_at: Date
    updated_at: Date
    _count: TenantCountAggregateOutputType | null
    _avg: TenantAvgAggregateOutputType | null
    _sum: TenantSumAggregateOutputType | null
    _min: TenantMinAggregateOutputType | null
    _max: TenantMaxAggregateOutputType | null
  }

  type GetTenantGroupByPayload<T extends TenantGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TenantGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TenantGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TenantGroupByOutputType[P]>
            : GetScalarType<T[P], TenantGroupByOutputType[P]>
        }
      >
    >


  export type TenantSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    factor_cobertura?: boolean
    margen_objetivo?: boolean
    created_at?: boolean
    updated_at?: boolean
    users?: boolean | Tenant$usersArgs<ExtArgs>
    vigiladores?: boolean | Tenant$vigiladoresArgs<ExtArgs>
    credenciales?: boolean | Tenant$credencialesArgs<ExtArgs>
    objetivos?: boolean | Tenant$objetivosArgs<ExtArgs>
    puestos?: boolean | Tenant$puestosArgs<ExtArgs>
    asignaciones?: boolean | Tenant$asignacionesArgs<ExtArgs>
    asistencias?: boolean | Tenant$asistenciasArgs<ExtArgs>
    feriados?: boolean | Tenant$feriadosArgs<ExtArgs>
    configuracion_costos?: boolean | Tenant$configuracion_costosArgs<ExtArgs>
    cotizaciones?: boolean | Tenant$cotizacionesArgs<ExtArgs>
    _count?: boolean | TenantCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tenant"]>

  export type TenantSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    factor_cobertura?: boolean
    margen_objetivo?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["tenant"]>

  export type TenantSelectScalar = {
    id?: boolean
    nombre?: boolean
    factor_cobertura?: boolean
    margen_objetivo?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type TenantInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | Tenant$usersArgs<ExtArgs>
    vigiladores?: boolean | Tenant$vigiladoresArgs<ExtArgs>
    credenciales?: boolean | Tenant$credencialesArgs<ExtArgs>
    objetivos?: boolean | Tenant$objetivosArgs<ExtArgs>
    puestos?: boolean | Tenant$puestosArgs<ExtArgs>
    asignaciones?: boolean | Tenant$asignacionesArgs<ExtArgs>
    asistencias?: boolean | Tenant$asistenciasArgs<ExtArgs>
    feriados?: boolean | Tenant$feriadosArgs<ExtArgs>
    configuracion_costos?: boolean | Tenant$configuracion_costosArgs<ExtArgs>
    cotizaciones?: boolean | Tenant$cotizacionesArgs<ExtArgs>
    _count?: boolean | TenantCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TenantIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $TenantPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Tenant"
    objects: {
      users: Prisma.$UserPayload<ExtArgs>[]
      vigiladores: Prisma.$VigiladorPayload<ExtArgs>[]
      credenciales: Prisma.$CredencialPayload<ExtArgs>[]
      objetivos: Prisma.$ObjetivoPayload<ExtArgs>[]
      puestos: Prisma.$PuestoPayload<ExtArgs>[]
      asignaciones: Prisma.$AsignacionPayload<ExtArgs>[]
      asistencias: Prisma.$AsistenciaPayload<ExtArgs>[]
      feriados: Prisma.$FeriadoPayload<ExtArgs>[]
      configuracion_costos: Prisma.$ConfiguracionCostosPayload<ExtArgs> | null
      cotizaciones: Prisma.$CotizacionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      nombre: string
      factor_cobertura: Prisma.Decimal
      margen_objetivo: Prisma.Decimal
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["tenant"]>
    composites: {}
  }

  type TenantGetPayload<S extends boolean | null | undefined | TenantDefaultArgs> = $Result.GetResult<Prisma.$TenantPayload, S>

  type TenantCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TenantFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TenantCountAggregateInputType | true
    }

  export interface TenantDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Tenant'], meta: { name: 'Tenant' } }
    /**
     * Find zero or one Tenant that matches the filter.
     * @param {TenantFindUniqueArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TenantFindUniqueArgs>(args: SelectSubset<T, TenantFindUniqueArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Tenant that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TenantFindUniqueOrThrowArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TenantFindUniqueOrThrowArgs>(args: SelectSubset<T, TenantFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Tenant that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantFindFirstArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TenantFindFirstArgs>(args?: SelectSubset<T, TenantFindFirstArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Tenant that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantFindFirstOrThrowArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TenantFindFirstOrThrowArgs>(args?: SelectSubset<T, TenantFindFirstOrThrowArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Tenants that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tenants
     * const tenants = await prisma.tenant.findMany()
     * 
     * // Get first 10 Tenants
     * const tenants = await prisma.tenant.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tenantWithIdOnly = await prisma.tenant.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TenantFindManyArgs>(args?: SelectSubset<T, TenantFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Tenant.
     * @param {TenantCreateArgs} args - Arguments to create a Tenant.
     * @example
     * // Create one Tenant
     * const Tenant = await prisma.tenant.create({
     *   data: {
     *     // ... data to create a Tenant
     *   }
     * })
     * 
     */
    create<T extends TenantCreateArgs>(args: SelectSubset<T, TenantCreateArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Tenants.
     * @param {TenantCreateManyArgs} args - Arguments to create many Tenants.
     * @example
     * // Create many Tenants
     * const tenant = await prisma.tenant.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TenantCreateManyArgs>(args?: SelectSubset<T, TenantCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Tenants and returns the data saved in the database.
     * @param {TenantCreateManyAndReturnArgs} args - Arguments to create many Tenants.
     * @example
     * // Create many Tenants
     * const tenant = await prisma.tenant.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Tenants and only return the `id`
     * const tenantWithIdOnly = await prisma.tenant.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TenantCreateManyAndReturnArgs>(args?: SelectSubset<T, TenantCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Tenant.
     * @param {TenantDeleteArgs} args - Arguments to delete one Tenant.
     * @example
     * // Delete one Tenant
     * const Tenant = await prisma.tenant.delete({
     *   where: {
     *     // ... filter to delete one Tenant
     *   }
     * })
     * 
     */
    delete<T extends TenantDeleteArgs>(args: SelectSubset<T, TenantDeleteArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Tenant.
     * @param {TenantUpdateArgs} args - Arguments to update one Tenant.
     * @example
     * // Update one Tenant
     * const tenant = await prisma.tenant.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TenantUpdateArgs>(args: SelectSubset<T, TenantUpdateArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Tenants.
     * @param {TenantDeleteManyArgs} args - Arguments to filter Tenants to delete.
     * @example
     * // Delete a few Tenants
     * const { count } = await prisma.tenant.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TenantDeleteManyArgs>(args?: SelectSubset<T, TenantDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tenants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tenants
     * const tenant = await prisma.tenant.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TenantUpdateManyArgs>(args: SelectSubset<T, TenantUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Tenant.
     * @param {TenantUpsertArgs} args - Arguments to update or create a Tenant.
     * @example
     * // Update or create a Tenant
     * const tenant = await prisma.tenant.upsert({
     *   create: {
     *     // ... data to create a Tenant
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Tenant we want to update
     *   }
     * })
     */
    upsert<T extends TenantUpsertArgs>(args: SelectSubset<T, TenantUpsertArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Tenants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantCountArgs} args - Arguments to filter Tenants to count.
     * @example
     * // Count the number of Tenants
     * const count = await prisma.tenant.count({
     *   where: {
     *     // ... the filter for the Tenants we want to count
     *   }
     * })
    **/
    count<T extends TenantCountArgs>(
      args?: Subset<T, TenantCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TenantCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Tenant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TenantAggregateArgs>(args: Subset<T, TenantAggregateArgs>): Prisma.PrismaPromise<GetTenantAggregateType<T>>

    /**
     * Group by Tenant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TenantGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TenantGroupByArgs['orderBy'] }
        : { orderBy?: TenantGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TenantGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTenantGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Tenant model
   */
  readonly fields: TenantFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Tenant.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TenantClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    users<T extends Tenant$usersArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$usersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany"> | Null>
    vigiladores<T extends Tenant$vigiladoresArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$vigiladoresArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VigiladorPayload<ExtArgs>, T, "findMany"> | Null>
    credenciales<T extends Tenant$credencialesArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$credencialesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CredencialPayload<ExtArgs>, T, "findMany"> | Null>
    objetivos<T extends Tenant$objetivosArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$objetivosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ObjetivoPayload<ExtArgs>, T, "findMany"> | Null>
    puestos<T extends Tenant$puestosArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$puestosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PuestoPayload<ExtArgs>, T, "findMany"> | Null>
    asignaciones<T extends Tenant$asignacionesArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$asignacionesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AsignacionPayload<ExtArgs>, T, "findMany"> | Null>
    asistencias<T extends Tenant$asistenciasArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$asistenciasArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AsistenciaPayload<ExtArgs>, T, "findMany"> | Null>
    feriados<T extends Tenant$feriadosArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$feriadosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FeriadoPayload<ExtArgs>, T, "findMany"> | Null>
    configuracion_costos<T extends Tenant$configuracion_costosArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$configuracion_costosArgs<ExtArgs>>): Prisma__ConfiguracionCostosClient<$Result.GetResult<Prisma.$ConfiguracionCostosPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    cotizaciones<T extends Tenant$cotizacionesArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$cotizacionesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CotizacionPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Tenant model
   */ 
  interface TenantFieldRefs {
    readonly id: FieldRef<"Tenant", 'String'>
    readonly nombre: FieldRef<"Tenant", 'String'>
    readonly factor_cobertura: FieldRef<"Tenant", 'Decimal'>
    readonly margen_objetivo: FieldRef<"Tenant", 'Decimal'>
    readonly created_at: FieldRef<"Tenant", 'DateTime'>
    readonly updated_at: FieldRef<"Tenant", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Tenant findUnique
   */
  export type TenantFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant findUniqueOrThrow
   */
  export type TenantFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant findFirst
   */
  export type TenantFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tenants.
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tenants.
     */
    distinct?: TenantScalarFieldEnum | TenantScalarFieldEnum[]
  }

  /**
   * Tenant findFirstOrThrow
   */
  export type TenantFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tenants.
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tenants.
     */
    distinct?: TenantScalarFieldEnum | TenantScalarFieldEnum[]
  }

  /**
   * Tenant findMany
   */
  export type TenantFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenants to fetch.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Tenants.
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    distinct?: TenantScalarFieldEnum | TenantScalarFieldEnum[]
  }

  /**
   * Tenant create
   */
  export type TenantCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * The data needed to create a Tenant.
     */
    data: XOR<TenantCreateInput, TenantUncheckedCreateInput>
  }

  /**
   * Tenant createMany
   */
  export type TenantCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Tenants.
     */
    data: TenantCreateManyInput | TenantCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Tenant createManyAndReturn
   */
  export type TenantCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Tenants.
     */
    data: TenantCreateManyInput | TenantCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Tenant update
   */
  export type TenantUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * The data needed to update a Tenant.
     */
    data: XOR<TenantUpdateInput, TenantUncheckedUpdateInput>
    /**
     * Choose, which Tenant to update.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant updateMany
   */
  export type TenantUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Tenants.
     */
    data: XOR<TenantUpdateManyMutationInput, TenantUncheckedUpdateManyInput>
    /**
     * Filter which Tenants to update
     */
    where?: TenantWhereInput
  }

  /**
   * Tenant upsert
   */
  export type TenantUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * The filter to search for the Tenant to update in case it exists.
     */
    where: TenantWhereUniqueInput
    /**
     * In case the Tenant found by the `where` argument doesn't exist, create a new Tenant with this data.
     */
    create: XOR<TenantCreateInput, TenantUncheckedCreateInput>
    /**
     * In case the Tenant was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TenantUpdateInput, TenantUncheckedUpdateInput>
  }

  /**
   * Tenant delete
   */
  export type TenantDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter which Tenant to delete.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant deleteMany
   */
  export type TenantDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tenants to delete
     */
    where?: TenantWhereInput
  }

  /**
   * Tenant.users
   */
  export type Tenant$usersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * Tenant.vigiladores
   */
  export type Tenant$vigiladoresArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vigilador
     */
    select?: VigiladorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VigiladorInclude<ExtArgs> | null
    where?: VigiladorWhereInput
    orderBy?: VigiladorOrderByWithRelationInput | VigiladorOrderByWithRelationInput[]
    cursor?: VigiladorWhereUniqueInput
    take?: number
    skip?: number
    distinct?: VigiladorScalarFieldEnum | VigiladorScalarFieldEnum[]
  }

  /**
   * Tenant.credenciales
   */
  export type Tenant$credencialesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Credencial
     */
    select?: CredencialSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CredencialInclude<ExtArgs> | null
    where?: CredencialWhereInput
    orderBy?: CredencialOrderByWithRelationInput | CredencialOrderByWithRelationInput[]
    cursor?: CredencialWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CredencialScalarFieldEnum | CredencialScalarFieldEnum[]
  }

  /**
   * Tenant.objetivos
   */
  export type Tenant$objetivosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Objetivo
     */
    select?: ObjetivoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObjetivoInclude<ExtArgs> | null
    where?: ObjetivoWhereInput
    orderBy?: ObjetivoOrderByWithRelationInput | ObjetivoOrderByWithRelationInput[]
    cursor?: ObjetivoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ObjetivoScalarFieldEnum | ObjetivoScalarFieldEnum[]
  }

  /**
   * Tenant.puestos
   */
  export type Tenant$puestosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Puesto
     */
    select?: PuestoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PuestoInclude<ExtArgs> | null
    where?: PuestoWhereInput
    orderBy?: PuestoOrderByWithRelationInput | PuestoOrderByWithRelationInput[]
    cursor?: PuestoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PuestoScalarFieldEnum | PuestoScalarFieldEnum[]
  }

  /**
   * Tenant.asignaciones
   */
  export type Tenant$asignacionesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asignacion
     */
    select?: AsignacionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AsignacionInclude<ExtArgs> | null
    where?: AsignacionWhereInput
    orderBy?: AsignacionOrderByWithRelationInput | AsignacionOrderByWithRelationInput[]
    cursor?: AsignacionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AsignacionScalarFieldEnum | AsignacionScalarFieldEnum[]
  }

  /**
   * Tenant.asistencias
   */
  export type Tenant$asistenciasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asistencia
     */
    select?: AsistenciaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AsistenciaInclude<ExtArgs> | null
    where?: AsistenciaWhereInput
    orderBy?: AsistenciaOrderByWithRelationInput | AsistenciaOrderByWithRelationInput[]
    cursor?: AsistenciaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AsistenciaScalarFieldEnum | AsistenciaScalarFieldEnum[]
  }

  /**
   * Tenant.feriados
   */
  export type Tenant$feriadosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feriado
     */
    select?: FeriadoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeriadoInclude<ExtArgs> | null
    where?: FeriadoWhereInput
    orderBy?: FeriadoOrderByWithRelationInput | FeriadoOrderByWithRelationInput[]
    cursor?: FeriadoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FeriadoScalarFieldEnum | FeriadoScalarFieldEnum[]
  }

  /**
   * Tenant.configuracion_costos
   */
  export type Tenant$configuracion_costosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfiguracionCostos
     */
    select?: ConfiguracionCostosSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConfiguracionCostosInclude<ExtArgs> | null
    where?: ConfiguracionCostosWhereInput
  }

  /**
   * Tenant.cotizaciones
   */
  export type Tenant$cotizacionesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cotizacion
     */
    select?: CotizacionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CotizacionInclude<ExtArgs> | null
    where?: CotizacionWhereInput
    orderBy?: CotizacionOrderByWithRelationInput | CotizacionOrderByWithRelationInput[]
    cursor?: CotizacionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CotizacionScalarFieldEnum | CotizacionScalarFieldEnum[]
  }

  /**
   * Tenant without action
   */
  export type TenantDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
  }


  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    tenant_id: string | null
    email: string | null
    password: string | null
    role: string | null
    created_at: Date | null
    updated_at: Date | null
    deleted_at: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    tenant_id: string | null
    email: string | null
    password: string | null
    role: string | null
    created_at: Date | null
    updated_at: Date | null
    deleted_at: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    tenant_id: number
    email: number
    password: number
    role: number
    created_at: number
    updated_at: number
    deleted_at: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    tenant_id?: true
    email?: true
    password?: true
    role?: true
    created_at?: true
    updated_at?: true
    deleted_at?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    tenant_id?: true
    email?: true
    password?: true
    role?: true
    created_at?: true
    updated_at?: true
    deleted_at?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    tenant_id?: true
    email?: true
    password?: true
    role?: true
    created_at?: true
    updated_at?: true
    deleted_at?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    tenant_id: string
    email: string
    password: string
    role: string
    created_at: Date
    updated_at: Date
    deleted_at: Date | null
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenant_id?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    created_at?: boolean
    updated_at?: boolean
    deleted_at?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenant_id?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    created_at?: boolean
    updated_at?: boolean
    deleted_at?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    tenant_id?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    created_at?: boolean
    updated_at?: boolean
    deleted_at?: boolean
  }

  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenant_id: string
      email: string
      password: string
      role: string
      created_at: Date
      updated_at: Date
      deleted_at: Date | null
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */ 
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly tenant_id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'String'>
    readonly created_at: FieldRef<"User", 'DateTime'>
    readonly updated_at: FieldRef<"User", 'DateTime'>
    readonly deleted_at: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Vigilador
   */

  export type AggregateVigilador = {
    _count: VigiladorCountAggregateOutputType | null
    _min: VigiladorMinAggregateOutputType | null
    _max: VigiladorMaxAggregateOutputType | null
  }

  export type VigiladorMinAggregateOutputType = {
    id: string | null
    tenant_id: string | null
    legajo_nro: string | null
    nombre: string | null
    apellido: string | null
    documento: string | null
    estado: string | null
    created_at: Date | null
    updated_at: Date | null
    deleted_at: Date | null
  }

  export type VigiladorMaxAggregateOutputType = {
    id: string | null
    tenant_id: string | null
    legajo_nro: string | null
    nombre: string | null
    apellido: string | null
    documento: string | null
    estado: string | null
    created_at: Date | null
    updated_at: Date | null
    deleted_at: Date | null
  }

  export type VigiladorCountAggregateOutputType = {
    id: number
    tenant_id: number
    legajo_nro: number
    nombre: number
    apellido: number
    documento: number
    estado: number
    created_at: number
    updated_at: number
    deleted_at: number
    _all: number
  }


  export type VigiladorMinAggregateInputType = {
    id?: true
    tenant_id?: true
    legajo_nro?: true
    nombre?: true
    apellido?: true
    documento?: true
    estado?: true
    created_at?: true
    updated_at?: true
    deleted_at?: true
  }

  export type VigiladorMaxAggregateInputType = {
    id?: true
    tenant_id?: true
    legajo_nro?: true
    nombre?: true
    apellido?: true
    documento?: true
    estado?: true
    created_at?: true
    updated_at?: true
    deleted_at?: true
  }

  export type VigiladorCountAggregateInputType = {
    id?: true
    tenant_id?: true
    legajo_nro?: true
    nombre?: true
    apellido?: true
    documento?: true
    estado?: true
    created_at?: true
    updated_at?: true
    deleted_at?: true
    _all?: true
  }

  export type VigiladorAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Vigilador to aggregate.
     */
    where?: VigiladorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Vigiladors to fetch.
     */
    orderBy?: VigiladorOrderByWithRelationInput | VigiladorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VigiladorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Vigiladors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Vigiladors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Vigiladors
    **/
    _count?: true | VigiladorCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VigiladorMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VigiladorMaxAggregateInputType
  }

  export type GetVigiladorAggregateType<T extends VigiladorAggregateArgs> = {
        [P in keyof T & keyof AggregateVigilador]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVigilador[P]>
      : GetScalarType<T[P], AggregateVigilador[P]>
  }




  export type VigiladorGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VigiladorWhereInput
    orderBy?: VigiladorOrderByWithAggregationInput | VigiladorOrderByWithAggregationInput[]
    by: VigiladorScalarFieldEnum[] | VigiladorScalarFieldEnum
    having?: VigiladorScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VigiladorCountAggregateInputType | true
    _min?: VigiladorMinAggregateInputType
    _max?: VigiladorMaxAggregateInputType
  }

  export type VigiladorGroupByOutputType = {
    id: string
    tenant_id: string
    legajo_nro: string
    nombre: string
    apellido: string
    documento: string
    estado: string
    created_at: Date
    updated_at: Date
    deleted_at: Date | null
    _count: VigiladorCountAggregateOutputType | null
    _min: VigiladorMinAggregateOutputType | null
    _max: VigiladorMaxAggregateOutputType | null
  }

  type GetVigiladorGroupByPayload<T extends VigiladorGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VigiladorGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VigiladorGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VigiladorGroupByOutputType[P]>
            : GetScalarType<T[P], VigiladorGroupByOutputType[P]>
        }
      >
    >


  export type VigiladorSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenant_id?: boolean
    legajo_nro?: boolean
    nombre?: boolean
    apellido?: boolean
    documento?: boolean
    estado?: boolean
    created_at?: boolean
    updated_at?: boolean
    deleted_at?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    credenciales?: boolean | Vigilador$credencialesArgs<ExtArgs>
    asignaciones?: boolean | Vigilador$asignacionesArgs<ExtArgs>
    _count?: boolean | VigiladorCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["vigilador"]>

  export type VigiladorSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenant_id?: boolean
    legajo_nro?: boolean
    nombre?: boolean
    apellido?: boolean
    documento?: boolean
    estado?: boolean
    created_at?: boolean
    updated_at?: boolean
    deleted_at?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["vigilador"]>

  export type VigiladorSelectScalar = {
    id?: boolean
    tenant_id?: boolean
    legajo_nro?: boolean
    nombre?: boolean
    apellido?: boolean
    documento?: boolean
    estado?: boolean
    created_at?: boolean
    updated_at?: boolean
    deleted_at?: boolean
  }

  export type VigiladorInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    credenciales?: boolean | Vigilador$credencialesArgs<ExtArgs>
    asignaciones?: boolean | Vigilador$asignacionesArgs<ExtArgs>
    _count?: boolean | VigiladorCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type VigiladorIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }

  export type $VigiladorPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Vigilador"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
      credenciales: Prisma.$CredencialPayload<ExtArgs>[]
      asignaciones: Prisma.$AsignacionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenant_id: string
      legajo_nro: string
      nombre: string
      apellido: string
      documento: string
      estado: string
      created_at: Date
      updated_at: Date
      deleted_at: Date | null
    }, ExtArgs["result"]["vigilador"]>
    composites: {}
  }

  type VigiladorGetPayload<S extends boolean | null | undefined | VigiladorDefaultArgs> = $Result.GetResult<Prisma.$VigiladorPayload, S>

  type VigiladorCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<VigiladorFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: VigiladorCountAggregateInputType | true
    }

  export interface VigiladorDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Vigilador'], meta: { name: 'Vigilador' } }
    /**
     * Find zero or one Vigilador that matches the filter.
     * @param {VigiladorFindUniqueArgs} args - Arguments to find a Vigilador
     * @example
     * // Get one Vigilador
     * const vigilador = await prisma.vigilador.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VigiladorFindUniqueArgs>(args: SelectSubset<T, VigiladorFindUniqueArgs<ExtArgs>>): Prisma__VigiladorClient<$Result.GetResult<Prisma.$VigiladorPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Vigilador that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {VigiladorFindUniqueOrThrowArgs} args - Arguments to find a Vigilador
     * @example
     * // Get one Vigilador
     * const vigilador = await prisma.vigilador.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VigiladorFindUniqueOrThrowArgs>(args: SelectSubset<T, VigiladorFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VigiladorClient<$Result.GetResult<Prisma.$VigiladorPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Vigilador that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VigiladorFindFirstArgs} args - Arguments to find a Vigilador
     * @example
     * // Get one Vigilador
     * const vigilador = await prisma.vigilador.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VigiladorFindFirstArgs>(args?: SelectSubset<T, VigiladorFindFirstArgs<ExtArgs>>): Prisma__VigiladorClient<$Result.GetResult<Prisma.$VigiladorPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Vigilador that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VigiladorFindFirstOrThrowArgs} args - Arguments to find a Vigilador
     * @example
     * // Get one Vigilador
     * const vigilador = await prisma.vigilador.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VigiladorFindFirstOrThrowArgs>(args?: SelectSubset<T, VigiladorFindFirstOrThrowArgs<ExtArgs>>): Prisma__VigiladorClient<$Result.GetResult<Prisma.$VigiladorPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Vigiladors that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VigiladorFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Vigiladors
     * const vigiladors = await prisma.vigilador.findMany()
     * 
     * // Get first 10 Vigiladors
     * const vigiladors = await prisma.vigilador.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const vigiladorWithIdOnly = await prisma.vigilador.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VigiladorFindManyArgs>(args?: SelectSubset<T, VigiladorFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VigiladorPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Vigilador.
     * @param {VigiladorCreateArgs} args - Arguments to create a Vigilador.
     * @example
     * // Create one Vigilador
     * const Vigilador = await prisma.vigilador.create({
     *   data: {
     *     // ... data to create a Vigilador
     *   }
     * })
     * 
     */
    create<T extends VigiladorCreateArgs>(args: SelectSubset<T, VigiladorCreateArgs<ExtArgs>>): Prisma__VigiladorClient<$Result.GetResult<Prisma.$VigiladorPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Vigiladors.
     * @param {VigiladorCreateManyArgs} args - Arguments to create many Vigiladors.
     * @example
     * // Create many Vigiladors
     * const vigilador = await prisma.vigilador.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VigiladorCreateManyArgs>(args?: SelectSubset<T, VigiladorCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Vigiladors and returns the data saved in the database.
     * @param {VigiladorCreateManyAndReturnArgs} args - Arguments to create many Vigiladors.
     * @example
     * // Create many Vigiladors
     * const vigilador = await prisma.vigilador.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Vigiladors and only return the `id`
     * const vigiladorWithIdOnly = await prisma.vigilador.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VigiladorCreateManyAndReturnArgs>(args?: SelectSubset<T, VigiladorCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VigiladorPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Vigilador.
     * @param {VigiladorDeleteArgs} args - Arguments to delete one Vigilador.
     * @example
     * // Delete one Vigilador
     * const Vigilador = await prisma.vigilador.delete({
     *   where: {
     *     // ... filter to delete one Vigilador
     *   }
     * })
     * 
     */
    delete<T extends VigiladorDeleteArgs>(args: SelectSubset<T, VigiladorDeleteArgs<ExtArgs>>): Prisma__VigiladorClient<$Result.GetResult<Prisma.$VigiladorPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Vigilador.
     * @param {VigiladorUpdateArgs} args - Arguments to update one Vigilador.
     * @example
     * // Update one Vigilador
     * const vigilador = await prisma.vigilador.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VigiladorUpdateArgs>(args: SelectSubset<T, VigiladorUpdateArgs<ExtArgs>>): Prisma__VigiladorClient<$Result.GetResult<Prisma.$VigiladorPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Vigiladors.
     * @param {VigiladorDeleteManyArgs} args - Arguments to filter Vigiladors to delete.
     * @example
     * // Delete a few Vigiladors
     * const { count } = await prisma.vigilador.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VigiladorDeleteManyArgs>(args?: SelectSubset<T, VigiladorDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Vigiladors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VigiladorUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Vigiladors
     * const vigilador = await prisma.vigilador.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VigiladorUpdateManyArgs>(args: SelectSubset<T, VigiladorUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Vigilador.
     * @param {VigiladorUpsertArgs} args - Arguments to update or create a Vigilador.
     * @example
     * // Update or create a Vigilador
     * const vigilador = await prisma.vigilador.upsert({
     *   create: {
     *     // ... data to create a Vigilador
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Vigilador we want to update
     *   }
     * })
     */
    upsert<T extends VigiladorUpsertArgs>(args: SelectSubset<T, VigiladorUpsertArgs<ExtArgs>>): Prisma__VigiladorClient<$Result.GetResult<Prisma.$VigiladorPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Vigiladors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VigiladorCountArgs} args - Arguments to filter Vigiladors to count.
     * @example
     * // Count the number of Vigiladors
     * const count = await prisma.vigilador.count({
     *   where: {
     *     // ... the filter for the Vigiladors we want to count
     *   }
     * })
    **/
    count<T extends VigiladorCountArgs>(
      args?: Subset<T, VigiladorCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VigiladorCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Vigilador.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VigiladorAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VigiladorAggregateArgs>(args: Subset<T, VigiladorAggregateArgs>): Prisma.PrismaPromise<GetVigiladorAggregateType<T>>

    /**
     * Group by Vigilador.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VigiladorGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VigiladorGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VigiladorGroupByArgs['orderBy'] }
        : { orderBy?: VigiladorGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VigiladorGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVigiladorGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Vigilador model
   */
  readonly fields: VigiladorFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Vigilador.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VigiladorClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    credenciales<T extends Vigilador$credencialesArgs<ExtArgs> = {}>(args?: Subset<T, Vigilador$credencialesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CredencialPayload<ExtArgs>, T, "findMany"> | Null>
    asignaciones<T extends Vigilador$asignacionesArgs<ExtArgs> = {}>(args?: Subset<T, Vigilador$asignacionesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AsignacionPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Vigilador model
   */ 
  interface VigiladorFieldRefs {
    readonly id: FieldRef<"Vigilador", 'String'>
    readonly tenant_id: FieldRef<"Vigilador", 'String'>
    readonly legajo_nro: FieldRef<"Vigilador", 'String'>
    readonly nombre: FieldRef<"Vigilador", 'String'>
    readonly apellido: FieldRef<"Vigilador", 'String'>
    readonly documento: FieldRef<"Vigilador", 'String'>
    readonly estado: FieldRef<"Vigilador", 'String'>
    readonly created_at: FieldRef<"Vigilador", 'DateTime'>
    readonly updated_at: FieldRef<"Vigilador", 'DateTime'>
    readonly deleted_at: FieldRef<"Vigilador", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Vigilador findUnique
   */
  export type VigiladorFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vigilador
     */
    select?: VigiladorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VigiladorInclude<ExtArgs> | null
    /**
     * Filter, which Vigilador to fetch.
     */
    where: VigiladorWhereUniqueInput
  }

  /**
   * Vigilador findUniqueOrThrow
   */
  export type VigiladorFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vigilador
     */
    select?: VigiladorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VigiladorInclude<ExtArgs> | null
    /**
     * Filter, which Vigilador to fetch.
     */
    where: VigiladorWhereUniqueInput
  }

  /**
   * Vigilador findFirst
   */
  export type VigiladorFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vigilador
     */
    select?: VigiladorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VigiladorInclude<ExtArgs> | null
    /**
     * Filter, which Vigilador to fetch.
     */
    where?: VigiladorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Vigiladors to fetch.
     */
    orderBy?: VigiladorOrderByWithRelationInput | VigiladorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Vigiladors.
     */
    cursor?: VigiladorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Vigiladors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Vigiladors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Vigiladors.
     */
    distinct?: VigiladorScalarFieldEnum | VigiladorScalarFieldEnum[]
  }

  /**
   * Vigilador findFirstOrThrow
   */
  export type VigiladorFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vigilador
     */
    select?: VigiladorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VigiladorInclude<ExtArgs> | null
    /**
     * Filter, which Vigilador to fetch.
     */
    where?: VigiladorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Vigiladors to fetch.
     */
    orderBy?: VigiladorOrderByWithRelationInput | VigiladorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Vigiladors.
     */
    cursor?: VigiladorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Vigiladors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Vigiladors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Vigiladors.
     */
    distinct?: VigiladorScalarFieldEnum | VigiladorScalarFieldEnum[]
  }

  /**
   * Vigilador findMany
   */
  export type VigiladorFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vigilador
     */
    select?: VigiladorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VigiladorInclude<ExtArgs> | null
    /**
     * Filter, which Vigiladors to fetch.
     */
    where?: VigiladorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Vigiladors to fetch.
     */
    orderBy?: VigiladorOrderByWithRelationInput | VigiladorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Vigiladors.
     */
    cursor?: VigiladorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Vigiladors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Vigiladors.
     */
    skip?: number
    distinct?: VigiladorScalarFieldEnum | VigiladorScalarFieldEnum[]
  }

  /**
   * Vigilador create
   */
  export type VigiladorCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vigilador
     */
    select?: VigiladorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VigiladorInclude<ExtArgs> | null
    /**
     * The data needed to create a Vigilador.
     */
    data: XOR<VigiladorCreateInput, VigiladorUncheckedCreateInput>
  }

  /**
   * Vigilador createMany
   */
  export type VigiladorCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Vigiladors.
     */
    data: VigiladorCreateManyInput | VigiladorCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Vigilador createManyAndReturn
   */
  export type VigiladorCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vigilador
     */
    select?: VigiladorSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Vigiladors.
     */
    data: VigiladorCreateManyInput | VigiladorCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VigiladorIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Vigilador update
   */
  export type VigiladorUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vigilador
     */
    select?: VigiladorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VigiladorInclude<ExtArgs> | null
    /**
     * The data needed to update a Vigilador.
     */
    data: XOR<VigiladorUpdateInput, VigiladorUncheckedUpdateInput>
    /**
     * Choose, which Vigilador to update.
     */
    where: VigiladorWhereUniqueInput
  }

  /**
   * Vigilador updateMany
   */
  export type VigiladorUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Vigiladors.
     */
    data: XOR<VigiladorUpdateManyMutationInput, VigiladorUncheckedUpdateManyInput>
    /**
     * Filter which Vigiladors to update
     */
    where?: VigiladorWhereInput
  }

  /**
   * Vigilador upsert
   */
  export type VigiladorUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vigilador
     */
    select?: VigiladorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VigiladorInclude<ExtArgs> | null
    /**
     * The filter to search for the Vigilador to update in case it exists.
     */
    where: VigiladorWhereUniqueInput
    /**
     * In case the Vigilador found by the `where` argument doesn't exist, create a new Vigilador with this data.
     */
    create: XOR<VigiladorCreateInput, VigiladorUncheckedCreateInput>
    /**
     * In case the Vigilador was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VigiladorUpdateInput, VigiladorUncheckedUpdateInput>
  }

  /**
   * Vigilador delete
   */
  export type VigiladorDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vigilador
     */
    select?: VigiladorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VigiladorInclude<ExtArgs> | null
    /**
     * Filter which Vigilador to delete.
     */
    where: VigiladorWhereUniqueInput
  }

  /**
   * Vigilador deleteMany
   */
  export type VigiladorDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Vigiladors to delete
     */
    where?: VigiladorWhereInput
  }

  /**
   * Vigilador.credenciales
   */
  export type Vigilador$credencialesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Credencial
     */
    select?: CredencialSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CredencialInclude<ExtArgs> | null
    where?: CredencialWhereInput
    orderBy?: CredencialOrderByWithRelationInput | CredencialOrderByWithRelationInput[]
    cursor?: CredencialWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CredencialScalarFieldEnum | CredencialScalarFieldEnum[]
  }

  /**
   * Vigilador.asignaciones
   */
  export type Vigilador$asignacionesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asignacion
     */
    select?: AsignacionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AsignacionInclude<ExtArgs> | null
    where?: AsignacionWhereInput
    orderBy?: AsignacionOrderByWithRelationInput | AsignacionOrderByWithRelationInput[]
    cursor?: AsignacionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AsignacionScalarFieldEnum | AsignacionScalarFieldEnum[]
  }

  /**
   * Vigilador without action
   */
  export type VigiladorDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vigilador
     */
    select?: VigiladorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VigiladorInclude<ExtArgs> | null
  }


  /**
   * Model Credencial
   */

  export type AggregateCredencial = {
    _count: CredencialCountAggregateOutputType | null
    _min: CredencialMinAggregateOutputType | null
    _max: CredencialMaxAggregateOutputType | null
  }

  export type CredencialMinAggregateOutputType = {
    id: string | null
    tenant_id: string | null
    vigilador_id: string | null
    tipo: string | null
    numero: string | null
    organismo: string | null
    emitida_el: Date | null
    vence_el: Date | null
    created_at: Date | null
  }

  export type CredencialMaxAggregateOutputType = {
    id: string | null
    tenant_id: string | null
    vigilador_id: string | null
    tipo: string | null
    numero: string | null
    organismo: string | null
    emitida_el: Date | null
    vence_el: Date | null
    created_at: Date | null
  }

  export type CredencialCountAggregateOutputType = {
    id: number
    tenant_id: number
    vigilador_id: number
    tipo: number
    numero: number
    organismo: number
    emitida_el: number
    vence_el: number
    created_at: number
    _all: number
  }


  export type CredencialMinAggregateInputType = {
    id?: true
    tenant_id?: true
    vigilador_id?: true
    tipo?: true
    numero?: true
    organismo?: true
    emitida_el?: true
    vence_el?: true
    created_at?: true
  }

  export type CredencialMaxAggregateInputType = {
    id?: true
    tenant_id?: true
    vigilador_id?: true
    tipo?: true
    numero?: true
    organismo?: true
    emitida_el?: true
    vence_el?: true
    created_at?: true
  }

  export type CredencialCountAggregateInputType = {
    id?: true
    tenant_id?: true
    vigilador_id?: true
    tipo?: true
    numero?: true
    organismo?: true
    emitida_el?: true
    vence_el?: true
    created_at?: true
    _all?: true
  }

  export type CredencialAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Credencial to aggregate.
     */
    where?: CredencialWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Credencials to fetch.
     */
    orderBy?: CredencialOrderByWithRelationInput | CredencialOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CredencialWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Credencials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Credencials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Credencials
    **/
    _count?: true | CredencialCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CredencialMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CredencialMaxAggregateInputType
  }

  export type GetCredencialAggregateType<T extends CredencialAggregateArgs> = {
        [P in keyof T & keyof AggregateCredencial]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCredencial[P]>
      : GetScalarType<T[P], AggregateCredencial[P]>
  }




  export type CredencialGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CredencialWhereInput
    orderBy?: CredencialOrderByWithAggregationInput | CredencialOrderByWithAggregationInput[]
    by: CredencialScalarFieldEnum[] | CredencialScalarFieldEnum
    having?: CredencialScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CredencialCountAggregateInputType | true
    _min?: CredencialMinAggregateInputType
    _max?: CredencialMaxAggregateInputType
  }

  export type CredencialGroupByOutputType = {
    id: string
    tenant_id: string
    vigilador_id: string
    tipo: string
    numero: string | null
    organismo: string | null
    emitida_el: Date | null
    vence_el: Date | null
    created_at: Date
    _count: CredencialCountAggregateOutputType | null
    _min: CredencialMinAggregateOutputType | null
    _max: CredencialMaxAggregateOutputType | null
  }

  type GetCredencialGroupByPayload<T extends CredencialGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CredencialGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CredencialGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CredencialGroupByOutputType[P]>
            : GetScalarType<T[P], CredencialGroupByOutputType[P]>
        }
      >
    >


  export type CredencialSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenant_id?: boolean
    vigilador_id?: boolean
    tipo?: boolean
    numero?: boolean
    organismo?: boolean
    emitida_el?: boolean
    vence_el?: boolean
    created_at?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    vigilador?: boolean | VigiladorDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["credencial"]>

  export type CredencialSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenant_id?: boolean
    vigilador_id?: boolean
    tipo?: boolean
    numero?: boolean
    organismo?: boolean
    emitida_el?: boolean
    vence_el?: boolean
    created_at?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    vigilador?: boolean | VigiladorDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["credencial"]>

  export type CredencialSelectScalar = {
    id?: boolean
    tenant_id?: boolean
    vigilador_id?: boolean
    tipo?: boolean
    numero?: boolean
    organismo?: boolean
    emitida_el?: boolean
    vence_el?: boolean
    created_at?: boolean
  }

  export type CredencialInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    vigilador?: boolean | VigiladorDefaultArgs<ExtArgs>
  }
  export type CredencialIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    vigilador?: boolean | VigiladorDefaultArgs<ExtArgs>
  }

  export type $CredencialPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Credencial"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
      vigilador: Prisma.$VigiladorPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenant_id: string
      vigilador_id: string
      tipo: string
      numero: string | null
      organismo: string | null
      emitida_el: Date | null
      vence_el: Date | null
      created_at: Date
    }, ExtArgs["result"]["credencial"]>
    composites: {}
  }

  type CredencialGetPayload<S extends boolean | null | undefined | CredencialDefaultArgs> = $Result.GetResult<Prisma.$CredencialPayload, S>

  type CredencialCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CredencialFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CredencialCountAggregateInputType | true
    }

  export interface CredencialDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Credencial'], meta: { name: 'Credencial' } }
    /**
     * Find zero or one Credencial that matches the filter.
     * @param {CredencialFindUniqueArgs} args - Arguments to find a Credencial
     * @example
     * // Get one Credencial
     * const credencial = await prisma.credencial.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CredencialFindUniqueArgs>(args: SelectSubset<T, CredencialFindUniqueArgs<ExtArgs>>): Prisma__CredencialClient<$Result.GetResult<Prisma.$CredencialPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Credencial that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CredencialFindUniqueOrThrowArgs} args - Arguments to find a Credencial
     * @example
     * // Get one Credencial
     * const credencial = await prisma.credencial.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CredencialFindUniqueOrThrowArgs>(args: SelectSubset<T, CredencialFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CredencialClient<$Result.GetResult<Prisma.$CredencialPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Credencial that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CredencialFindFirstArgs} args - Arguments to find a Credencial
     * @example
     * // Get one Credencial
     * const credencial = await prisma.credencial.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CredencialFindFirstArgs>(args?: SelectSubset<T, CredencialFindFirstArgs<ExtArgs>>): Prisma__CredencialClient<$Result.GetResult<Prisma.$CredencialPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Credencial that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CredencialFindFirstOrThrowArgs} args - Arguments to find a Credencial
     * @example
     * // Get one Credencial
     * const credencial = await prisma.credencial.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CredencialFindFirstOrThrowArgs>(args?: SelectSubset<T, CredencialFindFirstOrThrowArgs<ExtArgs>>): Prisma__CredencialClient<$Result.GetResult<Prisma.$CredencialPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Credencials that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CredencialFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Credencials
     * const credencials = await prisma.credencial.findMany()
     * 
     * // Get first 10 Credencials
     * const credencials = await prisma.credencial.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const credencialWithIdOnly = await prisma.credencial.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CredencialFindManyArgs>(args?: SelectSubset<T, CredencialFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CredencialPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Credencial.
     * @param {CredencialCreateArgs} args - Arguments to create a Credencial.
     * @example
     * // Create one Credencial
     * const Credencial = await prisma.credencial.create({
     *   data: {
     *     // ... data to create a Credencial
     *   }
     * })
     * 
     */
    create<T extends CredencialCreateArgs>(args: SelectSubset<T, CredencialCreateArgs<ExtArgs>>): Prisma__CredencialClient<$Result.GetResult<Prisma.$CredencialPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Credencials.
     * @param {CredencialCreateManyArgs} args - Arguments to create many Credencials.
     * @example
     * // Create many Credencials
     * const credencial = await prisma.credencial.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CredencialCreateManyArgs>(args?: SelectSubset<T, CredencialCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Credencials and returns the data saved in the database.
     * @param {CredencialCreateManyAndReturnArgs} args - Arguments to create many Credencials.
     * @example
     * // Create many Credencials
     * const credencial = await prisma.credencial.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Credencials and only return the `id`
     * const credencialWithIdOnly = await prisma.credencial.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CredencialCreateManyAndReturnArgs>(args?: SelectSubset<T, CredencialCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CredencialPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Credencial.
     * @param {CredencialDeleteArgs} args - Arguments to delete one Credencial.
     * @example
     * // Delete one Credencial
     * const Credencial = await prisma.credencial.delete({
     *   where: {
     *     // ... filter to delete one Credencial
     *   }
     * })
     * 
     */
    delete<T extends CredencialDeleteArgs>(args: SelectSubset<T, CredencialDeleteArgs<ExtArgs>>): Prisma__CredencialClient<$Result.GetResult<Prisma.$CredencialPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Credencial.
     * @param {CredencialUpdateArgs} args - Arguments to update one Credencial.
     * @example
     * // Update one Credencial
     * const credencial = await prisma.credencial.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CredencialUpdateArgs>(args: SelectSubset<T, CredencialUpdateArgs<ExtArgs>>): Prisma__CredencialClient<$Result.GetResult<Prisma.$CredencialPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Credencials.
     * @param {CredencialDeleteManyArgs} args - Arguments to filter Credencials to delete.
     * @example
     * // Delete a few Credencials
     * const { count } = await prisma.credencial.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CredencialDeleteManyArgs>(args?: SelectSubset<T, CredencialDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Credencials.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CredencialUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Credencials
     * const credencial = await prisma.credencial.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CredencialUpdateManyArgs>(args: SelectSubset<T, CredencialUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Credencial.
     * @param {CredencialUpsertArgs} args - Arguments to update or create a Credencial.
     * @example
     * // Update or create a Credencial
     * const credencial = await prisma.credencial.upsert({
     *   create: {
     *     // ... data to create a Credencial
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Credencial we want to update
     *   }
     * })
     */
    upsert<T extends CredencialUpsertArgs>(args: SelectSubset<T, CredencialUpsertArgs<ExtArgs>>): Prisma__CredencialClient<$Result.GetResult<Prisma.$CredencialPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Credencials.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CredencialCountArgs} args - Arguments to filter Credencials to count.
     * @example
     * // Count the number of Credencials
     * const count = await prisma.credencial.count({
     *   where: {
     *     // ... the filter for the Credencials we want to count
     *   }
     * })
    **/
    count<T extends CredencialCountArgs>(
      args?: Subset<T, CredencialCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CredencialCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Credencial.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CredencialAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CredencialAggregateArgs>(args: Subset<T, CredencialAggregateArgs>): Prisma.PrismaPromise<GetCredencialAggregateType<T>>

    /**
     * Group by Credencial.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CredencialGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CredencialGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CredencialGroupByArgs['orderBy'] }
        : { orderBy?: CredencialGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CredencialGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCredencialGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Credencial model
   */
  readonly fields: CredencialFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Credencial.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CredencialClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    vigilador<T extends VigiladorDefaultArgs<ExtArgs> = {}>(args?: Subset<T, VigiladorDefaultArgs<ExtArgs>>): Prisma__VigiladorClient<$Result.GetResult<Prisma.$VigiladorPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Credencial model
   */ 
  interface CredencialFieldRefs {
    readonly id: FieldRef<"Credencial", 'String'>
    readonly tenant_id: FieldRef<"Credencial", 'String'>
    readonly vigilador_id: FieldRef<"Credencial", 'String'>
    readonly tipo: FieldRef<"Credencial", 'String'>
    readonly numero: FieldRef<"Credencial", 'String'>
    readonly organismo: FieldRef<"Credencial", 'String'>
    readonly emitida_el: FieldRef<"Credencial", 'DateTime'>
    readonly vence_el: FieldRef<"Credencial", 'DateTime'>
    readonly created_at: FieldRef<"Credencial", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Credencial findUnique
   */
  export type CredencialFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Credencial
     */
    select?: CredencialSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CredencialInclude<ExtArgs> | null
    /**
     * Filter, which Credencial to fetch.
     */
    where: CredencialWhereUniqueInput
  }

  /**
   * Credencial findUniqueOrThrow
   */
  export type CredencialFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Credencial
     */
    select?: CredencialSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CredencialInclude<ExtArgs> | null
    /**
     * Filter, which Credencial to fetch.
     */
    where: CredencialWhereUniqueInput
  }

  /**
   * Credencial findFirst
   */
  export type CredencialFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Credencial
     */
    select?: CredencialSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CredencialInclude<ExtArgs> | null
    /**
     * Filter, which Credencial to fetch.
     */
    where?: CredencialWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Credencials to fetch.
     */
    orderBy?: CredencialOrderByWithRelationInput | CredencialOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Credencials.
     */
    cursor?: CredencialWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Credencials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Credencials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Credencials.
     */
    distinct?: CredencialScalarFieldEnum | CredencialScalarFieldEnum[]
  }

  /**
   * Credencial findFirstOrThrow
   */
  export type CredencialFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Credencial
     */
    select?: CredencialSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CredencialInclude<ExtArgs> | null
    /**
     * Filter, which Credencial to fetch.
     */
    where?: CredencialWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Credencials to fetch.
     */
    orderBy?: CredencialOrderByWithRelationInput | CredencialOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Credencials.
     */
    cursor?: CredencialWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Credencials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Credencials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Credencials.
     */
    distinct?: CredencialScalarFieldEnum | CredencialScalarFieldEnum[]
  }

  /**
   * Credencial findMany
   */
  export type CredencialFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Credencial
     */
    select?: CredencialSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CredencialInclude<ExtArgs> | null
    /**
     * Filter, which Credencials to fetch.
     */
    where?: CredencialWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Credencials to fetch.
     */
    orderBy?: CredencialOrderByWithRelationInput | CredencialOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Credencials.
     */
    cursor?: CredencialWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Credencials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Credencials.
     */
    skip?: number
    distinct?: CredencialScalarFieldEnum | CredencialScalarFieldEnum[]
  }

  /**
   * Credencial create
   */
  export type CredencialCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Credencial
     */
    select?: CredencialSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CredencialInclude<ExtArgs> | null
    /**
     * The data needed to create a Credencial.
     */
    data: XOR<CredencialCreateInput, CredencialUncheckedCreateInput>
  }

  /**
   * Credencial createMany
   */
  export type CredencialCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Credencials.
     */
    data: CredencialCreateManyInput | CredencialCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Credencial createManyAndReturn
   */
  export type CredencialCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Credencial
     */
    select?: CredencialSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Credencials.
     */
    data: CredencialCreateManyInput | CredencialCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CredencialIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Credencial update
   */
  export type CredencialUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Credencial
     */
    select?: CredencialSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CredencialInclude<ExtArgs> | null
    /**
     * The data needed to update a Credencial.
     */
    data: XOR<CredencialUpdateInput, CredencialUncheckedUpdateInput>
    /**
     * Choose, which Credencial to update.
     */
    where: CredencialWhereUniqueInput
  }

  /**
   * Credencial updateMany
   */
  export type CredencialUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Credencials.
     */
    data: XOR<CredencialUpdateManyMutationInput, CredencialUncheckedUpdateManyInput>
    /**
     * Filter which Credencials to update
     */
    where?: CredencialWhereInput
  }

  /**
   * Credencial upsert
   */
  export type CredencialUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Credencial
     */
    select?: CredencialSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CredencialInclude<ExtArgs> | null
    /**
     * The filter to search for the Credencial to update in case it exists.
     */
    where: CredencialWhereUniqueInput
    /**
     * In case the Credencial found by the `where` argument doesn't exist, create a new Credencial with this data.
     */
    create: XOR<CredencialCreateInput, CredencialUncheckedCreateInput>
    /**
     * In case the Credencial was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CredencialUpdateInput, CredencialUncheckedUpdateInput>
  }

  /**
   * Credencial delete
   */
  export type CredencialDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Credencial
     */
    select?: CredencialSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CredencialInclude<ExtArgs> | null
    /**
     * Filter which Credencial to delete.
     */
    where: CredencialWhereUniqueInput
  }

  /**
   * Credencial deleteMany
   */
  export type CredencialDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Credencials to delete
     */
    where?: CredencialWhereInput
  }

  /**
   * Credencial without action
   */
  export type CredencialDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Credencial
     */
    select?: CredencialSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CredencialInclude<ExtArgs> | null
  }


  /**
   * Model Objetivo
   */

  export type AggregateObjetivo = {
    _count: ObjetivoCountAggregateOutputType | null
    _min: ObjetivoMinAggregateOutputType | null
    _max: ObjetivoMaxAggregateOutputType | null
  }

  export type ObjetivoMinAggregateOutputType = {
    id: string | null
    tenant_id: string | null
    cliente_id: string | null
    codigo: string | null
    nombre: string | null
    direccion: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type ObjetivoMaxAggregateOutputType = {
    id: string | null
    tenant_id: string | null
    cliente_id: string | null
    codigo: string | null
    nombre: string | null
    direccion: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type ObjetivoCountAggregateOutputType = {
    id: number
    tenant_id: number
    cliente_id: number
    codigo: number
    nombre: number
    direccion: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type ObjetivoMinAggregateInputType = {
    id?: true
    tenant_id?: true
    cliente_id?: true
    codigo?: true
    nombre?: true
    direccion?: true
    created_at?: true
    updated_at?: true
  }

  export type ObjetivoMaxAggregateInputType = {
    id?: true
    tenant_id?: true
    cliente_id?: true
    codigo?: true
    nombre?: true
    direccion?: true
    created_at?: true
    updated_at?: true
  }

  export type ObjetivoCountAggregateInputType = {
    id?: true
    tenant_id?: true
    cliente_id?: true
    codigo?: true
    nombre?: true
    direccion?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type ObjetivoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Objetivo to aggregate.
     */
    where?: ObjetivoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Objetivos to fetch.
     */
    orderBy?: ObjetivoOrderByWithRelationInput | ObjetivoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ObjetivoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Objetivos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Objetivos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Objetivos
    **/
    _count?: true | ObjetivoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ObjetivoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ObjetivoMaxAggregateInputType
  }

  export type GetObjetivoAggregateType<T extends ObjetivoAggregateArgs> = {
        [P in keyof T & keyof AggregateObjetivo]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateObjetivo[P]>
      : GetScalarType<T[P], AggregateObjetivo[P]>
  }




  export type ObjetivoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ObjetivoWhereInput
    orderBy?: ObjetivoOrderByWithAggregationInput | ObjetivoOrderByWithAggregationInput[]
    by: ObjetivoScalarFieldEnum[] | ObjetivoScalarFieldEnum
    having?: ObjetivoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ObjetivoCountAggregateInputType | true
    _min?: ObjetivoMinAggregateInputType
    _max?: ObjetivoMaxAggregateInputType
  }

  export type ObjetivoGroupByOutputType = {
    id: string
    tenant_id: string
    cliente_id: string
    codigo: string
    nombre: string
    direccion: string | null
    created_at: Date
    updated_at: Date
    _count: ObjetivoCountAggregateOutputType | null
    _min: ObjetivoMinAggregateOutputType | null
    _max: ObjetivoMaxAggregateOutputType | null
  }

  type GetObjetivoGroupByPayload<T extends ObjetivoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ObjetivoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ObjetivoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ObjetivoGroupByOutputType[P]>
            : GetScalarType<T[P], ObjetivoGroupByOutputType[P]>
        }
      >
    >


  export type ObjetivoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenant_id?: boolean
    cliente_id?: boolean
    codigo?: boolean
    nombre?: boolean
    direccion?: boolean
    created_at?: boolean
    updated_at?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    puestos?: boolean | Objetivo$puestosArgs<ExtArgs>
    _count?: boolean | ObjetivoCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["objetivo"]>

  export type ObjetivoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenant_id?: boolean
    cliente_id?: boolean
    codigo?: boolean
    nombre?: boolean
    direccion?: boolean
    created_at?: boolean
    updated_at?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["objetivo"]>

  export type ObjetivoSelectScalar = {
    id?: boolean
    tenant_id?: boolean
    cliente_id?: boolean
    codigo?: boolean
    nombre?: boolean
    direccion?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type ObjetivoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    puestos?: boolean | Objetivo$puestosArgs<ExtArgs>
    _count?: boolean | ObjetivoCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ObjetivoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }

  export type $ObjetivoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Objetivo"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
      puestos: Prisma.$PuestoPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenant_id: string
      cliente_id: string
      codigo: string
      nombre: string
      direccion: string | null
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["objetivo"]>
    composites: {}
  }

  type ObjetivoGetPayload<S extends boolean | null | undefined | ObjetivoDefaultArgs> = $Result.GetResult<Prisma.$ObjetivoPayload, S>

  type ObjetivoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ObjetivoFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ObjetivoCountAggregateInputType | true
    }

  export interface ObjetivoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Objetivo'], meta: { name: 'Objetivo' } }
    /**
     * Find zero or one Objetivo that matches the filter.
     * @param {ObjetivoFindUniqueArgs} args - Arguments to find a Objetivo
     * @example
     * // Get one Objetivo
     * const objetivo = await prisma.objetivo.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ObjetivoFindUniqueArgs>(args: SelectSubset<T, ObjetivoFindUniqueArgs<ExtArgs>>): Prisma__ObjetivoClient<$Result.GetResult<Prisma.$ObjetivoPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Objetivo that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ObjetivoFindUniqueOrThrowArgs} args - Arguments to find a Objetivo
     * @example
     * // Get one Objetivo
     * const objetivo = await prisma.objetivo.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ObjetivoFindUniqueOrThrowArgs>(args: SelectSubset<T, ObjetivoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ObjetivoClient<$Result.GetResult<Prisma.$ObjetivoPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Objetivo that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ObjetivoFindFirstArgs} args - Arguments to find a Objetivo
     * @example
     * // Get one Objetivo
     * const objetivo = await prisma.objetivo.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ObjetivoFindFirstArgs>(args?: SelectSubset<T, ObjetivoFindFirstArgs<ExtArgs>>): Prisma__ObjetivoClient<$Result.GetResult<Prisma.$ObjetivoPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Objetivo that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ObjetivoFindFirstOrThrowArgs} args - Arguments to find a Objetivo
     * @example
     * // Get one Objetivo
     * const objetivo = await prisma.objetivo.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ObjetivoFindFirstOrThrowArgs>(args?: SelectSubset<T, ObjetivoFindFirstOrThrowArgs<ExtArgs>>): Prisma__ObjetivoClient<$Result.GetResult<Prisma.$ObjetivoPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Objetivos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ObjetivoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Objetivos
     * const objetivos = await prisma.objetivo.findMany()
     * 
     * // Get first 10 Objetivos
     * const objetivos = await prisma.objetivo.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const objetivoWithIdOnly = await prisma.objetivo.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ObjetivoFindManyArgs>(args?: SelectSubset<T, ObjetivoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ObjetivoPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Objetivo.
     * @param {ObjetivoCreateArgs} args - Arguments to create a Objetivo.
     * @example
     * // Create one Objetivo
     * const Objetivo = await prisma.objetivo.create({
     *   data: {
     *     // ... data to create a Objetivo
     *   }
     * })
     * 
     */
    create<T extends ObjetivoCreateArgs>(args: SelectSubset<T, ObjetivoCreateArgs<ExtArgs>>): Prisma__ObjetivoClient<$Result.GetResult<Prisma.$ObjetivoPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Objetivos.
     * @param {ObjetivoCreateManyArgs} args - Arguments to create many Objetivos.
     * @example
     * // Create many Objetivos
     * const objetivo = await prisma.objetivo.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ObjetivoCreateManyArgs>(args?: SelectSubset<T, ObjetivoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Objetivos and returns the data saved in the database.
     * @param {ObjetivoCreateManyAndReturnArgs} args - Arguments to create many Objetivos.
     * @example
     * // Create many Objetivos
     * const objetivo = await prisma.objetivo.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Objetivos and only return the `id`
     * const objetivoWithIdOnly = await prisma.objetivo.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ObjetivoCreateManyAndReturnArgs>(args?: SelectSubset<T, ObjetivoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ObjetivoPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Objetivo.
     * @param {ObjetivoDeleteArgs} args - Arguments to delete one Objetivo.
     * @example
     * // Delete one Objetivo
     * const Objetivo = await prisma.objetivo.delete({
     *   where: {
     *     // ... filter to delete one Objetivo
     *   }
     * })
     * 
     */
    delete<T extends ObjetivoDeleteArgs>(args: SelectSubset<T, ObjetivoDeleteArgs<ExtArgs>>): Prisma__ObjetivoClient<$Result.GetResult<Prisma.$ObjetivoPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Objetivo.
     * @param {ObjetivoUpdateArgs} args - Arguments to update one Objetivo.
     * @example
     * // Update one Objetivo
     * const objetivo = await prisma.objetivo.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ObjetivoUpdateArgs>(args: SelectSubset<T, ObjetivoUpdateArgs<ExtArgs>>): Prisma__ObjetivoClient<$Result.GetResult<Prisma.$ObjetivoPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Objetivos.
     * @param {ObjetivoDeleteManyArgs} args - Arguments to filter Objetivos to delete.
     * @example
     * // Delete a few Objetivos
     * const { count } = await prisma.objetivo.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ObjetivoDeleteManyArgs>(args?: SelectSubset<T, ObjetivoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Objetivos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ObjetivoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Objetivos
     * const objetivo = await prisma.objetivo.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ObjetivoUpdateManyArgs>(args: SelectSubset<T, ObjetivoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Objetivo.
     * @param {ObjetivoUpsertArgs} args - Arguments to update or create a Objetivo.
     * @example
     * // Update or create a Objetivo
     * const objetivo = await prisma.objetivo.upsert({
     *   create: {
     *     // ... data to create a Objetivo
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Objetivo we want to update
     *   }
     * })
     */
    upsert<T extends ObjetivoUpsertArgs>(args: SelectSubset<T, ObjetivoUpsertArgs<ExtArgs>>): Prisma__ObjetivoClient<$Result.GetResult<Prisma.$ObjetivoPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Objetivos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ObjetivoCountArgs} args - Arguments to filter Objetivos to count.
     * @example
     * // Count the number of Objetivos
     * const count = await prisma.objetivo.count({
     *   where: {
     *     // ... the filter for the Objetivos we want to count
     *   }
     * })
    **/
    count<T extends ObjetivoCountArgs>(
      args?: Subset<T, ObjetivoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ObjetivoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Objetivo.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ObjetivoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ObjetivoAggregateArgs>(args: Subset<T, ObjetivoAggregateArgs>): Prisma.PrismaPromise<GetObjetivoAggregateType<T>>

    /**
     * Group by Objetivo.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ObjetivoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ObjetivoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ObjetivoGroupByArgs['orderBy'] }
        : { orderBy?: ObjetivoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ObjetivoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetObjetivoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Objetivo model
   */
  readonly fields: ObjetivoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Objetivo.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ObjetivoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    puestos<T extends Objetivo$puestosArgs<ExtArgs> = {}>(args?: Subset<T, Objetivo$puestosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PuestoPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Objetivo model
   */ 
  interface ObjetivoFieldRefs {
    readonly id: FieldRef<"Objetivo", 'String'>
    readonly tenant_id: FieldRef<"Objetivo", 'String'>
    readonly cliente_id: FieldRef<"Objetivo", 'String'>
    readonly codigo: FieldRef<"Objetivo", 'String'>
    readonly nombre: FieldRef<"Objetivo", 'String'>
    readonly direccion: FieldRef<"Objetivo", 'String'>
    readonly created_at: FieldRef<"Objetivo", 'DateTime'>
    readonly updated_at: FieldRef<"Objetivo", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Objetivo findUnique
   */
  export type ObjetivoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Objetivo
     */
    select?: ObjetivoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObjetivoInclude<ExtArgs> | null
    /**
     * Filter, which Objetivo to fetch.
     */
    where: ObjetivoWhereUniqueInput
  }

  /**
   * Objetivo findUniqueOrThrow
   */
  export type ObjetivoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Objetivo
     */
    select?: ObjetivoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObjetivoInclude<ExtArgs> | null
    /**
     * Filter, which Objetivo to fetch.
     */
    where: ObjetivoWhereUniqueInput
  }

  /**
   * Objetivo findFirst
   */
  export type ObjetivoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Objetivo
     */
    select?: ObjetivoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObjetivoInclude<ExtArgs> | null
    /**
     * Filter, which Objetivo to fetch.
     */
    where?: ObjetivoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Objetivos to fetch.
     */
    orderBy?: ObjetivoOrderByWithRelationInput | ObjetivoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Objetivos.
     */
    cursor?: ObjetivoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Objetivos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Objetivos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Objetivos.
     */
    distinct?: ObjetivoScalarFieldEnum | ObjetivoScalarFieldEnum[]
  }

  /**
   * Objetivo findFirstOrThrow
   */
  export type ObjetivoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Objetivo
     */
    select?: ObjetivoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObjetivoInclude<ExtArgs> | null
    /**
     * Filter, which Objetivo to fetch.
     */
    where?: ObjetivoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Objetivos to fetch.
     */
    orderBy?: ObjetivoOrderByWithRelationInput | ObjetivoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Objetivos.
     */
    cursor?: ObjetivoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Objetivos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Objetivos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Objetivos.
     */
    distinct?: ObjetivoScalarFieldEnum | ObjetivoScalarFieldEnum[]
  }

  /**
   * Objetivo findMany
   */
  export type ObjetivoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Objetivo
     */
    select?: ObjetivoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObjetivoInclude<ExtArgs> | null
    /**
     * Filter, which Objetivos to fetch.
     */
    where?: ObjetivoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Objetivos to fetch.
     */
    orderBy?: ObjetivoOrderByWithRelationInput | ObjetivoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Objetivos.
     */
    cursor?: ObjetivoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Objetivos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Objetivos.
     */
    skip?: number
    distinct?: ObjetivoScalarFieldEnum | ObjetivoScalarFieldEnum[]
  }

  /**
   * Objetivo create
   */
  export type ObjetivoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Objetivo
     */
    select?: ObjetivoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObjetivoInclude<ExtArgs> | null
    /**
     * The data needed to create a Objetivo.
     */
    data: XOR<ObjetivoCreateInput, ObjetivoUncheckedCreateInput>
  }

  /**
   * Objetivo createMany
   */
  export type ObjetivoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Objetivos.
     */
    data: ObjetivoCreateManyInput | ObjetivoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Objetivo createManyAndReturn
   */
  export type ObjetivoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Objetivo
     */
    select?: ObjetivoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Objetivos.
     */
    data: ObjetivoCreateManyInput | ObjetivoCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObjetivoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Objetivo update
   */
  export type ObjetivoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Objetivo
     */
    select?: ObjetivoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObjetivoInclude<ExtArgs> | null
    /**
     * The data needed to update a Objetivo.
     */
    data: XOR<ObjetivoUpdateInput, ObjetivoUncheckedUpdateInput>
    /**
     * Choose, which Objetivo to update.
     */
    where: ObjetivoWhereUniqueInput
  }

  /**
   * Objetivo updateMany
   */
  export type ObjetivoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Objetivos.
     */
    data: XOR<ObjetivoUpdateManyMutationInput, ObjetivoUncheckedUpdateManyInput>
    /**
     * Filter which Objetivos to update
     */
    where?: ObjetivoWhereInput
  }

  /**
   * Objetivo upsert
   */
  export type ObjetivoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Objetivo
     */
    select?: ObjetivoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObjetivoInclude<ExtArgs> | null
    /**
     * The filter to search for the Objetivo to update in case it exists.
     */
    where: ObjetivoWhereUniqueInput
    /**
     * In case the Objetivo found by the `where` argument doesn't exist, create a new Objetivo with this data.
     */
    create: XOR<ObjetivoCreateInput, ObjetivoUncheckedCreateInput>
    /**
     * In case the Objetivo was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ObjetivoUpdateInput, ObjetivoUncheckedUpdateInput>
  }

  /**
   * Objetivo delete
   */
  export type ObjetivoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Objetivo
     */
    select?: ObjetivoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObjetivoInclude<ExtArgs> | null
    /**
     * Filter which Objetivo to delete.
     */
    where: ObjetivoWhereUniqueInput
  }

  /**
   * Objetivo deleteMany
   */
  export type ObjetivoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Objetivos to delete
     */
    where?: ObjetivoWhereInput
  }

  /**
   * Objetivo.puestos
   */
  export type Objetivo$puestosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Puesto
     */
    select?: PuestoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PuestoInclude<ExtArgs> | null
    where?: PuestoWhereInput
    orderBy?: PuestoOrderByWithRelationInput | PuestoOrderByWithRelationInput[]
    cursor?: PuestoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PuestoScalarFieldEnum | PuestoScalarFieldEnum[]
  }

  /**
   * Objetivo without action
   */
  export type ObjetivoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Objetivo
     */
    select?: ObjetivoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObjetivoInclude<ExtArgs> | null
  }


  /**
   * Model Puesto
   */

  export type AggregatePuesto = {
    _count: PuestoCountAggregateOutputType | null
    _min: PuestoMinAggregateOutputType | null
    _max: PuestoMaxAggregateOutputType | null
  }

  export type PuestoMinAggregateOutputType = {
    id: string | null
    tenant_id: string | null
    objetivo_id: string | null
    nombre: string | null
    ubicacion: string | null
    requiere_arma: boolean | null
    requiere_movil: boolean | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type PuestoMaxAggregateOutputType = {
    id: string | null
    tenant_id: string | null
    objetivo_id: string | null
    nombre: string | null
    ubicacion: string | null
    requiere_arma: boolean | null
    requiere_movil: boolean | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type PuestoCountAggregateOutputType = {
    id: number
    tenant_id: number
    objetivo_id: number
    nombre: number
    ubicacion: number
    requiere_arma: number
    requiere_movil: number
    esquema_horario: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type PuestoMinAggregateInputType = {
    id?: true
    tenant_id?: true
    objetivo_id?: true
    nombre?: true
    ubicacion?: true
    requiere_arma?: true
    requiere_movil?: true
    created_at?: true
    updated_at?: true
  }

  export type PuestoMaxAggregateInputType = {
    id?: true
    tenant_id?: true
    objetivo_id?: true
    nombre?: true
    ubicacion?: true
    requiere_arma?: true
    requiere_movil?: true
    created_at?: true
    updated_at?: true
  }

  export type PuestoCountAggregateInputType = {
    id?: true
    tenant_id?: true
    objetivo_id?: true
    nombre?: true
    ubicacion?: true
    requiere_arma?: true
    requiere_movil?: true
    esquema_horario?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type PuestoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Puesto to aggregate.
     */
    where?: PuestoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Puestos to fetch.
     */
    orderBy?: PuestoOrderByWithRelationInput | PuestoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PuestoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Puestos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Puestos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Puestos
    **/
    _count?: true | PuestoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PuestoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PuestoMaxAggregateInputType
  }

  export type GetPuestoAggregateType<T extends PuestoAggregateArgs> = {
        [P in keyof T & keyof AggregatePuesto]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePuesto[P]>
      : GetScalarType<T[P], AggregatePuesto[P]>
  }




  export type PuestoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PuestoWhereInput
    orderBy?: PuestoOrderByWithAggregationInput | PuestoOrderByWithAggregationInput[]
    by: PuestoScalarFieldEnum[] | PuestoScalarFieldEnum
    having?: PuestoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PuestoCountAggregateInputType | true
    _min?: PuestoMinAggregateInputType
    _max?: PuestoMaxAggregateInputType
  }

  export type PuestoGroupByOutputType = {
    id: string
    tenant_id: string
    objetivo_id: string | null
    nombre: string
    ubicacion: string | null
    requiere_arma: boolean
    requiere_movil: boolean
    esquema_horario: JsonValue | null
    created_at: Date
    updated_at: Date
    _count: PuestoCountAggregateOutputType | null
    _min: PuestoMinAggregateOutputType | null
    _max: PuestoMaxAggregateOutputType | null
  }

  type GetPuestoGroupByPayload<T extends PuestoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PuestoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PuestoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PuestoGroupByOutputType[P]>
            : GetScalarType<T[P], PuestoGroupByOutputType[P]>
        }
      >
    >


  export type PuestoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenant_id?: boolean
    objetivo_id?: boolean
    nombre?: boolean
    ubicacion?: boolean
    requiere_arma?: boolean
    requiere_movil?: boolean
    esquema_horario?: boolean
    created_at?: boolean
    updated_at?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    objetivo?: boolean | Puesto$objetivoArgs<ExtArgs>
    asignaciones?: boolean | Puesto$asignacionesArgs<ExtArgs>
    _count?: boolean | PuestoCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["puesto"]>

  export type PuestoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenant_id?: boolean
    objetivo_id?: boolean
    nombre?: boolean
    ubicacion?: boolean
    requiere_arma?: boolean
    requiere_movil?: boolean
    esquema_horario?: boolean
    created_at?: boolean
    updated_at?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    objetivo?: boolean | Puesto$objetivoArgs<ExtArgs>
  }, ExtArgs["result"]["puesto"]>

  export type PuestoSelectScalar = {
    id?: boolean
    tenant_id?: boolean
    objetivo_id?: boolean
    nombre?: boolean
    ubicacion?: boolean
    requiere_arma?: boolean
    requiere_movil?: boolean
    esquema_horario?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type PuestoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    objetivo?: boolean | Puesto$objetivoArgs<ExtArgs>
    asignaciones?: boolean | Puesto$asignacionesArgs<ExtArgs>
    _count?: boolean | PuestoCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PuestoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    objetivo?: boolean | Puesto$objetivoArgs<ExtArgs>
  }

  export type $PuestoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Puesto"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
      objetivo: Prisma.$ObjetivoPayload<ExtArgs> | null
      asignaciones: Prisma.$AsignacionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenant_id: string
      objetivo_id: string | null
      nombre: string
      ubicacion: string | null
      requiere_arma: boolean
      requiere_movil: boolean
      esquema_horario: Prisma.JsonValue | null
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["puesto"]>
    composites: {}
  }

  type PuestoGetPayload<S extends boolean | null | undefined | PuestoDefaultArgs> = $Result.GetResult<Prisma.$PuestoPayload, S>

  type PuestoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PuestoFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PuestoCountAggregateInputType | true
    }

  export interface PuestoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Puesto'], meta: { name: 'Puesto' } }
    /**
     * Find zero or one Puesto that matches the filter.
     * @param {PuestoFindUniqueArgs} args - Arguments to find a Puesto
     * @example
     * // Get one Puesto
     * const puesto = await prisma.puesto.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PuestoFindUniqueArgs>(args: SelectSubset<T, PuestoFindUniqueArgs<ExtArgs>>): Prisma__PuestoClient<$Result.GetResult<Prisma.$PuestoPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Puesto that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PuestoFindUniqueOrThrowArgs} args - Arguments to find a Puesto
     * @example
     * // Get one Puesto
     * const puesto = await prisma.puesto.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PuestoFindUniqueOrThrowArgs>(args: SelectSubset<T, PuestoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PuestoClient<$Result.GetResult<Prisma.$PuestoPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Puesto that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PuestoFindFirstArgs} args - Arguments to find a Puesto
     * @example
     * // Get one Puesto
     * const puesto = await prisma.puesto.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PuestoFindFirstArgs>(args?: SelectSubset<T, PuestoFindFirstArgs<ExtArgs>>): Prisma__PuestoClient<$Result.GetResult<Prisma.$PuestoPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Puesto that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PuestoFindFirstOrThrowArgs} args - Arguments to find a Puesto
     * @example
     * // Get one Puesto
     * const puesto = await prisma.puesto.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PuestoFindFirstOrThrowArgs>(args?: SelectSubset<T, PuestoFindFirstOrThrowArgs<ExtArgs>>): Prisma__PuestoClient<$Result.GetResult<Prisma.$PuestoPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Puestos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PuestoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Puestos
     * const puestos = await prisma.puesto.findMany()
     * 
     * // Get first 10 Puestos
     * const puestos = await prisma.puesto.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const puestoWithIdOnly = await prisma.puesto.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PuestoFindManyArgs>(args?: SelectSubset<T, PuestoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PuestoPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Puesto.
     * @param {PuestoCreateArgs} args - Arguments to create a Puesto.
     * @example
     * // Create one Puesto
     * const Puesto = await prisma.puesto.create({
     *   data: {
     *     // ... data to create a Puesto
     *   }
     * })
     * 
     */
    create<T extends PuestoCreateArgs>(args: SelectSubset<T, PuestoCreateArgs<ExtArgs>>): Prisma__PuestoClient<$Result.GetResult<Prisma.$PuestoPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Puestos.
     * @param {PuestoCreateManyArgs} args - Arguments to create many Puestos.
     * @example
     * // Create many Puestos
     * const puesto = await prisma.puesto.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PuestoCreateManyArgs>(args?: SelectSubset<T, PuestoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Puestos and returns the data saved in the database.
     * @param {PuestoCreateManyAndReturnArgs} args - Arguments to create many Puestos.
     * @example
     * // Create many Puestos
     * const puesto = await prisma.puesto.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Puestos and only return the `id`
     * const puestoWithIdOnly = await prisma.puesto.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PuestoCreateManyAndReturnArgs>(args?: SelectSubset<T, PuestoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PuestoPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Puesto.
     * @param {PuestoDeleteArgs} args - Arguments to delete one Puesto.
     * @example
     * // Delete one Puesto
     * const Puesto = await prisma.puesto.delete({
     *   where: {
     *     // ... filter to delete one Puesto
     *   }
     * })
     * 
     */
    delete<T extends PuestoDeleteArgs>(args: SelectSubset<T, PuestoDeleteArgs<ExtArgs>>): Prisma__PuestoClient<$Result.GetResult<Prisma.$PuestoPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Puesto.
     * @param {PuestoUpdateArgs} args - Arguments to update one Puesto.
     * @example
     * // Update one Puesto
     * const puesto = await prisma.puesto.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PuestoUpdateArgs>(args: SelectSubset<T, PuestoUpdateArgs<ExtArgs>>): Prisma__PuestoClient<$Result.GetResult<Prisma.$PuestoPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Puestos.
     * @param {PuestoDeleteManyArgs} args - Arguments to filter Puestos to delete.
     * @example
     * // Delete a few Puestos
     * const { count } = await prisma.puesto.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PuestoDeleteManyArgs>(args?: SelectSubset<T, PuestoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Puestos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PuestoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Puestos
     * const puesto = await prisma.puesto.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PuestoUpdateManyArgs>(args: SelectSubset<T, PuestoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Puesto.
     * @param {PuestoUpsertArgs} args - Arguments to update or create a Puesto.
     * @example
     * // Update or create a Puesto
     * const puesto = await prisma.puesto.upsert({
     *   create: {
     *     // ... data to create a Puesto
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Puesto we want to update
     *   }
     * })
     */
    upsert<T extends PuestoUpsertArgs>(args: SelectSubset<T, PuestoUpsertArgs<ExtArgs>>): Prisma__PuestoClient<$Result.GetResult<Prisma.$PuestoPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Puestos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PuestoCountArgs} args - Arguments to filter Puestos to count.
     * @example
     * // Count the number of Puestos
     * const count = await prisma.puesto.count({
     *   where: {
     *     // ... the filter for the Puestos we want to count
     *   }
     * })
    **/
    count<T extends PuestoCountArgs>(
      args?: Subset<T, PuestoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PuestoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Puesto.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PuestoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PuestoAggregateArgs>(args: Subset<T, PuestoAggregateArgs>): Prisma.PrismaPromise<GetPuestoAggregateType<T>>

    /**
     * Group by Puesto.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PuestoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PuestoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PuestoGroupByArgs['orderBy'] }
        : { orderBy?: PuestoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PuestoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPuestoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Puesto model
   */
  readonly fields: PuestoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Puesto.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PuestoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    objetivo<T extends Puesto$objetivoArgs<ExtArgs> = {}>(args?: Subset<T, Puesto$objetivoArgs<ExtArgs>>): Prisma__ObjetivoClient<$Result.GetResult<Prisma.$ObjetivoPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    asignaciones<T extends Puesto$asignacionesArgs<ExtArgs> = {}>(args?: Subset<T, Puesto$asignacionesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AsignacionPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Puesto model
   */ 
  interface PuestoFieldRefs {
    readonly id: FieldRef<"Puesto", 'String'>
    readonly tenant_id: FieldRef<"Puesto", 'String'>
    readonly objetivo_id: FieldRef<"Puesto", 'String'>
    readonly nombre: FieldRef<"Puesto", 'String'>
    readonly ubicacion: FieldRef<"Puesto", 'String'>
    readonly requiere_arma: FieldRef<"Puesto", 'Boolean'>
    readonly requiere_movil: FieldRef<"Puesto", 'Boolean'>
    readonly esquema_horario: FieldRef<"Puesto", 'Json'>
    readonly created_at: FieldRef<"Puesto", 'DateTime'>
    readonly updated_at: FieldRef<"Puesto", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Puesto findUnique
   */
  export type PuestoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Puesto
     */
    select?: PuestoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PuestoInclude<ExtArgs> | null
    /**
     * Filter, which Puesto to fetch.
     */
    where: PuestoWhereUniqueInput
  }

  /**
   * Puesto findUniqueOrThrow
   */
  export type PuestoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Puesto
     */
    select?: PuestoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PuestoInclude<ExtArgs> | null
    /**
     * Filter, which Puesto to fetch.
     */
    where: PuestoWhereUniqueInput
  }

  /**
   * Puesto findFirst
   */
  export type PuestoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Puesto
     */
    select?: PuestoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PuestoInclude<ExtArgs> | null
    /**
     * Filter, which Puesto to fetch.
     */
    where?: PuestoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Puestos to fetch.
     */
    orderBy?: PuestoOrderByWithRelationInput | PuestoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Puestos.
     */
    cursor?: PuestoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Puestos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Puestos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Puestos.
     */
    distinct?: PuestoScalarFieldEnum | PuestoScalarFieldEnum[]
  }

  /**
   * Puesto findFirstOrThrow
   */
  export type PuestoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Puesto
     */
    select?: PuestoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PuestoInclude<ExtArgs> | null
    /**
     * Filter, which Puesto to fetch.
     */
    where?: PuestoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Puestos to fetch.
     */
    orderBy?: PuestoOrderByWithRelationInput | PuestoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Puestos.
     */
    cursor?: PuestoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Puestos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Puestos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Puestos.
     */
    distinct?: PuestoScalarFieldEnum | PuestoScalarFieldEnum[]
  }

  /**
   * Puesto findMany
   */
  export type PuestoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Puesto
     */
    select?: PuestoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PuestoInclude<ExtArgs> | null
    /**
     * Filter, which Puestos to fetch.
     */
    where?: PuestoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Puestos to fetch.
     */
    orderBy?: PuestoOrderByWithRelationInput | PuestoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Puestos.
     */
    cursor?: PuestoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Puestos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Puestos.
     */
    skip?: number
    distinct?: PuestoScalarFieldEnum | PuestoScalarFieldEnum[]
  }

  /**
   * Puesto create
   */
  export type PuestoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Puesto
     */
    select?: PuestoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PuestoInclude<ExtArgs> | null
    /**
     * The data needed to create a Puesto.
     */
    data: XOR<PuestoCreateInput, PuestoUncheckedCreateInput>
  }

  /**
   * Puesto createMany
   */
  export type PuestoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Puestos.
     */
    data: PuestoCreateManyInput | PuestoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Puesto createManyAndReturn
   */
  export type PuestoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Puesto
     */
    select?: PuestoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Puestos.
     */
    data: PuestoCreateManyInput | PuestoCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PuestoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Puesto update
   */
  export type PuestoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Puesto
     */
    select?: PuestoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PuestoInclude<ExtArgs> | null
    /**
     * The data needed to update a Puesto.
     */
    data: XOR<PuestoUpdateInput, PuestoUncheckedUpdateInput>
    /**
     * Choose, which Puesto to update.
     */
    where: PuestoWhereUniqueInput
  }

  /**
   * Puesto updateMany
   */
  export type PuestoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Puestos.
     */
    data: XOR<PuestoUpdateManyMutationInput, PuestoUncheckedUpdateManyInput>
    /**
     * Filter which Puestos to update
     */
    where?: PuestoWhereInput
  }

  /**
   * Puesto upsert
   */
  export type PuestoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Puesto
     */
    select?: PuestoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PuestoInclude<ExtArgs> | null
    /**
     * The filter to search for the Puesto to update in case it exists.
     */
    where: PuestoWhereUniqueInput
    /**
     * In case the Puesto found by the `where` argument doesn't exist, create a new Puesto with this data.
     */
    create: XOR<PuestoCreateInput, PuestoUncheckedCreateInput>
    /**
     * In case the Puesto was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PuestoUpdateInput, PuestoUncheckedUpdateInput>
  }

  /**
   * Puesto delete
   */
  export type PuestoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Puesto
     */
    select?: PuestoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PuestoInclude<ExtArgs> | null
    /**
     * Filter which Puesto to delete.
     */
    where: PuestoWhereUniqueInput
  }

  /**
   * Puesto deleteMany
   */
  export type PuestoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Puestos to delete
     */
    where?: PuestoWhereInput
  }

  /**
   * Puesto.objetivo
   */
  export type Puesto$objetivoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Objetivo
     */
    select?: ObjetivoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObjetivoInclude<ExtArgs> | null
    where?: ObjetivoWhereInput
  }

  /**
   * Puesto.asignaciones
   */
  export type Puesto$asignacionesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asignacion
     */
    select?: AsignacionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AsignacionInclude<ExtArgs> | null
    where?: AsignacionWhereInput
    orderBy?: AsignacionOrderByWithRelationInput | AsignacionOrderByWithRelationInput[]
    cursor?: AsignacionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AsignacionScalarFieldEnum | AsignacionScalarFieldEnum[]
  }

  /**
   * Puesto without action
   */
  export type PuestoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Puesto
     */
    select?: PuestoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PuestoInclude<ExtArgs> | null
  }


  /**
   * Model Asignacion
   */

  export type AggregateAsignacion = {
    _count: AsignacionCountAggregateOutputType | null
    _min: AsignacionMinAggregateOutputType | null
    _max: AsignacionMaxAggregateOutputType | null
  }

  export type AsignacionMinAggregateOutputType = {
    id: string | null
    tenant_id: string | null
    puesto_id: string | null
    vigilador_id: string | null
    fecha: Date | null
    hora_inicio: string | null
    hora_fin: string | null
    estado: string | null
    created_at: Date | null
  }

  export type AsignacionMaxAggregateOutputType = {
    id: string | null
    tenant_id: string | null
    puesto_id: string | null
    vigilador_id: string | null
    fecha: Date | null
    hora_inicio: string | null
    hora_fin: string | null
    estado: string | null
    created_at: Date | null
  }

  export type AsignacionCountAggregateOutputType = {
    id: number
    tenant_id: number
    puesto_id: number
    vigilador_id: number
    fecha: number
    hora_inicio: number
    hora_fin: number
    estado: number
    created_at: number
    _all: number
  }


  export type AsignacionMinAggregateInputType = {
    id?: true
    tenant_id?: true
    puesto_id?: true
    vigilador_id?: true
    fecha?: true
    hora_inicio?: true
    hora_fin?: true
    estado?: true
    created_at?: true
  }

  export type AsignacionMaxAggregateInputType = {
    id?: true
    tenant_id?: true
    puesto_id?: true
    vigilador_id?: true
    fecha?: true
    hora_inicio?: true
    hora_fin?: true
    estado?: true
    created_at?: true
  }

  export type AsignacionCountAggregateInputType = {
    id?: true
    tenant_id?: true
    puesto_id?: true
    vigilador_id?: true
    fecha?: true
    hora_inicio?: true
    hora_fin?: true
    estado?: true
    created_at?: true
    _all?: true
  }

  export type AsignacionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Asignacion to aggregate.
     */
    where?: AsignacionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Asignacions to fetch.
     */
    orderBy?: AsignacionOrderByWithRelationInput | AsignacionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AsignacionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Asignacions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Asignacions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Asignacions
    **/
    _count?: true | AsignacionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AsignacionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AsignacionMaxAggregateInputType
  }

  export type GetAsignacionAggregateType<T extends AsignacionAggregateArgs> = {
        [P in keyof T & keyof AggregateAsignacion]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAsignacion[P]>
      : GetScalarType<T[P], AggregateAsignacion[P]>
  }




  export type AsignacionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AsignacionWhereInput
    orderBy?: AsignacionOrderByWithAggregationInput | AsignacionOrderByWithAggregationInput[]
    by: AsignacionScalarFieldEnum[] | AsignacionScalarFieldEnum
    having?: AsignacionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AsignacionCountAggregateInputType | true
    _min?: AsignacionMinAggregateInputType
    _max?: AsignacionMaxAggregateInputType
  }

  export type AsignacionGroupByOutputType = {
    id: string
    tenant_id: string
    puesto_id: string
    vigilador_id: string | null
    fecha: Date
    hora_inicio: string
    hora_fin: string
    estado: string
    created_at: Date
    _count: AsignacionCountAggregateOutputType | null
    _min: AsignacionMinAggregateOutputType | null
    _max: AsignacionMaxAggregateOutputType | null
  }

  type GetAsignacionGroupByPayload<T extends AsignacionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AsignacionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AsignacionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AsignacionGroupByOutputType[P]>
            : GetScalarType<T[P], AsignacionGroupByOutputType[P]>
        }
      >
    >


  export type AsignacionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenant_id?: boolean
    puesto_id?: boolean
    vigilador_id?: boolean
    fecha?: boolean
    hora_inicio?: boolean
    hora_fin?: boolean
    estado?: boolean
    created_at?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    puesto?: boolean | PuestoDefaultArgs<ExtArgs>
    vigilador?: boolean | Asignacion$vigiladorArgs<ExtArgs>
    asistencia?: boolean | Asignacion$asistenciaArgs<ExtArgs>
  }, ExtArgs["result"]["asignacion"]>

  export type AsignacionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenant_id?: boolean
    puesto_id?: boolean
    vigilador_id?: boolean
    fecha?: boolean
    hora_inicio?: boolean
    hora_fin?: boolean
    estado?: boolean
    created_at?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    puesto?: boolean | PuestoDefaultArgs<ExtArgs>
    vigilador?: boolean | Asignacion$vigiladorArgs<ExtArgs>
  }, ExtArgs["result"]["asignacion"]>

  export type AsignacionSelectScalar = {
    id?: boolean
    tenant_id?: boolean
    puesto_id?: boolean
    vigilador_id?: boolean
    fecha?: boolean
    hora_inicio?: boolean
    hora_fin?: boolean
    estado?: boolean
    created_at?: boolean
  }

  export type AsignacionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    puesto?: boolean | PuestoDefaultArgs<ExtArgs>
    vigilador?: boolean | Asignacion$vigiladorArgs<ExtArgs>
    asistencia?: boolean | Asignacion$asistenciaArgs<ExtArgs>
  }
  export type AsignacionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    puesto?: boolean | PuestoDefaultArgs<ExtArgs>
    vigilador?: boolean | Asignacion$vigiladorArgs<ExtArgs>
  }

  export type $AsignacionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Asignacion"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
      puesto: Prisma.$PuestoPayload<ExtArgs>
      vigilador: Prisma.$VigiladorPayload<ExtArgs> | null
      asistencia: Prisma.$AsistenciaPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenant_id: string
      puesto_id: string
      vigilador_id: string | null
      fecha: Date
      hora_inicio: string
      hora_fin: string
      estado: string
      created_at: Date
    }, ExtArgs["result"]["asignacion"]>
    composites: {}
  }

  type AsignacionGetPayload<S extends boolean | null | undefined | AsignacionDefaultArgs> = $Result.GetResult<Prisma.$AsignacionPayload, S>

  type AsignacionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AsignacionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AsignacionCountAggregateInputType | true
    }

  export interface AsignacionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Asignacion'], meta: { name: 'Asignacion' } }
    /**
     * Find zero or one Asignacion that matches the filter.
     * @param {AsignacionFindUniqueArgs} args - Arguments to find a Asignacion
     * @example
     * // Get one Asignacion
     * const asignacion = await prisma.asignacion.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AsignacionFindUniqueArgs>(args: SelectSubset<T, AsignacionFindUniqueArgs<ExtArgs>>): Prisma__AsignacionClient<$Result.GetResult<Prisma.$AsignacionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Asignacion that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AsignacionFindUniqueOrThrowArgs} args - Arguments to find a Asignacion
     * @example
     * // Get one Asignacion
     * const asignacion = await prisma.asignacion.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AsignacionFindUniqueOrThrowArgs>(args: SelectSubset<T, AsignacionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AsignacionClient<$Result.GetResult<Prisma.$AsignacionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Asignacion that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AsignacionFindFirstArgs} args - Arguments to find a Asignacion
     * @example
     * // Get one Asignacion
     * const asignacion = await prisma.asignacion.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AsignacionFindFirstArgs>(args?: SelectSubset<T, AsignacionFindFirstArgs<ExtArgs>>): Prisma__AsignacionClient<$Result.GetResult<Prisma.$AsignacionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Asignacion that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AsignacionFindFirstOrThrowArgs} args - Arguments to find a Asignacion
     * @example
     * // Get one Asignacion
     * const asignacion = await prisma.asignacion.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AsignacionFindFirstOrThrowArgs>(args?: SelectSubset<T, AsignacionFindFirstOrThrowArgs<ExtArgs>>): Prisma__AsignacionClient<$Result.GetResult<Prisma.$AsignacionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Asignacions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AsignacionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Asignacions
     * const asignacions = await prisma.asignacion.findMany()
     * 
     * // Get first 10 Asignacions
     * const asignacions = await prisma.asignacion.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const asignacionWithIdOnly = await prisma.asignacion.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AsignacionFindManyArgs>(args?: SelectSubset<T, AsignacionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AsignacionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Asignacion.
     * @param {AsignacionCreateArgs} args - Arguments to create a Asignacion.
     * @example
     * // Create one Asignacion
     * const Asignacion = await prisma.asignacion.create({
     *   data: {
     *     // ... data to create a Asignacion
     *   }
     * })
     * 
     */
    create<T extends AsignacionCreateArgs>(args: SelectSubset<T, AsignacionCreateArgs<ExtArgs>>): Prisma__AsignacionClient<$Result.GetResult<Prisma.$AsignacionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Asignacions.
     * @param {AsignacionCreateManyArgs} args - Arguments to create many Asignacions.
     * @example
     * // Create many Asignacions
     * const asignacion = await prisma.asignacion.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AsignacionCreateManyArgs>(args?: SelectSubset<T, AsignacionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Asignacions and returns the data saved in the database.
     * @param {AsignacionCreateManyAndReturnArgs} args - Arguments to create many Asignacions.
     * @example
     * // Create many Asignacions
     * const asignacion = await prisma.asignacion.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Asignacions and only return the `id`
     * const asignacionWithIdOnly = await prisma.asignacion.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AsignacionCreateManyAndReturnArgs>(args?: SelectSubset<T, AsignacionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AsignacionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Asignacion.
     * @param {AsignacionDeleteArgs} args - Arguments to delete one Asignacion.
     * @example
     * // Delete one Asignacion
     * const Asignacion = await prisma.asignacion.delete({
     *   where: {
     *     // ... filter to delete one Asignacion
     *   }
     * })
     * 
     */
    delete<T extends AsignacionDeleteArgs>(args: SelectSubset<T, AsignacionDeleteArgs<ExtArgs>>): Prisma__AsignacionClient<$Result.GetResult<Prisma.$AsignacionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Asignacion.
     * @param {AsignacionUpdateArgs} args - Arguments to update one Asignacion.
     * @example
     * // Update one Asignacion
     * const asignacion = await prisma.asignacion.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AsignacionUpdateArgs>(args: SelectSubset<T, AsignacionUpdateArgs<ExtArgs>>): Prisma__AsignacionClient<$Result.GetResult<Prisma.$AsignacionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Asignacions.
     * @param {AsignacionDeleteManyArgs} args - Arguments to filter Asignacions to delete.
     * @example
     * // Delete a few Asignacions
     * const { count } = await prisma.asignacion.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AsignacionDeleteManyArgs>(args?: SelectSubset<T, AsignacionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Asignacions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AsignacionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Asignacions
     * const asignacion = await prisma.asignacion.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AsignacionUpdateManyArgs>(args: SelectSubset<T, AsignacionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Asignacion.
     * @param {AsignacionUpsertArgs} args - Arguments to update or create a Asignacion.
     * @example
     * // Update or create a Asignacion
     * const asignacion = await prisma.asignacion.upsert({
     *   create: {
     *     // ... data to create a Asignacion
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Asignacion we want to update
     *   }
     * })
     */
    upsert<T extends AsignacionUpsertArgs>(args: SelectSubset<T, AsignacionUpsertArgs<ExtArgs>>): Prisma__AsignacionClient<$Result.GetResult<Prisma.$AsignacionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Asignacions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AsignacionCountArgs} args - Arguments to filter Asignacions to count.
     * @example
     * // Count the number of Asignacions
     * const count = await prisma.asignacion.count({
     *   where: {
     *     // ... the filter for the Asignacions we want to count
     *   }
     * })
    **/
    count<T extends AsignacionCountArgs>(
      args?: Subset<T, AsignacionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AsignacionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Asignacion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AsignacionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AsignacionAggregateArgs>(args: Subset<T, AsignacionAggregateArgs>): Prisma.PrismaPromise<GetAsignacionAggregateType<T>>

    /**
     * Group by Asignacion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AsignacionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AsignacionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AsignacionGroupByArgs['orderBy'] }
        : { orderBy?: AsignacionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AsignacionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAsignacionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Asignacion model
   */
  readonly fields: AsignacionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Asignacion.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AsignacionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    puesto<T extends PuestoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PuestoDefaultArgs<ExtArgs>>): Prisma__PuestoClient<$Result.GetResult<Prisma.$PuestoPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    vigilador<T extends Asignacion$vigiladorArgs<ExtArgs> = {}>(args?: Subset<T, Asignacion$vigiladorArgs<ExtArgs>>): Prisma__VigiladorClient<$Result.GetResult<Prisma.$VigiladorPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    asistencia<T extends Asignacion$asistenciaArgs<ExtArgs> = {}>(args?: Subset<T, Asignacion$asistenciaArgs<ExtArgs>>): Prisma__AsistenciaClient<$Result.GetResult<Prisma.$AsistenciaPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Asignacion model
   */ 
  interface AsignacionFieldRefs {
    readonly id: FieldRef<"Asignacion", 'String'>
    readonly tenant_id: FieldRef<"Asignacion", 'String'>
    readonly puesto_id: FieldRef<"Asignacion", 'String'>
    readonly vigilador_id: FieldRef<"Asignacion", 'String'>
    readonly fecha: FieldRef<"Asignacion", 'DateTime'>
    readonly hora_inicio: FieldRef<"Asignacion", 'String'>
    readonly hora_fin: FieldRef<"Asignacion", 'String'>
    readonly estado: FieldRef<"Asignacion", 'String'>
    readonly created_at: FieldRef<"Asignacion", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Asignacion findUnique
   */
  export type AsignacionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asignacion
     */
    select?: AsignacionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AsignacionInclude<ExtArgs> | null
    /**
     * Filter, which Asignacion to fetch.
     */
    where: AsignacionWhereUniqueInput
  }

  /**
   * Asignacion findUniqueOrThrow
   */
  export type AsignacionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asignacion
     */
    select?: AsignacionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AsignacionInclude<ExtArgs> | null
    /**
     * Filter, which Asignacion to fetch.
     */
    where: AsignacionWhereUniqueInput
  }

  /**
   * Asignacion findFirst
   */
  export type AsignacionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asignacion
     */
    select?: AsignacionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AsignacionInclude<ExtArgs> | null
    /**
     * Filter, which Asignacion to fetch.
     */
    where?: AsignacionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Asignacions to fetch.
     */
    orderBy?: AsignacionOrderByWithRelationInput | AsignacionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Asignacions.
     */
    cursor?: AsignacionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Asignacions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Asignacions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Asignacions.
     */
    distinct?: AsignacionScalarFieldEnum | AsignacionScalarFieldEnum[]
  }

  /**
   * Asignacion findFirstOrThrow
   */
  export type AsignacionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asignacion
     */
    select?: AsignacionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AsignacionInclude<ExtArgs> | null
    /**
     * Filter, which Asignacion to fetch.
     */
    where?: AsignacionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Asignacions to fetch.
     */
    orderBy?: AsignacionOrderByWithRelationInput | AsignacionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Asignacions.
     */
    cursor?: AsignacionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Asignacions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Asignacions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Asignacions.
     */
    distinct?: AsignacionScalarFieldEnum | AsignacionScalarFieldEnum[]
  }

  /**
   * Asignacion findMany
   */
  export type AsignacionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asignacion
     */
    select?: AsignacionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AsignacionInclude<ExtArgs> | null
    /**
     * Filter, which Asignacions to fetch.
     */
    where?: AsignacionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Asignacions to fetch.
     */
    orderBy?: AsignacionOrderByWithRelationInput | AsignacionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Asignacions.
     */
    cursor?: AsignacionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Asignacions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Asignacions.
     */
    skip?: number
    distinct?: AsignacionScalarFieldEnum | AsignacionScalarFieldEnum[]
  }

  /**
   * Asignacion create
   */
  export type AsignacionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asignacion
     */
    select?: AsignacionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AsignacionInclude<ExtArgs> | null
    /**
     * The data needed to create a Asignacion.
     */
    data: XOR<AsignacionCreateInput, AsignacionUncheckedCreateInput>
  }

  /**
   * Asignacion createMany
   */
  export type AsignacionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Asignacions.
     */
    data: AsignacionCreateManyInput | AsignacionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Asignacion createManyAndReturn
   */
  export type AsignacionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asignacion
     */
    select?: AsignacionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Asignacions.
     */
    data: AsignacionCreateManyInput | AsignacionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AsignacionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Asignacion update
   */
  export type AsignacionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asignacion
     */
    select?: AsignacionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AsignacionInclude<ExtArgs> | null
    /**
     * The data needed to update a Asignacion.
     */
    data: XOR<AsignacionUpdateInput, AsignacionUncheckedUpdateInput>
    /**
     * Choose, which Asignacion to update.
     */
    where: AsignacionWhereUniqueInput
  }

  /**
   * Asignacion updateMany
   */
  export type AsignacionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Asignacions.
     */
    data: XOR<AsignacionUpdateManyMutationInput, AsignacionUncheckedUpdateManyInput>
    /**
     * Filter which Asignacions to update
     */
    where?: AsignacionWhereInput
  }

  /**
   * Asignacion upsert
   */
  export type AsignacionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asignacion
     */
    select?: AsignacionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AsignacionInclude<ExtArgs> | null
    /**
     * The filter to search for the Asignacion to update in case it exists.
     */
    where: AsignacionWhereUniqueInput
    /**
     * In case the Asignacion found by the `where` argument doesn't exist, create a new Asignacion with this data.
     */
    create: XOR<AsignacionCreateInput, AsignacionUncheckedCreateInput>
    /**
     * In case the Asignacion was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AsignacionUpdateInput, AsignacionUncheckedUpdateInput>
  }

  /**
   * Asignacion delete
   */
  export type AsignacionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asignacion
     */
    select?: AsignacionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AsignacionInclude<ExtArgs> | null
    /**
     * Filter which Asignacion to delete.
     */
    where: AsignacionWhereUniqueInput
  }

  /**
   * Asignacion deleteMany
   */
  export type AsignacionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Asignacions to delete
     */
    where?: AsignacionWhereInput
  }

  /**
   * Asignacion.vigilador
   */
  export type Asignacion$vigiladorArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vigilador
     */
    select?: VigiladorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VigiladorInclude<ExtArgs> | null
    where?: VigiladorWhereInput
  }

  /**
   * Asignacion.asistencia
   */
  export type Asignacion$asistenciaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asistencia
     */
    select?: AsistenciaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AsistenciaInclude<ExtArgs> | null
    where?: AsistenciaWhereInput
  }

  /**
   * Asignacion without action
   */
  export type AsignacionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asignacion
     */
    select?: AsignacionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AsignacionInclude<ExtArgs> | null
  }


  /**
   * Model Asistencia
   */

  export type AggregateAsistencia = {
    _count: AsistenciaCountAggregateOutputType | null
    _avg: AsistenciaAvgAggregateOutputType | null
    _sum: AsistenciaSumAggregateOutputType | null
    _min: AsistenciaMinAggregateOutputType | null
    _max: AsistenciaMaxAggregateOutputType | null
  }

  export type AsistenciaAvgAggregateOutputType = {
    lat: Decimal | null
    lng: Decimal | null
  }

  export type AsistenciaSumAggregateOutputType = {
    lat: Decimal | null
    lng: Decimal | null
  }

  export type AsistenciaMinAggregateOutputType = {
    id: string | null
    tenant_id: string | null
    asignacion_id: string | null
    inicio_real: Date | null
    fin_real: Date | null
    metodo: string | null
    lat: Decimal | null
    lng: Decimal | null
  }

  export type AsistenciaMaxAggregateOutputType = {
    id: string | null
    tenant_id: string | null
    asignacion_id: string | null
    inicio_real: Date | null
    fin_real: Date | null
    metodo: string | null
    lat: Decimal | null
    lng: Decimal | null
  }

  export type AsistenciaCountAggregateOutputType = {
    id: number
    tenant_id: number
    asignacion_id: number
    inicio_real: number
    fin_real: number
    metodo: number
    lat: number
    lng: number
    _all: number
  }


  export type AsistenciaAvgAggregateInputType = {
    lat?: true
    lng?: true
  }

  export type AsistenciaSumAggregateInputType = {
    lat?: true
    lng?: true
  }

  export type AsistenciaMinAggregateInputType = {
    id?: true
    tenant_id?: true
    asignacion_id?: true
    inicio_real?: true
    fin_real?: true
    metodo?: true
    lat?: true
    lng?: true
  }

  export type AsistenciaMaxAggregateInputType = {
    id?: true
    tenant_id?: true
    asignacion_id?: true
    inicio_real?: true
    fin_real?: true
    metodo?: true
    lat?: true
    lng?: true
  }

  export type AsistenciaCountAggregateInputType = {
    id?: true
    tenant_id?: true
    asignacion_id?: true
    inicio_real?: true
    fin_real?: true
    metodo?: true
    lat?: true
    lng?: true
    _all?: true
  }

  export type AsistenciaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Asistencia to aggregate.
     */
    where?: AsistenciaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Asistencias to fetch.
     */
    orderBy?: AsistenciaOrderByWithRelationInput | AsistenciaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AsistenciaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Asistencias from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Asistencias.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Asistencias
    **/
    _count?: true | AsistenciaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AsistenciaAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AsistenciaSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AsistenciaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AsistenciaMaxAggregateInputType
  }

  export type GetAsistenciaAggregateType<T extends AsistenciaAggregateArgs> = {
        [P in keyof T & keyof AggregateAsistencia]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAsistencia[P]>
      : GetScalarType<T[P], AggregateAsistencia[P]>
  }




  export type AsistenciaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AsistenciaWhereInput
    orderBy?: AsistenciaOrderByWithAggregationInput | AsistenciaOrderByWithAggregationInput[]
    by: AsistenciaScalarFieldEnum[] | AsistenciaScalarFieldEnum
    having?: AsistenciaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AsistenciaCountAggregateInputType | true
    _avg?: AsistenciaAvgAggregateInputType
    _sum?: AsistenciaSumAggregateInputType
    _min?: AsistenciaMinAggregateInputType
    _max?: AsistenciaMaxAggregateInputType
  }

  export type AsistenciaGroupByOutputType = {
    id: string
    tenant_id: string
    asignacion_id: string
    inicio_real: Date | null
    fin_real: Date | null
    metodo: string | null
    lat: Decimal | null
    lng: Decimal | null
    _count: AsistenciaCountAggregateOutputType | null
    _avg: AsistenciaAvgAggregateOutputType | null
    _sum: AsistenciaSumAggregateOutputType | null
    _min: AsistenciaMinAggregateOutputType | null
    _max: AsistenciaMaxAggregateOutputType | null
  }

  type GetAsistenciaGroupByPayload<T extends AsistenciaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AsistenciaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AsistenciaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AsistenciaGroupByOutputType[P]>
            : GetScalarType<T[P], AsistenciaGroupByOutputType[P]>
        }
      >
    >


  export type AsistenciaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenant_id?: boolean
    asignacion_id?: boolean
    inicio_real?: boolean
    fin_real?: boolean
    metodo?: boolean
    lat?: boolean
    lng?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    asignacion?: boolean | AsignacionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["asistencia"]>

  export type AsistenciaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenant_id?: boolean
    asignacion_id?: boolean
    inicio_real?: boolean
    fin_real?: boolean
    metodo?: boolean
    lat?: boolean
    lng?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    asignacion?: boolean | AsignacionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["asistencia"]>

  export type AsistenciaSelectScalar = {
    id?: boolean
    tenant_id?: boolean
    asignacion_id?: boolean
    inicio_real?: boolean
    fin_real?: boolean
    metodo?: boolean
    lat?: boolean
    lng?: boolean
  }

  export type AsistenciaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    asignacion?: boolean | AsignacionDefaultArgs<ExtArgs>
  }
  export type AsistenciaIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    asignacion?: boolean | AsignacionDefaultArgs<ExtArgs>
  }

  export type $AsistenciaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Asistencia"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
      asignacion: Prisma.$AsignacionPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenant_id: string
      asignacion_id: string
      inicio_real: Date | null
      fin_real: Date | null
      metodo: string | null
      lat: Prisma.Decimal | null
      lng: Prisma.Decimal | null
    }, ExtArgs["result"]["asistencia"]>
    composites: {}
  }

  type AsistenciaGetPayload<S extends boolean | null | undefined | AsistenciaDefaultArgs> = $Result.GetResult<Prisma.$AsistenciaPayload, S>

  type AsistenciaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AsistenciaFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AsistenciaCountAggregateInputType | true
    }

  export interface AsistenciaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Asistencia'], meta: { name: 'Asistencia' } }
    /**
     * Find zero or one Asistencia that matches the filter.
     * @param {AsistenciaFindUniqueArgs} args - Arguments to find a Asistencia
     * @example
     * // Get one Asistencia
     * const asistencia = await prisma.asistencia.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AsistenciaFindUniqueArgs>(args: SelectSubset<T, AsistenciaFindUniqueArgs<ExtArgs>>): Prisma__AsistenciaClient<$Result.GetResult<Prisma.$AsistenciaPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Asistencia that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AsistenciaFindUniqueOrThrowArgs} args - Arguments to find a Asistencia
     * @example
     * // Get one Asistencia
     * const asistencia = await prisma.asistencia.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AsistenciaFindUniqueOrThrowArgs>(args: SelectSubset<T, AsistenciaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AsistenciaClient<$Result.GetResult<Prisma.$AsistenciaPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Asistencia that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AsistenciaFindFirstArgs} args - Arguments to find a Asistencia
     * @example
     * // Get one Asistencia
     * const asistencia = await prisma.asistencia.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AsistenciaFindFirstArgs>(args?: SelectSubset<T, AsistenciaFindFirstArgs<ExtArgs>>): Prisma__AsistenciaClient<$Result.GetResult<Prisma.$AsistenciaPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Asistencia that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AsistenciaFindFirstOrThrowArgs} args - Arguments to find a Asistencia
     * @example
     * // Get one Asistencia
     * const asistencia = await prisma.asistencia.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AsistenciaFindFirstOrThrowArgs>(args?: SelectSubset<T, AsistenciaFindFirstOrThrowArgs<ExtArgs>>): Prisma__AsistenciaClient<$Result.GetResult<Prisma.$AsistenciaPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Asistencias that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AsistenciaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Asistencias
     * const asistencias = await prisma.asistencia.findMany()
     * 
     * // Get first 10 Asistencias
     * const asistencias = await prisma.asistencia.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const asistenciaWithIdOnly = await prisma.asistencia.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AsistenciaFindManyArgs>(args?: SelectSubset<T, AsistenciaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AsistenciaPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Asistencia.
     * @param {AsistenciaCreateArgs} args - Arguments to create a Asistencia.
     * @example
     * // Create one Asistencia
     * const Asistencia = await prisma.asistencia.create({
     *   data: {
     *     // ... data to create a Asistencia
     *   }
     * })
     * 
     */
    create<T extends AsistenciaCreateArgs>(args: SelectSubset<T, AsistenciaCreateArgs<ExtArgs>>): Prisma__AsistenciaClient<$Result.GetResult<Prisma.$AsistenciaPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Asistencias.
     * @param {AsistenciaCreateManyArgs} args - Arguments to create many Asistencias.
     * @example
     * // Create many Asistencias
     * const asistencia = await prisma.asistencia.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AsistenciaCreateManyArgs>(args?: SelectSubset<T, AsistenciaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Asistencias and returns the data saved in the database.
     * @param {AsistenciaCreateManyAndReturnArgs} args - Arguments to create many Asistencias.
     * @example
     * // Create many Asistencias
     * const asistencia = await prisma.asistencia.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Asistencias and only return the `id`
     * const asistenciaWithIdOnly = await prisma.asistencia.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AsistenciaCreateManyAndReturnArgs>(args?: SelectSubset<T, AsistenciaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AsistenciaPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Asistencia.
     * @param {AsistenciaDeleteArgs} args - Arguments to delete one Asistencia.
     * @example
     * // Delete one Asistencia
     * const Asistencia = await prisma.asistencia.delete({
     *   where: {
     *     // ... filter to delete one Asistencia
     *   }
     * })
     * 
     */
    delete<T extends AsistenciaDeleteArgs>(args: SelectSubset<T, AsistenciaDeleteArgs<ExtArgs>>): Prisma__AsistenciaClient<$Result.GetResult<Prisma.$AsistenciaPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Asistencia.
     * @param {AsistenciaUpdateArgs} args - Arguments to update one Asistencia.
     * @example
     * // Update one Asistencia
     * const asistencia = await prisma.asistencia.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AsistenciaUpdateArgs>(args: SelectSubset<T, AsistenciaUpdateArgs<ExtArgs>>): Prisma__AsistenciaClient<$Result.GetResult<Prisma.$AsistenciaPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Asistencias.
     * @param {AsistenciaDeleteManyArgs} args - Arguments to filter Asistencias to delete.
     * @example
     * // Delete a few Asistencias
     * const { count } = await prisma.asistencia.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AsistenciaDeleteManyArgs>(args?: SelectSubset<T, AsistenciaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Asistencias.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AsistenciaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Asistencias
     * const asistencia = await prisma.asistencia.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AsistenciaUpdateManyArgs>(args: SelectSubset<T, AsistenciaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Asistencia.
     * @param {AsistenciaUpsertArgs} args - Arguments to update or create a Asistencia.
     * @example
     * // Update or create a Asistencia
     * const asistencia = await prisma.asistencia.upsert({
     *   create: {
     *     // ... data to create a Asistencia
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Asistencia we want to update
     *   }
     * })
     */
    upsert<T extends AsistenciaUpsertArgs>(args: SelectSubset<T, AsistenciaUpsertArgs<ExtArgs>>): Prisma__AsistenciaClient<$Result.GetResult<Prisma.$AsistenciaPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Asistencias.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AsistenciaCountArgs} args - Arguments to filter Asistencias to count.
     * @example
     * // Count the number of Asistencias
     * const count = await prisma.asistencia.count({
     *   where: {
     *     // ... the filter for the Asistencias we want to count
     *   }
     * })
    **/
    count<T extends AsistenciaCountArgs>(
      args?: Subset<T, AsistenciaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AsistenciaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Asistencia.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AsistenciaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AsistenciaAggregateArgs>(args: Subset<T, AsistenciaAggregateArgs>): Prisma.PrismaPromise<GetAsistenciaAggregateType<T>>

    /**
     * Group by Asistencia.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AsistenciaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AsistenciaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AsistenciaGroupByArgs['orderBy'] }
        : { orderBy?: AsistenciaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AsistenciaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAsistenciaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Asistencia model
   */
  readonly fields: AsistenciaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Asistencia.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AsistenciaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    asignacion<T extends AsignacionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AsignacionDefaultArgs<ExtArgs>>): Prisma__AsignacionClient<$Result.GetResult<Prisma.$AsignacionPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Asistencia model
   */ 
  interface AsistenciaFieldRefs {
    readonly id: FieldRef<"Asistencia", 'String'>
    readonly tenant_id: FieldRef<"Asistencia", 'String'>
    readonly asignacion_id: FieldRef<"Asistencia", 'String'>
    readonly inicio_real: FieldRef<"Asistencia", 'DateTime'>
    readonly fin_real: FieldRef<"Asistencia", 'DateTime'>
    readonly metodo: FieldRef<"Asistencia", 'String'>
    readonly lat: FieldRef<"Asistencia", 'Decimal'>
    readonly lng: FieldRef<"Asistencia", 'Decimal'>
  }
    

  // Custom InputTypes
  /**
   * Asistencia findUnique
   */
  export type AsistenciaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asistencia
     */
    select?: AsistenciaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AsistenciaInclude<ExtArgs> | null
    /**
     * Filter, which Asistencia to fetch.
     */
    where: AsistenciaWhereUniqueInput
  }

  /**
   * Asistencia findUniqueOrThrow
   */
  export type AsistenciaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asistencia
     */
    select?: AsistenciaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AsistenciaInclude<ExtArgs> | null
    /**
     * Filter, which Asistencia to fetch.
     */
    where: AsistenciaWhereUniqueInput
  }

  /**
   * Asistencia findFirst
   */
  export type AsistenciaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asistencia
     */
    select?: AsistenciaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AsistenciaInclude<ExtArgs> | null
    /**
     * Filter, which Asistencia to fetch.
     */
    where?: AsistenciaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Asistencias to fetch.
     */
    orderBy?: AsistenciaOrderByWithRelationInput | AsistenciaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Asistencias.
     */
    cursor?: AsistenciaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Asistencias from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Asistencias.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Asistencias.
     */
    distinct?: AsistenciaScalarFieldEnum | AsistenciaScalarFieldEnum[]
  }

  /**
   * Asistencia findFirstOrThrow
   */
  export type AsistenciaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asistencia
     */
    select?: AsistenciaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AsistenciaInclude<ExtArgs> | null
    /**
     * Filter, which Asistencia to fetch.
     */
    where?: AsistenciaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Asistencias to fetch.
     */
    orderBy?: AsistenciaOrderByWithRelationInput | AsistenciaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Asistencias.
     */
    cursor?: AsistenciaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Asistencias from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Asistencias.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Asistencias.
     */
    distinct?: AsistenciaScalarFieldEnum | AsistenciaScalarFieldEnum[]
  }

  /**
   * Asistencia findMany
   */
  export type AsistenciaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asistencia
     */
    select?: AsistenciaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AsistenciaInclude<ExtArgs> | null
    /**
     * Filter, which Asistencias to fetch.
     */
    where?: AsistenciaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Asistencias to fetch.
     */
    orderBy?: AsistenciaOrderByWithRelationInput | AsistenciaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Asistencias.
     */
    cursor?: AsistenciaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Asistencias from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Asistencias.
     */
    skip?: number
    distinct?: AsistenciaScalarFieldEnum | AsistenciaScalarFieldEnum[]
  }

  /**
   * Asistencia create
   */
  export type AsistenciaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asistencia
     */
    select?: AsistenciaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AsistenciaInclude<ExtArgs> | null
    /**
     * The data needed to create a Asistencia.
     */
    data: XOR<AsistenciaCreateInput, AsistenciaUncheckedCreateInput>
  }

  /**
   * Asistencia createMany
   */
  export type AsistenciaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Asistencias.
     */
    data: AsistenciaCreateManyInput | AsistenciaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Asistencia createManyAndReturn
   */
  export type AsistenciaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asistencia
     */
    select?: AsistenciaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Asistencias.
     */
    data: AsistenciaCreateManyInput | AsistenciaCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AsistenciaIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Asistencia update
   */
  export type AsistenciaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asistencia
     */
    select?: AsistenciaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AsistenciaInclude<ExtArgs> | null
    /**
     * The data needed to update a Asistencia.
     */
    data: XOR<AsistenciaUpdateInput, AsistenciaUncheckedUpdateInput>
    /**
     * Choose, which Asistencia to update.
     */
    where: AsistenciaWhereUniqueInput
  }

  /**
   * Asistencia updateMany
   */
  export type AsistenciaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Asistencias.
     */
    data: XOR<AsistenciaUpdateManyMutationInput, AsistenciaUncheckedUpdateManyInput>
    /**
     * Filter which Asistencias to update
     */
    where?: AsistenciaWhereInput
  }

  /**
   * Asistencia upsert
   */
  export type AsistenciaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asistencia
     */
    select?: AsistenciaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AsistenciaInclude<ExtArgs> | null
    /**
     * The filter to search for the Asistencia to update in case it exists.
     */
    where: AsistenciaWhereUniqueInput
    /**
     * In case the Asistencia found by the `where` argument doesn't exist, create a new Asistencia with this data.
     */
    create: XOR<AsistenciaCreateInput, AsistenciaUncheckedCreateInput>
    /**
     * In case the Asistencia was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AsistenciaUpdateInput, AsistenciaUncheckedUpdateInput>
  }

  /**
   * Asistencia delete
   */
  export type AsistenciaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asistencia
     */
    select?: AsistenciaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AsistenciaInclude<ExtArgs> | null
    /**
     * Filter which Asistencia to delete.
     */
    where: AsistenciaWhereUniqueInput
  }

  /**
   * Asistencia deleteMany
   */
  export type AsistenciaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Asistencias to delete
     */
    where?: AsistenciaWhereInput
  }

  /**
   * Asistencia without action
   */
  export type AsistenciaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asistencia
     */
    select?: AsistenciaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AsistenciaInclude<ExtArgs> | null
  }


  /**
   * Model Feriado
   */

  export type AggregateFeriado = {
    _count: FeriadoCountAggregateOutputType | null
    _min: FeriadoMinAggregateOutputType | null
    _max: FeriadoMaxAggregateOutputType | null
  }

  export type FeriadoMinAggregateOutputType = {
    id: string | null
    tenant_id: string | null
    nombre: string | null
    fecha: Date | null
    created_at: Date | null
  }

  export type FeriadoMaxAggregateOutputType = {
    id: string | null
    tenant_id: string | null
    nombre: string | null
    fecha: Date | null
    created_at: Date | null
  }

  export type FeriadoCountAggregateOutputType = {
    id: number
    tenant_id: number
    nombre: number
    fecha: number
    created_at: number
    _all: number
  }


  export type FeriadoMinAggregateInputType = {
    id?: true
    tenant_id?: true
    nombre?: true
    fecha?: true
    created_at?: true
  }

  export type FeriadoMaxAggregateInputType = {
    id?: true
    tenant_id?: true
    nombre?: true
    fecha?: true
    created_at?: true
  }

  export type FeriadoCountAggregateInputType = {
    id?: true
    tenant_id?: true
    nombre?: true
    fecha?: true
    created_at?: true
    _all?: true
  }

  export type FeriadoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Feriado to aggregate.
     */
    where?: FeriadoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Feriados to fetch.
     */
    orderBy?: FeriadoOrderByWithRelationInput | FeriadoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FeriadoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Feriados from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Feriados.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Feriados
    **/
    _count?: true | FeriadoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FeriadoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FeriadoMaxAggregateInputType
  }

  export type GetFeriadoAggregateType<T extends FeriadoAggregateArgs> = {
        [P in keyof T & keyof AggregateFeriado]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFeriado[P]>
      : GetScalarType<T[P], AggregateFeriado[P]>
  }




  export type FeriadoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FeriadoWhereInput
    orderBy?: FeriadoOrderByWithAggregationInput | FeriadoOrderByWithAggregationInput[]
    by: FeriadoScalarFieldEnum[] | FeriadoScalarFieldEnum
    having?: FeriadoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FeriadoCountAggregateInputType | true
    _min?: FeriadoMinAggregateInputType
    _max?: FeriadoMaxAggregateInputType
  }

  export type FeriadoGroupByOutputType = {
    id: string
    tenant_id: string
    nombre: string
    fecha: Date
    created_at: Date
    _count: FeriadoCountAggregateOutputType | null
    _min: FeriadoMinAggregateOutputType | null
    _max: FeriadoMaxAggregateOutputType | null
  }

  type GetFeriadoGroupByPayload<T extends FeriadoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FeriadoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FeriadoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FeriadoGroupByOutputType[P]>
            : GetScalarType<T[P], FeriadoGroupByOutputType[P]>
        }
      >
    >


  export type FeriadoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenant_id?: boolean
    nombre?: boolean
    fecha?: boolean
    created_at?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["feriado"]>

  export type FeriadoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenant_id?: boolean
    nombre?: boolean
    fecha?: boolean
    created_at?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["feriado"]>

  export type FeriadoSelectScalar = {
    id?: boolean
    tenant_id?: boolean
    nombre?: boolean
    fecha?: boolean
    created_at?: boolean
  }

  export type FeriadoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type FeriadoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }

  export type $FeriadoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Feriado"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenant_id: string
      nombre: string
      fecha: Date
      created_at: Date
    }, ExtArgs["result"]["feriado"]>
    composites: {}
  }

  type FeriadoGetPayload<S extends boolean | null | undefined | FeriadoDefaultArgs> = $Result.GetResult<Prisma.$FeriadoPayload, S>

  type FeriadoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<FeriadoFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: FeriadoCountAggregateInputType | true
    }

  export interface FeriadoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Feriado'], meta: { name: 'Feriado' } }
    /**
     * Find zero or one Feriado that matches the filter.
     * @param {FeriadoFindUniqueArgs} args - Arguments to find a Feriado
     * @example
     * // Get one Feriado
     * const feriado = await prisma.feriado.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FeriadoFindUniqueArgs>(args: SelectSubset<T, FeriadoFindUniqueArgs<ExtArgs>>): Prisma__FeriadoClient<$Result.GetResult<Prisma.$FeriadoPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Feriado that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {FeriadoFindUniqueOrThrowArgs} args - Arguments to find a Feriado
     * @example
     * // Get one Feriado
     * const feriado = await prisma.feriado.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FeriadoFindUniqueOrThrowArgs>(args: SelectSubset<T, FeriadoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FeriadoClient<$Result.GetResult<Prisma.$FeriadoPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Feriado that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeriadoFindFirstArgs} args - Arguments to find a Feriado
     * @example
     * // Get one Feriado
     * const feriado = await prisma.feriado.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FeriadoFindFirstArgs>(args?: SelectSubset<T, FeriadoFindFirstArgs<ExtArgs>>): Prisma__FeriadoClient<$Result.GetResult<Prisma.$FeriadoPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Feriado that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeriadoFindFirstOrThrowArgs} args - Arguments to find a Feriado
     * @example
     * // Get one Feriado
     * const feriado = await prisma.feriado.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FeriadoFindFirstOrThrowArgs>(args?: SelectSubset<T, FeriadoFindFirstOrThrowArgs<ExtArgs>>): Prisma__FeriadoClient<$Result.GetResult<Prisma.$FeriadoPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Feriados that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeriadoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Feriados
     * const feriados = await prisma.feriado.findMany()
     * 
     * // Get first 10 Feriados
     * const feriados = await prisma.feriado.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const feriadoWithIdOnly = await prisma.feriado.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FeriadoFindManyArgs>(args?: SelectSubset<T, FeriadoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FeriadoPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Feriado.
     * @param {FeriadoCreateArgs} args - Arguments to create a Feriado.
     * @example
     * // Create one Feriado
     * const Feriado = await prisma.feriado.create({
     *   data: {
     *     // ... data to create a Feriado
     *   }
     * })
     * 
     */
    create<T extends FeriadoCreateArgs>(args: SelectSubset<T, FeriadoCreateArgs<ExtArgs>>): Prisma__FeriadoClient<$Result.GetResult<Prisma.$FeriadoPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Feriados.
     * @param {FeriadoCreateManyArgs} args - Arguments to create many Feriados.
     * @example
     * // Create many Feriados
     * const feriado = await prisma.feriado.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FeriadoCreateManyArgs>(args?: SelectSubset<T, FeriadoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Feriados and returns the data saved in the database.
     * @param {FeriadoCreateManyAndReturnArgs} args - Arguments to create many Feriados.
     * @example
     * // Create many Feriados
     * const feriado = await prisma.feriado.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Feriados and only return the `id`
     * const feriadoWithIdOnly = await prisma.feriado.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FeriadoCreateManyAndReturnArgs>(args?: SelectSubset<T, FeriadoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FeriadoPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Feriado.
     * @param {FeriadoDeleteArgs} args - Arguments to delete one Feriado.
     * @example
     * // Delete one Feriado
     * const Feriado = await prisma.feriado.delete({
     *   where: {
     *     // ... filter to delete one Feriado
     *   }
     * })
     * 
     */
    delete<T extends FeriadoDeleteArgs>(args: SelectSubset<T, FeriadoDeleteArgs<ExtArgs>>): Prisma__FeriadoClient<$Result.GetResult<Prisma.$FeriadoPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Feriado.
     * @param {FeriadoUpdateArgs} args - Arguments to update one Feriado.
     * @example
     * // Update one Feriado
     * const feriado = await prisma.feriado.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FeriadoUpdateArgs>(args: SelectSubset<T, FeriadoUpdateArgs<ExtArgs>>): Prisma__FeriadoClient<$Result.GetResult<Prisma.$FeriadoPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Feriados.
     * @param {FeriadoDeleteManyArgs} args - Arguments to filter Feriados to delete.
     * @example
     * // Delete a few Feriados
     * const { count } = await prisma.feriado.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FeriadoDeleteManyArgs>(args?: SelectSubset<T, FeriadoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Feriados.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeriadoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Feriados
     * const feriado = await prisma.feriado.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FeriadoUpdateManyArgs>(args: SelectSubset<T, FeriadoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Feriado.
     * @param {FeriadoUpsertArgs} args - Arguments to update or create a Feriado.
     * @example
     * // Update or create a Feriado
     * const feriado = await prisma.feriado.upsert({
     *   create: {
     *     // ... data to create a Feriado
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Feriado we want to update
     *   }
     * })
     */
    upsert<T extends FeriadoUpsertArgs>(args: SelectSubset<T, FeriadoUpsertArgs<ExtArgs>>): Prisma__FeriadoClient<$Result.GetResult<Prisma.$FeriadoPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Feriados.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeriadoCountArgs} args - Arguments to filter Feriados to count.
     * @example
     * // Count the number of Feriados
     * const count = await prisma.feriado.count({
     *   where: {
     *     // ... the filter for the Feriados we want to count
     *   }
     * })
    **/
    count<T extends FeriadoCountArgs>(
      args?: Subset<T, FeriadoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FeriadoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Feriado.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeriadoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FeriadoAggregateArgs>(args: Subset<T, FeriadoAggregateArgs>): Prisma.PrismaPromise<GetFeriadoAggregateType<T>>

    /**
     * Group by Feriado.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeriadoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FeriadoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FeriadoGroupByArgs['orderBy'] }
        : { orderBy?: FeriadoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FeriadoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFeriadoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Feriado model
   */
  readonly fields: FeriadoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Feriado.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FeriadoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Feriado model
   */ 
  interface FeriadoFieldRefs {
    readonly id: FieldRef<"Feriado", 'String'>
    readonly tenant_id: FieldRef<"Feriado", 'String'>
    readonly nombre: FieldRef<"Feriado", 'String'>
    readonly fecha: FieldRef<"Feriado", 'DateTime'>
    readonly created_at: FieldRef<"Feriado", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Feriado findUnique
   */
  export type FeriadoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feriado
     */
    select?: FeriadoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeriadoInclude<ExtArgs> | null
    /**
     * Filter, which Feriado to fetch.
     */
    where: FeriadoWhereUniqueInput
  }

  /**
   * Feriado findUniqueOrThrow
   */
  export type FeriadoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feriado
     */
    select?: FeriadoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeriadoInclude<ExtArgs> | null
    /**
     * Filter, which Feriado to fetch.
     */
    where: FeriadoWhereUniqueInput
  }

  /**
   * Feriado findFirst
   */
  export type FeriadoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feriado
     */
    select?: FeriadoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeriadoInclude<ExtArgs> | null
    /**
     * Filter, which Feriado to fetch.
     */
    where?: FeriadoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Feriados to fetch.
     */
    orderBy?: FeriadoOrderByWithRelationInput | FeriadoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Feriados.
     */
    cursor?: FeriadoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Feriados from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Feriados.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Feriados.
     */
    distinct?: FeriadoScalarFieldEnum | FeriadoScalarFieldEnum[]
  }

  /**
   * Feriado findFirstOrThrow
   */
  export type FeriadoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feriado
     */
    select?: FeriadoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeriadoInclude<ExtArgs> | null
    /**
     * Filter, which Feriado to fetch.
     */
    where?: FeriadoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Feriados to fetch.
     */
    orderBy?: FeriadoOrderByWithRelationInput | FeriadoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Feriados.
     */
    cursor?: FeriadoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Feriados from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Feriados.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Feriados.
     */
    distinct?: FeriadoScalarFieldEnum | FeriadoScalarFieldEnum[]
  }

  /**
   * Feriado findMany
   */
  export type FeriadoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feriado
     */
    select?: FeriadoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeriadoInclude<ExtArgs> | null
    /**
     * Filter, which Feriados to fetch.
     */
    where?: FeriadoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Feriados to fetch.
     */
    orderBy?: FeriadoOrderByWithRelationInput | FeriadoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Feriados.
     */
    cursor?: FeriadoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Feriados from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Feriados.
     */
    skip?: number
    distinct?: FeriadoScalarFieldEnum | FeriadoScalarFieldEnum[]
  }

  /**
   * Feriado create
   */
  export type FeriadoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feriado
     */
    select?: FeriadoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeriadoInclude<ExtArgs> | null
    /**
     * The data needed to create a Feriado.
     */
    data: XOR<FeriadoCreateInput, FeriadoUncheckedCreateInput>
  }

  /**
   * Feriado createMany
   */
  export type FeriadoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Feriados.
     */
    data: FeriadoCreateManyInput | FeriadoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Feriado createManyAndReturn
   */
  export type FeriadoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feriado
     */
    select?: FeriadoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Feriados.
     */
    data: FeriadoCreateManyInput | FeriadoCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeriadoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Feriado update
   */
  export type FeriadoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feriado
     */
    select?: FeriadoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeriadoInclude<ExtArgs> | null
    /**
     * The data needed to update a Feriado.
     */
    data: XOR<FeriadoUpdateInput, FeriadoUncheckedUpdateInput>
    /**
     * Choose, which Feriado to update.
     */
    where: FeriadoWhereUniqueInput
  }

  /**
   * Feriado updateMany
   */
  export type FeriadoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Feriados.
     */
    data: XOR<FeriadoUpdateManyMutationInput, FeriadoUncheckedUpdateManyInput>
    /**
     * Filter which Feriados to update
     */
    where?: FeriadoWhereInput
  }

  /**
   * Feriado upsert
   */
  export type FeriadoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feriado
     */
    select?: FeriadoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeriadoInclude<ExtArgs> | null
    /**
     * The filter to search for the Feriado to update in case it exists.
     */
    where: FeriadoWhereUniqueInput
    /**
     * In case the Feriado found by the `where` argument doesn't exist, create a new Feriado with this data.
     */
    create: XOR<FeriadoCreateInput, FeriadoUncheckedCreateInput>
    /**
     * In case the Feriado was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FeriadoUpdateInput, FeriadoUncheckedUpdateInput>
  }

  /**
   * Feriado delete
   */
  export type FeriadoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feriado
     */
    select?: FeriadoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeriadoInclude<ExtArgs> | null
    /**
     * Filter which Feriado to delete.
     */
    where: FeriadoWhereUniqueInput
  }

  /**
   * Feriado deleteMany
   */
  export type FeriadoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Feriados to delete
     */
    where?: FeriadoWhereInput
  }

  /**
   * Feriado without action
   */
  export type FeriadoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feriado
     */
    select?: FeriadoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeriadoInclude<ExtArgs> | null
  }


  /**
   * Model ConfiguracionCostos
   */

  export type AggregateConfiguracionCostos = {
    _count: ConfiguracionCostosCountAggregateOutputType | null
    _avg: ConfiguracionCostosAvgAggregateOutputType | null
    _sum: ConfiguracionCostosSumAggregateOutputType | null
    _min: ConfiguracionCostosMinAggregateOutputType | null
    _max: ConfiguracionCostosMaxAggregateOutputType | null
  }

  export type ConfiguracionCostosAvgAggregateOutputType = {
    costo_hora_base: Decimal | null
    cargas_sociales: Decimal | null
    costos_uniforme: Decimal | null
    otros_costos: Decimal | null
    factor_ajuste: Decimal | null
  }

  export type ConfiguracionCostosSumAggregateOutputType = {
    costo_hora_base: Decimal | null
    cargas_sociales: Decimal | null
    costos_uniforme: Decimal | null
    otros_costos: Decimal | null
    factor_ajuste: Decimal | null
  }

  export type ConfiguracionCostosMinAggregateOutputType = {
    id: string | null
    tenant_id: string | null
    costo_hora_base: Decimal | null
    cargas_sociales: Decimal | null
    costos_uniforme: Decimal | null
    otros_costos: Decimal | null
    factor_ajuste: Decimal | null
    updated_at: Date | null
  }

  export type ConfiguracionCostosMaxAggregateOutputType = {
    id: string | null
    tenant_id: string | null
    costo_hora_base: Decimal | null
    cargas_sociales: Decimal | null
    costos_uniforme: Decimal | null
    otros_costos: Decimal | null
    factor_ajuste: Decimal | null
    updated_at: Date | null
  }

  export type ConfiguracionCostosCountAggregateOutputType = {
    id: number
    tenant_id: number
    costo_hora_base: number
    cargas_sociales: number
    costos_uniforme: number
    otros_costos: number
    factor_ajuste: number
    updated_at: number
    _all: number
  }


  export type ConfiguracionCostosAvgAggregateInputType = {
    costo_hora_base?: true
    cargas_sociales?: true
    costos_uniforme?: true
    otros_costos?: true
    factor_ajuste?: true
  }

  export type ConfiguracionCostosSumAggregateInputType = {
    costo_hora_base?: true
    cargas_sociales?: true
    costos_uniforme?: true
    otros_costos?: true
    factor_ajuste?: true
  }

  export type ConfiguracionCostosMinAggregateInputType = {
    id?: true
    tenant_id?: true
    costo_hora_base?: true
    cargas_sociales?: true
    costos_uniforme?: true
    otros_costos?: true
    factor_ajuste?: true
    updated_at?: true
  }

  export type ConfiguracionCostosMaxAggregateInputType = {
    id?: true
    tenant_id?: true
    costo_hora_base?: true
    cargas_sociales?: true
    costos_uniforme?: true
    otros_costos?: true
    factor_ajuste?: true
    updated_at?: true
  }

  export type ConfiguracionCostosCountAggregateInputType = {
    id?: true
    tenant_id?: true
    costo_hora_base?: true
    cargas_sociales?: true
    costos_uniforme?: true
    otros_costos?: true
    factor_ajuste?: true
    updated_at?: true
    _all?: true
  }

  export type ConfiguracionCostosAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ConfiguracionCostos to aggregate.
     */
    where?: ConfiguracionCostosWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConfiguracionCostos to fetch.
     */
    orderBy?: ConfiguracionCostosOrderByWithRelationInput | ConfiguracionCostosOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ConfiguracionCostosWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConfiguracionCostos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConfiguracionCostos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ConfiguracionCostos
    **/
    _count?: true | ConfiguracionCostosCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ConfiguracionCostosAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ConfiguracionCostosSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ConfiguracionCostosMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ConfiguracionCostosMaxAggregateInputType
  }

  export type GetConfiguracionCostosAggregateType<T extends ConfiguracionCostosAggregateArgs> = {
        [P in keyof T & keyof AggregateConfiguracionCostos]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateConfiguracionCostos[P]>
      : GetScalarType<T[P], AggregateConfiguracionCostos[P]>
  }




  export type ConfiguracionCostosGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConfiguracionCostosWhereInput
    orderBy?: ConfiguracionCostosOrderByWithAggregationInput | ConfiguracionCostosOrderByWithAggregationInput[]
    by: ConfiguracionCostosScalarFieldEnum[] | ConfiguracionCostosScalarFieldEnum
    having?: ConfiguracionCostosScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ConfiguracionCostosCountAggregateInputType | true
    _avg?: ConfiguracionCostosAvgAggregateInputType
    _sum?: ConfiguracionCostosSumAggregateInputType
    _min?: ConfiguracionCostosMinAggregateInputType
    _max?: ConfiguracionCostosMaxAggregateInputType
  }

  export type ConfiguracionCostosGroupByOutputType = {
    id: string
    tenant_id: string
    costo_hora_base: Decimal
    cargas_sociales: Decimal
    costos_uniforme: Decimal
    otros_costos: Decimal
    factor_ajuste: Decimal
    updated_at: Date
    _count: ConfiguracionCostosCountAggregateOutputType | null
    _avg: ConfiguracionCostosAvgAggregateOutputType | null
    _sum: ConfiguracionCostosSumAggregateOutputType | null
    _min: ConfiguracionCostosMinAggregateOutputType | null
    _max: ConfiguracionCostosMaxAggregateOutputType | null
  }

  type GetConfiguracionCostosGroupByPayload<T extends ConfiguracionCostosGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ConfiguracionCostosGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ConfiguracionCostosGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ConfiguracionCostosGroupByOutputType[P]>
            : GetScalarType<T[P], ConfiguracionCostosGroupByOutputType[P]>
        }
      >
    >


  export type ConfiguracionCostosSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenant_id?: boolean
    costo_hora_base?: boolean
    cargas_sociales?: boolean
    costos_uniforme?: boolean
    otros_costos?: boolean
    factor_ajuste?: boolean
    updated_at?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["configuracionCostos"]>

  export type ConfiguracionCostosSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenant_id?: boolean
    costo_hora_base?: boolean
    cargas_sociales?: boolean
    costos_uniforme?: boolean
    otros_costos?: boolean
    factor_ajuste?: boolean
    updated_at?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["configuracionCostos"]>

  export type ConfiguracionCostosSelectScalar = {
    id?: boolean
    tenant_id?: boolean
    costo_hora_base?: boolean
    cargas_sociales?: boolean
    costos_uniforme?: boolean
    otros_costos?: boolean
    factor_ajuste?: boolean
    updated_at?: boolean
  }

  export type ConfiguracionCostosInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type ConfiguracionCostosIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }

  export type $ConfiguracionCostosPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ConfiguracionCostos"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenant_id: string
      costo_hora_base: Prisma.Decimal
      cargas_sociales: Prisma.Decimal
      costos_uniforme: Prisma.Decimal
      otros_costos: Prisma.Decimal
      factor_ajuste: Prisma.Decimal
      updated_at: Date
    }, ExtArgs["result"]["configuracionCostos"]>
    composites: {}
  }

  type ConfiguracionCostosGetPayload<S extends boolean | null | undefined | ConfiguracionCostosDefaultArgs> = $Result.GetResult<Prisma.$ConfiguracionCostosPayload, S>

  type ConfiguracionCostosCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ConfiguracionCostosFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ConfiguracionCostosCountAggregateInputType | true
    }

  export interface ConfiguracionCostosDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ConfiguracionCostos'], meta: { name: 'ConfiguracionCostos' } }
    /**
     * Find zero or one ConfiguracionCostos that matches the filter.
     * @param {ConfiguracionCostosFindUniqueArgs} args - Arguments to find a ConfiguracionCostos
     * @example
     * // Get one ConfiguracionCostos
     * const configuracionCostos = await prisma.configuracionCostos.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ConfiguracionCostosFindUniqueArgs>(args: SelectSubset<T, ConfiguracionCostosFindUniqueArgs<ExtArgs>>): Prisma__ConfiguracionCostosClient<$Result.GetResult<Prisma.$ConfiguracionCostosPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ConfiguracionCostos that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ConfiguracionCostosFindUniqueOrThrowArgs} args - Arguments to find a ConfiguracionCostos
     * @example
     * // Get one ConfiguracionCostos
     * const configuracionCostos = await prisma.configuracionCostos.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ConfiguracionCostosFindUniqueOrThrowArgs>(args: SelectSubset<T, ConfiguracionCostosFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ConfiguracionCostosClient<$Result.GetResult<Prisma.$ConfiguracionCostosPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ConfiguracionCostos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfiguracionCostosFindFirstArgs} args - Arguments to find a ConfiguracionCostos
     * @example
     * // Get one ConfiguracionCostos
     * const configuracionCostos = await prisma.configuracionCostos.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ConfiguracionCostosFindFirstArgs>(args?: SelectSubset<T, ConfiguracionCostosFindFirstArgs<ExtArgs>>): Prisma__ConfiguracionCostosClient<$Result.GetResult<Prisma.$ConfiguracionCostosPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ConfiguracionCostos that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfiguracionCostosFindFirstOrThrowArgs} args - Arguments to find a ConfiguracionCostos
     * @example
     * // Get one ConfiguracionCostos
     * const configuracionCostos = await prisma.configuracionCostos.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ConfiguracionCostosFindFirstOrThrowArgs>(args?: SelectSubset<T, ConfiguracionCostosFindFirstOrThrowArgs<ExtArgs>>): Prisma__ConfiguracionCostosClient<$Result.GetResult<Prisma.$ConfiguracionCostosPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ConfiguracionCostos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfiguracionCostosFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ConfiguracionCostos
     * const configuracionCostos = await prisma.configuracionCostos.findMany()
     * 
     * // Get first 10 ConfiguracionCostos
     * const configuracionCostos = await prisma.configuracionCostos.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const configuracionCostosWithIdOnly = await prisma.configuracionCostos.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ConfiguracionCostosFindManyArgs>(args?: SelectSubset<T, ConfiguracionCostosFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConfiguracionCostosPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ConfiguracionCostos.
     * @param {ConfiguracionCostosCreateArgs} args - Arguments to create a ConfiguracionCostos.
     * @example
     * // Create one ConfiguracionCostos
     * const ConfiguracionCostos = await prisma.configuracionCostos.create({
     *   data: {
     *     // ... data to create a ConfiguracionCostos
     *   }
     * })
     * 
     */
    create<T extends ConfiguracionCostosCreateArgs>(args: SelectSubset<T, ConfiguracionCostosCreateArgs<ExtArgs>>): Prisma__ConfiguracionCostosClient<$Result.GetResult<Prisma.$ConfiguracionCostosPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ConfiguracionCostos.
     * @param {ConfiguracionCostosCreateManyArgs} args - Arguments to create many ConfiguracionCostos.
     * @example
     * // Create many ConfiguracionCostos
     * const configuracionCostos = await prisma.configuracionCostos.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ConfiguracionCostosCreateManyArgs>(args?: SelectSubset<T, ConfiguracionCostosCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ConfiguracionCostos and returns the data saved in the database.
     * @param {ConfiguracionCostosCreateManyAndReturnArgs} args - Arguments to create many ConfiguracionCostos.
     * @example
     * // Create many ConfiguracionCostos
     * const configuracionCostos = await prisma.configuracionCostos.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ConfiguracionCostos and only return the `id`
     * const configuracionCostosWithIdOnly = await prisma.configuracionCostos.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ConfiguracionCostosCreateManyAndReturnArgs>(args?: SelectSubset<T, ConfiguracionCostosCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConfiguracionCostosPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ConfiguracionCostos.
     * @param {ConfiguracionCostosDeleteArgs} args - Arguments to delete one ConfiguracionCostos.
     * @example
     * // Delete one ConfiguracionCostos
     * const ConfiguracionCostos = await prisma.configuracionCostos.delete({
     *   where: {
     *     // ... filter to delete one ConfiguracionCostos
     *   }
     * })
     * 
     */
    delete<T extends ConfiguracionCostosDeleteArgs>(args: SelectSubset<T, ConfiguracionCostosDeleteArgs<ExtArgs>>): Prisma__ConfiguracionCostosClient<$Result.GetResult<Prisma.$ConfiguracionCostosPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ConfiguracionCostos.
     * @param {ConfiguracionCostosUpdateArgs} args - Arguments to update one ConfiguracionCostos.
     * @example
     * // Update one ConfiguracionCostos
     * const configuracionCostos = await prisma.configuracionCostos.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ConfiguracionCostosUpdateArgs>(args: SelectSubset<T, ConfiguracionCostosUpdateArgs<ExtArgs>>): Prisma__ConfiguracionCostosClient<$Result.GetResult<Prisma.$ConfiguracionCostosPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ConfiguracionCostos.
     * @param {ConfiguracionCostosDeleteManyArgs} args - Arguments to filter ConfiguracionCostos to delete.
     * @example
     * // Delete a few ConfiguracionCostos
     * const { count } = await prisma.configuracionCostos.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ConfiguracionCostosDeleteManyArgs>(args?: SelectSubset<T, ConfiguracionCostosDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ConfiguracionCostos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfiguracionCostosUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ConfiguracionCostos
     * const configuracionCostos = await prisma.configuracionCostos.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ConfiguracionCostosUpdateManyArgs>(args: SelectSubset<T, ConfiguracionCostosUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ConfiguracionCostos.
     * @param {ConfiguracionCostosUpsertArgs} args - Arguments to update or create a ConfiguracionCostos.
     * @example
     * // Update or create a ConfiguracionCostos
     * const configuracionCostos = await prisma.configuracionCostos.upsert({
     *   create: {
     *     // ... data to create a ConfiguracionCostos
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ConfiguracionCostos we want to update
     *   }
     * })
     */
    upsert<T extends ConfiguracionCostosUpsertArgs>(args: SelectSubset<T, ConfiguracionCostosUpsertArgs<ExtArgs>>): Prisma__ConfiguracionCostosClient<$Result.GetResult<Prisma.$ConfiguracionCostosPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ConfiguracionCostos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfiguracionCostosCountArgs} args - Arguments to filter ConfiguracionCostos to count.
     * @example
     * // Count the number of ConfiguracionCostos
     * const count = await prisma.configuracionCostos.count({
     *   where: {
     *     // ... the filter for the ConfiguracionCostos we want to count
     *   }
     * })
    **/
    count<T extends ConfiguracionCostosCountArgs>(
      args?: Subset<T, ConfiguracionCostosCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ConfiguracionCostosCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ConfiguracionCostos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfiguracionCostosAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ConfiguracionCostosAggregateArgs>(args: Subset<T, ConfiguracionCostosAggregateArgs>): Prisma.PrismaPromise<GetConfiguracionCostosAggregateType<T>>

    /**
     * Group by ConfiguracionCostos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfiguracionCostosGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ConfiguracionCostosGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ConfiguracionCostosGroupByArgs['orderBy'] }
        : { orderBy?: ConfiguracionCostosGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ConfiguracionCostosGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetConfiguracionCostosGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ConfiguracionCostos model
   */
  readonly fields: ConfiguracionCostosFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ConfiguracionCostos.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ConfiguracionCostosClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ConfiguracionCostos model
   */ 
  interface ConfiguracionCostosFieldRefs {
    readonly id: FieldRef<"ConfiguracionCostos", 'String'>
    readonly tenant_id: FieldRef<"ConfiguracionCostos", 'String'>
    readonly costo_hora_base: FieldRef<"ConfiguracionCostos", 'Decimal'>
    readonly cargas_sociales: FieldRef<"ConfiguracionCostos", 'Decimal'>
    readonly costos_uniforme: FieldRef<"ConfiguracionCostos", 'Decimal'>
    readonly otros_costos: FieldRef<"ConfiguracionCostos", 'Decimal'>
    readonly factor_ajuste: FieldRef<"ConfiguracionCostos", 'Decimal'>
    readonly updated_at: FieldRef<"ConfiguracionCostos", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ConfiguracionCostos findUnique
   */
  export type ConfiguracionCostosFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfiguracionCostos
     */
    select?: ConfiguracionCostosSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConfiguracionCostosInclude<ExtArgs> | null
    /**
     * Filter, which ConfiguracionCostos to fetch.
     */
    where: ConfiguracionCostosWhereUniqueInput
  }

  /**
   * ConfiguracionCostos findUniqueOrThrow
   */
  export type ConfiguracionCostosFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfiguracionCostos
     */
    select?: ConfiguracionCostosSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConfiguracionCostosInclude<ExtArgs> | null
    /**
     * Filter, which ConfiguracionCostos to fetch.
     */
    where: ConfiguracionCostosWhereUniqueInput
  }

  /**
   * ConfiguracionCostos findFirst
   */
  export type ConfiguracionCostosFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfiguracionCostos
     */
    select?: ConfiguracionCostosSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConfiguracionCostosInclude<ExtArgs> | null
    /**
     * Filter, which ConfiguracionCostos to fetch.
     */
    where?: ConfiguracionCostosWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConfiguracionCostos to fetch.
     */
    orderBy?: ConfiguracionCostosOrderByWithRelationInput | ConfiguracionCostosOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ConfiguracionCostos.
     */
    cursor?: ConfiguracionCostosWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConfiguracionCostos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConfiguracionCostos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ConfiguracionCostos.
     */
    distinct?: ConfiguracionCostosScalarFieldEnum | ConfiguracionCostosScalarFieldEnum[]
  }

  /**
   * ConfiguracionCostos findFirstOrThrow
   */
  export type ConfiguracionCostosFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfiguracionCostos
     */
    select?: ConfiguracionCostosSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConfiguracionCostosInclude<ExtArgs> | null
    /**
     * Filter, which ConfiguracionCostos to fetch.
     */
    where?: ConfiguracionCostosWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConfiguracionCostos to fetch.
     */
    orderBy?: ConfiguracionCostosOrderByWithRelationInput | ConfiguracionCostosOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ConfiguracionCostos.
     */
    cursor?: ConfiguracionCostosWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConfiguracionCostos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConfiguracionCostos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ConfiguracionCostos.
     */
    distinct?: ConfiguracionCostosScalarFieldEnum | ConfiguracionCostosScalarFieldEnum[]
  }

  /**
   * ConfiguracionCostos findMany
   */
  export type ConfiguracionCostosFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfiguracionCostos
     */
    select?: ConfiguracionCostosSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConfiguracionCostosInclude<ExtArgs> | null
    /**
     * Filter, which ConfiguracionCostos to fetch.
     */
    where?: ConfiguracionCostosWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConfiguracionCostos to fetch.
     */
    orderBy?: ConfiguracionCostosOrderByWithRelationInput | ConfiguracionCostosOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ConfiguracionCostos.
     */
    cursor?: ConfiguracionCostosWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConfiguracionCostos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConfiguracionCostos.
     */
    skip?: number
    distinct?: ConfiguracionCostosScalarFieldEnum | ConfiguracionCostosScalarFieldEnum[]
  }

  /**
   * ConfiguracionCostos create
   */
  export type ConfiguracionCostosCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfiguracionCostos
     */
    select?: ConfiguracionCostosSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConfiguracionCostosInclude<ExtArgs> | null
    /**
     * The data needed to create a ConfiguracionCostos.
     */
    data: XOR<ConfiguracionCostosCreateInput, ConfiguracionCostosUncheckedCreateInput>
  }

  /**
   * ConfiguracionCostos createMany
   */
  export type ConfiguracionCostosCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ConfiguracionCostos.
     */
    data: ConfiguracionCostosCreateManyInput | ConfiguracionCostosCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ConfiguracionCostos createManyAndReturn
   */
  export type ConfiguracionCostosCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfiguracionCostos
     */
    select?: ConfiguracionCostosSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ConfiguracionCostos.
     */
    data: ConfiguracionCostosCreateManyInput | ConfiguracionCostosCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConfiguracionCostosIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ConfiguracionCostos update
   */
  export type ConfiguracionCostosUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfiguracionCostos
     */
    select?: ConfiguracionCostosSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConfiguracionCostosInclude<ExtArgs> | null
    /**
     * The data needed to update a ConfiguracionCostos.
     */
    data: XOR<ConfiguracionCostosUpdateInput, ConfiguracionCostosUncheckedUpdateInput>
    /**
     * Choose, which ConfiguracionCostos to update.
     */
    where: ConfiguracionCostosWhereUniqueInput
  }

  /**
   * ConfiguracionCostos updateMany
   */
  export type ConfiguracionCostosUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ConfiguracionCostos.
     */
    data: XOR<ConfiguracionCostosUpdateManyMutationInput, ConfiguracionCostosUncheckedUpdateManyInput>
    /**
     * Filter which ConfiguracionCostos to update
     */
    where?: ConfiguracionCostosWhereInput
  }

  /**
   * ConfiguracionCostos upsert
   */
  export type ConfiguracionCostosUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfiguracionCostos
     */
    select?: ConfiguracionCostosSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConfiguracionCostosInclude<ExtArgs> | null
    /**
     * The filter to search for the ConfiguracionCostos to update in case it exists.
     */
    where: ConfiguracionCostosWhereUniqueInput
    /**
     * In case the ConfiguracionCostos found by the `where` argument doesn't exist, create a new ConfiguracionCostos with this data.
     */
    create: XOR<ConfiguracionCostosCreateInput, ConfiguracionCostosUncheckedCreateInput>
    /**
     * In case the ConfiguracionCostos was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ConfiguracionCostosUpdateInput, ConfiguracionCostosUncheckedUpdateInput>
  }

  /**
   * ConfiguracionCostos delete
   */
  export type ConfiguracionCostosDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfiguracionCostos
     */
    select?: ConfiguracionCostosSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConfiguracionCostosInclude<ExtArgs> | null
    /**
     * Filter which ConfiguracionCostos to delete.
     */
    where: ConfiguracionCostosWhereUniqueInput
  }

  /**
   * ConfiguracionCostos deleteMany
   */
  export type ConfiguracionCostosDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ConfiguracionCostos to delete
     */
    where?: ConfiguracionCostosWhereInput
  }

  /**
   * ConfiguracionCostos without action
   */
  export type ConfiguracionCostosDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfiguracionCostos
     */
    select?: ConfiguracionCostosSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConfiguracionCostosInclude<ExtArgs> | null
  }


  /**
   * Model Cotizacion
   */

  export type AggregateCotizacion = {
    _count: CotizacionCountAggregateOutputType | null
    _avg: CotizacionAvgAggregateOutputType | null
    _sum: CotizacionSumAggregateOutputType | null
    _min: CotizacionMinAggregateOutputType | null
    _max: CotizacionMaxAggregateOutputType | null
  }

  export type CotizacionAvgAggregateOutputType = {
    total_mensual: Decimal | null
  }

  export type CotizacionSumAggregateOutputType = {
    total_mensual: Decimal | null
  }

  export type CotizacionMinAggregateOutputType = {
    id: string | null
    tenant_id: string | null
    cliente_nombre: string | null
    vencimiento: Date | null
    estado: string | null
    total_mensual: Decimal | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type CotizacionMaxAggregateOutputType = {
    id: string | null
    tenant_id: string | null
    cliente_nombre: string | null
    vencimiento: Date | null
    estado: string | null
    total_mensual: Decimal | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type CotizacionCountAggregateOutputType = {
    id: number
    tenant_id: number
    cliente_nombre: number
    vencimiento: number
    estado: number
    total_mensual: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type CotizacionAvgAggregateInputType = {
    total_mensual?: true
  }

  export type CotizacionSumAggregateInputType = {
    total_mensual?: true
  }

  export type CotizacionMinAggregateInputType = {
    id?: true
    tenant_id?: true
    cliente_nombre?: true
    vencimiento?: true
    estado?: true
    total_mensual?: true
    created_at?: true
    updated_at?: true
  }

  export type CotizacionMaxAggregateInputType = {
    id?: true
    tenant_id?: true
    cliente_nombre?: true
    vencimiento?: true
    estado?: true
    total_mensual?: true
    created_at?: true
    updated_at?: true
  }

  export type CotizacionCountAggregateInputType = {
    id?: true
    tenant_id?: true
    cliente_nombre?: true
    vencimiento?: true
    estado?: true
    total_mensual?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type CotizacionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Cotizacion to aggregate.
     */
    where?: CotizacionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cotizacions to fetch.
     */
    orderBy?: CotizacionOrderByWithRelationInput | CotizacionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CotizacionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cotizacions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cotizacions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Cotizacions
    **/
    _count?: true | CotizacionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CotizacionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CotizacionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CotizacionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CotizacionMaxAggregateInputType
  }

  export type GetCotizacionAggregateType<T extends CotizacionAggregateArgs> = {
        [P in keyof T & keyof AggregateCotizacion]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCotizacion[P]>
      : GetScalarType<T[P], AggregateCotizacion[P]>
  }




  export type CotizacionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CotizacionWhereInput
    orderBy?: CotizacionOrderByWithAggregationInput | CotizacionOrderByWithAggregationInput[]
    by: CotizacionScalarFieldEnum[] | CotizacionScalarFieldEnum
    having?: CotizacionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CotizacionCountAggregateInputType | true
    _avg?: CotizacionAvgAggregateInputType
    _sum?: CotizacionSumAggregateInputType
    _min?: CotizacionMinAggregateInputType
    _max?: CotizacionMaxAggregateInputType
  }

  export type CotizacionGroupByOutputType = {
    id: string
    tenant_id: string
    cliente_nombre: string
    vencimiento: Date
    estado: string
    total_mensual: Decimal
    created_at: Date
    updated_at: Date
    _count: CotizacionCountAggregateOutputType | null
    _avg: CotizacionAvgAggregateOutputType | null
    _sum: CotizacionSumAggregateOutputType | null
    _min: CotizacionMinAggregateOutputType | null
    _max: CotizacionMaxAggregateOutputType | null
  }

  type GetCotizacionGroupByPayload<T extends CotizacionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CotizacionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CotizacionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CotizacionGroupByOutputType[P]>
            : GetScalarType<T[P], CotizacionGroupByOutputType[P]>
        }
      >
    >


  export type CotizacionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenant_id?: boolean
    cliente_nombre?: boolean
    vencimiento?: boolean
    estado?: boolean
    total_mensual?: boolean
    created_at?: boolean
    updated_at?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    items?: boolean | Cotizacion$itemsArgs<ExtArgs>
    _count?: boolean | CotizacionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["cotizacion"]>

  export type CotizacionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenant_id?: boolean
    cliente_nombre?: boolean
    vencimiento?: boolean
    estado?: boolean
    total_mensual?: boolean
    created_at?: boolean
    updated_at?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["cotizacion"]>

  export type CotizacionSelectScalar = {
    id?: boolean
    tenant_id?: boolean
    cliente_nombre?: boolean
    vencimiento?: boolean
    estado?: boolean
    total_mensual?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type CotizacionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    items?: boolean | Cotizacion$itemsArgs<ExtArgs>
    _count?: boolean | CotizacionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CotizacionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }

  export type $CotizacionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Cotizacion"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
      items: Prisma.$CotizacionItemPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenant_id: string
      cliente_nombre: string
      vencimiento: Date
      estado: string
      total_mensual: Prisma.Decimal
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["cotizacion"]>
    composites: {}
  }

  type CotizacionGetPayload<S extends boolean | null | undefined | CotizacionDefaultArgs> = $Result.GetResult<Prisma.$CotizacionPayload, S>

  type CotizacionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CotizacionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CotizacionCountAggregateInputType | true
    }

  export interface CotizacionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Cotizacion'], meta: { name: 'Cotizacion' } }
    /**
     * Find zero or one Cotizacion that matches the filter.
     * @param {CotizacionFindUniqueArgs} args - Arguments to find a Cotizacion
     * @example
     * // Get one Cotizacion
     * const cotizacion = await prisma.cotizacion.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CotizacionFindUniqueArgs>(args: SelectSubset<T, CotizacionFindUniqueArgs<ExtArgs>>): Prisma__CotizacionClient<$Result.GetResult<Prisma.$CotizacionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Cotizacion that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CotizacionFindUniqueOrThrowArgs} args - Arguments to find a Cotizacion
     * @example
     * // Get one Cotizacion
     * const cotizacion = await prisma.cotizacion.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CotizacionFindUniqueOrThrowArgs>(args: SelectSubset<T, CotizacionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CotizacionClient<$Result.GetResult<Prisma.$CotizacionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Cotizacion that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CotizacionFindFirstArgs} args - Arguments to find a Cotizacion
     * @example
     * // Get one Cotizacion
     * const cotizacion = await prisma.cotizacion.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CotizacionFindFirstArgs>(args?: SelectSubset<T, CotizacionFindFirstArgs<ExtArgs>>): Prisma__CotizacionClient<$Result.GetResult<Prisma.$CotizacionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Cotizacion that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CotizacionFindFirstOrThrowArgs} args - Arguments to find a Cotizacion
     * @example
     * // Get one Cotizacion
     * const cotizacion = await prisma.cotizacion.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CotizacionFindFirstOrThrowArgs>(args?: SelectSubset<T, CotizacionFindFirstOrThrowArgs<ExtArgs>>): Prisma__CotizacionClient<$Result.GetResult<Prisma.$CotizacionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Cotizacions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CotizacionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Cotizacions
     * const cotizacions = await prisma.cotizacion.findMany()
     * 
     * // Get first 10 Cotizacions
     * const cotizacions = await prisma.cotizacion.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const cotizacionWithIdOnly = await prisma.cotizacion.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CotizacionFindManyArgs>(args?: SelectSubset<T, CotizacionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CotizacionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Cotizacion.
     * @param {CotizacionCreateArgs} args - Arguments to create a Cotizacion.
     * @example
     * // Create one Cotizacion
     * const Cotizacion = await prisma.cotizacion.create({
     *   data: {
     *     // ... data to create a Cotizacion
     *   }
     * })
     * 
     */
    create<T extends CotizacionCreateArgs>(args: SelectSubset<T, CotizacionCreateArgs<ExtArgs>>): Prisma__CotizacionClient<$Result.GetResult<Prisma.$CotizacionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Cotizacions.
     * @param {CotizacionCreateManyArgs} args - Arguments to create many Cotizacions.
     * @example
     * // Create many Cotizacions
     * const cotizacion = await prisma.cotizacion.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CotizacionCreateManyArgs>(args?: SelectSubset<T, CotizacionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Cotizacions and returns the data saved in the database.
     * @param {CotizacionCreateManyAndReturnArgs} args - Arguments to create many Cotizacions.
     * @example
     * // Create many Cotizacions
     * const cotizacion = await prisma.cotizacion.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Cotizacions and only return the `id`
     * const cotizacionWithIdOnly = await prisma.cotizacion.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CotizacionCreateManyAndReturnArgs>(args?: SelectSubset<T, CotizacionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CotizacionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Cotizacion.
     * @param {CotizacionDeleteArgs} args - Arguments to delete one Cotizacion.
     * @example
     * // Delete one Cotizacion
     * const Cotizacion = await prisma.cotizacion.delete({
     *   where: {
     *     // ... filter to delete one Cotizacion
     *   }
     * })
     * 
     */
    delete<T extends CotizacionDeleteArgs>(args: SelectSubset<T, CotizacionDeleteArgs<ExtArgs>>): Prisma__CotizacionClient<$Result.GetResult<Prisma.$CotizacionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Cotizacion.
     * @param {CotizacionUpdateArgs} args - Arguments to update one Cotizacion.
     * @example
     * // Update one Cotizacion
     * const cotizacion = await prisma.cotizacion.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CotizacionUpdateArgs>(args: SelectSubset<T, CotizacionUpdateArgs<ExtArgs>>): Prisma__CotizacionClient<$Result.GetResult<Prisma.$CotizacionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Cotizacions.
     * @param {CotizacionDeleteManyArgs} args - Arguments to filter Cotizacions to delete.
     * @example
     * // Delete a few Cotizacions
     * const { count } = await prisma.cotizacion.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CotizacionDeleteManyArgs>(args?: SelectSubset<T, CotizacionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Cotizacions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CotizacionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Cotizacions
     * const cotizacion = await prisma.cotizacion.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CotizacionUpdateManyArgs>(args: SelectSubset<T, CotizacionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Cotizacion.
     * @param {CotizacionUpsertArgs} args - Arguments to update or create a Cotizacion.
     * @example
     * // Update or create a Cotizacion
     * const cotizacion = await prisma.cotizacion.upsert({
     *   create: {
     *     // ... data to create a Cotizacion
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Cotizacion we want to update
     *   }
     * })
     */
    upsert<T extends CotizacionUpsertArgs>(args: SelectSubset<T, CotizacionUpsertArgs<ExtArgs>>): Prisma__CotizacionClient<$Result.GetResult<Prisma.$CotizacionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Cotizacions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CotizacionCountArgs} args - Arguments to filter Cotizacions to count.
     * @example
     * // Count the number of Cotizacions
     * const count = await prisma.cotizacion.count({
     *   where: {
     *     // ... the filter for the Cotizacions we want to count
     *   }
     * })
    **/
    count<T extends CotizacionCountArgs>(
      args?: Subset<T, CotizacionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CotizacionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Cotizacion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CotizacionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CotizacionAggregateArgs>(args: Subset<T, CotizacionAggregateArgs>): Prisma.PrismaPromise<GetCotizacionAggregateType<T>>

    /**
     * Group by Cotizacion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CotizacionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CotizacionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CotizacionGroupByArgs['orderBy'] }
        : { orderBy?: CotizacionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CotizacionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCotizacionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Cotizacion model
   */
  readonly fields: CotizacionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Cotizacion.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CotizacionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    items<T extends Cotizacion$itemsArgs<ExtArgs> = {}>(args?: Subset<T, Cotizacion$itemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CotizacionItemPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Cotizacion model
   */ 
  interface CotizacionFieldRefs {
    readonly id: FieldRef<"Cotizacion", 'String'>
    readonly tenant_id: FieldRef<"Cotizacion", 'String'>
    readonly cliente_nombre: FieldRef<"Cotizacion", 'String'>
    readonly vencimiento: FieldRef<"Cotizacion", 'DateTime'>
    readonly estado: FieldRef<"Cotizacion", 'String'>
    readonly total_mensual: FieldRef<"Cotizacion", 'Decimal'>
    readonly created_at: FieldRef<"Cotizacion", 'DateTime'>
    readonly updated_at: FieldRef<"Cotizacion", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Cotizacion findUnique
   */
  export type CotizacionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cotizacion
     */
    select?: CotizacionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CotizacionInclude<ExtArgs> | null
    /**
     * Filter, which Cotizacion to fetch.
     */
    where: CotizacionWhereUniqueInput
  }

  /**
   * Cotizacion findUniqueOrThrow
   */
  export type CotizacionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cotizacion
     */
    select?: CotizacionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CotizacionInclude<ExtArgs> | null
    /**
     * Filter, which Cotizacion to fetch.
     */
    where: CotizacionWhereUniqueInput
  }

  /**
   * Cotizacion findFirst
   */
  export type CotizacionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cotizacion
     */
    select?: CotizacionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CotizacionInclude<ExtArgs> | null
    /**
     * Filter, which Cotizacion to fetch.
     */
    where?: CotizacionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cotizacions to fetch.
     */
    orderBy?: CotizacionOrderByWithRelationInput | CotizacionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Cotizacions.
     */
    cursor?: CotizacionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cotizacions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cotizacions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Cotizacions.
     */
    distinct?: CotizacionScalarFieldEnum | CotizacionScalarFieldEnum[]
  }

  /**
   * Cotizacion findFirstOrThrow
   */
  export type CotizacionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cotizacion
     */
    select?: CotizacionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CotizacionInclude<ExtArgs> | null
    /**
     * Filter, which Cotizacion to fetch.
     */
    where?: CotizacionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cotizacions to fetch.
     */
    orderBy?: CotizacionOrderByWithRelationInput | CotizacionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Cotizacions.
     */
    cursor?: CotizacionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cotizacions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cotizacions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Cotizacions.
     */
    distinct?: CotizacionScalarFieldEnum | CotizacionScalarFieldEnum[]
  }

  /**
   * Cotizacion findMany
   */
  export type CotizacionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cotizacion
     */
    select?: CotizacionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CotizacionInclude<ExtArgs> | null
    /**
     * Filter, which Cotizacions to fetch.
     */
    where?: CotizacionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cotizacions to fetch.
     */
    orderBy?: CotizacionOrderByWithRelationInput | CotizacionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Cotizacions.
     */
    cursor?: CotizacionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cotizacions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cotizacions.
     */
    skip?: number
    distinct?: CotizacionScalarFieldEnum | CotizacionScalarFieldEnum[]
  }

  /**
   * Cotizacion create
   */
  export type CotizacionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cotizacion
     */
    select?: CotizacionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CotizacionInclude<ExtArgs> | null
    /**
     * The data needed to create a Cotizacion.
     */
    data: XOR<CotizacionCreateInput, CotizacionUncheckedCreateInput>
  }

  /**
   * Cotizacion createMany
   */
  export type CotizacionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Cotizacions.
     */
    data: CotizacionCreateManyInput | CotizacionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Cotizacion createManyAndReturn
   */
  export type CotizacionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cotizacion
     */
    select?: CotizacionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Cotizacions.
     */
    data: CotizacionCreateManyInput | CotizacionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CotizacionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Cotizacion update
   */
  export type CotizacionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cotizacion
     */
    select?: CotizacionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CotizacionInclude<ExtArgs> | null
    /**
     * The data needed to update a Cotizacion.
     */
    data: XOR<CotizacionUpdateInput, CotizacionUncheckedUpdateInput>
    /**
     * Choose, which Cotizacion to update.
     */
    where: CotizacionWhereUniqueInput
  }

  /**
   * Cotizacion updateMany
   */
  export type CotizacionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Cotizacions.
     */
    data: XOR<CotizacionUpdateManyMutationInput, CotizacionUncheckedUpdateManyInput>
    /**
     * Filter which Cotizacions to update
     */
    where?: CotizacionWhereInput
  }

  /**
   * Cotizacion upsert
   */
  export type CotizacionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cotizacion
     */
    select?: CotizacionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CotizacionInclude<ExtArgs> | null
    /**
     * The filter to search for the Cotizacion to update in case it exists.
     */
    where: CotizacionWhereUniqueInput
    /**
     * In case the Cotizacion found by the `where` argument doesn't exist, create a new Cotizacion with this data.
     */
    create: XOR<CotizacionCreateInput, CotizacionUncheckedCreateInput>
    /**
     * In case the Cotizacion was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CotizacionUpdateInput, CotizacionUncheckedUpdateInput>
  }

  /**
   * Cotizacion delete
   */
  export type CotizacionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cotizacion
     */
    select?: CotizacionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CotizacionInclude<ExtArgs> | null
    /**
     * Filter which Cotizacion to delete.
     */
    where: CotizacionWhereUniqueInput
  }

  /**
   * Cotizacion deleteMany
   */
  export type CotizacionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Cotizacions to delete
     */
    where?: CotizacionWhereInput
  }

  /**
   * Cotizacion.items
   */
  export type Cotizacion$itemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CotizacionItem
     */
    select?: CotizacionItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CotizacionItemInclude<ExtArgs> | null
    where?: CotizacionItemWhereInput
    orderBy?: CotizacionItemOrderByWithRelationInput | CotizacionItemOrderByWithRelationInput[]
    cursor?: CotizacionItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CotizacionItemScalarFieldEnum | CotizacionItemScalarFieldEnum[]
  }

  /**
   * Cotizacion without action
   */
  export type CotizacionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cotizacion
     */
    select?: CotizacionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CotizacionInclude<ExtArgs> | null
  }


  /**
   * Model CotizacionItem
   */

  export type AggregateCotizacionItem = {
    _count: CotizacionItemCountAggregateOutputType | null
    _avg: CotizacionItemAvgAggregateOutputType | null
    _sum: CotizacionItemSumAggregateOutputType | null
    _min: CotizacionItemMinAggregateOutputType | null
    _max: CotizacionItemMaxAggregateOutputType | null
  }

  export type CotizacionItemAvgAggregateOutputType = {
    horas_mensuales: number | null
    costo_hora: Decimal | null
    margen: Decimal | null
    subtotal: Decimal | null
  }

  export type CotizacionItemSumAggregateOutputType = {
    horas_mensuales: number | null
    costo_hora: Decimal | null
    margen: Decimal | null
    subtotal: Decimal | null
  }

  export type CotizacionItemMinAggregateOutputType = {
    id: string | null
    cotizacion_id: string | null
    puesto_nombre: string | null
    horas_mensuales: number | null
    costo_hora: Decimal | null
    margen: Decimal | null
    subtotal: Decimal | null
  }

  export type CotizacionItemMaxAggregateOutputType = {
    id: string | null
    cotizacion_id: string | null
    puesto_nombre: string | null
    horas_mensuales: number | null
    costo_hora: Decimal | null
    margen: Decimal | null
    subtotal: Decimal | null
  }

  export type CotizacionItemCountAggregateOutputType = {
    id: number
    cotizacion_id: number
    puesto_nombre: number
    horas_mensuales: number
    costo_hora: number
    margen: number
    subtotal: number
    _all: number
  }


  export type CotizacionItemAvgAggregateInputType = {
    horas_mensuales?: true
    costo_hora?: true
    margen?: true
    subtotal?: true
  }

  export type CotizacionItemSumAggregateInputType = {
    horas_mensuales?: true
    costo_hora?: true
    margen?: true
    subtotal?: true
  }

  export type CotizacionItemMinAggregateInputType = {
    id?: true
    cotizacion_id?: true
    puesto_nombre?: true
    horas_mensuales?: true
    costo_hora?: true
    margen?: true
    subtotal?: true
  }

  export type CotizacionItemMaxAggregateInputType = {
    id?: true
    cotizacion_id?: true
    puesto_nombre?: true
    horas_mensuales?: true
    costo_hora?: true
    margen?: true
    subtotal?: true
  }

  export type CotizacionItemCountAggregateInputType = {
    id?: true
    cotizacion_id?: true
    puesto_nombre?: true
    horas_mensuales?: true
    costo_hora?: true
    margen?: true
    subtotal?: true
    _all?: true
  }

  export type CotizacionItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CotizacionItem to aggregate.
     */
    where?: CotizacionItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CotizacionItems to fetch.
     */
    orderBy?: CotizacionItemOrderByWithRelationInput | CotizacionItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CotizacionItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CotizacionItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CotizacionItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CotizacionItems
    **/
    _count?: true | CotizacionItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CotizacionItemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CotizacionItemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CotizacionItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CotizacionItemMaxAggregateInputType
  }

  export type GetCotizacionItemAggregateType<T extends CotizacionItemAggregateArgs> = {
        [P in keyof T & keyof AggregateCotizacionItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCotizacionItem[P]>
      : GetScalarType<T[P], AggregateCotizacionItem[P]>
  }




  export type CotizacionItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CotizacionItemWhereInput
    orderBy?: CotizacionItemOrderByWithAggregationInput | CotizacionItemOrderByWithAggregationInput[]
    by: CotizacionItemScalarFieldEnum[] | CotizacionItemScalarFieldEnum
    having?: CotizacionItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CotizacionItemCountAggregateInputType | true
    _avg?: CotizacionItemAvgAggregateInputType
    _sum?: CotizacionItemSumAggregateInputType
    _min?: CotizacionItemMinAggregateInputType
    _max?: CotizacionItemMaxAggregateInputType
  }

  export type CotizacionItemGroupByOutputType = {
    id: string
    cotizacion_id: string
    puesto_nombre: string
    horas_mensuales: number
    costo_hora: Decimal
    margen: Decimal
    subtotal: Decimal
    _count: CotizacionItemCountAggregateOutputType | null
    _avg: CotizacionItemAvgAggregateOutputType | null
    _sum: CotizacionItemSumAggregateOutputType | null
    _min: CotizacionItemMinAggregateOutputType | null
    _max: CotizacionItemMaxAggregateOutputType | null
  }

  type GetCotizacionItemGroupByPayload<T extends CotizacionItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CotizacionItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CotizacionItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CotizacionItemGroupByOutputType[P]>
            : GetScalarType<T[P], CotizacionItemGroupByOutputType[P]>
        }
      >
    >


  export type CotizacionItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cotizacion_id?: boolean
    puesto_nombre?: boolean
    horas_mensuales?: boolean
    costo_hora?: boolean
    margen?: boolean
    subtotal?: boolean
    cotizacion?: boolean | CotizacionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["cotizacionItem"]>

  export type CotizacionItemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cotizacion_id?: boolean
    puesto_nombre?: boolean
    horas_mensuales?: boolean
    costo_hora?: boolean
    margen?: boolean
    subtotal?: boolean
    cotizacion?: boolean | CotizacionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["cotizacionItem"]>

  export type CotizacionItemSelectScalar = {
    id?: boolean
    cotizacion_id?: boolean
    puesto_nombre?: boolean
    horas_mensuales?: boolean
    costo_hora?: boolean
    margen?: boolean
    subtotal?: boolean
  }

  export type CotizacionItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cotizacion?: boolean | CotizacionDefaultArgs<ExtArgs>
  }
  export type CotizacionItemIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cotizacion?: boolean | CotizacionDefaultArgs<ExtArgs>
  }

  export type $CotizacionItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CotizacionItem"
    objects: {
      cotizacion: Prisma.$CotizacionPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      cotizacion_id: string
      puesto_nombre: string
      horas_mensuales: number
      costo_hora: Prisma.Decimal
      margen: Prisma.Decimal
      subtotal: Prisma.Decimal
    }, ExtArgs["result"]["cotizacionItem"]>
    composites: {}
  }

  type CotizacionItemGetPayload<S extends boolean | null | undefined | CotizacionItemDefaultArgs> = $Result.GetResult<Prisma.$CotizacionItemPayload, S>

  type CotizacionItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CotizacionItemFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CotizacionItemCountAggregateInputType | true
    }

  export interface CotizacionItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CotizacionItem'], meta: { name: 'CotizacionItem' } }
    /**
     * Find zero or one CotizacionItem that matches the filter.
     * @param {CotizacionItemFindUniqueArgs} args - Arguments to find a CotizacionItem
     * @example
     * // Get one CotizacionItem
     * const cotizacionItem = await prisma.cotizacionItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CotizacionItemFindUniqueArgs>(args: SelectSubset<T, CotizacionItemFindUniqueArgs<ExtArgs>>): Prisma__CotizacionItemClient<$Result.GetResult<Prisma.$CotizacionItemPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one CotizacionItem that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CotizacionItemFindUniqueOrThrowArgs} args - Arguments to find a CotizacionItem
     * @example
     * // Get one CotizacionItem
     * const cotizacionItem = await prisma.cotizacionItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CotizacionItemFindUniqueOrThrowArgs>(args: SelectSubset<T, CotizacionItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CotizacionItemClient<$Result.GetResult<Prisma.$CotizacionItemPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first CotizacionItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CotizacionItemFindFirstArgs} args - Arguments to find a CotizacionItem
     * @example
     * // Get one CotizacionItem
     * const cotizacionItem = await prisma.cotizacionItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CotizacionItemFindFirstArgs>(args?: SelectSubset<T, CotizacionItemFindFirstArgs<ExtArgs>>): Prisma__CotizacionItemClient<$Result.GetResult<Prisma.$CotizacionItemPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first CotizacionItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CotizacionItemFindFirstOrThrowArgs} args - Arguments to find a CotizacionItem
     * @example
     * // Get one CotizacionItem
     * const cotizacionItem = await prisma.cotizacionItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CotizacionItemFindFirstOrThrowArgs>(args?: SelectSubset<T, CotizacionItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__CotizacionItemClient<$Result.GetResult<Prisma.$CotizacionItemPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more CotizacionItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CotizacionItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CotizacionItems
     * const cotizacionItems = await prisma.cotizacionItem.findMany()
     * 
     * // Get first 10 CotizacionItems
     * const cotizacionItems = await prisma.cotizacionItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const cotizacionItemWithIdOnly = await prisma.cotizacionItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CotizacionItemFindManyArgs>(args?: SelectSubset<T, CotizacionItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CotizacionItemPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a CotizacionItem.
     * @param {CotizacionItemCreateArgs} args - Arguments to create a CotizacionItem.
     * @example
     * // Create one CotizacionItem
     * const CotizacionItem = await prisma.cotizacionItem.create({
     *   data: {
     *     // ... data to create a CotizacionItem
     *   }
     * })
     * 
     */
    create<T extends CotizacionItemCreateArgs>(args: SelectSubset<T, CotizacionItemCreateArgs<ExtArgs>>): Prisma__CotizacionItemClient<$Result.GetResult<Prisma.$CotizacionItemPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many CotizacionItems.
     * @param {CotizacionItemCreateManyArgs} args - Arguments to create many CotizacionItems.
     * @example
     * // Create many CotizacionItems
     * const cotizacionItem = await prisma.cotizacionItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CotizacionItemCreateManyArgs>(args?: SelectSubset<T, CotizacionItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CotizacionItems and returns the data saved in the database.
     * @param {CotizacionItemCreateManyAndReturnArgs} args - Arguments to create many CotizacionItems.
     * @example
     * // Create many CotizacionItems
     * const cotizacionItem = await prisma.cotizacionItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CotizacionItems and only return the `id`
     * const cotizacionItemWithIdOnly = await prisma.cotizacionItem.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CotizacionItemCreateManyAndReturnArgs>(args?: SelectSubset<T, CotizacionItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CotizacionItemPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a CotizacionItem.
     * @param {CotizacionItemDeleteArgs} args - Arguments to delete one CotizacionItem.
     * @example
     * // Delete one CotizacionItem
     * const CotizacionItem = await prisma.cotizacionItem.delete({
     *   where: {
     *     // ... filter to delete one CotizacionItem
     *   }
     * })
     * 
     */
    delete<T extends CotizacionItemDeleteArgs>(args: SelectSubset<T, CotizacionItemDeleteArgs<ExtArgs>>): Prisma__CotizacionItemClient<$Result.GetResult<Prisma.$CotizacionItemPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one CotizacionItem.
     * @param {CotizacionItemUpdateArgs} args - Arguments to update one CotizacionItem.
     * @example
     * // Update one CotizacionItem
     * const cotizacionItem = await prisma.cotizacionItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CotizacionItemUpdateArgs>(args: SelectSubset<T, CotizacionItemUpdateArgs<ExtArgs>>): Prisma__CotizacionItemClient<$Result.GetResult<Prisma.$CotizacionItemPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more CotizacionItems.
     * @param {CotizacionItemDeleteManyArgs} args - Arguments to filter CotizacionItems to delete.
     * @example
     * // Delete a few CotizacionItems
     * const { count } = await prisma.cotizacionItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CotizacionItemDeleteManyArgs>(args?: SelectSubset<T, CotizacionItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CotizacionItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CotizacionItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CotizacionItems
     * const cotizacionItem = await prisma.cotizacionItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CotizacionItemUpdateManyArgs>(args: SelectSubset<T, CotizacionItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one CotizacionItem.
     * @param {CotizacionItemUpsertArgs} args - Arguments to update or create a CotizacionItem.
     * @example
     * // Update or create a CotizacionItem
     * const cotizacionItem = await prisma.cotizacionItem.upsert({
     *   create: {
     *     // ... data to create a CotizacionItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CotizacionItem we want to update
     *   }
     * })
     */
    upsert<T extends CotizacionItemUpsertArgs>(args: SelectSubset<T, CotizacionItemUpsertArgs<ExtArgs>>): Prisma__CotizacionItemClient<$Result.GetResult<Prisma.$CotizacionItemPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of CotizacionItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CotizacionItemCountArgs} args - Arguments to filter CotizacionItems to count.
     * @example
     * // Count the number of CotizacionItems
     * const count = await prisma.cotizacionItem.count({
     *   where: {
     *     // ... the filter for the CotizacionItems we want to count
     *   }
     * })
    **/
    count<T extends CotizacionItemCountArgs>(
      args?: Subset<T, CotizacionItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CotizacionItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CotizacionItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CotizacionItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CotizacionItemAggregateArgs>(args: Subset<T, CotizacionItemAggregateArgs>): Prisma.PrismaPromise<GetCotizacionItemAggregateType<T>>

    /**
     * Group by CotizacionItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CotizacionItemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CotizacionItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CotizacionItemGroupByArgs['orderBy'] }
        : { orderBy?: CotizacionItemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CotizacionItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCotizacionItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CotizacionItem model
   */
  readonly fields: CotizacionItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CotizacionItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CotizacionItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    cotizacion<T extends CotizacionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CotizacionDefaultArgs<ExtArgs>>): Prisma__CotizacionClient<$Result.GetResult<Prisma.$CotizacionPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CotizacionItem model
   */ 
  interface CotizacionItemFieldRefs {
    readonly id: FieldRef<"CotizacionItem", 'String'>
    readonly cotizacion_id: FieldRef<"CotizacionItem", 'String'>
    readonly puesto_nombre: FieldRef<"CotizacionItem", 'String'>
    readonly horas_mensuales: FieldRef<"CotizacionItem", 'Int'>
    readonly costo_hora: FieldRef<"CotizacionItem", 'Decimal'>
    readonly margen: FieldRef<"CotizacionItem", 'Decimal'>
    readonly subtotal: FieldRef<"CotizacionItem", 'Decimal'>
  }
    

  // Custom InputTypes
  /**
   * CotizacionItem findUnique
   */
  export type CotizacionItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CotizacionItem
     */
    select?: CotizacionItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CotizacionItemInclude<ExtArgs> | null
    /**
     * Filter, which CotizacionItem to fetch.
     */
    where: CotizacionItemWhereUniqueInput
  }

  /**
   * CotizacionItem findUniqueOrThrow
   */
  export type CotizacionItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CotizacionItem
     */
    select?: CotizacionItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CotizacionItemInclude<ExtArgs> | null
    /**
     * Filter, which CotizacionItem to fetch.
     */
    where: CotizacionItemWhereUniqueInput
  }

  /**
   * CotizacionItem findFirst
   */
  export type CotizacionItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CotizacionItem
     */
    select?: CotizacionItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CotizacionItemInclude<ExtArgs> | null
    /**
     * Filter, which CotizacionItem to fetch.
     */
    where?: CotizacionItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CotizacionItems to fetch.
     */
    orderBy?: CotizacionItemOrderByWithRelationInput | CotizacionItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CotizacionItems.
     */
    cursor?: CotizacionItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CotizacionItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CotizacionItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CotizacionItems.
     */
    distinct?: CotizacionItemScalarFieldEnum | CotizacionItemScalarFieldEnum[]
  }

  /**
   * CotizacionItem findFirstOrThrow
   */
  export type CotizacionItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CotizacionItem
     */
    select?: CotizacionItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CotizacionItemInclude<ExtArgs> | null
    /**
     * Filter, which CotizacionItem to fetch.
     */
    where?: CotizacionItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CotizacionItems to fetch.
     */
    orderBy?: CotizacionItemOrderByWithRelationInput | CotizacionItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CotizacionItems.
     */
    cursor?: CotizacionItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CotizacionItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CotizacionItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CotizacionItems.
     */
    distinct?: CotizacionItemScalarFieldEnum | CotizacionItemScalarFieldEnum[]
  }

  /**
   * CotizacionItem findMany
   */
  export type CotizacionItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CotizacionItem
     */
    select?: CotizacionItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CotizacionItemInclude<ExtArgs> | null
    /**
     * Filter, which CotizacionItems to fetch.
     */
    where?: CotizacionItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CotizacionItems to fetch.
     */
    orderBy?: CotizacionItemOrderByWithRelationInput | CotizacionItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CotizacionItems.
     */
    cursor?: CotizacionItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CotizacionItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CotizacionItems.
     */
    skip?: number
    distinct?: CotizacionItemScalarFieldEnum | CotizacionItemScalarFieldEnum[]
  }

  /**
   * CotizacionItem create
   */
  export type CotizacionItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CotizacionItem
     */
    select?: CotizacionItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CotizacionItemInclude<ExtArgs> | null
    /**
     * The data needed to create a CotizacionItem.
     */
    data: XOR<CotizacionItemCreateInput, CotizacionItemUncheckedCreateInput>
  }

  /**
   * CotizacionItem createMany
   */
  export type CotizacionItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CotizacionItems.
     */
    data: CotizacionItemCreateManyInput | CotizacionItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CotizacionItem createManyAndReturn
   */
  export type CotizacionItemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CotizacionItem
     */
    select?: CotizacionItemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many CotizacionItems.
     */
    data: CotizacionItemCreateManyInput | CotizacionItemCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CotizacionItemIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CotizacionItem update
   */
  export type CotizacionItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CotizacionItem
     */
    select?: CotizacionItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CotizacionItemInclude<ExtArgs> | null
    /**
     * The data needed to update a CotizacionItem.
     */
    data: XOR<CotizacionItemUpdateInput, CotizacionItemUncheckedUpdateInput>
    /**
     * Choose, which CotizacionItem to update.
     */
    where: CotizacionItemWhereUniqueInput
  }

  /**
   * CotizacionItem updateMany
   */
  export type CotizacionItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CotizacionItems.
     */
    data: XOR<CotizacionItemUpdateManyMutationInput, CotizacionItemUncheckedUpdateManyInput>
    /**
     * Filter which CotizacionItems to update
     */
    where?: CotizacionItemWhereInput
  }

  /**
   * CotizacionItem upsert
   */
  export type CotizacionItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CotizacionItem
     */
    select?: CotizacionItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CotizacionItemInclude<ExtArgs> | null
    /**
     * The filter to search for the CotizacionItem to update in case it exists.
     */
    where: CotizacionItemWhereUniqueInput
    /**
     * In case the CotizacionItem found by the `where` argument doesn't exist, create a new CotizacionItem with this data.
     */
    create: XOR<CotizacionItemCreateInput, CotizacionItemUncheckedCreateInput>
    /**
     * In case the CotizacionItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CotizacionItemUpdateInput, CotizacionItemUncheckedUpdateInput>
  }

  /**
   * CotizacionItem delete
   */
  export type CotizacionItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CotizacionItem
     */
    select?: CotizacionItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CotizacionItemInclude<ExtArgs> | null
    /**
     * Filter which CotizacionItem to delete.
     */
    where: CotizacionItemWhereUniqueInput
  }

  /**
   * CotizacionItem deleteMany
   */
  export type CotizacionItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CotizacionItems to delete
     */
    where?: CotizacionItemWhereInput
  }

  /**
   * CotizacionItem without action
   */
  export type CotizacionItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CotizacionItem
     */
    select?: CotizacionItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CotizacionItemInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const TenantScalarFieldEnum: {
    id: 'id',
    nombre: 'nombre',
    factor_cobertura: 'factor_cobertura',
    margen_objetivo: 'margen_objetivo',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type TenantScalarFieldEnum = (typeof TenantScalarFieldEnum)[keyof typeof TenantScalarFieldEnum]


  export const UserScalarFieldEnum: {
    id: 'id',
    tenant_id: 'tenant_id',
    email: 'email',
    password: 'password',
    role: 'role',
    created_at: 'created_at',
    updated_at: 'updated_at',
    deleted_at: 'deleted_at'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const VigiladorScalarFieldEnum: {
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

  export type VigiladorScalarFieldEnum = (typeof VigiladorScalarFieldEnum)[keyof typeof VigiladorScalarFieldEnum]


  export const CredencialScalarFieldEnum: {
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

  export type CredencialScalarFieldEnum = (typeof CredencialScalarFieldEnum)[keyof typeof CredencialScalarFieldEnum]


  export const ObjetivoScalarFieldEnum: {
    id: 'id',
    tenant_id: 'tenant_id',
    cliente_id: 'cliente_id',
    codigo: 'codigo',
    nombre: 'nombre',
    direccion: 'direccion',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type ObjetivoScalarFieldEnum = (typeof ObjetivoScalarFieldEnum)[keyof typeof ObjetivoScalarFieldEnum]


  export const PuestoScalarFieldEnum: {
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

  export type PuestoScalarFieldEnum = (typeof PuestoScalarFieldEnum)[keyof typeof PuestoScalarFieldEnum]


  export const AsignacionScalarFieldEnum: {
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

  export type AsignacionScalarFieldEnum = (typeof AsignacionScalarFieldEnum)[keyof typeof AsignacionScalarFieldEnum]


  export const AsistenciaScalarFieldEnum: {
    id: 'id',
    tenant_id: 'tenant_id',
    asignacion_id: 'asignacion_id',
    inicio_real: 'inicio_real',
    fin_real: 'fin_real',
    metodo: 'metodo',
    lat: 'lat',
    lng: 'lng'
  };

  export type AsistenciaScalarFieldEnum = (typeof AsistenciaScalarFieldEnum)[keyof typeof AsistenciaScalarFieldEnum]


  export const FeriadoScalarFieldEnum: {
    id: 'id',
    tenant_id: 'tenant_id',
    nombre: 'nombre',
    fecha: 'fecha',
    created_at: 'created_at'
  };

  export type FeriadoScalarFieldEnum = (typeof FeriadoScalarFieldEnum)[keyof typeof FeriadoScalarFieldEnum]


  export const ConfiguracionCostosScalarFieldEnum: {
    id: 'id',
    tenant_id: 'tenant_id',
    costo_hora_base: 'costo_hora_base',
    cargas_sociales: 'cargas_sociales',
    costos_uniforme: 'costos_uniforme',
    otros_costos: 'otros_costos',
    factor_ajuste: 'factor_ajuste',
    updated_at: 'updated_at'
  };

  export type ConfiguracionCostosScalarFieldEnum = (typeof ConfiguracionCostosScalarFieldEnum)[keyof typeof ConfiguracionCostosScalarFieldEnum]


  export const CotizacionScalarFieldEnum: {
    id: 'id',
    tenant_id: 'tenant_id',
    cliente_nombre: 'cliente_nombre',
    vencimiento: 'vencimiento',
    estado: 'estado',
    total_mensual: 'total_mensual',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type CotizacionScalarFieldEnum = (typeof CotizacionScalarFieldEnum)[keyof typeof CotizacionScalarFieldEnum]


  export const CotizacionItemScalarFieldEnum: {
    id: 'id',
    cotizacion_id: 'cotizacion_id',
    puesto_nombre: 'puesto_nombre',
    horas_mensuales: 'horas_mensuales',
    costo_hora: 'costo_hora',
    margen: 'margen',
    subtotal: 'subtotal'
  };

  export type CotizacionItemScalarFieldEnum = (typeof CotizacionItemScalarFieldEnum)[keyof typeof CotizacionItemScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type TenantWhereInput = {
    AND?: TenantWhereInput | TenantWhereInput[]
    OR?: TenantWhereInput[]
    NOT?: TenantWhereInput | TenantWhereInput[]
    id?: UuidFilter<"Tenant"> | string
    nombre?: StringFilter<"Tenant"> | string
    factor_cobertura?: DecimalFilter<"Tenant"> | Decimal | DecimalJsLike | number | string
    margen_objetivo?: DecimalFilter<"Tenant"> | Decimal | DecimalJsLike | number | string
    created_at?: DateTimeFilter<"Tenant"> | Date | string
    updated_at?: DateTimeFilter<"Tenant"> | Date | string
    users?: UserListRelationFilter
    vigiladores?: VigiladorListRelationFilter
    credenciales?: CredencialListRelationFilter
    objetivos?: ObjetivoListRelationFilter
    puestos?: PuestoListRelationFilter
    asignaciones?: AsignacionListRelationFilter
    asistencias?: AsistenciaListRelationFilter
    feriados?: FeriadoListRelationFilter
    configuracion_costos?: XOR<ConfiguracionCostosNullableRelationFilter, ConfiguracionCostosWhereInput> | null
    cotizaciones?: CotizacionListRelationFilter
  }

  export type TenantOrderByWithRelationInput = {
    id?: SortOrder
    nombre?: SortOrder
    factor_cobertura?: SortOrder
    margen_objetivo?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    users?: UserOrderByRelationAggregateInput
    vigiladores?: VigiladorOrderByRelationAggregateInput
    credenciales?: CredencialOrderByRelationAggregateInput
    objetivos?: ObjetivoOrderByRelationAggregateInput
    puestos?: PuestoOrderByRelationAggregateInput
    asignaciones?: AsignacionOrderByRelationAggregateInput
    asistencias?: AsistenciaOrderByRelationAggregateInput
    feriados?: FeriadoOrderByRelationAggregateInput
    configuracion_costos?: ConfiguracionCostosOrderByWithRelationInput
    cotizaciones?: CotizacionOrderByRelationAggregateInput
  }

  export type TenantWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TenantWhereInput | TenantWhereInput[]
    OR?: TenantWhereInput[]
    NOT?: TenantWhereInput | TenantWhereInput[]
    nombre?: StringFilter<"Tenant"> | string
    factor_cobertura?: DecimalFilter<"Tenant"> | Decimal | DecimalJsLike | number | string
    margen_objetivo?: DecimalFilter<"Tenant"> | Decimal | DecimalJsLike | number | string
    created_at?: DateTimeFilter<"Tenant"> | Date | string
    updated_at?: DateTimeFilter<"Tenant"> | Date | string
    users?: UserListRelationFilter
    vigiladores?: VigiladorListRelationFilter
    credenciales?: CredencialListRelationFilter
    objetivos?: ObjetivoListRelationFilter
    puestos?: PuestoListRelationFilter
    asignaciones?: AsignacionListRelationFilter
    asistencias?: AsistenciaListRelationFilter
    feriados?: FeriadoListRelationFilter
    configuracion_costos?: XOR<ConfiguracionCostosNullableRelationFilter, ConfiguracionCostosWhereInput> | null
    cotizaciones?: CotizacionListRelationFilter
  }, "id">

  export type TenantOrderByWithAggregationInput = {
    id?: SortOrder
    nombre?: SortOrder
    factor_cobertura?: SortOrder
    margen_objetivo?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: TenantCountOrderByAggregateInput
    _avg?: TenantAvgOrderByAggregateInput
    _max?: TenantMaxOrderByAggregateInput
    _min?: TenantMinOrderByAggregateInput
    _sum?: TenantSumOrderByAggregateInput
  }

  export type TenantScalarWhereWithAggregatesInput = {
    AND?: TenantScalarWhereWithAggregatesInput | TenantScalarWhereWithAggregatesInput[]
    OR?: TenantScalarWhereWithAggregatesInput[]
    NOT?: TenantScalarWhereWithAggregatesInput | TenantScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Tenant"> | string
    nombre?: StringWithAggregatesFilter<"Tenant"> | string
    factor_cobertura?: DecimalWithAggregatesFilter<"Tenant"> | Decimal | DecimalJsLike | number | string
    margen_objetivo?: DecimalWithAggregatesFilter<"Tenant"> | Decimal | DecimalJsLike | number | string
    created_at?: DateTimeWithAggregatesFilter<"Tenant"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Tenant"> | Date | string
  }

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: UuidFilter<"User"> | string
    tenant_id?: UuidFilter<"User"> | string
    email?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    role?: StringFilter<"User"> | string
    created_at?: DateTimeFilter<"User"> | Date | string
    updated_at?: DateTimeFilter<"User"> | Date | string
    deleted_at?: DateTimeNullableFilter<"User"> | Date | string | null
    tenant?: XOR<TenantRelationFilter, TenantWhereInput>
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    tenant_id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    deleted_at?: SortOrderInput | SortOrder
    tenant?: TenantOrderByWithRelationInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    tenant_id?: UuidFilter<"User"> | string
    password?: StringFilter<"User"> | string
    role?: StringFilter<"User"> | string
    created_at?: DateTimeFilter<"User"> | Date | string
    updated_at?: DateTimeFilter<"User"> | Date | string
    deleted_at?: DateTimeNullableFilter<"User"> | Date | string | null
    tenant?: XOR<TenantRelationFilter, TenantWhereInput>
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    tenant_id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    deleted_at?: SortOrderInput | SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"User"> | string
    tenant_id?: UuidWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    role?: StringWithAggregatesFilter<"User"> | string
    created_at?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"User"> | Date | string
    deleted_at?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
  }

  export type VigiladorWhereInput = {
    AND?: VigiladorWhereInput | VigiladorWhereInput[]
    OR?: VigiladorWhereInput[]
    NOT?: VigiladorWhereInput | VigiladorWhereInput[]
    id?: UuidFilter<"Vigilador"> | string
    tenant_id?: UuidFilter<"Vigilador"> | string
    legajo_nro?: StringFilter<"Vigilador"> | string
    nombre?: StringFilter<"Vigilador"> | string
    apellido?: StringFilter<"Vigilador"> | string
    documento?: StringFilter<"Vigilador"> | string
    estado?: StringFilter<"Vigilador"> | string
    created_at?: DateTimeFilter<"Vigilador"> | Date | string
    updated_at?: DateTimeFilter<"Vigilador"> | Date | string
    deleted_at?: DateTimeNullableFilter<"Vigilador"> | Date | string | null
    tenant?: XOR<TenantRelationFilter, TenantWhereInput>
    credenciales?: CredencialListRelationFilter
    asignaciones?: AsignacionListRelationFilter
  }

  export type VigiladorOrderByWithRelationInput = {
    id?: SortOrder
    tenant_id?: SortOrder
    legajo_nro?: SortOrder
    nombre?: SortOrder
    apellido?: SortOrder
    documento?: SortOrder
    estado?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    deleted_at?: SortOrderInput | SortOrder
    tenant?: TenantOrderByWithRelationInput
    credenciales?: CredencialOrderByRelationAggregateInput
    asignaciones?: AsignacionOrderByRelationAggregateInput
  }

  export type VigiladorWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    tenant_id_legajo_nro?: VigiladorTenant_idLegajo_nroCompoundUniqueInput
    AND?: VigiladorWhereInput | VigiladorWhereInput[]
    OR?: VigiladorWhereInput[]
    NOT?: VigiladorWhereInput | VigiladorWhereInput[]
    tenant_id?: UuidFilter<"Vigilador"> | string
    legajo_nro?: StringFilter<"Vigilador"> | string
    nombre?: StringFilter<"Vigilador"> | string
    apellido?: StringFilter<"Vigilador"> | string
    documento?: StringFilter<"Vigilador"> | string
    estado?: StringFilter<"Vigilador"> | string
    created_at?: DateTimeFilter<"Vigilador"> | Date | string
    updated_at?: DateTimeFilter<"Vigilador"> | Date | string
    deleted_at?: DateTimeNullableFilter<"Vigilador"> | Date | string | null
    tenant?: XOR<TenantRelationFilter, TenantWhereInput>
    credenciales?: CredencialListRelationFilter
    asignaciones?: AsignacionListRelationFilter
  }, "id" | "tenant_id_legajo_nro">

  export type VigiladorOrderByWithAggregationInput = {
    id?: SortOrder
    tenant_id?: SortOrder
    legajo_nro?: SortOrder
    nombre?: SortOrder
    apellido?: SortOrder
    documento?: SortOrder
    estado?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    deleted_at?: SortOrderInput | SortOrder
    _count?: VigiladorCountOrderByAggregateInput
    _max?: VigiladorMaxOrderByAggregateInput
    _min?: VigiladorMinOrderByAggregateInput
  }

  export type VigiladorScalarWhereWithAggregatesInput = {
    AND?: VigiladorScalarWhereWithAggregatesInput | VigiladorScalarWhereWithAggregatesInput[]
    OR?: VigiladorScalarWhereWithAggregatesInput[]
    NOT?: VigiladorScalarWhereWithAggregatesInput | VigiladorScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Vigilador"> | string
    tenant_id?: UuidWithAggregatesFilter<"Vigilador"> | string
    legajo_nro?: StringWithAggregatesFilter<"Vigilador"> | string
    nombre?: StringWithAggregatesFilter<"Vigilador"> | string
    apellido?: StringWithAggregatesFilter<"Vigilador"> | string
    documento?: StringWithAggregatesFilter<"Vigilador"> | string
    estado?: StringWithAggregatesFilter<"Vigilador"> | string
    created_at?: DateTimeWithAggregatesFilter<"Vigilador"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Vigilador"> | Date | string
    deleted_at?: DateTimeNullableWithAggregatesFilter<"Vigilador"> | Date | string | null
  }

  export type CredencialWhereInput = {
    AND?: CredencialWhereInput | CredencialWhereInput[]
    OR?: CredencialWhereInput[]
    NOT?: CredencialWhereInput | CredencialWhereInput[]
    id?: UuidFilter<"Credencial"> | string
    tenant_id?: UuidFilter<"Credencial"> | string
    vigilador_id?: UuidFilter<"Credencial"> | string
    tipo?: StringFilter<"Credencial"> | string
    numero?: StringNullableFilter<"Credencial"> | string | null
    organismo?: StringNullableFilter<"Credencial"> | string | null
    emitida_el?: DateTimeNullableFilter<"Credencial"> | Date | string | null
    vence_el?: DateTimeNullableFilter<"Credencial"> | Date | string | null
    created_at?: DateTimeFilter<"Credencial"> | Date | string
    tenant?: XOR<TenantRelationFilter, TenantWhereInput>
    vigilador?: XOR<VigiladorRelationFilter, VigiladorWhereInput>
  }

  export type CredencialOrderByWithRelationInput = {
    id?: SortOrder
    tenant_id?: SortOrder
    vigilador_id?: SortOrder
    tipo?: SortOrder
    numero?: SortOrderInput | SortOrder
    organismo?: SortOrderInput | SortOrder
    emitida_el?: SortOrderInput | SortOrder
    vence_el?: SortOrderInput | SortOrder
    created_at?: SortOrder
    tenant?: TenantOrderByWithRelationInput
    vigilador?: VigiladorOrderByWithRelationInput
  }

  export type CredencialWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CredencialWhereInput | CredencialWhereInput[]
    OR?: CredencialWhereInput[]
    NOT?: CredencialWhereInput | CredencialWhereInput[]
    tenant_id?: UuidFilter<"Credencial"> | string
    vigilador_id?: UuidFilter<"Credencial"> | string
    tipo?: StringFilter<"Credencial"> | string
    numero?: StringNullableFilter<"Credencial"> | string | null
    organismo?: StringNullableFilter<"Credencial"> | string | null
    emitida_el?: DateTimeNullableFilter<"Credencial"> | Date | string | null
    vence_el?: DateTimeNullableFilter<"Credencial"> | Date | string | null
    created_at?: DateTimeFilter<"Credencial"> | Date | string
    tenant?: XOR<TenantRelationFilter, TenantWhereInput>
    vigilador?: XOR<VigiladorRelationFilter, VigiladorWhereInput>
  }, "id">

  export type CredencialOrderByWithAggregationInput = {
    id?: SortOrder
    tenant_id?: SortOrder
    vigilador_id?: SortOrder
    tipo?: SortOrder
    numero?: SortOrderInput | SortOrder
    organismo?: SortOrderInput | SortOrder
    emitida_el?: SortOrderInput | SortOrder
    vence_el?: SortOrderInput | SortOrder
    created_at?: SortOrder
    _count?: CredencialCountOrderByAggregateInput
    _max?: CredencialMaxOrderByAggregateInput
    _min?: CredencialMinOrderByAggregateInput
  }

  export type CredencialScalarWhereWithAggregatesInput = {
    AND?: CredencialScalarWhereWithAggregatesInput | CredencialScalarWhereWithAggregatesInput[]
    OR?: CredencialScalarWhereWithAggregatesInput[]
    NOT?: CredencialScalarWhereWithAggregatesInput | CredencialScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Credencial"> | string
    tenant_id?: UuidWithAggregatesFilter<"Credencial"> | string
    vigilador_id?: UuidWithAggregatesFilter<"Credencial"> | string
    tipo?: StringWithAggregatesFilter<"Credencial"> | string
    numero?: StringNullableWithAggregatesFilter<"Credencial"> | string | null
    organismo?: StringNullableWithAggregatesFilter<"Credencial"> | string | null
    emitida_el?: DateTimeNullableWithAggregatesFilter<"Credencial"> | Date | string | null
    vence_el?: DateTimeNullableWithAggregatesFilter<"Credencial"> | Date | string | null
    created_at?: DateTimeWithAggregatesFilter<"Credencial"> | Date | string
  }

  export type ObjetivoWhereInput = {
    AND?: ObjetivoWhereInput | ObjetivoWhereInput[]
    OR?: ObjetivoWhereInput[]
    NOT?: ObjetivoWhereInput | ObjetivoWhereInput[]
    id?: UuidFilter<"Objetivo"> | string
    tenant_id?: UuidFilter<"Objetivo"> | string
    cliente_id?: UuidFilter<"Objetivo"> | string
    codigo?: StringFilter<"Objetivo"> | string
    nombre?: StringFilter<"Objetivo"> | string
    direccion?: StringNullableFilter<"Objetivo"> | string | null
    created_at?: DateTimeFilter<"Objetivo"> | Date | string
    updated_at?: DateTimeFilter<"Objetivo"> | Date | string
    tenant?: XOR<TenantRelationFilter, TenantWhereInput>
    puestos?: PuestoListRelationFilter
  }

  export type ObjetivoOrderByWithRelationInput = {
    id?: SortOrder
    tenant_id?: SortOrder
    cliente_id?: SortOrder
    codigo?: SortOrder
    nombre?: SortOrder
    direccion?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    tenant?: TenantOrderByWithRelationInput
    puestos?: PuestoOrderByRelationAggregateInput
  }

  export type ObjetivoWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    tenant_id_codigo?: ObjetivoTenant_idCodigoCompoundUniqueInput
    AND?: ObjetivoWhereInput | ObjetivoWhereInput[]
    OR?: ObjetivoWhereInput[]
    NOT?: ObjetivoWhereInput | ObjetivoWhereInput[]
    tenant_id?: UuidFilter<"Objetivo"> | string
    cliente_id?: UuidFilter<"Objetivo"> | string
    codigo?: StringFilter<"Objetivo"> | string
    nombre?: StringFilter<"Objetivo"> | string
    direccion?: StringNullableFilter<"Objetivo"> | string | null
    created_at?: DateTimeFilter<"Objetivo"> | Date | string
    updated_at?: DateTimeFilter<"Objetivo"> | Date | string
    tenant?: XOR<TenantRelationFilter, TenantWhereInput>
    puestos?: PuestoListRelationFilter
  }, "id" | "tenant_id_codigo">

  export type ObjetivoOrderByWithAggregationInput = {
    id?: SortOrder
    tenant_id?: SortOrder
    cliente_id?: SortOrder
    codigo?: SortOrder
    nombre?: SortOrder
    direccion?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: ObjetivoCountOrderByAggregateInput
    _max?: ObjetivoMaxOrderByAggregateInput
    _min?: ObjetivoMinOrderByAggregateInput
  }

  export type ObjetivoScalarWhereWithAggregatesInput = {
    AND?: ObjetivoScalarWhereWithAggregatesInput | ObjetivoScalarWhereWithAggregatesInput[]
    OR?: ObjetivoScalarWhereWithAggregatesInput[]
    NOT?: ObjetivoScalarWhereWithAggregatesInput | ObjetivoScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Objetivo"> | string
    tenant_id?: UuidWithAggregatesFilter<"Objetivo"> | string
    cliente_id?: UuidWithAggregatesFilter<"Objetivo"> | string
    codigo?: StringWithAggregatesFilter<"Objetivo"> | string
    nombre?: StringWithAggregatesFilter<"Objetivo"> | string
    direccion?: StringNullableWithAggregatesFilter<"Objetivo"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"Objetivo"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Objetivo"> | Date | string
  }

  export type PuestoWhereInput = {
    AND?: PuestoWhereInput | PuestoWhereInput[]
    OR?: PuestoWhereInput[]
    NOT?: PuestoWhereInput | PuestoWhereInput[]
    id?: UuidFilter<"Puesto"> | string
    tenant_id?: UuidFilter<"Puesto"> | string
    objetivo_id?: UuidNullableFilter<"Puesto"> | string | null
    nombre?: StringFilter<"Puesto"> | string
    ubicacion?: StringNullableFilter<"Puesto"> | string | null
    requiere_arma?: BoolFilter<"Puesto"> | boolean
    requiere_movil?: BoolFilter<"Puesto"> | boolean
    esquema_horario?: JsonNullableFilter<"Puesto">
    created_at?: DateTimeFilter<"Puesto"> | Date | string
    updated_at?: DateTimeFilter<"Puesto"> | Date | string
    tenant?: XOR<TenantRelationFilter, TenantWhereInput>
    objetivo?: XOR<ObjetivoNullableRelationFilter, ObjetivoWhereInput> | null
    asignaciones?: AsignacionListRelationFilter
  }

  export type PuestoOrderByWithRelationInput = {
    id?: SortOrder
    tenant_id?: SortOrder
    objetivo_id?: SortOrderInput | SortOrder
    nombre?: SortOrder
    ubicacion?: SortOrderInput | SortOrder
    requiere_arma?: SortOrder
    requiere_movil?: SortOrder
    esquema_horario?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    tenant?: TenantOrderByWithRelationInput
    objetivo?: ObjetivoOrderByWithRelationInput
    asignaciones?: AsignacionOrderByRelationAggregateInput
  }

  export type PuestoWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PuestoWhereInput | PuestoWhereInput[]
    OR?: PuestoWhereInput[]
    NOT?: PuestoWhereInput | PuestoWhereInput[]
    tenant_id?: UuidFilter<"Puesto"> | string
    objetivo_id?: UuidNullableFilter<"Puesto"> | string | null
    nombre?: StringFilter<"Puesto"> | string
    ubicacion?: StringNullableFilter<"Puesto"> | string | null
    requiere_arma?: BoolFilter<"Puesto"> | boolean
    requiere_movil?: BoolFilter<"Puesto"> | boolean
    esquema_horario?: JsonNullableFilter<"Puesto">
    created_at?: DateTimeFilter<"Puesto"> | Date | string
    updated_at?: DateTimeFilter<"Puesto"> | Date | string
    tenant?: XOR<TenantRelationFilter, TenantWhereInput>
    objetivo?: XOR<ObjetivoNullableRelationFilter, ObjetivoWhereInput> | null
    asignaciones?: AsignacionListRelationFilter
  }, "id">

  export type PuestoOrderByWithAggregationInput = {
    id?: SortOrder
    tenant_id?: SortOrder
    objetivo_id?: SortOrderInput | SortOrder
    nombre?: SortOrder
    ubicacion?: SortOrderInput | SortOrder
    requiere_arma?: SortOrder
    requiere_movil?: SortOrder
    esquema_horario?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: PuestoCountOrderByAggregateInput
    _max?: PuestoMaxOrderByAggregateInput
    _min?: PuestoMinOrderByAggregateInput
  }

  export type PuestoScalarWhereWithAggregatesInput = {
    AND?: PuestoScalarWhereWithAggregatesInput | PuestoScalarWhereWithAggregatesInput[]
    OR?: PuestoScalarWhereWithAggregatesInput[]
    NOT?: PuestoScalarWhereWithAggregatesInput | PuestoScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Puesto"> | string
    tenant_id?: UuidWithAggregatesFilter<"Puesto"> | string
    objetivo_id?: UuidNullableWithAggregatesFilter<"Puesto"> | string | null
    nombre?: StringWithAggregatesFilter<"Puesto"> | string
    ubicacion?: StringNullableWithAggregatesFilter<"Puesto"> | string | null
    requiere_arma?: BoolWithAggregatesFilter<"Puesto"> | boolean
    requiere_movil?: BoolWithAggregatesFilter<"Puesto"> | boolean
    esquema_horario?: JsonNullableWithAggregatesFilter<"Puesto">
    created_at?: DateTimeWithAggregatesFilter<"Puesto"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Puesto"> | Date | string
  }

  export type AsignacionWhereInput = {
    AND?: AsignacionWhereInput | AsignacionWhereInput[]
    OR?: AsignacionWhereInput[]
    NOT?: AsignacionWhereInput | AsignacionWhereInput[]
    id?: UuidFilter<"Asignacion"> | string
    tenant_id?: UuidFilter<"Asignacion"> | string
    puesto_id?: UuidFilter<"Asignacion"> | string
    vigilador_id?: UuidNullableFilter<"Asignacion"> | string | null
    fecha?: DateTimeFilter<"Asignacion"> | Date | string
    hora_inicio?: StringFilter<"Asignacion"> | string
    hora_fin?: StringFilter<"Asignacion"> | string
    estado?: StringFilter<"Asignacion"> | string
    created_at?: DateTimeFilter<"Asignacion"> | Date | string
    tenant?: XOR<TenantRelationFilter, TenantWhereInput>
    puesto?: XOR<PuestoRelationFilter, PuestoWhereInput>
    vigilador?: XOR<VigiladorNullableRelationFilter, VigiladorWhereInput> | null
    asistencia?: XOR<AsistenciaNullableRelationFilter, AsistenciaWhereInput> | null
  }

  export type AsignacionOrderByWithRelationInput = {
    id?: SortOrder
    tenant_id?: SortOrder
    puesto_id?: SortOrder
    vigilador_id?: SortOrderInput | SortOrder
    fecha?: SortOrder
    hora_inicio?: SortOrder
    hora_fin?: SortOrder
    estado?: SortOrder
    created_at?: SortOrder
    tenant?: TenantOrderByWithRelationInput
    puesto?: PuestoOrderByWithRelationInput
    vigilador?: VigiladorOrderByWithRelationInput
    asistencia?: AsistenciaOrderByWithRelationInput
  }

  export type AsignacionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    puesto_id_fecha_hora_inicio?: AsignacionPuesto_id_fecha_hora_inicioCompoundUniqueInput
    AND?: AsignacionWhereInput | AsignacionWhereInput[]
    OR?: AsignacionWhereInput[]
    NOT?: AsignacionWhereInput | AsignacionWhereInput[]
    tenant_id?: UuidFilter<"Asignacion"> | string
    puesto_id?: UuidFilter<"Asignacion"> | string
    vigilador_id?: UuidNullableFilter<"Asignacion"> | string | null
    fecha?: DateTimeFilter<"Asignacion"> | Date | string
    hora_inicio?: StringFilter<"Asignacion"> | string
    hora_fin?: StringFilter<"Asignacion"> | string
    estado?: StringFilter<"Asignacion"> | string
    created_at?: DateTimeFilter<"Asignacion"> | Date | string
    tenant?: XOR<TenantRelationFilter, TenantWhereInput>
    puesto?: XOR<PuestoRelationFilter, PuestoWhereInput>
    vigilador?: XOR<VigiladorNullableRelationFilter, VigiladorWhereInput> | null
    asistencia?: XOR<AsistenciaNullableRelationFilter, AsistenciaWhereInput> | null
  }, "id" | "puesto_id_fecha_hora_inicio">

  export type AsignacionOrderByWithAggregationInput = {
    id?: SortOrder
    tenant_id?: SortOrder
    puesto_id?: SortOrder
    vigilador_id?: SortOrderInput | SortOrder
    fecha?: SortOrder
    hora_inicio?: SortOrder
    hora_fin?: SortOrder
    estado?: SortOrder
    created_at?: SortOrder
    _count?: AsignacionCountOrderByAggregateInput
    _max?: AsignacionMaxOrderByAggregateInput
    _min?: AsignacionMinOrderByAggregateInput
  }

  export type AsignacionScalarWhereWithAggregatesInput = {
    AND?: AsignacionScalarWhereWithAggregatesInput | AsignacionScalarWhereWithAggregatesInput[]
    OR?: AsignacionScalarWhereWithAggregatesInput[]
    NOT?: AsignacionScalarWhereWithAggregatesInput | AsignacionScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Asignacion"> | string
    tenant_id?: UuidWithAggregatesFilter<"Asignacion"> | string
    puesto_id?: UuidWithAggregatesFilter<"Asignacion"> | string
    vigilador_id?: UuidNullableWithAggregatesFilter<"Asignacion"> | string | null
    fecha?: DateTimeWithAggregatesFilter<"Asignacion"> | Date | string
    hora_inicio?: StringWithAggregatesFilter<"Asignacion"> | string
    hora_fin?: StringWithAggregatesFilter<"Asignacion"> | string
    estado?: StringWithAggregatesFilter<"Asignacion"> | string
    created_at?: DateTimeWithAggregatesFilter<"Asignacion"> | Date | string
  }

  export type AsistenciaWhereInput = {
    AND?: AsistenciaWhereInput | AsistenciaWhereInput[]
    OR?: AsistenciaWhereInput[]
    NOT?: AsistenciaWhereInput | AsistenciaWhereInput[]
    id?: UuidFilter<"Asistencia"> | string
    tenant_id?: UuidFilter<"Asistencia"> | string
    asignacion_id?: UuidFilter<"Asistencia"> | string
    inicio_real?: DateTimeNullableFilter<"Asistencia"> | Date | string | null
    fin_real?: DateTimeNullableFilter<"Asistencia"> | Date | string | null
    metodo?: StringNullableFilter<"Asistencia"> | string | null
    lat?: DecimalNullableFilter<"Asistencia"> | Decimal | DecimalJsLike | number | string | null
    lng?: DecimalNullableFilter<"Asistencia"> | Decimal | DecimalJsLike | number | string | null
    tenant?: XOR<TenantRelationFilter, TenantWhereInput>
    asignacion?: XOR<AsignacionRelationFilter, AsignacionWhereInput>
  }

  export type AsistenciaOrderByWithRelationInput = {
    id?: SortOrder
    tenant_id?: SortOrder
    asignacion_id?: SortOrder
    inicio_real?: SortOrderInput | SortOrder
    fin_real?: SortOrderInput | SortOrder
    metodo?: SortOrderInput | SortOrder
    lat?: SortOrderInput | SortOrder
    lng?: SortOrderInput | SortOrder
    tenant?: TenantOrderByWithRelationInput
    asignacion?: AsignacionOrderByWithRelationInput
  }

  export type AsistenciaWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    asignacion_id?: string
    AND?: AsistenciaWhereInput | AsistenciaWhereInput[]
    OR?: AsistenciaWhereInput[]
    NOT?: AsistenciaWhereInput | AsistenciaWhereInput[]
    tenant_id?: UuidFilter<"Asistencia"> | string
    inicio_real?: DateTimeNullableFilter<"Asistencia"> | Date | string | null
    fin_real?: DateTimeNullableFilter<"Asistencia"> | Date | string | null
    metodo?: StringNullableFilter<"Asistencia"> | string | null
    lat?: DecimalNullableFilter<"Asistencia"> | Decimal | DecimalJsLike | number | string | null
    lng?: DecimalNullableFilter<"Asistencia"> | Decimal | DecimalJsLike | number | string | null
    tenant?: XOR<TenantRelationFilter, TenantWhereInput>
    asignacion?: XOR<AsignacionRelationFilter, AsignacionWhereInput>
  }, "id" | "asignacion_id">

  export type AsistenciaOrderByWithAggregationInput = {
    id?: SortOrder
    tenant_id?: SortOrder
    asignacion_id?: SortOrder
    inicio_real?: SortOrderInput | SortOrder
    fin_real?: SortOrderInput | SortOrder
    metodo?: SortOrderInput | SortOrder
    lat?: SortOrderInput | SortOrder
    lng?: SortOrderInput | SortOrder
    _count?: AsistenciaCountOrderByAggregateInput
    _avg?: AsistenciaAvgOrderByAggregateInput
    _max?: AsistenciaMaxOrderByAggregateInput
    _min?: AsistenciaMinOrderByAggregateInput
    _sum?: AsistenciaSumOrderByAggregateInput
  }

  export type AsistenciaScalarWhereWithAggregatesInput = {
    AND?: AsistenciaScalarWhereWithAggregatesInput | AsistenciaScalarWhereWithAggregatesInput[]
    OR?: AsistenciaScalarWhereWithAggregatesInput[]
    NOT?: AsistenciaScalarWhereWithAggregatesInput | AsistenciaScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Asistencia"> | string
    tenant_id?: UuidWithAggregatesFilter<"Asistencia"> | string
    asignacion_id?: UuidWithAggregatesFilter<"Asistencia"> | string
    inicio_real?: DateTimeNullableWithAggregatesFilter<"Asistencia"> | Date | string | null
    fin_real?: DateTimeNullableWithAggregatesFilter<"Asistencia"> | Date | string | null
    metodo?: StringNullableWithAggregatesFilter<"Asistencia"> | string | null
    lat?: DecimalNullableWithAggregatesFilter<"Asistencia"> | Decimal | DecimalJsLike | number | string | null
    lng?: DecimalNullableWithAggregatesFilter<"Asistencia"> | Decimal | DecimalJsLike | number | string | null
  }

  export type FeriadoWhereInput = {
    AND?: FeriadoWhereInput | FeriadoWhereInput[]
    OR?: FeriadoWhereInput[]
    NOT?: FeriadoWhereInput | FeriadoWhereInput[]
    id?: UuidFilter<"Feriado"> | string
    tenant_id?: UuidFilter<"Feriado"> | string
    nombre?: StringFilter<"Feriado"> | string
    fecha?: DateTimeFilter<"Feriado"> | Date | string
    created_at?: DateTimeFilter<"Feriado"> | Date | string
    tenant?: XOR<TenantRelationFilter, TenantWhereInput>
  }

  export type FeriadoOrderByWithRelationInput = {
    id?: SortOrder
    tenant_id?: SortOrder
    nombre?: SortOrder
    fecha?: SortOrder
    created_at?: SortOrder
    tenant?: TenantOrderByWithRelationInput
  }

  export type FeriadoWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: FeriadoWhereInput | FeriadoWhereInput[]
    OR?: FeriadoWhereInput[]
    NOT?: FeriadoWhereInput | FeriadoWhereInput[]
    tenant_id?: UuidFilter<"Feriado"> | string
    nombre?: StringFilter<"Feriado"> | string
    fecha?: DateTimeFilter<"Feriado"> | Date | string
    created_at?: DateTimeFilter<"Feriado"> | Date | string
    tenant?: XOR<TenantRelationFilter, TenantWhereInput>
  }, "id">

  export type FeriadoOrderByWithAggregationInput = {
    id?: SortOrder
    tenant_id?: SortOrder
    nombre?: SortOrder
    fecha?: SortOrder
    created_at?: SortOrder
    _count?: FeriadoCountOrderByAggregateInput
    _max?: FeriadoMaxOrderByAggregateInput
    _min?: FeriadoMinOrderByAggregateInput
  }

  export type FeriadoScalarWhereWithAggregatesInput = {
    AND?: FeriadoScalarWhereWithAggregatesInput | FeriadoScalarWhereWithAggregatesInput[]
    OR?: FeriadoScalarWhereWithAggregatesInput[]
    NOT?: FeriadoScalarWhereWithAggregatesInput | FeriadoScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Feriado"> | string
    tenant_id?: UuidWithAggregatesFilter<"Feriado"> | string
    nombre?: StringWithAggregatesFilter<"Feriado"> | string
    fecha?: DateTimeWithAggregatesFilter<"Feriado"> | Date | string
    created_at?: DateTimeWithAggregatesFilter<"Feriado"> | Date | string
  }

  export type ConfiguracionCostosWhereInput = {
    AND?: ConfiguracionCostosWhereInput | ConfiguracionCostosWhereInput[]
    OR?: ConfiguracionCostosWhereInput[]
    NOT?: ConfiguracionCostosWhereInput | ConfiguracionCostosWhereInput[]
    id?: UuidFilter<"ConfiguracionCostos"> | string
    tenant_id?: UuidFilter<"ConfiguracionCostos"> | string
    costo_hora_base?: DecimalFilter<"ConfiguracionCostos"> | Decimal | DecimalJsLike | number | string
    cargas_sociales?: DecimalFilter<"ConfiguracionCostos"> | Decimal | DecimalJsLike | number | string
    costos_uniforme?: DecimalFilter<"ConfiguracionCostos"> | Decimal | DecimalJsLike | number | string
    otros_costos?: DecimalFilter<"ConfiguracionCostos"> | Decimal | DecimalJsLike | number | string
    factor_ajuste?: DecimalFilter<"ConfiguracionCostos"> | Decimal | DecimalJsLike | number | string
    updated_at?: DateTimeFilter<"ConfiguracionCostos"> | Date | string
    tenant?: XOR<TenantRelationFilter, TenantWhereInput>
  }

  export type ConfiguracionCostosOrderByWithRelationInput = {
    id?: SortOrder
    tenant_id?: SortOrder
    costo_hora_base?: SortOrder
    cargas_sociales?: SortOrder
    costos_uniforme?: SortOrder
    otros_costos?: SortOrder
    factor_ajuste?: SortOrder
    updated_at?: SortOrder
    tenant?: TenantOrderByWithRelationInput
  }

  export type ConfiguracionCostosWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    tenant_id?: string
    AND?: ConfiguracionCostosWhereInput | ConfiguracionCostosWhereInput[]
    OR?: ConfiguracionCostosWhereInput[]
    NOT?: ConfiguracionCostosWhereInput | ConfiguracionCostosWhereInput[]
    costo_hora_base?: DecimalFilter<"ConfiguracionCostos"> | Decimal | DecimalJsLike | number | string
    cargas_sociales?: DecimalFilter<"ConfiguracionCostos"> | Decimal | DecimalJsLike | number | string
    costos_uniforme?: DecimalFilter<"ConfiguracionCostos"> | Decimal | DecimalJsLike | number | string
    otros_costos?: DecimalFilter<"ConfiguracionCostos"> | Decimal | DecimalJsLike | number | string
    factor_ajuste?: DecimalFilter<"ConfiguracionCostos"> | Decimal | DecimalJsLike | number | string
    updated_at?: DateTimeFilter<"ConfiguracionCostos"> | Date | string
    tenant?: XOR<TenantRelationFilter, TenantWhereInput>
  }, "id" | "tenant_id">

  export type ConfiguracionCostosOrderByWithAggregationInput = {
    id?: SortOrder
    tenant_id?: SortOrder
    costo_hora_base?: SortOrder
    cargas_sociales?: SortOrder
    costos_uniforme?: SortOrder
    otros_costos?: SortOrder
    factor_ajuste?: SortOrder
    updated_at?: SortOrder
    _count?: ConfiguracionCostosCountOrderByAggregateInput
    _avg?: ConfiguracionCostosAvgOrderByAggregateInput
    _max?: ConfiguracionCostosMaxOrderByAggregateInput
    _min?: ConfiguracionCostosMinOrderByAggregateInput
    _sum?: ConfiguracionCostosSumOrderByAggregateInput
  }

  export type ConfiguracionCostosScalarWhereWithAggregatesInput = {
    AND?: ConfiguracionCostosScalarWhereWithAggregatesInput | ConfiguracionCostosScalarWhereWithAggregatesInput[]
    OR?: ConfiguracionCostosScalarWhereWithAggregatesInput[]
    NOT?: ConfiguracionCostosScalarWhereWithAggregatesInput | ConfiguracionCostosScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"ConfiguracionCostos"> | string
    tenant_id?: UuidWithAggregatesFilter<"ConfiguracionCostos"> | string
    costo_hora_base?: DecimalWithAggregatesFilter<"ConfiguracionCostos"> | Decimal | DecimalJsLike | number | string
    cargas_sociales?: DecimalWithAggregatesFilter<"ConfiguracionCostos"> | Decimal | DecimalJsLike | number | string
    costos_uniforme?: DecimalWithAggregatesFilter<"ConfiguracionCostos"> | Decimal | DecimalJsLike | number | string
    otros_costos?: DecimalWithAggregatesFilter<"ConfiguracionCostos"> | Decimal | DecimalJsLike | number | string
    factor_ajuste?: DecimalWithAggregatesFilter<"ConfiguracionCostos"> | Decimal | DecimalJsLike | number | string
    updated_at?: DateTimeWithAggregatesFilter<"ConfiguracionCostos"> | Date | string
  }

  export type CotizacionWhereInput = {
    AND?: CotizacionWhereInput | CotizacionWhereInput[]
    OR?: CotizacionWhereInput[]
    NOT?: CotizacionWhereInput | CotizacionWhereInput[]
    id?: UuidFilter<"Cotizacion"> | string
    tenant_id?: UuidFilter<"Cotizacion"> | string
    cliente_nombre?: StringFilter<"Cotizacion"> | string
    vencimiento?: DateTimeFilter<"Cotizacion"> | Date | string
    estado?: StringFilter<"Cotizacion"> | string
    total_mensual?: DecimalFilter<"Cotizacion"> | Decimal | DecimalJsLike | number | string
    created_at?: DateTimeFilter<"Cotizacion"> | Date | string
    updated_at?: DateTimeFilter<"Cotizacion"> | Date | string
    tenant?: XOR<TenantRelationFilter, TenantWhereInput>
    items?: CotizacionItemListRelationFilter
  }

  export type CotizacionOrderByWithRelationInput = {
    id?: SortOrder
    tenant_id?: SortOrder
    cliente_nombre?: SortOrder
    vencimiento?: SortOrder
    estado?: SortOrder
    total_mensual?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    tenant?: TenantOrderByWithRelationInput
    items?: CotizacionItemOrderByRelationAggregateInput
  }

  export type CotizacionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CotizacionWhereInput | CotizacionWhereInput[]
    OR?: CotizacionWhereInput[]
    NOT?: CotizacionWhereInput | CotizacionWhereInput[]
    tenant_id?: UuidFilter<"Cotizacion"> | string
    cliente_nombre?: StringFilter<"Cotizacion"> | string
    vencimiento?: DateTimeFilter<"Cotizacion"> | Date | string
    estado?: StringFilter<"Cotizacion"> | string
    total_mensual?: DecimalFilter<"Cotizacion"> | Decimal | DecimalJsLike | number | string
    created_at?: DateTimeFilter<"Cotizacion"> | Date | string
    updated_at?: DateTimeFilter<"Cotizacion"> | Date | string
    tenant?: XOR<TenantRelationFilter, TenantWhereInput>
    items?: CotizacionItemListRelationFilter
  }, "id">

  export type CotizacionOrderByWithAggregationInput = {
    id?: SortOrder
    tenant_id?: SortOrder
    cliente_nombre?: SortOrder
    vencimiento?: SortOrder
    estado?: SortOrder
    total_mensual?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: CotizacionCountOrderByAggregateInput
    _avg?: CotizacionAvgOrderByAggregateInput
    _max?: CotizacionMaxOrderByAggregateInput
    _min?: CotizacionMinOrderByAggregateInput
    _sum?: CotizacionSumOrderByAggregateInput
  }

  export type CotizacionScalarWhereWithAggregatesInput = {
    AND?: CotizacionScalarWhereWithAggregatesInput | CotizacionScalarWhereWithAggregatesInput[]
    OR?: CotizacionScalarWhereWithAggregatesInput[]
    NOT?: CotizacionScalarWhereWithAggregatesInput | CotizacionScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Cotizacion"> | string
    tenant_id?: UuidWithAggregatesFilter<"Cotizacion"> | string
    cliente_nombre?: StringWithAggregatesFilter<"Cotizacion"> | string
    vencimiento?: DateTimeWithAggregatesFilter<"Cotizacion"> | Date | string
    estado?: StringWithAggregatesFilter<"Cotizacion"> | string
    total_mensual?: DecimalWithAggregatesFilter<"Cotizacion"> | Decimal | DecimalJsLike | number | string
    created_at?: DateTimeWithAggregatesFilter<"Cotizacion"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Cotizacion"> | Date | string
  }

  export type CotizacionItemWhereInput = {
    AND?: CotizacionItemWhereInput | CotizacionItemWhereInput[]
    OR?: CotizacionItemWhereInput[]
    NOT?: CotizacionItemWhereInput | CotizacionItemWhereInput[]
    id?: UuidFilter<"CotizacionItem"> | string
    cotizacion_id?: UuidFilter<"CotizacionItem"> | string
    puesto_nombre?: StringFilter<"CotizacionItem"> | string
    horas_mensuales?: IntFilter<"CotizacionItem"> | number
    costo_hora?: DecimalFilter<"CotizacionItem"> | Decimal | DecimalJsLike | number | string
    margen?: DecimalFilter<"CotizacionItem"> | Decimal | DecimalJsLike | number | string
    subtotal?: DecimalFilter<"CotizacionItem"> | Decimal | DecimalJsLike | number | string
    cotizacion?: XOR<CotizacionRelationFilter, CotizacionWhereInput>
  }

  export type CotizacionItemOrderByWithRelationInput = {
    id?: SortOrder
    cotizacion_id?: SortOrder
    puesto_nombre?: SortOrder
    horas_mensuales?: SortOrder
    costo_hora?: SortOrder
    margen?: SortOrder
    subtotal?: SortOrder
    cotizacion?: CotizacionOrderByWithRelationInput
  }

  export type CotizacionItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CotizacionItemWhereInput | CotizacionItemWhereInput[]
    OR?: CotizacionItemWhereInput[]
    NOT?: CotizacionItemWhereInput | CotizacionItemWhereInput[]
    cotizacion_id?: UuidFilter<"CotizacionItem"> | string
    puesto_nombre?: StringFilter<"CotizacionItem"> | string
    horas_mensuales?: IntFilter<"CotizacionItem"> | number
    costo_hora?: DecimalFilter<"CotizacionItem"> | Decimal | DecimalJsLike | number | string
    margen?: DecimalFilter<"CotizacionItem"> | Decimal | DecimalJsLike | number | string
    subtotal?: DecimalFilter<"CotizacionItem"> | Decimal | DecimalJsLike | number | string
    cotizacion?: XOR<CotizacionRelationFilter, CotizacionWhereInput>
  }, "id">

  export type CotizacionItemOrderByWithAggregationInput = {
    id?: SortOrder
    cotizacion_id?: SortOrder
    puesto_nombre?: SortOrder
    horas_mensuales?: SortOrder
    costo_hora?: SortOrder
    margen?: SortOrder
    subtotal?: SortOrder
    _count?: CotizacionItemCountOrderByAggregateInput
    _avg?: CotizacionItemAvgOrderByAggregateInput
    _max?: CotizacionItemMaxOrderByAggregateInput
    _min?: CotizacionItemMinOrderByAggregateInput
    _sum?: CotizacionItemSumOrderByAggregateInput
  }

  export type CotizacionItemScalarWhereWithAggregatesInput = {
    AND?: CotizacionItemScalarWhereWithAggregatesInput | CotizacionItemScalarWhereWithAggregatesInput[]
    OR?: CotizacionItemScalarWhereWithAggregatesInput[]
    NOT?: CotizacionItemScalarWhereWithAggregatesInput | CotizacionItemScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"CotizacionItem"> | string
    cotizacion_id?: UuidWithAggregatesFilter<"CotizacionItem"> | string
    puesto_nombre?: StringWithAggregatesFilter<"CotizacionItem"> | string
    horas_mensuales?: IntWithAggregatesFilter<"CotizacionItem"> | number
    costo_hora?: DecimalWithAggregatesFilter<"CotizacionItem"> | Decimal | DecimalJsLike | number | string
    margen?: DecimalWithAggregatesFilter<"CotizacionItem"> | Decimal | DecimalJsLike | number | string
    subtotal?: DecimalWithAggregatesFilter<"CotizacionItem"> | Decimal | DecimalJsLike | number | string
  }

  export type TenantCreateInput = {
    id?: string
    nombre: string
    factor_cobertura?: Decimal | DecimalJsLike | number | string
    margen_objetivo?: Decimal | DecimalJsLike | number | string
    created_at?: Date | string
    updated_at?: Date | string
    users?: UserCreateNestedManyWithoutTenantInput
    vigiladores?: VigiladorCreateNestedManyWithoutTenantInput
    credenciales?: CredencialCreateNestedManyWithoutTenantInput
    objetivos?: ObjetivoCreateNestedManyWithoutTenantInput
    puestos?: PuestoCreateNestedManyWithoutTenantInput
    asignaciones?: AsignacionCreateNestedManyWithoutTenantInput
    asistencias?: AsistenciaCreateNestedManyWithoutTenantInput
    feriados?: FeriadoCreateNestedManyWithoutTenantInput
    configuracion_costos?: ConfiguracionCostosCreateNestedOneWithoutTenantInput
    cotizaciones?: CotizacionCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateInput = {
    id?: string
    nombre: string
    factor_cobertura?: Decimal | DecimalJsLike | number | string
    margen_objetivo?: Decimal | DecimalJsLike | number | string
    created_at?: Date | string
    updated_at?: Date | string
    users?: UserUncheckedCreateNestedManyWithoutTenantInput
    vigiladores?: VigiladorUncheckedCreateNestedManyWithoutTenantInput
    credenciales?: CredencialUncheckedCreateNestedManyWithoutTenantInput
    objetivos?: ObjetivoUncheckedCreateNestedManyWithoutTenantInput
    puestos?: PuestoUncheckedCreateNestedManyWithoutTenantInput
    asignaciones?: AsignacionUncheckedCreateNestedManyWithoutTenantInput
    asistencias?: AsistenciaUncheckedCreateNestedManyWithoutTenantInput
    feriados?: FeriadoUncheckedCreateNestedManyWithoutTenantInput
    configuracion_costos?: ConfiguracionCostosUncheckedCreateNestedOneWithoutTenantInput
    cotizaciones?: CotizacionUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    factor_cobertura?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    margen_objetivo?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUpdateManyWithoutTenantNestedInput
    vigiladores?: VigiladorUpdateManyWithoutTenantNestedInput
    credenciales?: CredencialUpdateManyWithoutTenantNestedInput
    objetivos?: ObjetivoUpdateManyWithoutTenantNestedInput
    puestos?: PuestoUpdateManyWithoutTenantNestedInput
    asignaciones?: AsignacionUpdateManyWithoutTenantNestedInput
    asistencias?: AsistenciaUpdateManyWithoutTenantNestedInput
    feriados?: FeriadoUpdateManyWithoutTenantNestedInput
    configuracion_costos?: ConfiguracionCostosUpdateOneWithoutTenantNestedInput
    cotizaciones?: CotizacionUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    factor_cobertura?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    margen_objetivo?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUncheckedUpdateManyWithoutTenantNestedInput
    vigiladores?: VigiladorUncheckedUpdateManyWithoutTenantNestedInput
    credenciales?: CredencialUncheckedUpdateManyWithoutTenantNestedInput
    objetivos?: ObjetivoUncheckedUpdateManyWithoutTenantNestedInput
    puestos?: PuestoUncheckedUpdateManyWithoutTenantNestedInput
    asignaciones?: AsignacionUncheckedUpdateManyWithoutTenantNestedInput
    asistencias?: AsistenciaUncheckedUpdateManyWithoutTenantNestedInput
    feriados?: FeriadoUncheckedUpdateManyWithoutTenantNestedInput
    configuracion_costos?: ConfiguracionCostosUncheckedUpdateOneWithoutTenantNestedInput
    cotizaciones?: CotizacionUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type TenantCreateManyInput = {
    id?: string
    nombre: string
    factor_cobertura?: Decimal | DecimalJsLike | number | string
    margen_objetivo?: Decimal | DecimalJsLike | number | string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type TenantUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    factor_cobertura?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    margen_objetivo?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    factor_cobertura?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    margen_objetivo?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    password: string
    role?: string
    created_at?: Date | string
    updated_at?: Date | string
    deleted_at?: Date | string | null
    tenant: TenantCreateNestedOneWithoutUsersInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    tenant_id: string
    email: string
    password: string
    role?: string
    created_at?: Date | string
    updated_at?: Date | string
    deleted_at?: Date | string | null
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tenant?: TenantUpdateOneRequiredWithoutUsersNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenant_id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserCreateManyInput = {
    id?: string
    tenant_id: string
    email: string
    password: string
    role?: string
    created_at?: Date | string
    updated_at?: Date | string
    deleted_at?: Date | string | null
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenant_id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type VigiladorCreateInput = {
    id?: string
    legajo_nro: string
    nombre: string
    apellido: string
    documento: string
    estado?: string
    created_at?: Date | string
    updated_at?: Date | string
    deleted_at?: Date | string | null
    tenant: TenantCreateNestedOneWithoutVigiladoresInput
    credenciales?: CredencialCreateNestedManyWithoutVigiladorInput
    asignaciones?: AsignacionCreateNestedManyWithoutVigiladorInput
  }

  export type VigiladorUncheckedCreateInput = {
    id?: string
    tenant_id: string
    legajo_nro: string
    nombre: string
    apellido: string
    documento: string
    estado?: string
    created_at?: Date | string
    updated_at?: Date | string
    deleted_at?: Date | string | null
    credenciales?: CredencialUncheckedCreateNestedManyWithoutVigiladorInput
    asignaciones?: AsignacionUncheckedCreateNestedManyWithoutVigiladorInput
  }

  export type VigiladorUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    legajo_nro?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    apellido?: StringFieldUpdateOperationsInput | string
    documento?: StringFieldUpdateOperationsInput | string
    estado?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tenant?: TenantUpdateOneRequiredWithoutVigiladoresNestedInput
    credenciales?: CredencialUpdateManyWithoutVigiladorNestedInput
    asignaciones?: AsignacionUpdateManyWithoutVigiladorNestedInput
  }

  export type VigiladorUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenant_id?: StringFieldUpdateOperationsInput | string
    legajo_nro?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    apellido?: StringFieldUpdateOperationsInput | string
    documento?: StringFieldUpdateOperationsInput | string
    estado?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    credenciales?: CredencialUncheckedUpdateManyWithoutVigiladorNestedInput
    asignaciones?: AsignacionUncheckedUpdateManyWithoutVigiladorNestedInput
  }

  export type VigiladorCreateManyInput = {
    id?: string
    tenant_id: string
    legajo_nro: string
    nombre: string
    apellido: string
    documento: string
    estado?: string
    created_at?: Date | string
    updated_at?: Date | string
    deleted_at?: Date | string | null
  }

  export type VigiladorUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    legajo_nro?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    apellido?: StringFieldUpdateOperationsInput | string
    documento?: StringFieldUpdateOperationsInput | string
    estado?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type VigiladorUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenant_id?: StringFieldUpdateOperationsInput | string
    legajo_nro?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    apellido?: StringFieldUpdateOperationsInput | string
    documento?: StringFieldUpdateOperationsInput | string
    estado?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CredencialCreateInput = {
    id?: string
    tipo: string
    numero?: string | null
    organismo?: string | null
    emitida_el?: Date | string | null
    vence_el?: Date | string | null
    created_at?: Date | string
    tenant: TenantCreateNestedOneWithoutCredencialesInput
    vigilador: VigiladorCreateNestedOneWithoutCredencialesInput
  }

  export type CredencialUncheckedCreateInput = {
    id?: string
    tenant_id: string
    vigilador_id: string
    tipo: string
    numero?: string | null
    organismo?: string | null
    emitida_el?: Date | string | null
    vence_el?: Date | string | null
    created_at?: Date | string
  }

  export type CredencialUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    numero?: NullableStringFieldUpdateOperationsInput | string | null
    organismo?: NullableStringFieldUpdateOperationsInput | string | null
    emitida_el?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    vence_el?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutCredencialesNestedInput
    vigilador?: VigiladorUpdateOneRequiredWithoutCredencialesNestedInput
  }

  export type CredencialUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenant_id?: StringFieldUpdateOperationsInput | string
    vigilador_id?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    numero?: NullableStringFieldUpdateOperationsInput | string | null
    organismo?: NullableStringFieldUpdateOperationsInput | string | null
    emitida_el?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    vence_el?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CredencialCreateManyInput = {
    id?: string
    tenant_id: string
    vigilador_id: string
    tipo: string
    numero?: string | null
    organismo?: string | null
    emitida_el?: Date | string | null
    vence_el?: Date | string | null
    created_at?: Date | string
  }

  export type CredencialUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    numero?: NullableStringFieldUpdateOperationsInput | string | null
    organismo?: NullableStringFieldUpdateOperationsInput | string | null
    emitida_el?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    vence_el?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CredencialUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenant_id?: StringFieldUpdateOperationsInput | string
    vigilador_id?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    numero?: NullableStringFieldUpdateOperationsInput | string | null
    organismo?: NullableStringFieldUpdateOperationsInput | string | null
    emitida_el?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    vence_el?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ObjetivoCreateInput = {
    id?: string
    cliente_id: string
    codigo: string
    nombre: string
    direccion?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    tenant: TenantCreateNestedOneWithoutObjetivosInput
    puestos?: PuestoCreateNestedManyWithoutObjetivoInput
  }

  export type ObjetivoUncheckedCreateInput = {
    id?: string
    tenant_id: string
    cliente_id: string
    codigo: string
    nombre: string
    direccion?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    puestos?: PuestoUncheckedCreateNestedManyWithoutObjetivoInput
  }

  export type ObjetivoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    cliente_id?: StringFieldUpdateOperationsInput | string
    codigo?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    direccion?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutObjetivosNestedInput
    puestos?: PuestoUpdateManyWithoutObjetivoNestedInput
  }

  export type ObjetivoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenant_id?: StringFieldUpdateOperationsInput | string
    cliente_id?: StringFieldUpdateOperationsInput | string
    codigo?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    direccion?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    puestos?: PuestoUncheckedUpdateManyWithoutObjetivoNestedInput
  }

  export type ObjetivoCreateManyInput = {
    id?: string
    tenant_id: string
    cliente_id: string
    codigo: string
    nombre: string
    direccion?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ObjetivoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    cliente_id?: StringFieldUpdateOperationsInput | string
    codigo?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    direccion?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ObjetivoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenant_id?: StringFieldUpdateOperationsInput | string
    cliente_id?: StringFieldUpdateOperationsInput | string
    codigo?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    direccion?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PuestoCreateInput = {
    id?: string
    nombre: string
    ubicacion?: string | null
    requiere_arma?: boolean
    requiere_movil?: boolean
    esquema_horario?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string
    updated_at?: Date | string
    tenant: TenantCreateNestedOneWithoutPuestosInput
    objetivo?: ObjetivoCreateNestedOneWithoutPuestosInput
    asignaciones?: AsignacionCreateNestedManyWithoutPuestoInput
  }

  export type PuestoUncheckedCreateInput = {
    id?: string
    tenant_id: string
    objetivo_id?: string | null
    nombre: string
    ubicacion?: string | null
    requiere_arma?: boolean
    requiere_movil?: boolean
    esquema_horario?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string
    updated_at?: Date | string
    asignaciones?: AsignacionUncheckedCreateNestedManyWithoutPuestoInput
  }

  export type PuestoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    ubicacion?: NullableStringFieldUpdateOperationsInput | string | null
    requiere_arma?: BoolFieldUpdateOperationsInput | boolean
    requiere_movil?: BoolFieldUpdateOperationsInput | boolean
    esquema_horario?: NullableJsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutPuestosNestedInput
    objetivo?: ObjetivoUpdateOneWithoutPuestosNestedInput
    asignaciones?: AsignacionUpdateManyWithoutPuestoNestedInput
  }

  export type PuestoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenant_id?: StringFieldUpdateOperationsInput | string
    objetivo_id?: NullableStringFieldUpdateOperationsInput | string | null
    nombre?: StringFieldUpdateOperationsInput | string
    ubicacion?: NullableStringFieldUpdateOperationsInput | string | null
    requiere_arma?: BoolFieldUpdateOperationsInput | boolean
    requiere_movil?: BoolFieldUpdateOperationsInput | boolean
    esquema_horario?: NullableJsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    asignaciones?: AsignacionUncheckedUpdateManyWithoutPuestoNestedInput
  }

  export type PuestoCreateManyInput = {
    id?: string
    tenant_id: string
    objetivo_id?: string | null
    nombre: string
    ubicacion?: string | null
    requiere_arma?: boolean
    requiere_movil?: boolean
    esquema_horario?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type PuestoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    ubicacion?: NullableStringFieldUpdateOperationsInput | string | null
    requiere_arma?: BoolFieldUpdateOperationsInput | boolean
    requiere_movil?: BoolFieldUpdateOperationsInput | boolean
    esquema_horario?: NullableJsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PuestoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenant_id?: StringFieldUpdateOperationsInput | string
    objetivo_id?: NullableStringFieldUpdateOperationsInput | string | null
    nombre?: StringFieldUpdateOperationsInput | string
    ubicacion?: NullableStringFieldUpdateOperationsInput | string | null
    requiere_arma?: BoolFieldUpdateOperationsInput | boolean
    requiere_movil?: BoolFieldUpdateOperationsInput | boolean
    esquema_horario?: NullableJsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AsignacionCreateInput = {
    id?: string
    fecha: Date | string
    hora_inicio: string
    hora_fin: string
    estado?: string
    created_at?: Date | string
    tenant: TenantCreateNestedOneWithoutAsignacionesInput
    puesto: PuestoCreateNestedOneWithoutAsignacionesInput
    vigilador?: VigiladorCreateNestedOneWithoutAsignacionesInput
    asistencia?: AsistenciaCreateNestedOneWithoutAsignacionInput
  }

  export type AsignacionUncheckedCreateInput = {
    id?: string
    tenant_id: string
    puesto_id: string
    vigilador_id?: string | null
    fecha: Date | string
    hora_inicio: string
    hora_fin: string
    estado?: string
    created_at?: Date | string
    asistencia?: AsistenciaUncheckedCreateNestedOneWithoutAsignacionInput
  }

  export type AsignacionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    hora_inicio?: StringFieldUpdateOperationsInput | string
    hora_fin?: StringFieldUpdateOperationsInput | string
    estado?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutAsignacionesNestedInput
    puesto?: PuestoUpdateOneRequiredWithoutAsignacionesNestedInput
    vigilador?: VigiladorUpdateOneWithoutAsignacionesNestedInput
    asistencia?: AsistenciaUpdateOneWithoutAsignacionNestedInput
  }

  export type AsignacionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenant_id?: StringFieldUpdateOperationsInput | string
    puesto_id?: StringFieldUpdateOperationsInput | string
    vigilador_id?: NullableStringFieldUpdateOperationsInput | string | null
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    hora_inicio?: StringFieldUpdateOperationsInput | string
    hora_fin?: StringFieldUpdateOperationsInput | string
    estado?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    asistencia?: AsistenciaUncheckedUpdateOneWithoutAsignacionNestedInput
  }

  export type AsignacionCreateManyInput = {
    id?: string
    tenant_id: string
    puesto_id: string
    vigilador_id?: string | null
    fecha: Date | string
    hora_inicio: string
    hora_fin: string
    estado?: string
    created_at?: Date | string
  }

  export type AsignacionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    hora_inicio?: StringFieldUpdateOperationsInput | string
    hora_fin?: StringFieldUpdateOperationsInput | string
    estado?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AsignacionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenant_id?: StringFieldUpdateOperationsInput | string
    puesto_id?: StringFieldUpdateOperationsInput | string
    vigilador_id?: NullableStringFieldUpdateOperationsInput | string | null
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    hora_inicio?: StringFieldUpdateOperationsInput | string
    hora_fin?: StringFieldUpdateOperationsInput | string
    estado?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AsistenciaCreateInput = {
    id?: string
    inicio_real?: Date | string | null
    fin_real?: Date | string | null
    metodo?: string | null
    lat?: Decimal | DecimalJsLike | number | string | null
    lng?: Decimal | DecimalJsLike | number | string | null
    tenant: TenantCreateNestedOneWithoutAsistenciasInput
    asignacion: AsignacionCreateNestedOneWithoutAsistenciaInput
  }

  export type AsistenciaUncheckedCreateInput = {
    id?: string
    tenant_id: string
    asignacion_id: string
    inicio_real?: Date | string | null
    fin_real?: Date | string | null
    metodo?: string | null
    lat?: Decimal | DecimalJsLike | number | string | null
    lng?: Decimal | DecimalJsLike | number | string | null
  }

  export type AsistenciaUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    inicio_real?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fin_real?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metodo?: NullableStringFieldUpdateOperationsInput | string | null
    lat?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    lng?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    tenant?: TenantUpdateOneRequiredWithoutAsistenciasNestedInput
    asignacion?: AsignacionUpdateOneRequiredWithoutAsistenciaNestedInput
  }

  export type AsistenciaUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenant_id?: StringFieldUpdateOperationsInput | string
    asignacion_id?: StringFieldUpdateOperationsInput | string
    inicio_real?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fin_real?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metodo?: NullableStringFieldUpdateOperationsInput | string | null
    lat?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    lng?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
  }

  export type AsistenciaCreateManyInput = {
    id?: string
    tenant_id: string
    asignacion_id: string
    inicio_real?: Date | string | null
    fin_real?: Date | string | null
    metodo?: string | null
    lat?: Decimal | DecimalJsLike | number | string | null
    lng?: Decimal | DecimalJsLike | number | string | null
  }

  export type AsistenciaUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    inicio_real?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fin_real?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metodo?: NullableStringFieldUpdateOperationsInput | string | null
    lat?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    lng?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
  }

  export type AsistenciaUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenant_id?: StringFieldUpdateOperationsInput | string
    asignacion_id?: StringFieldUpdateOperationsInput | string
    inicio_real?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fin_real?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metodo?: NullableStringFieldUpdateOperationsInput | string | null
    lat?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    lng?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
  }

  export type FeriadoCreateInput = {
    id?: string
    nombre: string
    fecha: Date | string
    created_at?: Date | string
    tenant: TenantCreateNestedOneWithoutFeriadosInput
  }

  export type FeriadoUncheckedCreateInput = {
    id?: string
    tenant_id: string
    nombre: string
    fecha: Date | string
    created_at?: Date | string
  }

  export type FeriadoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutFeriadosNestedInput
  }

  export type FeriadoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenant_id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FeriadoCreateManyInput = {
    id?: string
    tenant_id: string
    nombre: string
    fecha: Date | string
    created_at?: Date | string
  }

  export type FeriadoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FeriadoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenant_id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConfiguracionCostosCreateInput = {
    id?: string
    costo_hora_base: Decimal | DecimalJsLike | number | string
    cargas_sociales: Decimal | DecimalJsLike | number | string
    costos_uniforme: Decimal | DecimalJsLike | number | string
    otros_costos: Decimal | DecimalJsLike | number | string
    factor_ajuste?: Decimal | DecimalJsLike | number | string
    updated_at?: Date | string
    tenant: TenantCreateNestedOneWithoutConfiguracion_costosInput
  }

  export type ConfiguracionCostosUncheckedCreateInput = {
    id?: string
    tenant_id: string
    costo_hora_base: Decimal | DecimalJsLike | number | string
    cargas_sociales: Decimal | DecimalJsLike | number | string
    costos_uniforme: Decimal | DecimalJsLike | number | string
    otros_costos: Decimal | DecimalJsLike | number | string
    factor_ajuste?: Decimal | DecimalJsLike | number | string
    updated_at?: Date | string
  }

  export type ConfiguracionCostosUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    costo_hora_base?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    cargas_sociales?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    costos_uniforme?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    otros_costos?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    factor_ajuste?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutConfiguracion_costosNestedInput
  }

  export type ConfiguracionCostosUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenant_id?: StringFieldUpdateOperationsInput | string
    costo_hora_base?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    cargas_sociales?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    costos_uniforme?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    otros_costos?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    factor_ajuste?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConfiguracionCostosCreateManyInput = {
    id?: string
    tenant_id: string
    costo_hora_base: Decimal | DecimalJsLike | number | string
    cargas_sociales: Decimal | DecimalJsLike | number | string
    costos_uniforme: Decimal | DecimalJsLike | number | string
    otros_costos: Decimal | DecimalJsLike | number | string
    factor_ajuste?: Decimal | DecimalJsLike | number | string
    updated_at?: Date | string
  }

  export type ConfiguracionCostosUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    costo_hora_base?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    cargas_sociales?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    costos_uniforme?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    otros_costos?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    factor_ajuste?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConfiguracionCostosUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenant_id?: StringFieldUpdateOperationsInput | string
    costo_hora_base?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    cargas_sociales?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    costos_uniforme?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    otros_costos?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    factor_ajuste?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CotizacionCreateInput = {
    id?: string
    cliente_nombre: string
    vencimiento: Date | string
    estado?: string
    total_mensual: Decimal | DecimalJsLike | number | string
    created_at?: Date | string
    updated_at?: Date | string
    tenant: TenantCreateNestedOneWithoutCotizacionesInput
    items?: CotizacionItemCreateNestedManyWithoutCotizacionInput
  }

  export type CotizacionUncheckedCreateInput = {
    id?: string
    tenant_id: string
    cliente_nombre: string
    vencimiento: Date | string
    estado?: string
    total_mensual: Decimal | DecimalJsLike | number | string
    created_at?: Date | string
    updated_at?: Date | string
    items?: CotizacionItemUncheckedCreateNestedManyWithoutCotizacionInput
  }

  export type CotizacionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    cliente_nombre?: StringFieldUpdateOperationsInput | string
    vencimiento?: DateTimeFieldUpdateOperationsInput | Date | string
    estado?: StringFieldUpdateOperationsInput | string
    total_mensual?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutCotizacionesNestedInput
    items?: CotizacionItemUpdateManyWithoutCotizacionNestedInput
  }

  export type CotizacionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenant_id?: StringFieldUpdateOperationsInput | string
    cliente_nombre?: StringFieldUpdateOperationsInput | string
    vencimiento?: DateTimeFieldUpdateOperationsInput | Date | string
    estado?: StringFieldUpdateOperationsInput | string
    total_mensual?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: CotizacionItemUncheckedUpdateManyWithoutCotizacionNestedInput
  }

  export type CotizacionCreateManyInput = {
    id?: string
    tenant_id: string
    cliente_nombre: string
    vencimiento: Date | string
    estado?: string
    total_mensual: Decimal | DecimalJsLike | number | string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type CotizacionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    cliente_nombre?: StringFieldUpdateOperationsInput | string
    vencimiento?: DateTimeFieldUpdateOperationsInput | Date | string
    estado?: StringFieldUpdateOperationsInput | string
    total_mensual?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CotizacionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenant_id?: StringFieldUpdateOperationsInput | string
    cliente_nombre?: StringFieldUpdateOperationsInput | string
    vencimiento?: DateTimeFieldUpdateOperationsInput | Date | string
    estado?: StringFieldUpdateOperationsInput | string
    total_mensual?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CotizacionItemCreateInput = {
    id?: string
    puesto_nombre: string
    horas_mensuales: number
    costo_hora: Decimal | DecimalJsLike | number | string
    margen: Decimal | DecimalJsLike | number | string
    subtotal: Decimal | DecimalJsLike | number | string
    cotizacion: CotizacionCreateNestedOneWithoutItemsInput
  }

  export type CotizacionItemUncheckedCreateInput = {
    id?: string
    cotizacion_id: string
    puesto_nombre: string
    horas_mensuales: number
    costo_hora: Decimal | DecimalJsLike | number | string
    margen: Decimal | DecimalJsLike | number | string
    subtotal: Decimal | DecimalJsLike | number | string
  }

  export type CotizacionItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    puesto_nombre?: StringFieldUpdateOperationsInput | string
    horas_mensuales?: IntFieldUpdateOperationsInput | number
    costo_hora?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    margen?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    cotizacion?: CotizacionUpdateOneRequiredWithoutItemsNestedInput
  }

  export type CotizacionItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    cotizacion_id?: StringFieldUpdateOperationsInput | string
    puesto_nombre?: StringFieldUpdateOperationsInput | string
    horas_mensuales?: IntFieldUpdateOperationsInput | number
    costo_hora?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    margen?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type CotizacionItemCreateManyInput = {
    id?: string
    cotizacion_id: string
    puesto_nombre: string
    horas_mensuales: number
    costo_hora: Decimal | DecimalJsLike | number | string
    margen: Decimal | DecimalJsLike | number | string
    subtotal: Decimal | DecimalJsLike | number | string
  }

  export type CotizacionItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    puesto_nombre?: StringFieldUpdateOperationsInput | string
    horas_mensuales?: IntFieldUpdateOperationsInput | number
    costo_hora?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    margen?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type CotizacionItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    cotizacion_id?: StringFieldUpdateOperationsInput | string
    puesto_nombre?: StringFieldUpdateOperationsInput | string
    horas_mensuales?: IntFieldUpdateOperationsInput | number
    costo_hora?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    margen?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type UuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type UserListRelationFilter = {
    every?: UserWhereInput
    some?: UserWhereInput
    none?: UserWhereInput
  }

  export type VigiladorListRelationFilter = {
    every?: VigiladorWhereInput
    some?: VigiladorWhereInput
    none?: VigiladorWhereInput
  }

  export type CredencialListRelationFilter = {
    every?: CredencialWhereInput
    some?: CredencialWhereInput
    none?: CredencialWhereInput
  }

  export type ObjetivoListRelationFilter = {
    every?: ObjetivoWhereInput
    some?: ObjetivoWhereInput
    none?: ObjetivoWhereInput
  }

  export type PuestoListRelationFilter = {
    every?: PuestoWhereInput
    some?: PuestoWhereInput
    none?: PuestoWhereInput
  }

  export type AsignacionListRelationFilter = {
    every?: AsignacionWhereInput
    some?: AsignacionWhereInput
    none?: AsignacionWhereInput
  }

  export type AsistenciaListRelationFilter = {
    every?: AsistenciaWhereInput
    some?: AsistenciaWhereInput
    none?: AsistenciaWhereInput
  }

  export type FeriadoListRelationFilter = {
    every?: FeriadoWhereInput
    some?: FeriadoWhereInput
    none?: FeriadoWhereInput
  }

  export type ConfiguracionCostosNullableRelationFilter = {
    is?: ConfiguracionCostosWhereInput | null
    isNot?: ConfiguracionCostosWhereInput | null
  }

  export type CotizacionListRelationFilter = {
    every?: CotizacionWhereInput
    some?: CotizacionWhereInput
    none?: CotizacionWhereInput
  }

  export type UserOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type VigiladorOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CredencialOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ObjetivoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PuestoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AsignacionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AsistenciaOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type FeriadoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CotizacionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TenantCountOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    factor_cobertura?: SortOrder
    margen_objetivo?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type TenantAvgOrderByAggregateInput = {
    factor_cobertura?: SortOrder
    margen_objetivo?: SortOrder
  }

  export type TenantMaxOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    factor_cobertura?: SortOrder
    margen_objetivo?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type TenantMinOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    factor_cobertura?: SortOrder
    margen_objetivo?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type TenantSumOrderByAggregateInput = {
    factor_cobertura?: SortOrder
    margen_objetivo?: SortOrder
  }

  export type UuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type TenantRelationFilter = {
    is?: TenantWhereInput
    isNot?: TenantWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    tenant_id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    deleted_at?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    tenant_id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    deleted_at?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    tenant_id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    deleted_at?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type VigiladorTenant_idLegajo_nroCompoundUniqueInput = {
    tenant_id: string
    legajo_nro: string
  }

  export type VigiladorCountOrderByAggregateInput = {
    id?: SortOrder
    tenant_id?: SortOrder
    legajo_nro?: SortOrder
    nombre?: SortOrder
    apellido?: SortOrder
    documento?: SortOrder
    estado?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    deleted_at?: SortOrder
  }

  export type VigiladorMaxOrderByAggregateInput = {
    id?: SortOrder
    tenant_id?: SortOrder
    legajo_nro?: SortOrder
    nombre?: SortOrder
    apellido?: SortOrder
    documento?: SortOrder
    estado?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    deleted_at?: SortOrder
  }

  export type VigiladorMinOrderByAggregateInput = {
    id?: SortOrder
    tenant_id?: SortOrder
    legajo_nro?: SortOrder
    nombre?: SortOrder
    apellido?: SortOrder
    documento?: SortOrder
    estado?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    deleted_at?: SortOrder
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type VigiladorRelationFilter = {
    is?: VigiladorWhereInput
    isNot?: VigiladorWhereInput
  }

  export type CredencialCountOrderByAggregateInput = {
    id?: SortOrder
    tenant_id?: SortOrder
    vigilador_id?: SortOrder
    tipo?: SortOrder
    numero?: SortOrder
    organismo?: SortOrder
    emitida_el?: SortOrder
    vence_el?: SortOrder
    created_at?: SortOrder
  }

  export type CredencialMaxOrderByAggregateInput = {
    id?: SortOrder
    tenant_id?: SortOrder
    vigilador_id?: SortOrder
    tipo?: SortOrder
    numero?: SortOrder
    organismo?: SortOrder
    emitida_el?: SortOrder
    vence_el?: SortOrder
    created_at?: SortOrder
  }

  export type CredencialMinOrderByAggregateInput = {
    id?: SortOrder
    tenant_id?: SortOrder
    vigilador_id?: SortOrder
    tipo?: SortOrder
    numero?: SortOrder
    organismo?: SortOrder
    emitida_el?: SortOrder
    vence_el?: SortOrder
    created_at?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type ObjetivoTenant_idCodigoCompoundUniqueInput = {
    tenant_id: string
    codigo: string
  }

  export type ObjetivoCountOrderByAggregateInput = {
    id?: SortOrder
    tenant_id?: SortOrder
    cliente_id?: SortOrder
    codigo?: SortOrder
    nombre?: SortOrder
    direccion?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ObjetivoMaxOrderByAggregateInput = {
    id?: SortOrder
    tenant_id?: SortOrder
    cliente_id?: SortOrder
    codigo?: SortOrder
    nombre?: SortOrder
    direccion?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ObjetivoMinOrderByAggregateInput = {
    id?: SortOrder
    tenant_id?: SortOrder
    cliente_id?: SortOrder
    codigo?: SortOrder
    nombre?: SortOrder
    direccion?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type UuidNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidNullableFilter<$PrismaModel> | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }
  export type JsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type ObjetivoNullableRelationFilter = {
    is?: ObjetivoWhereInput | null
    isNot?: ObjetivoWhereInput | null
  }

  export type PuestoCountOrderByAggregateInput = {
    id?: SortOrder
    tenant_id?: SortOrder
    objetivo_id?: SortOrder
    nombre?: SortOrder
    ubicacion?: SortOrder
    requiere_arma?: SortOrder
    requiere_movil?: SortOrder
    esquema_horario?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type PuestoMaxOrderByAggregateInput = {
    id?: SortOrder
    tenant_id?: SortOrder
    objetivo_id?: SortOrder
    nombre?: SortOrder
    ubicacion?: SortOrder
    requiere_arma?: SortOrder
    requiere_movil?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type PuestoMinOrderByAggregateInput = {
    id?: SortOrder
    tenant_id?: SortOrder
    objetivo_id?: SortOrder
    nombre?: SortOrder
    ubicacion?: SortOrder
    requiere_arma?: SortOrder
    requiere_movil?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type UuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type PuestoRelationFilter = {
    is?: PuestoWhereInput
    isNot?: PuestoWhereInput
  }

  export type VigiladorNullableRelationFilter = {
    is?: VigiladorWhereInput | null
    isNot?: VigiladorWhereInput | null
  }

  export type AsistenciaNullableRelationFilter = {
    is?: AsistenciaWhereInput | null
    isNot?: AsistenciaWhereInput | null
  }

  export type AsignacionPuesto_id_fecha_hora_inicioCompoundUniqueInput = {
    puesto_id: string
    fecha: Date | string
    hora_inicio: string
  }

  export type AsignacionCountOrderByAggregateInput = {
    id?: SortOrder
    tenant_id?: SortOrder
    puesto_id?: SortOrder
    vigilador_id?: SortOrder
    fecha?: SortOrder
    hora_inicio?: SortOrder
    hora_fin?: SortOrder
    estado?: SortOrder
    created_at?: SortOrder
  }

  export type AsignacionMaxOrderByAggregateInput = {
    id?: SortOrder
    tenant_id?: SortOrder
    puesto_id?: SortOrder
    vigilador_id?: SortOrder
    fecha?: SortOrder
    hora_inicio?: SortOrder
    hora_fin?: SortOrder
    estado?: SortOrder
    created_at?: SortOrder
  }

  export type AsignacionMinOrderByAggregateInput = {
    id?: SortOrder
    tenant_id?: SortOrder
    puesto_id?: SortOrder
    vigilador_id?: SortOrder
    fecha?: SortOrder
    hora_inicio?: SortOrder
    hora_fin?: SortOrder
    estado?: SortOrder
    created_at?: SortOrder
  }

  export type DecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type AsignacionRelationFilter = {
    is?: AsignacionWhereInput
    isNot?: AsignacionWhereInput
  }

  export type AsistenciaCountOrderByAggregateInput = {
    id?: SortOrder
    tenant_id?: SortOrder
    asignacion_id?: SortOrder
    inicio_real?: SortOrder
    fin_real?: SortOrder
    metodo?: SortOrder
    lat?: SortOrder
    lng?: SortOrder
  }

  export type AsistenciaAvgOrderByAggregateInput = {
    lat?: SortOrder
    lng?: SortOrder
  }

  export type AsistenciaMaxOrderByAggregateInput = {
    id?: SortOrder
    tenant_id?: SortOrder
    asignacion_id?: SortOrder
    inicio_real?: SortOrder
    fin_real?: SortOrder
    metodo?: SortOrder
    lat?: SortOrder
    lng?: SortOrder
  }

  export type AsistenciaMinOrderByAggregateInput = {
    id?: SortOrder
    tenant_id?: SortOrder
    asignacion_id?: SortOrder
    inicio_real?: SortOrder
    fin_real?: SortOrder
    metodo?: SortOrder
    lat?: SortOrder
    lng?: SortOrder
  }

  export type AsistenciaSumOrderByAggregateInput = {
    lat?: SortOrder
    lng?: SortOrder
  }

  export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type FeriadoCountOrderByAggregateInput = {
    id?: SortOrder
    tenant_id?: SortOrder
    nombre?: SortOrder
    fecha?: SortOrder
    created_at?: SortOrder
  }

  export type FeriadoMaxOrderByAggregateInput = {
    id?: SortOrder
    tenant_id?: SortOrder
    nombre?: SortOrder
    fecha?: SortOrder
    created_at?: SortOrder
  }

  export type FeriadoMinOrderByAggregateInput = {
    id?: SortOrder
    tenant_id?: SortOrder
    nombre?: SortOrder
    fecha?: SortOrder
    created_at?: SortOrder
  }

  export type ConfiguracionCostosCountOrderByAggregateInput = {
    id?: SortOrder
    tenant_id?: SortOrder
    costo_hora_base?: SortOrder
    cargas_sociales?: SortOrder
    costos_uniforme?: SortOrder
    otros_costos?: SortOrder
    factor_ajuste?: SortOrder
    updated_at?: SortOrder
  }

  export type ConfiguracionCostosAvgOrderByAggregateInput = {
    costo_hora_base?: SortOrder
    cargas_sociales?: SortOrder
    costos_uniforme?: SortOrder
    otros_costos?: SortOrder
    factor_ajuste?: SortOrder
  }

  export type ConfiguracionCostosMaxOrderByAggregateInput = {
    id?: SortOrder
    tenant_id?: SortOrder
    costo_hora_base?: SortOrder
    cargas_sociales?: SortOrder
    costos_uniforme?: SortOrder
    otros_costos?: SortOrder
    factor_ajuste?: SortOrder
    updated_at?: SortOrder
  }

  export type ConfiguracionCostosMinOrderByAggregateInput = {
    id?: SortOrder
    tenant_id?: SortOrder
    costo_hora_base?: SortOrder
    cargas_sociales?: SortOrder
    costos_uniforme?: SortOrder
    otros_costos?: SortOrder
    factor_ajuste?: SortOrder
    updated_at?: SortOrder
  }

  export type ConfiguracionCostosSumOrderByAggregateInput = {
    costo_hora_base?: SortOrder
    cargas_sociales?: SortOrder
    costos_uniforme?: SortOrder
    otros_costos?: SortOrder
    factor_ajuste?: SortOrder
  }

  export type CotizacionItemListRelationFilter = {
    every?: CotizacionItemWhereInput
    some?: CotizacionItemWhereInput
    none?: CotizacionItemWhereInput
  }

  export type CotizacionItemOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CotizacionCountOrderByAggregateInput = {
    id?: SortOrder
    tenant_id?: SortOrder
    cliente_nombre?: SortOrder
    vencimiento?: SortOrder
    estado?: SortOrder
    total_mensual?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type CotizacionAvgOrderByAggregateInput = {
    total_mensual?: SortOrder
  }

  export type CotizacionMaxOrderByAggregateInput = {
    id?: SortOrder
    tenant_id?: SortOrder
    cliente_nombre?: SortOrder
    vencimiento?: SortOrder
    estado?: SortOrder
    total_mensual?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type CotizacionMinOrderByAggregateInput = {
    id?: SortOrder
    tenant_id?: SortOrder
    cliente_nombre?: SortOrder
    vencimiento?: SortOrder
    estado?: SortOrder
    total_mensual?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type CotizacionSumOrderByAggregateInput = {
    total_mensual?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type CotizacionRelationFilter = {
    is?: CotizacionWhereInput
    isNot?: CotizacionWhereInput
  }

  export type CotizacionItemCountOrderByAggregateInput = {
    id?: SortOrder
    cotizacion_id?: SortOrder
    puesto_nombre?: SortOrder
    horas_mensuales?: SortOrder
    costo_hora?: SortOrder
    margen?: SortOrder
    subtotal?: SortOrder
  }

  export type CotizacionItemAvgOrderByAggregateInput = {
    horas_mensuales?: SortOrder
    costo_hora?: SortOrder
    margen?: SortOrder
    subtotal?: SortOrder
  }

  export type CotizacionItemMaxOrderByAggregateInput = {
    id?: SortOrder
    cotizacion_id?: SortOrder
    puesto_nombre?: SortOrder
    horas_mensuales?: SortOrder
    costo_hora?: SortOrder
    margen?: SortOrder
    subtotal?: SortOrder
  }

  export type CotizacionItemMinOrderByAggregateInput = {
    id?: SortOrder
    cotizacion_id?: SortOrder
    puesto_nombre?: SortOrder
    horas_mensuales?: SortOrder
    costo_hora?: SortOrder
    margen?: SortOrder
    subtotal?: SortOrder
  }

  export type CotizacionItemSumOrderByAggregateInput = {
    horas_mensuales?: SortOrder
    costo_hora?: SortOrder
    margen?: SortOrder
    subtotal?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type UserCreateNestedManyWithoutTenantInput = {
    create?: XOR<UserCreateWithoutTenantInput, UserUncheckedCreateWithoutTenantInput> | UserCreateWithoutTenantInput[] | UserUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: UserCreateOrConnectWithoutTenantInput | UserCreateOrConnectWithoutTenantInput[]
    createMany?: UserCreateManyTenantInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type VigiladorCreateNestedManyWithoutTenantInput = {
    create?: XOR<VigiladorCreateWithoutTenantInput, VigiladorUncheckedCreateWithoutTenantInput> | VigiladorCreateWithoutTenantInput[] | VigiladorUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: VigiladorCreateOrConnectWithoutTenantInput | VigiladorCreateOrConnectWithoutTenantInput[]
    createMany?: VigiladorCreateManyTenantInputEnvelope
    connect?: VigiladorWhereUniqueInput | VigiladorWhereUniqueInput[]
  }

  export type CredencialCreateNestedManyWithoutTenantInput = {
    create?: XOR<CredencialCreateWithoutTenantInput, CredencialUncheckedCreateWithoutTenantInput> | CredencialCreateWithoutTenantInput[] | CredencialUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: CredencialCreateOrConnectWithoutTenantInput | CredencialCreateOrConnectWithoutTenantInput[]
    createMany?: CredencialCreateManyTenantInputEnvelope
    connect?: CredencialWhereUniqueInput | CredencialWhereUniqueInput[]
  }

  export type ObjetivoCreateNestedManyWithoutTenantInput = {
    create?: XOR<ObjetivoCreateWithoutTenantInput, ObjetivoUncheckedCreateWithoutTenantInput> | ObjetivoCreateWithoutTenantInput[] | ObjetivoUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: ObjetivoCreateOrConnectWithoutTenantInput | ObjetivoCreateOrConnectWithoutTenantInput[]
    createMany?: ObjetivoCreateManyTenantInputEnvelope
    connect?: ObjetivoWhereUniqueInput | ObjetivoWhereUniqueInput[]
  }

  export type PuestoCreateNestedManyWithoutTenantInput = {
    create?: XOR<PuestoCreateWithoutTenantInput, PuestoUncheckedCreateWithoutTenantInput> | PuestoCreateWithoutTenantInput[] | PuestoUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: PuestoCreateOrConnectWithoutTenantInput | PuestoCreateOrConnectWithoutTenantInput[]
    createMany?: PuestoCreateManyTenantInputEnvelope
    connect?: PuestoWhereUniqueInput | PuestoWhereUniqueInput[]
  }

  export type AsignacionCreateNestedManyWithoutTenantInput = {
    create?: XOR<AsignacionCreateWithoutTenantInput, AsignacionUncheckedCreateWithoutTenantInput> | AsignacionCreateWithoutTenantInput[] | AsignacionUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: AsignacionCreateOrConnectWithoutTenantInput | AsignacionCreateOrConnectWithoutTenantInput[]
    createMany?: AsignacionCreateManyTenantInputEnvelope
    connect?: AsignacionWhereUniqueInput | AsignacionWhereUniqueInput[]
  }

  export type AsistenciaCreateNestedManyWithoutTenantInput = {
    create?: XOR<AsistenciaCreateWithoutTenantInput, AsistenciaUncheckedCreateWithoutTenantInput> | AsistenciaCreateWithoutTenantInput[] | AsistenciaUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: AsistenciaCreateOrConnectWithoutTenantInput | AsistenciaCreateOrConnectWithoutTenantInput[]
    createMany?: AsistenciaCreateManyTenantInputEnvelope
    connect?: AsistenciaWhereUniqueInput | AsistenciaWhereUniqueInput[]
  }

  export type FeriadoCreateNestedManyWithoutTenantInput = {
    create?: XOR<FeriadoCreateWithoutTenantInput, FeriadoUncheckedCreateWithoutTenantInput> | FeriadoCreateWithoutTenantInput[] | FeriadoUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: FeriadoCreateOrConnectWithoutTenantInput | FeriadoCreateOrConnectWithoutTenantInput[]
    createMany?: FeriadoCreateManyTenantInputEnvelope
    connect?: FeriadoWhereUniqueInput | FeriadoWhereUniqueInput[]
  }

  export type ConfiguracionCostosCreateNestedOneWithoutTenantInput = {
    create?: XOR<ConfiguracionCostosCreateWithoutTenantInput, ConfiguracionCostosUncheckedCreateWithoutTenantInput>
    connectOrCreate?: ConfiguracionCostosCreateOrConnectWithoutTenantInput
    connect?: ConfiguracionCostosWhereUniqueInput
  }

  export type CotizacionCreateNestedManyWithoutTenantInput = {
    create?: XOR<CotizacionCreateWithoutTenantInput, CotizacionUncheckedCreateWithoutTenantInput> | CotizacionCreateWithoutTenantInput[] | CotizacionUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: CotizacionCreateOrConnectWithoutTenantInput | CotizacionCreateOrConnectWithoutTenantInput[]
    createMany?: CotizacionCreateManyTenantInputEnvelope
    connect?: CotizacionWhereUniqueInput | CotizacionWhereUniqueInput[]
  }

  export type UserUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<UserCreateWithoutTenantInput, UserUncheckedCreateWithoutTenantInput> | UserCreateWithoutTenantInput[] | UserUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: UserCreateOrConnectWithoutTenantInput | UserCreateOrConnectWithoutTenantInput[]
    createMany?: UserCreateManyTenantInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type VigiladorUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<VigiladorCreateWithoutTenantInput, VigiladorUncheckedCreateWithoutTenantInput> | VigiladorCreateWithoutTenantInput[] | VigiladorUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: VigiladorCreateOrConnectWithoutTenantInput | VigiladorCreateOrConnectWithoutTenantInput[]
    createMany?: VigiladorCreateManyTenantInputEnvelope
    connect?: VigiladorWhereUniqueInput | VigiladorWhereUniqueInput[]
  }

  export type CredencialUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<CredencialCreateWithoutTenantInput, CredencialUncheckedCreateWithoutTenantInput> | CredencialCreateWithoutTenantInput[] | CredencialUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: CredencialCreateOrConnectWithoutTenantInput | CredencialCreateOrConnectWithoutTenantInput[]
    createMany?: CredencialCreateManyTenantInputEnvelope
    connect?: CredencialWhereUniqueInput | CredencialWhereUniqueInput[]
  }

  export type ObjetivoUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<ObjetivoCreateWithoutTenantInput, ObjetivoUncheckedCreateWithoutTenantInput> | ObjetivoCreateWithoutTenantInput[] | ObjetivoUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: ObjetivoCreateOrConnectWithoutTenantInput | ObjetivoCreateOrConnectWithoutTenantInput[]
    createMany?: ObjetivoCreateManyTenantInputEnvelope
    connect?: ObjetivoWhereUniqueInput | ObjetivoWhereUniqueInput[]
  }

  export type PuestoUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<PuestoCreateWithoutTenantInput, PuestoUncheckedCreateWithoutTenantInput> | PuestoCreateWithoutTenantInput[] | PuestoUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: PuestoCreateOrConnectWithoutTenantInput | PuestoCreateOrConnectWithoutTenantInput[]
    createMany?: PuestoCreateManyTenantInputEnvelope
    connect?: PuestoWhereUniqueInput | PuestoWhereUniqueInput[]
  }

  export type AsignacionUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<AsignacionCreateWithoutTenantInput, AsignacionUncheckedCreateWithoutTenantInput> | AsignacionCreateWithoutTenantInput[] | AsignacionUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: AsignacionCreateOrConnectWithoutTenantInput | AsignacionCreateOrConnectWithoutTenantInput[]
    createMany?: AsignacionCreateManyTenantInputEnvelope
    connect?: AsignacionWhereUniqueInput | AsignacionWhereUniqueInput[]
  }

  export type AsistenciaUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<AsistenciaCreateWithoutTenantInput, AsistenciaUncheckedCreateWithoutTenantInput> | AsistenciaCreateWithoutTenantInput[] | AsistenciaUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: AsistenciaCreateOrConnectWithoutTenantInput | AsistenciaCreateOrConnectWithoutTenantInput[]
    createMany?: AsistenciaCreateManyTenantInputEnvelope
    connect?: AsistenciaWhereUniqueInput | AsistenciaWhereUniqueInput[]
  }

  export type FeriadoUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<FeriadoCreateWithoutTenantInput, FeriadoUncheckedCreateWithoutTenantInput> | FeriadoCreateWithoutTenantInput[] | FeriadoUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: FeriadoCreateOrConnectWithoutTenantInput | FeriadoCreateOrConnectWithoutTenantInput[]
    createMany?: FeriadoCreateManyTenantInputEnvelope
    connect?: FeriadoWhereUniqueInput | FeriadoWhereUniqueInput[]
  }

  export type ConfiguracionCostosUncheckedCreateNestedOneWithoutTenantInput = {
    create?: XOR<ConfiguracionCostosCreateWithoutTenantInput, ConfiguracionCostosUncheckedCreateWithoutTenantInput>
    connectOrCreate?: ConfiguracionCostosCreateOrConnectWithoutTenantInput
    connect?: ConfiguracionCostosWhereUniqueInput
  }

  export type CotizacionUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<CotizacionCreateWithoutTenantInput, CotizacionUncheckedCreateWithoutTenantInput> | CotizacionCreateWithoutTenantInput[] | CotizacionUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: CotizacionCreateOrConnectWithoutTenantInput | CotizacionCreateOrConnectWithoutTenantInput[]
    createMany?: CotizacionCreateManyTenantInputEnvelope
    connect?: CotizacionWhereUniqueInput | CotizacionWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type UserUpdateManyWithoutTenantNestedInput = {
    create?: XOR<UserCreateWithoutTenantInput, UserUncheckedCreateWithoutTenantInput> | UserCreateWithoutTenantInput[] | UserUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: UserCreateOrConnectWithoutTenantInput | UserCreateOrConnectWithoutTenantInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutTenantInput | UserUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: UserCreateManyTenantInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutTenantInput | UserUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: UserUpdateManyWithWhereWithoutTenantInput | UserUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type VigiladorUpdateManyWithoutTenantNestedInput = {
    create?: XOR<VigiladorCreateWithoutTenantInput, VigiladorUncheckedCreateWithoutTenantInput> | VigiladorCreateWithoutTenantInput[] | VigiladorUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: VigiladorCreateOrConnectWithoutTenantInput | VigiladorCreateOrConnectWithoutTenantInput[]
    upsert?: VigiladorUpsertWithWhereUniqueWithoutTenantInput | VigiladorUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: VigiladorCreateManyTenantInputEnvelope
    set?: VigiladorWhereUniqueInput | VigiladorWhereUniqueInput[]
    disconnect?: VigiladorWhereUniqueInput | VigiladorWhereUniqueInput[]
    delete?: VigiladorWhereUniqueInput | VigiladorWhereUniqueInput[]
    connect?: VigiladorWhereUniqueInput | VigiladorWhereUniqueInput[]
    update?: VigiladorUpdateWithWhereUniqueWithoutTenantInput | VigiladorUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: VigiladorUpdateManyWithWhereWithoutTenantInput | VigiladorUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: VigiladorScalarWhereInput | VigiladorScalarWhereInput[]
  }

  export type CredencialUpdateManyWithoutTenantNestedInput = {
    create?: XOR<CredencialCreateWithoutTenantInput, CredencialUncheckedCreateWithoutTenantInput> | CredencialCreateWithoutTenantInput[] | CredencialUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: CredencialCreateOrConnectWithoutTenantInput | CredencialCreateOrConnectWithoutTenantInput[]
    upsert?: CredencialUpsertWithWhereUniqueWithoutTenantInput | CredencialUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: CredencialCreateManyTenantInputEnvelope
    set?: CredencialWhereUniqueInput | CredencialWhereUniqueInput[]
    disconnect?: CredencialWhereUniqueInput | CredencialWhereUniqueInput[]
    delete?: CredencialWhereUniqueInput | CredencialWhereUniqueInput[]
    connect?: CredencialWhereUniqueInput | CredencialWhereUniqueInput[]
    update?: CredencialUpdateWithWhereUniqueWithoutTenantInput | CredencialUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: CredencialUpdateManyWithWhereWithoutTenantInput | CredencialUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: CredencialScalarWhereInput | CredencialScalarWhereInput[]
  }

  export type ObjetivoUpdateManyWithoutTenantNestedInput = {
    create?: XOR<ObjetivoCreateWithoutTenantInput, ObjetivoUncheckedCreateWithoutTenantInput> | ObjetivoCreateWithoutTenantInput[] | ObjetivoUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: ObjetivoCreateOrConnectWithoutTenantInput | ObjetivoCreateOrConnectWithoutTenantInput[]
    upsert?: ObjetivoUpsertWithWhereUniqueWithoutTenantInput | ObjetivoUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: ObjetivoCreateManyTenantInputEnvelope
    set?: ObjetivoWhereUniqueInput | ObjetivoWhereUniqueInput[]
    disconnect?: ObjetivoWhereUniqueInput | ObjetivoWhereUniqueInput[]
    delete?: ObjetivoWhereUniqueInput | ObjetivoWhereUniqueInput[]
    connect?: ObjetivoWhereUniqueInput | ObjetivoWhereUniqueInput[]
    update?: ObjetivoUpdateWithWhereUniqueWithoutTenantInput | ObjetivoUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: ObjetivoUpdateManyWithWhereWithoutTenantInput | ObjetivoUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: ObjetivoScalarWhereInput | ObjetivoScalarWhereInput[]
  }

  export type PuestoUpdateManyWithoutTenantNestedInput = {
    create?: XOR<PuestoCreateWithoutTenantInput, PuestoUncheckedCreateWithoutTenantInput> | PuestoCreateWithoutTenantInput[] | PuestoUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: PuestoCreateOrConnectWithoutTenantInput | PuestoCreateOrConnectWithoutTenantInput[]
    upsert?: PuestoUpsertWithWhereUniqueWithoutTenantInput | PuestoUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: PuestoCreateManyTenantInputEnvelope
    set?: PuestoWhereUniqueInput | PuestoWhereUniqueInput[]
    disconnect?: PuestoWhereUniqueInput | PuestoWhereUniqueInput[]
    delete?: PuestoWhereUniqueInput | PuestoWhereUniqueInput[]
    connect?: PuestoWhereUniqueInput | PuestoWhereUniqueInput[]
    update?: PuestoUpdateWithWhereUniqueWithoutTenantInput | PuestoUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: PuestoUpdateManyWithWhereWithoutTenantInput | PuestoUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: PuestoScalarWhereInput | PuestoScalarWhereInput[]
  }

  export type AsignacionUpdateManyWithoutTenantNestedInput = {
    create?: XOR<AsignacionCreateWithoutTenantInput, AsignacionUncheckedCreateWithoutTenantInput> | AsignacionCreateWithoutTenantInput[] | AsignacionUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: AsignacionCreateOrConnectWithoutTenantInput | AsignacionCreateOrConnectWithoutTenantInput[]
    upsert?: AsignacionUpsertWithWhereUniqueWithoutTenantInput | AsignacionUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: AsignacionCreateManyTenantInputEnvelope
    set?: AsignacionWhereUniqueInput | AsignacionWhereUniqueInput[]
    disconnect?: AsignacionWhereUniqueInput | AsignacionWhereUniqueInput[]
    delete?: AsignacionWhereUniqueInput | AsignacionWhereUniqueInput[]
    connect?: AsignacionWhereUniqueInput | AsignacionWhereUniqueInput[]
    update?: AsignacionUpdateWithWhereUniqueWithoutTenantInput | AsignacionUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: AsignacionUpdateManyWithWhereWithoutTenantInput | AsignacionUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: AsignacionScalarWhereInput | AsignacionScalarWhereInput[]
  }

  export type AsistenciaUpdateManyWithoutTenantNestedInput = {
    create?: XOR<AsistenciaCreateWithoutTenantInput, AsistenciaUncheckedCreateWithoutTenantInput> | AsistenciaCreateWithoutTenantInput[] | AsistenciaUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: AsistenciaCreateOrConnectWithoutTenantInput | AsistenciaCreateOrConnectWithoutTenantInput[]
    upsert?: AsistenciaUpsertWithWhereUniqueWithoutTenantInput | AsistenciaUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: AsistenciaCreateManyTenantInputEnvelope
    set?: AsistenciaWhereUniqueInput | AsistenciaWhereUniqueInput[]
    disconnect?: AsistenciaWhereUniqueInput | AsistenciaWhereUniqueInput[]
    delete?: AsistenciaWhereUniqueInput | AsistenciaWhereUniqueInput[]
    connect?: AsistenciaWhereUniqueInput | AsistenciaWhereUniqueInput[]
    update?: AsistenciaUpdateWithWhereUniqueWithoutTenantInput | AsistenciaUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: AsistenciaUpdateManyWithWhereWithoutTenantInput | AsistenciaUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: AsistenciaScalarWhereInput | AsistenciaScalarWhereInput[]
  }

  export type FeriadoUpdateManyWithoutTenantNestedInput = {
    create?: XOR<FeriadoCreateWithoutTenantInput, FeriadoUncheckedCreateWithoutTenantInput> | FeriadoCreateWithoutTenantInput[] | FeriadoUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: FeriadoCreateOrConnectWithoutTenantInput | FeriadoCreateOrConnectWithoutTenantInput[]
    upsert?: FeriadoUpsertWithWhereUniqueWithoutTenantInput | FeriadoUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: FeriadoCreateManyTenantInputEnvelope
    set?: FeriadoWhereUniqueInput | FeriadoWhereUniqueInput[]
    disconnect?: FeriadoWhereUniqueInput | FeriadoWhereUniqueInput[]
    delete?: FeriadoWhereUniqueInput | FeriadoWhereUniqueInput[]
    connect?: FeriadoWhereUniqueInput | FeriadoWhereUniqueInput[]
    update?: FeriadoUpdateWithWhereUniqueWithoutTenantInput | FeriadoUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: FeriadoUpdateManyWithWhereWithoutTenantInput | FeriadoUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: FeriadoScalarWhereInput | FeriadoScalarWhereInput[]
  }

  export type ConfiguracionCostosUpdateOneWithoutTenantNestedInput = {
    create?: XOR<ConfiguracionCostosCreateWithoutTenantInput, ConfiguracionCostosUncheckedCreateWithoutTenantInput>
    connectOrCreate?: ConfiguracionCostosCreateOrConnectWithoutTenantInput
    upsert?: ConfiguracionCostosUpsertWithoutTenantInput
    disconnect?: ConfiguracionCostosWhereInput | boolean
    delete?: ConfiguracionCostosWhereInput | boolean
    connect?: ConfiguracionCostosWhereUniqueInput
    update?: XOR<XOR<ConfiguracionCostosUpdateToOneWithWhereWithoutTenantInput, ConfiguracionCostosUpdateWithoutTenantInput>, ConfiguracionCostosUncheckedUpdateWithoutTenantInput>
  }

  export type CotizacionUpdateManyWithoutTenantNestedInput = {
    create?: XOR<CotizacionCreateWithoutTenantInput, CotizacionUncheckedCreateWithoutTenantInput> | CotizacionCreateWithoutTenantInput[] | CotizacionUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: CotizacionCreateOrConnectWithoutTenantInput | CotizacionCreateOrConnectWithoutTenantInput[]
    upsert?: CotizacionUpsertWithWhereUniqueWithoutTenantInput | CotizacionUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: CotizacionCreateManyTenantInputEnvelope
    set?: CotizacionWhereUniqueInput | CotizacionWhereUniqueInput[]
    disconnect?: CotizacionWhereUniqueInput | CotizacionWhereUniqueInput[]
    delete?: CotizacionWhereUniqueInput | CotizacionWhereUniqueInput[]
    connect?: CotizacionWhereUniqueInput | CotizacionWhereUniqueInput[]
    update?: CotizacionUpdateWithWhereUniqueWithoutTenantInput | CotizacionUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: CotizacionUpdateManyWithWhereWithoutTenantInput | CotizacionUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: CotizacionScalarWhereInput | CotizacionScalarWhereInput[]
  }

  export type UserUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<UserCreateWithoutTenantInput, UserUncheckedCreateWithoutTenantInput> | UserCreateWithoutTenantInput[] | UserUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: UserCreateOrConnectWithoutTenantInput | UserCreateOrConnectWithoutTenantInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutTenantInput | UserUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: UserCreateManyTenantInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutTenantInput | UserUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: UserUpdateManyWithWhereWithoutTenantInput | UserUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type VigiladorUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<VigiladorCreateWithoutTenantInput, VigiladorUncheckedCreateWithoutTenantInput> | VigiladorCreateWithoutTenantInput[] | VigiladorUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: VigiladorCreateOrConnectWithoutTenantInput | VigiladorCreateOrConnectWithoutTenantInput[]
    upsert?: VigiladorUpsertWithWhereUniqueWithoutTenantInput | VigiladorUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: VigiladorCreateManyTenantInputEnvelope
    set?: VigiladorWhereUniqueInput | VigiladorWhereUniqueInput[]
    disconnect?: VigiladorWhereUniqueInput | VigiladorWhereUniqueInput[]
    delete?: VigiladorWhereUniqueInput | VigiladorWhereUniqueInput[]
    connect?: VigiladorWhereUniqueInput | VigiladorWhereUniqueInput[]
    update?: VigiladorUpdateWithWhereUniqueWithoutTenantInput | VigiladorUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: VigiladorUpdateManyWithWhereWithoutTenantInput | VigiladorUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: VigiladorScalarWhereInput | VigiladorScalarWhereInput[]
  }

  export type CredencialUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<CredencialCreateWithoutTenantInput, CredencialUncheckedCreateWithoutTenantInput> | CredencialCreateWithoutTenantInput[] | CredencialUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: CredencialCreateOrConnectWithoutTenantInput | CredencialCreateOrConnectWithoutTenantInput[]
    upsert?: CredencialUpsertWithWhereUniqueWithoutTenantInput | CredencialUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: CredencialCreateManyTenantInputEnvelope
    set?: CredencialWhereUniqueInput | CredencialWhereUniqueInput[]
    disconnect?: CredencialWhereUniqueInput | CredencialWhereUniqueInput[]
    delete?: CredencialWhereUniqueInput | CredencialWhereUniqueInput[]
    connect?: CredencialWhereUniqueInput | CredencialWhereUniqueInput[]
    update?: CredencialUpdateWithWhereUniqueWithoutTenantInput | CredencialUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: CredencialUpdateManyWithWhereWithoutTenantInput | CredencialUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: CredencialScalarWhereInput | CredencialScalarWhereInput[]
  }

  export type ObjetivoUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<ObjetivoCreateWithoutTenantInput, ObjetivoUncheckedCreateWithoutTenantInput> | ObjetivoCreateWithoutTenantInput[] | ObjetivoUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: ObjetivoCreateOrConnectWithoutTenantInput | ObjetivoCreateOrConnectWithoutTenantInput[]
    upsert?: ObjetivoUpsertWithWhereUniqueWithoutTenantInput | ObjetivoUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: ObjetivoCreateManyTenantInputEnvelope
    set?: ObjetivoWhereUniqueInput | ObjetivoWhereUniqueInput[]
    disconnect?: ObjetivoWhereUniqueInput | ObjetivoWhereUniqueInput[]
    delete?: ObjetivoWhereUniqueInput | ObjetivoWhereUniqueInput[]
    connect?: ObjetivoWhereUniqueInput | ObjetivoWhereUniqueInput[]
    update?: ObjetivoUpdateWithWhereUniqueWithoutTenantInput | ObjetivoUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: ObjetivoUpdateManyWithWhereWithoutTenantInput | ObjetivoUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: ObjetivoScalarWhereInput | ObjetivoScalarWhereInput[]
  }

  export type PuestoUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<PuestoCreateWithoutTenantInput, PuestoUncheckedCreateWithoutTenantInput> | PuestoCreateWithoutTenantInput[] | PuestoUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: PuestoCreateOrConnectWithoutTenantInput | PuestoCreateOrConnectWithoutTenantInput[]
    upsert?: PuestoUpsertWithWhereUniqueWithoutTenantInput | PuestoUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: PuestoCreateManyTenantInputEnvelope
    set?: PuestoWhereUniqueInput | PuestoWhereUniqueInput[]
    disconnect?: PuestoWhereUniqueInput | PuestoWhereUniqueInput[]
    delete?: PuestoWhereUniqueInput | PuestoWhereUniqueInput[]
    connect?: PuestoWhereUniqueInput | PuestoWhereUniqueInput[]
    update?: PuestoUpdateWithWhereUniqueWithoutTenantInput | PuestoUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: PuestoUpdateManyWithWhereWithoutTenantInput | PuestoUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: PuestoScalarWhereInput | PuestoScalarWhereInput[]
  }

  export type AsignacionUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<AsignacionCreateWithoutTenantInput, AsignacionUncheckedCreateWithoutTenantInput> | AsignacionCreateWithoutTenantInput[] | AsignacionUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: AsignacionCreateOrConnectWithoutTenantInput | AsignacionCreateOrConnectWithoutTenantInput[]
    upsert?: AsignacionUpsertWithWhereUniqueWithoutTenantInput | AsignacionUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: AsignacionCreateManyTenantInputEnvelope
    set?: AsignacionWhereUniqueInput | AsignacionWhereUniqueInput[]
    disconnect?: AsignacionWhereUniqueInput | AsignacionWhereUniqueInput[]
    delete?: AsignacionWhereUniqueInput | AsignacionWhereUniqueInput[]
    connect?: AsignacionWhereUniqueInput | AsignacionWhereUniqueInput[]
    update?: AsignacionUpdateWithWhereUniqueWithoutTenantInput | AsignacionUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: AsignacionUpdateManyWithWhereWithoutTenantInput | AsignacionUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: AsignacionScalarWhereInput | AsignacionScalarWhereInput[]
  }

  export type AsistenciaUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<AsistenciaCreateWithoutTenantInput, AsistenciaUncheckedCreateWithoutTenantInput> | AsistenciaCreateWithoutTenantInput[] | AsistenciaUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: AsistenciaCreateOrConnectWithoutTenantInput | AsistenciaCreateOrConnectWithoutTenantInput[]
    upsert?: AsistenciaUpsertWithWhereUniqueWithoutTenantInput | AsistenciaUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: AsistenciaCreateManyTenantInputEnvelope
    set?: AsistenciaWhereUniqueInput | AsistenciaWhereUniqueInput[]
    disconnect?: AsistenciaWhereUniqueInput | AsistenciaWhereUniqueInput[]
    delete?: AsistenciaWhereUniqueInput | AsistenciaWhereUniqueInput[]
    connect?: AsistenciaWhereUniqueInput | AsistenciaWhereUniqueInput[]
    update?: AsistenciaUpdateWithWhereUniqueWithoutTenantInput | AsistenciaUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: AsistenciaUpdateManyWithWhereWithoutTenantInput | AsistenciaUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: AsistenciaScalarWhereInput | AsistenciaScalarWhereInput[]
  }

  export type FeriadoUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<FeriadoCreateWithoutTenantInput, FeriadoUncheckedCreateWithoutTenantInput> | FeriadoCreateWithoutTenantInput[] | FeriadoUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: FeriadoCreateOrConnectWithoutTenantInput | FeriadoCreateOrConnectWithoutTenantInput[]
    upsert?: FeriadoUpsertWithWhereUniqueWithoutTenantInput | FeriadoUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: FeriadoCreateManyTenantInputEnvelope
    set?: FeriadoWhereUniqueInput | FeriadoWhereUniqueInput[]
    disconnect?: FeriadoWhereUniqueInput | FeriadoWhereUniqueInput[]
    delete?: FeriadoWhereUniqueInput | FeriadoWhereUniqueInput[]
    connect?: FeriadoWhereUniqueInput | FeriadoWhereUniqueInput[]
    update?: FeriadoUpdateWithWhereUniqueWithoutTenantInput | FeriadoUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: FeriadoUpdateManyWithWhereWithoutTenantInput | FeriadoUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: FeriadoScalarWhereInput | FeriadoScalarWhereInput[]
  }

  export type ConfiguracionCostosUncheckedUpdateOneWithoutTenantNestedInput = {
    create?: XOR<ConfiguracionCostosCreateWithoutTenantInput, ConfiguracionCostosUncheckedCreateWithoutTenantInput>
    connectOrCreate?: ConfiguracionCostosCreateOrConnectWithoutTenantInput
    upsert?: ConfiguracionCostosUpsertWithoutTenantInput
    disconnect?: ConfiguracionCostosWhereInput | boolean
    delete?: ConfiguracionCostosWhereInput | boolean
    connect?: ConfiguracionCostosWhereUniqueInput
    update?: XOR<XOR<ConfiguracionCostosUpdateToOneWithWhereWithoutTenantInput, ConfiguracionCostosUpdateWithoutTenantInput>, ConfiguracionCostosUncheckedUpdateWithoutTenantInput>
  }

  export type CotizacionUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<CotizacionCreateWithoutTenantInput, CotizacionUncheckedCreateWithoutTenantInput> | CotizacionCreateWithoutTenantInput[] | CotizacionUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: CotizacionCreateOrConnectWithoutTenantInput | CotizacionCreateOrConnectWithoutTenantInput[]
    upsert?: CotizacionUpsertWithWhereUniqueWithoutTenantInput | CotizacionUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: CotizacionCreateManyTenantInputEnvelope
    set?: CotizacionWhereUniqueInput | CotizacionWhereUniqueInput[]
    disconnect?: CotizacionWhereUniqueInput | CotizacionWhereUniqueInput[]
    delete?: CotizacionWhereUniqueInput | CotizacionWhereUniqueInput[]
    connect?: CotizacionWhereUniqueInput | CotizacionWhereUniqueInput[]
    update?: CotizacionUpdateWithWhereUniqueWithoutTenantInput | CotizacionUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: CotizacionUpdateManyWithWhereWithoutTenantInput | CotizacionUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: CotizacionScalarWhereInput | CotizacionScalarWhereInput[]
  }

  export type TenantCreateNestedOneWithoutUsersInput = {
    create?: XOR<TenantCreateWithoutUsersInput, TenantUncheckedCreateWithoutUsersInput>
    connectOrCreate?: TenantCreateOrConnectWithoutUsersInput
    connect?: TenantWhereUniqueInput
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type TenantUpdateOneRequiredWithoutUsersNestedInput = {
    create?: XOR<TenantCreateWithoutUsersInput, TenantUncheckedCreateWithoutUsersInput>
    connectOrCreate?: TenantCreateOrConnectWithoutUsersInput
    upsert?: TenantUpsertWithoutUsersInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutUsersInput, TenantUpdateWithoutUsersInput>, TenantUncheckedUpdateWithoutUsersInput>
  }

  export type TenantCreateNestedOneWithoutVigiladoresInput = {
    create?: XOR<TenantCreateWithoutVigiladoresInput, TenantUncheckedCreateWithoutVigiladoresInput>
    connectOrCreate?: TenantCreateOrConnectWithoutVigiladoresInput
    connect?: TenantWhereUniqueInput
  }

  export type CredencialCreateNestedManyWithoutVigiladorInput = {
    create?: XOR<CredencialCreateWithoutVigiladorInput, CredencialUncheckedCreateWithoutVigiladorInput> | CredencialCreateWithoutVigiladorInput[] | CredencialUncheckedCreateWithoutVigiladorInput[]
    connectOrCreate?: CredencialCreateOrConnectWithoutVigiladorInput | CredencialCreateOrConnectWithoutVigiladorInput[]
    createMany?: CredencialCreateManyVigiladorInputEnvelope
    connect?: CredencialWhereUniqueInput | CredencialWhereUniqueInput[]
  }

  export type AsignacionCreateNestedManyWithoutVigiladorInput = {
    create?: XOR<AsignacionCreateWithoutVigiladorInput, AsignacionUncheckedCreateWithoutVigiladorInput> | AsignacionCreateWithoutVigiladorInput[] | AsignacionUncheckedCreateWithoutVigiladorInput[]
    connectOrCreate?: AsignacionCreateOrConnectWithoutVigiladorInput | AsignacionCreateOrConnectWithoutVigiladorInput[]
    createMany?: AsignacionCreateManyVigiladorInputEnvelope
    connect?: AsignacionWhereUniqueInput | AsignacionWhereUniqueInput[]
  }

  export type CredencialUncheckedCreateNestedManyWithoutVigiladorInput = {
    create?: XOR<CredencialCreateWithoutVigiladorInput, CredencialUncheckedCreateWithoutVigiladorInput> | CredencialCreateWithoutVigiladorInput[] | CredencialUncheckedCreateWithoutVigiladorInput[]
    connectOrCreate?: CredencialCreateOrConnectWithoutVigiladorInput | CredencialCreateOrConnectWithoutVigiladorInput[]
    createMany?: CredencialCreateManyVigiladorInputEnvelope
    connect?: CredencialWhereUniqueInput | CredencialWhereUniqueInput[]
  }

  export type AsignacionUncheckedCreateNestedManyWithoutVigiladorInput = {
    create?: XOR<AsignacionCreateWithoutVigiladorInput, AsignacionUncheckedCreateWithoutVigiladorInput> | AsignacionCreateWithoutVigiladorInput[] | AsignacionUncheckedCreateWithoutVigiladorInput[]
    connectOrCreate?: AsignacionCreateOrConnectWithoutVigiladorInput | AsignacionCreateOrConnectWithoutVigiladorInput[]
    createMany?: AsignacionCreateManyVigiladorInputEnvelope
    connect?: AsignacionWhereUniqueInput | AsignacionWhereUniqueInput[]
  }

  export type TenantUpdateOneRequiredWithoutVigiladoresNestedInput = {
    create?: XOR<TenantCreateWithoutVigiladoresInput, TenantUncheckedCreateWithoutVigiladoresInput>
    connectOrCreate?: TenantCreateOrConnectWithoutVigiladoresInput
    upsert?: TenantUpsertWithoutVigiladoresInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutVigiladoresInput, TenantUpdateWithoutVigiladoresInput>, TenantUncheckedUpdateWithoutVigiladoresInput>
  }

  export type CredencialUpdateManyWithoutVigiladorNestedInput = {
    create?: XOR<CredencialCreateWithoutVigiladorInput, CredencialUncheckedCreateWithoutVigiladorInput> | CredencialCreateWithoutVigiladorInput[] | CredencialUncheckedCreateWithoutVigiladorInput[]
    connectOrCreate?: CredencialCreateOrConnectWithoutVigiladorInput | CredencialCreateOrConnectWithoutVigiladorInput[]
    upsert?: CredencialUpsertWithWhereUniqueWithoutVigiladorInput | CredencialUpsertWithWhereUniqueWithoutVigiladorInput[]
    createMany?: CredencialCreateManyVigiladorInputEnvelope
    set?: CredencialWhereUniqueInput | CredencialWhereUniqueInput[]
    disconnect?: CredencialWhereUniqueInput | CredencialWhereUniqueInput[]
    delete?: CredencialWhereUniqueInput | CredencialWhereUniqueInput[]
    connect?: CredencialWhereUniqueInput | CredencialWhereUniqueInput[]
    update?: CredencialUpdateWithWhereUniqueWithoutVigiladorInput | CredencialUpdateWithWhereUniqueWithoutVigiladorInput[]
    updateMany?: CredencialUpdateManyWithWhereWithoutVigiladorInput | CredencialUpdateManyWithWhereWithoutVigiladorInput[]
    deleteMany?: CredencialScalarWhereInput | CredencialScalarWhereInput[]
  }

  export type AsignacionUpdateManyWithoutVigiladorNestedInput = {
    create?: XOR<AsignacionCreateWithoutVigiladorInput, AsignacionUncheckedCreateWithoutVigiladorInput> | AsignacionCreateWithoutVigiladorInput[] | AsignacionUncheckedCreateWithoutVigiladorInput[]
    connectOrCreate?: AsignacionCreateOrConnectWithoutVigiladorInput | AsignacionCreateOrConnectWithoutVigiladorInput[]
    upsert?: AsignacionUpsertWithWhereUniqueWithoutVigiladorInput | AsignacionUpsertWithWhereUniqueWithoutVigiladorInput[]
    createMany?: AsignacionCreateManyVigiladorInputEnvelope
    set?: AsignacionWhereUniqueInput | AsignacionWhereUniqueInput[]
    disconnect?: AsignacionWhereUniqueInput | AsignacionWhereUniqueInput[]
    delete?: AsignacionWhereUniqueInput | AsignacionWhereUniqueInput[]
    connect?: AsignacionWhereUniqueInput | AsignacionWhereUniqueInput[]
    update?: AsignacionUpdateWithWhereUniqueWithoutVigiladorInput | AsignacionUpdateWithWhereUniqueWithoutVigiladorInput[]
    updateMany?: AsignacionUpdateManyWithWhereWithoutVigiladorInput | AsignacionUpdateManyWithWhereWithoutVigiladorInput[]
    deleteMany?: AsignacionScalarWhereInput | AsignacionScalarWhereInput[]
  }

  export type CredencialUncheckedUpdateManyWithoutVigiladorNestedInput = {
    create?: XOR<CredencialCreateWithoutVigiladorInput, CredencialUncheckedCreateWithoutVigiladorInput> | CredencialCreateWithoutVigiladorInput[] | CredencialUncheckedCreateWithoutVigiladorInput[]
    connectOrCreate?: CredencialCreateOrConnectWithoutVigiladorInput | CredencialCreateOrConnectWithoutVigiladorInput[]
    upsert?: CredencialUpsertWithWhereUniqueWithoutVigiladorInput | CredencialUpsertWithWhereUniqueWithoutVigiladorInput[]
    createMany?: CredencialCreateManyVigiladorInputEnvelope
    set?: CredencialWhereUniqueInput | CredencialWhereUniqueInput[]
    disconnect?: CredencialWhereUniqueInput | CredencialWhereUniqueInput[]
    delete?: CredencialWhereUniqueInput | CredencialWhereUniqueInput[]
    connect?: CredencialWhereUniqueInput | CredencialWhereUniqueInput[]
    update?: CredencialUpdateWithWhereUniqueWithoutVigiladorInput | CredencialUpdateWithWhereUniqueWithoutVigiladorInput[]
    updateMany?: CredencialUpdateManyWithWhereWithoutVigiladorInput | CredencialUpdateManyWithWhereWithoutVigiladorInput[]
    deleteMany?: CredencialScalarWhereInput | CredencialScalarWhereInput[]
  }

  export type AsignacionUncheckedUpdateManyWithoutVigiladorNestedInput = {
    create?: XOR<AsignacionCreateWithoutVigiladorInput, AsignacionUncheckedCreateWithoutVigiladorInput> | AsignacionCreateWithoutVigiladorInput[] | AsignacionUncheckedCreateWithoutVigiladorInput[]
    connectOrCreate?: AsignacionCreateOrConnectWithoutVigiladorInput | AsignacionCreateOrConnectWithoutVigiladorInput[]
    upsert?: AsignacionUpsertWithWhereUniqueWithoutVigiladorInput | AsignacionUpsertWithWhereUniqueWithoutVigiladorInput[]
    createMany?: AsignacionCreateManyVigiladorInputEnvelope
    set?: AsignacionWhereUniqueInput | AsignacionWhereUniqueInput[]
    disconnect?: AsignacionWhereUniqueInput | AsignacionWhereUniqueInput[]
    delete?: AsignacionWhereUniqueInput | AsignacionWhereUniqueInput[]
    connect?: AsignacionWhereUniqueInput | AsignacionWhereUniqueInput[]
    update?: AsignacionUpdateWithWhereUniqueWithoutVigiladorInput | AsignacionUpdateWithWhereUniqueWithoutVigiladorInput[]
    updateMany?: AsignacionUpdateManyWithWhereWithoutVigiladorInput | AsignacionUpdateManyWithWhereWithoutVigiladorInput[]
    deleteMany?: AsignacionScalarWhereInput | AsignacionScalarWhereInput[]
  }

  export type TenantCreateNestedOneWithoutCredencialesInput = {
    create?: XOR<TenantCreateWithoutCredencialesInput, TenantUncheckedCreateWithoutCredencialesInput>
    connectOrCreate?: TenantCreateOrConnectWithoutCredencialesInput
    connect?: TenantWhereUniqueInput
  }

  export type VigiladorCreateNestedOneWithoutCredencialesInput = {
    create?: XOR<VigiladorCreateWithoutCredencialesInput, VigiladorUncheckedCreateWithoutCredencialesInput>
    connectOrCreate?: VigiladorCreateOrConnectWithoutCredencialesInput
    connect?: VigiladorWhereUniqueInput
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type TenantUpdateOneRequiredWithoutCredencialesNestedInput = {
    create?: XOR<TenantCreateWithoutCredencialesInput, TenantUncheckedCreateWithoutCredencialesInput>
    connectOrCreate?: TenantCreateOrConnectWithoutCredencialesInput
    upsert?: TenantUpsertWithoutCredencialesInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutCredencialesInput, TenantUpdateWithoutCredencialesInput>, TenantUncheckedUpdateWithoutCredencialesInput>
  }

  export type VigiladorUpdateOneRequiredWithoutCredencialesNestedInput = {
    create?: XOR<VigiladorCreateWithoutCredencialesInput, VigiladorUncheckedCreateWithoutCredencialesInput>
    connectOrCreate?: VigiladorCreateOrConnectWithoutCredencialesInput
    upsert?: VigiladorUpsertWithoutCredencialesInput
    connect?: VigiladorWhereUniqueInput
    update?: XOR<XOR<VigiladorUpdateToOneWithWhereWithoutCredencialesInput, VigiladorUpdateWithoutCredencialesInput>, VigiladorUncheckedUpdateWithoutCredencialesInput>
  }

  export type TenantCreateNestedOneWithoutObjetivosInput = {
    create?: XOR<TenantCreateWithoutObjetivosInput, TenantUncheckedCreateWithoutObjetivosInput>
    connectOrCreate?: TenantCreateOrConnectWithoutObjetivosInput
    connect?: TenantWhereUniqueInput
  }

  export type PuestoCreateNestedManyWithoutObjetivoInput = {
    create?: XOR<PuestoCreateWithoutObjetivoInput, PuestoUncheckedCreateWithoutObjetivoInput> | PuestoCreateWithoutObjetivoInput[] | PuestoUncheckedCreateWithoutObjetivoInput[]
    connectOrCreate?: PuestoCreateOrConnectWithoutObjetivoInput | PuestoCreateOrConnectWithoutObjetivoInput[]
    createMany?: PuestoCreateManyObjetivoInputEnvelope
    connect?: PuestoWhereUniqueInput | PuestoWhereUniqueInput[]
  }

  export type PuestoUncheckedCreateNestedManyWithoutObjetivoInput = {
    create?: XOR<PuestoCreateWithoutObjetivoInput, PuestoUncheckedCreateWithoutObjetivoInput> | PuestoCreateWithoutObjetivoInput[] | PuestoUncheckedCreateWithoutObjetivoInput[]
    connectOrCreate?: PuestoCreateOrConnectWithoutObjetivoInput | PuestoCreateOrConnectWithoutObjetivoInput[]
    createMany?: PuestoCreateManyObjetivoInputEnvelope
    connect?: PuestoWhereUniqueInput | PuestoWhereUniqueInput[]
  }

  export type TenantUpdateOneRequiredWithoutObjetivosNestedInput = {
    create?: XOR<TenantCreateWithoutObjetivosInput, TenantUncheckedCreateWithoutObjetivosInput>
    connectOrCreate?: TenantCreateOrConnectWithoutObjetivosInput
    upsert?: TenantUpsertWithoutObjetivosInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutObjetivosInput, TenantUpdateWithoutObjetivosInput>, TenantUncheckedUpdateWithoutObjetivosInput>
  }

  export type PuestoUpdateManyWithoutObjetivoNestedInput = {
    create?: XOR<PuestoCreateWithoutObjetivoInput, PuestoUncheckedCreateWithoutObjetivoInput> | PuestoCreateWithoutObjetivoInput[] | PuestoUncheckedCreateWithoutObjetivoInput[]
    connectOrCreate?: PuestoCreateOrConnectWithoutObjetivoInput | PuestoCreateOrConnectWithoutObjetivoInput[]
    upsert?: PuestoUpsertWithWhereUniqueWithoutObjetivoInput | PuestoUpsertWithWhereUniqueWithoutObjetivoInput[]
    createMany?: PuestoCreateManyObjetivoInputEnvelope
    set?: PuestoWhereUniqueInput | PuestoWhereUniqueInput[]
    disconnect?: PuestoWhereUniqueInput | PuestoWhereUniqueInput[]
    delete?: PuestoWhereUniqueInput | PuestoWhereUniqueInput[]
    connect?: PuestoWhereUniqueInput | PuestoWhereUniqueInput[]
    update?: PuestoUpdateWithWhereUniqueWithoutObjetivoInput | PuestoUpdateWithWhereUniqueWithoutObjetivoInput[]
    updateMany?: PuestoUpdateManyWithWhereWithoutObjetivoInput | PuestoUpdateManyWithWhereWithoutObjetivoInput[]
    deleteMany?: PuestoScalarWhereInput | PuestoScalarWhereInput[]
  }

  export type PuestoUncheckedUpdateManyWithoutObjetivoNestedInput = {
    create?: XOR<PuestoCreateWithoutObjetivoInput, PuestoUncheckedCreateWithoutObjetivoInput> | PuestoCreateWithoutObjetivoInput[] | PuestoUncheckedCreateWithoutObjetivoInput[]
    connectOrCreate?: PuestoCreateOrConnectWithoutObjetivoInput | PuestoCreateOrConnectWithoutObjetivoInput[]
    upsert?: PuestoUpsertWithWhereUniqueWithoutObjetivoInput | PuestoUpsertWithWhereUniqueWithoutObjetivoInput[]
    createMany?: PuestoCreateManyObjetivoInputEnvelope
    set?: PuestoWhereUniqueInput | PuestoWhereUniqueInput[]
    disconnect?: PuestoWhereUniqueInput | PuestoWhereUniqueInput[]
    delete?: PuestoWhereUniqueInput | PuestoWhereUniqueInput[]
    connect?: PuestoWhereUniqueInput | PuestoWhereUniqueInput[]
    update?: PuestoUpdateWithWhereUniqueWithoutObjetivoInput | PuestoUpdateWithWhereUniqueWithoutObjetivoInput[]
    updateMany?: PuestoUpdateManyWithWhereWithoutObjetivoInput | PuestoUpdateManyWithWhereWithoutObjetivoInput[]
    deleteMany?: PuestoScalarWhereInput | PuestoScalarWhereInput[]
  }

  export type TenantCreateNestedOneWithoutPuestosInput = {
    create?: XOR<TenantCreateWithoutPuestosInput, TenantUncheckedCreateWithoutPuestosInput>
    connectOrCreate?: TenantCreateOrConnectWithoutPuestosInput
    connect?: TenantWhereUniqueInput
  }

  export type ObjetivoCreateNestedOneWithoutPuestosInput = {
    create?: XOR<ObjetivoCreateWithoutPuestosInput, ObjetivoUncheckedCreateWithoutPuestosInput>
    connectOrCreate?: ObjetivoCreateOrConnectWithoutPuestosInput
    connect?: ObjetivoWhereUniqueInput
  }

  export type AsignacionCreateNestedManyWithoutPuestoInput = {
    create?: XOR<AsignacionCreateWithoutPuestoInput, AsignacionUncheckedCreateWithoutPuestoInput> | AsignacionCreateWithoutPuestoInput[] | AsignacionUncheckedCreateWithoutPuestoInput[]
    connectOrCreate?: AsignacionCreateOrConnectWithoutPuestoInput | AsignacionCreateOrConnectWithoutPuestoInput[]
    createMany?: AsignacionCreateManyPuestoInputEnvelope
    connect?: AsignacionWhereUniqueInput | AsignacionWhereUniqueInput[]
  }

  export type AsignacionUncheckedCreateNestedManyWithoutPuestoInput = {
    create?: XOR<AsignacionCreateWithoutPuestoInput, AsignacionUncheckedCreateWithoutPuestoInput> | AsignacionCreateWithoutPuestoInput[] | AsignacionUncheckedCreateWithoutPuestoInput[]
    connectOrCreate?: AsignacionCreateOrConnectWithoutPuestoInput | AsignacionCreateOrConnectWithoutPuestoInput[]
    createMany?: AsignacionCreateManyPuestoInputEnvelope
    connect?: AsignacionWhereUniqueInput | AsignacionWhereUniqueInput[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type TenantUpdateOneRequiredWithoutPuestosNestedInput = {
    create?: XOR<TenantCreateWithoutPuestosInput, TenantUncheckedCreateWithoutPuestosInput>
    connectOrCreate?: TenantCreateOrConnectWithoutPuestosInput
    upsert?: TenantUpsertWithoutPuestosInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutPuestosInput, TenantUpdateWithoutPuestosInput>, TenantUncheckedUpdateWithoutPuestosInput>
  }

  export type ObjetivoUpdateOneWithoutPuestosNestedInput = {
    create?: XOR<ObjetivoCreateWithoutPuestosInput, ObjetivoUncheckedCreateWithoutPuestosInput>
    connectOrCreate?: ObjetivoCreateOrConnectWithoutPuestosInput
    upsert?: ObjetivoUpsertWithoutPuestosInput
    disconnect?: ObjetivoWhereInput | boolean
    delete?: ObjetivoWhereInput | boolean
    connect?: ObjetivoWhereUniqueInput
    update?: XOR<XOR<ObjetivoUpdateToOneWithWhereWithoutPuestosInput, ObjetivoUpdateWithoutPuestosInput>, ObjetivoUncheckedUpdateWithoutPuestosInput>
  }

  export type AsignacionUpdateManyWithoutPuestoNestedInput = {
    create?: XOR<AsignacionCreateWithoutPuestoInput, AsignacionUncheckedCreateWithoutPuestoInput> | AsignacionCreateWithoutPuestoInput[] | AsignacionUncheckedCreateWithoutPuestoInput[]
    connectOrCreate?: AsignacionCreateOrConnectWithoutPuestoInput | AsignacionCreateOrConnectWithoutPuestoInput[]
    upsert?: AsignacionUpsertWithWhereUniqueWithoutPuestoInput | AsignacionUpsertWithWhereUniqueWithoutPuestoInput[]
    createMany?: AsignacionCreateManyPuestoInputEnvelope
    set?: AsignacionWhereUniqueInput | AsignacionWhereUniqueInput[]
    disconnect?: AsignacionWhereUniqueInput | AsignacionWhereUniqueInput[]
    delete?: AsignacionWhereUniqueInput | AsignacionWhereUniqueInput[]
    connect?: AsignacionWhereUniqueInput | AsignacionWhereUniqueInput[]
    update?: AsignacionUpdateWithWhereUniqueWithoutPuestoInput | AsignacionUpdateWithWhereUniqueWithoutPuestoInput[]
    updateMany?: AsignacionUpdateManyWithWhereWithoutPuestoInput | AsignacionUpdateManyWithWhereWithoutPuestoInput[]
    deleteMany?: AsignacionScalarWhereInput | AsignacionScalarWhereInput[]
  }

  export type AsignacionUncheckedUpdateManyWithoutPuestoNestedInput = {
    create?: XOR<AsignacionCreateWithoutPuestoInput, AsignacionUncheckedCreateWithoutPuestoInput> | AsignacionCreateWithoutPuestoInput[] | AsignacionUncheckedCreateWithoutPuestoInput[]
    connectOrCreate?: AsignacionCreateOrConnectWithoutPuestoInput | AsignacionCreateOrConnectWithoutPuestoInput[]
    upsert?: AsignacionUpsertWithWhereUniqueWithoutPuestoInput | AsignacionUpsertWithWhereUniqueWithoutPuestoInput[]
    createMany?: AsignacionCreateManyPuestoInputEnvelope
    set?: AsignacionWhereUniqueInput | AsignacionWhereUniqueInput[]
    disconnect?: AsignacionWhereUniqueInput | AsignacionWhereUniqueInput[]
    delete?: AsignacionWhereUniqueInput | AsignacionWhereUniqueInput[]
    connect?: AsignacionWhereUniqueInput | AsignacionWhereUniqueInput[]
    update?: AsignacionUpdateWithWhereUniqueWithoutPuestoInput | AsignacionUpdateWithWhereUniqueWithoutPuestoInput[]
    updateMany?: AsignacionUpdateManyWithWhereWithoutPuestoInput | AsignacionUpdateManyWithWhereWithoutPuestoInput[]
    deleteMany?: AsignacionScalarWhereInput | AsignacionScalarWhereInput[]
  }

  export type TenantCreateNestedOneWithoutAsignacionesInput = {
    create?: XOR<TenantCreateWithoutAsignacionesInput, TenantUncheckedCreateWithoutAsignacionesInput>
    connectOrCreate?: TenantCreateOrConnectWithoutAsignacionesInput
    connect?: TenantWhereUniqueInput
  }

  export type PuestoCreateNestedOneWithoutAsignacionesInput = {
    create?: XOR<PuestoCreateWithoutAsignacionesInput, PuestoUncheckedCreateWithoutAsignacionesInput>
    connectOrCreate?: PuestoCreateOrConnectWithoutAsignacionesInput
    connect?: PuestoWhereUniqueInput
  }

  export type VigiladorCreateNestedOneWithoutAsignacionesInput = {
    create?: XOR<VigiladorCreateWithoutAsignacionesInput, VigiladorUncheckedCreateWithoutAsignacionesInput>
    connectOrCreate?: VigiladorCreateOrConnectWithoutAsignacionesInput
    connect?: VigiladorWhereUniqueInput
  }

  export type AsistenciaCreateNestedOneWithoutAsignacionInput = {
    create?: XOR<AsistenciaCreateWithoutAsignacionInput, AsistenciaUncheckedCreateWithoutAsignacionInput>
    connectOrCreate?: AsistenciaCreateOrConnectWithoutAsignacionInput
    connect?: AsistenciaWhereUniqueInput
  }

  export type AsistenciaUncheckedCreateNestedOneWithoutAsignacionInput = {
    create?: XOR<AsistenciaCreateWithoutAsignacionInput, AsistenciaUncheckedCreateWithoutAsignacionInput>
    connectOrCreate?: AsistenciaCreateOrConnectWithoutAsignacionInput
    connect?: AsistenciaWhereUniqueInput
  }

  export type TenantUpdateOneRequiredWithoutAsignacionesNestedInput = {
    create?: XOR<TenantCreateWithoutAsignacionesInput, TenantUncheckedCreateWithoutAsignacionesInput>
    connectOrCreate?: TenantCreateOrConnectWithoutAsignacionesInput
    upsert?: TenantUpsertWithoutAsignacionesInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutAsignacionesInput, TenantUpdateWithoutAsignacionesInput>, TenantUncheckedUpdateWithoutAsignacionesInput>
  }

  export type PuestoUpdateOneRequiredWithoutAsignacionesNestedInput = {
    create?: XOR<PuestoCreateWithoutAsignacionesInput, PuestoUncheckedCreateWithoutAsignacionesInput>
    connectOrCreate?: PuestoCreateOrConnectWithoutAsignacionesInput
    upsert?: PuestoUpsertWithoutAsignacionesInput
    connect?: PuestoWhereUniqueInput
    update?: XOR<XOR<PuestoUpdateToOneWithWhereWithoutAsignacionesInput, PuestoUpdateWithoutAsignacionesInput>, PuestoUncheckedUpdateWithoutAsignacionesInput>
  }

  export type VigiladorUpdateOneWithoutAsignacionesNestedInput = {
    create?: XOR<VigiladorCreateWithoutAsignacionesInput, VigiladorUncheckedCreateWithoutAsignacionesInput>
    connectOrCreate?: VigiladorCreateOrConnectWithoutAsignacionesInput
    upsert?: VigiladorUpsertWithoutAsignacionesInput
    disconnect?: VigiladorWhereInput | boolean
    delete?: VigiladorWhereInput | boolean
    connect?: VigiladorWhereUniqueInput
    update?: XOR<XOR<VigiladorUpdateToOneWithWhereWithoutAsignacionesInput, VigiladorUpdateWithoutAsignacionesInput>, VigiladorUncheckedUpdateWithoutAsignacionesInput>
  }

  export type AsistenciaUpdateOneWithoutAsignacionNestedInput = {
    create?: XOR<AsistenciaCreateWithoutAsignacionInput, AsistenciaUncheckedCreateWithoutAsignacionInput>
    connectOrCreate?: AsistenciaCreateOrConnectWithoutAsignacionInput
    upsert?: AsistenciaUpsertWithoutAsignacionInput
    disconnect?: AsistenciaWhereInput | boolean
    delete?: AsistenciaWhereInput | boolean
    connect?: AsistenciaWhereUniqueInput
    update?: XOR<XOR<AsistenciaUpdateToOneWithWhereWithoutAsignacionInput, AsistenciaUpdateWithoutAsignacionInput>, AsistenciaUncheckedUpdateWithoutAsignacionInput>
  }

  export type AsistenciaUncheckedUpdateOneWithoutAsignacionNestedInput = {
    create?: XOR<AsistenciaCreateWithoutAsignacionInput, AsistenciaUncheckedCreateWithoutAsignacionInput>
    connectOrCreate?: AsistenciaCreateOrConnectWithoutAsignacionInput
    upsert?: AsistenciaUpsertWithoutAsignacionInput
    disconnect?: AsistenciaWhereInput | boolean
    delete?: AsistenciaWhereInput | boolean
    connect?: AsistenciaWhereUniqueInput
    update?: XOR<XOR<AsistenciaUpdateToOneWithWhereWithoutAsignacionInput, AsistenciaUpdateWithoutAsignacionInput>, AsistenciaUncheckedUpdateWithoutAsignacionInput>
  }

  export type TenantCreateNestedOneWithoutAsistenciasInput = {
    create?: XOR<TenantCreateWithoutAsistenciasInput, TenantUncheckedCreateWithoutAsistenciasInput>
    connectOrCreate?: TenantCreateOrConnectWithoutAsistenciasInput
    connect?: TenantWhereUniqueInput
  }

  export type AsignacionCreateNestedOneWithoutAsistenciaInput = {
    create?: XOR<AsignacionCreateWithoutAsistenciaInput, AsignacionUncheckedCreateWithoutAsistenciaInput>
    connectOrCreate?: AsignacionCreateOrConnectWithoutAsistenciaInput
    connect?: AsignacionWhereUniqueInput
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type TenantUpdateOneRequiredWithoutAsistenciasNestedInput = {
    create?: XOR<TenantCreateWithoutAsistenciasInput, TenantUncheckedCreateWithoutAsistenciasInput>
    connectOrCreate?: TenantCreateOrConnectWithoutAsistenciasInput
    upsert?: TenantUpsertWithoutAsistenciasInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutAsistenciasInput, TenantUpdateWithoutAsistenciasInput>, TenantUncheckedUpdateWithoutAsistenciasInput>
  }

  export type AsignacionUpdateOneRequiredWithoutAsistenciaNestedInput = {
    create?: XOR<AsignacionCreateWithoutAsistenciaInput, AsignacionUncheckedCreateWithoutAsistenciaInput>
    connectOrCreate?: AsignacionCreateOrConnectWithoutAsistenciaInput
    upsert?: AsignacionUpsertWithoutAsistenciaInput
    connect?: AsignacionWhereUniqueInput
    update?: XOR<XOR<AsignacionUpdateToOneWithWhereWithoutAsistenciaInput, AsignacionUpdateWithoutAsistenciaInput>, AsignacionUncheckedUpdateWithoutAsistenciaInput>
  }

  export type TenantCreateNestedOneWithoutFeriadosInput = {
    create?: XOR<TenantCreateWithoutFeriadosInput, TenantUncheckedCreateWithoutFeriadosInput>
    connectOrCreate?: TenantCreateOrConnectWithoutFeriadosInput
    connect?: TenantWhereUniqueInput
  }

  export type TenantUpdateOneRequiredWithoutFeriadosNestedInput = {
    create?: XOR<TenantCreateWithoutFeriadosInput, TenantUncheckedCreateWithoutFeriadosInput>
    connectOrCreate?: TenantCreateOrConnectWithoutFeriadosInput
    upsert?: TenantUpsertWithoutFeriadosInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutFeriadosInput, TenantUpdateWithoutFeriadosInput>, TenantUncheckedUpdateWithoutFeriadosInput>
  }

  export type TenantCreateNestedOneWithoutConfiguracion_costosInput = {
    create?: XOR<TenantCreateWithoutConfiguracion_costosInput, TenantUncheckedCreateWithoutConfiguracion_costosInput>
    connectOrCreate?: TenantCreateOrConnectWithoutConfiguracion_costosInput
    connect?: TenantWhereUniqueInput
  }

  export type TenantUpdateOneRequiredWithoutConfiguracion_costosNestedInput = {
    create?: XOR<TenantCreateWithoutConfiguracion_costosInput, TenantUncheckedCreateWithoutConfiguracion_costosInput>
    connectOrCreate?: TenantCreateOrConnectWithoutConfiguracion_costosInput
    upsert?: TenantUpsertWithoutConfiguracion_costosInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutConfiguracion_costosInput, TenantUpdateWithoutConfiguracion_costosInput>, TenantUncheckedUpdateWithoutConfiguracion_costosInput>
  }

  export type TenantCreateNestedOneWithoutCotizacionesInput = {
    create?: XOR<TenantCreateWithoutCotizacionesInput, TenantUncheckedCreateWithoutCotizacionesInput>
    connectOrCreate?: TenantCreateOrConnectWithoutCotizacionesInput
    connect?: TenantWhereUniqueInput
  }

  export type CotizacionItemCreateNestedManyWithoutCotizacionInput = {
    create?: XOR<CotizacionItemCreateWithoutCotizacionInput, CotizacionItemUncheckedCreateWithoutCotizacionInput> | CotizacionItemCreateWithoutCotizacionInput[] | CotizacionItemUncheckedCreateWithoutCotizacionInput[]
    connectOrCreate?: CotizacionItemCreateOrConnectWithoutCotizacionInput | CotizacionItemCreateOrConnectWithoutCotizacionInput[]
    createMany?: CotizacionItemCreateManyCotizacionInputEnvelope
    connect?: CotizacionItemWhereUniqueInput | CotizacionItemWhereUniqueInput[]
  }

  export type CotizacionItemUncheckedCreateNestedManyWithoutCotizacionInput = {
    create?: XOR<CotizacionItemCreateWithoutCotizacionInput, CotizacionItemUncheckedCreateWithoutCotizacionInput> | CotizacionItemCreateWithoutCotizacionInput[] | CotizacionItemUncheckedCreateWithoutCotizacionInput[]
    connectOrCreate?: CotizacionItemCreateOrConnectWithoutCotizacionInput | CotizacionItemCreateOrConnectWithoutCotizacionInput[]
    createMany?: CotizacionItemCreateManyCotizacionInputEnvelope
    connect?: CotizacionItemWhereUniqueInput | CotizacionItemWhereUniqueInput[]
  }

  export type TenantUpdateOneRequiredWithoutCotizacionesNestedInput = {
    create?: XOR<TenantCreateWithoutCotizacionesInput, TenantUncheckedCreateWithoutCotizacionesInput>
    connectOrCreate?: TenantCreateOrConnectWithoutCotizacionesInput
    upsert?: TenantUpsertWithoutCotizacionesInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutCotizacionesInput, TenantUpdateWithoutCotizacionesInput>, TenantUncheckedUpdateWithoutCotizacionesInput>
  }

  export type CotizacionItemUpdateManyWithoutCotizacionNestedInput = {
    create?: XOR<CotizacionItemCreateWithoutCotizacionInput, CotizacionItemUncheckedCreateWithoutCotizacionInput> | CotizacionItemCreateWithoutCotizacionInput[] | CotizacionItemUncheckedCreateWithoutCotizacionInput[]
    connectOrCreate?: CotizacionItemCreateOrConnectWithoutCotizacionInput | CotizacionItemCreateOrConnectWithoutCotizacionInput[]
    upsert?: CotizacionItemUpsertWithWhereUniqueWithoutCotizacionInput | CotizacionItemUpsertWithWhereUniqueWithoutCotizacionInput[]
    createMany?: CotizacionItemCreateManyCotizacionInputEnvelope
    set?: CotizacionItemWhereUniqueInput | CotizacionItemWhereUniqueInput[]
    disconnect?: CotizacionItemWhereUniqueInput | CotizacionItemWhereUniqueInput[]
    delete?: CotizacionItemWhereUniqueInput | CotizacionItemWhereUniqueInput[]
    connect?: CotizacionItemWhereUniqueInput | CotizacionItemWhereUniqueInput[]
    update?: CotizacionItemUpdateWithWhereUniqueWithoutCotizacionInput | CotizacionItemUpdateWithWhereUniqueWithoutCotizacionInput[]
    updateMany?: CotizacionItemUpdateManyWithWhereWithoutCotizacionInput | CotizacionItemUpdateManyWithWhereWithoutCotizacionInput[]
    deleteMany?: CotizacionItemScalarWhereInput | CotizacionItemScalarWhereInput[]
  }

  export type CotizacionItemUncheckedUpdateManyWithoutCotizacionNestedInput = {
    create?: XOR<CotizacionItemCreateWithoutCotizacionInput, CotizacionItemUncheckedCreateWithoutCotizacionInput> | CotizacionItemCreateWithoutCotizacionInput[] | CotizacionItemUncheckedCreateWithoutCotizacionInput[]
    connectOrCreate?: CotizacionItemCreateOrConnectWithoutCotizacionInput | CotizacionItemCreateOrConnectWithoutCotizacionInput[]
    upsert?: CotizacionItemUpsertWithWhereUniqueWithoutCotizacionInput | CotizacionItemUpsertWithWhereUniqueWithoutCotizacionInput[]
    createMany?: CotizacionItemCreateManyCotizacionInputEnvelope
    set?: CotizacionItemWhereUniqueInput | CotizacionItemWhereUniqueInput[]
    disconnect?: CotizacionItemWhereUniqueInput | CotizacionItemWhereUniqueInput[]
    delete?: CotizacionItemWhereUniqueInput | CotizacionItemWhereUniqueInput[]
    connect?: CotizacionItemWhereUniqueInput | CotizacionItemWhereUniqueInput[]
    update?: CotizacionItemUpdateWithWhereUniqueWithoutCotizacionInput | CotizacionItemUpdateWithWhereUniqueWithoutCotizacionInput[]
    updateMany?: CotizacionItemUpdateManyWithWhereWithoutCotizacionInput | CotizacionItemUpdateManyWithWhereWithoutCotizacionInput[]
    deleteMany?: CotizacionItemScalarWhereInput | CotizacionItemScalarWhereInput[]
  }

  export type CotizacionCreateNestedOneWithoutItemsInput = {
    create?: XOR<CotizacionCreateWithoutItemsInput, CotizacionUncheckedCreateWithoutItemsInput>
    connectOrCreate?: CotizacionCreateOrConnectWithoutItemsInput
    connect?: CotizacionWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type CotizacionUpdateOneRequiredWithoutItemsNestedInput = {
    create?: XOR<CotizacionCreateWithoutItemsInput, CotizacionUncheckedCreateWithoutItemsInput>
    connectOrCreate?: CotizacionCreateOrConnectWithoutItemsInput
    upsert?: CotizacionUpsertWithoutItemsInput
    connect?: CotizacionWhereUniqueInput
    update?: XOR<XOR<CotizacionUpdateToOneWithWhereWithoutItemsInput, CotizacionUpdateWithoutItemsInput>, CotizacionUncheckedUpdateWithoutItemsInput>
  }

  export type NestedUuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedUuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedUuidNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidNullableFilter<$PrismaModel> | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedUuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedDecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type UserCreateWithoutTenantInput = {
    id?: string
    email: string
    password: string
    role?: string
    created_at?: Date | string
    updated_at?: Date | string
    deleted_at?: Date | string | null
  }

  export type UserUncheckedCreateWithoutTenantInput = {
    id?: string
    email: string
    password: string
    role?: string
    created_at?: Date | string
    updated_at?: Date | string
    deleted_at?: Date | string | null
  }

  export type UserCreateOrConnectWithoutTenantInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTenantInput, UserUncheckedCreateWithoutTenantInput>
  }

  export type UserCreateManyTenantInputEnvelope = {
    data: UserCreateManyTenantInput | UserCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type VigiladorCreateWithoutTenantInput = {
    id?: string
    legajo_nro: string
    nombre: string
    apellido: string
    documento: string
    estado?: string
    created_at?: Date | string
    updated_at?: Date | string
    deleted_at?: Date | string | null
    credenciales?: CredencialCreateNestedManyWithoutVigiladorInput
    asignaciones?: AsignacionCreateNestedManyWithoutVigiladorInput
  }

  export type VigiladorUncheckedCreateWithoutTenantInput = {
    id?: string
    legajo_nro: string
    nombre: string
    apellido: string
    documento: string
    estado?: string
    created_at?: Date | string
    updated_at?: Date | string
    deleted_at?: Date | string | null
    credenciales?: CredencialUncheckedCreateNestedManyWithoutVigiladorInput
    asignaciones?: AsignacionUncheckedCreateNestedManyWithoutVigiladorInput
  }

  export type VigiladorCreateOrConnectWithoutTenantInput = {
    where: VigiladorWhereUniqueInput
    create: XOR<VigiladorCreateWithoutTenantInput, VigiladorUncheckedCreateWithoutTenantInput>
  }

  export type VigiladorCreateManyTenantInputEnvelope = {
    data: VigiladorCreateManyTenantInput | VigiladorCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type CredencialCreateWithoutTenantInput = {
    id?: string
    tipo: string
    numero?: string | null
    organismo?: string | null
    emitida_el?: Date | string | null
    vence_el?: Date | string | null
    created_at?: Date | string
    vigilador: VigiladorCreateNestedOneWithoutCredencialesInput
  }

  export type CredencialUncheckedCreateWithoutTenantInput = {
    id?: string
    vigilador_id: string
    tipo: string
    numero?: string | null
    organismo?: string | null
    emitida_el?: Date | string | null
    vence_el?: Date | string | null
    created_at?: Date | string
  }

  export type CredencialCreateOrConnectWithoutTenantInput = {
    where: CredencialWhereUniqueInput
    create: XOR<CredencialCreateWithoutTenantInput, CredencialUncheckedCreateWithoutTenantInput>
  }

  export type CredencialCreateManyTenantInputEnvelope = {
    data: CredencialCreateManyTenantInput | CredencialCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type ObjetivoCreateWithoutTenantInput = {
    id?: string
    cliente_id: string
    codigo: string
    nombre: string
    direccion?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    puestos?: PuestoCreateNestedManyWithoutObjetivoInput
  }

  export type ObjetivoUncheckedCreateWithoutTenantInput = {
    id?: string
    cliente_id: string
    codigo: string
    nombre: string
    direccion?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    puestos?: PuestoUncheckedCreateNestedManyWithoutObjetivoInput
  }

  export type ObjetivoCreateOrConnectWithoutTenantInput = {
    where: ObjetivoWhereUniqueInput
    create: XOR<ObjetivoCreateWithoutTenantInput, ObjetivoUncheckedCreateWithoutTenantInput>
  }

  export type ObjetivoCreateManyTenantInputEnvelope = {
    data: ObjetivoCreateManyTenantInput | ObjetivoCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type PuestoCreateWithoutTenantInput = {
    id?: string
    nombre: string
    ubicacion?: string | null
    requiere_arma?: boolean
    requiere_movil?: boolean
    esquema_horario?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string
    updated_at?: Date | string
    objetivo?: ObjetivoCreateNestedOneWithoutPuestosInput
    asignaciones?: AsignacionCreateNestedManyWithoutPuestoInput
  }

  export type PuestoUncheckedCreateWithoutTenantInput = {
    id?: string
    objetivo_id?: string | null
    nombre: string
    ubicacion?: string | null
    requiere_arma?: boolean
    requiere_movil?: boolean
    esquema_horario?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string
    updated_at?: Date | string
    asignaciones?: AsignacionUncheckedCreateNestedManyWithoutPuestoInput
  }

  export type PuestoCreateOrConnectWithoutTenantInput = {
    where: PuestoWhereUniqueInput
    create: XOR<PuestoCreateWithoutTenantInput, PuestoUncheckedCreateWithoutTenantInput>
  }

  export type PuestoCreateManyTenantInputEnvelope = {
    data: PuestoCreateManyTenantInput | PuestoCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type AsignacionCreateWithoutTenantInput = {
    id?: string
    fecha: Date | string
    hora_inicio: string
    hora_fin: string
    estado?: string
    created_at?: Date | string
    puesto: PuestoCreateNestedOneWithoutAsignacionesInput
    vigilador?: VigiladorCreateNestedOneWithoutAsignacionesInput
    asistencia?: AsistenciaCreateNestedOneWithoutAsignacionInput
  }

  export type AsignacionUncheckedCreateWithoutTenantInput = {
    id?: string
    puesto_id: string
    vigilador_id?: string | null
    fecha: Date | string
    hora_inicio: string
    hora_fin: string
    estado?: string
    created_at?: Date | string
    asistencia?: AsistenciaUncheckedCreateNestedOneWithoutAsignacionInput
  }

  export type AsignacionCreateOrConnectWithoutTenantInput = {
    where: AsignacionWhereUniqueInput
    create: XOR<AsignacionCreateWithoutTenantInput, AsignacionUncheckedCreateWithoutTenantInput>
  }

  export type AsignacionCreateManyTenantInputEnvelope = {
    data: AsignacionCreateManyTenantInput | AsignacionCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type AsistenciaCreateWithoutTenantInput = {
    id?: string
    inicio_real?: Date | string | null
    fin_real?: Date | string | null
    metodo?: string | null
    lat?: Decimal | DecimalJsLike | number | string | null
    lng?: Decimal | DecimalJsLike | number | string | null
    asignacion: AsignacionCreateNestedOneWithoutAsistenciaInput
  }

  export type AsistenciaUncheckedCreateWithoutTenantInput = {
    id?: string
    asignacion_id: string
    inicio_real?: Date | string | null
    fin_real?: Date | string | null
    metodo?: string | null
    lat?: Decimal | DecimalJsLike | number | string | null
    lng?: Decimal | DecimalJsLike | number | string | null
  }

  export type AsistenciaCreateOrConnectWithoutTenantInput = {
    where: AsistenciaWhereUniqueInput
    create: XOR<AsistenciaCreateWithoutTenantInput, AsistenciaUncheckedCreateWithoutTenantInput>
  }

  export type AsistenciaCreateManyTenantInputEnvelope = {
    data: AsistenciaCreateManyTenantInput | AsistenciaCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type FeriadoCreateWithoutTenantInput = {
    id?: string
    nombre: string
    fecha: Date | string
    created_at?: Date | string
  }

  export type FeriadoUncheckedCreateWithoutTenantInput = {
    id?: string
    nombre: string
    fecha: Date | string
    created_at?: Date | string
  }

  export type FeriadoCreateOrConnectWithoutTenantInput = {
    where: FeriadoWhereUniqueInput
    create: XOR<FeriadoCreateWithoutTenantInput, FeriadoUncheckedCreateWithoutTenantInput>
  }

  export type FeriadoCreateManyTenantInputEnvelope = {
    data: FeriadoCreateManyTenantInput | FeriadoCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type ConfiguracionCostosCreateWithoutTenantInput = {
    id?: string
    costo_hora_base: Decimal | DecimalJsLike | number | string
    cargas_sociales: Decimal | DecimalJsLike | number | string
    costos_uniforme: Decimal | DecimalJsLike | number | string
    otros_costos: Decimal | DecimalJsLike | number | string
    factor_ajuste?: Decimal | DecimalJsLike | number | string
    updated_at?: Date | string
  }

  export type ConfiguracionCostosUncheckedCreateWithoutTenantInput = {
    id?: string
    costo_hora_base: Decimal | DecimalJsLike | number | string
    cargas_sociales: Decimal | DecimalJsLike | number | string
    costos_uniforme: Decimal | DecimalJsLike | number | string
    otros_costos: Decimal | DecimalJsLike | number | string
    factor_ajuste?: Decimal | DecimalJsLike | number | string
    updated_at?: Date | string
  }

  export type ConfiguracionCostosCreateOrConnectWithoutTenantInput = {
    where: ConfiguracionCostosWhereUniqueInput
    create: XOR<ConfiguracionCostosCreateWithoutTenantInput, ConfiguracionCostosUncheckedCreateWithoutTenantInput>
  }

  export type CotizacionCreateWithoutTenantInput = {
    id?: string
    cliente_nombre: string
    vencimiento: Date | string
    estado?: string
    total_mensual: Decimal | DecimalJsLike | number | string
    created_at?: Date | string
    updated_at?: Date | string
    items?: CotizacionItemCreateNestedManyWithoutCotizacionInput
  }

  export type CotizacionUncheckedCreateWithoutTenantInput = {
    id?: string
    cliente_nombre: string
    vencimiento: Date | string
    estado?: string
    total_mensual: Decimal | DecimalJsLike | number | string
    created_at?: Date | string
    updated_at?: Date | string
    items?: CotizacionItemUncheckedCreateNestedManyWithoutCotizacionInput
  }

  export type CotizacionCreateOrConnectWithoutTenantInput = {
    where: CotizacionWhereUniqueInput
    create: XOR<CotizacionCreateWithoutTenantInput, CotizacionUncheckedCreateWithoutTenantInput>
  }

  export type CotizacionCreateManyTenantInputEnvelope = {
    data: CotizacionCreateManyTenantInput | CotizacionCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithWhereUniqueWithoutTenantInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutTenantInput, UserUncheckedUpdateWithoutTenantInput>
    create: XOR<UserCreateWithoutTenantInput, UserUncheckedCreateWithoutTenantInput>
  }

  export type UserUpdateWithWhereUniqueWithoutTenantInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutTenantInput, UserUncheckedUpdateWithoutTenantInput>
  }

  export type UserUpdateManyWithWhereWithoutTenantInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutTenantInput>
  }

  export type UserScalarWhereInput = {
    AND?: UserScalarWhereInput | UserScalarWhereInput[]
    OR?: UserScalarWhereInput[]
    NOT?: UserScalarWhereInput | UserScalarWhereInput[]
    id?: UuidFilter<"User"> | string
    tenant_id?: UuidFilter<"User"> | string
    email?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    role?: StringFilter<"User"> | string
    created_at?: DateTimeFilter<"User"> | Date | string
    updated_at?: DateTimeFilter<"User"> | Date | string
    deleted_at?: DateTimeNullableFilter<"User"> | Date | string | null
  }

  export type VigiladorUpsertWithWhereUniqueWithoutTenantInput = {
    where: VigiladorWhereUniqueInput
    update: XOR<VigiladorUpdateWithoutTenantInput, VigiladorUncheckedUpdateWithoutTenantInput>
    create: XOR<VigiladorCreateWithoutTenantInput, VigiladorUncheckedCreateWithoutTenantInput>
  }

  export type VigiladorUpdateWithWhereUniqueWithoutTenantInput = {
    where: VigiladorWhereUniqueInput
    data: XOR<VigiladorUpdateWithoutTenantInput, VigiladorUncheckedUpdateWithoutTenantInput>
  }

  export type VigiladorUpdateManyWithWhereWithoutTenantInput = {
    where: VigiladorScalarWhereInput
    data: XOR<VigiladorUpdateManyMutationInput, VigiladorUncheckedUpdateManyWithoutTenantInput>
  }

  export type VigiladorScalarWhereInput = {
    AND?: VigiladorScalarWhereInput | VigiladorScalarWhereInput[]
    OR?: VigiladorScalarWhereInput[]
    NOT?: VigiladorScalarWhereInput | VigiladorScalarWhereInput[]
    id?: UuidFilter<"Vigilador"> | string
    tenant_id?: UuidFilter<"Vigilador"> | string
    legajo_nro?: StringFilter<"Vigilador"> | string
    nombre?: StringFilter<"Vigilador"> | string
    apellido?: StringFilter<"Vigilador"> | string
    documento?: StringFilter<"Vigilador"> | string
    estado?: StringFilter<"Vigilador"> | string
    created_at?: DateTimeFilter<"Vigilador"> | Date | string
    updated_at?: DateTimeFilter<"Vigilador"> | Date | string
    deleted_at?: DateTimeNullableFilter<"Vigilador"> | Date | string | null
  }

  export type CredencialUpsertWithWhereUniqueWithoutTenantInput = {
    where: CredencialWhereUniqueInput
    update: XOR<CredencialUpdateWithoutTenantInput, CredencialUncheckedUpdateWithoutTenantInput>
    create: XOR<CredencialCreateWithoutTenantInput, CredencialUncheckedCreateWithoutTenantInput>
  }

  export type CredencialUpdateWithWhereUniqueWithoutTenantInput = {
    where: CredencialWhereUniqueInput
    data: XOR<CredencialUpdateWithoutTenantInput, CredencialUncheckedUpdateWithoutTenantInput>
  }

  export type CredencialUpdateManyWithWhereWithoutTenantInput = {
    where: CredencialScalarWhereInput
    data: XOR<CredencialUpdateManyMutationInput, CredencialUncheckedUpdateManyWithoutTenantInput>
  }

  export type CredencialScalarWhereInput = {
    AND?: CredencialScalarWhereInput | CredencialScalarWhereInput[]
    OR?: CredencialScalarWhereInput[]
    NOT?: CredencialScalarWhereInput | CredencialScalarWhereInput[]
    id?: UuidFilter<"Credencial"> | string
    tenant_id?: UuidFilter<"Credencial"> | string
    vigilador_id?: UuidFilter<"Credencial"> | string
    tipo?: StringFilter<"Credencial"> | string
    numero?: StringNullableFilter<"Credencial"> | string | null
    organismo?: StringNullableFilter<"Credencial"> | string | null
    emitida_el?: DateTimeNullableFilter<"Credencial"> | Date | string | null
    vence_el?: DateTimeNullableFilter<"Credencial"> | Date | string | null
    created_at?: DateTimeFilter<"Credencial"> | Date | string
  }

  export type ObjetivoUpsertWithWhereUniqueWithoutTenantInput = {
    where: ObjetivoWhereUniqueInput
    update: XOR<ObjetivoUpdateWithoutTenantInput, ObjetivoUncheckedUpdateWithoutTenantInput>
    create: XOR<ObjetivoCreateWithoutTenantInput, ObjetivoUncheckedCreateWithoutTenantInput>
  }

  export type ObjetivoUpdateWithWhereUniqueWithoutTenantInput = {
    where: ObjetivoWhereUniqueInput
    data: XOR<ObjetivoUpdateWithoutTenantInput, ObjetivoUncheckedUpdateWithoutTenantInput>
  }

  export type ObjetivoUpdateManyWithWhereWithoutTenantInput = {
    where: ObjetivoScalarWhereInput
    data: XOR<ObjetivoUpdateManyMutationInput, ObjetivoUncheckedUpdateManyWithoutTenantInput>
  }

  export type ObjetivoScalarWhereInput = {
    AND?: ObjetivoScalarWhereInput | ObjetivoScalarWhereInput[]
    OR?: ObjetivoScalarWhereInput[]
    NOT?: ObjetivoScalarWhereInput | ObjetivoScalarWhereInput[]
    id?: UuidFilter<"Objetivo"> | string
    tenant_id?: UuidFilter<"Objetivo"> | string
    cliente_id?: UuidFilter<"Objetivo"> | string
    codigo?: StringFilter<"Objetivo"> | string
    nombre?: StringFilter<"Objetivo"> | string
    direccion?: StringNullableFilter<"Objetivo"> | string | null
    created_at?: DateTimeFilter<"Objetivo"> | Date | string
    updated_at?: DateTimeFilter<"Objetivo"> | Date | string
  }

  export type PuestoUpsertWithWhereUniqueWithoutTenantInput = {
    where: PuestoWhereUniqueInput
    update: XOR<PuestoUpdateWithoutTenantInput, PuestoUncheckedUpdateWithoutTenantInput>
    create: XOR<PuestoCreateWithoutTenantInput, PuestoUncheckedCreateWithoutTenantInput>
  }

  export type PuestoUpdateWithWhereUniqueWithoutTenantInput = {
    where: PuestoWhereUniqueInput
    data: XOR<PuestoUpdateWithoutTenantInput, PuestoUncheckedUpdateWithoutTenantInput>
  }

  export type PuestoUpdateManyWithWhereWithoutTenantInput = {
    where: PuestoScalarWhereInput
    data: XOR<PuestoUpdateManyMutationInput, PuestoUncheckedUpdateManyWithoutTenantInput>
  }

  export type PuestoScalarWhereInput = {
    AND?: PuestoScalarWhereInput | PuestoScalarWhereInput[]
    OR?: PuestoScalarWhereInput[]
    NOT?: PuestoScalarWhereInput | PuestoScalarWhereInput[]
    id?: UuidFilter<"Puesto"> | string
    tenant_id?: UuidFilter<"Puesto"> | string
    objetivo_id?: UuidNullableFilter<"Puesto"> | string | null
    nombre?: StringFilter<"Puesto"> | string
    ubicacion?: StringNullableFilter<"Puesto"> | string | null
    requiere_arma?: BoolFilter<"Puesto"> | boolean
    requiere_movil?: BoolFilter<"Puesto"> | boolean
    esquema_horario?: JsonNullableFilter<"Puesto">
    created_at?: DateTimeFilter<"Puesto"> | Date | string
    updated_at?: DateTimeFilter<"Puesto"> | Date | string
  }

  export type AsignacionUpsertWithWhereUniqueWithoutTenantInput = {
    where: AsignacionWhereUniqueInput
    update: XOR<AsignacionUpdateWithoutTenantInput, AsignacionUncheckedUpdateWithoutTenantInput>
    create: XOR<AsignacionCreateWithoutTenantInput, AsignacionUncheckedCreateWithoutTenantInput>
  }

  export type AsignacionUpdateWithWhereUniqueWithoutTenantInput = {
    where: AsignacionWhereUniqueInput
    data: XOR<AsignacionUpdateWithoutTenantInput, AsignacionUncheckedUpdateWithoutTenantInput>
  }

  export type AsignacionUpdateManyWithWhereWithoutTenantInput = {
    where: AsignacionScalarWhereInput
    data: XOR<AsignacionUpdateManyMutationInput, AsignacionUncheckedUpdateManyWithoutTenantInput>
  }

  export type AsignacionScalarWhereInput = {
    AND?: AsignacionScalarWhereInput | AsignacionScalarWhereInput[]
    OR?: AsignacionScalarWhereInput[]
    NOT?: AsignacionScalarWhereInput | AsignacionScalarWhereInput[]
    id?: UuidFilter<"Asignacion"> | string
    tenant_id?: UuidFilter<"Asignacion"> | string
    puesto_id?: UuidFilter<"Asignacion"> | string
    vigilador_id?: UuidNullableFilter<"Asignacion"> | string | null
    fecha?: DateTimeFilter<"Asignacion"> | Date | string
    hora_inicio?: StringFilter<"Asignacion"> | string
    hora_fin?: StringFilter<"Asignacion"> | string
    estado?: StringFilter<"Asignacion"> | string
    created_at?: DateTimeFilter<"Asignacion"> | Date | string
  }

  export type AsistenciaUpsertWithWhereUniqueWithoutTenantInput = {
    where: AsistenciaWhereUniqueInput
    update: XOR<AsistenciaUpdateWithoutTenantInput, AsistenciaUncheckedUpdateWithoutTenantInput>
    create: XOR<AsistenciaCreateWithoutTenantInput, AsistenciaUncheckedCreateWithoutTenantInput>
  }

  export type AsistenciaUpdateWithWhereUniqueWithoutTenantInput = {
    where: AsistenciaWhereUniqueInput
    data: XOR<AsistenciaUpdateWithoutTenantInput, AsistenciaUncheckedUpdateWithoutTenantInput>
  }

  export type AsistenciaUpdateManyWithWhereWithoutTenantInput = {
    where: AsistenciaScalarWhereInput
    data: XOR<AsistenciaUpdateManyMutationInput, AsistenciaUncheckedUpdateManyWithoutTenantInput>
  }

  export type AsistenciaScalarWhereInput = {
    AND?: AsistenciaScalarWhereInput | AsistenciaScalarWhereInput[]
    OR?: AsistenciaScalarWhereInput[]
    NOT?: AsistenciaScalarWhereInput | AsistenciaScalarWhereInput[]
    id?: UuidFilter<"Asistencia"> | string
    tenant_id?: UuidFilter<"Asistencia"> | string
    asignacion_id?: UuidFilter<"Asistencia"> | string
    inicio_real?: DateTimeNullableFilter<"Asistencia"> | Date | string | null
    fin_real?: DateTimeNullableFilter<"Asistencia"> | Date | string | null
    metodo?: StringNullableFilter<"Asistencia"> | string | null
    lat?: DecimalNullableFilter<"Asistencia"> | Decimal | DecimalJsLike | number | string | null
    lng?: DecimalNullableFilter<"Asistencia"> | Decimal | DecimalJsLike | number | string | null
  }

  export type FeriadoUpsertWithWhereUniqueWithoutTenantInput = {
    where: FeriadoWhereUniqueInput
    update: XOR<FeriadoUpdateWithoutTenantInput, FeriadoUncheckedUpdateWithoutTenantInput>
    create: XOR<FeriadoCreateWithoutTenantInput, FeriadoUncheckedCreateWithoutTenantInput>
  }

  export type FeriadoUpdateWithWhereUniqueWithoutTenantInput = {
    where: FeriadoWhereUniqueInput
    data: XOR<FeriadoUpdateWithoutTenantInput, FeriadoUncheckedUpdateWithoutTenantInput>
  }

  export type FeriadoUpdateManyWithWhereWithoutTenantInput = {
    where: FeriadoScalarWhereInput
    data: XOR<FeriadoUpdateManyMutationInput, FeriadoUncheckedUpdateManyWithoutTenantInput>
  }

  export type FeriadoScalarWhereInput = {
    AND?: FeriadoScalarWhereInput | FeriadoScalarWhereInput[]
    OR?: FeriadoScalarWhereInput[]
    NOT?: FeriadoScalarWhereInput | FeriadoScalarWhereInput[]
    id?: UuidFilter<"Feriado"> | string
    tenant_id?: UuidFilter<"Feriado"> | string
    nombre?: StringFilter<"Feriado"> | string
    fecha?: DateTimeFilter<"Feriado"> | Date | string
    created_at?: DateTimeFilter<"Feriado"> | Date | string
  }

  export type ConfiguracionCostosUpsertWithoutTenantInput = {
    update: XOR<ConfiguracionCostosUpdateWithoutTenantInput, ConfiguracionCostosUncheckedUpdateWithoutTenantInput>
    create: XOR<ConfiguracionCostosCreateWithoutTenantInput, ConfiguracionCostosUncheckedCreateWithoutTenantInput>
    where?: ConfiguracionCostosWhereInput
  }

  export type ConfiguracionCostosUpdateToOneWithWhereWithoutTenantInput = {
    where?: ConfiguracionCostosWhereInput
    data: XOR<ConfiguracionCostosUpdateWithoutTenantInput, ConfiguracionCostosUncheckedUpdateWithoutTenantInput>
  }

  export type ConfiguracionCostosUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    costo_hora_base?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    cargas_sociales?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    costos_uniforme?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    otros_costos?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    factor_ajuste?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConfiguracionCostosUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    costo_hora_base?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    cargas_sociales?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    costos_uniforme?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    otros_costos?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    factor_ajuste?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CotizacionUpsertWithWhereUniqueWithoutTenantInput = {
    where: CotizacionWhereUniqueInput
    update: XOR<CotizacionUpdateWithoutTenantInput, CotizacionUncheckedUpdateWithoutTenantInput>
    create: XOR<CotizacionCreateWithoutTenantInput, CotizacionUncheckedCreateWithoutTenantInput>
  }

  export type CotizacionUpdateWithWhereUniqueWithoutTenantInput = {
    where: CotizacionWhereUniqueInput
    data: XOR<CotizacionUpdateWithoutTenantInput, CotizacionUncheckedUpdateWithoutTenantInput>
  }

  export type CotizacionUpdateManyWithWhereWithoutTenantInput = {
    where: CotizacionScalarWhereInput
    data: XOR<CotizacionUpdateManyMutationInput, CotizacionUncheckedUpdateManyWithoutTenantInput>
  }

  export type CotizacionScalarWhereInput = {
    AND?: CotizacionScalarWhereInput | CotizacionScalarWhereInput[]
    OR?: CotizacionScalarWhereInput[]
    NOT?: CotizacionScalarWhereInput | CotizacionScalarWhereInput[]
    id?: UuidFilter<"Cotizacion"> | string
    tenant_id?: UuidFilter<"Cotizacion"> | string
    cliente_nombre?: StringFilter<"Cotizacion"> | string
    vencimiento?: DateTimeFilter<"Cotizacion"> | Date | string
    estado?: StringFilter<"Cotizacion"> | string
    total_mensual?: DecimalFilter<"Cotizacion"> | Decimal | DecimalJsLike | number | string
    created_at?: DateTimeFilter<"Cotizacion"> | Date | string
    updated_at?: DateTimeFilter<"Cotizacion"> | Date | string
  }

  export type TenantCreateWithoutUsersInput = {
    id?: string
    nombre: string
    factor_cobertura?: Decimal | DecimalJsLike | number | string
    margen_objetivo?: Decimal | DecimalJsLike | number | string
    created_at?: Date | string
    updated_at?: Date | string
    vigiladores?: VigiladorCreateNestedManyWithoutTenantInput
    credenciales?: CredencialCreateNestedManyWithoutTenantInput
    objetivos?: ObjetivoCreateNestedManyWithoutTenantInput
    puestos?: PuestoCreateNestedManyWithoutTenantInput
    asignaciones?: AsignacionCreateNestedManyWithoutTenantInput
    asistencias?: AsistenciaCreateNestedManyWithoutTenantInput
    feriados?: FeriadoCreateNestedManyWithoutTenantInput
    configuracion_costos?: ConfiguracionCostosCreateNestedOneWithoutTenantInput
    cotizaciones?: CotizacionCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutUsersInput = {
    id?: string
    nombre: string
    factor_cobertura?: Decimal | DecimalJsLike | number | string
    margen_objetivo?: Decimal | DecimalJsLike | number | string
    created_at?: Date | string
    updated_at?: Date | string
    vigiladores?: VigiladorUncheckedCreateNestedManyWithoutTenantInput
    credenciales?: CredencialUncheckedCreateNestedManyWithoutTenantInput
    objetivos?: ObjetivoUncheckedCreateNestedManyWithoutTenantInput
    puestos?: PuestoUncheckedCreateNestedManyWithoutTenantInput
    asignaciones?: AsignacionUncheckedCreateNestedManyWithoutTenantInput
    asistencias?: AsistenciaUncheckedCreateNestedManyWithoutTenantInput
    feriados?: FeriadoUncheckedCreateNestedManyWithoutTenantInput
    configuracion_costos?: ConfiguracionCostosUncheckedCreateNestedOneWithoutTenantInput
    cotizaciones?: CotizacionUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutUsersInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutUsersInput, TenantUncheckedCreateWithoutUsersInput>
  }

  export type TenantUpsertWithoutUsersInput = {
    update: XOR<TenantUpdateWithoutUsersInput, TenantUncheckedUpdateWithoutUsersInput>
    create: XOR<TenantCreateWithoutUsersInput, TenantUncheckedCreateWithoutUsersInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutUsersInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutUsersInput, TenantUncheckedUpdateWithoutUsersInput>
  }

  export type TenantUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    factor_cobertura?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    margen_objetivo?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    vigiladores?: VigiladorUpdateManyWithoutTenantNestedInput
    credenciales?: CredencialUpdateManyWithoutTenantNestedInput
    objetivos?: ObjetivoUpdateManyWithoutTenantNestedInput
    puestos?: PuestoUpdateManyWithoutTenantNestedInput
    asignaciones?: AsignacionUpdateManyWithoutTenantNestedInput
    asistencias?: AsistenciaUpdateManyWithoutTenantNestedInput
    feriados?: FeriadoUpdateManyWithoutTenantNestedInput
    configuracion_costos?: ConfiguracionCostosUpdateOneWithoutTenantNestedInput
    cotizaciones?: CotizacionUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    factor_cobertura?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    margen_objetivo?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    vigiladores?: VigiladorUncheckedUpdateManyWithoutTenantNestedInput
    credenciales?: CredencialUncheckedUpdateManyWithoutTenantNestedInput
    objetivos?: ObjetivoUncheckedUpdateManyWithoutTenantNestedInput
    puestos?: PuestoUncheckedUpdateManyWithoutTenantNestedInput
    asignaciones?: AsignacionUncheckedUpdateManyWithoutTenantNestedInput
    asistencias?: AsistenciaUncheckedUpdateManyWithoutTenantNestedInput
    feriados?: FeriadoUncheckedUpdateManyWithoutTenantNestedInput
    configuracion_costos?: ConfiguracionCostosUncheckedUpdateOneWithoutTenantNestedInput
    cotizaciones?: CotizacionUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type TenantCreateWithoutVigiladoresInput = {
    id?: string
    nombre: string
    factor_cobertura?: Decimal | DecimalJsLike | number | string
    margen_objetivo?: Decimal | DecimalJsLike | number | string
    created_at?: Date | string
    updated_at?: Date | string
    users?: UserCreateNestedManyWithoutTenantInput
    credenciales?: CredencialCreateNestedManyWithoutTenantInput
    objetivos?: ObjetivoCreateNestedManyWithoutTenantInput
    puestos?: PuestoCreateNestedManyWithoutTenantInput
    asignaciones?: AsignacionCreateNestedManyWithoutTenantInput
    asistencias?: AsistenciaCreateNestedManyWithoutTenantInput
    feriados?: FeriadoCreateNestedManyWithoutTenantInput
    configuracion_costos?: ConfiguracionCostosCreateNestedOneWithoutTenantInput
    cotizaciones?: CotizacionCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutVigiladoresInput = {
    id?: string
    nombre: string
    factor_cobertura?: Decimal | DecimalJsLike | number | string
    margen_objetivo?: Decimal | DecimalJsLike | number | string
    created_at?: Date | string
    updated_at?: Date | string
    users?: UserUncheckedCreateNestedManyWithoutTenantInput
    credenciales?: CredencialUncheckedCreateNestedManyWithoutTenantInput
    objetivos?: ObjetivoUncheckedCreateNestedManyWithoutTenantInput
    puestos?: PuestoUncheckedCreateNestedManyWithoutTenantInput
    asignaciones?: AsignacionUncheckedCreateNestedManyWithoutTenantInput
    asistencias?: AsistenciaUncheckedCreateNestedManyWithoutTenantInput
    feriados?: FeriadoUncheckedCreateNestedManyWithoutTenantInput
    configuracion_costos?: ConfiguracionCostosUncheckedCreateNestedOneWithoutTenantInput
    cotizaciones?: CotizacionUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutVigiladoresInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutVigiladoresInput, TenantUncheckedCreateWithoutVigiladoresInput>
  }

  export type CredencialCreateWithoutVigiladorInput = {
    id?: string
    tipo: string
    numero?: string | null
    organismo?: string | null
    emitida_el?: Date | string | null
    vence_el?: Date | string | null
    created_at?: Date | string
    tenant: TenantCreateNestedOneWithoutCredencialesInput
  }

  export type CredencialUncheckedCreateWithoutVigiladorInput = {
    id?: string
    tenant_id: string
    tipo: string
    numero?: string | null
    organismo?: string | null
    emitida_el?: Date | string | null
    vence_el?: Date | string | null
    created_at?: Date | string
  }

  export type CredencialCreateOrConnectWithoutVigiladorInput = {
    where: CredencialWhereUniqueInput
    create: XOR<CredencialCreateWithoutVigiladorInput, CredencialUncheckedCreateWithoutVigiladorInput>
  }

  export type CredencialCreateManyVigiladorInputEnvelope = {
    data: CredencialCreateManyVigiladorInput | CredencialCreateManyVigiladorInput[]
    skipDuplicates?: boolean
  }

  export type AsignacionCreateWithoutVigiladorInput = {
    id?: string
    fecha: Date | string
    hora_inicio: string
    hora_fin: string
    estado?: string
    created_at?: Date | string
    tenant: TenantCreateNestedOneWithoutAsignacionesInput
    puesto: PuestoCreateNestedOneWithoutAsignacionesInput
    asistencia?: AsistenciaCreateNestedOneWithoutAsignacionInput
  }

  export type AsignacionUncheckedCreateWithoutVigiladorInput = {
    id?: string
    tenant_id: string
    puesto_id: string
    fecha: Date | string
    hora_inicio: string
    hora_fin: string
    estado?: string
    created_at?: Date | string
    asistencia?: AsistenciaUncheckedCreateNestedOneWithoutAsignacionInput
  }

  export type AsignacionCreateOrConnectWithoutVigiladorInput = {
    where: AsignacionWhereUniqueInput
    create: XOR<AsignacionCreateWithoutVigiladorInput, AsignacionUncheckedCreateWithoutVigiladorInput>
  }

  export type AsignacionCreateManyVigiladorInputEnvelope = {
    data: AsignacionCreateManyVigiladorInput | AsignacionCreateManyVigiladorInput[]
    skipDuplicates?: boolean
  }

  export type TenantUpsertWithoutVigiladoresInput = {
    update: XOR<TenantUpdateWithoutVigiladoresInput, TenantUncheckedUpdateWithoutVigiladoresInput>
    create: XOR<TenantCreateWithoutVigiladoresInput, TenantUncheckedCreateWithoutVigiladoresInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutVigiladoresInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutVigiladoresInput, TenantUncheckedUpdateWithoutVigiladoresInput>
  }

  export type TenantUpdateWithoutVigiladoresInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    factor_cobertura?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    margen_objetivo?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUpdateManyWithoutTenantNestedInput
    credenciales?: CredencialUpdateManyWithoutTenantNestedInput
    objetivos?: ObjetivoUpdateManyWithoutTenantNestedInput
    puestos?: PuestoUpdateManyWithoutTenantNestedInput
    asignaciones?: AsignacionUpdateManyWithoutTenantNestedInput
    asistencias?: AsistenciaUpdateManyWithoutTenantNestedInput
    feriados?: FeriadoUpdateManyWithoutTenantNestedInput
    configuracion_costos?: ConfiguracionCostosUpdateOneWithoutTenantNestedInput
    cotizaciones?: CotizacionUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutVigiladoresInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    factor_cobertura?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    margen_objetivo?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUncheckedUpdateManyWithoutTenantNestedInput
    credenciales?: CredencialUncheckedUpdateManyWithoutTenantNestedInput
    objetivos?: ObjetivoUncheckedUpdateManyWithoutTenantNestedInput
    puestos?: PuestoUncheckedUpdateManyWithoutTenantNestedInput
    asignaciones?: AsignacionUncheckedUpdateManyWithoutTenantNestedInput
    asistencias?: AsistenciaUncheckedUpdateManyWithoutTenantNestedInput
    feriados?: FeriadoUncheckedUpdateManyWithoutTenantNestedInput
    configuracion_costos?: ConfiguracionCostosUncheckedUpdateOneWithoutTenantNestedInput
    cotizaciones?: CotizacionUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type CredencialUpsertWithWhereUniqueWithoutVigiladorInput = {
    where: CredencialWhereUniqueInput
    update: XOR<CredencialUpdateWithoutVigiladorInput, CredencialUncheckedUpdateWithoutVigiladorInput>
    create: XOR<CredencialCreateWithoutVigiladorInput, CredencialUncheckedCreateWithoutVigiladorInput>
  }

  export type CredencialUpdateWithWhereUniqueWithoutVigiladorInput = {
    where: CredencialWhereUniqueInput
    data: XOR<CredencialUpdateWithoutVigiladorInput, CredencialUncheckedUpdateWithoutVigiladorInput>
  }

  export type CredencialUpdateManyWithWhereWithoutVigiladorInput = {
    where: CredencialScalarWhereInput
    data: XOR<CredencialUpdateManyMutationInput, CredencialUncheckedUpdateManyWithoutVigiladorInput>
  }

  export type AsignacionUpsertWithWhereUniqueWithoutVigiladorInput = {
    where: AsignacionWhereUniqueInput
    update: XOR<AsignacionUpdateWithoutVigiladorInput, AsignacionUncheckedUpdateWithoutVigiladorInput>
    create: XOR<AsignacionCreateWithoutVigiladorInput, AsignacionUncheckedCreateWithoutVigiladorInput>
  }

  export type AsignacionUpdateWithWhereUniqueWithoutVigiladorInput = {
    where: AsignacionWhereUniqueInput
    data: XOR<AsignacionUpdateWithoutVigiladorInput, AsignacionUncheckedUpdateWithoutVigiladorInput>
  }

  export type AsignacionUpdateManyWithWhereWithoutVigiladorInput = {
    where: AsignacionScalarWhereInput
    data: XOR<AsignacionUpdateManyMutationInput, AsignacionUncheckedUpdateManyWithoutVigiladorInput>
  }

  export type TenantCreateWithoutCredencialesInput = {
    id?: string
    nombre: string
    factor_cobertura?: Decimal | DecimalJsLike | number | string
    margen_objetivo?: Decimal | DecimalJsLike | number | string
    created_at?: Date | string
    updated_at?: Date | string
    users?: UserCreateNestedManyWithoutTenantInput
    vigiladores?: VigiladorCreateNestedManyWithoutTenantInput
    objetivos?: ObjetivoCreateNestedManyWithoutTenantInput
    puestos?: PuestoCreateNestedManyWithoutTenantInput
    asignaciones?: AsignacionCreateNestedManyWithoutTenantInput
    asistencias?: AsistenciaCreateNestedManyWithoutTenantInput
    feriados?: FeriadoCreateNestedManyWithoutTenantInput
    configuracion_costos?: ConfiguracionCostosCreateNestedOneWithoutTenantInput
    cotizaciones?: CotizacionCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutCredencialesInput = {
    id?: string
    nombre: string
    factor_cobertura?: Decimal | DecimalJsLike | number | string
    margen_objetivo?: Decimal | DecimalJsLike | number | string
    created_at?: Date | string
    updated_at?: Date | string
    users?: UserUncheckedCreateNestedManyWithoutTenantInput
    vigiladores?: VigiladorUncheckedCreateNestedManyWithoutTenantInput
    objetivos?: ObjetivoUncheckedCreateNestedManyWithoutTenantInput
    puestos?: PuestoUncheckedCreateNestedManyWithoutTenantInput
    asignaciones?: AsignacionUncheckedCreateNestedManyWithoutTenantInput
    asistencias?: AsistenciaUncheckedCreateNestedManyWithoutTenantInput
    feriados?: FeriadoUncheckedCreateNestedManyWithoutTenantInput
    configuracion_costos?: ConfiguracionCostosUncheckedCreateNestedOneWithoutTenantInput
    cotizaciones?: CotizacionUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutCredencialesInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutCredencialesInput, TenantUncheckedCreateWithoutCredencialesInput>
  }

  export type VigiladorCreateWithoutCredencialesInput = {
    id?: string
    legajo_nro: string
    nombre: string
    apellido: string
    documento: string
    estado?: string
    created_at?: Date | string
    updated_at?: Date | string
    deleted_at?: Date | string | null
    tenant: TenantCreateNestedOneWithoutVigiladoresInput
    asignaciones?: AsignacionCreateNestedManyWithoutVigiladorInput
  }

  export type VigiladorUncheckedCreateWithoutCredencialesInput = {
    id?: string
    tenant_id: string
    legajo_nro: string
    nombre: string
    apellido: string
    documento: string
    estado?: string
    created_at?: Date | string
    updated_at?: Date | string
    deleted_at?: Date | string | null
    asignaciones?: AsignacionUncheckedCreateNestedManyWithoutVigiladorInput
  }

  export type VigiladorCreateOrConnectWithoutCredencialesInput = {
    where: VigiladorWhereUniqueInput
    create: XOR<VigiladorCreateWithoutCredencialesInput, VigiladorUncheckedCreateWithoutCredencialesInput>
  }

  export type TenantUpsertWithoutCredencialesInput = {
    update: XOR<TenantUpdateWithoutCredencialesInput, TenantUncheckedUpdateWithoutCredencialesInput>
    create: XOR<TenantCreateWithoutCredencialesInput, TenantUncheckedCreateWithoutCredencialesInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutCredencialesInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutCredencialesInput, TenantUncheckedUpdateWithoutCredencialesInput>
  }

  export type TenantUpdateWithoutCredencialesInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    factor_cobertura?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    margen_objetivo?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUpdateManyWithoutTenantNestedInput
    vigiladores?: VigiladorUpdateManyWithoutTenantNestedInput
    objetivos?: ObjetivoUpdateManyWithoutTenantNestedInput
    puestos?: PuestoUpdateManyWithoutTenantNestedInput
    asignaciones?: AsignacionUpdateManyWithoutTenantNestedInput
    asistencias?: AsistenciaUpdateManyWithoutTenantNestedInput
    feriados?: FeriadoUpdateManyWithoutTenantNestedInput
    configuracion_costos?: ConfiguracionCostosUpdateOneWithoutTenantNestedInput
    cotizaciones?: CotizacionUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutCredencialesInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    factor_cobertura?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    margen_objetivo?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUncheckedUpdateManyWithoutTenantNestedInput
    vigiladores?: VigiladorUncheckedUpdateManyWithoutTenantNestedInput
    objetivos?: ObjetivoUncheckedUpdateManyWithoutTenantNestedInput
    puestos?: PuestoUncheckedUpdateManyWithoutTenantNestedInput
    asignaciones?: AsignacionUncheckedUpdateManyWithoutTenantNestedInput
    asistencias?: AsistenciaUncheckedUpdateManyWithoutTenantNestedInput
    feriados?: FeriadoUncheckedUpdateManyWithoutTenantNestedInput
    configuracion_costos?: ConfiguracionCostosUncheckedUpdateOneWithoutTenantNestedInput
    cotizaciones?: CotizacionUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type VigiladorUpsertWithoutCredencialesInput = {
    update: XOR<VigiladorUpdateWithoutCredencialesInput, VigiladorUncheckedUpdateWithoutCredencialesInput>
    create: XOR<VigiladorCreateWithoutCredencialesInput, VigiladorUncheckedCreateWithoutCredencialesInput>
    where?: VigiladorWhereInput
  }

  export type VigiladorUpdateToOneWithWhereWithoutCredencialesInput = {
    where?: VigiladorWhereInput
    data: XOR<VigiladorUpdateWithoutCredencialesInput, VigiladorUncheckedUpdateWithoutCredencialesInput>
  }

  export type VigiladorUpdateWithoutCredencialesInput = {
    id?: StringFieldUpdateOperationsInput | string
    legajo_nro?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    apellido?: StringFieldUpdateOperationsInput | string
    documento?: StringFieldUpdateOperationsInput | string
    estado?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tenant?: TenantUpdateOneRequiredWithoutVigiladoresNestedInput
    asignaciones?: AsignacionUpdateManyWithoutVigiladorNestedInput
  }

  export type VigiladorUncheckedUpdateWithoutCredencialesInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenant_id?: StringFieldUpdateOperationsInput | string
    legajo_nro?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    apellido?: StringFieldUpdateOperationsInput | string
    documento?: StringFieldUpdateOperationsInput | string
    estado?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    asignaciones?: AsignacionUncheckedUpdateManyWithoutVigiladorNestedInput
  }

  export type TenantCreateWithoutObjetivosInput = {
    id?: string
    nombre: string
    factor_cobertura?: Decimal | DecimalJsLike | number | string
    margen_objetivo?: Decimal | DecimalJsLike | number | string
    created_at?: Date | string
    updated_at?: Date | string
    users?: UserCreateNestedManyWithoutTenantInput
    vigiladores?: VigiladorCreateNestedManyWithoutTenantInput
    credenciales?: CredencialCreateNestedManyWithoutTenantInput
    puestos?: PuestoCreateNestedManyWithoutTenantInput
    asignaciones?: AsignacionCreateNestedManyWithoutTenantInput
    asistencias?: AsistenciaCreateNestedManyWithoutTenantInput
    feriados?: FeriadoCreateNestedManyWithoutTenantInput
    configuracion_costos?: ConfiguracionCostosCreateNestedOneWithoutTenantInput
    cotizaciones?: CotizacionCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutObjetivosInput = {
    id?: string
    nombre: string
    factor_cobertura?: Decimal | DecimalJsLike | number | string
    margen_objetivo?: Decimal | DecimalJsLike | number | string
    created_at?: Date | string
    updated_at?: Date | string
    users?: UserUncheckedCreateNestedManyWithoutTenantInput
    vigiladores?: VigiladorUncheckedCreateNestedManyWithoutTenantInput
    credenciales?: CredencialUncheckedCreateNestedManyWithoutTenantInput
    puestos?: PuestoUncheckedCreateNestedManyWithoutTenantInput
    asignaciones?: AsignacionUncheckedCreateNestedManyWithoutTenantInput
    asistencias?: AsistenciaUncheckedCreateNestedManyWithoutTenantInput
    feriados?: FeriadoUncheckedCreateNestedManyWithoutTenantInput
    configuracion_costos?: ConfiguracionCostosUncheckedCreateNestedOneWithoutTenantInput
    cotizaciones?: CotizacionUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutObjetivosInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutObjetivosInput, TenantUncheckedCreateWithoutObjetivosInput>
  }

  export type PuestoCreateWithoutObjetivoInput = {
    id?: string
    nombre: string
    ubicacion?: string | null
    requiere_arma?: boolean
    requiere_movil?: boolean
    esquema_horario?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string
    updated_at?: Date | string
    tenant: TenantCreateNestedOneWithoutPuestosInput
    asignaciones?: AsignacionCreateNestedManyWithoutPuestoInput
  }

  export type PuestoUncheckedCreateWithoutObjetivoInput = {
    id?: string
    tenant_id: string
    nombre: string
    ubicacion?: string | null
    requiere_arma?: boolean
    requiere_movil?: boolean
    esquema_horario?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string
    updated_at?: Date | string
    asignaciones?: AsignacionUncheckedCreateNestedManyWithoutPuestoInput
  }

  export type PuestoCreateOrConnectWithoutObjetivoInput = {
    where: PuestoWhereUniqueInput
    create: XOR<PuestoCreateWithoutObjetivoInput, PuestoUncheckedCreateWithoutObjetivoInput>
  }

  export type PuestoCreateManyObjetivoInputEnvelope = {
    data: PuestoCreateManyObjetivoInput | PuestoCreateManyObjetivoInput[]
    skipDuplicates?: boolean
  }

  export type TenantUpsertWithoutObjetivosInput = {
    update: XOR<TenantUpdateWithoutObjetivosInput, TenantUncheckedUpdateWithoutObjetivosInput>
    create: XOR<TenantCreateWithoutObjetivosInput, TenantUncheckedCreateWithoutObjetivosInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutObjetivosInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutObjetivosInput, TenantUncheckedUpdateWithoutObjetivosInput>
  }

  export type TenantUpdateWithoutObjetivosInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    factor_cobertura?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    margen_objetivo?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUpdateManyWithoutTenantNestedInput
    vigiladores?: VigiladorUpdateManyWithoutTenantNestedInput
    credenciales?: CredencialUpdateManyWithoutTenantNestedInput
    puestos?: PuestoUpdateManyWithoutTenantNestedInput
    asignaciones?: AsignacionUpdateManyWithoutTenantNestedInput
    asistencias?: AsistenciaUpdateManyWithoutTenantNestedInput
    feriados?: FeriadoUpdateManyWithoutTenantNestedInput
    configuracion_costos?: ConfiguracionCostosUpdateOneWithoutTenantNestedInput
    cotizaciones?: CotizacionUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutObjetivosInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    factor_cobertura?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    margen_objetivo?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUncheckedUpdateManyWithoutTenantNestedInput
    vigiladores?: VigiladorUncheckedUpdateManyWithoutTenantNestedInput
    credenciales?: CredencialUncheckedUpdateManyWithoutTenantNestedInput
    puestos?: PuestoUncheckedUpdateManyWithoutTenantNestedInput
    asignaciones?: AsignacionUncheckedUpdateManyWithoutTenantNestedInput
    asistencias?: AsistenciaUncheckedUpdateManyWithoutTenantNestedInput
    feriados?: FeriadoUncheckedUpdateManyWithoutTenantNestedInput
    configuracion_costos?: ConfiguracionCostosUncheckedUpdateOneWithoutTenantNestedInput
    cotizaciones?: CotizacionUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type PuestoUpsertWithWhereUniqueWithoutObjetivoInput = {
    where: PuestoWhereUniqueInput
    update: XOR<PuestoUpdateWithoutObjetivoInput, PuestoUncheckedUpdateWithoutObjetivoInput>
    create: XOR<PuestoCreateWithoutObjetivoInput, PuestoUncheckedCreateWithoutObjetivoInput>
  }

  export type PuestoUpdateWithWhereUniqueWithoutObjetivoInput = {
    where: PuestoWhereUniqueInput
    data: XOR<PuestoUpdateWithoutObjetivoInput, PuestoUncheckedUpdateWithoutObjetivoInput>
  }

  export type PuestoUpdateManyWithWhereWithoutObjetivoInput = {
    where: PuestoScalarWhereInput
    data: XOR<PuestoUpdateManyMutationInput, PuestoUncheckedUpdateManyWithoutObjetivoInput>
  }

  export type TenantCreateWithoutPuestosInput = {
    id?: string
    nombre: string
    factor_cobertura?: Decimal | DecimalJsLike | number | string
    margen_objetivo?: Decimal | DecimalJsLike | number | string
    created_at?: Date | string
    updated_at?: Date | string
    users?: UserCreateNestedManyWithoutTenantInput
    vigiladores?: VigiladorCreateNestedManyWithoutTenantInput
    credenciales?: CredencialCreateNestedManyWithoutTenantInput
    objetivos?: ObjetivoCreateNestedManyWithoutTenantInput
    asignaciones?: AsignacionCreateNestedManyWithoutTenantInput
    asistencias?: AsistenciaCreateNestedManyWithoutTenantInput
    feriados?: FeriadoCreateNestedManyWithoutTenantInput
    configuracion_costos?: ConfiguracionCostosCreateNestedOneWithoutTenantInput
    cotizaciones?: CotizacionCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutPuestosInput = {
    id?: string
    nombre: string
    factor_cobertura?: Decimal | DecimalJsLike | number | string
    margen_objetivo?: Decimal | DecimalJsLike | number | string
    created_at?: Date | string
    updated_at?: Date | string
    users?: UserUncheckedCreateNestedManyWithoutTenantInput
    vigiladores?: VigiladorUncheckedCreateNestedManyWithoutTenantInput
    credenciales?: CredencialUncheckedCreateNestedManyWithoutTenantInput
    objetivos?: ObjetivoUncheckedCreateNestedManyWithoutTenantInput
    asignaciones?: AsignacionUncheckedCreateNestedManyWithoutTenantInput
    asistencias?: AsistenciaUncheckedCreateNestedManyWithoutTenantInput
    feriados?: FeriadoUncheckedCreateNestedManyWithoutTenantInput
    configuracion_costos?: ConfiguracionCostosUncheckedCreateNestedOneWithoutTenantInput
    cotizaciones?: CotizacionUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutPuestosInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutPuestosInput, TenantUncheckedCreateWithoutPuestosInput>
  }

  export type ObjetivoCreateWithoutPuestosInput = {
    id?: string
    cliente_id: string
    codigo: string
    nombre: string
    direccion?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    tenant: TenantCreateNestedOneWithoutObjetivosInput
  }

  export type ObjetivoUncheckedCreateWithoutPuestosInput = {
    id?: string
    tenant_id: string
    cliente_id: string
    codigo: string
    nombre: string
    direccion?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ObjetivoCreateOrConnectWithoutPuestosInput = {
    where: ObjetivoWhereUniqueInput
    create: XOR<ObjetivoCreateWithoutPuestosInput, ObjetivoUncheckedCreateWithoutPuestosInput>
  }

  export type AsignacionCreateWithoutPuestoInput = {
    id?: string
    fecha: Date | string
    hora_inicio: string
    hora_fin: string
    estado?: string
    created_at?: Date | string
    tenant: TenantCreateNestedOneWithoutAsignacionesInput
    vigilador?: VigiladorCreateNestedOneWithoutAsignacionesInput
    asistencia?: AsistenciaCreateNestedOneWithoutAsignacionInput
  }

  export type AsignacionUncheckedCreateWithoutPuestoInput = {
    id?: string
    tenant_id: string
    vigilador_id?: string | null
    fecha: Date | string
    hora_inicio: string
    hora_fin: string
    estado?: string
    created_at?: Date | string
    asistencia?: AsistenciaUncheckedCreateNestedOneWithoutAsignacionInput
  }

  export type AsignacionCreateOrConnectWithoutPuestoInput = {
    where: AsignacionWhereUniqueInput
    create: XOR<AsignacionCreateWithoutPuestoInput, AsignacionUncheckedCreateWithoutPuestoInput>
  }

  export type AsignacionCreateManyPuestoInputEnvelope = {
    data: AsignacionCreateManyPuestoInput | AsignacionCreateManyPuestoInput[]
    skipDuplicates?: boolean
  }

  export type TenantUpsertWithoutPuestosInput = {
    update: XOR<TenantUpdateWithoutPuestosInput, TenantUncheckedUpdateWithoutPuestosInput>
    create: XOR<TenantCreateWithoutPuestosInput, TenantUncheckedCreateWithoutPuestosInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutPuestosInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutPuestosInput, TenantUncheckedUpdateWithoutPuestosInput>
  }

  export type TenantUpdateWithoutPuestosInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    factor_cobertura?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    margen_objetivo?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUpdateManyWithoutTenantNestedInput
    vigiladores?: VigiladorUpdateManyWithoutTenantNestedInput
    credenciales?: CredencialUpdateManyWithoutTenantNestedInput
    objetivos?: ObjetivoUpdateManyWithoutTenantNestedInput
    asignaciones?: AsignacionUpdateManyWithoutTenantNestedInput
    asistencias?: AsistenciaUpdateManyWithoutTenantNestedInput
    feriados?: FeriadoUpdateManyWithoutTenantNestedInput
    configuracion_costos?: ConfiguracionCostosUpdateOneWithoutTenantNestedInput
    cotizaciones?: CotizacionUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutPuestosInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    factor_cobertura?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    margen_objetivo?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUncheckedUpdateManyWithoutTenantNestedInput
    vigiladores?: VigiladorUncheckedUpdateManyWithoutTenantNestedInput
    credenciales?: CredencialUncheckedUpdateManyWithoutTenantNestedInput
    objetivos?: ObjetivoUncheckedUpdateManyWithoutTenantNestedInput
    asignaciones?: AsignacionUncheckedUpdateManyWithoutTenantNestedInput
    asistencias?: AsistenciaUncheckedUpdateManyWithoutTenantNestedInput
    feriados?: FeriadoUncheckedUpdateManyWithoutTenantNestedInput
    configuracion_costos?: ConfiguracionCostosUncheckedUpdateOneWithoutTenantNestedInput
    cotizaciones?: CotizacionUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type ObjetivoUpsertWithoutPuestosInput = {
    update: XOR<ObjetivoUpdateWithoutPuestosInput, ObjetivoUncheckedUpdateWithoutPuestosInput>
    create: XOR<ObjetivoCreateWithoutPuestosInput, ObjetivoUncheckedCreateWithoutPuestosInput>
    where?: ObjetivoWhereInput
  }

  export type ObjetivoUpdateToOneWithWhereWithoutPuestosInput = {
    where?: ObjetivoWhereInput
    data: XOR<ObjetivoUpdateWithoutPuestosInput, ObjetivoUncheckedUpdateWithoutPuestosInput>
  }

  export type ObjetivoUpdateWithoutPuestosInput = {
    id?: StringFieldUpdateOperationsInput | string
    cliente_id?: StringFieldUpdateOperationsInput | string
    codigo?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    direccion?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutObjetivosNestedInput
  }

  export type ObjetivoUncheckedUpdateWithoutPuestosInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenant_id?: StringFieldUpdateOperationsInput | string
    cliente_id?: StringFieldUpdateOperationsInput | string
    codigo?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    direccion?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AsignacionUpsertWithWhereUniqueWithoutPuestoInput = {
    where: AsignacionWhereUniqueInput
    update: XOR<AsignacionUpdateWithoutPuestoInput, AsignacionUncheckedUpdateWithoutPuestoInput>
    create: XOR<AsignacionCreateWithoutPuestoInput, AsignacionUncheckedCreateWithoutPuestoInput>
  }

  export type AsignacionUpdateWithWhereUniqueWithoutPuestoInput = {
    where: AsignacionWhereUniqueInput
    data: XOR<AsignacionUpdateWithoutPuestoInput, AsignacionUncheckedUpdateWithoutPuestoInput>
  }

  export type AsignacionUpdateManyWithWhereWithoutPuestoInput = {
    where: AsignacionScalarWhereInput
    data: XOR<AsignacionUpdateManyMutationInput, AsignacionUncheckedUpdateManyWithoutPuestoInput>
  }

  export type TenantCreateWithoutAsignacionesInput = {
    id?: string
    nombre: string
    factor_cobertura?: Decimal | DecimalJsLike | number | string
    margen_objetivo?: Decimal | DecimalJsLike | number | string
    created_at?: Date | string
    updated_at?: Date | string
    users?: UserCreateNestedManyWithoutTenantInput
    vigiladores?: VigiladorCreateNestedManyWithoutTenantInput
    credenciales?: CredencialCreateNestedManyWithoutTenantInput
    objetivos?: ObjetivoCreateNestedManyWithoutTenantInput
    puestos?: PuestoCreateNestedManyWithoutTenantInput
    asistencias?: AsistenciaCreateNestedManyWithoutTenantInput
    feriados?: FeriadoCreateNestedManyWithoutTenantInput
    configuracion_costos?: ConfiguracionCostosCreateNestedOneWithoutTenantInput
    cotizaciones?: CotizacionCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutAsignacionesInput = {
    id?: string
    nombre: string
    factor_cobertura?: Decimal | DecimalJsLike | number | string
    margen_objetivo?: Decimal | DecimalJsLike | number | string
    created_at?: Date | string
    updated_at?: Date | string
    users?: UserUncheckedCreateNestedManyWithoutTenantInput
    vigiladores?: VigiladorUncheckedCreateNestedManyWithoutTenantInput
    credenciales?: CredencialUncheckedCreateNestedManyWithoutTenantInput
    objetivos?: ObjetivoUncheckedCreateNestedManyWithoutTenantInput
    puestos?: PuestoUncheckedCreateNestedManyWithoutTenantInput
    asistencias?: AsistenciaUncheckedCreateNestedManyWithoutTenantInput
    feriados?: FeriadoUncheckedCreateNestedManyWithoutTenantInput
    configuracion_costos?: ConfiguracionCostosUncheckedCreateNestedOneWithoutTenantInput
    cotizaciones?: CotizacionUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutAsignacionesInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutAsignacionesInput, TenantUncheckedCreateWithoutAsignacionesInput>
  }

  export type PuestoCreateWithoutAsignacionesInput = {
    id?: string
    nombre: string
    ubicacion?: string | null
    requiere_arma?: boolean
    requiere_movil?: boolean
    esquema_horario?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string
    updated_at?: Date | string
    tenant: TenantCreateNestedOneWithoutPuestosInput
    objetivo?: ObjetivoCreateNestedOneWithoutPuestosInput
  }

  export type PuestoUncheckedCreateWithoutAsignacionesInput = {
    id?: string
    tenant_id: string
    objetivo_id?: string | null
    nombre: string
    ubicacion?: string | null
    requiere_arma?: boolean
    requiere_movil?: boolean
    esquema_horario?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type PuestoCreateOrConnectWithoutAsignacionesInput = {
    where: PuestoWhereUniqueInput
    create: XOR<PuestoCreateWithoutAsignacionesInput, PuestoUncheckedCreateWithoutAsignacionesInput>
  }

  export type VigiladorCreateWithoutAsignacionesInput = {
    id?: string
    legajo_nro: string
    nombre: string
    apellido: string
    documento: string
    estado?: string
    created_at?: Date | string
    updated_at?: Date | string
    deleted_at?: Date | string | null
    tenant: TenantCreateNestedOneWithoutVigiladoresInput
    credenciales?: CredencialCreateNestedManyWithoutVigiladorInput
  }

  export type VigiladorUncheckedCreateWithoutAsignacionesInput = {
    id?: string
    tenant_id: string
    legajo_nro: string
    nombre: string
    apellido: string
    documento: string
    estado?: string
    created_at?: Date | string
    updated_at?: Date | string
    deleted_at?: Date | string | null
    credenciales?: CredencialUncheckedCreateNestedManyWithoutVigiladorInput
  }

  export type VigiladorCreateOrConnectWithoutAsignacionesInput = {
    where: VigiladorWhereUniqueInput
    create: XOR<VigiladorCreateWithoutAsignacionesInput, VigiladorUncheckedCreateWithoutAsignacionesInput>
  }

  export type AsistenciaCreateWithoutAsignacionInput = {
    id?: string
    inicio_real?: Date | string | null
    fin_real?: Date | string | null
    metodo?: string | null
    lat?: Decimal | DecimalJsLike | number | string | null
    lng?: Decimal | DecimalJsLike | number | string | null
    tenant: TenantCreateNestedOneWithoutAsistenciasInput
  }

  export type AsistenciaUncheckedCreateWithoutAsignacionInput = {
    id?: string
    tenant_id: string
    inicio_real?: Date | string | null
    fin_real?: Date | string | null
    metodo?: string | null
    lat?: Decimal | DecimalJsLike | number | string | null
    lng?: Decimal | DecimalJsLike | number | string | null
  }

  export type AsistenciaCreateOrConnectWithoutAsignacionInput = {
    where: AsistenciaWhereUniqueInput
    create: XOR<AsistenciaCreateWithoutAsignacionInput, AsistenciaUncheckedCreateWithoutAsignacionInput>
  }

  export type TenantUpsertWithoutAsignacionesInput = {
    update: XOR<TenantUpdateWithoutAsignacionesInput, TenantUncheckedUpdateWithoutAsignacionesInput>
    create: XOR<TenantCreateWithoutAsignacionesInput, TenantUncheckedCreateWithoutAsignacionesInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutAsignacionesInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutAsignacionesInput, TenantUncheckedUpdateWithoutAsignacionesInput>
  }

  export type TenantUpdateWithoutAsignacionesInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    factor_cobertura?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    margen_objetivo?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUpdateManyWithoutTenantNestedInput
    vigiladores?: VigiladorUpdateManyWithoutTenantNestedInput
    credenciales?: CredencialUpdateManyWithoutTenantNestedInput
    objetivos?: ObjetivoUpdateManyWithoutTenantNestedInput
    puestos?: PuestoUpdateManyWithoutTenantNestedInput
    asistencias?: AsistenciaUpdateManyWithoutTenantNestedInput
    feriados?: FeriadoUpdateManyWithoutTenantNestedInput
    configuracion_costos?: ConfiguracionCostosUpdateOneWithoutTenantNestedInput
    cotizaciones?: CotizacionUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutAsignacionesInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    factor_cobertura?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    margen_objetivo?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUncheckedUpdateManyWithoutTenantNestedInput
    vigiladores?: VigiladorUncheckedUpdateManyWithoutTenantNestedInput
    credenciales?: CredencialUncheckedUpdateManyWithoutTenantNestedInput
    objetivos?: ObjetivoUncheckedUpdateManyWithoutTenantNestedInput
    puestos?: PuestoUncheckedUpdateManyWithoutTenantNestedInput
    asistencias?: AsistenciaUncheckedUpdateManyWithoutTenantNestedInput
    feriados?: FeriadoUncheckedUpdateManyWithoutTenantNestedInput
    configuracion_costos?: ConfiguracionCostosUncheckedUpdateOneWithoutTenantNestedInput
    cotizaciones?: CotizacionUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type PuestoUpsertWithoutAsignacionesInput = {
    update: XOR<PuestoUpdateWithoutAsignacionesInput, PuestoUncheckedUpdateWithoutAsignacionesInput>
    create: XOR<PuestoCreateWithoutAsignacionesInput, PuestoUncheckedCreateWithoutAsignacionesInput>
    where?: PuestoWhereInput
  }

  export type PuestoUpdateToOneWithWhereWithoutAsignacionesInput = {
    where?: PuestoWhereInput
    data: XOR<PuestoUpdateWithoutAsignacionesInput, PuestoUncheckedUpdateWithoutAsignacionesInput>
  }

  export type PuestoUpdateWithoutAsignacionesInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    ubicacion?: NullableStringFieldUpdateOperationsInput | string | null
    requiere_arma?: BoolFieldUpdateOperationsInput | boolean
    requiere_movil?: BoolFieldUpdateOperationsInput | boolean
    esquema_horario?: NullableJsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutPuestosNestedInput
    objetivo?: ObjetivoUpdateOneWithoutPuestosNestedInput
  }

  export type PuestoUncheckedUpdateWithoutAsignacionesInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenant_id?: StringFieldUpdateOperationsInput | string
    objetivo_id?: NullableStringFieldUpdateOperationsInput | string | null
    nombre?: StringFieldUpdateOperationsInput | string
    ubicacion?: NullableStringFieldUpdateOperationsInput | string | null
    requiere_arma?: BoolFieldUpdateOperationsInput | boolean
    requiere_movil?: BoolFieldUpdateOperationsInput | boolean
    esquema_horario?: NullableJsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VigiladorUpsertWithoutAsignacionesInput = {
    update: XOR<VigiladorUpdateWithoutAsignacionesInput, VigiladorUncheckedUpdateWithoutAsignacionesInput>
    create: XOR<VigiladorCreateWithoutAsignacionesInput, VigiladorUncheckedCreateWithoutAsignacionesInput>
    where?: VigiladorWhereInput
  }

  export type VigiladorUpdateToOneWithWhereWithoutAsignacionesInput = {
    where?: VigiladorWhereInput
    data: XOR<VigiladorUpdateWithoutAsignacionesInput, VigiladorUncheckedUpdateWithoutAsignacionesInput>
  }

  export type VigiladorUpdateWithoutAsignacionesInput = {
    id?: StringFieldUpdateOperationsInput | string
    legajo_nro?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    apellido?: StringFieldUpdateOperationsInput | string
    documento?: StringFieldUpdateOperationsInput | string
    estado?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tenant?: TenantUpdateOneRequiredWithoutVigiladoresNestedInput
    credenciales?: CredencialUpdateManyWithoutVigiladorNestedInput
  }

  export type VigiladorUncheckedUpdateWithoutAsignacionesInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenant_id?: StringFieldUpdateOperationsInput | string
    legajo_nro?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    apellido?: StringFieldUpdateOperationsInput | string
    documento?: StringFieldUpdateOperationsInput | string
    estado?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    credenciales?: CredencialUncheckedUpdateManyWithoutVigiladorNestedInput
  }

  export type AsistenciaUpsertWithoutAsignacionInput = {
    update: XOR<AsistenciaUpdateWithoutAsignacionInput, AsistenciaUncheckedUpdateWithoutAsignacionInput>
    create: XOR<AsistenciaCreateWithoutAsignacionInput, AsistenciaUncheckedCreateWithoutAsignacionInput>
    where?: AsistenciaWhereInput
  }

  export type AsistenciaUpdateToOneWithWhereWithoutAsignacionInput = {
    where?: AsistenciaWhereInput
    data: XOR<AsistenciaUpdateWithoutAsignacionInput, AsistenciaUncheckedUpdateWithoutAsignacionInput>
  }

  export type AsistenciaUpdateWithoutAsignacionInput = {
    id?: StringFieldUpdateOperationsInput | string
    inicio_real?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fin_real?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metodo?: NullableStringFieldUpdateOperationsInput | string | null
    lat?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    lng?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    tenant?: TenantUpdateOneRequiredWithoutAsistenciasNestedInput
  }

  export type AsistenciaUncheckedUpdateWithoutAsignacionInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenant_id?: StringFieldUpdateOperationsInput | string
    inicio_real?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fin_real?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metodo?: NullableStringFieldUpdateOperationsInput | string | null
    lat?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    lng?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
  }

  export type TenantCreateWithoutAsistenciasInput = {
    id?: string
    nombre: string
    factor_cobertura?: Decimal | DecimalJsLike | number | string
    margen_objetivo?: Decimal | DecimalJsLike | number | string
    created_at?: Date | string
    updated_at?: Date | string
    users?: UserCreateNestedManyWithoutTenantInput
    vigiladores?: VigiladorCreateNestedManyWithoutTenantInput
    credenciales?: CredencialCreateNestedManyWithoutTenantInput
    objetivos?: ObjetivoCreateNestedManyWithoutTenantInput
    puestos?: PuestoCreateNestedManyWithoutTenantInput
    asignaciones?: AsignacionCreateNestedManyWithoutTenantInput
    feriados?: FeriadoCreateNestedManyWithoutTenantInput
    configuracion_costos?: ConfiguracionCostosCreateNestedOneWithoutTenantInput
    cotizaciones?: CotizacionCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutAsistenciasInput = {
    id?: string
    nombre: string
    factor_cobertura?: Decimal | DecimalJsLike | number | string
    margen_objetivo?: Decimal | DecimalJsLike | number | string
    created_at?: Date | string
    updated_at?: Date | string
    users?: UserUncheckedCreateNestedManyWithoutTenantInput
    vigiladores?: VigiladorUncheckedCreateNestedManyWithoutTenantInput
    credenciales?: CredencialUncheckedCreateNestedManyWithoutTenantInput
    objetivos?: ObjetivoUncheckedCreateNestedManyWithoutTenantInput
    puestos?: PuestoUncheckedCreateNestedManyWithoutTenantInput
    asignaciones?: AsignacionUncheckedCreateNestedManyWithoutTenantInput
    feriados?: FeriadoUncheckedCreateNestedManyWithoutTenantInput
    configuracion_costos?: ConfiguracionCostosUncheckedCreateNestedOneWithoutTenantInput
    cotizaciones?: CotizacionUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutAsistenciasInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutAsistenciasInput, TenantUncheckedCreateWithoutAsistenciasInput>
  }

  export type AsignacionCreateWithoutAsistenciaInput = {
    id?: string
    fecha: Date | string
    hora_inicio: string
    hora_fin: string
    estado?: string
    created_at?: Date | string
    tenant: TenantCreateNestedOneWithoutAsignacionesInput
    puesto: PuestoCreateNestedOneWithoutAsignacionesInput
    vigilador?: VigiladorCreateNestedOneWithoutAsignacionesInput
  }

  export type AsignacionUncheckedCreateWithoutAsistenciaInput = {
    id?: string
    tenant_id: string
    puesto_id: string
    vigilador_id?: string | null
    fecha: Date | string
    hora_inicio: string
    hora_fin: string
    estado?: string
    created_at?: Date | string
  }

  export type AsignacionCreateOrConnectWithoutAsistenciaInput = {
    where: AsignacionWhereUniqueInput
    create: XOR<AsignacionCreateWithoutAsistenciaInput, AsignacionUncheckedCreateWithoutAsistenciaInput>
  }

  export type TenantUpsertWithoutAsistenciasInput = {
    update: XOR<TenantUpdateWithoutAsistenciasInput, TenantUncheckedUpdateWithoutAsistenciasInput>
    create: XOR<TenantCreateWithoutAsistenciasInput, TenantUncheckedCreateWithoutAsistenciasInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutAsistenciasInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutAsistenciasInput, TenantUncheckedUpdateWithoutAsistenciasInput>
  }

  export type TenantUpdateWithoutAsistenciasInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    factor_cobertura?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    margen_objetivo?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUpdateManyWithoutTenantNestedInput
    vigiladores?: VigiladorUpdateManyWithoutTenantNestedInput
    credenciales?: CredencialUpdateManyWithoutTenantNestedInput
    objetivos?: ObjetivoUpdateManyWithoutTenantNestedInput
    puestos?: PuestoUpdateManyWithoutTenantNestedInput
    asignaciones?: AsignacionUpdateManyWithoutTenantNestedInput
    feriados?: FeriadoUpdateManyWithoutTenantNestedInput
    configuracion_costos?: ConfiguracionCostosUpdateOneWithoutTenantNestedInput
    cotizaciones?: CotizacionUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutAsistenciasInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    factor_cobertura?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    margen_objetivo?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUncheckedUpdateManyWithoutTenantNestedInput
    vigiladores?: VigiladorUncheckedUpdateManyWithoutTenantNestedInput
    credenciales?: CredencialUncheckedUpdateManyWithoutTenantNestedInput
    objetivos?: ObjetivoUncheckedUpdateManyWithoutTenantNestedInput
    puestos?: PuestoUncheckedUpdateManyWithoutTenantNestedInput
    asignaciones?: AsignacionUncheckedUpdateManyWithoutTenantNestedInput
    feriados?: FeriadoUncheckedUpdateManyWithoutTenantNestedInput
    configuracion_costos?: ConfiguracionCostosUncheckedUpdateOneWithoutTenantNestedInput
    cotizaciones?: CotizacionUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type AsignacionUpsertWithoutAsistenciaInput = {
    update: XOR<AsignacionUpdateWithoutAsistenciaInput, AsignacionUncheckedUpdateWithoutAsistenciaInput>
    create: XOR<AsignacionCreateWithoutAsistenciaInput, AsignacionUncheckedCreateWithoutAsistenciaInput>
    where?: AsignacionWhereInput
  }

  export type AsignacionUpdateToOneWithWhereWithoutAsistenciaInput = {
    where?: AsignacionWhereInput
    data: XOR<AsignacionUpdateWithoutAsistenciaInput, AsignacionUncheckedUpdateWithoutAsistenciaInput>
  }

  export type AsignacionUpdateWithoutAsistenciaInput = {
    id?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    hora_inicio?: StringFieldUpdateOperationsInput | string
    hora_fin?: StringFieldUpdateOperationsInput | string
    estado?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutAsignacionesNestedInput
    puesto?: PuestoUpdateOneRequiredWithoutAsignacionesNestedInput
    vigilador?: VigiladorUpdateOneWithoutAsignacionesNestedInput
  }

  export type AsignacionUncheckedUpdateWithoutAsistenciaInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenant_id?: StringFieldUpdateOperationsInput | string
    puesto_id?: StringFieldUpdateOperationsInput | string
    vigilador_id?: NullableStringFieldUpdateOperationsInput | string | null
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    hora_inicio?: StringFieldUpdateOperationsInput | string
    hora_fin?: StringFieldUpdateOperationsInput | string
    estado?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantCreateWithoutFeriadosInput = {
    id?: string
    nombre: string
    factor_cobertura?: Decimal | DecimalJsLike | number | string
    margen_objetivo?: Decimal | DecimalJsLike | number | string
    created_at?: Date | string
    updated_at?: Date | string
    users?: UserCreateNestedManyWithoutTenantInput
    vigiladores?: VigiladorCreateNestedManyWithoutTenantInput
    credenciales?: CredencialCreateNestedManyWithoutTenantInput
    objetivos?: ObjetivoCreateNestedManyWithoutTenantInput
    puestos?: PuestoCreateNestedManyWithoutTenantInput
    asignaciones?: AsignacionCreateNestedManyWithoutTenantInput
    asistencias?: AsistenciaCreateNestedManyWithoutTenantInput
    configuracion_costos?: ConfiguracionCostosCreateNestedOneWithoutTenantInput
    cotizaciones?: CotizacionCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutFeriadosInput = {
    id?: string
    nombre: string
    factor_cobertura?: Decimal | DecimalJsLike | number | string
    margen_objetivo?: Decimal | DecimalJsLike | number | string
    created_at?: Date | string
    updated_at?: Date | string
    users?: UserUncheckedCreateNestedManyWithoutTenantInput
    vigiladores?: VigiladorUncheckedCreateNestedManyWithoutTenantInput
    credenciales?: CredencialUncheckedCreateNestedManyWithoutTenantInput
    objetivos?: ObjetivoUncheckedCreateNestedManyWithoutTenantInput
    puestos?: PuestoUncheckedCreateNestedManyWithoutTenantInput
    asignaciones?: AsignacionUncheckedCreateNestedManyWithoutTenantInput
    asistencias?: AsistenciaUncheckedCreateNestedManyWithoutTenantInput
    configuracion_costos?: ConfiguracionCostosUncheckedCreateNestedOneWithoutTenantInput
    cotizaciones?: CotizacionUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutFeriadosInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutFeriadosInput, TenantUncheckedCreateWithoutFeriadosInput>
  }

  export type TenantUpsertWithoutFeriadosInput = {
    update: XOR<TenantUpdateWithoutFeriadosInput, TenantUncheckedUpdateWithoutFeriadosInput>
    create: XOR<TenantCreateWithoutFeriadosInput, TenantUncheckedCreateWithoutFeriadosInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutFeriadosInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutFeriadosInput, TenantUncheckedUpdateWithoutFeriadosInput>
  }

  export type TenantUpdateWithoutFeriadosInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    factor_cobertura?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    margen_objetivo?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUpdateManyWithoutTenantNestedInput
    vigiladores?: VigiladorUpdateManyWithoutTenantNestedInput
    credenciales?: CredencialUpdateManyWithoutTenantNestedInput
    objetivos?: ObjetivoUpdateManyWithoutTenantNestedInput
    puestos?: PuestoUpdateManyWithoutTenantNestedInput
    asignaciones?: AsignacionUpdateManyWithoutTenantNestedInput
    asistencias?: AsistenciaUpdateManyWithoutTenantNestedInput
    configuracion_costos?: ConfiguracionCostosUpdateOneWithoutTenantNestedInput
    cotizaciones?: CotizacionUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutFeriadosInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    factor_cobertura?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    margen_objetivo?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUncheckedUpdateManyWithoutTenantNestedInput
    vigiladores?: VigiladorUncheckedUpdateManyWithoutTenantNestedInput
    credenciales?: CredencialUncheckedUpdateManyWithoutTenantNestedInput
    objetivos?: ObjetivoUncheckedUpdateManyWithoutTenantNestedInput
    puestos?: PuestoUncheckedUpdateManyWithoutTenantNestedInput
    asignaciones?: AsignacionUncheckedUpdateManyWithoutTenantNestedInput
    asistencias?: AsistenciaUncheckedUpdateManyWithoutTenantNestedInput
    configuracion_costos?: ConfiguracionCostosUncheckedUpdateOneWithoutTenantNestedInput
    cotizaciones?: CotizacionUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type TenantCreateWithoutConfiguracion_costosInput = {
    id?: string
    nombre: string
    factor_cobertura?: Decimal | DecimalJsLike | number | string
    margen_objetivo?: Decimal | DecimalJsLike | number | string
    created_at?: Date | string
    updated_at?: Date | string
    users?: UserCreateNestedManyWithoutTenantInput
    vigiladores?: VigiladorCreateNestedManyWithoutTenantInput
    credenciales?: CredencialCreateNestedManyWithoutTenantInput
    objetivos?: ObjetivoCreateNestedManyWithoutTenantInput
    puestos?: PuestoCreateNestedManyWithoutTenantInput
    asignaciones?: AsignacionCreateNestedManyWithoutTenantInput
    asistencias?: AsistenciaCreateNestedManyWithoutTenantInput
    feriados?: FeriadoCreateNestedManyWithoutTenantInput
    cotizaciones?: CotizacionCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutConfiguracion_costosInput = {
    id?: string
    nombre: string
    factor_cobertura?: Decimal | DecimalJsLike | number | string
    margen_objetivo?: Decimal | DecimalJsLike | number | string
    created_at?: Date | string
    updated_at?: Date | string
    users?: UserUncheckedCreateNestedManyWithoutTenantInput
    vigiladores?: VigiladorUncheckedCreateNestedManyWithoutTenantInput
    credenciales?: CredencialUncheckedCreateNestedManyWithoutTenantInput
    objetivos?: ObjetivoUncheckedCreateNestedManyWithoutTenantInput
    puestos?: PuestoUncheckedCreateNestedManyWithoutTenantInput
    asignaciones?: AsignacionUncheckedCreateNestedManyWithoutTenantInput
    asistencias?: AsistenciaUncheckedCreateNestedManyWithoutTenantInput
    feriados?: FeriadoUncheckedCreateNestedManyWithoutTenantInput
    cotizaciones?: CotizacionUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutConfiguracion_costosInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutConfiguracion_costosInput, TenantUncheckedCreateWithoutConfiguracion_costosInput>
  }

  export type TenantUpsertWithoutConfiguracion_costosInput = {
    update: XOR<TenantUpdateWithoutConfiguracion_costosInput, TenantUncheckedUpdateWithoutConfiguracion_costosInput>
    create: XOR<TenantCreateWithoutConfiguracion_costosInput, TenantUncheckedCreateWithoutConfiguracion_costosInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutConfiguracion_costosInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutConfiguracion_costosInput, TenantUncheckedUpdateWithoutConfiguracion_costosInput>
  }

  export type TenantUpdateWithoutConfiguracion_costosInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    factor_cobertura?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    margen_objetivo?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUpdateManyWithoutTenantNestedInput
    vigiladores?: VigiladorUpdateManyWithoutTenantNestedInput
    credenciales?: CredencialUpdateManyWithoutTenantNestedInput
    objetivos?: ObjetivoUpdateManyWithoutTenantNestedInput
    puestos?: PuestoUpdateManyWithoutTenantNestedInput
    asignaciones?: AsignacionUpdateManyWithoutTenantNestedInput
    asistencias?: AsistenciaUpdateManyWithoutTenantNestedInput
    feriados?: FeriadoUpdateManyWithoutTenantNestedInput
    cotizaciones?: CotizacionUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutConfiguracion_costosInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    factor_cobertura?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    margen_objetivo?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUncheckedUpdateManyWithoutTenantNestedInput
    vigiladores?: VigiladorUncheckedUpdateManyWithoutTenantNestedInput
    credenciales?: CredencialUncheckedUpdateManyWithoutTenantNestedInput
    objetivos?: ObjetivoUncheckedUpdateManyWithoutTenantNestedInput
    puestos?: PuestoUncheckedUpdateManyWithoutTenantNestedInput
    asignaciones?: AsignacionUncheckedUpdateManyWithoutTenantNestedInput
    asistencias?: AsistenciaUncheckedUpdateManyWithoutTenantNestedInput
    feriados?: FeriadoUncheckedUpdateManyWithoutTenantNestedInput
    cotizaciones?: CotizacionUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type TenantCreateWithoutCotizacionesInput = {
    id?: string
    nombre: string
    factor_cobertura?: Decimal | DecimalJsLike | number | string
    margen_objetivo?: Decimal | DecimalJsLike | number | string
    created_at?: Date | string
    updated_at?: Date | string
    users?: UserCreateNestedManyWithoutTenantInput
    vigiladores?: VigiladorCreateNestedManyWithoutTenantInput
    credenciales?: CredencialCreateNestedManyWithoutTenantInput
    objetivos?: ObjetivoCreateNestedManyWithoutTenantInput
    puestos?: PuestoCreateNestedManyWithoutTenantInput
    asignaciones?: AsignacionCreateNestedManyWithoutTenantInput
    asistencias?: AsistenciaCreateNestedManyWithoutTenantInput
    feriados?: FeriadoCreateNestedManyWithoutTenantInput
    configuracion_costos?: ConfiguracionCostosCreateNestedOneWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutCotizacionesInput = {
    id?: string
    nombre: string
    factor_cobertura?: Decimal | DecimalJsLike | number | string
    margen_objetivo?: Decimal | DecimalJsLike | number | string
    created_at?: Date | string
    updated_at?: Date | string
    users?: UserUncheckedCreateNestedManyWithoutTenantInput
    vigiladores?: VigiladorUncheckedCreateNestedManyWithoutTenantInput
    credenciales?: CredencialUncheckedCreateNestedManyWithoutTenantInput
    objetivos?: ObjetivoUncheckedCreateNestedManyWithoutTenantInput
    puestos?: PuestoUncheckedCreateNestedManyWithoutTenantInput
    asignaciones?: AsignacionUncheckedCreateNestedManyWithoutTenantInput
    asistencias?: AsistenciaUncheckedCreateNestedManyWithoutTenantInput
    feriados?: FeriadoUncheckedCreateNestedManyWithoutTenantInput
    configuracion_costos?: ConfiguracionCostosUncheckedCreateNestedOneWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutCotizacionesInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutCotizacionesInput, TenantUncheckedCreateWithoutCotizacionesInput>
  }

  export type CotizacionItemCreateWithoutCotizacionInput = {
    id?: string
    puesto_nombre: string
    horas_mensuales: number
    costo_hora: Decimal | DecimalJsLike | number | string
    margen: Decimal | DecimalJsLike | number | string
    subtotal: Decimal | DecimalJsLike | number | string
  }

  export type CotizacionItemUncheckedCreateWithoutCotizacionInput = {
    id?: string
    puesto_nombre: string
    horas_mensuales: number
    costo_hora: Decimal | DecimalJsLike | number | string
    margen: Decimal | DecimalJsLike | number | string
    subtotal: Decimal | DecimalJsLike | number | string
  }

  export type CotizacionItemCreateOrConnectWithoutCotizacionInput = {
    where: CotizacionItemWhereUniqueInput
    create: XOR<CotizacionItemCreateWithoutCotizacionInput, CotizacionItemUncheckedCreateWithoutCotizacionInput>
  }

  export type CotizacionItemCreateManyCotizacionInputEnvelope = {
    data: CotizacionItemCreateManyCotizacionInput | CotizacionItemCreateManyCotizacionInput[]
    skipDuplicates?: boolean
  }

  export type TenantUpsertWithoutCotizacionesInput = {
    update: XOR<TenantUpdateWithoutCotizacionesInput, TenantUncheckedUpdateWithoutCotizacionesInput>
    create: XOR<TenantCreateWithoutCotizacionesInput, TenantUncheckedCreateWithoutCotizacionesInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutCotizacionesInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutCotizacionesInput, TenantUncheckedUpdateWithoutCotizacionesInput>
  }

  export type TenantUpdateWithoutCotizacionesInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    factor_cobertura?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    margen_objetivo?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUpdateManyWithoutTenantNestedInput
    vigiladores?: VigiladorUpdateManyWithoutTenantNestedInput
    credenciales?: CredencialUpdateManyWithoutTenantNestedInput
    objetivos?: ObjetivoUpdateManyWithoutTenantNestedInput
    puestos?: PuestoUpdateManyWithoutTenantNestedInput
    asignaciones?: AsignacionUpdateManyWithoutTenantNestedInput
    asistencias?: AsistenciaUpdateManyWithoutTenantNestedInput
    feriados?: FeriadoUpdateManyWithoutTenantNestedInput
    configuracion_costos?: ConfiguracionCostosUpdateOneWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutCotizacionesInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    factor_cobertura?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    margen_objetivo?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUncheckedUpdateManyWithoutTenantNestedInput
    vigiladores?: VigiladorUncheckedUpdateManyWithoutTenantNestedInput
    credenciales?: CredencialUncheckedUpdateManyWithoutTenantNestedInput
    objetivos?: ObjetivoUncheckedUpdateManyWithoutTenantNestedInput
    puestos?: PuestoUncheckedUpdateManyWithoutTenantNestedInput
    asignaciones?: AsignacionUncheckedUpdateManyWithoutTenantNestedInput
    asistencias?: AsistenciaUncheckedUpdateManyWithoutTenantNestedInput
    feriados?: FeriadoUncheckedUpdateManyWithoutTenantNestedInput
    configuracion_costos?: ConfiguracionCostosUncheckedUpdateOneWithoutTenantNestedInput
  }

  export type CotizacionItemUpsertWithWhereUniqueWithoutCotizacionInput = {
    where: CotizacionItemWhereUniqueInput
    update: XOR<CotizacionItemUpdateWithoutCotizacionInput, CotizacionItemUncheckedUpdateWithoutCotizacionInput>
    create: XOR<CotizacionItemCreateWithoutCotizacionInput, CotizacionItemUncheckedCreateWithoutCotizacionInput>
  }

  export type CotizacionItemUpdateWithWhereUniqueWithoutCotizacionInput = {
    where: CotizacionItemWhereUniqueInput
    data: XOR<CotizacionItemUpdateWithoutCotizacionInput, CotizacionItemUncheckedUpdateWithoutCotizacionInput>
  }

  export type CotizacionItemUpdateManyWithWhereWithoutCotizacionInput = {
    where: CotizacionItemScalarWhereInput
    data: XOR<CotizacionItemUpdateManyMutationInput, CotizacionItemUncheckedUpdateManyWithoutCotizacionInput>
  }

  export type CotizacionItemScalarWhereInput = {
    AND?: CotizacionItemScalarWhereInput | CotizacionItemScalarWhereInput[]
    OR?: CotizacionItemScalarWhereInput[]
    NOT?: CotizacionItemScalarWhereInput | CotizacionItemScalarWhereInput[]
    id?: UuidFilter<"CotizacionItem"> | string
    cotizacion_id?: UuidFilter<"CotizacionItem"> | string
    puesto_nombre?: StringFilter<"CotizacionItem"> | string
    horas_mensuales?: IntFilter<"CotizacionItem"> | number
    costo_hora?: DecimalFilter<"CotizacionItem"> | Decimal | DecimalJsLike | number | string
    margen?: DecimalFilter<"CotizacionItem"> | Decimal | DecimalJsLike | number | string
    subtotal?: DecimalFilter<"CotizacionItem"> | Decimal | DecimalJsLike | number | string
  }

  export type CotizacionCreateWithoutItemsInput = {
    id?: string
    cliente_nombre: string
    vencimiento: Date | string
    estado?: string
    total_mensual: Decimal | DecimalJsLike | number | string
    created_at?: Date | string
    updated_at?: Date | string
    tenant: TenantCreateNestedOneWithoutCotizacionesInput
  }

  export type CotizacionUncheckedCreateWithoutItemsInput = {
    id?: string
    tenant_id: string
    cliente_nombre: string
    vencimiento: Date | string
    estado?: string
    total_mensual: Decimal | DecimalJsLike | number | string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type CotizacionCreateOrConnectWithoutItemsInput = {
    where: CotizacionWhereUniqueInput
    create: XOR<CotizacionCreateWithoutItemsInput, CotizacionUncheckedCreateWithoutItemsInput>
  }

  export type CotizacionUpsertWithoutItemsInput = {
    update: XOR<CotizacionUpdateWithoutItemsInput, CotizacionUncheckedUpdateWithoutItemsInput>
    create: XOR<CotizacionCreateWithoutItemsInput, CotizacionUncheckedCreateWithoutItemsInput>
    where?: CotizacionWhereInput
  }

  export type CotizacionUpdateToOneWithWhereWithoutItemsInput = {
    where?: CotizacionWhereInput
    data: XOR<CotizacionUpdateWithoutItemsInput, CotizacionUncheckedUpdateWithoutItemsInput>
  }

  export type CotizacionUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    cliente_nombre?: StringFieldUpdateOperationsInput | string
    vencimiento?: DateTimeFieldUpdateOperationsInput | Date | string
    estado?: StringFieldUpdateOperationsInput | string
    total_mensual?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutCotizacionesNestedInput
  }

  export type CotizacionUncheckedUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenant_id?: StringFieldUpdateOperationsInput | string
    cliente_nombre?: StringFieldUpdateOperationsInput | string
    vencimiento?: DateTimeFieldUpdateOperationsInput | Date | string
    estado?: StringFieldUpdateOperationsInput | string
    total_mensual?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateManyTenantInput = {
    id?: string
    email: string
    password: string
    role?: string
    created_at?: Date | string
    updated_at?: Date | string
    deleted_at?: Date | string | null
  }

  export type VigiladorCreateManyTenantInput = {
    id?: string
    legajo_nro: string
    nombre: string
    apellido: string
    documento: string
    estado?: string
    created_at?: Date | string
    updated_at?: Date | string
    deleted_at?: Date | string | null
  }

  export type CredencialCreateManyTenantInput = {
    id?: string
    vigilador_id: string
    tipo: string
    numero?: string | null
    organismo?: string | null
    emitida_el?: Date | string | null
    vence_el?: Date | string | null
    created_at?: Date | string
  }

  export type ObjetivoCreateManyTenantInput = {
    id?: string
    cliente_id: string
    codigo: string
    nombre: string
    direccion?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type PuestoCreateManyTenantInput = {
    id?: string
    objetivo_id?: string | null
    nombre: string
    ubicacion?: string | null
    requiere_arma?: boolean
    requiere_movil?: boolean
    esquema_horario?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type AsignacionCreateManyTenantInput = {
    id?: string
    puesto_id: string
    vigilador_id?: string | null
    fecha: Date | string
    hora_inicio: string
    hora_fin: string
    estado?: string
    created_at?: Date | string
  }

  export type AsistenciaCreateManyTenantInput = {
    id?: string
    asignacion_id: string
    inicio_real?: Date | string | null
    fin_real?: Date | string | null
    metodo?: string | null
    lat?: Decimal | DecimalJsLike | number | string | null
    lng?: Decimal | DecimalJsLike | number | string | null
  }

  export type FeriadoCreateManyTenantInput = {
    id?: string
    nombre: string
    fecha: Date | string
    created_at?: Date | string
  }

  export type CotizacionCreateManyTenantInput = {
    id?: string
    cliente_nombre: string
    vencimiento: Date | string
    estado?: string
    total_mensual: Decimal | DecimalJsLike | number | string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type UserUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserUncheckedUpdateManyWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type VigiladorUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    legajo_nro?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    apellido?: StringFieldUpdateOperationsInput | string
    documento?: StringFieldUpdateOperationsInput | string
    estado?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    credenciales?: CredencialUpdateManyWithoutVigiladorNestedInput
    asignaciones?: AsignacionUpdateManyWithoutVigiladorNestedInput
  }

  export type VigiladorUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    legajo_nro?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    apellido?: StringFieldUpdateOperationsInput | string
    documento?: StringFieldUpdateOperationsInput | string
    estado?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    credenciales?: CredencialUncheckedUpdateManyWithoutVigiladorNestedInput
    asignaciones?: AsignacionUncheckedUpdateManyWithoutVigiladorNestedInput
  }

  export type VigiladorUncheckedUpdateManyWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    legajo_nro?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    apellido?: StringFieldUpdateOperationsInput | string
    documento?: StringFieldUpdateOperationsInput | string
    estado?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CredencialUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    numero?: NullableStringFieldUpdateOperationsInput | string | null
    organismo?: NullableStringFieldUpdateOperationsInput | string | null
    emitida_el?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    vence_el?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    vigilador?: VigiladorUpdateOneRequiredWithoutCredencialesNestedInput
  }

  export type CredencialUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    vigilador_id?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    numero?: NullableStringFieldUpdateOperationsInput | string | null
    organismo?: NullableStringFieldUpdateOperationsInput | string | null
    emitida_el?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    vence_el?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CredencialUncheckedUpdateManyWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    vigilador_id?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    numero?: NullableStringFieldUpdateOperationsInput | string | null
    organismo?: NullableStringFieldUpdateOperationsInput | string | null
    emitida_el?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    vence_el?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ObjetivoUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    cliente_id?: StringFieldUpdateOperationsInput | string
    codigo?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    direccion?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    puestos?: PuestoUpdateManyWithoutObjetivoNestedInput
  }

  export type ObjetivoUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    cliente_id?: StringFieldUpdateOperationsInput | string
    codigo?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    direccion?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    puestos?: PuestoUncheckedUpdateManyWithoutObjetivoNestedInput
  }

  export type ObjetivoUncheckedUpdateManyWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    cliente_id?: StringFieldUpdateOperationsInput | string
    codigo?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    direccion?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PuestoUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    ubicacion?: NullableStringFieldUpdateOperationsInput | string | null
    requiere_arma?: BoolFieldUpdateOperationsInput | boolean
    requiere_movil?: BoolFieldUpdateOperationsInput | boolean
    esquema_horario?: NullableJsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    objetivo?: ObjetivoUpdateOneWithoutPuestosNestedInput
    asignaciones?: AsignacionUpdateManyWithoutPuestoNestedInput
  }

  export type PuestoUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    objetivo_id?: NullableStringFieldUpdateOperationsInput | string | null
    nombre?: StringFieldUpdateOperationsInput | string
    ubicacion?: NullableStringFieldUpdateOperationsInput | string | null
    requiere_arma?: BoolFieldUpdateOperationsInput | boolean
    requiere_movil?: BoolFieldUpdateOperationsInput | boolean
    esquema_horario?: NullableJsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    asignaciones?: AsignacionUncheckedUpdateManyWithoutPuestoNestedInput
  }

  export type PuestoUncheckedUpdateManyWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    objetivo_id?: NullableStringFieldUpdateOperationsInput | string | null
    nombre?: StringFieldUpdateOperationsInput | string
    ubicacion?: NullableStringFieldUpdateOperationsInput | string | null
    requiere_arma?: BoolFieldUpdateOperationsInput | boolean
    requiere_movil?: BoolFieldUpdateOperationsInput | boolean
    esquema_horario?: NullableJsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AsignacionUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    hora_inicio?: StringFieldUpdateOperationsInput | string
    hora_fin?: StringFieldUpdateOperationsInput | string
    estado?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    puesto?: PuestoUpdateOneRequiredWithoutAsignacionesNestedInput
    vigilador?: VigiladorUpdateOneWithoutAsignacionesNestedInput
    asistencia?: AsistenciaUpdateOneWithoutAsignacionNestedInput
  }

  export type AsignacionUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    puesto_id?: StringFieldUpdateOperationsInput | string
    vigilador_id?: NullableStringFieldUpdateOperationsInput | string | null
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    hora_inicio?: StringFieldUpdateOperationsInput | string
    hora_fin?: StringFieldUpdateOperationsInput | string
    estado?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    asistencia?: AsistenciaUncheckedUpdateOneWithoutAsignacionNestedInput
  }

  export type AsignacionUncheckedUpdateManyWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    puesto_id?: StringFieldUpdateOperationsInput | string
    vigilador_id?: NullableStringFieldUpdateOperationsInput | string | null
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    hora_inicio?: StringFieldUpdateOperationsInput | string
    hora_fin?: StringFieldUpdateOperationsInput | string
    estado?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AsistenciaUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    inicio_real?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fin_real?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metodo?: NullableStringFieldUpdateOperationsInput | string | null
    lat?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    lng?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    asignacion?: AsignacionUpdateOneRequiredWithoutAsistenciaNestedInput
  }

  export type AsistenciaUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    asignacion_id?: StringFieldUpdateOperationsInput | string
    inicio_real?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fin_real?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metodo?: NullableStringFieldUpdateOperationsInput | string | null
    lat?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    lng?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
  }

  export type AsistenciaUncheckedUpdateManyWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    asignacion_id?: StringFieldUpdateOperationsInput | string
    inicio_real?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fin_real?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metodo?: NullableStringFieldUpdateOperationsInput | string | null
    lat?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    lng?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
  }

  export type FeriadoUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FeriadoUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FeriadoUncheckedUpdateManyWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CotizacionUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    cliente_nombre?: StringFieldUpdateOperationsInput | string
    vencimiento?: DateTimeFieldUpdateOperationsInput | Date | string
    estado?: StringFieldUpdateOperationsInput | string
    total_mensual?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: CotizacionItemUpdateManyWithoutCotizacionNestedInput
  }

  export type CotizacionUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    cliente_nombre?: StringFieldUpdateOperationsInput | string
    vencimiento?: DateTimeFieldUpdateOperationsInput | Date | string
    estado?: StringFieldUpdateOperationsInput | string
    total_mensual?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: CotizacionItemUncheckedUpdateManyWithoutCotizacionNestedInput
  }

  export type CotizacionUncheckedUpdateManyWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    cliente_nombre?: StringFieldUpdateOperationsInput | string
    vencimiento?: DateTimeFieldUpdateOperationsInput | Date | string
    estado?: StringFieldUpdateOperationsInput | string
    total_mensual?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CredencialCreateManyVigiladorInput = {
    id?: string
    tenant_id: string
    tipo: string
    numero?: string | null
    organismo?: string | null
    emitida_el?: Date | string | null
    vence_el?: Date | string | null
    created_at?: Date | string
  }

  export type AsignacionCreateManyVigiladorInput = {
    id?: string
    tenant_id: string
    puesto_id: string
    fecha: Date | string
    hora_inicio: string
    hora_fin: string
    estado?: string
    created_at?: Date | string
  }

  export type CredencialUpdateWithoutVigiladorInput = {
    id?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    numero?: NullableStringFieldUpdateOperationsInput | string | null
    organismo?: NullableStringFieldUpdateOperationsInput | string | null
    emitida_el?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    vence_el?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutCredencialesNestedInput
  }

  export type CredencialUncheckedUpdateWithoutVigiladorInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenant_id?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    numero?: NullableStringFieldUpdateOperationsInput | string | null
    organismo?: NullableStringFieldUpdateOperationsInput | string | null
    emitida_el?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    vence_el?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CredencialUncheckedUpdateManyWithoutVigiladorInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenant_id?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    numero?: NullableStringFieldUpdateOperationsInput | string | null
    organismo?: NullableStringFieldUpdateOperationsInput | string | null
    emitida_el?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    vence_el?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AsignacionUpdateWithoutVigiladorInput = {
    id?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    hora_inicio?: StringFieldUpdateOperationsInput | string
    hora_fin?: StringFieldUpdateOperationsInput | string
    estado?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutAsignacionesNestedInput
    puesto?: PuestoUpdateOneRequiredWithoutAsignacionesNestedInput
    asistencia?: AsistenciaUpdateOneWithoutAsignacionNestedInput
  }

  export type AsignacionUncheckedUpdateWithoutVigiladorInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenant_id?: StringFieldUpdateOperationsInput | string
    puesto_id?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    hora_inicio?: StringFieldUpdateOperationsInput | string
    hora_fin?: StringFieldUpdateOperationsInput | string
    estado?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    asistencia?: AsistenciaUncheckedUpdateOneWithoutAsignacionNestedInput
  }

  export type AsignacionUncheckedUpdateManyWithoutVigiladorInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenant_id?: StringFieldUpdateOperationsInput | string
    puesto_id?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    hora_inicio?: StringFieldUpdateOperationsInput | string
    hora_fin?: StringFieldUpdateOperationsInput | string
    estado?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PuestoCreateManyObjetivoInput = {
    id?: string
    tenant_id: string
    nombre: string
    ubicacion?: string | null
    requiere_arma?: boolean
    requiere_movil?: boolean
    esquema_horario?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type PuestoUpdateWithoutObjetivoInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    ubicacion?: NullableStringFieldUpdateOperationsInput | string | null
    requiere_arma?: BoolFieldUpdateOperationsInput | boolean
    requiere_movil?: BoolFieldUpdateOperationsInput | boolean
    esquema_horario?: NullableJsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutPuestosNestedInput
    asignaciones?: AsignacionUpdateManyWithoutPuestoNestedInput
  }

  export type PuestoUncheckedUpdateWithoutObjetivoInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenant_id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    ubicacion?: NullableStringFieldUpdateOperationsInput | string | null
    requiere_arma?: BoolFieldUpdateOperationsInput | boolean
    requiere_movil?: BoolFieldUpdateOperationsInput | boolean
    esquema_horario?: NullableJsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    asignaciones?: AsignacionUncheckedUpdateManyWithoutPuestoNestedInput
  }

  export type PuestoUncheckedUpdateManyWithoutObjetivoInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenant_id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    ubicacion?: NullableStringFieldUpdateOperationsInput | string | null
    requiere_arma?: BoolFieldUpdateOperationsInput | boolean
    requiere_movil?: BoolFieldUpdateOperationsInput | boolean
    esquema_horario?: NullableJsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AsignacionCreateManyPuestoInput = {
    id?: string
    tenant_id: string
    vigilador_id?: string | null
    fecha: Date | string
    hora_inicio: string
    hora_fin: string
    estado?: string
    created_at?: Date | string
  }

  export type AsignacionUpdateWithoutPuestoInput = {
    id?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    hora_inicio?: StringFieldUpdateOperationsInput | string
    hora_fin?: StringFieldUpdateOperationsInput | string
    estado?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutAsignacionesNestedInput
    vigilador?: VigiladorUpdateOneWithoutAsignacionesNestedInput
    asistencia?: AsistenciaUpdateOneWithoutAsignacionNestedInput
  }

  export type AsignacionUncheckedUpdateWithoutPuestoInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenant_id?: StringFieldUpdateOperationsInput | string
    vigilador_id?: NullableStringFieldUpdateOperationsInput | string | null
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    hora_inicio?: StringFieldUpdateOperationsInput | string
    hora_fin?: StringFieldUpdateOperationsInput | string
    estado?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    asistencia?: AsistenciaUncheckedUpdateOneWithoutAsignacionNestedInput
  }

  export type AsignacionUncheckedUpdateManyWithoutPuestoInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenant_id?: StringFieldUpdateOperationsInput | string
    vigilador_id?: NullableStringFieldUpdateOperationsInput | string | null
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    hora_inicio?: StringFieldUpdateOperationsInput | string
    hora_fin?: StringFieldUpdateOperationsInput | string
    estado?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CotizacionItemCreateManyCotizacionInput = {
    id?: string
    puesto_nombre: string
    horas_mensuales: number
    costo_hora: Decimal | DecimalJsLike | number | string
    margen: Decimal | DecimalJsLike | number | string
    subtotal: Decimal | DecimalJsLike | number | string
  }

  export type CotizacionItemUpdateWithoutCotizacionInput = {
    id?: StringFieldUpdateOperationsInput | string
    puesto_nombre?: StringFieldUpdateOperationsInput | string
    horas_mensuales?: IntFieldUpdateOperationsInput | number
    costo_hora?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    margen?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type CotizacionItemUncheckedUpdateWithoutCotizacionInput = {
    id?: StringFieldUpdateOperationsInput | string
    puesto_nombre?: StringFieldUpdateOperationsInput | string
    horas_mensuales?: IntFieldUpdateOperationsInput | number
    costo_hora?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    margen?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type CotizacionItemUncheckedUpdateManyWithoutCotizacionInput = {
    id?: StringFieldUpdateOperationsInput | string
    puesto_nombre?: StringFieldUpdateOperationsInput | string
    horas_mensuales?: IntFieldUpdateOperationsInput | number
    costo_hora?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    margen?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use TenantCountOutputTypeDefaultArgs instead
     */
    export type TenantCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TenantCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use VigiladorCountOutputTypeDefaultArgs instead
     */
    export type VigiladorCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = VigiladorCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ObjetivoCountOutputTypeDefaultArgs instead
     */
    export type ObjetivoCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ObjetivoCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PuestoCountOutputTypeDefaultArgs instead
     */
    export type PuestoCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PuestoCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CotizacionCountOutputTypeDefaultArgs instead
     */
    export type CotizacionCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CotizacionCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TenantDefaultArgs instead
     */
    export type TenantArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TenantDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserDefaultArgs instead
     */
    export type UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDefaultArgs<ExtArgs>
    /**
     * @deprecated Use VigiladorDefaultArgs instead
     */
    export type VigiladorArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = VigiladorDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CredencialDefaultArgs instead
     */
    export type CredencialArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CredencialDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ObjetivoDefaultArgs instead
     */
    export type ObjetivoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ObjetivoDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PuestoDefaultArgs instead
     */
    export type PuestoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PuestoDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AsignacionDefaultArgs instead
     */
    export type AsignacionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AsignacionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AsistenciaDefaultArgs instead
     */
    export type AsistenciaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AsistenciaDefaultArgs<ExtArgs>
    /**
     * @deprecated Use FeriadoDefaultArgs instead
     */
    export type FeriadoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = FeriadoDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ConfiguracionCostosDefaultArgs instead
     */
    export type ConfiguracionCostosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ConfiguracionCostosDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CotizacionDefaultArgs instead
     */
    export type CotizacionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CotizacionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CotizacionItemDefaultArgs instead
     */
    export type CotizacionItemArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CotizacionItemDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}