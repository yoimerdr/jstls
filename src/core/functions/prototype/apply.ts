import {
  Instanceable,
  InstanceableType,
  InstanceMethodKeys,
  InstanceMethodParameters,
  InstanceMethodReturn
} from "@jstls/types/core";
import {ArrayLike} from "@jstls/types/core/array";
import {apply} from "@jstls/core/functions/apply";

export function protoapply<T extends Instanceable, P extends InstanceMethodKeys<T>>(cls: T, key: P | PropertyKey, instance: InstanceableType<T>, args: InstanceMethodParameters<T, P>): InstanceMethodReturn<T, P>;
export function protoapply<T extends ArrayConstructor, P extends InstanceMethodKeys<T>>(cls: T, key: P | PropertyKey, instance: ArrayLike, args: InstanceMethodParameters<T, P>): InstanceMethodReturn<T, P>;
export function protoapply<T extends Instanceable, P extends InstanceMethodKeys<T>>(cls: T, key: P, instance: InstanceableType<T>, args: InstanceMethodParameters<T, P>): InstanceMethodReturn<T, P> {
  return apply(cls.prototype[key], instance, arguments[3]);
}
