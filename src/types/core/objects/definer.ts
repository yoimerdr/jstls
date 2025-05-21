import {Keys} from "@jstls/types/core";
import {KeyableObject, KeyObjectType, MaybeKeyReturnType, ThisObjectKeys} from "./index";

export interface PropertyDescriptor<T = any, K extends Keys<T> = any> {
  configurable?: boolean;

  enumerable?: boolean;

  writable?: boolean;

  value?: KeyObjectType<T, K>,

  get?(this: T): T[K];

  set?(this: T, value: T[K]): void;
}

export type PropertyDescriptors<T> = {
  [K in Keys<T>]: PropertyDescriptor<T, K>;
}

export type DefinePropertyDescriptor<T, K> = K extends Keys<T> ? PropertyDescriptor<T, K> : PropertyDescriptor<T>;

export type DefinePropertyDescriptors<T> = {
  [P in Keys<T>]?: DefinePropertyDescriptor<T, P>
} & KeyableObject<PropertyDescriptor>;

// export type DefinePropertyValues<T> =
//   (Partial<ThisObjectKeys<T>> | Partial<Omit<ThisObjectKeys<T>, "valueOf">>)
//   | Record<PropertyKey, any>;

export type DefinePropertyValues<T> =
  (Partial<ThisObjectKeys<T>> | Partial<Omit<ThisObjectKeys<T>, "valueOf">>)
  & KeyableObject;

export type DefinePropertyGetter<T, K> = (this: T) => MaybeKeyReturnType<T, K>;

export type DefinePropertyGetters<T> = {
  [K in Keys<T>]?: DefinePropertyGetter<T, K>
} | Record<PropertyKey, DefinePropertyGetter<T, any>>;
