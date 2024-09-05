import {NumberExtensions, NumberWithExtensions} from "./extensions/number";
import {StringExtensions, StringWithExtensions} from "./extensions/string";
import {ArrayExtensions, ArrayWithExtensions} from "./extensions/array";

export interface Constructor<R = any, P = any[]> {
  // @ts-ignore
  new(...args: P): R;
}

export type ConstructorParameters<T> = T extends Constructor<any, infer P> ? P : never;

export type ConstructorType<T> = T extends Constructor<infer P> ? P : never;

export type Mutable<T> = {
  -readonly [P in Keys<T>]: T[P];
}

export type WithConstructor = {
  constructor: Function;
}

/**
 * Includes the context parameter 'this' to the type T if it is a function.
 * @template T The type
 * @template This The type of the contextual 'this'. Default any.
 * @template Not The type if T is not a function. Default unknown.
 */
export type IncludeThisParameter<T, This = any, Not = unknown> = T extends (...args: any) => any ? (this: This, ...args: Parameters<T>) => ReturnType<T> : Not;

/**
 * Extract 'If' from T if it extends U.
 * @template T The type.
 * @template U The extends restriction type.
 * @template If The extract type. Default T.
 * @template Not The type if T not extends U. Default never.
 */
export type Extends<T, U, If = T, Not = never> = T extends U ? If : Not;

/**
 * Extracts the keys of T
 */
export type Keys<T> = Extract<keyof T, PropertyKey>

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


export type SafeParameters<T> = T extends (...args: any[]) => any ? Parameters<T> : never;

export type SafeReturnType<T> = T extends (...args: any[]) => any ? ReturnType<T> : never;

export type SafeThisParameterType<T> = ThisParameterType<T> extends Object ? ThisParameterType<T> : void | null;


declare global {
  interface Number extends NumberExtensions {
  }

  interface String extends StringExtensions {
  }

  interface Array<T> extends ArrayExtensions<T> {
  }

  interface ArrayConstructor {
    readonly prototype: ArrayWithExtensions<any>
  }

  interface StringConstructor {
    readonly prototype: StringWithExtensions
  }

  interface NumberConstructor {
    readonly prototype: NumberWithExtensions
  }
}
