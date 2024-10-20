import {
  Instanceable,
  InstanceableParameters,
  InstanceableType,
  InstanceMethodKeys,
  InstanceMethodParameters,
  InstanceMethodReturn,
  SafeReturnType
} from "../../types/core";
import {apply} from "./apply";
import {ArrayLike} from "../../types/core/array";

export function constructor<T extends Instanceable>(cls: T, instance: InstanceableType<T>, ...args: InstanceableParameters<T>): SafeReturnType<InstanceableType<T>> {
  return protoapply(cls, "constructor", instance, <any>protoapply(Array, "slice", arguments, [2]))
}

export function protocall<T extends ArrayConstructor, P extends InstanceMethodKeys<T>>(cls: T, key: P | PropertyKey, instance: ArrayLike, ...args: InstanceMethodParameters<T, P>): InstanceMethodReturn<T, P>;
export function protocall<T extends Instanceable, P extends InstanceMethodKeys<T>>(cls: T, key: P | PropertyKey, instance: InstanceableType<T>, ...args: InstanceMethodParameters<T, P>): InstanceMethodReturn<T, P>;
export function protocall<T extends Instanceable, P extends InstanceMethodKeys<T>>(cls: T, key: P | PropertyKey, instance: InstanceableType<T>, ...args: InstanceMethodParameters<T, P>): InstanceMethodReturn<T, P> {
  return apply(cls.prototype[key], instance, protoapply(Array, "slice", arguments, [3]));
}


export function protoapply<T extends Instanceable, P extends InstanceMethodKeys<T>>(cls: T, key: P | PropertyKey, instance: InstanceableType<T>, args: InstanceMethodParameters<T, P>): InstanceMethodReturn<T, P>;
export function protoapply<T extends ArrayConstructor, P extends InstanceMethodKeys<T>>(cls: T, key: P | PropertyKey, instance: ArrayLike, args: InstanceMethodParameters<T, P>): InstanceMethodReturn<T, P>;
export function protoapply<T extends Instanceable, P extends InstanceMethodKeys<T>>(cls: T, key: P, instance: InstanceableType<T>, args: InstanceMethodParameters<T, P>): InstanceMethodReturn<T, P> {
  return apply(cls.prototype[key], instance, arguments[3]);
}
