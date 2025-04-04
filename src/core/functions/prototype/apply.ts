import {
  Instanceable,
  InstanceableType,
  InstanceMethodKeys,
  InstanceMethodParameters,
  InstanceMethodReturn
} from "../../../types/core";
import {ArrayLike} from "../../../types/core/array";
import {apply} from "../apply";

export function protoapply<T extends Instanceable, P extends InstanceMethodKeys<T>>(cls: T, key: P | PropertyKey, instance: InstanceableType<T>, args: InstanceMethodParameters<T, P>): InstanceMethodReturn<T, P>;
export function protoapply<T extends ArrayConstructor, P extends InstanceMethodKeys<T>>(cls: T, key: P | PropertyKey, instance: ArrayLike, args: InstanceMethodParameters<T, P>): InstanceMethodReturn<T, P>;
export function protoapply<T extends Instanceable, P extends InstanceMethodKeys<T>>(cls: T, key: P, instance: InstanceableType<T>, args: InstanceMethodParameters<T, P>): InstanceMethodReturn<T, P> {
  return apply(cls.prototype[key], instance, arguments[3]);
}
