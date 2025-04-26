
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
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model AwsCredential
 * 
 */
export type AwsCredential = $Result.DefaultSelection<Prisma.$AwsCredentialPayload>
/**
 * Model Alert
 * 
 */
export type Alert = $Result.DefaultSelection<Prisma.$AlertPayload>
/**
 * Model SiemRule
 * 
 */
export type SiemRule = $Result.DefaultSelection<Prisma.$SiemRulePayload>
/**
 * Model SiemEvent
 * 
 */
export type SiemEvent = $Result.DefaultSelection<Prisma.$SiemEventPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
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
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

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


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.awsCredential`: Exposes CRUD operations for the **AwsCredential** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AwsCredentials
    * const awsCredentials = await prisma.awsCredential.findMany()
    * ```
    */
  get awsCredential(): Prisma.AwsCredentialDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.alert`: Exposes CRUD operations for the **Alert** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Alerts
    * const alerts = await prisma.alert.findMany()
    * ```
    */
  get alert(): Prisma.AlertDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.siemRule`: Exposes CRUD operations for the **SiemRule** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SiemRules
    * const siemRules = await prisma.siemRule.findMany()
    * ```
    */
  get siemRule(): Prisma.SiemRuleDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.siemEvent`: Exposes CRUD operations for the **SiemEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SiemEvents
    * const siemEvents = await prisma.siemEvent.findMany()
    * ```
    */
  get siemEvent(): Prisma.SiemEventDelegate<ExtArgs, ClientOptions>;
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
   * Prisma Client JS version: 6.6.0
   * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
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
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
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
    User: 'User',
    AwsCredential: 'AwsCredential',
    Alert: 'Alert',
    SiemRule: 'SiemRule',
    SiemEvent: 'SiemEvent'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "awsCredential" | "alert" | "siemRule" | "siemEvent"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
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
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
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
      AwsCredential: {
        payload: Prisma.$AwsCredentialPayload<ExtArgs>
        fields: Prisma.AwsCredentialFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AwsCredentialFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AwsCredentialPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AwsCredentialFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AwsCredentialPayload>
          }
          findFirst: {
            args: Prisma.AwsCredentialFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AwsCredentialPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AwsCredentialFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AwsCredentialPayload>
          }
          findMany: {
            args: Prisma.AwsCredentialFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AwsCredentialPayload>[]
          }
          create: {
            args: Prisma.AwsCredentialCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AwsCredentialPayload>
          }
          createMany: {
            args: Prisma.AwsCredentialCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AwsCredentialCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AwsCredentialPayload>[]
          }
          delete: {
            args: Prisma.AwsCredentialDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AwsCredentialPayload>
          }
          update: {
            args: Prisma.AwsCredentialUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AwsCredentialPayload>
          }
          deleteMany: {
            args: Prisma.AwsCredentialDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AwsCredentialUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AwsCredentialUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AwsCredentialPayload>[]
          }
          upsert: {
            args: Prisma.AwsCredentialUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AwsCredentialPayload>
          }
          aggregate: {
            args: Prisma.AwsCredentialAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAwsCredential>
          }
          groupBy: {
            args: Prisma.AwsCredentialGroupByArgs<ExtArgs>
            result: $Utils.Optional<AwsCredentialGroupByOutputType>[]
          }
          count: {
            args: Prisma.AwsCredentialCountArgs<ExtArgs>
            result: $Utils.Optional<AwsCredentialCountAggregateOutputType> | number
          }
        }
      }
      Alert: {
        payload: Prisma.$AlertPayload<ExtArgs>
        fields: Prisma.AlertFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AlertFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlertPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AlertFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlertPayload>
          }
          findFirst: {
            args: Prisma.AlertFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlertPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AlertFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlertPayload>
          }
          findMany: {
            args: Prisma.AlertFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlertPayload>[]
          }
          create: {
            args: Prisma.AlertCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlertPayload>
          }
          createMany: {
            args: Prisma.AlertCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AlertCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlertPayload>[]
          }
          delete: {
            args: Prisma.AlertDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlertPayload>
          }
          update: {
            args: Prisma.AlertUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlertPayload>
          }
          deleteMany: {
            args: Prisma.AlertDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AlertUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AlertUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlertPayload>[]
          }
          upsert: {
            args: Prisma.AlertUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlertPayload>
          }
          aggregate: {
            args: Prisma.AlertAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAlert>
          }
          groupBy: {
            args: Prisma.AlertGroupByArgs<ExtArgs>
            result: $Utils.Optional<AlertGroupByOutputType>[]
          }
          count: {
            args: Prisma.AlertCountArgs<ExtArgs>
            result: $Utils.Optional<AlertCountAggregateOutputType> | number
          }
        }
      }
      SiemRule: {
        payload: Prisma.$SiemRulePayload<ExtArgs>
        fields: Prisma.SiemRuleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SiemRuleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiemRulePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SiemRuleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiemRulePayload>
          }
          findFirst: {
            args: Prisma.SiemRuleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiemRulePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SiemRuleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiemRulePayload>
          }
          findMany: {
            args: Prisma.SiemRuleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiemRulePayload>[]
          }
          create: {
            args: Prisma.SiemRuleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiemRulePayload>
          }
          createMany: {
            args: Prisma.SiemRuleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SiemRuleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiemRulePayload>[]
          }
          delete: {
            args: Prisma.SiemRuleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiemRulePayload>
          }
          update: {
            args: Prisma.SiemRuleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiemRulePayload>
          }
          deleteMany: {
            args: Prisma.SiemRuleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SiemRuleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SiemRuleUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiemRulePayload>[]
          }
          upsert: {
            args: Prisma.SiemRuleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiemRulePayload>
          }
          aggregate: {
            args: Prisma.SiemRuleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSiemRule>
          }
          groupBy: {
            args: Prisma.SiemRuleGroupByArgs<ExtArgs>
            result: $Utils.Optional<SiemRuleGroupByOutputType>[]
          }
          count: {
            args: Prisma.SiemRuleCountArgs<ExtArgs>
            result: $Utils.Optional<SiemRuleCountAggregateOutputType> | number
          }
        }
      }
      SiemEvent: {
        payload: Prisma.$SiemEventPayload<ExtArgs>
        fields: Prisma.SiemEventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SiemEventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiemEventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SiemEventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiemEventPayload>
          }
          findFirst: {
            args: Prisma.SiemEventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiemEventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SiemEventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiemEventPayload>
          }
          findMany: {
            args: Prisma.SiemEventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiemEventPayload>[]
          }
          create: {
            args: Prisma.SiemEventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiemEventPayload>
          }
          createMany: {
            args: Prisma.SiemEventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SiemEventCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiemEventPayload>[]
          }
          delete: {
            args: Prisma.SiemEventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiemEventPayload>
          }
          update: {
            args: Prisma.SiemEventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiemEventPayload>
          }
          deleteMany: {
            args: Prisma.SiemEventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SiemEventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SiemEventUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiemEventPayload>[]
          }
          upsert: {
            args: Prisma.SiemEventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiemEventPayload>
          }
          aggregate: {
            args: Prisma.SiemEventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSiemEvent>
          }
          groupBy: {
            args: Prisma.SiemEventGroupByArgs<ExtArgs>
            result: $Utils.Optional<SiemEventGroupByOutputType>[]
          }
          count: {
            args: Prisma.SiemEventCountArgs<ExtArgs>
            result: $Utils.Optional<SiemEventCountAggregateOutputType> | number
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
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    awsCredential?: AwsCredentialOmit
    alert?: AlertOmit
    siemRule?: SiemRuleOmit
    siemEvent?: SiemEventOmit
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
    | 'updateManyAndReturn'
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
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    awsCredentials: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    awsCredentials?: boolean | UserCountOutputTypeCountAwsCredentialsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAwsCredentialsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AwsCredentialWhereInput
  }


  /**
   * Count Type AwsCredentialCountOutputType
   */

  export type AwsCredentialCountOutputType = {
    alerts: number
    siemRules: number
    siemEvents: number
  }

  export type AwsCredentialCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    alerts?: boolean | AwsCredentialCountOutputTypeCountAlertsArgs
    siemRules?: boolean | AwsCredentialCountOutputTypeCountSiemRulesArgs
    siemEvents?: boolean | AwsCredentialCountOutputTypeCountSiemEventsArgs
  }

  // Custom InputTypes
  /**
   * AwsCredentialCountOutputType without action
   */
  export type AwsCredentialCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AwsCredentialCountOutputType
     */
    select?: AwsCredentialCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AwsCredentialCountOutputType without action
   */
  export type AwsCredentialCountOutputTypeCountAlertsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AlertWhereInput
  }

  /**
   * AwsCredentialCountOutputType without action
   */
  export type AwsCredentialCountOutputTypeCountSiemRulesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SiemRuleWhereInput
  }

  /**
   * AwsCredentialCountOutputType without action
   */
  export type AwsCredentialCountOutputTypeCountSiemEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SiemEventWhereInput
  }


  /**
   * Count Type SiemRuleCountOutputType
   */

  export type SiemRuleCountOutputType = {
    events: number
  }

  export type SiemRuleCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    events?: boolean | SiemRuleCountOutputTypeCountEventsArgs
  }

  // Custom InputTypes
  /**
   * SiemRuleCountOutputType without action
   */
  export type SiemRuleCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiemRuleCountOutputType
     */
    select?: SiemRuleCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SiemRuleCountOutputType without action
   */
  export type SiemRuleCountOutputTypeCountEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SiemEventWhereInput
  }


  /**
   * Models
   */

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
    name: string | null
    email: string | null
    password: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    password: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    email: number
    password: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    createdAt?: true
    updatedAt?: true
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
    name: string
    email: string
    password: string
    createdAt: Date
    updatedAt: Date
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
    name?: boolean
    email?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    awsCredentials?: boolean | User$awsCredentialsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "password" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    awsCredentials?: boolean | User$awsCredentialsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      awsCredentials: Prisma.$AwsCredentialPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      email: string
      password: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
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
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

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
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

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
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

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
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

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
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

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
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

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
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

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
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

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
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

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
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

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
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


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
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    awsCredentials<T extends User$awsCredentialsArgs<ExtArgs> = {}>(args?: Subset<T, User$awsCredentialsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AwsCredentialPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
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
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
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
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
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
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
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
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
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
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
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
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
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
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
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
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
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
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
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
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
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
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
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
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.awsCredentials
   */
  export type User$awsCredentialsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AwsCredential
     */
    select?: AwsCredentialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AwsCredential
     */
    omit?: AwsCredentialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AwsCredentialInclude<ExtArgs> | null
    where?: AwsCredentialWhereInput
    orderBy?: AwsCredentialOrderByWithRelationInput | AwsCredentialOrderByWithRelationInput[]
    cursor?: AwsCredentialWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AwsCredentialScalarFieldEnum | AwsCredentialScalarFieldEnum[]
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
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model AwsCredential
   */

  export type AggregateAwsCredential = {
    _count: AwsCredentialCountAggregateOutputType | null
    _min: AwsCredentialMinAggregateOutputType | null
    _max: AwsCredentialMaxAggregateOutputType | null
  }

  export type AwsCredentialMinAggregateOutputType = {
    id: string | null
    name: string | null
    accessKeyId: string | null
    secretKey: string | null
    region: string | null
    createdAt: Date | null
    updatedAt: Date | null
    userId: string | null
  }

  export type AwsCredentialMaxAggregateOutputType = {
    id: string | null
    name: string | null
    accessKeyId: string | null
    secretKey: string | null
    region: string | null
    createdAt: Date | null
    updatedAt: Date | null
    userId: string | null
  }

  export type AwsCredentialCountAggregateOutputType = {
    id: number
    name: number
    accessKeyId: number
    secretKey: number
    region: number
    createdAt: number
    updatedAt: number
    userId: number
    _all: number
  }


  export type AwsCredentialMinAggregateInputType = {
    id?: true
    name?: true
    accessKeyId?: true
    secretKey?: true
    region?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
  }

  export type AwsCredentialMaxAggregateInputType = {
    id?: true
    name?: true
    accessKeyId?: true
    secretKey?: true
    region?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
  }

  export type AwsCredentialCountAggregateInputType = {
    id?: true
    name?: true
    accessKeyId?: true
    secretKey?: true
    region?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
    _all?: true
  }

  export type AwsCredentialAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AwsCredential to aggregate.
     */
    where?: AwsCredentialWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AwsCredentials to fetch.
     */
    orderBy?: AwsCredentialOrderByWithRelationInput | AwsCredentialOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AwsCredentialWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AwsCredentials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AwsCredentials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AwsCredentials
    **/
    _count?: true | AwsCredentialCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AwsCredentialMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AwsCredentialMaxAggregateInputType
  }

  export type GetAwsCredentialAggregateType<T extends AwsCredentialAggregateArgs> = {
        [P in keyof T & keyof AggregateAwsCredential]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAwsCredential[P]>
      : GetScalarType<T[P], AggregateAwsCredential[P]>
  }




  export type AwsCredentialGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AwsCredentialWhereInput
    orderBy?: AwsCredentialOrderByWithAggregationInput | AwsCredentialOrderByWithAggregationInput[]
    by: AwsCredentialScalarFieldEnum[] | AwsCredentialScalarFieldEnum
    having?: AwsCredentialScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AwsCredentialCountAggregateInputType | true
    _min?: AwsCredentialMinAggregateInputType
    _max?: AwsCredentialMaxAggregateInputType
  }

  export type AwsCredentialGroupByOutputType = {
    id: string
    name: string
    accessKeyId: string
    secretKey: string
    region: string
    createdAt: Date
    updatedAt: Date
    userId: string
    _count: AwsCredentialCountAggregateOutputType | null
    _min: AwsCredentialMinAggregateOutputType | null
    _max: AwsCredentialMaxAggregateOutputType | null
  }

  type GetAwsCredentialGroupByPayload<T extends AwsCredentialGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AwsCredentialGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AwsCredentialGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AwsCredentialGroupByOutputType[P]>
            : GetScalarType<T[P], AwsCredentialGroupByOutputType[P]>
        }
      >
    >


  export type AwsCredentialSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    accessKeyId?: boolean
    secretKey?: boolean
    region?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    alerts?: boolean | AwsCredential$alertsArgs<ExtArgs>
    siemRules?: boolean | AwsCredential$siemRulesArgs<ExtArgs>
    siemEvents?: boolean | AwsCredential$siemEventsArgs<ExtArgs>
    _count?: boolean | AwsCredentialCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["awsCredential"]>

  export type AwsCredentialSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    accessKeyId?: boolean
    secretKey?: boolean
    region?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["awsCredential"]>

  export type AwsCredentialSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    accessKeyId?: boolean
    secretKey?: boolean
    region?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["awsCredential"]>

  export type AwsCredentialSelectScalar = {
    id?: boolean
    name?: boolean
    accessKeyId?: boolean
    secretKey?: boolean
    region?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
  }

  export type AwsCredentialOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "accessKeyId" | "secretKey" | "region" | "createdAt" | "updatedAt" | "userId", ExtArgs["result"]["awsCredential"]>
  export type AwsCredentialInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    alerts?: boolean | AwsCredential$alertsArgs<ExtArgs>
    siemRules?: boolean | AwsCredential$siemRulesArgs<ExtArgs>
    siemEvents?: boolean | AwsCredential$siemEventsArgs<ExtArgs>
    _count?: boolean | AwsCredentialCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type AwsCredentialIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AwsCredentialIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $AwsCredentialPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AwsCredential"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      alerts: Prisma.$AlertPayload<ExtArgs>[]
      siemRules: Prisma.$SiemRulePayload<ExtArgs>[]
      siemEvents: Prisma.$SiemEventPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      accessKeyId: string
      secretKey: string
      region: string
      createdAt: Date
      updatedAt: Date
      userId: string
    }, ExtArgs["result"]["awsCredential"]>
    composites: {}
  }

  type AwsCredentialGetPayload<S extends boolean | null | undefined | AwsCredentialDefaultArgs> = $Result.GetResult<Prisma.$AwsCredentialPayload, S>

  type AwsCredentialCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AwsCredentialFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AwsCredentialCountAggregateInputType | true
    }

  export interface AwsCredentialDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AwsCredential'], meta: { name: 'AwsCredential' } }
    /**
     * Find zero or one AwsCredential that matches the filter.
     * @param {AwsCredentialFindUniqueArgs} args - Arguments to find a AwsCredential
     * @example
     * // Get one AwsCredential
     * const awsCredential = await prisma.awsCredential.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AwsCredentialFindUniqueArgs>(args: SelectSubset<T, AwsCredentialFindUniqueArgs<ExtArgs>>): Prisma__AwsCredentialClient<$Result.GetResult<Prisma.$AwsCredentialPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AwsCredential that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AwsCredentialFindUniqueOrThrowArgs} args - Arguments to find a AwsCredential
     * @example
     * // Get one AwsCredential
     * const awsCredential = await prisma.awsCredential.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AwsCredentialFindUniqueOrThrowArgs>(args: SelectSubset<T, AwsCredentialFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AwsCredentialClient<$Result.GetResult<Prisma.$AwsCredentialPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AwsCredential that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AwsCredentialFindFirstArgs} args - Arguments to find a AwsCredential
     * @example
     * // Get one AwsCredential
     * const awsCredential = await prisma.awsCredential.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AwsCredentialFindFirstArgs>(args?: SelectSubset<T, AwsCredentialFindFirstArgs<ExtArgs>>): Prisma__AwsCredentialClient<$Result.GetResult<Prisma.$AwsCredentialPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AwsCredential that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AwsCredentialFindFirstOrThrowArgs} args - Arguments to find a AwsCredential
     * @example
     * // Get one AwsCredential
     * const awsCredential = await prisma.awsCredential.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AwsCredentialFindFirstOrThrowArgs>(args?: SelectSubset<T, AwsCredentialFindFirstOrThrowArgs<ExtArgs>>): Prisma__AwsCredentialClient<$Result.GetResult<Prisma.$AwsCredentialPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AwsCredentials that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AwsCredentialFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AwsCredentials
     * const awsCredentials = await prisma.awsCredential.findMany()
     * 
     * // Get first 10 AwsCredentials
     * const awsCredentials = await prisma.awsCredential.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const awsCredentialWithIdOnly = await prisma.awsCredential.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AwsCredentialFindManyArgs>(args?: SelectSubset<T, AwsCredentialFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AwsCredentialPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AwsCredential.
     * @param {AwsCredentialCreateArgs} args - Arguments to create a AwsCredential.
     * @example
     * // Create one AwsCredential
     * const AwsCredential = await prisma.awsCredential.create({
     *   data: {
     *     // ... data to create a AwsCredential
     *   }
     * })
     * 
     */
    create<T extends AwsCredentialCreateArgs>(args: SelectSubset<T, AwsCredentialCreateArgs<ExtArgs>>): Prisma__AwsCredentialClient<$Result.GetResult<Prisma.$AwsCredentialPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AwsCredentials.
     * @param {AwsCredentialCreateManyArgs} args - Arguments to create many AwsCredentials.
     * @example
     * // Create many AwsCredentials
     * const awsCredential = await prisma.awsCredential.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AwsCredentialCreateManyArgs>(args?: SelectSubset<T, AwsCredentialCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AwsCredentials and returns the data saved in the database.
     * @param {AwsCredentialCreateManyAndReturnArgs} args - Arguments to create many AwsCredentials.
     * @example
     * // Create many AwsCredentials
     * const awsCredential = await prisma.awsCredential.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AwsCredentials and only return the `id`
     * const awsCredentialWithIdOnly = await prisma.awsCredential.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AwsCredentialCreateManyAndReturnArgs>(args?: SelectSubset<T, AwsCredentialCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AwsCredentialPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AwsCredential.
     * @param {AwsCredentialDeleteArgs} args - Arguments to delete one AwsCredential.
     * @example
     * // Delete one AwsCredential
     * const AwsCredential = await prisma.awsCredential.delete({
     *   where: {
     *     // ... filter to delete one AwsCredential
     *   }
     * })
     * 
     */
    delete<T extends AwsCredentialDeleteArgs>(args: SelectSubset<T, AwsCredentialDeleteArgs<ExtArgs>>): Prisma__AwsCredentialClient<$Result.GetResult<Prisma.$AwsCredentialPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AwsCredential.
     * @param {AwsCredentialUpdateArgs} args - Arguments to update one AwsCredential.
     * @example
     * // Update one AwsCredential
     * const awsCredential = await prisma.awsCredential.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AwsCredentialUpdateArgs>(args: SelectSubset<T, AwsCredentialUpdateArgs<ExtArgs>>): Prisma__AwsCredentialClient<$Result.GetResult<Prisma.$AwsCredentialPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AwsCredentials.
     * @param {AwsCredentialDeleteManyArgs} args - Arguments to filter AwsCredentials to delete.
     * @example
     * // Delete a few AwsCredentials
     * const { count } = await prisma.awsCredential.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AwsCredentialDeleteManyArgs>(args?: SelectSubset<T, AwsCredentialDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AwsCredentials.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AwsCredentialUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AwsCredentials
     * const awsCredential = await prisma.awsCredential.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AwsCredentialUpdateManyArgs>(args: SelectSubset<T, AwsCredentialUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AwsCredentials and returns the data updated in the database.
     * @param {AwsCredentialUpdateManyAndReturnArgs} args - Arguments to update many AwsCredentials.
     * @example
     * // Update many AwsCredentials
     * const awsCredential = await prisma.awsCredential.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AwsCredentials and only return the `id`
     * const awsCredentialWithIdOnly = await prisma.awsCredential.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AwsCredentialUpdateManyAndReturnArgs>(args: SelectSubset<T, AwsCredentialUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AwsCredentialPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AwsCredential.
     * @param {AwsCredentialUpsertArgs} args - Arguments to update or create a AwsCredential.
     * @example
     * // Update or create a AwsCredential
     * const awsCredential = await prisma.awsCredential.upsert({
     *   create: {
     *     // ... data to create a AwsCredential
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AwsCredential we want to update
     *   }
     * })
     */
    upsert<T extends AwsCredentialUpsertArgs>(args: SelectSubset<T, AwsCredentialUpsertArgs<ExtArgs>>): Prisma__AwsCredentialClient<$Result.GetResult<Prisma.$AwsCredentialPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AwsCredentials.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AwsCredentialCountArgs} args - Arguments to filter AwsCredentials to count.
     * @example
     * // Count the number of AwsCredentials
     * const count = await prisma.awsCredential.count({
     *   where: {
     *     // ... the filter for the AwsCredentials we want to count
     *   }
     * })
    **/
    count<T extends AwsCredentialCountArgs>(
      args?: Subset<T, AwsCredentialCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AwsCredentialCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AwsCredential.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AwsCredentialAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AwsCredentialAggregateArgs>(args: Subset<T, AwsCredentialAggregateArgs>): Prisma.PrismaPromise<GetAwsCredentialAggregateType<T>>

    /**
     * Group by AwsCredential.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AwsCredentialGroupByArgs} args - Group by arguments.
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
      T extends AwsCredentialGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AwsCredentialGroupByArgs['orderBy'] }
        : { orderBy?: AwsCredentialGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, AwsCredentialGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAwsCredentialGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AwsCredential model
   */
  readonly fields: AwsCredentialFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AwsCredential.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AwsCredentialClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    alerts<T extends AwsCredential$alertsArgs<ExtArgs> = {}>(args?: Subset<T, AwsCredential$alertsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AlertPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    siemRules<T extends AwsCredential$siemRulesArgs<ExtArgs> = {}>(args?: Subset<T, AwsCredential$siemRulesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SiemRulePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    siemEvents<T extends AwsCredential$siemEventsArgs<ExtArgs> = {}>(args?: Subset<T, AwsCredential$siemEventsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SiemEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the AwsCredential model
   */
  interface AwsCredentialFieldRefs {
    readonly id: FieldRef<"AwsCredential", 'String'>
    readonly name: FieldRef<"AwsCredential", 'String'>
    readonly accessKeyId: FieldRef<"AwsCredential", 'String'>
    readonly secretKey: FieldRef<"AwsCredential", 'String'>
    readonly region: FieldRef<"AwsCredential", 'String'>
    readonly createdAt: FieldRef<"AwsCredential", 'DateTime'>
    readonly updatedAt: FieldRef<"AwsCredential", 'DateTime'>
    readonly userId: FieldRef<"AwsCredential", 'String'>
  }
    

  // Custom InputTypes
  /**
   * AwsCredential findUnique
   */
  export type AwsCredentialFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AwsCredential
     */
    select?: AwsCredentialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AwsCredential
     */
    omit?: AwsCredentialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AwsCredentialInclude<ExtArgs> | null
    /**
     * Filter, which AwsCredential to fetch.
     */
    where: AwsCredentialWhereUniqueInput
  }

  /**
   * AwsCredential findUniqueOrThrow
   */
  export type AwsCredentialFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AwsCredential
     */
    select?: AwsCredentialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AwsCredential
     */
    omit?: AwsCredentialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AwsCredentialInclude<ExtArgs> | null
    /**
     * Filter, which AwsCredential to fetch.
     */
    where: AwsCredentialWhereUniqueInput
  }

  /**
   * AwsCredential findFirst
   */
  export type AwsCredentialFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AwsCredential
     */
    select?: AwsCredentialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AwsCredential
     */
    omit?: AwsCredentialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AwsCredentialInclude<ExtArgs> | null
    /**
     * Filter, which AwsCredential to fetch.
     */
    where?: AwsCredentialWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AwsCredentials to fetch.
     */
    orderBy?: AwsCredentialOrderByWithRelationInput | AwsCredentialOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AwsCredentials.
     */
    cursor?: AwsCredentialWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AwsCredentials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AwsCredentials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AwsCredentials.
     */
    distinct?: AwsCredentialScalarFieldEnum | AwsCredentialScalarFieldEnum[]
  }

  /**
   * AwsCredential findFirstOrThrow
   */
  export type AwsCredentialFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AwsCredential
     */
    select?: AwsCredentialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AwsCredential
     */
    omit?: AwsCredentialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AwsCredentialInclude<ExtArgs> | null
    /**
     * Filter, which AwsCredential to fetch.
     */
    where?: AwsCredentialWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AwsCredentials to fetch.
     */
    orderBy?: AwsCredentialOrderByWithRelationInput | AwsCredentialOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AwsCredentials.
     */
    cursor?: AwsCredentialWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AwsCredentials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AwsCredentials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AwsCredentials.
     */
    distinct?: AwsCredentialScalarFieldEnum | AwsCredentialScalarFieldEnum[]
  }

  /**
   * AwsCredential findMany
   */
  export type AwsCredentialFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AwsCredential
     */
    select?: AwsCredentialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AwsCredential
     */
    omit?: AwsCredentialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AwsCredentialInclude<ExtArgs> | null
    /**
     * Filter, which AwsCredentials to fetch.
     */
    where?: AwsCredentialWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AwsCredentials to fetch.
     */
    orderBy?: AwsCredentialOrderByWithRelationInput | AwsCredentialOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AwsCredentials.
     */
    cursor?: AwsCredentialWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AwsCredentials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AwsCredentials.
     */
    skip?: number
    distinct?: AwsCredentialScalarFieldEnum | AwsCredentialScalarFieldEnum[]
  }

  /**
   * AwsCredential create
   */
  export type AwsCredentialCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AwsCredential
     */
    select?: AwsCredentialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AwsCredential
     */
    omit?: AwsCredentialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AwsCredentialInclude<ExtArgs> | null
    /**
     * The data needed to create a AwsCredential.
     */
    data: XOR<AwsCredentialCreateInput, AwsCredentialUncheckedCreateInput>
  }

  /**
   * AwsCredential createMany
   */
  export type AwsCredentialCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AwsCredentials.
     */
    data: AwsCredentialCreateManyInput | AwsCredentialCreateManyInput[]
  }

  /**
   * AwsCredential createManyAndReturn
   */
  export type AwsCredentialCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AwsCredential
     */
    select?: AwsCredentialSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AwsCredential
     */
    omit?: AwsCredentialOmit<ExtArgs> | null
    /**
     * The data used to create many AwsCredentials.
     */
    data: AwsCredentialCreateManyInput | AwsCredentialCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AwsCredentialIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AwsCredential update
   */
  export type AwsCredentialUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AwsCredential
     */
    select?: AwsCredentialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AwsCredential
     */
    omit?: AwsCredentialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AwsCredentialInclude<ExtArgs> | null
    /**
     * The data needed to update a AwsCredential.
     */
    data: XOR<AwsCredentialUpdateInput, AwsCredentialUncheckedUpdateInput>
    /**
     * Choose, which AwsCredential to update.
     */
    where: AwsCredentialWhereUniqueInput
  }

  /**
   * AwsCredential updateMany
   */
  export type AwsCredentialUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AwsCredentials.
     */
    data: XOR<AwsCredentialUpdateManyMutationInput, AwsCredentialUncheckedUpdateManyInput>
    /**
     * Filter which AwsCredentials to update
     */
    where?: AwsCredentialWhereInput
    /**
     * Limit how many AwsCredentials to update.
     */
    limit?: number
  }

  /**
   * AwsCredential updateManyAndReturn
   */
  export type AwsCredentialUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AwsCredential
     */
    select?: AwsCredentialSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AwsCredential
     */
    omit?: AwsCredentialOmit<ExtArgs> | null
    /**
     * The data used to update AwsCredentials.
     */
    data: XOR<AwsCredentialUpdateManyMutationInput, AwsCredentialUncheckedUpdateManyInput>
    /**
     * Filter which AwsCredentials to update
     */
    where?: AwsCredentialWhereInput
    /**
     * Limit how many AwsCredentials to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AwsCredentialIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AwsCredential upsert
   */
  export type AwsCredentialUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AwsCredential
     */
    select?: AwsCredentialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AwsCredential
     */
    omit?: AwsCredentialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AwsCredentialInclude<ExtArgs> | null
    /**
     * The filter to search for the AwsCredential to update in case it exists.
     */
    where: AwsCredentialWhereUniqueInput
    /**
     * In case the AwsCredential found by the `where` argument doesn't exist, create a new AwsCredential with this data.
     */
    create: XOR<AwsCredentialCreateInput, AwsCredentialUncheckedCreateInput>
    /**
     * In case the AwsCredential was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AwsCredentialUpdateInput, AwsCredentialUncheckedUpdateInput>
  }

  /**
   * AwsCredential delete
   */
  export type AwsCredentialDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AwsCredential
     */
    select?: AwsCredentialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AwsCredential
     */
    omit?: AwsCredentialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AwsCredentialInclude<ExtArgs> | null
    /**
     * Filter which AwsCredential to delete.
     */
    where: AwsCredentialWhereUniqueInput
  }

  /**
   * AwsCredential deleteMany
   */
  export type AwsCredentialDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AwsCredentials to delete
     */
    where?: AwsCredentialWhereInput
    /**
     * Limit how many AwsCredentials to delete.
     */
    limit?: number
  }

  /**
   * AwsCredential.alerts
   */
  export type AwsCredential$alertsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alert
     */
    select?: AlertSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Alert
     */
    omit?: AlertOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertInclude<ExtArgs> | null
    where?: AlertWhereInput
    orderBy?: AlertOrderByWithRelationInput | AlertOrderByWithRelationInput[]
    cursor?: AlertWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AlertScalarFieldEnum | AlertScalarFieldEnum[]
  }

  /**
   * AwsCredential.siemRules
   */
  export type AwsCredential$siemRulesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiemRule
     */
    select?: SiemRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SiemRule
     */
    omit?: SiemRuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SiemRuleInclude<ExtArgs> | null
    where?: SiemRuleWhereInput
    orderBy?: SiemRuleOrderByWithRelationInput | SiemRuleOrderByWithRelationInput[]
    cursor?: SiemRuleWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SiemRuleScalarFieldEnum | SiemRuleScalarFieldEnum[]
  }

  /**
   * AwsCredential.siemEvents
   */
  export type AwsCredential$siemEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiemEvent
     */
    select?: SiemEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SiemEvent
     */
    omit?: SiemEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SiemEventInclude<ExtArgs> | null
    where?: SiemEventWhereInput
    orderBy?: SiemEventOrderByWithRelationInput | SiemEventOrderByWithRelationInput[]
    cursor?: SiemEventWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SiemEventScalarFieldEnum | SiemEventScalarFieldEnum[]
  }

  /**
   * AwsCredential without action
   */
  export type AwsCredentialDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AwsCredential
     */
    select?: AwsCredentialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AwsCredential
     */
    omit?: AwsCredentialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AwsCredentialInclude<ExtArgs> | null
  }


  /**
   * Model Alert
   */

  export type AggregateAlert = {
    _count: AlertCountAggregateOutputType | null
    _min: AlertMinAggregateOutputType | null
    _max: AlertMaxAggregateOutputType | null
  }

  export type AlertMinAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    resourceId: string | null
    resourceType: string | null
    severity: string | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
    credentialId: string | null
  }

  export type AlertMaxAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    resourceId: string | null
    resourceType: string | null
    severity: string | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
    credentialId: string | null
  }

  export type AlertCountAggregateOutputType = {
    id: number
    title: number
    description: number
    resourceId: number
    resourceType: number
    severity: number
    status: number
    createdAt: number
    updatedAt: number
    credentialId: number
    _all: number
  }


  export type AlertMinAggregateInputType = {
    id?: true
    title?: true
    description?: true
    resourceId?: true
    resourceType?: true
    severity?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    credentialId?: true
  }

  export type AlertMaxAggregateInputType = {
    id?: true
    title?: true
    description?: true
    resourceId?: true
    resourceType?: true
    severity?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    credentialId?: true
  }

  export type AlertCountAggregateInputType = {
    id?: true
    title?: true
    description?: true
    resourceId?: true
    resourceType?: true
    severity?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    credentialId?: true
    _all?: true
  }

  export type AlertAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Alert to aggregate.
     */
    where?: AlertWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Alerts to fetch.
     */
    orderBy?: AlertOrderByWithRelationInput | AlertOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AlertWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Alerts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Alerts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Alerts
    **/
    _count?: true | AlertCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AlertMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AlertMaxAggregateInputType
  }

  export type GetAlertAggregateType<T extends AlertAggregateArgs> = {
        [P in keyof T & keyof AggregateAlert]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAlert[P]>
      : GetScalarType<T[P], AggregateAlert[P]>
  }




  export type AlertGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AlertWhereInput
    orderBy?: AlertOrderByWithAggregationInput | AlertOrderByWithAggregationInput[]
    by: AlertScalarFieldEnum[] | AlertScalarFieldEnum
    having?: AlertScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AlertCountAggregateInputType | true
    _min?: AlertMinAggregateInputType
    _max?: AlertMaxAggregateInputType
  }

  export type AlertGroupByOutputType = {
    id: string
    title: string
    description: string
    resourceId: string
    resourceType: string
    severity: string
    status: string
    createdAt: Date
    updatedAt: Date
    credentialId: string | null
    _count: AlertCountAggregateOutputType | null
    _min: AlertMinAggregateOutputType | null
    _max: AlertMaxAggregateOutputType | null
  }

  type GetAlertGroupByPayload<T extends AlertGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AlertGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AlertGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AlertGroupByOutputType[P]>
            : GetScalarType<T[P], AlertGroupByOutputType[P]>
        }
      >
    >


  export type AlertSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    resourceId?: boolean
    resourceType?: boolean
    severity?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    credentialId?: boolean
    credential?: boolean | Alert$credentialArgs<ExtArgs>
  }, ExtArgs["result"]["alert"]>

  export type AlertSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    resourceId?: boolean
    resourceType?: boolean
    severity?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    credentialId?: boolean
    credential?: boolean | Alert$credentialArgs<ExtArgs>
  }, ExtArgs["result"]["alert"]>

  export type AlertSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    resourceId?: boolean
    resourceType?: boolean
    severity?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    credentialId?: boolean
    credential?: boolean | Alert$credentialArgs<ExtArgs>
  }, ExtArgs["result"]["alert"]>

  export type AlertSelectScalar = {
    id?: boolean
    title?: boolean
    description?: boolean
    resourceId?: boolean
    resourceType?: boolean
    severity?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    credentialId?: boolean
  }

  export type AlertOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "description" | "resourceId" | "resourceType" | "severity" | "status" | "createdAt" | "updatedAt" | "credentialId", ExtArgs["result"]["alert"]>
  export type AlertInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    credential?: boolean | Alert$credentialArgs<ExtArgs>
  }
  export type AlertIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    credential?: boolean | Alert$credentialArgs<ExtArgs>
  }
  export type AlertIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    credential?: boolean | Alert$credentialArgs<ExtArgs>
  }

  export type $AlertPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Alert"
    objects: {
      credential: Prisma.$AwsCredentialPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      description: string
      resourceId: string
      resourceType: string
      severity: string
      status: string
      createdAt: Date
      updatedAt: Date
      credentialId: string | null
    }, ExtArgs["result"]["alert"]>
    composites: {}
  }

  type AlertGetPayload<S extends boolean | null | undefined | AlertDefaultArgs> = $Result.GetResult<Prisma.$AlertPayload, S>

  type AlertCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AlertFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AlertCountAggregateInputType | true
    }

  export interface AlertDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Alert'], meta: { name: 'Alert' } }
    /**
     * Find zero or one Alert that matches the filter.
     * @param {AlertFindUniqueArgs} args - Arguments to find a Alert
     * @example
     * // Get one Alert
     * const alert = await prisma.alert.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AlertFindUniqueArgs>(args: SelectSubset<T, AlertFindUniqueArgs<ExtArgs>>): Prisma__AlertClient<$Result.GetResult<Prisma.$AlertPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Alert that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AlertFindUniqueOrThrowArgs} args - Arguments to find a Alert
     * @example
     * // Get one Alert
     * const alert = await prisma.alert.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AlertFindUniqueOrThrowArgs>(args: SelectSubset<T, AlertFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AlertClient<$Result.GetResult<Prisma.$AlertPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Alert that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlertFindFirstArgs} args - Arguments to find a Alert
     * @example
     * // Get one Alert
     * const alert = await prisma.alert.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AlertFindFirstArgs>(args?: SelectSubset<T, AlertFindFirstArgs<ExtArgs>>): Prisma__AlertClient<$Result.GetResult<Prisma.$AlertPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Alert that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlertFindFirstOrThrowArgs} args - Arguments to find a Alert
     * @example
     * // Get one Alert
     * const alert = await prisma.alert.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AlertFindFirstOrThrowArgs>(args?: SelectSubset<T, AlertFindFirstOrThrowArgs<ExtArgs>>): Prisma__AlertClient<$Result.GetResult<Prisma.$AlertPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Alerts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlertFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Alerts
     * const alerts = await prisma.alert.findMany()
     * 
     * // Get first 10 Alerts
     * const alerts = await prisma.alert.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const alertWithIdOnly = await prisma.alert.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AlertFindManyArgs>(args?: SelectSubset<T, AlertFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AlertPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Alert.
     * @param {AlertCreateArgs} args - Arguments to create a Alert.
     * @example
     * // Create one Alert
     * const Alert = await prisma.alert.create({
     *   data: {
     *     // ... data to create a Alert
     *   }
     * })
     * 
     */
    create<T extends AlertCreateArgs>(args: SelectSubset<T, AlertCreateArgs<ExtArgs>>): Prisma__AlertClient<$Result.GetResult<Prisma.$AlertPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Alerts.
     * @param {AlertCreateManyArgs} args - Arguments to create many Alerts.
     * @example
     * // Create many Alerts
     * const alert = await prisma.alert.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AlertCreateManyArgs>(args?: SelectSubset<T, AlertCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Alerts and returns the data saved in the database.
     * @param {AlertCreateManyAndReturnArgs} args - Arguments to create many Alerts.
     * @example
     * // Create many Alerts
     * const alert = await prisma.alert.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Alerts and only return the `id`
     * const alertWithIdOnly = await prisma.alert.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AlertCreateManyAndReturnArgs>(args?: SelectSubset<T, AlertCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AlertPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Alert.
     * @param {AlertDeleteArgs} args - Arguments to delete one Alert.
     * @example
     * // Delete one Alert
     * const Alert = await prisma.alert.delete({
     *   where: {
     *     // ... filter to delete one Alert
     *   }
     * })
     * 
     */
    delete<T extends AlertDeleteArgs>(args: SelectSubset<T, AlertDeleteArgs<ExtArgs>>): Prisma__AlertClient<$Result.GetResult<Prisma.$AlertPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Alert.
     * @param {AlertUpdateArgs} args - Arguments to update one Alert.
     * @example
     * // Update one Alert
     * const alert = await prisma.alert.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AlertUpdateArgs>(args: SelectSubset<T, AlertUpdateArgs<ExtArgs>>): Prisma__AlertClient<$Result.GetResult<Prisma.$AlertPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Alerts.
     * @param {AlertDeleteManyArgs} args - Arguments to filter Alerts to delete.
     * @example
     * // Delete a few Alerts
     * const { count } = await prisma.alert.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AlertDeleteManyArgs>(args?: SelectSubset<T, AlertDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Alerts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlertUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Alerts
     * const alert = await prisma.alert.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AlertUpdateManyArgs>(args: SelectSubset<T, AlertUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Alerts and returns the data updated in the database.
     * @param {AlertUpdateManyAndReturnArgs} args - Arguments to update many Alerts.
     * @example
     * // Update many Alerts
     * const alert = await prisma.alert.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Alerts and only return the `id`
     * const alertWithIdOnly = await prisma.alert.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AlertUpdateManyAndReturnArgs>(args: SelectSubset<T, AlertUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AlertPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Alert.
     * @param {AlertUpsertArgs} args - Arguments to update or create a Alert.
     * @example
     * // Update or create a Alert
     * const alert = await prisma.alert.upsert({
     *   create: {
     *     // ... data to create a Alert
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Alert we want to update
     *   }
     * })
     */
    upsert<T extends AlertUpsertArgs>(args: SelectSubset<T, AlertUpsertArgs<ExtArgs>>): Prisma__AlertClient<$Result.GetResult<Prisma.$AlertPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Alerts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlertCountArgs} args - Arguments to filter Alerts to count.
     * @example
     * // Count the number of Alerts
     * const count = await prisma.alert.count({
     *   where: {
     *     // ... the filter for the Alerts we want to count
     *   }
     * })
    **/
    count<T extends AlertCountArgs>(
      args?: Subset<T, AlertCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AlertCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Alert.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlertAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AlertAggregateArgs>(args: Subset<T, AlertAggregateArgs>): Prisma.PrismaPromise<GetAlertAggregateType<T>>

    /**
     * Group by Alert.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlertGroupByArgs} args - Group by arguments.
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
      T extends AlertGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AlertGroupByArgs['orderBy'] }
        : { orderBy?: AlertGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, AlertGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAlertGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Alert model
   */
  readonly fields: AlertFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Alert.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AlertClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    credential<T extends Alert$credentialArgs<ExtArgs> = {}>(args?: Subset<T, Alert$credentialArgs<ExtArgs>>): Prisma__AwsCredentialClient<$Result.GetResult<Prisma.$AwsCredentialPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the Alert model
   */
  interface AlertFieldRefs {
    readonly id: FieldRef<"Alert", 'String'>
    readonly title: FieldRef<"Alert", 'String'>
    readonly description: FieldRef<"Alert", 'String'>
    readonly resourceId: FieldRef<"Alert", 'String'>
    readonly resourceType: FieldRef<"Alert", 'String'>
    readonly severity: FieldRef<"Alert", 'String'>
    readonly status: FieldRef<"Alert", 'String'>
    readonly createdAt: FieldRef<"Alert", 'DateTime'>
    readonly updatedAt: FieldRef<"Alert", 'DateTime'>
    readonly credentialId: FieldRef<"Alert", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Alert findUnique
   */
  export type AlertFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alert
     */
    select?: AlertSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Alert
     */
    omit?: AlertOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertInclude<ExtArgs> | null
    /**
     * Filter, which Alert to fetch.
     */
    where: AlertWhereUniqueInput
  }

  /**
   * Alert findUniqueOrThrow
   */
  export type AlertFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alert
     */
    select?: AlertSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Alert
     */
    omit?: AlertOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertInclude<ExtArgs> | null
    /**
     * Filter, which Alert to fetch.
     */
    where: AlertWhereUniqueInput
  }

  /**
   * Alert findFirst
   */
  export type AlertFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alert
     */
    select?: AlertSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Alert
     */
    omit?: AlertOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertInclude<ExtArgs> | null
    /**
     * Filter, which Alert to fetch.
     */
    where?: AlertWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Alerts to fetch.
     */
    orderBy?: AlertOrderByWithRelationInput | AlertOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Alerts.
     */
    cursor?: AlertWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Alerts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Alerts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Alerts.
     */
    distinct?: AlertScalarFieldEnum | AlertScalarFieldEnum[]
  }

  /**
   * Alert findFirstOrThrow
   */
  export type AlertFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alert
     */
    select?: AlertSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Alert
     */
    omit?: AlertOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertInclude<ExtArgs> | null
    /**
     * Filter, which Alert to fetch.
     */
    where?: AlertWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Alerts to fetch.
     */
    orderBy?: AlertOrderByWithRelationInput | AlertOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Alerts.
     */
    cursor?: AlertWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Alerts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Alerts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Alerts.
     */
    distinct?: AlertScalarFieldEnum | AlertScalarFieldEnum[]
  }

  /**
   * Alert findMany
   */
  export type AlertFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alert
     */
    select?: AlertSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Alert
     */
    omit?: AlertOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertInclude<ExtArgs> | null
    /**
     * Filter, which Alerts to fetch.
     */
    where?: AlertWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Alerts to fetch.
     */
    orderBy?: AlertOrderByWithRelationInput | AlertOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Alerts.
     */
    cursor?: AlertWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Alerts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Alerts.
     */
    skip?: number
    distinct?: AlertScalarFieldEnum | AlertScalarFieldEnum[]
  }

  /**
   * Alert create
   */
  export type AlertCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alert
     */
    select?: AlertSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Alert
     */
    omit?: AlertOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertInclude<ExtArgs> | null
    /**
     * The data needed to create a Alert.
     */
    data: XOR<AlertCreateInput, AlertUncheckedCreateInput>
  }

  /**
   * Alert createMany
   */
  export type AlertCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Alerts.
     */
    data: AlertCreateManyInput | AlertCreateManyInput[]
  }

  /**
   * Alert createManyAndReturn
   */
  export type AlertCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alert
     */
    select?: AlertSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Alert
     */
    omit?: AlertOmit<ExtArgs> | null
    /**
     * The data used to create many Alerts.
     */
    data: AlertCreateManyInput | AlertCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Alert update
   */
  export type AlertUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alert
     */
    select?: AlertSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Alert
     */
    omit?: AlertOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertInclude<ExtArgs> | null
    /**
     * The data needed to update a Alert.
     */
    data: XOR<AlertUpdateInput, AlertUncheckedUpdateInput>
    /**
     * Choose, which Alert to update.
     */
    where: AlertWhereUniqueInput
  }

  /**
   * Alert updateMany
   */
  export type AlertUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Alerts.
     */
    data: XOR<AlertUpdateManyMutationInput, AlertUncheckedUpdateManyInput>
    /**
     * Filter which Alerts to update
     */
    where?: AlertWhereInput
    /**
     * Limit how many Alerts to update.
     */
    limit?: number
  }

  /**
   * Alert updateManyAndReturn
   */
  export type AlertUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alert
     */
    select?: AlertSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Alert
     */
    omit?: AlertOmit<ExtArgs> | null
    /**
     * The data used to update Alerts.
     */
    data: XOR<AlertUpdateManyMutationInput, AlertUncheckedUpdateManyInput>
    /**
     * Filter which Alerts to update
     */
    where?: AlertWhereInput
    /**
     * Limit how many Alerts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Alert upsert
   */
  export type AlertUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alert
     */
    select?: AlertSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Alert
     */
    omit?: AlertOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertInclude<ExtArgs> | null
    /**
     * The filter to search for the Alert to update in case it exists.
     */
    where: AlertWhereUniqueInput
    /**
     * In case the Alert found by the `where` argument doesn't exist, create a new Alert with this data.
     */
    create: XOR<AlertCreateInput, AlertUncheckedCreateInput>
    /**
     * In case the Alert was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AlertUpdateInput, AlertUncheckedUpdateInput>
  }

  /**
   * Alert delete
   */
  export type AlertDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alert
     */
    select?: AlertSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Alert
     */
    omit?: AlertOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertInclude<ExtArgs> | null
    /**
     * Filter which Alert to delete.
     */
    where: AlertWhereUniqueInput
  }

  /**
   * Alert deleteMany
   */
  export type AlertDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Alerts to delete
     */
    where?: AlertWhereInput
    /**
     * Limit how many Alerts to delete.
     */
    limit?: number
  }

  /**
   * Alert.credential
   */
  export type Alert$credentialArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AwsCredential
     */
    select?: AwsCredentialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AwsCredential
     */
    omit?: AwsCredentialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AwsCredentialInclude<ExtArgs> | null
    where?: AwsCredentialWhereInput
  }

  /**
   * Alert without action
   */
  export type AlertDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alert
     */
    select?: AlertSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Alert
     */
    omit?: AlertOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertInclude<ExtArgs> | null
  }


  /**
   * Model SiemRule
   */

  export type AggregateSiemRule = {
    _count: SiemRuleCountAggregateOutputType | null
    _avg: SiemRuleAvgAggregateOutputType | null
    _sum: SiemRuleSumAggregateOutputType | null
    _min: SiemRuleMinAggregateOutputType | null
    _max: SiemRuleMaxAggregateOutputType | null
  }

  export type SiemRuleAvgAggregateOutputType = {
    triggers: number | null
  }

  export type SiemRuleSumAggregateOutputType = {
    triggers: number | null
  }

  export type SiemRuleMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    type: string | null
    query: string | null
    severity: string | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
    triggers: number | null
    lastTriggered: Date | null
    credentialId: string | null
  }

  export type SiemRuleMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    type: string | null
    query: string | null
    severity: string | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
    triggers: number | null
    lastTriggered: Date | null
    credentialId: string | null
  }

  export type SiemRuleCountAggregateOutputType = {
    id: number
    name: number
    description: number
    type: number
    query: number
    severity: number
    status: number
    createdAt: number
    updatedAt: number
    triggers: number
    lastTriggered: number
    credentialId: number
    _all: number
  }


  export type SiemRuleAvgAggregateInputType = {
    triggers?: true
  }

  export type SiemRuleSumAggregateInputType = {
    triggers?: true
  }

  export type SiemRuleMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    type?: true
    query?: true
    severity?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    triggers?: true
    lastTriggered?: true
    credentialId?: true
  }

  export type SiemRuleMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    type?: true
    query?: true
    severity?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    triggers?: true
    lastTriggered?: true
    credentialId?: true
  }

  export type SiemRuleCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    type?: true
    query?: true
    severity?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    triggers?: true
    lastTriggered?: true
    credentialId?: true
    _all?: true
  }

  export type SiemRuleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SiemRule to aggregate.
     */
    where?: SiemRuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SiemRules to fetch.
     */
    orderBy?: SiemRuleOrderByWithRelationInput | SiemRuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SiemRuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SiemRules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SiemRules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SiemRules
    **/
    _count?: true | SiemRuleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SiemRuleAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SiemRuleSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SiemRuleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SiemRuleMaxAggregateInputType
  }

  export type GetSiemRuleAggregateType<T extends SiemRuleAggregateArgs> = {
        [P in keyof T & keyof AggregateSiemRule]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSiemRule[P]>
      : GetScalarType<T[P], AggregateSiemRule[P]>
  }




  export type SiemRuleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SiemRuleWhereInput
    orderBy?: SiemRuleOrderByWithAggregationInput | SiemRuleOrderByWithAggregationInput[]
    by: SiemRuleScalarFieldEnum[] | SiemRuleScalarFieldEnum
    having?: SiemRuleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SiemRuleCountAggregateInputType | true
    _avg?: SiemRuleAvgAggregateInputType
    _sum?: SiemRuleSumAggregateInputType
    _min?: SiemRuleMinAggregateInputType
    _max?: SiemRuleMaxAggregateInputType
  }

  export type SiemRuleGroupByOutputType = {
    id: string
    name: string
    description: string
    type: string
    query: string
    severity: string
    status: string
    createdAt: Date
    updatedAt: Date
    triggers: number
    lastTriggered: Date | null
    credentialId: string
    _count: SiemRuleCountAggregateOutputType | null
    _avg: SiemRuleAvgAggregateOutputType | null
    _sum: SiemRuleSumAggregateOutputType | null
    _min: SiemRuleMinAggregateOutputType | null
    _max: SiemRuleMaxAggregateOutputType | null
  }

  type GetSiemRuleGroupByPayload<T extends SiemRuleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SiemRuleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SiemRuleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SiemRuleGroupByOutputType[P]>
            : GetScalarType<T[P], SiemRuleGroupByOutputType[P]>
        }
      >
    >


  export type SiemRuleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    type?: boolean
    query?: boolean
    severity?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    triggers?: boolean
    lastTriggered?: boolean
    credentialId?: boolean
    credential?: boolean | AwsCredentialDefaultArgs<ExtArgs>
    events?: boolean | SiemRule$eventsArgs<ExtArgs>
    _count?: boolean | SiemRuleCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["siemRule"]>

  export type SiemRuleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    type?: boolean
    query?: boolean
    severity?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    triggers?: boolean
    lastTriggered?: boolean
    credentialId?: boolean
    credential?: boolean | AwsCredentialDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["siemRule"]>

  export type SiemRuleSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    type?: boolean
    query?: boolean
    severity?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    triggers?: boolean
    lastTriggered?: boolean
    credentialId?: boolean
    credential?: boolean | AwsCredentialDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["siemRule"]>

  export type SiemRuleSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    type?: boolean
    query?: boolean
    severity?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    triggers?: boolean
    lastTriggered?: boolean
    credentialId?: boolean
  }

  export type SiemRuleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "type" | "query" | "severity" | "status" | "createdAt" | "updatedAt" | "triggers" | "lastTriggered" | "credentialId", ExtArgs["result"]["siemRule"]>
  export type SiemRuleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    credential?: boolean | AwsCredentialDefaultArgs<ExtArgs>
    events?: boolean | SiemRule$eventsArgs<ExtArgs>
    _count?: boolean | SiemRuleCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SiemRuleIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    credential?: boolean | AwsCredentialDefaultArgs<ExtArgs>
  }
  export type SiemRuleIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    credential?: boolean | AwsCredentialDefaultArgs<ExtArgs>
  }

  export type $SiemRulePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SiemRule"
    objects: {
      credential: Prisma.$AwsCredentialPayload<ExtArgs>
      events: Prisma.$SiemEventPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string
      type: string
      query: string
      severity: string
      status: string
      createdAt: Date
      updatedAt: Date
      triggers: number
      lastTriggered: Date | null
      credentialId: string
    }, ExtArgs["result"]["siemRule"]>
    composites: {}
  }

  type SiemRuleGetPayload<S extends boolean | null | undefined | SiemRuleDefaultArgs> = $Result.GetResult<Prisma.$SiemRulePayload, S>

  type SiemRuleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SiemRuleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SiemRuleCountAggregateInputType | true
    }

  export interface SiemRuleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SiemRule'], meta: { name: 'SiemRule' } }
    /**
     * Find zero or one SiemRule that matches the filter.
     * @param {SiemRuleFindUniqueArgs} args - Arguments to find a SiemRule
     * @example
     * // Get one SiemRule
     * const siemRule = await prisma.siemRule.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SiemRuleFindUniqueArgs>(args: SelectSubset<T, SiemRuleFindUniqueArgs<ExtArgs>>): Prisma__SiemRuleClient<$Result.GetResult<Prisma.$SiemRulePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SiemRule that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SiemRuleFindUniqueOrThrowArgs} args - Arguments to find a SiemRule
     * @example
     * // Get one SiemRule
     * const siemRule = await prisma.siemRule.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SiemRuleFindUniqueOrThrowArgs>(args: SelectSubset<T, SiemRuleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SiemRuleClient<$Result.GetResult<Prisma.$SiemRulePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SiemRule that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SiemRuleFindFirstArgs} args - Arguments to find a SiemRule
     * @example
     * // Get one SiemRule
     * const siemRule = await prisma.siemRule.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SiemRuleFindFirstArgs>(args?: SelectSubset<T, SiemRuleFindFirstArgs<ExtArgs>>): Prisma__SiemRuleClient<$Result.GetResult<Prisma.$SiemRulePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SiemRule that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SiemRuleFindFirstOrThrowArgs} args - Arguments to find a SiemRule
     * @example
     * // Get one SiemRule
     * const siemRule = await prisma.siemRule.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SiemRuleFindFirstOrThrowArgs>(args?: SelectSubset<T, SiemRuleFindFirstOrThrowArgs<ExtArgs>>): Prisma__SiemRuleClient<$Result.GetResult<Prisma.$SiemRulePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SiemRules that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SiemRuleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SiemRules
     * const siemRules = await prisma.siemRule.findMany()
     * 
     * // Get first 10 SiemRules
     * const siemRules = await prisma.siemRule.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const siemRuleWithIdOnly = await prisma.siemRule.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SiemRuleFindManyArgs>(args?: SelectSubset<T, SiemRuleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SiemRulePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SiemRule.
     * @param {SiemRuleCreateArgs} args - Arguments to create a SiemRule.
     * @example
     * // Create one SiemRule
     * const SiemRule = await prisma.siemRule.create({
     *   data: {
     *     // ... data to create a SiemRule
     *   }
     * })
     * 
     */
    create<T extends SiemRuleCreateArgs>(args: SelectSubset<T, SiemRuleCreateArgs<ExtArgs>>): Prisma__SiemRuleClient<$Result.GetResult<Prisma.$SiemRulePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SiemRules.
     * @param {SiemRuleCreateManyArgs} args - Arguments to create many SiemRules.
     * @example
     * // Create many SiemRules
     * const siemRule = await prisma.siemRule.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SiemRuleCreateManyArgs>(args?: SelectSubset<T, SiemRuleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SiemRules and returns the data saved in the database.
     * @param {SiemRuleCreateManyAndReturnArgs} args - Arguments to create many SiemRules.
     * @example
     * // Create many SiemRules
     * const siemRule = await prisma.siemRule.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SiemRules and only return the `id`
     * const siemRuleWithIdOnly = await prisma.siemRule.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SiemRuleCreateManyAndReturnArgs>(args?: SelectSubset<T, SiemRuleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SiemRulePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SiemRule.
     * @param {SiemRuleDeleteArgs} args - Arguments to delete one SiemRule.
     * @example
     * // Delete one SiemRule
     * const SiemRule = await prisma.siemRule.delete({
     *   where: {
     *     // ... filter to delete one SiemRule
     *   }
     * })
     * 
     */
    delete<T extends SiemRuleDeleteArgs>(args: SelectSubset<T, SiemRuleDeleteArgs<ExtArgs>>): Prisma__SiemRuleClient<$Result.GetResult<Prisma.$SiemRulePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SiemRule.
     * @param {SiemRuleUpdateArgs} args - Arguments to update one SiemRule.
     * @example
     * // Update one SiemRule
     * const siemRule = await prisma.siemRule.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SiemRuleUpdateArgs>(args: SelectSubset<T, SiemRuleUpdateArgs<ExtArgs>>): Prisma__SiemRuleClient<$Result.GetResult<Prisma.$SiemRulePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SiemRules.
     * @param {SiemRuleDeleteManyArgs} args - Arguments to filter SiemRules to delete.
     * @example
     * // Delete a few SiemRules
     * const { count } = await prisma.siemRule.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SiemRuleDeleteManyArgs>(args?: SelectSubset<T, SiemRuleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SiemRules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SiemRuleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SiemRules
     * const siemRule = await prisma.siemRule.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SiemRuleUpdateManyArgs>(args: SelectSubset<T, SiemRuleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SiemRules and returns the data updated in the database.
     * @param {SiemRuleUpdateManyAndReturnArgs} args - Arguments to update many SiemRules.
     * @example
     * // Update many SiemRules
     * const siemRule = await prisma.siemRule.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SiemRules and only return the `id`
     * const siemRuleWithIdOnly = await prisma.siemRule.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SiemRuleUpdateManyAndReturnArgs>(args: SelectSubset<T, SiemRuleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SiemRulePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SiemRule.
     * @param {SiemRuleUpsertArgs} args - Arguments to update or create a SiemRule.
     * @example
     * // Update or create a SiemRule
     * const siemRule = await prisma.siemRule.upsert({
     *   create: {
     *     // ... data to create a SiemRule
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SiemRule we want to update
     *   }
     * })
     */
    upsert<T extends SiemRuleUpsertArgs>(args: SelectSubset<T, SiemRuleUpsertArgs<ExtArgs>>): Prisma__SiemRuleClient<$Result.GetResult<Prisma.$SiemRulePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SiemRules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SiemRuleCountArgs} args - Arguments to filter SiemRules to count.
     * @example
     * // Count the number of SiemRules
     * const count = await prisma.siemRule.count({
     *   where: {
     *     // ... the filter for the SiemRules we want to count
     *   }
     * })
    **/
    count<T extends SiemRuleCountArgs>(
      args?: Subset<T, SiemRuleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SiemRuleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SiemRule.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SiemRuleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SiemRuleAggregateArgs>(args: Subset<T, SiemRuleAggregateArgs>): Prisma.PrismaPromise<GetSiemRuleAggregateType<T>>

    /**
     * Group by SiemRule.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SiemRuleGroupByArgs} args - Group by arguments.
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
      T extends SiemRuleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SiemRuleGroupByArgs['orderBy'] }
        : { orderBy?: SiemRuleGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, SiemRuleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSiemRuleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SiemRule model
   */
  readonly fields: SiemRuleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SiemRule.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SiemRuleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    credential<T extends AwsCredentialDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AwsCredentialDefaultArgs<ExtArgs>>): Prisma__AwsCredentialClient<$Result.GetResult<Prisma.$AwsCredentialPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    events<T extends SiemRule$eventsArgs<ExtArgs> = {}>(args?: Subset<T, SiemRule$eventsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SiemEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the SiemRule model
   */
  interface SiemRuleFieldRefs {
    readonly id: FieldRef<"SiemRule", 'String'>
    readonly name: FieldRef<"SiemRule", 'String'>
    readonly description: FieldRef<"SiemRule", 'String'>
    readonly type: FieldRef<"SiemRule", 'String'>
    readonly query: FieldRef<"SiemRule", 'String'>
    readonly severity: FieldRef<"SiemRule", 'String'>
    readonly status: FieldRef<"SiemRule", 'String'>
    readonly createdAt: FieldRef<"SiemRule", 'DateTime'>
    readonly updatedAt: FieldRef<"SiemRule", 'DateTime'>
    readonly triggers: FieldRef<"SiemRule", 'Int'>
    readonly lastTriggered: FieldRef<"SiemRule", 'DateTime'>
    readonly credentialId: FieldRef<"SiemRule", 'String'>
  }
    

  // Custom InputTypes
  /**
   * SiemRule findUnique
   */
  export type SiemRuleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiemRule
     */
    select?: SiemRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SiemRule
     */
    omit?: SiemRuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SiemRuleInclude<ExtArgs> | null
    /**
     * Filter, which SiemRule to fetch.
     */
    where: SiemRuleWhereUniqueInput
  }

  /**
   * SiemRule findUniqueOrThrow
   */
  export type SiemRuleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiemRule
     */
    select?: SiemRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SiemRule
     */
    omit?: SiemRuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SiemRuleInclude<ExtArgs> | null
    /**
     * Filter, which SiemRule to fetch.
     */
    where: SiemRuleWhereUniqueInput
  }

  /**
   * SiemRule findFirst
   */
  export type SiemRuleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiemRule
     */
    select?: SiemRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SiemRule
     */
    omit?: SiemRuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SiemRuleInclude<ExtArgs> | null
    /**
     * Filter, which SiemRule to fetch.
     */
    where?: SiemRuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SiemRules to fetch.
     */
    orderBy?: SiemRuleOrderByWithRelationInput | SiemRuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SiemRules.
     */
    cursor?: SiemRuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SiemRules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SiemRules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SiemRules.
     */
    distinct?: SiemRuleScalarFieldEnum | SiemRuleScalarFieldEnum[]
  }

  /**
   * SiemRule findFirstOrThrow
   */
  export type SiemRuleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiemRule
     */
    select?: SiemRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SiemRule
     */
    omit?: SiemRuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SiemRuleInclude<ExtArgs> | null
    /**
     * Filter, which SiemRule to fetch.
     */
    where?: SiemRuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SiemRules to fetch.
     */
    orderBy?: SiemRuleOrderByWithRelationInput | SiemRuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SiemRules.
     */
    cursor?: SiemRuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SiemRules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SiemRules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SiemRules.
     */
    distinct?: SiemRuleScalarFieldEnum | SiemRuleScalarFieldEnum[]
  }

  /**
   * SiemRule findMany
   */
  export type SiemRuleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiemRule
     */
    select?: SiemRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SiemRule
     */
    omit?: SiemRuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SiemRuleInclude<ExtArgs> | null
    /**
     * Filter, which SiemRules to fetch.
     */
    where?: SiemRuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SiemRules to fetch.
     */
    orderBy?: SiemRuleOrderByWithRelationInput | SiemRuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SiemRules.
     */
    cursor?: SiemRuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SiemRules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SiemRules.
     */
    skip?: number
    distinct?: SiemRuleScalarFieldEnum | SiemRuleScalarFieldEnum[]
  }

  /**
   * SiemRule create
   */
  export type SiemRuleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiemRule
     */
    select?: SiemRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SiemRule
     */
    omit?: SiemRuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SiemRuleInclude<ExtArgs> | null
    /**
     * The data needed to create a SiemRule.
     */
    data: XOR<SiemRuleCreateInput, SiemRuleUncheckedCreateInput>
  }

  /**
   * SiemRule createMany
   */
  export type SiemRuleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SiemRules.
     */
    data: SiemRuleCreateManyInput | SiemRuleCreateManyInput[]
  }

  /**
   * SiemRule createManyAndReturn
   */
  export type SiemRuleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiemRule
     */
    select?: SiemRuleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SiemRule
     */
    omit?: SiemRuleOmit<ExtArgs> | null
    /**
     * The data used to create many SiemRules.
     */
    data: SiemRuleCreateManyInput | SiemRuleCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SiemRuleIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * SiemRule update
   */
  export type SiemRuleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiemRule
     */
    select?: SiemRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SiemRule
     */
    omit?: SiemRuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SiemRuleInclude<ExtArgs> | null
    /**
     * The data needed to update a SiemRule.
     */
    data: XOR<SiemRuleUpdateInput, SiemRuleUncheckedUpdateInput>
    /**
     * Choose, which SiemRule to update.
     */
    where: SiemRuleWhereUniqueInput
  }

  /**
   * SiemRule updateMany
   */
  export type SiemRuleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SiemRules.
     */
    data: XOR<SiemRuleUpdateManyMutationInput, SiemRuleUncheckedUpdateManyInput>
    /**
     * Filter which SiemRules to update
     */
    where?: SiemRuleWhereInput
    /**
     * Limit how many SiemRules to update.
     */
    limit?: number
  }

  /**
   * SiemRule updateManyAndReturn
   */
  export type SiemRuleUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiemRule
     */
    select?: SiemRuleSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SiemRule
     */
    omit?: SiemRuleOmit<ExtArgs> | null
    /**
     * The data used to update SiemRules.
     */
    data: XOR<SiemRuleUpdateManyMutationInput, SiemRuleUncheckedUpdateManyInput>
    /**
     * Filter which SiemRules to update
     */
    where?: SiemRuleWhereInput
    /**
     * Limit how many SiemRules to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SiemRuleIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * SiemRule upsert
   */
  export type SiemRuleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiemRule
     */
    select?: SiemRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SiemRule
     */
    omit?: SiemRuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SiemRuleInclude<ExtArgs> | null
    /**
     * The filter to search for the SiemRule to update in case it exists.
     */
    where: SiemRuleWhereUniqueInput
    /**
     * In case the SiemRule found by the `where` argument doesn't exist, create a new SiemRule with this data.
     */
    create: XOR<SiemRuleCreateInput, SiemRuleUncheckedCreateInput>
    /**
     * In case the SiemRule was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SiemRuleUpdateInput, SiemRuleUncheckedUpdateInput>
  }

  /**
   * SiemRule delete
   */
  export type SiemRuleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiemRule
     */
    select?: SiemRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SiemRule
     */
    omit?: SiemRuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SiemRuleInclude<ExtArgs> | null
    /**
     * Filter which SiemRule to delete.
     */
    where: SiemRuleWhereUniqueInput
  }

  /**
   * SiemRule deleteMany
   */
  export type SiemRuleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SiemRules to delete
     */
    where?: SiemRuleWhereInput
    /**
     * Limit how many SiemRules to delete.
     */
    limit?: number
  }

  /**
   * SiemRule.events
   */
  export type SiemRule$eventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiemEvent
     */
    select?: SiemEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SiemEvent
     */
    omit?: SiemEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SiemEventInclude<ExtArgs> | null
    where?: SiemEventWhereInput
    orderBy?: SiemEventOrderByWithRelationInput | SiemEventOrderByWithRelationInput[]
    cursor?: SiemEventWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SiemEventScalarFieldEnum | SiemEventScalarFieldEnum[]
  }

  /**
   * SiemRule without action
   */
  export type SiemRuleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiemRule
     */
    select?: SiemRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SiemRule
     */
    omit?: SiemRuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SiemRuleInclude<ExtArgs> | null
  }


  /**
   * Model SiemEvent
   */

  export type AggregateSiemEvent = {
    _count: SiemEventCountAggregateOutputType | null
    _min: SiemEventMinAggregateOutputType | null
    _max: SiemEventMaxAggregateOutputType | null
  }

  export type SiemEventMinAggregateOutputType = {
    id: string | null
    timestamp: Date | null
    source: string | null
    eventType: string | null
    severity: string | null
    status: string | null
    message: string | null
    rawData: string | null
    accountId: string | null
    region: string | null
    resource: string | null
    createdAt: Date | null
    updatedAt: Date | null
    credentialId: string | null
    ruleId: string | null
  }

  export type SiemEventMaxAggregateOutputType = {
    id: string | null
    timestamp: Date | null
    source: string | null
    eventType: string | null
    severity: string | null
    status: string | null
    message: string | null
    rawData: string | null
    accountId: string | null
    region: string | null
    resource: string | null
    createdAt: Date | null
    updatedAt: Date | null
    credentialId: string | null
    ruleId: string | null
  }

  export type SiemEventCountAggregateOutputType = {
    id: number
    timestamp: number
    source: number
    eventType: number
    severity: number
    status: number
    message: number
    rawData: number
    accountId: number
    region: number
    resource: number
    createdAt: number
    updatedAt: number
    credentialId: number
    ruleId: number
    _all: number
  }


  export type SiemEventMinAggregateInputType = {
    id?: true
    timestamp?: true
    source?: true
    eventType?: true
    severity?: true
    status?: true
    message?: true
    rawData?: true
    accountId?: true
    region?: true
    resource?: true
    createdAt?: true
    updatedAt?: true
    credentialId?: true
    ruleId?: true
  }

  export type SiemEventMaxAggregateInputType = {
    id?: true
    timestamp?: true
    source?: true
    eventType?: true
    severity?: true
    status?: true
    message?: true
    rawData?: true
    accountId?: true
    region?: true
    resource?: true
    createdAt?: true
    updatedAt?: true
    credentialId?: true
    ruleId?: true
  }

  export type SiemEventCountAggregateInputType = {
    id?: true
    timestamp?: true
    source?: true
    eventType?: true
    severity?: true
    status?: true
    message?: true
    rawData?: true
    accountId?: true
    region?: true
    resource?: true
    createdAt?: true
    updatedAt?: true
    credentialId?: true
    ruleId?: true
    _all?: true
  }

  export type SiemEventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SiemEvent to aggregate.
     */
    where?: SiemEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SiemEvents to fetch.
     */
    orderBy?: SiemEventOrderByWithRelationInput | SiemEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SiemEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SiemEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SiemEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SiemEvents
    **/
    _count?: true | SiemEventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SiemEventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SiemEventMaxAggregateInputType
  }

  export type GetSiemEventAggregateType<T extends SiemEventAggregateArgs> = {
        [P in keyof T & keyof AggregateSiemEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSiemEvent[P]>
      : GetScalarType<T[P], AggregateSiemEvent[P]>
  }




  export type SiemEventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SiemEventWhereInput
    orderBy?: SiemEventOrderByWithAggregationInput | SiemEventOrderByWithAggregationInput[]
    by: SiemEventScalarFieldEnum[] | SiemEventScalarFieldEnum
    having?: SiemEventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SiemEventCountAggregateInputType | true
    _min?: SiemEventMinAggregateInputType
    _max?: SiemEventMaxAggregateInputType
  }

  export type SiemEventGroupByOutputType = {
    id: string
    timestamp: Date
    source: string
    eventType: string
    severity: string
    status: string
    message: string
    rawData: string
    accountId: string | null
    region: string | null
    resource: string | null
    createdAt: Date
    updatedAt: Date
    credentialId: string
    ruleId: string | null
    _count: SiemEventCountAggregateOutputType | null
    _min: SiemEventMinAggregateOutputType | null
    _max: SiemEventMaxAggregateOutputType | null
  }

  type GetSiemEventGroupByPayload<T extends SiemEventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SiemEventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SiemEventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SiemEventGroupByOutputType[P]>
            : GetScalarType<T[P], SiemEventGroupByOutputType[P]>
        }
      >
    >


  export type SiemEventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    timestamp?: boolean
    source?: boolean
    eventType?: boolean
    severity?: boolean
    status?: boolean
    message?: boolean
    rawData?: boolean
    accountId?: boolean
    region?: boolean
    resource?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    credentialId?: boolean
    ruleId?: boolean
    credential?: boolean | AwsCredentialDefaultArgs<ExtArgs>
    rule?: boolean | SiemEvent$ruleArgs<ExtArgs>
  }, ExtArgs["result"]["siemEvent"]>

  export type SiemEventSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    timestamp?: boolean
    source?: boolean
    eventType?: boolean
    severity?: boolean
    status?: boolean
    message?: boolean
    rawData?: boolean
    accountId?: boolean
    region?: boolean
    resource?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    credentialId?: boolean
    ruleId?: boolean
    credential?: boolean | AwsCredentialDefaultArgs<ExtArgs>
    rule?: boolean | SiemEvent$ruleArgs<ExtArgs>
  }, ExtArgs["result"]["siemEvent"]>

  export type SiemEventSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    timestamp?: boolean
    source?: boolean
    eventType?: boolean
    severity?: boolean
    status?: boolean
    message?: boolean
    rawData?: boolean
    accountId?: boolean
    region?: boolean
    resource?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    credentialId?: boolean
    ruleId?: boolean
    credential?: boolean | AwsCredentialDefaultArgs<ExtArgs>
    rule?: boolean | SiemEvent$ruleArgs<ExtArgs>
  }, ExtArgs["result"]["siemEvent"]>

  export type SiemEventSelectScalar = {
    id?: boolean
    timestamp?: boolean
    source?: boolean
    eventType?: boolean
    severity?: boolean
    status?: boolean
    message?: boolean
    rawData?: boolean
    accountId?: boolean
    region?: boolean
    resource?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    credentialId?: boolean
    ruleId?: boolean
  }

  export type SiemEventOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "timestamp" | "source" | "eventType" | "severity" | "status" | "message" | "rawData" | "accountId" | "region" | "resource" | "createdAt" | "updatedAt" | "credentialId" | "ruleId", ExtArgs["result"]["siemEvent"]>
  export type SiemEventInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    credential?: boolean | AwsCredentialDefaultArgs<ExtArgs>
    rule?: boolean | SiemEvent$ruleArgs<ExtArgs>
  }
  export type SiemEventIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    credential?: boolean | AwsCredentialDefaultArgs<ExtArgs>
    rule?: boolean | SiemEvent$ruleArgs<ExtArgs>
  }
  export type SiemEventIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    credential?: boolean | AwsCredentialDefaultArgs<ExtArgs>
    rule?: boolean | SiemEvent$ruleArgs<ExtArgs>
  }

  export type $SiemEventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SiemEvent"
    objects: {
      credential: Prisma.$AwsCredentialPayload<ExtArgs>
      rule: Prisma.$SiemRulePayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      timestamp: Date
      source: string
      eventType: string
      severity: string
      status: string
      message: string
      rawData: string
      accountId: string | null
      region: string | null
      resource: string | null
      createdAt: Date
      updatedAt: Date
      credentialId: string
      ruleId: string | null
    }, ExtArgs["result"]["siemEvent"]>
    composites: {}
  }

  type SiemEventGetPayload<S extends boolean | null | undefined | SiemEventDefaultArgs> = $Result.GetResult<Prisma.$SiemEventPayload, S>

  type SiemEventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SiemEventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SiemEventCountAggregateInputType | true
    }

  export interface SiemEventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SiemEvent'], meta: { name: 'SiemEvent' } }
    /**
     * Find zero or one SiemEvent that matches the filter.
     * @param {SiemEventFindUniqueArgs} args - Arguments to find a SiemEvent
     * @example
     * // Get one SiemEvent
     * const siemEvent = await prisma.siemEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SiemEventFindUniqueArgs>(args: SelectSubset<T, SiemEventFindUniqueArgs<ExtArgs>>): Prisma__SiemEventClient<$Result.GetResult<Prisma.$SiemEventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SiemEvent that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SiemEventFindUniqueOrThrowArgs} args - Arguments to find a SiemEvent
     * @example
     * // Get one SiemEvent
     * const siemEvent = await prisma.siemEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SiemEventFindUniqueOrThrowArgs>(args: SelectSubset<T, SiemEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SiemEventClient<$Result.GetResult<Prisma.$SiemEventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SiemEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SiemEventFindFirstArgs} args - Arguments to find a SiemEvent
     * @example
     * // Get one SiemEvent
     * const siemEvent = await prisma.siemEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SiemEventFindFirstArgs>(args?: SelectSubset<T, SiemEventFindFirstArgs<ExtArgs>>): Prisma__SiemEventClient<$Result.GetResult<Prisma.$SiemEventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SiemEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SiemEventFindFirstOrThrowArgs} args - Arguments to find a SiemEvent
     * @example
     * // Get one SiemEvent
     * const siemEvent = await prisma.siemEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SiemEventFindFirstOrThrowArgs>(args?: SelectSubset<T, SiemEventFindFirstOrThrowArgs<ExtArgs>>): Prisma__SiemEventClient<$Result.GetResult<Prisma.$SiemEventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SiemEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SiemEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SiemEvents
     * const siemEvents = await prisma.siemEvent.findMany()
     * 
     * // Get first 10 SiemEvents
     * const siemEvents = await prisma.siemEvent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const siemEventWithIdOnly = await prisma.siemEvent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SiemEventFindManyArgs>(args?: SelectSubset<T, SiemEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SiemEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SiemEvent.
     * @param {SiemEventCreateArgs} args - Arguments to create a SiemEvent.
     * @example
     * // Create one SiemEvent
     * const SiemEvent = await prisma.siemEvent.create({
     *   data: {
     *     // ... data to create a SiemEvent
     *   }
     * })
     * 
     */
    create<T extends SiemEventCreateArgs>(args: SelectSubset<T, SiemEventCreateArgs<ExtArgs>>): Prisma__SiemEventClient<$Result.GetResult<Prisma.$SiemEventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SiemEvents.
     * @param {SiemEventCreateManyArgs} args - Arguments to create many SiemEvents.
     * @example
     * // Create many SiemEvents
     * const siemEvent = await prisma.siemEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SiemEventCreateManyArgs>(args?: SelectSubset<T, SiemEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SiemEvents and returns the data saved in the database.
     * @param {SiemEventCreateManyAndReturnArgs} args - Arguments to create many SiemEvents.
     * @example
     * // Create many SiemEvents
     * const siemEvent = await prisma.siemEvent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SiemEvents and only return the `id`
     * const siemEventWithIdOnly = await prisma.siemEvent.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SiemEventCreateManyAndReturnArgs>(args?: SelectSubset<T, SiemEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SiemEventPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SiemEvent.
     * @param {SiemEventDeleteArgs} args - Arguments to delete one SiemEvent.
     * @example
     * // Delete one SiemEvent
     * const SiemEvent = await prisma.siemEvent.delete({
     *   where: {
     *     // ... filter to delete one SiemEvent
     *   }
     * })
     * 
     */
    delete<T extends SiemEventDeleteArgs>(args: SelectSubset<T, SiemEventDeleteArgs<ExtArgs>>): Prisma__SiemEventClient<$Result.GetResult<Prisma.$SiemEventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SiemEvent.
     * @param {SiemEventUpdateArgs} args - Arguments to update one SiemEvent.
     * @example
     * // Update one SiemEvent
     * const siemEvent = await prisma.siemEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SiemEventUpdateArgs>(args: SelectSubset<T, SiemEventUpdateArgs<ExtArgs>>): Prisma__SiemEventClient<$Result.GetResult<Prisma.$SiemEventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SiemEvents.
     * @param {SiemEventDeleteManyArgs} args - Arguments to filter SiemEvents to delete.
     * @example
     * // Delete a few SiemEvents
     * const { count } = await prisma.siemEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SiemEventDeleteManyArgs>(args?: SelectSubset<T, SiemEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SiemEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SiemEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SiemEvents
     * const siemEvent = await prisma.siemEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SiemEventUpdateManyArgs>(args: SelectSubset<T, SiemEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SiemEvents and returns the data updated in the database.
     * @param {SiemEventUpdateManyAndReturnArgs} args - Arguments to update many SiemEvents.
     * @example
     * // Update many SiemEvents
     * const siemEvent = await prisma.siemEvent.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SiemEvents and only return the `id`
     * const siemEventWithIdOnly = await prisma.siemEvent.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SiemEventUpdateManyAndReturnArgs>(args: SelectSubset<T, SiemEventUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SiemEventPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SiemEvent.
     * @param {SiemEventUpsertArgs} args - Arguments to update or create a SiemEvent.
     * @example
     * // Update or create a SiemEvent
     * const siemEvent = await prisma.siemEvent.upsert({
     *   create: {
     *     // ... data to create a SiemEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SiemEvent we want to update
     *   }
     * })
     */
    upsert<T extends SiemEventUpsertArgs>(args: SelectSubset<T, SiemEventUpsertArgs<ExtArgs>>): Prisma__SiemEventClient<$Result.GetResult<Prisma.$SiemEventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SiemEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SiemEventCountArgs} args - Arguments to filter SiemEvents to count.
     * @example
     * // Count the number of SiemEvents
     * const count = await prisma.siemEvent.count({
     *   where: {
     *     // ... the filter for the SiemEvents we want to count
     *   }
     * })
    **/
    count<T extends SiemEventCountArgs>(
      args?: Subset<T, SiemEventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SiemEventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SiemEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SiemEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SiemEventAggregateArgs>(args: Subset<T, SiemEventAggregateArgs>): Prisma.PrismaPromise<GetSiemEventAggregateType<T>>

    /**
     * Group by SiemEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SiemEventGroupByArgs} args - Group by arguments.
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
      T extends SiemEventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SiemEventGroupByArgs['orderBy'] }
        : { orderBy?: SiemEventGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, SiemEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSiemEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SiemEvent model
   */
  readonly fields: SiemEventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SiemEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SiemEventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    credential<T extends AwsCredentialDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AwsCredentialDefaultArgs<ExtArgs>>): Prisma__AwsCredentialClient<$Result.GetResult<Prisma.$AwsCredentialPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    rule<T extends SiemEvent$ruleArgs<ExtArgs> = {}>(args?: Subset<T, SiemEvent$ruleArgs<ExtArgs>>): Prisma__SiemRuleClient<$Result.GetResult<Prisma.$SiemRulePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the SiemEvent model
   */
  interface SiemEventFieldRefs {
    readonly id: FieldRef<"SiemEvent", 'String'>
    readonly timestamp: FieldRef<"SiemEvent", 'DateTime'>
    readonly source: FieldRef<"SiemEvent", 'String'>
    readonly eventType: FieldRef<"SiemEvent", 'String'>
    readonly severity: FieldRef<"SiemEvent", 'String'>
    readonly status: FieldRef<"SiemEvent", 'String'>
    readonly message: FieldRef<"SiemEvent", 'String'>
    readonly rawData: FieldRef<"SiemEvent", 'String'>
    readonly accountId: FieldRef<"SiemEvent", 'String'>
    readonly region: FieldRef<"SiemEvent", 'String'>
    readonly resource: FieldRef<"SiemEvent", 'String'>
    readonly createdAt: FieldRef<"SiemEvent", 'DateTime'>
    readonly updatedAt: FieldRef<"SiemEvent", 'DateTime'>
    readonly credentialId: FieldRef<"SiemEvent", 'String'>
    readonly ruleId: FieldRef<"SiemEvent", 'String'>
  }
    

  // Custom InputTypes
  /**
   * SiemEvent findUnique
   */
  export type SiemEventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiemEvent
     */
    select?: SiemEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SiemEvent
     */
    omit?: SiemEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SiemEventInclude<ExtArgs> | null
    /**
     * Filter, which SiemEvent to fetch.
     */
    where: SiemEventWhereUniqueInput
  }

  /**
   * SiemEvent findUniqueOrThrow
   */
  export type SiemEventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiemEvent
     */
    select?: SiemEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SiemEvent
     */
    omit?: SiemEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SiemEventInclude<ExtArgs> | null
    /**
     * Filter, which SiemEvent to fetch.
     */
    where: SiemEventWhereUniqueInput
  }

  /**
   * SiemEvent findFirst
   */
  export type SiemEventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiemEvent
     */
    select?: SiemEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SiemEvent
     */
    omit?: SiemEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SiemEventInclude<ExtArgs> | null
    /**
     * Filter, which SiemEvent to fetch.
     */
    where?: SiemEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SiemEvents to fetch.
     */
    orderBy?: SiemEventOrderByWithRelationInput | SiemEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SiemEvents.
     */
    cursor?: SiemEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SiemEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SiemEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SiemEvents.
     */
    distinct?: SiemEventScalarFieldEnum | SiemEventScalarFieldEnum[]
  }

  /**
   * SiemEvent findFirstOrThrow
   */
  export type SiemEventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiemEvent
     */
    select?: SiemEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SiemEvent
     */
    omit?: SiemEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SiemEventInclude<ExtArgs> | null
    /**
     * Filter, which SiemEvent to fetch.
     */
    where?: SiemEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SiemEvents to fetch.
     */
    orderBy?: SiemEventOrderByWithRelationInput | SiemEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SiemEvents.
     */
    cursor?: SiemEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SiemEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SiemEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SiemEvents.
     */
    distinct?: SiemEventScalarFieldEnum | SiemEventScalarFieldEnum[]
  }

  /**
   * SiemEvent findMany
   */
  export type SiemEventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiemEvent
     */
    select?: SiemEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SiemEvent
     */
    omit?: SiemEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SiemEventInclude<ExtArgs> | null
    /**
     * Filter, which SiemEvents to fetch.
     */
    where?: SiemEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SiemEvents to fetch.
     */
    orderBy?: SiemEventOrderByWithRelationInput | SiemEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SiemEvents.
     */
    cursor?: SiemEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SiemEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SiemEvents.
     */
    skip?: number
    distinct?: SiemEventScalarFieldEnum | SiemEventScalarFieldEnum[]
  }

  /**
   * SiemEvent create
   */
  export type SiemEventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiemEvent
     */
    select?: SiemEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SiemEvent
     */
    omit?: SiemEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SiemEventInclude<ExtArgs> | null
    /**
     * The data needed to create a SiemEvent.
     */
    data: XOR<SiemEventCreateInput, SiemEventUncheckedCreateInput>
  }

  /**
   * SiemEvent createMany
   */
  export type SiemEventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SiemEvents.
     */
    data: SiemEventCreateManyInput | SiemEventCreateManyInput[]
  }

  /**
   * SiemEvent createManyAndReturn
   */
  export type SiemEventCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiemEvent
     */
    select?: SiemEventSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SiemEvent
     */
    omit?: SiemEventOmit<ExtArgs> | null
    /**
     * The data used to create many SiemEvents.
     */
    data: SiemEventCreateManyInput | SiemEventCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SiemEventIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * SiemEvent update
   */
  export type SiemEventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiemEvent
     */
    select?: SiemEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SiemEvent
     */
    omit?: SiemEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SiemEventInclude<ExtArgs> | null
    /**
     * The data needed to update a SiemEvent.
     */
    data: XOR<SiemEventUpdateInput, SiemEventUncheckedUpdateInput>
    /**
     * Choose, which SiemEvent to update.
     */
    where: SiemEventWhereUniqueInput
  }

  /**
   * SiemEvent updateMany
   */
  export type SiemEventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SiemEvents.
     */
    data: XOR<SiemEventUpdateManyMutationInput, SiemEventUncheckedUpdateManyInput>
    /**
     * Filter which SiemEvents to update
     */
    where?: SiemEventWhereInput
    /**
     * Limit how many SiemEvents to update.
     */
    limit?: number
  }

  /**
   * SiemEvent updateManyAndReturn
   */
  export type SiemEventUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiemEvent
     */
    select?: SiemEventSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SiemEvent
     */
    omit?: SiemEventOmit<ExtArgs> | null
    /**
     * The data used to update SiemEvents.
     */
    data: XOR<SiemEventUpdateManyMutationInput, SiemEventUncheckedUpdateManyInput>
    /**
     * Filter which SiemEvents to update
     */
    where?: SiemEventWhereInput
    /**
     * Limit how many SiemEvents to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SiemEventIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * SiemEvent upsert
   */
  export type SiemEventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiemEvent
     */
    select?: SiemEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SiemEvent
     */
    omit?: SiemEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SiemEventInclude<ExtArgs> | null
    /**
     * The filter to search for the SiemEvent to update in case it exists.
     */
    where: SiemEventWhereUniqueInput
    /**
     * In case the SiemEvent found by the `where` argument doesn't exist, create a new SiemEvent with this data.
     */
    create: XOR<SiemEventCreateInput, SiemEventUncheckedCreateInput>
    /**
     * In case the SiemEvent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SiemEventUpdateInput, SiemEventUncheckedUpdateInput>
  }

  /**
   * SiemEvent delete
   */
  export type SiemEventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiemEvent
     */
    select?: SiemEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SiemEvent
     */
    omit?: SiemEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SiemEventInclude<ExtArgs> | null
    /**
     * Filter which SiemEvent to delete.
     */
    where: SiemEventWhereUniqueInput
  }

  /**
   * SiemEvent deleteMany
   */
  export type SiemEventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SiemEvents to delete
     */
    where?: SiemEventWhereInput
    /**
     * Limit how many SiemEvents to delete.
     */
    limit?: number
  }

  /**
   * SiemEvent.rule
   */
  export type SiemEvent$ruleArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiemRule
     */
    select?: SiemRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SiemRule
     */
    omit?: SiemRuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SiemRuleInclude<ExtArgs> | null
    where?: SiemRuleWhereInput
  }

  /**
   * SiemEvent without action
   */
  export type SiemEventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiemEvent
     */
    select?: SiemEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SiemEvent
     */
    omit?: SiemEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SiemEventInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    password: 'password',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const AwsCredentialScalarFieldEnum: {
    id: 'id',
    name: 'name',
    accessKeyId: 'accessKeyId',
    secretKey: 'secretKey',
    region: 'region',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    userId: 'userId'
  };

  export type AwsCredentialScalarFieldEnum = (typeof AwsCredentialScalarFieldEnum)[keyof typeof AwsCredentialScalarFieldEnum]


  export const AlertScalarFieldEnum: {
    id: 'id',
    title: 'title',
    description: 'description',
    resourceId: 'resourceId',
    resourceType: 'resourceType',
    severity: 'severity',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    credentialId: 'credentialId'
  };

  export type AlertScalarFieldEnum = (typeof AlertScalarFieldEnum)[keyof typeof AlertScalarFieldEnum]


  export const SiemRuleScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    type: 'type',
    query: 'query',
    severity: 'severity',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    triggers: 'triggers',
    lastTriggered: 'lastTriggered',
    credentialId: 'credentialId'
  };

  export type SiemRuleScalarFieldEnum = (typeof SiemRuleScalarFieldEnum)[keyof typeof SiemRuleScalarFieldEnum]


  export const SiemEventScalarFieldEnum: {
    id: 'id',
    timestamp: 'timestamp',
    source: 'source',
    eventType: 'eventType',
    severity: 'severity',
    status: 'status',
    message: 'message',
    rawData: 'rawData',
    accountId: 'accountId',
    region: 'region',
    resource: 'resource',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    credentialId: 'credentialId',
    ruleId: 'ruleId'
  };

  export type SiemEventScalarFieldEnum = (typeof SiemEventScalarFieldEnum)[keyof typeof SiemEventScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    awsCredentials?: AwsCredentialListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    awsCredentials?: AwsCredentialOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    awsCredentials?: AwsCredentialListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    name?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type AwsCredentialWhereInput = {
    AND?: AwsCredentialWhereInput | AwsCredentialWhereInput[]
    OR?: AwsCredentialWhereInput[]
    NOT?: AwsCredentialWhereInput | AwsCredentialWhereInput[]
    id?: StringFilter<"AwsCredential"> | string
    name?: StringFilter<"AwsCredential"> | string
    accessKeyId?: StringFilter<"AwsCredential"> | string
    secretKey?: StringFilter<"AwsCredential"> | string
    region?: StringFilter<"AwsCredential"> | string
    createdAt?: DateTimeFilter<"AwsCredential"> | Date | string
    updatedAt?: DateTimeFilter<"AwsCredential"> | Date | string
    userId?: StringFilter<"AwsCredential"> | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    alerts?: AlertListRelationFilter
    siemRules?: SiemRuleListRelationFilter
    siemEvents?: SiemEventListRelationFilter
  }

  export type AwsCredentialOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    accessKeyId?: SortOrder
    secretKey?: SortOrder
    region?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    user?: UserOrderByWithRelationInput
    alerts?: AlertOrderByRelationAggregateInput
    siemRules?: SiemRuleOrderByRelationAggregateInput
    siemEvents?: SiemEventOrderByRelationAggregateInput
  }

  export type AwsCredentialWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AwsCredentialWhereInput | AwsCredentialWhereInput[]
    OR?: AwsCredentialWhereInput[]
    NOT?: AwsCredentialWhereInput | AwsCredentialWhereInput[]
    name?: StringFilter<"AwsCredential"> | string
    accessKeyId?: StringFilter<"AwsCredential"> | string
    secretKey?: StringFilter<"AwsCredential"> | string
    region?: StringFilter<"AwsCredential"> | string
    createdAt?: DateTimeFilter<"AwsCredential"> | Date | string
    updatedAt?: DateTimeFilter<"AwsCredential"> | Date | string
    userId?: StringFilter<"AwsCredential"> | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    alerts?: AlertListRelationFilter
    siemRules?: SiemRuleListRelationFilter
    siemEvents?: SiemEventListRelationFilter
  }, "id">

  export type AwsCredentialOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    accessKeyId?: SortOrder
    secretKey?: SortOrder
    region?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    _count?: AwsCredentialCountOrderByAggregateInput
    _max?: AwsCredentialMaxOrderByAggregateInput
    _min?: AwsCredentialMinOrderByAggregateInput
  }

  export type AwsCredentialScalarWhereWithAggregatesInput = {
    AND?: AwsCredentialScalarWhereWithAggregatesInput | AwsCredentialScalarWhereWithAggregatesInput[]
    OR?: AwsCredentialScalarWhereWithAggregatesInput[]
    NOT?: AwsCredentialScalarWhereWithAggregatesInput | AwsCredentialScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AwsCredential"> | string
    name?: StringWithAggregatesFilter<"AwsCredential"> | string
    accessKeyId?: StringWithAggregatesFilter<"AwsCredential"> | string
    secretKey?: StringWithAggregatesFilter<"AwsCredential"> | string
    region?: StringWithAggregatesFilter<"AwsCredential"> | string
    createdAt?: DateTimeWithAggregatesFilter<"AwsCredential"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"AwsCredential"> | Date | string
    userId?: StringWithAggregatesFilter<"AwsCredential"> | string
  }

  export type AlertWhereInput = {
    AND?: AlertWhereInput | AlertWhereInput[]
    OR?: AlertWhereInput[]
    NOT?: AlertWhereInput | AlertWhereInput[]
    id?: StringFilter<"Alert"> | string
    title?: StringFilter<"Alert"> | string
    description?: StringFilter<"Alert"> | string
    resourceId?: StringFilter<"Alert"> | string
    resourceType?: StringFilter<"Alert"> | string
    severity?: StringFilter<"Alert"> | string
    status?: StringFilter<"Alert"> | string
    createdAt?: DateTimeFilter<"Alert"> | Date | string
    updatedAt?: DateTimeFilter<"Alert"> | Date | string
    credentialId?: StringNullableFilter<"Alert"> | string | null
    credential?: XOR<AwsCredentialNullableScalarRelationFilter, AwsCredentialWhereInput> | null
  }

  export type AlertOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    resourceId?: SortOrder
    resourceType?: SortOrder
    severity?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    credentialId?: SortOrderInput | SortOrder
    credential?: AwsCredentialOrderByWithRelationInput
  }

  export type AlertWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AlertWhereInput | AlertWhereInput[]
    OR?: AlertWhereInput[]
    NOT?: AlertWhereInput | AlertWhereInput[]
    title?: StringFilter<"Alert"> | string
    description?: StringFilter<"Alert"> | string
    resourceId?: StringFilter<"Alert"> | string
    resourceType?: StringFilter<"Alert"> | string
    severity?: StringFilter<"Alert"> | string
    status?: StringFilter<"Alert"> | string
    createdAt?: DateTimeFilter<"Alert"> | Date | string
    updatedAt?: DateTimeFilter<"Alert"> | Date | string
    credentialId?: StringNullableFilter<"Alert"> | string | null
    credential?: XOR<AwsCredentialNullableScalarRelationFilter, AwsCredentialWhereInput> | null
  }, "id">

  export type AlertOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    resourceId?: SortOrder
    resourceType?: SortOrder
    severity?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    credentialId?: SortOrderInput | SortOrder
    _count?: AlertCountOrderByAggregateInput
    _max?: AlertMaxOrderByAggregateInput
    _min?: AlertMinOrderByAggregateInput
  }

  export type AlertScalarWhereWithAggregatesInput = {
    AND?: AlertScalarWhereWithAggregatesInput | AlertScalarWhereWithAggregatesInput[]
    OR?: AlertScalarWhereWithAggregatesInput[]
    NOT?: AlertScalarWhereWithAggregatesInput | AlertScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Alert"> | string
    title?: StringWithAggregatesFilter<"Alert"> | string
    description?: StringWithAggregatesFilter<"Alert"> | string
    resourceId?: StringWithAggregatesFilter<"Alert"> | string
    resourceType?: StringWithAggregatesFilter<"Alert"> | string
    severity?: StringWithAggregatesFilter<"Alert"> | string
    status?: StringWithAggregatesFilter<"Alert"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Alert"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Alert"> | Date | string
    credentialId?: StringNullableWithAggregatesFilter<"Alert"> | string | null
  }

  export type SiemRuleWhereInput = {
    AND?: SiemRuleWhereInput | SiemRuleWhereInput[]
    OR?: SiemRuleWhereInput[]
    NOT?: SiemRuleWhereInput | SiemRuleWhereInput[]
    id?: StringFilter<"SiemRule"> | string
    name?: StringFilter<"SiemRule"> | string
    description?: StringFilter<"SiemRule"> | string
    type?: StringFilter<"SiemRule"> | string
    query?: StringFilter<"SiemRule"> | string
    severity?: StringFilter<"SiemRule"> | string
    status?: StringFilter<"SiemRule"> | string
    createdAt?: DateTimeFilter<"SiemRule"> | Date | string
    updatedAt?: DateTimeFilter<"SiemRule"> | Date | string
    triggers?: IntFilter<"SiemRule"> | number
    lastTriggered?: DateTimeNullableFilter<"SiemRule"> | Date | string | null
    credentialId?: StringFilter<"SiemRule"> | string
    credential?: XOR<AwsCredentialScalarRelationFilter, AwsCredentialWhereInput>
    events?: SiemEventListRelationFilter
  }

  export type SiemRuleOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    type?: SortOrder
    query?: SortOrder
    severity?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    triggers?: SortOrder
    lastTriggered?: SortOrderInput | SortOrder
    credentialId?: SortOrder
    credential?: AwsCredentialOrderByWithRelationInput
    events?: SiemEventOrderByRelationAggregateInput
  }

  export type SiemRuleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SiemRuleWhereInput | SiemRuleWhereInput[]
    OR?: SiemRuleWhereInput[]
    NOT?: SiemRuleWhereInput | SiemRuleWhereInput[]
    name?: StringFilter<"SiemRule"> | string
    description?: StringFilter<"SiemRule"> | string
    type?: StringFilter<"SiemRule"> | string
    query?: StringFilter<"SiemRule"> | string
    severity?: StringFilter<"SiemRule"> | string
    status?: StringFilter<"SiemRule"> | string
    createdAt?: DateTimeFilter<"SiemRule"> | Date | string
    updatedAt?: DateTimeFilter<"SiemRule"> | Date | string
    triggers?: IntFilter<"SiemRule"> | number
    lastTriggered?: DateTimeNullableFilter<"SiemRule"> | Date | string | null
    credentialId?: StringFilter<"SiemRule"> | string
    credential?: XOR<AwsCredentialScalarRelationFilter, AwsCredentialWhereInput>
    events?: SiemEventListRelationFilter
  }, "id">

  export type SiemRuleOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    type?: SortOrder
    query?: SortOrder
    severity?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    triggers?: SortOrder
    lastTriggered?: SortOrderInput | SortOrder
    credentialId?: SortOrder
    _count?: SiemRuleCountOrderByAggregateInput
    _avg?: SiemRuleAvgOrderByAggregateInput
    _max?: SiemRuleMaxOrderByAggregateInput
    _min?: SiemRuleMinOrderByAggregateInput
    _sum?: SiemRuleSumOrderByAggregateInput
  }

  export type SiemRuleScalarWhereWithAggregatesInput = {
    AND?: SiemRuleScalarWhereWithAggregatesInput | SiemRuleScalarWhereWithAggregatesInput[]
    OR?: SiemRuleScalarWhereWithAggregatesInput[]
    NOT?: SiemRuleScalarWhereWithAggregatesInput | SiemRuleScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SiemRule"> | string
    name?: StringWithAggregatesFilter<"SiemRule"> | string
    description?: StringWithAggregatesFilter<"SiemRule"> | string
    type?: StringWithAggregatesFilter<"SiemRule"> | string
    query?: StringWithAggregatesFilter<"SiemRule"> | string
    severity?: StringWithAggregatesFilter<"SiemRule"> | string
    status?: StringWithAggregatesFilter<"SiemRule"> | string
    createdAt?: DateTimeWithAggregatesFilter<"SiemRule"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SiemRule"> | Date | string
    triggers?: IntWithAggregatesFilter<"SiemRule"> | number
    lastTriggered?: DateTimeNullableWithAggregatesFilter<"SiemRule"> | Date | string | null
    credentialId?: StringWithAggregatesFilter<"SiemRule"> | string
  }

  export type SiemEventWhereInput = {
    AND?: SiemEventWhereInput | SiemEventWhereInput[]
    OR?: SiemEventWhereInput[]
    NOT?: SiemEventWhereInput | SiemEventWhereInput[]
    id?: StringFilter<"SiemEvent"> | string
    timestamp?: DateTimeFilter<"SiemEvent"> | Date | string
    source?: StringFilter<"SiemEvent"> | string
    eventType?: StringFilter<"SiemEvent"> | string
    severity?: StringFilter<"SiemEvent"> | string
    status?: StringFilter<"SiemEvent"> | string
    message?: StringFilter<"SiemEvent"> | string
    rawData?: StringFilter<"SiemEvent"> | string
    accountId?: StringNullableFilter<"SiemEvent"> | string | null
    region?: StringNullableFilter<"SiemEvent"> | string | null
    resource?: StringNullableFilter<"SiemEvent"> | string | null
    createdAt?: DateTimeFilter<"SiemEvent"> | Date | string
    updatedAt?: DateTimeFilter<"SiemEvent"> | Date | string
    credentialId?: StringFilter<"SiemEvent"> | string
    ruleId?: StringNullableFilter<"SiemEvent"> | string | null
    credential?: XOR<AwsCredentialScalarRelationFilter, AwsCredentialWhereInput>
    rule?: XOR<SiemRuleNullableScalarRelationFilter, SiemRuleWhereInput> | null
  }

  export type SiemEventOrderByWithRelationInput = {
    id?: SortOrder
    timestamp?: SortOrder
    source?: SortOrder
    eventType?: SortOrder
    severity?: SortOrder
    status?: SortOrder
    message?: SortOrder
    rawData?: SortOrder
    accountId?: SortOrderInput | SortOrder
    region?: SortOrderInput | SortOrder
    resource?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    credentialId?: SortOrder
    ruleId?: SortOrderInput | SortOrder
    credential?: AwsCredentialOrderByWithRelationInput
    rule?: SiemRuleOrderByWithRelationInput
  }

  export type SiemEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SiemEventWhereInput | SiemEventWhereInput[]
    OR?: SiemEventWhereInput[]
    NOT?: SiemEventWhereInput | SiemEventWhereInput[]
    timestamp?: DateTimeFilter<"SiemEvent"> | Date | string
    source?: StringFilter<"SiemEvent"> | string
    eventType?: StringFilter<"SiemEvent"> | string
    severity?: StringFilter<"SiemEvent"> | string
    status?: StringFilter<"SiemEvent"> | string
    message?: StringFilter<"SiemEvent"> | string
    rawData?: StringFilter<"SiemEvent"> | string
    accountId?: StringNullableFilter<"SiemEvent"> | string | null
    region?: StringNullableFilter<"SiemEvent"> | string | null
    resource?: StringNullableFilter<"SiemEvent"> | string | null
    createdAt?: DateTimeFilter<"SiemEvent"> | Date | string
    updatedAt?: DateTimeFilter<"SiemEvent"> | Date | string
    credentialId?: StringFilter<"SiemEvent"> | string
    ruleId?: StringNullableFilter<"SiemEvent"> | string | null
    credential?: XOR<AwsCredentialScalarRelationFilter, AwsCredentialWhereInput>
    rule?: XOR<SiemRuleNullableScalarRelationFilter, SiemRuleWhereInput> | null
  }, "id">

  export type SiemEventOrderByWithAggregationInput = {
    id?: SortOrder
    timestamp?: SortOrder
    source?: SortOrder
    eventType?: SortOrder
    severity?: SortOrder
    status?: SortOrder
    message?: SortOrder
    rawData?: SortOrder
    accountId?: SortOrderInput | SortOrder
    region?: SortOrderInput | SortOrder
    resource?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    credentialId?: SortOrder
    ruleId?: SortOrderInput | SortOrder
    _count?: SiemEventCountOrderByAggregateInput
    _max?: SiemEventMaxOrderByAggregateInput
    _min?: SiemEventMinOrderByAggregateInput
  }

  export type SiemEventScalarWhereWithAggregatesInput = {
    AND?: SiemEventScalarWhereWithAggregatesInput | SiemEventScalarWhereWithAggregatesInput[]
    OR?: SiemEventScalarWhereWithAggregatesInput[]
    NOT?: SiemEventScalarWhereWithAggregatesInput | SiemEventScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SiemEvent"> | string
    timestamp?: DateTimeWithAggregatesFilter<"SiemEvent"> | Date | string
    source?: StringWithAggregatesFilter<"SiemEvent"> | string
    eventType?: StringWithAggregatesFilter<"SiemEvent"> | string
    severity?: StringWithAggregatesFilter<"SiemEvent"> | string
    status?: StringWithAggregatesFilter<"SiemEvent"> | string
    message?: StringWithAggregatesFilter<"SiemEvent"> | string
    rawData?: StringWithAggregatesFilter<"SiemEvent"> | string
    accountId?: StringNullableWithAggregatesFilter<"SiemEvent"> | string | null
    region?: StringNullableWithAggregatesFilter<"SiemEvent"> | string | null
    resource?: StringNullableWithAggregatesFilter<"SiemEvent"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"SiemEvent"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SiemEvent"> | Date | string
    credentialId?: StringWithAggregatesFilter<"SiemEvent"> | string
    ruleId?: StringNullableWithAggregatesFilter<"SiemEvent"> | string | null
  }

  export type UserCreateInput = {
    id?: string
    name: string
    email: string
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
    awsCredentials?: AwsCredentialCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    name: string
    email: string
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
    awsCredentials?: AwsCredentialUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    awsCredentials?: AwsCredentialUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    awsCredentials?: AwsCredentialUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    name: string
    email: string
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AwsCredentialCreateInput = {
    id?: string
    name: string
    accessKeyId: string
    secretKey: string
    region: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutAwsCredentialsInput
    alerts?: AlertCreateNestedManyWithoutCredentialInput
    siemRules?: SiemRuleCreateNestedManyWithoutCredentialInput
    siemEvents?: SiemEventCreateNestedManyWithoutCredentialInput
  }

  export type AwsCredentialUncheckedCreateInput = {
    id?: string
    name: string
    accessKeyId: string
    secretKey: string
    region: string
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    alerts?: AlertUncheckedCreateNestedManyWithoutCredentialInput
    siemRules?: SiemRuleUncheckedCreateNestedManyWithoutCredentialInput
    siemEvents?: SiemEventUncheckedCreateNestedManyWithoutCredentialInput
  }

  export type AwsCredentialUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    accessKeyId?: StringFieldUpdateOperationsInput | string
    secretKey?: StringFieldUpdateOperationsInput | string
    region?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutAwsCredentialsNestedInput
    alerts?: AlertUpdateManyWithoutCredentialNestedInput
    siemRules?: SiemRuleUpdateManyWithoutCredentialNestedInput
    siemEvents?: SiemEventUpdateManyWithoutCredentialNestedInput
  }

  export type AwsCredentialUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    accessKeyId?: StringFieldUpdateOperationsInput | string
    secretKey?: StringFieldUpdateOperationsInput | string
    region?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    alerts?: AlertUncheckedUpdateManyWithoutCredentialNestedInput
    siemRules?: SiemRuleUncheckedUpdateManyWithoutCredentialNestedInput
    siemEvents?: SiemEventUncheckedUpdateManyWithoutCredentialNestedInput
  }

  export type AwsCredentialCreateManyInput = {
    id?: string
    name: string
    accessKeyId: string
    secretKey: string
    region: string
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
  }

  export type AwsCredentialUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    accessKeyId?: StringFieldUpdateOperationsInput | string
    secretKey?: StringFieldUpdateOperationsInput | string
    region?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AwsCredentialUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    accessKeyId?: StringFieldUpdateOperationsInput | string
    secretKey?: StringFieldUpdateOperationsInput | string
    region?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type AlertCreateInput = {
    id?: string
    title: string
    description: string
    resourceId: string
    resourceType: string
    severity: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    credential?: AwsCredentialCreateNestedOneWithoutAlertsInput
  }

  export type AlertUncheckedCreateInput = {
    id?: string
    title: string
    description: string
    resourceId: string
    resourceType: string
    severity: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    credentialId?: string | null
  }

  export type AlertUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    resourceId?: StringFieldUpdateOperationsInput | string
    resourceType?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    credential?: AwsCredentialUpdateOneWithoutAlertsNestedInput
  }

  export type AlertUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    resourceId?: StringFieldUpdateOperationsInput | string
    resourceType?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    credentialId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AlertCreateManyInput = {
    id?: string
    title: string
    description: string
    resourceId: string
    resourceType: string
    severity: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    credentialId?: string | null
  }

  export type AlertUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    resourceId?: StringFieldUpdateOperationsInput | string
    resourceType?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AlertUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    resourceId?: StringFieldUpdateOperationsInput | string
    resourceType?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    credentialId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SiemRuleCreateInput = {
    id?: string
    name: string
    description: string
    type: string
    query: string
    severity: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    triggers?: number
    lastTriggered?: Date | string | null
    credential: AwsCredentialCreateNestedOneWithoutSiemRulesInput
    events?: SiemEventCreateNestedManyWithoutRuleInput
  }

  export type SiemRuleUncheckedCreateInput = {
    id?: string
    name: string
    description: string
    type: string
    query: string
    severity: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    triggers?: number
    lastTriggered?: Date | string | null
    credentialId: string
    events?: SiemEventUncheckedCreateNestedManyWithoutRuleInput
  }

  export type SiemRuleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    query?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    triggers?: IntFieldUpdateOperationsInput | number
    lastTriggered?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    credential?: AwsCredentialUpdateOneRequiredWithoutSiemRulesNestedInput
    events?: SiemEventUpdateManyWithoutRuleNestedInput
  }

  export type SiemRuleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    query?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    triggers?: IntFieldUpdateOperationsInput | number
    lastTriggered?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    credentialId?: StringFieldUpdateOperationsInput | string
    events?: SiemEventUncheckedUpdateManyWithoutRuleNestedInput
  }

  export type SiemRuleCreateManyInput = {
    id?: string
    name: string
    description: string
    type: string
    query: string
    severity: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    triggers?: number
    lastTriggered?: Date | string | null
    credentialId: string
  }

  export type SiemRuleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    query?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    triggers?: IntFieldUpdateOperationsInput | number
    lastTriggered?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type SiemRuleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    query?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    triggers?: IntFieldUpdateOperationsInput | number
    lastTriggered?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    credentialId?: StringFieldUpdateOperationsInput | string
  }

  export type SiemEventCreateInput = {
    id?: string
    timestamp: Date | string
    source: string
    eventType: string
    severity: string
    status?: string
    message: string
    rawData: string
    accountId?: string | null
    region?: string | null
    resource?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    credential: AwsCredentialCreateNestedOneWithoutSiemEventsInput
    rule?: SiemRuleCreateNestedOneWithoutEventsInput
  }

  export type SiemEventUncheckedCreateInput = {
    id?: string
    timestamp: Date | string
    source: string
    eventType: string
    severity: string
    status?: string
    message: string
    rawData: string
    accountId?: string | null
    region?: string | null
    resource?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    credentialId: string
    ruleId?: string | null
  }

  export type SiemEventUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    source?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    rawData?: StringFieldUpdateOperationsInput | string
    accountId?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    resource?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    credential?: AwsCredentialUpdateOneRequiredWithoutSiemEventsNestedInput
    rule?: SiemRuleUpdateOneWithoutEventsNestedInput
  }

  export type SiemEventUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    source?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    rawData?: StringFieldUpdateOperationsInput | string
    accountId?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    resource?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    credentialId?: StringFieldUpdateOperationsInput | string
    ruleId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SiemEventCreateManyInput = {
    id?: string
    timestamp: Date | string
    source: string
    eventType: string
    severity: string
    status?: string
    message: string
    rawData: string
    accountId?: string | null
    region?: string | null
    resource?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    credentialId: string
    ruleId?: string | null
  }

  export type SiemEventUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    source?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    rawData?: StringFieldUpdateOperationsInput | string
    accountId?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    resource?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SiemEventUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    source?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    rawData?: StringFieldUpdateOperationsInput | string
    accountId?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    resource?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    credentialId?: StringFieldUpdateOperationsInput | string
    ruleId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type AwsCredentialListRelationFilter = {
    every?: AwsCredentialWhereInput
    some?: AwsCredentialWhereInput
    none?: AwsCredentialWhereInput
  }

  export type AwsCredentialOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
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

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type AlertListRelationFilter = {
    every?: AlertWhereInput
    some?: AlertWhereInput
    none?: AlertWhereInput
  }

  export type SiemRuleListRelationFilter = {
    every?: SiemRuleWhereInput
    some?: SiemRuleWhereInput
    none?: SiemRuleWhereInput
  }

  export type SiemEventListRelationFilter = {
    every?: SiemEventWhereInput
    some?: SiemEventWhereInput
    none?: SiemEventWhereInput
  }

  export type AlertOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SiemRuleOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SiemEventOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AwsCredentialCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    accessKeyId?: SortOrder
    secretKey?: SortOrder
    region?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
  }

  export type AwsCredentialMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    accessKeyId?: SortOrder
    secretKey?: SortOrder
    region?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
  }

  export type AwsCredentialMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    accessKeyId?: SortOrder
    secretKey?: SortOrder
    region?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type AwsCredentialNullableScalarRelationFilter = {
    is?: AwsCredentialWhereInput | null
    isNot?: AwsCredentialWhereInput | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type AlertCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    resourceId?: SortOrder
    resourceType?: SortOrder
    severity?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    credentialId?: SortOrder
  }

  export type AlertMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    resourceId?: SortOrder
    resourceType?: SortOrder
    severity?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    credentialId?: SortOrder
  }

  export type AlertMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    resourceId?: SortOrder
    resourceType?: SortOrder
    severity?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    credentialId?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
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

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type AwsCredentialScalarRelationFilter = {
    is?: AwsCredentialWhereInput
    isNot?: AwsCredentialWhereInput
  }

  export type SiemRuleCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    type?: SortOrder
    query?: SortOrder
    severity?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    triggers?: SortOrder
    lastTriggered?: SortOrder
    credentialId?: SortOrder
  }

  export type SiemRuleAvgOrderByAggregateInput = {
    triggers?: SortOrder
  }

  export type SiemRuleMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    type?: SortOrder
    query?: SortOrder
    severity?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    triggers?: SortOrder
    lastTriggered?: SortOrder
    credentialId?: SortOrder
  }

  export type SiemRuleMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    type?: SortOrder
    query?: SortOrder
    severity?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    triggers?: SortOrder
    lastTriggered?: SortOrder
    credentialId?: SortOrder
  }

  export type SiemRuleSumOrderByAggregateInput = {
    triggers?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
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

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type SiemRuleNullableScalarRelationFilter = {
    is?: SiemRuleWhereInput | null
    isNot?: SiemRuleWhereInput | null
  }

  export type SiemEventCountOrderByAggregateInput = {
    id?: SortOrder
    timestamp?: SortOrder
    source?: SortOrder
    eventType?: SortOrder
    severity?: SortOrder
    status?: SortOrder
    message?: SortOrder
    rawData?: SortOrder
    accountId?: SortOrder
    region?: SortOrder
    resource?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    credentialId?: SortOrder
    ruleId?: SortOrder
  }

  export type SiemEventMaxOrderByAggregateInput = {
    id?: SortOrder
    timestamp?: SortOrder
    source?: SortOrder
    eventType?: SortOrder
    severity?: SortOrder
    status?: SortOrder
    message?: SortOrder
    rawData?: SortOrder
    accountId?: SortOrder
    region?: SortOrder
    resource?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    credentialId?: SortOrder
    ruleId?: SortOrder
  }

  export type SiemEventMinOrderByAggregateInput = {
    id?: SortOrder
    timestamp?: SortOrder
    source?: SortOrder
    eventType?: SortOrder
    severity?: SortOrder
    status?: SortOrder
    message?: SortOrder
    rawData?: SortOrder
    accountId?: SortOrder
    region?: SortOrder
    resource?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    credentialId?: SortOrder
    ruleId?: SortOrder
  }

  export type AwsCredentialCreateNestedManyWithoutUserInput = {
    create?: XOR<AwsCredentialCreateWithoutUserInput, AwsCredentialUncheckedCreateWithoutUserInput> | AwsCredentialCreateWithoutUserInput[] | AwsCredentialUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AwsCredentialCreateOrConnectWithoutUserInput | AwsCredentialCreateOrConnectWithoutUserInput[]
    createMany?: AwsCredentialCreateManyUserInputEnvelope
    connect?: AwsCredentialWhereUniqueInput | AwsCredentialWhereUniqueInput[]
  }

  export type AwsCredentialUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AwsCredentialCreateWithoutUserInput, AwsCredentialUncheckedCreateWithoutUserInput> | AwsCredentialCreateWithoutUserInput[] | AwsCredentialUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AwsCredentialCreateOrConnectWithoutUserInput | AwsCredentialCreateOrConnectWithoutUserInput[]
    createMany?: AwsCredentialCreateManyUserInputEnvelope
    connect?: AwsCredentialWhereUniqueInput | AwsCredentialWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type AwsCredentialUpdateManyWithoutUserNestedInput = {
    create?: XOR<AwsCredentialCreateWithoutUserInput, AwsCredentialUncheckedCreateWithoutUserInput> | AwsCredentialCreateWithoutUserInput[] | AwsCredentialUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AwsCredentialCreateOrConnectWithoutUserInput | AwsCredentialCreateOrConnectWithoutUserInput[]
    upsert?: AwsCredentialUpsertWithWhereUniqueWithoutUserInput | AwsCredentialUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AwsCredentialCreateManyUserInputEnvelope
    set?: AwsCredentialWhereUniqueInput | AwsCredentialWhereUniqueInput[]
    disconnect?: AwsCredentialWhereUniqueInput | AwsCredentialWhereUniqueInput[]
    delete?: AwsCredentialWhereUniqueInput | AwsCredentialWhereUniqueInput[]
    connect?: AwsCredentialWhereUniqueInput | AwsCredentialWhereUniqueInput[]
    update?: AwsCredentialUpdateWithWhereUniqueWithoutUserInput | AwsCredentialUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AwsCredentialUpdateManyWithWhereWithoutUserInput | AwsCredentialUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AwsCredentialScalarWhereInput | AwsCredentialScalarWhereInput[]
  }

  export type AwsCredentialUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AwsCredentialCreateWithoutUserInput, AwsCredentialUncheckedCreateWithoutUserInput> | AwsCredentialCreateWithoutUserInput[] | AwsCredentialUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AwsCredentialCreateOrConnectWithoutUserInput | AwsCredentialCreateOrConnectWithoutUserInput[]
    upsert?: AwsCredentialUpsertWithWhereUniqueWithoutUserInput | AwsCredentialUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AwsCredentialCreateManyUserInputEnvelope
    set?: AwsCredentialWhereUniqueInput | AwsCredentialWhereUniqueInput[]
    disconnect?: AwsCredentialWhereUniqueInput | AwsCredentialWhereUniqueInput[]
    delete?: AwsCredentialWhereUniqueInput | AwsCredentialWhereUniqueInput[]
    connect?: AwsCredentialWhereUniqueInput | AwsCredentialWhereUniqueInput[]
    update?: AwsCredentialUpdateWithWhereUniqueWithoutUserInput | AwsCredentialUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AwsCredentialUpdateManyWithWhereWithoutUserInput | AwsCredentialUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AwsCredentialScalarWhereInput | AwsCredentialScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutAwsCredentialsInput = {
    create?: XOR<UserCreateWithoutAwsCredentialsInput, UserUncheckedCreateWithoutAwsCredentialsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAwsCredentialsInput
    connect?: UserWhereUniqueInput
  }

  export type AlertCreateNestedManyWithoutCredentialInput = {
    create?: XOR<AlertCreateWithoutCredentialInput, AlertUncheckedCreateWithoutCredentialInput> | AlertCreateWithoutCredentialInput[] | AlertUncheckedCreateWithoutCredentialInput[]
    connectOrCreate?: AlertCreateOrConnectWithoutCredentialInput | AlertCreateOrConnectWithoutCredentialInput[]
    createMany?: AlertCreateManyCredentialInputEnvelope
    connect?: AlertWhereUniqueInput | AlertWhereUniqueInput[]
  }

  export type SiemRuleCreateNestedManyWithoutCredentialInput = {
    create?: XOR<SiemRuleCreateWithoutCredentialInput, SiemRuleUncheckedCreateWithoutCredentialInput> | SiemRuleCreateWithoutCredentialInput[] | SiemRuleUncheckedCreateWithoutCredentialInput[]
    connectOrCreate?: SiemRuleCreateOrConnectWithoutCredentialInput | SiemRuleCreateOrConnectWithoutCredentialInput[]
    createMany?: SiemRuleCreateManyCredentialInputEnvelope
    connect?: SiemRuleWhereUniqueInput | SiemRuleWhereUniqueInput[]
  }

  export type SiemEventCreateNestedManyWithoutCredentialInput = {
    create?: XOR<SiemEventCreateWithoutCredentialInput, SiemEventUncheckedCreateWithoutCredentialInput> | SiemEventCreateWithoutCredentialInput[] | SiemEventUncheckedCreateWithoutCredentialInput[]
    connectOrCreate?: SiemEventCreateOrConnectWithoutCredentialInput | SiemEventCreateOrConnectWithoutCredentialInput[]
    createMany?: SiemEventCreateManyCredentialInputEnvelope
    connect?: SiemEventWhereUniqueInput | SiemEventWhereUniqueInput[]
  }

  export type AlertUncheckedCreateNestedManyWithoutCredentialInput = {
    create?: XOR<AlertCreateWithoutCredentialInput, AlertUncheckedCreateWithoutCredentialInput> | AlertCreateWithoutCredentialInput[] | AlertUncheckedCreateWithoutCredentialInput[]
    connectOrCreate?: AlertCreateOrConnectWithoutCredentialInput | AlertCreateOrConnectWithoutCredentialInput[]
    createMany?: AlertCreateManyCredentialInputEnvelope
    connect?: AlertWhereUniqueInput | AlertWhereUniqueInput[]
  }

  export type SiemRuleUncheckedCreateNestedManyWithoutCredentialInput = {
    create?: XOR<SiemRuleCreateWithoutCredentialInput, SiemRuleUncheckedCreateWithoutCredentialInput> | SiemRuleCreateWithoutCredentialInput[] | SiemRuleUncheckedCreateWithoutCredentialInput[]
    connectOrCreate?: SiemRuleCreateOrConnectWithoutCredentialInput | SiemRuleCreateOrConnectWithoutCredentialInput[]
    createMany?: SiemRuleCreateManyCredentialInputEnvelope
    connect?: SiemRuleWhereUniqueInput | SiemRuleWhereUniqueInput[]
  }

  export type SiemEventUncheckedCreateNestedManyWithoutCredentialInput = {
    create?: XOR<SiemEventCreateWithoutCredentialInput, SiemEventUncheckedCreateWithoutCredentialInput> | SiemEventCreateWithoutCredentialInput[] | SiemEventUncheckedCreateWithoutCredentialInput[]
    connectOrCreate?: SiemEventCreateOrConnectWithoutCredentialInput | SiemEventCreateOrConnectWithoutCredentialInput[]
    createMany?: SiemEventCreateManyCredentialInputEnvelope
    connect?: SiemEventWhereUniqueInput | SiemEventWhereUniqueInput[]
  }

  export type UserUpdateOneRequiredWithoutAwsCredentialsNestedInput = {
    create?: XOR<UserCreateWithoutAwsCredentialsInput, UserUncheckedCreateWithoutAwsCredentialsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAwsCredentialsInput
    upsert?: UserUpsertWithoutAwsCredentialsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAwsCredentialsInput, UserUpdateWithoutAwsCredentialsInput>, UserUncheckedUpdateWithoutAwsCredentialsInput>
  }

  export type AlertUpdateManyWithoutCredentialNestedInput = {
    create?: XOR<AlertCreateWithoutCredentialInput, AlertUncheckedCreateWithoutCredentialInput> | AlertCreateWithoutCredentialInput[] | AlertUncheckedCreateWithoutCredentialInput[]
    connectOrCreate?: AlertCreateOrConnectWithoutCredentialInput | AlertCreateOrConnectWithoutCredentialInput[]
    upsert?: AlertUpsertWithWhereUniqueWithoutCredentialInput | AlertUpsertWithWhereUniqueWithoutCredentialInput[]
    createMany?: AlertCreateManyCredentialInputEnvelope
    set?: AlertWhereUniqueInput | AlertWhereUniqueInput[]
    disconnect?: AlertWhereUniqueInput | AlertWhereUniqueInput[]
    delete?: AlertWhereUniqueInput | AlertWhereUniqueInput[]
    connect?: AlertWhereUniqueInput | AlertWhereUniqueInput[]
    update?: AlertUpdateWithWhereUniqueWithoutCredentialInput | AlertUpdateWithWhereUniqueWithoutCredentialInput[]
    updateMany?: AlertUpdateManyWithWhereWithoutCredentialInput | AlertUpdateManyWithWhereWithoutCredentialInput[]
    deleteMany?: AlertScalarWhereInput | AlertScalarWhereInput[]
  }

  export type SiemRuleUpdateManyWithoutCredentialNestedInput = {
    create?: XOR<SiemRuleCreateWithoutCredentialInput, SiemRuleUncheckedCreateWithoutCredentialInput> | SiemRuleCreateWithoutCredentialInput[] | SiemRuleUncheckedCreateWithoutCredentialInput[]
    connectOrCreate?: SiemRuleCreateOrConnectWithoutCredentialInput | SiemRuleCreateOrConnectWithoutCredentialInput[]
    upsert?: SiemRuleUpsertWithWhereUniqueWithoutCredentialInput | SiemRuleUpsertWithWhereUniqueWithoutCredentialInput[]
    createMany?: SiemRuleCreateManyCredentialInputEnvelope
    set?: SiemRuleWhereUniqueInput | SiemRuleWhereUniqueInput[]
    disconnect?: SiemRuleWhereUniqueInput | SiemRuleWhereUniqueInput[]
    delete?: SiemRuleWhereUniqueInput | SiemRuleWhereUniqueInput[]
    connect?: SiemRuleWhereUniqueInput | SiemRuleWhereUniqueInput[]
    update?: SiemRuleUpdateWithWhereUniqueWithoutCredentialInput | SiemRuleUpdateWithWhereUniqueWithoutCredentialInput[]
    updateMany?: SiemRuleUpdateManyWithWhereWithoutCredentialInput | SiemRuleUpdateManyWithWhereWithoutCredentialInput[]
    deleteMany?: SiemRuleScalarWhereInput | SiemRuleScalarWhereInput[]
  }

  export type SiemEventUpdateManyWithoutCredentialNestedInput = {
    create?: XOR<SiemEventCreateWithoutCredentialInput, SiemEventUncheckedCreateWithoutCredentialInput> | SiemEventCreateWithoutCredentialInput[] | SiemEventUncheckedCreateWithoutCredentialInput[]
    connectOrCreate?: SiemEventCreateOrConnectWithoutCredentialInput | SiemEventCreateOrConnectWithoutCredentialInput[]
    upsert?: SiemEventUpsertWithWhereUniqueWithoutCredentialInput | SiemEventUpsertWithWhereUniqueWithoutCredentialInput[]
    createMany?: SiemEventCreateManyCredentialInputEnvelope
    set?: SiemEventWhereUniqueInput | SiemEventWhereUniqueInput[]
    disconnect?: SiemEventWhereUniqueInput | SiemEventWhereUniqueInput[]
    delete?: SiemEventWhereUniqueInput | SiemEventWhereUniqueInput[]
    connect?: SiemEventWhereUniqueInput | SiemEventWhereUniqueInput[]
    update?: SiemEventUpdateWithWhereUniqueWithoutCredentialInput | SiemEventUpdateWithWhereUniqueWithoutCredentialInput[]
    updateMany?: SiemEventUpdateManyWithWhereWithoutCredentialInput | SiemEventUpdateManyWithWhereWithoutCredentialInput[]
    deleteMany?: SiemEventScalarWhereInput | SiemEventScalarWhereInput[]
  }

  export type AlertUncheckedUpdateManyWithoutCredentialNestedInput = {
    create?: XOR<AlertCreateWithoutCredentialInput, AlertUncheckedCreateWithoutCredentialInput> | AlertCreateWithoutCredentialInput[] | AlertUncheckedCreateWithoutCredentialInput[]
    connectOrCreate?: AlertCreateOrConnectWithoutCredentialInput | AlertCreateOrConnectWithoutCredentialInput[]
    upsert?: AlertUpsertWithWhereUniqueWithoutCredentialInput | AlertUpsertWithWhereUniqueWithoutCredentialInput[]
    createMany?: AlertCreateManyCredentialInputEnvelope
    set?: AlertWhereUniqueInput | AlertWhereUniqueInput[]
    disconnect?: AlertWhereUniqueInput | AlertWhereUniqueInput[]
    delete?: AlertWhereUniqueInput | AlertWhereUniqueInput[]
    connect?: AlertWhereUniqueInput | AlertWhereUniqueInput[]
    update?: AlertUpdateWithWhereUniqueWithoutCredentialInput | AlertUpdateWithWhereUniqueWithoutCredentialInput[]
    updateMany?: AlertUpdateManyWithWhereWithoutCredentialInput | AlertUpdateManyWithWhereWithoutCredentialInput[]
    deleteMany?: AlertScalarWhereInput | AlertScalarWhereInput[]
  }

  export type SiemRuleUncheckedUpdateManyWithoutCredentialNestedInput = {
    create?: XOR<SiemRuleCreateWithoutCredentialInput, SiemRuleUncheckedCreateWithoutCredentialInput> | SiemRuleCreateWithoutCredentialInput[] | SiemRuleUncheckedCreateWithoutCredentialInput[]
    connectOrCreate?: SiemRuleCreateOrConnectWithoutCredentialInput | SiemRuleCreateOrConnectWithoutCredentialInput[]
    upsert?: SiemRuleUpsertWithWhereUniqueWithoutCredentialInput | SiemRuleUpsertWithWhereUniqueWithoutCredentialInput[]
    createMany?: SiemRuleCreateManyCredentialInputEnvelope
    set?: SiemRuleWhereUniqueInput | SiemRuleWhereUniqueInput[]
    disconnect?: SiemRuleWhereUniqueInput | SiemRuleWhereUniqueInput[]
    delete?: SiemRuleWhereUniqueInput | SiemRuleWhereUniqueInput[]
    connect?: SiemRuleWhereUniqueInput | SiemRuleWhereUniqueInput[]
    update?: SiemRuleUpdateWithWhereUniqueWithoutCredentialInput | SiemRuleUpdateWithWhereUniqueWithoutCredentialInput[]
    updateMany?: SiemRuleUpdateManyWithWhereWithoutCredentialInput | SiemRuleUpdateManyWithWhereWithoutCredentialInput[]
    deleteMany?: SiemRuleScalarWhereInput | SiemRuleScalarWhereInput[]
  }

  export type SiemEventUncheckedUpdateManyWithoutCredentialNestedInput = {
    create?: XOR<SiemEventCreateWithoutCredentialInput, SiemEventUncheckedCreateWithoutCredentialInput> | SiemEventCreateWithoutCredentialInput[] | SiemEventUncheckedCreateWithoutCredentialInput[]
    connectOrCreate?: SiemEventCreateOrConnectWithoutCredentialInput | SiemEventCreateOrConnectWithoutCredentialInput[]
    upsert?: SiemEventUpsertWithWhereUniqueWithoutCredentialInput | SiemEventUpsertWithWhereUniqueWithoutCredentialInput[]
    createMany?: SiemEventCreateManyCredentialInputEnvelope
    set?: SiemEventWhereUniqueInput | SiemEventWhereUniqueInput[]
    disconnect?: SiemEventWhereUniqueInput | SiemEventWhereUniqueInput[]
    delete?: SiemEventWhereUniqueInput | SiemEventWhereUniqueInput[]
    connect?: SiemEventWhereUniqueInput | SiemEventWhereUniqueInput[]
    update?: SiemEventUpdateWithWhereUniqueWithoutCredentialInput | SiemEventUpdateWithWhereUniqueWithoutCredentialInput[]
    updateMany?: SiemEventUpdateManyWithWhereWithoutCredentialInput | SiemEventUpdateManyWithWhereWithoutCredentialInput[]
    deleteMany?: SiemEventScalarWhereInput | SiemEventScalarWhereInput[]
  }

  export type AwsCredentialCreateNestedOneWithoutAlertsInput = {
    create?: XOR<AwsCredentialCreateWithoutAlertsInput, AwsCredentialUncheckedCreateWithoutAlertsInput>
    connectOrCreate?: AwsCredentialCreateOrConnectWithoutAlertsInput
    connect?: AwsCredentialWhereUniqueInput
  }

  export type AwsCredentialUpdateOneWithoutAlertsNestedInput = {
    create?: XOR<AwsCredentialCreateWithoutAlertsInput, AwsCredentialUncheckedCreateWithoutAlertsInput>
    connectOrCreate?: AwsCredentialCreateOrConnectWithoutAlertsInput
    upsert?: AwsCredentialUpsertWithoutAlertsInput
    disconnect?: AwsCredentialWhereInput | boolean
    delete?: AwsCredentialWhereInput | boolean
    connect?: AwsCredentialWhereUniqueInput
    update?: XOR<XOR<AwsCredentialUpdateToOneWithWhereWithoutAlertsInput, AwsCredentialUpdateWithoutAlertsInput>, AwsCredentialUncheckedUpdateWithoutAlertsInput>
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type AwsCredentialCreateNestedOneWithoutSiemRulesInput = {
    create?: XOR<AwsCredentialCreateWithoutSiemRulesInput, AwsCredentialUncheckedCreateWithoutSiemRulesInput>
    connectOrCreate?: AwsCredentialCreateOrConnectWithoutSiemRulesInput
    connect?: AwsCredentialWhereUniqueInput
  }

  export type SiemEventCreateNestedManyWithoutRuleInput = {
    create?: XOR<SiemEventCreateWithoutRuleInput, SiemEventUncheckedCreateWithoutRuleInput> | SiemEventCreateWithoutRuleInput[] | SiemEventUncheckedCreateWithoutRuleInput[]
    connectOrCreate?: SiemEventCreateOrConnectWithoutRuleInput | SiemEventCreateOrConnectWithoutRuleInput[]
    createMany?: SiemEventCreateManyRuleInputEnvelope
    connect?: SiemEventWhereUniqueInput | SiemEventWhereUniqueInput[]
  }

  export type SiemEventUncheckedCreateNestedManyWithoutRuleInput = {
    create?: XOR<SiemEventCreateWithoutRuleInput, SiemEventUncheckedCreateWithoutRuleInput> | SiemEventCreateWithoutRuleInput[] | SiemEventUncheckedCreateWithoutRuleInput[]
    connectOrCreate?: SiemEventCreateOrConnectWithoutRuleInput | SiemEventCreateOrConnectWithoutRuleInput[]
    createMany?: SiemEventCreateManyRuleInputEnvelope
    connect?: SiemEventWhereUniqueInput | SiemEventWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type AwsCredentialUpdateOneRequiredWithoutSiemRulesNestedInput = {
    create?: XOR<AwsCredentialCreateWithoutSiemRulesInput, AwsCredentialUncheckedCreateWithoutSiemRulesInput>
    connectOrCreate?: AwsCredentialCreateOrConnectWithoutSiemRulesInput
    upsert?: AwsCredentialUpsertWithoutSiemRulesInput
    connect?: AwsCredentialWhereUniqueInput
    update?: XOR<XOR<AwsCredentialUpdateToOneWithWhereWithoutSiemRulesInput, AwsCredentialUpdateWithoutSiemRulesInput>, AwsCredentialUncheckedUpdateWithoutSiemRulesInput>
  }

  export type SiemEventUpdateManyWithoutRuleNestedInput = {
    create?: XOR<SiemEventCreateWithoutRuleInput, SiemEventUncheckedCreateWithoutRuleInput> | SiemEventCreateWithoutRuleInput[] | SiemEventUncheckedCreateWithoutRuleInput[]
    connectOrCreate?: SiemEventCreateOrConnectWithoutRuleInput | SiemEventCreateOrConnectWithoutRuleInput[]
    upsert?: SiemEventUpsertWithWhereUniqueWithoutRuleInput | SiemEventUpsertWithWhereUniqueWithoutRuleInput[]
    createMany?: SiemEventCreateManyRuleInputEnvelope
    set?: SiemEventWhereUniqueInput | SiemEventWhereUniqueInput[]
    disconnect?: SiemEventWhereUniqueInput | SiemEventWhereUniqueInput[]
    delete?: SiemEventWhereUniqueInput | SiemEventWhereUniqueInput[]
    connect?: SiemEventWhereUniqueInput | SiemEventWhereUniqueInput[]
    update?: SiemEventUpdateWithWhereUniqueWithoutRuleInput | SiemEventUpdateWithWhereUniqueWithoutRuleInput[]
    updateMany?: SiemEventUpdateManyWithWhereWithoutRuleInput | SiemEventUpdateManyWithWhereWithoutRuleInput[]
    deleteMany?: SiemEventScalarWhereInput | SiemEventScalarWhereInput[]
  }

  export type SiemEventUncheckedUpdateManyWithoutRuleNestedInput = {
    create?: XOR<SiemEventCreateWithoutRuleInput, SiemEventUncheckedCreateWithoutRuleInput> | SiemEventCreateWithoutRuleInput[] | SiemEventUncheckedCreateWithoutRuleInput[]
    connectOrCreate?: SiemEventCreateOrConnectWithoutRuleInput | SiemEventCreateOrConnectWithoutRuleInput[]
    upsert?: SiemEventUpsertWithWhereUniqueWithoutRuleInput | SiemEventUpsertWithWhereUniqueWithoutRuleInput[]
    createMany?: SiemEventCreateManyRuleInputEnvelope
    set?: SiemEventWhereUniqueInput | SiemEventWhereUniqueInput[]
    disconnect?: SiemEventWhereUniqueInput | SiemEventWhereUniqueInput[]
    delete?: SiemEventWhereUniqueInput | SiemEventWhereUniqueInput[]
    connect?: SiemEventWhereUniqueInput | SiemEventWhereUniqueInput[]
    update?: SiemEventUpdateWithWhereUniqueWithoutRuleInput | SiemEventUpdateWithWhereUniqueWithoutRuleInput[]
    updateMany?: SiemEventUpdateManyWithWhereWithoutRuleInput | SiemEventUpdateManyWithWhereWithoutRuleInput[]
    deleteMany?: SiemEventScalarWhereInput | SiemEventScalarWhereInput[]
  }

  export type AwsCredentialCreateNestedOneWithoutSiemEventsInput = {
    create?: XOR<AwsCredentialCreateWithoutSiemEventsInput, AwsCredentialUncheckedCreateWithoutSiemEventsInput>
    connectOrCreate?: AwsCredentialCreateOrConnectWithoutSiemEventsInput
    connect?: AwsCredentialWhereUniqueInput
  }

  export type SiemRuleCreateNestedOneWithoutEventsInput = {
    create?: XOR<SiemRuleCreateWithoutEventsInput, SiemRuleUncheckedCreateWithoutEventsInput>
    connectOrCreate?: SiemRuleCreateOrConnectWithoutEventsInput
    connect?: SiemRuleWhereUniqueInput
  }

  export type AwsCredentialUpdateOneRequiredWithoutSiemEventsNestedInput = {
    create?: XOR<AwsCredentialCreateWithoutSiemEventsInput, AwsCredentialUncheckedCreateWithoutSiemEventsInput>
    connectOrCreate?: AwsCredentialCreateOrConnectWithoutSiemEventsInput
    upsert?: AwsCredentialUpsertWithoutSiemEventsInput
    connect?: AwsCredentialWhereUniqueInput
    update?: XOR<XOR<AwsCredentialUpdateToOneWithWhereWithoutSiemEventsInput, AwsCredentialUpdateWithoutSiemEventsInput>, AwsCredentialUncheckedUpdateWithoutSiemEventsInput>
  }

  export type SiemRuleUpdateOneWithoutEventsNestedInput = {
    create?: XOR<SiemRuleCreateWithoutEventsInput, SiemRuleUncheckedCreateWithoutEventsInput>
    connectOrCreate?: SiemRuleCreateOrConnectWithoutEventsInput
    upsert?: SiemRuleUpsertWithoutEventsInput
    disconnect?: SiemRuleWhereInput | boolean
    delete?: SiemRuleWhereInput | boolean
    connect?: SiemRuleWhereUniqueInput
    update?: XOR<XOR<SiemRuleUpdateToOneWithWhereWithoutEventsInput, SiemRuleUpdateWithoutEventsInput>, SiemRuleUncheckedUpdateWithoutEventsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
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

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
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
    in?: string[] | null
    notIn?: string[] | null
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

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
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
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type AwsCredentialCreateWithoutUserInput = {
    id?: string
    name: string
    accessKeyId: string
    secretKey: string
    region: string
    createdAt?: Date | string
    updatedAt?: Date | string
    alerts?: AlertCreateNestedManyWithoutCredentialInput
    siemRules?: SiemRuleCreateNestedManyWithoutCredentialInput
    siemEvents?: SiemEventCreateNestedManyWithoutCredentialInput
  }

  export type AwsCredentialUncheckedCreateWithoutUserInput = {
    id?: string
    name: string
    accessKeyId: string
    secretKey: string
    region: string
    createdAt?: Date | string
    updatedAt?: Date | string
    alerts?: AlertUncheckedCreateNestedManyWithoutCredentialInput
    siemRules?: SiemRuleUncheckedCreateNestedManyWithoutCredentialInput
    siemEvents?: SiemEventUncheckedCreateNestedManyWithoutCredentialInput
  }

  export type AwsCredentialCreateOrConnectWithoutUserInput = {
    where: AwsCredentialWhereUniqueInput
    create: XOR<AwsCredentialCreateWithoutUserInput, AwsCredentialUncheckedCreateWithoutUserInput>
  }

  export type AwsCredentialCreateManyUserInputEnvelope = {
    data: AwsCredentialCreateManyUserInput | AwsCredentialCreateManyUserInput[]
  }

  export type AwsCredentialUpsertWithWhereUniqueWithoutUserInput = {
    where: AwsCredentialWhereUniqueInput
    update: XOR<AwsCredentialUpdateWithoutUserInput, AwsCredentialUncheckedUpdateWithoutUserInput>
    create: XOR<AwsCredentialCreateWithoutUserInput, AwsCredentialUncheckedCreateWithoutUserInput>
  }

  export type AwsCredentialUpdateWithWhereUniqueWithoutUserInput = {
    where: AwsCredentialWhereUniqueInput
    data: XOR<AwsCredentialUpdateWithoutUserInput, AwsCredentialUncheckedUpdateWithoutUserInput>
  }

  export type AwsCredentialUpdateManyWithWhereWithoutUserInput = {
    where: AwsCredentialScalarWhereInput
    data: XOR<AwsCredentialUpdateManyMutationInput, AwsCredentialUncheckedUpdateManyWithoutUserInput>
  }

  export type AwsCredentialScalarWhereInput = {
    AND?: AwsCredentialScalarWhereInput | AwsCredentialScalarWhereInput[]
    OR?: AwsCredentialScalarWhereInput[]
    NOT?: AwsCredentialScalarWhereInput | AwsCredentialScalarWhereInput[]
    id?: StringFilter<"AwsCredential"> | string
    name?: StringFilter<"AwsCredential"> | string
    accessKeyId?: StringFilter<"AwsCredential"> | string
    secretKey?: StringFilter<"AwsCredential"> | string
    region?: StringFilter<"AwsCredential"> | string
    createdAt?: DateTimeFilter<"AwsCredential"> | Date | string
    updatedAt?: DateTimeFilter<"AwsCredential"> | Date | string
    userId?: StringFilter<"AwsCredential"> | string
  }

  export type UserCreateWithoutAwsCredentialsInput = {
    id?: string
    name: string
    email: string
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUncheckedCreateWithoutAwsCredentialsInput = {
    id?: string
    name: string
    email: string
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserCreateOrConnectWithoutAwsCredentialsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAwsCredentialsInput, UserUncheckedCreateWithoutAwsCredentialsInput>
  }

  export type AlertCreateWithoutCredentialInput = {
    id?: string
    title: string
    description: string
    resourceId: string
    resourceType: string
    severity: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AlertUncheckedCreateWithoutCredentialInput = {
    id?: string
    title: string
    description: string
    resourceId: string
    resourceType: string
    severity: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AlertCreateOrConnectWithoutCredentialInput = {
    where: AlertWhereUniqueInput
    create: XOR<AlertCreateWithoutCredentialInput, AlertUncheckedCreateWithoutCredentialInput>
  }

  export type AlertCreateManyCredentialInputEnvelope = {
    data: AlertCreateManyCredentialInput | AlertCreateManyCredentialInput[]
  }

  export type SiemRuleCreateWithoutCredentialInput = {
    id?: string
    name: string
    description: string
    type: string
    query: string
    severity: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    triggers?: number
    lastTriggered?: Date | string | null
    events?: SiemEventCreateNestedManyWithoutRuleInput
  }

  export type SiemRuleUncheckedCreateWithoutCredentialInput = {
    id?: string
    name: string
    description: string
    type: string
    query: string
    severity: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    triggers?: number
    lastTriggered?: Date | string | null
    events?: SiemEventUncheckedCreateNestedManyWithoutRuleInput
  }

  export type SiemRuleCreateOrConnectWithoutCredentialInput = {
    where: SiemRuleWhereUniqueInput
    create: XOR<SiemRuleCreateWithoutCredentialInput, SiemRuleUncheckedCreateWithoutCredentialInput>
  }

  export type SiemRuleCreateManyCredentialInputEnvelope = {
    data: SiemRuleCreateManyCredentialInput | SiemRuleCreateManyCredentialInput[]
  }

  export type SiemEventCreateWithoutCredentialInput = {
    id?: string
    timestamp: Date | string
    source: string
    eventType: string
    severity: string
    status?: string
    message: string
    rawData: string
    accountId?: string | null
    region?: string | null
    resource?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    rule?: SiemRuleCreateNestedOneWithoutEventsInput
  }

  export type SiemEventUncheckedCreateWithoutCredentialInput = {
    id?: string
    timestamp: Date | string
    source: string
    eventType: string
    severity: string
    status?: string
    message: string
    rawData: string
    accountId?: string | null
    region?: string | null
    resource?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    ruleId?: string | null
  }

  export type SiemEventCreateOrConnectWithoutCredentialInput = {
    where: SiemEventWhereUniqueInput
    create: XOR<SiemEventCreateWithoutCredentialInput, SiemEventUncheckedCreateWithoutCredentialInput>
  }

  export type SiemEventCreateManyCredentialInputEnvelope = {
    data: SiemEventCreateManyCredentialInput | SiemEventCreateManyCredentialInput[]
  }

  export type UserUpsertWithoutAwsCredentialsInput = {
    update: XOR<UserUpdateWithoutAwsCredentialsInput, UserUncheckedUpdateWithoutAwsCredentialsInput>
    create: XOR<UserCreateWithoutAwsCredentialsInput, UserUncheckedCreateWithoutAwsCredentialsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAwsCredentialsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAwsCredentialsInput, UserUncheckedUpdateWithoutAwsCredentialsInput>
  }

  export type UserUpdateWithoutAwsCredentialsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateWithoutAwsCredentialsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AlertUpsertWithWhereUniqueWithoutCredentialInput = {
    where: AlertWhereUniqueInput
    update: XOR<AlertUpdateWithoutCredentialInput, AlertUncheckedUpdateWithoutCredentialInput>
    create: XOR<AlertCreateWithoutCredentialInput, AlertUncheckedCreateWithoutCredentialInput>
  }

  export type AlertUpdateWithWhereUniqueWithoutCredentialInput = {
    where: AlertWhereUniqueInput
    data: XOR<AlertUpdateWithoutCredentialInput, AlertUncheckedUpdateWithoutCredentialInput>
  }

  export type AlertUpdateManyWithWhereWithoutCredentialInput = {
    where: AlertScalarWhereInput
    data: XOR<AlertUpdateManyMutationInput, AlertUncheckedUpdateManyWithoutCredentialInput>
  }

  export type AlertScalarWhereInput = {
    AND?: AlertScalarWhereInput | AlertScalarWhereInput[]
    OR?: AlertScalarWhereInput[]
    NOT?: AlertScalarWhereInput | AlertScalarWhereInput[]
    id?: StringFilter<"Alert"> | string
    title?: StringFilter<"Alert"> | string
    description?: StringFilter<"Alert"> | string
    resourceId?: StringFilter<"Alert"> | string
    resourceType?: StringFilter<"Alert"> | string
    severity?: StringFilter<"Alert"> | string
    status?: StringFilter<"Alert"> | string
    createdAt?: DateTimeFilter<"Alert"> | Date | string
    updatedAt?: DateTimeFilter<"Alert"> | Date | string
    credentialId?: StringNullableFilter<"Alert"> | string | null
  }

  export type SiemRuleUpsertWithWhereUniqueWithoutCredentialInput = {
    where: SiemRuleWhereUniqueInput
    update: XOR<SiemRuleUpdateWithoutCredentialInput, SiemRuleUncheckedUpdateWithoutCredentialInput>
    create: XOR<SiemRuleCreateWithoutCredentialInput, SiemRuleUncheckedCreateWithoutCredentialInput>
  }

  export type SiemRuleUpdateWithWhereUniqueWithoutCredentialInput = {
    where: SiemRuleWhereUniqueInput
    data: XOR<SiemRuleUpdateWithoutCredentialInput, SiemRuleUncheckedUpdateWithoutCredentialInput>
  }

  export type SiemRuleUpdateManyWithWhereWithoutCredentialInput = {
    where: SiemRuleScalarWhereInput
    data: XOR<SiemRuleUpdateManyMutationInput, SiemRuleUncheckedUpdateManyWithoutCredentialInput>
  }

  export type SiemRuleScalarWhereInput = {
    AND?: SiemRuleScalarWhereInput | SiemRuleScalarWhereInput[]
    OR?: SiemRuleScalarWhereInput[]
    NOT?: SiemRuleScalarWhereInput | SiemRuleScalarWhereInput[]
    id?: StringFilter<"SiemRule"> | string
    name?: StringFilter<"SiemRule"> | string
    description?: StringFilter<"SiemRule"> | string
    type?: StringFilter<"SiemRule"> | string
    query?: StringFilter<"SiemRule"> | string
    severity?: StringFilter<"SiemRule"> | string
    status?: StringFilter<"SiemRule"> | string
    createdAt?: DateTimeFilter<"SiemRule"> | Date | string
    updatedAt?: DateTimeFilter<"SiemRule"> | Date | string
    triggers?: IntFilter<"SiemRule"> | number
    lastTriggered?: DateTimeNullableFilter<"SiemRule"> | Date | string | null
    credentialId?: StringFilter<"SiemRule"> | string
  }

  export type SiemEventUpsertWithWhereUniqueWithoutCredentialInput = {
    where: SiemEventWhereUniqueInput
    update: XOR<SiemEventUpdateWithoutCredentialInput, SiemEventUncheckedUpdateWithoutCredentialInput>
    create: XOR<SiemEventCreateWithoutCredentialInput, SiemEventUncheckedCreateWithoutCredentialInput>
  }

  export type SiemEventUpdateWithWhereUniqueWithoutCredentialInput = {
    where: SiemEventWhereUniqueInput
    data: XOR<SiemEventUpdateWithoutCredentialInput, SiemEventUncheckedUpdateWithoutCredentialInput>
  }

  export type SiemEventUpdateManyWithWhereWithoutCredentialInput = {
    where: SiemEventScalarWhereInput
    data: XOR<SiemEventUpdateManyMutationInput, SiemEventUncheckedUpdateManyWithoutCredentialInput>
  }

  export type SiemEventScalarWhereInput = {
    AND?: SiemEventScalarWhereInput | SiemEventScalarWhereInput[]
    OR?: SiemEventScalarWhereInput[]
    NOT?: SiemEventScalarWhereInput | SiemEventScalarWhereInput[]
    id?: StringFilter<"SiemEvent"> | string
    timestamp?: DateTimeFilter<"SiemEvent"> | Date | string
    source?: StringFilter<"SiemEvent"> | string
    eventType?: StringFilter<"SiemEvent"> | string
    severity?: StringFilter<"SiemEvent"> | string
    status?: StringFilter<"SiemEvent"> | string
    message?: StringFilter<"SiemEvent"> | string
    rawData?: StringFilter<"SiemEvent"> | string
    accountId?: StringNullableFilter<"SiemEvent"> | string | null
    region?: StringNullableFilter<"SiemEvent"> | string | null
    resource?: StringNullableFilter<"SiemEvent"> | string | null
    createdAt?: DateTimeFilter<"SiemEvent"> | Date | string
    updatedAt?: DateTimeFilter<"SiemEvent"> | Date | string
    credentialId?: StringFilter<"SiemEvent"> | string
    ruleId?: StringNullableFilter<"SiemEvent"> | string | null
  }

  export type AwsCredentialCreateWithoutAlertsInput = {
    id?: string
    name: string
    accessKeyId: string
    secretKey: string
    region: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutAwsCredentialsInput
    siemRules?: SiemRuleCreateNestedManyWithoutCredentialInput
    siemEvents?: SiemEventCreateNestedManyWithoutCredentialInput
  }

  export type AwsCredentialUncheckedCreateWithoutAlertsInput = {
    id?: string
    name: string
    accessKeyId: string
    secretKey: string
    region: string
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    siemRules?: SiemRuleUncheckedCreateNestedManyWithoutCredentialInput
    siemEvents?: SiemEventUncheckedCreateNestedManyWithoutCredentialInput
  }

  export type AwsCredentialCreateOrConnectWithoutAlertsInput = {
    where: AwsCredentialWhereUniqueInput
    create: XOR<AwsCredentialCreateWithoutAlertsInput, AwsCredentialUncheckedCreateWithoutAlertsInput>
  }

  export type AwsCredentialUpsertWithoutAlertsInput = {
    update: XOR<AwsCredentialUpdateWithoutAlertsInput, AwsCredentialUncheckedUpdateWithoutAlertsInput>
    create: XOR<AwsCredentialCreateWithoutAlertsInput, AwsCredentialUncheckedCreateWithoutAlertsInput>
    where?: AwsCredentialWhereInput
  }

  export type AwsCredentialUpdateToOneWithWhereWithoutAlertsInput = {
    where?: AwsCredentialWhereInput
    data: XOR<AwsCredentialUpdateWithoutAlertsInput, AwsCredentialUncheckedUpdateWithoutAlertsInput>
  }

  export type AwsCredentialUpdateWithoutAlertsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    accessKeyId?: StringFieldUpdateOperationsInput | string
    secretKey?: StringFieldUpdateOperationsInput | string
    region?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutAwsCredentialsNestedInput
    siemRules?: SiemRuleUpdateManyWithoutCredentialNestedInput
    siemEvents?: SiemEventUpdateManyWithoutCredentialNestedInput
  }

  export type AwsCredentialUncheckedUpdateWithoutAlertsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    accessKeyId?: StringFieldUpdateOperationsInput | string
    secretKey?: StringFieldUpdateOperationsInput | string
    region?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    siemRules?: SiemRuleUncheckedUpdateManyWithoutCredentialNestedInput
    siemEvents?: SiemEventUncheckedUpdateManyWithoutCredentialNestedInput
  }

  export type AwsCredentialCreateWithoutSiemRulesInput = {
    id?: string
    name: string
    accessKeyId: string
    secretKey: string
    region: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutAwsCredentialsInput
    alerts?: AlertCreateNestedManyWithoutCredentialInput
    siemEvents?: SiemEventCreateNestedManyWithoutCredentialInput
  }

  export type AwsCredentialUncheckedCreateWithoutSiemRulesInput = {
    id?: string
    name: string
    accessKeyId: string
    secretKey: string
    region: string
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    alerts?: AlertUncheckedCreateNestedManyWithoutCredentialInput
    siemEvents?: SiemEventUncheckedCreateNestedManyWithoutCredentialInput
  }

  export type AwsCredentialCreateOrConnectWithoutSiemRulesInput = {
    where: AwsCredentialWhereUniqueInput
    create: XOR<AwsCredentialCreateWithoutSiemRulesInput, AwsCredentialUncheckedCreateWithoutSiemRulesInput>
  }

  export type SiemEventCreateWithoutRuleInput = {
    id?: string
    timestamp: Date | string
    source: string
    eventType: string
    severity: string
    status?: string
    message: string
    rawData: string
    accountId?: string | null
    region?: string | null
    resource?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    credential: AwsCredentialCreateNestedOneWithoutSiemEventsInput
  }

  export type SiemEventUncheckedCreateWithoutRuleInput = {
    id?: string
    timestamp: Date | string
    source: string
    eventType: string
    severity: string
    status?: string
    message: string
    rawData: string
    accountId?: string | null
    region?: string | null
    resource?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    credentialId: string
  }

  export type SiemEventCreateOrConnectWithoutRuleInput = {
    where: SiemEventWhereUniqueInput
    create: XOR<SiemEventCreateWithoutRuleInput, SiemEventUncheckedCreateWithoutRuleInput>
  }

  export type SiemEventCreateManyRuleInputEnvelope = {
    data: SiemEventCreateManyRuleInput | SiemEventCreateManyRuleInput[]
  }

  export type AwsCredentialUpsertWithoutSiemRulesInput = {
    update: XOR<AwsCredentialUpdateWithoutSiemRulesInput, AwsCredentialUncheckedUpdateWithoutSiemRulesInput>
    create: XOR<AwsCredentialCreateWithoutSiemRulesInput, AwsCredentialUncheckedCreateWithoutSiemRulesInput>
    where?: AwsCredentialWhereInput
  }

  export type AwsCredentialUpdateToOneWithWhereWithoutSiemRulesInput = {
    where?: AwsCredentialWhereInput
    data: XOR<AwsCredentialUpdateWithoutSiemRulesInput, AwsCredentialUncheckedUpdateWithoutSiemRulesInput>
  }

  export type AwsCredentialUpdateWithoutSiemRulesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    accessKeyId?: StringFieldUpdateOperationsInput | string
    secretKey?: StringFieldUpdateOperationsInput | string
    region?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutAwsCredentialsNestedInput
    alerts?: AlertUpdateManyWithoutCredentialNestedInput
    siemEvents?: SiemEventUpdateManyWithoutCredentialNestedInput
  }

  export type AwsCredentialUncheckedUpdateWithoutSiemRulesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    accessKeyId?: StringFieldUpdateOperationsInput | string
    secretKey?: StringFieldUpdateOperationsInput | string
    region?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    alerts?: AlertUncheckedUpdateManyWithoutCredentialNestedInput
    siemEvents?: SiemEventUncheckedUpdateManyWithoutCredentialNestedInput
  }

  export type SiemEventUpsertWithWhereUniqueWithoutRuleInput = {
    where: SiemEventWhereUniqueInput
    update: XOR<SiemEventUpdateWithoutRuleInput, SiemEventUncheckedUpdateWithoutRuleInput>
    create: XOR<SiemEventCreateWithoutRuleInput, SiemEventUncheckedCreateWithoutRuleInput>
  }

  export type SiemEventUpdateWithWhereUniqueWithoutRuleInput = {
    where: SiemEventWhereUniqueInput
    data: XOR<SiemEventUpdateWithoutRuleInput, SiemEventUncheckedUpdateWithoutRuleInput>
  }

  export type SiemEventUpdateManyWithWhereWithoutRuleInput = {
    where: SiemEventScalarWhereInput
    data: XOR<SiemEventUpdateManyMutationInput, SiemEventUncheckedUpdateManyWithoutRuleInput>
  }

  export type AwsCredentialCreateWithoutSiemEventsInput = {
    id?: string
    name: string
    accessKeyId: string
    secretKey: string
    region: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutAwsCredentialsInput
    alerts?: AlertCreateNestedManyWithoutCredentialInput
    siemRules?: SiemRuleCreateNestedManyWithoutCredentialInput
  }

  export type AwsCredentialUncheckedCreateWithoutSiemEventsInput = {
    id?: string
    name: string
    accessKeyId: string
    secretKey: string
    region: string
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    alerts?: AlertUncheckedCreateNestedManyWithoutCredentialInput
    siemRules?: SiemRuleUncheckedCreateNestedManyWithoutCredentialInput
  }

  export type AwsCredentialCreateOrConnectWithoutSiemEventsInput = {
    where: AwsCredentialWhereUniqueInput
    create: XOR<AwsCredentialCreateWithoutSiemEventsInput, AwsCredentialUncheckedCreateWithoutSiemEventsInput>
  }

  export type SiemRuleCreateWithoutEventsInput = {
    id?: string
    name: string
    description: string
    type: string
    query: string
    severity: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    triggers?: number
    lastTriggered?: Date | string | null
    credential: AwsCredentialCreateNestedOneWithoutSiemRulesInput
  }

  export type SiemRuleUncheckedCreateWithoutEventsInput = {
    id?: string
    name: string
    description: string
    type: string
    query: string
    severity: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    triggers?: number
    lastTriggered?: Date | string | null
    credentialId: string
  }

  export type SiemRuleCreateOrConnectWithoutEventsInput = {
    where: SiemRuleWhereUniqueInput
    create: XOR<SiemRuleCreateWithoutEventsInput, SiemRuleUncheckedCreateWithoutEventsInput>
  }

  export type AwsCredentialUpsertWithoutSiemEventsInput = {
    update: XOR<AwsCredentialUpdateWithoutSiemEventsInput, AwsCredentialUncheckedUpdateWithoutSiemEventsInput>
    create: XOR<AwsCredentialCreateWithoutSiemEventsInput, AwsCredentialUncheckedCreateWithoutSiemEventsInput>
    where?: AwsCredentialWhereInput
  }

  export type AwsCredentialUpdateToOneWithWhereWithoutSiemEventsInput = {
    where?: AwsCredentialWhereInput
    data: XOR<AwsCredentialUpdateWithoutSiemEventsInput, AwsCredentialUncheckedUpdateWithoutSiemEventsInput>
  }

  export type AwsCredentialUpdateWithoutSiemEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    accessKeyId?: StringFieldUpdateOperationsInput | string
    secretKey?: StringFieldUpdateOperationsInput | string
    region?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutAwsCredentialsNestedInput
    alerts?: AlertUpdateManyWithoutCredentialNestedInput
    siemRules?: SiemRuleUpdateManyWithoutCredentialNestedInput
  }

  export type AwsCredentialUncheckedUpdateWithoutSiemEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    accessKeyId?: StringFieldUpdateOperationsInput | string
    secretKey?: StringFieldUpdateOperationsInput | string
    region?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    alerts?: AlertUncheckedUpdateManyWithoutCredentialNestedInput
    siemRules?: SiemRuleUncheckedUpdateManyWithoutCredentialNestedInput
  }

  export type SiemRuleUpsertWithoutEventsInput = {
    update: XOR<SiemRuleUpdateWithoutEventsInput, SiemRuleUncheckedUpdateWithoutEventsInput>
    create: XOR<SiemRuleCreateWithoutEventsInput, SiemRuleUncheckedCreateWithoutEventsInput>
    where?: SiemRuleWhereInput
  }

  export type SiemRuleUpdateToOneWithWhereWithoutEventsInput = {
    where?: SiemRuleWhereInput
    data: XOR<SiemRuleUpdateWithoutEventsInput, SiemRuleUncheckedUpdateWithoutEventsInput>
  }

  export type SiemRuleUpdateWithoutEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    query?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    triggers?: IntFieldUpdateOperationsInput | number
    lastTriggered?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    credential?: AwsCredentialUpdateOneRequiredWithoutSiemRulesNestedInput
  }

  export type SiemRuleUncheckedUpdateWithoutEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    query?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    triggers?: IntFieldUpdateOperationsInput | number
    lastTriggered?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    credentialId?: StringFieldUpdateOperationsInput | string
  }

  export type AwsCredentialCreateManyUserInput = {
    id?: string
    name: string
    accessKeyId: string
    secretKey: string
    region: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AwsCredentialUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    accessKeyId?: StringFieldUpdateOperationsInput | string
    secretKey?: StringFieldUpdateOperationsInput | string
    region?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    alerts?: AlertUpdateManyWithoutCredentialNestedInput
    siemRules?: SiemRuleUpdateManyWithoutCredentialNestedInput
    siemEvents?: SiemEventUpdateManyWithoutCredentialNestedInput
  }

  export type AwsCredentialUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    accessKeyId?: StringFieldUpdateOperationsInput | string
    secretKey?: StringFieldUpdateOperationsInput | string
    region?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    alerts?: AlertUncheckedUpdateManyWithoutCredentialNestedInput
    siemRules?: SiemRuleUncheckedUpdateManyWithoutCredentialNestedInput
    siemEvents?: SiemEventUncheckedUpdateManyWithoutCredentialNestedInput
  }

  export type AwsCredentialUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    accessKeyId?: StringFieldUpdateOperationsInput | string
    secretKey?: StringFieldUpdateOperationsInput | string
    region?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AlertCreateManyCredentialInput = {
    id?: string
    title: string
    description: string
    resourceId: string
    resourceType: string
    severity: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SiemRuleCreateManyCredentialInput = {
    id?: string
    name: string
    description: string
    type: string
    query: string
    severity: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    triggers?: number
    lastTriggered?: Date | string | null
  }

  export type SiemEventCreateManyCredentialInput = {
    id?: string
    timestamp: Date | string
    source: string
    eventType: string
    severity: string
    status?: string
    message: string
    rawData: string
    accountId?: string | null
    region?: string | null
    resource?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    ruleId?: string | null
  }

  export type AlertUpdateWithoutCredentialInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    resourceId?: StringFieldUpdateOperationsInput | string
    resourceType?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AlertUncheckedUpdateWithoutCredentialInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    resourceId?: StringFieldUpdateOperationsInput | string
    resourceType?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AlertUncheckedUpdateManyWithoutCredentialInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    resourceId?: StringFieldUpdateOperationsInput | string
    resourceType?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SiemRuleUpdateWithoutCredentialInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    query?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    triggers?: IntFieldUpdateOperationsInput | number
    lastTriggered?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    events?: SiemEventUpdateManyWithoutRuleNestedInput
  }

  export type SiemRuleUncheckedUpdateWithoutCredentialInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    query?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    triggers?: IntFieldUpdateOperationsInput | number
    lastTriggered?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    events?: SiemEventUncheckedUpdateManyWithoutRuleNestedInput
  }

  export type SiemRuleUncheckedUpdateManyWithoutCredentialInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    query?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    triggers?: IntFieldUpdateOperationsInput | number
    lastTriggered?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type SiemEventUpdateWithoutCredentialInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    source?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    rawData?: StringFieldUpdateOperationsInput | string
    accountId?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    resource?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rule?: SiemRuleUpdateOneWithoutEventsNestedInput
  }

  export type SiemEventUncheckedUpdateWithoutCredentialInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    source?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    rawData?: StringFieldUpdateOperationsInput | string
    accountId?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    resource?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ruleId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SiemEventUncheckedUpdateManyWithoutCredentialInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    source?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    rawData?: StringFieldUpdateOperationsInput | string
    accountId?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    resource?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ruleId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SiemEventCreateManyRuleInput = {
    id?: string
    timestamp: Date | string
    source: string
    eventType: string
    severity: string
    status?: string
    message: string
    rawData: string
    accountId?: string | null
    region?: string | null
    resource?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    credentialId: string
  }

  export type SiemEventUpdateWithoutRuleInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    source?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    rawData?: StringFieldUpdateOperationsInput | string
    accountId?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    resource?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    credential?: AwsCredentialUpdateOneRequiredWithoutSiemEventsNestedInput
  }

  export type SiemEventUncheckedUpdateWithoutRuleInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    source?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    rawData?: StringFieldUpdateOperationsInput | string
    accountId?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    resource?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    credentialId?: StringFieldUpdateOperationsInput | string
  }

  export type SiemEventUncheckedUpdateManyWithoutRuleInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    source?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    rawData?: StringFieldUpdateOperationsInput | string
    accountId?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    resource?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    credentialId?: StringFieldUpdateOperationsInput | string
  }



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