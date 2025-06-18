export interface Instanceable<R = any, P extends any[] = any[]> {
  new(...args: P): R;
}


export type Instance = abstract new (...args: any[]) => any;

export type InstanceableType<T> = T extends Instanceable<infer P> ? P : never;

export type InstanceableFunction<T> = T extends Instanceable<infer P, infer A> ? ((this: P, ...args: A) => void | P) : never;

export type InstanceKeys<T extends Instanceable> = Keys<InstanceableType<T>>;

export type InstanceMethodKeys<T extends Instanceable> = MethodKeys<InstanceType<T>> | PropertyKey;

export type InstanceMethodReturn<T extends Instanceable, P extends InstanceMethodKeys<T> | PropertyKey> = NoExtends<SafeReturnType<InstanceType<T>[P]>, never>;

export type InstanceMethodParameters<T extends Instanceable, P extends InstanceMethodKeys<T> | PropertyKey> = NoExtends<SafeParameters<InstanceType<T>[P]>, never>;

export type InstanceableParameters<T> = T extends Instanceable<any, infer P> ? P : never;

export type MethodParameters<T, P extends MethodKeys<T>> = SafeParameters<T[P]>;

export interface Applicable {
  apply<T, R>(this: (this: T) => R, thisArg: T): R;

  apply<T, A extends any[], R>(this: (this: T, ...args: A) => R, thisArg: T, args: A): R
}

export interface Callable {
  call<T, A extends any[], R>(this: (this: T, ...args: A) => R, thisArg: T, ...args: A): R;
}

export type Mutable<T> = {
  -readonly [P in Keys<T>]: T[P];
}

export type WithConstructor = {
  constructor: Function;
}

export interface WithClassName {
  className: string
}

/**
 * Includes the context parameter 'this' to the type T if it is a function.
 * @template T The type
 * @template This The type of the contextual 'this'. Default any.
 * @template Not The type if T is not a function. Default unknown.
 */
export type IncludeThisParameter<T, This = any, Not = unknown> = T extends (...args: any) => any ? (this: This, ...args: Parameters<T>) => ReturnType<T> : Not;

export type FunctionBound<T extends FunctionType<any, any[], any>> = (...args: any[]) => ReturnType<T>;

export type FunctionPartial<T extends FunctionType<any, any[], any>> = FunctionType<ThisParameterType<T>, any[], ReturnType<T>>;

export type FunctionType<T, A extends any[] = any[], R = void> = (this: T, ...args: A) => R;

export type AnyFunctionType = FunctionType<any, any[], any>;

export type EmptyFunctionType<T, R = void> = (this: T,) => R;

/**
 * Extract 'If' from T if it extends U.
 * @template T The type.
 * @template U The extends restriction type.
 * @template If The extract type. Default T.
 * @template Not The type if T not extends U. Default never.
 */
export type Extends<T, U, If = T, Not = never> = T extends U ? If : Not;

/**
 * Extract 'Not' from T if it extends U.
 * @template T The type.
 * @template U The extends restriction type.
 * @template If The extract type. Default T.
 * @template Not The type if T not extends U. Default never.
 */
export type NoExtends<T, U, If = never, Not = T> = T extends U ? If : Not;

/**
 * Extracts the keys of T
 */
export type Keys<T, P extends PropertyKey = PropertyKey> = Extract<keyof T, P>

/**
 * Refers to the keys values type of T.
 */
export type KeysType<T> = NonNullable<T>[Keys<T>] | T[Keys<T>]

/**
 * Constructs a type with all keys of T whose type extends U.
 * @template T The type.
 * @template U The extends restriction type.
 */
export type Only<T, U> = {
  [P in Keys<T> as Extends<T[P], U, P>]: T[P]
}

export type All<T> = {
  [P in keyof T]: T[P]
}

export type Join<T extends any[]> = T extends [infer F, ...infer R] ? F & Join<R> : unknown;

export type Split<T extends any[]> = T extends [infer F, ...infer R] ? F | Split<R> : never;

export type JoinInstanceableTypes<T> = T extends [infer F, ...infer R] ? InstanceableType<F> & JoinInstanceableTypes<R> : unknown;
export type SplitInstanceableTypes<T> = T extends [infer F, ...infer R] ? InstanceableType<F> | SplitInstanceableTypes<R> : never;


/**
 * Constructs a type with all keys of T whose type does not extend U.
 * @template T The type.
 * @template U The extends restriction type.
 */
export type OnlyExclude<T, U> = {
  [P in Keys<T> as Extends<T[P], U, never, P>]: T[P]
}

/**
 * Constructs a type with all keys of T whose type is not a function.
 */
export type OnlyProperties<T> = OnlyExclude<T, (...args: any[]) => any>

/**
 * Extracts the keys of {@link OnlyProperties}<T>
 */
export type PropertiesKeys<T> = Keys<OnlyProperties<T>>

/**
 * Constructs a type with all keys of T whose type is a function.
 */
export type OnlyMethods<T> = Only<T, (...args: any[]) => any>

/**
 * Extracts the keys of {@link OnlyMethods}<T>
 */
export type MethodKeys<T> = Keys<OnlyMethods<T>>


export type MaybeKeyType<T, K> = K extends Keys<T> ? T[K] : Maybe<any>;

export type Nullables = undefined | null;

export type Indeterminate = Nullables | void | never;

/**
 * Refers to a null or undefined type T.
 */
export type Maybe<Ty> = Ty | Nullables;

/**
 * Refers to a null or undefined type number.
 */
export type MaybeNumber = Maybe<number>;

export type MaybeBoolean = Maybe<boolean>;

export type MaybeNumberLike = Maybe<number | string>;

/**
 * Refers to a null or undefined type string.
 */
export type MaybeString = Maybe<string>;

// export type DefineMethods<T> = Partial<ThisOnlyMethods<T>> | Partial<Omit<ThisOnlyMethods<T>, "valueOf">>

/**
 * The possible typeof values.
 */
export type Typeof = "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";

export interface EntryLike<T = any> {
  value: T,
}

export interface Entry<V = any, K = PropertyKey> extends EntryLike<V> {
  key: K,
}

export type ThisTypeOf<T> = T extends (this: infer T, ...args: any) => any ? T : Nullables;
export type ParametersOf<T> = T extends (...args: infer A) => any ? (A extends [] ? never : A) : never;
export type ReturnTypeOf<T> = T extends (...args: any) => infer R ? R : unknown;

export type SafeParameters<T> = T extends (...args: any[]) => any ? Parameters<T> : never;

export type SafeReturnType<T> = T extends (...args: any[]) => any ? ReturnType<T> : never;

export type PropertyFunctionReturn<T> = T extends (...args: any[]) => any ? ReturnType<T> : T;

export type SafeThisParameterType<T> = ThisParameterType<T> extends Object ? ThisParameterType<T> : void | null;

export interface ValidateValue {
  (value: any): boolean;
}

export type Parameter<T extends (...any: any[]) => any, I extends number = 0> = Parameters<T>[I];
