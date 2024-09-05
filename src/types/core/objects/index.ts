import {IncludeThisParameter, Keys, MethodKeys, SafeReturnType} from "../index";

export type KeyableObject<R = any> = Record<PropertyKey, R> & Object;

export type WithLength = Record<"length", number>;

export type Indexable<R = any> = Record<number, R>;

export type WithSize = Record<"size", number>;

/**
 * Constructs a type with a prototype.
 */
export type WithPrototype<T extends Object> = {
  readonly prototype: T
}

/**
 * Refers to a type with prototype.
 *
 */
export type Prototype<T extends Object, K extends Keys<WithPrototype<T>> = "prototype"> = WithPrototype<WithPrototype<T>[K] & Object>;

/**
 * Refers to T["prototype"] type.
 */
export type PrototypeType<T extends Prototype<T>> = T["prototype"];

/**
 * Extracts the keys of T prototype.
 */
export type PrototypeKeys<T extends Prototype<T>> = Keys<PrototypeType<T>>;

/**
 * Refers to type T[K]. The context parameter this is added if it is a function.
 */
export type KeyObjectType<T, K extends Keys<T>> = IncludeThisParameter<T[K], T, T[K]>;

export type MaybeKeyObjectType<T, K> = K extends Keys<T> ? KeyObjectType<T, K> : any;

export type MaybeKeyReturnType<T, K> = K extends Keys<T> ? SafeReturnType<T[K]> : any;

export type ThisObjectKeys<T> = {
  [P in Keys<T>]: KeyObjectType<T, P>;
}

/**
 * Constructs a type with all keys of T whose type is a function, and adds the parameter 'this' to its value.
 */
export type OnlyObjectMethods<T> = {
  [P in MethodKeys<T>]: KeyObjectType<T, P>
}


declare global {
  export interface ObjectConstructor {
    keys<T>(object: T): Keys<T>[]
  }
}

export type AssignMode = "deep" | "simple";
