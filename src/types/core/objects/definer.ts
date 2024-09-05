import {Keys} from "../index";
import {KeyableObject, KeyObjectType, MaybeKeyReturnType, ThisObjectKeys} from "./index";

export interface ObjectPropertyDescriptor<T, K extends Keys<T>> extends PropertyDescriptor {
  value?: KeyObjectType<T, K>,

  get?(this: T): any;

  set?(this: T, value: any): void;
}

export type DefinePropertyDescriptor<T, K> = K extends Keys<T> ? ObjectPropertyDescriptor<T, K> : PropertyDescriptor;

export type DefinePropertyDescriptors<T> = {
  [P in Keys<T>]?: DefinePropertyDescriptor<T, P>
} & KeyableObject<PropertyDescriptor>;

// export type DefinePropertyValues<T> =
//   (Partial<ThisObjectKeys<T>> | Partial<Omit<ThisObjectKeys<T>, "valueOf">>)
//   | Record<PropertyKey, any>;

export type DefinePropertyValues<T> = (Partial<ThisObjectKeys<T>> | Partial<Omit<ThisObjectKeys<T>, "valueOf">>) & KeyableObject;

export type DefinePropertyGetter<T, K> = (this: T) => MaybeKeyReturnType<T, K>;

export type DefinePropertyGetters<T> = {
  [K in Keys<T>]: DefinePropertyGetter<T, K>
} | Record<PropertyKey, DefinePropertyGetter<T, any>>;
